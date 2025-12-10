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
    testTimeout: 3000, // Reduced from 10000 for faster feedback
    hookTimeout: 2000, // Reduced from 10000
    // Optimize for speed
    isolate: false, // Share context between tests for faster execution
    fileParallelism: true, // Run test files in parallel
    // Increase thread pool for parallel execution
    maxConcurrency: 5, // Run more tests in parallel
    minThreads: 2, // Minimum threads for parallel execution
    maxThreads: 4, // Maximum threads
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

