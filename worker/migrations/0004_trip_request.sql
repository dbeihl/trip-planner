-- Trip intake requests (TRIP-INTAKE-PLAN.md Phase 2): one row per POST
-- /api/trips. Backs the per-traveler and global quotas and the status
-- endpoint; the GitHub issue is the human-visible ledger, this is the
-- machine-visible one.
CREATE TABLE IF NOT EXISTS trip_request (
  id            TEXT PRIMARY KEY,       -- uuid
  email         TEXT NOT NULL,          -- requester (verified Access identity)
  slug          TEXT NOT NULL,          -- derived trip slug (unique per request)
  brief_json    TEXT NOT NULL,          -- the exact validated request payload
  issue_number  INTEGER,                -- the GitHub ledger issue
  status        TEXT NOT NULL,          -- 'queued'|'generating'|'pr-open'|'live'|'failed'
  created_at    INTEGER NOT NULL        -- epoch seconds
);
CREATE INDEX IF NOT EXISTS idx_trip_request_time ON trip_request (created_at DESC);
