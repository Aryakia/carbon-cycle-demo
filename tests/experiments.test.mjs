import assert from "node:assert/strict";
import { EXPERIMENTS, runExperiment } from "../model/experiments.js";

for (const id of Object.keys(EXPERIMENTS)) {
  const result = runExperiment(id);
  assert.ok(result.cases.length >= 2);
  for (const c of result.cases) {
    const s = c.summary;
    for (const key of [
      "emissions2050GtCPerYr",
      "emissions2100GtCPerYr",
      "ppm2100",
      "cumulativeFossilToAtmosphereGtC",
      "remainingResourceGtC",
      "productionCapacity2100GtCPerYr",
      "cleanCapital2100",
    ]) {
      assert.ok(Number.isFinite(s[key]), `${id}/${c.id}: non-finite ${key}`);
      assert.ok(s[key] >= 0, `${id}/${c.id}: negative ${key}`);
    }
    assert.ok(s.maxAtmosphericBalanceResidualGtC < 1e-10);
    assert.ok(s.maxFossilTransferResidualGtC < 1e-8);
  }
}

const timing = runExperiment("timing");
const early = timing.cases.find(c => c.id === "early").summary;
const delayed = timing.cases.find(c => c.id === "delayed").summary;
assert.ok(
  early.cumulativeFossilToAtmosphereGtC < delayed.cumulativeFossilToAtmosphereGtC,
  "within this model, earlier coordinated intervention should reduce cumulative fossil-to-atmosphere transfer",
);

const resistance = runExperiment("resistance");
const low = resistance.cases.find(c => c.id === "lowResistance").summary;
const high = resistance.cases.find(c => c.id === "highResistance").summary;
assert.ok(
  low.cumulativeFossilToAtmosphereGtC < high.cumulativeFossilToAtmosphereGtC,
  "within this model, lower institutional resistance should strengthen the coordinated policy response",
);

const initial = runExperiment("initialConditions");
const less = initial.cases.find(c => c.id === "lessDependent").summary;
const more = initial.cases.find(c => c.id === "moreDependent").summary;
assert.ok(
  less.cumulativeFossilToAtmosphereGtC < more.cumulativeFossilToAtmosphereGtC,
  "within this model, a more fossil-dependent initial condition should preserve more fossil transfer under the same policy",
);

// Reproducibility of the comparison layer.
assert.deepEqual(runExperiment("timing"), runExperiment("timing"));

console.log("Comparative-policy experiment checks passed.");
