// U.S. State Department travel advisories. Free: the official RSS feed carries
// one item per country titled like "Japan - Level 1: Exercise Normal
// Precautions". We fetch the feed once (cached a day) and pull the matching
// country's threat level (1-4). Domestic US trips skip this.
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 24; // 1 day
const FEED = "https://travel.state.gov/_res/rss/TAsTWs.xml";

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`, "i"));
  return m ? m[1].trim() : null;
}

// Find the advisory item whose title matches one of `terms` (and none of
// `exclude`), and parse its level. Pure — unit-tested against sample RSS.
export function parseAdvisory(xml, terms, exclude = ["north korea", "democratic people"]) {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const block of items) {
    const title = tag(block, "title") || "";
    const lower = title.toLowerCase();
    if (exclude.some((x) => lower.includes(x))) continue;
    if (!terms.some((t) => lower.includes(t))) continue;
    const lvl = title.match(/Level\s*(\d)\s*:\s*(.*)$/i);
    return {
      level: lvl ? Number(lvl[1]) : null,
      category: lvl ? lvl[2].trim() : null,
      title,
      link: tag(block, "link"),
      updated: tag(block, "pubDate"),
    };
  }
  return { level: null, note: "country not found in feed" };
}

export async function advisories(env, info, ctx) {
  if (info.country === "US" || !info.advisoryMatch) {
    return { applicable: false, note: "domestic trip — no U.S. advisory" };
  }
  const params = { feed: "TAsTWs" }; // the feed is country-agnostic; one cache row
  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "state-advisory", endpoint: FEED, params, ttl: TTL,
    trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh,
  });
  const parsed = parseAdvisory(raw || "", info.advisoryMatch);
  return { applicable: true, cached, fetched_at, country: info.countryName, ...parsed };
}
