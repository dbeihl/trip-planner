// Shared bits for the persona journeys. See docs/personas.md.
import { expect } from "@playwright/test";

export const MONEY = /^\$[\d,]+$/;

// Open a planner page and fail the test on any uncaught page error.
export async function openPlanner(page, slug) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`/trip-planner/${slug}-trip-planner.html`);
  await expect(page.locator("#grandTotal")).toHaveText(MONEY);
  return errors;
}

// On phones the tabs live behind the hamburger menu; open it first.
export async function openItinerary(page) {
  const menu = page.getByRole("button", { name: "Menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
  }
  await page.click('[data-tab="itin"]');
  await expect(page.getByTestId("itin-day").first()).toBeVisible();
}

// Flight routing block for one traveler on the Plan tab.
export const routingFor = (page, traveler) =>
  page.locator(`[data-testid="origin-block"][data-traveler="${traveler}"]`);

// Checked fare radios in a routing block, as name=value pairs.
export const checkedFares = (block) =>
  block.locator("input[type=radio]:checked").evaluateAll((els) => els.map((e) => `${e.name}=${e.value}`));
