# Stage 13 — historical driver and calibration-objective scaffold

## Status

Stage 13 has **started**, but parameter optimization has not started.

That is intentional. Stage 12 showed that several behavioral coefficients are locally weak or confounded under the current measurement set.

## Historical driver layer

`model/historical-drivers.js` provides:

- annual observed values for 2000–2025;
- linear interpolation for sub-annual simulation time steps;
- a frozen training/validation split;
- explicit metadata for major exogenous shock windows.

Current split:

- training: **2000–2017** (18 annual observations);
- validation: **2018–2025** (8 annual observations).

Shock metadata currently identifies:

- 2008–2009 global financial crisis;
- 2020 COVID-19 disruption.

Shock years are **not automatically removed or down-weighted**. Any treatment must be explicit in a calibration run.

## Multi-objective calibration scaffold

`model/calibration-objective.js` defines the first upstream calibration objective:

| Target | Default weight | Rationale |
| --- | ---: | --- |
| Fossil-to-atmosphere flow | 0.50 | strongest direct target |
| Clean-capital proxy trajectory | 0.25 | physical renewable-capacity stock proxy |
| Fossil-demand activity proxy | 0.25 | demand-side activity proxy |
| Atmospheric CO2 | 0.00 | diagnostic only; carbon-cycle component already calibrated separately |

This prevents **double calibration** of the atmospheric carbon cycle while fitting upstream behavioral parameters.

## Why atmospheric CO2 has zero fitting weight

The carbon-cycle lifetime scale and initial box state were already calibrated against atmospheric CO2.

If atmospheric ppm were given substantial weight again during upstream calibration, the optimizer could trade upstream behavioral errors against a component that has already been fitted, making interpretation harder.

Atmospheric ppm remains an important diagnostic and validation output.

## Leakage rule

After the split is frozen:

> 2018–2025 validation observations must not be used to select behavioral parameters, calibration priors, objective weights, or model revisions that are justified solely by better validation fit.

If model structure changes after reviewing held-out performance, the validation period is no longer a pristine holdout and the research record must say so.

## What Stage 13 still needs

Before actual optimization:

1. a historical/backcast version of the upstream engine beginning in 2000;
2. initialization of latent stocks at 2000;
3. time-varying exogenous driver inputs;
4. a decision on which externally constrained parameters remain fixed;
5. at least one additional observation/proxy for fossil production-capacity or investment dynamics.

Until those exist, an optimizer would be technically possible but scientifically premature.
