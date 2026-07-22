// TRIP data-model validation (issue #5), shared by the browser engine and the
// Node gate (scripts/validate-trip.mjs). Pure — no window/document — so a
// generated trip can be checked before it ever renders.
//
// Checks the key alignment a generated trip can silently get wrong: every
// route/optional city has hotels + itinerary days, the flex-night default is a
// real city, and every itinPool day's lodging/move references an existing
// hotel/leg. Returns a list of human-readable problems (empty = valid).
export function validateTrip(trip) {
  const problems = [];
  const meta = (trip && trip.meta) || {};
  const hotels = (trip && trip.hotels) || {};
  const itinPool = (trip && trip.itinPool) || {};
  const legIds = (((trip && trip.transport) || {}).legs || []).map((l) => l.id);
  const route = Array.isArray(meta.route) ? meta.route : [];
  const optional = Array.isArray(meta.optionalCities) ? meta.optionalCities : [];
  // Required arrays: recalc()/renderRouteBody()/nightMin() index these directly,
  // so a missing one passes the old checks then throws an uncaught TypeError.
  if (!Array.isArray(meta.route)) problems.push("meta.route must be an array");
  if (!Array.isArray(meta.optionalCities))
    problems.push("meta.optionalCities must be an array (may be empty)");
  // lodgingTaxBuffer multiplies the lodging subtotal; a missing/non-numeric
  // value turns the whole grand total into $NaN with no other symptom.
  if (typeof meta.lodgingTaxBuffer !== "number" || !(meta.lodgingTaxBuffer >= 1))
    problems.push("meta.lodgingTaxBuffer must be a number ≥ 1");
  route.concat(optional).forEach((c) => {
    if (!hotels[c]) problems.push(`city "${c}" has no hotels entry`);
    if (!itinPool[c]) problems.push(`city "${c}" has no itinerary (itinPool) entry`);
  });
  // Every transport leg must have a cost shape the engine can read, and every
  // scale must be a real enum value — a typo silently bills a private transfer
  // per-person (half cost) or contributes NaN to the transport total.
  (((trip && trip.transport) || {}).legs || []).forEach((leg) => {
    const id = leg && leg.id ? leg.id : "(unnamed)";
    if (!leg || (!leg.terminals && !leg.modes && !leg.flat))
      problems.push(`transport leg "${id}" has no cost shape (needs terminals, modes, or flat)`);
    const scales = [];
    if (leg && leg.modes)
      Object.values(leg.modes).forEach((mo) => scales.push(mo && mo.scale));
    if (leg && leg.flat) scales.push(leg.flat.scale);
    if (leg && leg.fixed) scales.push(leg.fixed.scale);
    scales.forEach((sc) => {
      if (sc !== "person" && sc !== "vehicle")
        problems.push(`transport leg "${id}" has invalid scale ${JSON.stringify(sc)} (must be "person" or "vehicle")`);
    });
    if (leg && leg.flat && typeof leg.flat.cost !== "number")
      problems.push(`transport leg "${id}" flat.cost must be a number`);
  });
  if (!route.includes(meta.flexNightDefault))
    problems.push(`flexNightDefault "${meta.flexNightDefault}" is not a route city`);
  Object.keys(itinPool).forEach((city) => {
    itinPool[city].forEach((day) => {
      if (day.lodging && !hotels[day.lodging])
        problems.push(`itinPool ${day.id}: lodging "${day.lodging}" has no hotel`);
      if (day.move && !legIds.includes(day.move))
        problems.push(`itinPool ${day.id}: move "${day.move}" is not a transport leg`);
    });
  });
  return problems;
}
