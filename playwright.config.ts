import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? "3000");
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const START_WEB_SERVER = process.env.E2E_START_WEB_SERVER !== "false";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: START_WEB_SERVER
    ? {
        command:
          "npx -y node@22 node_modules/expo/bin/cli start --web --port " + PORT,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
});
