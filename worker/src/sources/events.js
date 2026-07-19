// Events & festivals via the Ticketmaster Discovery API v2. Free tier: 5,000
// calls/day, 5 req/s. Requires TICKETMASTER_API_KEY (a secret) — without it the
// endpoint reports itself unconfigured rather than failing. The apikey is kept
// out of the logged params and redacted from the stored endpoint (see store.js).
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 6; // 6 hours — event listings shift

export function distill(data) {
  const events = (data && data._embedded && data._embedded.events) || [];
  return events.map((e) => ({
    name: e.name,
    date: e.dates?.start?.localDate,
    time: e.dates?.start?.localTime || null,
    venue: e._embedded?.venues?.[0]?.name || null,
    url: e.url || null,
  }));
}

export async function events(env, info, ctx) {
  const key = env.TICKETMASTER_API_KEY;
  if (!key) {
    return { configured: false, note: "set TICKETMASTER_API_KEY to enable events" };
  }

  const startDateTime = `${info.arrive}T00:00:00Z`;
  const endDateTime = `${info.depart}T23:59:59Z`;
  // Params for the log/cache key — no secret here.
  const params = {
    latlong: `${info.lat},${info.lon}`,
    radius: 25,
    unit: "miles",
    startDateTime,
    endDateTime,
    size: 20,
    sort: "date,asc",
  };
  const qs = new URLSearchParams({
    apikey: key,
    latlong: params.latlong,
    radius: String(params.radius),
    unit: params.unit,
    startDateTime,
    endDateTime,
    size: String(params.size),
    sort: params.sort,
  });
  const endpoint = `https://app.ticketmaster.com/discovery/v2/events.json?${qs}`;

  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "ticketmaster", endpoint, params, ttl: TTL,
    trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh,
  });
  const items = distill(JSON.parse(raw || "{}"));
  return {
    configured: true,
    cached,
    fetched_at,
    gateway: info.label,
    window: { start: info.arrive, end: info.depart },
    count: items.length,
    events: items,
  };
}
