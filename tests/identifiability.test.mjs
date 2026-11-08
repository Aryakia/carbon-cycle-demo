import assert from "node:assert/strict";
import {
  IDENTIFIABILITY_PARAMETERS,
  OBSERVABLE_OUTPUTS,
  SCREEN_YEARS,
  CALIBRATION_READINESS,
  runLocalIdentifiabilityScreen,
} from "../model/identifiability-screen.js";

const result = runLocalIdentifiabilityScreen();

assert.equal(result.parameters.length, IDENTIFIABILITY_PARAMETERS.length);
assert.deepEqual(result.outputs, [...OBSERVABLE_OUTPUTS]);
assert.deepEqual(result.years, [...SCREEN_YEARS]);

for (const p of result.parameters) {
  assert.equal(p.referenceVector.length, OBSERVABLE_OUTPUTS.length * SCREEN_YEARS.length);
  assert.equal(p.excitationVector.length, OBSERVABLE_OUTPUTS.length * SCREEN_YEARS.length);
  assert.ok(Number.isFinite(p.referenceNorm) && p.referenceNorm >= 0);
  assert.ok(Number.isFinite(p.excitationNorm) && p.excitationNorm >= 0);
  assert.ok(p.referenceVector.every(Number.isFinite));
  assert.ok(p.excitationVector.every(Number.isFinite));
}

for (const pair of result.highCollinearity) {
  assert.ok(pair.referenceAbsCosine >= 0 && pair.referenceAbsCosine <= 1 + 1e-12);
  assert.ok(pair.excitationAbsCosine >= 0 && pair.excitationAbsCosine <= 1 + 1e-12);
}

assert.ok(CALIBRATION_READINESS.doNotEstimateYet.includes("institutionalResistance"));
assert.ok(CALIBRATION_READINESS.doNotEstimateYet.includes("capacityInvestmentRatePerYr"));

console.log("Pre-calibration identifiability screen passed.", {
  weakReference: result.weakReference,
  policyDependent: result.policyDependent,
  strongestReference: [...result.parameters]
    .sort((a,b)=>b.referenceNorm-a.referenceNorm)
    .slice(0,5)
    .map(p=>[p.parameter,+p.referenceNorm.toFixed(3)]),
  highCollinearity: result.highCollinearity.slice(0,8).map(p=>[
    p.a,p.b,
    +Math.max(p.referenceAbsCosine,p.excitationAbsCosine).toFixed(3),
  ]),
});
