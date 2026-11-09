# Carbon Beyond the Bathtub

**Interactive System Dynamics demo of atmospheric CO₂ as a stock embedded in a much larger carbon system.**

**GitHub Pages preview:** https://aryakia.github.io/carbon-cycle-demo/

**Advanced upstream laboratory:** https://aryakia.github.io/carbon-cycle-demo/upstream.html

**Deep-time CO₂ perspective:** https://aryakia.github.io/carbon-cycle-demo/paleoclimate.html

**Comparative policy experiments:** https://aryakia.github.io/carbon-cycle-demo/experiments.html

**Interactive causal architecture:** https://aryakia.github.io/carbon-cycle-demo/feedbacks.html

**Voluntary learning self-assessment:** https://aryakia.github.io/carbon-cycle-demo/assessment.html

**Validation & methods dashboard:** https://aryakia.github.io/carbon-cycle-demo/validation.html

**Historical empirical reference:** https://aryakia.github.io/carbon-cycle-demo/history.html

**Calibration dashboard:** https://aryakia.github.io/carbon-cycle-demo/calibration.html

**Held-out validation:** https://aryakia.github.io/carbon-cycle-demo/holdout.html

**Residual diagnosis:** https://aryakia.github.io/carbon-cycle-demo/diagnosis.html

**Structural comparison:** https://aryakia.github.io/carbon-cycle-demo/comparison.html

> Research-mode status: the upstream model is a transparent behavioral-hypothesis sandbox. Its carbon accounting and structural-reference initialization are tested, but its behavioral coefficients are not historically calibrated or out-of-sample validated.

[Five-minute demonstration and visual model guide](docs/VISUAL_CASE_STUDY.md)

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

## Scientific model architecture

The project now separates scientific logic from the public visualization:

- `model/scientific-benchmarks.js` — dated benchmark constants and source links.
- `model/conservation.js` — ppm/GtC/GtCO₂ conversions and the atmospheric control-volume balance.
- `model/upstream-engine.js` — endogenous investment, capacity, extraction, inventory, combustion, product-carbon, clean substitution, capability, and institutional-support hypotheses.
- `tests/model.test.mjs` — deterministic accounting, nonnegativity, reproducibility, scenario-direction, and time-step checks.
- `upstream.html` — the advanced “Why Is the Faucet Still Open?” laboratory.
- `docs/SCIENTIFIC_METHODS.md` — evidence hierarchy, sources, and carbon-accounting boundaries.
- `docs/UPSTREAM_MODEL_SPEC.md` — equations, feedback hypotheses, and parameter-status documentation.
- `docs/STAGE1_AUDIT.md` — repository and scientific audit.

The public bathtub game remains the beginner/presenter experience. The advanced lab is intentionally separate so research hypotheses do not get confused with established carbon-cycle science.


## Deep-time historical context

The optional `paleoclimate.html` module uses the NOAA/WDS **Antarctic Ice Cores Revised 800KYr CO₂ Data** composite (Bereiter et al., 2015; dataset DOI `10.25921/n8y4-bp27`).

Design rules:

- the page attempts to load the complete NOAA composite at runtime;
- a local sparse fallback contains only actual NOAA observations and preserves irregular spacing;
- the interface does not fabricate an annual 800,000-year time series;
- ice-core observations are visually separated from the modern Global Carbon Budget marker;
- the older Lüthi et al. composite is not used as the preferred source because NOAA's revised composite states that it supersedes the older version where analytical bias and lower-quality sections were identified.

The deep-time module is explanatory context, not part of the upstream behavioral simulation.


## Comparative experiments

The `experiments.html` module uses named, reproducible cases from `model/experiments.js` to compare:

- business as usual and alternative policy packages;
- early versus delayed intervention;
- low versus high institutional resistance;
- less versus more fossil-dependent initial conditions;
- stylized supply-side, demand-side, and coordinated policies.

The upstream engine now includes an explicit policy start year. Policy-controlled carbon pricing, fossil subsidy, fossil investment incentives, clean investment, and accelerated retirement enter through the implementation ramp instead of appearing instantaneously.

The current experiment tests verify only **internal model consequences**. In particular, under the current equations, earlier coordinated action, lower institutional resistance, and a less fossil-dependent starting system produce lower cumulative fossil-to-atmosphere transfer than their paired alternatives. These are not calibrated empirical effect sizes.


## Causal architecture and learning assessment

The `feedbacks.html` page provides an interactive causal-loop view of R1 infrastructure lock-in, R2 accumulated capability, R3 institutional dependence, B1 climate-policy response, and B2 clean substitution. Users can isolate a feedback or trace where a policy lever enters the causal structure.

The `assessment.html` page provides a six-question voluntary pre/post self-assessment covering stock-flow accumulation, policy delays, resource interpretation, path dependence, extraction versus emission, and natural sinks.

The assessment is deliberately **local-only**:

- no identifying information is requested;
- responses are not transmitted;
- no persistent browser storage is used;
- pre-check answers live only in page memory;
- corrections are revealed only after the post-check;
- results are labeled educational feedback, not validated research findings.

A future participant study would require a separate protocol, validated instruments, consent/privacy safeguards, and any applicable institutional ethics review before response collection is enabled.


## Validation status

The repository now distinguishes **verification** from **empirical validation**.

Implemented verification includes:

- carbon-unit and stock-flow accounting checks;
- atmospheric and fossil-transfer mass-balance residuals;
- nonnegative physical-stock checks;
- deterministic reproducibility;
- paleoclimate data-integrity checks;
- named-scenario consistency checks;
- static Pages/accessibility checks;
- educational-assessment privacy checks;
- complete parameter metadata coverage;
- one-at-a-time sensitivity screening;
- time-step stability tests.

The maximum supported integration step is 0.25 year. The default quarterly run is checked against finer 0.125 and 0.0625-year resolutions.

The upstream behavioral model remains **uncalibrated and not out-of-sample validated**. See `docs/VALIDATION_REPORT.md`, `docs/MODEL_COMPARISON.md`, and `docs/RESEARCH_ROADMAP.md`.


## Structural reference mode

The advanced model no longer labels its no-additional-intervention case “business as usual.”

The default is now a **Structural reference**: a neutral initialization test in which the 2025 Global Carbon Budget fossil-flow benchmark (10.4 GtC/yr), the current clean-capital state, and normal replacement conditions are designed to approximately reproduce themselves unless an explicit driver changes them.

This change corrects two problems in the previous prototype:

1. the 10.4 GtC/yr fossil benchmark was being multiplied by a clean-share term even though it already represented fossil emissions; and
2. fossil-dependent demand capital and clean capital were not replacement-compatible, embedding a strong autonomous transition in the no-policy case.

The Structural reference is **not a forecast** and is not forced to reproduce the IEA Current Policies Scenario. See `docs/STAGE7_REFERENCE_MODE.md`.


## Dynamic carbon-cycle closure

The **beginner bathtub remains intentionally simple**, but the advanced research engine no longer assumes that land/ocean uptake is a fixed fraction of current emissions.

Its atmospheric response now uses four CO₂ response pools based on the Joos et al. (2013) / IPCC AR5 impulse-response coefficients. A single lifetime multiplier (`alpha = 0.555`) and a non-negative 1959 legacy state are calibrated to the Global Carbon Budget 2025 atmospheric-stock history.

Validation results:

- 1959–2024 concentration RMSE ≈ **1.19 ppm**;
- maximum absolute historical error ≈ **2.98 ppm**;
- 2024 endpoint = **422.8 ppm** by calibration constraint;
- independent 2025 one-year prediction = **425.16 ppm**, versus the preliminary GCB value of **425.6 ppm**;
- a small 0.44 ppm observation-assimilation residual initializes the 2025 state.

The advanced model diagnoses combined net natural uptake from carbon conservation. It does not claim a unique land/ocean split and is not a full FaIR or Earth-system implementation.

See `docs/STAGE8_DYNAMIC_CARBON_CYCLE.md` and `docs/VALIDATION_REPORT.md`.


## Reproducible scenarios and exports

The advanced laboratory and comparative-experiment interface now support reproducible sharing:

- **Copy scenario link** serializes all user-facing advanced-lab control values into the URL query string.
- Opening that link reconstructs the same control state before the simulation is rendered.
- **Export CSV** provides time-series results in research-friendly tabular form.
- **Export JSON** from the advanced lab includes the parameter vector, 2100 summary and exported time series.
- Comparative experiments can be linked directly with `?experiment=<id>`.
- A shared experiment legend controls scenario visibility across every chart and the results table.
- Experiment trajectories use both color and line style so comparisons do not rely on color alone.

The serialization and CSV functions live in `ui/scenario-io.js` and have automated round-trip/escaping tests.


## Research software versioning and canonical source

The current public research-software version is **v0.3.0**.

- `game.html` is the canonical source for the public homepage.
- The GitHub Pages workflow copies `game.html` to the deployed `index.html`; the obsolete repository-root prototype `index.html` has been removed to prevent accidental edits to a non-deployed page.
- `CITATION.cff` provides software citation metadata.
- `CHANGELOG.md` records notable scientific, modeling, validation, and interface changes.
- `model/version.js` exposes the software version to research exports and the advanced interface.

The advanced laboratory also provides an **Evidence** control beside every visible parameter. It reads directly from `model/parameter-metadata.js` and displays the parameter's classification, status, unit, default, source/rationale, and role in the model.


## Historical empirical reference dataset

Stage 11 adds a canonical 2000–2025 empirical layer before upstream behavioral calibration.

Continuous series:

- Global Carbon Budget fossil CO₂;
- Global Carbon Budget atmospheric CO₂ history;
- IRENA global renewable power capacity (harmonized by Our World in Data);
- Energy Institute global fossil-energy production and consumption (harmonized by Our World in Data);
- World Bank world GDP in constant 2015 US$.

The model-observation mapping is explicit: renewable capacity and fossil-energy consumption are **proxies**, not silently relabeled model stocks. Fossil production capacity, investment, and institutional resistance remain documented measurement gaps until defensible observations are added.

The provisional calibration split is **2000–2017 training / 2018–2025 held-out validation**. See `history.html` and `docs/STAGE11_HISTORICAL_REFERENCE.md`.


## Calibration scaffold and holdout rule

Stage 13 freezes the first empirical split **before** behavioral optimization:

- training/calibration: **2000–2017**;
- held-out validation: **2018–2025**.

The initial upstream objective weights are:

- fossil-to-atmosphere flow: **0.40**;
- fossil-production/extraction activity shape: **0.15**;
- clean-capital proxy trajectory: **0.25**;
- fossil-demand activity proxy: **0.20**;
- atmospheric CO₂: **0.00** for upstream fitting.

Atmospheric CO₂ remains a diagnostic because the reduced carbon-cycle component was already calibrated separately.

The repository now enforces a leakage rule: held-out observations must not be used to select behavioral parameters, priors, or objective weights. Stage 13 currently provides the driver/interpolation layer and objective function; **no upstream behavioral optimizer has been run yet** because Stage 12 identified substantial parameter confounding and the production-capacity/investment observation layer is still incomplete.


## Historical backcast initialization discipline

Stage 13A prepares the 2000 starting state without hiding unsupported initial conditions.

The historical model now separates:

```text
aggregate energy activity × expected future fossil demand × fossil-dependent capital
```

Historical aggregate energy activity is mapped to observed Energy Institute total primary-energy supply, normalized to 2025. Fossil-dependent capital is provisionally initialized from a normalized **fossil share of total energy**, not absolute fossil consumption, so system growth is not counted twice.

Automatically initialized from observations/proxies:

- clean capital;
- fossil-dependency proxy;
- end-1999 calibrated carbon-cycle state;
- short fuel-inventory/product accounting stocks;
- aggregate energy-activity index.

Still explicitly latent and required as inputs:

- production capacity;
- accumulated fossil capability;
- institutional support.

No behavioral optimizer is run by Stage 13A. See `docs/STAGE13A_BACKCAST_READINESS.md`.


## Stage 14 modular historical calibration

Stage 14 begins actual parameter estimation using a small model partition. All fitted quantities are normalized to **2017**, so the 2018–2025 holdout is not used even indirectly.

Frozen training-only candidate:

- hypothesis: **renewable-capacity intensity**;
- clean elasticity: **0.016**;
- effective dependency-adjustment time: **3.0 years**;
- training RMSE: **0.00228037**;
- improvement versus persistence: **52.67%**;
- 5%-near-optimal envelope: beta **0.015–0.018**, tau **2.5–4.5 years**.

The result supports a short aggregate dependency delay but not treating global fossil share as a direct observation of a 15–35 year physical capital stock. The fit is frozen before Stage 15 opens the holdout.


## Stage 15 held-out validation

Stage 14 was merged and frozen before **2018–2025** was opened. With no retuning, the frozen dynamic model achieves RMSE **0.01372994**, an **18.02%** improvement over persistence (**0.01674750**). However, the training-selected static clean-competition model generalizes better (RMSE **0.01074925**). All frozen-model residuals are positive, so the model systematically underpredicts the post-2017 decline in fossil dependency. Excluding 2020 barely changes the result.

The Stage 14 fit is not changed after validation. The 2018–2025 holdout is now consumed and cannot be reused as pristine validation for a revised structure.


## Stage 16 residual diagnosis

Stage 16 treats the consumed 2018–2025 validation errors as diagnostic evidence, not new calibration data. All eight residuals are positive and the residual trend is about **+0.00189 per year**.

Among post-validation candidate variables, the strongest first-difference association is with low-carbon electricity share (**r = 0.872**), followed by renewable electricity share (**r = 0.713**), versus **0.583** for the existing renewable-capacity-intensity proxy. These are small-sample descriptive associations, not causal estimates.

The next structural priority is therefore to test **realized renewable/low-carbon electricity generation share rather than installed renewable capacity alone**. The revised model must use a new validation design because 2018–2025 is now consumed.


## Stage 17 rolling-origin structural comparison

Six candidate measurement/structure combinations are compared over four blocked rolling-origin folds. This is internal structural development after the original holdout was consumed.

The selected model is **static low-carbon electricity share** (renewables + nuclear generation share):

- pooled test RMSE: **0.00282569**;
- skill versus persistence: **65.08%**;
- RMSE improvement versus static renewable-capacity intensity: **52.02%**.

The dynamic low-carbon model ranks second, but its adjustment time collapses to the 0.5-year lower bound in three folds. This supports a static observable relationship over a separately identified global lag.

The fold-specific beta values (0.053, 0.079, 0.146, 0.158) are not stable, so the result supports the **measurement variable**, not one universal elasticity. Separate external validation is still required.


## Stage 18 spatial transfer test

Stage 18 tests whether the Stage 17 measurement-variable ranking transfers across a **pre-declared eight-country panel**: United States, China, India, Germany, Brazil, Japan, South Africa and Australia.

Each country uses four blocked rolling-origin folds over 2000–2024. Country-fold parameters are estimated only from their own training periods. Three observables are compared under static and dynamic forms:

- installed renewable capacity per person;
- renewable electricity share;
- low-carbon electricity share (renewables + nuclear).

The frozen primary result selects **static low-carbon electricity share**:

- 128 out-of-fold country-year observations;
- pooled RMSE **0.01492945**;
- persistence RMSE **0.02132690**;
- skill versus persistence **29.997%**;
- positive skill in **6 of 8** countries.

Both low-carbon-electricity formulations rank ahead of all renewable-capacity and renewable-share alternatives. However, country heterogeneity is substantial: Brazil's fitted beta is zero in all folds, the United States is approximately neutral versus persistence, and beta across all selected country-fold fits spans the full **0–0.25** grid.

The defensible transferable conclusion is therefore about the **measurement variable**, not a universal elasticity.

Stage 18 is a spatial/target-domain transfer test, not statistically independent external validation, because the selected countries contribute to the earlier global aggregate. See `docs/STAGE18_SPATIAL_TRANSFER.md` and `data/stage18-spatial-transfer-result.js`.
