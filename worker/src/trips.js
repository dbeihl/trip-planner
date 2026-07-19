// Trip registry for the Worker: gateway-city coordinates keyed by slug, with
// dates pulled from the existing data modules so there's a single source of
// truth for the travel window. Coordinates are the weather gateway (the city
// whose seasonality best represents the trip), not in the trip data itself.
import japan from "../../src/data/japan.js";
import yellowstone from "../../src/data/yellowstone.js";
import sw from "../../src/data/sw.js";
import italy from "../../src/data/italy.js";
import hawaii from "../../src/data/hawaii.js";
import thailand from "../../src/data/thailand.js";
import redwoods from "../../src/data/redwoods.js";
import zion from "../../src/data/zion.js";
import germany from "../../src/data/germany.js";
import seoul from "../../src/data/seoul.js";

const COORDS = {
  japan: { lat: 35.68, lon: 139.76, label: "Tokyo" },
  yellowstone: { lat: 43.48, lon: -110.76, label: "Jackson, WY" },
  sw: { lat: 36.17, lon: -115.14, label: "Las Vegas" },
  italy: { lat: 41.9, lon: 12.5, label: "Rome" },
  hawaii: { lat: 21.31, lon: -157.86, label: "Honolulu" },
  thailand: { lat: 13.75, lon: 100.5, label: "Bangkok" },
  redwoods: { lat: 40.8, lon: -124.16, label: "Eureka, CA" },
  zion: { lat: 37.19, lon: -112.99, label: "Springdale, UT" },
  germany: { lat: 49.45, lon: 11.08, label: "Nuremberg" },
  seoul: { lat: 37.57, lon: 126.98, label: "Seoul" },
};

const MODULES = { japan, yellowstone, sw, italy, hawaii, thailand, redwoods, zion, germany, seoul };

// slug -> { lat, lon, label, arrive, depart }
export const TRIPS = Object.fromEntries(
  Object.entries(MODULES).map(([slug, data]) => {
    const c = COORDS[slug] || {};
    const d = (data.meta && data.meta.dates) || {};
    return [slug, { ...c, arrive: d.arrive, depart: d.depart }];
  }),
);
