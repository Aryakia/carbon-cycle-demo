# Stage 6 validation and verification report

## Status

The project now has a formal distinction between:

1. **verification** — whether equations, units, conservation identities, deterministic behavior, and numerical implementation work as specified;
2. **sensitivity analysis** — whether outcomes change materially when uncertain assumptions are varied;
3. **structural support** — whether the causal mechanisms are plausible and grounded in relevant literature;
4. **calibration** — whether behavioral parameters are estimated or fitted to empirical data;
5. **validation** — whether the model reproduces independent empirical behavior well enough for its intended scientific use.

The current project has meaningful verification and preliminary sensitivity screening. It does **not** yet have empirical calibration or out-of-sample validation for the upstream behavioral model.

## Automated test coverage

The GitHub Actions quality workflow runs:

- carbon-unit conversion tests;
- atmospheric carbon mass-balance closure;
- fossil extraction/inventory/product/atmosphere bookkeeping closure;
- nonnegative stock checks;
- deterministic reproducibility;
- scenario-direction checks;
- paleoclimate data integrity;
- comparative-experiment consistency;
- static GitHub Pages integrity and basic accessibility checks;
- educational-assessment privacy and structure checks;
- complete default-parameter metadata coverage;
- one-at-a-time sensitivity screening;
- numerical time-step stability checks.

## Numerical integration boundary

The supported maximum time step is **0.25 year**. Coarser time steps are rejected by the simulation engine.

The default quarterly run is compared with 0.125-year and 0.0625-year runs. This boundary was introduced after a validation test showed that a 0.5-year step produced excessive cumulative-flow sensitivity in the strongest coordinated-policy scenario.

The short fuel-inventory stock is integrated with an exact first-order solution rather than explicit Euler, because its default residence time is 0.25 year.

### Current time-step diagnostics

Comparing the default 0.25-year step with 0.125 and 0.0625-year runs:

| Scenario | Maximum relative 2100-ppm difference | Maximum relative cumulative-fossil-transfer difference |
| --- | ---: | ---: |
| Structural reference | 0.000% | 0.000% |
| Carbon price | 0.018% | 0.068% |
| Price + clean investment | 0.072% | 0.466% |
| Accelerated retirement | 0.067% | 0.505% |
| Coordinated package | 0.064% | 0.634% |

These are numerical-convergence diagnostics, not empirical validation results.

## Mass-balance tests

The atmospheric stock obeys:

```text
dC_atm/dt =
  fossil and industrial emissions
+ net land-use emissions
- land uptake
- ocean uptake
- durable removal
```

The fossil transfer test checks that extracted carbon is accounted for by:

```text
change in fuel inventory
+ change in product carbon
+ fossil carbon transferred to atmosphere
```

Residuals are required to remain below floating-point tolerances in all tested sensitivity cases.

## Sensitivity analysis

The coordinated-policy scenario is screened one parameter at a time over explicit low/high settings for:

- institutional resistance;
- clean learning reinforcement;
- fossil production-capacity lifetime;
- fossil-demand-capital lifetime;
- policy implementation delay;
- pedagogical natural-sink fraction;
- resource-development cost index;
- non-combustion fossil-carbon share.

This is a **screening analysis**, not a probability distribution, Monte Carlo uncertainty assessment, or calibrated confidence interval.

### Current screening envelope

For the coordinated-policy scenario across the baseline and the low/high settings of the eight screened dimensions:

- 2100 atmospheric CO₂: **481.32–514.30 ppm**;
- cumulative fossil carbon transferred to the atmosphere: **158.91–265.71 GtC**;
- 2100 fossil-to-atmosphere flow: **0.1354–0.4107 GtC/yr**.

These ranges are conditional on the tested one-at-a-time parameter bounds and should not be interpreted as statistical confidence intervals.

## Parameter provenance

Every default in `DEFAULT_PARAMETERS` has an entry in `model/parameter-metadata.js` with:

- label;
- unit;
- classification;
- status;
- source/rationale;
- active/inactive flag.

An audit identified `cleanCapitalLifetimeYears` as currently inactive: the engine instead uses `cleanDepreciationRatePerYr`. This is retained and explicitly documented rather than silently represented as active.

## Validation claims that are NOT made

The project does not claim that the upstream behavioral model is:

- calibrated to historical fossil investment/capacity/extraction data;
- validated against held-out observations;
- globally representative across all countries and sectors;
- predictive of future emissions;
- a causal estimator of policy effectiveness;
- a substitute for EN-ROADS, EPS, IAMs, or Earth-system models.

## Next empirical validation steps

A peer-review-oriented version should next:

1. choose a defined empirical scope (global aggregate or one/few sectors/countries);
2. collect historical capacity, capital retirement, extraction, consumption, price, subsidy, clean deployment, and policy data;
3. identify estimable behavioral relationships and eliminate unsupported degrees of freedom;
4. calibrate on an explicit training period;
5. validate on a held-out period;
6. perform global sensitivity / uncertainty analysis;
7. conduct expert structural review;
8. evaluate whether the educational interface improves stock-flow and lock-in understanding using a separately approved research protocol.


## Stage 7 reference-mode correction

The previous no-policy case contained a strong autonomous fossil decline and was incorrectly labeled “business as usual.” It has been replaced by a neutral **Structural reference**.

The reference initialization now reproduces the Global Carbon Budget 2025 fossil-flow benchmark:

- first modeled fossil-to-atmosphere flow: **10.4 GtC/yr**;
- Structural reference fossil flow in 2050: **10.4 GtC/yr**;
- Structural reference fossil flow in 2100: **10.4 GtC/yr**;
- clean-capital stock in 2100: **0.32**, equal to its reference initial stock.

These are structure/initialization checks, not a forecast.

The Structural reference produces about **645 ppm** in 2100 under the current pedagogical natural-sink closure. This value must not be interpreted as a climate projection: the advanced model still uses a simplified sink fraction rather than a mechanistic or calibrated carbon-cycle response model.
