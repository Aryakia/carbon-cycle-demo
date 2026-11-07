# Changelog

All notable public research-software changes are summarized here.

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
