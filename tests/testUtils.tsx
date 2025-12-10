import { waitFor, waitForOptions, screen } from "@testing-library/react";

/**
 * Fast waitFor with reduced timeout for integration tests
 * Default timeout is 1000ms, we reduce to 200ms for faster tests
 */
export async function fastWaitFor<T>(
  callback: () => T | Promise<T>,
  options?: Omit<waitForOptions, "timeout">
): Promise<T> {
  return waitFor(callback, {
    timeout: 200, // Reduced from default 1000ms
    interval: 10, // Check more frequently (default is 50ms)
    ...options,
  });
}

/**
 * Very fast waitFor for immediate checks (50ms)
 */
export async function instantWaitFor<T>(
  callback: () => T | Promise<T>,
  options?: Omit<waitForOptions, "timeout">
): Promise<T> {
  return waitFor(callback, {
    timeout: 50,
    interval: 5,
    ...options,
  });
}

/**
 * Fast query that doesn't wait - use when element should be immediately available
 */
export function fastGetByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

/**
 * Fast query for buttons
 */
export function fastGetByRole(role: string, options?: { name?: string | RegExp }): HTMLElement {
  return screen.getByRole(role as any, options);
}

