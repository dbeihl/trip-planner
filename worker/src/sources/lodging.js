// Lodging pricing via the Amadeus Hotel Search API (Self-Service). Two calls:
// list hotels in the gateway city (stable, cached 30d), then price a stay for
// the trip's dates (cached 6h). Distills to a representative nightly rate
// (median) and the cheapest, for a room of 2 adults — feeds the budget re-cost.
// Reuses the shared Amadeus token. Gateway-area rate, not the exact town.
import { cachedFetch } from "../store.js";
import { base, authInit, configured } from "./amadeus.js";

const OFFERS_TTL = 60 * 60 * 6; // 6 hours — hotel prices move
const LIST_TTL = 60 * 60 * 24 * 30; // 30 days — the set of hotels is stable
const MAX_HOTELS = 20;

export function nightsBetween(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

// Representative nightly rates from a Hotel Offers response. Pure — unit-tested.
export function distill(data, nights) {
  const entries = (data && data.data) || [];
  const nightly = [];
  for (const h of entries) {
    const offer = (h.offers || [])[0];
    const total = offer && offer.price ? Number(offer.price.total) : NaN;
    if (!Number.isNaN(total) && nights > 0) nightly.push(total / nights);
  }
  nightly.sort((a, b) => a - b);
  const round = (x) => (x == null ? null : Math.round(x));
  const median = nightly.length ? nightly[Math.floor((nightly.length - 1) / 2)] : null;
  return {
    hotels_priced: nightly.length,
    nightly_cheapest: round(nightly[0] ?? null),
    nightly_median: round(median),
    currency: "USD",
  };
}

async function hotelIds(env, cityCode, ctx) {
  const params = { cityCode, radius: 20, radiusUnit: "KM", hotelSource: "ALL" };
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])));
  const endpoint = `${base(env)}/v1/reference-data/locations/hotels/by-city?${qs}`;
  const { raw } = await cachedFetch(env, {
    source: "amadeus-hotels", endpoint, params, ttl: LIST_TTL,
    trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh, init: authInit(env),
  });
  const data = JSON.parse(raw || "{}");
  return (data.data || []).map((h) => h.hotelId).filter(Boolean).slice(0, MAX_HOTELS);
}

export async function lodging(env, info, ctx) {
  if (!configured(env)) {
    return { configured: false, note: "set AMADEUS_CLIENT_ID + AMADEUS_CLIENT_SECRET to enable lodging pricing" };
  }
  const city = info.cityCode;
  if (!city) return { applicable: false, note: "no city code for this trip" };

  const ids = await hotelIds(env, city, ctx);
  const nights = nightsBetween(info.arrive, info.depart);
  if (!ids.length) {
    return { configured: true, city, nights, hotels_priced: 0, note: "no hotels found for this city" };
  }

  const params = {
    hotelIds: ids.join(","),
    checkInDate: info.arrive,
    checkOutDate: info.depart,
    adults: 2,
    roomQuantity: 1,
    currency: "USD",
    bestRateOnly: true,
  };
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])));
  const endpoint = `${base(env)}/v3/shopping/hotel-offers?${qs}`;
  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "amadeus-lodging", endpoint, params, ttl: OFFERS_TTL,
    trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh, init: authInit(env),
  });

  return {
    configured: true,
    cached,
    fetched_at,
    city,
    gateway_area: true,
    window: { start: info.arrive, end: info.depart },
    nights,
    adults: 2,
    ...distill(JSON.parse(raw || "{}"), nights),
  };
}
