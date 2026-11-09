# Stage 18 — external cross-entity validation preregistration

## Frozen entity selection

The entity panel was selected before country-level 2018–2025 model outcomes were calculated.

Selection rule:

> Top 10 ISO-coded entities by 2017 fossil-energy consumption among entities with complete 2000–2025 coverage in fossil consumption, total primary-energy supply, renewable electricity share, and nuclear electricity share.

Selected entities:

1. China
2. United States
3. India
4. Russia
5. Japan
6. Germany
7. South Korea
8. Iran
9. Canada
10. Mexico

The ranking uses 2017 fossil-energy consumption only.

## External validation question

Stage 17 selected a **static low-carbon electricity share** structure using the global time series.

Stage 18 asks whether that **measurement structure** transfers across major national energy systems.

For each selected country:

- target: fossil share of total primary energy;
- driver: renewable + nuclear share of electricity generation;
- both normalized to 2017;
- beta estimated on 2000–2017 only;
- 2018–2025 evaluated without retuning.

## Comparator models

Pre-specified comparators:

1. persistence at the 2017 normalized fossil-dependency level;
2. static renewable-electricity-share model (renewables only);
3. selected static low-carbon-electricity-share model.

Installed renewable-capacity intensity is not included in the external panel comparison because the Stage 18 country data package was frozen around the four complete series used in the selection rule. The global Stage 17 capacity comparison remains the evidence for capacity versus realized generation.

## Metrics

Per entity and pooled across all entity-years:

- RMSE;
- MAE;
- bias;
- skill versus persistence.

No entity is removed based on validation performance.

## Claim boundary

This is external **cross-entity structural validation**, not proof of one universal beta.

Entity-specific beta values are estimated independently on 2000–2017. Transferability is judged from whether the selected measurement structure generalizes across entities and improves predictive performance relative to pre-specified alternatives.
