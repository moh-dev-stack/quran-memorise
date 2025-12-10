import { describe, it, expect } from "vitest";
import type { Question, Verse } from "@/lib/types";
import { getQuestionsForSurah } from "@/lib/questions";

describe("Reading Mode Verse Ordering", () => {
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
      const unsortedQuestions: Question[] = [
        createMockQuestion(5, 93, "Ad-Duha"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(3, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(4, 93, "Ad-Duha"),
      ];

      const sorted = [...unsortedQuestions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[1].verse.number).toBe(2);
      expect(sorted[2].verse.number).toBe(3);
      expect(sorted[3].verse.number).toBe(4);
      expect(sorted[4].verse.number).toBe(5);
    });

    it("should handle real surah data ordering", () => {
      const questions = getQuestionsForSurah(93); // Ad-Duha
      
      // Verify questions are in verse number order
      for (let i = 1; i < questions.length; i++) {
        expect(questions[i].verse.number).toBeGreaterThan(questions[i - 1].verse.number);
      }
    });

    it("should display correct verse numbers", () => {
      const questions = getQuestionsForSurah(93);
      
      // Verify verse numbers match their position in sorted array
      questions.forEach((q, index) => {
        expect(q.verse.number).toBe(index + 1);
      });
    });

    it("should handle mixed surah numbers correctly", () => {
      const mixedQuestions: Question[] = [
        createMockQuestion(2, 94, "Ash-Sharh"),
        createMockQuestion(1, 93, "Ad-Duha"),
        createMockQuestion(2, 93, "Ad-Duha"),
        createMockQuestion(1, 94, "Ash-Sharh"),
      ];

      const sorted = [...mixedQuestions].sort((a, b) => {
        if (a.surahNumber !== b.surahNumber) {
          return a.surahNumber - b.surahNumber;
        }
        return a.verse.number - b.verse.number;
      });

      // Should be sorted by surah first, then verse
      expect(sorted[0].surahNumber).toBe(93);
      expect(sorted[0].verse.number).toBe(1);
      expect(sorted[1].surahNumber).toBe(93);
      expect(sorted[1].verse.number).toBe(2);
      expect(sorted[2].surahNumber).toBe(94);
      expect(sorted[2].verse.number).toBe(1);
      expect(sorted[3].surahNumber).toBe(94);
      expect(sorted[3].verse.number).toBe(2);
    });
  });

  describe("Verse Number Display", () => {
    it("should show actual verse number, not array index", () => {
      const questions = getQuestionsForSurah(93);
      
      // For Ad-Duha, verse at index 4 should be verse number 5
      const verseAtIndex4 = questions[4];
      expect(verseAtIndex4.verse.number).toBe(5);
      
      // Display should show verse 5, not "Verse 5 of 11" meaning index 5
      const displayText = `Verse ${verseAtIndex4.verse.number} of ${questions.length}`;
      expect(displayText).toBe("Verse 5 of 11");
    });

    it("should correctly identify verse 5 in Ad-Duha", () => {
      const questions = getQuestionsForSurah(93);
      
      // Find verse number 5
      const verse5 = questions.find(q => q.verse.number === 5);
      expect(verse5).toBeDefined();
      expect(verse5?.verse.number).toBe(5);
      expect(verse5?.verse.arabic).toContain("وَلَسَوْفَ");
    });
  });

  describe("Navigation Order", () => {
    it("should navigate in verse number order", () => {
      const questions = getQuestionsForSurah(93);
      const sorted = [...questions].sort((a, b) => a.verse.number - b.verse.number);
      
      // Starting at verse 1
      let currentIndex = 0;
      expect(sorted[currentIndex].verse.number).toBe(1);
      
      // Next should be verse 2
      currentIndex = 1;
      expect(sorted[currentIndex].verse.number).toBe(2);
      
      // Next should be verse 3
      currentIndex = 2;
      expect(sorted[currentIndex].verse.number).toBe(3);
    });

    it("should allow jumping to verse 5 directly", () => {
      const questions = getQuestionsForSurah(93);
      const sorted = [...questions].sort((a, b) => a.verse.number - b.verse.number);
      
      const verse5Index = sorted.findIndex(q => q.verse.number === 5);
      expect(verse5Index).toBe(4); // Index 4 (0-based) for verse 5
      expect(sorted[verse5Index].verse.number).toBe(5);
    });
  });
});

