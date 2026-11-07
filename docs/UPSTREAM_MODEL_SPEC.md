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

The current advanced prototype closes land/ocean uptake with a clearly labeled **pedagogical sink fraction**. This is not a mechanistic sink model.

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
