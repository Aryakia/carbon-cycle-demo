# Stage 15 — held-out validation of the frozen fossil-dependency partition

Stage 14 was merged before this stage was created. The selected hypothesis and parameters are read only from `data/stage14-dependency-fit.js`.

No parameter, normalization year, hypothesis, or equation is changed after inspecting 2018–2025.

## Primary validation
The frozen Stage 14 model is propagated from the fitted 2017 state through 2018–2025 using the observed clean-competition driver required by the pre-specified measurement model.

Metrics reported:
- RMSE;
- MAE;
- mean signed error (bias);
- skill relative to a 2017 persistence benchmark.

## Pre-specified benchmarks
Stage 15 also evaluates models defined before the holdout was opened:
- persistence;
- the training-selected static clean-competition model;
- the training-selected 15–35 year turnover-constrained model.

These are benchmarks, not opportunities for re-selection or retuning.

## Shock sensitivity
Because 2020 was identified as an exogenous COVID disturbance before validation, metrics are also reported with 2020 omitted. No model is refitted in this sensitivity check.

The full eight-year holdout remains the primary result.
