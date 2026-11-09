import assert from "node:assert/strict";
import { STAGE14_FROZEN_DEPENDENCY_FIT } from "../data/stage14-dependency-fit.js";
import { calibrateDependencyModule } from "../model/dependency-calibration.js";

const recomputed = calibrateDependencyModule();
const frozen = STAGE14_FROZEN_DEPENDENCY_FIT;
const candidate = recomputed.effectiveAdjustmentCandidate;

assert.equal(frozen.frozenBeforeHoldout, true);
assert.equal(frozen.holdoutAccessedDuringSelection, false);
assert.deepEqual(frozen.calibrationWindow, [2000, 2017]);
assert.deepEqual(frozen.heldOutWindow, [2018, 2025]);
assert.equal(frozen.normalizationYear, 2017);

assert.equal(
  frozen.selectedHypothesisId,
  candidate.selectedHypothesisId,
);
assert.equal(
  frozen.selectedParameters.cleanElasticity,
  candidate.selectedParameters.cleanElasticity,
);
assert.equal(
  frozen.selectedParameters.effectiveAdjustmentTimeYears,
  candidate.selectedParameters.adjustmentTimeYears,
);
assert.ok(
  Math.abs(frozen.trainingMetrics.rmse - candidate.selectedTrainingRmse) <
    1e-15,
);
assert.ok(
  Math.abs(
    frozen.trainingMetrics.persistenceBaselineRmse -
      recomputed.persistenceBaselineRmse,
  ) < 1e-15,
);
assert.deepEqual(
  frozen.nearOptimalEnvelope5Pct.cleanElasticity,
  candidate.nearOptimalEnvelope.cleanElasticity,
);
assert.deepEqual(
  frozen.nearOptimalEnvelope5Pct.effectiveAdjustmentTimeYears,
  candidate.nearOptimalEnvelope.adjustmentTimeYears,
);
assert.equal(recomputed.structuralDecision.inertiaSupported, true);

console.log("Frozen Stage 14 training fit exactly reproduces from source data/code.");
