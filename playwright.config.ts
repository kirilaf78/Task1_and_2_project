import { defineConfig, devices } from "@playwright/test";
import type { MyTestOptions } from "./fixures/test-options";
import dotenv from "dotenv";
import { QA_DATA, PROD_DATA } from "./utils/ui_test_data";

//Download variable from .env

dotenv.config();

//Verifying if API key exists by triggering warning

if (!process.env.API_KEY) {
  console.warn(
    "WARNING: API_KEY is missing in .env file. API tests will fail."
  );
}

export default defineConfig<MyTestOptions>({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "on-failure" }]],

  use: {
    trace: "on-first-retry",
  },

  projects: [
    // UI TESTS (QA Environment)
    {
      name: "UI-QA-Chrome",
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        ...QA_DATA,
      },
    },
    {
      name: "UI-QA-Safari",
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        ...QA_DATA,
      },
    },

    // UI TESTS (PROD Environment)
    {
      name: "UI-PROD-Chrome",
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        ...PROD_DATA,
      },
    },

    // ============================================================
    // API TESTS
    // ============================================================
    {
      name: "API-Tests",
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: {
        baseURL: "https://reqres.in",
        extraHTTPHeaders: {
          "x-api-key": process.env.API_KEY ?? "",
        },
      },
    },
  ],
});
