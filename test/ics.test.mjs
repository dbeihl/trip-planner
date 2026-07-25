// Unit tests for the iCalendar primitives (src/scripts/ics.js) — escaping,
// RFC 5545 75-octet line folding (the classic multibyte off-by-one domain),
// and the all-day VEVENT structure with its exclusive DTEND.
import { test } from "node:test";
import assert from "node:assert/strict";
import { icsEscape, icsFold, icsYmd, buildIcsCalendar } from "../src/scripts/ics.js";

const octets = (s) => new TextEncoder().encode(s).length;
const unfold = (s) => s.replace(/\r\n /g, "");

test("icsEscape escapes backslash, semicolon, comma and newlines", () => {
  assert.equal(icsEscape("a\\b;c,d"), "a\\\\b\\;c\\,d");
  assert.equal(icsEscape("line1\nline2\r\nline3"), "line1\\nline2\\nline3");
  assert.equal(icsEscape(null), "");
  assert.equal(icsEscape(undefined), "");
});

test("icsFold leaves short lines alone", () => {
  const line = "SUMMARY:short";
  assert.equal(icsFold(line), line);
  const exactly75 = "X".repeat(75);
  assert.equal(icsFold(exactly75), exactly75);
});

test("icsFold folds long ASCII lines at 75 octets, continuations indented", () => {
  const line = "SUMMARY:" + "x".repeat(150);
  const folded = icsFold(line);
  const lines = folded.split("\r\n");
  assert.ok(lines.length > 1, "long line must fold");
  assert.equal(octets(lines[0]), 75);
  lines.slice(1).forEach((l) => {
    assert.equal(l[0], " ", "continuation lines start with a space");
    assert.ok(octets(l) <= 75, "every physical line stays within 75 octets");
  });
  assert.equal(unfold(folded), line, "unfolding restores the original");
});

test("icsFold folds on UTF-8 octets, never splitting a character", () => {
  for (const line of ["SUMMARY:" + "é".repeat(80), "SUMMARY:" + "祇園祭".repeat(30), "SUMMARY:" + "🎌".repeat(40)]) {
    const folded = icsFold(line);
    folded.split("\r\n").forEach((l) => {
      assert.ok(octets(l) <= 75, `line exceeds 75 octets: ${octets(l)}`);
    });
    assert.equal(unfold(folded), line, "unfolding restores the original");
  }
});

test("icsYmd formats a local calendar date", () => {
  assert.equal(icsYmd(new Date(2026, 0, 5)), "20260105");
  assert.equal(icsYmd(new Date(2026, 10, 22)), "20261122");
});

test("buildIcsCalendar emits all-day VEVENTs with exclusive DTEND", () => {
  const ics = buildIcsCalendar("Japan, day-by-day", [
    { uid: "d1@trip", date: new Date(2026, 0, 31), summary: "Tokyo; arrival" },
    { uid: "d2@trip", date: new Date(2026, 1, 1), summary: "Hakone", description: "Ryokan night" },
  ]);
  assert.ok(ics.endsWith("\r\n"), "CRLF terminated");
  const lines = ics.split("\r\n");
  assert.equal(lines[0], "BEGIN:VCALENDAR");
  assert.ok(lines.includes("END:VCALENDAR"));
  assert.ok(lines.includes("X-WR-CALNAME:Japan\\, day-by-day"), "calendar name is escaped");
  // one all-day event spans exactly one day: DTEND is the next calendar date,
  // including across a month boundary (Jan 31 → Feb 1)
  assert.ok(lines.includes("DTSTART;VALUE=DATE:20260131"));
  assert.ok(lines.includes("DTEND;VALUE=DATE:20260201"));
  assert.ok(lines.includes("SUMMARY:Tokyo\\; arrival"));
  assert.ok(lines.includes("DESCRIPTION:Ryokan night"));
  assert.equal(lines.filter((l) => l === "BEGIN:VEVENT").length, 2);
  assert.equal(lines.filter((l) => l === "END:VEVENT").length, 2);
  // DTSTAMP is a UTC instant, one per build, stamped on every event
  const stamps = lines.filter((l) => l.startsWith("DTSTAMP:"));
  assert.equal(stamps.length, 2);
  stamps.forEach((s) => assert.match(s, /^DTSTAMP:\d{8}T\d{6}Z$/));
});
