# Plan — Turn the Japan planner into a general trip-planning tool

Status: **draft for discussion.** This document is the plan, not an implementation. Nothing here is built yet. Edit freely in the terminal — the sections most likely to change are [Open decisions](#open-decisions) and [Build phases](#build-phases).

## The idea

Today `japan-trip-planner.html` is a single self-contained file where the *trip logic* (a cost engine + an itinerary view of the same state) and the *Japan data* (specific hotels, fares, activities, day-by-day content) are interleaved as inline JS constants. It is wildly useful for the Japan decision — the goal is to make that same experience reproducible for **any** destination: pick a place, describe what you want in plain language, and get back the same kind of planner (budget ledger + sendable itinerary), sourced from real prices.

The whole plan reduces to one architectural move: **separate the trip-agnostic engine from the trip-specific data, then generate the data.**

## Decisions already made

From the earlier grilling:

| Question | Decision |
| --- | --- |
| What the AI produces | **Full trio** — the interactive planner, a DIY-research doc, and a trip guide (the same set that exists for Japan). |
| Data accuracy | **Live-sourced**, not knowledge-ballpark — real hotel/transport/activity prices for the specific dates. |
| Usage model | **One trip at a time** — generate a fresh self-contained planner per destination you're considering; keep the ones worth keeping. No multi-trip hub (yet). |
| AI plumbing | **Claude Artifact** was the stated preference — but see the conflict below; it forces a choice. |

## The conflict to resolve (this drives the whole architecture)

"Claude Artifact" and "live-sourced pricing" cannot both be true *inside one self-contained Artifact*. An Artifact reaches the model only through `window.claude.complete`, which is a **text-only completion — no web browsing, no search, no tools.** So the live-fetch research that produced the real Japan numbers (Booking.com, Rakuten, carrier fares) cannot run from inside the Artifact.

Three ways out:

1. **Hybrid — Claude Code researches, the planner renders (recommended).** You tell Claude Code the destination + what you want; Claude Code does the live web research with real tools and emits a `TripData` JSON (plus the trio docs). The planner HTML is a fixed **renderer** that loads that data. The "describe your trip → AI" step lives in Claude Code, where the web tools actually are. Keeps live accuracy *and* the full trio; the tradeoff is the generation step runs in Claude Code, not inside a standalone Artifact.
2. **Two-step paste bridge.** The Artifact's text box builds a research prompt; you run it in a normal Claude chat (which *does* have web search), then paste the returned JSON back into the Artifact, which renders it. Stays a pure Artifact with live data, at the cost of a manual copy/paste round-trip per trip.
3. **In-Artifact estimates only.** Accept that `window.claude.complete` gives knowledge-based ballparks (no live prices), clearly labeled as estimates. Cleanest single-textbox UX, but the numbers stop being live-sourced — which contradicts the accuracy decision above.

**Recommendation: option 1.** It's the only one that satisfies both "full trio" and "live-sourced" without a manual round-trip, and it plays to where the real tools are. The rest of this plan assumes option 1; if we pick 2 or 3 the schema and renderer are unchanged — only the *generation* half differs.

## Target architecture

Two layers with a clean seam between them:

```
┌─────────────────────────────────────────────────────────────┐
│  ENGINE (trip-agnostic, written once)                        │
│  planner-template.html                                       │
│   • recalc()  → cost model + window.__state                  │
│   • renderItinerary() → view of __state                      │
│   • all render/export/modal logic                            │
│   • loads TripData from a single inlined `const TRIP = {…}`   │
└─────────────────────────────────────────────────────────────┘
                          ▲  loads
                          │
┌─────────────────────────────────────────────────────────────┐
│  DATA (trip-specific, generated per destination)             │
│  TripData JSON  — flights, hotels, transport, activities,    │
│                   route detail, itinerary pool, scalars,     │
│                   meta (dates, travelers, reference quote)    │
└─────────────────────────────────────────────────────────────┘
```

Generation (option 1) is a separate step that produces the DATA layer and the two companion docs:

```
destination + free-text wishes
        │
        ▼
Claude Code  ── live web research (hotels, fares, activities) ──►  TripData JSON
        │                                                          + DIY-research.md
        │                                                          + trip-guide.md
        ▼
inline TripData into a copy of planner-template.html  →  <place>-trip-planner.html
```

Each generated trip is still **one self-contained file**, exactly like today — the template is just no longer Japan-specific.

## The `TripData` schema

Derived directly from the constants that exist in `japan-trip-planner.html` today, generalized so no field assumes Japan. Field shapes are copied from the live file so the engine barely changes.

```jsonc
{
  "meta": {
    "title": "Japan — Nov 2026",
    "route": ["Tokyo", "Hakone", "Kyoto"],          // ordered city keys
    "dates": { "arrive": "2026-11-14", "depart": "2026-11-22", "nights": 8 },
    "travelers": { "count": 2, "note": "2 adults, separate arrival flights" },
    "currency": "USD",
    "reference": {                                   // optional packaged-quote comparison
      "total": 9644,
      "label": "Kensington Tours quote",
      "caveat": "Placeholder dates Nov 7–14; not apples-to-apples."
    },
    "lodgingTaxBuffer": 1.25                          // lodging-only planning margin
  },

  "flights": {                                        // keyed by traveler-journey; optional
    "us": { "label": "...", "traveler": "...", "pax": 1, "preference": "...",
            "options": [ { "name": "...", "route": "...", "stops": 1,
                           "cabin": "...", "fare": 2150, "note": "...", "current": true } ] }
  },

  "hotels": {                                         // keyed by city
    "tokyo": { "label": "Tokyo", "baseNights": 3,
               "options": [ { "name": "...", "rate": 229, "rating": "8.9",
                              "note": "...", "current": true } ] }   // rate = per-night, 2-adult total
  },

  "transport": {                                      // per leg; shape mirrors current TRANSPORT
    "airport": { "nrt": { "public": 43, "private": 148 } },
    "legs": [ { "id": "tokyoHakone", "public": 30, "private": 340 },
              { "id": "hakoneKyoto", "public": 12, "private": 52 } ],
    "fixed":  [ { "id": "shinkansen", "cost": 152, "scale": "person" } ]
  },

  "activities": {                                     // keyed by city; costs are 2-adult totals
    "tokyo": [ { "day": 2, "title": "...",
                 "options": [ { "name": "Self-guided (free)", "cost": 0,
                                "note": "...", "current": true } ] } ]
  },

  "routeDetail": {                                    // walk/wait/ride sub-segments per leg
    "airport": { "nrt": { "label": "...", "steps": ["..."], "total": "~108 min", "note": "..." } }
  },

  "itinPool": {                                       // narrative day content — NO prices/hotels here
    "tokyo": [ { "id": "t-arrive", "cityTag": "Tokyo — arrive", "travel": true,
                 "move": "airport", "lodging": "tokyo", "title": "...",
                 "rows": [ { "tag": "Table", "kind": "table", "lead": "...", "detail": "..." } ],
                 "ask": "..." } ]
  }
}
```

**Invariants the schema must not break** (these are load-bearing in the current engine — see `CLAUDE.md`):

- Every cost is a **2-adult total**; the engine scales by `personFactor = N/2` and private transfers by `vehicleFactor = ceil(N/4)`. Generated data must honor this or the scaling silently corrupts.
- `itinPool` holds **experience only** — no hotel names, transport modes, or costs. Those are injected at render time from `window.__state`, which is what keeps the Itinerary tab a *view* of the budget choices instead of a second source of truth. Generation must respect that seam.
- `lodgingTaxBuffer` inflates **lodging only** and is a planning margin, not a sourced figure. Keep it labeled as such.
- The `reference` quote (if present) is an **optional, explicitly-not-apples-to-apples** comparison. For a from-scratch trip with no agency quote, omit it and the UI hides the comparison.

## The generation step (option 1 detail)

A repeatable Claude Code routine — eventually a skill/slash-command — that takes `(destination, free-text wishes, dates, travelers)` and:

1. **Plans the route.** Turn the wishes into an ordered city list + nights per city + pace.
2. **Researches live**, one concern at a time, citing sources into the DIY doc as it goes:
   - Hotels per city (a few tiers, rating floor, the specific dates).
   - Transport legs (public vs. private, per segment) + any fixed intercity fare.
   - Activities per day (a free/self-guided default + paid upgrades).
   - Route sub-segments (walk/wait/ride timings) for the headline legs.
3. **Emits `TripData` JSON** conforming to the schema above.
4. **Writes the trio**: inline the JSON into `planner-template.html` → `<place>-trip-planner.html`; write `<place>-DIY-cost-options.md` (the sourcing record) and `<place>-trip-guide.md` (readable rendering). Keep the cross-links between the three, as the Japan set does.
5. **Self-checks** the 2-adult convention and the itinerary/state seam before finishing.

Prompt-design notes for that routine live in [Appendix A](#appendix-a--generation-prompt-notes).

## Build phases

Deliberately incremental so each step is verifiable on its own. Japan stays the reference dataset throughout — if the generalized engine can't reproduce today's Japan planner byte-for-similar, something regressed.

- **Phase 0 — this document.** Agree the architecture and resolve the [open decisions](#open-decisions).
- **Phase 1 — extract the schema from Japan.** Pull the existing Japan constants out into a `TripData` object *in the same file*, and make the engine read from it. No behavior change; pure refactor. This is the proof that logic and data actually separate cleanly. **Highest-value, lowest-risk step; recommended to start here.**
- **Phase 2 — template-ize.** Split into `planner-template.html` (engine, one inlined `const TRIP`) + `japan.trip.json` (the extracted data). Confirm Japan renders identically from external data. Document the schema as a real spec.
- **Phase 3 — generation routine.** Build the Claude Code routine (Appendix A) that researches a new destination and emits a valid `TripData` + trio. Test on **one** second destination end-to-end (a US trip, per the original ask).
- **Phase 4 — polish & package.** Turn the routine into a skill/slash-command; write a short "how to generate a new trip" README; decide whether to keep generated trips in-repo or elsewhere.

Stop after any phase and still have something better than today: Phase 1 alone makes the Japan file far more maintainable.

## Open decisions

Resolve these before Phase 1 (or leave a note in the PR):

1. **AI plumbing** — confirm **option 1 (hybrid)** vs. 2 (paste bridge) vs. 3 (in-Artifact estimates). Everything downstream assumes 1.
2. **Reference quote for general trips** — most DIY trips have no agency quote to compare against. Confirm the `reference` block is **optional** and the comparison UI hides when it's absent (assumed yes).
3. **Where generated trips live** — same repo (one folder per trip) vs. generated-and-exported elsewhere. The "one trip at a time" decision leans toward: generate, keep the file, don't necessarily commit every exploration.
4. **How much Japan-specific voice to keep** — the current `itinPool` has a strong personal narrative tone ("jet-lag triage", direct asks to a travel companion). Decide whether the generator reproduces that voice or a neutral one by default, with voice as an input.
5. **Scope of "destination"** — the original ask said "a country or a destination in the US." Confirm the generator should handle both international multi-city routes *and* domestic US trips (assumed yes; the schema is agnostic).

## What explicitly does not change

- **Single self-contained file per trip** — no framework, no build step, no external assets or network calls at view time. (Also what makes the print/PDF and artifact export work.)
- **Vanilla JS, 2-space indent, template-literal rendering.** The engine keeps the current style.
- **The itinerary stays a view of `__state`.** Generalizing must not reintroduce a duplicate source of truth.
- **Numbers are sourced facts.** The generator researches live rates; it does not invent them. Estimates, where unavoidable, are labeled.

## Appendix A — generation prompt notes

Rough shape of the instruction the generation routine gives itself per trip (to be refined in Phase 3):

- **Inputs:** destination(s), free-text wishes, dates, traveler count + notes, optional reference quote, optional voice sample.
- **Research discipline:** one concern per search pass; record each source in the DIY doc; prefer live rates for the exact dates; flag anything that had to be estimated.
- **Output contract:** a single JSON object matching the `TripData` schema — nothing else in that message — so it can be inlined programmatically.
- **Guardrails baked into the prompt:** all costs are 2-adult totals; `itinPool` carries no prices/hotels; `lodgingTaxBuffer` is a margin, not a quote; omit `reference` when there's no packaged quote.
- **Self-check before returning:** every city in `route` has hotels + itinerary days; every priced field is a number in the stated currency; no itinerary row hardcodes a hotel or fare.
