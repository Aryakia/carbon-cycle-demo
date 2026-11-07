import assert from "node:assert/strict";
import { DEFAULT_PARAMETERS } from "../model/upstream-engine.js";
import { PARAMETER_METADATA } from "../model/parameter-metadata.js";

const defaultKeys = Object.keys(DEFAULT_PARAMETERS).sort();
const metadataKeys = Object.keys(PARAMETER_METADATA).sort();
assert.deepEqual(
  metadataKeys,
  defaultKeys,
  "every default parameter must have exactly one metadata entry",
);

for (const [key, meta] of Object.entries(PARAMETER_METADATA)) {
  assert.ok(meta.label && meta.unit && meta.classification && meta.status && meta.source);
  assert.equal(meta.default, DEFAULT_PARAMETERS[key], `${key}: metadata default mismatch`);
  assert.equal(typeof meta.active, "boolean", `${key}: active flag missing`);
}

const inactive = Object.entries(PARAMETER_METADATA).filter(([,m])=>!m.active).map(([k])=>k);
assert.deepEqual(inactive, ["cleanCapitalLifetimeYears"]);

console.log("Parameter metadata coverage checks passed.");
