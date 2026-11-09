import assert from "node:assert/strict";
import { STAGE16_FROZEN_RESIDUAL_DIAGNOSIS as frozen } from "../data/stage16-residual-diagnosis.js";
import { diagnoseStage16Residuals } from "../model/residual-diagnosis.js";

const d=diagnoseStage16Residuals();
assert.equal(frozen.holdoutConsumed,true);
assert.equal(frozen.diagnosticOnly,true);
assert.equal(frozen.allResidualsPositive,d.allResidualsPositive);
assert.ok(Math.abs(frozen.meanResidual-d.meanResidual)<1e-15);
assert.ok(Math.abs(frozen.residualTrendPerYear-d.residualTrendPerYear)<1e-15);
for(const [key,a] of Object.entries(frozen.associations)){
  assert.ok(Math.abs(a.levelPearson-d.associations[key].levelPearson)<1e-15,key+" level");
  assert.ok(Math.abs(a.firstDifferencePearson-d.associations[key].firstDifferencePearson)<1e-15,key+" diff");
}
assert.ok(
  frozen.associations.lowCarbonElectricitySharePct.firstDifferencePearson >
  frozen.associations.renewableCapacityIntensity.firstDifferencePearson
);
assert.match(frozen.caution,/not causal evidence/);
console.log("Frozen Stage 16 residual diagnosis exactly reproduces.");
