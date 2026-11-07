// Representative actual observations from the NOAA/WDS revised Antarctic
// 800 kyr CO2 composite. These are a sparse fallback only: the Deep Time
// page attempts to load the complete NOAA text file at runtime.
// Ages are calendar years before 1950 (yr BP), exactly as in the source.
export const PALEO_FALLBACK = Object.freeze([
  [-51.03,368.02,0.06],[0.33,313.66,2.21],[9992.61,264.20,0.90],
  [16391.89,209.51,0.82],[29205.30,188.10,0.03],[50527.41,207.41,0.46],
  [70052.16,215.55,1.78],[83940.90,250.79,0.80],[100076.85,245.63,1.07],
  [114815.39,275.07,2.65],[121426.02,279.48,2.26],[128466.73,285.76,2.65],
  [139949.97,192.75,0.19],[159716.00,185.50,3.00],[177533.93,189.40,3.00],
  [198938.00,242.60,3.00],[220935.62,214.10,3.00],[243138.52,280.20,3.00],
  [252953.72,195.40,3.00],[272149.64,184.70,3.00],[284434.68,231.30,3.00],
  [305778.15,250.20,3.00],[335102.31,298.60,3.00],[360683.84,186.10,3.00],
  [400710.08,283.20,3.00],[427941.40,252.10,0.70],[457114.44,192.50,1.00],
  [474092.36,245.60,0.90],[490026.29,252.80,2.50],[514033.12,238.20,1.00],
  [535695.05,190.50,1.70],[557838.21,250.50,0.80],[568534.24,252.80,1.10],
  [583574.25,206.68,0.51],[609247.30,259.22,1.82],[634077.54,193.10,1.55],
  [658764.10,184.10,0.29],[667409.86,173.71,1.38],[680312.58,233.61,0.55],
  [700103.69,237.21,0.55],[717955.48,189.88,1.13],[740460.92,183.39,2.40],
  [760108.27,225.37,1.75],[779057.98,254.93,0.48],[789953.01,235.49,2.99],
  [805668.87,207.29,2.20],
]);

export const PALEO_METADATA = Object.freeze({
  source: "NOAA/WDS Paleoclimatology - Antarctic Ice Cores Revised 800KYr CO2 Data",
  datasetDoi: "10.25921/n8y4-bp27",
  publicationDoi: "10.1002/2014GL061957",
  sourceUrl: "https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/antarctica2015co2composite-noaa.txt",
  landingPage: "https://www.ncei.noaa.gov/access/paleo-search/study/17975",
  sourceRows: 1901,
  ageUnit: "calendar years before 1950 (yr BP)",
  fallbackNature: "Sparse set of actual source observations; no synthetic interpolation.",
});
