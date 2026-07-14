# Yellowstone & Grand Teton — road-trip research + build spec

Researched by 5 + 2 sonnet agents (Jul 2026). All figures are **2026 planning estimates** — verify live before booking. This is the documented source for the Yellowstone `TRIP` dataset and the road-trip controls the planner needs.

## The road-trip trip type — new controls (vs. the Japan model)

A national-park road trip has decision axes the Japan (flights + trains + hotels) model never had. These must be **user-selectable controls**, not baked-in:

1. **Start + end dates** — a real date input; the planner derives nights and season. (Season drives crowds, prices, and what's open.)
2. **Lodging style: hotels / camping / mix** — swaps each stop's options between hotel/lodge tiers and campground tiers (or lets the user mix per stop).
3. **Hiking intensity: relaxed / active / custom** — like Japan's pace, but selects each day's activities between easy (boardwalks, overlooks, scenic drives) and signature hikes.
4. **Rent a car or not** — toggles the rental-car cost (SUV or campervan) on/off.

The engine already supports: generic route body, generic leg cost sum, optional `reference`, and an optional `rental` cost model. Still needed before Yellowstone renders: generalize `recalc()`'s per-leg **labels/costs**, `moveData`, and the **breakdown rows** off the hardcoded Japan leg ids (`airport`/`th`/`hk`/`final`) — move that per-leg display text into leg data, the same way route names were moved.

## Proposed route (driving loop)

Fly into **Jackson Hole (JAC)**, out of **Bozeman (BZN)** (open-jaw avoids a 5-hr backtrack). ~8 nights, base + 1 flex.

| Stop                  | Base nights | Highlights                                                                |
| --------------------- | ----------- | ------------------------------------------------------------------------- |
| Jackson / Grand Teton | 2           | Jenny Lake, Cascade Canyon, Snake River float, Mormon Row                 |
| Old Faithful          | 2           | Upper Geyser Basin, Grand Prismatic, Fairy Falls                          |
| Canyon / Lake         | 2           | Grand Canyon of the Yellowstone, Hayden Valley wildlife, Yellowstone Lake |
| Mammoth / Lamar       | 1           | Lamar Valley wolves/bison, Mammoth terraces → out via Bozeman             |

Flex +1 night default → Grand Teton. Optional add-on → West Yellowstone.

## Flights (round-trip / open-jaw, per person)

**David (IND):** Delta via SLC → JAC ~$480 · via MSP → BZN ~$400 · via ATL → JAC ~$510 · via DTW → BZN ~$430.
**Partner (Manila/Davao):** PAL+Delta MNL–NRT–SEA–BZN ~$1,650 · Korean+Delta MNL–ICN–SLC–JAC ~$1,750 · United+ANA via NRT ~$1,700 · from Davao +~$200 (extra domestic hop). All 2 stops.

## Lodging — HOTELS (per night, double)

**Grand Teton / Jackson:** Colter Bay Log Cabins $250 · Signal Mountain $320 · Jackson Lake Lodge $500 · Jenny Lake Lodge (all-incl.) $1,400. Town: Cowboy Village/Elk Country $210 · chain hotels $320 · The Wort $550 · Rusty Parrot $650 · Four Seasons $2,600.
**Old Faithful:** Lodge Frontier Cabin $165 · Inn Old House (shared bath) $260 · Inn East/West wing (private) $400 · Inn premium/suite $550.
**Canyon:** Western Cabin $260 · Lodge standard $370 · premium $460.
**Lake:** Lake Lodge Pioneer Cabin $230 · Lake Hotel frontier cabin $260 · Hotel lake-view $450 · suite $700.
**Mammoth:** Hotel shared bath $175 · frontier/hot-tub cabin $250 · Hotel private bath $320.
**Gateways:** West Yellowstone $150–420 · Gardiner $145–400.

## Lodging — CAMPING (per night)

**Grand Teton:** Jenny Lake $26 (tent, ≤14ft, recreation.gov, books in minutes) · Signal Mountain $31 · Gros Ventre $59 ($78 electric; least crowded) · Colter Bay $61 (RV park $125 full hookup; camper cabin $105) · Headwaters/Flagg Ranch $59 (RV hookup $73–122; between the parks).
**Yellowstone:** Mammoth $25 (only first-come option off-season) · Madison / Canyon / Bridge Bay / Grant Village ~$38–45 (recreation.gov via YNP Lodges for 2026) · Fishing Bridge RV $97 (hard-sided only, full hookups). **Norris + Pebble Creek CLOSED for 2026 — exclude.**
**Gateway RV parks:** Jackson ~$85 · West Yellowstone ~$75.
**Campervan/RV rental:** Jackson ~$175–300/day (4x4 Sprinters at top end) · Bozeman ~$75–150 (trailers) to ~$200–300 (outfitted vans). Book 4–6 mo ahead for summer; cheaper May/June/Sep.

## Driving logistics

**Rental SUV** ~$130/day at JAC (Sep peak; range $100–180) · **fuel** ~$140 for the loop · **park pass** $70 (note: international-visitor surcharge coming in 2026).

**Drive segments:** Jackson→Jenny Lake 20mi/35m · Jenny Lake→Old Faithful 83mi/135m (via South Entrance) · Old Faithful→Grand Prismatic 8mi/15m · →Canyon 32mi/50m · Canyon→Lake 17mi/25m · Lake→Lamar 46mi/75m · Lamar→Mammoth 28mi/50m · Mammoth→West Yellowstone 49mi/75m. (Mammoth→Bozeman ~80mi/90m for the fly-out.)

## Activities — by intensity

**Relaxed (easy, <2 hr, free w/ entry unless noted):**

- _Grand Teton:_ Jenny Lake scenic drive + String Lake; Jenny Lake shuttle boat ($20) + Hidden Falls; Mormon Row + Schwabacher Landing; Colter Bay Lakeshore Trail.
- _Old Faithful:_ Old Faithful + Upper Geyser Basin boardwalk; Grand Prismatic overlook boardwalk; Black Sand Basin; Firehole Lake Drive.
- _Canyon/Lake:_ North/South Rim overlooks (Artist Point); Hayden Valley wildlife pullouts; West Thumb Geyser Basin; Yellowstone Lake cruise ($25).
- _Lamar/Mammoth:_ Lamar Valley wildlife drive; Mammoth terraces boardwalk; Roosevelt Arch; ranger wolf talk.

**Active (signature hikes):**

- _Grand Teton:_ Cascade Canyon → Lake Solitude (18.6mi/3000ft, boat shortens to ~14) · Delta Lake (8.8mi/2400ft) · Amphitheater/Surprise Lake (9.6mi/3000ft) · Static Peak Divide (16mi/5000ft).
- _Old Faithful:_ Fairy Falls + Twin Buttes Grand Prismatic overlook (5.4mi/250ft) · Mystic Falls loop (4.1mi/700ft) · Lone Star Geyser (4.8mi/100ft).
- _Canyon/Lake:_ Uncle Tom's/rim stairs; Mount Washburn (~6mi/1400ft); Avalanche Peak (~4mi/2100ft, strenuous).
- _Lamar/Mammoth:_ Lamar guided wildlife safari ($275) or Wake-Up-to-Wildlife ($120); Bunsen Peak.

**Paid extras:** Snake River scenic float ~$95 · Jackson Lake cruise ~$45 · Yellowstone Lake fishing charter ~$350 (half-day/boat).

## Rough budget (2 travelers, mid-tier hotels, rented SUV)

Flights ~$2,180 + lodging (8 nts × ~$350) ~$2,800 + rental+fuel+pass ~$1,200 + activities ~$400 ≈ **~$6,500–7,000**. Camping instead of hotels drops lodging to ~$300–500 total (≈ **$3,500–4,000** trip).

## Sources

Flights: kayak, expedia, delta.com, trip.com. Lodging: gtlc.com, yellowstonenationalparklodges.com, nationalparkreservations.com, tripadvisor. Camping: nps.gov, recreation.gov, rvezy, gomoterra, cruiseamerica. Logistics: kayak/enterprise/budget, nps.gov/fees, yellowstone.net mileage. (Full URL list in the workflow journals.)
