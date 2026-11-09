import {
  STAGE18_COUNTRY_PANEL,
  STAGE18_PANEL_ROWS,
} from "../data/stage18-spatial-transfer-panel.js";

const BETA_GRID = Object.freeze({ min: 0, max: 0.25, step: 0.001 });
const TAU_GRID = Object.freeze({ min: 0.5, max: 10, step: 0.5 });
const DT = 0.25;

export const STAGE18_FOLDS = Object.freeze([
  Object.freeze({ id:"fold-1", train:Object.freeze([2000,2008]), test:Object.freeze([2009,2012]), normalizationYear:2008 }),
  Object.freeze({ id:"fold-2", train:Object.freeze([2000,2012]), test:Object.freeze([2013,2016]), normalizationYear:2012 }),
  Object.freeze({ id:"fold-3", train:Object.freeze([2000,2016]), test:Object.freeze([2017,2020]), normalizationYear:2016 }),
  Object.freeze({ id:"fold-4", train:Object.freeze([2000,2020]), test:Object.freeze([2021,2024]), normalizationYear:2020 }),
]);

export const STAGE18_DRIVER_HYPOTHESES = Object.freeze({
  renewableCapacityPerCapita: Object.freeze({
    id:"renewable-capacity-per-capita",
    label:"Installed renewable capacity per person",
    interpretation:"Installed renewable electricity-generating capacity in watts per person.",
    type:"installed-capacity",
  }),
  renewableElectricityShare: Object.freeze({
    id:"renewable-electricity-share",
    label:"Renewable electricity share",
    interpretation:"Realized renewable generation as a share of total electricity generation.",
    type:"realized-generation",
  }),
  lowCarbonElectricityShare: Object.freeze({
    id:"low-carbon-electricity-share",
    label:"Low-carbon electricity share",
    interpretation:"Realized renewable plus nuclear generation share of electricity.",
    type:"realized-generation",
  }),
});

export const STAGE18_PROTOCOL = Object.freeze({
  purpose:
    "Spatial/target-domain transfer test of the Stage 17 measurement-variable ranking across eight pre-declared national energy systems.",
  countries: Object.freeze(STAGE18_COUNTRY_PANEL.map(x=>x.code)),
  period: Object.freeze([2000,2024]),
  folds: STAGE18_FOLDS,
  drivers: Object.freeze(Object.values(STAGE18_DRIVER_HYPOTHESES).map(x=>x.id)),
  structures: Object.freeze(["static","dynamic"]),
  betaGrid: BETA_GRID,
  tauGridYears: TAU_GRID,
  selectionMetric:
    "Pooled out-of-fold RMSE over equal-length test blocks; every country contributes the same number of test observations.",
  parameterRule:
    "Each country-fold estimates its own beta (and tau for dynamic forms) from that fold's training years only. No universal beta is imposed.",
  claimBoundary:
    "The result can support transfer of an observable/structural relationship across heterogeneous national systems, but not a universal elasticity and not statistically independent external validation because the countries contribute to the global aggregate used earlier.",
});

function rowsForCountry(code){
  return STAGE18_PANEL_ROWS.filter(r=>r.code===code).sort((a,b)=>a.year-b.year);
}
function row(code,year){
  const r=STAGE18_PANEL_ROWS.find(x=>x.code===code&&x.year===year);
  if(!r) throw new Error("missing Stage 18 panel row "+code+" "+year);
  return r;
}
function fossilShare(code,year){
  const r=row(code,year);
  return r.fossilEnergyConsumptionTWh/r.totalEnergySupplyTWh;
}
function rawDriver(code,year,driverId){
  const r=row(code,year);
  if(driverId===STAGE18_DRIVER_HYPOTHESES.renewableCapacityPerCapita.id)
    return r.renewableCapacityWattsPerCapita;
  if(driverId===STAGE18_DRIVER_HYPOTHESES.renewableElectricityShare.id)
    return r.renewableElectricitySharePct;
  if(driverId===STAGE18_DRIVER_HYPOTHESES.lowCarbonElectricityShare.id)
    return r.renewableElectricitySharePct+r.nuclearElectricitySharePct;
  throw new Error("unknown Stage 18 driver "+driverId);
}
function yearsInclusive(a,b){
  return Array.from({length:b-a+1},(_,i)=>a+i);
}
function gridValues({min,max,step}){
  const n=Math.round((max-min)/step);
  return Array.from({length:n+1},(_,i)=>Number((min+i*step).toFixed(12)));
}
function mean(xs){return xs.reduce((a,b)=>a+b,0)/xs.length}
function median(xs){
  const x=[...xs].sort((a,b)=>a-b), m=Math.floor(x.length/2);
  return x.length%2?x[m]:(x[m-1]+x[m])/2;
}
function metrics(rows){
  const errors=rows.map(r=>r.predicted-r.observed);
  return Object.freeze({
    n:rows.length,
    rmse:Math.sqrt(mean(errors.map(e=>e*e))),
    mae:mean(errors.map(Math.abs)),
    bias:mean(errors),
  });
}

export function stage18ObservedDependency(code,year,normalizationYear){
  return fossilShare(code,year)/fossilShare(code,normalizationYear);
}

export function stage18DriverIndex(code,year,driverId,normalizationYear){
  if(year<2000||year>2024) throw new Error("Stage 18 year outside 2000-2024");
  const norm=rawDriver(code,normalizationYear,driverId);
  if(!Number.isFinite(norm)||norm<=0)
    throw new Error("nonpositive Stage 18 driver normalization "+code+" "+driverId);
  const a=Math.floor(year), b=Math.ceil(year);
  const av=rawDriver(code,a,driverId)/norm;
  if(a===b) return av;
  const bv=rawDriver(code,b,driverId)/norm;
  return av+(bv-av)*(year-a);
}
function desired(index,beta){
  if(!Number.isFinite(index)||index<=0) throw new Error("driver index must be positive");
  return index**(-beta);
}
function staticRows({code,driverId,beta,startYear,endYear,normalizationYear}){
  return yearsInclusive(startYear,endYear).map(year=>({
    code,year,
    predicted:desired(stage18DriverIndex(code,year,driverId,normalizationYear),beta),
    observed:stage18ObservedDependency(code,year,normalizationYear),
  }));
}
function dynamicRows({code,driverId,beta,tauYears,startYear,endYear,normalizationYear}){
  let year=startYear;
  let state=stage18ObservedDependency(code,startYear,normalizationYear);
  const out=[{code,year,predicted:state,observed:state}];
  while(year<endYear-1e-12){
    const dt=Math.min(DT,endYear-year);
    const mid=year+dt/2;
    const target=desired(stage18DriverIndex(code,mid,driverId,normalizationYear),beta);
    const decay=Math.exp(-dt/tauYears);
    state=target+(state-target)*decay;
    year+=dt;
    const rounded=Math.round(year);
    if(Math.abs(year-rounded)<1e-9){
      out.push({
        code,year:rounded,predicted:state,
        observed:stage18ObservedDependency(code,rounded,normalizationYear),
      });
    }
  }
  return out;
}

export function fitStage18CountryFold(code,fold,driverId,structure){
  const [trainStart,trainEnd]=fold.train,[testStart,testEnd]=fold.test;
  if(fold.normalizationYear!==trainEnd) throw new Error("normalization must equal train end");
  let best=null;
  for(const beta of gridValues(BETA_GRID)){
    if(structure==="static"){
      const trainRows=staticRows({code,driverId,beta,startYear:trainStart,endYear:trainEnd,normalizationYear:trainEnd});
      const score=metrics(trainRows).rmse;
      if(!best||score<best.trainRmse-1e-15) best={beta,tauYears:null,trainRmse:score};
    }else if(structure==="dynamic"){
      for(const tauYears of gridValues(TAU_GRID)){
        const trainRows=dynamicRows({code,driverId,beta,tauYears,startYear:trainStart,endYear:trainEnd,normalizationYear:trainEnd});
        const score=metrics(trainRows).rmse;
        if(
          !best||
          score<best.trainRmse-1e-15||
          (Math.abs(score-best.trainRmse)<1e-15&&tauYears<best.tauYears)
        ) best={beta,tauYears,trainRmse:score};
      }
    }else throw new Error("structure must be static or dynamic");
  }
  const allRows=structure==="static"
    ?staticRows({code,driverId,beta:best.beta,startYear:trainStart,endYear:testEnd,normalizationYear:trainEnd})
    :dynamicRows({code,driverId,beta:best.beta,tauYears:best.tauYears,startYear:trainStart,endYear:testEnd,normalizationYear:trainEnd});
  const testRows=allRows.filter(r=>r.year>=testStart&&r.year<=testEnd);
  return Object.freeze({
    code,foldId:fold.id,driverId,structure,
    trainingWindow:Object.freeze([...fold.train]),
    testWindow:Object.freeze([...fold.test]),
    fitted:Object.freeze(best),
    testRows:Object.freeze(testRows.map(Object.freeze)),
    testMetrics:metrics(testRows),
  });
}

function aggregate(results){
  const allRows=results.flatMap(r=>r.testRows);
  const byCountry=STAGE18_COUNTRY_PANEL.map(c=>{
    const rows=allRows.filter(r=>r.code===c.code);
    return Object.freeze({code:c.code,...metrics(rows)});
  });
  return Object.freeze({
    pooledMetrics:metrics(allRows),
    meanCountryRmse:mean(byCountry.map(x=>x.rmse)),
    medianCountryRmse:median(byCountry.map(x=>x.rmse)),
    byCountry:Object.freeze(byCountry),
    totalTestObservations:allRows.length,
  });
}
function persistence(){
  const results=[];
  for(const c of STAGE18_COUNTRY_PANEL){
    for(const fold of STAGE18_FOLDS){
      const rows=yearsInclusive(fold.test[0],fold.test[1]).map(year=>({
        code:c.code,year,predicted:1,
        observed:stage18ObservedDependency(c.code,year,fold.normalizationYear),
      }));
      results.push(Object.freeze({code:c.code,foldId:fold.id,testRows:Object.freeze(rows.map(Object.freeze)),testMetrics:metrics(rows)}));
    }
  }
  return aggregate(results);
}

export function runStage18SpatialTransfer(){
  const candidates=[];
  for(const h of Object.values(STAGE18_DRIVER_HYPOTHESES)){
    for(const structure of STAGE18_PROTOCOL.structures){
      const fits=[];
      for(const c of STAGE18_COUNTRY_PANEL){
        for(const fold of STAGE18_FOLDS){
          fits.push(fitStage18CountryFold(c.code,fold,h.id,structure));
        }
      }
      candidates.push(Object.freeze({
        driverId:h.id,structure,
        fits:Object.freeze(fits),
        aggregate:aggregate(fits),
      }));
    }
  }
  candidates.sort((a,b)=>
    a.aggregate.pooledMetrics.rmse-b.aggregate.pooledMetrics.rmse||
    a.aggregate.meanCountryRmse-b.aggregate.meanCountryRmse||
    (a.structure==="static"?-1:1)
  );
  const base=persistence();
  const selected=candidates[0];
  const selectedBetas=selected.fits.map(x=>x.fitted.beta);
  const selectedTaus=selected.fits.filter(x=>Number.isFinite(x.fitted.tauYears)).map(x=>x.fitted.tauYears);
  return Object.freeze({
    protocol:STAGE18_PROTOCOL,
    candidates:Object.freeze(candidates),
    persistence:base,
    selected:Object.freeze({
      driverId:selected.driverId,
      structure:selected.structure,
      pooledRmse:selected.aggregate.pooledMetrics.rmse,
      pooledMae:selected.aggregate.pooledMetrics.mae,
      pooledBias:selected.aggregate.pooledMetrics.bias,
      meanCountryRmse:selected.aggregate.meanCountryRmse,
      medianCountryRmse:selected.aggregate.medianCountryRmse,
      skillVsPersistence:1-selected.aggregate.pooledMetrics.rmse/Math.max(1e-12,base.pooledMetrics.rmse),
      betaRange:Object.freeze([Math.min(...selectedBetas),Math.max(...selectedBetas)]),
      tauRange:selectedTaus.length?Object.freeze([Math.min(...selectedTaus),Math.max(...selectedTaus)]):null,
    }),
    claimBoundary:STAGE18_PROTOCOL.claimBoundary,
  });
}
