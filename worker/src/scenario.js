// Saved per-traveler planner selections ("scenarios"). GET returns the
// caller's snapshot plus everyone else's for the trip (so the planner can
// show "Suzanne's picks"); PUT upserts the caller's, keyed by their
// authenticated Access email. Snapshots are opaque client JSON.

const MAX_SNAPSHOT_BYTES = 100 * 1024;

// "suzanne@example.com" -> "Suzanne"
function displayName(email) {
  const local = String(email || "").split("@")[0];
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : String(email);
}

export async function getScenarios(env, slug, email) {
  const rows =
    (
      await env.DB.prepare(
        "SELECT email, snapshot_json, updated_at FROM scenario WHERE trip_id = ?1",
      )
        .bind(slug)
        .all()
    ).results || [];
  let mine = null;
  const others = [];
  for (const r of rows) {
    let snapshot;
    try {
      snapshot = JSON.parse(r.snapshot_json);
    } catch {
      continue; // unreadable row — skip rather than break the panel
    }
    if (r.email === email) {
      mine = { snapshot, updated_at: r.updated_at };
    } else {
      others.push({
        email: r.email,
        name: displayName(r.email),
        snapshot,
        updated_at: r.updated_at,
      });
    }
  }
  others.sort((a, b) => b.updated_at - a.updated_at);
  return { trip: slug, mine, others };
}

export async function putScenario(env, slug, email, body) {
  if (body.length > MAX_SNAPSHOT_BYTES)
    return { error: "snapshot too large", status: 413 };
  let snap;
  try {
    snap = JSON.parse(body);
  } catch {
    return { error: "body must be JSON", status: 400 };
  }
  if (!snap || typeof snap !== "object" || Array.isArray(snap))
    return { error: "body must be a JSON object", status: 400 };
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO scenario (trip_id, email, snapshot_json, updated_at) VALUES (?1, ?2, ?3, ?4) " +
      "ON CONFLICT(trip_id, email) DO UPDATE SET snapshot_json = ?3, updated_at = ?4",
  )
    .bind(slug, email, JSON.stringify(snap), now)
    .run();
  return { ok: true, updated_at: now };
}
