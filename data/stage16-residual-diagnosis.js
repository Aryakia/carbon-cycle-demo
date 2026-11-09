export const STAGE16_FROZEN_RESIDUAL_DIAGNOSIS = Object.freeze({
  stage: "16",
  sourceHoldout: Object.freeze([2018, 2025]),
  holdoutConsumed: true,
  diagnosticOnly: true,
  meanResidual: 0.01286099151064804,
  residualTrendPerYear: 0.001887589346846014,
  allResidualsPositive: true,
  associations: Object.freeze({
    renewableElectricitySharePct: Object.freeze({
      levelPearson: 0.9390068915805516,
      firstDifferencePearson: 0.7129891132019663,
    }),
    renewableGenerationTWh: Object.freeze({
      levelPearson: 0.9087272322557285,
      firstDifferencePearson: 0.2614991853903728,
    }),
    renewableCapacityIntensity: Object.freeze({
      levelPearson: 0.9258998945931771,
      firstDifferencePearson: 0.58267005227156,
    }),
    lowCarbonElectricitySharePct: Object.freeze({
      levelPearson: 0.9606076051307791,
      firstDifferencePearson: 0.8722513011572034,
    }),
    nuclearElectricitySharePct: Object.freeze({
      levelPearson: -0.7625599190376627,
      firstDifferencePearson: 0.2766077353630903,
    }),
    energyIntensityPerTrillionUsd: Object.freeze({
      levelPearson: -0.8810175132216732,
      firstDifferencePearson: 0.2336755446437881,
    }),
    fossilIntensityPerTrillionUsd: Object.freeze({
      levelPearson: -0.9097277412414418,
      firstDifferencePearson: -0.3537444290898091,
    }),
  }),
  prioritizedRevision: Object.freeze({
    first:
      "Test realized renewable/low-carbon electricity generation share as a clean-competition measurement variable instead of relying on installed renewable-capacity intensity alone.",
    second:
      "Separate efficiency/electrification effects from fossil dependency using explicit final-energy or sectoral data rather than inferring them from a GDP-energy-intensity trend.",
    third:
      "Disaggregate coal, oil and gas/end-use sectors because one global fossil-dependency proxy may combine distinct transition mechanisms.",
  }),
  caution:
    "Associations use a consumed eight-year holdout (seven first differences), are highly vulnerable to common trends, and are not causal evidence or parameter estimates.",
  validationRule:
    "A revised model cannot reuse 2018-2025 as pristine holdout. Use pre-declared rolling-origin internal evaluation plus an external regional/fuel-sector or future-data validation target.",
});
