import assert from "node:assert/strict";
import {
  DEFAULT_PARAMETERS,
  calculateSignals,
  createInitialState,
} from "../model/upstream-engine.js";
import {
  DEPENDENCY_CALIBRATION_CONFIG,
  DEPENDENCY_HYPOTHESES,
  calibrateDependencyModule,
  cleanCompetitionIndexAt,
  desiredFossilDependency,
  persistenceBaselineRmse,
  simulateDependencyModule,
} from "../model/dependency-calibration.js";

// Semantic guard: aggregate energy activity scales realized demand but should
// not scale the desired fossil-dependency stock.
const state = createInitialState({
  fossilDemandCapital: 1,
  cleanCapital: 0.32,
});
const base = calculateSignals(state, {
  ...DEFAULT_PARAMETERS,
  energyActivityIndex: 1,
  expectedFutureDemandIndex: 1,
});
const doubledActivity = calculateSignals(state, {
  ...DEFAULT_PARAMETERS,
  energyActivityIndex: 2,
  expectedFutureDemandIndex: 1,
});
assert.ok(
  Math.abs(doubledActivity.fossilDemandSignal / base.fossilDemandSignal - 2) <
    1e-12,
);
assert.ok(
  Math.abs(
    doubledActivity.desiredFossilDemandCapital -
      base.desiredFossilDemandCapital,
  ) < 1e-12,
  "energy-system scale must not be counted twice in fossil dependency",
);

assert.equal(DEPENDENCY_CALIBRATION_CONFIG.trainingEnd, 2017);
assert.equal(DEPENDENCY_CALIBRATION_CONFIG.validationStart, 2018);
assert.ok(cleanCompetitionIndexAt(2000, "absolute-renewable-capacity") > 0);
assert.ok(
  cleanCompetitionIndexAt(2000, "renewable-capacity-intensity") > 0,
);
assert.equal(
  cleanCompetitionIndexAt(2025, "absolute-renewable-capacity"),
  1,
);
assert.equal(
  cleanCompetitionIndexAt(2025, "renewable-capacity-intensity"),
  1,
);
assert.equal(desiredFossilDependency(1, 0.04), 1);
assert.ok(desiredFossilDependency(0.5, 0.04) > 1);

for (const h of Object.values(DEPENDENCY_HYPOTHESES)) {
  const rows = simulateDependencyModule({
    hypothesisId: h.id,
    cleanElasticity: 0.02,
    adjustmentTimeYears: 20,
  });
  assert.equal(rows[0].year, 2000);
  assert.equal(rows.at(-1).year, 2017);
  assert.ok(
    rows.every(
      row =>
        Number.isFinite(row.fossilDependency) &&
        Number.isFinite(row.observedFossilDependency),
    ),
  );
}

const result = calibrateDependencyModule();
assert.equal(result.holdoutAccessed, false);
assert.deepEqual(result.calibrationWindow, [2000, 2017]);
assert.deepEqual(result.heldOutWindow, [2018, 2025]);
assert.ok(Number.isFinite(result.persistenceBaselineRmse));
assert.equal(result.persistenceBaselineRmse, persistenceBaselineRmse());
assert.ok(result.selectedTrainingRmse >= 0);
assert.ok(result.hypotheses.length === 2);
assert.ok(
  Object.values(DEPENDENCY_HYPOTHESES)
    .map(h => h.id)
    .includes(result.selectedHypothesisId),
);
for (const fit of result.hypotheses) {
  assert.ok(fit.searchGrid.candidateCount > 1000);
  assert.ok(fit.best.cleanElasticity >= 0 && fit.best.cleanElasticity <= 0.08);
  assert.ok(
    fit.best.adjustmentTimeYears >=
      DEPENDENCY_CALIBRATION_CONFIG.adjustmentTimeGridYears.min,
  );
  assert.ok(
    fit.best.adjustmentTimeYears <=
      DEPENDENCY_CALIBRATION_CONFIG.adjustmentTimeGridYears.max,
  );
  assert.ok(fit.nearOptimalCount >= 1);
}

console.log("Stage 14 dependency calibration checks passed.", result);
