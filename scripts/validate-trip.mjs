#!/usr/bin/env node
// Gate for trip data modules: node scripts/validate-trip.mjs src/data/<slug>.js
// Runs the same validateTrip() the engine uses, plus presence checks a broken
// generated module would fail. Exits 1 on any problem — wire it before a PR.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { validateTrip } from "../src/scripts/validate.js";

const args = process.argv.slice(2);
if (!args.length) {
  console.error("usage: node scripts/validate-trip.mjs src/data/<slug>.js [more...]");
  process.exit(2);
}

let failed = false;
for (const file of args) {
  let trip;
  try {
    trip = (await import(pathToFileURL(resolve(file)).href)).default;
  } catch (err) {
    console.error(`✗ ${file}: could not import — ${err.message}`);
    failed = true;
    continue;
  }
  const problems = validateTrip(trip);

  // presence checks beyond key alignment
  const meta = (trip && trip.meta) || {};
  const d = meta.dates || {};
  if (!d.arrive || !d.depart || typeof d.nights !== "number")
    problems.push("meta.dates needs arrive, depart (ISO) and a numeric nights");
  else if (d.depart <= d.arrive) problems.push("meta.dates.depart must be after arrive");
  if (!meta.title) problems.push("meta.title is missing");
  if (!meta.hub || !meta.hub.emoji || !meta.hub.title || !meta.hub.blurb)
    problems.push("meta.hub {emoji, title, meta, blurb, order} is missing — the hub card needs it");
  const baseSum = (meta.route || []).reduce(
    (a, c) => a + (((trip.hotels || {})[c] || {}).baseNights || 0),
    0,
  );
  if (typeof d.nights === "number" && baseSum && baseSum !== d.nights - 1)
    problems.push(
      `base nights sum to ${baseSum} but should be nights − 1 = ${d.nights - 1} (flex-night invariant)`,
    );

  if (problems.length) {
    console.error(`✗ ${file}`);
    for (const p of problems) console.error(`   • ${p}`);
    failed = true;
  } else {
    console.log(`✓ ${file}`);
  }
}
process.exit(failed ? 1 : 0);
