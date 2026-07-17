import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("portfolio and game routes retain their canonical entry points", async () => {
  const [portfolio, game] = await Promise.all([
    readFile(new URL("../../index.html", import.meta.url), "utf8"),
    readFile(new URL("../../offline.html", import.meta.url), "utf8")
  ]);

  assert.match(portfolio, /id="explore"/);
  assert.match(portfolio, /id="portfolio"/);
  assert.match(game, /class="trex-game"/);
});

test("public pages apply the static-host security policy before scripts", async () => {
  const pages = await Promise.all([
    readFile(new URL("../../index.html", import.meta.url), "utf8"),
    readFile(new URL("../../offline.html", import.meta.url), "utf8")
  ]);

  for (const page of pages) {
    const policyIndex = page.indexOf('http-equiv="Content-Security-Policy"');
    const firstScriptIndex = page.indexOf("<script");

    assert.ok(policyIndex > -1 && policyIndex < firstScriptIndex);
    assert.match(page, /upgrade-insecure-requests/);
    assert.match(page, /name="referrer" content="strict-origin-when-cross-origin"/);
    assert.doesNotMatch(page, /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>/);
  }
});

test("structured data matches the hash allowed by the content policy", async () => {
  const portfolio = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  const structuredData = portfolio.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(structuredData);

  const hash = createHash("sha256").update(structuredData).digest("base64");
  assert.match(portfolio, new RegExp(`script-src[^\"]+'sha256-${hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
});

test("new-tab links isolate their opener", async () => {
  const portfolio = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  const links = portfolio.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g);

  for (const [link] of links) assert.match(link, /rel="[^"]*\bnoopener\b[^"]*"/);
});

test("automation dependencies are pinned and narrowly authorized", async () => {
  const workflow = await readFile(new URL("../../.github/workflows/update-now.yml", import.meta.url), "utf8");
  const dependabot = await readFile(new URL("../../.github/dependabot.yml", import.meta.url), "utf8");

  assert.doesNotMatch(workflow, /uses:\s+[^\s@]+@v\d/);
  assert.match(workflow, /permissions: \{\}/);
  assert.match(workflow, /github-actions\[bot\]/);
  assert.match(dependabot, /package-ecosystem: github-actions/);
  assert.match(dependabot, /package-ecosystem: npm/);
});
