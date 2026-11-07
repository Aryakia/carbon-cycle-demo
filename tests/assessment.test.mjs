import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ASSESSMENT_QUESTIONS } from "../education/questions.js";

assert.ok(ASSESSMENT_QUESTIONS.length >= 5, "assessment should cover multiple learning objectives");
const ids = new Set();
for (const q of ASSESSMENT_QUESTIONS) {
  assert.ok(q.id && q.prompt && q.concept && q.explanation);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3);
  assert.ok(Number.isInteger(q.correctIndex));
  assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
  assert.ok(!ids.has(q.id), `duplicate question id: ${q.id}`);
  ids.add(q.id);
}

const html = readFileSync(new URL("../assessment.html", import.meta.url), "utf8");
for (const prohibited of ["localStorage", "sessionStorage", "indexedDB", "fetch(", "XMLHttpRequest"]) {
  assert.ok(!html.includes(prohibited), `assessment must not use persistent/transmitted response storage: ${prohibited}`);
}
assert.match(html, /No responses are transmitted/i);
assert.match(html, /page memory/i);

console.log("Educational assessment privacy/structure checks passed.");
