export default {
  meta: {
    title: "Southwest National Parks Road Trip — May 2027",
    route: ["zion", "bryce", "grandCanyon"],
    optionalCities: [],
    flexNightDefault: "zion",
    dates: { arrive: "2027-05-09", depart: "2027-05-15", nights: 6 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into and out of Las Vegas, driving loop by rental SUV",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.13, // UT/AZ lodging tax + resort/park fees
    destLabel: "Las Vegas", // gateway shown for an "Other airport" origin / drive
    ui: {
      eyebrow:
        'May 9 → May 15, 2027 · <span class="traveler-count-lbl">2</span> travelers · self-booked road trip',
      planTitle: "Southwest National Parks Road Trip",
      planSub:
        "A driving loop out of Las Vegas through Zion, Bryce, and the Grand Canyon's South Rim. Pick a lodge tier per stop; the rental SUV, fuel, and park pass fold into the total. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — flights to the gateway",
      flightsIntro:
        "Two travelers converging on Las Vegas. Pick a routing for each — fares fold into the grand total. Fly into and out of Las Vegas (LAS); the rental car handles the rest.",
      itinTitle: "Utah &amp; Arizona, by road — seven days across three parks",
      itinDek:
        "A tight loop: Zion's canyons, Bryce's hoodoos, and the Grand Canyon's South Rim. One anchor hike or overlook a day, red rock the whole way, and enough drive time to watch the country change under you.",
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
          route: "DVO → MNL → TPE → DFW → LAS",
          stops: 3,
          cabin: "Economy",
          fare: 1550,
          note: "Via Taipei + Dallas; longer total transit",
        },
      ],
    },
    nyc: {
      label: "From the USA — Guest (JFK)",
      traveler: "Guest",
      pax: 1,
      preference: "Nonstop preferred",
      preset: true,
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
          name: "American via Dallas",
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
    zion: {
      baseNights: 2,
      label: "Zion",
      header: "Springdale / Zion Canyon",
      options: [
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
        {
          name: "Stone Canyon Inn (cabins)",
          rate: 340,
          rating: "9.0",
          note: "Private cabins with hoodoo views south of the park",
        },
      ],
    },
    grandCanyon: {
      baseNights: 2,
      label: "Grand Canyon South Rim",
      header: "Grand Canyon Village / Tusayan",
      options: [
        {
          name: "Yavapai Lodge (in-park)",
          rate: 200,
          rating: "7.9",
          note: "Largest in-park lodge, near the General Store and visitor center",
          current: true,
        },
        {
          name: "The Grand Hotel at the Grand Canyon (Tusayan)",
          rate: 255,
          rating: "8.3",
          note: "Full-service hotel with a pool, a mile outside the South Entrance",
        },
        {
          name: "Thunderbird Lodge (in-park, rim-adjacent)",
          rate: 300,
          rating: "8.2",
          note: "A short walk to the rim trail, some rooms with partial canyon views",
        },
        {
          name: "El Tovar Hotel (in-park icon)",
          rate: 470,
          rating: "8.9",
          note: "The 1905 log-and-stone landmark, steps from the rim",
        },
      ],
    },
  },
  transport: {
    rental: {
      perDay: 95,
      oneTime: 155,
      label: "Rental SUV + fuel + park pass",
      ownCarLabel: "Fuel + park entry (own car)",
      note: "Mid-size SUV picked up at LAS (~$95/day) + ~$120 fuel for the full loop + $35 park entry (or upgrade to the $80 America the Beautiful annual pass if you'll use it again).",
    },
    legs: [
      {
        id: "arrive",
        role: "arrival",
        from: "LAS",
        to: "zion",
        routeName: "Arrive Las Vegas (LAS) → <strong>Zion</strong>",
        note: "Drive ~2h45 · 160 mi · pick up rental SUV at LAS",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "z-b",
        from: "zion",
        to: "bryce",
        routeName: "Zion → <strong>Bryce</strong>",
        note: "Drive ~1h30 · 72 mi (Hwy-9 through the tunnel & Hwy-89)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "b-gc",
        from: "bryce",
        to: "grandCanyon",
        routeName: "Bryce → <strong>Grand Canyon</strong>",
        note: "Drive ~4h · 210 mi (Hwy-89 & US-89A via Marble Canyon)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Grand Canyon</strong> → Las Vegas (LAS)",
        note: "Drive ~4h30 · 280 mi · fly home",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
    ],
  },
  activities: {
    zion: [
      {
        day: 2,
        title: "Zion Canyon & Angels Landing",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Zion Canyon shuttle + the Angels Landing approach trail (permit lottery needed for the final chains); park entry only",
            current: true,
          },
          {
            name: "The Narrows guided hike",
            cost: 140,
            note: "Bottom-up wade with a guide; dry-bag & trekking-pole rental included",
          },
          {
            name: "Guided canyoneering half-day",
            cost: 175,
            note: "Rappelling and slot-canyon scrambling with a local outfitter, gear included",
          },
        ],
      },
    ],
    bryce: [
      {
        day: 4,
        title: "Rim trail at sunrise",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Sunrise/Sunset Point + the Navajo Loop–Queen's Garden combo through the hoodoos; park entry only",
            current: true,
          },
          {
            name: "Guided sunrise photography walk",
            cost: 85,
            note: "Small-group walk timed to first light with a local photo guide",
          },
        ],
      },
    ],
    grandCanyon: [
      {
        day: 6,
        title: "South Rim overlooks",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Rim Trail from the Village to Mather Point + the free shuttle out to Hermits Rest; park entry only",
            current: true,
          },
          {
            name: "Desert View Drive + Watchtower guided tour",
            cost: 65,
            note: "Small-van tour east along the rim to the Watchtower and Lipan Point",
          },
          {
            name: "Mule ride to Plateau Point",
            cost: 300,
            note: "Half-day mule trip below the rim; book months ahead",
          },
        ],
      },
    ],
  },
  itinPool: {
    zion: [
      {
        id: "z-arrive",
        travel: true,
        move: "arrive",
        lodging: "zion",
        cityTag: "Las Vegas — arrive",
        sun: "20:24",
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
              "Walk into the park mouth at Canyon Junction for golden hour on the Watchman, or just settle in — tomorrow's a full day.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a canyon-mouth sunset walk in it.",
      },
      {
        id: "z-canyon",
        cityTag: "Zion Canyon",
        sun: "20:25",
        title: "Angels Landing and the canyon floor",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Angels Landing (permit) or the West Rim viewpoint.",
            detail:
              "Shuttle to The Grotto; if the lottery permit came through, the chains section is the payoff. If not, hike to Scout Lookout for nearly the same view without the exposure.",
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
        ask: "did the Angels Landing lottery come through, or are we doing the Narrows instead tomorrow?",
      },
      {
        id: "z-narrows",
        cityTag: "Zion Canyon",
        sun: "20:26",
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
          "Prefer to stay dry? Swap the Narrows for the <b>Kolob Canyons</b> road and the Timber Creek Overlook — a quieter corner of the park, 40 min from Springdale.",
      },
    ],
    bryce: [
      {
        id: "b-arrive",
        travel: true,
        move: "z-b",
        lodging: "bryce",
        cityTag: "Zion → Bryce",
        sun: "20:22",
        title: "Up onto the plateau",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Zion → Bryce Canyon, ~1h30.",
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
        ask: "one Bryce night is tight — worth pulling the flex night here instead of a third night in Zion?",
      },
      {
        id: "b-sunrise",
        cityTag: "Bryce Canyon",
        sun: "20:23",
        title: "A slower morning among the hoodoos",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Sunrise Point at first light, then the Fairyland Loop.",
            detail:
              "The classic sunrise, then a longer, quieter trail (~8 mi) down among the hoodoos most day-trippers never reach.",
          },
        ],
        fuller:
          "Or keep it short: the <b>Navajo Loop–Queen's Garden combo</b> covers the highlights in half the time.",
      },
    ],
    grandCanyon: [
      {
        id: "gc-arrive",
        travel: true,
        move: "b-gc",
        lodging: "grandCanyon",
        cityTag: "Bryce → Grand Canyon",
        sun: "19:44",
        title: "South to the big one",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Bryce → Grand Canyon South Rim, ~4h.",
            detail:
              "Highway 89 south past Kanab, then US-89A through Marble Canyon and over the Navajo Bridge before climbing onto the South Rim — a full day of driving with big views.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "First look at the rim near Mather Point.",
            detail:
              "Nothing prepares you for the scale. Arrive with enough light left to watch it change color into evening.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Grand Canyon Village.",
            detail:
              "El Tovar's dining room if you can get a table, otherwise Bright Angel Lodge.",
          },
        ],
        ask: "leave Bryce early — Navajo Bridge and the canyon overlooks are worth unhurried stops.",
      },
      {
        id: "gc-rim",
        cityTag: "Grand Canyon South Rim",
        sun: "19:45",
        title: "The rim, end to end",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Rim Trail — Village to Hermits Rest (shuttle).",
            detail:
              "A paved, mostly flat trail strung with overlooks; ride the free shuttle out and walk back, or reverse it, stopping wherever the view stops you.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Sunset at Hopi Point.",
            detail:
              "The classic South Rim sunset spot — get there early for a rail-side seat.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Desert View Drive east to the Watchtower is a different, less-crowded stretch of rim if you'd rather drive than walk.",
          },
        ],
        fuller:
          "Want elevation change? The <b>South Kaibab Trail</b> to Ooh Aah Point (~1.8 mi round trip) drops right off the rim for a taste of below-the-edge without the climb back from the river.",
      },
      {
        id: "gc-extra",
        cityTag: "Grand Canyon South Rim",
        sun: "19:46",
        title: "One more morning on the rim",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Bright Angel Trail to the 1.5-Mile Resthouse, or a slow rim morning.",
            detail:
              "A real taste of hiking into the canyon for the ambitious, or a relaxed second pass at the overlooks in softer morning light.",
          },
        ],
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "19:46",
    cityTag: "Grand Canyon → home",
    title: "Drive to Las Vegas and fly out",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Grand Canyon → Las Vegas (LAS), ~4h30.",
        detail:
          "Return the car at the airport; build in buffer for the drive and for security. One last stretch of desert on the way out.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a last rim walk vs. a straight shot to the airport.",
  },
  visaPlan: {
    "z-arrive":
      "Arrive Las Vegas (LAS); pick up rental car; drive to Zion/Springdale.",
    "z-canyon": "Zion Canyon — Angels Landing or Scout Lookout; canyon floor.",
    "z-narrows": "Zion — The Narrows wade / Kolob Canyons alternative.",
    "b-arrive": "Drive to Bryce Canyon; Sunset Point & the rim at golden hour.",
    "b-sunrise":
      "Bryce Canyon sunrise; Fairyland Loop or Navajo Loop–Queen's Garden.",
    "gc-arrive": "Drive to Grand Canyon South Rim; Mather Point.",
    "gc-rim":
      "Grand Canyon Rim Trail — Village to Hermits Rest; Hopi Point sunset.",
    "gc-extra": "Bright Angel Trail taste, or a slow rim morning.",
    depart: "Drive to Las Vegas (LAS); depart.",
  },
};
