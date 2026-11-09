export const STAGE17_FROZEN_ROLLING_ORIGIN_RESULT = Object.freeze({
  stage: "17",
  externalValidationClaim: false,
  folds: Object.freeze([
    Object.freeze({id:"fold-1",train:Object.freeze([2000,2009]),test:Object.freeze([2010,2013])}),
    Object.freeze({id:"fold-2",train:Object.freeze([2000,2013]),test:Object.freeze([2014,2017])}),
    Object.freeze({id:"fold-3",train:Object.freeze([2000,2017]),test:Object.freeze([2018,2021])}),
    Object.freeze({id:"fold-4",train:Object.freeze([2000,2021]),test:Object.freeze([2022,2025])}),
  ]),
  selected: Object.freeze({
    driverId:"low-carbon-electricity-share",
    structure:"static",
    pooledRmse:0.0028256879899738988,
    pooledMae:0.002422772217202815,
    pooledBias:-0.00014201734005672706,
    meanFoldRmse:0.002592042726948074,
    skillVsPersistence:0.6508113450609334,
    improvementVsStaticCapacityIntensity:0.5202209515243789,
    foldFits:Object.freeze([
      Object.freeze({foldId:"fold-1",beta:0.053,testRmse:0.002414369067942586}),
      Object.freeze({foldId:"fold-2",beta:0.079,testRmse:0.003883716167338866}),
      Object.freeze({foldId:"fold-3",beta:0.146,testRmse:0.0008639701418306306}),
      Object.freeze({foldId:"fold-4",beta:0.158,testRmse:0.0032061155306802114}),
    ]),
  }),
  persistence: Object.freeze({
    pooledRmse:0.0080921529093406,
    pooledMae:0.0066071624205978965,
    pooledBias:0.005123800326954038,
  }),
  ranking: Object.freeze([
    Object.freeze({rank:1,driverId:"low-carbon-electricity-share",structure:"static",pooledRmse:0.0028256879899738988,pooledBias:-0.00014201734005672706}),
    Object.freeze({rank:2,driverId:"low-carbon-electricity-share",structure:"dynamic",pooledRmse:0.0030796983365761286,pooledBias:0.0009761080835521962}),
    Object.freeze({rank:3,driverId:"renewable-electricity-share",structure:"static",pooledRmse:0.005884533806884729,pooledBias:0.002676669138704589}),
    Object.freeze({rank:4,driverId:"renewable-capacity-intensity",structure:"static",pooledRmse:0.005889561036380853,pooledBias:0.002714801558111976}),
    Object.freeze({rank:5,driverId:"renewable-capacity-intensity",structure:"dynamic",pooledRmse:0.007750672844216863,pooledBias:0.005561352091848049}),
    Object.freeze({rank:6,driverId:"renewable-electricity-share",structure:"dynamic",pooledRmse:0.007897477566183267,pooledBias:0.0056313558162194785}),
  ]),
  dynamicLowCarbonBoundaryEvidence: Object.freeze({
    fold1TauYears:0.5,
    fold2TauYears:0.5,
    fold3TauYears:0.5,
    fold4TauYears:10,
    interpretation:
      "Three of four folds place the dynamic adjustment time at the 0.5-year lower bound, while the static form has lower pooled RMSE. The data do not support adding a distinct stable lag to this reduced global relationship.",
  }),
  parameterStability: Object.freeze({
    selectedStaticBetaByFold:Object.freeze([0.053,0.079,0.146,0.158]),
    stable:false,
    interpretation:
      "Low-carbon electricity share is a strong measurement variable, but the fitted elasticity increases substantially across successive training windows. A single invariant global elasticity should not yet be treated as a transferable physical parameter.",
  }),
  interpretation:
    "Internal rolling-origin comparison strongly favors realized low-carbon electricity share over installed renewable-capacity intensity. This is structural development, not external validation.",
});
