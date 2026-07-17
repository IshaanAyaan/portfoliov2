import { expect, test } from "@playwright/test";

test("landing page exposes the universe and portfolio", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "ISHAAN RANJAN" })).toBeVisible();
  await expect(page.locator("[data-cluster]")).toHaveCount(5);
  await expect(page.getByRole("region", { name: "Portfolio" })).toBeAttached();
});

test("game page creates a playable runner", async ({ page }) => {
  await page.goto("/offline.html");

  await expect(page.locator(".trex-game canvas")).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to portfolio" })).toBeVisible();
});
