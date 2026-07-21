// Phase 3 — the AI layer, one job: a date-change briefing.
//
// Given a trip's original window and a proposed new one, gather the fresh
// signals for the new dates (weather / holidays / events / advisory, all from
// Phase 2) and ask Claude to explain what's better or worse. Structured JSON
// out. The Claude call itself is logged to data_pull (provenance + est. cost),
// so "store every pull" covers the LLM too.
//
// Not re-pricing flights — that's Phase 4 (blocked on a cacheable fare source);
// the briefing is explicit that fares aren't included yet.
import { insertPull } from "../store.js";
import { weather } from "./weather.js";
import { holidays } from "./holidays.js";
import { events } from "./events.js";
import { advisories } from "./advisories.js";
import { flights } from "./flights.js";
import { lodging } from "./lodging.js";

const DEFAULT_MODEL = "claude-haiku-4-5"; // per AI-RESEARCH-PLAN.md; override with CLAUDE_MODEL
const API_URL = "https://api.anthropic.com/v1/messages";

// Rough $/MTok for cost logging. Haiku 4.5 = $1 in / $5 out.
const RATES = {
  "claude-haiku-4-5": { in: 1, out: 5 },
  "claude-sonnet-5": { in: 3, out: 15 },
  "claude-opus-4-8": { in: 5, out: 25 },
};

// Whole nights between two ISO dates.
export function nights(start, end) {
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${end}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

// A partial, deterministic budget for the proposed dates: flights (2-adult
// total) + lodging (median nightly x nights). The Worker computes this — Claude
// only explains it — so no fares are invented. Excludes transport, activities,
// and taxes (those are date-independent in the planner). Pure — unit-tested.
export function buildEstimate(fl, lo, nights) {
  const num = (x) => (typeof x === "number" && !Number.isNaN(x) ? x : null);
  const flightsTotal = fl && fl.configured ? num(fl.cheapest_total_2adults) : null;
  const nightly = lo && lo.configured ? num(lo.nightly_median) : null;
  const lodgingTotal = nightly != null && nights > 0 ? Math.round(nightly * nights) : null;
  const subtotal = flightsTotal != null || lodgingTotal != null ? (flightsTotal || 0) + (lodgingTotal || 0) : null;
  return {
    flights_2adults: flightsTotal,
    lodging_nightly: nightly,
    nights,
    lodging_total: lodgingTotal,
    subtotal,
    currency: "USD",
    note: "flights + lodging only; excludes transport, activities, and taxes",
  };
}

export function estimateCost(model, usage) {
  const r = RATES[model] || RATES[DEFAULT_MODEL];
  const i = (usage?.input_tokens || 0) + (usage?.cache_read_input_tokens || 0) + (usage?.cache_creation_input_tokens || 0);
  const o = usage?.output_tokens || 0;
  return Math.round(((i / 1e6) * r.in + (o / 1e6) * r.out) * 1e6) / 1e6;
}

const SYSTEM = [
  "You help a small group decide whether moving a trip's dates is a good idea.",
  "You are given the trip, its ORIGINAL window, a PROPOSED window, freshly gathered signals for the proposed dates (weather seasonality from the same week a year earlier, public holidays in the window, local events, the U.S. travel advisory, representative round-trip flight fares, and representative nightly lodging rates — fares and rates are 2-adult / one-room, in USD), and a pre-computed budget estimate (flights + lodging) for the proposed window.",
  "Compare the two windows and explain what changes. Be concrete and honest, and ground every claim in a signal you were given — do not invent data or numbers.",
  "The budget estimate is already computed for you: use its figures verbatim, treat them as representative quotes to verify before booking, and make clear it covers only flights + lodging (not transport, activities, or taxes). If a price signal is absent, unconfigured, or errored, don't estimate that part.",
  "Call out holidays that could mean closures or crowds, weather that's clearly better or worse, notable events, any advisory change, and any cost difference (fares or lodging). Keep it short and useful.",
  "If the payload includes an `instruction` — a free-text edit request like 'one less night in Coron' or 'swap the optional city in' — translate it into proposed_changes operations, using ONLY the city keys listed in trip_cities. Never invent cities, hotels, costs, or per-person figures. set_nights carries the TARGET night count for that city (work it out from current_nights when given). Use an add_city/remove_city op only for cities trip_cities marks optional; anything the operations cannot express becomes an op:'note' whose reason explains why. With no instruction, proposed_changes is an empty array.",
].join(" ");

// The structured-output schema (see shared/tool-use-concepts.md limits:
// additionalProperties:false, no recursion, no min/maxItems).
export const BRIEF_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "One sentence: the headline of what changes." },
    verdict: { type: "string", enum: ["better", "similar", "worse", "mixed"] },
    changes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          aspect: { type: "string", enum: ["weather", "holidays", "events", "advisory", "flights", "lodging", "budget", "length"] },
          direction: { type: "string", enum: ["better", "neutral", "worse"] },
          detail: { type: "string" },
        },
        required: ["aspect", "direction", "detail"],
      },
    },
    flags: { type: "array", items: { type: "string" }, description: "Things to watch (closures, crowds, bookings)." },
    recommendation: { type: "string" },
    proposed_changes: {
      type: "array",
      description: "Concrete edits translating the traveler's instruction; empty when there is no instruction. city keys come ONLY from trip_cities.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          op: { type: "string", enum: ["set_dates", "set_nights", "add_city", "remove_city", "note"] },
          city: { type: "string", description: "city key from trip_cities, or \"\" when the op is not city-scoped" },
          nights: { type: "integer", description: "TARGET night count for set_nights; 0 otherwise" },
          start: { type: "string", description: "ISO date for set_dates; \"\" otherwise" },
          end: { type: "string", description: "ISO date for set_dates; \"\" otherwise" },
          reason: { type: "string" },
        },
        required: ["op", "city", "nights", "start", "end", "reason"],
      },
    },
  },
  required: ["summary", "verdict", "changes", "flags", "recommendation", "proposed_changes"],
};

// Build the Anthropic request. Pure — unit-tested.
export function buildRequest(env, payload) {
  const model = env.CLAUDE_MODEL || DEFAULT_MODEL;
  return {
    url: API_URL,
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: {
      model,
      max_tokens: 1500,
      // Stable prefix first (system, cacheable); volatile trip payload last.
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { format: { type: "json_schema", schema: BRIEF_SCHEMA } },
      messages: [{ role: "user", content: JSON.stringify(payload) }],
    },
  };
}

// Extract the structured brief from an Anthropic response. Pure — unit-tested.
export function parseResponse(data) {
  if (data.stop_reason === "refusal") throw new Error("model declined the request");
  if (data.stop_reason === "max_tokens") throw new Error("briefing truncated (max_tokens)");
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  if (!text) throw new Error("empty model response");
  return JSON.parse(text); // structured outputs guarantee valid JSON, but keep the throw as a guard
}

export async function replan(env, info, ctx, toDates, edit = {}) {
  if (!env.ANTHROPIC_API_KEY) {
    return { configured: false, note: "set ANTHROPIC_API_KEY to enable the AI re-plan" };
  }
  const from = { start: info.arrive, end: info.depart };
  const to = { start: toDates.start, end: toDates.end };

  // Gather the fresh signals for the PROPOSED dates (Phase 2 + 4 sources).
  const newInfo = { ...info, arrive: to.start, depart: to.end };
  const [w, h, e, a, fl, lo] = await Promise.all([
    weather(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    holidays(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    events(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    advisories(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    flights(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    lodging(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
  ]);
  const context = { weather: w, holidays: h, events: e, advisories: a, flights: fl, lodging: lo };

  const nightsFrom = nights(from.start, from.end);
  const nightsTo = nights(to.start, to.end);
  const estimate = buildEstimate(fl, lo, nightsTo);
  const payload = {
    trip: ctx.trip,
    gateway: info.label,
    original_window: { ...from, nights: nightsFrom },
    proposed_window: { ...to, nights: nightsTo },
    signals_for_proposed: context,
    budget_estimate_for_proposed: estimate,
  };
  // Free-text edit request (POST /api/replan): give the model the trip's real
  // city keys — the only vocabulary proposed_changes may use — and, when the
  // client sent them, the currently selected nights per city.
  if (edit.instruction) {
    payload.instruction = edit.instruction;
    payload.trip_cities = {
      route: (info.cities || []).map((k) => ({ key: k, label: (info.cityLabels || {})[k] || k })),
      optional: (info.optionalCities || []).map((k) => ({ key: k, label: (info.cityLabels || {})[k] || k })),
    };
    if (edit.currentNights) payload.current_nights = edit.currentNights;
  }

  const req = buildRequest(env, payload);
  const started = Math.floor(Date.now() / 1000);
  const res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
  const raw = await res.text();

  // Log the LLM call to data_pull — provenance + cost, always fresh (no cache).
  const data = res.ok ? JSON.parse(raw) : null;
  await insertPull(env, {
    id: crypto.randomUUID(),
    source: "claude",
    endpoint: `${API_URL} (${req.body.model})`,
    dedup_key: `claude:${ctx.trip}:${to.start}:${to.end}:${started}`,
    params_json: JSON.stringify({ model: req.body.model, trip: ctx.trip, from, to }),
    response_json: raw,
    status: res.ok ? "ok" : "error",
    http_status: res.status,
    fetched_at: started,
    ttl_seconds: 0,
    cost_usd: data ? estimateCost(req.body.model, data.usage) : 0,
    trip_id: ctx.trip,
    requested_by: ctx.requestedBy,
  });

  if (!res.ok) {
    const err = new Error("claude call failed");
    err.status = 502;
    err.httpStatus = res.status;
    throw err;
  }

  return {
    configured: true,
    trip: ctx.trip,
    gateway: info.label,
    from: { ...from, nights: nightsFrom },
    to: { ...to, nights: nightsTo },
    nights_delta: nightsTo - nightsFrom,
    model: req.body.model,
    cost_usd: estimateCost(req.body.model, data.usage),
    estimate,
    context,
    briefing: parseResponse(data),
  };
}
