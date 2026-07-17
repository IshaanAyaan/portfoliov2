import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const clusters = ["build", "research", "ideas", "trajectory", "now"];

async function expectNoSeriousAxeViolations(page) {
  const results = await new AxeBuilder({ page }).include(".universe").analyze();
  expect(results.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);
}

test("every planet deep-links, closes, and restores focus", async ({ page }) => {
  const errors = [];
  const failedLocalResources = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:4173") && !response.ok()) failedLocalResources.push(response.url());
  });
  await page.goto("/");
  await expectNoSeriousAxeViolations(page);

  for (const id of clusters) {
    const planet = page.locator(`.cluster[data-cluster="${id}"]`);
    await planet.click();
    await expect(page).toHaveURL(new RegExp(`#cluster/${id}$`));
    await expect(page.locator(".explore-panel")).toBeVisible();
    await expect(page.locator("[data-panel-title]")).toHaveText(id.toUpperCase());
    await expect(page.locator("[data-panel-title]")).toBeFocused();
    await expectNoSeriousAxeViolations(page);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/#explore$/);
    await expect(page.locator(".explore-panel")).toBeHidden();
    await expect(planet).toBeFocused();
  }

  await expect(errors).toEqual([]);
  await expect(failedLocalResources).toEqual([]);
});

test("cluster hashes reproduce selected state", async ({ page }) => {
  await page.goto("/#cluster/research");
  await expect(page.locator('.cluster[data-cluster="research"]')).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-panel-title]")).toHaveText("RESEARCH");
  await expect(page.locator(".explore-panel")).toBeVisible();
});

test("mobile keeps vertical scrolling and replaces tiny satellites with the details list", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only gesture contract");
  await page.goto("/");
  await expect(page.locator(".cluster-map")).toHaveCSS("touch-action", "pan-y");
  await page.locator('.cluster[data-cluster="build"]').click();
  await expect(page.locator("[data-satellite-layer]")).toBeHidden();
  await expect(page.locator("[data-panel-nodes] > li")).not.toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("reduced motion selects without camera movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('.cluster[data-cluster="ideas"]').click();
  const camera = await page.locator(".universe").evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.getPropertyValue("--camera-x").trim(), style.getPropertyValue("--camera-y").trim(), style.getPropertyValue("--camera-scale").trim()];
  });
  expect(camera).toEqual(["0px", "0px", "1"]);
});
