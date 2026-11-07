import assert from "node:assert/strict";
import {
  DEFAULT_PARAMETERS,
  DEFAULT_STATE,
  SCENARIOS,
  simulate,
} from "../model/upstream-engine.js";
import { REFERENCE_BENCHMARKS } from "../model/reference-benchmarks.js";

const rows = simulate(SCENARIOS.structuralReference);
const first = rows[0];
const y2050 = rows.reduce((best, row) =>
  Math.abs(row.year - 2050) < Math.abs(best.year - 2050) ? row : best
);
const last = rows.at(-1);
const observed2025 = REFERENCE_BENCHMARKS.globalCarbonBudget2025.fossilCO2GtCPerYr;

// The reference state is accounting-consistent with the current fossil-flow benchmark.
assert.ok(
  Math.abs(first.fossilToAtmosphereGtCPerYr - observed2025) / observed2025 < 0.02,
  `initial modeled fossil-to-atmosphere flow should be within 2% of the 2025 benchmark; got ${first.fossilToAtmosphereGtCPerYr}`,
);

// A neutral structural reference must not contain an implicit autonomous collapse.
for (const [label, row] of [["2050", y2050], ["2100", last]]) {
  assert.ok(
    row.fossilToAtmosphereGtCPerYr > observed2025 * 0.75 &&
      row.fossilToAtmosphereGtCPerYr < observed2025 * 1.25,
    `${label} structural-reference fossil flow drifted outside ±25% of the current benchmark: ${row.fossilToAtmosphereGtCPerYr}`,
  );
}

// The default clean-capital investment is a replacement-compatible reference level.
assert.ok(
  Math.abs(last.cleanCapital - DEFAULT_STATE.cleanCapital) < 0.05,
  `reference clean capital should remain near its initial stock; got ${last.cleanCapital}`,
);

// Removed redundant free parameters should stay removed.
assert.ok(!("demandCapitalInvestmentRatePerYr" in DEFAULT_PARAMETERS));
assert.ok(!("cleanCapitalLifetimeYears" in DEFAULT_PARAMETERS));

console.log("Structural reference-mode checks passed.", {
  firstFlow: first.fossilToAtmosphereGtCPerYr,
  flow2050: y2050.fossilToAtmosphereGtCPerYr,
  flow2100: last.fossilToAtmosphereGtCPerYr,
  cleanCapital2100: last.cleanCapital,
});
