// The TripData JSON Schema (schema/trip.schema.json) is the intake pipeline's
// output contract (TRIP-INTAKE-PLAN.md, hybrid runtime decision) — so it must
// describe reality: every shipped data module validates, and representative
// generator mistakes are rejected. Structural only; semantics stay in
// validate.js (tested in validate.test.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(
  readFileSync(new URL("../schema/trip.schema.json", import.meta.url), "utf8"),
);
const ajv = new Ajv2020.default({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

const errs = () =>
  (validate.errors || [])
    .map((e) => `${e.instancePath} ${e.message}`)
    .join("; ");

test("the schema itself compiles under draft 2020-12", () => {
  assert.equal(typeof validate, "function");
});

test("every shipped trip data module conforms to the schema", async () => {
  const files = readdirSync(new URL("../src/data", import.meta.url)).filter(
    (f) => f.endsWith(".js"),
  );
  assert.ok(files.length >= 11, "expected the full catalog");
  for (const f of files) {
    const trip = (await import(`../src/data/${f}`)).default;
    assert.ok(validate(trip), `${f}: ${errs()}`);
  }
});

// A minimal conforming trip — the smallest object the contract accepts.
// Negative tests clone it and break one thing.
const minimal = () => ({
  meta: {
    title: "Test — Jan 2030",
    hub: { title: "Test" },
    route: ["a"],
    optionalCities: [],
    flexNightDefault: "a",
    dates: { arrive: "2030-01-01", depart: "2030-01-04", nights: 3 },
    travelers: { count: 2 },
    currency: "USD",
    lodgingTaxBuffer: 1.1,
    destLabel: "Testville",
  },
  flights: {
    us: {
      label: "From home",
      traveler: "Both",
      pax: 2,
      preference: "nonstop",
      options: [
        { name: "X", route: "A → B", stops: 0, cabin: "Economy", fare: 500, note: "" },
      ],
    },
  },
  hotels: {
    a: {
      label: "A-town",
      baseNights: 2,
      header: "Where to stay",
      options: [{ name: "Inn", rate: 150, rating: "8.5", note: "" }],
    },
  },
  transport: { legs: [{ id: "leg1", flat: { cost: 100, scale: "person" } }] },
  activities: {
    a: [
      {
        day: 1,
        title: "Old town",
        options: [{ name: "Self-guided (free)", cost: 0, note: "" }],
      },
    ],
  },
  itinPool: {
    a: [
      {
        id: "a1",
        cityTag: "A-town — arrive",
        sun: "☀️",
        title: "Arrival",
        rows: [{ tag: "Morning", lead: "Land and settle in" }],
      },
    ],
  },
});

test("the minimal conforming trip validates", () => {
  assert.ok(validate(minimal()), errs());
});

test("generator-shaped mistakes are rejected", () => {
  const cases = [
    ["missing itinPool entirely", (t) => delete t.itinPool],
    ["string fare", (t) => (t.flights.us.options[0].fare = "500")],
    ["negative rate", (t) => (t.hotels.a.options[0].rate = -1)],
    ["misspelled scale", (t) => (t.transport.legs[0].flat.scale = "vehcile")],
    ["stray key inside flat", (t) => (t.transport.legs[0].flat.markup = 50)],
    ["non-ISO arrive date", (t) => (t.meta.dates.arrive = "Jan 1, 2030")],
    ["non-USD currency", (t) => (t.meta.currency = "JPY")],
    ["hotel city without baseNights", (t) => delete t.hotels.a.baseNights],
    ["itinerary day without id", (t) => delete t.itinPool.a[0].id],
    ["empty hotel options", (t) => (t.hotels.a.options = [])],
    ["lodgingTaxBuffer below 1", (t) => (t.meta.lodgingTaxBuffer = 0.9)],
  ];
  for (const [label, break_] of cases) {
    const t = minimal();
    break_(t);
    assert.equal(validate(t), false, `should reject: ${label}`);
  }
});
