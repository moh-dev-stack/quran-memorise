// Setup file for tests
// jest-dom matchers (only used in jsdom environment, harmless in node)
import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test (only runs for integration tests with jsdom, safe to call in node)
afterEach(() => {
  cleanup();
});
