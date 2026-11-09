# Publication reproducibility guide

## Canonical repository

`Aryakia/carbon-cycle-demo`

## Reproduce deterministic research checks

```bash
npm test
```

The test suite recomputes frozen calibration, validation and structural-comparison results from source data and checks exact numerical agreement.

## Primary publication artifacts

- `data/historical-reference-2000-2025.js`
- `data/stage14-dependency-fit.js`
- `data/stage15-dependency-validation.js`
- `data/stage16-residual-diagnosis.js`
- `data/stage17-rolling-origin-result.js`
- `data/stage18-spatial-transfer-panel.js`

## Why frozen result modules are committed

Frozen result modules serve three purposes:

1. preserve what was known/selected at each research stage;
2. prevent later structural changes from silently rewriting prior findings;
3. allow exact regression tests between the historical scientific record and current executable code.

They are not substitutes for recomputation. Tests must reproduce them from the versioned source data and model logic.

## Data-source policy

Where possible, repository data are copied from stable public data exports with:

- original provider retained;
- processor identified separately;
- exact source URL recorded;
- unit and temporal coverage documented;
- transformations implemented in code rather than manually in spreadsheets.

## Publication archive recommendation

Before journal submission:

1. create a tagged software release;
2. archive that release to Zenodo or another DOI-granting repository;
3. generate all manuscript figures/tables from that tagged release;
4. record the release DOI and Git commit in the manuscript supplement;
5. preserve the exact source-data retrieval metadata and licenses.

## Computational environment

The empirical testing code is intentionally dependency-light JavaScript/Node so the main results can be reproduced without proprietary system-dynamics software.

The larger public research engine remains a system-dynamics model, but the reduced calibration/validation tests are deliberately isolated into transparent modules that can be independently inspected and ported to R, Python, Vensim, Stella or Stan.

## Future Bayesian replication

If the reduced relationship becomes publication-worthy after Stage 18, a Bayesian replication should be implemented as a **secondary confirmation**, not as a replacement for the frozen deterministic protocol.

Recommended Bayesian goals:

- quantify posterior uncertainty in beta;
- test whether a nonzero dynamic tau is supported away from its lower bound;
- use hierarchical country effects for the spatial panel;
- perform prior-predictive and synthetic-data recovery checks.

This follows the workflow principles described by Andrade & Duggan (2021), DOI: 10.1002/sdr.1693.
