// Flight pricing via Duffel (primary) with SerpAPI Google Flights as the
// fallback provider. Replaces the Amadeus Self-Service adapter (portal
// decommissioned 2026-07-17). Response shape is unchanged — a round trip for
// 2 adults in USD, matching the engine's 2-adult cost convention — so the
// context panel, the re-plan estimate, and the client need no changes.
//
// Duffel: POST an offer request with both slices; `total_amount` is already
// the all-passenger (2-adult) total. The key rides in a header, never in the
// stored URL. Test-mode keys (duffel_test_*) return synthetic offers — the
// response says so. City IATA codes (TYO, SEL, ROM…) are accepted.
//
// SerpAPI: GET google_flights with adults=2 — Google Flights prices are the
// total for all requested passengers. The api_key query param is redacted by
// store.js before the endpoint is logged.
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 6; // 6 hours — fares move
const DEFAULT_ORIGIN = "IND"; // the owner's home airport; override per query
const DUFFEL_BASE = "https://api.duffel.com";
const SERPAPI_BASE = "https://serpapi.com";

export function flightsProvider(env) {
  if (env.DUFFEL_API_KEY) return "duffel";
  if (env.SERPAPI_KEY) return "serpapi";
  return null;
}

const stopsOf = (segments) => Math.max(0, (segments || []).length - 1);

// Shared tail: sort by price, emit the stable response shape.
function shape(offers) {
  const ok = offers.filter((x) => !Number.isNaN(x.price)).sort((a, b) => a.price - b.price);
  return {
    count: ok.length,
    cheapest_total_2adults: ok[0] ? ok[0].price : null,
    currency: ok[0] ? ok[0].currency : "USD",
    offers: ok.slice(0, 3),
  };
}

// Cheapest offers from a Duffel offer_requests response. Pure — unit-tested.
export function distillDuffel(data) {
  const offers = (((data || {}).data || {}).offers || []).map((o) => ({
    price: Number(o.total_amount),
    currency: o.total_currency || "USD",
    carrier: (o.owner && o.owner.iata_code) || null,
    out_stops: o.slices && o.slices[0] ? stopsOf(o.slices[0].segments) : null,
    return_stops: o.slices && o.slices[1] ? stopsOf(o.slices[1].segments) : null,
  }));
  return shape(offers);
}

// Cheapest offers from a SerpAPI google_flights response. Pure — unit-tested.
// Google returns the outbound legs with a whole-round-trip price, so
// return_stops is unknown (null).
export function distillSerpFlights(data) {
  const d = data || {};
  const offers = [...(d.best_flights || []), ...(d.other_flights || [])].map((f) => ({
    price: Number(f.price),
    currency: "USD",
    carrier: f.flights && f.flights[0] ? f.flights[0].airline || null : null,
    out_stops: f.flights ? stopsOf(f.flights) : null,
    return_stops: null,
  }));
  return shape(offers);
}

export async function flights(env, info, ctx) {
  const provider = flightsProvider(env);
  if (!provider) {
    return { configured: false, note: "set DUFFEL_API_KEY (or SERPAPI_KEY) to enable flight pricing" };
  }
  const dest = info.destAirport;
  if (!dest) return { applicable: false, note: "no destination airport for this trip" };
  const origin = ctx.origin || info.originAirport || DEFAULT_ORIGIN;

  const common = { ttl: TTL, trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh };
  let pull, distilled, note;

  if (provider === "duffel") {
    // params carry no secrets — the key is a header, resolved by fetch only.
    const params = { provider: "duffel", origin, dest, start: info.arrive, end: info.depart, adults: 2 };
    pull = await cachedFetch(env, {
      source: "duffel",
      endpoint: `${DUFFEL_BASE}/air/offer_requests?return_offers=true`,
      params,
      ...common,
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.DUFFEL_API_KEY}`,
          "Duffel-Version": "v2",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          data: {
            slices: [
              { origin, destination: dest, departure_date: info.arrive },
              { origin: dest, destination: origin, departure_date: info.depart },
            ],
            passengers: [{ type: "adult" }, { type: "adult" }],
            cabin_class: "economy",
          },
        }),
      },
    });
    distilled = distillDuffel(JSON.parse(pull.raw || "{}"));
    if (String(env.DUFFEL_API_KEY).startsWith("duffel_test"))
      note = "test-mode fares (synthetic Duffel data) — verify before booking";
  } else {
    const params = { provider: "serpapi", origin, dest, start: info.arrive, end: info.depart, adults: 2 };
    const qs = new URLSearchParams({
      engine: "google_flights",
      departure_id: origin,
      arrival_id: dest,
      outbound_date: info.arrive,
      return_date: info.depart,
      adults: "2",
      currency: "USD",
      api_key: env.SERPAPI_KEY, // redacted by store.js before logging
    });
    pull = await cachedFetch(env, {
      source: "serpapi-flights",
      endpoint: `${SERPAPI_BASE}/search.json?${qs}`,
      params,
      ...common,
    });
    distilled = distillSerpFlights(JSON.parse(pull.raw || "{}"));
  }

  return {
    configured: true,
    provider,
    cached: pull.cached,
    fetched_at: pull.fetched_at,
    origin,
    destination: dest,
    window: { start: info.arrive, end: info.depart },
    adults: 2,
    ...(note ? { note } : {}),
    ...distilled,
  };
}
