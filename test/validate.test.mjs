// Unit tests for the shared trip validator (src/scripts/validate.js).
// Run with `node --test test/` (also invoked by `npm test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTrip, COST_CAPS } from "../src/scripts/validate.js";
import japan from "../src/data/japan.js";

// A minimal, structurally-valid trip. Each test clones this and breaks one
// thing, asserting the validator reports exactly that problem. 3 nights →
// baseNights must sum to 2 (the flex-night identity).
const base = () => ({
  meta: {
    route: ["a"],
    optionalCities: [],
    flexNightDefault: "a",
    lodgingTaxBuffer: 1.1,
    dates: { arrive: "2027-03-01", depart: "2027-03-04", nights: 3 },
  },
  hotels: {
    a: { label: "A", baseNights: 2, options: [{ name: "Inn", rate: 150 }] },
  },
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

// ── semantic checks ─────────────────────────────────────────────────

test("dates must be ISO, ordered, with nights matching the span", () => {
  const bad = base();
  bad.meta.dates.arrive = "03/01/2027";
  assert.ok(has(validateTrip(bad), "ISO dates"));

  const missing = base();
  delete missing.meta.dates;
  assert.ok(has(validateTrip(missing), "ISO dates"));

  const reversed = base();
  reversed.meta.dates = { arrive: "2027-03-04", depart: "2027-03-01", nights: 3 };
  assert.ok(has(validateTrip(reversed), "must be after arrive"));

  const mismatch = base();
  mismatch.meta.dates.nights = 5;
  assert.ok(has(validateTrip(mismatch), "spans 3 nights"));
});

test("baseNights must exist per city and sum to nights − 1", () => {
  const missing = base();
  delete missing.hotels.a.baseNights;
  assert.ok(has(validateTrip(missing), "baseNights must be a number"));

  const wrongSum = base();
  wrongSum.hotels.a.baseNights = 3; // 3 nights → base must sum to 2
  assert.ok(has(validateTrip(wrongSum), "must equal nights − 1"));
});

test("hotel rates must be numbers within the nightly cap; $0 is allowed", () => {
  const noOptions = base();
  noOptions.hotels.a.options = [];
  assert.ok(has(validateTrip(noOptions), "non-empty array"));

  const misread = base();
  misread.hotels.a.options[0].rate = 20000; // a ¥20,000 → $20,000 misread
  assert.ok(has(validateTrip(misread), `$0–$${COST_CAPS.nightlyRate}/night`));

  const negative = base();
  negative.hotels.a.options[0].rate = -50;
  assert.ok(has(validateTrip(negative), "rate -50"));

  const free = base(); // "staying with family" is a real, valid $0 tier
  free.hotels.a.options.push({ name: "Family", rate: 0 });
  assert.deepEqual(validateTrip(free), []);
});

test("flight fares and activity costs are range-checked", () => {
  const fare = base();
  fare.flights = { us: { options: [{ name: "X", fare: 99999 }] } };
  assert.ok(has(validateTrip(fare), "flights.us option 0"));

  const act = base();
  act.activities = { a: [{ title: "T", options: [{ name: "Y", cost: "120" }] }] };
  assert.ok(has(validateTrip(act), "activities.a[0] option 0"));

  const fine = base();
  fine.flights = { us: { options: [{ name: "X", fare: 2150 }] } };
  fine.activities = { a: [{ title: "T", options: [{ name: "free", cost: 0 }] }] };
  assert.deepEqual(validateTrip(fine), []);
});

test("every numeric leaf of a leg's cost shape is range-checked", () => {
  const grid = base();
  grid.transport.legs.push({
    id: "airport",
    terminals: true,
    modes: { public: { scale: "person" }, private: { scale: "vehicle" } },
    cost: { nrt: { public: 44, private: NaN } },
  });
  assert.ok(has(validateTrip(grid), 'transport leg "airport" cost null')); // NaN → null in JSON

  const flat = base();
  flat.transport.legs[0].flat.cost = 7000;
  assert.ok(has(validateTrip(flat), 'leg "leg1" cost 7000'));

  const rental = base();
  rental.transport.rental = { perDay: 80, oneTime: -5 };
  assert.ok(has(validateTrip(rental), "rental.oneTime -5"));
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
