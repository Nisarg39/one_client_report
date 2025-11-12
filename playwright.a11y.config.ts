import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const webServerCommand = process.env.PLAYWRIGHT_WEB_SERVER ?? "npm run dev";

export default defineConfig({
  testDir: "tests/a11y",
  reporter: [["list"]],
  use: {
    baseURL,
    browserName: "chromium",
  },
  projects: [
    {
      name: "a11y",
    },
  ],
  webServer: {
    command: webServerCommand,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
});

