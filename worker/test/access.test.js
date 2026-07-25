// Tests for Cloudflare Access JWT verification (access.js). The documented
// threat model is a request hitting the workers.dev URL directly with a
// spoofed identity — so every rejection path (claims and signature) is pinned
// here with real RS256 tokens signed by a test key, and the JWKS fetch is
// stubbed. Each test uses its own team domain to sidestep the module's
// per-team JWKS cache.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, createSign } from "node:crypto";
import { verifyAccess } from "../src/access.js";

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };

const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  if (String(url).endsWith("/cdn-cgi/access/certs"))
    return new Response(JSON.stringify({ keys: [JWK] }), { status: 200 });
  throw new Error("unexpected fetch: " + url);
};
after(() => {
  globalThis.fetch = realFetch;
});

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");

function makeToken(payload, { kid = "test-kid", tamper = false } = {}) {
  const input = `${b64url({ alg: "RS256", kid })}.${b64url(payload)}`;
  let sig = createSign("RSA-SHA256").update(input).sign(privateKey).toString("base64url");
  if (tamper) sig = (sig[0] === "A" ? "B" : "A") + sig.slice(1);
  return `${input}.${sig}`;
}

let seq = 0;
const now = () => Math.floor(Date.now() / 1000);
// Fresh team domain per call → fresh JWKS cache entry.
function setup(payloadOverrides = {}) {
  const team = `team${seq++}.test`;
  const env = { CF_ACCESS_TEAM_DOMAIN: team, CF_ACCESS_AUD: "aud-123" };
  const payload = {
    iss: `https://${team}`,
    aud: ["aud-123"],
    exp: now() + 3600,
    email: "dave@example.com",
    ...payloadOverrides,
  };
  return { env, payload };
}

const req = (headers) => ({ headers: new Headers(headers) });

test("dev mode (Access unconfigured) trusts X-Dev-User, unverified", async () => {
  const out = await verifyAccess(req({ "X-Dev-User": "suzanne@local" }), {});
  assert.deepEqual(out, { email: "suzanne@local", verified: false });
  const fallback = await verifyAccess(req({}), {});
  assert.deepEqual(fallback, { email: "dev@local", verified: false });
});

test("a valid token verifies and yields the email", async () => {
  const { env, payload } = setup();
  const out = await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(payload) }), env);
  assert.deepEqual(out, { email: "dave@example.com", verified: true });
});

test("aud may be a bare string instead of an array", async () => {
  const { env, payload } = setup({ aud: "aud-123" });
  const out = await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(payload) }), env);
  assert.equal(out.verified, true);
});

test("a missing or structurally broken token is rejected", async () => {
  const { env } = setup();
  assert.equal(await verifyAccess(req({}), env), null);
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": "a.b" }), env), null);
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": "!!.??.$$" }), env), null);
});

test("wrong issuer is rejected", async () => {
  const { env, payload } = setup({ iss: "https://evil.test" });
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(payload) }), env), null);
});

test("wrong audience is rejected", async () => {
  const { env, payload } = setup({ aud: ["someone-else"] });
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(payload) }), env), null);
});

test("expired and not-yet-valid tokens are rejected", async () => {
  const expired = setup({ exp: now() - 10 });
  assert.equal(
    await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(expired.payload) }), expired.env),
    null,
  );
  const early = setup({ nbf: now() + 3600 });
  assert.equal(
    await verifyAccess(req({ "Cf-Access-Jwt-Assertion": makeToken(early.payload) }), early.env),
    null,
  );
});

test("a token signed under an unknown kid is rejected", async () => {
  const { env, payload } = setup();
  const token = makeToken(payload, { kid: "not-in-jwks" });
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": token }), env), null);
});

test("a tampered signature is rejected even with valid claims", async () => {
  const { env, payload } = setup();
  const token = makeToken(payload, { tamper: true });
  assert.equal(await verifyAccess(req({ "Cf-Access-Jwt-Assertion": token }), env), null);
});
