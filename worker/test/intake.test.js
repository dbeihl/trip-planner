// Tests for the trip-intake spine (intake.js): brief validation, slug
// derivation (never overwrite an existing trip), quotas, and the
// auth → ledger → dispatch flow against a stubbed D1 + GitHub API.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import {
  validateBrief,
  deriveSlug,
  checkQuota,
  createIntake,
  getIntake,
  QUOTAS,
} from "../src/intake.js";

const GOOD = {
  destination: "Portugal",
  arrive: "2028-11-05",
  depart: "2028-11-14",
  travelers: 2,
  wishes: "coast towns, pastel de nata, no rental car",
};

// ── pure pieces ─────────────────────────────────────────────────────

test("validateBrief accepts a good brief and strips unknown fields", () => {
  const { brief, error } = validateBrief({ ...GOOD, evil: "ignored", origin: "ind" });
  assert.equal(error, undefined);
  assert.equal(brief.evil, undefined);
  assert.equal(brief.origin, "IND");
  assert.equal(brief.destination, "Portugal");
});

test("validateBrief rejects malformed briefs", () => {
  const bad = [
    [{ ...GOOD, destination: "" }, "destination"],
    [{ ...GOOD, destination: "x".repeat(81) }, "destination"],
    [{ ...GOOD, arrive: "Nov 5" }, "ISO"],
    [{ ...GOOD, depart: "2028-11-05" }, "after arrive"],
    [{ ...GOOD, travelers: 0 }, "1–8"],
    [{ ...GOOD, travelers: 2.5 }, "1–8"],
    [{ ...GOOD, wishes: "x".repeat(2001) }, "wishes"],
    [null, "JSON object"],
    [[1], "JSON object"],
  ];
  for (const [body, needle] of bad) {
    const { error } = validateBrief(body);
    assert.ok(error && error.toLowerCase().includes(needle.toLowerCase()), `${needle}: got ${error}`);
  }
});

test("deriveSlug: fresh, dated-suffix on repeat, numbered past that", () => {
  const taken = new Set(["japan", "portugal"]);
  assert.equal(deriveSlug("Banff & Jasper", "2028-06-01", taken), "banff-jasper");
  assert.equal(deriveSlug("Portugal", "2028-11-05", taken), "portugal-nov-2028");
  taken.add("portugal-nov-2028");
  assert.equal(deriveSlug("Portugal", "2028-11-05", taken), "portugal-nov-2028-2");
});

// ── stubs ───────────────────────────────────────────────────────────

// Route D1 calls by SQL substring; capture writes. D1 statements can run
// with or without bind(), so both paths expose the same methods.
function fakeDb(state) {
  const ops = (sql, args) => ({
    first: async () => {
      if (sql.includes("COUNT(*)"))
        return { n: sql.includes("email") ? state.userCount : state.globalCount };
      if (sql.startsWith("SELECT id,")) return state.rows[args[0]] || null;
      throw new Error("unexpected first(): " + sql);
    },
    all: async () => ({ results: state.pendingSlugs.map((slug) => ({ slug })) }),
    run: async () => state.writes.push({ sql, args }),
  });
  return {
    prepare: (sql) => ({ ...ops(sql, []), bind: (...args) => ops(sql, args) }),
  };
}

const freshState = () => ({ userCount: 0, globalCount: 0, pendingSlugs: [], rows: {}, writes: [] });

const ghCalls = [];
let issueStatus = 201;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const path = String(url);
  ghCalls.push({ path, init });
  if (path.endsWith("/issues"))
    return new Response(JSON.stringify({ number: 42, html_url: "https://github.test/i/42" }), {
      status: issueStatus,
    });
  if (path.endsWith("/dispatches")) return new Response(null, { status: 204 });
  throw new Error("unexpected fetch: " + path);
};
after(() => {
  globalThis.fetch = realFetch;
});

const ENV = (state) => ({
  DB: fakeDb(state),
  GITHUB_INTAKE_TOKEN: "ghp_test",
  GITHUB_REPO: "dbeihl/trip-planner",
  TRIP_CREATORS: "dave@example.com, suzanne@example.com",
});

// ── the flow ────────────────────────────────────────────────────────

test("createIntake: unconfigured, unauthorized, malformed, over-quota", async () => {
  const state = freshState();
  const noToken = await createIntake({ DB: fakeDb(state) }, "dave@example.com", "{}");
  assert.equal(noToken.status, 503);

  const stranger = await createIntake(ENV(state), "intruder@example.com", JSON.stringify(GOOD));
  assert.equal(stranger.status, 403);

  const notJson = await createIntake(ENV(state), "dave@example.com", "not json{");
  assert.equal(notJson.status, 400);

  const overDaily = { ...freshState(), userCount: QUOTAS.perUserPerDay };
  assert.equal((await createIntake(ENV(overDaily), "dave@example.com", JSON.stringify(GOOD))).status, 429);

  const overMonthly = { ...freshState(), globalCount: QUOTAS.globalPerMonth };
  assert.equal((await createIntake(ENV(overMonthly), "dave@example.com", JSON.stringify(GOOD))).status, 429);
});

test("createIntake happy path: row, issue, dispatch, 202", async () => {
  const state = freshState();
  ghCalls.length = 0;
  const out = await createIntake(ENV(state), "suzanne@example.com", JSON.stringify(GOOD));
  assert.equal(out.status, 202);
  assert.equal(out.body.slug, "portugal");
  assert.equal(out.body.issue_url, "https://github.test/i/42");
  assert.match(out.body.request_id, /^[0-9a-f-]{36}$/);

  // D1: queued insert, then the issue number lands on the row
  assert.ok(state.writes.some((w) => w.sql.includes("INSERT INTO trip_request") && w.args[2] === "portugal"));
  assert.ok(state.writes.some((w) => w.sql.includes("issue_number") && w.args[0] === 42));

  // GitHub: ledger issue first, then the dispatch that wakes the Action
  assert.equal(ghCalls.length, 2);
  assert.ok(ghCalls[0].path.endsWith("/repos/dbeihl/trip-planner/issues"));
  const issueBody = JSON.parse(ghCalls[0].init.body);
  assert.deepEqual(issueBody.labels, ["trip-request"]);
  assert.match(issueBody.title, /^Trip request: Portugal/);
  const dispatch = JSON.parse(ghCalls[1].init.body);
  assert.equal(dispatch.event_type, "trip-request");
  assert.equal(dispatch.client_payload.issue, 42);
  assert.equal(dispatch.client_payload.requested_by, "suzanne@example.com");
  assert.deepEqual(dispatch.client_payload.brief, {
    destination: "Portugal",
    arrive: "2028-11-05",
    depart: "2028-11-14",
    travelers: 2,
    wishes: GOOD.wishes,
  });
});

test("createIntake: an existing trip slug is never reused", async () => {
  const state = freshState();
  const out = await createIntake(
    ENV(state),
    "dave@example.com",
    JSON.stringify({ ...GOOD, destination: "Japan", arrive: "2027-11-14" }),
  );
  assert.equal(out.status, 202);
  assert.equal(out.body.slug, "japan-nov-2027", "the shipped japan trip is protected");
});

test("createIntake: a GitHub failure marks the row failed and returns 502", async () => {
  const state = freshState();
  issueStatus = 500;
  const out = await createIntake(ENV(state), "dave@example.com", JSON.stringify(GOOD));
  issueStatus = 201;
  assert.equal(out.status, 502);
  assert.ok(state.writes.some((w) => w.sql.includes("'failed'")));
});

test("getIntake returns the row's public shape, null when missing", async () => {
  const state = freshState();
  state.rows["abc"] = {
    id: "abc",
    email: "dave@example.com",
    slug: "portugal",
    issue_number: 42,
    status: "queued",
    created_at: 100,
  };
  const found = await getIntake({ DB: fakeDb(state) }, "abc");
  assert.deepEqual(found, {
    request_id: "abc",
    slug: "portugal",
    status: "queued",
    issue_number: 42,
    requested_by: "dave@example.com",
    created_at: 100,
  });
  assert.equal(await getIntake({ DB: fakeDb(state) }, "nope"), null);
});
