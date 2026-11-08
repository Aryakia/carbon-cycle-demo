# Stage 11 — historical empirical reference dataset (2000–2025)

## Purpose

Stage 11 creates the empirical reference layer that must exist **before** upstream behavioral calibration.

The rule is simple:

> Observations constrain the model; they are not silently redefined as model stocks.

The canonical annual table covers 2000–2025 and currently contains five continuous series.

## Canonical series

| Series | 2000 | 2025 | Source | Model use |
| --- | ---: | ---: | --- | --- |
| Fossil CO2 | 6.963 GtC/yr | 10.4 GtC/yr | Global Carbon Budget 2025 | Primary fossil-carbon-flow target |
| Atmospheric CO2 | reconstructed GCB level | 425.6 ppm preliminary | Global Carbon Budget 2025 | Carbon-cycle validation target |
| Renewable power capacity | 763.94 GW | 5,155.01 GW | IRENA 2026, harmonized by OWID | Clean-capital stock proxy |
| Fossil-energy consumption | 94,434 TWh | 143,805.69 TWh | Energy Institute 2026, harmonized by OWID | Fossil-demand activity proxy |
| World real GDP | 48.55T 2015 USD | 99.66T 2015 USD | World Bank WDI | Candidate energy-service demand driver |

## Evidence hierarchy

### Direct scientific/official series

- Global Carbon Budget: fossil CO2 and atmospheric carbon-budget history.
- World Bank WDI: real GDP.

### Original provider with transparent harmonization

- IRENA renewable capacity is consumed through the OWID grapher export because the IRENA public query tool is less automation-friendly. IRENA remains the original data provider.
- Energy Institute fossil-energy consumption is consumed through the OWID grapher export. Energy Institute remains the original provider.

OWID is therefore recorded as **processor**, not substituted for the scientific source.

## Measurement mapping

### Fossil CO2 → fossil-to-atmosphere flow

This is the strongest calibration target, but accounting boundaries must still be reconciled with the model's explicit process-emission, inventory and product-carbon bookkeeping.

### Renewable capacity → clean-capital proxy

Renewable electricity capacity is a real physical stock. It is **not** equivalent to total clean capital because it excludes:

- nuclear;
- transmission grids;
- storage;
- efficiency capital;
- end-use electrification;
- other clean infrastructure.

For initial calibration it constrains the *shape* of clean-capital accumulation. The proxy is normalized so the observed 2025 renewable capacity corresponds to the model's 2025 clean-capital reference stock of 0.32.

### Fossil-energy consumption → fossil-demand activity proxy

Fossil energy consumption is an annual flow, not an installed demand-capital stock. It can constrain demand-side behavior but must not be treated as a direct observation of fossil-dependent capital.

### GDP → candidate demand driver

World real GDP is normalized to 2025 = 1 for diagnostic work. No fixed GDP elasticity is imposed at this stage.

## Deliberately missing rather than fabricated

The canonical table does **not** yet contain an invented fossil-production-capacity stock or approximate investment series.

Important gaps:

1. **Fossil production capacity:** production/consumption flow is not the same as installed upstream capacity.
2. **Clean and fossil investment:** IEA World Energy Investment is the preferred candidate. Exact annual data should be ingested from the downloadable product rather than visually digitized from charts.
3. **Institutional resistance:** there is no single globally accepted annual measure; this remains a latent construct until an operationalization is justified.

## Train / validation split

For the next stage, the provisional split is:

- **training/calibration:** 2000–2017;
- **held-out validation:** 2018–2025.

This split is provisional and can be revised if parameter identification shows that a different breakpoint is more defensible.

COVID-19 (2020) must be treated explicitly as an external shock rather than interpreted automatically as endogenous model failure.

## Files

- `data/historical-reference-2000-2025.js` — canonical observed table and source metadata.
- `model/historical-mapping.js` — explicit measurement-to-model mapping and normalized proxies.
- `tests/historical-reference.test.mjs` — completeness, continuity, endpoint and normalization tests.
