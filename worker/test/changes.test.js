// Tests for the "what changed" differ (changes.js). computeChanges reads the
// two newest logged pulls per source from D1 and diffs them with the same
// pure distillers the live sources use — here D1 is a stub keyed by source,
// so every differ is exercised through the real entry point.
import { test } from "node:test";
import assert from "node:assert/strict";
import { computeChanges } from "../src/changes.js";

const INFO = { advisoryMatch: ["japan"], arrive: "2026-11-14", depart: "2026-11-22" };

// lastTwo() expects [latest, previous] ordered by fetched_at DESC.
const row = (body, at) => ({
  response_json: typeof body === "string" ? body : JSON.stringify(body),
  fetched_at: at,
});

const envWith = (rowsBySource) => ({
  DB: {
    prepare: () => ({
      bind: (_slug, source) => ({
        all: async () => ({ results: rowsBySource[source] || [] }),
      }),
    }),
  },
});

const rss = (level, label) =>
  `<rss><channel><item><title>Japan - Level ${level}: ${label}</title></item></channel></rss>`;

const duffel = (amount) => ({
  data: {
    offers: [
      { total_amount: String(amount), total_currency: "USD", owner: { iata_code: "UA" }, slices: [] },
    ],
  },
});

const hotels = (nightly) => ({
  properties: [{ rate_per_night: { extracted_lowest: nightly } }],
});

test("an empty log yields no changes and a null last_pull_at", async () => {
  const out = await computeChanges(envWith({}), "japan", INFO);
  assert.equal(out.trip, "japan");
  assert.deepEqual(out.changes, []);
  assert.equal(out.last_pull_at, null);
});

test("a single pull per source can't diff — no changes, but last_pull_at is set", async () => {
  const out = await computeChanges(
    envWith({ duffel: [row(duffel(1000), 500)], "state-advisory": [row(rss(1, "Normal"), 700)] }),
    "japan",
    INFO,
  );
  assert.deepEqual(out.changes, []);
  assert.equal(out.last_pull_at, 700, "max fetched_at across sources");
});

test("an advisory level move is reported with both levels", async () => {
  const out = await computeChanges(
    envWith({
      "state-advisory": [row(rss(2, "Exercise Increased Caution"), 200), row(rss(1, "Normal"), 100)],
    }),
    "japan",
    INFO,
  );
  assert.equal(out.changes.length, 1);
  const c = out.changes[0];
  assert.equal(c.source, "state-advisory");
  assert.equal(c.from, 1);
  assert.equal(c.to, 2);
  assert.match(c.detail, /Level 1 → Level 2/);
  assert.match(c.detail, /Exercise Increased Caution/);
});

test("an unchanged advisory level is not a change", async () => {
  const out = await computeChanges(
    envWith({ "state-advisory": [row(rss(1, "Normal"), 200), row(rss(1, "Normal"), 100)] }),
    "japan",
    INFO,
  );
  assert.deepEqual(out.changes, []);
});

test("a holiday newly inside the window is reported by name", async () => {
  const holiday = { date: "2026-11-15", localName: "七五三", name: "Shichi-Go-San" };
  const out = await computeChanges(
    envWith({ nager: [row([holiday], 200), row([], 100)] }),
    "japan",
    INFO,
  );
  assert.equal(out.changes.length, 1);
  assert.equal(out.changes[0].aspect, "holidays");
  assert.match(out.changes[0].detail, /Shichi-Go-San/);
});

test("new events are counted and named, capped at three", async () => {
  const ev = (name) => ({ name, dates: { start: { localDate: "2026-11-15" } } });
  const latest = { _embedded: { events: [ev("A"), ev("B"), ev("C"), ev("D"), ev("E")] } };
  const prev = { _embedded: { events: [ev("A")] } };
  const out = await computeChanges(envWith({ ticketmaster: [row(latest, 200), row(prev, 100)] }), "japan", INFO);
  assert.equal(out.changes.length, 1);
  assert.match(out.changes[0].detail, /^4 new events: B, C, D…$/);
});

test("a fare drop diffs within Duffel and formats the delta", async () => {
  const out = await computeChanges(
    envWith({
      duffel: [row(duffel(900), 200), row(duffel(1000), 100)],
      // both present: Duffel must win; the SerpAPI rows must be ignored
      "serpapi-flights": [row({ best_flights: [{ price: 555 }] }, 200), row({ best_flights: [{ price: 999 }] }, 100)],
    }),
    "japan",
    INFO,
  );
  const fares = out.changes.filter((c) => c.aspect === "flights");
  assert.equal(fares.length, 1);
  assert.equal(fares[0].source, "duffel");
  assert.equal(fares[0].from, 1000);
  assert.equal(fares[0].to, 900);
  assert.equal(fares[0].detail, "round-trip fares (2 adults) ↓ $100 since the last pull");
});

test("SerpAPI fares are the fallback when Duffel has fewer than two pulls", async () => {
  const serp = (price) => ({ best_flights: [{ price, flights: [{ airline: "United" }] }] });
  const out = await computeChanges(
    envWith({
      duffel: [row(duffel(1000), 300)],
      "serpapi-flights": [row(serp(1100), 200), row(serp(900), 100)],
    }),
    "japan",
    INFO,
  );
  const fares = out.changes.filter((c) => c.aspect === "flights");
  assert.equal(fares.length, 1);
  assert.equal(fares[0].source, "serpapi-flights");
  assert.match(fares[0].detail, /↑ \$200 since the last pull/);
});

test("a median nightly-rate move is reported; an equal one is not", async () => {
  const moved = await computeChanges(
    envWith({ "serpapi-hotels": [row(hotels(180), 200), row(hotels(150), 100)] }),
    "japan",
    INFO,
  );
  assert.equal(moved.changes.length, 1);
  assert.equal(moved.changes[0].aspect, "lodging");
  assert.match(moved.changes[0].detail, /median nightly rate ↑ \$30/);

  const flat = await computeChanges(
    envWith({ "serpapi-hotels": [row(hotels(150), 200), row(hotels(150), 100)] }),
    "japan",
    INFO,
  );
  assert.deepEqual(flat.changes, []);
});

test("unparsable stored rows degrade to no change, not a crash", async () => {
  const out = await computeChanges(
    envWith({
      "serpapi-hotels": [row("not json{", 200), row(hotels(150), 100)],
      ticketmaster: [row("also broken", 200), row("still broken", 100)],
    }),
    "japan",
    INFO,
  );
  assert.deepEqual(out.changes, []);
  assert.equal(out.last_pull_at, 200);
});
