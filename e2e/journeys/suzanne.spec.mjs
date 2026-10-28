// Persona: Suzanne (docs/personas.md#suzanne). Lives in Davao; on the
// Philippines trip she flies up from DVO to meet David in Coron, and the
// Malita week is at her family's place.
import { test, expect } from "@playwright/test";
import { openPlanner, openItinerary, routingFor, checkedFares, dayOn } from "./helpers.mjs";

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
    const initial = await total.textContent();
    const david = routingFor(page, "David");
    await david.locator("label", { hasText: "Philippine Airlines via San Francisco (Business)" }).click();
    await expect(total).not.toHaveText(initial);
    const before = await total.textContent();
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

test.describe("Suzanne — Japan trip", () => {
  test("her PAL return is the one on the plan", async ({ page }) => {
    await openPlanner(page, "japan");
    const mine = routingFor(page, "Suzanne");
    await expect(mine).toHaveCount(1);
    await expect(mine.locator(".origin-select option:checked")).toHaveText(
      "From the Philippines — Suzanne (already in Davao)",
    );
    await expect(mine).toContainText("ZZ3HQY");
    await expect(mine).toContainText("PR421");
    await expect(mine).toContainText("3:25 PM");
    await expect(mine).toContainText("PR2825");
    await expect(mine).toContainText("1:10 AM");
    await expect(mine).not.toContainText("JLKKOB");
  });

  test("Nov 5 is Tokyo PC, Nov 6 is booked 10 AM Shibuya Sky, Nov 8 trains via Shinagawa", async ({
    page,
  }) => {
    await openPlanner(page, "japan");
    await openItinerary(page);

    const nov5 = dayOn(page, "Nov 5");
    await expect(nov5).toContainText("Tokyo PC");
    await expect(nov5).not.toContainText("Harry Potter");

    const nov6 = dayOn(page, "Nov 6");
    await expect(nov6).toContainText("YNP871804");
    await expect(nov6).toContainText("10:00 AM");
    await expect(nov6).not.toContainText("still to book");

    const nov8 = dayOn(page, "Nov 8");
    await expect(nov8).toContainText("PR421");
    await expect(nov8).toContainText("3:25 PM");
    await expect(nov8).toContainText("Keikyu");
    const nov8Text = await nov8.innerText();
    expect(nov8Text.indexOf("Shinagawa")).toBeLessThan(nov8Text.indexOf("Limousine"));
    expect(nov8Text.indexOf("Keikyu")).toBeLessThan(nov8Text.indexOf("Limousine"));
  });
});
