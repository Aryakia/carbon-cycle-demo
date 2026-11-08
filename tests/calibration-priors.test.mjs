import assert from "node:assert/strict";
import {
  CALIBRATION_PRIORS,
  FIXED_OR_SEPARATELY_CALIBRATED,
} from "../model/calibration-priors.js";

for (const [key, prior] of Object.entries(CALIBRATION_PRIORS)) {
  assert.ok(Number.isFinite(prior.default), `${key}: finite default required`);
  assert.ok(Number.isFinite(prior.lower) && Number.isFinite(prior.upper));
  assert.ok(prior.lower < prior.upper, `${key}: invalid bounds`);
  assert.ok(
    prior.default >= prior.lower && prior.default <= prior.upper,
    `${key}: default must lie within prior bounds`,
  );
  assert.ok(prior.treatment && prior.evidence && prior.caveat);
  assert.ok(Array.isArray(prior.sources) && prior.sources.length >= 1);
}

assert.equal(FIXED_OR_SEPARATELY_CALIBRATED.carbonCycleLifetimeScaleAlpha.value, 0.555);
assert.equal(FIXED_OR_SEPARATELY_CALIBRATED.baseFossilDemandGtCPerYr.value, 10.4);

console.log("Calibration prior checks passed.");
