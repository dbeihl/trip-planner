export default {
  meta: {
    title: "Davao & Japan — Oct–Nov 2026",
    // hub card (index page): emoji, display title, stops line, blurb, sort order
    hub: {
      order: 1,
      emoji: "🗼",
      title: "Japan",
      meta: "Davao · Osaka · Tokyo · Kyoto & Nara day trips",
      go: "Japan",
      blurb:
        "A week with family in Malita first, then the trip proper: in through Kansai to a four-night Osaka base — neon and street food, with day trips out to Kyoto, Nara, and Minoh — and a Shinkansen up to Tokyo for the last three nights in Shibuya.",
    },
    route: ["davao", "osaka", "tokyo"], // ordered city keys
    optionalCities: [],
    flexNightDefault: "davao", // which flex-night option is selected by default
    dates: { arrive: "2026-10-24", depart: "2026-11-08", nights: 15 },
    travelers: {
      count: 2,
      note: "2 adults; David flies IND → Davao (departs Oct 22, lands Oct 24), then both fly DVO → KIX together on Nov 1 (booked, Cebu Pacific) and home separately out of Haneda on Nov 8",
    },
    currency: "USD",
    reference: {
      total: 9644,
      label: "Kensington Tours quote",
      caveat:
        "Placeholder Nov 7–14 dates and a different trip entirely (Tokyo-first, a Hakone ryokan night, Kyoto as the base, no Osaka, no Davao week); ground-only comparison since Kensington's quote excluded airfare.",
      blurb:
        "Kensington Tours quoted <b>$9,644</b> for a Tokyo–Hakone–Kyoto version of this trip — but for placeholder dates (Nov 7–14), the opposite direction of travel, and a route that shares almost nothing with this one: no Osaka base, no Nara, no Davao week, and a Hakone ryokan night that has since been cut. Treat it as a rough order-of-magnitude reference only. The delta above compares ground costs only — Kensington's quote excluded airfare.",
    },
    lodgingTaxBuffer: 1.25, // lodging-only planning margin, not a sourced figure
    minRating: 7.0, // hotel-tier floor for this trip; markup default is 8.0
    destLabel: "Davao", // gateway shown for an "Other airport" origin
    visaForm: true, // emit the Japan MOFA "Travel Itinerary" sheet in the .xlsx
    ui: {
      eyebrow:
        'Oct 24 → Nov 8, 2026 · <span class="traveler-count-lbl">2</span> travelers · self-booked (DIY)',
      planTitle: "Davao &amp; Japan Trip Cost Ledger",
      planSub:
        "Pick a hotel tier per stop and a transport mode per leg. Transport fares are live-researched, every airfare is a real quote or a booked ticket, and the Osaka hotel was re-quoted for the actual dates on 2026-08-09. The Tokyo stay is the booked Tokyu Stay Shibuya (Nov 5–8); its nightly rate is not in the ledger yet. The total updates as you go.",
      flightsTitle: "Getting there — International flights",
      flightsIntro:
        "David flies IND → Davao (out Oct 22, in Oct 24); his partner is already home in Davao. The two of you then fly DVO → KIX together on Nov 1 — that leg is booked and priced as a transport leg below, not here — and fly home separately out of Haneda on Nov 8. Pick a routing for each; fares fold into the grand total.",
      itinTitle: "Osaka &amp; Tokyo — seven nights in Japan",
      itinDek:
        "The Philippine week is family time in Malita and is not planned here — it appears only so the dates and the costs line up. Japan is the trip: four nights based in Namba, with Osaka's kitchen at the door and day trips out to Kyoto, Nara, and Minoh, then the Nozomi up to Tokyo for three nights in Shibuya. One base, one move, no packing and repacking.",
      finePrint: [
        "Citadines Namba was re-quoted on 2026-08-09 (Booking.com, 2 adults, 1 room, USD) at $197/night for Nov 1–6 ($984 for those 5 nights). The stay is now Nov 1–5, four nights, still using that nightly figure, and has not been re-quoted for four nights. Tokyu Stay Shibuya (Nov 5–8) has no sourced rate, so the Tokyo lodging line is $0 until one is entered. That $0 is a placeholder, not a free room. Alternatives marked \"NOT re-quoted\" still carry their old figures and will move.",
        "Nozomi 80 (Shin-Osaka 8:45 AM to Tokyo 11:15 AM, Green Car) is booked. The $190 line is the previously researched ordinary reserved-seat fare (¥14,720 per person), not the Green Car price. The Nara and Kyoto private tour is booked on Klook; its price is not in the ledger either, so that line is also $0 until a figure is entered.",
        "The Philippine week is not costed beyond the airport transfer and the flights — it is family time in Malita, staying with family at no lodging cost. The Davao hotel tiers are rough estimates kept only as a fallback.",
        "Every alternative hotel holds a private double/twin room with its own bathroom and a ≥7.0 guest rating. The floor was 8.0 until 2026-08-09; the sub-8.0 tiers were added deliberately to show what the trip costs at the bottom of the range.",
        "The cheapest Osaka tiers (OKINI, MAIDO) are in Nishinari Ward — Osaka's cheapest district and the reason the rate is $28 rather than $200. It is a working-class area around Shin-Imamiya with a rough reputation and genuinely good transport, 1.3–1.4 miles from Namba. Worth looking at a map and recent reviews rather than taking the number at face value.",
        "Japan transport fares are current published prices (JR, Nankai, Keihan, Kintetsu); the taxi-bookend figures on the Osaka → Tokyo leg are estimates, not quotes.",
        "The DVO → KIX leg is the booked Cebu Pacific fare: ₱12,358 per person, converted at ₱58 = $1. The IND → DVO, HND → IND, and HND → DVO fares are quoted prices from live searches, not yet ticketed — the Delta home leg was quoted in yen (¥287,660) and converted at ¥155 = $1.",
        "Excluded from every total: Japan's ~10% accommodation tax (varies by city/hotel), meals outside included breakfasts, and activity/entrance fees.",
        "The Kensington reference comparison stays ground-only, since that quote also excluded airfare.",
      ],
    },
  },
  flights: {
    us: {
      label: "From the USA — David (IND → Davao, home from Haneda)",
      traveler: "David",
      pax: 1,
      preference: "Fewest stops out · Premium Select home · open-jaw",
      options: [
        {
          name: "Alaska/PAL out via Seattle · Delta Premium Select home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy out · Premium Select home",
          fare: 3000,
          note: "Out Oct 22 on AS500 (IND 18:12) then PR125 SEA→MNL, landing DVO Oct 24 — 27h 58m, ~$1,200. Home Nov 8 on DL120/DL1456 HND 17:20 → MSP → IND 17:55, ¥287,660 ≈ $1,800",
          current: true,
        },
        {
          name: "Same routing, Delta Main Cabin home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy",
          fare: 2100,
          note: "Identical outbound; economy instead of Premium Select on the 14h 40m run home — home leg is an ESTIMATE",
        },
        {
          name: "Same routing, Delta One home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy out · Delta One home",
          fare: 4600,
          note: "Lie-flat on the Pacific crossing home — home leg is an ESTIMATE",
        },
      ],
    },
    ph: {
      label: "From the Philippines — partner (already in Davao)",
      traveler: "Partner",
      pax: 1,
      preference: "Home leg only · fewest stops",
      options: [
        {
          name: "Philippine Airlines home via Manila",
          route: "(already home in Davao) · HND → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 500,
          note: "Nov 8: PR421 HND 15:25 → MNL 19:45, then PR2825 MNL 23:20 → DVO 01:10+1. Quoted from $460; budgeted at $500",
          current: true,
        },
        {
          name: "Cebu Pacific home via Manila",
          route: "(already home in Davao) · NRT → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 360,
          note: "Budget carrier out of Narita — cheaper, but a Narita departure adds ~an hour to the airport run — ESTIMATE",
        },
        {
          name: "ANA / PAL home via Manila (Premium Economy)",
          route: "(already home in Davao) · HND → MNL → DVO",
          stops: 1,
          cabin: "Premium Economy",
          fare: 620,
          note: "Best cabin on the Tokyo–Manila sector — ESTIMATE",
        },
      ],
    },
    ord: {
      label: "USA — Chicago (ORD)",
      traveler: "Traveler",
      pax: 1,
      preset: true, // available in the dropdown; not part of the default split
      preference: "Fewest stops into Davao, home from Tokyo",
      options: [
        {
          name: "Philippine Airlines via Manila",
          route: "ORD → MNL → DVO · HND → ORD",
          stops: 1,
          cabin: "Economy",
          fare: 1520,
          note: "PAL's ORD–MNL nonstop, then the Manila–Davao hop; home nonstop from Haneda — ESTIMATE",
          current: true,
        },
        {
          name: "ANA via Tokyo & Manila",
          route: "ORD → HND → MNL → DVO · HND → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1580,
          note: "ANA's ORD–HND nonstop both directions, Manila connection into Davao — ESTIMATE",
        },
        {
          name: "Korean Air via Incheon",
          route: "ORD → ICN → MNL → DVO · HND → ICN → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1490,
          note: "Incheon hub; usually the cheapest of the one-alliance options — ESTIMATE",
        },
      ],
    },
  },
  hotels: {
    davao: {
      baseNights: 7,
      label: "Davao",
      header: "Davao — family time (not planned here)",
      options: [
        {
          name: "Staying with family",
          rate: 0,
          rating: "—",
          note: "The week in Malita with her family — no lodging cost · current pick",
          current: true,
        },
        {
          name: "Seda Abreeza Davao",
          rate: 95,
          rating: "8.7",
          note: "Mall-attached city hotel, Deluxe room — ESTIMATE, not a locked quote",
        },
        {
          name: "Dusit Thani Residence Davao",
          rate: 120,
          rating: "8.8",
          note: "Apartment-style suites near Lanang, pool — ESTIMATE",
        },
        {
          name: "Marco Polo Davao",
          rate: 110,
          rating: "8.5",
          note: "Downtown, closest to Bankerohan and the old city — ESTIMATE",
        },
      ],
    },
    osaka: {
      baseNights: 4,
      label: "Osaka",
      header: "Osaka — Namba",
      options: [
        {
          name: "Citadines Namba Osaka",
          rate: 197,
          rating: "9.1",
          note: "Deluxe Twin (entire studio), no breakfast, Namba · Nov 1–5 · re-quoted 2026-08-09 at $197/night for Nov 1–6 ($984 for those 5 nights, 10% off). Four-night stay still uses that nightly figure and has not been re-quoted · current pick",
          current: true,
        },
        {
          name: "Citadines Namba Osaka — breakfast included",
          rate: 223,
          rating: "9.1",
          note: "Same Deluxe Twin with the buffet · re-quoted 2026-08-09 for Nov 1–6: $1,117 for those 5 nights ($223/night). The stay is now 4 nights, not re-quoted",
        },
        {
          name: "Fairfield by Marriott Osaka Namba",
          rate: 164,
          rating: "8.8",
          note: "King Room, no breakfast, Namba — NOT re-quoted for the new dates",
        },
        {
          name: "Hotel Forza Osaka Namba",
          rate: 150,
          rating: "8.8",
          note: "Standard Double, no breakfast, Namba — NOT re-quoted for the new dates",
        },
        {
          name: "Henn na Hotel Express Osaka Namba Nipponbashi",
          rate: 109,
          rating: "8.7",
          note: "Budget, breakfast included, Namba/Nipponbashi — NOT re-quoted for the new dates",
        },
        {
          name: "MAIDO — Doyanen Hotels",
          rate: 30,
          rating: "7.2",
          note: "Standard Twin, private bathroom, Nishinari Ward · re-quoted 2026-08-09 for Nov 1–6: $149 for the 5 nights. 1.3 mi to Namba Station — read the Nishinari note below before booking",
        },
        {
          name: "OKINI — Doyanen Hotels",
          rate: 28,
          rating: "7.4",
          note: "Superior Twin, private bathroom, Nishinari Ward · re-quoted 2026-08-09 for Nov 1–6: $139 for the 5 nights — the cheapest private twin that clears 7.0. Additional charges may apply at the property",
        },
      ],
    },
    tokyo: {
      baseNights: 3,
      label: "Tokyo",
      header: "Tokyo — Shibuya",
      options: [
        {
          name: "Tokyu Stay Shibuya",
          rate: 0,
          rating: "—",
          // rate 0 + unpriced: no sourced quote. Not a free stay.
          unpriced: true,
          note: "Nov 5–8, Shibuya · booked stay. No nightly rate in the trip notes, so this line is $0 and is not in the total. That $0 is a placeholder, not a free room",
          current: true,
        },
        {
          name: "HOTEL 1899 TOKYO",
          rate: 229,
          rating: "9.3",
          note: "Shimbashi, tea-themed · bookable for Nov 6–8 as of 2026-08-09 ($458 for those two nights). Not the booked stay, and not re-checked for a Nov 5 arrival",
        },
        {
          name: "OMO5 Tokyo Gotanda",
          rate: 229,
          rating: "8.9",
          note: "King Room w/ breakfast — the original pick, but SOLD OUT Nov 6–8 on Booking.com as of 2026-08-09. Try Hoshino Resorts direct before writing it off",
        },
        {
          name: "Mitsui Garden Hotel Gotanda",
          rate: 219,
          rating: "8.6",
          note: "Station-adjacent, no breakfast — also SOLD OUT Nov 6–8 on Booking.com as of 2026-08-09",
        },
        {
          name: "Miyako City Tokyo Takanawa",
          rate: 187,
          rating: "8.8",
          note: "Shinagawa — NOT re-checked for the new dates",
        },
        {
          name: "Shinagawa Tobu Hotel",
          rate: 167,
          rating: "8.1",
          note: "Shinagawa, plain business hotel — NOT re-checked for the new dates",
        },
        {
          name: "APA Hotel Shinagawa Togoshi Ekimae",
          rate: 119,
          rating: "8.2",
          note: "Budget, 1 stop from Gotanda — NOT re-checked for the new dates",
        },
        {
          name: "FLEXSTAY INN Nakanobu",
          rate: 86,
          rating: "7.2",
          note: "Twin room, private bathroom, Shinagawa Ward · re-quoted 2026-08-09 for Nov 6–8: $172 for the two nights, free cancellation, no prepayment. Nakanobu is two stops from Gotanda — the best-placed cheap bed of the lot",
        },
        {
          name: "Tokyo Inn",
          rate: 82,
          rating: "7.5",
          note: "Small Double, private bathroom, Ota Ward · re-quoted 2026-08-09 for Nov 6–8: $164 for the two nights, free cancellation — the cheapest private room that clears 7.0, but 2.8 mi out from Shinagawa",
        },
      ],
    },
  },
  transport: {
    legs: [
      {
        id: "airport-arrive",
        role: "arrival", // renders before the first stop
        routeName: "<strong>Davao (DVO)</strong> → Malita",
        note: "(the ~2.5–3 hr run south, both adults: <b>$70</b>)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 70, scale: "person" },
      },
      {
        id: "d-o",
        from: "davao",
        to: "osaka",
        routeName: "Davao → <strong>Osaka</strong>",
        note: "(DVO → KIX via Manila on Cebu Pacific, Nov 1 — booked at ₱12,358/person ≈ $213, both adults <b>$426</b>; plus the Nankai into Namba, <b>$18</b> fixed)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 426, scale: "person" }, // booked DVO→KIX, 2-adult total: ₱12,358 pp at ₱58 = $1
        fixed: { cost: 18, scale: "person" }, // Nankai KIX→Namba, researched
      },
      {
        id: "o-t",
        from: "osaka",
        to: "tokyo",
        routeName:
          "Osaka → <strong>Tokyo</strong>, Nozomi 80, 8:45 AM to 11:15 AM, Green Car, booked",
        note: "(booked Green Car. The <b>$190</b> line is the researched ordinary reserved seat, ¥14,720/person, not the Green Car price, which is not in the trip notes. Bookend fares were quoted for a Shimbashi hotel and are not re-quoted for Shibuya.)",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "ot",
        modeControl: "otmode",
        modes: {
          public: { label: "Subway + Yamanote", scale: "person" },
          private: { label: "Taxi both ends", scale: "vehicle" },
        },
        // bookends only: Namba↔Shin-Osaka + Tokyo Station↔the Tokyo hotel.
        // Public is the published IC fare researched for a Shimbashi hotel;
        // not re-quoted for the Shibuya stay.
        cost: { public: 8, private: 45 },
        fixed: { cost: 190, scale: "person" }, // ordinary reserved-seat Nozomi, not the booked Green Car fare
      },
      {
        id: "nara",
        // Second side trip, same shape as the Kyoto one — see the comment there.
        routeName: "Osaka ⇄ <strong>Nara</strong> (day trip)",
        note: "(round trip, both adults: <b>$18</b> fixed — Kintetsu Nara Line, Osaka-Namba → Kintetsu-Nara, ¥680 each way per person)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 18, scale: "person" },
      },
      {
        id: "daytrip",
        // No role: it's a cost-only side trip, not an inter-stop move, so it's
        // never placed in the route body (no from/to, no arrival/departure/
        // optional role) — but role:"cost" would also drop it from the generic
        // budget breakdown (engine.js only "folds" a cost-role leg into
        // another leg's row via Japan-specific logic this data intentionally
        // bypasses), so it stays unset and gets its own breakdown line.
        // Known display wrinkle: side-trip legs render after the route's LAST
        // stop (Tokyo) even though both of ours run out of Osaka. The itinerary
        // tab places them correctly, on the Osaka days that carry the move.
        routeName: "Osaka ⇄ <strong>Kyoto</strong> (day trip)",
        note: "(round trip, both adults: <b>$17</b> fixed — Midosuji subway Namba → Yodoyabashi, then Keihan Main Line express → Gion-Shijo)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 17, scale: "person" },
      },
      {
        id: "minoh",
        // Side trip out of Namba on Nov 4. Fare was not in the trip notes.
        routeName: "Namba ⇄ <strong>Katsuo-ji</strong> (Minoh)",
        note: "(about an hour each way. Fare not sourced, so this line is <b>$0</b> until a real train-plus-bus figure is entered)",
        toggles: [],
        routeDetail: true,
        flat: { cost: 0, scale: "person" },
      },
      {
        id: "depart",
        role: "departure", // renders after the last stop
        routeName: "<strong>Tokyo</strong> → Haneda Airport",
        note: "(public <b>$7</b> and private <b>$56</b> are the old Shimbashi → Haneda figures, not re-quoted from Shibuya)",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "dep",
        modeControl: "depmode",
        modes: {
          public: { label: "Train", scale: "person" },
          private: { label: "Private car", scale: "vehicle" },
        },
        cost: { public: 7, private: 56 }, // old Shimbashi↔Haneda fare (~¥510 pp); not a Shibuya quote
      },
    ],
  },
  activities: {
    osaka: [
      {
        day: 11, // Nov 3
        title: "Nara and Kyoto private tour",
        options: [
          {
            name: "Private tour, booked (Klook)",
            cost: 0,
            // cost 0 + booked: no sourced price. Not a free tour.
            booked: true,
            current: true,
            note: "Booked on Klook. No price in the trip notes, so this line is $0 and is not in the total. That $0 is a placeholder, not a free tour",
          },
        ],
      },
      {
        day: 13, // Nov 5
        title: "Send the suitcases ahead to Tokyo (takkyūbin)",
        options: [
          {
            name: "Carry them on the Nozomi (free)",
            cost: 0,
            note: "Fine if the cases fit the overhead rack. Anything over 160cm total needs a free oversized-baggage seat reservation, and those rows sell out",
            current: true,
          },
          {
            name: "Yamato TA-Q-BIN, hotel desk to hotel desk",
            cost: 32,
            note: "¥2,300–2,630 per large case (140–160 size band) at ¥155 = $1, so ~$32 for two. Hand them to the Osaka hotel desk on the morning of the 5th. Next-day service, so they reach the Tokyo hotel on the 6th, the day after check-in",
          },
          {
            name: "Yamato, three cases",
            cost: 48,
            note: "Same service, third bag — worth it if you shopped hard in Osaka",
          },
        ],
      },
    ],
    tokyo: [],
  },
  routeDetail: {
    "airport-arrive": {
      label: "Davao airport (DVO) → Malita",
      steps: [
        "Immigration + bags at DVO (small airport, usually quick)",
        "~2.5–3 hrs south by road to Malita",
      ],
      total: "~3 hrs",
      note: "David lands Oct 24 after departing IND on Oct 22 — 28 hours of flying and the dateline eats a day on top.",
    },
    "d-o": {
      label: "Davao (DVO) → Kansai (KIX) → Namba — booked, Nov 1",
      steps: [
        "5J 966: DVO 07:05 → MNL 09:05 (Cebu Pacific)",
        "4h 05m on the ground at Manila Terminal 3",
        "5J 828: MNL 13:10 → KIX Terminal 1 18:20",
        "Immigration + customs at KIX",
        "~40 min: Nankai from Kansai Airport station to Namba — in the hotel around 19:40",
      ],
      total: "~13 hrs gate to hotel (07:05 Davao → ~19:40 Namba)",
      note: "The 07:05 push means leaving the house around 05:00. Both legs are Cebu Pacific, so bags check through — but the Manila layover is in Terminal 3 for both. Have Visit Japan Web done before you land. KIX has a Yamato counter on T1's 4th floor if you'd rather send the cases to the hotel than wrestle them onto the Nankai, but same-day delivery cuts off at 12:30 and you land at 18:20 — yours would arrive the next day, and the Nankai is direct anyway.",
    },
    "o-t": {
      label: "Namba → Shin-Osaka → Tokyo → Shibuya (Nozomi 80, booked)",
      steps: [
        "Send the cases from the hotel desk before leaving. Next-day delivery, so they arrive the day after you do.",
        "Leave around 7:45 AM. Walk to Namba Station; check the walk the night before.",
        "Osaka Metro Midosuji Line north toward Shin-Osaka (Senri-Chuo direction). No transfer, about 15 minutes.",
        "JR Shinkansen gates at Shin-Osaka. Nozomi 80 departs 8:45 AM and arrives Tokyo at 11:15 AM. Green Car, booked.",
        "JR Yamanote Line to Shibuya, about 25 minutes, then a walk to Tokyu Stay Shibuya.",
      ],
      total: "Leave around 7:45 AM for the 8:45 AM train; into the hotel early afternoon",
      note: "The $190 ledger fare is the researched ordinary reserved seat (¥14,720 per person), not the booked Green Car price, which was not in the trip notes. The local bookend fares were researched for a Shimbashi hotel and have not been re-quoted for Shibuya.",
    },
    nara: {
      label: "Namba ⇄ Nara (day trip)",
      steps: [
        "Kintetsu Nara Line rapid express, Osaka-Namba → Kintetsu-Nara",
        "~40 min each way, direct — no transfer",
        "Kintetsu-Nara Station is a 5-minute walk from the deer park",
      ],
      total: "~80 min round-trip transit",
      note: "Nov 3 is the booked private tour, not this self-guided ride. The fare stays in the ledger because it is a sourced train price and the tour price was not available to replace it. The Kintetsu station drops you far closer to Todai-ji than JR Nara does.",
    },
    daytrip: {
      label: "Namba ⇄ Kyoto (day trip)",
      steps: [
        "Midosuji subway Namba → Yodoyabashi, then Keihan Main Line express → Gion-Shijo (Kyoto)",
        "40–55 min each way depending on route",
      ],
      total: "~80–110 min round-trip transit (40–55 min each way)",
      note: "Nov 3 is the booked private tour, not this self-guided ride. The fare stays in the ledger because it is a sourced train price and the tour price was not available to replace it.",
    },
    minoh: {
      label: "Namba ⇄ Katsuo-ji (Minoh), then Umeda",
      steps: [
        "Namba to Umeda on the Midosuji Line, then the Hankyu line toward the Minoh area, or the Midosuji / Kita-Osaka Kyuko line to Senri-Chuo, then a bus or taxi up to Katsuo-ji. About an hour each way. Confirm the route and the bus times that morning.",
        "Coming back, get off at Umeda for Grand Front, then the Midosuji Line back to Namba.",
      ],
      total: "about an hour each way, plus the Umeda stop",
      note: "Check Katsuo-ji's hours before leaving. The fare is not in the ledger.",
    },
    depart: {
      label: "Shibuya → Haneda",
      steps: [
        "Walk to Shibuya Station.",
        "JR Yamanote to Hamamatsucho, then the Tokyo Monorail to Haneda. Or Yamanote to Shinagawa, then Keikyu to Haneda.",
      ],
      total: "Re-check the connection the day before. The old ~35 min figure was from Shimbashi.",
      note: "David's Haneda flight (DL120) leaves at 5:20 PM. The partner's Haneda departure time is still to confirm. The $7 public fare is the researched Shimbashi → Haneda price (~¥510 per person), not a Shibuya quote. The $56 private-car figure is the old Shimbashi estimate.",
    },
  },
  itinPool: {
    davao: [
      {
        id: "d-arrive",
        travel: true,
        cityTag: "Davao — arrive",
        sun: "17:41",
        move: "airport-arrive",
        lodging: "davao",
        title: "Arrive in Davao",
        rows: [
          {
            tag: "Note",
            kind: "soft",
            detail:
              "Land Oct 24 after departing IND on the 22nd. The week here is family time in Malita — not planned in this document, and not costed beyond the airport run and the flights.",
          },
        ],
      },
    ],
    osaka: [
      {
        id: "o-arrive",
        travel: true,
        cityTag: "Davao → Osaka",
        sun: "17:01",
        move: "d-o",
        lodging: "osaka",
        title: "Osaka — neon, canals, and street food",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Dotonbori &amp; Namba after dark.",
            detail:
              "The Glico running man, the canal lights, the roar of the arcades — a loud, easy first night that asks nothing of you.",
          },
          {
            tag: "Table",
            kind: "table",
            lead: "A street-food crawl.",
            detail:
              "Takoyaki, okonomiyaki, kushikatsu — Osaka is Japan's kitchen and this is the point of landing here first. Graze, don't sit down.",
          },
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Add mobile Suica to Apple Wallet, activate the Japan eSIM, hit a konbini. Drop bags at the hotel first — Namba is minutes from the action, so an early check-in isn't critical.",
          },
        ],
        ask: "5J 828 lands KIX at 18:20, so the hotel happens around 19:40 — that's a Dotonbori night, but not a sit-down-dinner-reservation night.",
      },
      {
        id: "o-city",
        cityTag: "Osaka",
        sun: "17:00",
        title: "Castle, market, and the neon streets",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Osaka Castle.",
            detail:
              "The park and the keep in the morning. The keep is a reconstruction; the moats and the grounds are the walk.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Kuromon Market.",
            detail:
              "Osaka's covered market. Grilled scallops, tuna, fruit you eat standing up.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Namba and Dotonbori.",
            detail:
              "The canal, the Glico sign, and a graze through the street food rather than one sit-down meal.",
          },
        ],
      },
      {
        id: "o-tour",
        travel: true,
        cityTag: "Day trip — Nara and Kyoto",
        sun: "16:59",
        title: "A private day through Nara and Kyoto",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Nara and Kyoto with a guide.",
            detail:
              "One private day for both cities. Culture Day, so expect crowds. Start early.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "Ask the front desk how sending the cases ahead works, including the cutoff and the paperwork, so the next two mornings are settled.",
          },
        ],
      },
      {
        id: "o-minoh",
        travel: true,
        cityTag: "Osaka",
        sun: "16:57",
        move: "minoh",
        title: "Katsuo-ji in the morning, Umeda on the way back",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Katsuo-ji in Minoh.",
            detail:
              "A mountain-temple morning. Check the hours before you leave, and allow about an hour each way.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Grand Front and Umeda after.",
            detail: "Shopping on the way back down, then the evening back in Namba.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "Ask the front desk this evening about sending the cases ahead, and what time they need them in the morning.",
          },
        ],
      },
    ],
    tokyo: [
      {
        id: "t-arrive",
        travel: true,
        cityTag: "Osaka → Tokyo",
        sun: "16:40",
        move: "o-t",
        lodging: "tokyo",
        title: "Into Tokyo, and a first evening in Shibuya",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shibuya once the bags are down.",
            detail:
              "The crossing after dark is enough for a first evening. Three nights here, so nothing else needs planning tonight.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "Send the cases from the front desk before you leave in the morning. Delivery is next-day, so they arrive the day after you do. Keep an overnight bag.",
          },
          {
            tag: "Window",
            kind: "soft",
            detail:
              "Fuji shows on the right, about forty minutes along, when the weather is clear.",
          },
        ],
      },
      {
        id: "t-shibuya",
        cityTag: "Tokyo",
        sun: "16:39",
        title: "Meiji, Harajuku, and Shibuya at sunset",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Meiji Jingu and Yoyogi.",
            detail:
              "The shrine forest first, then the park next door, while the morning is still quiet.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Takeshita Street and Omotesando.",
            detail: "The crowded lane, then the tree-lined avenue. Walk between them.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Miyashita Park, the scramble, and Pokemon Center.",
            detail:
              "The park and the crossing, then Pokemon Center on the 6th floor of Shibuya PARCO.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Shibuya Sky at sunset is still to book. Dinner in Dogenzaka or Maruyama-cho.",
          },
        ],
      },
      {
        id: "t-ginza",
        cityTag: "Tokyo",
        sun: "16:40",
        title: "Shinjuku Gyoen, then Ginza",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shinjuku Gyoen, and lunch.",
            detail:
              "A long, calm garden, just starting to turn in early November. Eat nearby before heading on.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Ginza in the afternoon.",
            detail: "Uniqlo's Ginza flagship, Muji, and a walk down Chuo-dori.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Hie Shrine on the way back.",
            detail: "A short stop, then dinner in Ginza or back in Shibuya.",
          },
        ],
        fuller:
          "<b>Gotokuji</b> if the day still has room. The temple is optional, not on the main loop.",
      },
    ],
  },
  itinDepart: {
    id: "depart",
    travel: true,
    move: "depart",
    sun: "16:38",
    cityTag: "Tokyo → home",
    title: "Haneda, and two different ways home",
    rows: [
      {
        tag: "Note",
        kind: "soft",
        detail:
          "The run to Haneda starts at Shibuya Station. Re-check the connection the day before and leave a buffer. Tax-free refunds are processed at the airport under the Nov 2026 rules; keep receipts and passports handy. David's flight leaves Haneda at 5:20 PM. His partner flies back to Davao; that departure time is still to confirm.",
      },
    ],
  },
  visaPlan: {
    // The Philippine days are family time, not an itinerary. They appear here
    // only because the MOFA sheet numbers every day of the trip; the Japan
    // entries below are the ones that matter to it.
    "d-arrive": "In the Philippines — arrive Davao (DVO); not yet in Japan.",
    "davao-leisure-1": "In the Philippines — Davao; family visit.",
    "davao-leisure-2": "In the Philippines — Davao; family visit.",
    "davao-leisure-3": "In the Philippines — Davao; family visit.",
    "davao-leisure-4": "In the Philippines — Davao; family visit.",
    "davao-leisure-5": "In the Philippines — Davao; family visit.",
    "davao-leisure-6": "In the Philippines — Davao; family visit.",
    "davao-leisure-7": "In the Philippines — Davao; depart for Japan.",
    "o-arrive":
      "Enter Japan at Kansai International Airport (KIX); travel to Osaka (Namba); Dotonbori & Namba.",
    "o-city": "Osaka Castle; Kuromon Ichiba Market; Namba and Dotonbori.",
    "o-tour": "Private day tour of Nara and Kyoto.",
    "o-minoh": "Katsuo-ji temple (Minoh); Grand Front Osaka and Umeda.",
    "t-arrive": "Travel to Tokyo by Shinkansen; Shibuya district.",
    "t-shibuya":
      "Meiji Jingu; Yoyogi Park; Harajuku and Omotesando; Shibuya.",
    "t-ginza": "Shinjuku Gyoen; Ginza; Hie Shrine.",
    depart: "Depart Japan from Haneda International Airport (HND).",
  },
};
