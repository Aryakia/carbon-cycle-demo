import assert from "node:assert/strict";
import {
  HISTORICAL_SPLIT,
  historicalObservedAt,
  historicalProxyAt,
  shockForYear,
  splitHistoricalRows,
} from "../model/historical-drivers.js";
import {
  UPSTREAM_CALIBRATION_WEIGHTS,
  buildPerfectProxyModelRows,
  calibrationSplitSummary,
  scoreHistoricalFit,
} from "../model/calibration-objective.js";

assert.deepEqual(HISTORICAL_SPLIT, {
  trainingStart: 2000,
  trainingEnd: 2017,
  validationStart: 2018,
  validationEnd: 2025,
});

const mid = historicalObservedAt(2010.5);
const a = historicalObservedAt(2010);
const b = historicalObservedAt(2011);
assert.ok(
  Math.abs(mid.fossilCO2GtCPerYr - (a.fossilCO2GtCPerYr + b.fossilCO2GtCPerYr) / 2) < 1e-12,
);
assert.ok(Number.isFinite(historicalProxyAt(2014.25).gdpIndex2025));
assert.throws(() => historicalObservedAt(1999.9), /outside supported range/);

assert.equal(shockForYear(2009).id, "global-financial-crisis");
assert.equal(shockForYear(2020).id, "covid-19");
assert.equal(shockForYear(2015), null);

const split = splitHistoricalRows();
assert.equal(split.training.length, 18);
assert.equal(split.validation.length, 8);
assert.equal(split.training.at(-1).year, 2017);
assert.equal(split.validation[0].year, 2018);

const perfect = buildPerfectProxyModelRows();
const trainScore = scoreHistoricalFit(perfect, { window: "training" });
const validationScore = scoreHistoricalFit(perfect, { window: "validation" });
assert.ok(trainScore.objective < 1e-12);
assert.ok(validationScore.objective < 1e-12);
assert.equal(UPSTREAM_CALIBRATION_WEIGHTS.atmosphericPpm, 0);
assert.equal(UPSTREAM_CALIBRATION_WEIGHTS.extractionActivity, 0.15);
assert.ok(Math.abs(Object.values(UPSTREAM_CALIBRATION_WEIGHTS).reduce((a,b)=>a+b,0)-1)<1e-12);

const biased = perfect.map(row => ({
  ...row,
  fossilToAtmosphereGtCPerYr: row.fossilToAtmosphereGtCPerYr * 1.10,
  extractionGtCPerYr:
    row.extractionGtCPerYr * (1 + 0.10 * (2025 - row.year) / 25),
  cleanCapital: row.cleanCapital * 0.90,
  fossilDemandCapital: row.fossilDemandCapital * 1.08,
}));
const biasedScore = scoreHistoricalFit(biased, { window: "training" });
assert.ok(biasedScore.metrics.fossilFlow > 0.09);
assert.ok(biasedScore.metrics.extractionActivity > 0.02);
assert.ok(biasedScore.metrics.cleanCapitalShape > 0);
assert.ok(biasedScore.metrics.fossilDemandActivity > 0.07);
assert.ok(biasedScore.objective > 0.05);

const excluded = scoreHistoricalFit(perfect, {
  window: "validation",
  excludeYears: [2020],
});
assert.equal(excluded.years.includes(2020), false);
assert.equal(excluded.excludeYears[0], 2020);

const summary = calibrationSplitSummary();
assert.deepEqual(summary.trainingYears, [2000, 2017]);
assert.deepEqual(summary.validationYears, [2018, 2025]);

console.log("Historical driver and calibration-objective scaffold checks passed.", {
  split: summary,
  defaultWeights: UPSTREAM_CALIBRATION_WEIGHTS,
  biasedObjective: biasedScore.objective,
});
