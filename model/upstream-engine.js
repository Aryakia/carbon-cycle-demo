import { SCIENCE } from "./scientific-benchmarks.js";
import { stepAtmosphere, gtCToPpm, assertFiniteNonnegative } from "./conservation.js";

export const DEFAULT_PARAMETERS = Object.freeze({
  startYear: 2025,
  endYear: 2100,
  dtYears: 0.25,

  // Policy levers.
  carbonPriceUsdPerTCO2: 0,
  fossilSubsidyUsdPerTCO2: 0,
  fossilInvestmentIncentive: 1,
  cleanInvestmentIndexPerYr: 0.035,
  acceleratedRetirementPerYr: 0,
  expectedFutureDemandIndex: 1,
  institutionalResistance: 0.55,
  cleanLearningRate: 0.08,
  resourceDevelopmentCostIndex: 0.5,
  policyImplementationDelayYears: 5,
  policyStartYear: 2025,
  durableRemovalGtCPerYr: 0,

  // Behavioral / capital-turnover assumptions. These are not calibrated.
  baseFossilDemandGtCPerYr: 10.4,
  capacityLifetimeYears: 25,
  fossilDemandCapitalLifetimeYears: 20,
  cleanCapitalLifetimeYears: 25,
  fuelInventoryResidenceYears: 0.25,
  productCarbonLifetimeYears: 30,
  nonCombustionShare: 0.08,
  processEmissionShare: 0.02,
  landUseEmissionsGtCPerYr: 1.1,
  pedagogicalNaturalSinkFraction: 0.46,

  capacityInvestmentRatePerYr: 0.035,
  demandCapitalInvestmentRatePerYr: 0.025,
  capabilityLearningRatePerYr: 0.035,
  capabilityDecayRatePerYr: 0.015,
  institutionalFormationRatePerYr: 0.025,
  institutionalErosionRatePerYr: 0.03,
  cleanDepreciationRatePerYr: 0.04,
});

export const DEFAULT_STATE = Object.freeze({
  year: 2025,
  availableResourceGtC:
    SCIENCE.ar6FossilResourcesGtC -
    (495 + SCIENCE.gcb2025ProjectedFossilGtCPerYr),
  productionCapacityGtCPerYr: SCIENCE.gcb2025ProjectedFossilGtCPerYr,
  fossilDemandCapital: 1,
  cleanCapital: 0.32,
  capability: 0.9,
  institutionalSupport: 0.7,
  fuelInventoryGtC: 2.4,
  productsGtC: 8,
  atmosphereGtC: SCIENCE.gcb2025ProjectedAtmosphericPpm * SCIENCE.ppmToGtC,
  durableStorageGtC: 0,
  cumulativeExtractionGtC: 0,
  cumulativeFossilToAtmosphereGtC: 0,
  timeSincePolicyYears: 0,
});

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function safeExpit(x) {
  if (x > 30) return 1;
  if (x < -30) return 0;
  return 1 / (1 + Math.exp(-x));
}

export function createInitialState(overrides = {}) {
  return { ...DEFAULT_STATE, ...overrides };
}

export function policyRamp(state, p) {
  const start = Number.isFinite(p.policyStartYear) ? p.policyStartYear : p.startYear;
  if (state.year < start) return 0;
  const delay = Math.max(0.01, p.policyImplementationDelayYears);
  const elapsed = Math.max(0, state.year - start);
  return 1 - Math.exp(-elapsed / delay);
}

export function calculateSignals(state, p = DEFAULT_PARAMETERS) {
  const ramp = policyRamp(state, p);
  const effectiveCarbonPrice =
    p.carbonPriceUsdPerTCO2 *
    ramp *
    (1 - 0.65 * clamp(p.institutionalResistance, 0, 1));

  const cleanLearningBonus =
    1 + p.cleanLearningRate * Math.log1p(Math.max(0, state.cleanCapital) * 10);
  const cleanCompetitiveness =
    state.cleanCapital * cleanLearningBonus +
    effectiveCarbonPrice / 220;

  const cleanShare = clamp(safeExpit(3.2 * (cleanCompetitiveness - 0.72)), 0, 0.97);
  const fossilDemandSignal =
    Math.max(0, p.expectedFutureDemandIndex) *
    Math.max(0, state.fossilDemandCapital) *
    (1 - cleanShare);

  const effectiveSubsidyUsdPerTCO2 = p.fossilSubsidyUsdPerTCO2 * ramp;
  const effectiveFossilInvestmentIncentive =
    1 + (p.fossilInvestmentIncentive - 1) * ramp;
  const baselineCleanInvestment = DEFAULT_PARAMETERS.cleanInvestmentIndexPerYr;
  const effectiveCleanInvestmentIndexPerYr =
    baselineCleanInvestment +
    (p.cleanInvestmentIndexPerYr - baselineCleanInvestment) * ramp;

  const subsidyEffect = effectiveSubsidyUsdPerTCO2 / 100;
  const carbonPriceEffect = effectiveCarbonPrice / 180;
  const profitabilityIndex =
    0.45 +
    0.55 * fossilDemandSignal +
    0.22 * state.capability +
    0.18 * state.institutionalSupport +
    0.35 * subsidyEffect -
    0.55 * carbonPriceEffect -
    0.35 * p.resourceDevelopmentCostIndex;

  return {
    ramp,
    effectiveCarbonPrice,
    cleanShare,
    fossilDemandSignal,
    profitabilityIndex,
    effectiveSubsidyUsdPerTCO2,
    effectiveFossilInvestmentIncentive,
    effectiveCleanInvestmentIndexPerYr,
  };
}

export function stepUpstream(state, parameters = {}, dtOverride = null) {
  const p = { ...DEFAULT_PARAMETERS, ...parameters };
  const dt = dtOverride ?? p.dtYears;
  const s = { ...state };
  const sig = calculateSignals(s, p);

  const capacityInvestment =
    p.capacityInvestmentRatePerYr *
    Math.max(0.1, s.productionCapacityGtCPerYr) *
    Math.max(0, sig.profitabilityIndex) *
    Math.max(0, sig.effectiveFossilInvestmentIncentive);

  const policyRetirementBoost =
    Math.max(0, p.acceleratedRetirementPerYr) * sig.ramp;
  const capacityRetirement =
    s.productionCapacityGtCPerYr *
    (1 / p.capacityLifetimeYears + policyRetirementBoost);

  const demandCapitalInvestment =
    p.demandCapitalInvestmentRatePerYr *
    Math.max(0, p.expectedFutureDemandIndex) *
    Math.max(0, s.institutionalSupport) *
    (1 - sig.cleanShare);

  const demandCapitalRetirement =
    s.fossilDemandCapital *
    (1 / p.fossilDemandCapitalLifetimeYears + policyRetirementBoost);

  const cleanInvestment =
    Math.max(0, sig.effectiveCleanInvestmentIndexPerYr) *
    (1 + p.cleanLearningRate * Math.max(0, s.cleanCapital));
  const cleanRetirement =
    Math.max(0, s.cleanCapital) *
    Math.max(0, p.cleanDepreciationRatePerYr);

  const capacityUtilization =
    s.productionCapacityGtCPerYr > 0
      ? clamp(
          (p.baseFossilDemandGtCPerYr * sig.fossilDemandSignal) /
            s.productionCapacityGtCPerYr,
          0,
          1.15,
        )
      : 0;

  const capabilityGain =
    p.capabilityLearningRatePerYr * capacityUtilization * (1 + 0.25 * s.capability);
  const capabilityLoss = p.capabilityDecayRatePerYr * s.capability;

  const policyPressure =
    clamp(sig.effectiveCarbonPrice / 150 + sig.cleanShare + policyRetirementBoost * 5, 0, 2);
  const institutionalGain =
    p.institutionalFormationRatePerYr *
    clamp(capacityUtilization, 0, 1) *
    (1 - s.institutionalSupport);
  const institutionalLoss =
    p.institutionalErosionRatePerYr *
    policyPressure *
    s.institutionalSupport *
    (1 - 0.5 * clamp(p.institutionalResistance, 0, 1));

  const demandLimitGtCPerYr =
    p.baseFossilDemandGtCPerYr * sig.fossilDemandSignal;
  const extractionGtCPerYr = Math.max(
    0,
    Math.min(
      s.productionCapacityGtCPerYr,
      demandLimitGtCPerYr,
      s.availableResourceGtC / dt,
    ),
  );

  const processEmissionsGtCPerYr =
    extractionGtCPerYr * clamp(p.processEmissionShare, 0, 0.3);
  const inventoryInGtCPerYr = extractionGtCPerYr - processEmissionsGtCPerYr;

  // Exact solution for a first-order inventory stock with constant inflow
  // over the integration interval. This avoids explicit-Euler instability
  // when dt approaches or exceeds the short inventory residence time.
  const inventoryTauYears = Math.max(0.01, p.fuelInventoryResidenceYears);
  const inventoryDecay = Math.exp(-dt / inventoryTauYears);
  const nextFuelInventoryGtC =
    s.fuelInventoryGtC * inventoryDecay +
    inventoryInGtCPerYr * inventoryTauYears * (1 - inventoryDecay);
  const inventoryOutAmountGtC =
    s.fuelInventoryGtC + inventoryInGtCPerYr * dt - nextFuelInventoryGtC;
  const inventoryOutGtCPerYr = Math.max(0, inventoryOutAmountGtC / dt);

  const nonCombustionShare = clamp(p.nonCombustionShare, 0, 0.5);
  const combustionGtCPerYr = inventoryOutGtCPerYr * (1 - nonCombustionShare);
  const productFormationGtCPerYr = inventoryOutGtCPerYr * nonCombustionShare;
  const productDecayGtCPerYr =
    s.productsGtC / Math.max(0.1, p.productCarbonLifetimeYears);

  const fossilToAtmosphereGtCPerYr =
    combustionGtCPerYr + processEmissionsGtCPerYr + productDecayGtCPerYr;

  const totalAnthropogenicGtCPerYr =
    fossilToAtmosphereGtCPerYr + Math.max(0, p.landUseEmissionsGtCPerYr);
  const totalNaturalSinkGtCPerYr =
    totalAnthropogenicGtCPerYr *
    clamp(p.pedagogicalNaturalSinkFraction, 0, 0.95);

  const landSinkGtCPerYr = totalNaturalSinkGtCPerYr * 0.45;
  const oceanSinkGtCPerYr = totalNaturalSinkGtCPerYr * 0.55;

  const atm = stepAtmosphere({
    atmosphereGtC: s.atmosphereGtC,
    fossilIndustrialGtCPerYr: fossilToAtmosphereGtCPerYr,
    landUseGtCPerYr: Math.max(0, p.landUseEmissionsGtCPerYr),
    landSinkGtCPerYr,
    oceanSinkGtCPerYr,
    durableRemovalGtCPerYr: Math.max(0, p.durableRemovalGtCPerYr),
    dtYears: dt,
  });

  const next = {
    year: s.year + dt,
    availableResourceGtC: Math.max(0, s.availableResourceGtC - extractionGtCPerYr * dt),
    productionCapacityGtCPerYr: Math.max(
      0,
      s.productionCapacityGtCPerYr + (capacityInvestment - capacityRetirement) * dt,
    ),
    fossilDemandCapital: Math.max(
      0,
      s.fossilDemandCapital + (demandCapitalInvestment - demandCapitalRetirement) * dt,
    ),
    cleanCapital: Math.max(0, s.cleanCapital + (cleanInvestment - cleanRetirement) * dt),
    capability: clamp(s.capability + (capabilityGain - capabilityLoss) * dt, 0, 2.5),
    institutionalSupport: clamp(
      s.institutionalSupport + (institutionalGain - institutionalLoss) * dt,
      0,
      1,
    ),
    fuelInventoryGtC: Math.max(0, nextFuelInventoryGtC),
    productsGtC: Math.max(
      0,
      s.productsGtC + (productFormationGtCPerYr - productDecayGtCPerYr) * dt,
    ),
    atmosphereGtC: Math.max(0, atm.nextAtmosphereGtC),
    durableStorageGtC:
      s.durableStorageGtC + Math.max(0, p.durableRemovalGtCPerYr) * dt,
    cumulativeExtractionGtC: s.cumulativeExtractionGtC + extractionGtCPerYr * dt,
    cumulativeFossilToAtmosphereGtC:
      s.cumulativeFossilToAtmosphereGtC + fossilToAtmosphereGtCPerYr * dt,
    timeSincePolicyYears: s.timeSincePolicyYears + dt,
  };

  const fossilTransferResidualGtC =
    extractionGtCPerYr * dt -
    (
      (next.fuelInventoryGtC - s.fuelInventoryGtC) +
      (next.productsGtC - s.productsGtC) +
      fossilToAtmosphereGtCPerYr * dt
    );

  for (const key of [
    "availableResourceGtC",
    "productionCapacityGtCPerYr",
    "fossilDemandCapital",
    "cleanCapital",
    "fuelInventoryGtC",
    "productsGtC",
    "atmosphereGtC",
    "durableStorageGtC",
  ]) {
    assertFiniteNonnegative(key, next[key]);
  }

  return {
    state: next,
    flows: {
      capacityInvestment,
      capacityRetirement,
      demandCapitalInvestment,
      demandCapitalRetirement,
      cleanInvestment,
      cleanRetirement,
      extractionGtCPerYr,
      processEmissionsGtCPerYr,
      combustionGtCPerYr,
      productFormationGtCPerYr,
      productDecayGtCPerYr,
      fossilToAtmosphereGtCPerYr,
      totalAnthropogenicGtCPerYr,
      landSinkGtCPerYr,
      oceanSinkGtCPerYr,
      durableRemovalGtCPerYr: Math.max(0, p.durableRemovalGtCPerYr),
      netAtmosphericGtCPerYr: atm.netGtCPerYr,
    },
    signals: sig,
    diagnostics: {
      atmosphericBalanceResidualGtC: atm.residualGtC,
      fossilTransferResidualGtC,
    },
  };
}

export function simulate(parameters = {}, options = {}) {
  const p = { ...DEFAULT_PARAMETERS, ...parameters };
  const dt = options.dtYears ?? p.dtYears;
  const endYear = options.endYear ?? p.endYear;
  let state = createInitialState(options.initialState);
  const rows = [];

  while (state.year < endYear - 1e-9) {
    const result = stepUpstream(state, p, dt);
    state = result.state;
    rows.push({
      ...state,
      ppm: gtCToPpm(state.atmosphereGtC),
      ...result.flows,
      ...result.signals,
      ...result.diagnostics,
    });
  }
  return rows;
}

export const SCENARIOS = Object.freeze({
  bau: {},
  carbonPrice: {
    carbonPriceUsdPerTCO2: 120,
  },
  pricePlusClean: {
    carbonPriceUsdPerTCO2: 120,
    cleanInvestmentIndexPerYr: 0.07,
    cleanLearningRate: 0.12,
  },
  acceleratedRetirement: {
    acceleratedRetirementPerYr: 0.035,
    cleanInvestmentIndexPerYr: 0.065,
  },
  coordinated: {
    carbonPriceUsdPerTCO2: 140,
    fossilSubsidyUsdPerTCO2: -20,
    fossilInvestmentIncentive: 0.6,
    cleanInvestmentIndexPerYr: 0.08,
    acceleratedRetirementPerYr: 0.03,
    institutionalResistance: 0.25,
    policyImplementationDelayYears: 2,
  },
});
