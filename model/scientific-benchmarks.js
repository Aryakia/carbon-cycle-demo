export const SCIENCE = Object.freeze({
  ppmToGtC: 2.12,
  gtCToGtCO2: 44 / 12,
  preindustrialPpm: 278,
  ar6FossilResourcesGtC: 18635,
  ar6CumulativeFossilIndustry1750to2019GtC: 445,
  gcb2024AtmosphericPpm: 422.8,
  gcb2024AtmosphericStockGtC: 898,
  gcb2024FossilEmissionsGtCPerYr: 10.3,
  gcb2024TotalAnthropogenicGtCPerYr: 11.6,
  gcb2024OceanSinkGtCPerYr: 3.4,
  gcb2024LandSinkGtCPerYr: 1.9,
  gcb2025ProjectedFossilGtCPerYr: 10.4,
  gcb2025ProjectedTotalAnthropogenicGtCPerYr: 11.5,
  gcb2025ProjectedAtmosphericPpm: 425.6,
});

export const SOURCES = Object.freeze({
  ipccAr6Chapter5: "https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/",
  globalCarbonBudget2025: "https://essd.copernicus.org/articles/18/3211/2026/",
  unruh2000: "https://doi.org/10.1016/S0301-4215(00)00070-7",
  setoEtAl2016: "https://doi.org/10.1146/annurev-environ-110615-085934",
  tongEtAl2019: "https://doi.org/10.1038/s41586-019-1364-3",
});

export const EVIDENCE_LABELS = Object.freeze({
  OBSERVATION: "observed / assessed",
  ACCOUNTING: "accounting identity",
  ASSUMPTION: "simplifying behavioral assumption",
  HYPOTHESIS: "research hypothesis",
});
