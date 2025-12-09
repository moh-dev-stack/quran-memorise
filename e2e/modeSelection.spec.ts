import { test, expect } from "@playwright/test";

test.describe("Mode Selection", () => {
  test("should show all game modes on iPhone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await expect(page.locator("text=Choose Game Mode")).toBeVisible();
    await expect(page.locator("text=Arabic + Transliteration → Translation")).toBeVisible();
    await expect(page.locator("text=Translation → Arabic + Transliteration")).toBeVisible();
    await expect(page.locator("text=Missing Word")).toBeVisible();
    await expect(page.locator("text=Arabic → Transliteration")).toBeVisible();
    await expect(page.locator("text=Transliteration → Arabic")).toBeVisible();
    await expect(page.locator("text=Sequential Order")).toBeVisible();
    await expect(page.locator("text=First/Last Word")).toBeVisible();
  });

  test("should navigate to Arabic+Trans to Translation mode", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await page.click("text=Arabic + Transliteration → Translation");
    
    await expect(page.locator("text=/Choose the correct translation/i")).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to Translation to Arabic+Trans mode", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await page.click("text=Translation → Arabic + Transliteration");
    
    await expect(page.locator("text=/Choose the correct Arabic/i")).toBeVisible({ timeout: 5000 });
  });

  test("should allow switching back to mode selection", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await page.click("text=Arabic + Transliteration → Translation");
    await page.click("text=← Modes");
    
    await expect(page.locator("text=Choose Game Mode")).toBeVisible();
  });
});

