export const STAGE15_FROZEN_DEPENDENCY_VALIDATION = Object.freeze({
  stage: "15",
  stage14FrozenCommit: "4f380fe7f49c469379ce4e920bfc4db3fd0e5cd8",
  validationWindow: Object.freeze([2018, 2025]),
  holdoutConsumed: true,
  parametersRetunedAfterHoldout: false,
  normalizationYear: 2017,
  primaryModel: Object.freeze({
    source: "data/stage14-dependency-fit.js",
    hypothesisId: "renewable-capacity-intensity",
    cleanElasticity: 0.016,
    effectiveAdjustmentTimeYears: 3.0,
    rows: Object.freeze([
      Object.freeze({year:2018,predicted:1.0021416006746597,observed:0.9972889078848284}),
      Object.freeze({year:2019,predicted:1.0011452857723788,observed:0.9930672781572071}),
      Object.freeze({year:2020,predicted:0.9999341526033523,observed:0.9857830118399374}),
      Object.freeze({year:2021,predicted:0.9986679453100339,observed:0.986235950604502}),
      Object.freeze({year:2022,predicted:0.9974860228558631,observed:0.986251153134331}),
      Object.freeze({year:2023,predicted:0.9961871695947359,observed:0.9830925066627123}),
      Object.freeze({year:2024,predicted:0.994722945415757,observed:0.9767084485728397}),
      Object.freeze({year:2025,predicted:0.9931113574942744,observed:0.9720812907795129}),
    ]),
    metrics: Object.freeze({
      n: 8,
      rmse: 0.013729941774737776,
      mae: 0.01286099151064804,
      bias: 0.01286099151064804,
      skillVsPersistence: 0.18017948062524924,
    }),
  }),
  benchmarks: Object.freeze({
    persistence: Object.freeze({
      rmse: 0.016747497104865266,
      mae: 0.01493643154551616,
      bias: 0.01493643154551616,
    }),
    staticTrainingSelected: Object.freeze({
      hypothesisId: "renewable-capacity-intensity",
      cleanElasticity: 0.014,
      rmse: 0.01074925054118865,
      mae: 0.009735376411209806,
      bias: 0.009735376411209806,
    }),
    turnoverConstrainedTrainingSelected: Object.freeze({
      hypothesisId: "absolute-renewable-capacity",
      cleanElasticity: 0.016,
      adjustmentTimeYears: 15,
      rmse: 0.02012598433482515,
      mae: 0.019216890790671542,
      bias: 0.019216890790671542,
    }),
  }),
  covidSensitivity: Object.freeze({
    excludedYear: 2020,
    refit: false,
    primary: Object.freeze({
      n: 7,
      rmse: 0.01366871100723701,
      mae: 0.012676684474538498,
      bias: 0.012676684474538498,
    }),
    persistence: Object.freeze({
      n: 7,
      rmse: 0.017078417967366234,
      mae: 0.015039209172009531,
      bias: 0.015039209172009531,
    }),
  }),
  interpretation: Object.freeze({
    predictiveSkill:
      "The frozen dynamic model improves holdout RMSE by about 18% relative to the 2017 persistence benchmark.",
    benchmarkComparison:
      "The training-selected static clean-competition model performs better on the holdout than the frozen 3-year dynamic model.",
    residualPattern:
      "All eight primary-model errors are positive: the model systematically overpredicts fossil dependency and therefore underpredicts the observed decline after 2017.",
    covidFinding:
      "Excluding 2020 changes primary RMSE only slightly, so the systematic validation error is not explained by the COVID shock alone.",
    structuralConclusion:
      "Held-out validation weakens the Stage 14 claim that a distinct 3-year dependency lag is the most robust structure. Clean-competition information remains useful, but the post-2017 decline requires either a better measurement model or additional structural drivers. No Stage 14 parameter is retroactively retuned.",
  }),
});
