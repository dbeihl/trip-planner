// "What changed" for a trip: diff the two newest logged pulls per source.
// Diff-on-read — no extra table; the append-only data_pull log (now fed daily
// by the cron in index.js) is the history, and this stays correct across
// missed cron days. Raw stored responses are re-distilled with the same pure
// functions the live sources use.
import { parseAdvisory } from "./sources/advisories.js";
import { withinWindow } from "./sources/holidays.js";
import { distill as distillEvents } from "./sources/events.js";
import { distillDuffel, distillSerpFlights } from "./sources/flights.js";
import { distillSerpHotels } from "./sources/lodging.js";

async function lastTwo(env, slug, source) {
  const rows =
    (
      await env.DB.prepare(
        `SELECT response_json, fetched_at FROM data_pull
           WHERE trip_id = ?1 AND source = ?2 AND status = 'ok'
           ORDER BY fetched_at DESC LIMIT 2`,
      )
        .bind(slug, source)
        .all()
    ).results || [];
  return rows; // [latest, previous?]
}

const parseJson = (s) => {
  try {
    return JSON.parse(s || "null");
  } catch {
    return null;
  }
};

const money = (n) => "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
const arrow = (d) => (d < 0 ? "↓" : "↑");

// Each differ maps (latestRaw, prevRaw) -> a change object or null.
function diffAdvisory(info, latest, prev) {
  if (!info.advisoryMatch) return null;
  const a = parseAdvisory(latest || "", info.advisoryMatch);
  const b = parseAdvisory(prev || "", info.advisoryMatch);
  if (a.level == null || b.level == null || a.level === b.level) return null;
  return {
    source: "state-advisory",
    aspect: "advisory",
    from: b.level,
    to: a.level,
    detail: `travel advisory moved Level ${b.level} → Level ${a.level}${a.category ? " (" + a.category + ")" : ""}`,
  };
}

function diffHolidays(info, latest, prev) {
  const inWin = (raw) => withinWindow(parseJson(raw) || [], info.arrive, info.depart);
  const a = inWin(latest), b = inWin(prev);
  const names = (l) => new Set(l.map((h) => h.en || h.name));
  const added = a.filter((h) => !names(b).has(h.en || h.name));
  if (!added.length) return null;
  return {
    source: "nager",
    aspect: "holidays",
    from: b.length,
    to: a.length,
    detail: `new holiday in your window: ${added.map((h) => h.en).join(", ")}`,
  };
}

function diffEvents(latest, prev) {
  const a = distillEvents(parseJson(latest) || {});
  const b = distillEvents(parseJson(prev) || {});
  const prevNames = new Set(b.map((e) => e.name));
  const added = a.filter((e) => e.name && !prevNames.has(e.name));
  if (!added.length) return null;
  return {
    source: "ticketmaster",
    aspect: "events",
    from: b.length,
    to: a.length,
    detail: `${added.length} new event${added.length === 1 ? "" : "s"}: ${added.slice(0, 3).map((e) => e.name).join(", ")}${added.length > 3 ? "…" : ""}`,
  };
}

function diffNumber(source, aspect, label, a, b) {
  if (a == null || b == null || a === b) return null;
  const d = a - b;
  return { source, aspect, from: b, to: a, detail: `${label} ${arrow(d)} ${money(d)} since the last pull` };
}

export async function computeChanges(env, slug, info) {
  const [adv, hol, evt, duf, serpF, serpH] = await Promise.all(
    ["state-advisory", "nager", "ticketmaster", "duffel", "serpapi-flights", "serpapi-hotels"].map((s) =>
      lastTwo(env, slug, s),
    ),
  );

  const changes = [];
  let lastPull = 0;
  for (const rows of [adv, hol, evt, duf, serpF, serpH]) {
    if (rows[0]) lastPull = Math.max(lastPull, rows[0].fetched_at);
  }

  if (adv.length === 2) {
    const c = diffAdvisory(info, adv[0].response_json, adv[1].response_json);
    if (c) changes.push(c);
  }
  if (hol.length === 2) {
    const c = diffHolidays(info, hol[0].response_json, hol[1].response_json);
    if (c) changes.push(c);
  }
  if (evt.length === 2) {
    const c = diffEvents(evt[0].response_json, evt[1].response_json);
    if (c) changes.push(c);
  }
  // Fares: compare within one provider only (duffel preferred).
  const fares = duf.length === 2 ? duf : serpF.length === 2 ? serpF : null;
  if (fares) {
    const dd = fares === duf ? distillDuffel : distillSerpFlights;
    const c = diffNumber(
      fares === duf ? "duffel" : "serpapi-flights",
      "flights",
      "round-trip fares (2 adults)",
      dd(parseJson(fares[0].response_json) || {}).cheapest_total_2adults,
      dd(parseJson(fares[1].response_json) || {}).cheapest_total_2adults,
    );
    if (c) changes.push(c);
  }
  if (serpH.length === 2) {
    const c = diffNumber(
      "serpapi-hotels",
      "lodging",
      "median nightly rate",
      distillSerpHotels(parseJson(serpH[0].response_json) || {}).nightly_median,
      distillSerpHotels(parseJson(serpH[1].response_json) || {}).nightly_median,
    );
    if (c) changes.push(c);
  }

  return {
    trip: slug,
    checked_at: Math.floor(Date.now() / 1000),
    last_pull_at: lastPull || null,
    changes,
  };
}
