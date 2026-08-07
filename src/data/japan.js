export default {
  meta: {
    title: "Japan — Nov 2026",
    // hub card (index page): emoji, display title, stops line, blurb, sort order
    hub: {
      order: 1,
      emoji: "🗼",
      title: "Japan",
      meta: "Tokyo · Hakone · Osaka · Kyoto day trip",
      go: "Japan",
      blurb:
        "Nine days by train through Tokyo, a Hakone onsen night, and Osaka's neon streets — with a Kyoto day trip for the shrines and lanes, flights from two origins, ryokan-to-hotel lodging tiers, and a flexible ninth night.",
    },
    route: ["tokyo", "hakone", "osaka"], // ordered city keys
    optionalCities: [],
    flexNightDefault: "osaka", // which flex-night option is selected by default
    dates: { arrive: "2026-11-14", depart: "2026-11-22", nights: 8 },
    travelers: { count: 2, note: "2 adults, separate arrival flights" },
    currency: "USD",
    reference: {
      total: 9644,
      label: "Kensington Tours quote",
      caveat:
        "Placeholder Nov 7–14 dates and a different route (Kyoto base, no Osaka); ground-only comparison since Kensington's quote excluded airfare.",
      blurb:
        "Kensington Tours quoted <b>$9,644</b> for a Tokyo–Hakone–Kyoto version of this trip — but for placeholder dates (Nov 7–14) that predate locking in the real Nov 14–22 window, and for a different route (Kyoto as the lodging base, no Osaka). Treat it as a rough order-of-magnitude reference only: neither the dates nor the route match what's priced here. The delta above compares ground costs only — Kensington's quote excluded airfare.",
    },
    lodgingTaxBuffer: 1.25, // lodging-only planning margin, not a sourced figure
    destLabel: "Tokyo", // gateway shown for an "Other airport" origin
    visaForm: true, // emit the Japan MOFA "Travel Itinerary" sheet in the .xlsx
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Delta preferred · fewest stops",
      options: [
        {
          name: "Delta via Detroit",
          route: "IND → DTW → HND",
          stops: 1,
          cabin: "Premium Select",
          fare: 2150,
          note: "Delta throughout; DTW→HND is a nonstop A350 with Premium Select",
          current: true,
        },
        {
          name: "Delta via Minneapolis",
          route: "IND → MSP → HND",
          stops: 1,
          cabin: "Premium Select",
          fare: 2200,
          note: "Delta throughout; MSP→HND nonstop widebody",
        },
        {
          name: "Delta via Seattle",
          route: "IND → SEA → HND",
          stops: 1,
          cabin: "Premium Select",
          fare: 2260,
          note: "Delta; longer domestic hop, west-coast gateway",
        },
        {
          name: "Delta Main Cabin via Detroit",
          route: "IND → DTW → HND",
          stops: 1,
          cabin: "Economy",
          fare: 1200,
          note: "Same routing in economy — cost reference",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (DVO)",
      traveler: "Partner",
      pax: 1,
      preference: "Fewest stops · premium economy where offered",
      options: [
        {
          name: "Philippine Airlines via Manila",
          route: "DVO → MNL → NRT",
          stops: 1,
          cabin: "Premium Economy",
          fare: 850,
          note: "One airline, bags checked through — simplest connection",
          current: true,
        },
        {
          name: "ANA / JAL via Manila",
          route: "DVO → MNL → HND/NRT",
          stops: 1,
          cabin: "Premium Economy",
          fare: 950,
          note: "Best premium-economy product; DVO→MNL feeder on PAL/Cebu",
        },
        {
          name: "Via Cebu",
          route: "DVO → CEB → NRT",
          stops: 1,
          cabin: "Premium Economy",
          fare: 900,
          note: "Alternate hub if she routes through Cebu",
        },
        {
          name: "Cebu Pacific via Manila",
          route: "DVO → MNL → NRT",
          stops: 1,
          cabin: "Economy (no PE)",
          fare: 480,
          note: "Budget carrier — economy only, no premium economy",
        },
      ],
    },
    ord: {
      label: "USA — Chicago (ORD)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Nonstop to Tokyo where available",
      options: [
        {
          name: "ANA nonstop",
          route: "ORD → HND",
          stops: 0,
          cabin: "Economy",
          fare: 1350,
          note: "Daily ORD–HND nonstop; Haneda is closer to central Tokyo",
          current: true,
        },
        {
          name: "United nonstop",
          route: "ORD → NRT",
          stops: 0,
          cabin: "Economy",
          fare: 1300,
          note: "New daily ORD–NRT nonstop from Oct 2026 (787-8)",
        },
        {
          name: "ANA nonstop (Premium Economy)",
          route: "ORD → HND",
          stops: 0,
          cabin: "Premium Economy",
          fare: 2600,
          note: "Same nonstop, upgraded cabin for the ~13.5 hr sector",
        },
        {
          name: "One-stop via US West Coast",
          route: "ORD → SFO/LAX/SEA → NRT/HND",
          stops: 1,
          cabin: "Economy",
          fare: 1180,
          note: "Connecting itinerary typically undercuts nonstop fares",
        },
      ],
    },
  },
  hotels: {
    tokyo: {
      baseNights: 3,
      label: "Tokyo",
      header: "Tokyo — Gotanda / Shinagawa",
      options: [
        {
          name: "OMO5 Tokyo Gotanda",
          rate: 229,
          rating: "8.9",
          note: "King Room w/ breakfast · current pick",
          current: true,
        },
        {
          name: "Mitsui Garden Hotel Gotanda",
          rate: 219,
          rating: "8.5",
          note: "Station-adjacent, no breakfast",
        },
        {
          name: "Miyako City Tokyo Takanawa",
          rate: 187,
          rating: "8.8",
          note: "Shinagawa, highest-rated alternative",
        },
        {
          name: "Shinagawa Tobu Hotel",
          rate: 167,
          rating: "8.1",
          note: "Shinagawa, plain business hotel",
        },
        {
          name: "APA Hotel Shinagawa Togoshi Ekimae",
          rate: 119,
          rating: "8.2",
          note: "Budget, 1 stop from Gotanda",
        },
      ],
    },
    hakone: {
      baseNights: 1,
      label: "Hakone",
      header: "Hakone",
      options: [
        {
          name: "Hakone Kowakien Ten-yu",
          rate: 710,
          rating: "9.1",
          note: "Half-board · private open-air onsen · current pick",
          current: true,
        },
        {
          name: "Mikawaya Ryokan",
          rate: 559,
          rating: "8.7",
          note: "Half-board · private open-air onsen",
        },
        {
          name: "Hakone Kowakien Hotel",
          rate: 341,
          rating: "8.4",
          note: "Half-board · shared onsen + Yunessun pass, no private bath",
        },
      ],
    },
    osaka: {
      baseNights: 3,
      label: "Osaka",
      header: "Osaka — Namba",
      options: [
        {
          name: "Citadines Namba Osaka",
          rate: 235,
          rating: "9.0",
          note: "Serviced apartment, Deluxe Twin/Double, no breakfast, Namba · current pick",
          current: true,
        },
        {
          name: "Fairfield by Marriott Osaka Namba",
          rate: 164,
          rating: "8.8",
          note: "King Room, no breakfast, Namba",
        },
        {
          name: "Hotel Forza Osaka Namba",
          rate: 150,
          rating: "8.8",
          note: "Standard Double, no breakfast, Namba",
        },
        {
          name: "Henn na Hotel Express Osaka Namba Nipponbashi",
          rate: 109,
          rating: "8.7",
          note: "Budget, breakfast included, Namba/Nipponbashi",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "airport-arrive",
        role: "arrival", // renders before the first stop
        routeName: "<strong>Airport</strong> → Tokyo (Gotanda)",
        toggles: ["terminal", "mode"],
        routeDetail: true,
        ctrlPrefix: "air", // input/label id prefix (others default to the leg id)
        modeControl: "airportmode",
        terminalControl: "airport", // arrival-terminal sub-choice
        terminals: { nrt: { label: "Narita" }, hnd: { label: "Haneda" } },
        modes: {
          public: { label: "Train/bus", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: {
          nrt: { public: 43, private: 148 },
          hnd: { public: 6, private: 56 },
        },
      },
      {
        id: "t-h",
        from: "tokyo",
        to: "hakone",
        routeName: "Tokyo → <strong>Hakone</strong>",
        toggles: ["mode"],
        routeDetail: true,
        modeControl: "thmode",
        modes: {
          public: { label: "Romancecar", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: { public: 30, private: 340 }, // Tokyo↔Hakone
      },
      {
        id: "h-o",
        from: "hakone",
        to: "osaka",
        routeName: "Hakone → <strong>Osaka</strong>",
        note: "(Shinkansen, both adults, reserved seat: <b>$163</b> fixed — must be a Hikari; Nozomi skips Odawara)",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "ho",
        modeControl: "homode",
        modes: {
          public: { label: "Bus/subway", scale: "person" },
          private: { label: "Taxi both ends", scale: "vehicle" },
        },
        cost: { public: 15, private: 63 }, // bookends only: hotel↔Odawara + Shin-Osaka↔Namba
        fixed: { cost: 163, scale: "person" }, // Hikari Odawara→Shin-Osaka, always added
      },
      {
        id: "daytrip",
        // No role: it's a cost-only side trip, not an inter-stop move, so it's
        // never placed in the route body (no from/to, no arrival/departure/
        // optional role) — but role:"cost" would also drop it from the generic
        // budget breakdown (engine.js only "folds" a cost-role leg into
        // another leg's row via Japan-specific logic this data intentionally
        // bypasses), so it stays unset and gets its own breakdown line.
        routeName: "Osaka ⇄ <strong>Kyoto</strong> (day trip)",
        note: "(round trip, both adults: <b>$17</b> fixed — Midosuji subway Namba → Yodoyabashi, then Keihan Main Line express → Gion-Shijo)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 17, scale: "person" },
      },
      {
        id: "depart",
        role: "departure", // renders after the last stop
        routeName: "<strong>Osaka</strong> → Kansai Airport",
        note: "(Nankai, both adults: <b>$18</b> fixed)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 18, scale: "person" }, // Nankai ticketless/IC fare
      },
    ],
  },
  activities: {
    tokyo: [
      {
        day: 2,
        title: "Tsukiji Market / Tokyo Highlights",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Use the itinerary's own notes",
            current: true,
          },
          {
            name: "Klook small-group tour",
            cost: 120,
            note: "5 hrs, swaps lunch for Shibuya Crossing · 5.0★ (69)",
          },
          {
            name: "GetYourGuide small-group",
            cost: 138,
            note: "4 hrs · 5.0★ (1, new listing)",
          },
          {
            name: "Viator private guide",
            cost: 278,
            note: "6 hrs, customizable stops · 4.9★ (4,546) — closest match to original",
          },
        ],
      },
      {
        day: 3,
        title: "Ramen exploration",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Wander in — tours are an upsell here, not a fix",
            current: true,
          },
          {
            name: "Viator ramen tasting",
            cost: 227,
            note: "3 hrs, 6 mini bowls, 3 shops · 5.0★ (145)",
          },
          {
            name: "GetYourGuide ramen tasting",
            cost: 234,
            note: "3 hrs · 4.9★ (462)",
          },
        ],
      },
      {
        day: 3,
        title: "Shinjuku / Yokocho bar hopping",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Many Golden Gai bars are locals-only/no walk-ins",
            current: true,
          },
          {
            name: "GetYourGuide bar hop",
            cost: 74,
            note: "3 hrs · 4.7★ (139)",
          },
          {
            name: "Viator evening tour",
            cost: 189,
            note: "2 hrs, dinner + drinks · 5.0★ (160)",
          },
          {
            name: "Viator bar hopping",
            cost: 213,
            note: "3 hrs, all-you-can-drink · 5.0★ (3,914) — solves a real access problem",
          },
        ],
      },
    ],
    hakone: [
      {
        day: 4,
        title: "Hakone Loop (museums, Owakudani, Lake Ashi)",
        options: [
          {
            name: "Self-guided w/ Free Pass",
            cost: 0,
            note: "Pass (~$74–88/2) + admissions (~$25–30/2), not counted here",
            current: true,
          },
          {
            name: "GoWithGuide private guide",
            cost: 372,
            note: "8 hrs flat for the group · 5.0★ (33) — logistics/hand-holding, not new sights",
          },
        ],
      },
    ],
    osaka: [
      {
        day: 6,
        title: "Kyoto day trip: Higashiyama District",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Free public streets — steps from the Keihan Gion-Shijo stop",
            current: true,
          },
          {
            name: "History-teacher walk",
            cost: 60,
            note: "2 hrs, small group ≤4 · 4.8★ (9)",
          },
          {
            name: "Private Higashiyama walk",
            cost: 84,
            note: "3 hrs · 5.0★ (5)",
          },
        ],
      },
      {
        day: 6,
        title: "Kyoto day trip: Fushimi Inari Shrine",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Free, 24/7, well-marked trail — 2 stops past Gion-Shijo on the Keihan line",
            current: true,
          },
          {
            name: "DMO Kyoto guided tour",
            cost: 68,
            note: "60 min, includes a Kagura dance viewing you can't get solo · 5.0★",
          },
        ],
      },
      {
        day: 6,
        title: "Kyoto day trip: Pontocho evening",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Real tourist-trap risk in this alley; last Keihan back to Namba runs past 23:00",
            current: true,
          },
          {
            name: "13-dish food tour",
            cost: 178,
            note: "3 hrs · 4.9★ (447) — best-reviewed + cheapest paid pick",
          },
          {
            name: "Kyoto Night Foodie Tour",
            cost: 326,
            note: "3 hrs, sake-focused · 5.0★ (1,762)",
          },
        ],
      },
    ],
  },
  routeDetail: {
    "airport-arrive": {
      nrt: {
        label: "Narita → Gotanda (N'EX + Yamanote)",
        steps: [
          "8 min walk: arrivals → N'EX platform",
          "~15 min wait (N'EX runs every 30–60 min)",
          "65 min ride: Narita → Shinagawa (N'EX)",
          "6 min transfer walk at Shinagawa",
          "8 min ride: Shinagawa → Gotanda (Yamanote, via Osaki)",
          "6 min walk: Gotanda Station → hotel",
        ],
        total: "~108 min (1h 48m)",
        note: "Excludes immigration/customs (commonly 15–40+ min at NRT). OMO5's own guidance suggests Skyliner via Nippori instead, ~70 min total — faster, less luggage space.",
      },
      hnd: {
        label: "Haneda → Gotanda (Keikyu + Yamanote)",
        steps: [
          "5 min walk: arrivals → Keikyu platform",
          "5 min wait (Limited Express runs ~every 10 min)",
          "17 min ride: Haneda T3 → Shinagawa (Keikyu Ltd. Express)",
          "4 min transfer walk at Shinagawa",
          "8 min ride: Shinagawa → Gotanda (Yamanote, via Osaki)",
          "6 min walk: Gotanda Station → hotel",
        ],
        total: "~45 min",
        note: "Matches OMO5's own published estimate almost exactly. Excludes immigration (faster than NRT with e-gates).",
      },
    },
    "t-h": {
      label: "Gotanda → Hakone ryokan (Romancecar)",
      steps: [
        "6 min walk: hotel → Gotanda Station",
        "3 min wait + 14 min ride: Gotanda → Shinjuku (Yamanote)",
        "~10 min transfer walk within Shinjuku Station to the Romancecar platform",
        "80 min ride: Odakyu Romancecar, Shinjuku → Hakone-Yumoto",
        "37 min ride: Hakone-Yumoto → Gora (Hakone Tozan Railway)",
        "13 min: Gora Station → ryokan (shuttle/bus + short walk)",
      ],
      total: "~150 min (2.5 hr) door-to-door",
      note: "Biggest lever is the Romancecar run — stopping pattern varies train to train. Shuttle timing is soft; confirm with your specific ryokan.",
    },
    "h-o": {
      label: "Hakone hotel → Odawara → Shin-Osaka → Namba",
      steps: [
        "Hakone Tozan bus / taxi: hotel area → Odawara Station",
        "135–150 min: Shinkansen Odawara → Shin-Osaka — must be a Hikari (Nozomi doesn't stop at Odawara); only ~6–8 direct departures/day, roughly every 2 hours",
        "~15 min: Midosuji subway Shin-Osaka → Namba",
      ],
      total:
        "~150–165 min Odawara → Namba (Shinkansen + subway); hotel→Odawara bus/taxi time not itemized",
      note: "Plan the Odawara departure around the sparse direct-Hikari schedule (~every 2 hrs) — missing one costs real time, not just a short wait.",
    },
    daytrip: {
      label: "Namba ⇄ Kyoto (day trip)",
      steps: [
        "Midosuji subway Namba → Yodoyabashi, then Keihan Main Line express → Gion-Shijo (Kyoto)",
        "40–55 min each way depending on route",
      ],
      total: "~80–110 min round-trip transit (40–55 min each way)",
      note: "Go early — Fushimi Inari before 9am beats the crowds; last trains back to Namba run past 23:00.",
    },
    depart: {
      label: "Osaka Namba → Kansai Airport",
      steps: [
        "~40 min: Nankai from Namba Station to KIX (Rapi:t reserved or airport express)",
      ],
      total: "~40 min (Nankai, Namba Station → KIX)",
      note: "Nankai ticketless/IC fare researched; Rapi:t reserved seat costs slightly more.",
    },
  },
  itinPool: {
    tokyo: [
      {
        id: "t-arrive",
        travel: true,
        cityTag: "Tokyo — arrive",
        sun: "16:35",
        move: "airport-arrive",
        lodging: "tokyo",
        title: "Land, get to Gotanda, and do almost nothing",
        rows: [
          {
            tag: "Table",
            kind: "table",
            lead: "Whatever's open and close.",
            detail:
              "Gotanda has 1,000+ eateries within a few blocks — a bowl of ramen or a neighborhood izakaya. No reservation, no ambition.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Add mobile Suica to Apple Wallet, activate the eSIM, hit a konbini. First night is jet-lag triage. We arrive on separate flights — meet at the hotel, not the airport.",
          },
        ],
        ask: "what time do our flights actually land? It decides whether tonight has a dinner in it at all.",
      },
      {
        id: "t-tsukiji",
        cityTag: "Tokyo",
        sun: "16:34",
        title: "Breakfast at the fish market, then old Tokyo",
        rows: [
          {
            tag: "Table",
            kind: "table",
            lead: "Tsukiji Outer Market, early (~8 am).",
            detail:
              "Tamagoyaki on a stick, uni, fatty tuna, grilled scallops — grazing breakfast is the point. Beats the crowds.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Asakusa — Sensō-ji &amp; Nakamise.",
            detail:
              "Tokyo's oldest temple and the approach street of little shops. Late morning, unhurried.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Free. Shibuya Crossing after dark if there's energy; if not, a depachika food-hall dinner and an early night.",
          },
        ],
        fuller:
          'Add <b>Meiji Shrine + Omotesandō/Harajuku</b> in the afternoon — that\'s the full Kensington "Tokyo Highlights" loop in one day.',
        ask: "rain plan is <b>teamLab Planets</b> (needs advance tickets) — want me to hold a slot?",
      },
      {
        id: "t-gyoen",
        cityTag: "Tokyo",
        sun: "16:33",
        title: "A garden by day, the alleyways by night",
        rows: [
          {
            tag: "Morning",
            kind: "soft",
            detail: "Slow start. Coffee somewhere good.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shinjuku Gyoen.",
            detail:
              "A huge, calm garden starting to turn for autumn in mid-November — the antidote to Tokyo's density. (Free observation deck at the Metro Gov't Building nearby for the skyline.)",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Yokochō night in Shinjuku.",
            detail:
              "Yakitori under the tracks at Omoide Yokochō, or a ramen crawl (Nakiryu, Afuri, Fūunji). The food night in Tokyo.",
          },
        ],
        fuller:
          "Golden Gai's tiny bars are famously locals-only. A <b>guided bar-hop</b> gets us in the doors — solves a real access problem, not just another stop.",
      },
      {
        id: "t-shopping",
        cityTag: "Tokyo — day out",
        sun: "16:32",
        title: "Shibuya, Harajuku, and a proper shopping day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shibuya first.",
            detail:
              "The scramble crossing, then the vertical retail — Shibuya Parco for streetwear and game-culture floors, Loft and Hands for the gifts you actually take home.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Harajuku &amp; Omotesando after.",
            detail:
              "Takeshita-dori for the chaos, then Omotesando's tree-lined flagships and the Cat Street vintage stretch between them — the full Tokyo retail spectrum in one walkable line.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Depachika dinner.",
            detail:
              "A department-store basement food hall (Shibuya's Tokyu or Shinjuku's Isetan) — assemble a spread from the counters and eat well without a reservation.",
          },
        ],
        fuller:
          "<b>Shinjuku at night</b> to close it out — Kabukicho neon, Golden Gai's tiny bars, or the free Metro Government observation deck for the skyline.",
      },
    ],
    hakone: [
      {
        id: "h-arrive",
        travel: true,
        cityTag: "Tokyo → Hakone",
        sun: "16:32",
        move: "t-h",
        lodging: "hakone",
        title: "The mountain, and the best meal of the trip",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Hakone Open-Air Museum",
            detail:
              "or the Lake Ashi / Owakudani loop on the Free Pass — but honestly, one stop then straight to the onsen. This is the rest day.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Kaiseki dinner at the ryokan.",
            detail:
              "Multi-course seasonal dinner (half-board) plus a private open-air hot-spring bath on the balcony. The romantic centerpiece — nowhere to be, nothing to catch.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "This morning, forward the big suitcases <b>Tokyo → Osaka hotel</b> by takkyūbin (~¥2,500/bag, next-day). Ride to Hakone with just an overnight bag; the cases meet us in Osaka. <em>Confirm the Osaka hotel accepts the delivery.</em>",
          },
        ],
      },
      {
        id: "h-full",
        cityTag: "Hakone",
        sun: "16:31",
        title: "A full day in the hills",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The complete Hakone loop.",
            detail:
              "Ropeway over the sulphur vents at Owakudani, the pirate ship across Lake Ashi, the red Hakone Shrine torii standing in the water — the classic circuit, no rushing.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Black eggs &amp; a second kaiseki.",
            detail:
              "Owakudani's kuro-tamago (boiled black in the hot springs) by day; another multi-course ryokan dinner and a long soak by night.",
          },
          {
            tag: "Soak",
            kind: "soft",
            detail:
              "The whole reason to give Hakone a second night — a slow morning in the private open-air bath before anything else.",
          },
        ],
      },
    ],
    osaka: [
      {
        id: "o-arrive",
        travel: true,
        cityTag: "Hakone → Osaka",
        sun: "16:52",
        move: "h-o",
        lodging: "osaka",
        title: "Osaka — neon, canals, and street food",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Dotonbori &amp; Namba after dark.",
            detail:
              "The Glico running man, the canal lights, the roar of the arcades — Osaka is the loud, fun counterweight to Hakone's quiet morning.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A street-food crawl.",
            detail:
              "Takoyaki, okonomiyaki, kushikatsu — Osaka is Japan's kitchen and this is the point of coming. Graze, don't sit down.",
          },
        ],
        fuller:
          "Drop bags at the hotel first — Namba is minutes from the action, so an early check-in isn't critical.",
      },
      {
        id: "o-daytrip",
        travel: true,
        cityTag: "Day trip — Kyoto",
        sun: "16:51",
        move: "daytrip",
        title: "Kyoto in a day — shrines, lanes, and a market lunch",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Fushimi Inari first.",
            detail:
              "The vermilion torii tunnels are the trip's iconic walk — arrive before 9am and the crowds thin out within the first ten minutes of climbing.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The eastern hills after lunch.",
            detail:
              "Kiyomizu-dera's veranda, then downhill through Sannenzaka and Ninenzaka's preserved lanes to Gion — late November is peak foliage, so the temple gardens earn their reputation this week.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Nishiki Market for lunch.",
            detail:
              "Kyoto's 400-year-old food arcade — tamagoyaki, yuba, matcha everything. Graze the stalls rather than committing to one seat.",
          },
        ],
        fuller:
          "If the foliage forecast is right, <b>Eikandō's evening illumination</b> is the best autumn ticket in Kyoto — it means a later train back to Namba, which runs past 23:00.",
      },
      {
        id: "o-food",
        cityTag: "Osaka",
        sun: "16:51",
        title: "Kuromon market, Shinsaibashi, and Japan's kitchen",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Kuromon Ichiba in the morning.",
            detail:
              "Osaka's covered market — grilled scallops, tuna cuts, fruit you eat standing up. Breakfast is the market itself.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shinsaibashi &amp; Amerikamura shopping.",
            detail:
              "The covered Shinsaibashi-suji arcade runs the gamut from department stores to streetwear; Amerikamura next door is the vintage and sneaker quarter.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Okonomiyaki, done properly.",
            detail:
              "Sit at a teppan counter and let them build it in front of you — the Osaka style (mixed, not layered) is the one to order here.",
          },
        ],
        fuller:
          "<b>Umeda Sky Building</b> at dusk — the open-air escalator ride and the city grid lighting up below.",
      },
      {
        id: "o-shrines",
        cityTag: "Osaka",
        sun: "16:50",
        title: "Sumiyoshi Taisha, Shitennoji, and old Osaka",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Sumiyoshi Taisha in the morning.",
            detail:
              "One of Japan's oldest shrines, pre-dating Buddhist influence — the arched Sorihashi bridge and pure sumiyoshi-zukuri halls are unlike anything in Kyoto. Ten minutes from Namba on the Nankai line.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shitennoji after.",
            detail:
              "Japan's oldest officially-administered temple (593 AD), with a five-story pagoda and a quiet turtle pond — the flea market (21st/22nd of the month) overlaps our dates.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Kushikatsu in Shinsekai.",
            detail:
              "The retro tower district next to Shitennoji is the home of deep-fried skewers — one rule: no double-dipping the sauce.",
          },
        ],
        fuller:
          "<b>Osaka Castle</b> park on the way back — the keep is a reconstruction, but the moats and gold-leaf details photograph best in late-afternoon light.",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "16:46",
    cityTag: "Osaka → home",
    title: "Kansai Airport, and the long way home",
    rows: [
      {
        tag: "Note",
        kind: "soft",
        detail:
          "~40 min to the gate — build in buffer and have Visit Japan Web ready. Tax-free refunds are processed at the airport under the Nov 2026 rules; keep receipts and passports handy.",
      },
    ],
    ask: "when do our flights home actually leave? That sets how much of the morning is ours.",
  },
  visaPlan: {
    "t-arrive": "Arrive in Tokyo; check in and rest.",
    "t-tsukiji": "Tsukiji Outer Market; Asakusa Senso-ji Temple & Nakamise St.",
    "t-gyoen": "Shinjuku Gyoen National Garden; Shinjuku district.",
    "t-shopping":
      "Shibuya, Harajuku & Omotesando shopping districts; Shinjuku in the evening.",
    "h-arrive":
      "Travel to Hakone; Hakone Open-Air Museum; onsen (hot spring) ryokan.",
    "h-full": "Hakone loop — Lake Ashi, Owakudani, Hakone Shrine.",
    "o-arrive": "Travel to Osaka; Dotonbori & Namba.",
    "o-daytrip":
      "Day trip to Kyoto by train; Fushimi Inari Shrine; Kiyomizu-dera Temple; Nishiki Market.",
    "o-food": "Kuromon Ichiba Market; Shinsaibashi & Amerikamura shopping districts.",
    "o-shrines": "Sumiyoshi Taisha Shrine; Shitennoji Temple; Osaka Castle.",
    depart: "Depart from Kansai International Airport.",
  },
};
