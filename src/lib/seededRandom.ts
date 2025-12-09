/**
 * Seeded random number generator for consistent randomness
 * Same seed always produces same sequence
 */

/**
 * Simple seeded random number generator
 * Based on Linear Congruential Generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    // LCG parameters (used by glibc)
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle array deterministically
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Create seeded random generator from a seed value
 */
export function createSeededRandom(seed: number): SeededRandom {
  return new SeededRandom(seed);
}

/**
 * Generate seed from verse number for consistent randomness per verse
 */
export function seedFromVerseNumber(verseNumber: number): number {
  return verseNumber * 7919; // Prime multiplier for better distribution
}

/**
 * Generate seed from multiple values
 */
export function seedFromValues(...values: (string | number)[]): number {
  let hash = 0;
  const combined = values.join("-");
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

