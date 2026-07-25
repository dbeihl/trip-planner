// Smoke test of built planner pages — the DOM wiring the unit tests
// deliberately avoid. Guards the failure the engine's NaN banner exists for:
// a data gap or renamed element that freezes or corrupts the grand total.
// Two pages cover both engine paths: Japan (the reference dataset, named
// legs) and Yellowstone (generic legs, fly/drive + rental).
import { test, expect } from "@playwright/test";

const MONEY = /^\$[\d,]+$/; // "$8,412" — and never "$NaN"

for (const slug of ["japan", "yellowstone"]) {
  test(`${slug}: renders a finite total, rescales with party size, itinerary fills`, async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    await page.goto(`/trip-planner/${slug}-trip-planner.html`);

    // budget tab: a real dollar total, no NaN banner
    const total = page.locator("#grandTotal");
    await expect(total).toHaveText(MONEY);
    await expect(page.locator("#recalcNanBanner")).toHaveCount(0);
    await expect(page.locator("#breakdown .breakdown-row").first()).toBeVisible();

    // party size drives recalc(): 2 → 4 travelers must change the total
    // (lodging doubles at minimum) and keep it a number
    const before = await total.textContent();
    await page.fill("#travelerCount", "4");
    await expect(total).not.toHaveText(before);
    await expect(total).toHaveText(MONEY);
    await expect(page.locator("#recalcNanBanner")).toHaveCount(0);

    // itinerary tab renders day rows from the same state
    await page.click('[data-tab="itin"]');
    await expect(page.locator("#itinRail .drow").first()).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
}
