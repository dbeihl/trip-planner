// Lodging pricing via SerpAPI Google Hotels (replacing the Amadeus Hotel
// Search adapter — portal decommissioned 2026-07-17). One call prices the
// gateway city for the trip's dates; distilled to a representative nightly
// rate (median) and the cheapest, for a room of 2 adults — the same shape the
// budget re-cost consumed from Amadeus. Gateway-area rate, not the exact town.
// The api_key query param is redacted by store.js before the endpoint is
// logged.
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 24; // 24 hours — nightly rates move slower than fares
const SERPAPI_BASE = "https://serpapi.com";

export function nightsBetween(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

// Representative nightly rates from a google_hotels response. Pure — unit-tested.
export function distillSerpHotels(data) {
  const nightly = ((data && data.properties) || [])
    .map((p) => p.rate_per_night && p.rate_per_night.extracted_lowest)
    .filter((x) => typeof x === "number" && x > 0)
    .sort((a, b) => a - b);
  const round = (x) => (x == null ? null : Math.round(x));
  const median = nightly.length ? nightly[Math.floor((nightly.length - 1) / 2)] : null;
  return {
    hotels_priced: nightly.length,
    nightly_cheapest: round(nightly[0] ?? null),
    nightly_median: round(median),
    currency: "USD",
  };
}

export async function lodging(env, info, ctx) {
  if (!env.SERPAPI_KEY) {
    return { configured: false, note: "set SERPAPI_KEY to enable lodging pricing" };
  }
  const city = info.label;
  if (!city) return { applicable: false, note: "no gateway city for this trip" };
  const nights = nightsBetween(info.arrive, info.depart);

  const params = { provider: "serpapi", city, start: info.arrive, end: info.depart, adults: 2 };
  const qs = new URLSearchParams({
    engine: "google_hotels",
    q: `${city} hotels`,
    check_in_date: info.arrive,
    check_out_date: info.depart,
    adults: "2",
    currency: "USD",
    api_key: env.SERPAPI_KEY, // redacted by store.js before logging
  });
  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "serpapi-hotels",
    endpoint: `${SERPAPI_BASE}/search.json?${qs}`,
    params,
    ttl: TTL,
    trip: ctx.trip,
    requestedBy: ctx.requestedBy,
    fresh: ctx.fresh,
  });

  return {
    configured: true,
    provider: "serpapi",
    cached,
    fetched_at,
    city,
    gateway_area: true,
    window: { start: info.arrive, end: info.depart },
    nights,
    adults: 2,
    ...distillSerpHotels(JSON.parse(raw || "{}")),
  };
}
