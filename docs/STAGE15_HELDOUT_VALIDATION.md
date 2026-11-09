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


## Observed holdout result

The frozen Stage 14 model was evaluated with no retuning.

### Primary frozen dynamic model
- RMSE: **0.01372994**
- MAE: **0.01286099**
- mean signed error: **+0.01286099**
- skill versus 2017 persistence by RMSE: **18.02%**

Every annual error from 2018 through 2025 is positive. The model systematically overpredicts fossil dependency and therefore underpredicts the observed post-2017 decline.

### Pre-specified benchmarks

| Model | Holdout RMSE | Interpretation |
| --- | ---: | --- |
| Training-selected static clean competition | **0.01074925** | best pre-specified benchmark |
| Frozen Stage 14 dynamic model | **0.01372994** | positive skill vs persistence, but worse than static |
| Persistence | **0.01674750** | null benchmark |
| Training-selected 15–35 year turnover model | **0.02012598** | worse than persistence |

The clean-competition signal has predictive value, but the specific three-year lag is not the most robust out-of-sample structure.

### COVID sensitivity
Excluding 2020 without refitting:
- frozen dynamic RMSE: **0.01366871**
- persistence RMSE: **0.01707842**

The discrepancy is therefore not explained by the COVID year alone.

## Scientific consequence

Stage 14 remains frozen and is not retroactively retuned. The 2018–2025 holdout is now **consumed**. It can inform structural diagnosis, but a revised model requires a new validation design.
