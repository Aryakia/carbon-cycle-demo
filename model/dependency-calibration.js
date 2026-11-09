import {
  HISTORICAL_REFERENCE_ROWS,
} from "../data/historical-reference-2000-2025.js";
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
const TAU_PRIOR_MIN = CALIBRATION_PRIORS.fossilDemandCapitalLifetimeYears.lower;
const TAU_MAX = CALIBRATION_PRIORS.fossilDemandCapitalLifetimeYears.upper;
const TAU_STEP = 0.5;
const TRAINING_REFERENCE_YEAR = HISTORICAL_SPLIT.trainingEnd;

function annualReference(year) {
  const row = HISTORICAL_REFERENCE_ROWS.find(r => r.year === year);
  if (!row) throw new Error("missing historical reference year " + year);
  return row;
}

const trainingReference = annualReference(TRAINING_REFERENCE_YEAR);
const initialReference = annualReference(HISTORICAL_SPLIT.trainingStart);

function fossilShare(row) {
  return row.fossilEnergyConsumptionTWh / row.totalEnergySupplyTWh;
}

const trainingReferenceFossilShare = fossilShare(trainingReference);
const trainingReferenceRenewableIntensity =
  trainingReference.renewableCapacityGw / trainingReference.totalEnergySupplyTWh;

export const DEPENDENCY_CALIBRATION_CONFIG = Object.freeze({
  trainingStart: HISTORICAL_SPLIT.trainingStart,
  trainingEnd: HISTORICAL_SPLIT.trainingEnd,
  validationStart: HISTORICAL_SPLIT.validationStart,
  validationEnd: HISTORICAL_SPLIT.validationEnd,
  trainingNormalizationYear: TRAINING_REFERENCE_YEAR,
  dtYears: DT_YEARS,
  cleanElasticityGrid: Object.freeze({
    min: ELASTICITY_MIN,
    max: ELASTICITY_MAX,
    step: ELASTICITY_STEP,
  }),
  turnoverConstrainedAdjustmentTimeGridYears: Object.freeze({
    min: TAU_PRIOR_MIN,
    max: TAU_MAX,
    step: TAU_STEP,
  }),
  effectiveAdjustmentDiagnosticGridYears: Object.freeze({
    min: 3,
    max: TAU_MAX,
    step: TAU_STEP,
  }),
  selectionRule:
    "All observed targets and clean indices are normalized to the 2017 training endpoint. Choose parameters using 2000-2017 RMSE only. No 2018-2025 value is read by the calibration/simulation path.",
});

export const DEPENDENCY_HYPOTHESES = Object.freeze({
  absoluteRenewableCapacity: Object.freeze({
    id: "absolute-renewable-capacity",
    label: "Absolute renewable-capacity hypothesis",
    interpretation:
      "Desired fossil dependency responds to installed renewable power capacity relative to the 2017 training-end level.",
  }),
  renewableCapacityIntensity: Object.freeze({
    id: "renewable-capacity-intensity",
    label: "Renewable-capacity intensity hypothesis",
    interpretation:
      "Desired fossil dependency responds to renewable capacity per unit of total primary-energy supply, normalized to the 2017 training-end level.",
  }),
});

function cleanIndexAtAnnualYear(year, hypothesisId) {
  if (year > HISTORICAL_SPLIT.trainingEnd) {
    throw new Error(
      "Stage 14 calibration is sealed at 2017; held-out years require the Stage 15 validation module",
    );
  }
  const row = annualReference(year);
  if (hypothesisId === DEPENDENCY_HYPOTHESES.absoluteRenewableCapacity.id) {
    return row.renewableCapacityGw / trainingReference.renewableCapacityGw;
  }
  if (hypothesisId === DEPENDENCY_HYPOTHESES.renewableCapacityIntensity.id) {
    const intensity = row.renewableCapacityGw / row.totalEnergySupplyTWh;
    return intensity / trainingReferenceRenewableIntensity;
  }
  throw new Error("unknown dependency hypothesis: " + hypothesisId);
}

export function cleanCompetitionIndexAt(year, hypothesisId) {
  if (!Number.isFinite(year)) throw new Error("year must be finite");
  if (
    year < HISTORICAL_SPLIT.trainingStart ||
    year > HISTORICAL_SPLIT.trainingEnd
  ) {
    throw new Error(
      "Stage 14 clean competition index supports the sealed 2000-2017 training window only",
    );
  }
  const floor = Math.floor(year);
  const ceil = Math.ceil(year);
  const a = cleanIndexAtAnnualYear(floor, hypothesisId);
  if (floor === ceil) return a;
  const b = cleanIndexAtAnnualYear(ceil, hypothesisId);
  const f = year - floor;
  return a + (b - a) * f;
}

export function observedTrainingDependency(year) {
  if (
    year < HISTORICAL_SPLIT.trainingStart ||
    year > HISTORICAL_SPLIT.trainingEnd
  ) {
    throw new Error(
      "Stage 14 observed dependency supports the sealed 2000-2017 training window only",
    );
  }
  return fossilShare(annualReference(year)) / trainingReferenceFossilShare;
}

export function desiredFossilDependency(cleanIndex, cleanElasticity) {
  if (!Number.isFinite(cleanIndex) || cleanIndex <= 0) {
    throw new Error("cleanIndex must be finite and positive");
  }
  if (!Number.isFinite(cleanElasticity) || cleanElasticity < 0) {
    throw new Error("cleanElasticity must be finite and nonnegative");
  }
  // Normalized power-law response. At the training-end clean reference (=1),
  // desired fossil dependency is exactly 1.
  return cleanIndex ** (-cleanElasticity);
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
  if (
    endYear < HISTORICAL_SPLIT.trainingStart ||
    endYear > HISTORICAL_SPLIT.trainingEnd
  ) {
    throw new Error(
      "Stage 14 simulation cannot enter the 2018-2025 holdout window",
    );
  }

  let year = HISTORICAL_SPLIT.trainingStart;
  let dependency = observedTrainingDependency(year);
  const rows = [{
    year,
    fossilDependency: dependency,
    observedFossilDependency: observedTrainingDependency(year),
    cleanCompetitionIndex: cleanCompetitionIndexAt(year, hypothesisId),
    desiredFossilDependency: desiredFossilDependency(
      cleanCompetitionIndexAt(year, hypothesisId),
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
        observedFossilDependency: observedTrainingDependency(rounded),
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
  if (
    rows.some(
      row =>
        row.year < HISTORICAL_SPLIT.trainingStart ||
        row.year > HISTORICAL_SPLIT.trainingEnd,
    )
  ) {
    throw new Error("Stage 14 RMSE cannot score held-out years");
  }
  const mse =
    rows.reduce(
      (sum, row) =>
        sum + (row.fossilDependency - row.observedFossilDependency) ** 2,
      0,
    ) / rows.length;
  return Math.sqrt(mse);
}

export function persistenceBaselineRmse() {
  const initial = observedTrainingDependency(HISTORICAL_SPLIT.trainingStart);
  const rows = HISTORICAL_REFERENCE_ROWS.filter(
    row =>
      row.year >= HISTORICAL_SPLIT.trainingStart &&
      row.year <= HISTORICAL_SPLIT.trainingEnd,
  );
  const mse =
    rows.reduce(
      (sum, row) =>
        sum + (initial - observedTrainingDependency(row.year)) ** 2,
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

function calibrateDependencyHypothesisOnGrid(
  hypothesisId,
  {
    tauMin = TAU_PRIOR_MIN,
    tauMax = TAU_MAX,
    tauStep = TAU_STEP,
    diagnosticLabel = "turnover-constrained",
  } = {},
) {
  const elasticities = gridValues(
    ELASTICITY_MIN,
    ELASTICITY_MAX,
    ELASTICITY_STEP,
  );
  const taus = gridValues(tauMin, tauMax, tauStep);
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

  return {
    hypothesisId,
    best,
    nearOptimalDefinition:
      "Parameter combinations with training RMSE within 5% of the minimum; this is a practical ridge diagnostic, not a statistical confidence interval.",
    nearOptimalCount: nearOptimal.length,
    nearOptimalEnvelope: {
      cleanElasticity: [
        Math.min(...nearOptimal.map(c => c.cleanElasticity)),
        Math.max(...nearOptimal.map(c => c.cleanElasticity)),
      ],
      adjustmentTimeYears: [
        Math.min(...nearOptimal.map(c => c.adjustmentTimeYears)),
        Math.max(...nearOptimal.map(c => c.adjustmentTimeYears)),
      ],
    },
    searchGrid: {
      label: diagnosticLabel,
      cleanElasticity: DEPENDENCY_CALIBRATION_CONFIG.cleanElasticityGrid,
      adjustmentTimeYears: {
        min: tauMin,
        max: tauMax,
        step: tauStep,
      },
      candidateCount: candidates.length,
    },
    bestAtLowerTauBoundary:
      Math.abs(best.adjustmentTimeYears - tauMin) < 1e-12,
    bestAtUpperTauBoundary:
      Math.abs(best.adjustmentTimeYears - tauMax) < 1e-12,
  };
}

export function calibrateDependencyHypothesis(hypothesisId) {
  return calibrateDependencyHypothesisOnGrid(hypothesisId);
}

export function runDependencyBoundaryStressTest() {
  const g = DEPENDENCY_CALIBRATION_CONFIG.effectiveAdjustmentDiagnosticGridYears;
  return Object.values(DEPENDENCY_HYPOTHESES)
    .map(h =>
      calibrateDependencyHypothesisOnGrid(h.id, {
        tauMin: g.min,
        tauMax: g.max,
        tauStep: g.step,
        diagnosticLabel: "effective-adjustment-diagnostic",
      }),
    )
    .sort((a, b) => a.best.trainingRmse - b.best.trainingRmse);
}

export function calibrateDependencyModule() {
  const fits = Object.values(DEPENDENCY_HYPOTHESES).map(h =>
    calibrateDependencyHypothesis(h.id),
  );
  fits.sort((a, b) => a.best.trainingRmse - b.best.trainingRmse);
  const persistenceRmse = persistenceBaselineRmse();
  const turnoverConstrained = fits[0];
  const effectiveAdjustmentFits = runDependencyBoundaryStressTest();
  const effectiveCandidate = effectiveAdjustmentFits[0];

  return {
    calibrationWindow: [
      HISTORICAL_SPLIT.trainingStart,
      HISTORICAL_SPLIT.trainingEnd,
    ],
    heldOutWindow: [
      HISTORICAL_SPLIT.validationStart,
      HISTORICAL_SPLIT.validationEnd,
    ],
    normalizationYear: TRAINING_REFERENCE_YEAR,
    holdoutAccessed: false,
    persistenceBaselineRmse: persistenceRmse,
    turnoverConstrainedResult: {
      selectedHypothesisId: turnoverConstrained.hypothesisId,
      selectedParameters: {
        cleanElasticity: turnoverConstrained.best.cleanElasticity,
        adjustmentTimeYears: turnoverConstrained.best.adjustmentTimeYears,
      },
      selectedTrainingRmse: turnoverConstrained.best.trainingRmse,
      bestAtLowerTauBoundary: turnoverConstrained.bestAtLowerTauBoundary,
      hypotheses: fits,
    },
    effectiveAdjustmentCandidate: {
      rationale:
        "Because the turnover-constrained fit reaches the 15-year lower boundary, this diagnostic treats tau as an effective aggregate dependency-adjustment time rather than a literal asset lifetime.",
      selectedHypothesisId: effectiveCandidate.hypothesisId,
      selectedParameters: {
        cleanElasticity: effectiveCandidate.best.cleanElasticity,
        adjustmentTimeYears: effectiveCandidate.best.adjustmentTimeYears,
      },
      selectedTrainingRmse: effectiveCandidate.best.trainingRmse,
      improvementVsPersistence:
        1 -
        effectiveCandidate.best.trainingRmse / Math.max(1e-12, persistenceRmse),
      nearOptimalEnvelope: effectiveCandidate.nearOptimalEnvelope,
      hypotheses: effectiveAdjustmentFits,
    },
    interpretation:
      "Stage 14 calibrates only the fossil-dependency partition. It does not estimate supply capacity, capability, institutions, or use any 2018-2025 value, including for normalization.",
  };
}
