# Manuscript blueprint — Carbon Beyond the Bathtub empirical paper

## Working title

**From installed capacity to realized low-carbon electricity: testing observable drivers of fossil dependency in a system dynamics transition model**

Alternative title:

**What observable best explains declining fossil dependence? A staged calibration and transfer test in a system dynamics energy-transition model**

## Core contribution

This paper is not positioned as a forecast of global energy demand or atmospheric CO2.

The proposed contribution is methodological and empirical:

1. construct an explicitly measured global fossil-dependency outcome;
2. separate aggregate energy-system scale from fossil dependency;
3. test competing observable representations of clean competition;
4. enforce training/holdout discipline before structural revision;
5. diagnose failed out-of-sample behavior rather than retuning the original model;
6. compare revised structures with rolling-origin evaluation;
7. test whether the selected observable relationship transfers across heterogeneous national energy systems.

The central scientific question is:

> Is realized low-carbon electricity share a more transferable observable of fossil-dependency change than installed renewable capacity or renewable generation alone?

## Research questions

### RQ1 — historical dynamic hypothesis

Can a low-dimensional clean-competition relationship reproduce changes in global fossil dependency without fitting the full upstream model?

### RQ2 — lag structure

Does the observed global fossil-dependency trajectory support a separately identifiable multi-year adjustment delay?

### RQ3 — genuine temporal validation

Does the training-selected 2000–2017 structure generalize to 2018–2025 without retuning?

### RQ4 — structural diagnosis

When the frozen model fails systematically, which observable variables are most associated with the unexplained change?

### RQ5 — internal structural comparison

Across blocked rolling-origin folds, which measurement variable and structural form generalizes best?

### RQ6 — spatial transfer

Does the Stage 17 observable ranking transfer across a pre-declared panel of structurally different national energy systems?

## Dynamic hypothesis

The empirical reduced model focuses on a narrow causal proposition:

- expansion of low-carbon electricity changes the competitive environment for fossil-dependent energy use;
- fossil dependency is distinct from total energy-system scale;
- installed capacity may be a weaker behavioral measure than realized generation because capacity does not directly encode utilization, curtailment, dispatch, nuclear generation, or the actual electricity mix;
- an aggregate lag should only be retained if it improves out-of-sample behavior and is identified away from its parameter boundary.

This reduced hypothesis is intentionally narrower than the full public model's capability, institutional, investment, and resource feedback structure.

## Data architecture

### Global development series, 2000–2025

- fossil energy consumption — Energy Institute via Our World in Data;
- total primary-energy supply — Energy Institute via Our World in Data;
- renewable capacity — IRENA via Our World in Data;
- renewable electricity share — Ember and other sources via Our World in Data;
- nuclear electricity share — Ember / Energy Institute and other sources via Our World in Data;
- fossil CO2 and atmospheric CO2 — Global Carbon Project;
- real GDP — World Bank, diagnostic only.

### Spatial transfer panel, 2000–2024

Pre-declared cases:

- United States;
- China;
- India;
- Germany;
- Brazil;
- Japan;
- South Africa;
- Australia.

The panel is selected for structural diversity, not model performance.

## Outcome definition

For country or global system (i):

[
F_i(t)=rac{	ext{fossil energy consumption}_i(t)}
{	ext{total primary-energy supply}_i(t)}
]

Within a calibration fold, dependency is normalized to the final training year (t_0):

[
D_i(t)=rac{F_i(t)}{F_i(t_0)}
]

This decomposition prevents absolute energy-system growth from being counted as fossil dependency.

## Candidate clean-competition observables

1. installed renewable capacity measure;
2. renewable electricity generation share;
3. low-carbon electricity share = renewable + nuclear electricity generation share.

All driver indices are normalized to the corresponding training endpoint.

## Reduced model forms

### Static form

[
hat D(t)=X(t)^{-eta}
]

### Dynamic form

[
rac{dD}{dt}=rac{X(t)^{-eta}-D}{	au}
]

where:

- (X(t)) is the normalized candidate clean-competition observable;
- (eta) is an estimated response elasticity;
- (	au) is an effective aggregate adjustment time, not automatically interpreted as a physical asset lifetime.

## Evaluation sequence

### Stage 14

Training-only model partition calibration, 2000–2017.

### Stage 15

Frozen 2018–2025 holdout evaluation with no retuning.

### Stage 16

Post-validation residual diagnosis. The consumed holdout is explicitly not reused as pristine validation.

### Stage 17

Four-fold blocked rolling-origin structural comparison.

### Stage 18

Pre-declared eight-country spatial/target-domain transfer test.

## Current established results before Stage 18

Stage 14:
- selected driver: renewable-capacity intensity;
- beta = 0.016;
- effective tau = 3.0 years;
- training RMSE = 0.00228037;
- 52.67% improvement versus persistence.

Stage 15:
- frozen dynamic holdout RMSE = 0.01372994;
- 18.02% improvement versus persistence;
- static training-selected model performs better than the dynamic model;
- all frozen residuals are positive.

Stage 16:
- low-carbon electricity share has the strongest first-difference association with residuals among tested variables;
- this association is diagnostic, not causal evidence.

Stage 17:
- selected internal rolling-origin structure: static low-carbon electricity share;
- pooled RMSE = 0.00282569;
- skill versus persistence = 65.08%;
- 52.02% RMSE improvement versus static renewable-capacity intensity;
- fold-specific beta values are unstable, so no universal elasticity is claimed.

Stage 18 frozen result:

- selected measurement/structure: **static low-carbon electricity share**;
- pooled out-of-fold RMSE: **0.01492945**;
- persistence RMSE: **0.02132690**;
- skill versus persistence: **29.997%**;
- positive skill in **6 of 8** countries;
- beta spans **0–0.25**, including both lower- and upper-bound fits.

Interpretation: the observable ranking transfers more clearly than the fitted coefficient. The result supports cross-system usefulness of realized low-carbon electricity share in this reduced relationship, while rejecting a universal elasticity claim.

## Planned figures

### Figure 1 — conceptual architecture
A compact stock-flow / causal diagram showing the separation between total energy activity and fossil dependency, plus the competing clean-competition measurement variables.

### Figure 2 — global empirical reference modes
2000–2025 fossil dependency, renewable-capacity intensity, renewable electricity share, and low-carbon electricity share.

### Figure 3 — Stage 14 calibration and Stage 15 holdout
Observed versus fitted fossil dependency, with training and held-out periods visually separated.

### Figure 4 — residual diagnosis
Post-2017 residual trajectory and candidate structural indicators.

### Figure 5 — rolling-origin structural comparison
Pooled and fold-level RMSE for all six Stage 17 candidates.

### Figure 6 — Stage 18 spatial transfer
Country-by-country skill or RMSE relative to persistence for the three measurement hypotheses.

### Figure 7 — parameter-transfer diagnostics
Distribution of country/fold beta values and, where applicable, effective tau estimates.

## Planned tables

### Table 1 — variable definitions and sources
Outcome, drivers, units, transformations, source provider, processor, period.

### Table 2 — staged model-testing protocol
Stage, data accessible at that stage, model choice allowed, frozen decision, subsequent use.

### Table 3 — Stage 14–17 results
Training fit, holdout performance, diagnostic findings, rolling-origin ranking.

### Table 4 — spatial-transfer results
Country, driver, structural form, pooled RMSE, skill versus persistence, fitted-parameter range.

## Claims supported by the frozen Stage 18 primary test

- realized low-carbon electricity share is the best-performing pre-declared measurement variable for fossil-dependency change in both the Stage 17 global rolling-origin comparison and the Stage 18 eight-country transfer test;
- static low-carbon share improves Stage 18 pooled RMSE by about **30%** versus persistence and ranks ahead of all renewable-capacity and renewable-share alternatives;
- the relationship is heterogeneous: six countries show positive skill, Brazil collapses to persistence, and the United States is approximately neutral/slightly negative;
- the fitted beta is not transferable as a universal physical parameter;
- a distinct global multi-year lag is not consistently identified;
- structural conclusions change materially when true holdout testing and post-validation structural diagnosis are enforced.

## Claims explicitly excluded

- causal effect of low-carbon electricity on fossil consumption;
- universal elasticity across countries or time;
- forecast accuracy beyond the observed period;
- full validation of the complete upstream system dynamics model;
- statistically independent external validation of Stage 18, because panel countries contribute to the global aggregate used earlier.

## Candidate journal positioning

### System Dynamics Review
Best fit if the paper emphasizes calibration as dynamic-hypothesis testing, structural diagnosis, parameter identifiability and reproducible workflow.

### Energy Research & Social Science
Potential fit only if the model is expanded to connect the empirical result to transition mechanisms, institutions, and policy interpretation.

### Energy Policy
Potential fit if the analysis is extended from measurement/model structure to concrete policy implications and sectoral transition pathways.

### Journal of Simulation
Potential fit if the methodological emphasis is on calibration/validation design, structural comparison and reproducible simulation practice.

The present evidence most naturally supports a **System Dynamics Review / Journal of Simulation** framing.

## Publication decision after Stage 18

The primary Stage 18 result is frozen and positive at the pooled level, with important country heterogeneity.

Next publication steps:

1. retain Stage 18 unchanged as the primary transfer result;
2. run clearly labeled **secondary influence/robustness analyses** without redefining the primary endpoint;
3. test whether the Stage 18 ranking remains first under leave-one-country-out aggregation and alternative equal-country summaries;
4. quantify parameter heterogeneity rather than pooling beta into a universal coefficient;
5. generate manuscript-grade tables and figures directly from frozen result modules;
6. seek a genuinely independent future/regional/sectoral validation target before claiming external validation.
