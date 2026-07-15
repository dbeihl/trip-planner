export default {
  meta: {
    title: "Seoul & Busan by Rail — Oct 2027",
    route: ["seoul", "busan"],
    optionalCities: [],
    flexNightDefault: "seoul",
    dates: { arrive: "2027-10-10", depart: "2027-10-18", nights: 8 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into Incheon (ICN), out of Busan/Gimhae (PUS) — open jaw, no rental car",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.1, // Korean VAT is usually included; small planning margin only
    destLabel: "Seoul",
    ui: {
      eyebrow:
        'Oct 10 → Oct 18, 2027 · <span class="traveler-count-lbl">2</span> travelers · self-booked rail trip',
      planTitle: "Seoul &amp; Busan by High-Speed Rail",
      planSub:
        "Five nights in Seoul, then the KTX bullet train south to three nights in Busan — an open-jaw into Incheon and home from Gimhae, no rental car needed. Palaces and street food up north, beaches and temples down south. Pick a hotel tier per stop; train fares and transfers fold into the grand total. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — flights to Seoul, home from Busan",
      flightsIntro:
        "Two travelers converging on Seoul. Pick a routing for each — fares fold into the grand total. Fly into Incheon (ICN), out of Busan/Gimhae (PUS) so the whole trip moves in one direction, city to city, by train.",
      itinTitle: "Seoul &amp; Busan — eight nights by rail",
      itinDek:
        "A sweep down the peninsula in mid-autumn: Joseon palaces and night markets in Seoul, a DMZ day at the world's tensest border, then the KTX south to Busan for coastal temples, a mountain village of painted houses, and Korea's best seafood market. One anchor a day, real table time, and enough slack to wander.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "SkyTeam/Delta preferred · open-jaw, fewest stops",
      options: [
        {
          name: "Delta / Korean Air via Seattle",
          route: "IND → SEA → ICN · PUS → ICN → SEA → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1450,
          note: "SkyTeam throughout; SEA–ICN nonstop widebody, home from Busan via Incheon",
          current: true,
        },
        {
          name: "Delta via Atlanta & Seoul",
          route: "IND → ATL → ICN · PUS → ICN → ATL → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1520,
          note: "Delta's ATL–ICN nonstop; single connection each way",
        },
        {
          name: "Korean Air via Detroit",
          route: "IND → DTW → ICN · PUS → ICN → DTW → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1490,
          note: "Delta feeder to Korean Air's DTW–ICN nonstop",
        },
        {
          name: "Korean Air via Seattle (Prestige)",
          route: "IND → SEA → ICN · PUS → ICN → SEA → IND",
          stops: 1,
          cabin: "Premium (Prestige)",
          fare: 3100,
          note: "Same routing in Korean Air's lie-flat business cabin for the long sector",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (DVO)",
      traveler: "Partner",
      pax: 1,
      preference: "Fewest stops · direct Manila–Seoul where possible",
      options: [
        {
          name: "Philippine Airlines via Manila",
          route: "DVO → MNL → ICN · PUS → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 640,
          note: "PAL throughout; MNL–ICN nonstop, direct Busan–Manila on the way home",
          current: true,
        },
        {
          name: "Korean Air / Jin Air via Manila",
          route: "DVO → MNL → ICN · PUS → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 690,
          note: "MNL feeder, Korean group both ways; direct PUS–MNL return",
        },
        {
          name: "Cebu Pacific via Manila",
          route: "DVO → MNL → ICN · PUS → MNL → DVO",
          stops: 1,
          cabin: "Economy (budget)",
          fare: 420,
          note: "Cheapest; low-cost carrier, bags and seats à la carte",
        },
        {
          name: "Asiana via Manila & Incheon",
          route: "DVO → MNL → ICN · PUS → ICN → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 710,
          note: "Star Alliance alternative; Busan return backtracks through Incheon",
        },
      ],
    },
    lax: {
      label: "From Los Angeles (LAX) — preset option",
      traveler: "Preset",
      pax: 1,
      preset: true,
      preference: "Nonstop transpacific preferred",
      options: [
        {
          name: "Korean Air nonstop",
          route: "LAX → ICN · PUS → ICN → LAX",
          stops: 0,
          cabin: "Economy",
          fare: 1180,
          note: "LAX–ICN nonstop out; one stop through Incheon on the Busan return",
          current: true,
        },
        {
          name: "Asiana nonstop",
          route: "LAX → ICN · PUS → ICN → LAX",
          stops: 0,
          cabin: "Economy",
          fare: 1210,
          note: "Star Alliance nonstop to Seoul; Busan return via Incheon",
        },
        {
          name: "Delta nonstop",
          route: "LAX → ICN · PUS → ICN → LAX",
          stops: 0,
          cabin: "Main Cabin",
          fare: 1240,
          note: "SkyTeam nonstop; connect at Incheon coming home",
        },
      ],
    },
  },
  hotels: {
    seoul: {
      baseNights: 4,
      label: "Seoul",
      header: "Seoul — Myeongdong / Jongno",
      options: [
        {
          name: "Philstay Myeongdong",
          rate: 88,
          rating: "8.1",
          note: "Budget boutique steps from Myeongdong's night market",
        },
        {
          name: "Nine Tree Premier Myeongdong II",
          rate: 155,
          rating: "8.6",
          note: "Reliable mid-range, walkable to two palaces and the subway",
        },
        {
          name: "L7 Myeongdong by Lotte",
          rate: 195,
          rating: "8.8",
          note: "Design hotel with a rooftop bar over Namsan — current pick",
          current: true,
        },
        {
          name: "Josun Palace, Gangnam",
          rate: 340,
          rating: "9.1",
          note: "Luxury Collection tower south of the river",
        },
        {
          name: "Four Seasons Seoul",
          rate: 560,
          rating: "9.3",
          note: "Gwanghwamun, at the foot of the palace district",
        },
      ],
    },
    busan: {
      baseNights: 3,
      label: "Busan",
      header: "Busan — Haeundae Beach",
      options: [
        {
          name: "Hound Hotel Haeundae Beach",
          rate: 95,
          rating: "8.0",
          note: "Budget-friendly, a block back from the sand",
        },
        {
          name: "Haeundae Grand Hotel",
          rate: 160,
          rating: "8.5",
          note: "Beachfront mid-range with an ocean-view breakfast — current pick",
          current: true,
        },
        {
          name: "Paradise Hotel Busan",
          rate: 265,
          rating: "8.9",
          note: "Beachfront resort with seawater spa and casino",
        },
        {
          name: "Park Hyatt Busan",
          rate: 430,
          rating: "9.2",
          note: "Marina tower with floor-to-ceiling bay views",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Incheon (ICN) · AREX + metro into Seoul",
        note: "~43 min AREX express to Seoul Station, then metro/taxi to the hotel",
        toggles: [],
        routeDetail: false,
        flat: { cost: 30, scale: "person" },
      },
      {
        id: "s-b",
        from: "seoul",
        to: "busan",
        routeName: "Seoul → <strong>Busan</strong>",
        note: "KTX high-speed train, ~2h40 Seoul Station → Busan Station",
        toggles: [],
        routeDetail: false,
        flat: { cost: 92, scale: "person" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Busan</strong> → Gimhae (PUS) · fly home",
        note: "Busan–Gimhae Light Rail or airport limousine bus, ~50 min",
        toggles: [],
        routeDetail: false,
        flat: { cost: 26, scale: "person" },
      },
    ],
  },
  activities: {
    seoul: [
      {
        day: 2,
        title: "Gyeongbokgung Palace & Bukchon Hanok Village",
        options: [
          {
            name: "Self-guided with palace ticket",
            cost: 6,
            note: "Palace entry (₩3,000pp; free in hanbok), then wander Bukchon's lanes on your own",
            current: true,
          },
          {
            name: "Palace + Bukchon guided walking tour",
            cost: 70,
            note: "3-hr small-group history walk, catches the changing-of-the-guard",
          },
          {
            name: "Hanbok rental + private guide",
            cost: 120,
            note: "Traditional dress for free palace entry, plus a private half-day guide",
          },
        ],
      },
      {
        day: 3,
        title: "DMZ & the Joint Security Area",
        options: [
          {
            name: "DMZ half-day bus tour",
            cost: 130,
            note: "Imjingak, the 3rd Infiltration Tunnel, Dora Observatory — the standard loop",
            current: true,
          },
          {
            name: "DMZ + JSA (Panmunjom) full day",
            cost: 240,
            note: "Adds the blue conference huts at the truce line; passport + advance booking required",
          },
        ],
      },
      {
        day: 4,
        title: "Namsan, N Seoul Tower & Myeongdong",
        options: [
          {
            name: "Self-guided (cable car + street food)",
            cost: 30,
            note: "Namsan cable car up to the tower base, then graze Myeongdong's night market",
            current: true,
          },
          {
            name: "N Seoul Tower observatory + evening food tour",
            cost: 95,
            note: "Skip-the-line observatory deck plus a guided Myeongdong tasting crawl",
          },
        ],
      },
      {
        day: 5,
        title: "Changdeokgung, Insadong & a flex day",
        options: [
          {
            name: "Self-guided (palace + Secret Garden)",
            cost: 16,
            note: "Changdeokgung with the timed Secret Garden tour, then teahouses in Insadong",
            current: true,
          },
          {
            name: "Korean cooking class",
            cost: 130,
            note: "Hands-on kimchi + bibimbap class, market visit included",
          },
          {
            name: "Day trip to Nami Island & Petite France",
            cost: 150,
            note: "Guided out-of-city day for the tree-lined island and film-set villages",
          },
        ],
      },
    ],
    busan: [
      {
        day: 7,
        title: "Gamcheon Culture Village & Haedong Yonggungsa",
        options: [
          {
            name: "Self-guided (metro + bus)",
            cost: 8,
            note: "The painted hillside village by morning, the cliffside seaside temple by afternoon",
            current: true,
          },
          {
            name: "Busan city highlights guided tour",
            cost: 110,
            note: "Full-day small-group loop covering both plus Songdo Skywalk",
          },
        ],
      },
      {
        day: 8,
        title: "Gyeongju day trip — Silla's old capital",
        options: [
          {
            name: "Self-guided by KTX + local bus",
            cost: 60,
            note: "~30 min KTX to Gyeongju for Bulguksa Temple and the royal tomb park",
            current: true,
          },
          {
            name: "Gyeongju full-day guided tour",
            cost: 175,
            note: "Door-to-door guide covering Bulguksa, Seokguram Grotto and Anapji Pond",
          },
          {
            name: "Haeundae beach & Jagalchi market (stay in Busan)",
            cost: 0,
            note: "Skip the day trip — the beach, the aquarium, and Korea's biggest fish market",
          },
        ],
      },
    ],
  },
  itinPool: {
    seoul: [
      {
        id: "s-arrive",
        travel: true,
        move: "arrive",
        lodging: "seoul",
        cityTag: "Seoul — arrive",
        sun: "18:02",
        title: "Land, get into the city, first taste of Seoul",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Incheon (ICN); AREX express into Seoul.",
            detail:
              "~43 min on the express train to Seoul Station, then metro or a short cab to the hotel. We land separately — meet at the hotel, not the airport.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First dinner in Myeongdong.",
            detail:
              "Ease in with Korean BBQ or a bowl of gukbap and a walk through the night-market food stalls. No agenda beyond staying awake past 9pm.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Grab a T-money transit card at any convenience store and load it — it runs the metro, buses, and the KTX-station lockers all trip.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a real dinner in it or just a convenience-store run.",
      },
      {
        id: "s-palaces",
        cityTag: "Seoul — old capital",
        sun: "18:00",
        title: "Joseon palaces and the hanok lanes",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Gyeongbokgung & Bukchon Hanok Village.",
            detail:
              "The grand Joseon palace — time it for the changing-of-the-guard — then uphill into Bukchon's lanes of tile-roofed hanok houses, still lived in.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lunch in a Bukchon teahouse, dinner in Insadong.",
            detail:
              "Knife-cut noodles or a traditional set; Insadong after dark for craft shops and makgeolli.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Rent a hanbok near the gate and palace entry is free — the classic Seoul photo, and a genuinely fun way to see it.",
          },
        ],
        fuller:
          "Add a <b>guided palace + Bukchon walk</b> so the history behind the gates and guardposts actually lands.",
        ask: "guided history walk, or self-guided in a rented hanbok for free entry?",
      },
      {
        id: "s-dmz",
        cityTag: "Seoul — day out",
        sun: "17:58",
        title: "A day at the world's tensest border",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The DMZ — Dorasan, the tunnels, the observatory.",
            detail:
              "An hour north to the Demilitarized Zone: peer into the North from Dora Observatory, walk a captured infiltration tunnel, stand at the last station before the line.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner back in the city.",
            detail:
              "A heavy day — come back for grilled galbi and cold naengmyeon in Jongno.",
          },
        ],
        fuller:
          "Upgrade to the full-day <b>JSA / Panmunjom</b> tour to stand in the blue huts that straddle the actual truce line — passport and advance booking required.",
        ask: "half-day DMZ loop, or the full-day JSA that needs a passport and booking weeks ahead?",
      },
      {
        id: "s-namsan",
        cityTag: "Seoul",
        sun: "17:56",
        title: "The tower, the market, and a night view",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Namsan & N Seoul Tower.",
            detail:
              "Cable car up the city mountain for the skyline; the tower base is a park with the whole valley of light below at dusk.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Myeongdong street-food crawl.",
            detail:
              "Tornado potatoes, gyeranppang, grilled lobster tails, hotteok — graze the stalls rather than sitting down.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Detour through Gwangjang Market for bindaetteok and live-octopus dares if the group's game.",
          },
        ],
        fuller:
          "Trade the self-guided version for the <b>observatory + guided food tour</b> if you'd rather someone else pick the best stalls.",
      },
      {
        id: "s-flex",
        cityTag: "Seoul",
        sun: "17:54",
        title: "Secret Garden, teahouses, and a flex day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Changdeokgung & the Secret Garden.",
            detail:
              "The prettiest of the five palaces; book the timed Secret Garden tour for the royal rear gardens, then Insadong's teahouses and antique alleys.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Last Seoul dinner in Gwangjang or Euljiro.",
            detail:
              "Retro-cool Euljiro for grilled meat and craft beer, or the market for the classics one more time.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "This is the flex day — a cooking class, a Han River bike ride, or the Nami Island day trip if you want out of the city.",
          },
        ],
        fuller:
          "Push the flex to a guided <b>Nami Island & Petite France</b> day — the tree-lined island and film-set villages an hour out of Seoul.",
        ask: "keep the flex night in Seoul, or shift it down to an extra night in Busan?",
      },
    ],
    busan: [
      {
        id: "b-arrive",
        travel: true,
        move: "s-b",
        lodging: "busan",
        cityTag: "Seoul → Busan",
        sun: "17:51",
        title: "Bullet train south to the sea",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "KTX Seoul → Busan, ~2h40.",
            detail:
              "Seoul Station to Busan Station at 300 km/h, city center to city center — no airport in between. Forward the big bags or just roll them on.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Haeundae Beach at dusk.",
            detail:
              "Drop the bags and walk the crescent of sand; the boardwalk and Dalmaji hill light up as the evening comes on.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First Busan dinner — the seaside city runs on seafood.",
            detail:
              "Grilled fish, spicy jjamppong, or milmyeon (the local cold wheat noodle) near the beach.",
          },
        ],
        ask: "which KTX time — a morning departure buys a full first afternoon on the coast.",
      },
      {
        id: "b-gamcheon",
        cityTag: "Busan",
        sun: "17:49",
        title: "A painted village and a temple on the sea",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Gamcheon Culture Village & Haedong Yonggungsa.",
            detail:
              "The pastel hillside of stacked houses and murals by day; the rare seaside Buddhist temple on the cliffs above the surf by afternoon.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Jagalchi Market for the freshest catch.",
            detail:
              "Pick your fish downstairs at Korea's biggest seafood market, have it grilled or served raw upstairs.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Sunset from the Songdo Skywalk or the Gwangan Bridge waterfront if there's light left.",
          },
        ],
        fuller:
          "Let a <b>Busan highlights guide</b> handle the bus-hopping between the village, the temple, and the skywalk in one full day.",
      },
      {
        id: "b-gyeongju",
        cityTag: "Busan — day out",
        sun: "17:47",
        title: "Silla's thousand-year capital, or a slow beach day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Gyeongju — Bulguksa Temple & the royal tombs.",
            detail:
              "A half-hour KTX up to the open-air museum of the Silla kingdom: the UNESCO temple, the grassy burial mounds, Anapji Pond mirrored at dusk.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Ssambap in Gyeongju, or seafood back in Busan.",
            detail:
              "The old capital's specialty is a spread of wrap-your-own rice and sides; or save it and eat by the water in Haeundae.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Not up for the trip? Haeundae's beach, the aquarium, and the Blueline Park sky capsule make an easy last day in Busan.",
          },
        ],
        fuller:
          "Take the <b>full-day Gyeongju guide</b> to add Seokguram Grotto up the mountain — hard to reach on your own by bus.",
        ask: "the Gyeongju history day, or a slow last day on Haeundae Beach?",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "17:45",
    cityTag: "Busan → home",
    title: "To Gimhae Airport and the long way home",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Busan → Gimhae (PUS), ~50 min.",
        detail:
          "The Busan–Gimhae Light Rail or an airport limousine bus from Haeundae; build in buffer. One last bowl of milmyeon before the gate if there's time.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a last beach walk vs. a dash for the light rail.",
  },
  visaPlan: {
    "s-arrive": "Arrive Incheon (ICN); AREX express into Seoul; Myeongdong.",
    "s-palaces": "Gyeongbokgung Palace & Bukchon Hanok Village; Insadong.",
    "s-dmz": "DMZ day trip — Dora Observatory, infiltration tunnel, Imjingak.",
    "s-namsan": "Namsan & N Seoul Tower; Myeongdong night market.",
    "s-flex": "Changdeokgung & Secret Garden; Insadong — flex day in Seoul.",
    "b-arrive": "KTX to Busan; Haeundae Beach.",
    "b-gamcheon":
      "Gamcheon Culture Village, Haedong Yonggungsa Temple & Jagalchi Market.",
    "b-gyeongju":
      "Gyeongju day trip — Bulguksa Temple & royal tombs — or Haeundae Beach.",
    depart: "Busan–Gimhae Light Rail to Gimhae (PUS); depart.",
  },
};
