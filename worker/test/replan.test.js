// Tests for the re-plan pure pieces: the structured-output schema (now with
// proposed_changes for NL edits) and the request builder.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BRIEF_SCHEMA, buildRequest, nights, buildEstimate } from "../src/sources/replan.js";

test("BRIEF_SCHEMA requires proposed_changes with the delta ops", () => {
  assert.ok(BRIEF_SCHEMA.required.includes("proposed_changes"));
  const pc = BRIEF_SCHEMA.properties.proposed_changes;
  assert.equal(pc.type, "array");
  assert.deepEqual(pc.items.properties.op.enum, [
    "set_dates",
    "set_nights",
    "add_city",
    "remove_city",
    "note",
  ]);
  // schema limits: flat, no extra properties, everything required
  assert.equal(pc.items.additionalProperties, false);
  assert.deepEqual(pc.items.required, ["op", "city", "nights", "start", "end", "reason"]);
});

test("buildRequest: schema + cacheable system prefix + payload last", () => {
  const req = buildRequest({ ANTHROPIC_API_KEY: "k" }, { instruction: "one less night" });
  assert.equal(req.body.output_config.format.schema, BRIEF_SCHEMA);
  assert.equal(req.body.system[0].cache_control.type, "ephemeral");
  assert.match(req.body.system[0].text, /proposed_changes/);
  assert.match(req.body.messages[0].content, /one less night/);
});

test("nights + buildEstimate still behave", () => {
  assert.equal(nights("2026-11-14", "2026-11-22"), 8);
  const est = buildEstimate(
    { configured: true, cheapest_total_2adults: 1200 },
    { configured: true, nightly_median: 150 },
    8,
  );
  assert.equal(est.subtotal, 1200 + 150 * 8);
});
