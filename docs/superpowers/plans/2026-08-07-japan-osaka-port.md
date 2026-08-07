# Japan Osaka-Restructure Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the finalized Japan trip (Tokyo 3 / Hakone 1 / Osaka 3 + flexible night defaulting to Osaka; Kyoto as a day trip) from the archived `japan-travel` repo into trip-planner's `src/data/japan.js`, making trip-planner the canonical home of the trip.

**Architecture:** `japan.js` becomes a normal 3-stop data module like `italy.js` (route `["tokyo","hakone","osaka"]`, `optionalCities: []`, own `itinDepart`, generic leg ids, no `when:` gating) so the engine's dormant Japan-hardcoded branches never fire. One small engine change generalizes route-detail rendering to any leg id. Everything is gated by the existing validator + schema tests + Astro build + e2e smoke.

**Tech Stack:** Astro 7, vanilla-JS engine (`src/scripts/engine.js`), ajv schema validation, node --test, Playwright e2e.

**Source of truth for content:** `/Users/davidbeihl/git/japan-travel/japan-trip-planner.html` at merge commit `c6378dc` (the restructured single-file planner — local clone of the now-archived repo). All rates/fares there are live-researched and sourced; port them verbatim, do NOT re-research.

## Global Constraints

- Every cost is a 2-adult total in USD; the engine scales by `personFactor = N/2` and vehicle legs by `ceil(N/4)`.
- `itinPool` holds experience only — no hotel names, transport modes, or costs in day content.
- No `when:` key anywhere in the new `japan.js` (with `optionalCities: []` the osaka-gating vocabulary silently zeroes legs — see budget.js:34).
- New-model leg ids must NOT collide with the engine's Japan-hardcoded ids where a pair-check fires: never ship both `airport` AND `th` ids together (engine.js:1200 breakdown branch), and never reuse `hk`, `kyotoOsaka`, `osakaAirport`, or `final` as ids.
- `meta.dates` stay `2026-11-14` → `2026-11-22`, `nights: 8`; baseNights over `route` must sum to 7 (validator invariant).
- Gates that must pass before any commit claims done: `npm run validate`, `npm test`, `npx astro build`. Final task also runs `npm run test:e2e`.
- Branch `port/japan-osaka` off `main`; PR at the end; never commit to `main`. Use the `dbeihl` gh account.
- Repo style: vanilla JS, 2-space indent, data modules default-export one object; match `italy.js` structural conventions where japan diverges from the old optional-osaka shape.

---

### Task 1: Rewrite `src/data/japan.js` to the restructured trip

**Files:**
- Modify: `src/data/japan.js` (full rewrite of the module body; keep the default-export shape)

**Interfaces:**
- Produces: route `["tokyo","hakone","osaka"]`; leg ids `airport-arrive`, `t-h`, `h-o`, `daytrip`, `depart`; itinPool ids `t-arrive`,`t-tsukiji`,`t-gyoen`,`t-shopping`, `h-arrive`,`h-full`, `o-arrive`,`o-daytrip`,`o-food`,`o-shrines`; `itinDepart` present. Task 2 wires route-detail rendering to these leg ids; Task 3's docs reference this shape.

- [ ] **Step 1: meta** — `route: ["tokyo","hakone","osaka"]`, `optionalCities: []`, `flexNightDefault: "osaka"`, dates/travelers/currency/lodgingTaxBuffer/destLabel unchanged, `visaForm: true` kept. Update `reference.caveat` to the restructured wording (quote was for a Kyoto-base route on placeholder Nov 7–14 dates — route AND dates both differ; the delta compares ground costs only, Kensington excluded airfare). Update `hub.meta`/`hub.blurb` to say Tokyo → Hakone → Osaka with a Kyoto day trip.

- [ ] **Step 2: hotels** — `tokyo` (baseNights 3) and `hakone` (baseNights 1) carried over unchanged; `kyoto` DELETED; `osaka` becomes a base: `baseNights: 3`, four Namba options ported from the source file with the re-quoted Nov 18–22 rates — Citadines Namba Osaka $235 (`current: true`, 9.0), Fairfield by Marriott Osaka Namba $164 (8.8), Hotel Forza Osaka Namba $150 (8.8), Henn na Hotel Express Osaka Namba Nipponbashi $109 (8.7); copy each option's `note` from the source file. Sum check: 3+1+3 = 7 = nights−1. ✓

- [ ] **Step 3: transport.legs** — five legs, generic shape (mirror `italy.js` leg conventions; each keeps the repo's `{id, routeName, role?, modes/flat/fixed, scale}` shape as the schema requires):
  1. `airport-arrive` — role arrival, NRT/HND variants and public/private modes ported verbatim from the current japan.js `airport` leg (fares unchanged: nrt 43/148, hnd 6/56). Renamed id so the engine.js:1200 hardcoded pair-check can never fire.
  2. `t-h` — Tokyo→Hakone, public 30 / private 340 (unchanged fares, new id).
  3. `h-o` — Hakone→Osaka: bookend modes public 15 / private (taxi) 63 + `fixed` Shinkansen add-on 163 (Hikari Odawara→Shin-Osaka; note that Nozomi skips Odawara).
  4. `daytrip` — Osaka⇄Kyoto day trip, flat 17 (Keihan via Yodoyabashi to Gion-Shijo, round trip), cost role (not an inter-stop move).
  5. `depart` — role departure, Osaka→KIX flat 18 (Nankai ticketless/IC).
  No `when:` keys anywhere. Scales: public/flat legs person-scaled, private modes vehicle-scaled — match how the current japan.js encodes `scale` per mode.

- [ ] **Step 4: activities** — keys `{tokyo, hakone, osaka}`. Tokyo/hakone ported unchanged. `osaka` ported from the source file's restructured `ACTIVITIES.osaka` (Kyoto-day-trip upgrades like the Sagano railway under a "Kyoto day trip" title + any Osaka-day options), including each option's researched cost and the free self-guided defaults. If the schema/engine requires a `day` field, set it consistently with each activity's pool day (day-trip activities on the `o-daytrip` day).

- [ ] **Step 5: itinPool + itinDepart + visaPlan** — port from the source file verbatim (content already written and reviewed there): tokyo 4 days (`t-arrive`, `t-tsukiji`, `t-gyoen`, `t-shopping` — the shopping-day rewrite; rename from the source's `t-daytrip` id to `t-shopping` and update any visaPlan key accordingly), hakone 2 days, osaka 4 days (`o-arrive` move `h-o` lodging `osaka`, `o-daytrip` move `daytrip`, `o-food`, `o-shrines`). Add `itinDepart` (the source's static Osaka→KIX depart day — `move: "depart"`). Rebuild `visaPlan` so every key matches a new pool id plus `"depart"`. Kyoto pool days deleted. `routeDetail` keyed by the new leg ids: `airport-arrive` (nrt/hnd variants), `t-h`, `h-o` (Odawara Hikari steps + sparse-schedule note), `daytrip` (Keihan route steps), `depart` (Nankai) — port step content from the source file's ROUTE_DETAIL.

- [ ] **Step 6: run the gates**

Run: `npm run validate && npm test`
Expected: validator returns no errors for japan.js (baseNights sum, pool/leg id resolution, cost caps); schema + validate + budget + ics + xlsx tests all pass. Fix any violation by correcting the data shape — never by weakening the validator.

- [ ] **Step 7: build + eyeball**

Run: `npx astro build`
Expected: clean build. Then serve `dist/` (`npx astro preview`) and load `/trip-planner/japan-trip-planner.html`: nights read 3/1/4 with the flexible night on Osaka, grand total is finite and plausible (lodging 2,337×1.25 + transport 286 + flights; flights component per the module's flight picks), no console errors, itinerary renders 9 days ending Osaka→KIX.

- [ ] **Step 8: Commit** — `git add src/data/japan.js && git commit -m "Port restructured Japan trip: Tokyo/Hakone/Osaka bases, Kyoto day trip"`

---

### Task 2: Generalize route-detail rendering in the engine

**Files:**
- Modify: `src/scripts/engine.js` (route-detail wiring: currently hardcoded to `ROUTE_DETAIL.th`/`.hk` at ~411-414 and `.airport`/`.final` at ~996-1003)

**Interfaces:**
- Consumes: Task 1's leg ids and `routeDetail` keys (`airport-arrive`, `t-h`, `h-o`, `daytrip`, `depart`).
- Produces: any leg whose id has a `TRIP.routeDetail[<id>]` entry renders its `<details>` breakdown; trips without routeDetail are unaffected.

- [ ] **Step 1: read the current wiring** — locate every place engine.js reads `ROUTE_DETAIL` / renders `rd-*` containers and how the arrival leg's nrt/hnd variant selection works today.

- [ ] **Step 2: generalize** — render a route-detail block for ANY leg id present in `TRIP.routeDetail`, driven by the legs array (variant sub-keys like `{nrt, hnd}` still resolved by the arrival leg's selected mode/airport, mirroring the existing airport logic). Keep the old literal-id paths only if another data module still needs them (grep `src/data/*.js` for routeDetail keys — currently only japan uses routeDetail at all; if so, the literal paths can be replaced outright). Smallest diff that makes Task 1's five keys render.

- [ ] **Step 3: gates + visual check**

Run: `npm run validate && npm test && npx astro build`
Expected: all pass. Preview: the Hakone→Osaka leg shows the Hikari/Odawara steps, the day-trip leg shows the Keihan steps, airport detail still switches with NRT/HND. Other trip pages (spot-check italy) unchanged, no console errors.

- [ ] **Step 4: Commit** — `git commit -am "Render route details for any leg id, not just the legacy Japan ids"`

---

### Task 3: Docs — retire the japan-travel framing

**Files:**
- Modify: `CLAUDE.md` (repo root of trip-planner)
- Modify: `README.md` (the "Why this repo exists" / status framing)

- [ ] **Step 1: CLAUDE.md** — rewrite the stale claims: `japan-travel` is archived (2026-08-07); this repo is now the canonical home of the live Japan trip; `japan.js` is no longer a frozen reference seeded from japan-travel — it IS the trip (Tokyo → Hakone → Osaka, Kyoto day trip, Nov 14–22 2026). Keep the warning about not pushing to `dbeihl/japan-itinerary` but reframe: that Pages repo serves the last japan-travel deploy as the shareable link; updating it is a manual, ask-first act. Keep all engine/editing conventions unchanged.

- [ ] **Step 2: README.md** — same reframing in the status paragraph, one or two sentences; don't restructure the file.

- [ ] **Step 3: gates** (docs don't affect them, but run to keep the invariant that every commit is green): `npm run validate && npm test`

- [ ] **Step 4: Commit** — `git commit -am "Retire the japan-travel framing: trip-planner is canonical for the Japan trip"`

---

### Task 4: Full verification, PR, Codex review

- [ ] **Step 1: e2e** — `npm run test:e2e` (Playwright smoke incl. japan page). Expected: pass.

- [ ] **Step 2: browser matrix (compact)** — on `npx astro preview`: default nights 3/1/4; flexible-night stepper moves the 8th night Tokyo/Hakone/Osaka and totals track; traveler count scales public vs private legs correctly; hotel tier switch updates total; itinerary tab: 9 days, day-trip day carries its move row + cost, depart day Osaka→KIX; exports (text/xlsx) run without errors; hub page card for Japan shows the new route blurb.

- [ ] **Step 3: PR** — push `port/japan-osaka`, `gh pr create --base main` titled "Port restructured Japan trip (Tokyo/Hakone/Osaka, Kyoto day trip)" with a body summarizing: content ported verbatim from the reviewed japan-travel restructure (PR #12 there), the leg-id strategy (dormant hardcoded branches), the route-detail generalization, and the docs reframing.

- [ ] **Step 4: Codex review** — run `codex-review` on the new PR per the standing rule; fix majors and re-review until approve (max 3 rounds).
