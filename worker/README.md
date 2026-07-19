# Trip Planner API — Phases 1–3

The research back end from [`AI-RESEARCH-PLAN.md`](../AI-RESEARCH-PLAN.md): a Cloudflare Worker + D1 that pulls free external data on demand and **logs every pull** (the log doubles as a read-through cache). Phase 1 proved the spine — **auth → fetch → log** — with Open-Meteo weather. Phase 2 added three more free sources (holidays, events, advisories) and an aggregate panel. Phase 3 adds the AI layer: a **date-change briefing** — Claude reads the fresh signals for a proposed window and explains what's better or worse. No paid pricing yet (Phase 4).

It is intentionally separate from the Astro site: the static planners keep working with no network, and this back end is a progressive enhancement the signed-in travelers can call.

## What it does

Give it a trip slug and it resolves the gateway city, country, and travel window, then answers from free sources — writing every external response to the `data_pull` table and serving repeats from it within each source's TTL.

```
GET /api/health                    -> status, known trips + sources, events-configured
GET /api/weather?trip=<slug>       -> seasonality (same window, prior year — climatology)
GET /api/holidays?trip=<slug>      -> public holidays in the window (Nager.Date)
GET /api/events?trip=<slug>        -> events near the gateway in the window (Ticketmaster)
GET /api/advisories?trip=<slug>    -> U.S. State Dept advisory level 1-4 (foreign trips)
GET /api/context?trip=<slug>       -> all of the above for one trip, in parallel
GET /api/replan?trip=<slug>&start=&end=  -> AI briefing: compare proposed dates to the trip's
GET /api/weather?lat=&lon=&start=&end=   -> explicit coords + ISO window (weather)
...&fresh=1                        -> bypass the cache on any data route
```

Sources and their cache TTLs: weather 30d, holidays 30d, advisories 1d, events 6h. Every call that reaches an external API inserts one `data_pull` row (provenance); the read path (`dedup_key` + TTL) is the cache. `data_pull` never stores API keys — secret query params are redacted before the endpoint is logged, and keys never appear in the cache-key params.

## One-time setup

```sh
cd worker
npm install

# 1. Create the D1 database, then paste the printed database_id into wrangler.toml
npx wrangler d1 create trip-planner

# 2. Apply the schema (local for dev, remote before deploy)
npm run migrate:local
npm run migrate:remote

# 3. Run locally (dev mode — Access not enforced)
npm run dev
#   curl 'http://localhost:8787/api/health'
#   curl 'http://localhost:8787/api/weather?trip=seoul' -H 'X-Dev-User: you@example.com'

# 4. Deploy
npm run deploy
```

## Cloudflare Access (the auth spine)

Access is configured in the Cloudflare dashboard, not in code — it fronts the Worker and only lets authenticated requests through, injecting a signed JWT the Worker verifies.

1. **Zero Trust → Access → Applications → Add** a self-hosted app for the Worker's hostname.
2. **Policy:** Allow, with an emails allowlist — the four travelers.
3. Copy the application **Audience (AUD) tag**, and note your team domain (`yourteam.cloudflareaccess.com`).
4. Set them on the Worker so verification turns on:

   ```sh
   npx wrangler secret put CF_ACCESS_AUD          # paste the AUD tag
   # add CF_ACCESS_TEAM_DOMAIN in wrangler.toml [vars] or as a secret
   ```

With both set, `src/access.js` verifies `Cf-Access-Jwt-Assertion` (issuer, audience, expiry, and the RS256 signature against Access's JWKS) on every `/api/*` call and records the authenticated email as `requested_by`. Unset, the Worker runs in **dev mode** and trusts an `X-Dev-User` header instead.

## Events key (optional)

Weather, holidays, and advisories need no key. Events use the Ticketmaster Discovery API — grab a free key at [developer.ticketmaster.com](https://developer.ticketmaster.com) (5,000 calls/day) and set it as a secret:

```sh
npx wrangler secret put TICKETMASTER_API_KEY
```

Without it, `/api/events` reports `configured: false` and the other routes are unaffected. The key is never written to `data_pull`.

## AI briefing (optional)

`/api/replan` asks Claude to compare a proposed window to the trip's original, grounded in the freshly-pulled signals for the new dates. It's the one AI job in Phase 3 — "explain what changed"; it does **not** re-price flights (Phase 4).

```sh
npx wrangler secret put ANTHROPIC_API_KEY
# optional: pick a model (defaults to claude-haiku-4-5)
#   set CLAUDE_MODEL=claude-sonnet-5 in wrangler.toml [vars]
```

Defaults to **Claude Haiku 4.5** (cheapest current-gen) per the plan; the call returns structured JSON (`summary`, `verdict`, per-aspect `changes`, `flags`, `recommendation`) and is itself logged to `data_pull` as `source='claude'` with an estimated `cost_usd`, so LLM spend is auditable alongside the data pulls. Without the key, `/api/replan` reports `configured: false`.

## Inspecting the log

```sh
npx wrangler d1 execute trip-planner --local \
  --command "SELECT source, http_status, status, ttl_seconds, requested_by, trip_id FROM data_pull ORDER BY fetched_at DESC LIMIT 10"
```

## Files

| File | Purpose |
| --- | --- |
| `src/index.js` | Router + the `/api/context` aggregate panel |
| `src/store.js` | `data_pull` cache/log helpers + `cachedFetch` (the shared spine) |
| `src/access.js` | Cloudflare Access JWT verification (RS256 / JWKS) |
| `src/trips.js` | slug → gateway coords + country, dates read from `../src/data/*.js` |
| `src/sources/weather.js` | Open-Meteo seasonality |
| `src/sources/holidays.js` | Nager.Date public holidays, filtered to the window |
| `src/sources/events.js` | Ticketmaster events (key-gated) |
| `src/sources/advisories.js` | U.S. State Dept advisory feed parse (level 1-4) |
| `src/sources/replan.js` | The Claude date-change briefing (structured output, cost-logged) |
| `migrations/0001_data_pull.sql` | The `data_pull` provenance + cache table |
| `wrangler.toml` | Worker + D1 binding + CORS/Access/events/AI vars |

## Not built yet

Flight/lodging pricing and the fare-aware re-cost (Phase 4 — blocked on the open ToS question of a cacheable price source). Full agentic tool-use (Claude calling the data-pull functions itself, rather than the Worker pre-gathering them) is a later refinement. See the plan.
