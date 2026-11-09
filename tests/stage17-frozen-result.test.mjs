import assert from "node:assert/strict";
import { STAGE17_FROZEN_ROLLING_ORIGIN_RESULT as frozen } from "../data/stage17-rolling-origin-result.js";
import { runStage17RollingOriginComparison } from "../model/rolling-origin-comparison.js";

const r=runStage17RollingOriginComparison();
assert.equal(frozen.externalValidationClaim,false);
assert.equal(r.externalValidationClaim,false);
assert.equal(frozen.selected.driverId,r.selected.driverId);
assert.equal(frozen.selected.structure,r.selected.structure);
for(const key of ["pooledRmse","pooledMae","pooledBias","meanFoldRmse","skillVsPersistence"]){
  assert.ok(Math.abs(frozen.selected[key]-r.selected[key])<1e-15,key);
}
assert.ok(Math.abs(frozen.persistence.pooledRmse-r.persistence.pooledMetrics.rmse)<1e-15);
assert.equal(frozen.ranking.length,r.candidates.length);
for(let i=0;i<frozen.ranking.length;i++){
  const a=frozen.ranking[i],b=r.candidates[i];
  assert.equal(a.driverId,b.driverId);
  assert.equal(a.structure,b.structure);
  assert.ok(Math.abs(a.pooledRmse-b.aggregate.pooledMetrics.rmse)<1e-15);
  assert.ok(Math.abs(a.pooledBias-b.aggregate.pooledMetrics.bias)<1e-15);
}
const selectedCandidate=r.candidates[0];
for(let i=0;i<frozen.selected.foldFits.length;i++){
  const a=frozen.selected.foldFits[i],b=selectedCandidate.folds[i];
  assert.equal(a.foldId,b.foldId);
  assert.equal(a.beta,b.fitted.beta);
  assert.ok(Math.abs(a.testRmse-b.testMetrics.rmse)<1e-15);
}
assert.ok(frozen.selected.improvementVsStaticCapacityIntensity>0.5);
assert.equal(frozen.parameterStability.stable,false);
console.log("Frozen Stage 17 rolling-origin result exactly reproduces.");
