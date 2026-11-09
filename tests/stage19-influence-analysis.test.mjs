import assert from "node:assert/strict";
import {
  STAGE19_PROTOCOL,
  runStage19InfluenceAnalysis,
} from "../model/stage19-influence-analysis.js";
import {
  STAGE19_FROZEN_INFLUENCE_RESULT as frozen,
} from "../data/stage19-influence-result.js";

const r=runStage19InfluenceAnalysis();
assert.equal(STAGE19_PROTOCOL.type,"secondary robustness / influence analysis");
assert.equal(r.leaveOneOut.length,8);
assert.equal(r.countrySkills.length,8);
assert.equal(r.meanCountryRanking.length,6);
assert.ok(Number.isFinite(r.betaSummary.mean));
assert.equal(r.betaSummary.atLowerBound,4);
assert.equal(r.betaSummary.atUpperBound,3);
for(const x of r.leaveOneOut){
  assert.equal(x.ranking.length,6);
  assert.equal(x.persistence.n,112);
  assert.ok(Number.isFinite(x.selected.rmse));
  assert.ok(Number.isFinite(x.selected.skillVsPersistence));
}
assert.equal(frozen.primaryStage18Unchanged,true);
assert.equal(frozen.allLeaveOneOutPreservePrimary,r.allLeaveOneOutPreservePrimary);
assert.equal(frozen.selected.driverId,r.stage18Primary.driverId);
assert.equal(frozen.selected.structure,r.stage18Primary.structure);
for(const a of frozen.leaveOneOut){
  const b=r.leaveOneOut.find(x=>x.omittedCode===a.omittedCode);
  assert.ok(b,a.omittedCode);
  assert.ok(Math.abs(a.rmse-b.selected.rmse)<1e-15,a.omittedCode+" rmse");
  assert.ok(Math.abs(a.skillVsPersistence-b.selected.skillVsPersistence)<1e-15,a.omittedCode+" skill");
}
assert.equal(frozen.equalCountryRanking.length,r.meanCountryRanking.length);
for(let i=0;i<frozen.equalCountryRanking.length;i++){
  const a=frozen.equalCountryRanking[i],b=r.meanCountryRanking[i];
  assert.equal(a.driverId,b.driverId);
  assert.equal(a.structure,b.structure);
  assert.ok(Math.abs(a.meanCountryRmse-b.meanCountryRmse)<1e-15);
}
assert.equal(frozen.betaSummary.atLowerBound,r.betaSummary.atLowerBound);
assert.equal(frozen.betaSummary.atUpperBound,r.betaSummary.atUpperBound);
console.log("Stage 19 influence robustness.\n"+JSON.stringify(r,null,2));
