# Stage 16 — residual diagnosis and structural-revision protocol

## Purpose

Stage 15 consumed the 2018–2025 holdout. Stage 16 therefore does **not** fit another model to those years and call it validation.

Instead, it uses the validation residuals diagnostically to ask:

> What observable mechanisms could explain why the frozen model systematically underpredicted the post-2017 decline in fossil dependency?

The goal is to generate a transparent structural-revision agenda suitable for publication.

## New diagnostic variables

These were not used in Stage 14 calibration:

- global renewable electricity generation share;
- global renewable electricity generation in TWh;
- nuclear electricity share;
- derived low-carbon electricity share;
- energy intensity of GDP;
- fossil-energy intensity of GDP.

Renewable generation is conceptually important because installed capacity is not the same as delivered energy. Capacity factors, technology composition and curtailment can change the relationship between installed GW and actual fossil displacement.

## Statistical discipline

The eight validation residuals are a very small, trended sample.

Stage 16 reports:
- residual time trend;
- Pearson association in levels;
- Pearson association in first differences.

These are **descriptive diagnostics only**. They are not causal tests, confidence intervals, or parameter estimates.

## Structural hypotheses

1. **Generation rather than capacity.** Realized renewable generation/share may better represent displacement.
2. **Efficiency and electrification.** Fossil dependency can fall through lower energy intensity, end-use electrification and conversion-efficiency changes.
3. **Fuel/sector heterogeneity.** Coal, oil and gas have different substitution and turnover structures.
4. **Policy/regional heterogeneity.** Aggregate global acceleration can emerge from heterogeneous regional transitions and explicit policies.

A post-2017 dummy or freely fitted structural break is specifically rejected as an ex-post rescue.

## Validation after the holdout is consumed

A revised model cannot reuse 2018–2025 as untouched validation.

For internal structural development, Stage 16 pre-declares blocked rolling-origin folds:

- train 2000–2009 → test 2010–2013;
- train 2000–2013 → test 2014–2017;
- train 2000–2017 → test 2018–2021;
- train 2000–2021 → test 2022–2025.

A publication should still seek a genuinely external validation target, preferably a regional/fuel-sector panel not used for structural selection or future global observations after 2025 when complete.

## Literature grounding

The methodological stance follows calibration-as-testing and partitioned model development in system dynamics, rather than maximizing historical fit after seeing errors.

Contemporary energy evidence also motivates distinguishing installed capacity from realized generation: by 2025 low-emissions generation growth exceeded total electricity-demand growth and global fossil generation declined, while renewable generation had risen substantially as a share of electricity supply.

## Files

- `data/stage16-diagnostic-variables.js`
- `model/residual-diagnosis.js`
- `tests/residual-diagnosis.test.mjs`


## Observed diagnostic result

The frozen Stage 15 residual grows at approximately **+0.0018876 normalized dependency units per year**, and all eight validation residuals are positive.

Descriptive associations with the residual are:

| Diagnostic | Level Pearson r | First-difference Pearson r |
| --- | ---: | ---: |
| Low-carbon electricity share | **0.961** | **0.872** |
| Renewable electricity share | **0.939** | **0.713** |
| Renewable-capacity intensity | **0.926** | **0.583** |
| Renewable generation TWh | **0.909** | 0.261 |
| Energy intensity of GDP | -0.881 | 0.234 |
| Fossil-energy intensity of GDP | -0.910 | -0.354 |
| Nuclear electricity share | -0.763 | 0.277 |

These values are not causal tests. The stronger first-difference association for realized low-carbon/renewable electricity share than for the existing capacity-intensity proxy makes **measurement-model revision from installed capacity toward realized generation/share** the first candidate for Stage 17.

The energy-intensity relationships are strong in levels but weak in first differences, so efficiency/electrification remains a plausible mechanism requiring direct data rather than an inference from the common trend.
