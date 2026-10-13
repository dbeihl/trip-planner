// Shared views both personas use (docs/personas.md#shared-views):
// the year calendar, color-coded by traveler group, and the trips index.
import { test, expect } from "@playwright/test";

const legend = (page, label) =>
  page.getByTestId("calendar-legend-item").filter({ hasText: label });

test.describe("David & Suzanne — shared calendar", () => {
  test("their couple trips and the everyone trips are labeled for them", async ({ page }) => {
    await page.goto("/trip-planner/calendar.html");
    await expect(page.locator(".group-label").filter({ hasText: "David & Suzanne" })).toHaveCount(1);
    for (const trip of ["Philippines", "Thailand"]) {
      await expect(legend(page, trip)).toHaveAttribute("data-group", "couple");
    }
    for (const trip of ["Japan", "Seoul & Busan"]) {
      await expect(legend(page, trip)).toHaveAttribute("data-group", "all");
    }
    // Mike & Sherry's trips are not in the couple group
    await expect(legend(page, "Yellowstone & Grand Teton")).toHaveAttribute("data-group", "parents");
  });

  test("clicking a trip in the legend opens its planner", async ({ page }) => {
    await page.goto("/trip-planner/calendar.html");
    await legend(page, "Philippines").click();
    await expect(page).toHaveURL(/philippines-trip-planner\.html$/);
    await expect(page.locator("#grandTotal")).toHaveText(/^\$[\d,]+$/);
  });
});
