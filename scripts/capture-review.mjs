import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:4173";
const requestedOutput = process.argv.slice(2).find((argument) => argument !== "--");
const outputDirectory = resolve(requestedOutput || "review-screenshots");
const clusters = ["build", "research", "ideas", "trajectory", "now"];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();

async function captureUniverse(viewport, label) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(outputDirectory, `universe-${label}-overview.png`) });

  if (label === "desktop") {
    for (const cluster of clusters) {
      await page.locator(`.cluster-map > [data-cluster="${cluster}"]`).click();
      await page.waitForFunction(() => getComputedStyle(document.querySelector(".explore-panel")).opacity === "1");
      await page.screenshot({ path: resolve(outputDirectory, `universe-${label}-${cluster}.png`) });
      await page.locator(".panel-close").click();
    }
  }

  await context.close();
}

async function captureGameStates() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseURL}/offline.html`, { waitUntil: "networkidle" });

  for (const theme of ["dark", "light"]) {
    await page.getByRole("button", { name: /color theme/i }).click();
    await page.screenshot({ path: resolve(outputDirectory, `game-${theme}-idle.png`) });
    await page.getByRole("button", { name: /jump/i }).click();
    await page.waitForFunction(() => window.TrexRunner?.activated);
    await page.screenshot({ path: resolve(outputDirectory, `game-${theme}-running.png`) });
    await page.evaluate(() => window.TrexRunner.gameOver());
    await page.screenshot({ path: resolve(outputDirectory, `game-${theme}-game-over.png`) });
    if (theme === "dark") await page.reload({ waitUntil: "networkidle" });
  }

  await context.close();
}

try {
  await captureUniverse({ width: 1440, height: 900 }, "desktop");
  await captureUniverse({ width: 390, height: 844 }, "mobile");
  await captureGameStates();
} finally {
  await browser.close();
}

console.log(`Review screenshots written to ${outputDirectory}`);
