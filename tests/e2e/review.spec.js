import { expect, test } from "@playwright/test";

test("portfolio layouts avoid horizontal overflow and panel overlap", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.locator('.cluster-map > [data-cluster="build"]').click();
  const layout = await page.evaluate(() => {
    const modeSwitch = document.querySelector(".mode-switch")?.getBoundingClientRect();
    const panel = document.querySelector(".explore-panel")?.getBoundingClientRect();
    return {
      controlsOverlapPanel: Boolean(modeSwitch && panel &&
        panel.left < modeSwitch.right && panel.right > modeSwitch.left &&
        panel.top < modeSwitch.bottom && panel.bottom > modeSwitch.top),
      noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
    };
  });

  expect(layout.noOverflow).toBe(true);
  expect(layout.controlsOverlapPanel).toBe(false);
});

test("mobile game controls meet the 44 pixel target", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only control target");
  await page.goto("/offline.html");

  const sizes = await page.locator("[data-game-action]").evaluateAll((buttons) => buttons.map((button) => {
    const bounds = button.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  }));

  expect(sizes).toHaveLength(3);
  for (const size of sizes) {
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
