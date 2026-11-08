import { HISTORICAL_REFERENCE_ROWS } from "../data/historical-reference-2000-2025.js";
import { DEFAULT_STATE } from "./upstream-engine.js";

const last = HISTORICAL_REFERENCE_ROWS.at(-1);

export const HISTORICAL_MODEL_MAPPING = Object.freeze({
  fossilCO2GtCPerYr: {
    observedField: "fossilCO2GtCPerYr",
    modelField: "fossilToAtmosphereGtCPerYr",
    role: "primary calibration target",
    measurementType: "flow",
    interpretation:
      "Closest directly observed global carbon-flow target. Accounting boundaries are not perfectly identical because the model also contains process/product bookkeeping.",
  },
  atmosphericPpm: {
    observedField: "atmosphericPpm",
    modelField: "ppm",
    role: "carbon-cycle validation target",
    measurementType: "stock",
    interpretation:
      "Already used to calibrate/validate the reduced carbon-cycle component; should not be reused to estimate upstream behavioral parameters without accounting for that prior calibration.",
  },
  renewableCapacityGw: {
    observedField: "renewableCapacityGw",
    modelField: "cleanCapital",
    role: "clean-capital proxy",
    measurementType: "stock proxy",
    transform: "scale to model clean-capital reference stock at 2025",
    interpretation:
      "Installed renewable power capacity is not identical to all clean capital. It constrains the historical shape of clean infrastructure but omits nuclear, grids, storage, efficiency and electrified end-use capital.",
  },
  fossilEnergyConsumptionTWh: {
    observedField: "fossilEnergyConsumptionTWh",
    modelField: "fossilDemandCapital",
    role: "fossil-demand proxy",
    measurementType: "flow proxy for persistent demand stock",
    transform: "normalize to 2025 = 1",
    interpretation:
      "Annual fossil energy use is not a capital stock. It can constrain demand-side behavior, but should not be treated as a direct measurement of fossil-dependent installed capital.",
  },
  worldGdpConstant2015Usd: {
    observedField: "worldGdpConstant2015Usd",
    modelField: "expectedFutureDemandIndex",
    role: "candidate exogenous demand driver",
    measurementType: "driver proxy",
    transform: "normalize to 2025 = 1",
    interpretation:
      "GDP is a candidate driver of energy-service demand, not a direct observation of expected future fossil demand. The relationship must be estimated/tested rather than assumed.",
  },
});

export const HISTORICAL_PROXY_ROWS = Object.freeze(
  HISTORICAL_REFERENCE_ROWS.map(row =>
    Object.freeze({
      year: row.year,
      fossilFlowObservedGtCPerYr: row.fossilCO2GtCPerYr,
      atmosphericPpmObserved: row.atmosphericPpm,
      cleanCapitalProxy:
        DEFAULT_STATE.cleanCapital *
        (row.renewableCapacityGw / last.renewableCapacityGw),
      fossilDemandActivityIndex2025:
        row.fossilEnergyConsumptionTWh / last.fossilEnergyConsumptionTWh,
      gdpIndex2025:
        row.worldGdpConstant2015Usd / last.worldGdpConstant2015Usd,
    }),
  ),
);
