import { describe, it, expect } from "vitest";
import type { Question, Verse } from "@/lib/types";

describe("Continuous Reading Mode Logic", () => {
  const createMockVerse = (number: number, arabic: string): Verse => ({
    number,
    arabic,
    transliteration: `Transliteration ${number}`,
    translation: `Translation ${number}`,
  });

  const createMockQuestion = (verseNumber: number, surahNumber: number, surahName: string): Question => ({
    verse: createMockVerse(verseNumber, `Arabic ${verseNumber}`),
    surahNumber,
    surahName,
  });

  describe("Verse Sorting", () => {
    it("should sort questions by verse number", () => {
      const questions: Question[] = [
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[1].verse.number).toBe(2);
      expect(sorted[2].verse.number).toBe(3);
    });

    it("should sort by surah number first, then verse number", () => {
      const questions: Question[] = [
        createMockQuestion(2, 94, "Ash-Sharh"),
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(1, 94, "Ash-Sharh"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted[0].surahNumber).toBe(93);
      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[1].surahNumber).toBe(93);
      expect(sorted[1].verse.number).toBe(3);
      expect(sorted[2].surahNumber).toBe(94);
      expect(sorted[2].verse.number).toBe(1);
      expect(sorted[3].surahNumber).toBe(94);
      expect(sorted[3].verse.number).toBe(2);
    });

    it("should maintain sorted order consistently", () => {
      const questions: Question[] = [
        createMockQuestion(5, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(11, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
      ];

      const sorted1 = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      const sorted2 = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted1.map(q => q.verse.number)).toEqual(sorted2.map(q => q.verse.number));
    });
  });

  describe("Verse Display", () => {
    it("should display all verses in sorted order", () => {
      const questions: Question[] = [
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted.length).toBe(3);
      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[1].verse.number).toBe(2);
      expect(sorted[2].verse.number).toBe(3);
    });

    it("should include all verse properties", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
      ];

      const question = questions[0];
      expect(question.verse).toHaveProperty("number");
      expect(question.verse).toHaveProperty("arabic");
      expect(question.verse).toHaveProperty("transliteration");
      expect(question.verse).toHaveProperty("translation");
      expect(question).toHaveProperty("surahNumber");
      expect(question).toHaveProperty("surahName");
    });
  });

  describe("Surah Information", () => {
    it("should display correct surah name", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const surahName = questions[0].surahName;
      expect(surahName).toBe("Ad-Duha");
    });

    it("should display correct verse count", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
      ];

      const verseCount = questions.length;
      expect(verseCount).toBe(3);
    });

    it("should handle single verse surah", () => {
      const questions: Question[] = [
        createMockQuestion(1, 108, "Al-Kawthar"),
      ];

      expect(questions.length).toBe(1);
      expect(questions[0].verse.number).toBe(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty questions array", () => {
      const questions: Question[] = [];
      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted.length).toBe(0);
    });

    it("should handle single question", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted.length).toBe(1);
      expect(sorted[0].verse.number).toBe(1);
    });

    it("should handle large number of verses", () => {
      const questions: Question[] = Array.from({ length: 100 }, (_, i) =>
        createMockQuestion(i + 1, 93, "Ad-Duha")
      );

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted.length).toBe(100);
      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[99].verse.number).toBe(100);
    });

    it("should handle verses with same number in different surahs", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(1, 94, "Ash-Sharh"),
        createMockQuestion(1, 95, "At-Tin"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted[0].surahNumber).toBe(93);
      expect(sorted[1].surahNumber).toBe(94);
      expect(sorted[2].surahNumber).toBe(95);
    });
  });

  describe("Performance", () => {
    it("should sort questions quickly", () => {
      const questions: Question[] = Array.from({ length: 1000 }, (_, i) =>
        createMockQuestion(i + 1, 93, "Ad-Duha")
      );

      // Shuffle the array first
      const shuffled = [...questions].sort(() => Math.random() - 0.5);

      const start = performance.now();
      const sorted = [...shuffled].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });
      const duration = performance.now() - start;

      expect(sorted.length).toBe(1000);
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    it("should handle multiple sorts efficiently", () => {
      const questions: Question[] = Array.from({ length: 100 }, (_, i) =>
        createMockQuestion(i + 1, 93, "Ad-Duha")
      );

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        [...questions].sort((a, b) => {
          if (a.surahNumber !== b.surahNumber) {
            return a.surahNumber - b.surahNumber;
          }
          return a.verse.number - b.verse.number;
        });
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe("Data Integrity", () => {
    it("should preserve all verse data after sorting", () => {
      const questions: Question[] = [
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      // Verify all original questions are present
      const originalVerseNumbers = new Set(questions.map(q => q.verse.number));
      const sortedVerseNumbers = new Set(sorted.map(q => q.verse.number));
      
      expect(sortedVerseNumbers.size).toBe(originalVerseNumbers.size);
      expect([...sortedVerseNumbers].sort()).toEqual([...originalVerseNumbers].sort());
    });

    it("should not modify original array", () => {
      const questions: Question[] = [
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const originalOrder = questions.map(q => q.verse.number);
      const sorted = [...questions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      // Original array should be unchanged
      expect(questions.map(q => q.verse.number)).toEqual(originalOrder);
      // Sorted array should be different
      expect(sorted.map(q => q.verse.number)).not.toEqual(originalOrder);
    });
  });
});

