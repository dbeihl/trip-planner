export default {
  meta: {
    title: "Philippines — Coron, Siargao & Malita — Jan 2027",
    route: ["coron", "siargao", "malita"],
    optionalCities: [],
    flexNightDefault: "coron",
    dates: { arrive: "2027-01-08", depart: "2027-01-24", nights: 16 },
    travelers: {
      count: 2,
      note: "2 travelers; David flies in from the US, Suzanne joins from Davao — fly into Manila for Coron, home out of Davao (DVO) after a week in Malita",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.12, // Philippine VAT + local lodging tax, roughly
    destLabel: "Coron",
    ui: {
      eyebrow:
        'Jan 8 → Jan 24, 2027 · <span class="traveler-count-lbl">2</span> travelers · island-hopping + family week',
      planTitle: "Coron, Siargao &amp; a Week in Malita",
      planSub:
        "Two of the Philippines' best islands, then home to family: limestone lagoons and WWII wrecks in Coron, then a hop to Siargao for the surf and the lagoons, and finally a slow week in Malita at Suzanne's family's place near Davao. Fly in through Manila for Coron and out of Davao at the end — no backtracking. Pick a lodging tier per island; the Malita week can stay with family for free. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — into Coron via Manila, home from Davao",
      flightsIntro:
        "David comes in from the US and Suzanne joins from Davao, both converging on Coron (Busuanga, USU) through Manila. Pick a routing for each — fares fold into the grand total. The trip ends in Malita, so fly home open-jaw out of Davao (DVO); Suzanne is already home for that leg.",
      itinTitle: "Coron, Siargao &amp; Malita — sixteen nights",
      itinDek:
        "Dry-season island time working south and east: island-hopping the Coron lagoons and shipwreck reefs, a jump to Siargao for Cloud 9 and the lagoon runs, then a full week in Malita — Davao day trips, Samal beaches, and unhurried family time. One anchor a day on the islands, and real slack once you reach Malita.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops · open-jaw into Coron, home from Davao",
      options: [
        {
          name: "Philippine Airlines via San Francisco & Manila",
          route: "IND → SFO → MNL → USU · DVO → MNL → SFO → IND",
          stops: 2,
          cabin: "Economy",
          fare: 1580,
          note: "PAL's SFO–MNL nonstop, then the Manila–Coron hop; home open-jaw from Davao via Manila",
          current: true,
        },
        {
          name: "United / Philippine Airlines via San Francisco",
          route: "IND → SFO → MNL → USU · DVO → MNL → SFO → IND",
          stops: 2,
          cabin: "Economy",
          fare: 1650,
          note: "United to the coast, PAL across the Pacific and on the domestic legs",
        },
        {
          name: "Korean Air / Cebu Pacific via Seoul & Manila",
          route: "IND → ICN → MNL → USU · DVO → MNL → ICN → IND",
          stops: 2,
          cabin: "Economy",
          fare: 1540,
          note: "Widebody through Incheon, budget Cebu Pacific on the island legs",
        },
        {
          name: "Philippine Airlines via San Francisco (Business)",
          route: "IND → SFO → MNL → USU · DVO → MNL → SFO → IND",
          stops: 2,
          cabin: "Business",
          fare: 3900,
          note: "Lie-flat on the long SFO–MNL sector; same open-jaw routing",
        },
      ],
    },
    ph: {
      label: "From the Philippines — Suzanne (DVO)",
      traveler: "Suzanne",
      pax: 1,
      preference: "Cheapest domestic hop to join in Coron",
      options: [
        {
          name: "Cebu Pacific via Cebu",
          route: "DVO → CEB → USU · (home to Davao at the end)",
          stops: 1,
          cabin: "Economy",
          fare: 130,
          note: "Domestic hop up to Coron to meet David; she's already home for the Malita week",
          current: true,
        },
        {
          name: "Philippine Airlines via Manila",
          route: "DVO → MNL → USU · (home to Davao at the end)",
          stops: 1,
          cabin: "Economy",
          fare: 175,
          note: "PAL through Manila; a little pricier but more schedule slack",
        },
        {
          name: "AirSWIFT via Manila",
          route: "DVO → MNL → USU · (home to Davao at the end)",
          stops: 1,
          cabin: "Economy",
          fare: 190,
          note: "AirSWIFT runs the Manila–Busuanga leg on turboprops; connect off PAL/Cebu Pacific",
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
          name: "Philippine Airlines nonstop via Manila",
          route: "LAX → MNL → USU · DVO → MNL → LAX",
          stops: 1,
          cabin: "Economy",
          fare: 1150,
          note: "PAL's LAX–MNL nonstop out; Manila connections onto the islands",
          current: true,
        },
        {
          name: "Cathay Pacific via Hong Kong",
          route: "LAX → HKG → MNL → USU · DVO → MNL → HKG → LAX",
          stops: 2,
          cabin: "Economy",
          fare: 1210,
          note: "Hong Kong hub, then down into Manila and the islands",
        },
      ],
    },
  },
  hotels: {
    coron: {
      baseNights: 4,
      label: "Coron",
      header: "Coron Town — Busuanga, Palawan",
      options: [
        {
          name: "Coron Guesthouse (town)",
          rate: 45,
          rating: "8.0",
          note: "Simple fan/AC room walkable to the pier and the island-hopping boats",
        },
        {
          name: "Coron Soleil Garden Resort",
          rate: 110,
          rating: "8.4",
          note: "Reliable mid-range with a pool, breakfast, and airport pickup",
          current: true,
        },
        {
          name: "Coron Westown Resort",
          rate: 165,
          rating: "8.6",
          note: "Hillside pool and view over the bay, short ride to town",
        },
        {
          name: "Two Seasons Coron Island Resort",
          rate: 380,
          rating: "9.1",
          note: "Private-island eco-resort with a house reef, a boat transfer from town",
        },
      ],
    },
    siargao: {
      baseNights: 4,
      label: "Siargao",
      header: "Siargao — General Luna / Cloud 9",
      options: [
        {
          name: "General Luna surf hostel",
          rate: 40,
          rating: "8.1",
          note: "Backpacker-chic near the boardwalk, bikes and boards to rent",
        },
        {
          name: "Bravo Beach Resort",
          rate: 95,
          rating: "8.5",
          note: "Beachfront mid-range on the General Luna strip with a good pool bar",
          current: true,
        },
        {
          name: "Harana Surf Resort",
          rate: 170,
          rating: "8.8",
          note: "Design-forward surf lodge steps from the Cloud 9 break",
        },
        {
          name: "Kalinaw Resort",
          rate: 320,
          rating: "9.2",
          note: "Handful of French-run villas, the island's quiet luxury pick",
        },
      ],
    },
    malita: {
      baseNights: 7,
      label: "Malita",
      header: "Malita — Davao Occidental (Suzanne's family)",
      options: [
        {
          name: "Staying with Suzanne's family",
          rate: 0,
          rating: "—",
          note: "The week in Malita at her family's place — no lodging cost; bring gifts, not a booking",
          current: true,
        },
        {
          name: "Malita town inn",
          rate: 40,
          rating: "7.8",
          note: "A simple local inn if you want a night or two of your own space",
        },
        {
          name: "Seafront resort near Malita",
          rate: 90,
          rating: "8.2",
          note: "A modest beach resort down the coast for a night away with the family",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Busuanga (USU) · van into Coron town",
        note: "~30–45 min shared van from the airstrip down to Coron town and the pier",
        toggles: [],
        routeDetail: false,
        flat: { cost: 30, scale: "person" },
      },
      {
        id: "c-s",
        from: "coron",
        to: "siargao",
        routeName: "Coron → <strong>Siargao</strong>",
        note: "No direct hop — fly Busuanga → Cebu → Sayak (IAO), then a van to General Luna",
        toggles: [],
        routeDetail: false,
        flat: { cost: 320, scale: "person" },
      },
      {
        id: "s-m",
        from: "siargao",
        to: "malita",
        routeName: "Siargao → <strong>Malita</strong>",
        note: "Sayak (IAO) → Davao (DVO) via Cebu, then the ~2.5–3 hr drive south to Malita",
        toggles: [],
        routeDetail: false,
        flat: { cost: 260, scale: "person" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Malita</strong> → Davao (DVO) · fly home",
        note: "The ~2.5–3 hr drive back up to Davao airport for the flight home; Suzanne stays",
        toggles: [],
        routeDetail: false,
        flat: { cost: 70, scale: "person" },
      },
    ],
  },
  activities: {
    coron: [
      {
        day: 2,
        title: "Coron island-hopping — lagoons & lakes",
        options: [
          {
            name: "Joiner island-hopping tour",
            cost: 70,
            note: "Kayangan Lake, Twin Lagoon, and a couple of reefs on a shared bangka, lunch aboard",
            current: true,
          },
          {
            name: "Private boat charter",
            cost: 220,
            note: "Your own bangka and route — beat the crowds to Kayangan at opening",
          },
        ],
      },
      {
        day: 3,
        title: "Wrecks & reefs — snorkel or dive",
        options: [
          {
            name: "Snorkel the shallow wrecks & Siete Pecados",
            cost: 60,
            note: "The WWII wrecks that sit near the surface, plus the Siete Pecados marine park",
            current: true,
          },
          {
            name: "Two-tank guided wreck dive",
            cost: 190,
            note: "Descend on the Japanese fleet Coron is famous for — certification required",
          },
        ],
      },
      {
        day: 4,
        title: "Barracuda Lake & hot springs",
        options: [
          {
            name: "Barracuda Lake + Maquinit Hot Springs",
            cost: 45,
            note: "The eerie thermocline swim in Barracuda Lake, then the saltwater hot springs at dusk",
            current: true,
          },
          {
            name: "Add a Malcapuya Beach day",
            cost: 95,
            note: "Trade one lake for the powder sand of Malcapuya and Banana Island further out",
          },
        ],
      },
      {
        day: 5,
        title: "Mount Tapyas, town & a flex day",
        options: [
          {
            name: "Self-guided (viewpoint + town)",
            cost: 10,
            note: "The 700-step climb up Mount Tapyas for sunset over the bay, then dinner in town",
            current: true,
          },
          {
            name: "Reef & sandbar half-day",
            cost: 65,
            note: "An easy last boat out to Bulog sandbar and a house reef if you want more water",
          },
        ],
      },
    ],
    siargao: [
      {
        day: 7,
        title: "Cloud 9 & a surf lesson",
        options: [
          {
            name: "Beginner surf lesson at a beach break",
            cost: 45,
            note: "Board, instructor, and a softer break than Cloud 9 to actually stand up on",
            current: true,
          },
          {
            name: "Cloud 9 session + board rental",
            cost: 30,
            note: "Paddle out at the famous reef break if you already surf; watch from the boardwalk if not",
          },
        ],
      },
      {
        day: 8,
        title: "Three-island hop — Naked, Daku & Guyam",
        options: [
          {
            name: "Joiner island-hopping tour",
            cost: 55,
            note: "The classic trio of sandbar and palm islets, grilled-seafood lunch on Daku",
            current: true,
          },
          {
            name: "Private boat for the three islands",
            cost: 130,
            note: "Your own bangka and timing across Naked, Daku, and Guyam",
          },
        ],
      },
      {
        day: 9,
        title: "Sugba Lagoon or the rock pools",
        options: [
          {
            name: "Sugba Lagoon day trip",
            cost: 60,
            note: "Van and boat out to the turquoise lagoon — paddleboard, the diving board, the jetty",
            current: true,
          },
          {
            name: "Magpupungko rock pools & coast loop",
            cost: 50,
            note: "The tidal rock pools up the east coast; time it for low tide, motorbike or van",
          },
        ],
      },
    ],
    malita: [
      {
        day: 11,
        title: "Davao city — Eden & the Philippine Eagle Center",
        options: [
          {
            name: "Self-guided Davao day (with family)",
            cost: 40,
            note: "The Philippine Eagle Center and a durian stop at the public market — easy day up from Malita",
            current: true,
          },
          {
            name: "Eden Nature Park guided day",
            cost: 110,
            note: "The mountain garden park above Davao with the sky-cycle and a set lunch",
          },
        ],
      },
      {
        day: 13,
        title: "Samal Island beaches",
        options: [
          {
            name: "Samal day — beach & resort pass",
            cost: 60,
            note: "Ferry over to Samal for the white-sand resorts and the giant clam sanctuary",
            current: true,
          },
          {
            name: "Hagimit Falls + Monfort bat cave add-on",
            cost: 90,
            note: "Add the freshwater falls and the record-holding bat colony to the Samal day",
          },
        ],
      },
      {
        day: 15,
        title: "Mount Apo foothills & local Malita",
        options: [
          {
            name: "Family day in Malita",
            cost: 0,
            note: "No agenda — the town market, the coast, and time with Suzanne's family",
            current: true,
          },
          {
            name: "Apo foothills day trip",
            cost: 85,
            note: "Up toward the country's highest peak for the highland farms and cool air, a guide and van",
          },
        ],
      },
    ],
  },
  itinPool: {
    coron: [
      {
        id: "c-arrive",
        travel: true,
        move: "arrive",
        lodging: "coron",
        cityTag: "Coron — arrive",
        sun: "17:42",
        title: "Land in Busuanga, first evening in Coron town",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Busuanga (USU); van down to Coron town.",
            detail:
              "A short shared-van ride from the airstrip into town. David comes off the long haul via Manila, Suzanne up from Davao — meet at the hotel, not the airport.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First dinner by the water.",
            detail:
              "Ease in with grilled fish and calamansi juice on the waterfront; watch the bangkas come in. Nothing beyond staying awake past sunset.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Book tomorrow's island-hopping boat tonight and grab cash — Coron runs on it, and ATMs run dry.",
          },
        ],
        ask: "what time does David's Manila connection land? It decides whether tonight is a real dinner or a late arrival.",
      },
      {
        id: "c-islandhop",
        cityTag: "Coron — the lagoons",
        sun: "17:43",
        title: "Kayangan Lake and the famous lagoons",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Island-hop the Coron lagoons.",
            detail:
              "Kayangan Lake — the postcard viewpoint over the limestone — then Twin Lagoon between the cliffs, with reef stops and a lunch cooked on the boat.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Grilled lunch aboard, dinner in town.",
            detail:
              "The boat crew grills the catch and pork skewers at anchor; back in town for sisig and cold beer.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Go early — the first boat to Kayangan has the light and the stairs to yourself.",
          },
        ],
        fuller:
          "Charter a <b>private bangka</b> to set your own route and beat the joiner boats to Kayangan at opening.",
        ask: "joiner boat, or a private charter to outrun the crowds?",
      },
      {
        id: "c-wrecks",
        cityTag: "Coron — under the surface",
        sun: "17:44",
        title: "Shipwrecks, reefs, and a marine park",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Snorkel or dive the WWII wrecks.",
            detail:
              "Coron's sunken Japanese fleet sits shallow enough to snorkel in places; Siete Pecados nearby is a bright, easy marine park.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lunch on a sandbar, seafood dinner.",
            detail:
              "Beach-picnic lunch between reefs; back to town for a proper seafood spread in the evening.",
          },
        ],
        fuller:
          "Certified? Book a <b>two-tank wreck dive</b> to drop right down onto the fleet Coron is known for.",
        ask: "snorkel the shallow wrecks, or a guided two-tank dive?",
      },
      {
        id: "c-lakes",
        cityTag: "Coron",
        sun: "17:45",
        title: "Barracuda Lake and the hot springs",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Barracuda Lake & Maquinit Hot Springs.",
            detail:
              "The strange, still swim in Barracuda Lake where warm and cold water layer, then the saltwater Maquinit hot springs as the light goes.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Slow lunch, easy dinner.",
            detail:
              "A relaxed day — long lunch by the water and something simple in town after the springs.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Swap in Malcapuya Beach if you'd rather trade the lakes for powder sand further out.",
          },
        ],
      },
      {
        id: "c-flex",
        cityTag: "Coron",
        sun: "17:46",
        title: "Mount Tapyas, town, and a flex day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Mount Tapyas at sunset.",
            detail:
              "The 700-odd steps up to the giant cross for the whole bay laid out gold at dusk — the town's easy sunset ritual.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Last Coron dinner.",
            detail:
              "One more waterfront seafood dinner, or the night market's grilled skewers and halo-halo.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "This is the flex day — a lazy sandbar boat, a reef swim, or just the pool before the early flight.",
          },
        ],
        fuller:
          "Push the flex to a last <b>reef & sandbar half-day</b> out to Bulog if you're not done with the water.",
        ask: "keep the flex night in Coron, or shift it to an extra day on Siargao?",
      },
    ],
    siargao: [
      {
        id: "s-arrive",
        travel: true,
        move: "c-s",
        lodging: "siargao",
        cityTag: "Coron → Siargao",
        sun: "17:38",
        title: "Cross the country to the surf island",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly Busuanga → Cebu → Sayak (IAO).",
            detail:
              "There's no direct hop; connect through Cebu, then a van from Sayak down to General Luna. A travel day — land, drop the bags, breathe.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Cloud 9 boardwalk at dusk.",
            detail:
              "Walk out the famous boardwalk over the reef as the surfers come in; the whole island runs on this rhythm.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First General Luna dinner.",
            detail:
              "The strip is all wood-fired pizza, poke bowls, and grilled seafood — pick a table and settle in.",
          },
        ],
        ask: "which connection through Cebu — an early one buys a real first afternoon on Siargao.",
      },
      {
        id: "s-cloud9",
        cityTag: "Siargao — the surf",
        sun: "17:39",
        title: "Learn to surf (or watch Cloud 9)",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "A surf lesson at a beginner break.",
            detail:
              "Board, instructor, and a gentler break than Cloud 9 to actually get up on; the reef break is for watching unless you already surf.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Smoothie bowls out, seafood in.",
            detail:
              "The island's café culture is real — açaí and coffee by day, grilled tuna belly by night.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Rent a motorbike or a bike; it's how the island moves and how you'll find the quiet beaches.",
          },
        ],
        fuller:
          "Already surf? Skip the lesson and just <b>rent a board</b> for a Cloud 9 session on the right tide.",
      },
      {
        id: "s-islandhop",
        cityTag: "Siargao — three islands",
        sun: "17:40",
        title: "Naked, Daku, and Guyam by boat",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The three-island hop.",
            detail:
              "The classic trio — the bare sandbar of Naked Island, palm-shaded Daku for lunch, and tiny Guyam to round it out.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Grilled-seafood lunch on Daku.",
            detail:
              "Fish, squid, and rice cooked on the beach; buy from the vendors or bring it with you.",
          },
        ],
        fuller:
          "Take a <b>private boat</b> for the three islands to set your own pace and skip the crowded midday sandbar.",
      },
      {
        id: "s-lagoon",
        cityTag: "Siargao",
        sun: "17:41",
        title: "Sugba Lagoon or the rock pools",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Sugba Lagoon.",
            detail:
              "Van and boat out to the electric-turquoise lagoon — the jetty, the diving board, a paddleboard across the still water.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Last Siargao dinner on the strip.",
            detail:
              "One more night on the General Luna strip before the long travel day south to Malita.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Prefer the coast? Trade the lagoon for the Magpupungko rock pools at low tide up the east side.",
          },
        ],
        ask: "Sugba Lagoon, or the Magpupungko rock pools — the tide picks one over the other.",
      },
    ],
    malita: [
      {
        id: "m-arrive",
        travel: true,
        move: "s-m",
        lodging: "malita",
        cityTag: "Siargao → Malita",
        sun: "17:36",
        title: "The long way home to Malita",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly Sayak → Davao (via Cebu), then drive south.",
            detail:
              "The island connection into Davao (DVO), then the ~2.5–3 hr drive down the coast to Malita. A travel day that ends at Suzanne's family's door.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "First dinner with the family.",
            detail:
              "Home cooking, not a restaurant — arrive hungry, bring pasalubong (gifts) from the islands.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "The week ahead is theirs to shape — this is family time, not an itinerary. The days below are options, not obligations.",
          },
        ],
        ask: "which Davao arrival works for the drive south — an afternoon landing still gets you to Malita for dinner.",
      },
      {
        id: "m-family",
        cityTag: "Malita — settle in",
        sun: "17:37",
        title: "A slow first day in Malita",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "No plans — meet everyone, see the town.",
            detail:
              "The market, the coast road, whoever's dropping by. The point of the week is being here, not seeing things.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Family table.",
            detail:
              "Long, unhurried meals at home — the real reason the trip ends here.",
          },
        ],
      },
      {
        id: "m-davao",
        cityTag: "Malita — day up to Davao",
        sun: "17:38",
        title: "Davao city — eagles and durian",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Up to Davao for the day.",
            detail:
              "The Philippine Eagle Center for the national bird, then the public market for durian and marang — an easy day trip up the coast with the family.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Davao food — grilled tuna and durian.",
            detail:
              "Davao does seafood and fruit better than almost anywhere; lean in, durian and all.",
          },
        ],
        fuller:
          "Make it the <b>Eden Nature Park</b> day instead — the mountain garden above the city with the sky-cycle and a set lunch.",
        ask: "an easy self-guided Davao day, or the Eden Nature Park trip up the mountain?",
      },
      {
        id: "m-samal",
        cityTag: "Malita — Samal Island",
        sun: "17:39",
        title: "Beaches on Samal Island",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Ferry over to Samal.",
            detail:
              "The white-sand island off Davao — resort beaches, the giant clam sanctuary, and warm, calm water for a swim.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Beach lunch.",
            detail:
              "Grilled seafood at a resort day-pass or a beachside grill; nothing you have to rush.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Add Hagimit Falls or the Monfort bat cave if the group wants more than a beach day.",
          },
        ],
      },
      {
        id: "m-rest",
        cityTag: "Malita",
        sun: "17:40",
        title: "A day off in Malita",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Nothing scheduled.",
            detail:
              "A hammock, the coast, a book. The middle of a family week is for doing very little.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Home again.",
            detail:
              "Whatever's cooking. Maybe a lechon or a birthday-sized spread if there's an occasion.",
          },
        ],
      },
      {
        id: "m-apo",
        cityTag: "Malita — highlands",
        sun: "17:41",
        title: "Mount Apo foothills, or stay local",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Up toward Mount Apo.",
            detail:
              "A day trip into the foothills of the country's highest peak — cool air, highland farms, and viewpoints, without the multi-day climb.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Highland lunch, dinner at home.",
            detail:
              "Eat up in the hills at midday; back down to Malita for the family table at night.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Not up for the drive? Keep it a local Malita day — the market, the shore, and family.",
          },
        ],
        ask: "the Apo foothills day trip, or another slow day in Malita?",
      },
      {
        id: "m-market",
        cityTag: "Malita — last full day",
        sun: "17:42",
        title: "Last full day with the family",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The town market and the coast.",
            detail:
              "One more turn through Malita — the market for pasalubong to take home, the shore for a last swim, goodbyes to string out over the day.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A send-off dinner.",
            detail:
              "A bigger family meal to close the trip — the whole point of ending here rather than on a beach.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Pack tonight; the drive up to Davao airport tomorrow eats the morning.",
          },
        ],
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "17:43",
    cityTag: "Malita → home",
    title: "Drive up to Davao and the long way home",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Malita → Davao (DVO), ~2.5–3 hr.",
        detail:
          "The drive back up the coast to Davao airport for the flight home via Manila; build in buffer for traffic. Suzanne's already home — this leg is David's.",
      },
    ],
    ask: "when does the flight out of Davao leave? It sets how early the drive from Malita has to start.",
  },
  visaPlan: {
    "c-arrive": "Arrive Busuanga (USU); van into Coron town. US passport: 30-day visa-free entry.",
    "c-islandhop": "Coron island-hopping — Kayangan Lake & Twin Lagoon.",
    "c-wrecks": "WWII wreck snorkel/dive & Siete Pecados marine park.",
    "c-lakes": "Barracuda Lake & Maquinit Hot Springs.",
    "c-flex": "Mount Tapyas sunset & Coron town — flex day.",
    "s-arrive": "Fly Busuanga → Cebu → Siargao (IAO); General Luna.",
    "s-cloud9": "Cloud 9 boardwalk & a beginner surf lesson.",
    "s-islandhop": "Three-island hop — Naked, Daku & Guyam.",
    "s-lagoon": "Sugba Lagoon or the Magpupungko rock pools.",
    "m-arrive": "Fly Siargao → Davao (DVO); drive south to Malita.",
    "m-family": "Settle in — Malita town & family.",
    "m-davao": "Davao day — Philippine Eagle Center & the market.",
    "m-samal": "Samal Island beaches & the clam sanctuary.",
    "m-rest": "A day off in Malita.",
    "m-apo": "Mount Apo foothills day trip, or a local Malita day.",
    "m-market": "Last full day — Malita market, coast & a send-off dinner.",
    depart: "Drive Malita → Davao (DVO); depart. Visa-free stay well within 30 days.",
  },
};
