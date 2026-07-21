export default {
  meta: {
    title: "Japan — Nov 2026",
    // hub card (index page): emoji, display title, stops line, blurb, sort order
    hub: {
      order: 1,
      emoji: "🗼",
      title: "Japan",
      meta: "Tokyo · Hakone · Kyoto · optional Osaka",
      go: "Japan",
      blurb:
        "Nine days by train through Tokyo, a Hakone onsen night, and old Kyoto — flights from two origins, ryokan-to-hotel lodging tiers, and a flexible ninth night.",
    },
    route: ["tokyo", "hakone", "kyoto"], // ordered city keys (osaka is optional)
    optionalCities: ["osaka"], // add-on cities offered as the flexible night
    flexNightDefault: "kyoto", // which flex-night option is selected by default
    dates: { arrive: "2026-11-14", depart: "2026-11-22", nights: 8 },
    travelers: { count: 2, note: "2 adults, separate arrival flights" },
    currency: "USD",
    reference: {
      total: 9644,
      label: "Kensington Tours quote",
      caveat: "Placeholder dates Nov 7–14; not apples-to-apples.",
      blurb:
        "Kensington Tours quoted <b>$9,644</b> for this same route — but for placeholder dates (Nov 7–14) that predate locking in the real Nov 14–22 travel window. Treat it as a rough order-of-magnitude reference, not an apples-to-apples baseline: a Kensington re-quote for the actual dates would run higher given the season.",
    },
    lodgingTaxBuffer: 1.25, // lodging-only planning margin, not a sourced figure
    destLabel: "Tokyo", // gateway shown for an "Other airport" origin
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
    kyoto: {
      baseNights: 3,
      label: "Kyoto",
      header: "Kyoto — Gion",
      options: [
        {
          name: "OMO5 Kyoto Gion",
          rate: 290,
          rating: "8.8",
          note: "Non-refundable rate · current pick",
          current: true,
        },
        {
          name: "Kyoto Granbell Hotel",
          rate: 288,
          rating: "8.9",
          note: "Gion-Shijo — essentially same price as current",
        },
        {
          name: "APA Hotel Kyoto Gion Excellent",
          rate: 161,
          rating: "8.2",
          note: "Gion",
        },
        { name: "Kyoto Gion Hotel", rate: 154, rating: "8.3", note: "Gion" },
        {
          name: "KIORI Hotel Higashino Toin",
          rate: 153,
          rating: "9.3",
          note: "Higashiyama — best value, highest rated",
        },
      ],
    },
    osaka: {
      baseNights: 0,
      label: "Osaka",
      header: "Osaka — Namba",
      options: [
        {
          name: "Citadines Namba Osaka",
          rate: 232,
          rating: "9.1",
          note: "Serviced apartment, Namba",
        },
        {
          name: "Fairfield by Marriott Osaka Namba",
          rate: 212,
          rating: "8.8",
          note: "Namba",
        },
        {
          name: "Hotel Forza Osaka Namba",
          rate: 184,
          rating: "8.8",
          note: "Namba",
        },
        {
          name: "Henn na Hotel Express Osaka Namba Nipponbashi",
          rate: 123,
          rating: "8.7",
          note: "Budget, Namba/Nipponbashi",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "airport",
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
        id: "th",
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
        id: "hk",
        from: "hakone",
        to: "kyoto",
        routeName: "Hakone → <strong>Kyoto</strong>",
        note: "(Shinkansen, both adults, reserved seat: <b>$152</b> fixed)",
        toggles: ["mode"],
        routeDetail: true,
        modeControl: "hkmode",
        modes: {
          public: { label: "Bus/subway", scale: "person" },
          private: { label: "Taxi both ends", scale: "vehicle" },
        },
        cost: { public: 12, private: 52 }, // bookend legs (hotel↔Odawara + Kyoto Stn↔Gion)
        fixed: { cost: 152, scale: "person" }, // Shinkansen, always added
      },
      {
        id: "final",
        role: "departure", // renders after the last stop
        routeName: "<strong>Kyoto</strong> → Kansai Airport",
        dynamicNameId: "finalLegName",
        toggles: ["mode"],
        routeDetail: true,
        modeControl: "finalmode",
        when: "noOsaka",
        modes: {
          public: { label: "JR Haruka", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: { public: 45, private: 160 }, // Kyoto↔Kansai Airport
      },
      {
        id: "kyotoOsaka",
        role: "optional", // arrival leg into an optional city
        to: "osaka",
        routeName: "Kyoto → <strong>Osaka</strong>",
        note: "(Kintetsu Ltd. Express, both adults: <b>$28</b>, only public option researched)",
        toggles: [],
        routeDetail: false,
        when: "osaka",
        flat: { cost: 28, scale: "person" },
      }, // Aoniyoshi Ltd. Express
      {
        id: "osakaAirport",
        role: "cost", // cost-only; the departure leg UI covers this segment
        when: "osaka",
        flat: { cost: 18, scale: "person" },
      }, // Nankai IC fare
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
        day: 2,
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
    kyoto: [
      {
        day: 5,
        title: "Higashiyama District",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Free public streets",
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
        title:
          "Cultural Kyoto (Kinkaku-ji, Ryoan-ji, Kitano Tenmangu, Kamishichiken)",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "The one day Kensington originally guided",
            current: true,
          },
          {
            name: "Kyoto Guided Walks",
            cost: 278,
            note: "4 hrs private, Kinkaku-ji + Ryoan-ji only · 4.9★ (48)",
          },
          {
            name: "Viator private 6hr + Kamishichiken add-on",
            cost: 378,
            note: "Covers all 4 original sites, across 2 bookings",
          },
        ],
      },
      {
        day: 6,
        title: "Pontocho evening",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Real tourist-trap risk in this alley",
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
      {
        day: 7,
        title: "Arashiyama",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Entrance fees only, ~$14–18/2",
            current: true,
          },
          {
            name: "Japanify all-sites tour",
            cost: 125,
            note: "5–6 hrs, covers all 4 sites · 5.0★ (1,711)",
          },
        ],
      },
      {
        day: 7,
        title: "Fushimi Inari Shrine",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Free, 24/7, well-marked trail",
            current: true,
          },
          {
            name: "DMO Kyoto guided tour",
            cost: 68,
            note: "60 min, includes a Kagura dance viewing you can't get solo · 5.0★",
          },
        ],
      },
    ],
  },
  routeDetail: {
    airport: {
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
    th: {
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
    hk: {
      label: "Hakone ryokan → Kyoto Gion (via Odawara Shinkansen)",
      steps: [
        "60–65 min: ryokan → Odawara (walk to Gora Stn + Tozan train to Hakone-Yumoto + transfer + Odakyu line to Odawara — this route requires a transfer at Hakone-Yumoto)",
        "10–15 min transfer within Odawara Station to the Shinkansen platform",
        "135–141 min: Shinkansen Odawara → Kyoto — must be a Hikari (Nozomi doesn't stop at Odawara); only ~6–8 direct departures/day, roughly every 2 hours",
        "20–30 min: Kyoto Station → Gion hotel (bus or JR+Keihan via Tofukuji; both beat walking)",
      ],
      total: "~4 hours active transit (237–255 min)",
      note: "Plan the Odawara departure around the sparse direct-Hikari schedule (~every 2 hrs) — missing one costs real time, not just a short wait.",
    },
    final: {
      direct: {
        label: "Kyoto Gion → Kansai Airport (JR Haruka)",
        steps: [
          "~30 min: hotel → Kyoto Station (distance estimate — every real source routes this by bus/subway, not on foot)",
          "~7 min walk to the Haruka platform (far NW corner of the station)",
          "75–80 min ride: JR Haruka Express, Kyoto → Kansai Airport",
          "~7 min walk: platform → terminal",
        ],
        total: "~124 min (2h 4m)",
        note: "",
      },
      osaka: {
        label: "Kyoto Gion → Osaka Namba → Kansai Airport",
        steps: [
          "~30 min: hotel → Kyoto Station",
          "~5 min walk to the Kintetsu platform (south/Hachijo side)",
          "86 min ride: Kintetsu Aoniyoshi Ltd. Express, Kyoto → Kintetsu-Namba (direct)",
          "~10 min walk: Kintetsu-Namba → Namba hotel",
          "— (Osaka overnight stay) —",
          "~10 min walk: Namba hotel → Nankai Namba platform",
          "37 min ride: Nankai Rapi:t, Namba → Kansai Airport",
          "~7 min walk: platform → terminal",
        ],
        total:
          "~185 min (3h 5m) combined transit, excluding the Osaka overnight itself",
        note: "",
      },
    },
  },
  itinPool: {
    tokyo: [
      {
        id: "t-arrive",
        travel: true,
        cityTag: "Tokyo — arrive",
        sun: "16:35",
        move: "airport",
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
        id: "t-daytrip",
        cityTag: "Tokyo — day out",
        sun: "16:32",
        title: "A day out of the city — Kamakura",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Great Buddha &amp; Hase-dera.",
            detail:
              "~1 hr south by train: the bronze Daibutsu in the open air, then Hase-dera's hillside gardens and sea views. A real change of pace.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Shirasu-don by the coast.",
            detail:
              "Kamakura's specialty — a rice bowl of tiny local whitebait, fresh from Sagami Bay.",
          },
        ],
        fuller:
          "Ride one stop to <b>Enoshima</b> for the island shrine, the sea caves, and a sunset over the water on the way back.",
      },
    ],
    hakone: [
      {
        id: "h-arrive",
        travel: true,
        cityTag: "Tokyo → Hakone",
        sun: "16:32",
        move: "th",
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
              "This morning, forward the big suitcases <b>Tokyo → Kyoto hotel</b> by takkyūbin (~¥2,500/bag, next-day). Ride to Hakone with just an overnight bag; the cases meet us in Kyoto. <em>Confirm the Kyoto hotel accepts the delivery.</em>",
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
    kyoto: [
      {
        id: "k-arrive",
        travel: true,
        cityTag: "Hakone → Kyoto",
        sun: "16:50",
        move: "hk",
        lodging: "kyoto",
        title: "Bullet train west, into old Kyoto",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Higashiyama at dusk.",
            detail:
              "The stone lanes of Sannenzaka &amp; Ninenzaka up to Kiyomizu-dera, arriving for sunset over the city. Old-Kyoto at its most cinematic. Daypacks only — the bags went ahead.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First dinner in Gion or Pontochō.",
            detail:
              "Lantern-lit riverside alley; anything from yakitori to kaiseki.",
          },
        ],
      },
      {
        id: "k-fushimi",
        cityTag: "Kyoto",
        sun: "16:49",
        title: "Ten thousand torii gates, early",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Fushimi Inari — before 8 am.",
            detail:
              "The vermilion torii tunnels up the mountain. Going early is the whole game: by 10 it's shoulder-to-shoulder. Hike as far up as we feel like.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Pontochō food tour in the evening.",
            detail:
              "A well-reviewed small-group crawl (~13 tastes) is the easiest way into an alley that's otherwise a tourist-trap minefield.",
          },
        ],
        fuller:
          "One stop up the line is <b>Tōfuku-ji</b> — its maple valley is one of Kyoto's great autumn sights and peaks right about now. Pairs perfectly with an early Fushimi Inari.",
        ask: "Fushimi Inari means a 7 am start. Worth it for empty gates, or trade sleep for crowds?",
      },
      {
        id: "k-arashiyama",
        cityTag: "Kyoto",
        sun: "16:48",
        title: "Bamboo, a Zen garden, and tofu",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Arashiyama — bamboo grove &amp; Tenryū-ji.",
            detail:
              "Go early before the grove fills. Tenryū-ji's garden (UNESCO) is stunning against peak-ish foliage.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Yudōfu (hot-pot tofu) lunch.",
            detail:
              "The local specialty — simple, warming, exactly right for a cool November day by the river.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail: "Back to Gion, easy dinner.",
          },
        ],
        fuller:
          "The <b>Sagano Scenic Railway</b> through the autumn gorge is spectacular in late November — and books out. Say the word and I'll grab tickets now.",
      },
      {
        id: "k-foliage",
        cityTag: "Kyoto",
        sun: "16:47",
        title: "Peak foliage, and a slow last look",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Golden Pavilion, or a foliage temple at its peak.",
            detail:
              "Kinkaku-ji + Ryōan-ji's rock garden is the classic pairing; but late Nov is prime colour, so Eikandō or Tōfuku-ji (day or evening illumination) may be the better call. We'll pick from the foliage forecast closer in.",
          },
        ],
        fuller:
          "Kensington's guided <b>Cultural Kyoto</b> half-day covers Kinkaku-ji, Ryōan-ji, Kitano Tenmangū, and the quieter Kamishichiken geisha district with a guide who explains what we're seeing.",
      },
    ],
    osaka: [
      {
        id: "o-arrive",
        travel: true,
        cityTag: "Kyoto → Osaka",
        sun: "16:47",
        move: "kyotoOsaka",
        lodging: "osaka",
        title: "Osaka — neon, canals, and street food",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Dotonbori &amp; Namba after dark.",
            detail:
              "The Glico running man, the canal lights, the roar of the arcades — Osaka is the loud, fun counterweight to Kyoto's quiet.",
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
          "By day, <b>Osaka Castle</b> or the <b>Kuromon Ichiba market</b> before the train out.",
      },
    ],
  },
  visaPlan: {
    "t-arrive": "Arrive in Tokyo; check in and rest.",
    "t-tsukiji": "Tsukiji Outer Market; Asakusa Senso-ji Temple & Nakamise St.",
    "t-gyoen": "Shinjuku Gyoen National Garden; Shinjuku district.",
    "t-daytrip": "Day trip to Kamakura (Great Buddha, Hase-dera Temple).",
    "h-arrive":
      "Travel to Hakone; Hakone Open-Air Museum; onsen (hot spring) ryokan.",
    "h-full": "Hakone loop — Lake Ashi, Owakudani, Hakone Shrine.",
    "k-arrive":
      "Travel to Kyoto by Shinkansen; Higashiyama & Kiyomizu-dera Temple.",
    "k-fushimi": "Fushimi Inari Shrine; evening in Pontocho.",
    "k-arashiyama": "Arashiyama bamboo grove & Tenryu-ji Temple.",
    "k-foliage":
      "Kinkaku-ji (Golden Pavilion) & Ryoan-ji; autumn foliage viewing.",
    "o-arrive": "Travel to Osaka; Dotonbori & Namba.",
    depart: "Depart from Kansai International Airport.",
  },
};
