import { SCIENCE } from "./scientific-benchmarks.js";

export function ppmToGtC(ppm) {
  return ppm * SCIENCE.ppmToGtC;
}

export function gtCToPpm(gtC) {
  return gtC / SCIENCE.ppmToGtC;
}

export function gtCToGtCO2(gtC) {
  return gtC * SCIENCE.gtCToGtCO2;
}

export function gtCO2ToGtC(gtCO2) {
  return gtCO2 / SCIENCE.gtCToGtCO2;
}

/**
 * Atmospheric control-volume balance.
 *
 * dC_atm/dt =
 *   fossil + industrial emissions
 * + net land-use emissions
 * - net land uptake
 * - net ocean uptake
 * - durable removals
 *
 * All flows are GtC/yr, stock is GtC, dt is years.
 */
export function stepAtmosphere(input) {
  const {
    atmosphereGtC,
    fossilIndustrialGtCPerYr = 0,
    landUseGtCPerYr = 0,
    landSinkGtCPerYr = 0,
    oceanSinkGtCPerYr = 0,
    durableRemovalGtCPerYr = 0,
    dtYears = 1,
  } = input;

  const netGtCPerYr =
    fossilIndustrialGtCPerYr +
    landUseGtCPerYr -
    landSinkGtCPerYr -
    oceanSinkGtCPerYr -
    durableRemovalGtCPerYr;

  const nextAtmosphereGtC = atmosphereGtC + netGtCPerYr * dtYears;
  const accountingExpected = atmosphereGtC + netGtCPerYr * dtYears;
  const residualGtC = nextAtmosphereGtC - accountingExpected;

  return {
    nextAtmosphereGtC,
    netGtCPerYr,
    residualGtC,
    nextPpm: gtCToPpm(nextAtmosphereGtC),
  };
}

export function atmosphericIncreaseSincePreindustrialGtC(ppm) {
  return ppmToGtC(ppm - SCIENCE.preindustrialPpm);
}

export function assertFiniteNonnegative(name, value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be finite and nonnegative; received ${value}`);
  }
}
