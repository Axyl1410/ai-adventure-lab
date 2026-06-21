import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["src/__tests__/setup.ts"],
    testTimeout: 15_000,
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
    },
    env: {
      DATABASE_URL: "file:./.test.db",
      TEACHER_PASSCODE: "test-pass-12345",
      UPLOAD_DIR: "./.test-uploads",
      TTS_ENABLED: "false",
      RATE_LIMIT_MAX: "10000",
      IMAGE_RATE_LIMIT_MAX: "10000",
      CORS_ORIGIN: "http://localhost:5173",
      OPENAI_API_KEY: "",
      IMAGE_API_KEY: "",
    },
  },
});
