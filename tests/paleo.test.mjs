import assert from "node:assert/strict";
import { PALEO_FALLBACK, PALEO_METADATA } from "../data/paleo-co2-fallback.js";

assert.ok(PALEO_FALLBACK.length >= 40, "fallback should contain a broad set of actual observations");

for (let i = 0; i < PALEO_FALLBACK.length; i++) {
  const [age, ppm, sigma] = PALEO_FALLBACK[i];
  assert.ok(Number.isFinite(age) && Number.isFinite(ppm) && Number.isFinite(sigma));
  assert.ok(age >= -100 && age <= 810000, "age outside documented composite coverage");
  assert.ok(ppm >= 160 && ppm <= 400, "fallback CO2 outside plausible source range");
  assert.ok(sigma >= 0 && sigma < 15, "uncertainty outside expected source range");
  if (i > 0) assert.ok(age > PALEO_FALLBACK[i - 1][0], "fallback ages must be strictly increasing");
}

// Ensure this is not a fabricated regular annual time series.
const spacings = PALEO_FALLBACK.slice(1).map((r,i)=>Math.round(r[0]-PALEO_FALLBACK[i][0]));
assert.ok(new Set(spacings).size > 20, "fallback should preserve irregular observation spacing");

const preindustrial = PALEO_FALLBACK.filter(([age]) => age >= 1000);
const min = Math.min(...preindustrial.map(r=>r[1]));
const max = Math.max(...preindustrial.map(r=>r[1]));
assert.ok(min <= 174, "fallback should include revised record-low neighborhood");
assert.ok(max >= 298, "fallback should include a high interglacial observation");
assert.equal(PALEO_METADATA.sourceRows, 1901);
console.log("Paleoclimate data-integrity checks passed.");
