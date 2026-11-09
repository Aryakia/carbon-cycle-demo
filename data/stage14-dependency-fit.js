export const STAGE14_FROZEN_DEPENDENCY_FIT = Object.freeze({
  stage: "14",
  frozenBeforeHoldout: true,
  calibrationWindow: Object.freeze([2000, 2017]),
  heldOutWindow: Object.freeze([2018, 2025]),
  normalizationYear: 2017,
  holdoutAccessedDuringSelection: false,
  selectedHypothesisId: "renewable-capacity-intensity",
  selectedParameters: Object.freeze({
    cleanElasticity: 0.016,
    effectiveAdjustmentTimeYears: 3.0,
  }),
  trainingMetrics: Object.freeze({
    rmse: 0.0022803711155905404,
    persistenceBaselineRmse: 0.004818474074202978,
    improvementVsPersistence: 0.5267441350781292,
    bestStaticCleanCompetitionRmse: 0.0038643749764287597,
    improvementVsBestStatic: 1 - 0.0022803711155905404 / 0.0038643749764287597,
  }),
  nearOptimalEnvelope5Pct: Object.freeze({
    cleanElasticity: Object.freeze([0.015, 0.018]),
    effectiveAdjustmentTimeYears: Object.freeze([2.5, 4.5]),
  }),
  structuralInterpretation:
    "Training data support a short effective aggregate fossil-dependency adjustment delay, but reject interpreting that delay as the 15-35 year physical lifetime of a single capital stock. Fossil share should remain an observable dependency proxy rather than a direct measurement of installed fossil-dependent capital.",
  selectionProtocol:
    "Selected using 2000-2017 data only, with all fitted variables normalized to 2017. The 2018-2025 holdout was not used for scoring, normalization, hypothesis ranking, parameter bounds, or result selection.",
});
