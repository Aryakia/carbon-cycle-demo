import assert from "node:assert/strict";
import {
  STAGE17_DRIVER_HYPOTHESES,
  STAGE17_FOLDS,
  STAGE17_PROTOCOL,
  fitStage17Fold,
  runStage17RollingOriginComparison,
  stage17DriverIndex,
  stage17ObservedDependency,
} from "../model/rolling-origin-comparison.js";

assert.equal(STAGE17_FOLDS.length,4);
assert.deepEqual(STAGE17_FOLDS[0].train,[2000,2009]);
assert.deepEqual(STAGE17_FOLDS[0].test,[2010,2013]);
assert.equal(STAGE17_PROTOCOL.externalValidationClaim,false);

for(const fold of STAGE17_FOLDS){
  assert.equal(fold.normalizationYear,fold.train[1]);
  assert.equal(stage17ObservedDependency(fold.train[1],fold.normalizationYear),1);
  for(const h of Object.values(STAGE17_DRIVER_HYPOTHESES)){
    assert.ok(Math.abs(stage17DriverIndex(fold.train[1],h.id,fold.normalizationYear)-1)<1e-12);
    for(const structure of ["static","dynamic"]){
      const r=fitStage17Fold(fold,h.id,structure);
      assert.deepEqual(r.trainingWindow,fold.train);
      assert.deepEqual(r.testWindow,fold.test);
      assert.equal(r.testRows.length,4);
      assert.ok(r.testRows.every(x=>x.year>fold.train[1]));
      assert.ok(Number.isFinite(r.testMetrics.rmse));
      assert.ok(r.fitted.beta>=0&&r.fitted.beta<=0.08);
      if(structure==="dynamic") assert.ok(r.fitted.tauYears>=0.5&&r.fitted.tauYears<=10);
    }
  }
}

const result=runStage17RollingOriginComparison();
assert.equal(result.candidates.length,6);
assert.equal(result.persistence.totalTestObservations,16);
assert.equal(result.selected.skillVsPersistence,
  1-result.selected.pooledRmse/result.persistence.pooledMetrics.rmse);
assert.equal(result.externalValidationClaim,false);
assert.ok(Number.isFinite(result.selected.pooledRmse));
console.log("Stage 17 rolling-origin structural comparison.\n"+JSON.stringify(result,null,2));
