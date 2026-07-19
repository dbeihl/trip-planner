// Cloudflare Access verification.
//
// In production, Access sits in front of this Worker and injects a signed JWT
// (`Cf-Access-Jwt-Assertion`) plus the authenticated email. We verify the JWT
// (RS256 against Access's JWKS) rather than trusting the header blindly, so a
// request that reaches the workers.dev URL directly can't spoof an identity.
//
// Enabled only when both CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD are set. Left
// unset (local dev), we fall back to an X-Dev-User header. See README.

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlToJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

// Cache JWKS per team domain across requests within a Worker isolate.
const jwksCache = new Map();
async function getKey(team, kid) {
  let entry = jwksCache.get(team);
  if (!entry || entry.expires < Date.now()) {
    const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
    if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
    const jwks = await res.json();
    entry = { keys: jwks.keys || [], expires: Date.now() + 3600_000 };
    jwksCache.set(team, entry);
  }
  return entry.keys.find((k) => k.kid === kid) || null;
}

// Returns { email, verified } on success, or null when a request that should
// have been authenticated wasn't. Throws only on unexpected infra errors.
export async function verifyAccess(request, env) {
  const team = env.CF_ACCESS_TEAM_DOMAIN;
  const aud = env.CF_ACCESS_AUD;

  // Dev mode: Access not configured.
  if (!team || !aud) {
    return { email: request.headers.get("X-Dev-User") || "dev@local", verified: false };
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  let header, payload;
  try {
    header = b64urlToJson(parts[0]);
    payload = b64urlToJson(parts[1]);
  } catch {
    return null;
  }

  // Claims: issuer, audience, expiry.
  if (payload.iss !== `https://${team}`) return null;
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(aud)) return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now >= payload.exp) return null;
  if (payload.nbf && now < payload.nbf) return null;

  // Signature (RS256).
  const jwk = await getKey(team, header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlToBytes(parts[2]),
    signed,
  );
  if (!ok) return null;

  return { email: payload.email || "unknown", verified: true };
}
