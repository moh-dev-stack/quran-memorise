import { test, expect } from "@playwright/test";

test.describe("Missing Word Mode", () => {
  test("should display missing word mode on iPhone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    // Select missing word mode
    await page.click("text=Missing Word");
    
    await expect(page.locator("text=/____/")).toBeVisible();
    await expect(page.locator("text=/Choose the missing word/i")).toBeVisible();
  });

  test("should allow selecting an option", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await page.click("text=Missing Word");
    
    // Wait for options to load
    await page.waitForSelector("button:has-text('____')", { timeout: 5000 });
    
    // Click first option button (not reveal button)
    const options = page.locator("button").filter({ hasNotText: "Reveal" });
    const firstOption = options.first();
    await firstOption.click();

    // Should show feedback
    await expect(page.locator("text=/Correct|Incorrect/i")).toBeVisible({ timeout: 5000 });
  });

  test("should show reveal button", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await page.click("text=Missing Word");
    
    await expect(page.locator("text=/Reveal Answer/i")).toBeVisible();
  });
});

