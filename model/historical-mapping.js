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
  fossilEnergyProductionTWh: {
    observedField: "fossilEnergyProductionTWh",
    modelField: "extractionGtCPerYr",
    role: "fossil extraction-activity proxy",
    measurementType: "flow proxy",
    transform: "normalize to 2025 = 1",
    interpretation:
      "Energy-unit production does not directly equal carbon extraction because fuel carbon intensities differ and the model aggregates coal, oil and gas. It constrains the historical shape of extraction activity, not the absolute GtC scale.",
  },
  fossilEnergyConsumptionTWh: {
    observedField: "fossilEnergyConsumptionTWh",
    modelField: "fossilDemandCapital",
    role: "fossil-dependency/share proxy after separating aggregate energy activity",
    measurementType: "derived dependency proxy",
    transform:
      "compute fossil share of total energy supply, then normalize that share to 2025 = 1",
    interpretation:
      "Absolute fossil consumption combines overall energy-system growth and fossil dependence. Historical mode therefore factors it into total energy activity × a normalized fossil-share/dependency index. The resulting dependency index is still a proxy, not a direct capital-stock measurement.",
  },
  totalEnergySupplyTWh: {
    observedField: "totalEnergySupplyTWh",
    modelField: "energyActivityIndex",
    role: "preferred historical aggregate energy-activity driver",
    measurementType: "exogenous flow index",
    transform: "normalize to 2025 = 1",
    interpretation:
      "Total primary energy supply is closer to the scale of energy-system activity than GDP. It is still not identical to final energy services because primary-energy accounting depends on the technology mix.",
  },
  worldGdpConstant2015Usd: {
    observedField: "worldGdpConstant2015Usd",
    modelField: "expectedFutureDemandIndex",
    role: "secondary macroeconomic diagnostic / candidate explanatory driver",
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
      fossilProductionActivityIndex2025:
        row.fossilEnergyProductionTWh / last.fossilEnergyProductionTWh,
      fossilDemandActivityIndex2025:
        row.fossilEnergyConsumptionTWh / last.fossilEnergyConsumptionTWh,
      fossilDependencyIndex2025:
        (row.fossilEnergyConsumptionTWh / row.totalEnergySupplyTWh) /
        (last.fossilEnergyConsumptionTWh / last.totalEnergySupplyTWh),
      energyActivityIndex2025:
        row.totalEnergySupplyTWh / last.totalEnergySupplyTWh,
      gdpIndex2025:
        row.worldGdpConstant2015Usd / last.worldGdpConstant2015Usd,
    }),
  ),
);
