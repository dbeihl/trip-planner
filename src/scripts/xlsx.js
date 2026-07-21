// Dependency-free .xlsx primitives (OOXML zipped by hand). Pure functions.
  export function xlEsc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  export function xlCol(n) {
    let s = "";
    n++;
    while (n > 0) {
      const m = (n - 1) % 26;
      s = String.fromCharCode(65 + m) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }
  export function xlCrc32(buf) {
    if (!xlCrc32.t) {
      xlCrc32.t = [];
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++)
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        xlCrc32.t[n] = c >>> 0;
      }
    }
    const t = xlCrc32.t;
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++)
      crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
  }
  export function xlZip(files) {
    const u16 = (n) => [n & 255, (n >> 8) & 255];
    const u32 = (n) => [
      n & 255,
      (n >> 8) & 255,
      (n >> 16) & 255,
      (n >> 24) & 255,
    ];
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    files.forEach((f) => {
      const nameB = enc.encode(f.name);
      const data = f.data;
      const crc = xlCrc32(data);
      const local = [].concat(
        u32(0x04034b50),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameB.length),
        u16(0),
      );
      parts.push(new Uint8Array(local), nameB, data);
      const cen = [].concat(
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameB.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
      );
      central.push(new Uint8Array(cen), nameB);
      offset += local.length + nameB.length + data.length;
    });
    let cenLen = 0;
    central.forEach((c) => (cenLen += c.length));
    const end = new Uint8Array(
      [].concat(
        u32(0x06054b50),
        u16(0),
        u16(0),
        u16(files.length),
        u16(files.length),
        u32(cenLen),
        u32(offset),
        u16(0),
      ),
    );
    const all = parts.concat(central, [end]);
    let total = 0;
    all.forEach((a) => (total += a.length));
    const out = new Uint8Array(total);
    let p = 0;
    all.forEach((a) => {
      out.set(a, p);
      p += a.length;
    });
    return out;
  }

  const XL_STYLES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="16"/><name val="Calibri"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="6">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf>' +
    "</cellXfs>" +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    "</styleSheet>";
  // style indices: 0 plain · 1 bold · 2 title(center) · 3 bordered-wrap · 4 bordered-bold-center · 5 right

  export function xlSheet(rows, cols, merges) {
    const rowsXml = rows
      .map((row, r) => {
        const cells = row
          .map((cell, c) => {
            if (cell == null) return "";
            const ref = xlCol(c) + (r + 1);
            const s = cell.s != null ? ' s="' + cell.s + '"' : "";
            if (cell.v === "" || cell.v == null)
              return '<c r="' + ref + '"' + s + "/>";
            if (cell.n)
              return '<c r="' + ref + '"' + s + "><v>" + cell.v + "</v></c>";
            return (
              '<c r="' +
              ref +
              '"' +
              s +
              ' t="inlineStr"><is><t xml:space="preserve">' +
              xlEsc(cell.v) +
              "</t></is></c>"
            );
          })
          .join("");
        return '<row r="' + (r + 1) + '">' + cells + "</row>";
      })
      .join("");
    const colsXml = cols
      ? "<cols>" +
        cols
          .map(
            (w, i) =>
              '<col min="' +
              (i + 1) +
              '" max="' +
              (i + 1) +
              '" width="' +
              w +
              '" customWidth="1"/>',
          )
          .join("") +
        "</cols>"
      : "";
    const mergeXml =
      merges && merges.length
        ? '<mergeCells count="' +
          merges.length +
          '">' +
          merges.map((m) => '<mergeCell ref="' + m + '"/>').join("") +
          "</mergeCells>"
        : "";
    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      colsXml +
      "<sheetData>" +
      rowsXml +
      "</sheetData>" +
      mergeXml +
      "</worksheet>"
    );
  }

  export function buildXlsx(sheets) {
    const enc = new TextEncoder();
    let ov = "";
    for (let i = 1; i <= sheets.length; i++)
      ov +=
        '<Override PartName="/xl/worksheets/sheet' +
        i +
        '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    const ct =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      ov +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
    const rootRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    const sheetsXml = sheets
      .map(
        (s, i) =>
          '<sheet name="' +
          xlEsc(s.name) +
          '" sheetId="' +
          (i + 1) +
          '" r:id="rId' +
          (i + 1) +
          '"/>',
      )
      .join("");
    const wb =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
      sheetsXml +
      "</sheets></workbook>";
    let rels = "";
    for (let i = 1; i <= sheets.length; i++)
      rels +=
        '<Relationship Id="rId' +
        i +
        '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' +
        i +
        '.xml"/>';
    rels +=
      '<Relationship Id="rId' +
      (sheets.length + 1) +
      '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';
    const wbRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      rels +
      "</Relationships>";
    const files = [
      { name: "[Content_Types].xml", data: enc.encode(ct) },
      { name: "_rels/.rels", data: enc.encode(rootRels) },
      { name: "xl/workbook.xml", data: enc.encode(wb) },
      { name: "xl/_rels/workbook.xml.rels", data: enc.encode(wbRels) },
      { name: "xl/styles.xml", data: enc.encode(XL_STYLES) },
    ];
    sheets.forEach((s, i) =>
      files.push({
        name: "xl/worksheets/sheet" + (i + 1) + ".xml",
        data: enc.encode(xlSheet(s.rows, s.cols, s.merges)),
      }),
    );
    return xlZip(files);
  }

  export function visaDate(d) {
    return (
      d.getFullYear() +
      "/" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(d.getDate()).padStart(2, "0")
    );
  }
