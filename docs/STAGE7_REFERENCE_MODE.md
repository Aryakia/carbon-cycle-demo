# Stage 7 — Empirical reference-mode correction

## Why this stage was necessary

The previous default case was labeled “Business as usual” but generated a strong autonomous decline in fossil flow even without a carbon price, accelerated retirement, or an explicit fossil penalty. The live model fell to roughly 2.0 GtC/yr by 2050 and 0.3 GtC/yr by 2100.

That behavior was not an empirical reference mode. It resulted mainly from two structural issues:

1. the 10.4 GtC/yr current fossil-flow benchmark was multiplied by `(1 - cleanShare)`, even though the benchmark already represented fossil emissions; and
2. fossil-dependent demand capital and clean capital were not initialized at replacement-compatible conditions, so the no-policy structure contained a strong autonomous transition.

## Scientific basis for the correction

Global Carbon Budget 2025 reports projected global fossil CO2 emissions of about **10.4 GtC/yr (38.1 GtCO2/yr) in 2025**.

Source:
https://essd.copernicus.org/articles/18/3211/2026/

The IEA World Energy Outlook 2025 Current Policies Scenario keeps global energy-related CO2 emissions near 40 GtCO2/yr through 2050, but the IEA explicitly states that CPS is **not a forecast, prediction, or “business-as-usual” scenario**. Its accounting boundary also differs from the Global Carbon Budget fossil-CO2 boundary.

Source:
https://www.iea.org/reports/world-energy-outlook-2025/current-policies-scenario

Therefore, this project does **not** force the model to the IEA trajectory. Instead it defines a neutral **Structural reference** condition.

## Structural-reference definition

The reference mode asks a narrower question:

> If current fossil flow, current clean-capital state, and normal replacement conditions persisted, would the model approximately reproduce them in the absence of an explicit new driver?

This is an initialization and structure test, not a future forecast.

## Equation correction

The old structure effectively used:

```text
fossil demand
= current fossil-flow benchmark
× fossil-dependent capital
× (1 - clean share)
```

This applied the clean-share signal directly to a benchmark that already described current fossil emissions.

The revised structure uses:

```text
current fossil-flow benchmark
→ fossil demand constrained by installed fossil-dependent capital

clean competitiveness
→ desired fossil-dependent capital
→ investment / retirement
→ actual fossil-dependent capital
→ fossil demand
```

The current clean-share signal is normalized out of the reference condition. Changes in clean competitiveness alter the **desired stock**, while capital turnover creates the delay.

## Reference-compatible initial stocks

The short material stocks are initialized from the reference flow:

```text
fuel inventory
= reference fossil flow
× (1 - process-emission share)
× inventory residence time
```

```text
product carbon
= reference fossil flow
× (1 - process-emission share)
× non-combustion share
× product lifetime
```

This makes process emissions, combustion, product formation, and product decay internally consistent at the reference start.

Clean investment is likewise initialized at the rate needed to replace depreciation of the reference clean-capital stock under the default learning coefficient.

## Parameter reduction

Two redundant/inactive defaults were removed:

- `demandCapitalInvestmentRatePerYr` — demand-capital investment is now derived from the desired stock and capital lifetime;
- `cleanCapitalLifetimeYears` — the active clean-capital turnover equation uses `cleanDepreciationRatePerYr`.

This reduces free parameters and improves identifiability.

## Interpretation

The Structural reference is not:

- a forecast;
- an IEA Current Policies Scenario reproduction;
- a claim that fossil emissions will stay constant;
- an empirical calibration of the full behavioral model.

It is a neutral starting condition designed to prevent the model from embedding an arbitrary transition before policy experiments begin.
