# Plan — Trip intake: approved travelers add trips via the API

Status: **draft for discussion.** This document is the plan, not an implementation — nothing here is built yet. It came out of the post-#79 thesis review. Edit freely — the sections most likely to change are [Open questions](#open-questions) and [Build phases](#build-phases).

## The idea

Every flow in the product has a user-facing loop except one. A signed-in traveler can re-plan dates, apply natural-language edits, save scenarios, and watch live price deltas — but *adding a trip* is still a developer act: Claude Code, the add-trip skill, git, a PR, a build. This plan closes that gap: an approved traveler describes a trip on the site, the system researches and generates it, and the result arrives as an ordinary pull request that must pass the exact gates a hand-built trip passes (validator, 81-test suite, Astro build, Playwright smoke). Merge → Pages deploy → the traveler gets their planner URL.

The design principle behind every choice below: **git stays the source of truth, and generated output is untrusted until CI proves otherwise.** We are not building a second way for trips to exist — we are building a second way for PRs to originate.

## Decisions already made

| Question | Decision |
| --- | --- |
| Semantic validation (prerequisite 2) | **Yes** (2026-07-25) — **built** (same PR as this doc). `validateTrip` now checks dates (ISO, ordered, `nights` matches the span), the flex-night identity (`baseNights` sum to `nights − 1`), and cost sanity as hard errors with tight caps in `COST_CAPS` ($2,500/night lodging, $8,000 fares, $5,000 per activity/leg/rental item — ~2× the current data maxima; a legitimate outlier bumps the cap visibly). Impossible values (negative/NaN/non-numeric) fail everywhere. All 11 trips validate clean. The caps stay tight on purpose: this is a budget-travel product with the occasional splurge item, not a luxury one. |
| Generator runtime | **Hybrid** (2026-07-25). An API script does the research and emits a structured brief; a deterministic template writes the three files. Consequence: the TripData JSON Schema (prerequisite 1) is promoted from documentation to the literal output contract of the research call — the template is mechanical and cannot invent structure. |
| Auto-merge policy | **Auto-merge on green** (2026-07-25). A generated PR that passes the full gate merges and deploys with no human in the loop. Compensating controls, since the gates check sanity not research quality: the Action posts a what-shipped summary (route, nightly rates, grand total, per-run cost) on the request issue for post-hoc review, and the live strip already surfaces drift between shipped numbers and current pulls. |
| Regeneration | **New slug per request** (2026-07-25). A repeat destination gets a fresh slug (e.g. `portugal-nov-2028`); the pipeline never writes over an existing trip, which is what makes auto-merge safe for the curated catalog (Japan stays frozen). Update-in-place remains a manual, human-reviewed act outside this pipeline. |
| Trip retirement | **`meta.archived` flag** (2026-07-25). The hub demotes archived trips to a collapsed section (or hides them); pages still build so shared links survive. One-line PR either direction. Required consequence of new-slug-per-request — explorations accumulate by design. |
| Quotas | **2 requests/traveler/day, 10 generations/month globally** (2026-07-25), provisional. The Action posts each run's measured cost on the issue; revisit the numbers after the first month of real data. The global monthly cap is the control that actually protects the SerpAPI free tier (~100 searches/month), which is the binding constraint under the hybrid runtime, not dollars. |

## The flow

```
Traveler (signed in via Cloudflare Access)
    -> POST /api/trips { destination, dates, travelers, wishes }
    -> Worker: verify Access JWT -> creator allowlist -> daily quota (D1)
    -> Worker: open GitHub issue "Trip request: <destination>"   (the ledger)
    -> Worker: repository_dispatch { brief, issue_number }
    -> GitHub Action: generate research/<slug>.md
                      + src/data/<slug>.js
                      + src/pages/<slug>-trip-planner.astro
    -> full gate: validateTrip + unit suites + astro build + Playwright smoke
    -> PR ("Closes #NN") -> auto-merge on green -> Pages deploy
    -> issue gets the what-shipped summary; traveler gets the live URL
```

Latency is minutes, not seconds. That is fine — the use case is "we're considering Portugal," not autocomplete.

## The endpoint

`POST /api/trips`, gated by the same Cloudflare Access check as every other endpoint (`verifyAccess` — now fully unit-tested, including the spoofing paths).

Request body: `{ destination, arrive, depart, travelers, wishes, origin? }` — dates ISO, travelers a count, wishes free text.

Checks in order, each with its own status: Access JWT (401) → creator allowlist (403) → daily quota (429) → payload sanity (400). Success returns `202 { request_id, issue_url }`.

The allowlist starts as a Worker env var (`TRIP_CREATORS`, comma-separated emails) — same shape as the Access policy, zero new machinery. It can graduate to a D1 table if roles ever get richer.

A new D1 table backs quota and status:

```sql
CREATE TABLE trip_request (
  id            TEXT PRIMARY KEY,          -- uuid
  email         TEXT NOT NULL,             -- requester (from the verified JWT)
  brief_json    TEXT NOT NULL,             -- the exact request payload
  issue_number  INTEGER,                   -- the GitHub ledger entry
  status        TEXT NOT NULL,             -- 'queued'|'generating'|'pr-open'|'live'|'failed'
  created_at    INTEGER NOT NULL           -- epoch seconds
);
```

`GET /api/trips/:id` returns the row's status so the site can show "researching → in review → live" without polling GitHub from the browser.

## The request ledger (GitHub issue)

`repository_dispatch` leaves no visible artifact — a failed generation would vanish into an Actions log nobody reads. So the Worker opens an issue per request before dispatching, and the issue is the request's public record (this repo already tracks all work in Issues):

- Created by the Worker: title `Trip request: <destination> — <dates>`, body = the brief + requester, label `trip-request`.
- The Action comments progress on it and writes `Closes #NN` in the PR body, so merging closes it automatically.
- If generation or CI fails, the Action comments the failure and leaves the issue open — a visible queue of stuck requests instead of a silent one.

The alternative front door — GitHub issue forms as the *trigger*, no Worker endpoint — was considered and rejected: it moves auth from Cloudflare Access to GitHub, and the other three travelers would each need GitHub accounts. The site stays the front door; GitHub stays the ledger.

## The generation Action

A new workflow, triggered by `repository_dispatch` (type `trip-request`):

1. Derive the slug; a repeat destination gets a fresh suffixed slug (`portugal-nov-2028`) — the pipeline never overwrites an existing trip.
2. Run the generation, hybrid style: a research script calls the Claude API (web-searching one concern at a time, sources recorded into `research/<slug>.md`) and must emit a brief conforming to the TripData JSON Schema; a deterministic template turns that brief into `src/data/<slug>.js` and the 3-line page. The template cannot invent structure — everything creative is schema-constrained.
3. Verify the diff touches **only** `research/<slug>.md`, `src/data/<slug>.js`, and `src/pages/<slug>-trip-planner.astro`. This is the prompt-injection containment: a malicious or confused "wish" must not be able to edit the engine, the workflows, or another trip.
4. Run the full gate: `npm test` (validator + both unit suites) and `npm run test:e2e` extended to smoke the new page.
5. Open a PR referencing the issue with **auto-merge on green** enabled, and post the what-shipped summary (route, nightly rates, grand total, measured run cost) on the issue — that comment is the post-hoc review surface.

Secrets: `ANTHROPIC_API_KEY`, `SERPAPI_KEY`, `DUFFEL_API_KEY` as Action secrets (research needs them); the Worker holds one new secret — a fine-grained GitHub token scoped to this repo only (contents, pull requests, issues).

## Guardrails

- **Quota:** 2 requests/traveler/day, 10 generations/month globally (provisional — see Decisions). The Action comments each run's measured cost on the issue so spend stays visible; the monthly cap is what protects the SerpAPI free tier.
- **Diff containment:** step 3 above — generated changes are path-restricted, mechanically enforced.
- **The gates are the contract:** nothing merges that the validator, the unit suites, the build, and the smoke test don't pass. The 81 tests from #79 are what make this plan safe to build.
- **No second source of truth:** the pipeline produces PRs, never direct commits, and the site never reads trip data from anywhere but the built repo.

## Prerequisites (in order)

1. **TripData JSON Schema** — **built**: `schema/trip.schema.json` (draft 2020-12), derived from the field-presence union across all 11 shipped modules — universal fields are `required`, money is `number ≥ 0` with range policy staying in `validate.js` `COST_CAPS` (single source), and the two unexpressible invariants (2-adult totals, itinPool-holds-experience-only) ride in the descriptions the generator will read. `test/schema.test.mjs` keeps it honest: every shipped module must conform, and generator-shaped mistakes (string fares, misspelled scales, stray keys in cost shapes, non-ISO dates) must be rejected. Ajv is a devDependency — build/test-time only, nothing at view time. `validateTrip` stays the runtime gate; data modules stay `.js`.
2. **Semantic validation** (**approved** — see [Decisions already made](#decisions-already-made)) — extend `validateTrip` beyond key alignment: base nights must sum to `nights − 1` (documented as load-bearing in AI-RESEARCH-PLAN.md, currently unvalidated), dates must parse and order, rates/costs must fall in sane ranges. A generated trip can currently validate clean and still be nonsense.
3. **De-Japanize the remaining engine seams** — `moveData()`'s hardcoded Tokyo/Hakone/Kyoto cases and the single-bit optional-city model (`osakaMode`); generated trips will hit these first.

## Later complement — D1 draft tier (explicitly out of scope for v1)

A second connection — `POST` a full TRIP JSON into D1, view it instantly on a dynamic `?trip=<slug>` page — buys same-minute iteration at the cost of the offline/static invariant (network + sign-in at view time). If it's ever wanted, it lands as a *draft tier* whose "promote to static" button feeds this pipeline, so drafts graduate into the durable catalog and the D1 copy retires. Nothing in v1 blocks it; nothing in v1 needs it.

## Open questions

The original five were resolved 2026-07-25 — see [Decisions already made](#decisions-already-made). Still genuinely open:

1. **Measured cost per run** — the quota numbers are provisional until Phase 3 measures a real generation (Claude tokens + SerpAPI/Duffel calls). Revisit after the first month.
2. **Slug suffix convention** — the exact shape of repeat-destination slugs (`portugal-nov-2028` vs `portugal-2`); mechanical, decide when building the Action.
3. **Auto-merge escape hatch** — if a plausible-but-wrong trip ever ships, what's the trigger to flip back to human review? Proposal: any archived-within-a-week generated trip counts as a strike; two strikes flips the default.

## Build phases

Each phase is independently useful; stop after any of them and something real has shipped.

1. **Contracts first** — TripData JSON Schema + semantic validator extensions. No server changes; immediately hardens even hand-built trips.
2. **The spine, no AI** — Worker endpoint + allowlist + quota + issue + dispatch; an Action stub that just echoes the brief into a PR comment. Proves auth → ledger → dispatch → PR end-to-end for ~zero cost.
3. **Real generation** — wire the generator for one destination end-to-end; measure cost; tune the prompt against the gates.
4. **Polish** — status on the site (`GET /api/trips/:id`), quota tuning against the first month's measured costs, the `meta.archived` hub section, and the hub badge for "requested by."
