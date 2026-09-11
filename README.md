# Carbon Beyond the Bathtub

**Interactive System Dynamics demo of atmospheric CO₂ as a stock embedded in a much larger carbon system.**

**GitHub Pages preview:** https://aryakia.github.io/carbon-cycle-demo/

| | |
|---|---|
| **Project type** | Interactive systems demo · carbon cycle · stock–flow learning game |
| **Role** | Creator and model designer |
| **Status** | Public conceptual prototype |
| **Model type** | Historical reference replay + simplified what-if stock–flow sandbox |
| **Deployment** | Static HTML · GitHub Pages |
| **Public disclosure** | Published scientific context only; no private data or hidden model parameters |

## Experience

The main interaction is deliberately game-like rather than a static chart:

- drag a **time slider from 1750 to 2026** and watch the atmospheric bathtub level change with CO₂ concentration;
- press **Play** to animate the historical accumulation;
- compare the atmospheric stock with a much larger upstream fossil-carbon resource frame;
- switch to **What-if** mode for 2026–2100;
- change anthropogenic inflow, land/ocean uptake, and durable carbon removal;
- see whether the bathtub rises, stabilizes, or falls;
- inspect the connected atmosphere, ocean, biomass, soil, and geological stocks.

The visual design intentionally puts the upstream geological stock and atmospheric bathtub side by side while keeping their different scales explicit.

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

The demo uses a current-era NOAA atmospheric CO₂ reference and published historical/reference anchors for the time slider. The purpose is to communicate stock accumulation and scale; it is not a replacement for the full NOAA observational dataset.

The Global Carbon Budget 2025 reports:

- atmospheric CO₂ in 2024: **422.80 ± 0.1 ppm**
- atmospheric carbon stock in 2024: **898 GtC**
- cumulative anthropogenic CO₂ emissions, 1850–2024: **745 ± 65 GtC**
- cumulative fossil CO₂ emissions, 1850–2024: **495 ± 25 GtC**
- over 2015–2024, approximately **50%** of total anthropogenic CO₂ emissions accumulated in the atmosphere, while **29%** was absorbed by the ocean and **21%** by land

## Historical mode

The time slider moves from **1750 to 2026** and updates:

- atmospheric CO₂ concentration;
- bathtub water level;
- upstream fossil-resource gauge;
- cumulative fossil-carbon transfer represented in the resource comparison;
- position on the CO₂ time-series graph.

Atmospheric CO₂ uses published historical/reference anchors. The fossil-resource gauge interpolates between published cumulative-emissions benchmarks; it is a communication device, not a reconstruction of every annual emissions value.

## What-if mode

The future sandbox runs from **2026 to 2100** and lets the user change:

- fossil + land-use inflow;
- the share taken up by land and ocean;
- additional durable carbon dioxide removal (CDR).

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

## Scientific sources

- IPCC AR6 Working Group I, Chapter 5, especially Figure 5.12 and Table 5.1: https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/
- Global Carbon Budget 2025, Friedlingstein et al. (2026), *Earth System Science Data*: https://essd.copernicus.org/articles/18/3211/2026/
- Global Carbon Project data hub: https://globalcarbonbudget.org/datahub/the-latest-gcb-data-2025/
- NOAA Global Monitoring Laboratory CO₂ trends: https://gml.noaa.gov/ccgg/trends/

## GitHub Pages deployment

The site is deployed directly from `main` with `.github/workflows/pages.yml`. The workflow packages only the static site and publishes it through GitHub Pages.

For a new repository, GitHub Pages must be enabled once under **Settings → Pages → Build and deployment → Source → GitHub Actions**. After that, every push to `main` republishes the preview automatically.

## Interpretation boundary

This public version is conceptual and educational. It does not make quantitative climate forecasts, estimate future warming, or claim to reproduce the full Earth carbon cycle. The future sandbox uses transparent, simplified assumptions to teach stock–flow logic.

## Public/private boundary

No credentials, private datasets, unpublished notes, proprietary parameters, or hidden research materials are embedded in this demo.

## Author

**Arya Kia**  
System Dynamics · energy systems · carbon-cycle research
