// TRIP data-model validation (issue #5), shared by the browser engine and the
// Node gate (scripts/validate-trip.mjs). Pure — no window/document — so a
// generated trip can be checked before it ever renders.
//
// Checks the key alignment a generated trip can silently get wrong: every
// route/optional city has hotels + itinerary days, the flex-night default is a
// real city, and every itinPool day's lodging/move references an existing
// hotel/leg. Returns a list of human-readable problems (empty = valid).
//
// Also checks that the numbers make sense (TRIP-INTAKE-PLAN prerequisite 2):
// dates parse and order, per-city base nights sum to nights − 1 (the flex
// night — load-bearing, see AI-RESEARCH-PLAN), and every rate/fare/cost is a
// finite number inside a sane range. Key alignment alone let a generated trip
// through with a ¥→$ misread; these fail it loudly instead.

// Caps are deliberately tight (~2× the current data maxima). A legitimate
// outlier — a $3k/night lodge, a business-class fare — bumps the cap here,
// visibly, rather than shipping unreviewed. All values are 2-adult totals.
export const COST_CAPS = {
  nightlyRate: 2500, // hotels[city].options[].rate, per night
  flightFare: 8000, // flights[journey].options[].fare, per person round trip
  itemCost: 5000, // activity options, transport legs, rental per-day/one-time
};

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

  // ── semantic checks: do the numbers make sense ─────────────────────
  const inRange = (v, cap) => Number.isFinite(v) && v >= 0 && v <= cap;

  // Dates: the engine reads meta.dates.arrive at init and the itinerary walks
  // forward from it, so unparseable or reversed dates corrupt every day label.
  const dates = meta.dates || {};
  const isIso = (s) =>
    typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
  let tripNights = null;
  if (!isIso(dates.arrive) || !isIso(dates.depart)) {
    problems.push("meta.dates.arrive/depart must be ISO dates (YYYY-MM-DD)");
  } else {
    const diff = Math.round((Date.parse(dates.depart) - Date.parse(dates.arrive)) / 86400000);
    if (diff <= 0)
      problems.push(`meta.dates: depart ${dates.depart} must be after arrive ${dates.arrive}`);
    else tripNights = diff;
    if (typeof dates.nights !== "number")
      problems.push("meta.dates.nights must be a number");
    else if (tripNights != null && dates.nights !== tripNights)
      problems.push(
        `meta.dates.nights is ${dates.nights} but ${dates.arrive} → ${dates.depart} spans ${tripNights} nights`,
      );
  }

  // The flex-night identity: per-city base nights must sum to nights − 1 so
  // the movable night lands. Documented load-bearing; previously unvalidated.
  let baseSum = 0;
  let baseKnown = true;
  route.concat(optional).forEach((c) => {
    const h = hotels[c];
    if (!h) {
      baseKnown = false; // missing hotel already reported above
      return;
    }
    if (typeof h.baseNights !== "number" || h.baseNights < 0) {
      problems.push(`city "${c}" hotels.baseNights must be a number ≥ 0`);
      baseKnown = false;
    } else {
      baseSum += h.baseNights;
    }
  });
  if (baseKnown && tripNights != null && baseSum !== tripNights - 1)
    problems.push(
      `per-city baseNights sum to ${baseSum} but must equal nights − 1 = ${tripNights - 1} (the flex night)`,
    );

  // Hotel tiers: the engine indexes options[selectedIndex].rate directly, and
  // a misread rate corrupts the lodging subtotal (and the tax buffer on it).
  route.concat(optional).forEach((c) => {
    const h = hotels[c];
    if (!h) return;
    if (!Array.isArray(h.options) || h.options.length === 0) {
      problems.push(`city "${c}" hotels.options must be a non-empty array`);
      return;
    }
    h.options.forEach((o, i) => {
      if (!o || !inRange(o.rate, COST_CAPS.nightlyRate))
        problems.push(
          `city "${c}" hotel option ${i} rate ${JSON.stringify(o && o.rate)} must be a number in $0–$${COST_CAPS.nightlyRate}/night`,
        );
    });
  });

  Object.keys((trip && trip.flights) || {}).forEach((k) => {
    ((trip.flights[k] && trip.flights[k].options) || []).forEach((o, i) => {
      if (!o || !inRange(o.fare, COST_CAPS.flightFare))
        problems.push(
          `flights.${k} option ${i} fare ${JSON.stringify(o && o.fare)} must be a number in $0–$${COST_CAPS.flightFare}`,
        );
    });
  });

  Object.keys((trip && trip.activities) || {}).forEach((city) => {
    (trip.activities[city] || []).forEach((act, ai) => {
      ((act && act.options) || []).forEach((o, oi) => {
        if (!o || !inRange(o.cost, COST_CAPS.itemCost))
          problems.push(
            `activities.${city}[${ai}] option ${oi} cost ${JSON.stringify(o && o.cost)} must be a number in $0–$${COST_CAPS.itemCost}`,
          );
      });
    });
  });

  // Transport: every numeric leaf of a leg's cost shape (terminal grids, mode
  // maps, flat, fixed) plus the rental, all against the same per-item cap.
  const transport = (trip && trip.transport) || {};
  (transport.legs || []).forEach((leg) => {
    if (!leg) return;
    const id = leg.id || "(unnamed)";
    const leaves = [];
    const collect = (v) =>
      v && typeof v === "object" ? Object.values(v).forEach(collect) : leaves.push(v);
    if (leg.cost != null) collect(leg.cost);
    if (leg.flat) leaves.push(leg.flat.cost);
    if (leg.fixed) leaves.push(leg.fixed.cost);
    leaves.forEach((v) => {
      if (!inRange(v, COST_CAPS.itemCost))
        problems.push(
          `transport leg "${id}" cost ${JSON.stringify(v)} must be a number in $0–$${COST_CAPS.itemCost}`,
        );
    });
  });
  if (transport.rental) {
    ["perDay", "oneTime"].forEach((k) => {
      const v = transport.rental[k];
      if (v != null && !inRange(v, COST_CAPS.itemCost))
        problems.push(
          `transport.rental.${k} ${JSON.stringify(v)} must be a number in $0–$${COST_CAPS.itemCost}`,
        );
    });
  }

  return problems;
}
