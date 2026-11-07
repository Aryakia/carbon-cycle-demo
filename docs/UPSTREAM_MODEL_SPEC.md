# Upstream Dynamics Model — specification v0.1

## Research question

**Why does the fossil-carbon faucet remain open even after climate damages are understood and mitigation policies are introduced?**

This model is a transparent hypothesis generator. It is not a calibrated global energy model and it is not intended to reproduce EN-ROADS or the Energy Policy Simulator.

## Boundary

The model focuses on the chain:

```text
resource availability
→ production capacity
→ extraction
→ fuel inventory / uses
→ combustion and process emissions
→ atmospheric carbon
```

and the feedbacks that influence investment, demand persistence, substitution, and policy effectiveness.

## Stocks

| Stock | Unit | Interpretation |
| --- | --- | --- |
| Available fossil resource frame | GtC | Remaining carbon in the IPCC resource comparison frame; not reserves |
| Developed production capacity | GtC/yr capacity | Wells, mines, processing and supporting capacity represented in aggregate |
| Fossil-dependent demand capital | index | Long-lived consuming infrastructure and complementary assets |
| Clean capital | index | Competing low-carbon infrastructure / deployment base |
| Accumulated capability | index | Experience, supply chains, expertise, and complementary capability |
| Institutional support | 0–1 index | Simplified persistence of supportive institutions/stakeholder dependence |
| Fuel inventory | GtC | Extracted carbon not yet allocated to combustion/non-combustion use |
| Product carbon | GtC | Non-combustion fossil carbon in products, with a simplified decay time |
| Atmospheric carbon | GtC | Atmospheric control-volume stock |
| Durable storage | GtC | Deliberately removed and durably stored carbon |

## Distinguishing extraction from emission

Extraction is not treated as immediate atmospheric emission.

```text
extraction
→ process emissions
→ fuel inventory
→ combustion
→ non-combustion products
→ delayed product decay
```

For each time step, the fossil-transfer bookkeeping test checks:

```text
extracted carbon
=
change in fuel inventory
+ change in product carbon
+ fossil carbon transferred to atmosphere
+ residual
```

The residual should be numerically zero to floating-point tolerance.

## Atmospheric equation

```text
dC_atm/dt =
  fossil-to-atmosphere flow
+ land-use emissions
- land uptake
- ocean uptake
- durable removal
```

The advanced prototype now closes atmospheric CO₂ with a **historically calibrated four-timescale reduced-form carbon-cycle response** rather than a fixed sink fraction. The response fractions and nominal time scales come from Joos et al. (2013) / IPCC AR5, while one constant lifetime scale (alpha = 0.555) and the 1959 legacy box state are fitted to the Global Carbon Budget 2025 atmospheric-stock trajectory.

The carbon-cycle module diagnoses **combined net natural uptake**. It does not infer a unique land/ocean partition, and it is not a full Earth-system carbon-cycle model.

## Reduced carbon-cycle equations

For four atmospheric response pools `R_i`:

```text
dR_i/dt = a_i * E_CO2 - R_i / (alpha * tau_i)
```

and:

```text
C_atm = C_preindustrial + sum(R_i)
```

The first Joos pool is effectively persistent on this model horizon. The finite time constants are integrated analytically each step.

The net natural uptake is diagnosed from conservation:

```text
net natural uptake
= net anthropogenic CO2 input
- change in atmospheric excess carbon
```

Durable removal enters the carbon cycle as negative net anthropogenic input and is also tracked in the explicit durable-storage stock.

Historical calibration and validation are implemented in `model/carbon-cycle-reduced.js` and `tests/carbon-cycle-reduced.test.mjs`.

## Feedback hypotheses

### R1 — infrastructure lock-in

```text
fossil demand capital
→ fossil demand signal
→ production utilization / profitability
→ fossil capacity investment
→ available fossil supply
→ continued fossil use
```

### R2 — accumulated technological advantage

```text
capacity utilization
→ accumulated capability
→ expected profitability / ease of deployment
→ fossil capacity investment
→ capacity utilization
```

### R3 — economic and institutional dependence

```text
fossil activity
→ institutional support
→ weaker effective policy pressure
→ continued fossil profitability
→ fossil activity
```

### B1 — climate-policy response

```text
carbon price / retirement policy
→ lower effective fossil profitability
→ lower investment and/or faster retirement
→ lower extraction and combustion
→ lower atmospheric inflow
```

Policy implementation is delayed and partly attenuated by the user-controlled institutional-resistance assumption.

### B2 — alternative-technology substitution

```text
clean investment
→ clean capital
→ learning / competitiveness
→ clean share
→ lower fossil demand signal
→ lower fossil extraction
```

## Key behavioral equations

The exact executable implementation is in `model/upstream-engine.js`.

### Policy ramp

```text
policy_ramp = 1 - exp(-time_since_policy / policy_delay)
```

### Effective carbon price

```text
effective_carbon_price
= announced_carbon_price
× policy_ramp
× (1 - 0.65 × institutional_resistance)
```

This attenuation coefficient is a **modeling assumption**, not an empirical estimate.

### Clean substitution

Clean competitiveness is a function of accumulated clean capital, a stylized learning term, and the effective carbon price. A logistic function converts competitiveness into an illustrative clean share.

### Fossil profitability

The prototype profitability index combines:

- expected fossil demand;
- accumulated capability;
- institutional support;
- fossil subsidy;
- carbon-price pressure;
- resource-development cost.

All coefficients are placeholders for sensitivity analysis.

### Capital turnover

Production capacity and fossil-demand capital have investment inflows and retirement outflows. Clean capital has investment and depreciation.

This structure allows past investment decisions to affect future policy response through stock persistence.

## Initial parameter status

The default values are selected for transparent dynamic behavior and numerical stability. They are **not calibrated**.

Before scientific claims are made, the following need empirical work:

- sector/country-specific capital lifetimes;
- investment response to expected demand and prices;
- subsidy incidence;
- effective carbon-price pass-through;
- capability/learning relationships;
- institutional-resistance representation;
- clean substitution response;
- inventory and non-combustion shares where modeled in aggregate.

## Experiments enabled by this structure

The engine already supports reproducible experiments for:

- business as usual;
- carbon pricing alone;
- carbon pricing plus clean investment;
- accelerated fossil-capital retirement;
- coordinated supply- and demand-side policy.

Additional experiments can be added as named scenario objects without changing the core equations.

## Interpretation rule

If the model generates inertia, delayed response, or hysteresis-like behavior, it must be reported as an **output of these equations under specified assumptions**, not as a universal empirical finding.
