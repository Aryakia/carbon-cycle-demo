import assert from "node:assert/strict";
import {
  buildStage16ResidualRows,
  diagnoseStage16Residuals,
  STAGE16_STRUCTURAL_HYPOTHESES,
  STAGE16_VALIDATION_PLAN,
} from "../model/residual-diagnosis.js";
import { STAGE16_DIAGNOSTIC_ELECTRICITY } from "../data/stage16-diagnostic-variables.js";

assert.equal(STAGE16_DIAGNOSTIC_ELECTRICITY.length,26);
assert.equal(STAGE16_DIAGNOSTIC_ELECTRICITY[0].year,2000);
assert.equal(STAGE16_DIAGNOSTIC_ELECTRICITY.at(-1).year,2025);

const rows=buildStage16ResidualRows();
assert.equal(rows.length,8);
assert.equal(rows[0].year,2018);
assert.equal(rows.at(-1).year,2025);
assert.ok(rows.every(r=>r.residual>0));

const d=diagnoseStage16Residuals();
assert.equal(d.holdoutConsumed,true);
assert.equal(d.diagnosticOnly,true);
assert.equal(d.allResidualsPositive,true);
assert.ok(Number.isFinite(d.residualTrendPerYear));
for(const a of Object.values(d.associations)){
  assert.ok(Number.isFinite(a.levelPearson));
  assert.ok(Number.isFinite(a.firstDifferencePearson));
  assert.equal(a.levelN,8);
  assert.equal(a.differenceN,7);
}
assert.ok(STAGE16_STRUCTURAL_HYPOTHESES.length>=4);
assert.deepEqual(STAGE16_VALIDATION_PLAN.proposedFolds[0],{train:[2000,2009],test:[2010,2013]});
assert.match(STAGE16_VALIDATION_PLAN.rule,/No revised model/);

console.log("Stage 16 residual diagnosis.\n"+JSON.stringify(d,null,2));
