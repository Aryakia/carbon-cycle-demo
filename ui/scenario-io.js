export const ADVANCED_SCENARIO_FIELDS = Object.freeze([
  ["carbonPriceUsdPerTCO2", "carbonPrice"],
  ["fossilSubsidyUsdPerTCO2", "subsidy"],
  ["fossilInvestmentIncentive", "fossilInvestment"],
  ["cleanInvestmentIndexPerYr", "cleanInvestment"],
  ["acceleratedRetirementPerYr", "retirement"],
  ["expectedFutureDemandIndex", "demand"],
  ["institutionalResistance", "resistance"],
  ["cleanLearningRate", "learning"],
  ["resourceDevelopmentCostIndex", "cost"],
  ["policyImplementationDelayYears", "delay"],
]);

export function encodeAdvancedScenario(parameters) {
  const query = new URLSearchParams();
  for (const [parameter, queryKey] of ADVANCED_SCENARIO_FIELDS) {
    const value = Number(parameters[parameter]);
    if (Number.isFinite(value)) query.set(queryKey, String(value));
  }
  return query.toString();
}

export function decodeAdvancedScenario(search = "") {
  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const parameters = {};
  for (const [parameter, queryKey] of ADVANCED_SCENARIO_FIELDS) {
    if (!query.has(queryKey)) continue;
    const value = Number(query.get(queryKey));
    if (Number.isFinite(value)) parameters[parameter] = value;
  }
  return parameters;
}

function csvCell(value) {
  if (value == null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

export function rowsToCsv(rows, columns) {
  const header = columns.map(([key, label]) => csvCell(label ?? key)).join(",");
  const body = rows.map(row =>
    columns.map(([key]) => csvCell(row[key])).join(",")
  );
  return [header, ...body].join("\n");
}

export function experimentIdFromSearch(search, validIds, fallback) {
  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const candidate = query.get("experiment");
  return validIds.includes(candidate) ? candidate : fallback;
}
