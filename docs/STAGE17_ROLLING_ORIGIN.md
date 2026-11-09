# Stage 17 — blocked rolling-origin structural comparison

## Purpose

Stage 15 consumed the original 2018–2025 holdout. Stage 17 therefore does not pretend to create another pristine holdout from the same global time series.

Instead, it uses a pre-declared blocked rolling-origin design for **internal structural comparison**.

## Folds

1. train 2000–2009 → test 2010–2013
2. train 2000–2013 → test 2014–2017
3. train 2000–2017 → test 2018–2021
4. train 2000–2021 → test 2022–2025

Each fold normalizes both target and driver to that fold's training endpoint. Test values never enter fold-specific parameter fitting.

## Measurement hypotheses

The comparison is deliberately narrow and follows Stage 16 diagnostics:

1. renewable-capacity intensity;
2. renewable electricity generation share;
3. low-carbon electricity generation share (renewables + nuclear).

Each measurement hypothesis is tested under:

- a static clean-competition response;
- a dynamic first-order response with an effective adjustment time.

## Parameter grids

### Numerical boundary check

The first Stage 17 run used the Stage 14 beta ceiling of 0.08. The low-carbon static hypothesis reached that ceiling in later training folds. Because a search-boundary optimum is not interpretable as an estimate, the beta ceiling was expanded to 0.25 **without changing the folds, candidate drivers, target variable, or selection criterion**. This is a numerical-boundary resolution step inside the already-consumed internal development dataset, not a new external validation claim.



- beta: 0.000–0.250, step 0.001
- dynamic tau: 0.5–10 years, step 0.5

These are effective aggregate response parameters, not physical asset lifetimes.

## Selection

Candidates are ranked by pooled RMSE across the 16 test observations from the four temporal folds.

A 2017 persistence model is replaced by a fold-specific persistence benchmark: dependency remains at the fold training-end normalized value of 1 throughout that fold's test period.

## Scientific boundary

This is internal structural model development. It is not external validation.

Whichever structure wins Stage 17 must still be tested against a separate regional/fuel-sector dataset or future observations not used for structural selection.


## Observed rolling-origin result

After expanding the beta grid to resolve boundary optima, the six candidates rank:

| Rank | Measurement | Structure | Pooled test RMSE |
| ---: | --- | --- | ---: |
| 1 | **Low-carbon electricity share** | **static** | **0.00282569** |
| 2 | Low-carbon electricity share | dynamic | 0.00307970 |
| 3 | Renewable electricity share | static | 0.00588453 |
| 4 | Renewable-capacity intensity | static | 0.00588956 |
| 5 | Renewable-capacity intensity | dynamic | 0.00775067 |
| 6 | Renewable electricity share | dynamic | 0.00789748 |
| — | Persistence | — | 0.00809215 |

The selected model reduces pooled RMSE by **65.08% versus persistence** and by **52.02% versus the static renewable-capacity-intensity model**.

### Fold performance of the selected structure

- 2010–2013 test RMSE: **0.00241437**, beta = **0.053**
- 2014–2017: **0.00388372**, beta = **0.079**
- 2018–2021: **0.00086397**, beta = **0.146**
- 2022–2025: **0.00320612**, beta = **0.158**

### Structural interpretation

Realized low-carbon electricity share is a materially stronger measurement variable than installed renewable-capacity intensity.

However, beta rises across successive folds. The measurement relationship is therefore useful for prediction but cannot yet be interpreted as a stable universal elasticity.

The low-carbon dynamic model ranks second. Its fitted tau is at the 0.5-year lower bound in the first three folds, providing additional evidence that a separate global lag is not robustly identified.

The Stage 17 result is frozen in `data/stage17-rolling-origin-result.js` and deterministically reproduced by CI.
