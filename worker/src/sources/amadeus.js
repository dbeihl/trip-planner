// Shared Amadeus Self-Service auth, used by flights.js and lodging.js.
// OAuth2 client-credentials; the bearer token is cached per isolate (~30 min)
// and rides in a request header — never in a stored URL. authInit() is a lazy
// init for cachedFetch, so the token is fetched only on a cache miss.
import { SourceError } from "../store.js";

export function base(env) {
  return (env.AMADEUS_BASE || "https://test.api.amadeus.com").replace(/\/+$/, "");
}

export function configured(env) {
  return !!(env.AMADEUS_CLIENT_ID && env.AMADEUS_CLIENT_SECRET);
}

let tokenCache = { token: null, expires: 0 };
export function _resetTokenCache() { tokenCache = { token: null, expires: 0 }; } // test hook

export async function getToken(env) {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expires > now + 5000) return tokenCache.token;
  const res = await fetch(`${base(env)}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.AMADEUS_CLIENT_ID,
      client_secret: env.AMADEUS_CLIENT_SECRET,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new SourceError("amadeus auth failed", { httpStatus: res.status });
  const data = JSON.parse(text);
  tokenCache = { token: data.access_token, expires: now + (data.expires_in || 1799) * 1000 };
  return tokenCache.token;
}

// Lazy init for cachedFetch: resolves the bearer header on a cache miss only.
export function authInit(env) {
  return async () => ({
    headers: { Authorization: `Bearer ${await getToken(env)}`, "User-Agent": "trip-planner-api/0.5" },
  });
}
