import { HISTORICAL_REFERENCE_ROWS } from "../data/historical-reference-2000-2025.js";
import { STAGE14_FROZEN_DEPENDENCY_FIT } from "../data/stage14-dependency-fit.js";
import {
  DEPENDENCY_HYPOTHESES,
  calibrateDependencyModule,
  desiredFossilDependency,
  simulateDependencyModule,
} from "./dependency-calibration.js";

const TRAINING_END = 2017;
const VALIDATION_START = 2018;
const VALIDATION_END = 2025;
const DT = 0.25;
const reference = HISTORICAL_REFERENCE_ROWS.find(r => r.year === TRAINING_END);

function row(year) {
  const r=HISTORICAL_REFERENCE_ROWS.find(x=>x.year===year);
  if(!r) throw new Error("missing year "+year);
  return r;
}
function fossilShare(r){return r.fossilEnergyConsumptionTWh/r.totalEnergySupplyTWh}
const refShare=fossilShare(reference);
const refIntensity=reference.renewableCapacityGw/reference.totalEnergySupplyTWh;

export function validationObservedDependency(year){
  if(year<TRAINING_END||year>VALIDATION_END) throw new Error("validation supports 2017-2025");
  return fossilShare(row(year))/refShare;
}
function annualCleanIndex(year,hypothesisId){
  const r=row(year);
  if(hypothesisId===DEPENDENCY_HYPOTHESES.absoluteRenewableCapacity.id)
    return r.renewableCapacityGw/reference.renewableCapacityGw;
  if(hypothesisId===DEPENDENCY_HYPOTHESES.renewableCapacityIntensity.id)
    return (r.renewableCapacityGw/r.totalEnergySupplyTWh)/refIntensity;
  throw new Error("unknown hypothesis");
}
export function validationCleanIndexAt(year,hypothesisId){
  if(year<TRAINING_END||year>VALIDATION_END) throw new Error("validation supports 2017-2025");
  const a=Math.floor(year),b=Math.ceil(year),av=annualCleanIndex(a,hypothesisId);
  if(a===b)return av;
  const bv=annualCleanIndex(b,hypothesisId),f=year-a;
  return av+(bv-av)*f;
}
function extendDynamic({hypothesisId,cleanElasticity,adjustmentTimeYears}){
  const train=simulateDependencyModule({hypothesisId,cleanElasticity,adjustmentTimeYears,endYear:TRAINING_END});
  let dependency=train.at(-1).fossilDependency,year=TRAINING_END;
  const rows=[];
  while(year<VALIDATION_END-1e-12){
    const dt=Math.min(DT,VALIDATION_END-year),mid=year+dt/2;
    const desired=desiredFossilDependency(validationCleanIndexAt(mid,hypothesisId),cleanElasticity);
    const decay=Math.exp(-dt/adjustmentTimeYears);
    dependency=desired+(dependency-desired)*decay;
    year+=dt;
    const yr=Math.round(year);
    if(Math.abs(year-yr)<1e-9 && yr>=VALIDATION_START){
      rows.push({year:yr,predicted:dependency,observed:validationObservedDependency(yr)});
    }
  }
  return rows;
}
function staticRows(hypothesisId,beta){
  return Array.from({length:8},(_,i)=>VALIDATION_START+i).map(year=>({
    year,
    predicted:desiredFossilDependency(validationCleanIndexAt(year,hypothesisId),beta),
    observed:validationObservedDependency(year),
  }));
}
function persistenceRows(){
  return Array.from({length:8},(_,i)=>VALIDATION_START+i).map(year=>({year,predicted:1,observed:validationObservedDependency(year)}));
}
export function metrics(rows,{excludeYears=[]}={}){
  const x=rows.filter(r=>!excludeYears.includes(r.year));
  const errors=x.map(r=>r.predicted-r.observed);
  const rmse=Math.sqrt(errors.reduce((s,e)=>s+e*e,0)/errors.length);
  const mae=errors.reduce((s,e)=>s+Math.abs(e),0)/errors.length;
  const bias=errors.reduce((s,e)=>s+e,0)/errors.length;
  return {n:x.length,rmse,mae,bias,years:x.map(r=>r.year)};
}
export function evaluateStage15Validation(){
  const frozen=STAGE14_FROZEN_DEPENDENCY_FIT;
  const primaryRows=extendDynamic({
    hypothesisId:frozen.selectedHypothesisId,
    cleanElasticity:frozen.selectedParameters.cleanElasticity,
    adjustmentTimeYears:frozen.selectedParameters.effectiveAdjustmentTimeYears,
  });
  const training=calibrateDependencyModule();
  const staticFit=training.staticCleanCompetitionCandidate;
  const staticValidation=staticRows(staticFit.selectedHypothesisId,staticFit.selectedCleanElasticity);
  const turnover=training.turnoverConstrainedResult;
  const turnoverRows=extendDynamic({
    hypothesisId:turnover.selectedHypothesisId,
    cleanElasticity:turnover.selectedParameters.cleanElasticity,
    adjustmentTimeYears:turnover.selectedParameters.adjustmentTimeYears,
  });
  const persistence=persistenceRows();
  const primary=metrics(primaryRows),persistenceMetric=metrics(persistence);
  return {
    validationWindow:[VALIDATION_START,VALIDATION_END],
    frozenStage14CommitBoundary:true,
    parametersRetunedAfterHoldout:false,
    primary:{rows:primaryRows,metrics:primary,skillVsPersistence:1-primary.rmse/persistenceMetric.rmse},
    benchmarks:{
      persistence:{rows:persistence,metrics:persistenceMetric},
      staticTrainingSelected:{rows:staticValidation,metrics:metrics(staticValidation)},
      turnoverConstrainedTrainingSelected:{rows:turnoverRows,metrics:metrics(turnoverRows)},
    },
    shockSensitivity:{
      exclusion:"2020 only; pre-specified exogenous COVID shock sensitivity, no refit",
      primary:metrics(primaryRows,{excludeYears:[2020]}),
      persistence:metrics(persistence,{excludeYears:[2020]}),
    },
  };
}
