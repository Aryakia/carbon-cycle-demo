import { SCIENCE } from "./scientific-benchmarks.js";
import {
  replayGcbHistory,
  totalAtmosphericGtCFromBoxes,
  atmosphericPpmFromBoxes,
} from "./carbon-cycle-reduced.js";
import {
  DEFAULT_PARAMETERS,
  DEFAULT_STATE,
} from "./upstream-engine.js";
import {
  GCB_1959_2024_GTC,
} from "../data/gcb-2025-global-budget.js";
import {
  HISTORICAL_REFERENCE_ROWS,
} from "../data/historical-reference-2000-2025.js";
import {
  HISTORICAL_PROXY_ROWS,
} from "./historical-mapping.js";
import {
  historicalParameterOverridesAt,
} from "./historical-drivers.js";

export const REQUIRED_LATENT_INITIAL_STATES = Object.freeze([
  "productionCapacityGtCPerYr",
  "capability",
  "institutionalSupport",
]);

const row2000 = HISTORICAL_REFERENCE_ROWS[0];
const proxy2000 = HISTORICAL_PROXY_ROWS[0];

const cumulativeFossil2000to2019GtC = GCB_1959_2024_GTC
  .filter(row => row[0] >= 2000 && row[0] <= 2019)
  .reduce((sum, row) => sum + row[1], 0);

export const APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC =
  SCIENCE.ar6CumulativeFossilIndustry1750to2019GtC -
  cumulativeFossil2000to2019GtC;

function requireFinite(name, value) {
  if (!Number.isFinite(value)) {
    throw new Error(`historical initialization requires finite ${name}`);
  }
}

export function historicalInitializationMetadata() {
  return {
    year: 2000,
    observedOrProxyInitialized: {
      cleanCapital:
        "IRENA renewable-capacity trajectory scaled to the model's 2025 clean-capital reference",
      fossilDemandCapital:
        "fossil share of total primary energy normalized to its 2025 value; proxy for fossil dependency",
      carbonCycleBoxesGtC:
        "end-1999 state from the separately calibrated 1959-2024 reduced carbon-cycle replay",
      fuelInventoryGtC:
        "quasi-steady accounting initialization using the 2000 fossil-carbon-flow scale and inventory residence time",
      productsGtC:
        "quasi-steady accounting initialization using the 2000 fossil-carbon-flow scale, non-combustion share and product lifetime",
      energyActivityIndex:
        "observed total primary-energy supply normalized to 2025",
    },
    explicitlyLatent: [...REQUIRED_LATENT_INITIAL_STATES],
    resourceInitialization:
      "available fossil resource uses the IPCC resource frame minus an approximate cumulative fossil/industry carbon amount to end-1999; the resource stock is non-binding over the historical calibration window",
  };
}

export function createHistoricalInitialState2000(
  latentInitials,
  parameterOverrides = {},
) {
  if (!latentInitials || typeof latentInitials !== "object") {
    throw new Error(
      "historical initialization requires explicit latentInitials for production capacity, capability and institutional support",
    );
  }

  for (const key of REQUIRED_LATENT_INITIAL_STATES) {
    requireFinite(key, latentInitials[key]);
  }
  if (latentInitials.productionCapacityGtCPerYr <= 0) {
    throw new Error("productionCapacityGtCPerYr must be positive");
  }
  if (latentInitials.capability < 0 || latentInitials.capability > 2.5) {
    throw new Error("capability must lie within the model range 0-2.5");
  }
  if (
    latentInitials.institutionalSupport < 0 ||
    latentInitials.institutionalSupport > 1
  ) {
    throw new Error("institutionalSupport must lie within 0-1");
  }

  const p = { ...DEFAULT_PARAMETERS, ...parameterOverrides };
  const history = replayGcbHistory();
  const end1999 = history.find(row => row.year === 1999);
  if (!end1999) throw new Error("calibrated carbon-cycle replay lacks end-1999 state");

  // The short material-accounting stocks are initialized at a quasi-steady
  // level using the observed 2000 fossil-carbon-flow scale. These are derived
  // accounting initializations, not independently observed stock estimates.
  const throughputScaleGtCPerYr = row2000.fossilCO2GtCPerYr;
  const processShare = Math.max(0, Math.min(0.3, p.processEmissionShare));
  const nonCombustionShare = Math.max(0, Math.min(0.5, p.nonCombustionShare));
  const postProcessFlow =
    throughputScaleGtCPerYr * (1 - processShare);

  const fuelInventoryGtC =
    postProcessFlow * Math.max(0.01, p.fuelInventoryResidenceYears);
  const productsGtC =
    postProcessFlow *
    nonCombustionShare *
    Math.max(0.1, p.productCarbonLifetimeYears);

  const carbonCycleBoxesGtC = [...end1999.boxesGtC];

  return {
    ...DEFAULT_STATE,
    year: 2000,
    availableResourceGtC:
      SCIENCE.ar6FossilResourcesGtC -
      Math.max(0, APPROX_CUMULATIVE_FOSSIL_TO_1999_GTC),
    productionCapacityGtCPerYr: latentInitials.productionCapacityGtCPerYr,
    fossilDemandCapital: proxy2000.fossilDependencyIndex2025,
    cleanCapital: proxy2000.cleanCapitalProxy,
    capability: latentInitials.capability,
    institutionalSupport: latentInitials.institutionalSupport,
    fuelInventoryGtC,
    productsGtC,
    carbonCycleBoxesGtC,
    atmosphereGtC: totalAtmosphericGtCFromBoxes(carbonCycleBoxesGtC),
    durableStorageGtC: 0,
    cumulativeExtractionGtC: 0,
    cumulativeFossilToAtmosphereGtC: 0,
    timeSincePolicyYears: 0,
  };
}

export function historicalInitialDiagnostics2000(latentInitials, parameterOverrides = {}) {
  const state = createHistoricalInitialState2000(latentInitials, parameterOverrides);
  const driverOverrides = historicalParameterOverridesAt(2000);
  return {
    modeledStartPpm: atmosphericPpmFromBoxes(state.carbonCycleBoxesGtC),
    observedEnd2000Ppm: row2000.atmosphericPpm,
    cleanCapitalProxy: state.cleanCapital,
    fossilDependencyProxy: state.fossilDemandCapital,
    energyActivityIndex: driverOverrides.energyActivityIndex,
    reconstructedFossilConsumptionActivity:
      driverOverrides.energyActivityIndex * state.fossilDemandCapital,
    observedFossilConsumptionActivity:
      proxy2000.fossilDemandActivityIndex2025,
    latentInitials: {
      productionCapacityGtCPerYr: state.productionCapacityGtCPerYr,
      capability: state.capability,
      institutionalSupport: state.institutionalSupport,
    },
  };
}
