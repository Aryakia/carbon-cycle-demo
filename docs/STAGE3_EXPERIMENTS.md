# Comparative policy experiments

## Purpose

This module provides controlled, reproducible comparisons using the same upstream dynamics engine. It is designed to investigate how policy timing, policy combinations, institutional resistance, and historical capital stocks alter the model's response.

## Experiments

1. **Policy packages:** business as usual; carbon pricing; price plus clean investment; accelerated retirement; coordinated policy.
2. **Early versus delayed intervention:** identical coordinated package starting in 2025 or 2040.
3. **Institutional resistance:** same package with low versus high resistance assumptions.
4. **Historical investment / initial conditions:** less, baseline, and more fossil-dependent starting systems receiving the same coordinated policy.
5. **Supply-side versus demand-side policy:** stylized supply, demand, and coordinated packages.

## Outcomes shown

- annual fossil carbon reaching the atmosphere;
- atmospheric CO₂;
- developed fossil production capacity;
- fossil-dependent demand capital;
- cumulative fossil-to-atmosphere transfer;
- remaining resource frame;
- clean capital and clean substitution;
- first year fossil flow falls below 95% and 50% of its initial value;
- accounting residuals.

## Current model-generated findings

The automated experiment checks verify that, **under the current equations and default assumptions**:

- the coordinated package begun in 2025 produces lower cumulative fossil-to-atmosphere transfer than the identical package begun in 2040;
- low institutional resistance produces lower cumulative fossil transfer than high resistance under the same announced package;
- the less fossil-dependent initial condition produces lower cumulative fossil transfer than the more fossil-dependent initial condition under the same coordinated policy.

These are internal consequences of the model. They are not asserted as universal empirical magnitudes.

## Delays and inertia

Stage 3 introduces an explicit `policyStartYear`. Policy strength then follows a first-order implementation ramp. Policy-controlled fossil subsidies, fossil investment incentives, clean investment, carbon pricing, and accelerated retirement are applied consistently through that ramp.

Capital stocks also retire over time rather than disappearing instantly. This creates a transparent mechanism by which past investment can delay the effect of current policy.

## What is deliberately omitted

No monetary transition-cost comparison is shown yet. The project does not currently have a calibrated cost module or defensible cross-sector cost parameterization.

Hysteresis, rebound, and threshold claims are also not declared as findings yet. They require dedicated experiments and sensitivity analysis beyond the comparisons implemented here.
