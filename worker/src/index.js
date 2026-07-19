// Trip planner research back end.
//
// Phase 1: the spine — Access (auth) -> fetch a free data source -> log every
// pull to D1 (data_pull), read-through cached.
// Phase 2: three more free sources (holidays, events, advisories) on the same
// spine, plus /api/context aggregating them into a "what's happening that
// week" panel.
// Phase 3: the AI layer — /api/replan asks Claude to compare a proposed window
// to the trip's original and explain what changed.
// Phase 4: flight pricing via Amadeus Self-Service (/api/flights), folded into
// the context panel and the re-plan so the briefing is fare-aware.
//
// Routes (all /api/* require an authenticated caller):
//   GET /  |  /api/health   -> service status, known trips + sources
//   GET /api/weather        -> seasonality (?trip=<slug> or ?lat=&lon=&start=&end=)
//   GET /api/holidays       -> public holidays in the window (?trip=<slug>)
//   GET /api/events         -> events near the gateway (?trip=<slug>)
//   GET /api/advisories     -> U.S. State Dept advisory level (?trip=<slug>)
//   GET /api/flights        -> Amadeus round-trip fares (?trip=<slug>&origin=<IATA>)
//   GET /api/lodging        -> Amadeus nightly hotel rate for the window (?trip=<slug>)
//   GET /api/context        -> all of the above for one trip, in parallel
//   GET /api/replan         -> AI date-change briefing (?trip=<slug>&start=&end=)
//   ...&fresh=1             -> bypass the cache on any data route

import { TRIPS } from "./trips.js";
import { verifyAccess } from "./access.js";
import { SourceError } from "./store.js";
import { weather } from "./sources/weather.js";
import { holidays } from "./sources/holidays.js";
import { events } from "./sources/events.js";
import { advisories } from "./sources/advisories.js";
import { flights } from "./sources/flights.js";
import { lodging } from "./sources/lodging.js";
import { replan } from "./sources/replan.js";

const SOURCES = ["open-meteo", "nager", "ticketmaster", "state-advisory", "amadeus", "amadeus-hotels", "amadeus-lodging"];

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || "*";
  const h = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, X-Dev-User",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
  // Credentialed requests (the planner UI sends the Access cookie) require a
  // specific origin — not "*" — plus this header.
  if (origin !== "*") h["Access-Control-Allow-Credentials"] = "true";
  return h;
}

function json(data, { status = 200, env } = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(env) },
  });
}

// Resolve the trip context from a slug, or synthesize one from explicit query
// params (weather only). Returns { info, error }.
function resolveInfo(q) {
  const slug = q.get("trip");
  if (slug) {
    const t = TRIPS[slug];
    if (!t) return { error: { msg: `unknown trip "${slug}"`, known: Object.keys(TRIPS) } };
    return { slug, info: t };
  }
  const lat = q.get("lat"), lon = q.get("lon"), start = q.get("start"), end = q.get("end");
  if (lat != null && lon != null && start && end) {
    return { slug: null, info: { lat, lon, label: null, arrive: start, depart: end, country: null } };
  }
  return { error: { msg: "need ?trip=<slug> or ?lat=&lon=&start=&end= (ISO YYYY-MM-DD)" } };
}

// Wrap a source call so a SourceError becomes an HTTP response.
async function runSource(fn, env, info, ctx, extra = {}) {
  try {
    return { ok: true, body: await fn(env, info, ctx) };
  } catch (err) {
    if (err instanceof SourceError) {
      return { ok: false, status: err.status, body: { error: err.message, http_status: err.httpStatus, detail: err.detail, ...extra } };
    }
    throw err;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (url.pathname === "/" || url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "trip-planner-api",
        phase: 4,
        access: env.CF_ACCESS_TEAM_DOMAIN ? "enforced" : "dev-mode",
        sources: SOURCES,
        events_configured: !!env.TICKETMASTER_API_KEY,
        flights_configured: !!(env.AMADEUS_CLIENT_ID && env.AMADEUS_CLIENT_SECRET),
        replan_configured: !!env.ANTHROPIC_API_KEY,
        replan_model: env.CLAUDE_MODEL || "claude-haiku-4-5",
        trips: Object.keys(TRIPS),
      }, { env });
    }

    // Everything below requires an authenticated caller.
    const auth = await verifyAccess(request, env);
    if (!auth) return json({ error: "unauthorized" }, { status: 401, env });

    const q = url.searchParams;
    const ctx = { trip: q.get("trip") || null, requestedBy: auth.email, fresh: q.get("fresh") === "1", origin: q.get("origin") || null };

    // Single-source data routes.
    const routes = {
      "/api/weather": weather,
      "/api/holidays": holidays,
      "/api/events": events,
      "/api/advisories": advisories,
      "/api/flights": flights,
      "/api/lodging": lodging,
    };
    if (routes[url.pathname]) {
      const { info, error } = resolveInfo(q);
      if (error) return json({ error: error.msg, ...(error.known && { known: error.known }) }, { status: 400, env });
      const r = await runSource(routes[url.pathname], env, info, ctx);
      return json(r.body, { status: r.ok ? 200 : r.status, env });
    }

    // Aggregate: the "what's happening that week" panel.
    if (url.pathname === "/api/context") {
      const { slug, info, error } = resolveInfo(q);
      if (error) return json({ error: error.msg, ...(error.known && { known: error.known }) }, { status: 400, env });
      const [w, h, e, a, f, l] = await Promise.all([
        runSource(weather, env, info, ctx),
        runSource(holidays, env, info, ctx),
        runSource(events, env, info, ctx),
        runSource(advisories, env, info, ctx),
        runSource(flights, env, info, ctx),
        runSource(lodging, env, info, ctx),
      ]);
      return json({
        trip: slug,
        gateway: info.label,
        dates: { start: info.arrive, end: info.depart },
        weather: w.body,
        holidays: h.body,
        events: e.body,
        advisories: a.body,
        flights: f.body,
        lodging: l.body,
      }, { env });
    }

    // AI date-change briefing (Phase 3). Needs a baseline trip + new dates.
    if (url.pathname === "/api/replan") {
      const slug = q.get("trip");
      const info = slug ? TRIPS[slug] : null;
      if (!info) return json({ error: "need ?trip=<slug>", known: Object.keys(TRIPS) }, { status: 400, env });
      const start = q.get("start"), end = q.get("end");
      if (!start || !end) return json({ error: "need &start=&end= (ISO YYYY-MM-DD) — the proposed dates" }, { status: 400, env });
      try {
        return json(await replan(env, info, ctx, { start, end }), { env });
      } catch (err) {
        return json({ error: err.message || "replan failed", http_status: err.httpStatus }, { status: err.status || 500, env });
      }
    }

    return json({ error: "not found" }, { status: 404, env });
  },
};
