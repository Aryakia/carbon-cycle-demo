# Stage 8 — dynamic reduced carbon-cycle closure

## Motivation

The advanced upstream model previously represented natural carbon uptake as a fixed fraction of current anthropogenic emissions. That was useful pedagogically but dynamically weak: if emissions fell abruptly, the modeled sink fell immediately even though elevated atmospheric CO₂ would continue to drive uptake.

The beginner bathtub retains its simple drain. Stage 8 changes only the advanced research engine.

## Model form

The new module uses four atmospheric CO₂ response pools based on Joos et al. (2013) / IPCC AR5:

```text
dR_i/dt = a_i * E_CO2 - R_i / (alpha * tau_i)
```

```text
atmospheric CO2 = preindustrial CO2 + sum(R_i)
```

Published response fractions:

```text
a = [0.2173, 0.2240, 0.2824, 0.2763]
```

Published nominal time scales:

```text
tau = [effectively persistent, 394.4 yr, 36.54 yr, 4.304 yr]
```

Following the reduced-form logic used in FaIR, the finite time scales are multiplied by a lifetime scaling factor `alpha`.

## Historical calibration

The project does not refit the Joos response fractions or nominal time scales.

It fits:

1. one constant `alpha = 0.555`;
2. a non-negative legacy atmospheric response state at 1959.

Calibration target: the Global Carbon Budget 2025 atmospheric-stock trajectory for 1959–2024.

The 2024 endpoint is constrained to the assessed 422.8 ppm global mean.

Results:

- RMSE: 1.186 ppm;
- maximum absolute stock error: 2.976 ppm;
- 2024 endpoint: 422.800 ppm.

## Independent 2025 check

Using the calibrated end-2024 state and the preliminary GCB 2025 total anthropogenic emissions of about 11.5 GtC/yr gives:

```text
predicted 2025 CO2 = 425.160 ppm
preliminary GCB 2025 CO2 = 425.6 ppm
error = -0.440 ppm
```

The 0.44 ppm residual (0.932 GtC) is assimilated into the fastest response box to initialize the observed 2025 state. This avoids assigning a one-year atmospheric anomaly to the long-lived pool.

## Natural uptake diagnostic

The advanced engine now diagnoses combined natural uptake:

```text
natural uptake
= net anthropogenic CO2 input
- atmospheric carbon growth
```

At the initialized 2025 state the model diagnoses about 6.90 GtC/yr.

For context, GCB 2025 gives preliminary 2025 ocean uptake around 3.2 GtC/yr and land uptake around 3.1 GtC/yr, while total emissions minus atmospheric growth implies a top-down residual sink near 7.1 GtC/yr. The reduced model is therefore in the current observational budget range, but it does not attempt to reproduce annual land/ocean variability.

## What this improves

- sinks no longer scale instantaneously with current emissions;
- legacy emissions continue to affect future uptake;
- net-negative emissions can draw down atmospheric carbon through the same response structure;
- the advanced model has an explicit historical carbon-cycle validation target;
- the beginner teaching model remains simple.

## What it does not solve

- alpha is constant rather than state-dependent;
- temperature feedback on sink strength is not modeled;
- land and ocean uptake are not separated mechanistically;
- annual ENSO-driven land-sink variability is not represented;
- the upstream fossil-investment behavioral model is still not historically calibrated.

## Sources

- Joos et al. (2013), DOI 10.5194/acp-13-2793-2013.
- IPCC AR5 Working Group I Chapter 8 Supplement, Table 8.SM.10.
- Millar et al. (2017), DOI 10.5194/acp-17-7213-2017.
- Smith et al. (2018), DOI 10.5194/gmd-11-2273-2018.
- Leach et al. (2021), DOI 10.5194/gmd-14-3007-2021.
- Global Carbon Project, Global Carbon Budget 2025 v1.0, DOI 10.18160/GCP-2025.
- Friedlingstein et al. (2026), DOI 10.5194/essd-18-3211-2026.
