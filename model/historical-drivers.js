import {
  HISTORICAL_REFERENCE_ROWS,
} from "../data/historical-reference-2000-2025.js";
import {
  HISTORICAL_PROXY_ROWS,
} from "./historical-mapping.js";

export const HISTORICAL_SPLIT = Object.freeze({
  trainingStart: 2000,
  trainingEnd: 2017,
  validationStart: 2018,
  validationEnd: 2025,
});

export const EXOGENOUS_SHOCK_WINDOWS = Object.freeze([
  {
    id: "global-financial-crisis",
    years: Object.freeze([2008, 2009]),
    interpretation:
      "Large macroeconomic disturbance. Do not automatically interpret short-run fossil-energy deviations as endogenous structural failure.",
  },
  {
    id: "covid-19",
    years: Object.freeze([2020]),
    interpretation:
      "Large exogenous mobility/economic shock. Keep visible in validation; any down-weighting or exclusion must be explicit.",
  },
]);

function lerp(a, b, f) {
  return a + (b - a) * f;
}

function interpolateRows(rows, year, fields) {
  if (!Number.isFinite(year)) throw new Error("year must be finite");
  if (year < rows[0].year || year > rows.at(-1).year) {
    throw new Error(
      `historical driver year ${year} outside supported range ${rows[0].year}-${rows.at(-1).year}`,
    );
  }

  const floorYear = Math.floor(year);
  const ceilYear = Math.ceil(year);
  const a = rows.find(r => r.year === floorYear) ?? rows[0];
  const b = rows.find(r => r.year === ceilYear) ?? rows.at(-1);
  const f = ceilYear === floorYear ? 0 : (year - floorYear) / (ceilYear - floorYear);

  const result = { year };
  for (const field of fields) {
    const av = a[field], bv = b[field];
    result[field] =
      Number.isFinite(av) && Number.isFinite(bv) ? lerp(av, bv, f) : null;
  }
  return result;
}

export function historicalObservedAt(year) {
  return interpolateRows(HISTORICAL_REFERENCE_ROWS, year, [
    "fossilCO2GtCPerYr",
    "atmosphericPpm",
    "renewableCapacityGw",
    "fossilEnergyProductionTWh",
    "fossilEnergyConsumptionTWh",
    "worldGdpConstant2015Usd",
  ]);
}

export function historicalProxyAt(year) {
  return interpolateRows(HISTORICAL_PROXY_ROWS, year, [
    "fossilFlowObservedGtCPerYr",
    "atmosphericPpmObserved",
    "cleanCapitalProxy",
    "fossilProductionActivityIndex2025",
    "fossilDemandActivityIndex2025",
    "gdpIndex2025",
  ]);
}

export function splitHistoricalRows(rows = HISTORICAL_REFERENCE_ROWS) {
  return {
    training: rows.filter(
      r => r.year >= HISTORICAL_SPLIT.trainingStart && r.year <= HISTORICAL_SPLIT.trainingEnd,
    ),
    validation: rows.filter(
      r => r.year >= HISTORICAL_SPLIT.validationStart && r.year <= HISTORICAL_SPLIT.validationEnd,
    ),
  };
}

export function shockForYear(year) {
  return EXOGENOUS_SHOCK_WINDOWS.find(s => s.years.includes(Math.round(year))) ?? null;
}
