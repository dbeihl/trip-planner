export default {
  meta: {
    title: "Classic Italy by Rail — Sep 2026",
    route: ["rome", "florence", "venice"],
    optionalCities: [],
    flexNightDefault: "rome",
    dates: { arrive: "2026-09-19", depart: "2026-09-27", nights: 8 },
    travelers: {
      count: 2,
      note: "2 travelers; fly into Rome (FCO), out of Venice (VCE) — open jaw, no rental car",
    },
    currency: "USD",
    lodgingTaxBuffer: 1.15, // Italian city/lodging tax + tourist tax buffer
    destLabel: "Rome",
    ui: {
      eyebrow:
        'Sep 19 → Sep 27, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked rail trip',
      planTitle: "Classic Italy by High-Speed Rail",
      planSub:
        "Rome, Florence &amp; Venice on the Frecciarossa — an open-jaw into Fiumicino and home from Marco Polo, no rental car needed. Pick a hotel tier per stop; train fares and transfers fold into the grand total. Every figure is a researched 2026 planning estimate.",
      flightsTitle: "Getting there — flights to Rome, home from Venice",
      flightsIntro:
        "Two travelers converging on Rome. Pick a routing for each — fares fold into the grand total. Fly into Fiumicino (FCO), out of Venice Marco Polo (VCE) so the whole trip moves in one direction, city to city, by train.",
      itinTitle: "Rome, Florence &amp; Venice — eight nights by rail",
      itinDek:
        "A relaxed sweep down the boot in reverse: ancient Rome, Renaissance Florence, and the Venetian lagoon. One anchor sight a day, real trattoria time, and just enough breathing room to get lost on purpose.",
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND)",
      traveler: "David",
      pax: 1,
      preference: "One-connection open-jaw · fewest stops",
      options: [
        {
          name: "American via Philadelphia",
          route: "IND → PHL → FCO · VCE → PHL → IND",
          stops: 1,
          cabin: "Economy",
          fare: 980,
          note: "Cheapest; AA's PHL–Rome nonstop, home from Venice via PHL",
          current: true,
        },
        {
          name: "Delta via Atlanta",
          route: "IND → ATL → FCO · VCE → ATL → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1020,
          note: "IND–ATL, then Delta's seasonal nonstop to Rome",
        },
        {
          name: "United via Newark",
          route: "IND → EWR → FCO · VCE → EWR → IND",
          stops: 1,
          cabin: "Economy",
          fare: 1040,
          note: "Star Alliance via the Newark hub",
        },
        {
          name: "Delta / KLM via Detroit + Amsterdam",
          route: "IND → DTW → AMS → FCO · VCE → AMS → DTW → IND",
          stops: 2,
          cabin: "Economy",
          fare: 1090,
          note: "SkyTeam via Detroit + Amsterdam; more connections",
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
          name: "Qatar Airways via Doha",
          route: "DVO → MNL → DOH → FCO · VCE → DOH → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1330,
          note: "Via Manila + Doha, strong connection times",
          current: true,
        },
        {
          name: "Emirates via Dubai",
          route: "DVO → MNL → DXB → FCO · VCE → DXB → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1390,
          note: "Reliable DXB hub, wide seat selection",
        },
        {
          name: "Turkish Airlines via Istanbul",
          route: "DVO → MNL → IST → FCO · VCE → IST → MNL → DVO",
          stops: 2,
          cabin: "Economy",
          fare: 1245,
          note: "Usually the cheapest Gulf/EU-hub option",
        },
        {
          name: "ANA + Lufthansa via Tokyo & Frankfurt",
          route: "DVO → MNL → NRT → FRA → FCO · VCE → FRA → NRT → MNL → DVO",
          stops: 3,
          cabin: "Economy",
          fare: 1600,
          note: "Star Alliance alternative via Tokyo and Frankfurt",
        },
      ],
    },
    chi: {
      label: "From Chicago (ORD) — preset option",
      traveler: "Preset",
      pax: 1,
      preset: true,
      preference: "United/Star Alliance preferred",
      options: [
        {
          name: "United / Lufthansa via Munich",
          route: "ORD → MUC → FCO · VCE → MUC → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 720,
          note: "Single connection each way via Munich",
          current: true,
        },
        {
          name: "American via London Heathrow",
          route: "ORD → LHR → FCO · VCE → LHR → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 760,
          note: "Oneworld alternative via LHR",
        },
        {
          name: "Delta via Amsterdam",
          route: "ORD → AMS → FCO · VCE → AMS → ORD",
          stops: 1,
          cabin: "Main Cabin",
          fare: 740,
          note: "SkyTeam alternative via Amsterdam",
        },
      ],
    },
  },
  hotels: {
    rome: {
      baseNights: 3,
      label: "Rome",
      header: "Rome",
      options: [
        {
          name: "The Beehive (Monti)",
          rate: 95,
          rating: "7.9",
          note: "Budget-friendly, walkable to Termini and the centro",
        },
        {
          name: "Hotel Trastevere",
          rate: 130,
          rating: "8.0",
          note: "Small family-run hotel in the heart of Trastevere",
        },
        {
          name: "Hotel Modigliani",
          rate: 150,
          rating: "8.4",
          note: "Quiet courtyard near Via Veneto, easy walk to the centro",
          current: true,
        },
        {
          name: "Hotel Indigo Rome — St. George",
          rate: 270,
          rating: "8.8",
          note: "Boutique 5-star in Monti, rooftop bar over the rooftops",
        },
        {
          name: "Villa Spalletti Trombelli",
          rate: 540,
          rating: "9.2",
          note: "Intimate 12-room villa near the Quirinale, all-inclusive rates",
        },
      ],
    },
    florence: {
      baseNights: 2,
      label: "Florence",
      header: "Florence",
      options: [
        {
          name: "Soggiorno Battistero",
          rate: 110,
          rating: "8.2",
          note: "Budget pick with a Duomo-view breakfast terrace",
        },
        {
          name: "Hotel Alessandra",
          rate: 140,
          rating: "8.0",
          note: "Steps from Ponte Vecchio, old-Florence charm",
        },
        {
          name: "Hotel Brunelleschi",
          rate: 230,
          rating: "8.6",
          note: "Built into a Byzantine tower two blocks from the Duomo",
          current: true,
        },
        {
          name: "Portrait Firenze",
          rate: 650,
          rating: "9.3",
          note: "Ferragamo-family boutique on the Arno in the Oltrarno",
        },
      ],
    },
    venice: {
      baseNights: 2,
      label: "Venice",
      header: "Venice",
      options: [
        {
          name: "Hotel Abbazia",
          rate: 150,
          rating: "8.1",
          note: "Converted abbey in quiet Cannaregio, garden courtyard",
        },
        {
          name: "Hotel Flora",
          rate: 230,
          rating: "8.7",
          note: "Hidden garden a few steps off St. Mark's Square",
          current: true,
        },
        {
          name: "Hotel Ai Reali",
          rate: 320,
          rating: "8.9",
          note: "Near Rialto Bridge, canal-view rooms and spa",
        },
        {
          name: "The Gritti Palace",
          rate: 1100,
          rating: "9.4",
          note: "15th-century palazzo on the Grand Canal, San Marco",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "arrive",
        role: "arrival",
        routeName: "Arrive Fiumicino (FCO) · Leonardo Express into Rome",
        note: "~32 min nonstop to Roma Termini, trains every 15 min",
        toggles: [],
        routeDetail: false,
        flat: { cost: 32, scale: "person" },
      },
      {
        id: "r-f",
        from: "rome",
        to: "florence",
        routeName: "Rome → <strong>Florence</strong>",
        note: "Frecciarossa high-speed train, ~1h35",
        toggles: [],
        routeDetail: false,
        flat: { cost: 90, scale: "person" },
      },
      {
        id: "f-v",
        from: "florence",
        to: "venice",
        routeName: "Florence → <strong>Venice</strong>",
        note: "Frecciarossa high-speed train, ~2h05",
        toggles: [],
        routeDetail: false,
        flat: { cost: 100, scale: "person" },
      },
      {
        id: "depart",
        role: "departure",
        routeName: "<strong>Venice</strong> → Marco Polo (VCE) · fly home",
        note: "Alilaguna water bus or land shuttle, ~1h to the airport",
        toggles: [],
        routeDetail: false,
        flat: { cost: 28, scale: "person" },
      },
    ],
  },
  activities: {
    rome: [
      {
        day: 2,
        title: "Colosseum, Forum & Palatine Hill",
        options: [
          {
            name: "Self-guided with skip-the-line ticket",
            cost: 22,
            note: "Timed Colosseum + Forum + Palatine combo ticket, explore at your own pace",
            current: true,
          },
          {
            name: "Colosseum, Forum & Palatine guided tour",
            cost: 75,
            note: "3-hr small-group tour with arena-floor access",
          },
          {
            name: "Colosseum Underground + Arena Floor tour",
            cost: 95,
            note: "Access to the gladiator tunnels and the arena floor",
          },
        ],
      },
      {
        day: 3,
        title: "Vatican Museums & Sistine Chapel",
        options: [
          {
            name: "Timed-entry ticket, self-guided",
            cost: 35,
            note: "Vatican Museums + Sistine Chapel + St. Peter's Basilica",
            current: true,
          },
          {
            name: "Early-access guided tour (before opening)",
            cost: 89,
            note: "In before the public crowds, small group, skip-the-line",
          },
        ],
      },
      {
        day: 4,
        title: "Trastevere & the historic centro",
        options: [
          {
            name: "Self-guided walk (free)",
            cost: 0,
            note: "Pantheon, Piazza Navona, Campo de' Fiori, Trastevere at dusk",
            current: true,
          },
          {
            name: "Rome by night food tour",
            cost: 95,
            note: "Guided tastings through Trastevere's trattorias and wine bars",
          },
        ],
      },
    ],
    florence: [
      {
        day: 5,
        title: "Uffizi Gallery",
        options: [
          {
            name: "Timed-entry ticket, self-guided",
            cost: 30,
            note: "Botticelli, Caravaggio, the Renaissance in one building — book the timed slot ahead",
            current: true,
          },
          {
            name: "Uffizi skip-the-line guided tour",
            cost: 79,
            note: "2-hr small-group tour with an art historian",
          },
        ],
      },
      {
        day: 6,
        title: "Duomo, Ponte Vecchio & the Oltrarno",
        options: [
          {
            name: "Self-guided walk (free)",
            cost: 0,
            note: "Duomo exterior, Ponte Vecchio, artisan workshops in the Oltrarno",
            current: true,
          },
          {
            name: "Accademia (David) timed entry",
            cost: 24,
            note: "See Michelangelo's David without the standby line",
          },
          {
            name: "Brunelleschi's Dome climb",
            cost: 30,
            note: "463 steps inside the cupola for the rooftop skyline view",
          },
        ],
      },
    ],
    venice: [
      {
        day: 7,
        title: "St. Mark's Square & the Doge's Palace",
        options: [
          {
            name: "Self-guided walk (free)",
            cost: 0,
            note: "St. Mark's Basilica exterior, the Piazza, the Bridge of Sighs from outside",
            current: true,
          },
          {
            name: "Doge's Palace timed entry",
            cost: 30,
            note: "Secret Itineraries guided add-on available",
          },
          {
            name: "Gondola ride (shared)",
            cost: 45,
            note: "~30 min shared gondola; golden-hour departures sell out",
          },
        ],
      },
      {
        day: 8,
        title: "Murano & Burano islands",
        options: [
          {
            name: "Self-guided vaporetto day (transit pass)",
            cost: 25,
            note: "ACTV day pass, hop the lagoon islands at your own pace",
            current: true,
          },
          {
            name: "Guided Murano glass-blowing + Burano tour",
            cost: 65,
            note: "Small-boat tour including a glass-blowing demonstration",
          },
        ],
      },
    ],
  },
  itinPool: {
    rome: [
      {
        id: "r-arrive",
        travel: true,
        move: "arrive",
        lodging: "rome",
        cityTag: "Rome — arrive",
        sun: "19:12",
        title: "Land, settle in, first taste of Rome",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Fly into Fiumicino (FCO); Leonardo Express into Roma Termini.",
            detail:
              "~32 min nonstop into Termini, then a short walk or cab to the hotel. We land separately — meet at the hotel.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "An easy first dinner in Trastevere or Monti — no agenda tonight beyond getting oriented and staying awake past 9pm.",
          },
        ],
        ask: "what time do our flights land? It decides whether tonight is a real dinner or a nap-first evening.",
      },
      {
        id: "r-colosseum",
        cityTag: "Rome — Ancient Rome",
        sun: "19:10",
        title: "Colosseum, Forum, and the Palatine",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Colosseum, Roman Forum & Palatine Hill.",
            detail:
              "One combo ticket covers all three — go early, the Forum is brutal in midday sun even in September.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Monti.",
            detail: "Quieter than the touristy blocks right by the Colosseum.",
          },
          {
            tag: "Wildlife",
            kind: "soft",
            detail:
              "Walk it off with a loop past the Circus Maximus and up to the Aventine keyhole view of St. Peter's dome.",
          },
        ],
        fuller:
          "Add the <b>Colosseum Underground + Arena Floor tour</b> to stand where the gladiators actually stood.",
        ask: "guided tour or self-guided with the combo ticket and an audio app?",
      },
      {
        id: "r-vatican",
        cityTag: "Rome — Vatican",
        sun: "19:08",
        title: "Vatican Museums, Sistine Chapel, St. Peter's",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Vatican Museums & the Sistine Chapel.",
            detail:
              "The Raphael Rooms build to the Chapel ceiling — worth the crowd. St. Peter's Basilica right after, dome optional.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Prati or Borgo.",
            detail: "Just outside the Vatican walls, fewer tourist-menu traps.",
          },
        ],
        fuller:
          "Book the <b>early-access guided tour</b> — in before the public gates open, the Sistine Chapel nearly empty.",
        ask: "climb the dome (551 steps, no elevator the last stretch) or save the legs for Florence?",
      },
      {
        id: "r-trastevere",
        cityTag: "Rome",
        sun: "19:06",
        title: "Trastevere, the Pantheon, and a flex day",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Pantheon, Piazza Navona, Campo de' Fiori.",
            detail:
              "The old centro on foot — the Pantheon's oculus, Bernini's fountains, the morning market at Campo de' Fiori.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Trastevere.",
            detail:
              "Cobblestones, ivy, and the best trattoria density in Rome.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "This is the flex night — a second Vatican pass, a day trip to Ostia Antica, or just more Rome.",
          },
        ],
        fuller:
          "Trade it for a half-day trip to <b>Ostia Antica</b> — a Pompeii-level ruin 30 min by train, a fraction of the crowds.",
        ask: "keep the flex night here in Rome, or push the extra night to Florence or Venice?",
      },
    ],
    florence: [
      {
        id: "f-arrive",
        travel: true,
        move: "r-f",
        lodging: "florence",
        cityTag: "Rome → Florence",
        sun: "19:04",
        title: "High-speed to the Renaissance",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Frecciarossa Rome → Florence, ~1h35.",
            detail:
              "Roma Termini to Firenze Santa Maria Novella, city center to city center — no airport in between.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner near the Duomo.",
            detail: "First look at the cupola lit up at night.",
          },
        ],
        ask: "which train time — a morning departure buys a full first afternoon in Florence.",
      },
      {
        id: "f-uffizi",
        cityTag: "Florence",
        sun: "19:02",
        title: "Uffizi and the Renaissance masters",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Uffizi Gallery.",
            detail:
              "Botticelli's Birth of Venus, Caravaggio, room after room of it — book the timed slot well ahead, this sells out.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in the Oltrarno.",
            detail: "Across the river, fewer tour groups, better bistecca.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Ponte Vecchio at golden hour — the gold shops glow and the crowd thins after the day-trippers leave.",
          },
        ],
        fuller:
          "Add the <b>Uffizi skip-the-line guided tour</b> — a 2-hr walk with an art historian who makes the paintings click.",
      },
      {
        id: "f-oltrarno",
        cityTag: "Florence",
        sun: "19:00",
        title: "Accademia's David and the Oltrarno",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Accademia Gallery — Michelangelo's David.",
            detail:
              "Book the timed entry; the standby line regularly runs 2+ hours in September.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A slow last dinner in Florence.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Boboli Gardens or a wander through the leather and paper artisan shops in the Oltrarno backstreets.",
          },
        ],
        fuller:
          "Strong legs? Climb <b>Brunelleschi's Dome</b> — 463 steps for the best skyline view in Tuscany.",
      },
    ],
    venice: [
      {
        id: "v-arrive",
        travel: true,
        move: "f-v",
        lodging: "venice",
        cityTag: "Florence → Venice",
        sun: "18:58",
        title: "Into the lagoon",
        rows: [
          {
            tag: "Move",
            kind: "move",
            lead: "Frecciarossa Florence → Venice, ~2h05.",
            detail:
              "Santa Maria Novella to Venezia Santa Lucia — the station opens straight onto the Grand Canal.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "First walk to St. Mark's Square.",
            detail:
              "No cars, no bikes — just the canals. Let the walk to St. Mark's be the whole itinerary tonight.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner near the Rialto.",
            detail: "",
          },
        ],
      },
      {
        id: "v-canals",
        cityTag: "Venice",
        sun: "18:56",
        title: "St. Mark's, the Doge's Palace, and the canals",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Doge's Palace & St. Mark's Basilica.",
            detail:
              "The seat of the Venetian Republic — the Bridge of Sighs, the armory, the gilded Basilica interior.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "Dinner in Cannaregio.",
            detail: "Quieter canals, away from the San Marco crowds.",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "A shared gondola at golden hour — book ahead, the best departure slots sell out by afternoon.",
          },
        ],
        fuller:
          "Upgrade to the <b>Secret Itineraries</b> tour of the Doge's Palace — the hidden prison cells and back corridors.",
      },
      {
        id: "v-murano",
        cityTag: "Venice",
        sun: "18:54",
        title: "Murano, Burano, or a slow Venice morning",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Murano glass & Burano's painted houses.",
            detail:
              "A vaporetto day out on the lagoon — glass furnaces on Murano, the candy-colored canals of Burano.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A farewell dinner back in San Marco.",
            detail: "",
          },
          {
            tag: "Do",
            kind: "soft",
            detail:
              "Prefer to stay put? Dorsoduro and the Accademia Bridge make for a slower, emptier last day.",
          },
        ],
        fuller:
          "Add the <b>guided Murano glass-blowing + Burano</b> small-boat tour if you want the furnace demonstration.",
        ask: "islands out on the lagoon, or a slow last morning in Dorsoduro?",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "18:52",
    cityTag: "Venice → home",
    title: "Vaporetto to the airport and fly home",
    rows: [
      {
        tag: "Move",
        kind: "move",
        lead: "Venice → Marco Polo (VCE), ~1h.",
        detail:
          "Alilaguna water bus or a land shuttle to the airport; build in buffer for the water crossing. One last look at the lagoon on the way out.",
      },
    ],
    ask: "when do the flights home leave? It sets how much of the morning is a slow canal walk vs. a dash for the boat.",
  },
  visaPlan: {
    "r-arrive": "Arrive Fiumicino (FCO); Leonardo Express into Roma Termini.",
    "r-colosseum": "Colosseum, Roman Forum & Palatine Hill.",
    "r-vatican": "Vatican Museums, Sistine Chapel & St. Peter's Basilica.",
    "r-trastevere": "Pantheon, Piazza Navona, Trastevere — flex day in Rome.",
    "f-arrive": "Frecciarossa to Florence; Duomo at night.",
    "f-uffizi": "Uffizi Gallery & the Ponte Vecchio.",
    "f-oltrarno": "Accademia's David; Oltrarno artisan streets.",
    "v-arrive": "Frecciarossa to Venice; first walk to St. Mark's.",
    "v-canals": "Doge's Palace, St. Mark's Basilica, canals by gondola.",
    "v-murano": "Murano & Burano islands, or a slow Dorsoduro morning.",
    depart: "Vaporetto/shuttle to Marco Polo (VCE); depart.",
  },
};
