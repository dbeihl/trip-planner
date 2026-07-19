# Trip Planner API — Phase 1

The research back end from [`AI-RESEARCH-PLAN.md`](../AI-RESEARCH-PLAN.md), Phase 1: a Cloudflare Worker + D1 that proves the whole spine — **auth → fetch a free data source → log every pull** — with Open-Meteo weather seasonality. No AI yet (that's Phase 3); no paid APIs.

It is intentionally separate from the Astro site: the static planners keep working with no network, and this back end is a progressive enhancement the signed-in travelers can call.

## What it does

`GET /api/weather?trip=seoul` resolves the trip's gateway city (Seoul) and travel window, asks Open-Meteo for the **same calendar window one year earlier** (a climatology proxy for "is this a good week to go?"), distills it to avg high/low, total precipitation, and rainy-day count — and **writes the raw response to the `data_pull` table**. A second call inside 30 days is served from that logged row instead of re-fetching.

```
GET /api/health                    -> service status + known trips
GET /api/weather?trip=<slug>       -> seasonality for a trip's dates + gateway
GET /api/weather?lat=&lon=&start=&end=   -> explicit coords + ISO window
GET /api/weather?trip=seoul&fresh=1      -> bypass the cache
```

Every call that reaches an external API inserts one `data_pull` row (provenance), and the read path (`dedup_key` + TTL) is the cache.

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

## Inspecting the log

```sh
npx wrangler d1 execute trip-planner --local \
  --command "SELECT source, http_status, status, ttl_seconds, requested_by, trip_id FROM data_pull ORDER BY fetched_at DESC LIMIT 10"
```

## Files

| File | Purpose |
| --- | --- |
| `src/index.js` | Router, `data_pull` cache/log helpers, Open-Meteo endpoint |
| `src/access.js` | Cloudflare Access JWT verification (RS256 / JWKS) |
| `src/trips.js` | slug → gateway coords, dates read from `../src/data/*.js` |
| `migrations/0001_data_pull.sql` | The `data_pull` provenance + cache table |
| `wrangler.toml` | Worker + D1 binding + CORS/Access vars |

## Not in Phase 1

Holidays / events / advisories (Phase 2), the Claude re-plan (Phase 3), and any flight/lodging pricing (Phase 4 — blocked on the open ToS question). See the plan.
