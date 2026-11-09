import assert from "node:assert/strict";
import {
  STAGE18_DRIVER_HYPOTHESES,
  STAGE18_FOLDS,
  STAGE18_PROTOCOL,
  fitStage18CountryFold,
  runStage18SpatialTransfer,
  stage18DriverIndex,
  stage18ObservedDependency,
} from "../model/spatial-transfer-validation.js";
import {
  STAGE18_COUNTRY_PANEL,
  STAGE18_PANEL_ROWS,
} from "../data/stage18-spatial-transfer-panel.js";

assert.equal(STAGE18_COUNTRY_PANEL.length,8);
assert.equal(STAGE18_PANEL_ROWS.length,200);
for(const c of STAGE18_COUNTRY_PANEL){
  assert.equal(STAGE18_PANEL_ROWS.filter(r=>r.code===c.code).length,25);
}
assert.equal(STAGE18_FOLDS.length,4);
assert.equal(STAGE18_PROTOCOL.claimBoundary.includes("not statistically independent"),true);

for(const c of STAGE18_COUNTRY_PANEL){
  for(const fold of STAGE18_FOLDS){
    assert.equal(stage18ObservedDependency(c.code,fold.normalizationYear,fold.normalizationYear),1);
    for(const h of Object.values(STAGE18_DRIVER_HYPOTHESES)){
      assert.ok(Math.abs(stage18DriverIndex(c.code,fold.normalizationYear,h.id,fold.normalizationYear)-1)<1e-12);
      for(const structure of ["static","dynamic"]){
        const r=fitStage18CountryFold(c.code,fold,h.id,structure);
        assert.equal(r.testRows.length,4);
        assert.ok(r.testRows.every(x=>x.year>fold.train[1]));
        assert.ok(r.fitted.beta>=0&&r.fitted.beta<=0.25);
        if(structure==="dynamic") assert.ok(r.fitted.tauYears>=0.5&&r.fitted.tauYears<=10);
        assert.ok(Number.isFinite(r.testMetrics.rmse));
      }
    }
  }
}

const result=runStage18SpatialTransfer();
assert.equal(result.candidates.length,6);
assert.equal(result.persistence.totalTestObservations,128);
assert.equal(result.candidates[0].aggregate.totalTestObservations,128);
assert.ok(Number.isFinite(result.selected.pooledRmse));
assert.ok(Number.isFinite(result.selected.skillVsPersistence));
console.log("Stage 18 spatial transfer result.\n"+JSON.stringify(result,null,2));
