import { defineConfig, devices } from "@playwright/test";

const apiPort = process.env.API_PORT ?? "3001";
const webPort = process.env.WEB_PORT ?? "5173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${webPort}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter @ai-adventure/api dev",
      cwd: ".",
      url: `http://localhost:${apiPort}/api/health`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        API_PORT: apiPort,
        DATABASE_URL: "file:./e2e.db",
        TEACHER_PASSCODE: "e2e-teacher-99",
        TTS_ENABLED: "false",
        OPENAI_API_KEY: "",
        IMAGE_API_KEY: "",
        UPLOAD_DIR: "./e2e-uploads",
        CORS_ORIGIN: `http://localhost:${webPort}`,
      },
    },
    {
      command: "pnpm --filter @ai-adventure/web dev",
      cwd: ".",
      url: `http://localhost:${webPort}`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        WEB_PORT: webPort,
      },
    },
  ],
});
