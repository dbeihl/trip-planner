// E2E smoke config. The webServer builds the site and serves dist/ with the
// /trip-planner base path via astro preview, so the tests hit the same URLs
// production does. Run with `npm run test:e2e`.
import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

// Sandboxed/remote dev environments pre-provision Chromium at a fixed path
// (and forbid downloads); use that binary when present. Elsewhere (CI,
// laptops) the standard `npx playwright install chromium` resolution applies.
const SANDBOX_CHROMIUM = "/opt/pw-browsers/chromium";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    ...(existsSync(SANDBOX_CHROMIUM)
      ? { launchOptions: { executablePath: SANDBOX_CHROMIUM } }
      : {}),
  },
  webServer: {
    command: "npx astro build && npx astro preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321/trip-planner/",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
