// Setup file for tests
// jest-dom matchers (only used in jsdom environment, harmless in node)
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test (only runs for integration tests with jsdom, safe to call in node)
afterEach(() => {
  cleanup();
});

// Optimize performance - reduce default waitFor timeout globally
vi.setConfig({
  testTimeout: 3000,
  hookTimeout: 2000,
});
