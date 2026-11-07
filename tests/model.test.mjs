import assert from "node:assert/strict";
import {
  ppmToGtC,
  gtCToPpm,
  gtCToGtCO2,
  stepAtmosphere,
} from "../model/conservation.js";
import {
  createInitialState,
  stepUpstream,
  simulate,
  SCENARIOS,
} from "../model/upstream-engine.js";

function approx(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected} ± ${tolerance}, received ${actual}`,
  );
}

// Unit conversions.
approx(ppmToGtC(1), 2.12, 1e-12, "1 ppm to GtC");
approx(gtCToPpm(2.12), 1, 1e-12, "2.12 GtC to ppm");
approx(gtCToGtCO2(1), 44 / 12, 1e-12, "GtC to GtCO2");

// Explicit atmospheric accounting identity.
const atm = stepAtmosphere({
  atmosphereGtC: 900,
  fossilIndustrialGtCPerYr: 10,
  landUseGtCPerYr: 1,
  landSinkGtCPerYr: 3,
  oceanSinkGtCPerYr: 2.5,
  durableRemovalGtCPerYr: 0.5,
  dtYears: 1,
});
approx(atm.nextAtmosphereGtC, 905, 1e-12, "atmospheric balance");
approx(atm.residualGtC, 0, 1e-12, "atmospheric residual");

// Fossil transfer bookkeeping: extraction is partitioned among inventory,
// products, and fossil carbon transferred to the atmosphere.
const one = stepUpstream(createInitialState(), {}, 0.25);
approx(
  one.diagnostics.fossilTransferResidualGtC,
  0,
  1e-9,
  "fossil transfer residual",
);
approx(
  one.diagnostics.atmosphericBalanceResidualGtC,
  0,
  1e-12,
  "atmospheric control-volume residual",
);

// Reproducibility.
const a = simulate(SCENARIOS.coordinated, { endYear: 2050 });
const b = simulate(SCENARIOS.coordinated, { endYear: 2050 });
assert.deepEqual(a, b, "same inputs must reproduce identical outputs");

// Physical non-negativity over a range of scenarios.
for (const scenario of Object.values(SCENARIOS)) {
  const rows = simulate(scenario, { endYear: 2100 });
  for (const row of rows) {
    for (const key of [
      "availableResourceGtC",
      "productionCapacityGtCPerYr",
      "fossilDemandCapital",
      "cleanCapital",
      "fuelInventoryGtC",
      "productsGtC",
      "atmosphereGtC",
      "durableStorageGtC",
    ]) {
      assert.ok(row[key] >= 0 && Number.isFinite(row[key]), `${key} invalid`);
    }
    assert.ok(Math.abs(row.fossilTransferResidualGtC) < 1e-8);
    assert.ok(Math.abs(row.atmosphericBalanceResidualGtC) < 1e-10);
  }
}

// Directional scenario consistency: stronger coordinated policy should not
// produce higher 2100 fossil emissions than the default under this model.
const bau = simulate(SCENARIOS.bau).at(-1);
const coordinated = simulate(SCENARIOS.coordinated).at(-1);
assert.ok(
  coordinated.fossilToAtmosphereGtCPerYr < bau.fossilToAtmosphereGtCPerYr,
  "coordinated policy should reduce modeled fossil-to-atmosphere flow",
);

// Time-step sensitivity. This is a numerical stability check, not validation.
const qtr = simulate(SCENARIOS.pricePlusClean, { endYear: 2100, dtYears: 0.25 }).at(-1);
const eighth = simulate(SCENARIOS.pricePlusClean, { endYear: 2100, dtYears: 0.125 }).at(-1);
const relativePpmDifference = Math.abs(qtr.ppm - eighth.ppm) / Math.max(1, Math.abs(eighth.ppm));
assert.ok(
  relativePpmDifference < 0.03,
  `time-step sensitivity too high: ${(relativePpmDifference * 100).toFixed(2)}%`,
);

console.log("All carbon-cycle model checks passed.");
