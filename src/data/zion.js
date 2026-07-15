export default {
  meta: {
    title: "Zion Deep-Dive — Apr 2026",
    route: ["springdale", "bryce"],
    optionalCities: [],
    flexNightDefault: "springdale",
    dates: { arrive: "2026-04-18", depart: "2026-04-24", nights: 6 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into and out of Las Vegas, short rental-car loop up to Zion and Bryce",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.13, // UT lodging tax + resort/park fees
    destLabel: "Las Vegas", // gateway shown for an "Other airport" origin / drive
    ui: {
      eyebrow:
        'Apr 18 → Apr 24, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked road trip',
      planTitle: "Zion Deep-Dive",
      planSub:
        "No rushing through — four nights based in Springdale to actually work through Zion (Angels Landing, the Narrows, Kolob Canyons, the east side), then one night at Bryce for the hoodoos on the way out. Pick a lodge tier per stop; the rental SUV, fuel, and park pass fold into the total. Every figure is a researched 2026 planning estimate.",
      flightsTitle: "Getting there — flights to the gateway",
      flightsIntro:
        "Two travelers converging on Las Vegas. Pick a routing for each — fares fold into the grand total. Fly into and out of Las Vegas (LAS); the rental car handles the rest.",
      itinTitle: "Utah, by road — six nights, one canyon done properly",
      itinDek:
        "Zion gets the time it actually deserves: Angels Landing, a Narrows wade, the quiet Kolob Canyons finger, and a slow morning at Emerald Pools before the short hop up to Bryce for sunrise over the hoodoos.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops · nonstop where it exists",
      options: [
        {
          name: "Southwest / Allegiant (seasonal nonstop)",
          route: "IND → LAS",
          stops: 0,
          cabin: "Economy",
          fare: 268,
          note: "Seasonal IND–LAS nonstop; two free checked bags on Southwest",
          current: true,
        },
        {
          name: "United via Denver",
          route: "IND → DEN → LAS",
          stops: 1,
          cabin: "Economy",
          fare: 298,
          note: "Frequent IND–DEN, then a short hop into Las Vegas",
        },
        {
          name: "American via Phoenix",
          route: "IND → PHX → LAS",
          stops: 1,
          cabin: "Main Cabin",
          fare: 315,
          note: "AA hub connection with a reliable schedule",
        },
        {
          name: "Delta via Salt Lake City",
          route: "IND → SLC → LAS",
          stops: 1,
          cabin: "Main Cabin",
          fare: 330,
          note: "Backup routing if the nonstop sells out",
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
          name: "Philippine Airlines + United",
          route: "DVO → MNL → LAX → LAS",
          stops: 3,
          cabin: "Economy",
          fare: 1330,
          note: "Long-haul to LA, short connector on to Las Vegas",
          current: true,
        },
        {
          name: "ANA + United (Star Alliance)",
          route: "DVO → MNL → NRT → DEN → LAS",
          stops: 3,
          cabin: "Economy",
          fare: 1470,
          note: "Alliance routing via Tokyo + Denver",
        },
        {
          name: "Korean Air + Delta (SkyTeam)",
          route: "DVO → MNL → ICN → SLC → LAS",
          stops: 3,
          cabin: "Economy",
          fare: 1400,
          note: "SkyTeam via Incheon + Salt Lake City",
        },
        {
          name: "EVA Air + American",
          route: "DVO → MNL → TPE → PHX → LAS",
          stops: 3,
          cabin: "Economy",
          fare: 1550,
          note: "Via Taipei + Phoenix; longer total transit",
        },
      ],
    },
    jfk: {
      label: "USA — Guest (JFK)",
      traveler: "Guest",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Nonstop preferred",
      options: [
        {
          name: "JetBlue nonstop",
          route: "JFK → LAS",
          stops: 0,
          cabin: "Economy",
          fare: 228,
          note: "JetBlue's transcon nonstop, extra legroom available",
          current: true,
        },
        {
          name: "Delta nonstop",
          route: "JFK → LAS",
          stops: 0,
          cabin: "Main Cabin",
          fare: 260,
          note: "Multiple daily nonstops",
        },
        {
          name: "American via Dallas/Fort Worth",
          route: "JFK → DFW → LAS",
          stops: 1,
          cabin: "Main Cabin",
          fare: 245,
          note: "Backup routing via the DFW hub",
        },
        {
          name: "Spirit nonstop (budget)",
          route: "JFK → LAS",
          stops: 0,
          cabin: "Basic Economy",
          fare: 158,
          note: "Cheapest nonstop; bags and seats cost extra",
        },
      ],
    },
  },
  hotels: {
    springdale: {
      baseNights: 4,
      label: "Zion",
      header: "Springdale / Zion Canyon",
      options: [
        {
          name: "Bumbleberry Inn",
          rate: 140,
          rating: "7.4",
          note: "No-frills motel a block from the shuttle stop; the budget play for four nights",
        },
        {
          name: "Driftwood Lodge",
          rate: 195,
          rating: "8.3",
          note: "Simple motor-lodge steps from the shuttle stop, orchard views",
          current: true,
        },
        {
          name: "Zion Lodge (in-park)",
          rate: 275,
          rating: "8.6",
          note: "The only in-park lodging, tucked inside the canyon itself",
        },
        {
          name: "Cable Mountain Lodge",
          rate: 340,
          rating: "8.7",
          note: "Upscale resort feel a few steps from the South Entrance",
        },
        {
          name: "Cliffrose Springdale, Curio Collection by Hilton",
          rate: 385,
          rating: "8.9",
          note: "Riverside grounds, pool, and red-rock views at the park gate",
        },
      ],
    },
    bryce: {
      baseNights: 1,
      label: "Bryce",
      header: "Bryce Canyon City",
      options: [
        {
          name: "Best Western Plus Ruby's Inn",
          rate: 175,
          rating: "8.0",
          note: "Sprawling lodge a mile from the park entrance, big breakfast",
          current: true,
        },
        {
          name: "Bryce Canyon Grand Hotel",
          rate: 225,
          rating: "8.2",
          note: "Newer hotel just outside the park boundary",
        },
        {
          name: "Bryce Canyon Lodge (in-park)",
          rate: 265,
          rating: "8.6",
          note: "The only in-park lodge, walking distance to Sunset Point",
        },
      ],
    },
  },
  transport: {
    rental: {
      perDay: 90,
      oneTime: 150,
      label: "Rental SUV + fuel + park pass",
      ownCarLabel: "Fuel + park pass (own car)",
      note: "Mid-size SUV picked up at LAS (~$90/day) + ~$115 fuel for the short loop + $35 park entry (or upgrade to the $80 America the Beautiful annual pass if you'll use it again).",
    },
    legs: [
      {
        id: "arrive",
        role: "arrival",
        from: "LAS",
        to: "springdale",
        routeName: "Arrive Las Vegas (LAS) → <strong>Springdale</strong>",
        note: "Drive ~2h45 · 160 mi · pick up rental SUV at LAS",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "s-b",
        from: "springdale",
        to: "bryce",
        routeName: "Springdale → <strong>Bryce</strong>",
        note: "Drive ~1h30 · 72 mi (Hwy-9 through the tunnel & Hwy-89)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Bryce</strong> → Las Vegas (LAS)",
        note: "Drive ~4h · 260 mi · fly home",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
    ],
  },
  activities: {
    springdale: [
      {
        day: 2,
        title: "Canyon classics",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Zion Canyon shuttle + the Angels Landing approach trail to Scout Lookout; park entry only",
            current: true,
          },
          {
            name: "Angels Landing permit (lottery)",
            cost: 12,
            note: "$6 non-refundable application + $3/person if selected, for the chains section",
          },
          {
            name: "Guided canyoneering half-day",
            cost: 400,
            note: "Rappelling and slot-canyon scrambling with a local outfitter, gear included",
          },
        ],
      },
      {
        day: 3,
        title: "The Narrows",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Bottom-up wade from the Temple of Sinawava / Riverside Walk; park entry only",
            current: true,
          },
          {
            name: "Full gear rental (dry bibs, boots, poles)",
            cost: 120,
            note: "Outfitted in Springdale the evening before or morning of",
          },
          {
            name: "Top-down guided Narrows hike",
            cost: 500,
            note: "Full-day guided trip through Zion Wilderness with permit, shuttle, and gear",
          },
        ],
      },
    ],
    bryce: [
      {
        day: 6,
        title: "Sunrise over the hoodoos",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Sunrise Point at first light + the Navajo Loop–Queen's Garden combo; park entry only",
            current: true,
          },
          {
            name: "Horseback ride into the amphitheater",
            cost: 150,
            note: "Canyon Trail Rides' 2-hour guided ride down among the hoodoos",
          },
        ],
      },
    ],
  },
  itinPool: {
    springdale: [
      {
        id: "s-arrive",
        travel: true,
        move: "arrive",
        lodging: "springdale",
        cityTag: "Las Vegas — arrive",
        sun: "20:01",
        title: "Into red rock country",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Las Vegas (LAS).",
            detail:
              "Pick up the rental SUV and head north on I-15; about 2h45 to Springdale. We land separately — meet at the lodge or grab a late lunch on the way.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Walk into the park mouth at Canyon Junction for golden hour on the Watchman, then settle in — four days here starts tomorrow.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a canyon-mouth sunset walk in it.",
      },
      {
        id: "s-angels",
        cityTag: "Zion Canyon",
        sun: "20:02",
        title: "Angels Landing and the canyon floor",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Angels Landing (permit) or Scout Lookout.",
            detail:
              "Shuttle to The Grotto; if the lottery permit came through, the chains section is the payoff. If not, Scout Lookout gets nearly the same view without the exposure.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Springdale.",
            detail:
              "Zion Canyon Brew Pub, or a patio table with the cliffs lit up behind you.",
          },
          {
            tag: "Wildlife",
            kind: "soft",
            detail:
              "Mule deer graze the meadows near Zion Lodge most evenings — an easy stop on the shuttle back.",
          },
        ],
        fuller:
          "Add a guided <b>canyoneering half-day</b> — rappelling into a slot canyon with a local outfitter, gear included.",
        ask: "did the Angels Landing lottery come through, or is tomorrow's Narrows day the headline instead?",
      },
      {
        id: "s-narrows",
        cityTag: "Zion Canyon",
        sun: "20:03",
        title: "Wading the Narrows",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Narrows, bottom-up from the Riverside Walk.",
            detail:
              "Rent dry bags and a trekking pole in Springdale, then wade the Virgin River between thousand-foot walls as far up as time and water levels allow.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "An easy dinner back in town.",
            detail: "You'll want dry clothes and a burger, in that order.",
          },
        ],
        fuller:
          "Want the full experience? A <b>top-down guided Narrows hike</b> starts above the crowds and comes down through the whole canyon in one day.",
      },
      {
        id: "s-kolob",
        cityTag: "Zion — Kolob & the east side",
        sun: "20:04",
        title: "Kolob Canyons and the east side",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Kolob Canyons — Timber Creek Overlook.",
            detail:
              "A separate, near-empty entrance off I-15: a short drive up into the finger canyons, then an easy half-mile walk to a view over the Pine Valley Mountains.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Zion–Mt. Carmel Highway & the Canyon Overlook Trail.",
            detail:
              "Back through the main canyon and up the switchbacks through the 1.1-mile tunnel; stop for the short Canyon Overlook Trail on the east side before Checkerboard Mesa.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Springdale.",
            detail: "",
          },
        ],
        fuller:
          "If you'd rather stay in the main canyon, swap Kolob for a lazier loop of <b>Weeping Rock</b> and the lower river trails.",
      },
      {
        id: "s-mellow",
        cityTag: "Zion Canyon",
        sun: "20:05",
        title: "A slow morning among the cottonwoods",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Emerald Pools — Lower, Middle, and Upper.",
            detail:
              "Easy-to-moderate boardwalk and trail up to a trio of pools and waterfalls; the least crowded of Zion's short hikes if you go early.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Browse the Springdale shops and galleries, or just sit on a patio with the canyon walls doing the work.",
          },
        ],
        fuller:
          "This is the flex day — if the extra night lands here instead of Bryce, use it as a rest day or a second run at whichever trail didn't get enough time.",
      },
    ],
    bryce: [
      {
        id: "b-arrive",
        travel: true,
        move: "s-b",
        lodging: "bryce",
        cityTag: "Springdale → Bryce",
        sun: "20:07",
        title: "Up onto the plateau",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Springdale → Bryce Canyon, ~1h30.",
            detail:
              "Highway 9 through the Zion–Mt. Carmel Tunnel, then Highway 89 north onto the Paunsaugunt Plateau — the color shifts from red to orange as you climb.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Sunset Point and the rim at golden hour.",
            detail:
              "First look at the amphitheater — thousands of hoodoos lit sideways. Walk the rim trail over to Sunrise Point for a second angle.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at Ruby's Inn.",
            detail:
              "The general store and cowboy-buffet spread is part of the Bryce ritual.",
          },
        ],
        fuller:
          "Early arrival? Squeeze in the <b>Navajo Loop–Queen's Garden combo</b> (~3 mi) same afternoon instead of waiting for tomorrow's sunrise.",
        ask: "one Bryce night is tight — worth pulling the flex night here instead of a fifth night in Zion?",
      },
      {
        id: "b-sunrise",
        cityTag: "Bryce Canyon",
        sun: "20:08",
        title: "A slower morning among the hoodoos",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Sunrise Point at first light, then the Navajo Loop–Queen's Garden combo.",
            detail:
              "The classic sunrise over the amphitheater, then down into the hoodoos themselves on the park's signature loop.",
          },
        ],
        fuller:
          "Or trade the walk for a <b>horseback ride</b> — Canyon Trail Rides takes you down among the hoodoos from the corral near Bryce Lodge.",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "20:09",
    cityTag: "Bryce → home",
    title: "Drive to Las Vegas and fly out",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Bryce → Las Vegas (LAS), ~4h.",
        detail:
          "Return the car at the airport; build in buffer for the drive and for security. One last stretch of desert on the way out.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a last hoodoo walk vs. a straight shot to the airport.",
  },
  visaPlan: {
    "s-arrive":
      "Arrive Las Vegas (LAS); pick up rental car; drive to Springdale/Zion.",
    "s-angels": "Zion Canyon — Angels Landing or Scout Lookout; canyon floor.",
    "s-narrows": "Zion — The Narrows wade, bottom-up from Riverside Walk.",
    "s-kolob":
      "Kolob Canyons; Zion–Mt. Carmel Highway & Canyon Overlook Trail.",
    "s-mellow": "Emerald Pools; a slow morning in Springdale.",
    "b-arrive": "Drive to Bryce Canyon; Sunset Point & the rim at golden hour.",
    "b-sunrise":
      "Bryce Canyon sunrise; Navajo Loop–Queen's Garden or a horseback ride.",
    depart: "Drive to Las Vegas (LAS); depart.",
  },
};
