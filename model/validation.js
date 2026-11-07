import { SCENARIOS, simulate } from "./upstream-engine.js";

export const SENSITIVITY_DIMENSIONS = Object.freeze([
  {
    key: "institutionalResistance",
    label: "Institutional resistance",
    low: 0.10,
    high: 0.90,
    rationale: "Uncalibrated research-hypothesis strength.",
  },
  {
    key: "cleanLearningRate",
    label: "Clean learning reinforcement",
    low: 0.03,
    high: 0.15,
    rationale: "Stylized increasing-returns term.",
  },
  {
    key: "capacityLifetimeYears",
    label: "Fossil production-capacity lifetime",
    low: 15,
    high: 40,
    rationale: "Aggregate capital-turnover uncertainty.",
  },
  {
    key: "fossilDemandCapitalLifetimeYears",
    label: "Fossil-demand-capital lifetime",
    low: 12,
    high: 35,
    rationale: "Aggregate persistence of consuming capital.",
  },
  {
    key: "policyImplementationDelayYears",
    label: "Policy implementation delay",
    low: 1,
    high: 12,
    rationale: "Behavioral/institutional implementation delay.",
  },
  {
    key: "pedagogicalNaturalSinkFraction",
    label: "Natural-sink closure fraction",
    low: 0.35,
    high: 0.58,
    rationale: "Pedagogical closure, not a mechanistic sink response.",
  },
  {
    key: "resourceDevelopmentCostIndex",
    label: "Resource development cost index",
    low: 0.20,
    high: 0.90,
    rationale: "Uncalibrated aggregate cost pressure.",
  },
  {
    key: "nonCombustionShare",
    label: "Non-combustion fossil-carbon share",
    low: 0.04,
    high: 0.12,
    rationale: "Aggregate carbon-allocation uncertainty.",
  },
]);

function endpoint(rows) {
  const last = rows.at(-1);
  return {
    ppm2100: last.ppm,
    fossilFlow2100GtCPerYr: last.fossilToAtmosphereGtCPerYr,
    cumulativeFossilToAtmosphereGtC: last.cumulativeFossilToAtmosphereGtC,
    productionCapacity2100GtCPerYr: last.productionCapacityGtCPerYr,
    remainingResourceGtC: last.availableResourceGtC,
    maxAtmosphericBalanceResidualGtC: Math.max(
      ...rows.map(r => Math.abs(r.atmosphericBalanceResidualGtC)),
    ),
    maxFossilTransferResidualGtC: Math.max(
      ...rows.map(r => Math.abs(r.fossilTransferResidualGtC)),
    ),
  };
}

export function runOneAtATimeSensitivity() {
  const baselineRows = simulate(SCENARIOS.coordinated);
  const baseline = endpoint(baselineRows);

  const dimensions = SENSITIVITY_DIMENSIONS.map(dimension => {
    const low = endpoint(
      simulate({ ...SCENARIOS.coordinated, [dimension.key]: dimension.low }),
    );
    const high = endpoint(
      simulate({ ...SCENARIOS.coordinated, [dimension.key]: dimension.high }),
    );
    return { ...dimension, lowOutcome: low, highOutcome: high };
  });

  const all = [
    baseline,
    ...dimensions.flatMap(d => [d.lowOutcome, d.highOutcome]),
  ];

  return {
    baseline,
    dimensions,
    envelope: {
      ppm2100Min: Math.min(...all.map(x => x.ppm2100)),
      ppm2100Max: Math.max(...all.map(x => x.ppm2100)),
      cumulativeFossilMinGtC: Math.min(
        ...all.map(x => x.cumulativeFossilToAtmosphereGtC),
      ),
      cumulativeFossilMaxGtC: Math.max(
        ...all.map(x => x.cumulativeFossilToAtmosphereGtC),
      ),
      fossilFlow2100MinGtCPerYr: Math.min(
        ...all.map(x => x.fossilFlow2100GtCPerYr),
      ),
      fossilFlow2100MaxGtCPerYr: Math.max(
        ...all.map(x => x.fossilFlow2100GtCPerYr),
      ),
    },
  };
}

export function runTimeStepStability() {
  const steps = [0.25, 0.125, 0.0625];
  const scenarios = Object.entries(SCENARIOS).map(([name, parameters]) => {
    const outcomes = steps.map(dtYears => ({
      dtYears,
      ...endpoint(simulate(parameters, { dtYears })),
    }));
    const reference = outcomes.at(-1);
    const maxRelativePpmDifference = Math.max(
      ...outcomes.map(
        o =>
          Math.abs(o.ppm2100 - reference.ppm2100) /
          Math.max(1, Math.abs(reference.ppm2100)),
      ),
    );
    const maxRelativeCumulativeDifference = Math.max(
      ...outcomes.map(
        o =>
          Math.abs(
            o.cumulativeFossilToAtmosphereGtC -
              reference.cumulativeFossilToAtmosphereGtC,
          ) /
          Math.max(1, Math.abs(reference.cumulativeFossilToAtmosphereGtC)),
      ),
    );
    return {
      name,
      outcomes,
      maxRelativePpmDifference,
      maxRelativeCumulativeDifference,
    };
  });
  return { steps, scenarios };
}

export function validationSnapshot() {
  const sensitivity = runOneAtATimeSensitivity();
  const stability = runTimeStepStability();
  return {
    sensitivity,
    stability,
    maxAtmosphericResidualGtC: Math.max(
      sensitivity.baseline.maxAtmosphericBalanceResidualGtC,
      ...sensitivity.dimensions.flatMap(d => [
        d.lowOutcome.maxAtmosphericBalanceResidualGtC,
        d.highOutcome.maxAtmosphericBalanceResidualGtC,
      ]),
    ),
    maxFossilTransferResidualGtC: Math.max(
      sensitivity.baseline.maxFossilTransferResidualGtC,
      ...sensitivity.dimensions.flatMap(d => [
        d.lowOutcome.maxFossilTransferResidualGtC,
        d.highOutcome.maxFossilTransferResidualGtC,
      ]),
    ),
  };
}
