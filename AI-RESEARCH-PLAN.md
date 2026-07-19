# Plan — Teach the planner to do its own research & AI analysis

Status: **draft for discussion.** This document is the plan, not an implementation — nothing here is built yet. It came out of a deep-research pass (6 angles, 28 sources, 24 claims confirmed under adversarial verification) plus codebase-specific integration notes. A rendered version with the same content lives as a private Claude artifact; this markdown is the version of record. Edit freely — the sections most likely to change are [Open questions](#open-questions) and [Build phases](#build-phases).

Every recommendation is tagged by how well the research backs it:

- **[verified]** — research-backed and cited (Anthropic platform docs, the Ticketmaster developer portal, U.S. State Department feeds).
- **[my call]** — engineering judgment on a landscape the research crawler couldn't cite cleanly (mostly bot-blocked vendor pages and SEO blog-spam).
- **[open]** — a genuine gap that needs a focused follow-up look before building.

## The idea

Make the site *do more research*: when a signed-in traveler changes a trip's dates, go pull the relevant external data (weather, events, holidays, advisories, flight/lodging prices), store **every** pull in a database for provenance and caching, and let Claude re-cost the trip, flag what changed, recommend better windows, and take natural-language edits. One user-facing flow drives the whole design: **change the dates → see an updated, sourced plan.**

## The one thing to internalize first

This is a real architectural shift, not a feature. The planner today is a static Astro build on GitHub Pages with **no network at view time** — that is a load-bearing invariant in `CLAUDE.md`. "Log in" and "store data pulls" both require a server. The good news: at four travelers the shift is small and cheap, and it grafts onto the existing engine without disturbing the static planners.

## The recommendation in one paragraph

Keep the Astro front end exactly as is. Add a thin **Cloudflare Workers** back end with a **D1** (SQLite) database. Put one **Cloudflare Access** gate in front for the four of you (David, Suzanne, Mike, Sherry). On a date change, a Worker fans out to a handful of free-tier data APIs (weather, holidays, events, advisories) plus one flight/price source, writes every response into a **provenance/cache table**, and hands the distilled facts to **Claude Haiku 4.5** (escalating to Sonnet 5 for the hard re-plans) to re-cost the trip, flag what changed, and answer natural-language edits. Realistic bill: **a few dollars a month**, dominated by whichever flight API is chosen — everything else fits inside free tiers.

## The date-change loop

```
Traveler changes dates (Astro page)
      -> Cloudflare Access (4 allowed emails)
      -> Worker /replan (orchestrator)
      -> Cache hit? query D1 by dedup key
           fresh  -> reuse stored pulls
           stale/miss -> fan out to data APIs (weather, holidays, events, advisories, flights)
                       -> write every response to data_pull (raw + meta + TTL)
                       -> reuse
      -> Claude tool-use (Haiku 4.5 -> Sonnet 5)
      -> re-cost, flag changes, recommend windows, NL edits
      -> return updated TRIP delta + cited rationale
      -> back to the page
```

The cache check *before* the fan-out is what keeps both the API bills and the token bills near zero — most re-plans reuse the previous day's pulls.

## Platform & storage — [my call]

Adversarial verification killed every sourced claim in this section — not because the tools are bad, but because the 2026 comparison content is mostly bot-blocked vendor pages and SEO blog-spam that couldn't be cited cleanly. Treat it as experienced judgment, not fact-checked findings.

- **Recommended: Cloudflare Workers + D1.** Natural fit for a static-site owner: the Pages deploy and the API live on one platform, one `wrangler` CLI, one bill. D1 is managed SQLite — right-sized for a four-person dataset — and KV gives a dead-simple TTL cache in front of it. The free tier realistically covers this scale forever. Secrets live in Worker bindings, never in the browser.
- **Viable alternative: Vercel Functions + Neon or Supabase.** If writing the API in the same Astro repo with zero context-switching matters more, Vercel functions + Neon (serverless Postgres) or Supabase (Postgres + auth in one) is the other sane path. Supabase folds auth in, which is tempting — but for four known people it is more machinery than the job needs.
- **Auth for exactly four people.** Don't build a login system. **Cloudflare Access** puts a Google/email gate in front of the whole app with a four-address allowlist and no code — everyone signs in with accounts they already have. On the Vercel path, Supabase Auth or Clerk's free tier both do magic-link sign-in with minimal glue. Rolling a password store for four users would be the wrong kind of effort.

## The data sources

What to pull on a date change, per domain. Two rows are nailed to primary sources; the flight/lodging and weather rows are recommendations from a landscape the crawler couldn't cite (vendor pricing pages 403'd the research agents — a recurring theme worth knowing about).

| Domain | Pick | Cost | Notes & limits | Backing |
| --- | --- | --- | --- | --- |
| Weather & seasonality | Open-Meteo (climate + historical) | free | No key for non-commercial use; historical normals answer "is this a good week to go." NOAA/NCEI as fallback. | [my call] |
| Holidays | Nager.Date | free | Public holidays per country/year, no key. Cheapest "will things be closed / crowded" signal. | [my call] |
| Events & festivals | Ticketmaster Discovery API v2 | free | **5,000 calls/day, 5 req/s per key.** Watch two things: ToS/branding constraints on displaying the data, and a deep-paging cap (`size × page < 1000`). | [verified] |
| Travel advisories | U.S. State Dept RSS/XML -> self-hosted JSON | free | Official feeds, structured threat levels 1–4. Normalize into your own DB — no paid advisory API needed. *Covers advisories, not visa rules.* | [verified] |
| Visa / entry rules | Sherpa or a RapidAPI visa source | freemium | The genuinely unsolved one — structured, machine-readable visa data is mostly commercial. See open questions. | [open] |
| Flights & lodging | Amadeus Self-Service (start here) | freemium | Highest-value, least-settled row: which provider has a truly usable free tier *and* ToS that permit caching prices is the top open question. Amadeus test env is the usual start; Duffel / Kiwi / Travelpayouts are alternates. | [open] |

**The honest gap:** the two rows that matter most to a *budget* that rebuilds on a date change — flights and visas — are the two the research couldn't close. That is not a dead end; it is a focused next step (one afternoon of reading each provider's actual ToS and free-tier fine print). Everything else is ready to wire up now.

## Storing every pull — [my call]

Logging all data pulls is exactly the right instinct — it is what makes the app cheap (cache before you re-fetch), auditable ("where did this $612 fare come from, and when?"), and debuggable. One table does provenance and cache at once. A dedup key (source + normalized params) plus a `fetched_at` and a per-source `ttl` is the whole trick.

```sql
-- D1 / SQLite. One row per external API call, ever.
CREATE TABLE data_pull (
  id            TEXT PRIMARY KEY,          -- uuid
  source        TEXT NOT NULL,             -- 'open-meteo' | 'ticketmaster' | 'amadeus' ...
  endpoint      TEXT NOT NULL,             -- which call
  dedup_key     TEXT NOT NULL,             -- source + sha256(sorted params) — the cache key
  params_json   TEXT NOT NULL,             -- exact request params
  response_json TEXT,                      -- raw body (the provenance record)
  status        TEXT NOT NULL,             -- 'ok' | 'error'
  http_status   INTEGER,
  fetched_at    INTEGER NOT NULL,          -- epoch seconds
  ttl_seconds   INTEGER NOT NULL,          -- weather ~30d, fares ~6h, advisories ~1d
  cost_usd      REAL DEFAULT 0,            -- if the source meters
  trip_id       TEXT,                      -- which trip triggered it
  requested_by  TEXT                       -- which of the 4 users
);
CREATE INDEX idx_pull_lookup ON data_pull (dedup_key, fetched_at DESC);
```

The read path is one query: *"most recent row for this dedup key where `fetched_at + ttl_seconds > now`."* Hit → reuse. Miss → fetch, insert, return. Two things to respect: **TTLs are a licensing question, not just a performance one** — weather/holiday data is permissive to cache for weeks; *flight prices are often contractually short-lived*, so keep fare TTLs tight (hours) and re-verify before anyone books. Store the raw body for provenance, distill to a compact fact before it ever reaches Claude.

## The AI layer — [verified]

This is the part the research stands behind fully — primary Anthropic docs, adversarially checked. It is also where the design is genuinely elegant: instead of brittle glue that pulls data *then* calls the model, give Claude the pull functions **as tools** and let it orchestrate — decide what to fetch, read the DB cache, and reason over the results in one loop.

**Model choice — cost-optimized:**

| Model | Input / output (per MTok) | Use it for |
| --- | --- | --- |
| **Claude Haiku 4.5** (default) | $1 / $5 | The workhorse — most date-change re-costs, cache lookups, NL edits. Cheapest current-gen model. |
| **Claude Sonnet 5** | $3 / $15 ($2/$10 intro through Aug 31, 2026) | Escalate for the hard jobs: full re-plans, "find me a cheaper week," multi-option pros/cons briefs. |

**Three techniques that keep the token bill in the cents:**

- **Prompt caching.** Cache reads cost **0.1×** base input; a 5-minute cache pays for itself after a single re-read. Put the stable stuff first — tool definitions, the trip schema, the system prompt — and mark the last block; the volatile date query goes last. At this volume it is the single biggest lever.
- **Programmatic tool calling.** Claude writes a short script that orchestrates the data-pull tools in a sandbox, and only the *distilled* result enters its context — not five raw API blobs. Anthropic reports ~20–40% token savings on multi-tool requests.
- **Structured outputs (JSON schema).** Constrain the re-plan result to a schema so you get back a clean `TRIP` delta you can apply directly. One caveat the research surfaced (and disproved a myth on): it does *not* guarantee zero retries — keep a validation fallback.

**All four jobs map onto one tool-use agent:** re-cost & re-plan on a date change, recommend the best window from price + weather + crowds, natural-language edits ("push Kyoto a day later"), and compare/summarize options. Same tools, same DB, different prompt.

## What it costs

At four users the LLM spend is genuinely trivial — a Haiku re-plan with prompt caching on the stable prefix runs from a fraction of a cent to low single-digit cents per interaction. A full monthly figure can't be pinned down until the flight-API tier is chosen, since that is the one variable cost.

| Line item | Monthly, personal scale | Backing |
| --- | --- | --- |
| Cloudflare Workers + D1 + KV + Access | $0 (free tier) | [my call] |
| Weather · holidays · events · advisories | $0 (free tiers) | [verified]* |
| Claude API (Haiku-led, cached) | ~$0–3 | [verified] |
| Flight / lodging API | ? (the swing factor) | [open] |
| **Realistic total** | **a few $/month** | est. |

*Events (Ticketmaster) and advisories (State Dept) free tiers are verified; weather/holidays free tiers are a read of an uncited landscape.

## How it grafts onto this codebase

This is the part no generic research report can give you, and where your own judgment matters most. The planner has a clean seam that makes this addition low-risk if respected.

- **Keep the static planners static.** Every existing trip page (`japan-trip-planner.html`, etc.) must keep working with no network — that's the invariant, and it's what lets you show these to anyone offline. The AI features live behind the login as a **progressive enhancement**: an authed traveler gets a "re-plan these dates" affordance that calls the Worker; everyone else sees the planner exactly as it is today.
- **The `TRIP` object is already the right interface.** The engine reads everything through one data object per trip (`src/data/<trip>.js`) with its `meta.dates`, `flights`, `hotels`, `transport`, `itinPool`. The AI layer's job is to propose a **diff to that object** — new fares, shifted nights, a re-costed total — which the existing `recalc()` already knows how to render. You are not bolting on a parallel system; you are feeding the one you have.
- **Where the data flows in.** The cleanest split: the Worker owns *fetching, caching, and the Claude call*; it returns a validated `TRIP` delta; a small client module applies it to `window.__state` and re-runs `recalc()` / `renderItinerary()`. The engine stays vanilla JS with no CDNs, per the editing conventions — the network lives entirely in the Worker, never in the view.

### Three invariants the AI must honor or it silently corrupts the budget

1. **Every cost is a 2-adult total** — the engine scales by `personFactor` and `vehicleFactor`. Any fare Claude writes back must follow the same convention (we hit exactly this when adding Seoul).
2. **`itinPool` holds experience only** — no hotels, transport, or costs; those are injected at render from `window.__state`. The AI edits the budget inputs, not the narrative day.
3. **Base nights sum to `nights − 1`** so the flex-night math lands — a date change that alters trip length has to keep that identity true.

## Build phases

Each phase is independently useful — you could stop after any one and have shipped something real.

1. **Stand up the back end** — [my call] — A Worker + D1 + the `data_pull` table + Cloudflare Access. One dumb endpoint that fetches Open-Meteo for a trip's city and logs it. Proves the whole spine — auth, fetch, store — with a free API.
2. **Wire the free data domains** — [verified sources] — Add holidays (Nager.Date), events (Ticketmaster), advisories (State Dept feed). Now a date change produces a real "here's what's happening that week" panel — no AI yet, no cost.
3. **Add Claude, one job first** — [verified] — Haiku + tool-use + prompt caching. Ship *re-cost & explain what changed* only. Structured-output a `TRIP` delta, apply it, re-render. This is the "wow" moment and it is the cheapest of the four jobs.
4. **Close the flight/visa gaps** — [open] — Resolve the two open questions (usable flight tier + ToS; a visa source), then light up the remaining three AI jobs — best-window recommendations, NL editing, option briefs — on the same agent.

## Risks & gotchas

- **Pricing ToS.** Flight/hotel APIs frequently restrict how long you may cache or display fares — keep fare TTLs short and re-verify before booking. Weather/holidays are permissive.
- **Secrets.** Every key lives in Worker bindings, never the browser — the whole reason a static site can't do this today.
- **Model drift.** Sonnet 5's intro pricing expires Aug 31, 2026; re-check model IDs and rates before building.

## Open questions

1. Which flight/price API has a usable free tier *and* cache-permitting ToS. **(highest value)**
2. Cloudflare vs Vercel + the auth pick, confirmed against your comfort with each.
3. A free/cheap structured *visa* source (distinct from advisories).
4. Final TTL policy per source, checked against each ToS.

## Bottom line

The AI half of the idea is a solved problem and cheap — Claude-as-orchestrator over logged pulls is exactly the right shape, and it drops onto the `TRIP` model cleanly. The unsolved half is boringly practical: picking a flight-price source you're allowed to cache. Recommended path: build Phases 1–3 on free data to prove the loop end-to-end, *then* spend an afternoon on the flight-API fine print before committing.
