# Primary empirical results registry

This document is the concise publication-facing index of the frozen empirical results.

It is a navigation layer, not the computational source of truth. Every value below must remain reproducible from the referenced frozen result module and its deterministic test.

## Claim ladder

| Stage | Question | Result | Scientific status |
| --- | --- | --- | --- |
| 14 | Can the reduced clean-competition hypothesis fit 2000–2017 global fossil dependency? | Yes; effective short-lag renewable-capacity-intensity candidate improves RMSE 52.67% vs persistence | training result only |
| 15 | Does the frozen Stage 14 model generalize to 2018–2025? | Partly; +18.02% skill vs persistence, but static candidate is better and all residuals are positive | genuine temporal holdout, now consumed |
| 16 | What systematic structure is missing? | Residual changes associate most strongly with low-carbon electricity share among tested indicators | diagnostic association only |
| 17 | Which revised observable/structure performs best under rolling-origin comparison? | static low-carbon electricity share; pooled RMSE 0.00282569, +65.08% skill vs persistence | internal post-validation structural comparison |
| 18 | Does the Stage 17 ranking transfer across heterogeneous national systems? | static low-carbon electricity share ranks first; pooled RMSE 0.01492945, +29.997% skill vs persistence | spatial/target-domain transfer |
| 19 | Is Stage 18 driven by one country? | no; primary model stays rank 1 under all eight leave-one-country-out aggregations | secondary robustness |

## Stage 14 — training-only reduced model

Source: `data/stage14-dependency-fit.js`

- training: 2000–2017;
- selected training driver: renewable-capacity intensity;
- beta: 0.016;
- effective tau: 3.0 years;
- RMSE: 0.0022803711;
- persistence RMSE: 0.0048184741;
- improvement: 52.67%;
- 5% near-optimal beta: 0.015–0.018;
- 5% near-optimal tau: 2.5–4.5 years.

Interpretation: a short effective delay is supported on training data, but the fossil-share proxy should not be interpreted as a measured 15–35 year physical capital stock.

## Stage 15 — first frozen holdout

Source: `data/stage15-dependency-validation.js`

- validation: 2018–2025;
- frozen dynamic RMSE: 0.01372994;
- persistence RMSE: 0.01674750;
- skill: +18.02%;
- static training-selected model RMSE: 0.01074925;
- all frozen dynamic residuals are positive;
- excluding 2020 does not remove the systematic error.

Interpretation: the original hypothesis has some predictive information, but its lag structure and measurement variable are incomplete.

This is the only pristine temporal holdout for the Stage 14 structure.

## Stage 16 — residual diagnosis

Source: `data/stage16-residual-diagnosis.js`

First-difference residual associations:

- low-carbon electricity share: r = 0.8723;
- renewable electricity share: r = 0.7130;
- renewable-capacity intensity: r = 0.5827.

Interpretation: this prioritized a new measurement hypothesis. It is not causal evidence because the holdout had already been consumed and n is small.

## Stage 17 — global rolling-origin structural comparison

Source: `data/stage17-rolling-origin-result.js`

Selected candidate:

- driver: low-carbon electricity share;
- structure: static;
- pooled test RMSE: 0.0028256880;
- skill versus persistence: +65.08%;
- improvement versus static renewable-capacity intensity: 52.02%.

Static beta by fold:

- 0.053;
- 0.079;
- 0.146;
- 0.158.

Interpretation: realized low-carbon electricity share is strongly preferred internally, but a single invariant beta is not supported.

## Stage 18 — spatial transfer

Source: `data/stage18-spatial-transfer-result.js`

Pre-declared countries:

USA, China, India, Germany, Brazil, Japan, South Africa, Australia.

Primary selected candidate:

- driver: low-carbon electricity share;
- structure: static;
- pooled test observations: 128;
- RMSE: 0.0149294454;
- MAE: 0.0089543677;
- bias: −0.0002241318;
- persistence RMSE: 0.0213268970;
- skill versus persistence: +29.997%;
- positive country-level skill: 6/8.

Candidate ranking by pooled RMSE:

1. low-carbon share / static — 0.01492945;
2. low-carbon share / dynamic — 0.01837696;
3. renewable capacity per capita / static — 0.02165082;
4. renewable capacity per capita / dynamic — 0.02179825;
5. renewable electricity share / static — 0.02219053;
6. renewable electricity share / dynamic — 0.02306967.

Country-level skill for selected candidate:

- Japan: +62.89%;
- China: +62.56%;
- Australia: +53.66%;
- India: +21.20%;
- Germany: +10.65%;
- South Africa: +8.45%;
- Brazil: 0%;
- United States: −0.69%.

Parameter boundary:

- beta range: 0–0.25;
- Brazil: beta = 0 in all four folds;
- upper-bound beta = 0.25 in three fits.

Interpretation: **observable ranking transfers more clearly than coefficient values**.

## Stage 19 — influence robustness

Source: `data/stage19-influence-result.js`

Static low-carbon electricity share remains rank 1 after omitting:

- USA;
- China;
- India;
- Germany;
- Brazil;
- Japan;
- South Africa;
- Australia.

Leave-one-out selected-model skill versus persistence ranges from:

- minimum: +9.73% when Japan is omitted;
- maximum: +47.33% when Brazil is omitted.

The model also ranks first using equal-country mean RMSE.

Interpretation: Stage 18 is not explained by one influential country, although Japan contributes materially to the magnitude of pooled skill.

## Main publication proposition

The strongest current proposition is:

> Across staged global calibration, genuine temporal holdout testing, rolling-origin structural comparison, and an eight-country spatial transfer test, **realized low-carbon electricity share** is a more robust observable of changes in fossil dependency than the tested installed-renewable-capacity and renewable-only generation measures. The evidence supports transfer of the measurement/structural relationship, but not a universal elasticity or causal effect.

## What the evidence does not establish

The current project does not establish:

- causal substitution effects;
- a universal beta;
- a universal adjustment time;
- validation of the full upstream System Dynamics model;
- statistically independent external validation;
- country-specific policy effect sizes;
- future forecast accuracy.

## Next evidentiary upgrades

1. hierarchical uncertainty model for country/fold beta heterogeneity;
2. fuel/sector disaggregation to identify where the relationship does and does not transfer;
3. genuinely independent external validation data;
4. manuscript-grade figures generated from frozen modules;
5. archived tagged release with DOI before submission.
