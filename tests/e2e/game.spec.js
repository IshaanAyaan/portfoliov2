import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoSeriousAxeViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  expect(violations).toEqual([]);
}

test("game controls drive the runner and persist preferences", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/offline.html");
  await expect(page.locator(".runner-container")).toHaveAttribute("aria-label", "Escape Velocity dinosaur runner");
  await expectNoSeriousAxeViolations(page);

  await page.getByRole("button", { name: /jump/i }).click();
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.activated)).toBe(true);
  await expect(page.locator("[data-game-prompt]")).toBeHidden();

  const duck = page.locator('[data-game-action="duck"]');
  await duck.dispatchEvent("pointerdown");
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.tRex?.ducking)).toBe(true);
  await duck.dispatchEvent("pointerup");
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.tRex?.ducking)).toBe(false);

  const pause = page.locator('[data-game-action="pause"]');
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "true");
  await pause.click();
  await expect(pause).toHaveAttribute("aria-pressed", "false");
  await expect(await page.evaluate(() => window.TrexRunner?.paused)).toBe(false);

  await page.getByRole("button", { name: /color theme/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /sound/i }).click();
  await expect(page.locator("[data-sound-toggle]")).toHaveAttribute("aria-pressed", "false");

  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("ishaan.cosmicRun.v1"))?.settings)).toEqual({ theme: "dark", sound: false });
  await expect(errors).toEqual([]);
});

test("signals update score, biome, transmissions, and persistent progress", async ({ page }) => {
  await page.goto("/offline.html");
  await page.getByRole("button", { name: /jump/i }).click();
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.activated)).toBe(true);
  await expect(page.locator("[data-game-prompt]")).toBeHidden();
  await page.locator('[data-game-action="pause"]').click();
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.paused)).toBe(true);
  const scoreBeforeSignal = Number(await page.locator("[data-score]").innerText());

  const game = page.locator(".trex-game");
  await game.dispatchEvent("cosmicrun:signalcollect");
  await expect(page.locator("[data-score]")).toHaveText(String(scoreBeforeSignal + 100).padStart(5, "0"));
  await expect(page.locator("[data-signals]")).toHaveText("1");
  await expect(page.locator("[data-multiplier]")).toHaveText("2×");
  await expect(page.getByRole("link", { name: "Build signal" })).toBeVisible();

  await game.evaluate((element) => element.dispatchEvent(new CustomEvent("cosmicrun:score", {
    detail: { score: 500 }
  })));
  await expect(page.locator("[data-biome]")).toHaveText("Debris Field");
  await expect.poll(() => page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("ishaan.cosmicRun.v1"));
    return {
      signals: progress?.totalSignals,
      highScore: progress?.highScore,
      transmissions: progress?.unlockedTransmissions
    };
  })).toEqual({ signals: 1, highScore: 600, transmissions: ["build"] });

  await page.reload();
  await expect(page.locator("[data-high-score]")).toHaveText("00600");
  await expect(page.getByRole("link", { name: "Build signal" })).toBeVisible();
});

test("game recovers from corrupt progress and presents accessible game-over state", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ishaan.cosmicRun.v1", "{broken"));
  await page.goto("/offline.html");

  await expect(page.locator("[data-high-score]")).toHaveText("00000");
  await page.getByRole("button", { name: /jump/i }).click();
  await expect.poll(() => page.evaluate(() => window.TrexRunner?.activated)).toBe(true);
  await expect(page.locator("[data-game-prompt]")).toBeHidden();
  await page.evaluate(() => window.TrexRunner.gameOver());
  await expect(page.locator("[data-game-prompt]")).toContainText("Signal lost");
  await expect(page.locator("[data-game-announcement]")).toContainText("Game over");

  await page.locator(".runner-container").press("r");
  await expect(await page.evaluate(() => window.TrexRunner?.crashed)).toBe(false);
  await page.evaluate(() => window.TrexRunner.gameOver());
  await expectNoSeriousAxeViolations(page);
});
