import { describe, it, expect, beforeEach } from "vitest";
import {
  updateWordReview,
  getWordsDueForReview,
  getWordReviewStats,
  initializeWordReview,
  resetWordReview,
} from "@/lib/wordReview";
import { createSM2Item } from "@/lib/spacedRepetition";
import type { Word } from "@/lib/wordTypes";
import { getAllWords } from "@/lib/wordData";

describe("Word Review System", () => {
  let testWord: Word;

  beforeEach(() => {
    const allWords = getAllWords();
    testWord = { ...allWords[0] };
  });

  describe("initializeWordReview", () => {
    it("should add review data to a word without review data", () => {
      const wordWithoutReview = { ...testWord };
      delete wordWithoutReview.reviewData;
      
      const initialized = initializeWordReview(wordWithoutReview);
      expect(initialized.reviewData).toBeDefined();
      expect(initialized.reviewData?.easeFactor).toBe(2.5);
      expect(initialized.reviewData?.interval).toBe(0);
      expect(initialized.reviewData?.repetitions).toBe(0);
    });

    it("should preserve existing review data if present", () => {
      const existingReview = createSM2Item();
      existingReview.easeFactor = 3.0;
      const wordWithReview = { ...testWord, reviewData: existingReview };
      
      const initialized = initializeWordReview(wordWithReview);
      expect(initialized.reviewData?.easeFactor).toBe(3.0);
    });
  });

  describe("updateWordReview", () => {
    it("should update review data with quality score 5 (easy)", () => {
      const wordWithReview = initializeWordReview(testWord);
      const updated = updateWordReview(wordWithReview, 5);
      
      expect(updated.reviewData).toBeDefined();
      expect(updated.reviewData?.easeFactor).toBeGreaterThan(wordWithReview.reviewData!.easeFactor);
      expect(updated.reviewData?.repetitions).toBeGreaterThan(0);
      expect(updated.reviewData?.interval).toBeGreaterThan(0);
    });

    it("should update review data with quality score 0 (forgot)", () => {
      const wordWithReview = initializeWordReview(testWord);
      wordWithReview.reviewData!.repetitions = 5;
      wordWithReview.reviewData!.interval = 10;
      
      const updated = updateWordReview(wordWithReview, 0);
      
      expect(updated.reviewData?.repetitions).toBe(0);
      expect(updated.reviewData?.interval).toBe(1);
      expect(updated.reviewData?.easeFactor).toBeLessThan(wordWithReview.reviewData!.easeFactor);
    });

    it("should update review data with quality score 3 (hard)", () => {
      const wordWithReview = initializeWordReview(testWord);
      const updated = updateWordReview(wordWithReview, 3);
      
      expect(updated.reviewData).toBeDefined();
      expect(updated.reviewData?.repetitions).toBeGreaterThan(0);
    });

    it("should set next review date in the future", () => {
      const wordWithReview = initializeWordReview(testWord);
      const updated = updateWordReview(wordWithReview, 4);
      
      expect(updated.reviewData?.nextReview).toBeInstanceOf(Date);
      const now = new Date();
      expect(updated.reviewData!.nextReview.getTime()).toBeGreaterThan(now.getTime());
    });

    it("should handle quality scores from 0 to 5", () => {
      for (let quality = 0; quality <= 5; quality++) {
        const wordWithReview = initializeWordReview(testWord);
        const updated = updateWordReview(wordWithReview, quality);
        expect(updated.reviewData).toBeDefined();
      }
    });

    it("should maintain minimum ease factor", () => {
      const wordWithReview = initializeWordReview(testWord);
      // Set very low ease factor
      wordWithReview.reviewData!.easeFactor = 1.0;
      
      // Multiple low quality reviews
      let updated = updateWordReview(wordWithReview, 0);
      updated = updateWordReview(updated, 0);
      updated = updateWordReview(updated, 0);
      
      expect(updated.reviewData?.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("getWordsDueForReview", () => {
    it("should return words without review data", () => {
      const words = getAllWords();
      const wordsWithoutReview = words.filter((w) => !w.reviewData);
      const wordsDue = getWordsDueForReview(words);
      
      expect(wordsDue.length).toBeGreaterThanOrEqual(wordsWithoutReview.length);
      wordsWithoutReview.forEach((word) => {
        expect(wordsDue.some((w) => w.id === word.id)).toBe(true);
      });
    });

    it("should return words with past due review dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const wordDue: Word = {
        ...testWord,
        reviewData: {
          ...createSM2Item(),
          nextReview: pastDate,
        },
      };
      
      const words = [wordDue];
      const wordsDue = getWordsDueForReview(words);
      
      expect(wordsDue).toContainEqual(wordDue);
    });

    it("should not return words with future review dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const wordNotDue: Word = {
        ...testWord,
        reviewData: {
          ...createSM2Item(),
          nextReview: futureDate,
        },
      };
      
      const words = [wordNotDue];
      const wordsDue = getWordsDueForReview(words);
      
      expect(wordsDue).not.toContainEqual(wordNotDue);
    });

    it("should handle empty array", () => {
      const wordsDue = getWordsDueForReview([]);
      expect(wordsDue).toEqual([]);
    });

    it("should return words with review date exactly today", () => {
      const today = new Date();
      
      const wordDueToday: Word = {
        ...testWord,
        reviewData: {
          ...createSM2Item(),
          nextReview: today,
        },
      };
      
      const words = [wordDueToday];
      const wordsDue = getWordsDueForReview(words);
      
      expect(wordsDue).toContainEqual(wordDueToday);
    });
  });

  describe("getWordReviewStats", () => {
    it("should calculate correct statistics", () => {
      const words = getAllWords();
      const stats = getWordReviewStats(words);
      
      expect(stats.totalWords).toBe(words.length);
      expect(stats.wordsDue).toBeGreaterThanOrEqual(0);
      expect(stats.wordsMastered).toBeGreaterThanOrEqual(0);
      expect(stats.wordsLearning).toBeGreaterThanOrEqual(0);
      expect(stats.averageEaseFactor).toBeGreaterThanOrEqual(0);
    });

    it("should identify mastered words correctly", () => {
      const masteredWord: Word = {
        ...testWord,
        reviewData: {
          easeFactor: 2.5,
          interval: 10,
          repetitions: 5,
          nextReview: new Date(),
        },
      };
      
      const words = [masteredWord];
      const stats = getWordReviewStats(words);
      
      expect(stats.wordsMastered).toBe(1);
    });

    it("should identify learning words correctly", () => {
      const learningWord: Word = {
        ...testWord,
        reviewData: {
          easeFactor: 2.5,
          interval: 5,
          repetitions: 3,
          nextReview: new Date(),
        },
      };
      
      const words = [learningWord];
      const stats = getWordReviewStats(words);
      
      expect(stats.wordsLearning).toBe(1);
    });

    it("should calculate average ease factor correctly", () => {
      const word1: Word = {
        ...testWord,
        id: "word-1",
        reviewData: { ...createSM2Item(), easeFactor: 2.0 },
      };
      const word2: Word = {
        ...testWord,
        id: "word-2",
        reviewData: { ...createSM2Item(), easeFactor: 3.0 },
      };
      
      const words = [word1, word2];
      const stats = getWordReviewStats(words);
      
      expect(stats.averageEaseFactor).toBe(2.5);
    });

    it("should handle words without review data", () => {
      const wordWithoutReview = { ...testWord };
      delete wordWithoutReview.reviewData;
      
      const words = [wordWithoutReview];
      const stats = getWordReviewStats(words);
      
      expect(stats.totalWords).toBe(1);
      expect(stats.averageEaseFactor).toBe(0);
    });
  });

  describe("resetWordReview", () => {
    it("should reset review data to initial values", () => {
      const wordWithReview: Word = {
        ...testWord,
        reviewData: {
          easeFactor: 3.0,
          interval: 10,
          repetitions: 5,
          nextReview: new Date(),
        },
      };
      
      const reset = resetWordReview(wordWithReview);
      
      expect(reset.reviewData?.easeFactor).toBe(2.5);
      expect(reset.reviewData?.interval).toBe(0);
      expect(reset.reviewData?.repetitions).toBe(0);
    });

    it("should create review data if it doesn't exist", () => {
      const wordWithoutReview = { ...testWord };
      delete wordWithoutReview.reviewData;
      
      const reset = resetWordReview(wordWithoutReview);
      
      expect(reset.reviewData).toBeDefined();
      expect(reset.reviewData?.easeFactor).toBe(2.5);
    });
  });
});

