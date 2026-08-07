# trip-planner

A self-contained, single-file trip planner — a cost **budget ledger** and a sendable **day-by-day itinerary** over one shared state, with PDF / Excel / text export (including a Japan visa-form sheet). The goal is to turn it from one hardcoded trip into a **"pick a destination → describe the trip → get a planner"** tool.

**Status:** this repo is now the canonical home of the live Japan trip (`src/data/japan.js`) as well as the workbench for generalizing the engine to other destinations. The design lives in [`GENERALIZATION-PLAN.md`](GENERALIZATION-PLAN.md); the work is tracked in Issues.

## Why this repo exists

The Japan planner started in a separate, private repo (`japan-travel`), archived 2026-08-07 after its Osaka restructure merged there (`japan-travel`#12). This repo is now canonical for that live trip — Tokyo → Hakone → Osaka, Kyoto as a Keihan day trip, Nov 14–22 2026 — and is where the **engine is generalized** to other destinations; `src/data/japan.js` isn't a frozen reference dataset, and the validator, tests, and e2e are the regression gates going forward.

## Files

| File                      | Role                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `japan-trip-planner.html` | The seed engine + Japan reference data (single self-contained file: cost engine, itinerary view, exports). Phase 1 extracts the data out of it. |
| `GENERALIZATION-PLAN.md`  | The design/plan: architecture, the `TripData` schema, phased build, open decisions.                                                             |

## Running

It's a static file — open `japan-trip-planner.html` in a browser. No build, no dependencies, no network calls at view time. (PDF/Excel export needs a real page, not a sandboxed preview.)

## The one architectural move

Separate the trip-agnostic **engine** (`recalc()`, `renderItinerary()`, exports) from the trip-specific **data**, then generate the data per destination. Start with Phase 1 (extract a `TripData` object in-file, no behavior change).
