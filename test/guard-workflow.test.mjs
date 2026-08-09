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

const OWNER = "dbeihl";
const OTHER = "someone-else";
const HEAD = "a".repeat(40);
const OLD = "b".repeat(40);

// Runs the extracted script and reports whether it failed the check.
async function runGuard({
  files,
  labels = [],
  reviews = [],
  author = OWNER,
  action = "opened",
  head = HEAD,
}) {
  const messages = [];
  const removedLabels = [];
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
      issues: {
        removeLabel: async ({ name }) => removedLabels.push(name),
      },
    },
  };
  const context = {
    repo: { owner: OWNER, repo: "trip-planner" },
    payload: {
      action,
      pull_request: { number: 1, user: { login: author }, head: { sha: head } },
    },
  };
  const fn = new Function(
    "github",
    "context",
    "core",
    `return (async () => {\n${source}\n})();`,
  );
  await fn(github, context, core);
  return { failed: failure !== null, failure, messages, removedLabels };
}

const approval = (login, commit_id = HEAD) => ({
  user: { login },
  state: "APPROVED",
  commit_id,
});

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

// A new push can add protected-path changes underneath a label that is still
// sitting on the PR. The ack has to be per-head, or it silently covers code
// nobody looked at.
test("pushing after the ack strips the label and fails", async () => {
  const r = await runGuard({
    files: ["e2e/smoke.spec.mjs"],
    labels: ["gates-reviewed"],
    action: "synchronize",
  });
  assert.equal(r.failed, true);
  assert.deepEqual(r.removedLabels, ["gates-reviewed"]);
  assert.match(r.failure, /Re-read the diff and re-apply/);
});

// The whole point of the change: the owner authors every PR on a solo repo, so
// a self-approval must not count or the gate approves itself.
test("the author's own approval does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    reviews: [approval(OWNER)],
  });
  assert.equal(r.failed, true);
});

// Anyone can submit a review on a public repo. "Not the author" is not a trust
// boundary — a fork contributor with a second account would clear their own
// gate change. Only the owner's approval counts.
test("an approval from a non-owner does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    author: OTHER,
    reviews: [approval("random-drive-by")],
  });
  assert.equal(r.failed, true);
});

test("the owner approving someone else's PR at the current head clears it", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    author: OTHER,
    reviews: [approval(OWNER)],
  });
  assert.equal(r.failed, false);
  assert.match(r.messages.join("\n"), new RegExp(OWNER));
});

// A stale approval must not carry forward onto commits pushed after it.
test("the owner's approval of an older commit does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["scripts/validate-trip.mjs"],
    author: OTHER,
    reviews: [approval(OWNER, OLD)],
  });
  assert.equal(r.failed, true);
});

test("a non-approving review from the owner does NOT clear the gate", async () => {
  const r = await runGuard({
    files: ["schema/trip.schema.json"],
    author: OTHER,
    reviews: [{ user: { login: OWNER }, state: "CHANGES_REQUESTED", commit_id: HEAD }],
  });
  assert.equal(r.failed, true);
});

test("a later non-approval supersedes an earlier approval from the same person", async () => {
  const r = await runGuard({
    files: ["package.json"],
    author: OTHER,
    reviews: [
      approval(OWNER),
      { user: { login: OWNER }, state: "CHANGES_REQUESTED", commit_id: HEAD },
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
