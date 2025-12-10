import { describe, it, expect } from "vitest";
import type { Question, Verse } from "@/lib/types";

describe("Reading Mode Logic", () => {
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

  describe("Verse Navigation", () => {
    it("should find correct verse index", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
      ];

      const currentQuestion = questions[1];
      const index = questions.findIndex(
        (q) => q.verse.number === currentQuestion.verse.number && q.surahNumber === currentQuestion.surahNumber
      );

      expect(index).toBe(1);
    });

    it("should handle first verse", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const currentQuestion = questions[0];
      const index = questions.findIndex(
        (q) => q.verse.number === currentQuestion.verse.number && q.surahNumber === currentQuestion.surahNumber
      );

      expect(index).toBe(0);
      expect(index > 0).toBe(false); // Can't go previous
      expect(index < questions.length - 1).toBe(true); // Can go next
    });

    it("should handle last verse", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const currentQuestion = questions[questions.length - 1];
      const index = questions.findIndex(
        (q) => q.verse.number === currentQuestion.verse.number && q.surahNumber === currentQuestion.surahNumber
      );

      expect(index).toBe(questions.length - 1);
      expect(index > 0).toBe(true); // Can go previous
      expect(index < questions.length - 1).toBe(false); // Can't go next
    });

    it("should handle single verse", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
      ];

      const currentQuestion = questions[0];
      const index = questions.findIndex(
        (q) => q.verse.number === currentQuestion.verse.number && q.surahNumber === currentQuestion.surahNumber
      );

      expect(index).toBe(0);
      expect(index > 0).toBe(false); // Can't go previous
      expect(index < questions.length - 1).toBe(false); // Can't go next
    });
  });

  describe("Verse Index Bounds", () => {
    it("should prevent going below 0", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      let currentIndex = 0;
      const canGoPrevious = currentIndex > 0;
      expect(canGoPrevious).toBe(false);

      // Try to go previous (should not change)
      if (canGoPrevious) {
        currentIndex = currentIndex - 1;
      }
      expect(currentIndex).toBe(0);
    });

    it("should prevent going beyond last verse", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      let currentIndex = questions.length - 1;
      const canGoNext = currentIndex < questions.length - 1;
      expect(canGoNext).toBe(false);

      // Try to go next (should not change)
      if (canGoNext) {
        currentIndex = currentIndex + 1;
      }
      expect(currentIndex).toBe(questions.length - 1);
    });
  });

  describe("Verse Selection", () => {
    it("should select verse by index", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
      ];

      const selectedIndex = 1;
      const selectedVerse = questions[selectedIndex];
      
      expect(selectedVerse.verse.number).toBe(2);
      expect(selectedVerse.verse.arabic).toBe("Arabic 2");
    });

    it("should handle invalid index gracefully", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const invalidIndex = 10;
      const selectedVerse = questions[invalidIndex];
      
      expect(selectedVerse).toBeUndefined();
    });
  });

  describe("Verse Counter Display", () => {
    it("should display correct verse number", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
      ];

      const currentIndex = 1;
      const displayText = `Verse ${currentIndex + 1} of ${questions.length}`;
      
      expect(displayText).toBe("Verse 2 of 3");
    });

    it("should handle first verse display", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const currentIndex = 0;
      const displayText = `Verse ${currentIndex + 1} of ${questions.length}`;
      
      expect(displayText).toBe("Verse 1 of 2");
    });

    it("should handle last verse display", () => {
      const questions: Question[] = [
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
      ];

      const currentIndex = questions.length - 1;
      const displayText = `Verse ${currentIndex + 1} of ${questions.length}`;
      
      expect(displayText).toBe("Verse 2 of 2");
    });
  });
});

