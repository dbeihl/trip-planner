// The pure budget core — every dollar figure recalc() shows is computed here.
// No window/document: the engine passes the current selections in (its DOM
// reader becomes the `sel` callback); tests pass plain lookups. The
// load-bearing invariants live in this module:
//   - every authored cost is a 2-adult total; partyFactors() scales it
//   - hotel rooms sleep 2 (rooms), private transfers seat 4 (vehicleFactor)
//   - the lodging tax buffer inflates lodging only (a planning margin)

export const FUEL_PRICE = 5; // premium fuel, top-end $/gal
export const DRIVE_PAD = 1.15; // +15% over route miles for real-world detours

// Hotel rooms cap at 2 adults each (per the researched room types), so party
// size determines rooms needed, not a per-head multiplier. Public transit
// fares are genuinely per-passenger (linear with N). Private transfers are a
// flat per-vehicle rate — this models 1 vehicle covering up to 4 people, a
// simplifying assumption. A missing/zero count falls back to the 2-adult base.
export function partyFactors(rawN) {
  const N = Math.max(1, rawN || 2);
  return {
    N,
    rooms: Math.ceil(N / 2),
    personFactor: N / 2,
    vehicleFactor: Math.ceil(N / 4),
  };
}

// Per-leg cost, computed generically by leg shape (2D terminal grid, mode
// toggle, flat, or fixed add-on). `when` gates the optional-detour legs, so a
// per-vehicle drive leg or per-person rail segment sums the same way.
// `sel(name)` supplies the chosen value of a named control.
export function legCost(leg, { osakaMode, personFactor, vehicleFactor, sel }) {
  const scaleOf = (scale) =>
    scale === "vehicle" ? vehicleFactor : personFactor;
  if (leg.when === "osaka" && !osakaMode) return 0;
  if (leg.when === "noOsaka" && osakaMode) return 0;
  let c = 0;
  if (leg.terminals) {
    const t = sel(leg.terminalControl);
    const m = sel(leg.modeControl);
    c = leg.cost[t][m] * scaleOf(leg.modes[m].scale);
  } else if (leg.modes) {
    const m = sel(leg.modeControl);
    c = leg.cost[m] * scaleOf(leg.modes[m].scale);
  } else if (leg.flat) {
    c = leg.flat.cost * scaleOf(leg.flat.scale);
  }
  if (leg.fixed) c += leg.fixed.cost * scaleOf(leg.fixed.scale);
  return c;
}

export function legCostMap(legs, ctx) {
  const out = {};
  legs.forEach((l) => {
    out[l.id] = legCost(l, ctx);
  });
  return out;
}

// Self-drive: round-trip fuel (padded for detours) plus en-route overnights.
// One vehicle seats up to 4 (vehicleFactor); a bigger party drives a second
// car and burns proportionally more fuel — mirroring en-route lodging
// (× rooms) and the private-transfer scaling.
export function driveCosts({ miles, mpg, driveDays, stopRate, rooms, vehicleFactor }) {
  const gallons = (miles * 2 * DRIVE_PAD) / mpg; // round trip + detour padding
  const fuelCost = Math.round(gallons * FUEL_PRICE * vehicleFactor);
  const enrouteNights = (driveDays - 1) * 2; // an overnight each way per extra day
  const enrouteLodging = enrouteNights * stopRate * rooms;
  return { fuelCost, enrouteNights, enrouteLodging, total: fuelCost + enrouteLodging };
}

// Flying: each active origin's chosen fare × its passengers (fares are
// per-person round trips).
export function flightsTotal(origins) {
  return origins.reduce((s, o) => s + o.sel.fare * o.pax, 0);
}

// Optional rental car (road trips): perDay × total nights × vehicles. Not
// renting still keeps the one-time extras (fuel + park pass) — you drove your
// own car; only the per-day rental drops.
export function rentalTotal(rental, renting, totalNights, vehicleFactor) {
  if (!rental) return 0;
  return (
    (renting
      ? rental.perDay * totalNights + (rental.oneTime || 0)
      : rental.oneTime || 0) * vehicleFactor
  );
}

// Lodging per city: chosen tier rate (per room-night) × nights × rooms.
export function cityLodging(tierRates, nights, rooms) {
  const out = {};
  Object.keys(tierRates).forEach((c) => {
    out[c] = tierRates[c] * (nights[c] || 0) * rooms;
  });
  return out;
}

// The roll-up. Transport is all legs plus the rental; the tax buffer inflates
// the lodging subtotal only; activities are authored as 2-adult totals and
// scale by personFactor; flights ride on top of the ground total.
export function budgetTotals({
  legCosts,
  rental,
  hotelCost,
  lodgingTaxBuffer,
  activitiesTotal,
  personFactor,
  flightsCost,
}) {
  const transportTotal =
    Object.values(legCosts).reduce((s, c) => s + c, 0) + rental;
  const hotelSubtotal = Object.values(hotelCost).reduce((s, v) => s + v, 0);
  const lodgingBuffer = hotelSubtotal * (lodgingTaxBuffer - 1);
  const hotelTotal = hotelSubtotal + lodgingBuffer;
  const activitiesCost = activitiesTotal * personFactor;
  const groundTotal = transportTotal + hotelTotal + activitiesCost;
  return {
    transportTotal,
    hotelSubtotal,
    lodgingBuffer,
    hotelTotal,
    activitiesCost,
    groundTotal,
    grand: groundTotal + flightsCost,
  };
}
