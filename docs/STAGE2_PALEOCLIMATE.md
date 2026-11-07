# Stage 2 — historical and geological-scale context

## Implemented

- Added an optional 800,000-year atmospheric CO₂ view.
- Preferred the revised NOAA/WDS Antarctic composite associated with Bereiter et al. (2015), rather than the superseded older composite.
- Preserved the source's calendar-year-before-1950 age convention.
- Separated paleoclimate ice-core observations from the modern 2024 Global Carbon Budget marker.
- Added a scale bridge comparing the IPCC fossil-resource frame (18,635 GtC) with atmospheric stocks (~898 GtC in 2024; ~590 GtC around 1750).
- Added explicit warnings that resources are not reserves, total geological carbon, economic supply, or a climate-compatible carbon budget.
- Added paleoclimate data-integrity tests and GitHub Pages packaging.

## Data handling

The page attempts to fetch the full NOAA source file at runtime. If that fetch is unavailable, it uses a local fallback made only from actual source observations. The fallback is intentionally sparse and irregularly spaced. It is not an interpolated annual reconstruction.

The plotted connecting line is a visual guide only.

## Scientific boundary

This module does not simulate glacial cycles. It provides observed/reconstructed context for atmospheric CO₂. It does not infer a single cause for ancient CO₂ changes, nor does it treat land or ocean sinks as fixed-capacity drains.

## Primary sources

- NOAA/WDS Paleoclimatology, Antarctic Ice Cores Revised 800KYr CO₂ Data, DOI 10.25921/n8y4-bp27.
- Bereiter et al. (2015), *Geophysical Research Letters*, DOI 10.1002/2014GL061957.
- Friedlingstein et al., Global Carbon Budget 2025, *Earth System Science Data* (2026).
- IPCC AR6 Working Group I, Chapter 5.
