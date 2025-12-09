import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Use node environment for unit tests (faster), jsdom for integration tests
    environmentMatchGlobs: [
      ["tests/unit/**", "node"], // Unit tests use faster node environment
      ["tests/integration/**", "jsdom"], // Integration tests need DOM
    ],
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    // Performance optimizations
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    // Faster test execution
    testTimeout: 10000,
    hookTimeout: 10000,
    // Coverage settings
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "e2e/",
        "**/*.tsx",
        "**/*.config.*",
        "**/types.ts",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

