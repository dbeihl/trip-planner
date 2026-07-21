-- The daily cron turns data_pull into a per-trip time series; this index
-- serves the "two newest pulls per (trip, source)" reads behind /api/changes.
-- (0002_scenario.sql lands on a separate branch — numbering skips it here on
-- purpose; migrations are independent and apply in filename order.)
CREATE INDEX IF NOT EXISTS idx_pull_history
  ON data_pull (trip_id, source, fetched_at DESC);
