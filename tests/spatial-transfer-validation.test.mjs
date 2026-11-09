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
import {
  STAGE18_FROZEN_SPATIAL_TRANSFER_RESULT as frozen,
} from "../data/stage18-spatial-transfer-result.js";

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
    }
  }
}

// Exercise both structural forms directly without duplicating the full
// exhaustive research search that runStage18SpatialTransfer performs below.
for(const structure of ["static","dynamic"]){
  const r=fitStage18CountryFold(
    "USA",
    STAGE18_FOLDS[1],
    STAGE18_DRIVER_HYPOTHESES.lowCarbonElectricityShare.id,
    structure,
  );
  assert.equal(r.testRows.length,4);
  assert.ok(r.testRows.every(x=>x.year>r.trainingWindow[1]));
  assert.ok(r.fitted.beta>=0&&r.fitted.beta<=0.25);
  if(structure==="dynamic") assert.ok(r.fitted.tauYears>=0.5&&r.fitted.tauYears<=10);
  assert.ok(Number.isFinite(r.testMetrics.rmse));
}

const result=runStage18SpatialTransfer();
assert.equal(result.candidates.length,6);
assert.equal(result.persistence.totalTestObservations,128);
assert.equal(result.candidates[0].aggregate.totalTestObservations,128);
assert.ok(Number.isFinite(result.selected.pooledRmse));
assert.ok(Number.isFinite(result.selected.skillVsPersistence));

assert.equal(frozen.protocolFrozenBeforeScoring,true);
assert.equal(frozen.selected.driverId,result.selected.driverId);
assert.equal(frozen.selected.structure,result.selected.structure);
for(const key of ["pooledRmse","pooledMae","pooledBias","meanCountryRmse","medianCountryRmse","skillVsPersistence"]){
  assert.ok(Math.abs(frozen.selected[key]-result.selected[key])<1e-15,key);
}
assert.ok(Math.abs(frozen.persistence.pooledRmse-result.persistence.pooledMetrics.rmse)<1e-15);
assert.equal(frozen.ranking.length,result.candidates.length);
for(let i=0;i<frozen.ranking.length;i++){
  const a=frozen.ranking[i],b=result.candidates[i];
  assert.equal(a.driverId,b.driverId);
  assert.equal(a.structure,b.structure);
  assert.ok(Math.abs(a.pooledRmse-b.aggregate.pooledMetrics.rmse)<1e-15);
}
const selected=result.candidates[0];
const pmap=Object.fromEntries(result.persistence.byCountry.map(x=>[x.code,x]));
for(const a of frozen.selectedCountryResults){
  const b=selected.aggregate.byCountry.find(x=>x.code===a.code);
  assert.ok(b,a.code);
  assert.ok(Math.abs(a.rmse-b.rmse)<1e-15,a.code+" rmse");
  assert.ok(Math.abs(a.persistenceRmse-pmap[a.code].rmse)<1e-15,a.code+" persistence");
}
const beta0=selected.fits.filter(x=>x.fitted.beta===0).length;
const betaUpper=selected.fits.filter(x=>x.fitted.beta===0.25).length;
assert.equal(frozen.parameterBoundaryDiagnostics.betaAtZero,beta0);
assert.equal(frozen.parameterBoundaryDiagnostics.betaAtUpperBound,betaUpper);

console.log("Stage 18 spatial transfer result.\n"+JSON.stringify(result,null,2));
