# Personas

Two of the people the planner is built for, as they appear in the repo's own
data. The Playwright journeys in `e2e/journeys/` cite these. Facts here come
from `src/data/*.js` and `src/pages/calendar.astro`; update this file if those
change.

## David

- Flies from Indianapolis. Every trip's US flight group is labeled
  "From the USA — David (IND)" with `traveler: "David"`.
- Japan: his group is "From the USA — David (IND → Davao, home from Haneda)".
  He flies IND → Davao first, then DVO → KIX with Suzanne, and home from
  Haneda.
- Philippines: flies in from the US through Manila to Coron, and flies home
  out of Davao at the end. That last leg is his alone.
- Travels on the "Everyone" trips (Japan, Seoul) and the "David & Suzanne"
  trips (Thailand, Philippines).

## Suzanne

- Lives in Davao. On the Philippines trip her flight group is
  "From the Philippines — Suzanne (DVO)" with `traveler: "Suzanne"`, a
  domestic hop up to Coron to meet David.
- The Philippines trip ends with a week in Malita at her family's place; she
  stays there when David flies home.
- Same trip groups as David: "Everyone" and "David & Suzanne".

## What "their view" means in this app

There are no logins or private itineraries in the static site. Each person's
view is their own flight routing on a trip's Plan tab (one block per
traveler), the shared day-by-day itinerary, and the year calendar, which
colors trips by traveler group. The journeys test those.

## Shared views

- `calendar.html`: the "David & Suzanne" group and its trips, plus the
  "Everyone" trips, linked to each planner.
- Each trip's Itinerary tab, which both see.
