import {
  HISTORICAL_REFERENCE_ROWS,
} from "../data/historical-reference-2000-2025.js";
import {
  HISTORICAL_PROXY_ROWS,
} from "./historical-mapping.js";
import {
  HISTORICAL_SPLIT,
} from "./historical-drivers.js";
import {
  CALIBRATION_PRIORS,
} from "./calibration-priors.js";

const DT_YEARS = 0.25;
const ELASTICITY_MIN = 0;
const ELASTICITY_MAX = 0.08;
const ELASTICITY_STEP = 0.001;
const TAU_MIN = CALIBRATION_PRIORS.fossilDemandCapitalLifetimeYears.lower;
const TAU_MAX = CALIBRATION_PRIORS.fossilDemandCapitalLifetimeYears.upper;
const TAU_STEP = 0.5;

const reference2025 = HISTORICAL_REFERENCE_ROWS.at(-1);
const initialProxy = HISTORICAL_PROXY_ROWS[0];

export const DEPENDENCY_CALIBRATION_CONFIG = Object.freeze({
  trainingStart: HISTORICAL_SPLIT.trainingStart,
  trainingEnd: HISTORICAL_SPLIT.trainingEnd,
  validationStart: HISTORICAL_SPLIT.validationStart,
  validationEnd: HISTORICAL_SPLIT.validationEnd,
  dtYears: DT_YEARS,
  cleanElasticityGrid: Object.freeze({
    min: ELASTICITY_MIN,
    max: ELASTICITY_MAX,
    step: ELASTICITY_STEP,
  }),
  adjustmentTimeGridYears: Object.freeze({
    min: TAU_MIN,
    max: TAU_MAX,
    step: TAU_STEP,
  }),
  selectionRule:
    "Choose the hypothesis/parameter pair with minimum training-window RMSE only. The 2018-2025 holdout is not scored or inspected in this calibration function.",
});

export const DEPENDENCY_HYPOTHESES = Object.freeze({
  absoluteRenewableCapacity: Object.freeze({
    id: "absolute-renewable-capacity",
    label: "Absolute renewable-capacity hypothesis",
    interpretation:
      "Desired fossil dependency responds to global installed renewable power capacity relative to its 2025 level.",
  }),
  renewableCapacityIntensity: Object.freeze({
    id: "renewable-capacity-intensity",
    label: "Renewable-capacity intensity hypothesis",
    interpretation:
      "Desired fossil dependency responds to renewable capacity per unit of total primary-energy supply, each normalized consistently to 2025.",
  }),
});

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function annualReference(year) {
  const row = HISTORICAL_REFERENCE_ROWS.find(r => r.year === year);
  if (!row) throw new Error("missing historical reference year " + year);
  return row;
}

function cleanIndexAtAnnualYear(year, hypothesisId) {
  const row = annualReference(year);
  if (hypothesisId === DEPENDENCY_HYPOTHESES.absoluteRenewableCapacity.id) {
    return row.renewableCapacityGw / reference2025.renewableCapacityGw;
  }
  if (hypothesisId === DEPENDENCY_HYPOTHESES.renewableCapacityIntensity.id) {
    const intensity = row.renewableCapacityGw / row.totalEnergySupplyTWh;
    const referenceIntensity =
      reference2025.renewableCapacityGw / reference2025.totalEnergySupplyTWh;
    return intensity / referenceIntensity;
  }
  throw new Error("unknown dependency hypothesis: " + hypothesisId);
}

export function cleanCompetitionIndexAt(year, hypothesisId) {
  if (!Number.isFinite(year)) throw new Error("year must be finite");
  if (year < 2000 || year > 2025) {
    throw new Error("clean competition index supports 2000-2025 only");
  }
  const floor = Math.floor(year);
  const ceil = Math.ceil(year);
  const a = cleanIndexAtAnnualYear(floor, hypothesisId);
  if (floor === ceil) return a;
  const b = cleanIndexAtAnnualYear(ceil, hypothesisId);
  const f = year - floor;
  return a + (b - a) * f;
}

export function desiredFossilDependency(cleanIndex, cleanElasticity) {
  if (!Number.isFinite(cleanIndex) || cleanIndex <= 0) {
    throw new Error("cleanIndex must be finite and positive");
  }
  if (!Number.isFinite(cleanElasticity) || cleanElasticity < 0) {
    throw new Error("cleanElasticity must be finite and nonnegative");
  }
  // Normalized power-law response. At the 2025 clean reference (=1),
  // desired fossil dependency is exactly 1. Earlier clean indices below 1
  // imply desired dependency above 1 when elasticity > 0.
  return cleanIndex ** (-cleanElasticity);
}

function observedDependency(year) {
  const row = HISTORICAL_PROXY_ROWS.find(r => r.year === year);
  if (!row) throw new Error("missing dependency observation for " + year);
  return row.fossilDependencyIndex2025;
}

export function simulateDependencyModule({
  hypothesisId,
  cleanElasticity,
  adjustmentTimeYears,
  endYear = HISTORICAL_SPLIT.trainingEnd,
  dtYears = DT_YEARS,
} = {}) {
  if (!Object.values(DEPENDENCY_HYPOTHESES).some(h => h.id === hypothesisId)) {
    throw new Error("a known dependency hypothesisId is required");
  }
  if (!Number.isFinite(adjustmentTimeYears) || adjustmentTimeYears <= 0) {
    throw new Error("adjustmentTimeYears must be finite and positive");
  }
  if (endYear < 2000 || endYear > 2025) {
    throw new Error("endYear must lie within 2000-2025");
  }

  let year = 2000;
  let dependency = initialProxy.fossilDependencyIndex2025;
  const rows = [{
    year,
    fossilDependency: dependency,
    observedFossilDependency: observedDependency(2000),
    cleanCompetitionIndex: cleanCompetitionIndexAt(2000, hypothesisId),
    desiredFossilDependency: desiredFossilDependency(
      cleanCompetitionIndexAt(2000, hypothesisId),
      cleanElasticity,
    ),
  }];

  while (year < endYear - 1e-12) {
    const dt = Math.min(dtYears, endYear - year);
    const midYear = year + dt / 2;
    const cleanIndex = cleanCompetitionIndexAt(midYear, hypothesisId);
    const desired = desiredFossilDependency(cleanIndex, cleanElasticity);
    const decay = Math.exp(-dt / adjustmentTimeYears);
    dependency = desired + (dependency - desired) * decay;
    year += dt;

    const rounded = Math.round(year);
    if (Math.abs(year - rounded) < 1e-9) {
      rows.push({
        year: rounded,
        fossilDependency: dependency,
        observedFossilDependency: observedDependency(rounded),
        cleanCompetitionIndex: cleanCompetitionIndexAt(rounded, hypothesisId),
        desiredFossilDependency: desiredFossilDependency(
          cleanCompetitionIndexAt(rounded, hypothesisId),
          cleanElasticity,
        ),
      });
    }
  }
  return rows;
}

export function dependencyRmse(rows) {
  const training = rows.filter(
    row =>
      row.year >= HISTORICAL_SPLIT.trainingStart &&
      row.year <= HISTORICAL_SPLIT.trainingEnd,
  );
  if (!training.length) throw new Error("no training rows to score");
  const mse =
    training.reduce(
      (sum, row) =>
        sum + (row.fossilDependency - row.observedFossilDependency) ** 2,
      0,
    ) / training.length;
  return Math.sqrt(mse);
}

export function persistenceBaselineRmse() {
  const initial = initialProxy.fossilDependencyIndex2025;
  const rows = HISTORICAL_PROXY_ROWS.filter(
    row =>
      row.year >= HISTORICAL_SPLIT.trainingStart &&
      row.year <= HISTORICAL_SPLIT.trainingEnd,
  );
  const mse =
    rows.reduce(
      (sum, row) => sum + (initial - row.fossilDependencyIndex2025) ** 2,
      0,
    ) / rows.length;
  return Math.sqrt(mse);
}

function gridValues(min, max, step) {
  const n = Math.round((max - min) / step);
  return Array.from({ length: n + 1 }, (_, i) =>
    Number((min + i * step).toFixed(12)),
  );
}

export function calibrateDependencyHypothesis(hypothesisId) {
  const elasticities = gridValues(
    ELASTICITY_MIN,
    ELASTICITY_MAX,
    ELASTICITY_STEP,
  );
  const taus = gridValues(TAU_MIN, TAU_MAX, TAU_STEP);
  const candidates = [];

  for (const cleanElasticity of elasticities) {
    for (const adjustmentTimeYears of taus) {
      const rows = simulateDependencyModule({
        hypothesisId,
        cleanElasticity,
        adjustmentTimeYears,
        endYear: HISTORICAL_SPLIT.trainingEnd,
      });
      candidates.push({
        hypothesisId,
        cleanElasticity,
        adjustmentTimeYears,
        trainingRmse: dependencyRmse(rows),
      });
    }
  }

  candidates.sort(
    (a, b) =>
      a.trainingRmse - b.trainingRmse ||
      a.cleanElasticity - b.cleanElasticity ||
      a.adjustmentTimeYears - b.adjustmentTimeYears,
  );
  const best = candidates[0];
  const threshold = best.trainingRmse * 1.05 + 1e-12;
  const nearOptimal = candidates.filter(c => c.trainingRmse <= threshold);

  const elasticityRange = [
    Math.min(...nearOptimal.map(c => c.cleanElasticity)),
    Math.max(...nearOptimal.map(c => c.cleanElasticity)),
  ];
  const adjustmentTimeRangeYears = [
    Math.min(...nearOptimal.map(c => c.adjustmentTimeYears)),
    Math.max(...nearOptimal.map(c => c.adjustmentTimeYears)),
  ];

  return {
    hypothesisId,
    best,
    nearOptimalDefinition:
      "Parameter combinations with training RMSE within 5% of the minimum; this is a practical ridge diagnostic, not a statistical confidence interval.",
    nearOptimalCount: nearOptimal.length,
    nearOptimalEnvelope: {
      cleanElasticity: elasticityRange,
      adjustmentTimeYears: adjustmentTimeRangeYears,
    },
    searchGrid: {
      cleanElasticity: DEPENDENCY_CALIBRATION_CONFIG.cleanElasticityGrid,
      adjustmentTimeYears:
        DEPENDENCY_CALIBRATION_CONFIG.adjustmentTimeGridYears,
      candidateCount: candidates.length,
    },
  };
}

export function calibrateDependencyModule() {
  const fits = Object.values(DEPENDENCY_HYPOTHESES).map(h =>
    calibrateDependencyHypothesis(h.id),
  );
  fits.sort((a, b) => a.best.trainingRmse - b.best.trainingRmse);
  const persistenceRmse = persistenceBaselineRmse();
  const selected = fits[0];

  return {
    calibrationWindow: [
      HISTORICAL_SPLIT.trainingStart,
      HISTORICAL_SPLIT.trainingEnd,
    ],
    heldOutWindow: [
      HISTORICAL_SPLIT.validationStart,
      HISTORICAL_SPLIT.validationEnd,
    ],
    holdoutAccessed: false,
    persistenceBaselineRmse: persistenceRmse,
    hypotheses: fits,
    selectedHypothesisId: selected.hypothesisId,
    selectedParameters: {
      cleanElasticity: selected.best.cleanElasticity,
      adjustmentTimeYears: selected.best.adjustmentTimeYears,
    },
    selectedTrainingRmse: selected.best.trainingRmse,
    improvementVsPersistence:
      1 - selected.best.trainingRmse / Math.max(1e-12, persistenceRmse),
    interpretation:
      "This calibrates only the fossil-dependency submodel. It does not estimate supply capacity, capability, institutions, or use held-out 2018-2025 observations.",
  };
}
