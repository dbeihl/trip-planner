export default {
    meta: {
      title: "Yellowstone & Grand Teton — Sep 2026",
      route: ["jackson", "oldFaithful", "canyon", "mammoth"],
      optionalCities: [],
      flexNightDefault: "jackson",
      dates: { arrive: "2026-09-12", depart: "2026-09-20", nights: 8 },
      travelers: {
        count: 2,
        note: "2 travelers; fly into Jackson Hole, out of Bozeman",
      },
      currency: "USD",
      lodgingTaxBuffer: 1.12, // WY/MT lodging tax + park/resort fees
      destLabel: "Jackson Hole", // gateway shown for an "Other airport" origin
      ui: {
        eyebrow:
          'Sep 12 → Sep 20, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked road trip',
        planTitle: "Yellowstone &amp; Grand Teton Road Trip",
        planSub:
          "A driving loop through the Tetons and Yellowstone. Pick a lodge tier per stop; the rental car, fuel, and park pass fold into the total. Every figure is a researched 2026 planning estimate.",
        flightsTitle: "Getting there — flights to the gateway",
        flightsIntro:
          "Two travelers converging on Jackson Hole. Pick a routing for each — fares fold into the grand total. Fly into Jackson Hole (JAC), out of Bozeman (BZN) to skip the backtrack.",
        itinTitle: "Wyoming &amp; Montana, by road — nine days in the parks",
        itinDek:
          "A relaxed loop: Grand Teton, then the Yellowstone grand loop. One anchor a day, wildlife at dawn and dusk, and enough road time to actually see the country in between.",
      },
    },
    flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Delta preferred · fewest stops",
      options: [
        {
          name: "Delta via Salt Lake City",
          route: "IND → SLC → JAC",
          stops: 1,
          cabin: "Main Cabin",
          fare: 480,
          note: "Fewest stops into Jackson Hole; seasonal SLC→JAC nonstop",
          current: true,
        },
        {
          name: "Delta via Minneapolis",
          route: "IND → MSP → BZN",
          stops: 1,
          cabin: "Main Cabin",
          fare: 400,
          note: "Often the cheapest 1-stop; fly out of Bozeman",
        },
        {
          name: "Delta via Atlanta",
          route: "IND → ATL → JAC",
          stops: 1,
          cabin: "Main Cabin",
          fare: 510,
          note: "Seasonal ATL→JAC nonstop",
        },
        {
          name: "Delta via Detroit",
          route: "IND → DTW → BZN",
          stops: 1,
          cabin: "Main Cabin",
          fare: 430,
          note: "Backup via the DTW hub",
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
          name: "Philippine Airlines + Delta",
          route: "DVO → MNL → NRT → SEA → BZN",
          stops: 3,
          cabin: "Economy",
          fare: 1800,
          note: "PAL domestic to Manila, long-haul to Tokyo, Delta to Bozeman",
          current: true,
        },
        {
          name: "Korean Air + Delta (SkyTeam)",
          route: "DVO → MNL → ICN → SLC → JAC",
          stops: 3,
          cabin: "Economy",
          fare: 1900,
          note: "SkyTeam via Incheon + SLC into Jackson",
        },
        {
          name: "United + ANA (Star Alliance)",
          route: "DVO → MNL → NRT → DEN → BZN",
          stops: 3,
          cabin: "Economy",
          fare: 1850,
          note: "Alliance alternative via Tokyo + Denver",
        },
        {
          name: "Cebu Pacific + partners (budget)",
          route: "DVO → MNL → ICN → SEA → BZN",
          stops: 3,
          cabin: "Economy",
          fare: 1720,
          note: "Cheapest — budget domestic + connections, longer transit",
        },
      ],
    },
    ord: {
      label: "USA — Chicago (ORD)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Open-jaw JAC in / BZN out",
      options: [
        {
          name: "United nonstop (open-jaw)",
          route: "ORD → JAC / BZN → ORD",
          stops: 0,
          cabin: "Main Cabin",
          fare: 540,
          note: "Seasonal United nonstops both ways; book as one multi-city fare",
          current: true,
        },
        {
          name: "United via Denver",
          route: "ORD → DEN → JAC / BZN → DEN → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 460,
          note: "Most schedule flexibility; often cheaper than the nonstop",
        },
        {
          name: "Delta via Salt Lake City",
          route: "ORD → SLC → JAC / BZN → SLC → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 485,
          note: "Strong SLC-hub service to both airports",
        },
        {
          name: "American via Dallas/Fort Worth",
          route: "ORD → DFW → JAC / BZN → DFW → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 565,
          note: "DFW-hub backup; longer connections",
        },
      ],
    },
    },
    hotels: {
    jackson: {
      baseNights: 2,
      label: "Grand Teton",
      header: "Jackson / Grand Teton",
      options: [
        {
          name: "Cowboy Village Resort (Jackson town)",
          rate: 210,
          rating: "8.0",
          note: "Log-cabin motel near Town Square",
          current: true,
        },
        {
          name: "Colter Bay Log Cabins (in-park)",
          rate: 250,
          rating: "8.0",
          note: "Classic cabins near Jackson Lake",
        },
        {
          name: "Signal Mountain Lodge (lakeside)",
          rate: 320,
          rating: "8.2",
          note: "On Jackson Lake, quieter",
        },
        {
          name: "Jackson Lake Lodge (in-park icon)",
          rate: 500,
          rating: "8.4",
          note: "60-ft windows facing the Tetons",
        },
        {
          name: "Jenny Lake Lodge (all-inclusive)",
          rate: 1400,
          rating: "9.1",
          note: "Base of the peaks; meals + activities included",
        },
      ],
    },
    oldFaithful: {
      baseNights: 2,
      label: "Old Faithful",
      header: "Old Faithful",
      options: [
        {
          name: "Old Faithful Lodge Cabin",
          rate: 165,
          rating: "7.8",
          note: "Basic cabin steps from the geyser",
          current: true,
        },
        {
          name: "Old Faithful Inn — Old House",
          rate: 260,
          rating: "8.6",
          note: "Iconic 1904 log lodge, shared bath",
        },
        {
          name: "Old Faithful Inn — private bath",
          rate: 400,
          rating: "8.6",
          note: "Historic Inn, private bath",
        },
        {
          name: "Old Faithful Inn — premium/suite",
          rate: 550,
          rating: "8.6",
          note: "Best rooms, geyser views",
        },
      ],
    },
    canyon: {
      baseNights: 2,
      label: "Canyon / Lake",
      header: "Canyon / Yellowstone Lake",
      options: [
        {
          name: "Canyon Lodge Western Cabin",
          rate: 260,
          rating: "8.0",
          note: "Near the canyon rim",
          current: true,
        },
        {
          name: "Canyon Lodge — standard room",
          rate: 370,
          rating: "8.2",
          note: "Rebuilt modern lodge",
        },
        {
          name: "Lake Yellowstone Hotel — lake view",
          rate: 450,
          rating: "8.0",
          note: "Elegant 1891 hotel on the lake",
        },
        {
          name: "Canyon Lodge — premium",
          rate: 460,
          rating: "8.2",
          note: "Larger updated rooms",
        },
      ],
    },
    mammoth: {
      baseNights: 1,
      label: "Mammoth",
      header: "Mammoth / Lamar Valley",
      options: [
        {
          name: "Mammoth Hotel — shared bath",
          rate: 175,
          rating: "7.8",
          note: "By the terraces + north entrance",
          current: true,
        },
        {
          name: "Mammoth — frontier/hot-tub cabin",
          rate: 250,
          rating: "8.0",
          note: "Some cabins have private hot tubs",
        },
        {
          name: "Mammoth Hotel — private bath",
          rate: 320,
          rating: "8.0",
          note: "Closest in-park base to Gardiner/Bozeman",
        },
      ],
    },
    },
    transport: {
    rental: {
      perDay: 130,
      oneTime: 210,
      label: "Rental SUV + fuel + park pass",
      ownCarLabel: "Fuel + park pass (own car)",
      note: "Mid-size SUV at Jackson Hole (~$130/day) + ~$140 fuel for the loop + $70 park pass. Book early — the JAC fleet is limited in peak season.",
    },
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Jackson Hole (JAC) · pick up rental SUV",
        note: "~15 min into town / Grand Teton",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "j-of",
        from: "jackson",
        to: "oldFaithful",
        routeName: "Jackson → <strong>Old Faithful</strong>",
        note: "Drive ~2h15 · 83 mi (South Entrance & West Thumb)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "of-c",
        from: "oldFaithful",
        to: "canyon",
        routeName: "Old Faithful → <strong>Canyon</strong>",
        note: "Drive ~50 min · 32 mi (stop at Grand Prismatic)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "c-m",
        from: "canyon",
        to: "mammoth",
        routeName: "Canyon → <strong>Mammoth</strong>",
        note: "Drive ~2h · via Lamar Valley (wolves & bison)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Mammoth</strong> → Bozeman (BZN)",
        note: "Drive ~1h30 · 80 mi · fly home",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
    ],
    },
    activities: {
    jackson: [
      {
        day: 2,
        title: "Jenny Lake & the Tetons",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Jenny Lake loop + Hidden Falls; park entry only",
            current: true,
          },
          {
            name: "Jenny Lake shuttle boat",
            cost: 44,
            note: "Round-trip boat, shortens the Cascade Canyon approach",
          },
          {
            name: "Snake River scenic float (guided)",
            cost: 190,
            note: "~3 hr guided raft, no rapids, Tetons backdrop",
          },
        ],
      },
    ],
    oldFaithful: [
      {
        day: 4,
        title: "Geyser basins",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Old Faithful + Upper Geyser Basin + Grand Prismatic",
            current: true,
          },
        ],
      },
    ],
    canyon: [
      {
        day: 6,
        title: "Canyon & wildlife",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Grand Canyon rim + Hayden Valley pullouts",
            current: true,
          },
          {
            name: "Yellowstone Lake scenic cruise",
            cost: 50,
            note: "~1 hr narrated cruise from Bridge Bay",
          },
        ],
      },
    ],
    mammoth: [
      {
        day: 8,
        title: "Lamar Valley wildlife",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Dawn drive through Lamar Valley + Mammoth terraces",
            current: true,
          },
          {
            name: "Guided wildlife safari",
            cost: 550,
            note: "Full-day naturalist tour with spotting scopes",
          },
        ],
      },
    ],
    },
    itinPool: {
    jackson: [
      {
        id: "j-arrive",
        travel: true,
        move: "arrive",
        lodging: "jackson",
        cityTag: "Jackson — arrive",
        sun: "19:47",
        title: "Land, grab the car, ease in",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Jackson Hole (JAC).",
            detail:
              "Pick up the rental SUV; ~15 min into town or the park. We land separately — meet at the lodge.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Dinner in Jackson off the Town Square, or catch first light on the Tetons at dusk. Stock a cooler for the road.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a sunset drive in it.",
      },
      {
        id: "j-tetons",
        cityTag: "Grand Teton",
        sun: "19:45",
        title: "Jenny Lake and the Cathedral Group",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Jenny Lake — Hidden Falls & Inspiration Point.",
            detail:
              "Shuttle boat across, then walk up; the Tetons rise straight out of the water. Go early for parking.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lakeside picnic, then a Jackson dinner.",
            detail: "Grab supplies in town; dinner back on the Square.",
          },
          {
            tag: "Wildlife",
            kind: "soft",
            detail:
              "Dawn or dusk on Mormon Row / Antelope Flats for moose, bison, and the classic barn-and-Tetons shot.",
          },
        ],
        fuller:
          "Add the <b>Snake River scenic float</b> — a calm guided raft with the Tetons as the backdrop, ~3 hours.",
        ask: "one big hike (Cascade Canyon, ~9 mi) or keep it easy with the float?",
      },
      {
        id: "j-cascade",
        cityTag: "Grand Teton",
        sun: "19:43",
        title: "A canyon under the peaks",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Cascade Canyon.",
            detail:
              "The signature Teton hike — boat across Jenny Lake, then up the canyon between the Grand and Mt Owen. Turn around whenever you like.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A well-earned dinner in Jackson.",
            detail: "",
          },
        ],
        fuller:
          "Prefer a slow day? Swap the hike for the <b>Jenny Lake scenic cruise</b> + String Lake and a lazy afternoon.",
      },
    ],
    oldFaithful: [
      {
        id: "of-arrive",
        travel: true,
        move: "j-of",
        lodging: "oldFaithful",
        cityTag: "Jackson → Old Faithful",
        sun: "19:40",
        title: "North into Yellowstone",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Old Faithful + the Upper Geyser Basin.",
            detail:
              "Time an eruption, then walk the boardwalk loop past Morning Glory and the big geysers — half the world's geysers are in this basin.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at the Old Faithful Inn.",
            detail:
              "The great log lobby is worth a wander even if you're not staying.",
          },
        ],
        ask: "leave Jackson early — the South Entrance line and wildlife stops eat the morning.",
      },
      {
        id: "of-prismatic",
        cityTag: "Old Faithful",
        sun: "19:38",
        title: "Grand Prismatic and the color",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Grand Prismatic Spring.",
            detail:
              "Walk the Midway boardwalk at ground level, then the Fairy Falls overlook spur for the aerial view of the largest hot spring in the US.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Casual dinner at the village.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Black Sand and Biscuit basins are quieter, colorful add-ons nearby.",
          },
        ],
        fuller:
          "Active option: <b>Fairy Falls + Twin Buttes</b> (~5.4 mi) or the <b>Mystic Falls loop</b> (~4 mi) for a real walk.",
      },
      {
        id: "of-extra",
        cityTag: "Old Faithful",
        sun: "19:36",
        title: "More geyser country",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Firehole Lake Drive + Lone Star Geyser.",
            detail:
              "An easy geyser side-road, then the flat trail to a backcountry geyser that erupts about every 3 hours.",
          },
        ],
        fuller:
          "Or drive down to <b>West Thumb Geyser Basin</b> on the shore of Yellowstone Lake.",
      },
    ],
    canyon: [
      {
        id: "c-arrive",
        travel: true,
        move: "of-c",
        lodging: "canyon",
        cityTag: "Old Faithful → Canyon",
        sun: "19:34",
        title: "The Grand Canyon of the Yellowstone",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Artist Point & the rim.",
            detail:
              "The Lower Falls plunging into the yellow canyon — walk the South and North Rim overlooks; Uncle Tom's stairs if they're open.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at Canyon Village.",
            detail: "",
          },
        ],
      },
      {
        id: "c-hayden",
        cityTag: "Canyon / Lake",
        sun: "19:32",
        title: "Hayden Valley wildlife & the lake",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Hayden Valley at dawn.",
            detail:
              "Prime bison — and maybe wolves or a grizzly — between Canyon and Lake. Pullouts, binoculars, early light.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lake Yellowstone Hotel dining room.",
            detail: "The lakeside sunroom is the grandest space in the park.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "West Thumb Geyser Basin — geothermal features right on the lakeshore.",
          },
        ],
        fuller:
          "Add a <b>Yellowstone Lake scenic cruise</b> from Bridge Bay (~1 hr).",
      },
      {
        id: "c-extra",
        cityTag: "Canyon / Lake",
        sun: "19:30",
        title: "Canyon country, unhurried",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Mount Washburn, or a slow rim morning.",
            detail:
              "A big-view climb (~6 mi) for the strong, or a relaxed second pass at the canyon overlooks in different light.",
          },
        ],
      },
    ],
    mammoth: [
      {
        id: "m-arrive",
        travel: true,
        move: "c-m",
        lodging: "mammoth",
        cityTag: "Canyon → Mammoth",
        sun: "19:28",
        title: "Lamar Valley and the terraces",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Lamar Valley — the American Serengeti.",
            detail:
              "Drive out at dawn for wolves, bison herds, and pronghorn, then the Mammoth Hot Springs travertine terraces on the way to the hotel.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at Mammoth (or in Gardiner).",
            detail: "Elk are often out on the Fort Yellowstone lawns.",
          },
        ],
        fuller:
          "Serious about wildlife? A <b>guided Lamar safari</b> with a naturalist and spotting scopes dramatically ups the sightings.",
        ask: "dawn wildlife means a 6am start — worth it? (It is.)",
      },
      {
        id: "m-extra",
        cityTag: "Mammoth",
        sun: "19:26",
        title: "A last morning up north",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Bunsen Peak, or the Roosevelt Arch.",
            detail:
              "A brisk climb for a final valley view, or an easy historic wander through Fort Yellowstone and the north-entrance arch.",
          },
        ],
      },
    ],
    },
    itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "19:24",
    cityTag: "Mammoth → home",
    title: "Drive to Bozeman and fly out",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Mammoth → Bozeman (BZN), ~1h30.",
        detail:
          "Return the car at the airport; build in buffer. A last stretch of Montana on the way out.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a slow drive vs. a dash.",
    },
    visaPlan: {
    "j-arrive": "Arrive Jackson Hole (JAC); pick up rental car.",
    "j-tetons": "Grand Teton NP — Jenny Lake, Hidden Falls, Mormon Row.",
    "j-cascade": "Grand Teton — Cascade Canyon hike / Snake River float.",
    "of-arrive": "Drive into Yellowstone; Old Faithful & Upper Geyser Basin.",
    "of-prismatic": "Grand Prismatic Spring & Midway Geyser Basin.",
    "of-extra": "Firehole Lake Drive; Lone Star Geyser / West Thumb.",
    "c-arrive": "Grand Canyon of the Yellowstone — Artist Point & rim.",
    "c-hayden": "Hayden Valley wildlife; Yellowstone Lake.",
    "c-extra": "Mount Washburn / canyon overlooks.",
    "m-arrive": "Lamar Valley wildlife; Mammoth Hot Springs terraces.",
    "m-extra": "Bunsen Peak / Roosevelt Arch.",
    depart: "Drive to Bozeman (BZN); depart.",
    },
};
