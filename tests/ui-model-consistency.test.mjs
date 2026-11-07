import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DEFAULT_PARAMETERS } from "../model/upstream-engine.js";

const html = readFileSync(new URL("../upstream.html", import.meta.url), "utf8");

function rangeAttributes(id) {
  const match = html.match(new RegExp('<input[^>]*id="' + id + '"[^>]*type="range"[^>]*>'));
  assert.ok(match, `range control not found: ${id}`);
  const tag = match[0];
  const attr = name => {
    const m = tag.match(new RegExp(name + '="([^"]+)"'));
    return m ? Number(m[1]) : null;
  };
  return { min: attr("min"), max: attr("max"), step: attr("step") };
}

function assertRepresentable(id, value) {
  const { min, max, step } = rangeAttributes(id);
  assert.ok(value >= min && value <= max, `${id}: default outside UI range`);
  const steps = (value - min) / step;
  assert.ok(
    Math.abs(steps - Math.round(steps)) < 1e-9,
    `${id}: model default ${value} is not exactly representable by UI step ${step}`,
  );
}

assertRepresentable("carbonPrice", DEFAULT_PARAMETERS.carbonPriceUsdPerTCO2);
assertRepresentable("subsidy", DEFAULT_PARAMETERS.fossilSubsidyUsdPerTCO2);
assertRepresentable("fossilInvestment", DEFAULT_PARAMETERS.fossilInvestmentIncentive);
assertRepresentable("cleanInvestment", DEFAULT_PARAMETERS.cleanInvestmentIndexPerYr);
assertRepresentable("retirement", DEFAULT_PARAMETERS.acceleratedRetirementPerYr);
assertRepresentable("demand", DEFAULT_PARAMETERS.expectedFutureDemandIndex);
assertRepresentable("resistance", DEFAULT_PARAMETERS.institutionalResistance);
assertRepresentable("learning", DEFAULT_PARAMETERS.cleanLearningRate);
assertRepresentable("cost", DEFAULT_PARAMETERS.resourceDevelopmentCostIndex);
assertRepresentable("delay", DEFAULT_PARAMETERS.policyImplementationDelayYears);

console.log("Advanced-lab UI/model parameter consistency checks passed.");
