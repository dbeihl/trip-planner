// Unit tests for the pure budget core (src/scripts/budget.js) — the math
// recalc() delegates to. These pin the load-bearing invariants from
// CLAUDE.md: every authored cost is a 2-adult total, personFactor = N/2,
// vehicleFactor = ceil(N/4), rooms = ceil(N/2), and the lodging tax buffer
// inflates lodging only. A regression here silently corrupts every total.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  partyFactors,
  legCost,
  legCostMap,
  driveCosts,
  flightsTotal,
  rentalTotal,
  cityLodging,
  budgetTotals,
} from "../src/scripts/budget.js";

test("partyFactors: rooms of 2, person factor of N/2, vehicles of 4", () => {
  assert.deepEqual(partyFactors(1), { N: 1, rooms: 1, personFactor: 0.5, vehicleFactor: 1 });
  assert.deepEqual(partyFactors(2), { N: 2, rooms: 1, personFactor: 1, vehicleFactor: 1 });
  assert.deepEqual(partyFactors(3), { N: 3, rooms: 2, personFactor: 1.5, vehicleFactor: 1 });
  assert.deepEqual(partyFactors(4), { N: 4, rooms: 2, personFactor: 2, vehicleFactor: 1 });
  assert.deepEqual(partyFactors(5), { N: 5, rooms: 3, personFactor: 2.5, vehicleFactor: 2 });
  assert.deepEqual(partyFactors(8), { N: 8, rooms: 4, personFactor: 4, vehicleFactor: 2 });
});

test("partyFactors: junk input falls back to the 2-adult base, floor of 1", () => {
  assert.equal(partyFactors(NaN).N, 2);
  assert.equal(partyFactors(0).N, 2);
  assert.equal(partyFactors(undefined).N, 2);
  assert.equal(partyFactors(-3).N, 1);
});

// A selection reader over a plain object — what the engine's DOM reader
// (selectedValue) looks like to budget.js.
const selOf = (choices) => (name) => choices[name] ?? null;
const ctx2 = { osakaMode: false, personFactor: 1, vehicleFactor: 1, sel: selOf({}) };

test("legCost: at 2 adults every shape returns the authored 2-adult cost", () => {
  assert.equal(legCost({ id: "a", flat: { cost: 120, scale: "person" } }, ctx2), 120);
  assert.equal(legCost({ id: "b", flat: { cost: 200, scale: "vehicle" } }, ctx2), 200);
  const modeLeg = {
    id: "c",
    modeControl: "cmode",
    modes: { public: { scale: "person" }, private: { scale: "vehicle" } },
    cost: { public: 36, private: 220 },
  };
  assert.equal(legCost(modeLeg, { ...ctx2, sel: selOf({ cmode: "public" }) }), 36);
  assert.equal(legCost(modeLeg, { ...ctx2, sel: selOf({ cmode: "private" }) }), 220);
});

test("legCost: person legs scale by N/2, vehicle legs by whole vehicles", () => {
  // 5 travelers: personFactor 2.5, vehicleFactor 2
  const p5 = { osakaMode: false, personFactor: 2.5, vehicleFactor: 2, sel: selOf({}) };
  assert.equal(legCost({ id: "rail", flat: { cost: 100, scale: "person" } }, p5), 250);
  assert.equal(legCost({ id: "van", flat: { cost: 200, scale: "vehicle" } }, p5), 400);
});

test("legCost: the 2D terminal grid picks [terminal][mode] and its mode scale", () => {
  const leg = {
    id: "airport",
    terminals: true,
    terminalControl: "airport",
    modeControl: "airportmode",
    modes: { public: { scale: "person" }, private: { scale: "vehicle" } },
    cost: {
      nrt: { public: 44, private: 300 },
      hnd: { public: 24, private: 200 },
    },
  };
  const at = (airport, airportmode, pf, vf) =>
    legCost(leg, { osakaMode: false, personFactor: pf, vehicleFactor: vf, sel: selOf({ airport, airportmode }) });
  assert.equal(at("nrt", "public", 1, 1), 44);
  assert.equal(at("hnd", "private", 1, 1), 200);
  assert.equal(at("nrt", "public", 2, 1), 88, "public fare is per person");
  assert.equal(at("nrt", "private", 2.5, 2), 600, "private car is per vehicle");
});

test("legCost: fixed add-ons stack on the mode cost with their own scale", () => {
  const leg = {
    id: "hk",
    modeControl: "hkmode",
    modes: { public: { scale: "person" }, private: { scale: "vehicle" } },
    cost: { public: 20, private: 90 },
    fixed: { cost: 240, scale: "person" }, // e.g. the Shinkansen segment
  };
  const c = legCost(leg, { osakaMode: false, personFactor: 1.5, vehicleFactor: 1, sel: selOf({ hkmode: "public" }) });
  assert.equal(c, 20 * 1.5 + 240 * 1.5);
});

test("legCost: `when` gates detour legs by the optional-city state", () => {
  const osakaLeg = { id: "ko", when: "osaka", flat: { cost: 50, scale: "person" } };
  const directLeg = { id: "final", when: "noOsaka", flat: { cost: 70, scale: "person" } };
  assert.equal(legCost(osakaLeg, { ...ctx2, osakaMode: false }), 0);
  assert.equal(legCost(osakaLeg, { ...ctx2, osakaMode: true }), 50);
  assert.equal(legCost(directLeg, { ...ctx2, osakaMode: false }), 70);
  assert.equal(legCost(directLeg, { ...ctx2, osakaMode: true }), 0);
});

test("legCostMap keys every leg by id", () => {
  const legs = [
    { id: "a", flat: { cost: 10, scale: "person" } },
    { id: "b", when: "osaka", flat: { cost: 5, scale: "person" } },
  ];
  assert.deepEqual(legCostMap(legs, ctx2), { a: 10, b: 0 });
});

test("driveCosts: padded round-trip fuel plus en-route overnights", () => {
  // 1000 route miles, 25 mpg, straight-through: 1000×2×1.15/25 = 92 gal × $5
  const day1 = driveCosts({ miles: 1000, mpg: 25, driveDays: 1, stopRate: 120, rooms: 1, vehicleFactor: 1 });
  assert.deepEqual(day1, { fuelCost: 460, enrouteNights: 0, enrouteLodging: 0, total: 460 });
  // 3 days each way → 2 overnights per direction, × rate × rooms
  const day3 = driveCosts({ miles: 1000, mpg: 25, driveDays: 3, stopRate: 120, rooms: 2, vehicleFactor: 1 });
  assert.equal(day3.enrouteNights, 4);
  assert.equal(day3.enrouteLodging, 4 * 120 * 2);
  assert.equal(day3.total, 460 + 960);
  // a second vehicle doubles fuel, not lodging
  const twoCars = driveCosts({ miles: 1000, mpg: 25, driveDays: 1, stopRate: 0, rooms: 3, vehicleFactor: 2 });
  assert.equal(twoCars.fuelCost, 920);
});

test("flightsTotal sums fare × pax per active origin", () => {
  assert.equal(flightsTotal([]), 0);
  assert.equal(
    flightsTotal([
      { sel: { fare: 900 }, pax: 2 },
      { sel: { fare: 1100 }, pax: 1 },
    ]),
    2900,
  );
});

test("rentalTotal: per-day × nights when renting; one-time extras survive not renting", () => {
  const R = { perDay: 80, oneTime: 95 };
  assert.equal(rentalTotal(R, true, 10, 1), 80 * 10 + 95);
  assert.equal(rentalTotal(R, false, 10, 1), 95, "own car keeps fuel/park pass only");
  assert.equal(rentalTotal(R, true, 10, 2), (80 * 10 + 95) * 2, "per vehicle");
  assert.equal(rentalTotal({ perDay: 80 }, false, 10, 1), 0, "no one-time extras");
  assert.equal(rentalTotal(null, true, 10, 1), 0, "trips without a rental");
});

test("cityLodging: tier rate × nights × rooms, zero nights zero cost", () => {
  assert.deepEqual(
    cityLodging({ tokyo: 250, hakone: 400, osaka: 180 }, { tokyo: 4, hakone: 1 }, 2),
    { tokyo: 2000, hakone: 800, osaka: 0 },
  );
});

test("budgetTotals: the buffer inflates lodging only; flights sit outside ground", () => {
  const out = budgetTotals({
    legCosts: { a: 100, b: 150 },
    rental: 50,
    hotelCost: { tokyo: 800, kyoto: 200 },
    lodgingTaxBuffer: 1.1,
    activitiesTotal: 300,
    personFactor: 1,
    flightsCost: 2000,
  });
  // the buffer multiply carries float noise (1000 × 0.1 ≠ exactly 100);
  // display rounding absorbs it, so compare within a cent here
  const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 0.01, msg || `${a} ≈ ${b}`);
  assert.equal(out.transportTotal, 300);
  assert.equal(out.hotelSubtotal, 1000);
  close(out.lodgingBuffer, 100, "10% of lodging, nothing else");
  close(out.hotelTotal, 1100);
  assert.equal(out.activitiesCost, 300);
  close(out.groundTotal, 300 + 1100 + 300);
  close(out.grand, 300 + 1100 + 300 + 2000);
});

test("budgetTotals: activities scale by personFactor, transport does not rescale", () => {
  const base = {
    legCosts: { a: 500 }, // already scaled by legCost
    rental: 0,
    hotelCost: { x: 1000 },
    lodgingTaxBuffer: 1.08,
    activitiesTotal: 200,
    flightsCost: 0,
  };
  const two = budgetTotals({ ...base, personFactor: 1 });
  const four = budgetTotals({ ...base, personFactor: 2 });
  assert.equal(two.activitiesCost, 200);
  assert.equal(four.activitiesCost, 400);
  assert.equal(four.transportTotal, two.transportTotal, "legs are pre-scaled inputs");
});
