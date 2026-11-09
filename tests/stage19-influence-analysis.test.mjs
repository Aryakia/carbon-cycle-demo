import assert from "node:assert/strict";
import {
  STAGE19_PROTOCOL,
  runStage19InfluenceAnalysis,
} from "../model/stage19-influence-analysis.js";

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
console.log("Stage 19 influence robustness.\n"+JSON.stringify(r,null,2));
