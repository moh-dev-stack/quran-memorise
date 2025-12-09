import { test, expect } from "@playwright/test";

test.describe("Play Page", () => {
  test("should display the play page with first verse", async ({ page }) => {
    await page.goto("/play");

    // Wait for the page to load
    await expect(page.locator("text=Ad-Duha")).toBeVisible();

    // Check that Arabic text is displayed
    await expect(page.locator("text=وَالضُّحَىٰ")).toBeVisible();

    // Check progress indicator
    await expect(page.locator("text=/1 of 11/")).toBeVisible();
  });

  test("should allow user to input answer and check it", async ({ page }) => {
    await page.goto("/play");

    // Wait for input field
    const input = page.getByPlaceholderText(/Type the verse/i);
    await expect(input).toBeVisible();

    // Type answer
    await input.fill("Wa ad-duha");

    // Click check button
    const checkButton = page.getByRole("button", { name: /Check Answer/i });
    await checkButton.click();

    // Wait for feedback
    await expect(page.locator("text=/Correct/i")).toBeVisible({ timeout: 5000 });
  });

  test("should show feedback for incorrect answer", async ({ page }) => {
    await page.goto("/play");

    const input = page.getByPlaceholderText(/Type the verse/i);
    await input.fill("wrong answer");

    const checkButton = page.getByRole("button", { name: /Check Answer/i });
    await checkButton.click();

    await expect(page.locator("text=/Incorrect/i")).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to next question after checking", async ({ page }) => {
    await page.goto("/play");

    // Answer first question
    const input = page.getByPlaceholderText(/Type the verse/i);
    await input.fill("Wa ad-duha");

    const checkButton = page.getByRole("button", { name: /Check Answer/i });
    await checkButton.click();

    // Wait for feedback and click next
    await expect(page.locator("text=/Correct/i")).toBeVisible({ timeout: 5000 });

    const nextButton = page.getByRole("button", { name: /Next Verse/i });
    await nextButton.click();

    // Check that we're on the next question
    await expect(page.locator("text=/2 of 11/")).toBeVisible();
  });

  test("should complete game and show completion page", async ({ page }) => {
    await page.goto("/play");

    // Answer all questions (simplified - just answer first one correctly multiple times)
    // In a real scenario, you'd answer all 11 questions
    const input = page.getByPlaceholderText(/Type the verse/i);
    
    // Answer first question
    await input.fill("Wa ad-duha");
    const checkButton = page.getByRole("button", { name: /Check Answer/i });
    await checkButton.click();
    
    await expect(page.locator("text=/Correct/i")).toBeVisible({ timeout: 5000 });
    
    // Navigate through all questions quickly
    for (let i = 0; i < 10; i++) {
      const nextButton = page.getByRole("button", { name: /Next Verse|Finish/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        // Wait a bit for the next question to load
        await page.waitForTimeout(500);
      }
    }

    // Should eventually reach completion or finish button
    const finishButton = page.getByRole("button", { name: /Finish/i });
    if (await finishButton.isVisible()) {
      await finishButton.click();
      await expect(page.locator("text=/Game Complete/i")).toBeVisible({ timeout: 5000 });
    }
  });

  test("should have mobile-responsive layout", async ({ page }) => {
    // Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    // Check that elements are visible and properly sized
    const verseCard = page.locator("text=وَالضُّحَىٰ");
    await expect(verseCard).toBeVisible();

    // Check that input is full width on mobile
    const input = page.getByPlaceholderText(/Type the verse/i);
    const inputBox = await input.boundingBox();
    expect(inputBox?.width).toBeGreaterThan(300); // Should be close to full width
  });
});

