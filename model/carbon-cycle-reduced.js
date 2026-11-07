import { SCIENCE } from "./scientific-benchmarks.js";
import {
  GCB_1959_2024_GTC,
  GCB_HISTORY_METADATA,
} from "../data/gcb-2025-global-budget.js";

// Joos et al. (2013) / IPCC AR5 four-timescale atmospheric CO2 response.
// FaIR uses the same four-box form with a lifetime scaling factor alpha.
export const JOOS_FRACTIONS = Object.freeze([0.2173, 0.2240, 0.2824, 0.2763]);
export const JOOS_BASE_TAU_YEARS = Object.freeze([
  Infinity,
  394.4,
  36.54,
  4.304,
]);

// Historical calibration:
// - Joos fractions and base time constants are NOT fitted.
// - A single constant lifetime scale alpha and the non-negative 1959 legacy
//   box state are calibrated to the GCB 1959-2024 atmospheric-stock history.
// - The 2024 endpoint is constrained to 422.8 ppm.
// This is a reduced-form emulator, not a mechanistic Earth-system model.
export const CARBON_CYCLE_CALIBRATION = Object.freeze({
  alpha: 0.555,
  initial1959BoxesGtC: Object.freeze([
    0,
    31.08913064673246,
    44.80859307218273,
    0,
  ]),
  historicalStockRmsePpm: 1.1859029469535145,
  historicalStockR2: 0.9986018137982422,
  maxHistoricalAbsErrorPpm: 2.976087543279879,
  fittedPeriod: "1959-2024",
  endpoint2024Ppm: 422.8,
  oneYear2025PredictionPpmBeforeAssimilation: 425.16014567154434,
  observed2025Ppm: 425.6,
  sourceDatasetDoi: GCB_HISTORY_METADATA.datasetDoi,
  joosReference: "Joos et al. (2013), Atmospheric Chemistry and Physics 13, 2793-2825",
  fairReference: "Leach et al. (2021), Geoscientific Model Development 14, 3007-3036",
});

export const CALIBRATED_END_2024_BOXES_GTC = Object.freeze([
  115.49846881595198,
  128.19800803579176,
  55.78950876345982,
  7.49001438479644,
]);

// Step end-2024 through the GCB preliminary 2025 total anthropogenic
// emissions, then assimilate the small concentration residual into the
// fastest response box. Assigning the residual to the shortest-lived pool
// prevents a one-year observational discrepancy from contaminating the
// long-lived atmospheric burden.
export const PRE_ASSIMILATION_END_2025_BOXES_GTC = Object.freeze([
  117.99741881595197,
  130.18380071721487,
  56.27406118311266,
  7.524228107394489,
]);

export const OBSERVATION_ASSIMILATION_2025_GTC = 0.9324911763260957;

export const INITIAL_2025_BOXES_GTC = Object.freeze([
  117.99741881595197,
  130.18380071721487,
  56.27406118311266,
  8.456719283720584,
]);

export function atmosphericExcessGtC(boxesGtC) {
  return boxesGtC.reduce((sum, value) => sum + value, 0);
}

export function atmosphericPpmFromBoxes(boxesGtC) {
  return SCIENCE.preindustrialPpm + atmosphericExcessGtC(boxesGtC) / SCIENCE.ppmToGtC;
}

export function totalAtmosphericGtCFromBoxes(boxesGtC) {
  return atmosphericPpmFromBoxes(boxesGtC) * SCIENCE.ppmToGtC;
}

export function stepReducedCarbonCycle(
  boxesGtC,
  netAnthropogenicCO2GtCPerYr,
  dtYears,
  alpha = CARBON_CYCLE_CALIBRATION.alpha,
) {
  if (!Array.isArray(boxesGtC) || boxesGtC.length !== 4) {
    throw new Error("carbon-cycle state must contain four response boxes");
  }
  if (!Number.isFinite(netAnthropogenicCO2GtCPerYr)) {
    throw new Error("net anthropogenic CO2 flow must be finite");
  }
  if (!Number.isFinite(dtYears) || dtYears <= 0) {
    throw new Error("dtYears must be finite and positive");
  }
  if (!Number.isFinite(alpha) || alpha <= 0) {
    throw new Error("carbon-cycle lifetime scale alpha must be positive");
  }

  const next = [...boxesGtC];
  next[0] += JOOS_FRACTIONS[0] * netAnthropogenicCO2GtCPerYr * dtYears;

  for (let i = 1; i < 4; i++) {
    const tau = JOOS_BASE_TAU_YEARS[i] * alpha;
    const decay = Math.exp(-dtYears / tau);
    next[i] =
      boxesGtC[i] * decay +
      JOOS_FRACTIONS[i] *
        netAnthropogenicCO2GtCPerYr *
        tau *
        (1 - decay);
  }

  return next;
}

export function replayGcbHistory() {
  let boxes = [...CARBON_CYCLE_CALIBRATION.initial1959BoxesGtC];
  const rows = [];

  for (const [
    year,
    fossilGtC,
    landUseGtC,
    atmosphericGrowthGtC,
    oceanSinkGtC,
    landSinkGtC,
    cementCarbonationGtC,
  ] of GCB_1959_2024_GTC) {
    const netAnthropogenicGtC =
      fossilGtC + landUseGtC - cementCarbonationGtC;
    boxes = stepReducedCarbonCycle(boxes, netAnthropogenicGtC, 1);

    rows.push({
      year,
      boxesGtC: [...boxes],
      modeledPpm: atmosphericPpmFromBoxes(boxes),
      observedAtmosphericGrowthGtC: atmosphericGrowthGtC,
      observedOceanSinkGtC: oceanSinkGtC,
      observedLandSinkGtC: landSinkGtC,
      netAnthropogenicGtC,
    });
  }

  // Reconstruct observed end-of-year atmospheric concentrations from the
  // observed GCB atmospheric-growth series, anchored to the assessed 2024
  // global mean of 422.8 ppm.
  let observedExcessGtC =
    (GCB_HISTORY_METADATA.observed2024MeanPpm - SCIENCE.preindustrialPpm) *
    SCIENCE.ppmToGtC;
  const observedByYear = new Map();
  for (let i = GCB_1959_2024_GTC.length - 1; i >= 0; i--) {
    const year = GCB_1959_2024_GTC[i][0];
    observedByYear.set(
      year,
      SCIENCE.preindustrialPpm + observedExcessGtC / SCIENCE.ppmToGtC,
    );
    if (i > 0) observedExcessGtC -= GCB_1959_2024_GTC[i][3];
  }

  return rows.map(row => ({
    ...row,
    observedPpm: observedByYear.get(row.year),
    errorPpm: row.modeledPpm - observedByYear.get(row.year),
  }));
}

export function initializeObserved2025CarbonCycle() {
  return {
    boxesGtC: [...INITIAL_2025_BOXES_GTC],
    ppm: atmosphericPpmFromBoxes(INITIAL_2025_BOXES_GTC),
    assimilationGtC: OBSERVATION_ASSIMILATION_2025_GTC,
  };
}

export function diagnoseNaturalSinkGtCPerYr({
  previousBoxesGtC,
  nextBoxesGtC,
  netAnthropogenicCO2GtCPerYr,
  dtYears,
}) {
  const atmosphericChangeGtCPerYr =
    (atmosphericExcessGtC(nextBoxesGtC) -
      atmosphericExcessGtC(previousBoxesGtC)) /
    dtYears;

  return netAnthropogenicCO2GtCPerYr - atmosphericChangeGtCPerYr;
}
