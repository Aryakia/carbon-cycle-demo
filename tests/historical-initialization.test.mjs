import assert from "node:assert/strict";
import {
  APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC,
  REQUIRED_LATENT_INITIAL_STATES,
  createHistoricalInitialState2000,
  historicalInitialDiagnostics2000,
  historicalInitializationMetadata,
} from "../model/historical-initialization.js";
import {
  HISTORICAL_PROXY_ROWS,
} from "../model/historical-mapping.js";
import {
  historicalParameterOverridesAt,
} from "../model/historical-drivers.js";

assert.deepEqual(REQUIRED_LATENT_INITIAL_STATES, [
  "productionCapacityGtCPerYr",
  "capability",
  "institutionalSupport",
]);

assert.throws(
  () => createHistoricalInitialState2000(),
  /explicit latentInitials/,
);
assert.throws(
  () => createHistoricalInitialState2000({
    productionCapacityGtCPerYr: 7,
    capability: 0.8,
  }),
  /institutionalSupport/,
);

const latent = {
  productionCapacityGtCPerYr: 7.5,
  capability: 0.8,
  institutionalSupport: 0.65,
};
const state = createHistoricalInitialState2000(latent);
const proxy0 = HISTORICAL_PROXY_ROWS[0];

assert.equal(state.year, 2000);
assert.equal(state.productionCapacityGtCPerYr, 7.5);
assert.equal(state.capability, 0.8);
assert.equal(state.institutionalSupport, 0.65);
assert.ok(Math.abs(state.cleanCapital - proxy0.cleanCapitalProxy) < 1e-12);
assert.ok(
  Math.abs(state.fossilDemandCapital - proxy0.fossilDependencyIndex2025) < 1e-12,
);
assert.ok(state.fuelInventoryGtC > 0);
assert.ok(state.productsGtC > 0);
assert.equal(state.carbonCycleBoxesGtC.length, 4);
assert.ok(state.carbonCycleBoxesGtC.every(v => Number.isFinite(v) && v >= 0));
assert.ok(APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC > 200);
assert.ok(APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC < 350);

const driver = historicalParameterOverridesAt(2000);
assert.ok(driver.energyActivityIndex > 0 && driver.energyActivityIndex < 1);

const diag = historicalInitialDiagnostics2000(latent);
assert.ok(
  Math.abs(
    diag.reconstructedFossilConsumptionActivity -
      diag.observedFossilConsumptionActivity,
  ) < 1e-12,
  "energy activity × fossil dependency must reproduce the normalized fossil-consumption activity",
);
assert.ok(
  diag.modeledStartPpm < diag.observedEnd2000Ppm &&
    diag.observedEnd2000Ppm - diag.modeledStartPpm < 5,
  "end-1999 carbon-cycle state should precede the observed end-2000 concentration by a plausible annual increment",
);

const metadata = historicalInitializationMetadata();
assert.deepEqual(metadata.explicitlyLatent, [...REQUIRED_LATENT_INITIAL_STATES]);

console.log("Historical 2000 initialization readiness checks passed.", {
  modeledStartPpm: diag.modeledStartPpm,
  observedEnd2000Ppm: diag.observedEnd2000Ppm,
  energyActivityIndex: diag.energyActivityIndex,
  fossilDependencyProxy: diag.fossilDependencyProxy,
  cumulativeFossilTo1999GtC: APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC,
});
