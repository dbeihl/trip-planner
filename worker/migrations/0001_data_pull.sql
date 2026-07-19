-- Phase 1 schema: one row per external API call, ever.
-- Doubles as the provenance log and the read-through cache (see AI-RESEARCH-PLAN.md).
CREATE TABLE IF NOT EXISTS data_pull (
  id            TEXT PRIMARY KEY,          -- uuid
  source        TEXT NOT NULL,             -- 'open-meteo' | 'ticketmaster' | 'amadeus' ...
  endpoint      TEXT NOT NULL,             -- which call
  dedup_key     TEXT NOT NULL,             -- source + sha256(sorted params) — the cache key
  params_json   TEXT NOT NULL,             -- exact request params
  response_json TEXT,                      -- raw body (the provenance record)
  status        TEXT NOT NULL,             -- 'ok' | 'error'
  http_status   INTEGER,
  fetched_at    INTEGER NOT NULL,          -- epoch seconds
  ttl_seconds   INTEGER NOT NULL,          -- weather ~30d, fares ~6h, advisories ~1d
  cost_usd      REAL DEFAULT 0,            -- if the source meters
  trip_id       TEXT,                      -- which trip triggered it
  requested_by  TEXT                       -- which of the users (Access email)
);

-- Read path: most recent fresh row for a dedup key.
CREATE INDEX IF NOT EXISTS idx_pull_lookup ON data_pull (dedup_key, fetched_at DESC);
