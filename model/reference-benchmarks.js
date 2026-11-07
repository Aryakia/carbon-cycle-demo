export const REFERENCE_BENCHMARKS = Object.freeze({
  globalCarbonBudget2025: {
    year: 2025,
    fossilCO2GtCPerYr: 10.4,
    fossilCO2GtCO2PerYr: 38.1,
    status: "projected current-year benchmark in Global Carbon Budget 2025",
    source: "https://essd.copernicus.org/articles/18/3211/2026/",
    doi: "10.5194/essd-18-3211-2026",
    boundary: "global fossil CO2 including cement carbonation treatment used by the Global Carbon Budget",
  },
  ieaCurrentPolicies2050: {
    year: 2050,
    energyRelatedCO2GtCO2PerYrApprox: 40,
    energyRelatedCO2GtCPerYrApprox: 40 * 12 / 44,
    status: "external qualitative guardrail only; not a calibration target",
    source: "https://www.iea.org/reports/world-energy-outlook-2025/current-policies-scenario",
    boundary: "global energy-related CO2; not identical to the Global Carbon Budget fossil-and-industry accounting boundary",
    caveat: "IEA explicitly states the Current Policies Scenario is not a forecast, prediction, or business-as-usual scenario.",
  },
});

export const REFERENCE_MODE_DEFINITION = Object.freeze({
  name: "Structural reference",
  interpretation:
    "A neutral model reference condition in which current fossil flow, current clean-capital state, and normal asset replacement reproduce themselves unless an explicit driver changes them.",
  notAForecast: true,
});
