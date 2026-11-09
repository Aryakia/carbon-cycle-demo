# Publication traceability matrix

This file is the human-readable provenance map from research question to repository artifact.

| Scientific item | Repository source | Status | Permitted interpretation |
| --- | --- | --- | --- |
| Global historical reference data | `data/historical-reference-2000-2025.js` | frozen canonical layer | empirical reference |
| Measurement mapping | `model/historical-mapping.js` | implemented | proxy/driver definitions |
| Train/holdout split | `model/historical-drivers.js` | frozen before Stage 14 | 2000–2017 train; 2018–2025 original holdout |
| Identifiability screen | `model/identifiability-screen.js` | completed | pre-calibration local sensitivity/confounding diagnostic |
| Stage 14 dependency calibration | `model/dependency-calibration.js` | completed/frozen | training-only reduced-model test |
| Stage 14 frozen fit | `data/stage14-dependency-fit.js` | immutable reference result | may be cited as training result |
| Stage 15 holdout evaluation | `model/dependency-validation.js` | completed | genuine first holdout test |
| Stage 15 frozen validation | `data/stage15-dependency-validation.js` | immutable reference result | may be cited as holdout result |
| Stage 16 residual diagnosis | `model/residual-diagnosis.js` | completed | post-validation structural diagnosis only |
| Stage 16 frozen diagnosis | `data/stage16-residual-diagnosis.js` | immutable reference result | association, not causality |
| Stage 17 rolling-origin comparison | `model/rolling-origin-comparison.js` | completed | internal post-validation structural comparison |
| Stage 17 frozen result | `data/stage17-rolling-origin-result.js` | immutable reference result | supports measurement-variable ranking internally |
| Stage 18 predeclared panel | `data/stage18-spatial-transfer-panel.js` | frozen before scoring | spatial/target-domain transfer data |
| Stage 18 transfer protocol | `model/spatial-transfer-validation.js` | frozen before primary scoring | primary spatial-transfer test |
| Stage 18 frozen result | `data/stage18-spatial-transfer-result.js` | immutable primary result | supports observable-ranking transfer, not universal beta |
| Stage 18 methods | `docs/STAGE18_SPATIAL_TRANSFER.md` | written before result | publication methods source |
| Stage 19 influence analysis | `model/stage19-influence-analysis.js` | secondary analysis after Stage 18 freeze | tests single-country influence only |
| Stage 19 frozen result | `data/stage19-influence-result.js` | immutable secondary result | confirms ranking survives every one-country omission |
| Software citation | `CITATION.cff` | existing | software citation |
| Version history | `CHANGELOG.md` | existing | research software provenance |

## Rules for manuscript preparation

1. Numerical claims must trace to a frozen result module or deterministic computation.
2. Training-only quantities must never be described as validated.
3. Stage 15 is the only pristine temporal holdout for the Stage 14 structure.
4. After Stage 15, 2018–2025 is considered consumed.
5. Stage 17 is internal rolling-origin structural development, not external validation.
6. Stage 18 is spatial/target-domain transfer and is nested within the global aggregate, so it is not statistically independent external validation.
7. Any model change made after inspecting a frozen test result must receive a new stage number.
8. Robustness analyses must not silently replace the primary protocol.
9. Parameter values are not physical constants unless independently supported and stable across folds/cases.
10. Every figure/table should record the commit SHA used to generate it.

## Recommended result object schema

Every future frozen result should include:

- stage;
- research question;
- protocol version;
- data period;
- training/test boundaries;
- candidate set;
- selected model;
- performance metrics;
- benchmark metrics;
- parameter ranges;
- claim boundary;
- source commit;
- whether data were inspected before protocol freeze;
- whether parameters were retuned after evaluation.

This schema is intended to make the eventual supplement auditable without relying on narrative reconstruction.
