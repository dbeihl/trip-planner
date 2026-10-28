// Persona: David (docs/personas.md#david). Flies from Indianapolis (IND).
// On the Philippines trip he and Suzanne have separate routings; his is the
// US long-haul, and the last leg home is his alone.
import { test, expect } from "@playwright/test";
import { openPlanner, openItinerary, routingFor, checkedFares, dayOn } from "./helpers.mjs";

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
    const initial = await total.textContent();
    const suzanne = routingFor(page, "Suzanne");
    await suzanne.locator("label", { hasText: "AirSWIFT via Manila" }).click();
    await expect(total).not.toHaveText(initial);
    const before = await total.textContent();
    const suzanneFares = await checkedFares(suzanne);
    expect(suzanneFares).toHaveLength(1);
    await routingFor(page, "David")
      .locator("label", { hasText: "Philippine Airlines via San Francisco (Business)" })
      .click();
    await expect(total).not.toHaveText(before);
    expect(await checkedFares(suzanne)).toEqual(suzanneFares);
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
    const mine = routingFor(page, "David");
    await expect(mine.locator(".origin-select option:checked")).toHaveText(
      "From the USA — David (IND → Davao, home from Haneda)",
    );
    await expect(mine).toContainText("ZCZ3LH");
    await expect(mine).toContainText("JLKKOB");
    await expect(mine).toContainText("DL120");
    await expect(mine).toContainText("5:20 PM");
    await expect(mine).toContainText("DL1456");
    await expect(mine).toContainText("5:55 PM");
    await expect(page.locator("#osakaTiers")).toContainText("10472SG207787");
    await expect(page.locator("#tokyoTiers")).toContainText("72079274902358");
    await expect(page.locator("#tokyoTiers")).toContainText("Tokyu Stay Shibuya Shin-Minamiguchi");
  });

  test("Nov 5 is Tokyo PC, Nov 6 is booked 10 AM Shibuya Sky, Nov 8 trains via Shinagawa", async ({
    page,
  }) => {
    await openPlanner(page, "japan");
    await openItinerary(page);

    const nov5 = dayOn(page, "Nov 5");
    await expect(nov5).toContainText("Tokyo PC");
    await expect(nov5).toContainText("Tokyo Radio Department Store");
    await expect(nov5).toContainText("1-10-11 Sotokanda");
    await expect(nov5).toContainText("Tokyu Stay Shibuya");
    await expect(nov5).not.toContainText("Harry Potter");

    const nov6 = dayOn(page, "Nov 6");
    await expect(nov6).toContainText("Shibuya Sky");
    await expect(nov6).toContainText("YNP871804");
    await expect(nov6).toContainText("10:00 AM");
    await expect(nov6).toContainText("Meiji Jingu");
    await expect(nov6).toContainText("Pokemon Center");
    await expect(nov6).not.toContainText("still to book");
    await expect(nov6).not.toContainText("sunset");

    const nov8 = dayOn(page, "Nov 8");
    await expect(nov8).toContainText("12:30");
    await expect(nov8).toContainText("Keikyu");
    await expect(nov8).toContainText("Limousine");
    const nov8Text = await nov8.innerText();
    expect(nov8Text.indexOf("Shinagawa")).toBeGreaterThanOrEqual(0);
    expect(nov8Text.indexOf("Shinagawa")).toBeLessThan(nov8Text.indexOf("Limousine"));
    expect(nov8Text.indexOf("Keikyu")).toBeLessThan(nov8Text.indexOf("Limousine"));
  });
});
