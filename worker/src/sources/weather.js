// Weather seasonality via Open-Meteo. "Is this a good week to go?" answered
// from the same calendar window one year earlier (the archive holds only past
// dates), a solid climatology proxy. Free, no key.
import { cachedFetch } from "../store.js";

const TTL = 60 * 60 * 24 * 30; // 30 days — climatology barely moves

export function priorYear(iso) {
  const [y, m, d] = iso.split("-");
  return `${Number(y) - 1}-${m}-${d}`;
}

export function distill(archive) {
  const daily = (archive && archive.daily) || {};
  const hi = daily.temperature_2m_max || [];
  const lo = daily.temperature_2m_min || [];
  const pr = daily.precipitation_sum || [];
  const mean = (a) => (a.length ? a.reduce((s, x) => s + (x ?? 0), 0) / a.length : null);
  const round = (x) => (x == null ? null : Math.round(x * 10) / 10);
  return {
    days: hi.length,
    avg_high_c: round(mean(hi)),
    avg_low_c: round(mean(lo)),
    precip_total_mm: round(pr.reduce((s, x) => s + (x ?? 0), 0)),
    rainy_days: pr.filter((x) => (x ?? 0) > 1).length,
  };
}

export async function weather(env, info, ctx) {
  const start = priorYear(info.arrive);
  const end = priorYear(info.depart);
  const params = {
    latitude: Number(info.lat),
    longitude: Number(info.lon),
    start_date: start,
    end_date: end,
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto",
  };
  const qs = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    start_date: start,
    end_date: end,
    daily: params.daily,
    timezone: params.timezone,
  });
  const endpoint = `https://archive-api.open-meteo.com/v1/archive?${qs}`;
  const { cached, raw, fetched_at } = await cachedFetch(env, {
    source: "open-meteo", endpoint, params, ttl: TTL,
    trip: ctx.trip, requestedBy: ctx.requestedBy, fresh: ctx.fresh,
  });
  return {
    cached, fetched_at, gateway: info.label,
    window: { start, end, note: "prior-year climatology" },
    seasonality: distill(JSON.parse(raw || "{}")),
  };
}
