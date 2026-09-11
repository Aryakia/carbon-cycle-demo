# Carbon Beyond the Bathtub

**Interactive System Dynamics demo of atmospheric CO₂ as a stock embedded in a much larger carbon system.**

**GitHub Pages preview:** https://aryakia.github.io/carbon-cycle-demo/

| | |
|---|---|
| **Project type** | Interactive systems demo · carbon cycle · stock–flow learning game |
| **Role** | Creator and model designer |
| **Status** | Public conceptual prototype |
| **Model type** | Historical reference replay + simplified 2026–2100 policy sandbox |
| **Deployment** | Static HTML · GitHub Pages |
| **Public disclosure** | Published scientific context only; no private data or hidden model parameters |

## Experience

The main interaction is deliberately game-like rather than a static chart:

- drag a **time slider from 1750 to 2026** and watch the atmospheric bathtub level change with CO₂ concentration;
- press **Play** to animate the historical accumulation;
- compare the atmospheric stock with a much larger upstream fossil-carbon resource frame;
- switch to **Policy Lab** for 2026–2100;
- change anthropogenic inflow, land/ocean uptake, and durable carbon removal;
- see whether the bathtub rises, stabilizes, or falls;
- follow the **sink outlet** from atmosphere into active land/ocean reservoirs, with a separately labeled very slow geological-return pathway;
- switch among **Simulation, Carbon ledger, System map, and Methods & sources** tabs;
- use **Presenter mode** to focus the interface for a live demonstration.

The visual design intentionally distinguishes three different pathways and timescales:

- **orange** — anthropogenic inflow from geological/fossil carbon into the active surface system;
- **blue** — uptake into land and ocean sinks;
- **green** — much slower burial / long-term geological return.

This avoids implying that carbon removed from the atmosphere immediately rebuilds fossil stocks.

## Carbon ledger

The game now shows carbon equivalents alongside the visual stocks. For the selected year it reports:

- geological resource-frame carbon remaining;
- cumulative fossil-carbon transfer represented by the resource comparison;
- atmospheric CO₂ concentration in ppm;
- approximate atmospheric carbon mass using **≈2.12 GtC per ppm**;
- atmospheric carbon increase above the 278 ppm pre-industrial reference;
- land/ocean sink flow in Policy Lab when that flow is explicitly simulated.

The interface deliberately leaves historical annual sink flow unquantified because the historical replay does not reconstruct a complete annual land/ocean carbon budget. This is preferable to creating false precision.

**Unit note:** 1 PgC = 1 GtC, so the numerical values are the same when expressed as petagrams or gigatonnes of carbon.

## Purpose

The familiar carbon **bathtub analogy** treats atmospheric CO₂ as the water level, anthropogenic emissions as the tap, and removals as the drain. That framing is useful, but it can hide an important systems point: the atmosphere is only one stock inside a much larger network of carbon reservoirs, and fossil extraction transfers carbon from a very large, slow geological stock into the much faster atmosphere–land–ocean system.

This demo therefore places a large upstream fossil-carbon resource tank next to the atmospheric bathtub and then makes the downstream sink pathway visible. Users can move through time, watch atmospheric CO₂ rise, and see that a relatively small transfer from the geological resource frame can generate a large change in the atmospheric stock.

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

## Historical replay

The time slider moves from **1750 to 2026** and updates:

- atmospheric CO₂ concentration;
- bathtub water level;
- approximate atmospheric carbon equivalent;
- upstream fossil-resource gauge;
- cumulative fossil-carbon transfer represented in the resource comparison;
- position on the CO₂ time-series graph.

Atmospheric CO₂ uses published historical/reference anchors. The fossil-resource gauge interpolates between published cumulative-emissions benchmarks; it is a communication device, not a reconstruction of every annual emissions value.

Historical annual land/ocean sink flow is intentionally not reconstructed in this mode.

## Policy Lab

The future sandbox runs from **2026 to 2100** and lets the user change:

- anthropogenic inflow;
- the share taken up by land and ocean;
- additional durable carbon dioxide removal (CDR).

The simplified stock equation is conceptually:

**change in atmospheric stock = anthropogenic inflow − natural uptake − durable removal**

The demo converts the resulting net carbon flow to an illustrative ppm rate using approximately **2.12 GtC per ppm**.

This is deliberately a learning model. It does not simulate carbon-cycle feedbacks, changing sink efficiency, ocean chemistry, temperature response, non-CO₂ forcing, or socioeconomic dynamics.

## Sink-loop interpretation

The drain from the atmospheric bathtub does **not** return directly to the fossil resource tank.

The visual pathway is:

**Atmosphere → land/ocean active reservoirs → very slow burial / sedimentation → geological storage**

The long-term return is shown conceptually but is not numerically simulated. This keeps the stock–flow diagram closed enough to communicate the wider carbon cycle without conflating fast biological/ocean uptake with geological sequestration timescales.

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

The site is deployed directly from `main` with `.github/workflows/pages.yml`. The workflow publishes `game.html` as the Pages homepage.

GitHub Pages is configured under **Settings → Pages → Build and deployment → Source → GitHub Actions**. Every push to `main` republishes the preview automatically.

## Interpretation boundary

This public version is conceptual and educational. It does not make quantitative climate forecasts, estimate future warming, or claim to reproduce the full Earth carbon cycle. The future sandbox uses transparent, simplified assumptions to teach stock–flow logic.

## Public/private boundary

No credentials, private datasets, unpublished notes, proprietary parameters, or hidden research materials are embedded in this demo.

## Author

**Arya Kia**  
System Dynamics · energy systems · carbon-cycle research
