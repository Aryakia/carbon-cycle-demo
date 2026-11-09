# Stage 19 — country influence and heterogeneity robustness

## Status

Secondary analysis performed **after** the Stage 18 primary result was frozen.

Stage 19 cannot modify the Stage 18 panel, folds, candidate set, fitted country-fold parameters, primary metric or claim boundary.

## Purpose

The Stage 18 pooled result could in principle be dominated by one structurally unusual country.

Two cases are especially important to inspect:

- Japan, because the 2011 Fukushima shock sharply changed nuclear generation;
- Brazil, because hydroelectricity gives the country a persistently high low-carbon electricity share and relatively limited within-series variation in the candidate driver.

The robustness question is:

> If any one country is removed from aggregation, does the Stage 18 selected measurement/structure remain rank 1?

## Method

For each of the eight countries:

1. take the **already fitted** Stage 18 out-of-fold predictions;
2. remove that country's 16 test observations from every candidate;
3. recompute pooled RMSE and the six-candidate ranking;
4. do not refit beta or tau.

This is an influence analysis, not another model-selection exercise.

## Additional summaries

Stage 19 also reports:

- ranking by equal-country mean RMSE;
- country-level skill versus persistence;
- beta range and boundary counts for the frozen selected model.

## Primary robustness rule

Static low-carbon electricity share is deemed influence-robust if it remains rank 1 after omission of each individual country.

## Claim boundary

This is secondary robustness analysis only.

It cannot convert the nested country panel into independent external validation, and it cannot establish causality or a universal coefficient.


## Frozen robustness result

The Stage 18 primary ranking is **influence-robust** under the pre-declared criterion.

Static low-carbon electricity share remains **rank 1 after omission of every individual country**.

Leave-one-country-out skill versus persistence:

- omit United States: **30.75%**;
- omit China: **28.61%**;
- omit India: **30.08%**;
- omit Germany: **32.74%**;
- omit Brazil: **47.33%**;
- omit Japan: **9.73%**;
- omit South Africa: **30.10%**;
- omit Australia: **29.35%**.

Removing Japan produces the smallest remaining skill, showing that Japan is influential, but the primary ranking still survives.

The equal-country mean-RMSE ranking also selects static low-carbon electricity share first:

1. static low-carbon share — mean-country RMSE **0.01157484**;
2. dynamic low-carbon share — **0.01478155**;
3. static renewable electricity share — **0.01626888**;
4. static renewable capacity per capita — **0.01651599**;
5. dynamic renewable capacity per capita — **0.01662381**;
6. dynamic renewable electricity share — **0.01763735**.

The selected beta distribution remains highly heterogeneous:

- minimum: **0**;
- maximum: **0.25**;
- mean: **0.08347**;
- 25 unique values among 32 fits;
- four lower-bound fits;
- three upper-bound fits.

This strengthens the paper's structural claim while reinforcing the parameter-transfer limitation.

Frozen result: `data/stage19-influence-result.js`.
