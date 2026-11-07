import {
  DEFAULT_STATE,
  SCENARIOS,
  simulate,
} from "./upstream-engine.js";

const coordinated = { ...SCENARIOS.coordinated };

export const EXPERIMENTS = Object.freeze({
  policyMix: {
    title: "Policy packages",
    question: "How do single and coordinated interventions differ under the same initial system?",
    cases: [
      { id: "reference", label: "Structural reference", parameters: { ...SCENARIOS.structuralReference } },
      { id: "price", label: "Carbon price", parameters: { ...SCENARIOS.carbonPrice } },
      { id: "priceClean", label: "Price + clean investment", parameters: { ...SCENARIOS.pricePlusClean } },
      { id: "retirement", label: "Accelerated retirement", parameters: { ...SCENARIOS.acceleratedRetirement } },
      { id: "coordinated", label: "Coordinated package", parameters: { ...coordinated } },
    ],
  },

  timing: {
    title: "Early versus delayed intervention",
    question: "What changes when the same policy package begins in 2025 versus 2040?",
    cases: [
      {
        id: "early",
        label: "Start 2025",
        parameters: { ...coordinated, policyStartYear: 2025 },
      },
      {
        id: "delayed",
        label: "Start 2040",
        parameters: { ...coordinated, policyStartYear: 2040 },
      },
    ],
  },

  resistance: {
    title: "Institutional resistance",
    question: "How does the assumed strength of institutional resistance change the same announced policy package?",
    cases: [
      {
        id: "lowResistance",
        label: "Low resistance",
        parameters: { ...coordinated, institutionalResistance: 0.15 },
      },
      {
        id: "highResistance",
        label: "High resistance",
        parameters: { ...coordinated, institutionalResistance: 0.85 },
      },
    ],
  },

  initialConditions: {
    title: "Historical investment / initial-condition dependence",
    question: "Does the same coordinated policy behave differently in more and less fossil-dependent starting systems?",
    cases: [
      {
        id: "lessDependent",
        label: "Less fossil-dependent start",
        parameters: { ...coordinated },
        initialState: {
          ...DEFAULT_STATE,
          productionCapacityGtCPerYr: 8.0,
          fossilDemandCapital: 0.72,
          cleanCapital: 0.58,
          capability: 0.62,
          institutionalSupport: 0.48,
          fuelInventoryGtC: 1.8,
        },
      },
      {
        id: "baselineDependent",
        label: "Baseline start",
        parameters: { ...coordinated },
        initialState: { ...DEFAULT_STATE },
      },
      {
        id: "moreDependent",
        label: "More fossil-dependent start",
        parameters: { ...coordinated },
        initialState: {
          ...DEFAULT_STATE,
          productionCapacityGtCPerYr: 12.5,
          fossilDemandCapital: 1.28,
          cleanCapital: 0.20,
          capability: 1.18,
          institutionalSupport: 0.84,
          fuelInventoryGtC: 3.2,
        },
      },
    ],
  },

  supplyDemand: {
    title: "Supply-side versus demand-side policy",
    question: "What does this model produce when supply-side and demand-side levers are applied separately or together?",
    cases: [
      {
        id: "demandSide",
        label: "Demand-side package",
        parameters: {
          carbonPriceUsdPerTCO2: 140,
          cleanInvestmentIndexPerYr: 0.08,
          acceleratedRetirementPerYr: 0.03,
          institutionalResistance: 0.35,
          policyImplementationDelayYears: 3,
        },
      },
      {
        id: "supplySide",
        label: "Supply-side package",
        parameters: {
          fossilSubsidyUsdPerTCO2: -30,
          fossilInvestmentIncentive: 0.45,
          resourceDevelopmentCostIndex: 0.85,
          institutionalResistance: 0.35,
          policyImplementationDelayYears: 3,
        },
      },
      {
        id: "coordinated",
        label: "Coordinated supply + demand",
        parameters: { ...coordinated },
      },
    ],
  },
});

function nearestRow(rows, targetYear) {
  return rows.reduce((best, row) =>
    Math.abs(row.year - targetYear) < Math.abs(best.year - targetYear) ? row : best
  );
}

function firstYearBelow(rows, threshold) {
  const hit = rows.find(row => row.fossilToAtmosphereGtCPerYr <= threshold);
  return hit ? hit.year : null;
}

export function summarizeRows(rows, caseDef) {
  const first = rows[0];
  const mid = nearestRow(rows, 2050);
  const last = rows.at(-1);
  const initialFlow = first.fossilToAtmosphereGtCPerYr;
  const yearBelow95 = firstYearBelow(rows, initialFlow * 0.95);
  const yearBelow50 = firstYearBelow(rows, initialFlow * 0.50);
  const policyStart = caseDef.parameters.policyStartYear ?? 2025;

  return {
    id: caseDef.id,
    label: caseDef.label,
    emissions2050GtCPerYr: mid.fossilToAtmosphereGtCPerYr,
    emissions2100GtCPerYr: last.fossilToAtmosphereGtCPerYr,
    ppm2100: last.ppm,
    cumulativeFossilToAtmosphereGtC: last.cumulativeFossilToAtmosphereGtC,
    cumulativeExtractionGtC: last.cumulativeExtractionGtC,
    remainingResourceGtC: last.availableResourceGtC,
    productionCapacity2100GtCPerYr: last.productionCapacityGtCPerYr,
    fossilDemandCapital2100: last.fossilDemandCapital,
    cleanCapital2100: last.cleanCapital,
    institutionalSupport2100: last.institutionalSupport,
    cleanShare2100: last.cleanShare,
    yearBelow95PercentOfInitial: yearBelow95,
    yearBelow50PercentOfInitial: yearBelow50,
    policyResponseLagYears:
      yearBelow95 == null ? null : Math.max(0, yearBelow95 - policyStart),
    maxAtmosphericBalanceResidualGtC: Math.max(
      ...rows.map(r => Math.abs(r.atmosphericBalanceResidualGtC)),
    ),
    maxFossilTransferResidualGtC: Math.max(
      ...rows.map(r => Math.abs(r.fossilTransferResidualGtC)),
    ),
  };
}

export function runExperiment(experimentId, options = {}) {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) throw new Error(`Unknown experiment: ${experimentId}`);

  const cases = experiment.cases.map(caseDef => {
    const rows = simulate(caseDef.parameters, {
      endYear: options.endYear ?? 2100,
      dtYears: options.dtYears,
      initialState: caseDef.initialState,
    });
    return {
      ...caseDef,
      rows,
      summary: summarizeRows(rows, caseDef),
    };
  });

  return {
    id: experimentId,
    title: experiment.title,
    question: experiment.question,
    cases,
  };
}
