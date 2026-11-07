import assert from "node:assert/strict";
import {
  CARBON_CYCLE_CALIBRATION,
  CALIBRATED_END_2024_BOXES_GTC,
  INITIAL_2025_BOXES_GTC,
  JOOS_FRACTIONS,
  atmosphericPpmFromBoxes,
  diagnoseNaturalSinkGtCPerYr,
  initializeObserved2025CarbonCycle,
  replayGcbHistory,
  stepReducedCarbonCycle,
} from "../model/carbon-cycle-reduced.js";
import { GCB_HISTORY_METADATA } from "../data/gcb-2025-global-budget.js";

const fractionSum = JOOS_FRACTIONS.reduce((s, v) => s + v, 0);
assert.ok(Math.abs(fractionSum - 1) < 1e-12, "Joos response fractions must sum to one");

const history = replayGcbHistory();
assert.equal(history.length, 66);
const rmsePpm = Math.sqrt(
  history.reduce((s, row) => s + row.errorPpm ** 2, 0) / history.length,
);
const maxAbsErrorPpm = Math.max(...history.map(row => Math.abs(row.errorPpm)));
const end2024 = history.at(-1);

assert.ok(
  rmsePpm < 1.3,
  `historical atmospheric-stock RMSE too high: ${rmsePpm.toFixed(3)} ppm`,
);
assert.ok(
  maxAbsErrorPpm < 3.1,
  `historical max atmospheric-stock error too high: ${maxAbsErrorPpm.toFixed(3)} ppm`,
);
assert.ok(
  Math.abs(end2024.modeledPpm - GCB_HISTORY_METADATA.observed2024MeanPpm) < 1e-8,
  "calibrated replay must hit the 2024 concentration endpoint",
);

for (let i = 0; i < 4; i++) {
  assert.ok(
    Math.abs(end2024.boxesGtC[i] - CALIBRATED_END_2024_BOXES_GTC[i]) < 1e-8,
    `end-2024 calibrated carbon box ${i} mismatch`,
  );
}

// One-year check was not included in the 1959-2024 calibration.
const predicted2025Boxes = stepReducedCarbonCycle(
  CALIBRATED_END_2024_BOXES_GTC,
  GCB_HISTORY_METADATA.preliminary2025TotalAnthropogenicGtCPerYr,
  1,
);
const predicted2025Ppm = atmosphericPpmFromBoxes(predicted2025Boxes);
assert.ok(
  Math.abs(predicted2025Ppm - GCB_HISTORY_METADATA.preliminary2025MeanPpm) < 0.5,
  `independent 2025 concentration check misses by more than 0.5 ppm: ${predicted2025Ppm}`,
);

const initialized2025 = initializeObserved2025CarbonCycle();
assert.ok(
  Math.abs(initialized2025.ppm - GCB_HISTORY_METADATA.preliminary2025MeanPpm) < 1e-10,
  "2025 assimilated state must match the observed/preliminary concentration",
);
assert.ok(
  initialized2025.assimilationGtC < 1,
  "2025 state-assimilation correction should remain below 1 GtC",
);

const next = stepReducedCarbonCycle(
  INITIAL_2025_BOXES_GTC,
  GCB_HISTORY_METADATA.preliminary2025TotalAnthropogenicGtCPerYr,
  0.25,
);
const sink = diagnoseNaturalSinkGtCPerYr({
  previousBoxesGtC: INITIAL_2025_BOXES_GTC,
  nextBoxesGtC: next,
  netAnthropogenicCO2GtCPerYr:
    GCB_HISTORY_METADATA.preliminary2025TotalAnthropogenicGtCPerYr,
  dtYears: 0.25,
});
assert.ok(Number.isFinite(sink) && sink > 0, "diagnosed natural uptake should be positive at the 2025 state");

assert.equal(CARBON_CYCLE_CALIBRATION.alpha, 0.555);
console.log("Reduced carbon-cycle historical validation checks passed.", {
  rmsePpm,
  maxAbsErrorPpm,
  end2024Ppm: end2024.modeledPpm,
  independent2025Ppm: predicted2025Ppm,
  assimilationGtC: initialized2025.assimilationGtC,
  diagnosedNaturalSinkGtCPerYr: sink,
});
