import { describe, it, expect } from "vitest";
import { numberArraysEqual } from "@/lib/arrayComparator";

describe("arrayComparator", () => {
  describe("numberArraysEqual", () => {
    it("should return true for identical arrays", () => {
      expect(numberArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(numberArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    });

    it("should return false for arrays of different lengths", () => {
      expect(numberArraysEqual([1, 2, 3], [1, 2])).toBe(false);
      expect(numberArraysEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return true for empty arrays", () => {
      expect(numberArraysEqual([], [])).toBe(true);
    });

    it("should return false when one array is empty", () => {
      expect(numberArraysEqual([], [1, 2, 3])).toBe(false);
      expect(numberArraysEqual([1, 2, 3], [])).toBe(false);
    });

    it("should handle single element arrays", () => {
      expect(numberArraysEqual([1], [1])).toBe(true);
      expect(numberArraysEqual([1], [2])).toBe(false);
    });

    it("should handle arrays with same elements in different order", () => {
      expect(numberArraysEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    it("should handle large arrays", () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => i);
      expect(numberArraysEqual(largeArray, largeArray)).toBe(true);
      expect(
        numberArraysEqual(largeArray, [...largeArray, 100])
      ).toBe(false);
    });
  });
});

