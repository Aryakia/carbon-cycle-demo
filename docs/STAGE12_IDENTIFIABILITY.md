# Stage 12 — pre-calibration identifiability screen

## Purpose

Stage 12 does **not** calibrate the behavioral model.

It asks a prior question:

> With the observations currently available, which behavioral parameters produce distinguishable effects in the measured outputs, and which parameters are likely to be weakly informed or confounded?

Estimating weakly identified parameters can produce excellent numerical fits for the wrong reasons.

## Screen design

The initial screen is a local finite-difference sensitivity analysis around:

1. the neutral Structural reference; and
2. a standardized diagnostic policy excitation.

Each candidate parameter is perturbed ±5%.

Observable-compatible outputs:

- fossil-to-atmosphere carbon flow;
- fossil-demand capital (compared only through a demand-activity proxy);
- clean capital (compared only through renewable-capacity proxy shape);
- atmospheric CO2.

Sampling years:

- 2030;
- 2040;
- 2050.

The screen uses dimensionless relative sensitivities and pairwise absolute cosine similarity. Parameter pairs with similarity ≥ 0.97 are flagged as locally near-collinear.

## Important boundary

This is **not formal structural identifiability proof** and it is not yet historical parameter estimation.

The current engine begins in 2025. A true empirical identifiability analysis must be repeated after the historical driver/backcast layer is implemented.

The present screen is useful for avoiding obviously premature fitting.

## Calibration-readiness decision

### Strong observed target now

- fossil carbon flow: Global Carbon Budget.

### Proxy constraints now

- clean-capital trajectory shape: IRENA renewable capacity;
- fossil-demand activity: Energy Institute fossil-energy consumption.

### Constrain externally before fitting

Initial engineering/literature priors should be developed for:

- fossil production-capacity lifetime;
- fossil-demand-capital lifetime;
- clean-capital depreciation.

### Do not estimate yet

Until direct capacity/investment/policy-history evidence is added, the first calibration should **not** freely estimate:

- capacity investment response;
- resource-development cost response;
- capability learning and decay;
- institutional formation and erosion;
- institutional resistance;
- policy implementation delay.

Those parameters can otherwise compensate for one another while matching the same fossil-flow history.

## Next requirement

Before Stage 13 calibration, add:

1. a fossil production-capacity or defensible production-stock proxy;
2. exact clean/fossil investment history where licensing/access permits;
3. a time-varying historical driver layer for GDP/energy-service demand and policy shocks;
4. explicit treatment of the 2008–2009 financial crisis and 2020 COVID shock as exogenous disturbances where appropriate.


## Current screen result

The automated Stage 12 screen currently finds:

- **9 of 12** screened behavioral parameters are weakly expressed in the neutral Structural reference at the chosen observable-compatible outputs;
- **4 parameters** become materially visible only under the standardized policy excitation: fossil-demand-capital lifetime, clean learning, institutional resistance, and policy implementation delay;
- the strongest neutral-reference sensitivity is clean-capital depreciation;
- production-capacity lifetime and capacity-investment rate are locally almost perfectly collinear;
- capability learning/decay and institutional formation/erosion form several near-collinear pairs.

These results reinforce the measurement-gap decision: adding more free parameters to an optimizer now would increase compensating-error risk rather than scientific information.

## Literature-constrained priors

Stage 12 also adds broad external plausibility priors for:

- aggregate fossil production-capacity lifetime: 20–40 years;
- fossil-dependent demand-capital lifetime: 15–35 years;
- clean-capital depreciation: equivalent to a 20–30 year lifetime.

These are intentionally broad because the model stocks aggregate heterogeneous infrastructure. They are not treated as universal observed lifetimes.

The carbon-cycle lifetime scale and current fossil-flow anchor are excluded from upstream calibration because they have already been separately calibrated/anchored.
