export const STAGE16_DIAGNOSTIC_ELECTRICITY = Object.freeze([
  Object.freeze({ year: 2000, renewableElectricitySharePct: 18.716286, nuclearElectricitySharePct: 16.627375, renewableGenerationTWh: 2859.62 }),
  Object.freeze({ year: 2001, renewableElectricitySharePct: 18.044, nuclearElectricitySharePct: 16.858257, renewableGenerationTWh: 2796.97 }),
  Object.freeze({ year: 2002, renewableElectricitySharePct: 17.907661, nuclearElectricitySharePct: 16.5408, renewableGenerationTWh: 2874.16 }),
  Object.freeze({ year: 2003, renewableElectricitySharePct: 17.442015, nuclearElectricitySharePct: 15.642582, renewableGenerationTWh: 2900.26 }),
  Object.freeze({ year: 2004, renewableElectricitySharePct: 17.981865, nuclearElectricitySharePct: 15.61534, renewableGenerationTWh: 3131.54 }),
  Object.freeze({ year: 2005, renewableElectricitySharePct: 18.095596, nuclearElectricitySharePct: 15.037818, renewableGenerationTWh: 3281.47 }),
  Object.freeze({ year: 2006, renewableElectricitySharePct: 18.228472, nuclearElectricitySharePct: 14.658907, renewableGenerationTWh: 3434.06 }),
  Object.freeze({ year: 2007, renewableElectricitySharePct: 17.97366, nuclearElectricitySharePct: 13.713581, renewableGenerationTWh: 3543.32 }),
  Object.freeze({ year: 2008, renewableElectricitySharePct: 18.908064, nuclearElectricitySharePct: 13.404806, renewableGenerationTWh: 3801.02 }),
  Object.freeze({ year: 2009, renewableElectricitySharePct: 19.467335, nuclearElectricitySharePct: 13.321426, renewableGenerationTWh: 3882.47 }),
  Object.freeze({ year: 2010, renewableElectricitySharePct: 19.720509, nuclearElectricitySharePct: 12.819516, renewableGenerationTWh: 4193.32 }),
  Object.freeze({ year: 2011, renewableElectricitySharePct: 20.016176, nuclearElectricitySharePct: 11.880287, renewableGenerationTWh: 4397.96 }),
  Object.freeze({ year: 2012, renewableElectricitySharePct: 20.977444, nuclearElectricitySharePct: 10.802348, renewableGenerationTWh: 4723.21 }),
  Object.freeze({ year: 2013, renewableElectricitySharePct: 21.712217, nuclearElectricitySharePct: 10.574463, renewableGenerationTWh: 5027.47 }),
  Object.freeze({ year: 2014, renewableElectricitySharePct: 22.26262, nuclearElectricitySharePct: 10.522266, renewableGenerationTWh: 5286.72 }),
  Object.freeze({ year: 2015, renewableElectricitySharePct: 22.967085, nuclearElectricitySharePct: 10.552841, renewableGenerationTWh: 5512.64 }),
  Object.freeze({ year: 2016, renewableElectricitySharePct: 23.731874, nuclearElectricitySharePct: 10.411424, renewableGenerationTWh: 5860.47 }),
  Object.freeze({ year: 2017, renewableElectricitySharePct: 24.465708, nuclearElectricitySharePct: 10.197028, renewableGenerationTWh: 6224.33 }),
  Object.freeze({ year: 2018, renewableElectricitySharePct: 25.088713, nuclearElectricitySharePct: 10.046292, renewableGenerationTWh: 6639.6 }),
  Object.freeze({ year: 2019, renewableElectricitySharePct: 26.071484, nuclearElectricitySharePct: 10.264002, renewableGenerationTWh: 6995.61 }),
  Object.freeze({ year: 2020, renewableElectricitySharePct: 27.987377, nuclearElectricitySharePct: 9.910166, renewableGenerationTWh: 7479.17 }),
  Object.freeze({ year: 2021, renewableElectricitySharePct: 28.101631, nuclearElectricitySharePct: 9.77541, renewableGenerationTWh: 7941.26 }),
  Object.freeze({ year: 2022, renewableElectricitySharePct: 29.469746, nuclearElectricitySharePct: 9.128093, renewableGenerationTWh: 8521.99 }),
  Object.freeze({ year: 2023, renewableElectricitySharePct: 30.3231, nuclearElectricitySharePct: 9.093912, renewableGenerationTWh: 8995.45 }),
  Object.freeze({ year: 2024, renewableElectricitySharePct: 31.935133, nuclearElectricitySharePct: 8.978627, renewableGenerationTWh: 9877.61 }),
  Object.freeze({ year: 2025, renewableElectricitySharePct: 33.760456, nuclearElectricitySharePct: 8.84911, renewableGenerationTWh: 10726.49 }),
]);

export const STAGE16_DIAGNOSTIC_SOURCE_METADATA = Object.freeze({
  purpose:
    "Post-validation structural diagnosis only. These variables were not used to select or calibrate the frozen Stage 14 model.",
  renewableElectricityShare: Object.freeze({
    provider: "Ember (2026) and other sources",
    processor: "Our World in Data",
    unit: "% of global electricity generation",
    source:
      "https://ourworldindata.org/grapher/electricity-mix?frequency=annual&metric=share_of_generation&source=renewables",
  }),
  nuclearElectricityShare: Object.freeze({
    provider: "Ember (2026), Energy Institute and other sources",
    processor: "Our World in Data",
    unit: "% of global electricity generation",
    source:
      "https://ourworldindata.org/grapher/electricity-mix?frequency=annual&metric=share_of_generation&source=nuclear",
  }),
  renewableGeneration: Object.freeze({
    provider: "Ember (2026) and other sources",
    processor: "Our World in Data",
    unit: "TWh",
    source:
      "https://ourworldindata.org/grapher/electricity-mix?frequency=annual&metric=generation&source=renewables",
  }),
});
