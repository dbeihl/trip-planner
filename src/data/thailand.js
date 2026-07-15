export default {
  meta: {
    title: "Thailand — Bangkok, Chiang Mai & Phuket — Jan 2027",
    route: ["bangkok", "chiangMai", "phuket"],
    optionalCities: [],
    flexNightDefault: "phuket",
    dates: { arrive: "2027-01-17", depart: "2027-01-26", nights: 9 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into Bangkok, out of Phuket",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.1, // Thai VAT + occasional resort fee, generally light
    destLabel: "Bangkok",
    ui: {
      eyebrow:
        'Jan 17 → Jan 26, 2027 · <span class="traveler-count-lbl">2</span> travelers · self-booked Thailand loop',
      planTitle: "Thailand: Bangkok, Chiang Mai &amp; Phuket",
      planSub:
        "An open-jaw loop down the country — temples and street food in Bangkok, mountains and elephants in Chiang Mai, islands and beaches in Phuket. Pick a lodging tier per stop; the domestic flights fold into the total. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — flights to Bangkok",
      flightsIntro:
        "Two travelers converging on Bangkok. Pick a routing for each — fares fold into the grand total. Fly into Suvarnabhumi (BKK), home from Phuket (HKT) so there's no backtrack.",
      itinTitle:
        "Bangkok, Chiang Mai &amp; Phuket — nine nights across Thailand",
      itinDek:
        "A relaxed south-bound hop: temples and canals in Bangkok, mountains and elephants around Chiang Mai, then islands and beach time in Phuket. One anchor a day, street food at every stop, and a flex day at the end for whichever city earns it.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops · one Asian hub",
      options: [
        {
          name: "Korean Air / Delta via Seattle + Seoul",
          route: "IND → SEA → ICN → BKK",
          stops: 2,
          cabin: "Economy",
          fare: 1080,
          note: "Usually the cheapest; SkyTeam via Incheon",
          current: true,
        },
        {
          name: "ANA / United via Chicago + Tokyo",
          route: "IND → ORD → NRT → BKK",
          stops: 2,
          cabin: "Economy",
          fare: 1130,
          note: "IND–ORD, then ANA's 787 to Narita and on to Bangkok",
        },
        {
          name: "EVA Air via Los Angeles + Taipei",
          route: "IND → LAX → TPE → BKK",
          stops: 2,
          cabin: "Economy",
          fare: 1170,
          note: "Connect at LAX to EVA's Taipei hub",
        },
        {
          name: "Cathay Pacific via New York + Hong Kong",
          route: "IND → JFK → HKG → BKK",
          stops: 2,
          cabin: "Economy",
          fare: 1240,
          note: "Premium routing via the HKG hub; longest transit",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (DVO)",
      traveler: "Partner",
      pax: 1,
      preference: "Nonstop where possible · budget-friendly",
      options: [
        {
          name: "Cebu Pacific via Manila",
          route: "DVO → MNL → BKK",
          stops: 1,
          cabin: "Economy",
          fare: 360,
          note: "Cheapest routing; DVO–MNL then a ~3h30 hop to Bangkok",
          current: true,
        },
        {
          name: "Philippine Airlines via Manila",
          route: "DVO → MNL → BKK",
          stops: 1,
          cabin: "Economy",
          fare: 440,
          note: "Full-service flag carrier, better baggage allowance",
        },
        {
          name: "AirAsia via Manila (Don Mueang)",
          route: "DVO → MNL → DMK",
          stops: 1,
          cabin: "Economy",
          fare: 345,
          note: "Budget carrier into Don Mueang; ~40 min transfer to BKK-side hotels",
        },
        {
          name: "Thai Lion Air via Kuala Lumpur",
          route: "DVO → MNL → KUL → BKK",
          stops: 2,
          cabin: "Economy",
          fare: 390,
          note: "Backup if the cheaper routings sell out around the holidays",
        },
      ],
    },
    sf: {
      label: "From San Francisco (preset) — SFO",
      traveler: "Guest",
      pax: 1,
      preset: true,
      preference: "Fewest stops",
      options: [
        {
          name: "ANA via Tokyo",
          route: "SFO → NRT → BKK",
          stops: 1,
          cabin: "Main Cabin",
          fare: 1050,
          note: "Same Tokyo connection as the LAX routing, slightly pricier",
          current: true,
        },
        {
          name: "EVA Air via Taipei",
          route: "SFO → TPE → BKK",
          stops: 1,
          cabin: "Economy",
          fare: 990,
          note: "Taipei hub, strong reputation, good value",
        },
        {
          name: "Cathay Pacific via Hong Kong",
          route: "SFO → HKG → BKK",
          stops: 1,
          cabin: "Economy",
          fare: 1120,
          note: "Long-haul nonstop to HKG, short hop onward",
        },
      ],
    },
  },
  hotels: {
    bangkok: {
      baseNights: 3,
      label: "Bangkok",
      header: "Bangkok",
      options: [
        {
          name: "Once Again Hostel (Sukhumvit)",
          rate: 28,
          rating: "8.0",
          note: "Design hostel in lower Sukhumvit, an easy walk to the BTS",
          current: true,
        },
        {
          name: "S31 Sukhumvit",
          rate: 62,
          rating: "8.3",
          note: "Spacious serviced-apartment-style rooms with a pool, Soi 31",
        },
        {
          name: "Ad Lib Bangkok (Ratchaprasong)",
          rate: 88,
          rating: "8.5",
          note: "Boutique design hotel, steps to Siam and Central World",
        },
        {
          name: "Riva Surya Bangkok (Riverside)",
          rate: 135,
          rating: "8.6",
          note: "Riverside boutique with a Chao Phraya-view pool deck",
        },
        {
          name: "Mandarin Oriental Bangkok",
          rate: 420,
          rating: "9.2",
          note: "The grande dame of the river, welcoming guests since 1876",
        },
      ],
    },
    chiangMai: {
      baseNights: 2,
      label: "Chiang Mai",
      header: "Chiang Mai",
      options: [
        {
          name: "Anumat Premium Budget Hotel",
          rate: 22,
          rating: "8.0",
          note: "Simple and clean, inside the Old City moat",
          current: true,
        },
        {
          name: "Pastell Oldtown",
          rate: 58,
          rating: "8.4",
          note: "Small boutique property on foot of the Old City walls",
        },
        {
          name: "Rachamankha",
          rate: 135,
          rating: "9.0",
          note: "Lanna-Chinese courtyard hotel inside the moat, quiet and photogenic",
        },
        {
          name: "Anantara Chiang Mai Resort",
          rate: 260,
          rating: "9.2",
          note: "Colonial-era riverside resort right on the Ping River",
        },
        {
          name: "Four Seasons Resort Chiang Mai",
          rate: 650,
          rating: "9.4",
          note: "Rice-paddy valley resort outside town, a full retreat",
        },
      ],
    },
    phuket: {
      baseNights: 3,
      label: "Phuket",
      header: "Phuket",
      options: [
        {
          name: "The Nap Patong",
          rate: 27,
          rating: "7.8",
          note: "Rooftop-pool budget hotel, a few minutes' walk to Patong beach",
          current: true,
        },
        {
          name: "Kata Sea Breeze Resort",
          rate: 58,
          rating: "8.1",
          note: "Quiet mid-range base a short stroll from Kata beach",
        },
        {
          name: "Novotel Phuket Kata Avista Resort & Spa",
          rate: 105,
          rating: "8.5",
          note: "Three pools, an easy walk down to Kata beach",
        },
        {
          name: "Katathani Phuket Beach Resort",
          rate: 290,
          rating: "9.0",
          note: "All-suite beachfront resort on quiet Kata Noi",
        },
        {
          name: "Trisara",
          rate: 850,
          rating: "9.5",
          note: "All-villa clifftop resort with private pools, Nai Thon",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Bangkok (BKK) · Airport Rail Link into Sukhumvit",
        note: "~40 min into the city on the Airport Rail Link (~$1.50pp) or a metered taxi (~$12 flat plus tolls, 30-45 min depending on traffic)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 3, scale: "person" },
      },
      {
        id: "b-cm",
        from: "bangkok",
        to: "chiangMai",
        routeName: "Bangkok → <strong>Chiang Mai</strong>",
        note: "Domestic flight ~1h20 (AirAsia / Thai / Nok Air), several departures daily",
        toggles: [],
        routeDetail: false,
        flat: { cost: 96, scale: "person" },
      },
      {
        id: "cm-p",
        from: "chiangMai",
        to: "phuket",
        routeName: "Chiang Mai → <strong>Phuket</strong>",
        note: "Domestic flight ~2h, sometimes routed via Bangkok (Thai AirAsia / Bangkok Airways)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 136, scale: "person" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Phuket</strong> (HKT) → fly home",
        note: "No rental car to return — just build in time to reach Phuket International, longer from Patong in beach-traffic hours",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "person" },
      },
    ],
  },
  activities: {
    bangkok: [
      {
        day: 2,
        title: "Grand Palace & the river temples",
        options: [
          {
            name: "Self-guided visit",
            cost: 15,
            note: "Grand Palace + Wat Phra Kaew entry (500 THB); Wat Pho and Wat Arun are separately ~$3-4 each",
            current: true,
          },
          {
            name: "Guided half-day tour",
            cost: 45,
            note: "Small-group guide, skip-the-line entry, hotel pickup",
          },
        ],
      },
      {
        day: 3,
        title: "Floating market & street food",
        options: [
          {
            name: "Self-guided (shared van)",
            cost: 20,
            note: "Damnoen Saduak or Amphawa floating market, round-trip shared transport",
            current: true,
          },
          {
            name: "Guided market + Chinatown food tour",
            cost: 55,
            note: "Morning market by longtail boat, evening Yaowarat street-food crawl with a guide",
          },
        ],
      },
    ],
    chiangMai: [
      {
        day: 6,
        title: "Ethical elephants & Doi Suthep",
        options: [
          {
            name: "Half-day ethical sanctuary",
            cost: 45,
            note: "Feed, bathe, and walk with rescued elephants — no riding, hotel pickup included",
            current: true,
          },
          {
            name: "Elephant Nature Park (full day)",
            cost: 77,
            note: "The best-known ethical sanctuary; full-day visit with lunch",
          },
        ],
      },
    ],
    phuket: [
      {
        day: 8,
        title: "Phi Phi & Maya Bay by speedboat",
        options: [
          {
            name: "Standard speedboat day tour",
            cost: 75,
            note: "Phi Phi, Maya Bay viewing, and Khai Island snorkeling with lunch; ~400 THB park fee paid on arrival",
            current: true,
          },
          {
            name: "Premium small-group speedboat",
            cost: 110,
            note: "Smaller boat, better snorkel stops, full lunch service",
          },
        ],
      },
      {
        day: 9,
        title: "Big Buddha & Phuket Old Town",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Big Buddha hilltop + Wat Chalong; grab a taxi or rented scooter",
            current: true,
          },
          {
            name: "Old Town food & history walk",
            cost: 40,
            note: "Guided wander through the Sino-Portuguese shophouse streets with tastings",
          },
        ],
      },
    ],
  },
  itinPool: {
    bangkok: [
      {
        id: "b-arrive",
        travel: true,
        move: "arrive",
        lodging: "bangkok",
        cityTag: "Bangkok — arrive",
        sun: "18:12",
        title: "Land, settle into Sukhumvit",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Suvarnabhumi (BKK).",
            detail:
              "Airport Rail Link into Phaya Thai, then a short BTS hop into Sukhumvit — about 40 minutes door to door. We land separately; meet at the hotel.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Easy first night: street-food stalls off Sukhumvit Soi 38, or a rooftop bar to watch the city light up.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight is a street-food wander or a straight-to-bed night.",
      },
      {
        id: "b-palace",
        cityTag: "Bangkok",
        sun: "18:13",
        title: "Grand Palace, Wat Pho & the river",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Grand Palace & Wat Phra Kaew.",
            detail:
              "Go early — the complex gets hot and crowded by 10am. Dress code is strict: covered shoulders and knees.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Riverside lunch, then Wat Arun at golden hour.",
            detail:
              "Cross the Chao Phraya by cross-river ferry (a few baht) for the Temple of Dawn lit low and gold.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Wat Pho next door has the 46-metre reclining Buddha and the original Thai-massage school — worth an hour and a foot massage.",
          },
        ],
        fuller:
          "Add a sunset <b>Chao Phraya dinner cruise</b> — river breeze, skyline lights, a buffet on the water.",
        ask: "one big hike-equivalent day (Palace + Wat Pho + Wat Arun back to back) or split it and keep the afternoon slow?",
      },
      {
        id: "b-market",
        cityTag: "Bangkok",
        sun: "18:14",
        title: "Floating market & old Bangkok",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Damnoen Saduak or Amphawa floating market.",
            detail:
              "Boats stacked with produce and noodle bowls cooked right off the hull — go early before the tour buses arrive.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Evening street-food crawl through Chinatown (Yaowarat).",
            detail:
              "Grilled skewers, oyster omelets, and the neon signage that makes Yaowarat Road famous after dark.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "If the dates land on a weekend, swap in Chatuchak Weekend Market — 8,000+ stalls, easily half a day.",
          },
        ],
        fuller:
          "Upgrade to a <b>longtail-boat khlong tour</b> through the back canals — a quieter, more local Bangkok than the tour-bus market stop.",
      },
      {
        id: "b-lastday",
        cityTag: "Bangkok",
        sun: "18:15",
        title: "A last Bangkok wander",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Jim Thompson House, or a slow shopping morning.",
            detail:
              "The silk merchant's teak house and garden is a calm break from temple-hopping; Terminal 21 and Icon Siam cover the shopping.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A rooftop send-off dinner.",
            detail:
              "Bangkok's skyline bars are worth one splurge night before heading north.",
          },
        ],
        fuller:
          "Pack the morning tighter with a <b>Thai cooking class</b> — market visit plus a hands-on lunch, if the elephant sanctuary in Chiang Mai already covers the animal-encounter box.",
      },
    ],
    chiangMai: [
      {
        id: "cm-arrive",
        travel: true,
        move: "b-cm",
        lodging: "chiangMai",
        cityTag: "Bangkok → Chiang Mai",
        sun: "18:05",
        title: "North to the mountains",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Domestic flight BKK → Chiang Mai (CNX), ~1h20.",
            detail:
              "Land, drop bags, and walk straight into the Old City — everything's inside the moat.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Wat Phra Singh & Wat Chedi Luang.",
            detail:
              "Two of the Old City's grandest temples, an easy walk apart — softer and quieter than Bangkok's palace crowds.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at the Night Bazaar.",
            detail:
              "Khao soi, grilled skewers, and market stalls along Chang Klan Road.",
          },
        ],
        ask: "leave Bangkok with enough runway before the flight — Old City traffic to the airport can run long.",
      },
      {
        id: "cm-elephant",
        cityTag: "Chiang Mai",
        sun: "18:03",
        title: "Ethical elephants & Doi Suthep",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Half-day ethical elephant sanctuary.",
            detail:
              "Feed, bathe, and walk with rescued elephants — no riding, no performances. Pickup from the hotel.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Khao soi lunch back in town.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Doi Suthep at sunset — the golden chedi and a sweeping view back down over the city.",
          },
        ],
        fuller:
          "Prefer more time with the elephants? Upgrade to <b>Elephant Nature Park's full-day visit</b>, with a river mud spa and a proper sit-down lunch.",
        ask: "half-day sanctuary and a slow afternoon, or the full-day version and skip Doi Suthep?",
      },
      {
        id: "cm-cooking",
        cityTag: "Chiang Mai",
        sun: "18:01",
        title: "Cooking class & the Old City bazaar",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Thai cooking class.",
            detail:
              "Market visit first to pick ingredients, then a hands-on class — pad thai, curry paste from scratch, mango sticky rice.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner is whatever you just cooked.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "If it's a Sunday, the Sunday Walking Street bazaar takes over the whole Old City after dark.",
          },
        ],
      },
    ],
    phuket: [
      {
        id: "p-arrive",
        travel: true,
        move: "cm-p",
        lodging: "phuket",
        cityTag: "Chiang Mai → Phuket",
        sun: "18:30",
        title: "South to the beaches",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Domestic flight Chiang Mai → Phuket (HKT), ~2h.",
            detail:
              "Sometimes routed through Bangkok — check the connection time before booking.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Check in, then straight to the sand.",
            detail:
              "First sunset on Kata or Karon beach — the whole point of coming south.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Beachside seafood dinner.",
            detail: "Grilled catch of the day, feet in the sand.",
          },
        ],
      },
      {
        id: "p-phiphi",
        cityTag: "Phuket",
        sun: "18:32",
        title: "Phi Phi & Maya Bay by speedboat",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Full-day Phi Phi / Maya Bay / Khai Island speedboat tour.",
            detail:
              "Snorkeling stops, a viewing pass by Maya Bay, and lunch on board. Bring cash for the ~400 THB park fee.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lunch is included on the boat.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Sunset drinks back at the resort — it's a full day on the water.",
          },
        ],
        fuller:
          "Want fewer crowds? A <b>premium small-group speedboat</b> hits the same stops with a smaller boat and better snorkel time.",
      },
      {
        id: "p-oldtown",
        cityTag: "Phuket",
        sun: "18:34",
        title: "Big Buddha & Phuket Old Town",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Big Buddha & Wat Chalong.",
            detail:
              "The 45-metre hilltop Buddha has the best island-wide viewpoint on Phuket.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Phuket Old Town.",
            detail:
              "Sino-Portuguese shophouse streets, and some of the island's best food away from the beach strip.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Lard Yai Sunday walking street if the dates line up, or the Chillva night market any night.",
          },
        ],
      },
      {
        id: "p-flex",
        cityTag: "Phuket",
        sun: "18:35",
        title: "A slow beach day (flex)",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Nothing scheduled — a real beach day.",
            detail:
              "Kata or Karon, a paperback, and no plan. This is the buffer night in the trip.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "If restless, Phang Nga Bay's James Bond Island makes a good half-day boat trip instead.",
          },
        ],
        ask: "keep this a true do-nothing day, or swap in the Phang Nga Bay boat trip?",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "18:36",
    cityTag: "Phuket → home",
    title: "Fly home from Phuket",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Phuket (HKT) → home.",
        detail:
          "No car to return this time — just build in buffer for beach-town traffic on the way to the airport.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the last morning is beach time vs. a dash to HKT.",
  },
  visaPlan: {
    "b-arrive": "Arrive Bangkok (BKK); Airport Rail Link into Sukhumvit.",
    "b-palace": "Grand Palace, Wat Phra Kaew, Wat Pho & Wat Arun.",
    "b-market":
      "Floating market (Damnoen Saduak / Amphawa); Chinatown street food.",
    "b-lastday": "Jim Thompson House / shopping; rooftop dinner.",
    "cm-arrive":
      "Fly to Chiang Mai; Wat Phra Singh, Wat Chedi Luang, Night Bazaar.",
    "cm-elephant": "Ethical elephant sanctuary; Doi Suthep at sunset.",
    "cm-cooking": "Thai cooking class; Old City bazaar.",
    "p-arrive": "Fly to Phuket; first sunset on Kata / Karon beach.",
    "p-phiphi": "Phi Phi & Maya Bay speedboat tour with snorkeling.",
    "p-oldtown": "Big Buddha, Wat Chalong & Phuket Old Town.",
    "p-flex": "Flex beach day — or Phang Nga Bay boat trip.",
    depart: "Depart Phuket (HKT); fly home.",
  },
};
