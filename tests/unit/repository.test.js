import assert from "node:assert/strict";
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
