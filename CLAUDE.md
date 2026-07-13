# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this repository is

The home for generalizing a single-file trip planner into a **"pick a destination → get a planner"** tool. It was seeded from a working Japan planner (which lives in the private `japan-travel` repo and is in active use for a real trip). Here, **Japan is the reference dataset** — the engine is generalized without touching that live trip. The design is in `GENERALIZATION-PLAN.md`; work is tracked in Issues.

**Do not** treat this as the Japan trip's repo. Never push planner changes from here back to `japan-travel` or its live site (`dbeihl/japan-itinerary`) unless explicitly asked — that trip is frozen on purpose.

## The planner (`japan-trip-planner.html`)

One self-contained file (no framework, no build, no network at view time): `<style>`, body markup for two tabs, and a `<script>` with two halves meeting at one shared state object, `window.__state`.

- **Trip data** — all of it lives in one `TRIP` object at the top of the script (`meta`, `flights`, `hotels`, `transport`, `activities`, `routeDetail`, `itinPool`, `visaPlan`). The engine reads it through thin bindings (`const HOTELS = TRIP.hotels`, etc.) so the engine code stays data-agnostic. This is the Phase 1 seam; Phase 2 externalizes `TRIP` to JSON.
- **Budget engine** — `recalc()` reads the bound data, computes the total, and stashes everything on `window.__state`.
- **Itinerary layer** — `ITIN_POOL` (narrative day content), `renderItinerary()` which renders a day-by-day _from_ `__state` (hotels/transport/costs injected via `moveData()` and the Stay-row builder), plus exports (`window.print()` PDF, `buildExcelWorkbook()` .xlsx incl. a Japan MOFA visa sheet, copy-as-text).

## Load-bearing invariants (do not break)

- **Every cost is a 2-adult total**; the engine scales by `personFactor = N/2` and private transfers by `vehicleFactor = ceil(N/4)`. Generated/edited data must honor this or the scaling silently corrupts.
- **`ITIN_POOL` / `itinPool` holds experience only** — no hotel names, transport modes, or costs. Those are injected at render time from `window.__state`. This keeps the itinerary a _view_ of the budget choices, not a second source of truth.
- **`LODGING_TAX_BUFFER`** inflates lodging only; it's a planning margin, not a sourced figure.
- The **`reference` quote** (if present) is an optional, explicitly-not-apples-to-apples comparison; omit it and the UI hides the comparison.

## The generalization goal

Separate the trip-agnostic **engine** from the trip-specific **data**, then generate the data. Phased plan in `GENERALIZATION-PLAN.md`; start with **Phase 1** (extract a `TripData` object in-file, no behavior change). Watch for the known-hard parts flagged in the plan review: the transport/legs model is hardcoded in `recalc()`, the flexible-night + optional-city UX isn't in the schema yet, and generated `TripData` needs loud key-alignment validation.

## Editing conventions

- Keep the planner a **single self-contained file** — inline any new CSS/JS/data; no external assets, CDNs, or network calls. (Also what makes the print/Excel export work.)
- Vanilla JS, 2-space indent, `const`/`let`, template-literal rendering, no framework.
- Never hard-wrap markdown prose — one line per paragraph; reflow on contact. Lists/tables/code fences unchanged.

## Git workflow

- Default branch: `main`. Branch per change; never commit straight to `main`. Push with `git push -u origin <branch>`, then open a PR against `main`.
- This is a **personal** repo (`dbeihl/trip-planner`, personal GitHub account, SSH `github-personal`). Use the `dbeihl` gh account here (`gh auth switch --user dbeihl`).
