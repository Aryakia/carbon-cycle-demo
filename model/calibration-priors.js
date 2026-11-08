import { DEFAULT_PARAMETERS } from "./upstream-engine.js";

export const CALIBRATION_PRIORS = Object.freeze({
  capacityLifetimeYears: {
    default: DEFAULT_PARAMETERS.capacityLifetimeYears,
    lower: 20,
    upper: 40,
    treatment: "externally constrained; do not freely estimate in first calibration",
    evidence:
      "IEA Energy Technology Perspectives reports typical lifetimes around 20 years for refineries, 25 for CCGT, and 35 for coal plants/pipelines; Tong et al. (2019) use about 40 years for power/industrial infrastructure.",
    caveat:
      "The model stock aggregates fossil production capacity and is not identical to any single infrastructure class.",
    sources: [
      "IEA Energy Technology Perspectives 2020",
      "Tong et al. 2019, Nature, doi:10.1038/s41586-019-1364-3",
    ],
  },
  fossilDemandCapitalLifetimeYears: {
    default: DEFAULT_PARAMETERS.fossilDemandCapitalLifetimeYears,
    lower: 15,
    upper: 35,
    treatment: "broad external prior; refine after sectoral decomposition",
    evidence:
      "Demand-side fossil dependence combines short-lived vehicles/equipment with longer-lived buildings and industrial capital. Tong et al. (2019) use approximately 15 years for light-duty vehicles and ~40 years for power/industrial infrastructure.",
    caveat:
      "A single global demand-capital lifetime is an aggregation assumption; the prior is intentionally broad.",
    sources: [
      "Tong et al. 2019, Nature, doi:10.1038/s41586-019-1364-3",
    ],
  },
  cleanDepreciationRatePerYr: {
    default: DEFAULT_PARAMETERS.cleanDepreciationRatePerYr,
    lower: 1 / 30,
    upper: 1 / 20,
    treatment: "externally constrained through asset lifetime",
    evidence:
      "Solar PV and wind projects are commonly represented with roughly 20–30 year operating/economic lifetimes; a first-order depreciation rate of ~0.033–0.05/yr spans that range.",
    caveat:
      "The model clean-capital stock also represents infrastructure beyond wind/solar, so this is a proxy prior rather than a universal physical depreciation rate.",
    sources: [
      "IEA Energy Technology Perspectives 2020",
      "Peer-reviewed energy-system literature using 20–30 year wind/solar lifetimes",
    ],
  },
});

export const FIXED_OR_SEPARATELY_CALIBRATED = Object.freeze({
  carbonCycleLifetimeScaleAlpha: {
    value: DEFAULT_PARAMETERS.carbonCycleLifetimeScaleAlpha,
    reason:
      "Already calibrated separately to the 1959-2024 atmospheric CO2 stock trajectory; should not be re-estimated during upstream behavioral calibration.",
  },
  baseFossilDemandGtCPerYr: {
    value: DEFAULT_PARAMETERS.baseFossilDemandGtCPerYr,
    reason:
      "Anchored to the 2025 Global Carbon Budget fossil-CO2 benchmark.",
  },
});
