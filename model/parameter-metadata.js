import { DEFAULT_PARAMETERS } from "./upstream-engine.js";

export const PARAMETER_METADATA = Object.freeze({
  startYear: {
    label: "Simulation start year", unit: "year", classification: "numerical configuration",
    status: "configured", source: "Project model boundary", default: DEFAULT_PARAMETERS.startYear, active: true,
  },
  endYear: {
    label: "Simulation end year", unit: "year", classification: "numerical configuration",
    status: "configured", source: "Project model boundary", default: DEFAULT_PARAMETERS.endYear, active: true,
  },
  dtYears: {
    label: "Integration time step", unit: "year", classification: "numerical configuration",
    status: "tested numerically", source: "Project numerical configuration", default: DEFAULT_PARAMETERS.dtYears, active: true,
  },

  carbonPriceUsdPerTCO2: {
    label: "Carbon price", unit: "USD/tCO₂", classification: "policy lever",
    status: "user-controlled scenario input", source: "Not an empirical default; baseline is zero", default: DEFAULT_PARAMETERS.carbonPriceUsdPerTCO2, active: true,
  },
  fossilSubsidyUsdPerTCO2: {
    label: "Net fossil subsidy / penalty", unit: "USD/tCO₂", classification: "policy lever",
    status: "user-controlled scenario input", source: "Stylized aggregate input; baseline is zero", default: DEFAULT_PARAMETERS.fossilSubsidyUsdPerTCO2, active: true,
  },
  fossilInvestmentIncentive: {
    label: "Fossil investment incentive multiplier", unit: "dimensionless multiplier", classification: "behavioral / policy assumption",
    status: "uncalibrated", source: "Prototype assumption", default: DEFAULT_PARAMETERS.fossilInvestmentIncentive, active: true,
  },
  cleanInvestmentIndexPerYr: {
    label: "Clean investment index", unit: "index/yr", classification: "behavioral / policy assumption",
    status: "reference replacement level; policy scenarios can raise it", source: "Derived so clean-capital investment equals depreciation at the reference initial stock (0.32) under the default learning coefficient", default: DEFAULT_PARAMETERS.cleanInvestmentIndexPerYr, active: true,
  },
  acceleratedRetirementPerYr: {
    label: "Accelerated fossil-asset retirement", unit: "1/yr", classification: "policy lever",
    status: "scenario input", source: "Prototype policy lever", default: DEFAULT_PARAMETERS.acceleratedRetirementPerYr, active: true,
  },
  expectedFutureDemandIndex: {
    label: "Expected future fossil demand", unit: "dimensionless index", classification: "behavioral assumption",
    status: "uncalibrated", source: "Prototype expectation signal", default: DEFAULT_PARAMETERS.expectedFutureDemandIndex, active: true,
  },
  institutionalResistance: {
    label: "Institutional resistance", unit: "0–1 index", classification: "research hypothesis",
    status: "uncalibrated", source: "Lock-in hypothesis; no universal empirical coefficient", default: DEFAULT_PARAMETERS.institutionalResistance, active: true,
  },
  cleanLearningRate: {
    label: "Clean learning reinforcement", unit: "dimensionless coefficient", classification: "behavioral assumption",
    status: "uncalibrated", source: "Stylized increasing-returns term; not an empirical learning rate", default: DEFAULT_PARAMETERS.cleanLearningRate, active: true,
  },
  resourceDevelopmentCostIndex: {
    label: "Resource development cost", unit: "dimensionless index", classification: "behavioral assumption",
    status: "uncalibrated", source: "Stylized aggregate cost pressure", default: DEFAULT_PARAMETERS.resourceDevelopmentCostIndex, active: true,
  },
  policyImplementationDelayYears: {
    label: "Policy implementation delay", unit: "year", classification: "behavioral assumption",
    status: "uncalibrated", source: "First-order implementation delay hypothesis", default: DEFAULT_PARAMETERS.policyImplementationDelayYears, active: true,
  },
  policyStartYear: {
    label: "Policy start year", unit: "year", classification: "policy scenario configuration",
    status: "scenario input", source: "Experiment configuration", default: DEFAULT_PARAMETERS.policyStartYear, active: true,
  },
  durableRemovalGtCPerYr: {
    label: "Durable carbon removal", unit: "GtC/yr", classification: "policy / technology lever",
    status: "scenario input", source: "Not calibrated; baseline zero", default: DEFAULT_PARAMETERS.durableRemovalGtCPerYr, active: true,
  },

  baseFossilDemandGtCPerYr: {
    label: "Current-era fossil flow reference", unit: "GtC/yr", classification: "assessed benchmark used as model scale",
    status: "dated benchmark", source: "Global Carbon Budget 2025 projected 2025 fossil CO₂ ≈10.4 GtC/yr", default: DEFAULT_PARAMETERS.baseFossilDemandGtCPerYr, active: true,
  },
  capacityLifetimeYears: {
    label: "Aggregate fossil production-capacity lifetime", unit: "year", classification: "behavioral assumption",
    status: "uncalibrated", source: "Prototype aggregate capital-turnover assumption", default: DEFAULT_PARAMETERS.capacityLifetimeYears, active: true,
  },
  fossilDemandCapitalLifetimeYears: {
    label: "Fossil-dependent demand-capital lifetime", unit: "year", classification: "behavioral assumption",
    status: "uncalibrated", source: "Prototype aggregate capital-turnover assumption", default: DEFAULT_PARAMETERS.fossilDemandCapitalLifetimeYears, active: true,
  },
  fuelInventoryResidenceYears: {
    label: "Fuel inventory residence time", unit: "year", classification: "behavioral / accounting assumption",
    status: "uncalibrated residence time; initial stock is initialized consistently with the reference flow", source: "Prototype aggregate delay between extraction and allocation to uses", default: DEFAULT_PARAMETERS.fuelInventoryResidenceYears, active: true,
  },
  productCarbonLifetimeYears: {
    label: "Non-combustion product-carbon lifetime", unit: "year", classification: "behavioral / accounting assumption",
    status: "uncalibrated lifetime; initial product stock is initialized consistently with the reference flow", source: "Prototype aggregate product-decay time", default: DEFAULT_PARAMETERS.productCarbonLifetimeYears, active: true,
  },
  nonCombustionShare: {
    label: "Non-combustion fossil-carbon share", unit: "fraction", classification: "behavioral / accounting assumption",
    status: "uncalibrated", source: "Prototype aggregate allocation assumption", default: DEFAULT_PARAMETERS.nonCombustionShare, active: true,
  },
  processEmissionShare: {
    label: "Process-emission share of extraction", unit: "fraction", classification: "behavioral / accounting assumption",
    status: "uncalibrated", source: "Prototype aggregate process-emission assumption", default: DEFAULT_PARAMETERS.processEmissionShare, active: true,
  },
  landUseEmissionsGtCPerYr: {
    label: "Net land-use CO₂ emissions", unit: "GtC/yr", classification: "simplified forcing assumption",
    status: "held constant in prototype", source: "Order-of-magnitude current-era closure; requires explicit historical/scenario data for research use", default: DEFAULT_PARAMETERS.landUseEmissionsGtCPerYr, active: true,
  },
  pedagogicalNaturalSinkFraction: {
    label: "Pedagogical net natural sink fraction", unit: "fraction of anthropogenic inflow", classification: "pedagogical closure",
    status: "not a mechanistic sink model", source: "Chosen to represent current-era uptake approximately; sensitivity-tested", default: DEFAULT_PARAMETERS.pedagogicalNaturalSinkFraction, active: true,
  },

  capacityInvestmentRatePerYr: {
    label: "Capacity investment adjustment rate", unit: "1/yr", classification: "behavioral assumption",
    status: "uncalibrated", source: "Prototype behavioral coefficient", default: DEFAULT_PARAMETERS.capacityInvestmentRatePerYr, active: true,
  },
  capabilityLearningRatePerYr: {
    label: "Fossil capability accumulation rate", unit: "1/yr", classification: "research hypothesis",
    status: "uncalibrated", source: "Stylized learning / capability accumulation mechanism", default: DEFAULT_PARAMETERS.capabilityLearningRatePerYr, active: true,
  },
  capabilityDecayRatePerYr: {
    label: "Capability decay rate", unit: "1/yr", classification: "research hypothesis",
    status: "uncalibrated", source: "Prototype capability erosion mechanism", default: DEFAULT_PARAMETERS.capabilityDecayRatePerYr, active: true,
  },
  institutionalFormationRatePerYr: {
    label: "Institutional support formation rate", unit: "1/yr", classification: "research hypothesis",
    status: "uncalibrated", source: "Prototype institutional-dependence mechanism", default: DEFAULT_PARAMETERS.institutionalFormationRatePerYr, active: true,
  },
  institutionalErosionRatePerYr: {
    label: "Institutional support erosion rate", unit: "1/yr", classification: "research hypothesis",
    status: "uncalibrated", source: "Prototype policy-pressure response mechanism", default: DEFAULT_PARAMETERS.institutionalErosionRatePerYr, active: true,
  },
  cleanDepreciationRatePerYr: {
    label: "Clean-capital depreciation rate", unit: "1/yr", classification: "behavioral assumption",
    status: "uncalibrated", source: "Prototype aggregate capital-turnover assumption", default: DEFAULT_PARAMETERS.cleanDepreciationRatePerYr, active: true,
  },
});

export function parameterRows() {
  return Object.entries(PARAMETER_METADATA).map(([key, meta]) => ({ key, ...meta }));
}
