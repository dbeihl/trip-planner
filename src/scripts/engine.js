// The planner engine. Reads the trip data from window.TRIP (set by the
// layout before this module loads). One copy shared by every trip page.
import { xlEsc, xlCol, xlCrc32, xlZip } from "./xlsx.js";

const TRIP = window.TRIP;
  // ─────────────────────────────────────────────────────────────────
  // TRIP DATA (Phase 1). All trip-specific data lives in one object.
  // The large literals are assigned into it below (kept in place, so
  // nothing is retyped); the engine reads them through the bindings at
  // the end of the data block — its code is otherwise unchanged.
  // Japan is the reference dataset — see GENERALIZATION-PLAN.md.
  // ─────────────────────────────────────────────────────────────────





  // ── engine bindings: the engine reads its data from TRIP ──────────
  const FLIGHTS = TRIP.flights;
  const HOTELS = TRIP.hotels;
  const TRANSPORT = TRIP.transport;
  const ACTIVITIES = TRIP.activities;
  const ROUTE_DETAIL = TRIP.routeDetail;
  const TRIP_START = TRIP.meta.dates.arrive; // fixed arrival date, ISO
  const REFERENCE_TOTAL = TRIP.meta.reference ? TRIP.meta.reference.total : 0;
  const LODGING_TAX_BUFFER = TRIP.meta.lodgingTaxBuffer;
  // display name for exports: "Japan — Nov 2026" → "Japan"
  const TRIP_NAME = (TRIP.meta.title || "Trip").split(" — ")[0];

  function renderActivities(containerId, cityKey) {
    const el = document.getElementById(containerId);
    const acts = ACTIVITIES[cityKey] || [];
    el.innerHTML = acts
      .map(
        (act, ai) => `
    <div class="activity-block">
      <div class="activity-head">Day ${act.day} — ${act.title}</div>
      <div class="tier-list">
        ${act.options
          .map(
            (opt, oi) => `
          <label class="tier">
            <input type="radio" name="${cityKey}Act${ai}" value="${oi}" ${oi === 0 ? "checked" : ""}>
            <div>
              <div class="tier-name">${opt.name}${opt.current ? '<span class="badge">default</span>' : ""}</div>
              <div class="tier-meta">${opt.note}</div>
            </div>
            <div class="tier-price">${opt.cost === 0 ? "Free" : "$" + opt.cost}</div>
          </label>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
      )
      .join("");
  }

  function renderRouteDetail(id, entry) {
    const el = document.getElementById(id);
    el.innerHTML = `
    <summary>Route detail — ${entry.label}</summary>
    <ol>${entry.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <div class="rd-total">Total: ${entry.total}</div>
    ${entry.note ? `<div class="rd-note">${entry.note}</div>` : ""}
  `;
  }

  // ── origins questionnaire ────────────────────────────────────────
  // FLIGHTS keys are selectable origin presets. Presets flagged
  // `preset:true` are offered in the dropdown but are NOT part of the
  // default split, so adding one never changes the default trip cost.
  const ALL_ORIGINS = Object.keys(FLIGHTS);
  const DEFAULT_ORIGINS = ALL_ORIGINS.filter((k) => !FLIGHTS[k].preset);
  const DEST_LABEL = TRIP.meta.destLabel || "destination";
  const FUEL_PRICE = 5; // premium fuel, top-end $/gal
  const DRIVE_PAD = 1.15; // +15% over route miles for real-world detours
  const originChoice = {
    solo: DEFAULT_ORIGINS[0],
    slots: DEFAULT_ORIGINS.slice(),
    pax: DEFAULT_ORIGINS.map((k) => FLIGHTS[k].pax),
  };
  const sameAirportOn = () =>
    (document.querySelector('input[name="sameAirport"]:checked') || {})
      .value === "yes";
  const travelerCount = () =>
    Math.max(
      1,
      parseInt(document.getElementById("travelerCount").value, 10) || 2,
    );

  function flightOptionsHtml(journeyKey, radioName) {
    const j = FLIGHTS[journeyKey];
    return `<div class="tier-list">
      ${j.options
        .map(
          (opt, i) => `
        <label class="tier">
          <input type="radio" name="${radioName}" value="${i}" ${opt.current ? "checked" : ""}>
          <div>
            <div class="tier-name">${opt.name}${opt.current ? '<span class="badge">preferred</span>' : ""}</div>
            <div class="tier-meta">${opt.route} · ${opt.stops} stop${opt.stops > 1 ? "s" : ""} · ${opt.cabin} · ${opt.note}</div>
          </div>
          <div class="tier-price">$${opt.fare.toLocaleString("en-US")}<small>per person, RT</small></div>
        </label>`,
        )
        .join("")}
    </div>`;
  }

  function originSelectHtml(slot, selectedKey) {
    const opts = ALL_ORIGINS.map(
      (k) =>
        `<option value="${k}" ${k === selectedKey ? "selected" : ""}>${FLIGHTS[k].label}</option>`,
    ).join("");
    return `<select class="origin-select" data-slot="${slot}">${opts}<option value="__other" ${selectedKey === "__other" ? "selected" : ""}>Other airport…</option></select>`;
  }

  function originBlockHtml(slot, key, pax, showPax) {
    const radioName = `origin${slot}Flight`;
    const body =
      key === "__other"
        ? `<div class="other-airport">
            <label>Airport code <input class="other-code" data-slot="${slot}" maxlength="4" value="ORD" /></label>
            <label>Est. round-trip fare / person <input type="number" class="other-fare" data-slot="${slot}" min="0" value="700" inputmode="numeric" /></label>
          </div>`
        : flightOptionsHtml(key, radioName);
    const pref =
      key !== "__other" && FLIGHTS[key] && FLIGHTS[key].preference
        ? `<span class="journey-pref">${FLIGHTS[key].preference}</span>`
        : "";
    const paxCtl = showPax
      ? `<label class="origin-pax">Travelers <input type="number" class="origin-pax-input" data-slot="${slot}" min="0" max="8" value="${pax}" inputmode="numeric" /></label>`
      : "";
    return `<div class="origin-block" data-slot="${slot}">
        <div class="journey-head">
          ${originSelectHtml(slot, key)}
          ${pref}
          ${paxCtl}
        </div>
        ${body}
      </div>`;
  }

  function renderOrigins() {
    const c = document.getElementById("originsContainer");
    if (sameAirportOn()) {
      c.innerHTML = originBlockHtml(
        0,
        originChoice.solo,
        travelerCount(),
        false,
      );
    } else {
      c.innerHTML = DEFAULT_ORIGINS.map((k, i) =>
        originBlockHtml(i, originChoice.slots[i], originChoice.pax[i], true),
      ).join("");
    }
  }

  // flying vs driving: show the flight questionnaire or the drive block
  function applyArriveMode() {
    const drive =
      (document.querySelector('input[name="arriveMode"]:checked') || {})
        .value === "drive";
    document.getElementById("flyOnly").style.display = drive ? "none" : "";
    document.getElementById("originsContainer").style.display = drive
      ? "none"
      : "";
    document.getElementById("driveBlock").style.display = drive ? "" : "none";
    if (!drive) renderOrigins();
  }

  function syncOriginChoice() {
    const c = document.getElementById("originsContainer");
    if (sameAirportOn()) {
      const sel = c.querySelector(".origin-select");
      if (sel) originChoice.solo = sel.value;
    } else {
      c.querySelectorAll(".origin-block").forEach((b) => {
        const i = +b.dataset.slot;
        const sel = b.querySelector(".origin-select");
        const pax = b.querySelector(".origin-pax-input");
        if (sel) originChoice.slots[i] = sel.value;
        if (pax)
          originChoice.pax[i] = Math.max(0, parseInt(pax.value, 10) || 0);
      });
    }
  }

  // active origins with the selected routing + pax, from live DOM
  function computeActiveOrigins(N, same) {
    const c = document.getElementById("originsContainer");
    const out = [];
    c.querySelectorAll(".origin-block").forEach((b) => {
      const slot = +b.dataset.slot;
      const key = b.querySelector(".origin-select").value;
      const paxEl = b.querySelector(".origin-pax-input");
      const pax = same
        ? N
        : Math.max(0, parseInt((paxEl || {}).value, 10) || 0);
      if (pax <= 0) return;
      let sel, traveler, label;
      if (key === "__other") {
        const code = (
          (b.querySelector(".other-code") || {}).value || "Other"
        ).toUpperCase();
        const fare = Math.max(
          0,
          parseInt((b.querySelector(".other-fare") || {}).value, 10) || 0,
        );
        sel = {
          name: `From ${code}`,
          route: `${code} → ${DEST_LABEL}`,
          cabin: "Economy",
          stops: 1,
          fare,
        };
        traveler = code;
        label = `From ${code}`;
      } else {
        const g = FLIGHTS[key];
        sel = g.options[selectedIndex(`origin${slot}Flight`)] || g.options[0];
        traveler = g.traveler;
        label = g.label;
      }
      out.push({ key, pax, sel, traveler, label });
    });
    return out;
  }

  function renderTiers(containerId, cityKey) {
    const el = document.getElementById(containerId);
    const city = HOTELS[cityKey];
    el.innerHTML = city.options
      .map((opt, i) => {
        const q = encodeURIComponent(
          opt.name + " " + (city.header || city.label),
        );
        return `
    <label class="tier" data-rating="${opt.rating}" data-current="${opt.current ? "1" : "0"}">
      <input type="radio" name="${cityKey}Tier" value="${i}" ${i === 0 ? "checked" : ""}>
      <div>
        <div class="tier-name">${opt.name}${opt.current ? '<span class="badge">current</span>' : ""}</div>
        <div class="tier-meta"><span class="tier-rating">★ ${opt.rating}</span> · ${opt.note}</div>
      </div>
      <div class="tier-price">$${opt.rate}<small>/night/room</small></div>
      <div class="book-row">
        <span class="book-lbl">Book ↗</span>
        <a href="https://www.google.com/travel/search?q=${q}" target="_blank" rel="noopener">Google Hotels</a>
        <a href="https://www.booking.com/searchresults.html?ss=${q}" target="_blank" rel="noopener">Booking.com</a>
        <a href="https://www.expedia.com/Hotel-Search?destination=${q}" target="_blank" rel="noopener">Expedia</a>
      </div>
    </label>
  `;
      })
      .join("");
  }

  applyArriveMode();
  // the rental question only applies to trips that define a rental
  const rentalSetting = document.getElementById("rentalSetting");
  if (rentalSetting && !TRIP.transport.rental)
    rentalSetting.style.display = "none";
  document.getElementById("flightsCaveat").textContent =
    "Fares are researched representative round-trip prices for Nov 2026 — not date-locked quotes like the hotel rates. Ask to lock exact fares (Google Flights, exact dates) when the browser connection is available.";

  // build each route city's stop (header, night label, tier + activity
  // containers) from TRIP.route + hotel headers, then fill them.
  // ── generate the whole route body (legs + stops) from TRIP ────────
  // Sequence: arrival leg → each route stop (with the inter-city leg to
  // the next) → optional-city blocks (hidden) → departure leg. A single-
  // city route just omits inter-city legs; a legs-less trip omits legs.
  function legHtml(leg) {
    const nameId = leg.dynamicNameId ? ' id="' + leg.dynamicNameId + '"' : "";
    const note = leg.note
      ? ' <span class="fixed-leg">' + leg.note + "</span>"
      : "";
    const toggles = (leg.toggles || [])
      .map((t) =>
        t === "terminal"
          ? '<div class="toggle" id="airportChoice" data-terminal-toggle="' +
            leg.id +
            '"></div>'
          : '<div class="toggle" id="' +
            leg.id +
            'Mode" data-mode-toggle="' +
            leg.id +
            '"></div>',
      )
      .join("");
    const toggleHtml = (leg.toggles || []).includes("terminal")
      ? '<div style="display: flex; gap: 0.5rem; flex-wrap: wrap">' +
        toggles +
        "</div>"
      : toggles;
    const rd = leg.routeDetail
      ? '<details class="route-detail" id="rd-' + leg.id + '"></details>'
      : "";
    return (
      '<div class="leg" data-leg="' +
      leg.id +
      '"><div class="leg-marker"></div><div class="leg-row"><div class="leg-name"' +
      nameId +
      ">" +
      leg.routeName +
      note +
      "</div>" +
      toggleHtml +
      "</div>" +
      rd +
      "</div>"
    );
  }
  // state-aware inner HTML for an arrival/departure leg name (Plan tab).
  // In the default fly + renting state it reproduces routeName + note exactly.
  function legNameHtml(leg, mode, renting, enroute) {
    const gw = TRIP.meta.destLabel || "the gateway";
    const noteSpan = (t) =>
      t ? ' <span class="fixed-leg">' + t + "</span>" : "";
    if (mode === "drive") {
      const days = (enroute || 0) / 2 + 1;
      const multi = enroute > 0 ? ` (${days}-day drive each way)` : "";
      if (leg.role === "arrival")
        return (
          "Drive in to " +
          gw +
          multi +
          noteSpan(
            renting ? "grab a rental on arrival" : "your own car for the trip",
          )
        );
      return "Drive home" + multi + noteSpan("the long road back");
    }
    // flying — keep the authored text; drop the rental mention if not renting
    let name = leg.routeName || "";
    let note = leg.note || "";
    if (!renting) {
      const strip = (x) => x.replace(/\s*·\s*pick up[^·<]*/i, "");
      name = strip(name);
      note = strip(note);
    }
    return name + noteSpan(note);
  }
  function stopHtml(city, withActivities) {
    return (
      '<div class="stop" data-stop="' +
      city +
      '"><div class="stop-marker"></div><div class="stop-head"><h2>' +
      HOTELS[city].header +
      '</h2><span class="nights" id="' +
      city +
      'NightsLbl"></span></div><div class="tier-list rateable" id="' +
      city +
      'Tiers"></div>' +
      (withActivities
        ? '<div class="activities-label">Activities (optional paid upgrades)</div><div id="' +
          city +
          'Activities"></div>'
        : "") +
      "</div>"
    );
  }
  function renderRouteBody() {
    const legs = TRIP.transport.legs;
    const byRole = (r) => legs.find((l) => l.role === r);
    const interLeg = (from, to) =>
      legs.find((l) => l.from === from && l.to === to);
    let html = "";
    const arrival = byRole("arrival");
    if (arrival) html += legHtml(arrival);
    TRIP.meta.route.forEach((c, i) => {
      html += stopHtml(c, true);
      if (i < TRIP.meta.route.length - 1) {
        const l = interLeg(c, TRIP.meta.route[i + 1]);
        if (l) html += legHtml(l);
      }
    });
    TRIP.meta.optionalCities.forEach((oc) => {
      const oleg = legs.find((l) => l.role === "optional" && l.to === oc);
      html +=
        '<div id="' +
        oc +
        'Block" style="display: none">' +
        (oleg ? legHtml(oleg) : "") +
        stopHtml(oc, false) +
        "</div>";
    });
    const departure = byRole("departure");
    if (departure) html += legHtml(departure);
    document.getElementById("routeBody").innerHTML = html;
  }
  renderRouteBody();

  TRIP.meta.route.forEach((c) => renderTiers(c + "Tiers", c));
  TRIP.meta.optionalCities.forEach((c) => renderTiers(c + "Tiers", c));

  TRIP.meta.route.forEach((c) => renderActivities(c + "Activities", c));

  // route-detail step breakdowns are optional per trip (Japan has them)
  if (ROUTE_DETAIL && ROUTE_DETAIL.th)
    renderRouteDetail("rd-th", ROUTE_DETAIL.th);
  if (ROUTE_DETAIL && ROUTE_DETAIL.hk)
    renderRouteDetail("rd-hk", ROUTE_DETAIL.hk);

  // ── generate the transport toggles from TRIP.transport.legs ───────
  // Builds the same radios/labels the engine expects (ids by ctrl prefix),
  // so a leg's mode/terminal options are a data change, not markup.
  function legToggleOptionsHtml(name, prefix, options, withLabelId) {
    return Object.keys(options)
      .map((key, i) => {
        const inputId = prefix + "-" + key;
        const lblId = withLabelId ? ` id="${inputId}-lbl"` : "";
        return (
          `<input type="radio" name="${name}" id="${inputId}" value="${key}"${i === 0 ? " checked" : ""} />` +
          `<label for="${inputId}"${lblId}>${options[key].label}</label>`
        );
      })
      .join("");
  }
  function renderTransportControls() {
    const legById = (id) => TRIP.transport.legs.find((l) => l.id === id);
    document.querySelectorAll("[data-mode-toggle]").forEach((el) => {
      const leg = legById(el.dataset.modeToggle);
      el.innerHTML = legToggleOptionsHtml(
        leg.modeControl,
        leg.ctrlPrefix || leg.id,
        leg.modes,
        true,
      );
    });
    document.querySelectorAll("[data-terminal-toggle]").forEach((el) => {
      const leg = legById(el.dataset.terminalToggle);
      el.innerHTML = legToggleOptionsHtml(
        leg.terminalControl,
        leg.ctrlPrefix || leg.id,
        leg.terminals,
        false,
      );
    });
  }
  renderTransportControls();

  // ── generate the flexible-night selector from TRIP.meta ───────────
  // route cities → "+1 <City>", optional cities → "Add <City>";
  // default selection from meta.flexNightDefault.
  // per-stop nights: default = base (+1 on the trip's flex-night city),
  // optional cities start at 0. Users step any stop up or down.
  const NIGHT_STATE = {};
  const NIGHT_MAX = 9;
  (function initNightState() {
    const m = TRIP.meta;
    m.route.forEach(
      (c) =>
        (NIGHT_STATE[c] =
          HOTELS[c].baseNights + (c === m.flexNightDefault ? 1 : 0)),
    );
    m.optionalCities.forEach(
      (c) => (NIGHT_STATE[c] = c === m.flexNightDefault ? 1 : 0),
    );
  })();
  function nightMin(city) {
    return TRIP.meta.optionalCities.includes(city) ? 0 : 1;
  }
  function renderNightSteppers() {
    const m = TRIP.meta;
    const row = (c) => {
      const n = NIGHT_STATE[c];
      const lo = n <= nightMin(c) ? " disabled" : "";
      const hi = n >= NIGHT_MAX ? " disabled" : "";
      return (
        `<div class="nightstep"><span class="ns-city">${HOTELS[c].label}</span>` +
        `<button type="button" class="ns-btn" data-city="${c}" data-delta="-1" aria-label="one fewer night in ${HOTELS[c].label}"${lo}>−</button>` +
        `<span class="ns-val" id="ns-${c}">${n}</span>` +
        `<button type="button" class="ns-btn" data-city="${c}" data-delta="1" aria-label="one more night in ${HOTELS[c].label}"${hi}>+</button></div>`
      );
    };
    document.getElementById("extraNightSeg").innerHTML = m.route
      .concat(m.optionalCities)
      .map(row)
      .join("");
  }
  renderNightSteppers();
  document.getElementById("extraNightSeg").addEventListener("click", (e) => {
    const btn = e.target.closest(".ns-btn");
    if (!btn) return;
    const c = btn.dataset.city;
    const next = (NIGHT_STATE[c] || 0) + parseInt(btn.dataset.delta, 10);
    if (next < nightMin(c) || next > NIGHT_MAX) return;
    NIGHT_STATE[c] = next;
    renderNightSteppers();
    recalc();
    renderItinerary();
  });

  function applyRatingFilter() {
    const floor = parseFloat(document.getElementById("minRating").value);
    const min = isNaN(floor) ? 0 : floor;
    document.querySelectorAll(".tier-list.rateable").forEach((list) => {
      let visibleChecked = false;
      let firstVisible = null;
      let currentEl = null;
      list.querySelectorAll(".tier").forEach((tier) => {
        const rating = parseFloat(tier.dataset.rating);
        const isCurrent = tier.dataset.current === "1";
        const show = isCurrent || rating >= min;
        tier.style.display = show ? "" : "none";
        if (isCurrent) currentEl = tier;
        if (show && !firstVisible) firstVisible = tier;
        if (show && tier.querySelector("input").checked) visibleChecked = true;
      });
      if (!visibleChecked) {
        const fallback = currentEl || firstVisible;
        if (fallback) fallback.querySelector("input").checked = true;
      }
    });
  }

  function selectedIndex(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value, 10) : 0;
  }

  function selectedValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  }

  function pickActivities(cityKey) {
    const acts = ACTIVITIES[cityKey] || [];
    let total = 0;
    const chosen = [];
    acts.forEach((act, ai) => {
      const idx = selectedIndex(`${cityKey}Act${ai}`);
      const opt = act.options[idx];
      total += opt.cost;
      if (opt.cost > 0)
        chosen.push({
          day: act.day,
          title: act.title,
          name: opt.name,
          cost: opt.cost,
        });
    });
    return { total, chosen };
  }

  function fmt(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function fmt2(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function recalc() {
    applyRatingFilter();

    // Hotel rooms cap at 2 adults each (per the researched room types), so party size
    // determines rooms needed, not a per-head multiplier. Public transit fares are
    // genuinely per-passenger (linear with N). Private transfers are a flat per-vehicle
    // rate — this models 1 vehicle covering up to 4 people, a simplifying assumption.
    const N = Math.max(
      1,
      parseInt(document.getElementById("travelerCount").value, 10) || 2,
    );
    const rooms = Math.ceil(N / 2);
    const personFactor = N / 2;
    const vehicleFactor = Math.ceil(N / 4);
    document
      .querySelectorAll(".traveler-count-lbl")
      .forEach((el) => (el.textContent = N));

    const osakaMode = TRIP.meta.optionalCities.some(
      (c) => (NIGHT_STATE[c] || 0) > 0,
    );
    // show the selected optional-city block, hide the rest (guarded per trip)
    TRIP.meta.optionalCities.forEach((oc) => {
      const block = document.getElementById(oc + "Block");
      if (block)
        block.style.display = (NIGHT_STATE[oc] || 0) > 0 ? "block" : "none";
    });
    const finalName = document.getElementById("finalLegName");
    if (finalName)
      finalName.innerHTML = osakaMode
        ? "<strong>Osaka</strong> → Kansai Airport"
        : "<strong>Kyoto</strong> → Kansai Airport";
    const finalModeEl = document.getElementById("finalMode");
    if (finalModeEl)
      finalModeEl.style.display = osakaMode ? "none" : "inline-flex";

    // nights per city come straight from the steppers
    const nights = {};
    TRIP.meta.route
      .concat(TRIP.meta.optionalCities)
      .forEach((c) => (nights[c] = NIGHT_STATE[c] || 0));

    TRIP.meta.route.concat(TRIP.meta.optionalCities).forEach((c) => {
      const el = document.getElementById(c + "NightsLbl");
      if (!el) return;
      const n = nights[c] || 0;
      el.textContent = n + " night" + (n !== 1 ? "s" : "");
    });
    const totalNightsAll = Object.values(nights).reduce((a, b) => a + b, 0);
    document.getElementById("extraNightHint").textContent =
      totalNightsAll + " night" + (totalNightsAll !== 1 ? "s" : "") + " total";

    // lodging cost per city (route + optional), from the chosen tier
    const hotelCost = {};
    TRIP.meta.route.concat(TRIP.meta.optionalCities).forEach((c) => {
      const rate = HOTELS[c].options[selectedIndex(c + "Tier")].rate;
      hotelCost[c] = rate * (nights[c] || 0) * rooms;
    });

    // activities per route city (2-adult totals, scaled by personFactor)
    let activitiesTotal = 0;
    const chosenActivities = [];
    TRIP.meta.route.forEach((c) => {
      const a = pickActivities(c);
      activitiesTotal += a.total;
      chosenActivities.push(...a.chosen);
    });
    const activitiesCost = activitiesTotal * personFactor;

    // legs are iterated from data; these helpers read a leg by id + scale a fare
    const scaleOf = (scale) =>
      scale === "vehicle" ? vehicleFactor : personFactor;

    // Per-leg cost, computed generically by leg shape (2D terminal, mode
    // toggle, flat, or fixed add-on). `when` gates the optional-detour legs,
    // so a per-vehicle drive leg or per-person rail segment sums the same way.
    const legCost = (leg) => {
      if (leg.when === "osaka" && !osakaMode) return 0;
      if (leg.when === "noOsaka" && osakaMode) return 0;
      let c = 0;
      if (leg.terminals) {
        const t = selectedValue(leg.terminalControl);
        const m = selectedValue(leg.modeControl);
        c = leg.cost[t][m] * scaleOf(leg.modes[m].scale);
      } else if (leg.modes) {
        const m = selectedValue(leg.modeControl);
        c = leg.cost[m] * scaleOf(leg.modes[m].scale);
      } else if (leg.flat) {
        c = leg.flat.cost * scaleOf(leg.flat.scale);
      }
      if (leg.fixed) c += leg.fixed.cost * scaleOf(leg.fixed.scale);
      return c;
    };
    const legCosts = {};
    TRIP.transport.legs.forEach((l) => {
      legCosts[l.id] = legCost(l);
    });

    // set each toggle's two labels from its mode labels + costs — any leg
    // with a mode choice, not just the Japan four.
    TRIP.transport.legs.forEach((l) => {
      if (!l.modes) return;
      const prefix = l.ctrlPrefix || l.id;
      const costObj = l.terminals
        ? l.cost[selectedValue(l.terminalControl)]
        : l.cost;
      const pub = document.getElementById(prefix + "-public-lbl");
      const pri = document.getElementById(prefix + "-private-lbl");
      if (pub) pub.textContent = l.modes.public.label + " $" + costObj.public;
      if (pri) pri.textContent = l.modes.private.label + " $" + costObj.private;
    });

    // route-detail step breakdowns are Japan-specific; render only if present
    const airport = selectedValue("airport");
    if (ROUTE_DETAIL && ROUTE_DETAIL.airport)
      renderRouteDetail("rd-airport", ROUTE_DETAIL.airport[airport]);
    if (ROUTE_DETAIL && ROUTE_DETAIL.final)
      renderRouteDetail(
        "rd-final",
        osakaMode ? ROUTE_DETAIL.final.osaka : ROUTE_DETAIL.final.direct,
      );

    // named leg values the itinerary/breakdown still read (Japan legs);
    // undefined for other trips, which use the generic paths downstream.
    const airportMode = selectedValue("airportmode");
    const thMode = selectedValue("thmode");
    const hkMode = selectedValue("hkmode");
    const finalMode = osakaMode ? null : selectedValue("finalmode");
    const airportCost = legCosts.airport;
    const thCost = legCosts.th;
    const hkCost = legCosts.hk;
    let finalCost, kyotoOsakaCost, osakaAirportCost;
    if (osakaMode) {
      kyotoOsakaCost = legCosts.kyotoOsaka;
      osakaAirportCost = legCosts.osakaAirport;
      finalCost = kyotoOsakaCost + osakaAirportCost;
    } else {
      finalCost = legCosts.final;
    }

    const arriveMode =
      (document.querySelector('input[name="arriveMode"]:checked') || {})
        .value === "drive"
        ? "drive"
        : "fly";
    const sameAirport = sameAirportOn();
    let origins,
      flightsCost,
      fuelCost = 0,
      enrouteNights = 0,
      enrouteLodging = 0;
    if (arriveMode === "drive") {
      origins = [];
      const miles = Math.max(
        0,
        parseFloat((document.getElementById("driveMiles") || {}).value) || 0,
      );
      const mpg = Math.max(
        1,
        parseFloat((document.getElementById("driveMpg") || {}).value) || 25,
      );
      const gallons = (miles * 2 * DRIVE_PAD) / mpg; // round trip + detour padding
      fuelCost = Math.round(gallons * FUEL_PRICE);
      const driveDays = Math.max(
        1,
        parseInt((document.getElementById("driveDays") || {}).value, 10) || 1,
      );
      const stopRate = Math.max(
        0,
        parseInt((document.getElementById("driveStopRate") || {}).value, 10) ||
          0,
      );
      enrouteNights = (driveDays - 1) * 2; // an overnight each way per extra day
      enrouteLodging = enrouteNights * stopRate * rooms;
      flightsCost = fuelCost + enrouteLodging;
      const dco = document.getElementById("driveCostOut");
      if (dco) dco.textContent = "$" + fuelCost.toLocaleString("en-US");
      const dso = document.getElementById("driveStopsOut");
      if (dso)
        dso.textContent =
          enrouteNights === 0
            ? "0"
            : enrouteNights + " (" + enrouteNights / 2 + " each way)";
    } else {
      origins = computeActiveOrigins(N, sameAirport);
      flightsCost = origins.reduce((s, o) => s + o.sel.fare * o.pax, 0);
    }
    const originsLabel =
      origins.length === 1 ? "1 origin" : origins.length + " origins";
    const fc = document.getElementById("flightsCount");
    if (fc)
      fc.textContent =
        arriveMode === "drive" ? "self-drive" : originsLabel + " · round trip";

    // optional rental car (road trips): perDay × total nights × vehicles.
    const totalNights = Object.values(nights).reduce((a, b) => a + b, 0);
    const renting =
      !!TRIP.transport.rental &&
      (document.querySelector('input[name="renting"]:checked') || {}).value !==
        "no";
    // Not renting still keeps the one-time extras (fuel + park pass) — you
    // drove your own car; only the per-day rental drops.
    const R = TRIP.transport.rental;
    const rentalCost = R
      ? (renting ? R.perDay * totalNights + (R.oneTime || 0) : R.oneTime || 0) *
        vehicleFactor
      : 0;
    const rentalLabel = R
      ? renting
        ? R.label
        : R.ownCarLabel || "Fuel + park pass (own car)"
      : "";
    // keep the Plan-tab arrival/departure leg text in sync with fly/drive + rental
    ["arrival", "departure"].forEach((role) => {
      const leg = TRIP.transport.legs.find((l) => l.role === role);
      if (!leg || leg.dynamicNameId) return;
      const el = document.querySelector(
        '[data-leg="' + leg.id + '"] .leg-name',
      );
      if (el)
        el.innerHTML = legNameHtml(leg, arriveMode, renting, enrouteNights);
    });
    const transportTotal =
      Object.values(legCosts).reduce((s, c) => s + c, 0) + rentalCost;
    const hotelSubtotal = Object.values(hotelCost).reduce((s, v) => s + v, 0);
    const lodgingBuffer = hotelSubtotal * (LODGING_TAX_BUFFER - 1);
    const hotelTotal = hotelSubtotal + lodgingBuffer;
    const groundTotal = transportTotal + hotelTotal + activitiesCost;
    const grand = groundTotal + flightsCost;

    document.getElementById("grandTotal").textContent = fmt(grand);

    // Optional reference comparison (a packaged quote). DIY trips with no
    // quote omit meta.reference, and the delta line stays empty.
    const deltaEl = document.getElementById("deltaLine");
    if (TRIP.meta.reference) {
      // The quote was ground + tour only (no airfare), so the delta compares
      // ground-only to keep it apples-to-apples.
      const scaledReference = REFERENCE_TOTAL * personFactor;
      const delta = groundTotal - scaledReference;
      const refLabel =
        N === 2
          ? fmt(REFERENCE_TOTAL)
          : fmt(scaledReference) +
            " (scaled from the 2-traveler " +
            TRIP.meta.reference.label +
            ")";
      deltaEl.textContent =
        fmt(Math.abs(delta)) +
        (delta < 0 ? " under the " : " over the ") +
        refLabel +
        " reference (ground only; flights extra)";
      deltaEl.className = delta < 0 ? "delta save" : "delta";
    } else {
      deltaEl.textContent = "";
      deltaEl.className = "delta";
    }

    const roomsSuffix = rooms > 1 ? ` (${rooms} rooms)` : "";
    const rows = [];
    if (arriveMode === "drive") {
      if (fuelCost > 0)
        rows.push(["Getting there — driving (est. fuel)", fuelCost]);
      if (enrouteLodging > 0)
        rows.push([
          `Drive — ${enrouteNights} overnight stop${enrouteNights > 1 ? "s" : ""}`,
          enrouteLodging,
        ]);
    } else {
      rows.push([
        "Flights — getting there (" + originsLabel + ")",
        flightsCost,
      ]);
    }
    TRIP.meta.route.forEach((c) => {
      rows.push([HOTELS[c].label + " lodging" + roomsSuffix, hotelCost[c]]);
    });
    TRIP.meta.optionalCities.forEach((c) => {
      if ((nights[c] || 0) > 0)
        rows.push([HOTELS[c].label + " lodging" + roomsSuffix, hotelCost[c]]);
    });
    rows.push([
      `Lodging taxes/fees buffer (+${Math.round((LODGING_TAX_BUFFER - 1) * 100)}%)`,
      lodgingBuffer,
    ]);
    if (legCosts.airport !== undefined && legCosts.th !== undefined) {
      // Japan grouping (combined hk+Shinkansen and osaka legs), kept exactly
      rows.push(["Airport transfer", airportCost]);
      rows.push(["Tokyo↔Hakone", thCost]);
      rows.push(["Hakone↔Kyoto (+Shinkansen)", hkCost]);
      rows.push([
        osakaMode ? "Kyoto↔Osaka↔Airport" : "Kyoto↔Airport",
        finalCost,
      ]);
    } else {
      // generic: one row per active leg, labeled from leg data
      TRIP.transport.legs.forEach((l) => {
        if (l.role === "cost") return; // folded into another leg's row
        const c = legCosts[l.id];
        if (c > 0)
          rows.push([
            l.breakdownLabel || l.routeName.replace(/<[^>]+>/g, ""),
            c,
          ]);
      });
    }
    if (rentalCost > 0) rows.push([rentalLabel, rentalCost]);
    if (activitiesCost > 0)
      rows.push(["Activities (optional)", activitiesCost]);

    document.getElementById("breakdown").innerHTML = rows
      .map(
        ([label, val]) => `
    <div class="breakdown-row"><span>${label}</span><span>${fmt(val)}</span></div>
  `,
      )
      .join("");

    // stash computed state for the itinerary generator
    window.__state = {
      osakaMode,
      nights,
      N,
      rooms,
      arriveMode,
      renting,
      rentalCost,
      rentalLabel,
      origins,
      flightsCost,
      fuelCost,
      enrouteNights,
      enrouteLodging,
      airport,
      airportMode,
      airportCost,
      thMode,
      thCost,
      hkMode,
      hkCost,
      finalMode,
      finalCost,
      kyotoOsakaCost,
      osakaAirportCost,
      legCosts,
      activitiesCost,
      chosenActivities,
      hotelSubtotal,
      lodgingBuffer,
      hotelTotal,
      grand,
    };
    // stash each city's chosen hotel by city key (route + optional) so the
    // itinerary/exports read s[cityKey] for any trip, not just Japan's four.
    TRIP.meta.route.concat(TRIP.meta.optionalCities).forEach((c) => {
      window.__state[c] = HOTELS[c].options[selectedIndex(c + "Tier")];
    });
  }

  function toDate(iso) {
    return new Date(iso + "T00:00:00");
  }

  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  function fmtDate(d) {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function buildItinerary() {
    const s = window.__state;
    // ponytail: legacy Japan-shaped budget text; any other trip uses the generic narrative builder
    if (!(s.tokyo && s.hakone && s.kyoto)) return buildItinText();
    const lines = [];
    let cursor = toDate(TRIP_START);
    const totalNights =
      s.nights.tokyo + s.nights.hakone + s.nights.kyoto + s.nights.osaka;

    const push = (d, title, detail) => {
      lines.push(`${fmtDate(d)}  —  ${title}`);
      if (detail) lines.push(`  ${detail}`);
    };

    lines.push("JAPAN TRIP — DIY ITINERARY");
    lines.push(
      `${fmtDate(cursor)} → ${fmtDate(addDays(cursor, totalNights))}  ·  ${s.N} traveler${s.N > 1 ? "s" : ""}, ${s.rooms} room${s.rooms > 1 ? "s" : ""}`,
    );
    lines.push("");

    if (s.arriveMode === "drive") {
      lines.push("GETTING THERE (driving)");
      if (s.fuelCost > 0)
        lines.push(`  Drive to the start — fuel ($${fmt2(s.fuelCost)})`);
      if (s.enrouteLodging > 0)
        lines.push(
          `  En-route overnight stops — ${s.enrouteNights}n ($${fmt2(s.enrouteLodging)})`,
        );
    } else {
      lines.push("GETTING THERE (international flights, round trip)");
      s.origins.forEach((o) =>
        lines.push(
          `  ${o.traveler}: ${o.sel.name} — ${o.sel.route}, ${o.sel.cabin} ($${fmt2(o.sel.fare * o.pax)})`,
        ),
      );
    }
    lines.push("");

    const tokyoNightCost = s.tokyo.rate * s.rooms;
    const hakoneNightCost = s.hakone.rate * s.rooms;
    const kyotoNightCost = s.kyoto.rate * s.rooms;
    const osakaNightCost = s.osaka.rate * s.rooms;

    // Tokyo
    push(
      cursor,
      "Arrive Tokyo",
      `Airport (${s.airport === "nrt" ? "Narita" : "Haneda"}) → hotel: ${s.airportMode === "public" ? "train/bus" : "private car"} ($${fmt2(s.airportCost)})`,
    );
    lines.push(
      `  Stay: ${s.tokyo.name} — $${s.tokyo.rate}/night/room × ${s.rooms} room(s) × ${s.nights.tokyo} = $${fmt2(tokyoNightCost * s.nights.tokyo)}`,
    );
    for (let i = 1; i < s.nights.tokyo; i++) {
      cursor = addDays(cursor, 1);
      push(cursor, "Tokyo");
    }

    // -> Hakone
    cursor = addDays(cursor, 1);
    push(
      cursor,
      "Tokyo → Hakone",
      `${s.thMode === "public" ? "Odakyu Romancecar" : "Private car"} ($${fmt2(s.thCost)})`,
    );
    lines.push(
      `  Stay: ${s.hakone.name} — $${s.hakone.rate}/night/room × ${s.rooms} room(s) × ${s.nights.hakone} = $${fmt2(hakoneNightCost * s.nights.hakone)}`,
    );
    for (let i = 1; i < s.nights.hakone; i++) {
      cursor = addDays(cursor, 1);
      push(cursor, "Hakone");
    }

    // -> Kyoto
    cursor = addDays(cursor, 1);
    push(
      cursor,
      "Hakone → Kyoto",
      `Shinkansen + ${s.hkMode === "public" ? "bus/subway" : "taxi both ends"} ($${fmt2(s.hkCost)})`,
    );
    lines.push(
      `  Stay: ${s.kyoto.name} — $${s.kyoto.rate}/night/room × ${s.rooms} room(s) × ${s.nights.kyoto} = $${fmt2(kyotoNightCost * s.nights.kyoto)}`,
    );
    for (let i = 1; i < s.nights.kyoto; i++) {
      cursor = addDays(cursor, 1);
      push(cursor, "Kyoto");
    }

    if (s.osakaMode) {
      cursor = addDays(cursor, 1);
      push(
        cursor,
        "Kyoto → Osaka",
        `Kintetsu Ltd. Express ($${fmt2(s.kyotoOsakaCost)})`,
      );
      lines.push(
        `  Stay: ${s.osaka.name} — $${s.osaka.rate}/night/room × ${s.rooms} room(s) = $${fmt2(osakaNightCost)}`,
      );
      cursor = addDays(cursor, 1);
      push(
        cursor,
        "Depart — Osaka → Kansai Airport",
        `Nankai Rapi:t ($${fmt2(s.osakaAirportCost)})`,
      );
    } else {
      cursor = addDays(cursor, 1);
      push(
        cursor,
        "Depart — Kyoto → Kansai Airport",
        `${s.finalMode === "public" ? "JR Haruka" : "Private car"} ($${fmt2(s.finalCost)})`,
      );
    }

    if (s.chosenActivities.length) {
      lines.push("");
      lines.push("SELECTED ACTIVITIES (paid upgrades)");
      s.chosenActivities.forEach((a) => {
        lines.push(
          `  Day ${a.day} — ${a.title}: ${a.name} ($${fmt2((a.cost * s.N) / 2)})`,
        );
      });
    }

    lines.push("");
    lines.push("COST SUMMARY");
    lines.push(`  Flights (getting there)  $${fmt2(s.flightsCost)}`);
    lines.push(
      `  Tokyo lodging (${s.nights.tokyo}n × ${s.rooms} room(s))   $${fmt2(tokyoNightCost * s.nights.tokyo)}`,
    );
    lines.push(
      `  Hakone lodging (${s.nights.hakone}n × ${s.rooms} room(s))  $${fmt2(hakoneNightCost * s.nights.hakone)}`,
    );
    lines.push(
      `  Kyoto lodging (${s.nights.kyoto}n × ${s.rooms} room(s))   $${fmt2(kyotoNightCost * s.nights.kyoto)}`,
    );
    if (s.osakaMode)
      lines.push(
        `  Osaka lodging (1n × ${s.rooms} room(s))    $${fmt2(osakaNightCost)}`,
      );
    lines.push(
      `  Lodging taxes/fees buffer (+${Math.round((LODGING_TAX_BUFFER - 1) * 100)}%)  $${fmt2(s.lodgingBuffer)}`,
    );
    lines.push(
      `  Transport (all legs)  $${fmt2(s.airportCost + s.thCost + s.hkCost + s.finalCost)}`,
    );
    if (s.activitiesCost > 0)
      lines.push(`  Activities (optional) $${fmt2(s.activitiesCost)}`);
    lines.push(`  ${"-".repeat(28)}`);
    lines.push(
      `  TOTAL                 $${Math.round(s.grand).toLocaleString("en-US")}`,
    );
    lines.push("");
    if (TRIP.meta.reference) {
      lines.push(
        s.N === 2
          ? `Reference: Kensington Tours quoted $9,644 for this route (placeholder Nov 7–14 dates, not the actual Nov 14–22 travel window).`
          : `Reference: Kensington Tours quoted $9,644 for 2 travelers on this route (placeholder Nov 7–14 dates) — scaled linearly to $${fmt2((REFERENCE_TOTAL * s.N) / 2)} for ${s.N} travelers as a rough comparison, not a real quote.`,
      );
      lines.push("");
    }
    lines.push(
      "Flights ARE included above (researched representative Nov-2026 round-trip fares, not date-locked quotes). Excludes: ~10% Japan accommodation tax, meals beyond included breakfasts, and entrance/admission fees for self-guided activities (paid activity upgrades above ARE included in the total).",
    );
    lines.push(
      "Private-transfer costs assume 1 vehicle seats up to 4 travelers; larger groups may need a second vehicle.",
    );

    return lines.join("\n");
  }

  function buildRows() {
    const s = window.__state;
    const rows = [];
    let cursor = toDate(TRIP_START);
    const add = (category, title, detail, cost) =>
      rows.push({ date: new Date(cursor), category, title, detail, cost });

    const roomNote = `${s.rooms} room${s.rooms > 1 ? "s" : ""}`;

    if (s.arriveMode === "drive") {
      if (s.fuelCost > 0)
        add(
          "Getting there",
          "Drive to the start",
          "Estimated premium fuel, round trip (+15%)",
          s.fuelCost,
        );
      if (s.enrouteLodging > 0)
        add(
          "Getting there",
          "En-route overnight stops",
          `${s.enrouteNights} night${s.enrouteNights > 1 ? "s" : ""} of lodging on the drive`,
          s.enrouteLodging,
        );
    } else {
      s.origins.forEach((o) =>
        add(
          "Flight",
          `${o.traveler} — ${o.sel.name}`,
          `${o.sel.route}, ${o.sel.cabin}, round trip`,
          o.sel.fare * o.pax,
        ),
      );
    }

    // day-by-day rows, generically from the trip data: the arrival leg,
    // then each stop's nights + the leg into the next stop, then departure.
    const legRow = (legId) => {
      const m = moveData(legId, s);
      if (m && m.lead) add("Transport", m.lead, m.detail, m.cost || 0);
    };
    const arrivalLeg = TRIP.transport.legs.find((l) => l.role === "arrival");
    if (arrivalLeg) legRow(arrivalLeg.id);

    const stops = TRIP.meta.route
      .concat(TRIP.meta.optionalCities)
      .filter((c) => (s.nights[c] || 0) > 0);
    stops.forEach((city, idx) => {
      for (let i = 0; i < s.nights[city]; i++) {
        add(
          "Lodging",
          s[city].name,
          `${HOTELS[city].label}, per night (${roomNote})`,
          s[city].rate * s.rooms,
        );
        if (i < s.nights[city] - 1) cursor = addDays(cursor, 1);
      }
      cursor = addDays(cursor, 1);
      const next = stops[idx + 1];
      if (next) {
        const leg =
          TRIP.transport.legs.find((l) => l.from === city && l.to === next) ||
          TRIP.transport.legs.find(
            (l) => l.role === "optional" && l.to === next,
          );
        if (leg) legRow(leg.id);
      }
    });
    const departureLeg = TRIP.transport.legs.find(
      (l) => l.role === "departure",
    );
    if (departureLeg) legRow(departureLeg.id);

    s.chosenActivities.forEach((a) => {
      rows.push({
        date: addDays(toDate(TRIP_START), a.day - 1),
        category: "Activity",
        title: a.title,
        detail: a.name,
        cost: (a.cost * s.N) / 2,
      });
    });
    rows.sort((a, b) => a.date - b.date);

    return rows;
  }

  function csvEscape(v) {
    const str = String(v);
    return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
  }

  function buildCSV() {
    const s = window.__state;
    const rows = buildRows();
    const out = [];
    out.push([`${TRIP_NAME} Trip — DIY Itinerary`]);
    out.push([
      `${fmtDate(toDate(TRIP_START))} to ${fmtDate(addDays(toDate(TRIP_START), Object.values(s.nights).reduce((a, b) => a + (b || 0), 0)))}`,
      `${s.N} travelers, ${s.rooms} room(s)`,
    ]);
    out.push([]);
    out.push([
      "Date",
      "Category",
      "Item",
      "Detail",
      `Cost USD (${s.N} travelers)`,
    ]);
    rows.forEach((r) =>
      out.push([
        fmtDate(r.date),
        r.category,
        r.title,
        r.detail,
        Math.round(r.cost),
      ]),
    );
    out.push([
      "",
      "Lodging",
      `Taxes/fees buffer (+${Math.round((LODGING_TAX_BUFFER - 1) * 100)}%)`,
      "Applied to lodging subtotal only",
      Math.round(s.lodgingBuffer),
    ]);
    if (s.rentalCost > 0)
      out.push([
        "",
        "Transport",
        s.rentalLabel,
        "Whole trip",
        Math.round(s.rentalCost),
      ]);
    out.push([]);
    out.push(["", "", "", "TOTAL", Math.round(s.grand)]);
    if (TRIP.meta.reference) {
      out.push([
        "",
        "",
        "",
        `Kensington reference (2 travelers, placeholder Nov 7–14 dates)`,
        REFERENCE_TOTAL,
      ]);
      if (s.N !== 2)
        out.push([
          "",
          "",
          "",
          `Kensington reference scaled to ${s.N} travelers (rough, not a real quote)`,
          Math.round((REFERENCE_TOTAL * s.N) / 2),
        ]);
    }
    return "﻿" + out.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  }

  function tryFileDownload() {
    // Best-effort: works when the page runs in a normal (non-sandboxed) browser tab.
    // Sandboxed hosting contexts often block this silently, which is why the modal
    // below is the guaranteed path, not just a fallback shown on failure.
    try {
      const blob = new Blob([buildCSV()], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "japan-trip-itinerary.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      /* ignored — the modal below still gives the user the data */
    }
  }

  const modalOverlay = document.getElementById("modalOverlay");
  const shareOutput = document.getElementById("shareOutput");
  const modalTitle = document.getElementById("modalTitle");
  const modalNote = document.getElementById("modalNote");

  document
    .getElementById("downloadXlsxBtn")
    .addEventListener("click", () => downloadExcel(true));

  document.getElementById("generateBtn").addEventListener("click", () => {
    modalTitle.textContent = "Shareable itinerary";
    modalNote.style.display = "none";
    shareOutput.value = buildItinerary();
    modalOverlay.classList.add("open");
    shareOutput.focus();
    shareOutput.setSelectionRange(0, 0);
  });

  function closeModal() {
    modalOverlay.classList.remove("open");
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document
    .getElementById("modalCloseBottom")
    .addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    const btn = document.getElementById("copyBtn");
    try {
      await navigator.clipboard.writeText(shareOutput.value);
    } catch {
      shareOutput.select();
      document.execCommand("copy");
    }
    btn.textContent = "Copied ✓";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy to clipboard";
      btn.classList.remove("copied");
    }, 1600);
  });

  // structural re-renders for the origins questionnaire (run before the
  // document-level recalc via bubbling, so recalc sees fresh DOM)
  document.getElementById("originQuiz").addEventListener("change", (e) => {
    if (e.target.name === "arriveMode") {
      applyArriveMode();
    } else if (e.target.name === "sameAirport") {
      syncOriginChoice();
      renderOrigins();
    }
  });
  document
    .getElementById("originsContainer")
    .addEventListener("change", (e) => {
      if (e.target.classList.contains("origin-select")) {
        syncOriginChoice();
        renderOrigins();
      }
    });
  document.addEventListener("change", recalc);
  document.getElementById("travelerCount").addEventListener("input", recalc);
  document.getElementById("minRating").addEventListener("input", recalc);
  ["driveMiles", "driveMpg", "driveDays", "driveStopRate"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", recalc);
  });
  recalc();

  /* ============================================================
   ITINERARY VIEW — narrative day-by-day rendered from the SAME
   selections the ledger computes (window.__state). Reuses
   TRIP_START / toDate / addDays / fmtDate / fmt / fmt2 / ACTIVITIES.
   ============================================================ */

  // Narrative pools (experience only). Concrete hotel/transport/cost
  // rows are injected from __state at render time, so they always
  // reflect the Plan-tab choices. First entry per city is the travel-in day.

  const ITIN_POOL = TRIP.itinPool;

  function itinDepartDay(osakaMode) {
    // trips can supply their own departure day; Japan uses the built-in below
    if (TRIP.itinDepart) return TRIP.itinDepart;
    return {
      id: "depart",
      travel: true,
      move: "final",
      sun: "16:46",
      cityTag: (osakaMode ? "Osaka" : "Kyoto") + " → home",
      title: "Kansai Airport, and the long way home",
      rows: [
        {
          tag: "Note",
          kind: "soft",
          detail:
            "~" +
            (osakaMode ? "40 min" : "2 hrs") +
            " to the gate — build in buffer and have Visit Japan Web ready. Tax-free refunds are processed at the airport under the Nov 2026 rules; keep receipts and passports handy.",
        },
      ],
      ask: "when do our flights home actually leave? That sets how much of the morning is ours.",
    };
  }

  let ITIN_PACE = "relaxed"; // relaxed | classic | custom
  const itinFuller = {}; // dayId -> bool (custom mode)
  let SHOW_PRICES = false;

  function itinFullerOn(id) {
    if (ITIN_PACE === "classic") return true;
    if (ITIN_PACE === "relaxed") return false;
    return !!itinFuller[id];
  }

  // transport for a travel day, derived from current selections
  function moveData(move, s) {
    switch (move) {
      case "airport": {
        const an = s.airport === "nrt" ? "Narita" : "Haneda";
        const m = s.airportMode === "public" ? "train/bus" : "private car";
        return {
          lead: an + " → Tokyo (Gotanda)",
          detail: "by " + m,
          cost: s.airportCost,
        };
      }
      case "th": {
        const m = s.thMode === "public" ? "Odakyu Romancecar" : "private car";
        return { lead: "Tokyo → Hakone", detail: m, cost: s.thCost };
      }
      case "hk": {
        const m = s.hkMode === "public" ? "bus/subway" : "taxi both ends";
        return {
          lead: "Hakone → Kyoto",
          detail: "Shinkansen (Hikari) + " + m,
          cost: s.hkCost,
        };
      }
      case "kyotoOsaka":
        return {
          lead: "Kyoto → Osaka",
          detail: "Kintetsu Ltd. Express (direct)",
          cost: s.kyotoOsakaCost,
        };
      case "final":
        if (s.osakaMode)
          return {
            lead: "Osaka → Kansai Airport",
            detail: "Nankai Rapi:t",
            cost: s.osakaAirportCost,
          };
        return {
          lead: "Kyoto → Kansai Airport",
          detail: s.finalMode === "public" ? "JR Haruka" : "private car",
          cost: s.finalCost,
        };
      default: {
        // generic fallback for any non-Japan leg: derive from leg data + the
        // cost map stashed on __state.
        const leg = TRIP.transport.legs.find((l) => l.id === move);
        if (!leg) return { lead: "", detail: "", cost: 0 };
        const strip = (x) =>
          String(x)
            .replace(/<[^>]+>/g, "")
            .replace(/&[a-z]+\d*;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        // getting-there legs follow the fly/drive + rental choice
        if (leg.role === "arrival" || leg.role === "departure") {
          const gw = TRIP.meta.destLabel || "the gateway";
          if (s.arriveMode === "drive") {
            const days = s.enrouteNights / 2 + 1;
            const multi =
              s.enrouteNights > 0 ? ` (${days}-day drive each way)` : "";
            if (leg.role === "arrival")
              return {
                lead: "Drive to " + gw + multi,
                detail: s.renting
                  ? "Self-drive in; grab a rental if you flew part-way"
                  : "Your own car for the whole trip",
                cost: 0,
              };
            return {
              lead: "Drive home" + multi,
              detail: "The long road back",
              cost: 0,
            };
          }
          // flying: keep the authored route text; drop the rental mention if not renting
          let lead = strip(leg.routeName || "");
          if (!s.renting) lead = lead.replace(/\s*·\s*pick up[^·]*/i, "");
          return {
            lead,
            detail: strip(leg.note || ""),
            cost: (s.legCosts && s.legCosts[move]) || 0,
          };
        }
        const m = leg.modes ? selectedValue(leg.modeControl) : null;
        return {
          lead: strip(leg.routeName || ""),
          detail: m ? leg.modes[m].label : strip(leg.note || ""),
          cost: (s.legCosts && s.legCosts[move]) || 0,
        };
      }
    }
  }

  function chosenActsByCity() {
    const res = {};
    TRIP.meta.route.forEach((c) => (res[c] = []));
    Object.keys(res).forEach((city) => {
      (ACTIVITIES[city] || []).forEach((act, ai) => {
        const opt = act.options[selectedIndex(city + "Act" + ai)];
        if (opt.cost > 0)
          res[city].push({ title: act.title, name: opt.name, cost: opt.cost });
      });
    });
    return res;
  }

  function assembleItinDays(s) {
    const days = [];
    // multi-day drive: overnight days on the road out and back
    const roadOut = s.arriveMode === "drive" ? (s.enrouteNights || 0) / 2 : 0;
    const roadDay = (dir, i) => ({
      id: "road-" + dir + "-" + i,
      travel: true,
      sun: "",
      cityTag: dir === "out" ? "On the road" : "Homeward",
      title:
        dir === "out" ? "On the road — a driving day" : "The long drive home",
      rows: [
        {
          tag: "Drive",
          kind: "soft",
          detail:
            dir === "out"
              ? "A day toward " +
                (TRIP.meta.destLabel || "the start") +
                "; overnight near the halfway point."
              : "A day back on the road; overnight en route to split the miles.",
        },
      ],
    });
    for (let i = 0; i < roadOut; i++) days.push(roadDay("out", i));
    TRIP.meta.route.concat(TRIP.meta.optionalCities).forEach((city) => {
      const pool = ITIN_POOL[city] || [];
      const n = s.nights[city] || 0;
      // extra nights beyond the written narrative become "at leisure" days
      for (let idx = 0; idx < n; idx++) {
        const base = pool[idx] || {
          id: city + "-leisure-" + idx,
          cityTag: HOTELS[city].label,
          sun: "",
          title: "A day at leisure",
          rows: [
            {
              tag: "Open",
              kind: "soft",
              detail:
                "Unscheduled — revisit a favorite, rest, or add a day trip.",
            },
          ],
        };
        days.push(
          Object.assign({}, base, { cityKey: city, firstOfCity: idx === 0 }),
        );
      }
    });
    days.push(itinDepartDay(s.osakaMode));
    for (let i = 0; i < roadOut; i++) days.push(roadDay("back", i));
    // the last overnight day carries the "special last dinner" nudge
    const lastStay = days[days.length - 2 - roadOut];
    if (lastStay) lastStay.lastNight = true;
    return days;
  }

  function renderItinerary() {
    const s = window.__state;
    if (!s) return;
    const acts = chosenActsByCity();
    const days = assembleItinDays(s);
    const roadOut = s.arriveMode === "drive" ? (s.enrouteNights || 0) / 2 : 0;
    const cur = addDays(toDate(TRIP_START), -roadOut);
    const priceSpan = (c) =>
      SHOW_PRICES && c ? ' <span class="cost">$' + fmt2(c) + "</span>" : "";

    document.getElementById("itinRail").innerHTML = days
      .map((d, i) => {
        const date = fmtDate(addDays(cur, i));
        let rows = "";

        if (d.move) {
          const m = moveData(d.move, s);
          rows +=
            '<div class="drow move"><span class="tag">Move</span><span class="body"><span class="lead">' +
            m.lead +
            '</span> <span class="detail">' +
            m.detail +
            priceSpan(m.cost) +
            "</span></span></div>";
        }

        // when driving, the arrival/departure day's fly-assuming narrative
        // "Move" rows are replaced by the state-driven move row above
        let dayRows = d.rows;
        const gettingThereChanged =
          s.arriveMode === "drive" || (TRIP.transport.rental && !s.renting);
        if (d.move && gettingThereChanged) {
          const lg = TRIP.transport.legs.find((l) => l.id === d.move);
          if (lg && (lg.role === "arrival" || lg.role === "departure"))
            dayRows = d.rows.filter((r) => r.kind !== "move");
        }
        rows += dayRows
          .map((r) => {
            const flag = r.flag
              ? '<span class="flag">' + r.flag + "</span>"
              : "";
            const lead = r.lead
              ? '<span class="lead">' + flag + r.lead + "</span> "
              : flag;
            return (
              '<div class="drow ' +
              r.kind +
              '"><span class="tag">' +
              r.tag +
              '</span><span class="body">' +
              lead +
              '<span class="detail">' +
              r.detail +
              "</span></span></div>"
            );
          })
          .join("");

        if (d.firstOfCity && d.lodging) {
          const h = s[d.lodging];
          const nights = s.nights[d.lodging] || 1;
          const meta = SHOW_PRICES
            ? " · $" +
              h.rate +
              "/night × " +
              s.rooms +
              " room" +
              (s.rooms > 1 ? "s" : "") +
              " × " +
              nights +
              ' = <span class="cost">$' +
              fmt2(h.rate * s.rooms * nights) +
              "</span>"
            : " · ★" +
              h.rating +
              " · " +
              nights +
              " night" +
              (nights > 1 ? "s" : "");
          rows +=
            '<div class="drow soft"><span class="tag">Stay</span><span class="body"><span class="lead">' +
            h.name +
            '</span><span class="detail">' +
            meta +
            "</span></span></div>";
        }

        if (d.firstOfCity && acts[d.cityKey] && acts[d.cityKey].length) {
          rows += acts[d.cityKey]
            .map(
              (a) =>
                '<div class="drow soft"><span class="tag">Booked</span><span class="body"><span class="lead">' +
                a.title +
                ':</span> <span class="detail">' +
                a.name +
                priceSpan((a.cost * s.N) / 2) +
                "</span></span></div>",
            )
            .join("");
        }

        if (d.lastNight) {
          rows +=
            '<div class="drow table"><span class="tag">Last night</span><span class="body"><span class="lead">Worth reserving a special dinner.</span> <span class="detail">A counter sushi seat or a proper kaiseki — the one to book well ahead before peak season fills up.</span></span></div>';
        }

        let fuller = "";
        if (d.fuller) {
          const on = itinFullerOn(d.id);
          fuller =
            '<div class="fuller ' +
            (on ? "" : "excluded") +
            '"><label class="ftoggle no-print"><input type="checkbox" data-ifuller="' +
            d.id +
            '" ' +
            (on ? "checked" : "") +
            '>+ fuller</label><span class="ftext">' +
            d.fuller +
            "</span></div>";
        }
        const ask = d.ask ? '<div class="iask">' + d.ask + "</div>" : "";

        return (
          '<div class="day ' +
          (d.travel ? "travel" : "") +
          '"><div class="day-marker"></div>' +
          '<div class="day-eyebrow"><span>Day ' +
          (i + 1) +
          '</span><span class="mono">' +
          date +
          '</span><span class="city">' +
          d.cityTag +
          '</span><span class="sun mono">' +
          d.sun +
          "</span></div><h3>" +
          d.title +
          "</h3>" +
          rows +
          fuller +
          ask +
          "</div>"
        );
      })
      .join("");

    document.querySelectorAll("input[data-ifuller]").forEach((cb) =>
      cb.addEventListener("change", (e) => {
        ITIN_PACE = "custom";
        document.getElementById("ip-custom").checked = true;
        itinFuller[e.target.dataset.ifuller] = e.target.checked;
        renderItinerary();
      }),
    );

    const n = s.nights;
    const route = TRIP.meta.route
      .concat(TRIP.meta.optionalCities)
      .filter((c) => (n[c] || 0) > 0)
      .map((c) => HOTELS[c].label + " " + n[c])
      .join(" / ");
    const addOns = days.filter((d) => d.fuller && itinFullerOn(d.id)).length;
    document.getElementById("itinSummary").innerHTML =
      days.length +
      " days · " +
      route +
      " · " +
      addOns +
      " “+ fuller” add-on" +
      (addOns === 1 ? "" : "s") +
      " on";

    const tot = document.getElementById("itinTotal");
    if (SHOW_PRICES) {
      tot.style.display = "";
      tot.innerHTML =
        '<div class="gt">' +
        fmt(s.grand) +
        '</div><div style="margin-top:0.25rem">Estimated total for ' +
        s.N +
        " traveler" +
        (s.N > 1 ? "s" : "") +
        " — flights, lodging (+tax buffer), transport" +
        (s.activitiesCost > 0 ? ", and the paid activities you picked" : "") +
        ". Full line-by-line breakdown on the Plan tab.</div>";
    } else {
      tot.style.display = "none";
    }
  }

  function buildItinText() {
    const s = window.__state;
    if (!s) return "";
    const acts = chosenActsByCity();
    const days = assembleItinDays(s);
    const roadOut = s.arriveMode === "drive" ? (s.enrouteNights || 0) / 2 : 0;
    const cur = addDays(toDate(TRIP_START), -roadOut);
    const n = s.nights;
    const strip = (x) =>
      String(x)
        .replace(/<[^>]+>/g, "")
        .replace(/&mdash;/g, "—")
        .replace(/&amp;/g, "&")
        .replace(/&rarr;/g, "→")
        .replace(/&ndash;/g, "–")
        .replace(/&[a-z]+\d*;/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const money = (c) => (SHOW_PRICES && c ? " ($" + fmt2(c) + ")" : "");
    const out = [];
    const startD = toDate(TRIP_START);
    const totalN = Object.values(n).reduce((a, b) => a + (b || 0), 0);
    const endD = addDays(startD, totalN);
    out.push(
      TRIP_NAME.toUpperCase() +
        " — " +
        fmtDate(startD) +
        " to " +
        fmtDate(endD) +
        ", " +
        endD.getFullYear(),
    );
    out.push(
      TRIP.meta.route
        .concat(TRIP.meta.optionalCities)
        .filter((c) => (n[c] || 0) > 0)
        .map((c) => HOTELS[c].label + " " + n[c])
        .join(" / "),
    );
    if (SHOW_PRICES)
      out.push(
        "Estimated total: " +
          fmt(s.grand) +
          " for " +
          s.N +
          " traveler" +
          (s.N > 1 ? "s" : ""),
      );
    out.push("");
    days.forEach((d, i) => {
      out.push(
        fmtDate(addDays(cur, i)).toUpperCase() + " — " + strip(d.cityTag),
      );
      out.push("  " + strip(d.title));
      if (d.move) {
        const m = moveData(d.move, s);
        out.push("   - Move: " + m.lead + " — " + m.detail + money(m.cost));
      }
      d.rows.forEach((r) => {
        const t = strip((r.lead ? r.lead + " " : "") + r.detail);
        if (t) out.push("   - " + r.tag + ": " + t);
      });
      if (d.firstOfCity && d.lodging) {
        const h = s[d.lodging];
        out.push(
          "   - Stay: " +
            h.name +
            (SHOW_PRICES ? " ($" + h.rate + "/night)" : " (★" + h.rating + ")"),
        );
      }
      if (d.firstOfCity && acts[d.cityKey])
        acts[d.cityKey].forEach((a) =>
          out.push(
            "   - Booked: " +
              a.title +
              " — " +
              a.name +
              money((a.cost * s.N) / 2),
          ),
        );
      if (d.lastNight)
        out.push("   - Last night: worth reserving a special dinner.");
      if (d.fuller && itinFullerOn(d.id))
        out.push("   + also: " + strip(d.fuller));
      out.push("");
    });
    out.push("Flights and a few dinner reservations still to lock in.");
    return out.join("\n");
  }

  /* ============================================================
     EXCEL (.xlsx) EXPORT — dependency-free. Builds a real
     multi-sheet workbook (OOXML zipped by hand, no libraries) so
     it stays self-contained. Sheet 1 = itinerary; Budget sheet
     when prices are shown; final sheet = the Japan MOFA visa
     "Travel Itinerary" form, pre-filled from the trip.
     ============================================================ */

  // Officer-friendly, literal one-liners for the visa form (the
  // itinerary's own titles are deliberately poetic — wrong register here).

  const VISA_PLAN = TRIP.visaPlan;


  function buildExcelWorkbook(forceBudget) {
    const s = window.__state;
    const days = assembleItinDays(s);
    const roadOut = s.arriveMode === "drive" ? (s.enrouteNights || 0) / 2 : 0;
    const cur = addDays(toDate(TRIP_START), -roadOut);
    const strip = (x) =>
      String(x)
        .replace(/<[^>]+>/g, "")
        .replace(/&mdash;/g, "—")
        .replace(/&amp;/g, "&")
        .replace(/&rarr;/g, "→")
        .replace(/&ndash;/g, "–")
        .replace(/&[a-z]+\d*;/g, "")
        .replace(/\s+/g, " ")
        .trim();
    const cell = (v, st) => ({ v: v, s: st });
    const num = (v, st) => ({ v: v, n: true, s: st });
    const accomFor = (d) =>
      d.cityKey
        ? s[d.cityKey].name +
          " (" +
          strip(ITIN_POOL[d.cityKey][0].cityTag).replace(/ .*/, "") +
          ")"
        : "—";

    // --- Sheet 1: Itinerary (readable) ---
    const itinRows = [
      [
        cell("Date", 1),
        cell("Day", 1),
        cell("Plan", 1),
        cell("Accommodation", 1),
        cell("Transport", 1),
      ],
    ];
    days.forEach((d, i) => {
      const date = fmtDate(addDays(cur, i));
      const plan = VISA_PLAN[d.id] || strip(d.title);
      const move = d.move
        ? (function () {
            const m = moveData(d.move, s);
            return (
              strip(m.lead) +
              " — " +
              strip(m.detail) +
              (SHOW_PRICES && m.cost ? " ($" + fmt2(m.cost) + ")" : "")
            );
          })()
        : "";
      itinRows.push([
        cell(date),
        cell("Day " + (i + 1)),
        cell(plan),
        cell(d.cityKey ? s[d.cityKey].name : "—"),
        cell(move),
      ]);
    });
    const sheets = [
      { name: "Itinerary", rows: itinRows, cols: [16, 8, 46, 30, 40] },
    ];

    // --- Budget sheet: when prices are shown, or forced (Plan-tab export) ---
    if (SHOW_PRICES || forceBudget) {
      const rows = buildRows();
      const bud = [
        [
          cell("Date", 1),
          cell("Category", 1),
          cell("Item", 1),
          cell("Detail", 1),
          cell("Cost (USD)", 1),
        ],
      ];
      rows.forEach((r) =>
        bud.push([
          cell(fmtDate(r.date)),
          cell(r.category),
          cell(r.title),
          cell(r.detail),
          num(Math.round(r.cost)),
        ]),
      );
      bud.push([
        cell(""),
        cell("Lodging"),
        cell("Taxes/fees buffer"),
        cell("Applied to lodging subtotal"),
        num(Math.round(s.lodgingBuffer)),
      ]);
      bud.push([
        cell(""),
        cell(""),
        cell(""),
        cell("TOTAL", 1),
        num(Math.round(s.grand), 1),
      ]);
      sheets.push({ name: "Budget", rows: bud, cols: [16, 14, 30, 40, 14] });
    }

    // --- Final sheet: Japan MOFA "Travel Itinerary" visa form ---
    const v = [];
    v.push([]); // row 1 spacer
    v.push([null, null, null, cell("(Year)      (Month)      (Day)", 5)]); // row 2, top-right
    v.push([]); // row 3
    v.push([cell("Travel Itinerary", 2)]); // row 4 title (merged A4:D4)
    v.push([]); // row 5
    v.push([
      cell("The travel itinerary of the visa applicant(s) is as follows:"),
    ]); // row 6
    v.push([]); // row 7
    v.push([
      cell("Date", 4),
      cell("Activity Plan", 4),
      cell("Contact", 4),
      cell("Accommodation", 4),
    ]); // row 8 header
    days.forEach((d, i) => {
      v.push([
        cell(visaDate(addDays(cur, i)), 3),
        cell(VISA_PLAN[d.id] || strip(d.title), 3),
        cell("", 3),
        cell(d.cityKey ? s[d.cityKey].name : "Departure", 3),
      ]);
    });
    for (let k = 0; k < 3; k++)
      v.push([cell("", 3), cell("", 3), cell("", 3), cell("", 3)]); // blank rows to fill
    sheets.push({
      name: "Visa Itinerary",
      rows: v,
      cols: [16, 52, 20, 30],
      merges: ["A4:D4"],
    });

    return buildXlsx(sheets);
  }

  function downloadExcel(forceBudget) {
    let embedded = false;
    try {
      embedded = window.self !== window.top;
    } catch (e) {
      embedded = true;
    }
    if (embedded) {
      // Sandboxed previews block binary downloads — fall back to the
      // guaranteed copy-paste path via the modal (works on either tab).
      modalTitle.textContent = "Copy this into a spreadsheet";
      modalNote.style.display = "block";
      modalNote.textContent =
        "This embedded preview blocks file downloads. Open the site at its own web address to get the real .xlsx — or copy the text below into Excel / Google Sheets (it auto-splits into columns).";
      shareOutput.value = buildCSV();
      modalOverlay.classList.add("open");
      shareOutput.focus();
      shareOutput.setSelectionRange(0, 0);
      return;
    }
    const data = buildExcelWorkbook(forceBudget);
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "japan-trip-itinerary.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function themeInit() {
    const root = document.documentElement;
    const btn = document.getElementById("themeToggle");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const isDark = () => {
      const a = root.getAttribute("data-theme");
      return a ? a === "dark" : mq.matches;
    };
    // icon shows the mode you'd switch TO
    const paint = () => (btn.textContent = isDark() ? "☀" : "☾");
    btn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      paint();
    });
    // follow the OS if the user hasn't chosen a manual override
    mq.addEventListener("change", () => {
      if (!root.getAttribute("data-theme")) paint();
    });
    paint();
  }

  function showTab(t) {
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.toggle("active", b.dataset.tab === t));
    document.getElementById("planPane").style.display =
      t === "plan" ? "" : "none";
    document.getElementById("itinPane").style.display =
      t === "itin" ? "" : "none";
    if (t === "itin") renderItinerary(); // always reflect the latest Plan choices
    window.scrollTo(0, 0);
  }

  // ── validate the TRIP data model (issue #5) ───────────────────────
  // Checks the key alignment that a generated trip can silently get wrong:
  // every route/optional city has hotels + itinerary days, the flex-night
  // default is a real city, and every itinPool day's lodging/move references
  // an existing hotel/leg. Returns a list of human-readable problems.
  function validateTrip() {
    const problems = [];
    const legIds = TRIP.transport.legs.map((l) => l.id);
    TRIP.meta.route.concat(TRIP.meta.optionalCities).forEach((c) => {
      if (!HOTELS[c]) problems.push(`city "${c}" has no hotels entry`);
      if (!ITIN_POOL[c])
        problems.push(`city "${c}" has no itinerary (itinPool) entry`);
    });
    if (!TRIP.meta.route.includes(TRIP.meta.flexNightDefault))
      problems.push(
        `flexNightDefault "${TRIP.meta.flexNightDefault}" is not a route city`,
      );
    Object.keys(ITIN_POOL).forEach((city) => {
      ITIN_POOL[city].forEach((day) => {
        if (day.lodging && !HOTELS[day.lodging])
          problems.push(
            `itinPool ${day.id}: lodging "${day.lodging}" has no hotel`,
          );
        if (day.move && !legIds.includes(day.move))
          problems.push(
            `itinPool ${day.id}: move "${day.move}" is not a transport leg`,
          );
      });
    });
    return problems;
  }

  // ── "Re-plan these dates" panel (progressive enhancement) ─────────
  // Opt-in only: nothing fetches on load, so a static planner with no
  // API base configured behaves exactly as before. When window.__API_BASE
  // is set, the Itinerary tab gains a panel that asks the research back
  // end (worker/) for an AI briefing comparing a proposed window to this
  // trip's dates. See AI-RESEARCH-PLAN.md.
  function initReplan() {
    const API = (window.__API_BASE || "").replace(/\/+$/, "");
    const mount = document.getElementById("replanMount");
    if (!API || !mount) return; // feature off — planner stays fully static

    const slug = (location.pathname.split("/").pop() || "")
      .replace(/-trip-planner\.html$/, "")
      .replace(/\.html$/, "");
    const d = (TRIP.meta && TRIP.meta.dates) || {};
    const esc = (s) =>
      String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
      );

    mount.innerHTML =
      '<section class="replan">' +
      '<h3 class="replan-h">Thinking about different dates?</h3>' +
      '<p class="replan-sub">Get an AI read on how a new window compares — weather, holidays, events, and the travel advisory for the dates you’re considering. Flights aren’t re-priced yet.</p>' +
      '<div class="replan-row">' +
      '<label class="replan-field">New start<input type="date" id="replanStart" value="' + esc(d.arrive) + '"></label>' +
      '<label class="replan-field">New end<input type="date" id="replanEnd" value="' + esc(d.depart) + '"></label>' +
      '<button type="button" id="replanBtn" class="generate-btn">Get AI briefing</button>' +
      "</div>" +
      '<div class="replan-out" id="replanOut" hidden></div>' +
      "</section>";

    const btn = document.getElementById("replanBtn");
    const out = document.getElementById("replanOut");
    const show = (html) => {
      out.innerHTML = html;
      out.hidden = false;
    };

    const arrow = { better: "↗", neutral: "→", worse: "↘" };
    function renderBriefing(data) {
      const b = data.briefing || {};
      const nd = data.nights_delta;
      const ndTxt =
        nd === 0
          ? "same length"
          : (nd > 0 ? "+" + nd : nd) + " night" + (Math.abs(nd) === 1 ? "" : "s");
      const changes = (b.changes || [])
        .map(
          (c) =>
            '<li class="rc rc-' + esc(c.direction) + '"><span class="rc-a">' +
            (arrow[c.direction] || "") + " " + esc(c.aspect) +
            '</span> ' + esc(c.detail) + "</li>",
        )
        .join("");
      const flags = (b.flags || [])
        .map((f) => "<li>" + esc(f) + "</li>")
        .join("");
      const cost =
        data.cost_usd != null
          ? " · ~$" + Number(data.cost_usd).toFixed(4)
          : "";
      return (
        '<div class="replan-brief">' +
        '<div class="replan-verdict v-' + esc(b.verdict) + '">' + esc(b.verdict || "") +
        ' · ' + esc(ndTxt) + "</div>" +
        "<p class=\"replan-summary\">" + esc(b.summary) + "</p>" +
        (changes ? '<ul class="replan-changes">' + changes + "</ul>" : "") +
        (flags ? '<div class="replan-flags"><span class="rf-h">Watch:</span><ul>' + flags + "</ul></div>" : "") +
        (b.recommendation ? '<p class="replan-rec"><strong>Recommendation:</strong> ' + esc(b.recommendation) + "</p>" : "") +
        '<p class="replan-meta">' + esc(data.model || "") + cost +
        " · grounded in weather, holidays, events &amp; the travel advisory for the new dates. Fares not included.</p>" +
        "</div>"
      );
    }

    btn.addEventListener("click", async () => {
      const start = document.getElementById("replanStart").value;
      const end = document.getElementById("replanEnd").value;
      if (!start || !end) return show('<p class="replan-err">Pick a start and an end date.</p>');
      if (end <= start) return show('<p class="replan-err">The end date needs to be after the start.</p>');

      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Thinking…";
      show('<p class="replan-loading">Pulling weather, holidays, events and the advisory for ' + esc(start) + " → " + esc(end) + "…</p>");
      try {
        const url = API + "/api/replan?trip=" + encodeURIComponent(slug) +
          "&start=" + encodeURIComponent(start) + "&end=" + encodeURIComponent(end);
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "HTTP " + res.status);
        if (data.configured === false) {
          show('<p class="replan-note">The AI briefing isn’t enabled on the server yet.</p>');
          return;
        }
        show(renderBriefing(data));
      } catch (err) {
        show('<p class="replan-err">Couldn’t get a briefing: ' + esc(err && err.message ? err.message : err) + "</p>");
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }

  function initPlanner() {
    const problems = validateTrip();
    if (problems.length) {
      console.error("TRIP validation failed:", problems);
      const banner = document.createElement("div");
      banner.setAttribute("role", "alert");
      banner.style.cssText =
        "background:#a8481f;color:#fff;padding:0.75rem 1rem;font-family:ui-monospace,monospace;font-size:0.8rem;white-space:pre-wrap;line-height:1.5;";
      banner.textContent =
        "⚠ TRIP data problems (the planner may render wrong — see console):\n• " +
        problems.join("\n• ");
      document.body.insertBefore(banner, document.body.firstChild);
    }
    // optional packaged-quote comparison note (hidden for DIY trips)
    const rn = document.getElementById("referenceNote");
    if (TRIP.meta.reference && TRIP.meta.reference.blurb)
      rn.innerHTML = TRIP.meta.reference.blurb;
    else rn.style.display = "none";
    // override the masthead/flights chrome from meta.ui where provided
    // (absent for Japan → its hardcoded HTML text stays, byte-identical).
    const ui = TRIP.meta.ui || {};
    const setHtml = (id, v) => {
      if (v == null) return;
      const el = document.getElementById(id);
      if (el) el.innerHTML = v;
    };
    setHtml("planTitle", ui.planTitle);
    setHtml("planSub", ui.planSub);
    setHtml("planEyebrow", ui.eyebrow);
    setHtml("flightsTitle", ui.flightsTitle);
    setHtml("flightsIntro", ui.flightsIntro);
    setHtml("itinEyebrow", ui.eyebrow);
    setHtml("itinTitle", ui.itinTitle);
    setHtml("itinDek", ui.itinDek);
    // browser-tab title follows the trip when meta.ui provides one (Japan keeps its hardcoded <title>)
    if (ui.planTitle)
      document.title =
        ui.planTitle.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&") +
        " — Budget & Itinerary";
    // the fine-print list defaults to Japan's authored research notes; any
    // trip with meta.ui gets ui.finePrint (array of HTML strings) or a
    // generic set, so Japan-specific caveats never show on other trips.
    if (TRIP.meta.ui) {
      const fp = ui.finePrint || [
        "Every figure is a researched planning estimate for the trip dates — verify live prices before booking.",
        "Lodging totals include a flat planning buffer for taxes and fees (shown as its own line in the breakdown); actual taxes vary by property.",
        "Flight fares are representative round-trips, not date-locked quotes — re-check fares (e.g. Google Flights) before booking.",
        "Meals and incidentals beyond what's listed are not included.",
      ];
      const list = document.getElementById("finePrintList");
      if (list) list.innerHTML = fp.map((x) => "<li>" + x + "</li>").join("");
    }
    themeInit();
    document
      .querySelectorAll(".tab")
      .forEach((t) =>
        t.addEventListener("click", () => showTab(t.dataset.tab)),
      );
    // "Change trip" dropdown → jump straight to another planner or the hub
    (function () {
      const SITE_TRIPS = [
        { file: "index.html", emoji: "✦", label: "All trips" },
        { file: "japan-trip-planner.html", emoji: "🗼", label: "Japan" },
        {
          file: "yellowstone-trip-planner.html",
          emoji: "🏔️",
          label: "Yellowstone & Grand Teton",
        },
        { file: "sw-trip-planner.html", emoji: "🏜️", label: "Southwest Parks" },
        {
          file: "italy-trip-planner.html",
          emoji: "🏛️",
          label: "Italy by Rail",
        },
        { file: "hawaii-trip-planner.html", emoji: "🌺", label: "Hawaii" },
        { file: "thailand-trip-planner.html", emoji: "🛕", label: "Thailand" },
        {
          file: "redwoods-trip-planner.html",
          emoji: "🌲",
          label: "California Redwoods",
        },
        { file: "zion-trip-planner.html", emoji: "🧗", label: "Zion Deep-Dive" },
        {
          file: "germany-trip-planner.html",
          emoji: "🎄",
          label: "Christmas in Germany",
        },
        { file: "seoul-trip-planner.html", emoji: "🏯", label: "Seoul & Busan" },
      ];
      const btn = document.getElementById("changeTripBtn");
      const menu = document.getElementById("tripMenu");
      if (!btn || !menu) return;
      const here = location.pathname.split("/").pop() || "index.html";
      menu.innerHTML = SITE_TRIPS.map((t) => {
        const cur = t.file === here;
        return (
          '<a role="menuitem" href="' +
          t.file +
          '"' +
          (cur ? ' aria-current="page"' : "") +
          '><span class="tm-emoji">' +
          t.emoji +
          "</span> " +
          t.label +
          "</a>"
        );
      }).join("");
      const close = () => {
        menu.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = menu.hidden;
        menu.hidden = !willOpen;
        btn.setAttribute("aria-expanded", String(willOpen));
      });
      document.addEventListener("click", (e) => {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== btn)
          close();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    })();
    document.getElementById("itinPaceSeg").addEventListener("change", (e) => {
      ITIN_PACE = e.target.value;
      renderItinerary();
    });
    document.getElementById("showPrices").addEventListener("change", (e) => {
      SHOW_PRICES = e.target.checked;
      renderItinerary();
    });
    document.getElementById("itinPdfBtn").addEventListener("click", () => {
      // Some embedded/sandboxed viewers (e.g. the preview iframe) block the
      // browser's print dialog, so window.print() silently no-ops there.
      // Detect that case and tell the user instead of failing quietly.
      let embedded = false;
      try {
        embedded = window.self !== window.top;
      } catch (e) {
        embedded = true;
      }
      if (embedded) {
        const hint = document.getElementById("pdfHint");
        hint.textContent =
          "This embedded preview blocks the PDF dialog. Open the itinerary at its own web address to save a PDF — or use “Copy as text” to paste it into a message.";
        hint.style.display = "";
        return;
      }
      window.print();
    });
    document
      .getElementById("itinCopyBtn")
      .addEventListener("click", async () => {
        const btn = document.getElementById("itinCopyBtn");
        const text = buildItinText();
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy as text";
          btn.classList.remove("copied");
        }, 1600);
      });
    document
      .getElementById("itinXlsxBtn")
      .addEventListener("click", () => downloadExcel(false));
    // keep the itinerary in sync with every Plan-tab change
    document.addEventListener("change", renderItinerary);
    document
      .getElementById("travelerCount")
      .addEventListener("input", renderItinerary);
    document
      .getElementById("minRating")
      .addEventListener("input", renderItinerary);
    renderItinerary();
    initReplan(); // opt-in "re-plan these dates" panel (no-op if no API base)
    // A shared "#itinerary" link opens straight to the day-by-day.
    if (location.hash === "#itinerary") showTab("itin");
  }

  initPlanner();
