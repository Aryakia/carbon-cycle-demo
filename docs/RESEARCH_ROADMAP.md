# Research roadmap and publication status

## What is established / assessed science in the platform

- carbon conservation and stock-flow accounting;
- ppm ↔ GtC ↔ GtCO₂ conversions;
- dated IPCC fossil-resource and cumulative-emissions benchmarks;
- Global Carbon Budget atmospheric/emissions/sink benchmarks;
- revised Antarctic ice-core CO₂ observations;
- the qualitative existence of infrastructure/carbon lock-in and committed emissions in peer-reviewed literature.

## What is an educational simplification

- the beginner Policy Lab's fixed natural-uptake-share control;
- the visual resource tank;
- the aggregated land/ocean sink closure in the advanced engine;
- the single global fossil resource/capacity representation;
- the learning self-assessment as immediate educational feedback.

## What is a research hypothesis

- the numerical strength of institutional resistance;
- the feedback between aggregate fossil activity and institutional support;
- capability accumulation/decay coefficients;
- the aggregate profitability response equation;
- the clean-substitution response equation;
- policy implementation attenuation/delay parameters;
- the effect size of historical initial-condition dependence.

## What is now testable in the software

The model can reproducibly test whether its equations generate:

- policy-response delays;
- persistent emissions after intervention;
- effects of capital retirement;
- differences between early and delayed intervention;
- differences under low/high institutional resistance;
- differences under more/less fossil-dependent starting systems;
- sensitivity to key uncertain assumptions.

These are **model experiments**, not empirical findings.

## Potential peer-reviewed research path

### Track A — model / theory paper

Define a narrower empirical scope, calibrate the upstream equations, validate against held-out observations, and use sensitivity/structural analysis to test path-dependence hypotheses.

### Track B — educational research

Use the current platform as the intervention in a controlled learning study. Develop and validate a measurement instrument, pre-register hypotheses where appropriate, obtain ethics approval/consent as required, and compare pre/post or treatment/control understanding of stock-flow accumulation and carbon lock-in.

The existing local-only self-assessment is not research-participant data collection and should remain separate from any future study infrastructure.

## Current publication claim

The repository can accurately be described as:

**a scientifically sourced educational platform with a numerically verified, uncalibrated upstream system-dynamics hypothesis model.**

It should not yet be described as a calibrated, validated, predictive, or novel policy model.


### Reference-mode correction completed

Stage 7 removed the misleading “business as usual” label and corrected the reference initialization so the advanced model begins at the current fossil-flow benchmark without applying the clean-share signal twice.

The next empirical priority is now clearer:

1. construct a historical reference mode for approximately 2000–2025;
2. **completed in Stage 8:** replace the fixed research-mode sink fraction with a historically calibrated reduced-complexity carbon-cycle response;
3. calibrate only an identifiable subset of behavioral parameters;
4. validate against held-out historical behavior before interpreting policy effect sizes quantitatively.


### Dynamic carbon-cycle closure completed

Stage 8 replaced the advanced model's fixed natural-sink fraction with a four-timescale reduced-form carbon-cycle emulator calibrated to the 1959–2024 Global Carbon Budget atmospheric-stock history.

The remaining scientific priorities are now:

1. construct a historical upstream behavior mode for approximately 2000–2025;
2. calibrate only an identifiable subset of upstream behavioral parameters;
3. test those parameters on a held-out historical period;
4. move from one-at-a-time sensitivity screening to global sensitivity / uncertainty analysis;
5. consider a fully state-dependent FaIR-style lifetime scaling only if the added complexity materially improves historical and policy-response validity.
