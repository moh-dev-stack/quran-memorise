import { describe, it, expect } from "vitest";
import { calculateScore, calculateTotalScore } from "@/lib/scoreCalculator";
import type { GameMode } from "@/lib/types";

describe("scoreCalculator", () => {
  describe("calculateScore", () => {
    const modes: GameMode[] = [
      "arabic-trans-to-translation",
      "translation-to-arabic-trans",
      "sequential-order",
      "first-last-word",
    ];

    modes.forEach((mode) => {
      it(`should give 10 points for correct answer in ${mode}`, () => {
        const result = calculateScore(mode, true);
        expect(result.points).toBe(10);
        expect(result.maxPoints).toBe(10);
      });

      it(`should give 0 points for incorrect answer in ${mode}`, () => {
        const result = calculateScore(mode, false);
        expect(result.points).toBe(0);
        expect(result.maxPoints).toBe(10);
      });
    });

    describe("missing-word mode", () => {
      it("should give 8 points for correct answer without reveal", () => {
        const result = calculateScore("missing-word", true, false);
        expect(result.points).toBe(8);
        expect(result.maxPoints).toBe(10);
      });

      it("should give 4 points for correct answer with reveal", () => {
        const result = calculateScore("missing-word", true, true);
        expect(result.points).toBe(4);
        expect(result.maxPoints).toBe(10);
      });

      it("should give 0 points for incorrect answer", () => {
        const result = calculateScore("missing-word", false, false);
        expect(result.points).toBe(0);
        expect(result.maxPoints).toBe(10);
      });
    });
  });

  describe("calculateTotalScore", () => {
    it("should calculate total score correctly", () => {
      const scores = [
        { points: 10, maxPoints: 10 },
        { points: 8, maxPoints: 10 },
        { points: 0, maxPoints: 10 },
      ];
      const result = calculateTotalScore(scores);
      expect(result.total).toBe(18);
      expect(result.maxTotal).toBe(30);
      expect(result.percentage).toBe(60);
    });

    it("should handle empty scores", () => {
      const result = calculateTotalScore([]);
      expect(result.total).toBe(0);
      expect(result.maxTotal).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it("should calculate 100% correctly", () => {
      const scores = [
        { points: 10, maxPoints: 10 },
        { points: 10, maxPoints: 10 },
      ];
      const result = calculateTotalScore(scores);
      expect(result.percentage).toBe(100);
    });
  });
});

