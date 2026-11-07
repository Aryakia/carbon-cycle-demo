# Scientific methods and evidence boundaries

## 1. Carbon conservation

Over human timescales, the Earth system is approximately closed with respect to carbon mass for the purpose of this educational model. Earth exchanges energy continuously with space and exchanges small amounts of matter, but humans do not create new carbon atoms at a meaningful scale here. Human activity primarily **moves existing carbon among reservoirs and changes its chemical form**.

The governing stock identity is:

```text
change in a stock = total inflows - total outflows
```

For the atmospheric control volume used in this project:

```text
dC_atm/dt =
    fossil and industrial CO2 emissions
  + net land-use CO2 emissions
  - net land CO2 uptake
  - net ocean CO2 uptake
  - durable carbon removal
```

All terms in the executable balance are expressed in GtC or GtC/yr.

## 2. Units

- 1 PgC = 1 GtC numerically.
- 1 GtC = 44/12 GtCO₂.
- Approximately 1 ppm atmospheric CO₂ ≈ 2.12 GtC.

The ppm conversion is used for communication and accounting. It is not a claim that every carbon reservoir can be converted to atmospheric ppm.

## 3. Dated assessment benchmarks

### IPCC AR6 Working Group I, Chapter 5

The IPCC assessment reports fossil-fuel resources of approximately:

- coal: 11,490 PgC;
- oil: 6,780 PgC;
- natural gas: 365 PgC;
- total: 18,635 PgC.

It also reports cumulative fossil-fuel and industry emissions of about 445 ± 20 PgC over 1750–2019.

Source: https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/

### Global Carbon Budget 2025

The 2025 Global Carbon Budget reports, among other quantities:

- 2024 atmospheric concentration: 422.8 ± 0.1 ppm;
- 2024 atmospheric carbon stock: approximately 898 GtC;
- 2024 fossil CO₂ emissions: 10.3 ± 0.5 GtC/yr;
- 2024 total anthropogenic CO₂ emissions: 11.6 ± 0.9 GtC/yr;
- 2024 ocean sink: 3.4 ± 0.4 GtC/yr;
- 2024 land sink: 1.9 ± 1.1 GtC/yr;
- projected 2025 fossil CO₂ emissions: about 10.4 GtC/yr;
- projected 2025 atmospheric concentration: about 425.6 ppm.

Source: Friedlingstein et al., Global Carbon Budget 2025, *Earth System Science Data* (2026): https://essd.copernicus.org/articles/18/3211/2026/

## 4. Resource comparison

The IPCC fossil-resource estimate (~18,635 GtC) is roughly twenty times a recent atmospheric carbon stock (~900 GtC). This is an intentionally striking scale comparison, but the categories are not equivalent.

The project must distinguish:

- resources from reserves;
- fossil resources from total geological carbon;
- physical occurrence from economic recoverability;
- resource abundance from a climate-compatible carbon budget;
- extraction from combustion and atmospheric emission.

The resource comparison therefore does **not** imply that all remaining resource carbon will be extracted or could become atmospheric CO₂.

## 5. Historical replay versus simulation

The historical public replay is a communication layer built from published/reference concentration anchors and benchmark interpolation. It is not an annual carbon-budget reconstruction.

The forward Policy Lab and advanced upstream model are simulations. Their results are conditional on explicit assumptions and should never be labeled observations or forecasts.

## 6. Natural sinks

Land and ocean sinks continue to function while atmospheric CO₂ rises. Atmospheric accumulation occurs when total anthropogenic inflow exceeds total net removal.

The beginner sandbox currently represents net natural uptake with a simplified share. That is a pedagogical closure, not a mechanistic carbon-cycle sink model. The advanced model preserves that simplification for now and labels it accordingly.

IPCC AR6 also notes that, under sufficiently strong net-negative emissions, land and ocean responses can change over time; sinks are not a single fixed-capacity drain.

## 7. Carbon lock-in evidence

The upstream modeling hypothesis is grounded in literature showing that persistent emissions can arise from interacting technological, infrastructural, institutional, and behavioral forms of lock-in.

Key references:

- Unruh, G. C. (2000). *Understanding carbon lock-in*. Energy Policy 28(12), 817–830. https://doi.org/10.1016/S0301-4215(00)00070-7
- Seto, K. C. et al. (2016). *Carbon Lock-In: Types, Causes, and Policy Implications*. Annual Review of Environment and Resources 41, 425–452. https://doi.org/10.1146/annurev-environ-110615-085934
- Tong, D. et al. (2019). *Committed emissions from existing energy infrastructure jeopardize 1.5 °C climate target*. Nature 572, 373–377. https://doi.org/10.1038/s41586-019-1364-3

These sources support the **existence and relevance of lock-in and committed infrastructure emissions**. They do not identify one universal equation or parameterization for all countries and sectors. The numerical behavioral relationships in this repository remain hypotheses until calibrated and tested.

## 8. Numerical diagnostics

The test suite checks:

1. ppm ↔ GtC and GtC ↔ GtCO₂ conversions;
2. exact closure of the atmospheric accounting equation;
3. fossil-carbon transfer bookkeeping across extraction, inventory, product use, and fossil carbon reaching the atmosphere;
4. nonnegative modeled physical stocks;
5. deterministic reproducibility;
6. directional consistency of a coordinated-policy scenario;
7. sensitivity of the 2100 result to the numerical time step.

Passing these tests establishes **internal numerical consistency**, not empirical validity.
