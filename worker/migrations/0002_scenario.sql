-- Saved per-traveler planner selections ("scenarios"): one row per
-- (trip, traveler). The snapshot is the same JSON the planner keeps in
-- localStorage; the Worker stores it opaquely and only enforces size
-- and trip validity.
CREATE TABLE IF NOT EXISTS scenario (
  trip_id       TEXT NOT NULL,
  email         TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  updated_at    INTEGER NOT NULL,  -- epoch seconds
  PRIMARY KEY (trip_id, email)
);
