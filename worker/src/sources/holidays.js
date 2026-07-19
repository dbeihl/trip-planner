// Public holidays via Nager.Date. Free, no key. Answers "will things be
// closed / unusually crowded that week?" — one fetch per year the window spans.
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 24 * 30; // 30 days — a country's holiday calendar is fixed

// Keep holidays that fall inside [arrive, depart]. ISO date strings compare
// correctly with < / >, so no date math is needed.
export function withinWindow(list, arrive, depart) {
  return list
    .filter((h) => h.date >= arrive && h.date <= depart)
    .map((h) => ({ date: h.date, name: h.localName, en: h.name }));
}

export async function holidays(env, info, ctx) {
  if (!info.country) {
    return { applicable: false, note: "no country for these coordinates" };
  }
  const years = [...new Set([info.arrive.slice(0, 4), info.depart.slice(0, 4)])];
  const all = [];
  let anyCached = false;
  for (const y of years) {
    const params = { year: Number(y), country: info.country };
    const endpoint = `https://date.nager.at/api/v3/PublicHolidays/${y}/${info.country}`;
    const { cached, raw } = await cachedFetch(env, {
      source: "nager", endpoint, params, ttl: TTL,
      trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh,
    });
    anyCached = anyCached || cached;
    all.push(...JSON.parse(raw || "[]"));
  }
  const within = withinWindow(all, info.arrive, info.depart);
  return {
    cached: anyCached,
    country: info.country,
    window: { start: info.arrive, end: info.depart },
    count: within.length,
    holidays: within,
  };
}
