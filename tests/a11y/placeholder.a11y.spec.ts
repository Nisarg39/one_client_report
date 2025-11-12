import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Demo page accessibility", () => {
  test("has no serious or critical accessibility regressions", async ({ page }) => {
    await page.goto("/demo");

    await expect(page.getByRole("heading", { name: /demo controls/i })).toBeVisible();

    const axe = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
    const { violations } = await axe.analyze();
    const seriousViolations = violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? "")
    );

    expect(seriousViolations).toEqual([]);
  });
});
