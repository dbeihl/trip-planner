// Dependency-free iCalendar (.ics) primitives — pure functions, same pattern
// as xlsx.js. The engine builds one all-day VEVENT per itinerary day; date-only
// values are "floating", which is exactly right for multi-timezone trips (the
// event lands on the calendar date regardless of the viewer's timezone).

export function icsEscape(s) {
  return String(s == null ? "" : s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 line folding: max 75 octets per line, continuation lines start
// with a space. Folds on UTF-8 byte length, not characters.
export function icsFold(line) {
  const bytes = (str) => new TextEncoder().encode(str).length;
  if (bytes(line) <= 75) return line;
  const out = [];
  let cur = "";
  for (const ch of line) {
    if (bytes(cur + ch) > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out.map((l, i) => (i === 0 ? l : " " + l)).join("\r\n");
}

export function icsYmd(date) {
  const p = (n) => String(n).padStart(2, "0");
  return "" + date.getFullYear() + p(date.getMonth() + 1) + p(date.getDate());
}

// events: [{ uid, date (Date, all-day), summary, description? }]
export function buildIcsCalendar(name, events) {
  const stamp = icsYmd(new Date()) + "T000000Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//dbeihl//trip-planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    icsFold("X-WR-CALNAME:" + icsEscape(name)),
  ];
  for (const ev of events) {
    const next = new Date(ev.date);
    next.setDate(next.getDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      icsFold("UID:" + icsEscape(ev.uid)),
      "DTSTAMP:" + stamp,
      "DTSTART;VALUE=DATE:" + icsYmd(ev.date),
      "DTEND;VALUE=DATE:" + icsYmd(next), // exclusive end = one all-day event
      icsFold("SUMMARY:" + icsEscape(ev.summary)),
    );
    if (ev.description)
      lines.push(icsFold("DESCRIPTION:" + icsEscape(ev.description)));
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
