# Changelog

All notable public research-software changes are summarized here.

## [0.4.0] — 2026-11-09

### Empirical calibration and validation
- Added the canonical 2000–2025 historical empirical reference layer and explicit model-observation mappings.
- Added pre-calibration identifiability screening and literature-constrained parameter priors.
- Froze the 2000–2017 training / 2018–2025 validation split before reduced-model calibration.
- Added Stage 14 training-only fossil-dependency calibration and an immutable frozen fit.
- Added Stage 15 genuine held-out 2018–2025 validation with no post-holdout retuning.
- Added Stage 16 residual diagnosis after the original holdout was consumed.
- Added Stage 17 blocked rolling-origin comparison of installed-capacity, renewable-share, and low-carbon-electricity-share hypotheses.

### Spatial transfer and robustness
- Added a pre-declared eight-country 2000–2024 transfer panel spanning heterogeneous energy-system structures.
- Added Stage 18 spatial/target-domain transfer testing over 128 out-of-fold country-year observations.
- Froze the primary Stage 18 result: static low-carbon electricity share ranks first and improves pooled RMSE by about 30% versus persistence.
- Added Stage 19 leave-one-country-out influence analysis; the Stage 18 ranking remains first under all eight omissions.
- Explicitly retained parameter heterogeneity and boundary fits rather than reporting a universal elasticity.

### Publication reproducibility
- Added a manuscript blueprint, primary-results registry, traceability matrix, and reproducibility guide.
- Added frozen result modules and exact regression tests so historical scientific decisions reproduce from source data and executable code.
- Recorded claim boundaries distinguishing training fit, genuine holdout validation, post-validation structural development, spatial transfer, robustness analysis, and statistically independent external validation.
- Kept the full upstream behavioral model's partially calibrated status distinct from the reduced empirical fossil-dependency hypothesis.


## [0.3.0] — 2026-11-07

### Scientific corrections
- Replaced the misleading uncalibrated “Business as usual” advanced scenario with a neutral **Structural reference**.
- Corrected double application of the clean-share signal to the current fossil-flow benchmark.
- Reinitialized fuel inventory, product carbon, and clean-capital replacement conditions consistently.
- Removed redundant/inactive upstream parameters.
- Added automated structural-reference realism and UI/model consistency checks.

### Carbon-cycle model
- Replaced the advanced model's fixed natural-sink fraction with a four-timescale reduced-form atmospheric CO2 response.
- Retained published Joos/IPCC response fractions and nominal time constants.
- Historically calibrated one lifetime scale and a non-negative legacy state against Global Carbon Budget 2025 atmospheric history.
- Added 1959–2024 historical validation and an independent 2025 one-year check.
- Kept the beginner bathtub drain intentionally simple for teaching.

### Reproducibility and interface
- Added shareable advanced-scenario URLs.
- Added CSV and JSON exports.
- Added URL-addressable comparative experiments.
- Added one synchronized visibility legend across comparative charts and tables.
- Added line styles in addition to color for scenario distinction.
- Added parameter provenance/status metadata and validation dashboard.

### Documentation
- Added scientific methods, model specification, validation report, model comparison, research roadmap, and staged development records.
- Added `CITATION.cff`.
- Began semantic software versioning at v0.3.0.

## Earlier prototype stages

Earlier development introduced the interactive bathtub, carbon ledger, upstream fossil-carbon comparison, policy laboratory, deep-time CO2 context, causal-loop architecture, comparative experiments, local-only learning assessment, and automated verification framework.
