// Flight pricing via the Amadeus Self-Service API. Free tier (test host).
// OAuth2 client-credentials: fetch a bearer token (cached in-isolate), then
// Flight Offers Search for a round trip, 2 adults, priced in USD — a 2-adult
// total that matches the engine's cost convention. Key-gated on
// AMADEUS_CLIENT_ID + AMADEUS_CLIENT_SECRET.
//
// ToS/caching note: the test host returns largely static data and is for
// development; short TTL + verify-before-booking. Production volume needs the
// production host (AMADEUS_BASE) and a re-read of Amadeus's terms.
import { cachedFetch, SourceError } from "../store.js";

const TTL = 60 * 60 * 6; // 6 hours — fares move
const DEFAULT_ORIGIN = "IND"; // the owner's home airport; override per query

function base(env) {
  return (env.AMADEUS_BASE || "https://test.api.amadeus.com").replace(/\/+$/, "");
}

// Bearer token cached per isolate; Amadeus tokens last ~30 min.
let tokenCache = { token: null, expires: 0 };

export function _resetTokenCache() { tokenCache = { token: null, expires: 0 }; } // test hook

async function getToken(env) {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expires > now + 5000) return tokenCache.token;
  const res = await fetch(`${base(env)}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.AMADEUS_CLIENT_ID,
      client_secret: env.AMADEUS_CLIENT_SECRET,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new SourceError("amadeus auth failed", { httpStatus: res.status });
  const data = JSON.parse(text);
  tokenCache = { token: data.access_token, expires: now + (data.expires_in || 1799) * 1000 };
  return tokenCache.token;
}

export function buildSearchParams(origin, dest, start, end) {
  return {
    originLocationCode: origin,
    destinationLocationCode: dest,
    departureDate: start,
    returnDate: end,
    adults: 2,
    currencyCode: "USD",
    max: 5,
  };
}

// Cheapest offers from a Flight Offers Search response. Pure — unit-tested.
export function distill(data) {
  const offers = ((data && data.data) || [])
    .map((o) => {
      const itins = o.itineraries || [];
      const stopsOf = (it) => Math.max(0, ((it && it.segments) || []).length - 1);
      return {
        price: Number(o.price && o.price.grandTotal),
        currency: (o.price && o.price.currency) || "USD",
        carrier: (o.validatingAirlineCodes || [])[0] || null,
        out_stops: itins[0] ? stopsOf(itins[0]) : null,
        return_stops: itins[1] ? stopsOf(itins[1]) : null,
      };
    })
    .filter((x) => !Number.isNaN(x.price))
    .sort((a, b) => a.price - b.price);
  return {
    count: offers.length,
    cheapest_total_2adults: offers[0] ? offers[0].price : null,
    currency: offers[0] ? offers[0].currency : "USD",
    offers: offers.slice(0, 3),
  };
}

export async function flights(env, info, ctx) {
  if (!env.AMADEUS_CLIENT_ID || !env.AMADEUS_CLIENT_SECRET) {
    return { configured: false, note: "set AMADEUS_CLIENT_ID + AMADEUS_CLIENT_SECRET to enable flight pricing" };
  }
  const dest = info.destAirport;
  if (!dest) return { applicable: false, note: "no destination airport for this trip" };
  const origin = ctx.origin || info.originAirport || DEFAULT_ORIGIN;

  const params = buildSearchParams(origin, dest, info.arrive, info.depart);
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])));
  const endpoint = `${base(env)}/v2/shopping/flight-offers?${qs}`;

  // init is a function: the token fetch is deferred to a cache miss only.
  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "amadeus",
    endpoint,
    params,
    ttl: TTL,
    trip: ctx.trip,
    requestedBy: ctx.requestedBy,
    fresh: ctx.fresh,
    init: async () => ({
      headers: { Authorization: `Bearer ${await getToken(env)}`, "User-Agent": "trip-planner-api/0.4" },
    }),
  });

  return {
    configured: true,
    cached,
    fetched_at,
    origin,
    destination: dest,
    window: { start: info.arrive, end: info.depart },
    adults: 2,
    ...distill(JSON.parse(raw || "{}")),
  };
}
