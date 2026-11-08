import assert from "node:assert/strict";
import {
  HISTORICAL_REFERENCE_ROWS,
  HISTORICAL_SOURCE_METADATA,
  HISTORICAL_MEASUREMENT_GAPS,
  rowForYear,
} from "../data/historical-reference-2000-2025.js";
import {
  HISTORICAL_MODEL_MAPPING,
  HISTORICAL_PROXY_ROWS,
} from "../model/historical-mapping.js";

assert.equal(HISTORICAL_REFERENCE_ROWS.length, 26);
assert.equal(HISTORICAL_REFERENCE_ROWS[0].year, 2000);
assert.equal(HISTORICAL_REFERENCE_ROWS.at(-1).year, 2025);

for (let i = 1; i < HISTORICAL_REFERENCE_ROWS.length; i++) {
  assert.equal(
    HISTORICAL_REFERENCE_ROWS[i].year,
    HISTORICAL_REFERENCE_ROWS[i - 1].year + 1,
    "historical years must be continuous",
  );
}

for (const row of HISTORICAL_REFERENCE_ROWS) {
  for (const key of [
    "fossilCO2GtCPerYr",
    "atmosphericPpm",
    "renewableCapacityGw",
    "fossilEnergyConsumptionTWh",
    "worldGdpConstant2015Usd",
  ]) {
    assert.ok(Number.isFinite(row[key]), `${row.year}: missing/non-finite ${key}`);
    assert.ok(row[key] > 0, `${row.year}: non-positive ${key}`);
  }
}

assert.ok(Math.abs(rowForYear(2000).renewableCapacityGw - 763.94165) < 1e-8);
assert.ok(Math.abs(rowForYear(2025).renewableCapacityGw - 5155.0073) < 1e-8);
assert.ok(Math.abs(rowForYear(2000).fossilEnergyConsumptionTWh - 94434) < 1e-8);
assert.ok(Math.abs(rowForYear(2025).fossilEnergyConsumptionTWh - 143805.69) < 1e-8);
assert.ok(Math.abs(rowForYear(2025).fossilCO2GtCPerYr - 10.4) < 1e-12);
assert.ok(Math.abs(rowForYear(2025).atmosphericPpm - 425.6) < 1e-12);
assert.ok(
  Math.abs(rowForYear(2025).worldGdpConstant2015Usd - 99658553419775.2) < 1,
);

assert.equal(HISTORICAL_PROXY_ROWS.length, 26);
assert.ok(Math.abs(HISTORICAL_PROXY_ROWS.at(-1).fossilDemandActivityIndex2025 - 1) < 1e-12);
assert.ok(Math.abs(HISTORICAL_PROXY_ROWS.at(-1).gdpIndex2025 - 1) < 1e-12);
assert.ok(Math.abs(HISTORICAL_PROXY_ROWS.at(-1).cleanCapitalProxy - 0.32) < 1e-12);

assert.equal(HISTORICAL_MODEL_MAPPING.renewableCapacityGw.measurementType, "stock proxy");
assert.ok(HISTORICAL_MEASUREMENT_GAPS.length >= 3);
assert.equal(HISTORICAL_SOURCE_METADATA.worldGdp.indicator, "NY.GDP.MKTP.KD");

console.log("Historical reference dataset and model-mapping checks passed.");
