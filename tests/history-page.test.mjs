import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { UPSTREAM_CALIBRATION_WEIGHTS } from "../model/calibration-objective.js";

const html = readFileSync(new URL("../history.html", import.meta.url), "utf8");

const expectedCards = [
  ["Fossil-flow weight", UPSTREAM_CALIBRATION_WEIGHTS.fossilFlow],
  ["Extraction proxy weight", UPSTREAM_CALIBRATION_WEIGHTS.extractionActivity],
  ["Clean proxy weight", UPSTREAM_CALIBRATION_WEIGHTS.cleanCapitalShape],
  ["Dependency proxy weight", UPSTREAM_CALIBRATION_WEIGHTS.fossilDemandActivity],
];

for (const [label, value] of expectedCards) {
  assert.ok(html.includes(label), `History page missing calibration card: ${label}`);
  assert.ok(
    html.includes("<b>" + value.toFixed(2) + "</b>"),
    `History page does not expose current calibration weight ${value.toFixed(2)} for ${label}`,
  );
}

assert.ok(html.includes('id="totalEnergyChart"'));
assert.ok(html.includes("Total primary-energy supply"));
assert.ok(html.includes("fossilDependencyIndex2025"));
assert.ok(html.includes("energyActivityIndex2025"));
assert.ok(html.includes('class="point"'));
assert.ok(html.includes("legend-text"));
assert.ok(html.includes('id="annualDataRows"'));
assert.ok(html.includes("Show annual empirical data table (2000–2025)"));

console.log("History page methodology and chart-regression checks passed.");
