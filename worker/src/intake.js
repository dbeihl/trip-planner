// Trip intake (TRIP-INTAKE-PLAN.md Phase 2): POST /api/trips takes a brief
// from an allowlisted traveler, enforces quotas, opens a GitHub issue as the
// request ledger, and fires repository_dispatch so the generation Action
// takes over. No AI here — the Worker's whole job is auth → ledger → dispatch.
// The brief's shape mirrors what the Phase 3 generator will consume.
import { TRIPS } from "./trips.js";

const GITHUB_API = "https://api.github.com";

// Provisional quotas (see the plan's Decisions): the global monthly cap is
// what actually protects the SerpAPI free tier once real generation lands.
export const QUOTAS = { perUserPerDay: 2, globalPerMonth: 10 };

const DAY = 86400;
const MONTH = 30 * DAY;

const isIso = (s) =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

// Pure: check the request payload shape. Returns { error } or { brief } with
// only the known fields kept (nothing user-controlled passes through raw).
export function validateBrief(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { error: "body must be a JSON object" };
  const { destination, arrive, depart, travelers, wishes, origin } = body;
  if (typeof destination !== "string" || !destination.trim() || destination.length > 80)
    return { error: "destination must be a non-empty string (max 80 chars)" };
  if (!isIso(arrive) || !isIso(depart))
    return { error: "arrive/depart must be ISO dates (YYYY-MM-DD)" };
  if (Date.parse(depart) <= Date.parse(arrive))
    return { error: "depart must be after arrive" };
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 8)
    return { error: "travelers must be an integer 1–8" };
  if (wishes != null && (typeof wishes !== "string" || wishes.length > 2000))
    return { error: "wishes must be a string (max 2000 chars)" };
  if (origin != null && (typeof origin !== "string" || origin.length > 8))
    return { error: "origin must be a short airport code" };
  return {
    brief: {
      destination: destination.trim(),
      arrive,
      depart,
      travelers,
      ...(wishes ? { wishes: wishes.trim() } : {}),
      ...(origin ? { origin: origin.trim().toUpperCase() } : {}),
    },
  };
}

// Pure: derive a slug that never collides with an existing trip or pending
// request (Decisions: new slug per request — the pipeline never overwrites).
// First "Portugal" → portugal; a repeat gets the month-year suffix
// (portugal-nov-2028); still taken → numeric suffix.
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export function deriveSlug(destination, arrive, taken) {
  const base =
    destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "trip";
  if (!taken.has(base)) return base;
  const d = new Date(`${arrive}T00:00:00Z`);
  const dated = `${base}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
  if (!taken.has(dated)) return dated;
  for (let i = 2; ; i++) if (!taken.has(`${dated}-${i}`)) return `${dated}-${i}`;
}

async function countSince(env, since, email) {
  const row = email
    ? await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM trip_request WHERE email = ?1 AND created_at > ?2",
      )
        .bind(email, since)
        .first()
    : await env.DB.prepare("SELECT COUNT(*) AS n FROM trip_request WHERE created_at > ?1")
        .bind(since)
        .first();
  return (row && row.n) || 0;
}

export async function checkQuota(env, email, now) {
  if ((await countSince(env, now - DAY, email)) >= QUOTAS.perUserPerDay)
    return { error: `daily limit reached (${QUOTAS.perUserPerDay} requests/day)`, status: 429 };
  if ((await countSince(env, now - MONTH, null)) >= QUOTAS.globalPerMonth)
    return { error: `monthly generation budget exhausted (${QUOTAS.globalPerMonth}/month)`, status: 429 };
  return null;
}

async function gh(env, method, path, body) {
  const res = await fetch(GITHUB_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${env.GITHUB_INTAKE_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "trip-planner-intake",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`GitHub ${method} ${path} failed: ${res.status}`);
  return res.status === 204 ? null : res.json();
}

// POST /api/trips. Returns { status, body } for the router.
export async function createIntake(env, email, rawBody) {
  if (!env.GITHUB_INTAKE_TOKEN)
    return {
      status: 503,
      body: { configured: false, note: "set GITHUB_INTAKE_TOKEN to enable trip intake" },
    };
  const repo = env.GITHUB_REPO || "dbeihl/trip-planner";

  // Allowlist is deliberate opt-in: unset means nobody can create, even
  // though Access already authenticated them.
  const creators = (env.TRIP_CREATORS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!creators.includes(String(email).toLowerCase()))
    return { status: 403, body: { error: "not on the trip-creator allowlist" } };

  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: { error: "body must be JSON" } };
  }
  const { brief, error } = validateBrief(parsed);
  if (error) return { status: 400, body: { error } };

  const now = Math.floor(Date.now() / 1000);
  const quota = await checkQuota(env, email, now);
  if (quota) return { status: quota.status, body: { error: quota.error } };

  const pending =
    (await env.DB.prepare("SELECT slug FROM trip_request WHERE status != 'failed'").all())
      .results || [];
  const taken = new Set([...Object.keys(TRIPS), ...pending.map((r) => r.slug)]);
  const slug = deriveSlug(brief.destination, brief.arrive, taken);
  const id = crypto.randomUUID();

  await env.DB.prepare(
    "INSERT INTO trip_request (id, email, slug, brief_json, status, created_at) VALUES (?1, ?2, ?3, ?4, 'queued', ?5)",
  )
    .bind(id, email, slug, JSON.stringify(brief), now)
    .run();

  // Ledger first, dispatch second: repository_dispatch is invisible, the
  // issue is the durable, human-visible record (see the plan).
  try {
    const issue = await gh(env, "POST", `/repos/${repo}/issues`, {
      title: `Trip request: ${brief.destination} — ${brief.arrive} → ${brief.depart}`,
      body:
        `Requested by ${email} via the planner.\n\n` +
        "```json\n" + JSON.stringify({ request_id: id, slug, ...brief }, null, 2) + "\n```\n\n" +
        "The intake workflow will comment progress here; the PR it opens will close this issue.\n\n" +
        "---\n_Generated by [Claude Code](https://claude.ai/code)_",
      labels: ["trip-request"],
    });
    await env.DB.prepare("UPDATE trip_request SET issue_number = ?1 WHERE id = ?2")
      .bind(issue.number, id)
      .run();
    await gh(env, "POST", `/repos/${repo}/dispatches`, {
      event_type: "trip-request",
      client_payload: { request_id: id, slug, issue: issue.number, requested_by: email, brief },
    });
    return { status: 202, body: { request_id: id, slug, issue_url: issue.html_url } };
  } catch (err) {
    await env.DB.prepare("UPDATE trip_request SET status = 'failed' WHERE id = ?1")
      .bind(id)
      .run();
    return { status: 502, body: { error: "GitHub call failed", detail: String(err.message || err) } };
  }
}

// GET /api/trips/:id — status polling for the site.
export async function getIntake(env, id) {
  const row = await env.DB.prepare(
    "SELECT id, email, slug, issue_number, status, created_at FROM trip_request WHERE id = ?1",
  )
    .bind(id)
    .first();
  if (!row) return null;
  return {
    request_id: row.id,
    slug: row.slug,
    status: row.status,
    issue_number: row.issue_number,
    requested_by: row.email,
    created_at: row.created_at,
  };
}
