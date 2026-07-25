# Plan — Trip intake: approved travelers add trips via the API

Status: **draft for discussion.** This document is the plan, not an implementation — nothing here is built yet. It came out of the post-#79 thesis review. Edit freely — the sections most likely to change are [Open questions](#open-questions) and [Build phases](#build-phases).

## The idea

Every flow in the product has a user-facing loop except one. A signed-in traveler can re-plan dates, apply natural-language edits, save scenarios, and watch live price deltas — but *adding a trip* is still a developer act: Claude Code, the add-trip skill, git, a PR, a build. This plan closes that gap: an approved traveler describes a trip on the site, the system researches and generates it, and the result arrives as an ordinary pull request that must pass the exact gates a hand-built trip passes (validator, 81-test suite, Astro build, Playwright smoke). Merge → Pages deploy → the traveler gets their planner URL.

The design principle behind every choice below: **git stays the source of truth, and generated output is untrusted until CI proves otherwise.** We are not building a second way for trips to exist — we are building a second way for PRs to originate.

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
    -> draft PR ("Closes #NN")
    -> human review -> merge -> Pages deploy
    -> issue closes; traveler gets the live URL
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

1. Derive the slug; fail early (comment on the issue) if it collides with an existing trip.
2. Run the generation — the add-trip skill's flow as an Action step: live research with sources recorded into `research/<slug>.md`, then a `TRIP` data module honoring the 2-adult cost convention, then the 3-line page.
3. Verify the diff touches **only** `research/<slug>.md`, `src/data/<slug>.js`, and `src/pages/<slug>-trip-planner.astro`. This is the prompt-injection containment: a malicious or confused "wish" must not be able to edit the engine, the workflows, or another trip.
4. Run the full gate: `npm test` (validator + both unit suites) and `npm run test:e2e` extended to smoke the new page.
5. Open a draft PR referencing the issue. Green + trusted requester may auto-merge later; the v1 default is human review.

Secrets: `ANTHROPIC_API_KEY`, `SERPAPI_KEY`, `DUFFEL_API_KEY` as Action secrets (research needs them); the Worker holds one new secret — a fine-grained GitHub token scoped to this repo only (contents, pull requests, issues).

## Guardrails

- **Quota:** start at 2 requests/user/day, plus a global monthly cap. Each generation spends real Claude + SerpAPI + Duffel money; the Action comments a rough cost figure on the issue so spend stays visible.
- **Diff containment:** step 3 above — generated changes are path-restricted, mechanically enforced.
- **The gates are the contract:** nothing merges that the validator, the unit suites, the build, and the smoke test don't pass. The 81 tests from #79 are what make this plan safe to build.
- **No second source of truth:** the pipeline produces PRs, never direct commits, and the site never reads trip data from anywhere but the built repo.

## Prerequisites (in order)

1. **TripData JSON Schema** — the Phase 2 that GENERALIZATION-PLAN.md deferred: formalize the `TRIP` shape as a real JSON Schema. It becomes the generator's authoring contract; `validateTrip` stays the runtime gate. (Data modules can stay `.js` for now; the schema documents the object they export.)
2. **Semantic validation** — extend `validateTrip` beyond key alignment: base nights must sum to `nights − 1` (documented as load-bearing in AI-RESEARCH-PLAN.md, currently unvalidated), dates must parse and order, rates/costs must fall in sane ranges. A generated trip can currently validate clean and still be nonsense.
3. **De-Japanize the remaining engine seams** — `moveData()`'s hardcoded Tokyo/Hakone/Kyoto cases and the single-bit optional-city model (`osakaMode`); generated trips will hit these first.

## Later complement — D1 draft tier (explicitly out of scope for v1)

A second connection — `POST` a full TRIP JSON into D1, view it instantly on a dynamic `?trip=<slug>` page — buys same-minute iteration at the cost of the offline/static invariant (network + sign-in at view time). If it's ever wanted, it lands as a *draft tier* whose "promote to static" button feeds this pipeline, so drafts graduate into the durable catalog and the D1 copy retires. Nothing in v1 blocks it; nothing in v1 needs it.

## Open questions

1. **Generator runtime** — a plain Claude API script in the Action vs. the Claude Code GitHub Action running the existing add-trip skill. The skill already encodes the research discipline; reusing it is less new prompt surface, but pins the Action to Claude Code's runner.
2. **Auto-merge policy** — is green CI ever sufficient, or does every generated trip get human eyes first? (v1 assumes human review; revisit after a few real runs.)
3. **Regeneration semantics** — a second request for an existing destination: new slug (`portugal-2`), update-in-place PR, or reject with a pointer to the existing trip?
4. **Trip retirement** — trips that didn't pan out accumulate in the hub; is deletion a PR someone asks for, or a `meta.archived` flag the hub respects?
5. **Cost figures** — confirm per-generation spend on a real run before setting the quota numbers.

## Build phases

Each phase is independently useful; stop after any of them and something real has shipped.

1. **Contracts first** — TripData JSON Schema + semantic validator extensions. No server changes; immediately hardens even hand-built trips.
2. **The spine, no AI** — Worker endpoint + allowlist + quota + issue + dispatch; an Action stub that just echoes the brief into a PR comment. Proves auth → ledger → dispatch → PR end-to-end for ~zero cost.
3. **Real generation** — wire the generator for one destination end-to-end; measure cost; tune the prompt against the gates.
4. **Polish** — status on the site (`GET /api/trips/:id`), quota tuning, auto-merge decision, and the hub badge for "requested by."
