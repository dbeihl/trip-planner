# Go-live record — trip-planner API

Deployed 2026-07-21. This captures what's live and how to operate it. Setup details for each piece are in `worker/README.md`.

## What's running

| Piece          | Value                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------- |
| Worker         | `https://trip-planner-api.david-beihl.workers.dev` (`worker/`, deployed with `npx wrangler deploy`) |
| D1 database    | `trip-planner` (`96495dd1-a991-4742-b6b5-c482522e8e38`, in `wrangler.toml`)                         |
| Site           | `https://dbeihl.github.io/trip-planner/` (GitHub Pages, `deploy-astro.yml` on push to `main`)       |
| Panel wiring   | GitHub repo variable `PUBLIC_API_BASE` = the Worker URL (unset it to turn the panel off)            |
| Access (login) | Cloudflare Zero Trust app `trip-planner-api`, team domain `delicate-dust-d38a.cloudflareaccess.com` |

## Secrets set on the Worker

`ANTHROPIC_API_KEY` (AI briefing), `TICKETMASTER_API_KEY` (events), `CF_ACCESS_AUD` (Access JWT check). Rotate any of them with `cd worker && npx wrangler secret put <NAME>`.

Flight/lodging pricing now uses **Duffel** (fares) + **SerpAPI** (Google Hotels, and the Google Flights fallback) — the Amadeus adapter was removed after its self-service portal was decommissioned 2026-07-17. Pricing reports `configured: false` until the keys are set: create a free account at duffel.com and serpapi.com, then `cd worker && npx wrangler secret put DUFFEL_API_KEY` and `npx wrangler secret put SERPAPI_KEY` and redeploy. A `duffel_test_*` key returns synthetic fares (the response is labeled); swap in a live key when ready.

## Who can use it

The four travelers, via the Cloudflare Access allow policy `travelers` (emails). Sign-in is Cloudflare-hosted: hit any API URL, enter your email, type the one-time PIN it sends. The panel shows a sign-in link automatically if the browser hasn't done this yet. Sessions last **1 month** (raised from the 24h default so the PIN dance is rare — for a four-person family app the convenience wins; any session can be revoked instantly from the dashboard).

- **Add/remove a traveler:** Zero Trust → Access controls → Applications → `trip-planner-api` → policy `travelers` → edit the email list.
- **Session duration (owner action, one-time):** Zero Trust → Access controls → Applications → `trip-planner-api` → Settings → **Session Duration** → set to 1 month. Until that's done, sessions stay at the 24h default.
- **Revoke sessions:** same Application page → Revoke existing sessions (or remove the email from the `travelers` policy).
- **Gotcha (already configured, don't undo):** the app's Additional settings → CORS headers → **Bypass OPTIONS requests** must stay ON, or browser preflights get 403 and the panel dies with "Failed to fetch".

## Health check

`https://trip-planner-api.david-beihl.workers.dev/api/health` (behind sign-in) — expect `phase: 4`, `access: "enforced"`, `replan_configured: true`, `events_configured: true`.
