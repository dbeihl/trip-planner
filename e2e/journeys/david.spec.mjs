// Persona: David (docs/personas.md#david). Flies from Indianapolis (IND).
// On the Philippines trip he and Suzanne have separate routings; his is the
// US long-haul, and the last leg home is his alone.
import { test, expect } from "@playwright/test";
import { openPlanner, openItinerary, routingFor } from "./helpers.mjs";

test.describe("David — Philippines trip", () => {
  test("Plan tab shows David's own IND routing, separate from Suzanne's", async ({ page }) => {
    const errors = await openPlanner(page, "philippines");
    const mine = routingFor(page, "David");
    await expect(mine).toHaveCount(1);
    await expect(mine.locator(".origin-select option:checked")).toHaveText(
      "From the USA — David (IND)",
    );
    await expect(mine).toContainText("Philippine Airlines via San Francisco & Manila");
    // Suzanne's domestic hop is not inside David's block
    await expect(mine).not.toContainText("Cebu Pacific via Cebu");
    expect(errors).toEqual([]);
  });

  test("picking a different fare for David changes the total", async ({ page }) => {
    await openPlanner(page, "philippines");
    const total = page.locator("#grandTotal");
    const before = await total.textContent();
    await routingFor(page, "David")
      .locator("label", { hasText: "Philippine Airlines via San Francisco (Business)" })
      .click();
    await expect(total).not.toHaveText(before);
  });

  test("itinerary walks day by day and ends on David's flight home", async ({ page }) => {
    await openPlanner(page, "philippines");
    await openItinerary(page);
    const days = page.getByTestId("itin-day");
    const n = await days.count();
    expect(n).toBeGreaterThan(10);
    await expect(days.first()).toContainText("Day 1");
    await expect(days.first()).toContainText("Land in Busuanga, first evening in Coron town");
    for (let i = 0; i < n; i++) {
      await expect(days.nth(i).locator(".day-eyebrow")).toContainText(`Day ${i + 1}`);
    }
    await expect(days.last()).toContainText("this leg is David's");
  });
});

test.describe("David — Japan trip", () => {
  test("his IND → Davao routing is the one on the plan", async ({ page }) => {
    await openPlanner(page, "japan");
    await expect(
      routingFor(page, "David").locator(".origin-select option:checked"),
    ).toHaveText("From the USA — David (IND → Davao, home from Haneda)");
  });
});
