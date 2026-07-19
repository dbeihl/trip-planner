// Trip planner research back end — Phase 1.
//
// Proves the spine end-to-end: Cloudflare Access (auth) -> fetch a free data
// source (Open-Meteo weather seasonality) -> log every pull to D1 (data_pull),
// read-through cached by a dedup key. No AI yet; that's Phase 3.
//
// Routes:
//   GET /            -> health
//   GET /api/health  -> health
//   GET /api/weather -> seasonality for a trip's gateway city (logs the pull)
//        ?trip=<slug>                    (uses the trip's dates + coords)
//        ?lat=..&lon=..&start=..&end=..  (explicit; ISO YYYY-MM-DD)
//        &fresh=1                        (bypass cache)

import { TRIPS } from "./trips.js";
import { verifyAccess } from "./access.js";

const WEATHER_TTL = 60 * 60 * 24 * 30; // 30 days — climatology barely moves

// ---- small helpers -------------------------------------------------------

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Stable dedup key: source + sha256 of params serialized with sorted keys.
async function dedupKey(source, params) {
  const sorted = Object.fromEntries(Object.keys(params).sort().map((k) => [k, params[k]]));
  return `${source}:${await sha256Hex(JSON.stringify(sorted))}`;
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Dev-User",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  };
}

function json(data, { status = 200, env } = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(env) },
  });
}

// ---- data_pull: the provenance log + read-through cache ------------------

async function cacheLookup(env, key) {
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    `SELECT * FROM data_pull
       WHERE dedup_key = ?1 AND status = 'ok' AND (fetched_at + ttl_seconds) > ?2
       ORDER BY fetched_at DESC LIMIT 1`,
  )
    .bind(key, now)
    .first();
  return row || null;
}

async function insertPull(env, row) {
  await env.DB.prepare(
    `INSERT INTO data_pull
       (id, source, endpoint, dedup_key, params_json, response_json,
        status, http_status, fetched_at, ttl_seconds, cost_usd, trip_id, requested_by)
     VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13)`,
  )
    .bind(
      row.id,
      row.source,
      row.endpoint,
      row.dedup_key,
      row.params_json,
      row.response_json,
      row.status,
      row.http_status,
      row.fetched_at,
      row.ttl_seconds,
      row.cost_usd,
      row.trip_id,
      row.requested_by,
    )
    .run();
}

// ---- Open-Meteo seasonality ---------------------------------------------

// "Is this a good week to go?" — answered from the same calendar window one
// year earlier (the archive holds only past dates), a solid climatology proxy.
function priorYear(iso) {
  const [y, m, d] = iso.split("-");
  return `${Number(y) - 1}-${m}-${d}`;
}

function distill(archive) {
  const daily = (archive && archive.daily) || {};
  const hi = daily.temperature_2m_max || [];
  const lo = daily.temperature_2m_min || [];
  const pr = daily.precipitation_sum || [];
  const n = hi.length;
  const mean = (a) => (a.length ? a.reduce((s, x) => s + (x ?? 0), 0) / a.length : null);
  const round = (x) => (x == null ? null : Math.round(x * 10) / 10);
  return {
    days: n,
    avg_high_c: round(mean(hi)),
    avg_low_c: round(mean(lo)),
    precip_total_mm: round(pr.reduce((s, x) => s + (x ?? 0), 0)),
    rainy_days: pr.filter((x) => (x ?? 0) > 1).length,
  };
}

async function handleWeather(request, env, auth) {
  const url = new URL(request.url);
  const q = url.searchParams;

  // Resolve coordinates + window from a trip slug or explicit params.
  const slug = q.get("trip");
  const trip = slug ? TRIPS[slug] : null;
  if (slug && !trip) {
    return json({ error: `unknown trip "${slug}"`, known: Object.keys(TRIPS) }, { status: 400, env });
  }
  const lat = q.get("lat") ?? trip?.lat;
  const lon = q.get("lon") ?? trip?.lon;
  const start = q.get("start") ?? trip?.arrive;
  const end = q.get("end") ?? trip?.depart;
  if (lat == null || lon == null || !start || !end) {
    return json(
      { error: "need ?trip=<slug> or ?lat=&lon=&start=&end= (ISO YYYY-MM-DD)" },
      { status: 400, env },
    );
  }

  const params = {
    latitude: Number(lat),
    longitude: Number(lon),
    start_date: priorYear(start),
    end_date: priorYear(end),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto",
  };
  const source = "open-meteo";
  const key = await dedupKey(source, params);

  // Read-through cache.
  if (q.get("fresh") !== "1") {
    const hit = await cacheLookup(env, key);
    if (hit) {
      return json(
        {
          cached: true,
          fetched_at: hit.fetched_at,
          trip: slug || null,
          gateway: trip?.label || null,
          window: { start: params.start_date, end: params.end_date, note: "prior-year climatology" },
          seasonality: distill(JSON.parse(hit.response_json || "{}")),
        },
        { env },
      );
    }
  }

  // Miss — fetch, log the pull (success or failure), return.
  const qs = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    start_date: params.start_date,
    end_date: params.end_date,
    daily: params.daily,
    timezone: params.timezone,
  });
  const endpoint = `https://archive-api.open-meteo.com/v1/archive?${qs}`;

  const base = {
    id: crypto.randomUUID(),
    source,
    endpoint,
    dedup_key: key,
    params_json: JSON.stringify(params),
    fetched_at: Math.floor(Date.now() / 1000),
    ttl_seconds: WEATHER_TTL,
    cost_usd: 0,
    trip_id: slug || null,
    requested_by: auth.email,
  };

  let res, body, httpStatus;
  try {
    res = await fetch(endpoint, { headers: { "User-Agent": "trip-planner-api/0.1" } });
    httpStatus = res.status;
    body = await res.text();
  } catch (err) {
    await insertPull(env, {
      ...base,
      response_json: JSON.stringify({ error: String(err) }),
      status: "error",
      http_status: 0,
    });
    return json({ error: "weather source unreachable", detail: String(err) }, { status: 502, env });
  }

  if (!res.ok) {
    await insertPull(env, { ...base, response_json: body, status: "error", http_status: httpStatus });
    return json({ error: "weather source error", http_status: httpStatus }, { status: 502, env });
  }

  await insertPull(env, { ...base, response_json: body, status: "ok", http_status: httpStatus });

  return json(
    {
      cached: false,
      fetched_at: base.fetched_at,
      trip: slug || null,
      gateway: trip?.label || null,
      window: { start: params.start_date, end: params.end_date, note: "prior-year climatology" },
      seasonality: distill(JSON.parse(body)),
    },
    { env },
  );
}

// ---- entrypoint ----------------------------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (url.pathname === "/" || url.pathname === "/api/health") {
      return json(
        {
          ok: true,
          service: "trip-planner-api",
          phase: 1,
          access: env.CF_ACCESS_TEAM_DOMAIN ? "enforced" : "dev-mode",
          trips: Object.keys(TRIPS),
        },
        { env },
      );
    }

    // Everything below requires an authenticated caller.
    const auth = await verifyAccess(request, env);
    if (!auth) return json({ error: "unauthorized" }, { status: 401, env });

    if (url.pathname === "/api/weather") {
      return handleWeather(request, env, auth);
    }

    return json({ error: "not found" }, { status: 404, env });
  },
};
