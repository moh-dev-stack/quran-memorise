/**
 * Utility functions for performance optimization
 */

/**
 * Fast Fisher-Yates shuffle algorithm
 * More efficient than sort(() => Math.random() - 0.5)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Fast array deduplication using Set
 */
export function deduplicateArray<T>(array: T[], keyFn?: (item: T) => string): T[] {
  if (!keyFn) {
    return Array.from(new Set(array));
  }
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of array) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Efficient array intersection
 */
export function arrayIntersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter((item) => setB.has(item));
}

/**
 * Efficient array difference
 */
export function arrayDifference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter((item) => !setB.has(item));
}

/**
 * Batch process array items in chunks
 */
export function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => R[]
): R[] {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...processor(batch));
  }
  return results;
}

