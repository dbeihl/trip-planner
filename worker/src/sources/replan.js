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

export function estimateCost(model, usage) {
  const r = RATES[model] || RATES[DEFAULT_MODEL];
  const i = (usage?.input_tokens || 0) + (usage?.cache_read_input_tokens || 0) + (usage?.cache_creation_input_tokens || 0);
  const o = usage?.output_tokens || 0;
  return Math.round(((i / 1e6) * r.in + (o / 1e6) * r.out) * 1e6) / 1e6;
}

const SYSTEM = [
  "You help a small group decide whether moving a trip's dates is a good idea.",
  "You are given the trip, its ORIGINAL window, a PROPOSED window, and freshly gathered signals for the proposed dates: weather seasonality (from the same week a year earlier), public holidays that fall in the window, local events, and the U.S. travel advisory.",
  "Compare the two windows and explain what changes. Be concrete and honest, and ground every claim in a signal you were given — do not invent data.",
  "Flights and lodging prices are NOT included yet, so do not estimate fares or a budget delta; if cost matters, say it depends on fares to be checked separately.",
  "Call out holidays that could mean closures or crowds, weather that's clearly better or worse, notable events, and any advisory change. Keep it short and useful.",
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
          aspect: { type: "string", enum: ["weather", "holidays", "events", "advisory", "length"] },
          direction: { type: "string", enum: ["better", "neutral", "worse"] },
          detail: { type: "string" },
        },
        required: ["aspect", "direction", "detail"],
      },
    },
    flags: { type: "array", items: { type: "string" }, description: "Things to watch (closures, crowds, bookings)." },
    recommendation: { type: "string" },
  },
  required: ["summary", "verdict", "changes", "flags", "recommendation"],
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

export async function replan(env, info, ctx, toDates) {
  if (!env.ANTHROPIC_API_KEY) {
    return { configured: false, note: "set ANTHROPIC_API_KEY to enable the AI re-plan" };
  }
  const from = { start: info.arrive, end: info.depart };
  const to = { start: toDates.start, end: toDates.end };

  // Gather the fresh signals for the PROPOSED dates (Phase 2 sources).
  const newInfo = { ...info, arrive: to.start, depart: to.end };
  const [w, h, e, a] = await Promise.all([
    weather(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    holidays(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    events(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
    advisories(env, newInfo, ctx).catch((err) => ({ error: String(err) })),
  ]);
  const context = { weather: w, holidays: h, events: e, advisories: a };

  const nightsFrom = nights(from.start, from.end);
  const nightsTo = nights(to.start, to.end);
  const payload = {
    trip: ctx.trip,
    gateway: info.label,
    original_window: { ...from, nights: nightsFrom },
    proposed_window: { ...to, nights: nightsTo },
    signals_for_proposed: context,
  };

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
    context,
    briefing: parseResponse(data),
  };
}
