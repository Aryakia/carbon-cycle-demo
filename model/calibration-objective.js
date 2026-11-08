import { HISTORICAL_PROXY_ROWS } from "./historical-mapping.js";
import { HISTORICAL_SPLIT, splitHistoricalRows } from "./historical-drivers.js";
import { DEFAULT_STATE } from "./upstream-engine.js";

export const UPSTREAM_CALIBRATION_WEIGHTS = Object.freeze({
  fossilFlow: 0.40,
  extractionActivity: 0.15,
  cleanCapitalShape: 0.25,
  fossilDemandActivity: 0.20,
  atmosphericPpm: 0.00,
});

export const CALIBRATION_METRIC_METADATA = Object.freeze({
  fossilFlow: {
    observed: "fossilFlowObservedGtCPerYr",
    modeled: "fossilToAtmosphereGtCPerYr",
    normalization: "mean absolute observed value",
    role: "primary upstream calibration target",
  },
  extractionActivity: {
    observed: "fossilProductionActivityIndex2025",
    modeled: "extractionGtCPerYr",
    normalization: "each series normalized to its own 2025 reference",
    role: "production-flow shape proxy for extraction dynamics",
  },
  cleanCapitalShape: {
    observed: "cleanCapitalProxy",
    modeled: "cleanCapital",
    normalization: "2025 model clean-capital reference stock",
    role: "proxy target; trajectory shape only",
  },
  fossilDemandActivity: {
    observed: "fossilDependencyIndex2025",
    modeled: "fossilDemandCapital",
    normalization: "unitless fossil-share index normalized to 2025 = 1",
    role:
      "proxy target for fossil dependency after aggregate energy activity is supplied separately",
  },
  atmosphericPpm: {
    observed: "atmosphericPpmObserved",
    modeled: "ppm",
    normalization: "mean observed ppm",
    role:
      "diagnostic only in upstream calibration because the carbon-cycle component was already calibrated separately",
  },
});

function nearestModelRow(modelRows, year) {
  if (!modelRows.length) throw new Error("modelRows cannot be empty");
  return modelRows.reduce((best, row) =>
    Math.abs(row.year - year) < Math.abs(best.year - year) ? row : best
  );
}

function nrmse(pairs, scale) {
  if (!pairs.length) return NaN;
  const mse = pairs.reduce((sum, [obs, sim]) => sum + (sim - obs) ** 2, 0) / pairs.length;
  return Math.sqrt(mse) / Math.max(1e-12, scale);
}

function targetRowsForWindow(window) {
  const rows = HISTORICAL_PROXY_ROWS.filter(r => {
    if (window === "training") {
      return r.year >= HISTORICAL_SPLIT.trainingStart && r.year <= HISTORICAL_SPLIT.trainingEnd;
    }
    if (window === "validation") {
      return r.year >= HISTORICAL_SPLIT.validationStart && r.year <= HISTORICAL_SPLIT.validationEnd;
    }
    return true;
  });
  return rows;
}

export function scoreHistoricalFit(
  modelRows,
  {
    window = "training",
    weights = UPSTREAM_CALIBRATION_WEIGHTS,
    excludeYears = [],
  } = {},
) {
  const targets = targetRowsForWindow(window).filter(r => !excludeYears.includes(r.year));

  const fossilPairs = [];
  const extractionPairs = [];
  const cleanPairs = [];
  const demandPairs = [];
  const ppmPairs = [];

  for (const obs of targets) {
    const sim = nearestModelRow(modelRows, obs.year);
    if (Number.isFinite(sim.fossilToAtmosphereGtCPerYr)) {
      fossilPairs.push([obs.fossilFlowObservedGtCPerYr, sim.fossilToAtmosphereGtCPerYr]);
    }
    if (Number.isFinite(sim.extractionGtCPerYr)) {
      const model2025 = nearestModelRow(modelRows, 2025).extractionGtCPerYr;
      extractionPairs.push([
        obs.fossilProductionActivityIndex2025,
        sim.extractionGtCPerYr / Math.max(1e-12, model2025),
      ]);
    }
    if (Number.isFinite(sim.cleanCapital)) {
      cleanPairs.push([obs.cleanCapitalProxy, sim.cleanCapital]);
    }
    if (Number.isFinite(sim.fossilDemandCapital)) {
      demandPairs.push([obs.fossilDependencyIndex2025, sim.fossilDemandCapital]);
    }
    if (Number.isFinite(sim.ppm)) {
      ppmPairs.push([obs.atmosphericPpmObserved, sim.ppm]);
    }
  }

  const fossilScale =
    fossilPairs.reduce((s, [v]) => s + Math.abs(v), 0) / Math.max(1, fossilPairs.length);
  const ppmScale =
    ppmPairs.reduce((s, [v]) => s + Math.abs(v), 0) / Math.max(1, ppmPairs.length);

  const metrics = {
    fossilFlow: nrmse(fossilPairs, fossilScale),
    extractionActivity: nrmse(extractionPairs, 1),
    cleanCapitalShape: nrmse(cleanPairs, DEFAULT_STATE.cleanCapital),
    fossilDemandActivity: nrmse(demandPairs, 1),
    atmosphericPpm: nrmse(ppmPairs, ppmScale),
  };

  const objective = Object.entries(weights).reduce((sum, [key, weight]) => {
    const value = metrics[key];
    if (!Number.isFinite(value)) {
      throw new Error(`cannot score ${key}: model output or target missing`);
    }
    return sum + weight * value;
  }, 0);

  return {
    window,
    years: targets.map(r => r.year),
    excludeYears: [...excludeYears],
    weights: { ...weights },
    metrics,
    objective,
  };
}

export function buildPerfectProxyModelRows() {
  return HISTORICAL_PROXY_ROWS.map(row => ({
    year: row.year,
    fossilToAtmosphereGtCPerYr: row.fossilFlowObservedGtCPerYr,
    extractionGtCPerYr: row.fossilProductionActivityIndex2025,
    cleanCapital: row.cleanCapitalProxy,
    fossilDemandCapital: row.fossilDependencyIndex2025,
    ppm: row.atmosphericPpmObserved,
  }));
}

export function calibrationSplitSummary() {
  const split = splitHistoricalRows();
  return {
    trainingYears: [split.training[0].year, split.training.at(-1).year],
    validationYears: [split.validation[0].year, split.validation.at(-1).year],
    trainingCount: split.training.length,
    validationCount: split.validation.length,
    leakageRule:
      "Validation years must not contribute to parameter fitting, prior selection, or objective-weight tuning after the split is frozen.",
  };
}
