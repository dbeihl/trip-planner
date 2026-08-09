// The Guard workflow's decision table, exercised against the real guard.yml.
//
// This logic lives inline in the workflow because the job runs under
// pull_request_target and must never check out PR code — so there is no module
// to import. Instead we extract the script block from the YAML and run it with
// stubbed github/context/core objects. That keeps the test honest: it fails if
// someone edits the workflow, not a copy of it.
//
// What is being protected: a gate that always passes is worse than no gate,
// because a green check is read as "reviewed". Each case below is a way this
// could silently start passing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const yaml = readFileSync(resolve(here, "../.github/workflows/guard.yml"), "utf8");

// Pull the `script: |` block and strip its YAML indentation.
const block = yaml.match(/script: \|\n([\s\S]*?)(?:\n\S|$)/);
assert.ok(block, "guard.yml no longer has a `script: |` block");
const source = block[1]
  .split("\n")
  .map((l) => l.replace(/^ {12}/, ""))
  .join("\n");

const AUTHOR = "dbeihl";
const OTHER = "someone-else";

// Runs the extracted script and reports whether it failed the check.
async function runGuard({ files, labels = [], reviews = [] }) {
  const messages = [];
  let failure = null;
  const core = {
    info: (m) => messages.push(m),
    setFailed: (m) => {
      failure = m;
    },
  };
  const listFiles = () => files.map((f) => (typeof f === "string" ? { filename: f } : f));
  const listReviews = () => reviews;
  const github = {
    paginate: async (method) => method(),
    rest: {
      pulls: {
        listFiles,
        listReviews,
        get: async () => ({ data: { labels: labels.map((name) => ({ name })) } }),
      },
    },
  };
  const context = {
    repo: { owner: AUTHOR, repo: "trip-planner" },
    payload: { pull_request: { number: 1, user: { login: AUTHOR } } },
  };
  const fn = new Function(
    "github",
    "context",
    "core",
    `return (async () => {\n${source}\n})();`,
  );
  await fn(github, context, core);
  return { failed: failure !== null, failure, messages };
}

test("a PR touching no protected path passes untouched", async () => {
  const r = await runGuard({ files: ["src/data/japan.js", "README.md"] });
  assert.equal(r.failed, false);
  assert.match(r.messages.join("\n"), /gates unchanged/);
});

test("a PR touching a gate fails with no approval and no label", async () => {
  const r = await runGuard({ files: ["e2e/smoke.spec.mjs"] });
  assert.equal(r.failed, true);
  assert.match(r.failure, /e2e\/smoke\.spec\.mjs/);
  assert.match(r.failure, /gates-reviewed/);
});

test("the ack label clears the gate", async () => {
  const r = await runGuard({
    files: ["e2e/smoke.spec.mjs"],
    labels: ["gates-reviewed"],
  });
  assert.equal(r.failed, false);
  assert.match(r.messages.join("\n"), /acknowledged via/);
});

test("an unrelated label does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["test/budget.test.mjs"],
    labels: ["enhancement"],
  });
  assert.equal(r.failed, true);
});

// The whole point of the change: the author is the owner on a solo repo, so a
// self-approval must not count or the gate approves itself.
test("the author's own approval does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    reviews: [{ user: { login: AUTHOR }, state: "APPROVED" }],
  });
  assert.equal(r.failed, true);
});

test("an approval from anyone else clears the gate", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    reviews: [{ user: { login: OTHER }, state: "APPROVED" }],
  });
  assert.equal(r.failed, false);
  assert.match(r.messages.join("\n"), new RegExp(OTHER));
});

test("a non-approving review from someone else does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["schema/trip.schema.json"],
    reviews: [{ user: { login: OTHER }, state: "CHANGES_REQUESTED" }],
  });
  assert.equal(r.failed, true);
});

test("a later non-approval supersedes an earlier approval from the same person", async () => {
  const r = await runGuard({
    files: ["package.json"],
    reviews: [
      { user: { login: OTHER }, state: "APPROVED" },
      { user: { login: OTHER }, state: "CHANGES_REQUESTED" },
    ],
  });
  assert.equal(r.failed, true);
});

test("every protected path pattern is actually matched", async () => {
  const paths = [
    ".github/workflows/deploy-astro.yml",
    "test/budget.test.mjs",
    "worker/test/api.test.mjs",
    "e2e/smoke.spec.mjs",
    "schema/trip.schema.json",
    "scripts/validate-trip.mjs",
    "src/scripts/validate.js",
    "playwright.config.mjs",
    "astro.config.mjs",
    "package.json",
    "package-lock.json",
    "worker/package.json",
  ];
  for (const p of paths) {
    const r = await runGuard({ files: [p] });
    assert.equal(r.failed, true, `${p} should be protected but was not`);
  }
});

test("a lookalike path outside the gates is not protected", async () => {
  for (const p of ["src/scripts/engine.js", "docs/test/notes.md", "src/data/schema.js"]) {
    const r = await runGuard({ files: [p] });
    assert.equal(r.failed, false, `${p} should not be protected but was`);
  }
});
