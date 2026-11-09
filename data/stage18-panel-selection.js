export const STAGE18_EXTERNAL_PANEL_SELECTION = Object.freeze({
  stage: "18",
  selectionFrozenBeforeOutcomeEvaluation: true,
  selectionYear: 2017,
  selectionRule:
    "Top 10 ISO-coded entities by 2017 fossil-energy consumption among entities with complete 2000-2025 coverage in fossil consumption, total primary energy supply, renewable electricity share, and nuclear electricity share.",
  outcomeVariablesInspectedForRanking: false,
  requiredCoverage: Object.freeze([2000, 2025]),
  entities: Object.freeze([
    Object.freeze({rank:1,entity:"China",code:"CHN",fossil2017TWh:31511.137}),
    Object.freeze({rank:2,entity:"United States",code:"USA",fossil2017TWh:21312.797}),
    Object.freeze({rank:3,entity:"India",code:"IND",fossil2017TWh:7861.3516}),
    Object.freeze({rank:4,entity:"Russia",code:"RUS",fossil2017TWh:7120.232}),
    Object.freeze({rank:5,entity:"Japan",code:"JPN",fossil2017TWh:4850.4736}),
    Object.freeze({rank:6,entity:"Germany",code:"DEU",fossil2017TWh:3122.243}),
    Object.freeze({rank:7,entity:"South Korea",code:"KOR",fossil2017TWh:3028.3232}),
    Object.freeze({rank:8,entity:"Iran",code:"IRN",fossil2017TWh:2958.9275}),
    Object.freeze({rank:9,entity:"Canada",code:"CAN",fossil2017TWh:2579.9492}),
    Object.freeze({rank:10,entity:"Mexico",code:"MEX",fossil2017TWh:2126.165}),
  ]),
  trainingWindow: Object.freeze([2000, 2017]),
  validationWindow: Object.freeze([2018, 2025]),
  externalValidationQuestion:
    "Does the Stage 17 selected static low-carbon-electricity-share measurement structure transfer to major national energy systems when each entity's elasticity is estimated only on 2000-2017 and evaluated without retuning on 2018-2025?",
});
