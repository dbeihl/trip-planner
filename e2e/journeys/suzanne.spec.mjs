// Persona: Suzanne (docs/personas.md#suzanne). Lives in Davao; on the
// Philippines trip she flies up from DVO to meet David in Coron, and the
// Malita week is at her family's place.
import { test, expect } from "@playwright/test";
import { openPlanner, openItinerary, routingFor, checkedFares } from "./helpers.mjs";

test.describe("Suzanne — Philippines trip", () => {
  test("Plan tab shows Suzanne's own DVO routing, separate from David's", async ({ page }) => {
    const errors = await openPlanner(page, "philippines");
    const mine = routingFor(page, "Suzanne");
    await expect(mine).toHaveCount(1);
    await expect(mine.locator(".origin-select option:checked")).toHaveText(
      "From the Philippines — Suzanne (DVO)",
    );
    await expect(mine).toContainText("Cebu Pacific via Cebu");
    await expect(mine).not.toContainText("IND → SFO");
    expect(errors).toEqual([]);
  });

  test("her fare choice moves the total independently of David's", async ({ page }) => {
    await openPlanner(page, "philippines");
    const total = page.locator("#grandTotal");
    const before = await total.textContent();
    const david = routingFor(page, "David");
    const davidFares = await checkedFares(david);
    expect(davidFares).toHaveLength(1);
    await routingFor(page, "Suzanne")
      .locator("label", { hasText: "AirSWIFT via Manila" })
      .click();
    await expect(total).not.toHaveText(before);
    expect(await checkedFares(david)).toEqual(davidFares);
  });

  test("itinerary reaches the Malita week at her family's place", async ({ page }) => {
    await openPlanner(page, "philippines");
    await openItinerary(page);
    const malita = page.getByTestId("itin-day").filter({ hasText: "The long way home to Malita" });
    await expect(malita).toHaveCount(1);
    await expect(malita).toContainText("Suzanne's family's door");
    await expect(page.getByTestId("itin-day").filter({ hasText: "A slow first day in Malita" })).toBeVisible();
  });
});
