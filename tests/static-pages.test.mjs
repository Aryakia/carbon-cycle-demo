import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["game.html", "upstream.html", "paleoclimate.html", "experiments.html", "feedbacks.html", "assessment.html"];

for (const page of pages) {
  const path = resolve(root, page);
  assert.ok(existsSync(path), `${page} must exist`);
  const html = readFileSync(path, "utf8");

  assert.match(html, /<meta\s+name=["']viewport["']/i, `${page}: responsive viewport missing`);
  assert.match(html, /<title>[^<]+<\/title>/i, `${page}: document title missing`);
  assert.match(html, /<main[\s>]/i, `${page}: main landmark missing`);
  assert.match(html, /@media\s*\(/i, `${page}: responsive CSS media query missing`);

  const localHtmlLinks = [...html.matchAll(/href=["']([^"'#?:]+\.html)(?:#[^"']*)?["']/gi)]
    .map(m => m[1])
    .filter(href => !href.startsWith("/"));
  for (const href of localHtmlLinks) {
    assert.ok(
      existsSync(resolve(root, href)),
      `${page}: local HTML link target missing: ${href}`,
    );
  }

  const moduleImports = [...html.matchAll(/from\s+["'](\.\/?[^"']+\.js)["']/g)].map(m => m[1]);
  for (const spec of moduleImports) {
    assert.ok(
      existsSync(resolve(root, spec)),
      `${page}: imported local module missing: ${spec}`,
    );
  }

  const ranges = [...html.matchAll(/<input[^>]+type=["']range["'][^>]*>/gi)].map(m => m[0]);
  for (const input of ranges) {
    assert.match(input, /aria-label=/i, `${page}: range input lacks aria-label`);
  }
}

console.log("Static Pages integrity/accessibility checks passed.");
