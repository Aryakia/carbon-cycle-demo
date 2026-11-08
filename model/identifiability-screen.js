import { DEFAULT_PARAMETERS, simulate } from "./upstream-engine.js";

export const IDENTIFIABILITY_PARAMETERS = Object.freeze([
  "capacityLifetimeYears",
  "fossilDemandCapitalLifetimeYears",
  "capacityInvestmentRatePerYr",
  "capabilityLearningRatePerYr",
  "capabilityDecayRatePerYr",
  "institutionalFormationRatePerYr",
  "institutionalErosionRatePerYr",
  "cleanDepreciationRatePerYr",
  "cleanLearningRate",
  "resourceDevelopmentCostIndex",
  "institutionalResistance",
  "policyImplementationDelayYears",
]);

export const OBSERVABLE_OUTPUTS = Object.freeze([
  "fossilToAtmosphereGtCPerYr",
  "fossilDemandCapital",
  "cleanCapital",
  "ppm",
]);

export const SCREEN_YEARS = Object.freeze([2030, 2040, 2050]);

export const DIAGNOSTIC_POLICY_EXCITATION = Object.freeze({
  carbonPriceUsdPerTCO2: 80,
  fossilSubsidyUsdPerTCO2: -10,
  fossilInvestmentIncentive: 0.8,
  cleanInvestmentIndexPerYr: 0.04,
  acceleratedRetirementPerYr: 0.01,
  policyImplementationDelayYears: DEFAULT_PARAMETERS.policyImplementationDelayYears,
});

function nearestRow(rows, year) {
  return rows.reduce((best, row) =>
    Math.abs(row.year - year) < Math.abs(best.year - year) ? row : best
  );
}

function observableVector(rows) {
  const values = [];
  for (const year of SCREEN_YEARS) {
    const row = nearestRow(rows, year);
    for (const output of OBSERVABLE_OUTPUTS) values.push(row[output]);
  }
  return values;
}

function norm(v) {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0));
}

function cosine(a, b) {
  const na = norm(a), nb = norm(b);
  if (na < 1e-12 || nb < 1e-12) return 0;
  return a.reduce((s, x, i) => s + x * b[i], 0) / (na * nb);
}

function sensitivityVector(parameter, scenario, fraction = 0.05) {
  const baseValue = DEFAULT_PARAMETERS[parameter];
  if (!Number.isFinite(baseValue) || baseValue === 0) {
    throw new Error(`parameter ${parameter} must have a finite nonzero default for local screening`);
  }

  const plusValue = baseValue * (1 + fraction);
  const minusValue = baseValue * (1 - fraction);
  const baseRows = simulate(scenario, { endYear: 2050 });
  const plusRows = simulate({ ...scenario, [parameter]: plusValue }, { endYear: 2050 });
  const minusRows = simulate({ ...scenario, [parameter]: minusValue }, { endYear: 2050 });

  const base = observableVector(baseRows);
  const plus = observableVector(plusRows);
  const minus = observableVector(minusRows);

  return base.map((value, i) => {
    const scale = Math.max(Math.abs(value), 1e-6);
    return (plus[i] - minus[i]) / (2 * fraction * scale);
  });
}

export function runLocalIdentifiabilityScreen() {
  const reference = {};
  const excitation = DIAGNOSTIC_POLICY_EXCITATION;

  const parameters = IDENTIFIABILITY_PARAMETERS.map(parameter => {
    const referenceVector = sensitivityVector(parameter, reference);
    const excitationVector = sensitivityVector(parameter, excitation);
    return {
      parameter,
      referenceVector,
      excitationVector,
      referenceNorm: norm(referenceVector),
      excitationNorm: norm(excitationVector),
    };
  });

  const pairs = [];
  for (let i = 0; i < parameters.length; i++) {
    for (let j = i + 1; j < parameters.length; j++) {
      const a = parameters[i], b = parameters[j];
      pairs.push({
        a: a.parameter,
        b: b.parameter,
        referenceAbsCosine: Math.abs(cosine(a.referenceVector, b.referenceVector)),
        excitationAbsCosine: Math.abs(cosine(a.excitationVector, b.excitationVector)),
      });
    }
  }

  const highCollinearity = pairs
    .filter(p => Math.max(p.referenceAbsCosine, p.excitationAbsCosine) >= 0.97)
    .sort(
      (a, b) =>
        Math.max(b.referenceAbsCosine, b.excitationAbsCosine) -
        Math.max(a.referenceAbsCosine, a.excitationAbsCosine),
    );

  const weakReference = parameters
    .filter(p => p.referenceNorm < 0.05)
    .map(p => p.parameter);

  const policyDependent = parameters
    .filter(p => p.referenceNorm < 0.05 && p.excitationNorm >= 0.05)
    .map(p => p.parameter);

  return {
    screenType: "local finite-difference pre-calibration screen",
    perturbationFraction: 0.05,
    years: [...SCREEN_YEARS],
    outputs: [...OBSERVABLE_OUTPUTS],
    parameters,
    highCollinearity,
    weakReference,
    policyDependent,
  };
}

export const CALIBRATION_READINESS = Object.freeze({
  readyNow: Object.freeze([
    {
      item: "fossil carbon flow",
      status: "strong observed target",
      evidence: "Global Carbon Budget 2000-2025",
    },
    {
      item: "clean-capital trajectory shape",
      status: "proxy available",
      evidence: "IRENA renewable capacity 2000-2025",
    },
    {
      item: "fossil-demand activity trajectory",
      status: "proxy available",
      evidence: "Energy Institute fossil-energy consumption 2000-2025",
    },
  ]),
  constrainExternallyBeforeFitting: Object.freeze([
    "capacityLifetimeYears",
    "fossilDemandCapitalLifetimeYears",
    "cleanDepreciationRatePerYr",
  ]),
  doNotEstimateYet: Object.freeze([
    "capacityInvestmentRatePerYr",
    "resourceDevelopmentCostIndex",
    "capabilityLearningRatePerYr",
    "capabilityDecayRatePerYr",
    "institutionalFormationRatePerYr",
    "institutionalErosionRatePerYr",
    "institutionalResistance",
    "policyImplementationDelayYears",
  ]),
  reason:
    "The current canonical dataset lacks direct production-capacity/investment observations and a defensible annual institutional/policy-transmission measure. Estimating those coefficients now would risk compensating-error fits.",
});
