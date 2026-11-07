# Stage 9 — reproducibility and research-interface UX

## Goal

Make an interactive result shareable as an exact model configuration rather than requiring another user to manually reproduce slider positions.

## Advanced laboratory

The advanced laboratory serializes its ten visible controls:

- carbon price;
- fossil subsidy / penalty;
- fossil investment incentive;
- clean investment;
- accelerated retirement;
- expected future fossil demand;
- institutional resistance;
- clean learning rate;
- resource-development cost;
- policy implementation delay.

A copied URL stores only these explicit scenario inputs. It does not serialize hidden model state, credentials or personal information.

When a serialized URL is opened, the page applies those values to the tested default engine and labels the result a shared custom scenario.

### Exports

CSV includes the principal annual/quarterly research outputs:

- year;
- atmospheric CO2;
- fossil-to-atmosphere flow;
- extraction;
- production capacity;
- fossil-demand capital;
- clean capital;
- institutional support;
- diagnosed natural uptake;
- atmospheric growth;
- cumulative extraction;
- cumulative fossil-to-atmosphere transfer.

JSON adds the exact parameter vector and a compact 2100 summary.

## Comparative experiments

The experiment page now:

- stores the active experiment in the URL;
- provides one shared scenario-visibility legend for all charts;
- uses distinct line styles in addition to colors;
- filters the results table with the same visibility state;
- exports all visible experiment trajectories to CSV.

## Reproducibility boundary

A scenario link reproduces the same model inputs **for the deployed code version at the time it is opened**. Long-term archival reproducibility requires a tagged software release or commit SHA.

A future release workflow should therefore include:

1. semantic version tags;
2. `CITATION.cff`;
3. changelog;
4. archived release/DOI where appropriate;
5. model version/commit identifier in exported JSON.
