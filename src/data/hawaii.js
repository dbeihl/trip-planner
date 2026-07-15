export default {
  meta: {
    title: "Oʻahu & Maui Island-Hop — Feb 2027",
    route: ["oahu", "maui"],
    optionalCities: [],
    flexNightDefault: "maui",
    dates: { arrive: "2027-02-07", depart: "2027-02-15", nights: 8 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into Honolulu, open-jaw home from Kahului (Maui)",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.18, // HI transient accommodations tax + resort fees run steep
    destLabel: "Honolulu",
    ui: {
      eyebrow:
        'Feb 7 → Feb 15, 2027 · <span class="traveler-count-lbl">2</span> travelers · two-island self-drive',
      planTitle: "Oʻahu &amp; Maui Island-Hop",
      planSub:
        "Honolulu first, then a short inter-island hop to Maui — open-jaw home from Kahului so there's no backtrack. Pick a lodging tier per island; the rental cars, the inter-island flight, and Hawaii's transient accommodations tax fold into the total. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — flights to Honolulu",
      flightsIntro:
        "Two travelers converging on Oʻahu. Pick a routing for each — fares fold into the grand total. Fly into Honolulu (HNL); the Oʻahu→Maui leg and the flight home from Kahului (OGG) are handled separately in the itinerary.",
      itinTitle: "Oʻahu &amp; Maui, island to island — eight nights",
      itinDek:
        "Three nights in Waikiki, then a 40-minute hop to Maui for four more. Pearl Harbor and Diamond Head on Oʻahu; the Road to Hana and a Haleakala sunrise on Maui. One anchor a day, plenty of beach in between.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops to Honolulu",
      options: [
        {
          name: "Southwest via the West Coast (cheapest)",
          route: "IND → LAS → HNL",
          stops: 1,
          cabin: "Economy",
          fare: 590,
          note: "Cheapest; two free bags, one West-Coast connection",
          current: true,
        },
        {
          name: "United via Denver",
          route: "IND → DEN → HNL",
          stops: 1,
          cabin: "Economy",
          fare: 620,
          note: "IND–DEN, then United's widebody to Honolulu",
        },
        {
          name: "Delta via Los Angeles",
          route: "IND → LAX → HNL",
          stops: 1,
          cabin: "Economy",
          fare: 640,
          note: "Connect at LAX to the nonstop across the Pacific",
        },
        {
          name: "American via Phoenix",
          route: "IND → PHX → HNL",
          stops: 1,
          cabin: "Main Cabin",
          fare: 660,
          note: "AA's PHX hub feeds several daily HNL nonstops",
        },
      ],
    },
    sf: {
      label: "From the USA — preset — San Francisco (SFO)",
      traveler: "Preset",
      pax: 1,
      preference: "Nonstop preferred",
      preset: true,
      options: [
        {
          name: "United nonstop",
          route: "SFO → HNL",
          stops: 0,
          cabin: "Economy",
          fare: 380,
          note: "Multiple daily nonstops from the Bay Area",
          current: true,
        },
        {
          name: "Alaska Airlines nonstop",
          route: "SFO → HNL",
          stops: 0,
          cabin: "Economy",
          fare: 400,
          note: "Alaska's Hawaii gateway, strong mileage program",
        },
        {
          name: "Hawaiian Airlines nonstop",
          route: "SFO → HNL",
          stops: 0,
          cabin: "Economy",
          fare: 410,
          note: "Direct into HNL, easy connection to the inter-island terminal",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (DVO)",
      traveler: "Partner",
      pax: 1,
      preference: "Fewest stops · one alliance where possible",
      options: [
        {
          name: "Japan Airlines via Tokyo",
          route: "DVO → MNL → NRT → HNL",
          stops: 2,
          cabin: "Economy",
          fare: 1100,
          note: "Oneworld routing via Narita, roomy 787 across the Pacific",
          current: true,
        },
        {
          name: "ANA via Tokyo",
          route: "DVO → MNL → HND → HNL",
          stops: 2,
          cabin: "Economy",
          fare: 1130,
          note: "Star Alliance via Haneda, tight but workable connection",
        },
        {
          name: "United via Guam",
          route: "DVO → MNL → GUM → HNL",
          stops: 2,
          cabin: "Economy",
          fare: 1040,
          note: "Single-carrier option via United's Guam hub",
        },
        {
          name: "Korean Air via Seoul",
          route: "DVO → MNL → ICN → HNL",
          stops: 2,
          cabin: "Economy",
          fare: 1200,
          note: "SkyTeam via Incheon, longer layover but a reliable schedule",
        },
      ],
    },
  },
  hotels: {
    oahu: {
      baseNights: 3,
      label: "Oʻahu",
      header: "Waikiki, Honolulu",
      options: [
        {
          name: "Aqua Aloha Surf Waikiki",
          rate: 165,
          rating: "7.6",
          note: "Budget studio-style rooms two blocks off the beach",
          current: true,
        },
        {
          name: "Aston Waikiki Beach Tower",
          rate: 320,
          rating: "8.6",
          note: "Full-kitchen condo-hotel, oceanfront on the sand",
        },
        {
          name: "Outrigger Reef Waikiki Beach Resort",
          rate: 420,
          rating: "8.4",
          note: "Beachfront resort, steps from Duke's and the zoo",
        },
        {
          name: "Halekulani",
          rate: 950,
          rating: "9.3",
          note: "Legendary luxury beachfront, no resort fee, the orchid pool",
        },
      ],
    },
    maui: {
      baseNights: 4,
      label: "Maui",
      header: "Kīhei / Wailea (Lahaina still rebuilding)",
      options: [
        {
          name: "Maui Vista (Kīhei condo)",
          rate: 195,
          rating: "7.8",
          note: "Condo-style studio across from Kamaole Beach II",
          current: true,
        },
        {
          name: "Mana Kai Maui",
          rate: 265,
          rating: "8.0",
          note: "Oceanfront condo-hotel on Keawakapu Beach, quiet south Kīhei",
        },
        {
          name: "Wailea Beach Resort — Marriott, Maui",
          rate: 620,
          rating: "8.7",
          note: "Full resort on Mokapu Beach, lazy river pool",
        },
        {
          name: "Grand Wailea, A Waldorf Astoria Resort",
          rate: 950,
          rating: "9.1",
          note: "Maui's most elaborate resort — nine pools, waterslides",
        },
      ],
    },
  },
  transport: {
    rental: {
      perDay: 75,
      oneTime: 90,
      label: "Rental car (both islands) + fuel",
      ownCarLabel: "Fuel, both islands (own car)",
      note: "A separate compact/midsize pickup on each island — Oʻahu (~$50-60/day) and Maui (~$60-80/day) — since it's a different counter and drop-off each time. Figures blend to a per-day average; the one-time line covers fuel across both islands plus Hawaii's mandatory $5/day state surcharge.",
    },
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Honolulu (HNL) · pick up rental car",
        note: "~20 min into Waikiki",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "o-m",
        from: "oahu",
        to: "maui",
        routeName: "Honolulu → <strong>Maui</strong> (inter-island flight)",
        note: "~40 min hop on Hawaiian or Southwest · book ahead, fares climb close-in",
        toggles: [],
        routeDetail: false,
        flat: { cost: 160, scale: "person" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Maui</strong> (OGG) → home",
        note: "Return the second rental car at Kahului; fly home",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
    ],
  },
  activities: {
    oahu: [
      {
        day: 2,
        title: "Pearl Harbor & USS Arizona Memorial",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "NPS timed boat ticket — a small recreation fee applies; reserve weeks out",
            current: true,
          },
          {
            name: "Battleship Missouri & Aviation Museum add-on",
            cost: 65,
            note: "Guided half-day extension onto Ford Island",
          },
        ],
      },
      {
        day: 3,
        title: "Diamond Head & Hanauma Bay",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Diamond Head crater hike (reserve online) + afternoon at Hanauma Bay",
            current: true,
          },
          {
            name: "Hanauma Bay entry only",
            cost: 25,
            note: "State park admission, reserve ahead — closed Tue/Wed",
          },
          {
            name: "Guided snorkel & reef tour",
            cost: 95,
            note: "Small-group guided snorkel with gear included",
          },
        ],
      },
    ],
    maui: [
      {
        day: 5,
        title: "Road to Hana",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Just gas and the rental — Twin Falls, Waiʻanapanapa, Hana town",
            current: true,
          },
          {
            name: "Guided Road to Hana van tour",
            cost: 180,
            note: "Someone else drives the 600+ curves; narrated stops",
          },
        ],
      },
      {
        day: 6,
        title: "Haleakalā sunrise",
        options: [
          {
            name: "Self-guided sunrise drive (free + reservation)",
            cost: 30,
            note: "$1 timed-entry reservation plus the park's vehicle fee",
            current: true,
          },
          {
            name: "Guided sunrise + bike descent",
            cost: 220,
            note: "Van up for sunrise, bike back down from the summit",
          },
        ],
      },
      {
        day: 7,
        title: "Molokini snorkel & Lahaina",
        options: [
          {
            name: "Self-guided shore snorkel (free)",
            cost: 0,
            note: "Kamaole beaches or Ahihi-Kīnau; Lahaina Front St. remains closed post-fire",
            current: true,
          },
          {
            name: "Molokini Crater snorkel cruise",
            cost: 160,
            note: "Half-day boat trip to the crescent volcanic islet",
          },
        ],
      },
    ],
  },
  itinPool: {
    oahu: [
      {
        id: "o-arrive",
        travel: true,
        move: "arrive",
        lodging: "oahu",
        cityTag: "Honolulu — arrive",
        sun: "18:07",
        title: "Land, grab the car, ease into Waikiki",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Honolulu (HNL).",
            detail:
              "Pick up the rental car; ~20 min into Waikiki. We land separately — meet at the hotel.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Sunset walk on Waikiki Beach past the Duke Kahanamoku statue, then a casual dinner along Kalākaua Ave.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a sunset swim in it.",
      },
      {
        id: "o-pearl",
        cityTag: "Oʻahu — Pearl Harbor",
        sun: "18:09",
        title: "Pearl Harbor and the USS Arizona",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Pearl Harbor & USS Arizona Memorial.",
            detail:
              "Timed NPS boat tickets — reserve the moment dates lock, the free slots go weeks out. Arrive by 7am for the best availability.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Chinatown or downtown Honolulu.",
            detail: "Walkable historic district, close to the harbor.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "ʻIolani Palace and the Aloha Tower are easy add-ons nearby.",
          },
        ],
        fuller:
          "Add the <b>Battleship Missouri & Pacific Aviation Museum</b> — a half-day extension out on Ford Island.",
        ask: "book Pearl Harbor tickets as soon as dates are locked — they're the one hard reservation on Oʻahu.",
      },
      {
        id: "o-diamond",
        cityTag: "Oʻahu — Diamond Head & Hanauma Bay",
        sun: "18:11",
        title: "A crater hike and the reef",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Diamond Head Crater hike.",
            detail:
              "~1.6 mi round trip up the old volcanic tuff cone; reserve a parking or entry slot online, go early to beat both heat and crowds.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Poke bowls or plate lunch near Kapahulu.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Hanauma Bay snorkel in the afternoon — reserve entry online, closed Tue/Wed for the reef's rest days.",
          },
        ],
        fuller:
          "Prefer a driving day instead? Swap this for the North Shore — Waimea Bay and shrimp trucks in Haleiwa.",
      },
      {
        id: "o-northshore",
        cityTag: "Oʻahu — North Shore (optional)",
        sun: "18:12",
        title: "A day up north",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Circle-island drive to the North Shore.",
            detail:
              "Waimea Bay, Sunset Beach, and the Ehukai overlook above Pipeline — winter is peak surf season if the swell cooperates.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Giovanni's shrimp truck and Matsumoto shave ice in Haleʻiwa.",
            detail: "",
          },
        ],
        fuller:
          "This is the flex day — swap it in for Diamond Head/Hanauma Bay if a driving day sounds better than a hike.",
      },
    ],
    maui: [
      {
        id: "m-arrive",
        travel: true,
        move: "o-m",
        lodging: "maui",
        cityTag: "Oʻahu → Maui",
        sun: "18:13",
        title: "Island-hop to Maui, settle into Kīhei",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Short inter-island flight, HNL → OGG.",
            detail:
              "~40 min on Hawaiian or Southwest. Pick up the second rental car at Kahului; a different counter than Oʻahu's.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Sunset at Kamaole Beach, then a casual dinner in Kīhei to settle in.",
          },
        ],
        ask: "morning or afternoon inter-island hop? An early flight buys back a full Maui afternoon.",
      },
      {
        id: "m-hana",
        cityTag: "Maui — Road to Hana",
        sun: "18:15",
        title: "The Road to Hana, waterfall to waterfall",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Road to Hana.",
            detail:
              "Twin Falls, Waiʻanapanapa black-sand beach, and Hana town at the end of 600-plus curves. Start by 7am — it's a long day.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Banana bread stands and malasadas in Paʻia on the way out.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Pull over often — the roadside pools and lookouts are the point.",
          },
        ],
        fuller:
          "Stay overnight in Hana instead of driving back same-day to slow the whole thing down.",
        ask: "full loop back through Kaupo, or return the way we came? The back road is rougher on the rental.",
      },
      {
        id: "m-haleakala",
        cityTag: "Maui — Haleakalā",
        sun: "18:16",
        title: "Sunrise above the clouds",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Haleakalā sunrise.",
            detail:
              "Reserve the $1 timed sunrise entry online months out. ~10,000 ft summit — dress warm, it's cold up there.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Upcountry brunch in Kula on the way back down.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail: "Afternoon off — the 3am wake-up earns a slow one.",
          },
        ],
        fuller:
          "Add the guided sunrise bike descent for a different way down the mountain.",
        ask: "sunrise (3am wake-up) or trade it for a mellower sunset visit instead?",
      },
      {
        id: "m-molokini",
        cityTag: "Maui — Molokini & Lahaina",
        sun: "18:18",
        title: "Crater snorkeling and a walk through Lahaina",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Molokini Crater snorkel cruise.",
            detail:
              "Half-day boat out to the crescent volcanic islet — some of the clearest water in Hawaii.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner back in Kīhei or Wailea.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Lahaina is still rebuilding after the 2023 wildfire — Front Street remains closed, but Kāʻanapali just north is open; visit respectfully if at all.",
          },
        ],
        fuller:
          "Skip the boat and snorkel Ahihi-Kīnau or Black Rock instead — both good from shore, no charter needed.",
      },
      {
        id: "m-extra",
        cityTag: "Maui — a last easy day",
        sun: "18:19",
        title: "Beach time before flying home",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Wailea beach path.",
            detail:
              "An easy paved walk linking Ulua, Mokapu, and Wailea beaches — no plan required.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A last sunset dinner in Wailea or Kīhei.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail: "Last-minute shopping at Whalers Village in Kāʻanapali.",
          },
        ],
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "18:20",
    cityTag: "Maui → home",
    title: "Fly home from Kahului",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Return the rental car at OGG and fly home.",
        detail:
          "Build in buffer for Hawaii's TSA lines and the drive back from Wailea or Kīhei.",
      },
    ],
    ask: "what time does the flight home leave? It sets how much of the morning is beach vs. airport.",
  },
  visaPlan: {
    "o-arrive": "Arrive Honolulu (HNL); pick up rental car.",
    "o-pearl":
      "Pearl Harbor & USS Arizona Memorial; Chinatown/downtown dinner.",
    "o-diamond": "Diamond Head hike; Hanauma Bay snorkel in the afternoon.",
    "o-northshore":
      "North Shore day trip — Waimea Bay, Sunset Beach, Haleʻiwa.",
    "m-arrive": "Inter-island flight to Maui (OGG); pick up second rental car.",
    "m-hana": "Road to Hana — waterfalls, black-sand beach, Hana town.",
    "m-haleakala": "Haleakalā sunrise; Upcountry brunch.",
    "m-molokini": "Molokini Crater snorkel cruise; Lahaina (post-fire status).",
    "m-extra": "Wailea beach path; last-minute Kāʻanapali shopping.",
    depart: "Return rental car at Kahului (OGG); fly home.",
  },
};
