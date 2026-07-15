# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this repository is

A **"pick a destination → get a planner"** tool, live at `https://dbeihl.github.io/trip-planner/`. It was seeded from a working Japan planner (which lives in the private `japan-travel` repo and is in active use for a real trip). Here, **Japan is the reference dataset** — the engine is generalized without touching that live trip. The design is in `GENERALIZATION-PLAN.md`; work is tracked in Issues.

**Do not** treat this as the Japan trip's repo. Never push planner changes from here back to `japan-travel` or its live site (`dbeihl/japan-itinerary`) unless explicitly asked — that trip is frozen on purpose.

## Architecture (post-Astro migration)

The site is an **Astro project**: one shared engine + per-trip data modules, built to static pages.

- `src/layouts/Planner.astro` — the shell **markup only** (no styles, no engine). It injects the trip data with a tiny `<script is:inline define:vars={{ TRIP: trip }}>window.TRIP = TRIP;</script>` and then loads the engine module.
- `src/styles/planner.css` — all planner styles (imported by the layout; Astro bundles it).
- `src/scripts/engine.js` — the ONE copy of the vanilla-JS engine, a real ES module (reads `window.TRIP`; functions are module-scoped, not globals; `window.__state` is still exposed).
- `src/scripts/xlsx.js` — the dependency-free .xlsx primitives (pure functions), imported by the engine.
- `src/data/<trip>.js` — one plain-data module per trip (default-exports the full `TRIP` object: `meta/flights/hotels/transport/activities/routeDetail?/itinPool/itinDepart/visaPlan`). **Adding a trip = adding a data module + a 3-line page.**
- `src/pages/<trip>-trip-planner.astro` — 3 lines: import data, import Planner, render. `src/pages/index.astro` is the hub.
- `astro.config.mjs` — `site: 'https://dbeihl.github.io'`, `base: '/trip-planner'`, `build: { format: 'file' }` (preserves the `<name>-trip-planner.html` URLs).
- `.github/workflows/deploy-astro.yml` — builds and deploys `dist/` to GitHub Pages via Actions on push to `main`.
- Build: `npx astro build`; local preview needs the `/trip-planner` base path.

The pre-Astro single-file planners were retired after the cutover was verified (parity baseline preserved in git history — last at tag-worthy commit `7fc72e3`…`#44`). Engine changes go in `src/scripts/engine.js` ONLY.

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

- The engine stays **vanilla JS in `src/scripts/engine.js`** — no client framework, no CDNs, no network calls at view time (booking links are plain `<a href>`; print/Excel export must keep working offline once loaded). Astro bundles the CSS/JS assets; everything must resolve same-origin under the `/trip-planner` base.
- Vanilla JS, 2-space indent, `const`/`let`, template-literal rendering.
- Never hard-wrap markdown prose — one line per paragraph; reflow on contact. Lists/tables/code fences unchanged.

## Git workflow

- Default branch: `main`. Branch per change; never commit straight to `main`. Push with `git push -u origin <branch>`, then open a PR against `main`.
- This is a **personal** repo (`dbeihl/trip-planner`, personal GitHub account, SSH `github-personal`). Use the `dbeihl` gh account here (`gh auth switch --user dbeihl`).
