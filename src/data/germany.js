export default {
  meta: {
    title: "Christmas Markets in Germany by Rail — Dec 2026",
    route: ["nuremberg", "rothenburg", "munich"],
    optionalCities: [],
    flexNightDefault: "munich",
    dates: { arrive: "2026-12-05", depart: "2026-12-12", nights: 7 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into Frankfurt (FRA), out of Munich (MUC) — open jaw, no rental car",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.1, // German city/lodging tax + tourist tax buffer
    destLabel: "Frankfurt",
    ui: {
      eyebrow:
        'Dec 5 → Dec 12, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked rail trip',
      planTitle: "Nuremberg, Rothenburg &amp; Munich by Rail",
      planSub:
        "Three Christmas markets by Deutsche Bahn — Nuremberg's Christkindlesmarkt, the walled town of Rothenburg ob der Tauber, and Munich's Marienplatz, open-jaw into Frankfurt and home from Munich, no rental car needed. Pick a hotel tier per stop; train fares and transfers fold into the grand total. December is peak Christmas-market season — every figure is a researched 2026 planning estimate and runs high accordingly.",
      flightsTitle: "Getting there — flights to Frankfurt, home from Munich",
      flightsIntro:
        "Two travelers converging on Frankfurt for the market season. Pick a routing for each — fares fold into the grand total. Fly into Frankfurt (FRA), out of Munich (MUC) so the whole trip moves in one direction, city to city, by train.",
      itinTitle:
        "Franconia &amp; Bavaria — seven nights of Christmas markets by rail",
      itinDek:
        "A cold-weather sweep through Christmas Germany: Nuremberg's legendary Christkindlesmarkt, a night inside Rothenburg's medieval walls, and three nights in Munich for Marienplatz and a Neuschwanstein day trip. Glühwein at every stop, one anchor sight a day, and enough daylight — short as it is in December — to see the country between markets.",
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
          name: "Delta via Atlanta",
          route: "IND → ATL → FRA · MUC → ATL → IND",
          stops: 1,
          cabin: "Main Cabin",
          fare: 980,
          note: "December Christmas-market fares run high; ATL hub covers both legs of the open jaw",
          current: true,
        },
        {
          name: "United via Chicago",
          route: "IND → ORD → FRA · MUC → ORD → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1050,
          note: "Often the cheapest 1-stop into Frankfurt during market season",
        },
        {
          name: "Delta via Detroit",
          route: "IND → DTW → FRA · MUC → DTW → IND",
          stops: 1,
          cabin: "Main Cabin",
          fare: 1120,
          note: "Backup via the DTW hub, similar schedule to the ATL routing",
        },
        {
          name: "Lufthansa via Chicago",
          route: "IND → ORD → FRA · MUC → ORD → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1250,
          note: "Lufthansa metal ORD–FRA; seasonal premium for Christmas week",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (DVO)",
      traveler: "Partner",
      pax: 1,
      preference: "Fewest stops · Gulf or EU hub",
      options: [
        {
          name: "Qatar Airways via Manila & Doha",
          route: "DVO → MNL → DOH → FRA · MUC → DOH → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1350,
          note: "PAL domestic to Manila, then Qatar's DOH hub both ways",
          current: true,
        },
        {
          name: "Emirates via Manila & Dubai",
          route: "DVO → MNL → DXB → FRA · MUC → DXB → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1420,
          note: "Reliable DXB hub, wide seat selection",
        },
        {
          name: "Turkish Airlines via Manila & Istanbul",
          route: "DVO → MNL → IST → FRA · MUC → IST → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1280,
          note: "Usually the cheapest Gulf/EU-hub option",
        },
        {
          name: "Cathay Pacific + Lufthansa via Manila & Hong Kong",
          route: "DVO → MNL → HKG → FRA · MUC → HKG → MNL → DVO",
          stops: 3,
          cabin: "Economy",
          fare: 1580,
          note: "Star Alliance-adjacent alternative, more connections",
        },
      ],
    },
    ord: {
      label: "USA — Chicago (ORD)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Open-jaw FRA in / MUC out",
      options: [
        {
          name: "United nonstop (open-jaw)",
          route: "ORD → FRA / MUC → ORD",
          stops: 0,
          cabin: "Main Cabin",
          fare: 900,
          note: "United's ORD–FRA nonstop; book as one multi-city fare with the MUC return",
          current: true,
        },
        {
          name: "Lufthansa via Frankfurt",
          route: "ORD → FRA / MUC → FRA → ORD",
          stops: 1,
          cabin: "Economy",
          fare: 860,
          note: "Lufthansa metal, connects home through FRA instead of a nonstop MUC leg",
        },
        {
          name: "American via London Heathrow",
          route: "ORD → LHR → FRA / MUC → LHR → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 940,
          note: "Oneworld alternative via LHR",
        },
      ],
    },
  },
  hotels: {
    nuremberg: {
      baseNights: 2,
      label: "Nuremberg",
      header: "Nuremberg — Christkindlesmarkt",
      options: [
        {
          name: "ibis Nürnberg Hauptbahnhof",
          rate: 110,
          rating: "7.8",
          note: "Reliable budget chain by the station, short walk to the Altstadt",
        },
        {
          name: "Sorat Hotel Saxx Nürnberg",
          rate: 150,
          rating: "8.2",
          note: "3-star on the Hauptmarkt — some rooms overlook the market stalls",
        },
        {
          name: "Hotel Drei Raben",
          rate: 180,
          rating: "8.5",
          note: "Boutique hotel in the Altstadt, steps from the Christkindlesmarkt",
          current: true,
        },
        {
          name: "Le Méridien Grand Hotel Nürnberg",
          rate: 260,
          rating: "8.6",
          note: "Belle-époque grand hotel opposite the Hauptbahnhof",
        },
      ],
    },
    rothenburg: {
      baseNights: 1,
      label: "Rothenburg",
      header: "Rothenburg ob der Tauber",
      options: [
        {
          name: "Gasthaus Klosterstüble",
          rate: 100,
          rating: "8.0",
          note: "Family-run guesthouse just inside the town walls",
        },
        {
          name: "Hotel Reichsküchenmeister",
          rate: 140,
          rating: "8.3",
          note: "Half-timbered inn on Herrngasse, a block from the Marktplatz",
          current: true,
        },
        {
          name: "BurgHotel",
          rate: 220,
          rating: "8.9",
          note: "Perched on the town wall above the Tauber valley, quiet garden courtyard",
        },
      ],
    },
    munich: {
      baseNights: 3,
      label: "Munich",
      header: "Munich — Marienplatz",
      options: [
        {
          name: "ibis Styles München City",
          rate: 140,
          rating: "7.9",
          note: "Simple budget stay a few S-Bahn stops from Marienplatz",
        },
        {
          name: "Hotel Cortiina",
          rate: 220,
          rating: "8.6",
          note: "3-star boutique steps from Marienplatz and the Viktualienmarkt",
          current: true,
        },
        {
          name: "Platzl Hotel",
          rate: 380,
          rating: "8.8",
          note: "Bavarian luxury two minutes from Marienplatz, spa and traditional restaurant",
        },
        {
          name: "Bayerischer Hof",
          rate: 700,
          rating: "9.2",
          note: "Legendary five-star icon near the Residenz, rooftop bar over the city",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "arrival",
        role: "arrival",
        routeName: "Arrive Frankfurt (FRA) · ICE into Nuremberg",
        note: "~2 hr direct ICE from Frankfurt Airport to Nürnberg Hbf",
        toggles: [],
        routeDetail: false,
        flat: { cost: 80, scale: "person" },
      },
      {
        id: "n-r",
        from: "nuremberg",
        to: "rothenburg",
        routeName: "Nuremberg → <strong>Rothenburg ob der Tauber</strong>",
        note: "Regional train via Ansbach + Steinach, ~1h15",
        toggles: [],
        routeDetail: false,
        flat: { cost: 30, scale: "person" },
      },
      {
        id: "r-m",
        from: "rothenburg",
        to: "munich",
        routeName: "Rothenburg → <strong>Munich</strong>",
        note: "Regional + IC via Treuchtlingen, ~2h45",
        toggles: [],
        routeDetail: false,
        flat: { cost: 60, scale: "person" },
      },
      {
        id: "departure",
        role: "departure",
        routeName: "<strong>Munich</strong> → Munich Airport (MUC)",
        note: "S-Bahn S1/S8, ~45 min · fly home",
        toggles: [],
        routeDetail: false,
        flat: { cost: 30, scale: "person" },
      },
    ],
  },
  activities: {
    nuremberg: [
      {
        day: 1,
        title: "Christkindlesmarkt & the Old Town",
        options: [
          {
            name: "Self-guided market stroll (free)",
            cost: 0,
            note: "The Hauptmarkt stalls, the Christkind's opening balcony, Glühwein and Lebkuchen",
            current: true,
          },
        ],
      },
      {
        day: 2,
        title: "Kaiserburg castle & the Documentation Center",
        options: [
          {
            name: "Self-guided Altstadt & castle grounds (free)",
            cost: 0,
            note: "Walk the city walls and the castle courtyard without a ticket",
            current: true,
          },
          {
            name: "Kaiserburg imperial castle tour",
            cost: 18,
            note: "Imperial apartments + the Sinwell Tower view over the market rooftops",
          },
          {
            name: "Nazi Documentation Center",
            cost: 15,
            note: "The unfinished Nazi party rally grounds — a sober, essential counterpoint to the markets",
          },
        ],
      },
    ],
    rothenburg: [
      {
        day: 3,
        title: "Reiterlesmarkt & the town walls",
        options: [
          {
            name: "Self-guided walls walk + Reiterlesmarkt (free)",
            cost: 0,
            note: "Walk the covered wall walk, then the market stalls at the Marktplatz",
            current: true,
          },
          {
            name: "Night Watchman's tour",
            cost: 22,
            note: "Lantern-lit walk with Rothenburg's costumed night watchman, told in character",
          },
          {
            name: "Christmas Museum",
            cost: 12,
            note: "Year-round history of German Christmas ornaments and traditions",
          },
        ],
      },
    ],
    munich: [
      {
        day: 4,
        title: "Marienplatz Christkindlmarkt",
        options: [
          {
            name: "Self-guided market & Glockenspiel (free)",
            cost: 0,
            note: "The Rathaus glockenspiel show, market stalls ringing the square",
            current: true,
          },
        ],
      },
      {
        day: 5,
        title: "The Residenz",
        options: [
          {
            name: "Residenz self-guided ticket",
            cost: 20,
            note: "The Wittelsbachs' royal palace — treasury and state rooms",
          },
          {
            name: "Viktualienmarkt wander (free)",
            cost: 0,
            note: "Munich's year-round food market, a Glühwein stand at every corner in December",
            current: true,
          },
        ],
      },
      {
        day: 6,
        title: "BMW Welt & Olympiapark",
        options: [
          {
            name: "Self-guided BMW Welt (free)",
            cost: 0,
            note: "Showroom and design center, free to walk through",
            current: true,
          },
        ],
      },
      {
        day: 7,
        title: "Neuschwanstein day trip",
        options: [
          {
            name: "Self-guided train + castle tour",
            cost: 140,
            note: "Train to Füssen, bus up to the castle, timed-entry tour of the fairy-tale interior",
            current: true,
          },
          {
            name: "Stay in Munich — second Christkindlmarkt visit (free)",
            cost: 0,
            note: "Skip the day trip; a slower last full day around Marienplatz and the Frauenkirche",
          },
        ],
      },
    ],
  },
  itinPool: {
    nuremberg: [
      {
        id: "n-arrive",
        travel: true,
        move: "arrival",
        lodging: "nuremberg",
        cityTag: "Frankfurt → Nuremberg",
        sun: "16:26",
        title: "Into Franconia, first Glühwein of the trip",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Frankfurt (FRA); ICE direct to Nürnberg Hbf, ~2 hr.",
            detail:
              "We land separately — meet at the hotel. Short walk from the station into the Altstadt.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "First look at the Christkindlesmarkt on the Hauptmarkt — Glühwein in a keepsake mug, a bag of Lebkuchen, the Christkind's balcony lit up over the stalls.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight is a full market stroll or a quick warm-up mug before bed.",
      },
      {
        id: "n-castle",
        cityTag: "Nuremberg",
        sun: "16:25",
        title: "Kaiserburg and the market by daylight",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Kaiserburg castle above the rooftops.",
            detail:
              "Climb to the imperial castle for the long view down over the Christkindlesmarkt and the Old Town walls; cold enough for a Glühwein break on the way back down.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Nürnberger Rostbratwurst at a market stall.",
            detail:
              "Three-in-a-roll is the local rule; a stein of Franconian beer to go with it.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "The Handwerkerhof craft stalls just outside the station make a quieter, warmer detour from the main market crowds.",
          },
        ],
        fuller:
          "Add the <b>Nazi Documentation Center</b> — a sober half-day at the unfinished rally grounds, a necessary counterweight to the market cheer.",
        ask: "castle views or the Documentation Center — or both if the light holds?",
      },
      {
        id: "n-extra",
        cityTag: "Nuremberg",
        sun: "16:24",
        title: "A second morning in the Altstadt",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "St. Sebald church and the city walls.",
            detail:
              "A slower loop through the Altstadt's back lanes — St. Sebald's twin spires, the Fembohaus, and the walkable stretch of the medieval wall.",
          },
        ],
        fuller:
          "If the flex night lands here instead of Munich, swap in the <b>Nazi Documentation Center</b> for the afternoon.",
      },
    ],
    rothenburg: [
      {
        id: "r-arrive",
        travel: true,
        move: "n-r",
        lodging: "rothenburg",
        cityTag: "Nuremberg → Rothenburg",
        sun: "16:20",
        title: "Into the walled town",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Regional train via Ansbach + Steinach, ~1h15.",
            detail:
              "Two quick changes on the branch line; the last stretch rolls in past the town walls.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Reiterlesmarkt at the Marktplatz.",
            detail:
              "Rothenburg's own Christmas market, small and lantern-lit, wrapped inside the medieval walls — walk the covered Wehrgang before dark.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner at the Reichsküchenmeister.",
            detail:
              "Franconian classics in a half-timbered dining room off Herrngasse.",
          },
        ],
        ask: "leave Nuremberg with enough daylight left — the Plönlein is worth catching right at dusk.",
      },
      {
        id: "r-plonlein",
        cityTag: "Rothenburg",
        sun: "16:19",
        title: "The Plönlein at dusk",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Plönlein, golden hour.",
            detail:
              "The postcard corner of Rothenburg — two half-timbered houses framing the fork in the lane, best with the string lights just coming on.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A last Glühwein at the Marktplatz stalls.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Turn the Night Watchman's tour into the evening's whole plan — lantern in hand, told entirely in character.",
          },
        ],
        fuller:
          "Add the <b>Christmas Museum</b> for the daytime half — the year-round home of German ornament history, a warm indoor break between market laps.",
        ask: "Night Watchman's tour or the Christmas Museum — or save both for a longer stay here?",
      },
    ],
    munich: [
      {
        id: "m-arrive",
        travel: true,
        move: "r-m",
        lodging: "munich",
        cityTag: "Rothenburg → Munich",
        sun: "16:15",
        title: "Into the Bavarian capital",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Regional + IC via Treuchtlingen, ~2h45.",
            detail:
              "Rothenburg to München Hbf, one change, countryside turning to city by the end.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "First walk to Marienplatz.",
            detail:
              "Time it for the Glockenspiel if the schedule allows — 11am, noon, or 5pm — then straight into the Christkindlmarkt ringing the square.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner near Marienplatz.",
            detail:
              "A Glühwein nightcap at the Viktualienmarkt stalls on the walk back.",
          },
        ],
      },
      {
        id: "m-marienplatz",
        cityTag: "Munich",
        sun: "16:14",
        title: "Marienplatz Christkindlmarkt & the Glockenspiel",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Marienplatz Christkindlmarkt.",
            detail:
              "Munich's flagship market — the Rathaus glockenspiel chiming over the stalls, an enormous lit tree at the center of it all.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Lunch at the Viktualienmarkt.",
            detail:
              "Year-round food market a block off Marienplatz, its own small Christmas stalls in December.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Climb the Frauenkirche south tower for the rooftop view over the market lights.",
          },
        ],
      },
      {
        id: "m-residenz",
        cityTag: "Munich",
        sun: "16:13",
        title: "The Residenz and royal Munich",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "The Residenz palace & treasury.",
            detail:
              "The Wittelsbachs' city palace — state rooms, the Antiquarium, the crown jewels in the Schatzkammer.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in the old town.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "BMW Welt is free to walk through if there's an afternoon gap — striking modern architecture, no ticket needed.",
          },
        ],
        fuller:
          "Swap the palace for a slower morning at the <b>Viktualienmarkt</b> stalls if royal interiors aren't the draw.",
      },
      {
        id: "m-neuschwanstein",
        cityTag: "Munich",
        sun: "16:12",
        title: "A day trip to Neuschwanstein",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Train to Füssen, then a short bus up to the castle.",
            detail:
              "Round-trip from Munich by regional train; book the castle's timed entry ahead — December slots go fast.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Neuschwanstein Castle.",
            detail:
              "Ludwig II's fairy-tale castle in the snow — the view from Marienbrücke, weather permitting, is the whole reason to come.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A last dinner back in Munich.",
            detail: "",
          },
        ],
        fuller:
          "Prefer to stay in the city? Trade the day trip for a second, slower pass through Marienplatz and the Christkindlmarkt.",
        ask: "is the Neuschwanstein day trip worth a 5:30am start, or is one more relaxed Munich day the better call?",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "departure",
    sun: "16:11",
    cityTag: "Munich → home",
    title: "S-Bahn to the airport and fly home",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Munich → Munich Airport (MUC), ~45 min on the S1/S8.",
        detail:
          "Build in buffer for December schedules; one last Glühwein at the station stall before the train.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a slow last market lap vs. a dash for the S-Bahn.",
  },
  visaPlan: {
    "n-arrive":
      "Arrive Frankfurt (FRA); ICE into Nuremberg; first night at the Christkindlesmarkt.",
    "n-castle": "Kaiserburg castle & the Christkindlesmarkt by daylight.",
    "n-extra": "St. Sebald church & the city walls — second Nuremberg morning.",
    "r-arrive":
      "Regional train to Rothenburg; Reiterlesmarkt & the town walls.",
    "r-plonlein":
      "The Plönlein at dusk; Night Watchman's tour or the Christmas Museum.",
    "m-arrive": "Train to Munich; first walk to Marienplatz.",
    "m-marienplatz": "Marienplatz Christkindlmarkt & the Glockenspiel.",
    "m-residenz": "The Residenz palace & the Viktualienmarkt.",
    "m-neuschwanstein": "Day trip to Neuschwanstein Castle.",
    depart: "S-Bahn to Munich Airport (MUC); depart.",
  },
};
