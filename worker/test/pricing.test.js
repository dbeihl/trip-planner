// Unit tests for the pure pricing distillers (Duffel + SerpAPI), pinned to
// fixture responses shaped like each provider's documented examples. Run with
// `npm test` (node --test — no dependencies).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { condenseDuffel, distillDuffel, distillSerpFlights, flightsProvider } from "../src/sources/flights.js";
import { distillSerpHotels, nightsBetween } from "../src/sources/lodging.js";

const fixture = (name) =>
  JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));

test("distillDuffel: sorts by price, drops unparsable, keeps the shape", () => {
  const out = distillDuffel(fixture("duffel-offers.json"));
  assert.equal(out.count, 2); // the "not-a-number" offer is dropped
  assert.equal(out.cheapest_total_2adults, 980.1);
  assert.equal(out.currency, "USD");
  assert.deepEqual(out.offers[0], {
    price: 980.1,
    currency: "USD",
    carrier: "UA",
    out_stops: 0,
    return_stops: 2,
  });
  assert.deepEqual(out.offers[1], {
    price: 1240.4,
    currency: "USD",
    carrier: "AA",
    out_stops: 1,
    return_stops: 0,
  });
});

test("distillDuffel: empty/malformed input yields the null shape", () => {
  for (const input of [{}, null, { data: {} }, { data: { offers: [] } }]) {
    const out = distillDuffel(input);
    assert.equal(out.count, 0);
    assert.equal(out.cheapest_total_2adults, null);
    assert.equal(out.currency, "USD");
    assert.deepEqual(out.offers, []);
  }
});

test("distillSerpFlights: merges best+other, prices are 2-adult totals", () => {
  const out = distillSerpFlights(fixture("serpapi-flights.json"));
  assert.equal(out.count, 2); // the priceless entry is dropped
  assert.equal(out.cheapest_total_2adults, 837);
  assert.deepEqual(out.offers[0], {
    price: 837,
    currency: "USD",
    carrier: "United",
    out_stops: 1,
    return_stops: null,
  });
});

test("distillSerpHotels: median + cheapest nightly from priced properties", () => {
  const out = distillSerpHotels(fixture("serpapi-hotels.json"));
  assert.equal(out.hotels_priced, 3); // the rate-less property is dropped
  assert.equal(out.nightly_cheapest, 129);
  assert.equal(out.nightly_median, 174);
  assert.equal(out.currency, "USD");
});

test("distillSerpHotels: empty input yields the null shape", () => {
  const out = distillSerpHotels({});
  assert.equal(out.hotels_priced, 0);
  assert.equal(out.nightly_cheapest, null);
  assert.equal(out.nightly_median, null);
});

test("flightsProvider: Duffel wins, SerpAPI falls back, else null", () => {
  assert.equal(flightsProvider({ DUFFEL_API_KEY: "duffel_test_x", SERPAPI_KEY: "s" }), "duffel");
  assert.equal(flightsProvider({ SERPAPI_KEY: "s" }), "serpapi");
  assert.equal(flightsProvider({}), null);
});

test("nightsBetween: whole nights from ISO dates", () => {
  assert.equal(nightsBetween("2026-11-14", "2026-11-22"), 8);
  assert.equal(nightsBetween("2028-05-14", "2028-05-20"), 6);
});

test("condenseDuffel: shrinks a huge body without changing what distillDuffel sees", () => {
  const original = fixture("duffel-offers.json");
  // inflate: pad each offer with the junk fields real Duffel responses carry
  const bloated = {
    data: {
      offers: original.data.offers.map((o) => ({
        ...o,
        conditions: { x: "y".repeat(5000) },
        passengers: Array.from({ length: 10 }, () => ({ blob: "z".repeat(2000) })),
      })),
    },
  };
  const condensed = condenseDuffel(JSON.stringify(bloated));
  assert.ok(condensed.length < JSON.stringify(bloated).length / 5, "should shrink dramatically");
  assert.deepStrictEqual(distillDuffel(JSON.parse(condensed)), distillDuffel(original));
});

test("condenseDuffel: caps at 50 offers and survives junk input", () => {
  const many = { data: { offers: Array.from({ length: 200 }, (_, i) => ({ total_amount: String(100 + i), total_currency: "USD", owner: { iata_code: "AA" }, slices: [] })) } };
  const out = JSON.parse(condenseDuffel(JSON.stringify(many)));
  assert.strictEqual(out.data.offers.length, 50);
  assert.strictEqual(condenseDuffel("not json{"), "not json{");
});
