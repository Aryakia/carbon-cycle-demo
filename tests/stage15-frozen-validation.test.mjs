import assert from "node:assert/strict";
import { STAGE15_FROZEN_DEPENDENCY_VALIDATION as frozen } from "../data/stage15-dependency-validation.js";
import { evaluateStage15Validation } from "../model/dependency-validation.js";

const recomputed = evaluateStage15Validation();

assert.equal(frozen.holdoutConsumed, true);
assert.equal(frozen.parametersRetunedAfterHoldout, false);
assert.deepEqual(frozen.validationWindow, [2018, 2025]);
assert.equal(frozen.stage14FrozenCommit, "4f380fe7f49c469379ce4e920bfc4db3fd0e5cd8");

for (let i = 0; i < frozen.primaryModel.rows.length; i++) {
  const a = frozen.primaryModel.rows[i];
  const b = recomputed.primary.rows[i];
  assert.equal(a.year, b.year);
  assert.ok(Math.abs(a.predicted - b.predicted) < 1e-15);
  assert.ok(Math.abs(a.observed - b.observed) < 1e-15);
}
for (const key of ["rmse", "mae", "bias"]) {
  assert.ok(
    Math.abs(frozen.primaryModel.metrics[key] - recomputed.primary.metrics[key]) < 1e-15,
    key,
  );
}
assert.ok(
  Math.abs(
    frozen.primaryModel.metrics.skillVsPersistence -
      recomputed.primary.skillVsPersistence,
  ) < 1e-15,
);

const benchmarkMap = {
  persistence: recomputed.benchmarks.persistence.metrics,
  staticTrainingSelected: recomputed.benchmarks.staticTrainingSelected.metrics,
  turnoverConstrainedTrainingSelected:
    recomputed.benchmarks.turnoverConstrainedTrainingSelected.metrics,
};
for (const [name, metrics] of Object.entries(benchmarkMap)) {
  for (const key of ["rmse", "mae", "bias"]) {
    assert.ok(
      Math.abs(frozen.benchmarks[name][key] - metrics[key]) < 1e-15,
      name + " " + key,
    );
  }
}
for (const key of ["rmse", "mae", "bias"]) {
  assert.ok(
    Math.abs(frozen.covidSensitivity.primary[key] - recomputed.shockSensitivity.primary[key]) <
      1e-15,
  );
  assert.ok(
    Math.abs(
      frozen.covidSensitivity.persistence[key] -
        recomputed.shockSensitivity.persistence[key],
    ) < 1e-15,
  );
}

assert.ok(
  frozen.benchmarks.staticTrainingSelected.rmse <
    frozen.primaryModel.metrics.rmse,
  "static training-selected model should retain its observed holdout advantage",
);
assert.ok(
  frozen.primaryModel.metrics.rmse <
    frozen.benchmarks.persistence.rmse,
  "frozen dynamic model should retain positive holdout skill versus persistence",
);
assert.ok(
  frozen.primaryModel.rows.every(r => r.predicted - r.observed > 0),
  "systematic positive holdout residual should remain explicit",
);

console.log("Frozen Stage 15 holdout result exactly reproduces from source data/code.");
