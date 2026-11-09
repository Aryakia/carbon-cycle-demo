import {
  STAGE18_COUNTRY_PANEL,
} from "../data/stage18-spatial-transfer-panel.js";
import {
  runStage18SpatialTransfer,
} from "./spatial-transfer-validation.js";

function metrics(rows){
  const errors=rows.map(r=>r.predicted-r.observed);
  const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
  return Object.freeze({
    n:rows.length,
    rmse:Math.sqrt(mean(errors.map(e=>e*e))),
    mae:mean(errors.map(Math.abs)),
    bias:mean(errors),
  });
}
function candidateKey(c){return c.driverId+"::"+c.structure}

export const STAGE19_PROTOCOL = Object.freeze({
  stage:"19",
  type:"secondary robustness / influence analysis",
  relationToStage18:
    "Stage 18 remains the immutable primary spatial-transfer result. Stage 19 does not refit country-fold parameters or change the primary candidate set.",
  analyses:Object.freeze([
    "leave-one-country-out aggregate ranking",
    "equal-country mean RMSE ranking",
    "country-level skill versus persistence",
    "selected-model beta boundary and dispersion diagnostics",
  ]),
  influenceRule:
    "For each omitted country, remove its already-generated out-of-fold rows and recompute candidate aggregate metrics. No parameter is refit.",
  robustnessCriterion:
    "The Stage 18 observable/structure ranking is considered influence-robust if static low-carbon electricity share remains rank 1 in every leave-one-country-out aggregation.",
  claimBoundary:
    "Secondary robustness only. It cannot upgrade Stage 18 to statistically independent external validation.",
});

function aggregateWithoutCode(candidate,omitCode){
  const rows=candidate.fits
    .filter(f=>f.code!==omitCode)
    .flatMap(f=>f.testRows);
  return metrics(rows);
}
function persistenceWithoutCode(stage18,omitCode){
  // Persistence aggregate by country contains only metrics, not rows. Rebuild
  // exact pooled SSE/absolute error from country metrics because each country
  // contributes the same n=16 observations.
  const keep=stage18.persistence.byCountry.filter(x=>x.code!==omitCode);
  const n=keep.reduce((s,x)=>s+x.n,0);
  const sse=keep.reduce((s,x)=>s+x.rmse*x.rmse*x.n,0);
  const sae=keep.reduce((s,x)=>s+x.mae*x.n,0);
  const signed=keep.reduce((s,x)=>s+x.bias*x.n,0);
  return Object.freeze({
    n,
    rmse:Math.sqrt(sse/n),
    mae:sae/n,
    bias:signed/n,
  });
}

export function runStage19InfluenceAnalysis(){
  const stage18=runStage18SpatialTransfer();

  const leaveOneOut=STAGE18_COUNTRY_PANEL.map(country=>{
    const ranking=stage18.candidates.map(c=>{
      const m=aggregateWithoutCode(c,country.code);
      return {
        driverId:c.driverId,
        structure:c.structure,
        rmse:m.rmse,
        mae:m.mae,
        bias:m.bias,
      };
    }).sort((a,b)=>a.rmse-b.rmse||(a.structure==="static"?-1:1));
    const p=persistenceWithoutCode(stage18,country.code);
    const selected=ranking[0];
    return Object.freeze({
      omittedCode:country.code,
      selected:Object.freeze({
        ...selected,
        skillVsPersistence:1-selected.rmse/p.rmse,
      }),
      persistence:p,
      ranking:Object.freeze(ranking.map(Object.freeze)),
      stage18PrimaryStillRank1:
        selected.driverId===stage18.selected.driverId &&
        selected.structure===stage18.selected.structure,
    });
  });

  const meanCountryRanking=stage18.candidates.map(c=>({
    driverId:c.driverId,
    structure:c.structure,
    meanCountryRmse:c.aggregate.meanCountryRmse,
    medianCountryRmse:c.aggregate.medianCountryRmse,
  })).sort((a,b)=>
    a.meanCountryRmse-b.meanCountryRmse||
    a.medianCountryRmse-b.medianCountryRmse||
    (a.structure==="static"?-1:1)
  );

  const selectedCandidate=stage18.candidates.find(c=>
    c.driverId===stage18.selected.driverId&&c.structure===stage18.selected.structure
  );
  const persistenceByCode=Object.fromEntries(stage18.persistence.byCountry.map(x=>[x.code,x]));
  const countrySkills=selectedCandidate.aggregate.byCountry.map(x=>Object.freeze({
    code:x.code,
    rmse:x.rmse,
    persistenceRmse:persistenceByCode[x.code].rmse,
    skillVsPersistence:1-x.rmse/persistenceByCode[x.code].rmse,
  }));

  const betas=selectedCandidate.fits.map(x=>x.fitted.beta);
  const betaSummary=Object.freeze({
    min:Math.min(...betas),
    max:Math.max(...betas),
    mean:betas.reduce((a,b)=>a+b,0)/betas.length,
    atLowerBound:betas.filter(x=>x===0).length,
    atUpperBound:betas.filter(x=>x===0.25).length,
    uniqueCount:new Set(betas).size,
  });

  return Object.freeze({
    protocol:STAGE19_PROTOCOL,
    stage18Primary:Object.freeze({...stage18.selected}),
    leaveOneOut:Object.freeze(leaveOneOut),
    allLeaveOneOutPreservePrimary:
      leaveOneOut.every(x=>x.stage18PrimaryStillRank1),
    meanCountryRanking:Object.freeze(meanCountryRanking.map(Object.freeze)),
    countrySkills:Object.freeze(countrySkills),
    betaSummary,
    interpretation:
      "Stage 19 assesses whether the frozen Stage 18 observable/structure ranking is driven by one country. It does not refit the models or alter the primary result.",
  });
}
