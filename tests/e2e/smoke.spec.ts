import { expect, test } from "@playwright/test";

test.describe("Demo report experience", () => {
  test("allows generating a report without errors", async ({ page }) => {
    await page.goto("/demo");

    await expect(page.getByRole("heading", { name: /demo controls/i })).toBeVisible();

    const generateButton = page.getByRole("button", { name: /generat/i });
    await expect(generateButton).toBeEnabled();

    await generateButton.click();

    await expect(generateButton).toBeDisabled();
    await expect(generateButton).toHaveText(/generating/i);

    await expect(generateButton).toHaveText(/generate report/i, { timeout: 4000 });
    await expect(page.getByText(/ai-powered insights/i)).toBeVisible();
  });

  test("updates the connected platform count when toggling options", async ({ page }) => {
    await page.goto("/demo");

    const platformToggle = page.getByRole("button", { name: /platform/i });
    await platformToggle.click();

    await page.getByRole("button", { name: /google ads/i }).click();

    await expect(page.getByRole("button", { name: /2 platforms selected/i })).toBeVisible();
    await expect(page.getByText(/2 platforms connected/i)).toBeVisible();
  });
});
