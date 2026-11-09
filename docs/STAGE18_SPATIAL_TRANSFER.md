# Stage 18 — pre-declared spatial transfer test

## Research question

After the global time-series development in Stages 14–17, does the **measurement-variable ranking** transfer across heterogeneous national energy systems?

The primary question is not whether one universal elasticity exists. Stage 17 already showed substantial temporal instability in the global beta. The transferable claim being tested is narrower:

> Does realized low-carbon electricity share provide a more robust observable relationship with fossil dependency than renewable electricity share or an installed-capacity measure?

## Pre-declared panel

The panel is fixed before scoring:

- United States;
- China;
- India;
- Germany;
- Brazil;
- Japan;
- South Africa;
- Australia.

The cases deliberately span mature and rapidly growing systems, coal-dominant systems, a hydro-dominant system, nuclear phaseout/disruption, and rapid renewable deployment.

No country is added or removed based on performance.

## Variables

Outcome:

```text
fossil dependency = fossil energy consumption / total primary-energy supply
```

Within each fold, the outcome is normalized to the final training year.

Competing drivers:

1. installed renewable capacity per person;
2. renewable electricity share;
3. low-carbon electricity share = renewable + nuclear generation share.

All drivers are normalized to the final year of the corresponding training fold.

## Structural forms

For each observable:

- static power-law relationship;
- first-order dynamic adjustment relationship.

Each country-fold estimates its own beta, and dynamic forms estimate their own effective tau. This explicitly avoids treating the Stage 17 global beta as universal.

## Evaluation design

Four blocked rolling-origin folds:

| Fold | Training | Test |
| --- | --- | --- |
| 1 | 2000–2008 | 2009–2012 |
| 2 | 2000–2012 | 2013–2016 |
| 3 | 2000–2016 | 2017–2020 |
| 4 | 2000–2020 | 2021–2024 |

Every country therefore contributes 16 out-of-fold observations, for 128 pooled test observations.

Selection criterion: pooled out-of-fold RMSE, with mean-country RMSE used as a secondary ranking criterion.

Persistence is the explicit benchmark.

## Claim boundary

This is a **spatial/target-domain transfer test**, not statistically independent external validation. These countries contribute to the global aggregate used during earlier structural development.

A positive result can support the proposition that an observable relationship transfers across heterogeneous national systems. It cannot establish:

- a universal elasticity;
- causal identification;
- a statistically independent external validation;
- country-specific policy effect sizes.

## Publication workflow

The calibration/testing philosophy follows Oliva (2003): calibration is used as a test of a dynamic hypothesis rather than simply a curve-fitting exercise.

The workflow also follows the reproducibility logic emphasized by Andrade & Duggan (2021): unknown parameters are kept low-dimensional, priors/parameter bounds and data transformations are explicit, and results are generated deterministically from versioned code/data.

References:

- Oliva, R. (2003). *Model calibration as a testing strategy for system dynamics models*. European Journal of Operational Research, 151(3), 552–568. DOI: 10.1016/S0377-2217(02)00622-7.
- Andrade, J., & Duggan, J. (2021). *A Bayesian approach to calibrate system dynamics models using Hamiltonian Monte Carlo*. System Dynamics Review, 37(4), 283–309. DOI: 10.1002/sdr.1693.
- Parra, J. F., Jaramillo, P., & Arango-Aramburo, S. (2018). *Metaheuristic optimization methods for calibration of system dynamics models*. Journal of Simulation, 12(2), 190–209. DOI: 10.1080/17477778.2018.1467850.


## Frozen primary result

The pre-declared Stage 18 protocol selected **static low-carbon electricity share**.

Primary pooled out-of-fold results across 128 country-year test observations:

- pooled RMSE: **0.01492945**;
- pooled MAE: **0.00895437**;
- pooled bias: **−0.000224**;
- persistence RMSE: **0.02132690**;
- skill versus persistence: **29.997%**.

Candidate ranking:

1. static low-carbon electricity share — RMSE **0.01492945**;
2. dynamic low-carbon electricity share — **0.01837696**;
3. static renewable capacity per capita — **0.02165082**;
4. dynamic renewable capacity per capita — **0.02179825**;
5. static renewable electricity share — **0.02219053**;
6. dynamic renewable electricity share — **0.02306967**.

Only the two low-carbon-electricity formulations improve pooled RMSE relative to persistence.

### Country heterogeneity

The selected static low-carbon formulation improves RMSE versus persistence in **6 of 8** countries.

Strongest positive skill:

- Japan: **62.89%**;
- China: **62.56%**;
- Australia: **53.66%**;
- India: **21.20%**.

More modest positive skill:

- Germany: **10.65%**;
- South Africa: **8.45%**.

Exceptions:

- Brazil: **0%** skill; beta collapses to zero in all four folds, so the fitted relationship reduces to persistence.
- United States: **−0.69%** skill; essentially no improvement over persistence.

### Parameter-transfer boundary

Across the 32 selected country-fold fits, beta spans the full search interval **0–0.25**.

- beta = 0 in all four Brazil folds;
- beta = 0.25 at the upper boundary in the first two US folds and first Germany fold.

Therefore the transferable result is **the measurement-variable ranking**, not one common elasticity.

The result supports the proposition that realized low-carbon electricity share is a more useful observable for this reduced fossil-dependency relationship across the tested heterogeneous systems than the two pre-declared alternatives. It does **not** establish a country-invariant coefficient, causal effect, or statistically independent external validation.

The frozen numerical record is in `data/stage18-spatial-transfer-result.js`.
