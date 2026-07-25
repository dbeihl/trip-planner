// Unit tests for the remaining pure source distillers: the State Department
// advisory RSS parser, the Nager holiday window filter, and the Ticketmaster
// event distiller. These also back the "what changed" differ (changes.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAdvisory } from "../src/sources/advisories.js";
import { withinWindow } from "../src/sources/holidays.js";
import { distill as distillEvents } from "../src/sources/events.js";

const RSS = `<?xml version="1.0" encoding="UTF-8"?><rss><channel>
<item><title>North Korea (Democratic People's Republic of Korea) - Level 4: Do Not Travel</title><link>https://example.test/nk</link></item>
<item><title><![CDATA[Japan - Level 1: Exercise Normal Precautions]]></title><link>https://example.test/jp</link><pubDate>Mon, 01 Jun 2026 00:00:00 GMT</pubDate></item>
<item><title>Philippines - Level 2: Exercise Increased Caution</title><link>https://example.test/ph</link></item>
</channel></rss>`;

test("parseAdvisory finds the matching country and parses its level", () => {
  const out = parseAdvisory(RSS, ["japan"]);
  assert.equal(out.level, 1);
  assert.equal(out.category, "Exercise Normal Precautions");
  assert.equal(out.title, "Japan - Level 1: Exercise Normal Precautions");
  assert.equal(out.link, "https://example.test/jp");
  assert.equal(out.updated, "Mon, 01 Jun 2026 00:00:00 GMT");
});

test("parseAdvisory honors the exclusion list (Korea ≠ North Korea)", () => {
  // "korea" would substring-match the DPRK item first; the default exclusions
  // must skip it rather than report a false Level 4.
  const out = parseAdvisory(RSS, ["korea"]);
  assert.equal(out.level, null);
  assert.equal(out.note, "country not found in feed");
});

test("parseAdvisory yields the null shape when the country is absent", () => {
  const out = parseAdvisory(RSS, ["atlantis"]);
  assert.equal(out.level, null);
  assert.equal(out.note, "country not found in feed");
  assert.deepEqual(parseAdvisory("", ["japan"]).level, null);
});

test("withinWindow keeps only holidays inside [arrive, depart]", () => {
  const list = [
    { date: "2026-11-03", localName: "文化の日", name: "Culture Day" },
    { date: "2026-11-23", localName: "勤労感謝の日", name: "Labour Thanksgiving Day" },
    { date: "2026-12-25", localName: "Christmas", name: "Christmas Day" },
  ];
  const out = withinWindow(list, "2026-11-14", "2026-11-23");
  assert.deepEqual(out, [
    { date: "2026-11-23", name: "勤労感謝の日", en: "Labour Thanksgiving Day" },
  ]);
  // boundaries are inclusive on both ends
  assert.equal(withinWindow(list, "2026-11-03", "2026-11-03").length, 1);
  assert.deepEqual(withinWindow([], "2026-11-14", "2026-11-23"), []);
});

test("distillEvents flattens the Ticketmaster shape, tolerating gaps", () => {
  const out = distillEvents({
    _embedded: {
      events: [
        {
          name: "Sumo November Basho",
          dates: { start: { localDate: "2026-11-15", localTime: "13:00:00" } },
          _embedded: { venues: [{ name: "Ryōgoku Kokugikan" }] },
          url: "https://example.test/sumo",
        },
        { name: "Pop-up", dates: { start: { localDate: "2026-11-16" } } },
      ],
    },
  });
  assert.deepEqual(out, [
    {
      name: "Sumo November Basho",
      date: "2026-11-15",
      time: "13:00:00",
      venue: "Ryōgoku Kokugikan",
      url: "https://example.test/sumo",
    },
    { name: "Pop-up", date: "2026-11-16", time: null, venue: null, url: null },
  ]);
  assert.deepEqual(distillEvents({}), []);
  assert.deepEqual(distillEvents(null), []);
});
