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
        "A week with family in Malita first, then the trip proper: in through Kansai to a four-night Osaka base, neon and street food, with day trips out to Kyoto, Nara, and Minoh, and a Shinkansen up to Tokyo for the last three nights in Shibuya.",
    },
    route: ["davao", "osaka", "tokyo"], // ordered city keys
    optionalCities: [],
    flexNightDefault: "davao", // which flex-night option is selected by default
    dates: { arrive: "2026-10-24", depart: "2026-11-08", nights: 15 },
    travelers: {
      count: 2,
      note: "2 adults. David flies IND to Davao on Oct 22 (PAL, confirmation ZCZ3LH, lands Oct 24). Both fly DVO to KIX on Nov 1 (Cebu Pacific, confirmation ORF2PR) and home separately from Haneda on Nov 8 (David, Delta, confirmation JLKKOB; Suzanne, PAL, confirmation ZZ3HQY).",
    },
    currency: "USD",
    reference: {
      total: 9644,
      label: "Kensington Tours quote",
      caveat:
        "Placeholder Nov 7–14 dates and a different trip entirely (Tokyo-first, a Hakone ryokan night, Kyoto as the base, no Osaka, no Davao week); ground-only comparison since Kensington's quote excluded airfare.",
      blurb:
        "Kensington Tours quoted <b>$9,644</b> for a Tokyo-Hakone-Kyoto version of this trip, but for placeholder dates (Nov 7 to 14), the opposite direction of travel, and a route that shares almost nothing with this one: no Osaka base, no Nara, no Davao week, and a Hakone ryokan night that has since been cut. Treat it as a rough order-of-magnitude reference only. The delta above compares ground costs only. Kensington's quote excluded airfare.",
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
        "Pick a hotel tier per stop and a transport mode per leg. Transport fares are live-researched, every airfare is a real quote or a booked ticket, and the Osaka hotel was re-quoted for the actual dates on 2026-08-09. The Tokyo stay is the booked Tokyu Stay Shibuya Shin-Minamiguchi (Nov 5 to 8, Expedia itinerary 72079274902358). Its nightly rate is not in the ledger yet. The total updates as you go.",
      flightsTitle: "Getting there: International flights",
      flightsIntro:
        "David flies IND to Davao (out Oct 22, PAL confirmation ZCZ3LH, in Oct 24). Suzanne is already home in Davao. The two of you fly DVO to KIX together on Nov 1 (Cebu Pacific, confirmation ORF2PR). That leg is booked and priced as a transport leg below, not here. You fly home separately from Haneda on Nov 8: David on Delta (confirmation JLKKOB), Suzanne on PAL (confirmation ZZ3HQY). Pick a routing for each. Fares fold into the grand total.",
      itinTitle: "Osaka &amp; Tokyo: seven nights in Japan",
      itinDek:
        "The Philippine week is family time in Malita and is not planned here. It appears only so the dates and the costs line up. Japan is the trip: four nights based in Namba, with Osaka's kitchen at the door and day trips out to Kyoto, Nara, and Minoh, then the Nozomi up to Tokyo for three nights in Shibuya. One base, one move, no packing and repacking.",
      finePrint: [
        "Citadines Namba Osaka is booked: confirmation 10472SG207787, One-Bedroom Double, check-in Nov 1 at 3 PM, check-out Nov 5 at 11 AM. The ledger still uses the 2026-08-09 Booking.com re-quote of $197/night (Deluxe Twin, Nov 1 to 6, $984 for those 5 nights). That quote is not a receipt for the confirmed reservation. Tokyu Stay Shibuya Shin-Minamiguchi is booked for Nov 5 to 8 (Expedia itinerary 72079274902358) and has no sourced nightly rate, so the Tokyo lodging line is $0 until one is entered. That $0 is a placeholder, not a free room. Alternatives marked \"NOT re-quoted\" still carry their old figures and will move.",
        "Nozomi 80 (Shin-Osaka 8:45 AM, platform 27, to Tokyo 11:15 AM, Green Car 9, seats 2-C and 2-D, Klook order 5591827293) is booked. The $190 line is the previously researched ordinary reserved-seat fare (¥14,720 per person), not the Green Car price. The Nara and Kyoto private tour is booked on Klook. The confirmation is in Suzanne's email, forwarded to David. Its price is not in the ledger, so that line is $0 until a figure is entered. Shibuya Sky is booked (Klook YNP871804, Nov 6 at 10:00 AM, US$35.98 for 2) and that price is in the total.",
        "The Philippine week is not costed beyond the airport transfer and the flights. It is family time in Malita, staying with family at no lodging cost. The Davao hotel tiers are rough estimates kept only as a fallback.",
        "Every alternative hotel holds a private double/twin room with its own bathroom and a ≥7.0 guest rating. The floor was 8.0 until 2026-08-09; the sub-8.0 tiers were added deliberately to show what the trip costs at the bottom of the range.",
        "The cheapest Osaka tiers (OKINI, MAIDO) are in Nishinari Ward, Osaka's cheapest district and the reason the rate is $28 rather than $200. It is a working-class area around Shin-Imamiya with a rough reputation and genuinely good transport, 1.3 to 1.4 miles from Namba. Worth looking at a map and recent reviews rather than taking the number at face value.",
        "Japan transport fares are current published prices (JR, Nankai, Keihan, Kintetsu); the taxi-bookend figures on the Osaka → Tokyo leg are estimates, not quotes.",
        "The DVO to KIX leg is the booked Cebu Pacific ticket, confirmation ORF2PR: ₱12,358 per person, converted at ₱58 = $1. David's IND to DVO ticket is PAL confirmation ZCZ3LH. His Haneda ticket is Delta confirmation JLKKOB. Suzanne's Haneda ticket is PAL confirmation ZZ3HQY. The dollar lines for those three are the earlier researched fares (the Delta home leg was quoted in yen at ¥287,660, converted at ¥155 = $1), not receipt totals.",
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
          name: "PAL out via Seattle · Delta Premium Select home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "PAL out · Premium Select home",
          fare: 3000,
          note: "Booked. Out Oct 22: PAL, IND to SEA to MNL to DVO, confirmation ZCZ3LH, David only. Home Nov 8: DL120 HND 5:20 PM to MSP 1:25 PM (Premium Select), then DL1456 MSP 3:16 PM to IND 5:55 PM, confirmation JLKKOB. The $3,000 line is the earlier researched fare, not a receipt total.",
          current: true,
        },
        {
          name: "Same routing, Delta Main Cabin home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy",
          fare: 2100,
          note: "Identical outbound. Economy instead of Premium Select on the 14h 40m run home. The home leg is an ESTIMATE.",
        },
        {
          name: "Same routing, Delta One home",
          route: "IND → SEA → MNL → DVO · HND → MSP → IND",
          stops: 2,
          cabin: "Economy out · Delta One home",
          fare: 4600,
          note: "Lie-flat on the Pacific crossing home. The home leg is an ESTIMATE.",
        },
      ],
    },
    ph: {
      label: "From the Philippines — Suzanne (already in Davao)",
      traveler: "Suzanne",
      pax: 1,
      preference: "Home leg only · fewest stops",
      options: [
        {
          name: "Philippine Airlines home via Manila",
          route: "(already home in Davao) · HND T3 → MNL T1 → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 500,
          note: "Booked. Confirmation ZZ3HQY. Nov 8: PR421 HND T3 3:25 PM to MNL T1 7:45 PM, then PR2825 MNL T2 11:20 PM to DVO 1:10 AM Nov 9. The $500 line is the earlier budget, not a receipt total.",
          current: true,
        },
        {
          name: "Cebu Pacific home via Manila",
          route: "(already home in Davao) · NRT → MNL → DVO",
          stops: 1,
          cabin: "Economy",
          fare: 360,
          note: "Budget carrier out of Narita. Cheaper, but a Narita departure adds about an hour to the airport run. ESTIMATE.",
        },
        {
          name: "ANA / PAL home via Manila (Premium Economy)",
          route: "(already home in Davao) · HND → MNL → DVO",
          stops: 1,
          cabin: "Premium Economy",
          fare: 620,
          note: "Best cabin on the Tokyo to Manila sector. ESTIMATE.",
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
          note: "PAL's ORD to MNL nonstop, then the Manila to Davao hop. Home nonstop from Haneda. ESTIMATE.",
          current: true,
        },
        {
          name: "ANA via Tokyo & Manila",
          route: "ORD → HND → MNL → DVO · HND → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1580,
          note: "ANA's ORD to HND nonstop both directions, Manila connection into Davao. ESTIMATE.",
        },
        {
          name: "Korean Air via Incheon",
          route: "ORD → ICN → MNL → DVO · HND → ICN → ORD",
          stops: 2,
          cabin: "Economy",
          fare: 1490,
          note: "Incheon hub. Usually the cheapest of the one-alliance options. ESTIMATE.",
        },
      ],
    },
  },
  hotels: {
    davao: {
      baseNights: 7,
      label: "Davao",
      header: "Davao, family time (not planned here)",
      options: [
        {
          name: "Staying with family",
          rate: 0,
          rating: "n/a",
          note: "Staying with family in Davao. No hotel needed.",
          current: true,
        },
        {
          name: "Seda Abreeza Davao",
          rate: 95,
          rating: "8.7",
          note: "Mall-attached city hotel, Deluxe room. ESTIMATE, not a locked quote",
        },
        {
          name: "Dusit Thani Residence Davao",
          rate: 120,
          rating: "8.8",
          note: "Apartment-style suites near Lanang, pool. ESTIMATE",
        },
        {
          name: "Marco Polo Davao",
          rate: 110,
          rating: "8.5",
          note: "Downtown, closest to Bankerohan and the old city. ESTIMATE",
        },
      ],
    },
    osaka: {
      baseNights: 4,
      label: "Osaka",
      header: "Osaka, Namba",
      options: [
        {
          name: "Citadines Namba Osaka",
          rate: 197,
          rating: "9.1",
          note: "Booked. Confirmation 10472SG207787. One-Bedroom Double. 3-5-25 Nippombashi, Naniwa-ku, Osaka 556-0005. Tel +81 6 6695 7150. Check-in Nov 1 at 3 PM, check-out Nov 5 at 11 AM. The $197/night line is the 2026-08-09 Booking.com re-quote for a Deluxe Twin over Nov 1 to 6 ($984 for those 5 nights). It is not a receipt for this reservation.",
          current: true,
        },
        {
          name: "Citadines Namba Osaka, breakfast included",
          rate: 223,
          rating: "9.1",
          note: "Same Deluxe Twin with the buffet · re-quoted 2026-08-09 for Nov 1–6: $1,117 for those 5 nights ($223/night). The stay is now 4 nights, not re-quoted",
        },
        {
          name: "Fairfield by Marriott Osaka Namba",
          rate: 164,
          rating: "8.8",
          note: "King Room, no breakfast, Namba. NOT re-quoted for the new dates",
        },
        {
          name: "Hotel Forza Osaka Namba",
          rate: 150,
          rating: "8.8",
          note: "Standard Double, no breakfast, Namba. NOT re-quoted for the new dates",
        },
        {
          name: "Henn na Hotel Express Osaka Namba Nipponbashi",
          rate: 109,
          rating: "8.7",
          note: "Budget, breakfast included, Namba/Nipponbashi. NOT re-quoted for the new dates",
        },
        {
          name: "MAIDO, Doyanen Hotels",
          rate: 30,
          rating: "7.2",
          note: "Standard Twin, private bathroom, Nishinari Ward. Re-quoted 2026-08-09 for Nov 1 to 6: $149 for the 5 nights. 1.3 mi to Namba Station. Read the Nishinari note below before booking.",
        },
        {
          name: "OKINI, Doyanen Hotels",
          rate: 28,
          rating: "7.4",
          note: "Superior Twin, private bathroom, Nishinari Ward. Re-quoted 2026-08-09 for Nov 1 to 6: $139 for the 5 nights. The cheapest private twin that clears 7.0. Additional charges may apply at the property.",
        },
      ],
    },
    tokyo: {
      baseNights: 3,
      label: "Tokyo",
      header: "Tokyo, Shibuya",
      options: [
        {
          name: "Tokyu Stay Shibuya Shin-Minamiguchi",
          rate: 0,
          rating: "n/a",
          // rate 0 + unpriced: no sourced quote. Not a free stay.
          unpriced: true,
          note: "Booked. Expedia itinerary 72079274902358. Nov 5 to 8. 3-26-21 Shibuya, Shibuya-ku, Tokyo 150-0002. Tel +81 3 5466 0109. Check-in 3 PM. No nightly rate in the trip notes, so this line is $0 and is not in the total. That $0 is a placeholder, not a free room.",
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
          note: "King Room with breakfast. The original pick, but sold out Nov 6 to 8 on Booking.com as of 2026-08-09. Try Hoshino Resorts direct before writing it off.",
        },
        {
          name: "Mitsui Garden Hotel Gotanda",
          rate: 219,
          rating: "8.6",
          note: "Station-adjacent, no breakfast. Also sold out Nov 6 to 8 on Booking.com as of 2026-08-09.",
        },
        {
          name: "Miyako City Tokyo Takanawa",
          rate: 187,
          rating: "8.8",
          note: "Shinagawa. NOT re-checked for the new dates",
        },
        {
          name: "Shinagawa Tobu Hotel",
          rate: 167,
          rating: "8.1",
          note: "Shinagawa, plain business hotel. NOT re-checked for the new dates",
        },
        {
          name: "APA Hotel Shinagawa Togoshi Ekimae",
          rate: 119,
          rating: "8.2",
          note: "Budget, 1 stop from Gotanda. NOT re-checked for the new dates",
        },
        {
          name: "FLEXSTAY INN Nakanobu",
          rate: 86,
          rating: "7.2",
          note: "Twin room, private bathroom, Shinagawa Ward. Re-quoted 2026-08-09 for Nov 6 to 8: $172 for the two nights, free cancellation, no prepayment. Nakanobu is two stops from Gotanda. The best-placed cheap bed of the lot.",
        },
        {
          name: "Tokyo Inn",
          rate: 82,
          rating: "7.5",
          note: "Small Double, private bathroom, Ota Ward. Re-quoted 2026-08-09 for Nov 6 to 8: $164 for the two nights, free cancellation. The cheapest private room that clears 7.0, but 2.8 mi out from Shinagawa.",
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
        note: "(Cebu Pacific confirmation ORF2PR. 5J 966 DVO 7:05 AM to MNL T3 9:05 AM, seats 23C and 23D. 5J 828 MNL T3 1:10 PM to KIX T1 6:20 PM, seats 45G and 45H. Booked at ₱12,358 per person, both adults <b>$426</b>, plus the Nankai into Namba, <b>$18</b> fixed)",
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
          "Osaka → <strong>Tokyo</strong>, Nozomi 80, platform 27, 8:45 AM to 11:15 AM, Green Car 9, booked",
        note: "(Klook order 5591827293. Green Car 9, seats 2-C and 2-D. The <b>$190</b> line is the researched ordinary reserved seat, ¥14,720 per person, not the Green Car price, which is not in the trip notes. Bookend fares were quoted for a Shimbashi hotel and are not re-quoted for Shibuya.)",
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
        note: "(round trip, both adults: <b>$18</b> fixed. Kintetsu Nara Line, Osaka-Namba to Kintetsu-Nara, ¥680 each way per person)",
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
        note: "(round trip, both adults: <b>$17</b> fixed. Midosuji subway Namba to Yodoyabashi, then Keihan Main Line express to Gion-Shijo)",
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
        note: "(First choice is the train via Shinagawa, then Keikyu to Terminal 3. Backup is the Airport Limousine Bus from Shibuya Mark City, 1,300 yen per adult. The public <b>$7</b> and private <b>$56</b> lines are the old Shimbashi to Haneda figures, not a Shibuya quote.)",
        toggles: ["mode"],
        routeDetail: true,
        ctrlPrefix: "dep",
        modeControl: "depmode",
        modes: {
          public: { label: "Train via Shinagawa", scale: "person" },
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
            note: "Booked on Klook on Oct 8. The confirmation is in Suzanne's email, forwarded to David. No price in the trip notes, so this line is $0 and is not in the total. That $0 is a placeholder, not a free tour.",
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
            note: "The confirmed plan is to ship the cases before the Nozomi. Carrying them is the free fallback if they fit the overhead rack. Anything over 160 cm total needs a free oversized-baggage seat reservation, and those rows sell out.",
          },
          {
            name: "Yamato TA-Q-BIN, hotel desk to hotel desk",
            cost: 32,
            note: "Researched estimate for shipping before the Nozomi, not a receipt. ¥2,300 to ¥2,630 per large case (140 to 160 size band) at ¥155 = $1, so about $32 for two. Ask the hotel desk for the cutoff, the cost, and the forms. Next-day service would reach the Tokyo hotel on Nov 6.",
          },
          {
            name: "Yamato, three cases",
            cost: 48,
            note: "Same researched estimate, third bag, if you shopped hard in Osaka.",
          },
        ],
      },
    ],
    tokyo: [
      {
        day: 14, // Nov 6
        title: "Shibuya Sky",
        options: [
          {
            name: "Klook YNP871804, 10:00 AM entry for 2",
            cost: 35.98,
            booked: true,
            current: true,
            note: "Booked on Klook Oct 24. Reference YNP871804. Nov 6, 10:00 AM entry for 2 adults, US$35.98, including a free Japan eSIM (NNF122783). Be at 14F within 20 minutes of the entry time, with passports. Free cancellation until 11:59 PM on Nov 5.",
          },
        ],
      },
    ],
  },
  routeDetail: {
    "airport-arrive": {
      label: "Davao airport (DVO) → Malita",
      steps: [
        "Immigration + bags at DVO (small airport, usually quick)",
        "~2.5–3 hrs south by road to Malita",
      ],
      total: "~3 hrs",
      note: "David lands Oct 24 after departing IND on Oct 22 (PAL confirmation ZCZ3LH). The dateline eats a day on top of the flights.",
    },
    "d-o": {
      label: "Davao (DVO) → Kansai (KIX) → Namba, booked, Nov 1",
      steps: [
        "5J 966: DVO 7:05 AM to MNL Terminal 3 9:05 AM. Seats 23C and 23D. Cebu Pacific, confirmation ORF2PR.",
        "Layover at Manila Terminal 3.",
        "5J 828: MNL Terminal 3 1:10 PM to KIX Terminal 1 6:20 PM. Seats 45G and 45H.",
        "Immigration and customs at KIX.",
        "About 40 minutes: Nankai from Kansai Airport station to Namba.",
      ],
      total: "DVO 7:05 AM to KIX 6:20 PM, then the Nankai to Namba.",
      note: "Booked together, confirmation ORF2PR. Both legs use Manila Terminal 3. Have Visit Japan Web done before you land.",
    },
    "o-t": {
      label: "Namba → Shin-Osaka → Tokyo, then Tokyo PC, then Shibuya (Nozomi 80, booked)",
      steps: [
        "Ship the bags before the Nozomi. Leave Citadines by about 7:45 AM. Walk to Namba Station and the Osaka Metro Midosuji Line (red line). Check the walking time from the hotel the night before.",
        "Midosuji Line north toward Shin-Osaka (Senri-Chuo direction). No transfer, about 15 minutes.",
        "At Shin-Osaka, follow signs to the JR Shinkansen gates, show the Klook tickets (order 5591827293), and go to platform 27 for Nozomi 80 at 8:45 AM. Green Car 9, seats 2-C and 2-D. Arrive Tokyo Station at 11:15 AM.",
        "Tokyo PC first, since the bags are already shipped. JR Yamanote or Keihin-Tohoku from Tokyo Station to Akihabara, about 4 minutes, then the Electric Town (Denki-gai) exit and a walk of about 2 minutes.",
        "Tokyo PC is on 1F of Tokyo Radio Department Store (東京ラジオデパート), 1-10-11 Sotokanda, Chiyoda-ku, Tokyo 101-0021. Open daily about 11 AM to 7 PM. Tel +81 3 6206 4099. <a href=\"https://www.tokyopc.jp/\">tokyopc.jp</a>",
        "After Tokyo PC, JR Yamanote from Akihabara toward Shibuya (outer loop via Tokyo and Shinagawa, or the other way via Ueno and Shinjuku). About 25 to 35 minutes, then a walk of about 5 minutes from the south / new south exit to Tokyu Stay Shibuya Shin-Minamiguchi. Check-in is 3 PM.",
      ],
      total: "Leave around 7:45 AM for the 8:45 AM train. Tokyo PC after the 11:15 AM arrival, then the hotel.",
      note: "Klook order 5591827293. The $190 ledger fare is the researched ordinary reserved seat (¥14,720 per person), not the booked Green Car price, which was not in the trip notes. The local bookend fares were researched for a Shimbashi hotel and have not been re-quoted for Shibuya.",
    },
    nara: {
      label: "Namba ⇄ Nara (day trip)",
      steps: [
        "Kintetsu Nara Line rapid express, Osaka-Namba → Kintetsu-Nara",
        "About 40 minutes each way, direct, no transfer",
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
      label: "Shibuya → Haneda Terminal 3",
      steps: [
        "Aim to be at Haneda Terminal 3 by about 12:30 PM. Suzanne's PR421 leaves at 3:25 PM (confirmation ZZ3HQY). David's DL120 leaves at 5:20 PM (confirmation JLKKOB). Both leave from Terminal 3.",
        "First choice: train via Shinagawa. JR Yamanote Line from Shibuya (outer loop toward Shinagawa) to Shinagawa, about 13 minutes, then the Keikyu Airport Line (airport-bound Limited Express or Airport Express) to Haneda Airport Terminal 3, about 15 minutes. About 40 minutes door to door. Leave the hotel by about 11:15 AM so there is cushion for stairs and crowds at Shinagawa with bags.",
        "Backup: Airport Limousine Bus from Shibuya Mark City (Shibuya Excel Hotel Tokyu), 1,300 yen per adult, no transfer. The 10:20 AM bus is scheduled to reach Terminal 3 at 11:37 AM. The 11:25 AM bus, scheduled to reach Terminal 3 at 12:42 PM, is the later backup. Traffic can stretch the ride to 80 minutes.",
      ],
      total: "About 40 minutes by train. Leave the hotel by about 11:15 AM for a 12:30 PM terminal target.",
      note: "Suica or PASMO IC cards work on JR, Tokyo Metro, Tokyu, Keikyu, and the airport bus. The $7 public fare is the researched Shimbashi to Haneda price (about ¥510 per person), not a Shibuya quote. The $56 private-car figure is the old Shimbashi estimate.",
    },
  },
  itinPool: {
    davao: [
      {
        id: "d-arrive",
        travel: true,
        cityTag: "Davao, arrive",
        sun: "17:41",
        move: "airport-arrive",
        lodging: "davao",
        title: "Arrive in Davao",
        rows: [
          {
            tag: "Note",
            kind: "soft",
            detail:
              "Land Oct 24 after departing IND on the 22nd (PAL, confirmation ZCZ3LH). The week here is family time in Malita. It is not planned in this document, and it is not costed beyond the airport run and the flights.",
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
        title: "Settle in",
        rows: [
          {
            tag: "Settle",
            kind: "soft",
            detail:
              "Settle in, then a convenience-store run. The flight lands in the evening, so this day stays light.",
          },
        ],
        ask: "5J 828 lands at KIX Terminal 1 at 6:20 PM (seats 45G and 45H, confirmation ORF2PR). Check-in at the Osaka hotel is 3 PM.",
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
        cityTag: "Day trip: Nara and Kyoto",
        sun: "16:59",
        title: "A private day through Nara and Kyoto",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Nara and Kyoto with a guide.",
            detail:
              "Private tour, booked on Klook on Oct 8. The confirmation is in Suzanne's email, forwarded to David. Culture Day holiday, so expect crowds. Start early.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "Before or after the tour, ask the Citadines front desk how luggage shipping to Tokyu Stay Shibuya works: cutoff time, cost, and forms. That settles the plan for Nov 4 and Nov 5.",
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
              "A mountain-temple morning, about an hour each way from Namba by train plus bus or taxi. Check the hours and the bus schedule before you leave. Namba to Umeda on the Midosuji Line, then the Hankyu line toward the Minoh area, or the Midosuji / Kita-Osaka Kyuko line to Senri-Chuo and a bus or taxi up to the temple. Confirm the route and the bus times that morning.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Grand Front and Umeda after.",
            detail:
              "On the way back, get off at Umeda for Grand Front, then the Midosuji Line back to Namba.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "This evening, ask the Citadines desk about forwarding the luggage to Tokyu Stay Shibuya.",
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
        title: "Tokyo PC, then check in at Shibuya",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Tokyo PC in Akihabara.",
            detail:
              "After the Nozomi arrives at Tokyo Station at 11:15 AM, go to Tokyo PC first. The bags are already shipped. JR Yamanote or Keihin-Tohoku from Tokyo Station to Akihabara, about 4 minutes, then the Electric Town exit and a walk of about 2 minutes. Tokyo PC is on 1F of Tokyo Radio Department Store (東京ラジオデパート), 1-10-11 Sotokanda, Chiyoda-ku, Tokyo 101-0021. Open daily about 11 AM to 7 PM. Tel +81 3 6206 4099. <a href=\"https://www.tokyopc.jp/\">tokyopc.jp</a>",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Check in at Tokyu Stay Shibuya.",
            detail:
              "After Tokyo PC, JR Yamanote from Akihabara toward Shibuya, about 25 to 35 minutes, then a walk of about 5 minutes from the south / new south exit. Check-in is 3 PM at Tokyu Stay Shibuya Shin-Minamiguchi.",
          },
          {
            tag: "Luggage",
            kind: "soft",
            flag: "luggage",
            detail:
              "Ship the cases before the Nozomi. Leave Citadines by about 7:45 AM. Keep an overnight bag.",
          },
        ],
      },
      {
        id: "t-shibuya",
        cityTag: "Tokyo",
        sun: "16:39",
        title: "Shibuya Sky at 10:00 AM, then Harajuku",
        rows: [
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Shibuya Sky, 10:00 AM.",
            detail:
              "Booked on Klook, reference YNP871804, 10:00 AM entry for 2. Be at 14F by about 10:00 with passports. Shibuya Scramble Square is above Shibuya Station, a walk of about 5 to 10 minutes from the hotel.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Meiji Jingu, Yoyogi, and Takeshita Street.",
            detail:
              "After Shibuya Sky. JR Yamanote from Shibuya to Harajuku (inner loop toward Shinjuku), one stop, about 3 minutes, or a walk of about 20 minutes. Meiji Jingu, Yoyogi Park, and Takeshita Street are all walkable from Harajuku Station.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Omotesando, Miyashita Park, the scramble, and Pokemon Center.",
            detail:
              "Takeshita Street to Omotesando is a walk of about 5 minutes. Omotesando to Miyashita Park is about 15 minutes down Meiji-dori. Miyashita Park, the scramble crossing, and Pokemon Center Shibuya (PARCO 6F) are a 5 to 10 minute walk apart.",
          },
          {
            tag: "Evening",
            kind: "soft",
            detail:
              "Dinner in Dogenzaka or Maruyama-cho, then back to the hotel on foot, about 10 to 15 minutes.",
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
              "JR Yamanote from Shibuya to Shinjuku (inner loop), about 7 minutes, then a walk of about 10 minutes from the south / new south exit to the Shinjuku Gate. Lunch nearby. Gotokuji is optional, not on this loop.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Ginza in the afternoon.",
            detail:
              "Tokyo Metro Marunouchi Line from Shinjuku-gyoemmae toward Ikebukuro, direct to Ginza, about 16 minutes. Uniqlo's Ginza flagship, Muji, and a walk down Chuo-dori.",
          },
          {
            tag: "Anchor",
            kind: "anchor",
            lead: "Hie Shrine on the way back.",
            detail:
              "Tokyo Metro Ginza Line from Ginza to Tameike-Sanno, about 5 minutes, then a walk of about 3 minutes. Back to Shibuya on the Ginza Line from Tameike-Sanno, about 12 minutes. Dinner in Ginza or Shibuya. For dinner in Ginza, ride back to Ginza first.",
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
          "Aim to be at Haneda Terminal 3 by about 12:30 PM. Suzanne's PR421 leaves at 3:25 PM and David's DL120 leaves at 5:20 PM, both from Terminal 3. First choice: train via Shinagawa. JR Yamanote from Shibuya (outer loop toward Shinagawa) to Shinagawa, about 13 minutes, then the Keikyu Airport Line to Haneda Airport Terminal 3, about 15 minutes. About 40 minutes door to door. Leave the hotel by about 11:15 AM. Backup: Airport Limousine Bus from Shibuya Mark City (Shibuya Excel Hotel Tokyu), 1,300 yen per adult. The 10:20 AM bus is scheduled to reach Terminal 3 at 11:37 AM. The 11:25 AM bus, at 12:42 PM, is the later backup. Suica or PASMO works on JR, Tokyo Metro, Tokyu, Keikyu, and the airport bus.",
      },
    ],
  },
  visaPlan: {
    // The Philippine days are family time, not an itinerary. They appear here
    // only because the MOFA sheet numbers every day of the trip; the Japan
    // entries below are the ones that matter to it.
    "d-arrive": "In the Philippines. Arrive Davao (DVO). Not yet in Japan.",
    "davao-leisure-1": "In the Philippines. Davao. Family visit.",
    "davao-leisure-2": "In the Philippines. Davao. Family visit.",
    "davao-leisure-3": "In the Philippines. Davao. Family visit.",
    "davao-leisure-4": "In the Philippines. Davao. Family visit.",
    "davao-leisure-5": "In the Philippines. Davao. Family visit.",
    "davao-leisure-6": "In the Philippines. Davao. Family visit.",
    "davao-leisure-7": "In the Philippines. Davao. Depart for Japan.",
    "o-arrive":
      "Enter Japan at Kansai International Airport (KIX); travel to Osaka (Namba); settle in.",
    "o-city": "Osaka Castle; Kuromon Ichiba Market; Namba and Dotonbori.",
    "o-tour": "Private day tour of Nara and Kyoto.",
    "o-minoh": "Katsuo-ji temple (Minoh); Grand Front Osaka and Umeda.",
    "t-arrive":
      "Travel to Tokyo by Shinkansen (Nozomi 80); Tokyo PC (Akihabara, Tokyo Radio Department Store 1F); check in at Shibuya.",
    "t-shibuya":
      "Shibuya Sky (10:00 AM); Meiji Jingu; Yoyogi Park; Takeshita Street; Omotesando; Miyashita Park; Shibuya scramble; Pokemon Center Shibuya PARCO.",
    "t-ginza":
      "Shinjuku Gyoen; Ginza (Uniqlo, Muji, Chuo-dori); Hie Shrine. Gotokuji optional.",
    depart:
      "Depart Japan from Haneda Airport Terminal 3 (HND). Train via Shinagawa, then Keikyu.",
  },
};
