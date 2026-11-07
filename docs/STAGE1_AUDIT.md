# Stage 1 audit — scientific foundation

## Scope reviewed

The repository currently contains a static GitHub Pages application, a single-file interactive game (`game.html`), an older `index.html`, project documentation, and a Pages workflow that copies `game.html` to the deployed `index.html`.

### Working features that must be preserved

- Historical CO₂ replay and animation.
- Atmospheric bathtub metaphor.
- Fossil-carbon resource comparison.
- Carbon ledger and ppm ↔ GtC display.
- Policy Lab controls.
- Sink outlet and slow geological-return explanation.
- System map, source/limitations material, and presenter mode.
- Responsive static deployment through GitHub Pages.

## Scientific strengths

1. The existing interface already distinguishes the atmospheric stock from a much larger fossil-resource comparison frame.
2. It explicitly warns that resources are not reserves or a climate-safe budget.
3. It distinguishes historical/reference material from the forward sandbox.
4. The sink pathway is no longer shown as an immediate return to fossil resources.
5. The app states that the forward sandbox is educational rather than predictive.

## Scientific weaknesses identified

1. **No executable conservation test.** The atmospheric equation is described in prose, but there was no reusable function or automated residual check.
2. **Historical interpolation can look more precise than the data warrant.** The UI should continue to label the path as reference/interpolated rather than annual reconstructed observations.
3. **Natural sinks are simplified in the sandbox.** A fixed uptake share is useful pedagogically, but it is not a physical carbon-cycle response model and should not be presented as one.
4. **Extraction and emissions were effectively compressed into one upstream flow.** A research-oriented version needs at least a fuel-inventory / use delay and a distinction between combustion and non-combustion uses.
5. **No endogenous explanation for persistent fossil flows.** The existing Policy Lab changes emissions directly; it does not yet show how profitability, capacity, demand infrastructure, learning, institutional support, and capital retirement mediate policy effects.
6. **No automated reproducibility, nonnegativity, or time-step checks.**
7. **The science and UI are tightly coupled in one HTML file.** This is convenient for Pages but makes model review and testing difficult.

## Architecture decision

Do **not** rewrite the public game or introduce a heavy framework.

Instead:

- keep `game.html` as the stable beginner/presenter experience;
- add dependency-free ES modules under `model/`;
- add deterministic tests under `tests/`;
- build the advanced upstream laboratory as a separate static page that imports the tested model modules;
- keep GitHub Pages as the deployment target.

This separates the simulation engine from the public visualization while preserving the existing deployment model.

## Evidence hierarchy

The project now uses four labels:

- **Observed / assessed:** published observations or synthesis values such as Global Carbon Budget and IPCC benchmarks.
- **Accounting identity:** mass-balance and unit-conversion relationships.
- **Simplifying behavioral assumption:** transparent numerical relationships introduced for the educational/research sandbox.
- **Research hypothesis:** causal mechanisms to be investigated rather than treated as established universal laws.

## Stage 1 implementation status

Implemented on the Stage 1 branch:

- scientific benchmark module;
- explicit atmospheric carbon-balance function;
- unit-conversion functions;
- endogenous upstream prototype with separate extraction, fuel inventory, combustion, non-combustion product carbon, capacity, demand capital, clean capital, capability, and institutional support;
- fossil-transfer bookkeeping residual;
- automated model checks;
- scientific methods and upstream-model documentation.

The upstream model is **not calibrated or validated**. Its behavioral parameters are placeholders for sensitivity analysis and later evidence-based estimation.
