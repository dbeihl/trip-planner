// data_pull: the provenance log that doubles as a read-through cache.
// Every external API call in the Worker goes through cachedFetch(), so it is
// logged exactly once and reused within its TTL.

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Stable dedup key: source + sha256 of params serialized with sorted keys.
export async function dedupKey(source, params) {
  const sorted = Object.fromEntries(Object.keys(params).sort().map((k) => [k, params[k]]));
  return `${source}:${await sha256Hex(JSON.stringify(sorted))}`;
}

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
      row.id, row.source, row.endpoint, row.dedup_key, row.params_json,
      row.response_json, row.status, row.http_status, row.fetched_at,
      row.ttl_seconds, row.cost_usd, row.trip_id, row.requested_by,
    )
    .run();
}

// Strip common secret query params before an endpoint is written to the log.
function redact(endpoint) {
  return endpoint.replace(/([?&](?:apikey|api_key|key|token)=)[^&]+/gi, "$1REDACTED");
}

class SourceError extends Error {
  constructor(message, { status = 502, httpStatus, detail } = {}) {
    super(message);
    this.status = status;
    this.httpStatus = httpStatus;
    this.detail = detail;
  }
}

// Fetch `endpoint`, logging the pull to data_pull, or return a fresh cached
// row. `params` must NOT contain secrets (they land in the log); the fetch URL
// may, and is redacted before storage. Returns { cached, raw, fetched_at,
// http_status }. Throws SourceError (with .status for the HTTP response) on
// unreachable or non-2xx sources — the failure is still logged.
export async function cachedFetch(env, opts) {
  const { source, endpoint, params, ttl, trip, requestedBy, fresh = false, cost = 0, init } = opts;
  const key = await dedupKey(source, params);

  if (!fresh) {
    const hit = await cacheLookup(env, key);
    if (hit) {
      return { cached: true, raw: hit.response_json, fetched_at: hit.fetched_at, http_status: hit.http_status };
    }
  }

  const base = {
    id: crypto.randomUUID(),
    source,
    endpoint: redact(endpoint),
    dedup_key: key,
    params_json: JSON.stringify(params),
    fetched_at: Math.floor(Date.now() / 1000),
    ttl_seconds: ttl,
    cost_usd: cost,
    trip_id: trip || null,
    requested_by: requestedBy,
  };

  let res, body, httpStatus;
  try {
    res = await fetch(endpoint, init || { headers: { "User-Agent": "trip-planner-api/0.2" } });
    httpStatus = res.status;
    body = await res.text();
  } catch (err) {
    await insertPull(env, { ...base, response_json: JSON.stringify({ error: String(err) }), status: "error", http_status: 0 });
    throw new SourceError(`source unreachable: ${source}`, { detail: String(err) });
  }

  if (!res.ok) {
    await insertPull(env, { ...base, response_json: body, status: "error", http_status: httpStatus });
    throw new SourceError(`source error: ${source}`, { httpStatus });
  }

  await insertPull(env, { ...base, response_json: body, status: "ok", http_status: httpStatus });
  return { cached: false, raw: body, fetched_at: base.fetched_at, http_status: httpStatus };
}

export { SourceError };
