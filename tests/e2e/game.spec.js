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
