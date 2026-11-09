import { HISTORICAL_REFERENCE_ROWS } from "../data/historical-reference-2000-2025.js";
import { STAGE16_DIAGNOSTIC_ELECTRICITY } from "../data/stage16-diagnostic-variables.js";
import { STAGE16_VALIDATION_PLAN } from "./residual-diagnosis.js";

const BETA_GRID = Object.freeze({ min: 0, max: 0.08, step: 0.001 });
const TAU_GRID = Object.freeze({ min: 0.5, max: 10, step: 0.5 });
const DT = 0.25;

export const STAGE17_DRIVER_HYPOTHESES = Object.freeze({
  renewableCapacityIntensity: Object.freeze({
    id: "renewable-capacity-intensity",
    label: "Renewable capacity intensity",
    meaning: "Installed renewable GW per unit of total primary-energy supply.",
  }),
  renewableElectricityShare: Object.freeze({
    id: "renewable-electricity-share",
    label: "Renewable electricity share",
    meaning: "Realized renewable generation as a share of total electricity generation.",
  }),
  lowCarbonElectricityShare: Object.freeze({
    id: "low-carbon-electricity-share",
    label: "Low-carbon electricity share",
    meaning: "Renewable plus nuclear generation share of electricity.",
  }),
});

export const STAGE17_FOLDS = Object.freeze(
  STAGE16_VALIDATION_PLAN.proposedFolds.map((f, i) =>
    Object.freeze({
      id: "fold-" + (i + 1),
      train: Object.freeze([...f.train]),
      test: Object.freeze([...f.test]),
      normalizationYear: f.train[1],
    }),
  ),
);

export const STAGE17_PROTOCOL = Object.freeze({
  purpose:
    "Internal post-validation structural model comparison after the original 2018-2025 holdout was consumed.",
  folds: STAGE17_FOLDS,
  driverHypotheses: Object.values(STAGE17_DRIVER_HYPOTHESES).map(h => h.id),
  structures: Object.freeze(["static", "dynamic"]),
  betaGrid: BETA_GRID,
  effectiveTauGridYears: TAU_GRID,
  dtYears: DT,
  selectionCriterion:
    "Minimum pooled test RMSE across the four pre-declared rolling-origin folds. Test observations never enter fold-specific parameter fitting.",
  externalValidationClaim: false,
});

function historical(year) {
  const r = HISTORICAL_REFERENCE_ROWS.find(x => x.year === year);
  if (!r) throw new Error("missing historical year " + year);
  return r;
}
function electricity(year) {
  const r = STAGE16_DIAGNOSTIC_ELECTRICITY.find(x => x.year === year);
  if (!r) throw new Error("missing electricity diagnostic year " + year);
  return r;
}
function fossilShare(year) {
  const r = historical(year);
  return r.fossilEnergyConsumptionTWh / r.totalEnergySupplyTWh;
}
function rawDriver(year, driverId) {
  const h = historical(year);
  const e = electricity(year);
  if (driverId === STAGE17_DRIVER_HYPOTHESES.renewableCapacityIntensity.id) {
    return h.renewableCapacityGw / h.totalEnergySupplyTWh;
  }
  if (driverId === STAGE17_DRIVER_HYPOTHESES.renewableElectricityShare.id) {
    return e.renewableElectricitySharePct;
  }
  if (driverId === STAGE17_DRIVER_HYPOTHESES.lowCarbonElectricityShare.id) {
    return e.renewableElectricitySharePct + e.nuclearElectricitySharePct;
  }
  throw new Error("unknown Stage 17 driver " + driverId);
}

export function stage17ObservedDependency(year, normalizationYear) {
  if (year < 2000 || year > 2025) throw new Error("year outside 2000-2025");
  return fossilShare(year) / fossilShare(normalizationYear);
}

export function stage17DriverIndex(year, driverId, normalizationYear) {
  if (!Number.isFinite(year)) throw new Error("year must be finite");
  if (year < 2000 || year > 2025) throw new Error("driver year outside 2000-2025");
  const norm = rawDriver(normalizationYear, driverId);
  const a = Math.floor(year), b = Math.ceil(year);
  const av = rawDriver(a, driverId) / norm;
  if (a === b) return av;
  const bv = rawDriver(b, driverId) / norm;
  return av + (bv - av) * (year - a);
}

function desired(driverIndex, beta) {
  return driverIndex ** (-beta);
}
function gridValues({ min, max, step }) {
  const n = Math.round((max - min) / step);
  return Array.from({ length: n + 1 }, (_, i) =>
    Number((min + i * step).toFixed(12)),
  );
}
function yearsInclusive(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}
function metrics(rows) {
  const errors = rows.map(r => r.predicted - r.observed);
  return Object.freeze({
    n: rows.length,
    rmse: Math.sqrt(errors.reduce((s, e) => s + e * e, 0) / errors.length),
    mae: errors.reduce((s, e) => s + Math.abs(e), 0) / errors.length,
    bias: errors.reduce((s, e) => s + e, 0) / errors.length,
  });
}

function staticRows({ driverId, beta, startYear, endYear, normalizationYear }) {
  return yearsInclusive(startYear, endYear).map(year => ({
    year,
    predicted: desired(stage17DriverIndex(year, driverId, normalizationYear), beta),
    observed: stage17ObservedDependency(year, normalizationYear),
  }));
}

function dynamicRows({
  driverId,
  beta,
  tauYears,
  startYear,
  endYear,
  normalizationYear,
}) {
  let year = startYear;
  let state = stage17ObservedDependency(startYear, normalizationYear);
  const rows = [{
    year,
    predicted: state,
    observed: stage17ObservedDependency(year, normalizationYear),
  }];
  while (year < endYear - 1e-12) {
    const dt = Math.min(DT, endYear - year);
    const mid = year + dt / 2;
    const target = desired(
      stage17DriverIndex(mid, driverId, normalizationYear),
      beta,
    );
    const decay = Math.exp(-dt / tauYears);
    state = target + (state - target) * decay;
    year += dt;
    const rounded = Math.round(year);
    if (Math.abs(year - rounded) < 1e-9) {
      rows.push({
        year: rounded,
        predicted: state,
        observed: stage17ObservedDependency(rounded, normalizationYear),
      });
    }
  }
  return rows;
}

export function fitStage17Fold(fold, driverId, structure) {
  const [trainStart, trainEnd] = fold.train;
  const [testStart, testEnd] = fold.test;
  if (fold.normalizationYear !== trainEnd) {
    throw new Error("normalization must equal training endpoint");
  }
  if (testStart <= trainEnd) throw new Error("test must begin after training");

  let best = null;
  for (const beta of gridValues(BETA_GRID)) {
    if (structure === "static") {
      const trainRows = staticRows({
        driverId, beta, startYear: trainStart, endYear: trainEnd,
        normalizationYear: trainEnd,
      });
      const score = metrics(trainRows).rmse;
      const candidate = { beta, tauYears: null, trainRmse: score };
      if (!best || score < best.trainRmse - 1e-15) best = candidate;
    } else if (structure === "dynamic") {
      for (const tauYears of gridValues(TAU_GRID)) {
        const trainRows = dynamicRows({
          driverId, beta, tauYears, startYear: trainStart, endYear: trainEnd,
          normalizationYear: trainEnd,
        });
        const score = metrics(trainRows).rmse;
        const candidate = { beta, tauYears, trainRmse: score };
        if (
          !best ||
          score < best.trainRmse - 1e-15 ||
          (Math.abs(score - best.trainRmse) < 1e-15 && tauYears < best.tauYears)
        ) best = candidate;
      }
    } else {
      throw new Error("structure must be static or dynamic");
    }
  }

  let allRows;
  if (structure === "static") {
    allRows = staticRows({
      driverId, beta: best.beta, startYear: trainStart, endYear: testEnd,
      normalizationYear: trainEnd,
    });
  } else {
    allRows = dynamicRows({
      driverId, beta: best.beta, tauYears: best.tauYears,
      startYear: trainStart, endYear: testEnd, normalizationYear: trainEnd,
    });
  }
  const testRows = allRows.filter(r => r.year >= testStart && r.year <= testEnd);
  return Object.freeze({
    foldId: fold.id,
    driverId,
    structure,
    trainingWindow: Object.freeze([...fold.train]),
    testWindow: Object.freeze([...fold.test]),
    normalizationYear: trainEnd,
    fitted: Object.freeze(best),
    testRows: Object.freeze(testRows.map(Object.freeze)),
    testMetrics: metrics(testRows),
  });
}

function persistenceForFold(fold) {
  const [testStart, testEnd] = fold.test;
  const rows = yearsInclusive(testStart, testEnd).map(year => ({
    year,
    predicted: 1,
    observed: stage17ObservedDependency(year, fold.normalizationYear),
  }));
  return Object.freeze({
    foldId: fold.id,
    testRows: Object.freeze(rows.map(Object.freeze)),
    testMetrics: metrics(rows),
  });
}

function aggregateFoldResults(results) {
  const rows = results.flatMap(r => r.testRows);
  const m = metrics(rows);
  return Object.freeze({
    pooledMetrics: m,
    meanFoldRmse: mean(results.map(r => r.testMetrics.rmse)),
    medianFoldRmse: median(results.map(r => r.testMetrics.rmse)),
    foldRmse: Object.freeze(results.map(r => Object.freeze({
      foldId: r.foldId,
      rmse: r.testMetrics.rmse,
    }))),
    totalTestObservations: rows.length,
  });
}
function mean(xs) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
function median(xs) {
  const x = [...xs].sort((a, b) => a - b);
  const m = Math.floor(x.length / 2);
  return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2;
}

export function runStage17RollingOriginComparison() {
  const candidates = [];
  for (const h of Object.values(STAGE17_DRIVER_HYPOTHESES)) {
    for (const structure of STAGE17_PROTOCOL.structures) {
      const folds = STAGE17_FOLDS.map(f => fitStage17Fold(f, h.id, structure));
      candidates.push(Object.freeze({
        driverId: h.id,
        structure,
        folds: Object.freeze(folds),
        aggregate: aggregateFoldResults(folds),
      }));
    }
  }
  candidates.sort(
    (a, b) =>
      a.aggregate.pooledMetrics.rmse - b.aggregate.pooledMetrics.rmse ||
      (a.structure === "static" ? -1 : 1),
  );

  const persistenceFolds = STAGE17_FOLDS.map(persistenceForFold);
  const persistence = aggregateFoldResults(persistenceFolds);
  const selected = candidates[0];

  return Object.freeze({
    protocol: STAGE17_PROTOCOL,
    candidates: Object.freeze(candidates),
    persistence,
    selected: Object.freeze({
      driverId: selected.driverId,
      structure: selected.structure,
      pooledRmse: selected.aggregate.pooledMetrics.rmse,
      pooledMae: selected.aggregate.pooledMetrics.mae,
      pooledBias: selected.aggregate.pooledMetrics.bias,
      meanFoldRmse: selected.aggregate.meanFoldRmse,
      skillVsPersistence:
        1 -
        selected.aggregate.pooledMetrics.rmse /
          Math.max(1e-12, persistence.pooledMetrics.rmse),
    }),
    externalValidationClaim: false,
    interpretation:
      "Stage 17 is internal rolling-origin structural comparison after the original holdout was consumed. The selected structure requires separate external validation before being called validated.",
  });
}
