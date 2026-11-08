import { GCB_1959_2024_GTC, GCB_HISTORY_METADATA } from "./gcb-2025-global-budget.js";
import { REFERENCE_BENCHMARKS } from "../model/reference-benchmarks.js";

const YEARS = Object.freeze(Array.from({ length: 26 }, (_, i) => 2000 + i));

export const RENEWABLE_CAPACITY_GW = Object.freeze([
  763.94165,785.04565,805.9863,836.23505,869.0441,908.40063,949.881,
  999.30676,1062.3982,1143.4758,1226.5267,1331.3591,1446.2083,1570.126,
  1700.0487,1852.7697,2021.3016,2187.566,2358.148,2541.9038,2811.1064,
  3077.1157,3379.2378,3875.7563,4461.6313,5155.0073,
]);

export const FOSSIL_ENERGY_PRODUCTION_TWH = Object.freeze([
  92680.402,
  94269.665,
  94683.838,
  99480.421,
  105160.302,
  108373.036,
  111443.141,
  113742.986,
  116554.595,
  114461.287,
  119368.259,
  123955.662,
  126586.55,
  127661.555,
  129366.291,
  130453.208,
  128768.485,
  131139.045,
  136138.612,
  137618.282,
  130741.152,
  134822.242,
  140220.395,
  142917.12,
  144654.086,
  146848.375
]);

export const FOSSIL_ENERGY_CONSUMPTION_TWH = Object.freeze([
  94434,95580.71,97747.95,101841.664,106811.59,110553.234,113796.75,
  117664.375,118450.55,116115.45,121765.15,124889.73,126688.484,
  128322.625,129038.61,129677.2,130518.7,132830.9,135913.22,136221.16,
  129419.04,136104.56,138189.34,140309.28,142532.38,143805.69,
]);

export const TOTAL_ENERGY_SUPPLY_TWH = Object.freeze([
  105981.39,
  107306.336,
  109732.8,
  113737.06,
  119386.78,
  123361.98,
  126974.52,
  130948.94,
  132169.69,
  129923.805,
  136245.19,
  139303.88,
  140985.67,
  143116.42,
  144408.34,
  145499.62,
  146893.38,
  149727.25,
  153618.12,
  154620.7,
  147985.3,
  155558.44,
  157938.77,
  160876.92,
  164494.1,
  166753.6
]);

export const WORLD_GDP_CONSTANT_2015_USD = Object.freeze([
  48550490166230.6,49536038159389.3,50684736953402.6,52242868476707.5,
  54591383204955.8,56807330097271.9,59357487895115.9,61987756942770.2,
  63284295644439.1,62440691845650.1,65263543198396.9,67426584814614.5,
  69279085457391.3,71281076205614.5,73539611353222.6,75839351828606.2,
  77955073125299.8,80641861942532.2,83292262266946.2,85524752058522,
  83056326526016.6,88442603118342.4,91485038370116.5,94100947773550,
  96829887869984.6,99658553419775.2,
]);

function reconstructGcbPpm() {
  const map = new Map();
  let excessGtC =
    (GCB_HISTORY_METADATA.observed2024MeanPpm - 278) * 2.12;
  for (let i = GCB_1959_2024_GTC.length - 1; i >= 0; i--) {
    const row = GCB_1959_2024_GTC[i];
    map.set(row[0], 278 + excessGtC / 2.12);
    if (i > 0) excessGtC -= row[3];
  }
  return map;
}

const gcbPpm = reconstructGcbPpm();
const gcbByYear = new Map(GCB_1959_2024_GTC.map(row => [row[0], row]));

export const HISTORICAL_REFERENCE_ROWS = Object.freeze(
  YEARS.map((year, i) => {
    const gcb = gcbByYear.get(year);
    const fossilCO2GtCPerYr =
      year === 2025
        ? REFERENCE_BENCHMARKS.globalCarbonBudget2025.fossilCO2GtCPerYr
        : gcb?.[1] ?? null;
    const atmosphericPpm =
      year === 2025 ? GCB_HISTORY_METADATA.preliminary2025MeanPpm : gcbPpm.get(year) ?? null;

    return Object.freeze({
      year,
      fossilCO2GtCPerYr,
      fossilCO2Status: year === 2025 ? "projected" : "observed/reconstructed budget",
      atmosphericPpm,
      atmosphericStatus: year === 2025 ? "preliminary" : "observed/reconstructed from GCB growth",
      renewableCapacityGw: RENEWABLE_CAPACITY_GW[i],
      fossilEnergyProductionTWh: FOSSIL_ENERGY_PRODUCTION_TWH[i],
      fossilEnergyConsumptionTWh: FOSSIL_ENERGY_CONSUMPTION_TWH[i],
      totalEnergySupplyTWh: TOTAL_ENERGY_SUPPLY_TWH[i],
      worldGdpConstant2015Usd: WORLD_GDP_CONSTANT_2015_USD[i],
    });
  }),
);

export const HISTORICAL_SOURCE_METADATA = Object.freeze({
  fossilCO2: {
    provider: "Global Carbon Project",
    dataset: "Global Carbon Budget 2025 v1.0",
    period: "2000-2025",
    unit: "GtC/yr",
    doi: "10.18160/GCP-2025",
    articleDoi: "10.5194/essd-18-3211-2026",
    licence: "CC BY 4.0",
    processing:
      "2000-2024 from the existing GCB annual budget table; 2025 uses the GCB 2025 projected fossil-CO2 benchmark.",
  },
  atmosphericCO2: {
    provider: "Global Carbon Project",
    dataset: "Global Carbon Budget 2025 atmospheric growth",
    period: "2000-2025",
    unit: "ppm",
    licence: "CC BY 4.0",
    processing:
      "2000-2024 end-year concentrations reconstructed from annual atmospheric growth and the assessed 2024 global mean of 422.8 ppm; 2025 uses the preliminary 425.6 ppm mean.",
  },
  renewableCapacity: {
    provider: "International Renewable Energy Agency (IRENA)",
    processor: "Our World in Data",
    dataset: "Renewable Energy Statistics 2026",
    period: "2000-2025",
    unit: "GW",
    licence: "OWID reuse under CC BY; original IRENA data attribution retained",
    sourcePage:
      "https://ourworldindata.org/grapher/installed-global-renewable-energy-capacity-by-technology",
    directCsv:
      "https://ourworldindata.org/grapher/installed-global-renewable-energy-capacity-by-technology.csv?v=1&csvType=full&useColumnShortNames=false",
    processing:
      "World series 'All renewables (total)'; values converted/displayed in GW by OWID from IRENA capacity statistics.",
  },
  fossilEnergyProduction: {
    provider: "Energy Institute",
    processor: "Our World in Data",
    dataset: "Statistical Review of World Energy 2026",
    period: "2000-2025",
    unit: "TWh energy production",
    licence: "OWID reuse under CC BY; Energy Institute source attribution retained",
    sourcePage:
      "https://ourworldindata.org/grapher/fossil-fuel-production",
    directCsv:
      "https://ourworldindata.org/grapher/fossil-fuel-production.csv?v=1&csvType=full&useColumnShortNames=false",
    processing:
      "World coal + oil + gas production summed in energy units. Used as an extraction-activity proxy, not as a production-capacity stock.",
  },
  fossilEnergyConsumption: {
    provider: "Energy Institute",
    processor: "Our World in Data",
    dataset: "Statistical Review of World Energy 2026",
    period: "2000-2025",
    unit: "TWh total energy supply / consumption",
    licence: "OWID reuse under CC BY; Energy Institute source attribution retained",
    sourcePage:
      "https://ourworldindata.org/grapher/fossil-fuels?fuel=total&metric=consumption&country=~OWID_WRL",
    directCsv:
      "https://ourworldindata.org/grapher/fossil-fuels.csv?v=1&csvType=full&useColumnShortNames=false&fuel=total&metric=consumption&per_capita=total",
    processing:
      "World total fossil-fuel consumption (coal + oil + gas), 2000-2025.",
  },
  totalEnergySupply: {
    provider: "Energy Institute",
    processor: "Our World in Data",
    dataset: "Statistical Review of World Energy 2026",
    period: "2000-2025",
    unit: "TWh total energy supply",
    licence: "OWID reuse under CC BY; Energy Institute source attribution retained",
    sourcePage:
      "https://ourworldindata.org/grapher/energy-mix?metric=total&source=total",
    directCsv:
      "https://ourworldindata.org/grapher/energy-mix.csv?v=1&csvType=full&useColumnShortNames=false&metric=total&source=total",
    processing:
      "World total primary energy supply. Used as an aggregate historical energy-activity driver; traditional biomass is excluded by the source methodology.",
  },
  worldGdp: {
    provider: "World Bank",
    dataset: "World Development Indicators",
    indicator: "NY.GDP.MKTP.KD",
    period: "2000-2025",
    unit: "constant 2015 US$",
    licence: "CC BY 4.0",
    source:
      "https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.KD?date=2000:2025&format=json&per_page=100",
    retrievedLastUpdated: "2026-10-08",
  },
});

export const HISTORICAL_MEASUREMENT_GAPS = Object.freeze([
  {
    modelConcept: "developed fossil production capacity",
    status: "production flow proxy available; capacity stock still unobserved",
    candidateSource:
      "Energy Institute Statistical Review 2026 production flow plus sector-specific capacity datasets",
    reason:
      "The canonical dataset now includes global fossil-energy production flow, which constrains extraction trajectory shape. Production flow is still not equivalent to installed production-capacity stock.",
  },
  {
    modelConcept: "fossil and clean investment",
    status: "candidate source identified; exact annual series not yet ingested",
    candidateSource:
      "IEA World Energy Investment 2025/2026 data products",
    reason:
      "Calibration should use the exact downloadable data, not values digitized from a chart.",
  },
  {
    modelConcept: "institutional support/resistance",
    status: "latent construct",
    candidateSource:
      "No single globally accepted annual empirical measure",
    reason:
      "Must remain latent or be operationalized through defensible observed indicators before calibration.",
  },
]);

export function rowForYear(year) {
  return HISTORICAL_REFERENCE_ROWS.find(row => row.year === year) ?? null;
}
