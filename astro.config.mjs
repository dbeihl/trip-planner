import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://dbeihl.github.io",
  base: "/trip-planner",
  build: { format: "file" },
  outDir: "./dist",
});
