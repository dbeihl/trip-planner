// Tests for saved scenarios (scenario.js): PUT input validation and the
// GET mine/others split, against a stubbed D1.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getScenarios, putScenario } from "../src/scenario.js";

const dbReturning = (results) => ({
  DB: { prepare: () => ({ bind: () => ({ all: async () => ({ results }) }) }) },
});

test("putScenario rejects an oversize snapshot with 413", async () => {
  const body = '{"pad":"' + "x".repeat(100 * 1024) + '"}';
  const out = await putScenario({}, "japan", "a@b.c", body);
  assert.equal(out.status, 413);
});

test("putScenario rejects non-JSON and non-object bodies with 400", async () => {
  for (const body of ["not json{", "[1,2]", '"just a string"', "null", "42"]) {
    const out = await putScenario({}, "japan", "a@b.c", body);
    assert.equal(out.status, 400, `body ${JSON.stringify(body)} must 400`);
  }
});

test("putScenario upserts the caller's snapshot keyed by trip + email", async () => {
  const calls = [];
  const env = {
    DB: {
      prepare: (sql) => ({
        bind: (...args) => ({ run: async () => calls.push({ sql, args }) }),
      }),
    },
  };
  const out = await putScenario(env, "japan", "suzanne@example.com", '{"nights":{"tokyo":4}}');
  assert.equal(out.ok, true);
  assert.equal(typeof out.updated_at, "number");
  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /ON CONFLICT\(trip_id, email\) DO UPDATE/);
  const [slug, email, json, at] = calls[0].args;
  assert.equal(slug, "japan");
  assert.equal(email, "suzanne@example.com");
  assert.deepEqual(JSON.parse(json), { nights: { tokyo: 4 } });
  assert.equal(at, out.updated_at);
});

test("getScenarios splits mine from others, newest others first", async () => {
  const env = dbReturning([
    { email: "me@example.com", snapshot_json: '{"n":1}', updated_at: 50 },
    { email: "suzanne@example.com", snapshot_json: '{"n":2}', updated_at: 10 },
    { email: "dale@example.com", snapshot_json: '{"n":3}', updated_at: 99 },
  ]);
  const out = await getScenarios(env, "japan", "me@example.com");
  assert.equal(out.trip, "japan");
  assert.deepEqual(out.mine, { snapshot: { n: 1 }, updated_at: 50 });
  assert.deepEqual(
    out.others.map((o) => o.email),
    ["dale@example.com", "suzanne@example.com"],
  );
  assert.equal(out.others[1].name, "Suzanne", "display name from the email local part");
  assert.deepEqual(out.others[0].snapshot, { n: 3 });
});

test("getScenarios skips unreadable rows and handles an empty table", async () => {
  const broken = dbReturning([
    { email: "me@example.com", snapshot_json: "corrupt{", updated_at: 5 },
    { email: "ok@example.com", snapshot_json: "{}", updated_at: 6 },
  ]);
  const out = await getScenarios(broken, "japan", "me@example.com");
  assert.equal(out.mine, null, "the corrupt row is skipped, not fatal");
  assert.equal(out.others.length, 1);

  const empty = await getScenarios(dbReturning([]), "japan", "me@example.com");
  assert.deepEqual(empty, { trip: "japan", mine: null, others: [] });
});
