---
name: add-trip
description: Research and add a new trip planner — drafts research/<slug>.md, the src/data/<slug>.js data module, and the 3-line page; gated by the trip validator and an Astro build; ends in a PR. Use when the user asks to add a destination/trip (e.g. "add Portugal", "new trip: Banff").
---

# Add a trip

Turn "add <destination>" into a working planner page, validated and PR'd. The reference for every step is an existing module: `src/data/zion.js` (road trip), `src/data/italy.js` (rail, no rental), `src/data/philippines.js` (multi-island flights). `GENERALIZATION-PLAN.md` §"the generation routine" and `research/yellowstone.md` set the pattern.

## Inputs to collect (ask if missing)

- Destination + rough route (3–4 stops max; a single base is fine).
- Dates (or month + length — pick concrete dates), traveler count.
- Wishes: pace, must-sees, lodging style (hotels / camping / mix), rental car or not.
- Origins: default to the home-airport standard — **IND (David)** and **MNL (Partner)** — plus a big-hub preset (`preset: true`) so it never changes the default split.

## Steps

1. **Research first, write it down.** Live-research flights (both origins, real routings + representative round-trip fares), per-stop hotels (3–4 tiers with ratings + nightly rates), transport legs between stops, activities with real prices, and seasonal notes. Write `research/<slug>.md` documenting figures + sources + the date researched (prices are a snapshot).
2. **Draft `src/data/<slug>.js`** — default-export one `TRIP` object with `meta / flights / hotels / transport / activities / itinPool / itinDepart / visaPlan` (`routeDetail` optional). Copy the closest existing module's shape. Non-negotiable invariants:
   - **Every cost is a 2-adult total** (the engine scales by `personFactor = N/2`; private transfers by `vehicleFactor = ceil(N/4)`). Per-person fares go in `flights` options as per-person (`fare`) — the engine multiplies by pax.
   - **`itinPool` is experience-only** — no hotel names, transport modes, or costs in the day narratives; the engine injects those from `window.__state`. First entry per city is the travel-in day (`travel: true`, `move: <legId>`, `lodging: <cityKey>`).
   - **Base nights sum to `meta.dates.nights − 1`** (the flex night adds the last one via `meta.flexNightDefault`).
   - `meta.lodgingTaxBuffer` is a lodging-only planning margin; omit `meta.reference` unless there's a real package quote.
   - Include `meta.hub` (`order`, `emoji`, `title`, `meta`, `go`, `blurb`) — the hub page builds its card from it automatically.
   - Road trips: include `transport.rental` (+ `flat`/vehicle-scaled legs). Rail/fly trips: omit `rental`.
3. **Create the page** — `src/pages/<slug>-trip-planner.astro`, 3 lines, same as every other trip page (import data module, import `Planner`, render).
4. **Two manual registries** (the hub card is automatic, these two are not):
   - `SITE_TRIPS` in `src/scripts/engine.js` (the "Change trip" dropdown) — one entry.
   - `COORDS` in `worker/src/trips.js` — gateway lat/lon, `label`, `country`, `countryName`, `advisoryMatch` (foreign trips), `destAirport`, `cityCode`.
5. **Gate before committing** — both must pass:
   ```sh
   node scripts/validate-trip.mjs src/data/<slug>.js
   npx astro build
   ```
   Then open the built page and sanity-check: grand total sane, itinerary renders every day, exports work.
6. **Branch + PR** — branch `add-trip/<slug>` (never commit to `main`), commit the research file + data module + page + the two registry edits, push, open a PR against `main` describing route/dates/sources.
