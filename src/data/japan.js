export default {
  meta: {
    title: "Davao & Japan — Oct–Nov 2026",
    // hub card (index page): emoji, display title, stops line, blurb, sort order
    hub: {
      order: 1,
      emoji: "🗼",
      title: "Japan",
      meta: "Davao · Osaka · Hakone · Tokyo · Kyoto day trip",
      go: "Japan",
      blurb:
        "A week with family near Davao, then in through Kansai for Osaka's neon streets, a Hakone onsen night, and Tokyo to finish — with a Kyoto day trip for the shrines and lanes, ryokan-to-hotel lodging tiers, and a flexible extra night.",
    },
    route: ["davao", "osaka", "hakone", "tokyo"], // ordered city keys
    optionalCities: [],
    flexNightDefault: "davao", // which flex-night option is selected by default
    dates: { arrive: "2026-10-24", depart: "2026-11-08", nights: 15 },
    travelers: {
      count: 2,
      note: "2 adults; David flies IND → Davao (departs Oct 22, lands Oct 24), then both fly DVO → KIX together on Nov 1 (booked, Cebu Pacific) and home separately out of Haneda on Nov 8",
    },
    currency: "USD",
    reference: {
      total: 9644,
      label: "Kensington Tours quote",
      caveat:
        "Placeholder Nov 7–14 dates and a different route (Tokyo-first, Kyoto base, no Osaka, no Davao week); ground-only comparison since Kensington's quote excluded airfare.",
      blurb:
        "Kensington Tours quoted <b>$9,644</b> for a Tokyo–Hakone–Kyoto version of this trip — but for placeholder dates (Nov 7–14), the opposite direction of travel, and a route with no Osaka base and no Davao week. Treat it as a rough order-of-magnitude reference only: neither the dates nor the route match what's priced here. The delta above compares ground costs only — Kensington's quote excluded airfare.",
    },
    lodgingTaxBuffer: 1.25, // lodging-only planning margin, not a sourced figure
    destLabel: "Davao", // gateway shown for an "Other airport" origin
    visaForm: true, // emit the Japan MOFA "Travel Itinerary" sheet in the .xlsx
    ui: {
      eyebrow:
        'Oct 24 → Nov 8, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked (DIY)',
      planTitle: "Davao &amp; Japan Trip Cost Ledger",
      planSub:
        "Pick a hotel tier per stop and a transport mode per leg. Transport fares are live-researched, and every airfare is a real quote or a booked ticket. Two things still need re-checking: the Japan hotel rates were quoted for the original mid-November dates, and Davao lodging is a planning estimate that costs nothing at the current pick. The total updates as you go.",
      flightsTitle: "Getting there — International flights",
      flightsIntro:
        "David flies IND → Davao (out Oct 22, in Oct 24); his partner is already home in Davao. The two of you then fly DVO → KIX together on Nov 1 — that leg is booked and priced as a transport leg below, not here — and fly home separately out of Haneda on Nov 8. Pick a routing for each; fares fold into the grand total.",
      itinTitle: "Davao, Osaka, Hakone &amp; Tokyo — fifteen nights",
      itinDek:
        "A slow week with family near Davao, then into Japan through the back door: Kansai to Namba for Osaka's kitchen and a Kyoto day trip, one night of kaiseki and a private onsen in Hakone, and Tokyo last — the big city as the finish, not the jet-lagged opening.",
      finePrint: [
        "Japan hotel rates were date-locked quotes pulled from booking platforms for the trip's ORIGINAL Nov 14–22 window. The trip has since moved two weeks earlier (Nov 1–8), so re-quote them — early-November rates in Osaka and Tokyo will not match mid-November peak-foliage pricing.",
        "Davao lodging is a planning estimate, not a date-locked quote — the current pick is staying with family at no lodging cost.",
        "Every alternative hotel holds a private double/twin room, ≥8.0 guest rating, and the same neighborhood (or one stop away) as the currently-quoted property.",
        "Japan transport fares are current published prices (JR, Odakyu, Nankai, Keihan) plus representative private-transfer quotes from real booking platforms (Klook, Viator, Welcome Pickups).",
        "The DVO → KIX leg is the booked Cebu Pacific fare: ₱12,358 per person, converted at ₱58 = $1. The IND → DVO, HND → IND, and HND → DVO fares are quoted prices from live searches, not yet ticketed — the Delta home leg was quoted in yen (¥287,660) and converted at ¥155 = $1.",
        "Excluded from every total: Japan's ~10% accommodation tax (varies by city/hotel), meals outside included breakfasts, and activity/entrance fees.",
        "The Kensington reference comparison stays ground-only, since that quote also excluded airfare.",
      ],
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND → Davao, home from Haneda)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops out · Premium Select home · open-jaw",
      options: [
        {
          name: "Alaska/PAL out via Seattle · Delta Premium Select home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy out · Premium Select home",
          fare: 3000,
          note: "Out Oct 22 on AS500 (IND 18:12) then PR125 SEA→MNL, landing DVO Oct 24 — 27h 58m, ~$1,200. Home Nov 8 on DL120/DL1456 HND 17:15 → MSP → IND 17:55, ¥287,660 ≈ $1,800",
          current: true,
        },
        {
          name: "Same routing, Delta Main Cabin home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy",
          fare: 2100,
          note: "Identical outbound; economy instead of Premium Select on the 14h 40m run home — home leg is an ESTIMATE",
        },
        {
          name: "Same routing, Delta One home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy out · Delta One home",
          fare: 4600,
          note: "Lie-flat on the Pacific crossing home — home leg is an ESTIMATE",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (already in Davao)",
      traveler: "Partner",
      pax: 1,
      preference: "Home leg only · fewest stops",
      options: [
        {
          name: "Philippine Airlines home via Manila",
          route: "(already home in Davao) · HND → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 500,
          note: "Nov 8: PR421 HND 15:25 → MNL 19:45, then PR2825 MNL 23:20 → DVO 01:10+1. Quoted from $460; budgeted at $500",
          current: true,
        },
        {
          name: "Cebu Pacific home via Manila",
          route: "(already home in Davao) · NRT → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 360,
          note: "Budget carrier out of Narita — cheaper, but a Narita departure adds ~an hour to the airport run — ESTIMATE",
        },
        {
          name: "ANA / PAL home via Manila (Premium Economy)",
          route: "(already home in Davao) · HND → MNL → DVO",
          stops: 1,
          cabin: "Premium Economy",
          fare: 620,
          note: "Best cabin on the Tokyo–Manila sector — ESTIMATE",
        },
      ],
    },
    ord: {
      label: "USA — Chicago (ORD)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Fewest stops into Davao, home from Tokyo",
      options: [
        {
          name: "Philippine Airlines via Manila",
          route: "ORD → MNL → DVO · HND → ORD",
          stops: 1,
          cabin: "Economy",
          fare: 1520,
          note: "PAL's ORD–MNL nonstop, then the Manila–Davao hop; home nonstop from Haneda — ESTIMATE",
          current: true,
        },
        {
          name: "ANA via Tokyo & Manila",
          route: "ORD → HND → MNL → DVO · HND → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1580,
          note: "ANA's ORD–HND nonstop both directions, Manila connection into Davao — ESTIMATE",
        },
        {
          name: "Korean Air via Incheon",
          route: "ORD → ICN → MNL → DVO · HND → ICN → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1490,
          note: "Incheon hub; usually the cheapest of the one-alliance options — ESTIMATE",
        },
      ],
    },
  },
  hotels: {
    davao: {
      baseNights: 7,
      label: "Davao",
      header: "Davao — with family",
      options: [
        {
          name: "Staying with family",
          rate: 0,
          rating: "—",
          note: "The week near Davao at the family's place — no lodging cost; bring gifts, not a booking · current pick",
          current: true,
        },
        {
          name: "Seda Abreeza Davao",
          rate: 95,
          rating: "8.7",
          note: "Mall-attached city hotel, Deluxe room — ESTIMATE, not a locked quote",
        },
        {
          name: "Dusit Thani Residence Davao",
          rate: 120,
          rating: "8.8",
          note: "Apartment-style suites near Lanang, pool — ESTIMATE",
        },
        {
          name: "Marco Polo Davao",
          rate: 110,
          rating: "8.5",
          note: "Downtown, closest to Bankerohan and the old city — ESTIMATE",
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
  },
  transport: {
    legs: [
      {
        id: "airport-arrive",
        role: "arrival", // renders before the first stop
        routeName: "<strong>Davao (DVO)</strong> → the family's place",
        note: "(Grab/taxi from the airport into Davao City, both adults: <b>$20</b>)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 20, scale: "person" },
      },
      {
        id: "d-o",
        from: "davao",
        to: "osaka",
        routeName: "Davao → <strong>Osaka</strong>",
        note: "(DVO → KIX via Manila on Cebu Pacific, Nov 1 — booked at ₱12,358/person ≈ $213, both adults <b>$426</b>; plus the Nankai into Namba, <b>$18</b> fixed)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 426, scale: "person" }, // booked DVO→KIX, 2-adult total: ₱12,358 pp at ₱58 = $1
        fixed: { cost: 18, scale: "person" }, // Nankai KIX→Namba, researched
      },
      {
        id: "o-h",
        from: "osaka",
        to: "hakone",
        routeName: "Osaka → <strong>Hakone</strong>",
        note: "(Shinkansen, both adults, reserved seat: <b>$163</b> fixed — must be a Hikari; Nozomi skips Odawara)",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "oh",
        modeControl: "ohmode",
        modes: {
          public: { label: "Subway/bus", scale: "person" },
          private: { label: "Taxi both ends", scale: "vehicle" },
        },
        cost: { public: 15, private: 63 }, // bookends only: Namba↔Shin-Osaka + Odawara↔hotel
        fixed: { cost: 163, scale: "person" }, // Hikari Shin-Osaka→Odawara, always added
      },
      {
        id: "h-t",
        from: "hakone",
        to: "tokyo",
        routeName: "Hakone → <strong>Tokyo</strong>",
        toggles: ["mode"],
        routeDetail: true,
        modeControl: "htmode",
        modes: {
          public: { label: "Romancecar", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: { public: 30, private: 340 }, // Hakone↔Tokyo
      },
      {
        id: "daytrip",
        // No role: it's a cost-only side trip, not an inter-stop move, so it's
        // never placed in the route body (no from/to, no arrival/departure/
        // optional role) — but role:"cost" would also drop it from the generic
        // budget breakdown (engine.js only "folds" a cost-role leg into
        // another leg's row via Japan-specific logic this data intentionally
        // bypasses), so it stays unset and gets its own breakdown line.
        // Known display wrinkle: side-trip legs render after the route's LAST
        // stop (Tokyo) even though this one runs out of Osaka. The itinerary
        // tab places it correctly, on the Osaka day that carries move:"daytrip".
        routeName: "Osaka ⇄ <strong>Kyoto</strong> (day trip)",
        note: "(round trip, both adults: <b>$17</b> fixed — Midosuji subway Namba → Yodoyabashi, then Keihan Main Line express → Gion-Shijo)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 17, scale: "person" },
      },
      {
        id: "depart",
        role: "departure", // renders after the last stop
        routeName: "<strong>Tokyo</strong> → Haneda Airport",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "dep",
        modeControl: "depmode",
        modes: {
          public: { label: "Keikyu + Yamanote", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: { public: 6, private: 56 }, // Gotanda↔Haneda
      },
    ],
  },
  activities: {
    davao: [
      {
        day: 3,
        title: "Samal Island — beaches and Hagimit Falls",
        options: [
          {
            name: "Self-guided (ferry + habal-habal)",
            cost: 0,
            note: "Barge from Sasa, then hire a ride on the island — the local way",
            current: true,
          },
          {
            name: "Joiner island tour",
            cost: 60,
            note: "Boat, lunch, and the usual beach + falls circuit",
          },
          {
            name: "Private boat charter",
            cost: 140,
            note: "Your own bangka and route — Vanishing Island at low tide",
          },
        ],
      },
      {
        day: 4,
        title: "Eden, Malagos & the Philippine Eagle Center",
        options: [
          {
            name: "Self-guided (jeepney + entry fees)",
            cost: 0,
            note: "Entry fees only, not counted here — slow, cheap, doable in a day",
            current: true,
          },
          {
            name: "Malagos Garden + Eagle Center combo",
            cost: 45,
            note: "Chocolate tasting, the bird show, and the eagle sanctuary in one ticket",
          },
          {
            name: "Private van day with a driver",
            cost: 120,
            note: "Eden Nature Park, Malagos, and the Eagle Center without the transfers eating the day",
          },
        ],
      },
    ],
    osaka: [
      {
        day: 10,
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
        day: 10,
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
        day: 10,
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
    hakone: [
      {
        day: 12,
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
    tokyo: [
      {
        day: 14,
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
        day: 15,
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
        day: 15,
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
  },
  routeDetail: {
    "airport-arrive": {
      label: "Davao airport (DVO) → the family's place",
      steps: [
        "Immigration + bags at DVO (small airport, usually quick)",
        "~20–30 min by Grab/taxi into Davao City",
      ],
      total: "~30 min into Davao City",
      note: "David lands Oct 24 after departing IND on Oct 22 — 28 hours of flying and the dateline eats a day on top. Confirm who's meeting the flight before booking a car.",
    },
    "d-o": {
      label: "Davao (DVO) → Kansai (KIX) → Namba — booked, Nov 1",
      steps: [
        "5J 966: DVO 07:05 → MNL 09:05 (Cebu Pacific)",
        "4h 05m on the ground at Manila Terminal 3",
        "5J 828: MNL 13:10 → KIX Terminal 1 18:20",
        "Immigration + customs at KIX",
        "~40 min: Nankai from Kansai Airport station to Namba — in the hotel around 19:40",
      ],
      total: "~13 hrs gate to hotel (07:05 Davao → ~19:40 Namba)",
      note: "The 07:05 push means leaving the house around 05:00. Both legs are Cebu Pacific, so bags check through — but the Manila layover is in Terminal 3 for both. Have Visit Japan Web done before you land.",
    },
    "o-h": {
      label: "Namba → Shin-Osaka → Odawara → Hakone ryokan",
      steps: [
        "~15 min: Midosuji subway Namba → Shin-Osaka",
        "135–150 min: Shinkansen Shin-Osaka → Odawara — must be a Hikari (Nozomi doesn't stop at Odawara); only ~6–8 direct departures/day, roughly every 2 hours",
        "Hakone Tozan bus / taxi: Odawara Station → the ryokan",
      ],
      total:
        "~150–165 min Namba → Odawara (subway + Shinkansen); Odawara→hotel bus/taxi time not itemized",
      note: "Plan the Shin-Osaka departure around the sparse direct-Hikari schedule (~every 2 hrs) — missing one costs real time, not just a short wait.",
    },
    "h-t": {
      label: "Hakone ryokan → Gotanda (Romancecar)",
      steps: [
        "13 min: ryokan → Gora Station (shuttle/bus + short walk)",
        "37 min ride: Gora → Hakone-Yumoto (Hakone Tozan Railway)",
        "80 min ride: Odakyu Romancecar, Hakone-Yumoto → Shinjuku",
        "~10 min transfer walk within Shinjuku Station to the Yamanote platform",
        "3 min wait + 14 min ride: Shinjuku → Gotanda (Yamanote)",
        "6 min walk: Gotanda Station → hotel",
      ],
      total: "~150 min (2.5 hr) door-to-door",
      note: "Biggest lever is the Romancecar run — stopping pattern varies train to train. Reserve the seat; it's a reserved-only service.",
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
      label: "Gotanda → Haneda (Yamanote + Keikyu)",
      steps: [
        "6 min walk: hotel → Gotanda Station",
        "8 min ride: Gotanda → Shinagawa (Yamanote, via Osaki)",
        "4 min transfer walk at Shinagawa",
        "17 min ride: Shinagawa → Haneda T3 (Keikyu Ltd. Express)",
      ],
      total: "~45 min",
      note: "Matches OMO5's own published estimate almost exactly. Narita instead would run ~108 min — worth a cheaper fare only if the schedule suits.",
    },
  },
  itinPool: {
    davao: [
      {
        id: "d-arrive",
        travel: true,
        cityTag: "Davao — arrive",
        sun: "17:41",
        move: "airport-arrive",
        lodging: "davao",
        title: "Land in Davao and do absolutely nothing",
        rows: [
          {
            tag: "Table",
            kind: "table",
            lead: "Whatever the family puts on the table.",
            detail:
              "Two days in transit out of Indianapolis end here. Rice, something grilled, and going to bed early is the whole plan.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Grab a local SIM or activate the eSIM, pull out pesos, and let the jet lag do what it's going to do. Nothing is scheduled.",
          },
        ],
        ask: "who's meeting the flight? Landing after 28 hours in the air, a Grab you booked yourself is the worst version of this.",
      },
      {
        id: "d-city",
        cityTag: "Davao",
        sun: "17:41",
        title: "Davao proper — durian, the market, and the night out",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Bankerohan Market in the morning.",
            detail:
              "The city's working market — fruit stacked by the crate, fish still moving, and durian in season if the timing holds.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "People's Park &amp; the old center.",
            detail:
              "Durian-shaped everything and the Mindanao sculptures — a walkable stretch of city between the malls.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Roxas Avenue night market.",
            detail:
              "Grilled everything on sticks down the length of the street — the cheapest good meal of the whole trip.",
          },
        ],
      },
      {
        id: "d-samal",
        cityTag: "Davao — day out",
        sun: "17:41",
        title: "Samal Island — a barge, a beach, and a waterfall",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Barge across from Sasa.",
            detail:
              "Twenty minutes of water and you're on Samal — white sand on the west side, mangroves and quiet coves everywhere else.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Hagimit Falls.",
            detail:
              "Low, wide freshwater pools under the trees, cold enough to hurt after an afternoon on the sand.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Grilled fish at a beachside carinderia.",
            detail:
              "Point at what's on ice, eat it an hour later with rice and vinegar. No reservation exists to make.",
          },
        ],
        fuller:
          "At low tide, <b>Vanishing Island</b> surfaces off the north end — a sandbar you can stand on in the middle of the strait. Worth chartering a boat for if the tide table cooperates.",
      },
      {
        id: "d-eden",
        cityTag: "Davao — day out",
        sun: "17:41",
        title: "Up the mountain — Eden, Malagos, and the eagles",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Eden Nature Park.",
            detail:
              "Three thousand feet up the flank of Mount Apo, cold enough for a jacket, with the whole gulf laid out below.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Philippine Eagle Center.",
            detail:
              "One of the largest eagles on earth and one of the rarest — the conservation center at Malagos is the only reliable place to see one.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Malagos chocolate and cheese.",
            detail:
              "Single-origin cacao grown on the same hillside, plus a genuinely good local cheese room. A tasting counts as lunch.",
          },
        ],
      },
      {
        id: "d-falls",
        cityTag: "Davao — day out",
        sun: "17:41",
        title: "Tudaya Falls and the road into the Bagobo highlands",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Tudaya Falls, Santa Cruz.",
            detail:
              "Ninety minutes south, then a walk in: a tall, narrow drop off the Mount Apo watershed with a cold pool at the bottom. Fewer people than anything on Samal.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lunch in Santa Cruz on the way back.",
            detail:
              "Roadside grilled chicken and rice. This is a day where the drive is half the point.",
          },
        ],
        fuller:
          "The same road keeps climbing toward the <b>Mount Apo trailheads</b> — worth the detour for the view even without the multi-day hike.",
      },
      {
        id: "d-family",
        cityTag: "Davao",
        sun: "17:41",
        title: "A day that belongs to the family, not the itinerary",
        rows: [
          {
            tag: "Soft",
            kind: "soft",
            detail:
              "No anchor, no plan. This is the reason the week is seven nights and not three — cooking, visiting, sitting around.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Whatever gets cooked at home.",
            detail:
              "Offer to buy the ingredients and stay out of the way. If there's a birthday, a fiesta, or a karaoke machine, that's the day.",
          },
        ],
      },
      {
        id: "d-coast",
        cityTag: "Davao — day out",
        sun: "17:41",
        title: "Down the coast — beaches, and the long southern road",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The coast road south.",
            detail:
              "The road south runs along the gulf past fishing barangays and black-sand coves, with Mount Apo over your shoulder most of the way.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Kinilaw and grilled tuna.",
            detail:
              "Raw fish cured in coconut vinegar, eaten within sight of the boat it came off. Mindanao does it better than Manila does.",
          },
        ],
        fuller:
          "Push as far as <b>Malita</b> and it's a ~3 hr run each way — worth it only as an overnight, not a day trip.",
      },
      {
        id: "d-pack",
        cityTag: "Davao — last day",
        sun: "17:41",
        title: "Goodbyes, pasalubong, and packing for a colder country",
        rows: [
          {
            tag: "Soft",
            kind: "soft",
            detail:
              "Last morning with everyone. Buy pasalubong at Aldevinco or the airport if you're rushed, and repack — Osaka in November is a different climate entirely.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "One more home-cooked meal.",
            detail:
              "The flight to Kansai goes tomorrow. Tonight is the goodbye dinner, and it should be at the house.",
          },
        ],
        ask: "the 5J 966 pushes at 07:05 tomorrow — that's a ~05:00 departure from the house. Who's driving, and is anyone else getting up for it?",
      },
    ],
    osaka: [
      {
        id: "o-arrive",
        travel: true,
        cityTag: "Davao → Osaka",
        sun: "17:01",
        move: "d-o",
        lodging: "osaka",
        title: "Osaka — neon, canals, and street food",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Dotonbori &amp; Namba after dark.",
            detail:
              "The Glico running man, the canal lights, the roar of the arcades — a loud, easy first night that asks nothing of you.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A street-food crawl.",
            detail:
              "Takoyaki, okonomiyaki, kushikatsu — Osaka is Japan's kitchen and this is the point of landing here first. Graze, don't sit down.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Add mobile Suica to Apple Wallet, activate the Japan eSIM, hit a konbini. Drop bags at the hotel first — Namba is minutes from the action, so an early check-in isn't critical.",
          },
        ],
        ask: "5J 828 lands KIX at 18:20, so the hotel happens around 19:40 — that's a Dotonbori night, but not a sit-down-dinner-reservation night.",
      },
      {
        id: "o-daytrip",
        travel: true,
        cityTag: "Day trip — Kyoto",
        sun: "17:00",
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
              "Kiyomizu-dera's veranda, then downhill through Sannenzaka and Ninenzaka's preserved lanes to Gion — early November catches the first of the foliage turning.",
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
          "If the foliage forecast is early, <b>Eikandō's evening illumination</b> is the best autumn ticket in Kyoto — it means a later train back to Namba, which runs past 23:00.",
      },
      {
        id: "o-food",
        cityTag: "Osaka",
        sun: "16:59",
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
        sun: "16:58",
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
              "Japan's oldest officially-administered temple (593 AD), with a five-story pagoda and a quiet turtle pond.",
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
    hakone: [
      {
        id: "h-arrive",
        travel: true,
        cityTag: "Osaka → Hakone",
        sun: "16:44",
        move: "o-h",
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
              "This morning, forward the big suitcases <b>Osaka → Tokyo hotel</b> by takkyūbin (~¥2,500/bag, next-day). Ride to Hakone with just an overnight bag; the cases meet us in Tokyo. <em>Confirm the Tokyo hotel accepts the delivery.</em>",
          },
        ],
      },
      {
        id: "h-full",
        cityTag: "Hakone",
        sun: "16:43",
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
    tokyo: [
      {
        id: "t-arrive",
        travel: true,
        cityTag: "Hakone → Tokyo",
        sun: "16:42",
        move: "h-t",
        lodging: "tokyo",
        title: "Down from the mountain into the biggest city on earth",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shibuya Crossing after dark.",
            detail:
              "Straight from a silent hillside to the loudest intersection in the world. The contrast is the point — do it the night you arrive.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Whatever's open and close.",
            detail:
              "Gotanda has 1,000+ eateries within a few blocks — a bowl of ramen or a neighborhood izakaya. No reservation, no ambition.",
          },
        ],
      },
      {
        id: "t-tsukiji",
        cityTag: "Tokyo",
        sun: "16:41",
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
              "Free. A depachika food-hall dinner and an early night, or push on to Shinjuku if there's energy left.",
          },
        ],
        fuller:
          'Add <b>Meiji Shrine + Omotesandō/Harajuku</b> in the afternoon — that\'s the full Kensington "Tokyo Highlights" loop in one day.',
        ask: "rain plan is <b>teamLab Planets</b> (needs advance tickets) — want me to hold a slot?",
      },
      {
        id: "t-gyoen",
        cityTag: "Tokyo",
        sun: "16:40",
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
              "A huge, calm garden just starting to turn for autumn in early November — the antidote to Tokyo's density. (Free observation deck at the Metro Gov't Building nearby for the skyline.)",
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
        cityTag: "Tokyo — last day",
        sun: "16:39",
        title: "Shibuya, Harajuku, and a proper shopping day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shibuya first.",
            detail:
              "The vertical retail — Shibuya Parco for streetwear and game-culture floors, Loft and Hands for the gifts you actually take home.",
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
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "16:38",
    cityTag: "Tokyo → home",
    title: "Haneda, and two different ways home",
    rows: [
      {
        tag: "Note",
        kind: "soft",
        detail:
          "~45 min to the gate from Gotanda — build in buffer and have the paperwork ready. Tax-free refunds are processed at the airport under the Nov 2026 rules; keep receipts and passports handy. David routes home to Indianapolis; his partner flies back to Davao.",
      },
    ],
    ask: "when do the two flights home actually leave? Different departure times mean two different airport runs.",
  },
  visaPlan: {
    "d-arrive": "In the Philippines — arrive Davao (DVO); not yet in Japan.",
    "d-city": "In the Philippines — Davao City; family visit.",
    "d-samal": "In the Philippines — Samal Island, Davao del Norte.",
    "d-eden": "In the Philippines — Eden Nature Park & Malagos, Davao City.",
    "d-falls": "In the Philippines — Tudaya Falls, Santa Cruz, Davao del Sur.",
    "d-family": "In the Philippines — Davao; family visit.",
    "d-coast": "In the Philippines — Davao del Sur coast.",
    "d-pack": "In the Philippines — Davao; depart for Japan the next day.",
    "o-arrive":
      "Enter Japan at Kansai International Airport (KIX); travel to Osaka (Namba); Dotonbori & Namba.",
    "o-daytrip":
      "Day trip to Kyoto by train; Fushimi Inari Shrine; Kiyomizu-dera Temple; Nishiki Market.",
    "o-food":
      "Kuromon Ichiba Market; Shinsaibashi & Amerikamura shopping districts.",
    "o-shrines": "Sumiyoshi Taisha Shrine; Shitennoji Temple; Osaka Castle.",
    "h-arrive":
      "Travel to Hakone; Hakone Open-Air Museum; onsen (hot spring) ryokan.",
    "h-full": "Hakone loop — Lake Ashi, Owakudani, Hakone Shrine.",
    "t-arrive": "Travel to Tokyo; Shibuya district.",
    "t-tsukiji": "Tsukiji Outer Market; Asakusa Senso-ji Temple & Nakamise St.",
    "t-gyoen": "Shinjuku Gyoen National Garden; Shinjuku district.",
    "t-shopping":
      "Shibuya, Harajuku & Omotesando shopping districts; Shinjuku in the evening.",
    depart: "Depart Japan from Haneda International Airport (HND).",
  },
};
