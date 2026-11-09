import { HISTORICAL_REFERENCE_ROWS } from "../data/historical-reference-2000-2025.js";
import { STAGE15_FROZEN_DEPENDENCY_VALIDATION } from "../data/stage15-dependency-validation.js";
import { STAGE16_DIAGNOSTIC_ELECTRICITY } from "../data/stage16-diagnostic-variables.js";

function mean(xs){return xs.reduce((a,b)=>a+b,0)/xs.length}
function pearson(xs,ys){
  const mx=mean(xs),my=mean(ys);
  const dx=xs.map(x=>x-mx),dy=ys.map(y=>y-my);
  const num=dx.reduce((s,x,i)=>s+x*dy[i],0);
  const den=Math.sqrt(dx.reduce((s,x)=>s+x*x,0)*dy.reduce((s,y)=>s+y*y,0));
  return den===0?NaN:num/den;
}
function slope(xs,ys){
  const mx=mean(xs),my=mean(ys);
  return xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/
    xs.reduce((s,x)=>s+(x-mx)**2,0);
}
function differences(xs){return xs.slice(1).map((x,i)=>x-xs[i])}
function ref(year){
  const r=HISTORICAL_REFERENCE_ROWS.find(x=>x.year===year);
  if(!r)throw new Error("missing historical row "+year);
  return r;
}
function elec(year){
  const r=STAGE16_DIAGNOSTIC_ELECTRICITY.find(x=>x.year===year);
  if(!r)throw new Error("missing diagnostic electricity row "+year);
  return r;
}

export function buildStage16ResidualRows(){
  return STAGE15_FROZEN_DEPENDENCY_VALIDATION.primaryModel.rows.map(v=>{
    const h=ref(v.year),e=elec(v.year);
    const capacityIntensity=h.renewableCapacityGw/h.totalEnergySupplyTWh;
    const energyIntensityPerTrillionUsd=
      h.totalEnergySupplyTWh/(h.worldGdpConstant2015Usd/1e12);
    const fossilIntensityPerTrillionUsd=
      h.fossilEnergyConsumptionTWh/(h.worldGdpConstant2015Usd/1e12);
    return Object.freeze({
      year:v.year,
      residual:v.predicted-v.observed,
      observedFossilDependency:v.observed,
      predictedFossilDependency:v.predicted,
      renewableElectricitySharePct:e.renewableElectricitySharePct,
      nuclearElectricitySharePct:e.nuclearElectricitySharePct,
      lowCarbonElectricitySharePct:
        e.renewableElectricitySharePct+e.nuclearElectricitySharePct,
      renewableGenerationTWh:e.renewableGenerationTWh,
      renewableCapacityIntensity:capacityIntensity,
      energyIntensityPerTrillionUsd,
      fossilIntensityPerTrillionUsd,
    });
  });
}

function association(rows,key){
  const residual=rows.map(r=>r.residual),x=rows.map(r=>r[key]);
  const dr=differences(residual),dx=differences(x);
  return Object.freeze({
    levelPearson:pearson(residual,x),
    firstDifferencePearson:pearson(dr,dx),
    levelN:rows.length,
    differenceN:dr.length,
    warning:
      "Descriptive association on a consumed eight-year holdout; not causal evidence and not a parameter-estimation statistic.",
  });
}

export function diagnoseStage16Residuals(){
  const rows=buildStage16ResidualRows();
  const years=rows.map(r=>r.year),residuals=rows.map(r=>r.residual);
  const associations=Object.freeze({
    renewableElectricitySharePct:association(rows,"renewableElectricitySharePct"),
    renewableGenerationTWh:association(rows,"renewableGenerationTWh"),
    renewableCapacityIntensity:association(rows,"renewableCapacityIntensity"),
    lowCarbonElectricitySharePct:association(rows,"lowCarbonElectricitySharePct"),
    nuclearElectricitySharePct:association(rows,"nuclearElectricitySharePct"),
    energyIntensityPerTrillionUsd:association(rows,"energyIntensityPerTrillionUsd"),
    fossilIntensityPerTrillionUsd:association(rows,"fossilIntensityPerTrillionUsd"),
  });
  return Object.freeze({
    rows,
    residualTrendPerYear:slope(years,residuals),
    meanResidual:mean(residuals),
    allResidualsPositive:residuals.every(x=>x>0),
    associations,
    diagnosticOnly:true,
    holdoutConsumed:true,
  });
}

export const STAGE16_STRUCTURAL_HYPOTHESES = Object.freeze([
  Object.freeze({
    id:"generation-not-capacity",
    priority:"high",
    mechanism:
      "Delivered renewable electricity, rather than installed renewable capacity alone, may better represent actual fossil displacement.",
    evidenceNeeded:
      "Renewable generation/share, curtailment/capacity-factor context, and technology-specific generation.",
    modelChangeCandidate:
      "Replace or complement capacity-intensity clean competition with realized renewable/low-carbon generation share.",
    validationRule:
      "May be developed using the consumed 2000-2025 record, but must not claim 2018-2025 as untouched validation.",
  }),
  Object.freeze({
    id:"efficiency-electrification",
    priority:"high",
    mechanism:
      "Changes in energy intensity and electrification can lower fossil dependency independently of renewable capacity growth and can alter primary-energy accounting.",
    evidenceNeeded:
      "Final-energy electrification, electricity share of final energy, sectoral efficiency/energy-intensity series.",
    modelChangeCandidate:
      "Separate energy-service demand, final-energy electrification and conversion-efficiency effects from the fossil-share state.",
    validationRule:
      "Requires a newly specified internal cross-validation design and preferably external sectoral/regional data.",
  }),
  Object.freeze({
    id:"fuel-sector-heterogeneity",
    priority:"high",
    mechanism:
      "Coal, oil and gas face different substitution mechanisms and asset turnover; one global fossil-dependency stock can mask offsetting sectoral dynamics.",
    evidenceNeeded:
      "Fuel-specific consumption/production and sector/end-use demand trajectories.",
    modelChangeCandidate:
      "Disaggregate fossil dependency at minimum into power-sector coal/gas and transport/industry oil demand.",
    validationRule:
      "Use region/fuel panels or future observations for external validation.",
  }),
  Object.freeze({
    id:"policy-regional-heterogeneity",
    priority:"medium",
    mechanism:
      "Coal phaseouts, renewable support and regional transition timing can produce aggregate structural acceleration not generated by one global clean-index equation.",
    evidenceNeeded:
      "Regional generation/fuel shares and policy timing; avoid a fitted global post-2017 dummy.",
    modelChangeCandidate:
      "Introduce regional or policy-regime heterogeneity only with observable drivers, not an ex-post date switch.",
    validationRule:
      "Do not add a 2018 structural-break dummy fitted to the consumed holdout.",
  }),
]);

export const STAGE16_VALIDATION_PLAN = Object.freeze({
  holdoutStatus:
    "2018-2025 is consumed and may be used for structural diagnosis but not pristine validation.",
  internalDevelopment:
    "Use pre-declared blocked rolling-origin evaluation across 2000-2025 for revised-structure comparison; report each fold, not only pooled fit.",
  proposedFolds:Object.freeze([
    Object.freeze({train:[2000,2009],test:[2010,2013]}),
    Object.freeze({train:[2000,2013],test:[2014,2017]}),
    Object.freeze({train:[2000,2017],test:[2018,2021]}),
    Object.freeze({train:[2000,2021],test:[2022,2025]}),
  ]),
  externalValidation:
    "Reserve a genuinely separate target: regional/fuel-sector panel data not used for structural selection, or future global observations after 2025 when complete and harmonized.",
  rule:
    "No revised model may describe 2018-2025 as held-out after Stage 15. Model revisions motivated by Stage 15 must be labeled post-validation structural development.",
});
