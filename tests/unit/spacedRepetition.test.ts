import { describe, it, expect } from "vitest";
import {
  createSM2Item,
  updateSM2Item,
  getQualityScore,
  type SM2Item,
} from "@/lib/spacedRepetition";

describe("spacedRepetition", () => {
  describe("createSM2Item", () => {
    it("should create a new SM2 item with initial values", () => {
      const item = createSM2Item();
      expect(item.easeFactor).toBe(2.5);
      expect(item.interval).toBe(0);
      expect(item.repetitions).toBe(0);
      expect(item.nextReview).toBeInstanceOf(Date);
    });
  });

  describe("getQualityScore", () => {
    it("should return 0 for incorrect answer", () => {
      expect(getQualityScore(false)).toBe(0);
    });

    it("should return 4 for correct answer", () => {
      expect(getQualityScore(true)).toBe(4);
    });

    it("should return 5 for correct and easy answer", () => {
      expect(getQualityScore(true, true)).toBe(5);
    });
  });

  describe("updateSM2Item", () => {
    it("should reset repetitions and interval for low quality (0-2)", () => {
      const item: SM2Item = {
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReview: new Date(),
      };

      const updated = updateSM2Item(item, 2);
      expect(updated.repetitions).toBe(0);
      expect(updated.interval).toBe(1);
      expect(updated.easeFactor).toBeLessThan(item.easeFactor);
    });

    it("should set interval to 1 for first repetition (quality >= 3)", () => {
      const item = createSM2Item();
      const updated = updateSM2Item(item, 4);
      expect(updated.repetitions).toBe(1);
      expect(updated.interval).toBe(1);
    });

    it("should set interval to 6 for second repetition", () => {
      const item: SM2Item = {
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReview: new Date(),
      };

      const updated = updateSM2Item(item, 4);
      expect(updated.repetitions).toBe(2);
      expect(updated.interval).toBe(6);
    });

    it("should increase interval based on ease factor for subsequent repetitions", () => {
      const item: SM2Item = {
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: new Date(),
      };

      const updated = updateSM2Item(item, 4);
      expect(updated.repetitions).toBe(3);
      expect(updated.interval).toBeGreaterThan(6);
      expect(updated.interval).toBe(Math.round(6 * updated.easeFactor));
    });

    it("should increase ease factor for high quality answers", () => {
      const item = createSM2Item();
      const updated = updateSM2Item(item, 5);
      expect(updated.easeFactor).toBeGreaterThan(item.easeFactor);
    });

    it("should decrease ease factor for low quality answers", () => {
      const item: SM2Item = {
        easeFactor: 2.5,
        interval: 10,
        repetitions: 3,
        nextReview: new Date(),
      };

      const updated = updateSM2Item(item, 3);
      expect(updated.easeFactor).toBeLessThan(item.easeFactor);
    });

    it("should not allow ease factor below minimum", () => {
      const item: SM2Item = {
        easeFactor: 1.3,
        interval: 10,
        repetitions: 3,
        nextReview: new Date(),
      };

      const updated = updateSM2Item(item, 0);
      expect(updated.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should set next review date correctly", () => {
      const item = createSM2Item();
      const updated = updateSM2Item(item, 4);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + updated.interval);

      expect(updated.nextReview.getDate()).toBe(expectedDate.getDate());
    });
  });
});

