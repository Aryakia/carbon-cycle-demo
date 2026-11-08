# Stage 13A — historical backcast readiness and initial-state discipline

## Why this stage exists

A historical calibration beginning in 2000 needs a model state at 2000.

Several state variables have observations or defensible proxies. Others do not.

A common calibration failure is to hide poorly known initial states inside convenient defaults and then interpret the resulting parameter fit as if the data identified the dynamics. Stage 13A prevents that.

## New exogenous energy-activity driver

The model now separates:

```text
aggregate energy activity
× expected future fossil demand
× fossil-dependent capital
```

The forward model defaults aggregate energy activity to 1.

Historical mode maps it to observed world total primary-energy supply from the Energy Institute, normalized to 2025.

This keeps **observed system scale** separate from the behavioral expectations multiplier.

## Fossil dependency decomposition

The historical fossil-demand proxy is no longer absolute fossil consumption.

Instead:

```text
fossil consumption activity
=
total energy activity
× fossil dependency/share index
```

where:

```text
fossil dependency index
=
(fossil consumption / total energy supply)
/
(2025 fossil consumption / 2025 total energy supply)
```

This factorization exactly reconstructs the 2025-normalized fossil-consumption history and avoids double-counting energy-system growth.

## 2000 state initialization

Automatically initialized from observations/proxies:

- clean capital: renewable-capacity proxy scaled to the model's 2025 clean-capital reference;
- fossil-demand capital: fossil-dependency/share proxy;
- carbon-cycle boxes: calibrated end-1999 carbon-cycle replay;
- fuel inventory: quasi-steady accounting stock based on 2000 fossil-carbon flow and the inventory residence time;
- product carbon: quasi-steady accounting stock based on 2000 fossil-carbon flow, non-combustion share and product lifetime;
- aggregate energy activity: observed primary-energy supply index.

## Explicit latent initial states

The initializer refuses to run unless these are supplied explicitly:

1. production capacity;
2. accumulated fossil capability;
3. institutional support.

They are not directly observed by the current canonical dataset.

This makes future calibration responsible for their treatment rather than silently inheriting 2025 defaults.

## Resource stock

The resource frame is non-binding over 2000–2025.

For accounting consistency, the initial available resource is the IPCC fossil-resource frame minus an approximate cumulative fossil/industry carbon amount to end-1999, derived from the AR6 cumulative 1750–2019 value and the GCB 2000–2019 annual series.

Because the 18,635 GtC resource frame is vastly larger than 25-year historical extraction, this initialization has negligible influence on historical calibration results.

## Remaining gate before optimization

Even with disciplined initialization, production capacity itself remains latent.

The next calibration step should either:

- obtain a defensible global capacity/utilization proxy; or
- explicitly estimate a small initial-capacity/adjustment subsystem under fixed lifetime priors and report that the capacity stock is latent.

Capability and institutional initial states should not be freely estimated together with all their formation/decay coefficients because Stage 12 showed strong local confounding.
