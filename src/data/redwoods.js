export default {
  meta: {
    title: "California Redwoods Road Trip — Jun 2027",
    route: ["mendocino", "humboldt", "crescentCity"],
    optionalCities: [],
    flexNightDefault: "humboldt",
    dates: { arrive: "2027-06-13", depart: "2027-06-19", nights: 6 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into San Francisco, loop back out of SFO",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.12, // CA lodging/occupancy tax + resort-style fees
    destLabel: "San Francisco", // gateway shown for an "Other airport" origin
    ui: {
      eyebrow:
        'Jun 13 → Jun 19, 2027 · <span class="traveler-count-lbl">2</span> travelers · self-booked road trip',
      planTitle: "California Redwoods Road Trip",
      planSub:
        "A driving loop up the Mendocino and Humboldt coast into the tallest trees on Earth. Pick a lodge tier per stop; the rental car, fuel, and park/day-use fees fold into the total. Every figure is a researched 2027 planning estimate.",
      flightsTitle: "Getting there — flights to the Bay",
      flightsIntro:
        "Two travelers converging on San Francisco. Pick a routing for each — fares fold into the grand total. Fly into SFO, loop the coast, and fly home out of SFO — no backtrack needed.",
      itinTitle: "The Redwood Coast, by road — six nights north from the Bay",
      itinDek:
        "A relaxed coastal loop: Mendocino's headlands, the ancient groves of Humboldt Redwoods, then Crescent City and Prairie Creek. One anchor a day, elk and tide pools at the edges, and enough road time to actually watch the coastline change.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops · nonstop if the schedule lines up",
      options: [
        {
          name: "United nonstop",
          route: "IND → SFO",
          stops: 0,
          cabin: "Economy",
          fare: 420,
          note: "Direct IND–SFO service; best if the schedule works",
          current: true,
        },
        {
          name: "Southwest via Denver",
          route: "IND → DEN → SFO",
          stops: 1,
          cabin: "Economy",
          fare: 340,
          note: "Often the cheapest option; no assigned seats",
        },
        {
          name: "American via Dallas/Fort Worth",
          route: "IND → DFW → SFO",
          stops: 1,
          cabin: "Main Cabin",
          fare: 390,
          note: "Reliable DFW-hub connection, good schedule spread",
        },
        {
          name: "Delta via Salt Lake City",
          route: "IND → SLC → SFO",
          stops: 1,
          cabin: "Main Cabin",
          fare: 405,
          note: "Backup via the SLC hub",
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
          name: "Philippine Airlines + PAL long-haul",
          route: "DVO → MNL → SFO",
          stops: 1,
          cabin: "Economy",
          fare: 1150,
          note: "PAL domestic to Manila, then PAL's SFO nonstop — simplest routing",
          current: true,
        },
        {
          name: "Korean Air + Delta (SkyTeam)",
          route: "DVO → MNL → ICN → SFO",
          stops: 2,
          cabin: "Economy",
          fare: 1250,
          note: "SkyTeam via Incheon into SFO",
        },
        {
          name: "ANA + United (Star Alliance)",
          route: "DVO → MNL → NRT → SFO",
          stops: 2,
          cabin: "Economy",
          fare: 1300,
          note: "Alliance alternative via Tokyo Narita",
        },
        {
          name: "Cebu Pacific + partners (budget)",
          route: "DVO → MNL → ICN → SFO",
          stops: 2,
          cabin: "Economy",
          fare: 1050,
          note: "Cheapest — budget domestic + connections, longer transit",
        },
      ],
    },
    lax: {
      label: "USA — Los Angeles (LAX)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Short hop up the coast",
      options: [
        {
          name: "Southwest shuttle",
          route: "LAX → SFO",
          stops: 0,
          cabin: "Economy",
          fare: 110,
          note: "Frequent short hop; easy standby if plans shift",
          current: true,
        },
        {
          name: "United shuttle",
          route: "LAX → SFO",
          stops: 0,
          cabin: "Economy",
          fare: 140,
          note: "More departure times across the day",
        },
        {
          name: "Alaska shuttle",
          route: "LAX → SFO",
          stops: 0,
          cabin: "Economy",
          fare: 130,
          note: "Good backup if the others sell out",
        },
      ],
    },
  },
  hotels: {
    mendocino: {
      baseNights: 1,
      label: "Mendocino",
      header: "Mendocino Village",
      options: [
        {
          name: "Andiron Seaside Inn & Cabins (Little River)",
          rate: 180,
          rating: "8.1",
          note: "Retro-cool motor-court cabins just south of the village",
          current: true,
        },
        {
          name: "Alegria Oceanfront Inn & Cottages",
          rate: 230,
          rating: "8.6",
          note: "Bluff-top B&B over Big River Beach; breakfast included",
        },
        {
          name: "MacCallum House Inn",
          rate: 320,
          rating: "8.8",
          note: "Historic Victorian in the village heart; acclaimed restaurant on-site",
        },
        {
          name: "Brewery Gulch Inn",
          rate: 420,
          rating: "9.1",
          note: "Reclaimed-timber luxury inn just outside the village, ocean views",
        },
      ],
    },
    humboldt: {
      baseNights: 2,
      label: "Humboldt Redwoods",
      header: "Garberville / Ferndale / Eureka",
      options: [
        {
          name: "Humboldt Bay Inn (Eureka)",
          rate: 140,
          rating: "7.6",
          note: "Straightforward base near Old Town Eureka",
          current: true,
        },
        {
          name: "The Historic Eagle House Inn (Eureka)",
          rate: 190,
          rating: "8.0",
          note: "Restored 1888 Victorian in Old Town, walkable to the waterfront",
        },
        {
          name: "Benbow Historic Inn (Garberville)",
          rate: 235,
          rating: "8.3",
          note: "1926 Tudor-style resort on the Eel River, closest base to the Avenue",
        },
        {
          name: "The Victorian Inn (Ferndale)",
          rate: 270,
          rating: "8.6",
          note: "Restored 1890 landmark in the Butterfat Palace village",
        },
      ],
    },
    crescentCity: {
      baseNights: 2,
      label: "Crescent City",
      header: "Crescent City / Klamath",
      options: [
        {
          name: "Curly Redwood Lodge",
          rate: 120,
          rating: "7.7",
          note: "Motel famously built from a single 18-foot-diameter redwood",
          current: true,
        },
        {
          name: "Bayview Inn",
          rate: 150,
          rating: "7.9",
          note: "Simple harbor-side motel, short walk to the waterfront trail",
        },
        {
          name: "Best Western Plus Northwoods Inn",
          rate: 190,
          rating: "8.2",
          note: "Reliable mid-range chain, closest to Jedediah Smith",
        },
        {
          name: "Historic Requa Inn (Klamath)",
          rate: 245,
          rating: "8.7",
          note: "1914 inn overlooking the Klamath River mouth, near Trees of Mystery",
        },
      ],
    },
  },
  transport: {
    rental: {
      perDay: 85,
      oneTime: 140,
      label: "Rental SUV + fuel + park fees",
      ownCarLabel: "Fuel + park fees (own car)",
      note: "Mid-size SUV at SFO (~$85/day) + ~$140 fuel for the ~800-mile coastal loop + Prairie Creek/Fern Canyon day-use fees.",
    },
    legs: [
      {
        id: "arrival",
        role: "arrival",
        routeName: "Arrive San Francisco (SFO) · pick up rental SUV",
        note: "Drive ~3h30 · 195 mi north on US-101 to the Mendocino coast",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "m-h",
        from: "mendocino",
        to: "humboldt",
        routeName: "Mendocino → <strong>Humboldt</strong>",
        note: "Drive ~2h30 · 95 mi · straight through the Avenue of the Giants",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "h-cc",
        from: "humboldt",
        to: "crescentCity",
        routeName: "Humboldt → <strong>Crescent City</strong>",
        note: "Drive ~1h45 · 75 mi via Prairie Creek Redwoods (elk pullouts)",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
      {
        id: "departure",
        role: "departure",
        routeName: "<strong>Crescent City</strong> → San Francisco (SFO)",
        note: "Drive ~6h30 · 350 mi south on US-101 — break it up with a stop in Richardson Grove or the Avenue of the Giants",
        toggles: [],
        routeDetail: false,
        flat: { cost: 0, scale: "vehicle" },
      },
    ],
  },
  activities: {
    mendocino: [
      {
        day: 1,
        title: "Glass Beach & the Headlands",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Mendocino Headlands bluff trail + Glass Beach at sunset",
            current: true,
          },
          {
            name: "Skunk Train — Pudding Creek Express",
            cost: 100,
            note: "75-min, 7-mile round trip through the redwoods from Fort Bragg",
          },
        ],
      },
    ],
    humboldt: [
      {
        day: 3,
        title: "Avenue of the Giants & Founders Grove",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "31-mile Avenue drive + Founders Grove walk; park entry only",
            current: true,
          },
          {
            name: "Eel River kayak/canoe rental",
            cost: 90,
            note: "A couple of hours paddling below the redwoods near Garberville",
          },
        ],
      },
    ],
    crescentCity: [
      {
        day: 6,
        title: "Fern Canyon & the coast",
        options: [
          {
            name: "Self-guided (free)",
            cost: 0,
            note: "Stout Grove + Battery Point Lighthouse at low tide",
            current: true,
          },
          {
            name: "Fern Canyon / Gold Bluffs Beach day-use",
            cost: 24,
            note: "$12/person cash at the Gold Bluffs kiosk (Prairie Creek Redwoods)",
          },
          {
            name: "Trees of Mystery + SkyTrail gondola",
            cost: 60,
            note: "General admission, both adults; includes the Redwood Canopy Trail",
          },
        ],
      },
    ],
  },
  itinPool: {
    mendocino: [
      {
        id: "m-arrive",
        travel: true,
        move: "arrival",
        lodging: "mendocino",
        cityTag: "San Francisco → Mendocino",
        sun: "20:39",
        title: "Down the coast to Mendocino",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into San Francisco (SFO).",
            detail:
              "Pick up the rental SUV; ~3h30 north on US-101 to the Mendocino coast. We land separately — meet at the inn.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Catch last light at Glass Beach or the Headlands bluff trail before dinner in the village.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight has a sunset walk in it.",
      },
      {
        id: "m-glassbeach",
        cityTag: "Mendocino",
        sun: "20:40",
        title: "Headlands and Glass Beach",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Mendocino Headlands State Park.",
            detail:
              "Flat bluff-top trails around the whole village, blowholes and sea arches below — the coast that stood in for Cabot Cove.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in the village.",
            detail:
              "Main Street is walkable end to end; book ahead in peak season.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Glass Beach in Fort Bragg — decades of sea-tumbled glass instead of sand.",
          },
        ],
        fuller:
          "Add the <b>Skunk Train's Pudding Creek Express</b> — a 75-minute redwood-canyon ride from Fort Bragg.",
        ask: "keep today easy in the village, or drive up to Fort Bragg for the train?",
      },
    ],
    humboldt: [
      {
        id: "h-arrive",
        travel: true,
        move: "m-h",
        lodging: "humboldt",
        cityTag: "Mendocino → Humboldt",
        sun: "20:41",
        title: "Into the tall trees — Avenue of the Giants",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Avenue of the Giants.",
            detail:
              "A 31-mile old two-lane road under the redwood canopy, parallel to US-101 — pull off wherever a grove looks good.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Garberville.",
            detail:
              "The Eel River valley towns are small; plan an early seating.",
          },
        ],
        ask: "leave Mendocino by mid-morning — the Avenue rewards unhurried stops.",
      },
      {
        id: "h-founders",
        cityTag: "Humboldt Redwoods",
        sun: "20:42",
        title: "Founders Grove and the Eel River",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Founders Grove Nature Trail.",
            detail:
              "An easy half-mile loop past the Dyerville Giant's fallen trunk and some of the tallest trees on Earth.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Riverside dinner near Benbow.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "A cool-off swim at the Eel River's summer sandbar, right below the inn.",
          },
        ],
        fuller:
          "Prefer a whole different scene? Swap in a day trip to <b>Ferndale's Victorian village</b> instead.",
      },
      {
        id: "h-ferndale",
        cityTag: "Humboldt",
        sun: "20:43",
        title: "Ferndale's Victorian village & the Lost Coast",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Ferndale historic village.",
            detail:
              "Butterfat Palaces lining Main Street — a whole town on the National Register, plus the creamery-era dairy history.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner back toward Eureka's Old Town.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Bear River Ridge Road up onto the Lost Coast Scenic Byway for a big, empty coastal view.",
          },
        ],
        ask: "worth the extra night here? this is the flex day — it can move to Mendocino or Crescent City instead.",
      },
    ],
    crescentCity: [
      {
        id: "cc-arrive",
        travel: true,
        move: "h-cc",
        lodging: "crescentCity",
        cityTag: "Humboldt → Crescent City",
        sun: "20:44",
        title: "Prairie Creek elk and the coast road",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Newton B. Drury Scenic Parkway.",
            detail:
              "A slow, ten-mile alternate to US-101 through Prairie Creek Redwoods — Roosevelt elk graze right along Elk Meadow most evenings.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Crescent City.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Battery Point Lighthouse, tide-accessible on foot at low water.",
          },
        ],
      },
      {
        id: "cc-ferncanyon",
        cityTag: "Crescent City",
        sun: "20:45",
        title: "Fern Canyon and Gold Bluffs Beach",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Fern Canyon.",
            detail:
              "70-foot fern-draped walls along a shallow creek — the Jurassic Park canyon, reached by a bumpy gravel road down to Gold Bluffs Beach.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner near the Klamath river mouth.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "A driftwood walk on Gold Bluffs Beach before the tide comes in.",
          },
        ],
        fuller:
          "Add <b>Trees of Mystery</b> on the way — the SkyTrail gondola rides up into the redwood canopy.",
      },
      {
        id: "cc-stout",
        cityTag: "Crescent City",
        sun: "20:46",
        title: "Stout Grove and Battery Point",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Stout Grove, Jedediah Smith Redwoods.",
            detail:
              "A flat, easy loop through some of the most photographed old-growth redwoods anywhere, along the Smith River.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A last dinner in Crescent City.",
            detail: "",
          },
        ],
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "departure",
    sun: "20:47",
    cityTag: "Crescent City → home",
    title: "The long drive south to SFO",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Crescent City → San Francisco (SFO), ~6h30.",
        detail:
          "Return the car at the airport; build in buffer. Break the drive up with a stop in Richardson Grove or a last pass through the Avenue of the Giants.",
      },
    ],
    ask: "when do the flights home leave? It sets whether there's time for one more grove on the way south.",
  },
  visaPlan: {
    "m-arrive":
      "Arrive San Francisco (SFO); pick up rental car; drive to Mendocino.",
    "m-glassbeach": "Mendocino Headlands & Glass Beach; optional Skunk Train.",
    "h-arrive": "Drive to Humboldt via the Avenue of the Giants.",
    "h-founders": "Founders Grove & Rockefeller Forest; Eel River.",
    "h-ferndale":
      "Ferndale Victorian village; Lost Coast Scenic Byway (flex day).",
    "cc-arrive":
      "Drive to Crescent City via Prairie Creek Redwoods; elk viewing.",
    "cc-ferncanyon":
      "Fern Canyon & Gold Bluffs Beach; optional Trees of Mystery.",
    "cc-stout": "Stout Grove; Battery Point Lighthouse.",
    depart: "Drive to San Francisco (SFO); depart.",
  },
};
