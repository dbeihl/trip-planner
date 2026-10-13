// Phone-sized journeys for both personas (docs/personas.md): Suzanne joins
// from Davao and both check plans on the road, so the planner has to work at
// phone width. The CSS has 520px and 860px breakpoints for this.
import { test, expect, devices } from "@playwright/test";
import { openPlanner, openItinerary, routingFor } from "./helpers.mjs";

test.use({ ...devices["iPhone 13"], defaultBrowserType: "chromium" });

test("phone: both routings and the itinerary fit without sideways scroll", async ({ page }) => {
  await openPlanner(page, "philippines");
  await expect(routingFor(page, "David")).toBeVisible();
  await expect(routingFor(page, "Suzanne")).toBeVisible();
  await openItinerary(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByTestId("itin-day").last().scrollIntoViewIfNeeded();
  await expect(page.getByTestId("itin-day").last()).toBeVisible();
});

test("phone: shared calendar legend is readable and tappable", async ({ page }) => {
  await page.goto("/trip-planner/calendar.html");
  const item = page.getByTestId("calendar-legend-item").filter({ hasText: "Philippines" });
  await item.scrollIntoViewIfNeeded();
  await expect(item).toBeVisible();
  await item.tap();
  await expect(page).toHaveURL(/philippines-trip-planner\.html$/);
});
