import assert from "node:assert/strict";
import {
  runOneAtATimeSensitivity,
  runTimeStepStability,
} from "../model/validation.js";

assert.throws(\n  () => simulate({}, { dtYears: 0.5 }),\n  /supported maximum/,\n  "coarse half-year steps should be rejected rather than silently used",\n);\n\nconst sensitivity = runOneAtATimeSensitivity();
assert.equal(sensitivity.dimensions.length, 8);

for (const d of sensitivity.dimensions) {
  for (const outcome of [d.lowOutcome, d.highOutcome]) {
    for (const key of [
      "ppm2100",
      "fossilFlow2100GtCPerYr",
      "cumulativeFossilToAtmosphereGtC",
      "productionCapacity2100GtCPerYr",
      "remainingResourceGtC",
    ]) {
      assert.ok(Number.isFinite(outcome[key]), `${d.key}: ${key} not finite`);
      assert.ok(outcome[key] >= 0, `${d.key}: ${key} negative`);
    }
    assert.ok(outcome.maxAtmosphericBalanceResidualGtC < 1e-10);
    assert.ok(outcome.maxFossilTransferResidualGtC < 1e-8);
  }
}
assert.ok(sensitivity.envelope.ppm2100Max > sensitivity.envelope.ppm2100Min);
assert.ok(
  sensitivity.envelope.cumulativeFossilMaxGtC >
    sensitivity.envelope.cumulativeFossilMinGtC,
);

const stability = runTimeStepStability();
console.log("Time-step diagnostics:", JSON.stringify(stability.scenarios.map(s => ({
  name: s.name,
  ppmDiffPct: +(s.maxRelativePpmDifference * 100).toFixed(3),
  cumulativeDiffPct: +(s.maxRelativeCumulativeDifference * 100).toFixed(3),
  outcomes: s.outcomes.map(o => ({
    dt: o.dtYears,
    ppm: +o.ppm2100.toFixed(3),
    cumulative: +o.cumulativeFossilToAtmosphereGtC.toFixed(3),
    fossilFlow: +o.fossilFlow2100GtCPerYr.toFixed(4),
  })),
}))));
for (const scenario of stability.scenarios) {
  assert.ok(
    scenario.maxRelativePpmDifference < 0.05,
    `${scenario.name}: ppm time-step sensitivity exceeds 5%`,
  );
  assert.ok(
    scenario.maxRelativeCumulativeDifference < 0.05,
    `${scenario.name}: cumulative-flow time-step sensitivity exceeds 5%`,
  );
}

console.log("Sensitivity and time-step stability checks passed.");
