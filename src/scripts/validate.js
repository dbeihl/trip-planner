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
  const route = meta.route || [];
  const optional = meta.optionalCities || [];
  route.concat(optional).forEach((c) => {
    if (!hotels[c]) problems.push(`city "${c}" has no hotels entry`);
    if (!itinPool[c]) problems.push(`city "${c}" has no itinerary (itinPool) entry`);
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
