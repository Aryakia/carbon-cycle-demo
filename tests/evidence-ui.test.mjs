import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ADVANCED_SCENARIO_FIELDS } from "../ui/scenario-io.js";
import { PARAMETER_METADATA } from "../model/parameter-metadata.js";
import { SOFTWARE_VERSION } from "../model/version.js";

const html = readFileSync(new URL("../upstream.html", import.meta.url), "utf8");

for (const [parameter, inputId] of ADVANCED_SCENARIO_FIELDS) {
  assert.ok(PARAMETER_METADATA[parameter], `missing parameter metadata: ${parameter}`);
  assert.ok(
    html.includes(`id="${inputId}"`),
    `advanced-lab control missing for evidence-mapped input: ${inputId}`,
  );
}

assert.match(html, /id="evidenceDrawer"/);
assert.match(html, /PARAMETER_METADATA/);
assert.match(html, /SOFTWARE_VERSION/);
assert.equal(SOFTWARE_VERSION, "0.3.0");

console.log("Parameter evidence UI coverage checks passed.");
