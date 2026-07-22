// Unit tests for the shared trip validator (src/scripts/validate.js).
// Run with `node --test test/` (also invoked by `npm test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTrip } from "../src/scripts/validate.js";
import japan from "../src/data/japan.js";

// A minimal, structurally-valid trip. Each test clones this and breaks one
// thing, asserting the validator reports exactly that problem.
const base = () => ({
  meta: {
    route: ["a"],
    optionalCities: [],
    flexNightDefault: "a",
    lodgingTaxBuffer: 1.1,
  },
  hotels: { a: { label: "A" } },
  itinPool: { a: [{ id: "a1" }] },
  transport: { legs: [{ id: "leg1", flat: { cost: 100, scale: "person" } }] },
});

const has = (problems, needle) =>
  problems.some((p) => p.toLowerCase().includes(needle.toLowerCase()));

test("a well-formed trip has no problems", () => {
  assert.deepEqual(validateTrip(base()), []);
});

test("the real Japan reference dataset validates clean", () => {
  assert.deepEqual(validateTrip(japan), []);
});

test("meta.route must be an array", () => {
  const t = base();
  delete t.meta.route;
  assert.ok(has(validateTrip(t), "meta.route must be an array"));
});

test("meta.optionalCities must be an array", () => {
  const t = base();
  t.meta.optionalCities = "osaka";
  assert.ok(has(validateTrip(t), "meta.optionalCities must be an array"));
});

test("lodgingTaxBuffer must be a number >= 1", () => {
  const missing = base();
  delete missing.meta.lodgingTaxBuffer;
  assert.ok(has(validateTrip(missing), "lodgingTaxBuffer"));

  const tooLow = base();
  tooLow.meta.lodgingTaxBuffer = 0.9;
  assert.ok(has(validateTrip(tooLow), "lodgingTaxBuffer"));
});

test("a route city needs a hotels and itinPool entry", () => {
  const t = base();
  t.meta.route = ["a", "b"];
  const problems = validateTrip(t);
  assert.ok(has(problems, 'city "b" has no hotels'));
  assert.ok(has(problems, 'city "b" has no itinerary'));
});

test("flexNightDefault must be a route city", () => {
  const t = base();
  t.meta.flexNightDefault = "zzz";
  assert.ok(has(validateTrip(t), "flexNightDefault"));
});

test("a transport leg needs a cost shape", () => {
  const t = base();
  t.transport.legs = [{ id: "bad" }];
  assert.ok(has(validateTrip(t), "no cost shape"));
});

test("a leg scale must be person or vehicle", () => {
  const t = base();
  t.transport.legs = [{ id: "typo", flat: { cost: 10, scale: "vehcile" } }];
  assert.ok(has(validateTrip(t), "invalid scale"));

  const modeTypo = base();
  modeTypo.transport.legs = [
    { id: "m", modes: { rail: { scale: "persson" } }, cost: { rail: 10 } },
  ];
  assert.ok(has(validateTrip(modeTypo), "invalid scale"));
});

test("flat.cost must be a number", () => {
  const t = base();
  t.transport.legs = [{ id: "l", flat: { cost: "100", scale: "person" } }];
  assert.ok(has(validateTrip(t), "flat.cost must be a number"));
});

test("itinPool lodging/move must reference real hotels/legs", () => {
  const t = base();
  t.itinPool.a = [{ id: "a1", lodging: "ghost", move: "noleg" }];
  const problems = validateTrip(t);
  assert.ok(has(problems, 'lodging "ghost"'));
  assert.ok(has(problems, 'move "noleg"'));
});
