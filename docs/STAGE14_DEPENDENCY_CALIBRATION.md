# Stage 14 — modular historical calibration I: fossil dependency

## Publication purpose

Stage 14 begins **actual historical parameter estimation**, but only for a deliberately small, observable model partition.

This follows the calibration-as-testing logic in system dynamics:

- Oliva (2003) argues that calibration is useful as a stringent test of the hypothesized link between structure and behavior, rather than merely a curve-fitting exercise. DOI: **10.1016/S0377-2217(02)00622-7**.
- Oliva (2004) explicitly motivates model partitioning and partial calibration to maximize empirical test points and build model confidence incrementally. DOI: **10.1002/sdr.298**.
- Raue et al. (2009) show why partially observed dynamic models require explicit practical-identifiability analysis and demonstrate profile-based diagnostics. DOI: **10.1093/bioinformatics/btp358**.

The repository therefore does **not** fit the complete upstream model at once.

## Structural correction before calibration

Stage 13A separated:

```text
aggregate energy activity × fossil dependency
```

but the full model still allowed aggregate energy activity to enter the *desired fossil-dependency stock*.

That would count energy-system growth twice:

1. once when setting desired fossil dependency; and
2. again when converting fossil dependency into realized fossil demand.

Stage 14 corrects the equation.

### Realized fossil-demand signal

```text
Fossil demand signal
= Energy activity
× Expected-future-demand multiplier
× Fossil-dependent capital
```

### Desired fossil-dependent capital

```text
Desired fossil-dependent capital
= Expected-future-demand multiplier
× Relative fossil-service share
```

The forward reference/scenario model is unchanged because its default energy-activity index is 1.

## First calibrated model partition

The first partition asks one narrow empirical question:

> How quickly does the global fossil-dependency state adjust as clean infrastructure becomes more prevalent?

The observed target is the fossil share of total primary energy, normalized to the 2017 training endpoint:

```text
Observed fossil dependency
=
(fossil consumption / total primary energy)
/
(2025 fossil consumption / 2025 total primary energy)
```

The state is initialized to the observed 2000 proxy.

## Leakage-safe normalization

A publication-oriented calibration cannot use the held-out period even indirectly.

Earlier project-wide proxy tables use 2025 as a convenient present-day normalization reference. **Stage 14 does not use those 2025-normalized values for fitting.** Instead, it constructs its calibration variables directly from the raw annual series and normalizes every fitted quantity to **2017**, the last training year.

Thus:

- observed fossil dependency is fossil share relative to its 2017 value;
- absolute renewable capacity is relative to 2017 capacity;
- renewable-capacity intensity is relative to its 2017 value;
- the Stage 14 simulation path refuses requests for 2018–2025.

The holdout is therefore not used for scoring **or normalization**.

## Competing clean-competition hypotheses

The calibration tests two alternative measurement hypotheses **using only the training data**.

### H1 — absolute renewable capacity

```text
CleanIndex_abs(t)
= RenewableCapacity(t) / RenewableCapacity(2025)
```

### H2 — renewable-capacity intensity

```text
CleanIndex_intensity(t)
=
[RenewableCapacity(t) / TotalEnergy(t)]
/
[RenewableCapacity(2025) / TotalEnergy(2025)]
```

The second hypothesis asks whether clean infrastructure relative to the scale of the energy system is a better driver than absolute renewable capacity.

## Reduced dynamic equation

For either clean-index definition:

```text
DesiredDependency(t) = CleanIndex(t)^(-beta)

d Dependency / dt
= [DesiredDependency(t) - Dependency(t)] / tau_D
```

where:

- `beta` is a dimensionless clean-competition elasticity;
- `tau_D` is the fossil-dependency adjustment time in years.

The power-law form is normalized so that at the 2017 training-end clean reference:

```text
CleanIndex = 1  =>  DesiredDependency = 1
```

This makes `beta` interpretable and avoids embedding an arbitrary unnormalized logistic threshold in the reduced calibration problem.

## Parameter search

The training grid is deterministic and fully reproducible:

- `beta`: 0.000–0.080 in increments of 0.001;
- turnover-constrained `tau_D`: 15–35 years in increments of 0.5 years.

If the optimum reaches the lower bound, Stage 14 runs a **training-only structural diagnostic** with an extended 3–35 year range. This does not redefine the external physical-lifetime prior. Instead it tests whether the aggregate dependency proxy behaves like a literal long-lived capital stock or like a faster effective dependency state.

The adjustment-time bounds come from the existing broad external prior for fossil-dependent capital turnover.

The calibration criterion is training-window RMSE against the normalized fossil-dependency proxy.

## Training and holdout

- calibration: **2000–2017**;
- held-out validation: **2018–2025**.

The calibration function has no validation scoring path and reports:

```text
holdoutAccessed = false
```

Stage 14 therefore chooses the measurement hypothesis and reduced-model parameters without observing validation performance.

## Null benchmark

The reduced model is compared with a persistence baseline:

```text
Dependency(t) = Dependency(2000)
```

This provides a minimum useful-skill benchmark. A calibrated model that does not outperform persistence does not provide evidence for the clean-competition mechanism.

## Practical-identifiability diagnostic

For each hypothesis, the code reports the envelope of parameter combinations whose training RMSE is within 5% of the minimum.

This is explicitly labelled a **near-optimal ridge diagnostic**, not a statistical confidence interval.

A broad envelope means the historical data do not sharply distinguish `beta` from `tau_D`, even if one grid point gives the smallest error.

## What Stage 14 does not estimate

This stage does not estimate:

- fossil production capacity;
- capacity investment response;
- accumulated fossil capability;
- institutional support/resistance;
- clean-capital investment;
- carbon-cycle parameters.

Those remain separate partitions or externally constrained quantities.

## Reproducibility

Core files:

- `model/dependency-calibration.js`
- `tests/dependency-calibration.test.mjs`
- `model/upstream-engine.js`

The calibration is deterministic: identical code and historical data produce identical parameter estimates and hypothesis ranking.
