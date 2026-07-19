// Trip registry for the Worker: gateway-city coordinates + country metadata
// keyed by slug, with dates pulled from the existing data modules so there's a
// single source of truth for the travel window. Coordinates/country are the
// weather + holiday + advisory gateway, not stored in the trip data itself.
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

// country: ISO 3166-1 alpha-2 (for Nager.Date holidays).
// countryName + advisoryMatch: how to find this country in the U.S. State Dept
// advisory feed (foreign trips only; domestic US trips skip advisories).
// destAirport: IATA arrival code for Amadeus flight pricing (city codes ok).
// cityCode: IATA city code for Amadeus hotel pricing (gateway-area rate).
// originAirport defaults to IND (the owner's home) — override per query.
const COORDS = {
  japan: { lat: 35.68, lon: 139.76, label: "Tokyo", country: "JP", countryName: "Japan", advisoryMatch: ["japan"], destAirport: "TYO", cityCode: "TYO" },
  yellowstone: { lat: 43.48, lon: -110.76, label: "Jackson, WY", country: "US", countryName: "United States", destAirport: "JAC", cityCode: "JAC" },
  sw: { lat: 36.17, lon: -115.14, label: "Las Vegas", country: "US", countryName: "United States", destAirport: "LAS", cityCode: "LAS" },
  italy: { lat: 41.9, lon: 12.5, label: "Rome", country: "IT", countryName: "Italy", advisoryMatch: ["italy"], destAirport: "FCO", cityCode: "ROM" },
  hawaii: { lat: 21.31, lon: -157.86, label: "Honolulu", country: "US", countryName: "United States", destAirport: "HNL", cityCode: "HNL" },
  thailand: { lat: 13.75, lon: 100.5, label: "Bangkok", country: "TH", countryName: "Thailand", advisoryMatch: ["thailand"], destAirport: "BKK", cityCode: "BKK" },
  redwoods: { lat: 40.8, lon: -124.16, label: "Eureka, CA", country: "US", countryName: "United States", destAirport: "SFO", cityCode: "SFO" },
  zion: { lat: 37.19, lon: -112.99, label: "Springdale, UT", country: "US", countryName: "United States", destAirport: "LAS", cityCode: "LAS" },
  germany: { lat: 49.45, lon: 11.08, label: "Nuremberg", country: "DE", countryName: "Germany", advisoryMatch: ["germany"], destAirport: "FRA", cityCode: "MUC" },
  seoul: { lat: 37.57, lon: 126.98, label: "Seoul", country: "KR", countryName: "South Korea", advisoryMatch: ["korea, republic of", "south korea"], destAirport: "ICN", cityCode: "SEL" },
};

const MODULES = { japan, yellowstone, sw, italy, hawaii, thailand, redwoods, zion, germany, seoul };

// slug -> { lat, lon, label, country, countryName, advisoryMatch?, arrive, depart }
export const TRIPS = Object.fromEntries(
  Object.entries(MODULES).map(([slug, data]) => {
    const c = COORDS[slug] || {};
    const d = (data.meta && data.meta.dates) || {};
    return [slug, { ...c, arrive: d.arrive, depart: d.depart }];
  }),
);
