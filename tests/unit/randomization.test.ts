import { describe, it, expect } from "vitest";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";

describe("Randomization", () => {
  describe("seededRandom", () => {
    it("should produce same sequence for same seed", () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);

      const values1 = [rng1.next(), rng1.next(), rng1.next()];
      const values2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(values1).toEqual(values2);
    });

    it("should produce different sequences for different seeds", () => {
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(67890);

      const values1 = [rng1.next(), rng1.next(), rng1.next()];
      const values2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(values1).not.toEqual(values2);
    });

    it("should shuffle arrays deterministically", () => {
      const array = [1, 2, 3, 4, 5];
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(12345);

      const shuffled1 = rng1.shuffle([...array]);
      const shuffled2 = rng2.shuffle([...array]);

      expect(shuffled1).toEqual(shuffled2);
    });

    it("should produce different shuffles for different seeds", () => {
      const array = [1, 2, 3, 4, 5];
      const rng1 = createSeededRandom(12345);
      const rng2 = createSeededRandom(67890);

      const shuffled1 = rng1.shuffle([...array]);
      const shuffled2 = rng2.shuffle([...array]);

      // Arrays should be different (though might occasionally match)
      // Check that at least one position is different
      const allSame = shuffled1.every((val, idx) => val === shuffled2[idx]);
      expect(allSame).toBe(false);
    });

    it("should generate integers in range", () => {
      const rng = createSeededRandom(12345);
      const value = rng.nextInt(0, 10);

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
      expect(Number.isInteger(value)).toBe(true);
    });
  });

  describe("seedFromValues", () => {
    it("should generate same seed for same values", () => {
      const seed1 = seedFromValues("test", 123, "value");
      const seed2 = seedFromValues("test", 123, "value");

      expect(seed1).toBe(seed2);
    });

    it("should generate different seeds for different values", () => {
      const seed1 = seedFromValues("test", 123);
      const seed2 = seedFromValues("test", 456);

      expect(seed1).not.toBe(seed2);
    });

    it("should handle empty values", () => {
      const seed = seedFromValues();
      expect(typeof seed).toBe("number");
      expect(seed).toBeGreaterThanOrEqual(0);
    });

    it("should handle mixed types", () => {
      const seed = seedFromValues("string", 123, true, null, undefined);
      expect(typeof seed).toBe("number");
      expect(seed).toBeGreaterThanOrEqual(0);
    });
  });
});

