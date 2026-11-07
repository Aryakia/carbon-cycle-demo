import assert from "node:assert/strict";
import {
  ADVANCED_SCENARIO_FIELDS,
  decodeAdvancedScenario,
  encodeAdvancedScenario,
  experimentIdFromSearch,
  rowsToCsv,
} from "../ui/scenario-io.js";

const params = {
  carbonPriceUsdPerTCO2: 140,
  fossilSubsidyUsdPerTCO2: -20,
  fossilInvestmentIncentive: 0.6,
  cleanInvestmentIndexPerYr: 0.08,
  acceleratedRetirementPerYr: 0.03,
  expectedFutureDemandIndex: 1,
  institutionalResistance: 0.25,
  cleanLearningRate: 0.08,
  resourceDevelopmentCostIndex: 0.5,
  policyImplementationDelayYears: 2,
};
const encoded = encodeAdvancedScenario(params);
const decoded = decodeAdvancedScenario(encoded);
for (const [key] of ADVANCED_SCENARIO_FIELDS) {
  assert.equal(decoded[key], params[key], `round-trip mismatch: ${key}`);
}

assert.deepEqual(
  decodeAdvancedScenario("?carbonPrice=120&junk=nope&delay=5"),
  { carbonPriceUsdPerTCO2: 120, policyImplementationDelayYears: 5 },
);

const csv = rowsToCsv(
  [
    { year: 2025, label: 'reference, "A"', value: 10.4 },
    { year: 2026, label: "next", value: 10.2 },
  ],
  [["year", "Year"], ["label", "Scenario"], ["value", "GtC/yr"]],
);
assert.ok(csv.includes('"reference, ""A"""'));
assert.ok(csv.startsWith("Year,Scenario,GtC/yr"));

assert.equal(
  experimentIdFromSearch("?experiment=timing", ["policyMix", "timing"], "policyMix"),
  "timing",
);
assert.equal(
  experimentIdFromSearch("?experiment=unknown", ["policyMix", "timing"], "policyMix"),
  "policyMix",
);

console.log("Scenario serialization and CSV export checks passed.");
