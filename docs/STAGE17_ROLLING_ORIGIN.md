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

- beta: 0.000–0.080, step 0.001
- dynamic tau: 0.5–10 years, step 0.5

These are effective aggregate response parameters, not physical asset lifetimes.

## Selection

Candidates are ranked by pooled RMSE across the 16 test observations from the four temporal folds.

A 2017 persistence model is replaced by a fold-specific persistence benchmark: dependency remains at the fold training-end normalized value of 1 throughout that fold's test period.

## Scientific boundary

This is internal structural model development. It is not external validation.

Whichever structure wins Stage 17 must still be tested against a separate regional/fuel-sector dataset or future observations not used for structural selection.
