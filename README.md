# Carbon Beyond the Bathtub

**Interactive System Dynamics demo of atmospheric CO₂ as a stock embedded in a much larger carbon system.**

| | |
|---|---|
| **Project type** | Interactive systems demo · carbon cycle · stock–flow learning game |
| **Role** | Creator and model designer |
| **Status** | Public conceptual prototype |
| **Model type** | Historical reference replay + simplified what-if stock–flow sandbox |
| **Public disclosure** | Published scientific context only; no private data or hidden model parameters |

## Purpose

The familiar carbon **bathtub analogy** treats atmospheric CO₂ as the water level, anthropogenic emissions as the tap, and removals as the drain. That framing is useful, but it can hide an important systems point: the atmosphere is only one stock inside a much larger network of carbon reservoirs, and fossil extraction transfers carbon from a very large, slow geological stock into the much faster atmosphere–land–ocean system.

This demo therefore places a large upstream fossil-carbon resource tank next to the atmospheric bathtub. Users can move through time, watch atmospheric CO₂ rise, and see that a relatively small transfer from the geological resource frame can generate a large change in the atmospheric stock.

## The “about 2%” calculation

The percentage is meaningful only when its denominator is stated.

### IPCC AR6 benchmark through 2019

IPCC AR6 Working Group I Chapter 5 reports:

- cumulative fossil-fuel and industry CO₂ emissions, 1750–2019: **445 ± 20 PgC**
- fossil-fuel resources:
  - coal: **11,490 PgC**
  - oil: **6,780 PgC**
  - natural gas: **365 PgC**
  - total: **18,635 PgC**

So, for that specific comparison:

**445 / 18,635 = 2.39%**

This does **not** mean that humanity has used only 2% of “all carbon,” nor that the remaining 98% is economically recoverable or climate-safe to burn. The denominator is IPCC’s fossil-fuel **resource** estimate, which is different from proved reserves and from a remaining carbon budget compatible with a temperature target.

### Updated Global Carbon Budget context

The **Global Carbon Budget 2025** reports cumulative fossil CO₂ emissions of about **495 ± 25 GtC for 1850–2024** and projects about **10.4 GtC** of fossil CO₂ emissions for 2025. Compared with the older IPCC resource denominator, an updated illustrative fraction is therefore:

**(495 + 10.4) / 18,635 ≈ 2.71%**

The website displays both numbers so the historical calculation remains traceable while the user can see how the fraction changes through time.

## Current atmospheric reference

The demo currently uses **427.89 ppm** as the latest global atmospheric CO₂ trend reference, reported by NOAA Global Monitoring Laboratory for **September 7, 2026**.

The Global Carbon Budget 2025 reports:

- atmospheric CO₂ in 2024: **422.80 ± 0.1 ppm**
- atmospheric carbon stock in 2024: **898 GtC**
- cumulative anthropogenic CO₂ emissions, 1850–2024: **745 ± 65 GtC**
- cumulative fossil CO₂ emissions, 1850–2024: **495 ± 25 GtC**
- over 2015–2024, approximately **50%** of total anthropogenic CO₂ emissions accumulated in the atmosphere, while **29%** was absorbed by the ocean and **21%** by land

## What the interactive game does

### Historical mode

The time slider moves from **1750 to 2026** and updates:

- atmospheric CO₂ concentration
- the bathtub water level
- the upstream fossil-resource gauge
- the cumulative fossil-carbon transfer represented in the resource comparison
- the position on the CO₂ time-series graph

Atmospheric CO₂ uses published historical/reference anchors. The fossil-resource gauge interpolates between published cumulative-emissions benchmarks; it is a communication device, not a reconstruction of every annual emissions value.

### What-if mode

The future sandbox runs from **2026 to 2100** and lets the user change:

- fossil + land-use inflow
- the share taken up by land and ocean
- additional durable carbon dioxide removal (CDR)

The simplified stock equation is conceptually:

**change in atmospheric stock = anthropogenic inflow − natural uptake − durable removal**

The demo converts the resulting net carbon flow to an illustrative ppm rate using approximately **2.12 GtC per ppm**.

This is deliberately a learning model. It does not simulate carbon-cycle feedbacks, changing sink efficiency, ocean chemistry, temperature response, non-CO₂ forcing, or socioeconomic dynamics.

## Core System Dynamics insight

Reducing emissions does not automatically make atmospheric CO₂ decline.

- If inflow > removals, atmospheric CO₂ rises.
- If inflow ≈ removals, atmospheric CO₂ stabilizes.
- If removals > inflow, atmospheric CO₂ declines.

The important leverage point is the **transfer rate** from slow geological storage into the fast surface carbon cycle—not whether the upstream geological stock is close to being exhausted.

## Major conceptual stocks

- Atmosphere
- Ocean
- Terrestrial biomass
- Soils
- Geological / fossil carbon

The original clickable reservoir explorer is preserved below the game so the demo still communicates the wider network of stocks and flows.

## Scientific sources

- IPCC AR6 Working Group I, Chapter 5, especially Figure 5.12 and Table 5.1: https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/
- Global Carbon Budget 2025, Friedlingstein et al. (2026), *Earth System Science Data*: https://essd.copernicus.org/articles/18/3211/2026/
- Global Carbon Project data hub: https://globalcarbonbudget.org/datahub/the-latest-gcb-data-2025/
- NOAA Global Monitoring Laboratory CO₂ trends: https://gml.noaa.gov/ccgg/trends/
- NOAA global CO₂ trend: https://gml.noaa.gov/ccgg/trends/gl_trend.html

## Interpretation boundary

This public version is conceptual and educational. It does not make quantitative climate forecasts, estimate future warming, or claim to reproduce the full Earth carbon cycle. The future sandbox uses transparent, simplified assumptions to teach stock–flow logic.

## Public/private boundary

No credentials, private datasets, unpublished notes, proprietary parameters, or hidden research materials are embedded in this demo.

## Author

**Arya Kia**  
System Dynamics · energy systems · carbon-cycle research
