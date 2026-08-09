// Unit tests for the dependency-free .xlsx primitives (src/scripts/xlsx.js).
// A corrupt workbook is only discovered when someone opens the export on the
// trip, so the zip container and sheet XML are pinned here. Run with
// `node --test test/` (also invoked by `npm test`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  xlEsc,
  xlCol,
  xlCrc32,
  xlZip,
  xlSheet,
  buildXlsx,
  visaDate,
} from "../src/scripts/xlsx.js";

const enc = new TextEncoder();
const dec = new TextDecoder();

// Minimal reader for the stored (no compression) zips xlZip emits: walk the
// end-of-central-directory record, then each central entry back to its local
// header, returning { name, crc, data } per member.
function readZip(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const u16 = (o) => dv.getUint16(o, true);
  const u32 = (o) => dv.getUint32(o, true);
  const eocd = buf.length - 22; // fixed size — xlZip writes no zip comment
  assert.equal(u32(eocd), 0x06054b50, "end-of-central-directory signature");
  const count = u16(eocd + 10);
  const files = [];
  let p = u32(eocd + 16); // central directory offset
  for (let i = 0; i < count; i++) {
    assert.equal(u32(p), 0x02014b50, "central directory signature");
    const crc = u32(p + 16);
    const size = u32(p + 20);
    const nameLen = u16(p + 28);
    const local = u32(p + 42);
    const name = dec.decode(buf.subarray(p + 46, p + 46 + nameLen));
    assert.equal(u32(local), 0x04034b50, "local header signature");
    const dataStart = local + 30 + u16(local + 26) + u16(local + 28);
    files.push({ name, crc, data: buf.subarray(dataStart, dataStart + size) });
    p += 46 + nameLen;
  }
  return files;
}

test("xlEsc escapes XML metacharacters and nothing else", () => {
  assert.equal(xlEsc('a & b < c > "d"'), "a &amp; b &lt; c &gt; &quot;d&quot;");
  assert.equal(xlEsc("it's fine"), "it's fine");
  assert.equal(xlEsc(42), "42"); // non-strings are stringified
});

test("xlCol maps 0-based column indices to A1 letters", () => {
  assert.equal(xlCol(0), "A");
  assert.equal(xlCol(25), "Z");
  assert.equal(xlCol(26), "AA");
  assert.equal(xlCol(51), "AZ");
  assert.equal(xlCol(52), "BA");
  assert.equal(xlCol(701), "ZZ");
  assert.equal(xlCol(702), "AAA");
});

test("xlCrc32 matches the standard CRC-32 test vectors", () => {
  assert.equal(xlCrc32(new Uint8Array(0)), 0);
  assert.equal(xlCrc32(enc.encode("a")), 0xe8b7be43);
  assert.equal(xlCrc32(enc.encode("123456789")), 0xcbf43926);
});

test("xlZip round-trips stored files with correct CRCs", () => {
  const files = [
    { name: "hello.txt", data: enc.encode("hello world") },
    { name: "dir/nested.xml", data: enc.encode("<a>é ✓</a>") },
  ];
  const out = readZip(xlZip(files));
  assert.equal(out.length, 2);
  files.forEach((f, i) => {
    assert.equal(out[i].name, f.name);
    assert.equal(dec.decode(out[i].data), dec.decode(f.data));
    assert.equal(out[i].crc, xlCrc32(f.data), "recorded CRC matches the data");
  });
});

test("xlSheet renders strings, numbers, blanks, cols and merges", () => {
  const xml = xlSheet(
    [
      [{ v: "A & B", s: 1 }, null, { v: "" }],
      [{ v: 1234, n: 1 }],
    ],
    [12, 30],
    ["A1:B1"],
  );
  // strings are inline (no shared-strings table) with whitespace preserved
  assert.match(
    xml,
    /<c r="A1" s="1" t="inlineStr"><is><t xml:space="preserve">A &amp; B<\/t><\/is><\/c>/,
  );
  assert.ok(!xml.includes('r="B1"'), "null cells are skipped entirely");
  assert.match(xml, /<c r="C1"\/>/, "empty-string cells self-close");
  assert.match(xml, /<c r="A2"><v>1234<\/v><\/c>/, "numeric cells use <v>");
  assert.match(xml, /<col min="1" max="1" width="12" customWidth="1"\/>/);
  assert.match(xml, /<mergeCells count="1"><mergeCell ref="A1:B1"\/><\/mergeCells>/);
});

test("buildXlsx assembles a complete OOXML package", () => {
  const wb = buildXlsx([
    { name: "Budget & Plan", rows: [[{ v: "hi" }]] },
    { name: "Visa", rows: [[{ v: 1, n: 1 }]] },
  ]);
  const files = readZip(wb);
  const names = files.map((f) => f.name);
  assert.deepEqual(names, [
    "[Content_Types].xml",
    "_rels/.rels",
    "xl/workbook.xml",
    "xl/_rels/workbook.xml.rels",
    "xl/styles.xml",
    "xl/worksheets/sheet1.xml",
    "xl/worksheets/sheet2.xml",
  ]);
  const text = (n) => dec.decode(files[names.indexOf(n)].data);
  // sheet names are escaped in workbook.xml and each sheet has a rel + type
  assert.match(text("xl/workbook.xml"), /<sheet name="Budget &amp; Plan" sheetId="1" r:id="rId1"\/>/);
  assert.match(text("xl/_rels/workbook.xml.rels"), /Target="worksheets\/sheet2\.xml"/);
  assert.match(text("[Content_Types].xml"), /PartName="\/xl\/worksheets\/sheet2\.xml"/);
});

test("visa dates export as text, not as an Excel date serial", async () => {
  // The value must stay a string: a numeric cell with a date number format
  // renders per the opening machine's locale, reintroducing exactly the
  // ambiguity the long format removes.
  //
  // Asserting against a cell literal built here would prove nothing -- a
  // literal with no `n` flag makes xlSheet emit inlineStr by construction,
  // whatever the real export does. engine.js builds its cells with local
  // helpers that cannot be imported, so this reads the call site itself.
  const src = await readFile(
    new URL("../src/scripts/engine.js", import.meta.url),
    "utf8",
  );
  assert.match(
    src,
    /cell\(visaDate\(/,
    "the visa Date column must use cell(), which emits t=\"inlineStr\"",
  );
  assert.doesNotMatch(
    src,
    /num\(visaDate\(/,
    "num() sets n:true and makes the date a numeric serial, which renders " +
      "per the reader's locale",
  );

  // And that cell(), given a string, really does produce an inlineStr.
  const xml = xlSheet([[{ v: visaDate(new Date(2026, 10, 1)), s: 3 }]], null, null);
  assert.match(xml, /t="inlineStr"/);
  assert.match(xml, /November 1, 2026/);
  assert.doesNotMatch(xml, /<v>/, "a <v> element means a numeric cell");
});

test("visaDate formats as a long unambiguous US date", () => {
  // 2026/11/14 reads as 14 November or as no valid date at all depending on
  // the reader's convention. A visa itinerary is read by consular staff, so
  // the month is spelled out.
  assert.equal(visaDate(new Date(2026, 10, 14)), "November 14, 2026");
  assert.equal(visaDate(new Date(2027, 0, 3)), "January 3, 2027");
  // No zero padding on the day: "January 3", not "January 03".
  assert.equal(visaDate(new Date(2026, 10, 1)), "November 1, 2026");
});
