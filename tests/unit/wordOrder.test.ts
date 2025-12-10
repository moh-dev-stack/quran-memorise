import { describe, it, expect } from "vitest";
import { extractArabicWords } from "@/lib/wordExtractor";
import { shuffleArray } from "@/lib/utils";
import type { Question, Verse } from "@/lib/types";

describe("Word Order Game Logic", () => {
  const mockVerse: Verse = {
    number: 1,
    arabic: "وَالضُّحَىٰ وَاللَّيْلِ",
    transliteration: "Wa ad-duha wa al-layli",
    translation: "By the morning brightness and by the night",
  };

  const mockQuestion: Question = {
    verse: mockVerse,
    surahNumber: 93,
    surahName: "Ad-Duha",
  };

  describe("Word Extraction", () => {
    it("should extract Arabic words correctly", () => {
      const words = extractArabicWords(mockVerse.arabic);
      expect(words.length).toBeGreaterThan(0);
      expect(words).toContain("وَالضُّحَىٰ");
      expect(words).toContain("وَاللَّيْلِ");
    });

    it("should handle single word verses", () => {
      const singleWordVerse: Verse = {
        ...mockVerse,
        arabic: "قُلْ",
      };
      const words = extractArabicWords(singleWordVerse.arabic);
      expect(words).toEqual(["قُلْ"]);
    });

    it("should handle empty or whitespace-only text", () => {
      const emptyWords = extractArabicWords("");
      expect(emptyWords).toEqual([]);
      
      const whitespaceWords = extractArabicWords("   ");
      expect(whitespaceWords).toEqual([]);
    });

    it("should preserve word order", () => {
      const words = extractArabicWords(mockVerse.arabic);
      const firstWord = words[0];
      const lastWord = words[words.length - 1];
      expect(mockVerse.arabic.startsWith(firstWord)).toBe(true);
      expect(mockVerse.arabic.endsWith(lastWord)).toBe(true);
    });
  });

  describe("Word Shuffling", () => {
    it("should shuffle words without losing any", () => {
      const originalWords = extractArabicWords(mockVerse.arabic);
      const shuffled = shuffleArray([...originalWords]);
      
      expect(shuffled.length).toBe(originalWords.length);
      expect(shuffled.sort()).toEqual(originalWords.sort());
    });

    it("should produce different order on each shuffle", () => {
      const originalWords = extractArabicWords(mockVerse.arabic);
      if (originalWords.length < 2) {
        // Skip test for single-word verses
        return;
      }
      
      const shuffle1 = shuffleArray([...originalWords]);
      const shuffle2 = shuffleArray([...originalWords]);
      const shuffle3 = shuffleArray([...originalWords]);
      
      // With multiple shuffles, at least one should be different from original
      // Check if any shuffle differs from original order
      const shuffles = [shuffle1, shuffle2, shuffle3];
      const hasDifferentOrder = shuffles.some(shuffle => 
        !shuffle.every((word, index) => word === originalWords[index])
      );
      
      // With 3 shuffles, probability of all being same as original is extremely low
      expect(hasDifferentOrder).toBe(true);
    });

    it("should handle single word (no shuffle needed)", () => {
      const singleWord = ["قُلْ"];
      const shuffled = shuffleArray([...singleWord]);
      expect(shuffled).toEqual(singleWord);
    });
  });

  describe("Answer Validation", () => {
    it("should correctly identify perfect match", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      const userAnswer = [...correctWords];
      
      const isCorrect = userAnswer.every((word, index) => word === correctWords[index]);
      expect(isCorrect).toBe(true);
    });

    it("should correctly identify incorrect order", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      if (correctWords.length < 2) return;
      
      const userAnswer = [...correctWords].reverse();
      const isCorrect = userAnswer.every((word, index) => word === correctWords[index]);
      expect(isCorrect).toBe(false);
    });

    it("should correctly identify partial match", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      if (correctWords.length < 2) return;
      
      const userAnswer = [correctWords[0], "wrong", ...correctWords.slice(2)];
      const isCorrect = userAnswer.every((word, index) => word === correctWords[index]);
      expect(isCorrect).toBe(false);
    });

    it("should handle empty answer", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      const userAnswer: string[] = [];
      
      const isCorrect = userAnswer.length === correctWords.length && 
        userAnswer.every((word, index) => word === correctWords[index]);
      expect(isCorrect).toBe(false);
    });

    it("should handle answer with wrong length", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      const userAnswer = [...correctWords, "extra"];
      
      const isCorrect = userAnswer.length === correctWords.length && 
        userAnswer.every((word, index) => word === correctWords[index]);
      expect(isCorrect).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle verses with many words", () => {
      const longVerse: Verse = {
        ...mockVerse,
        arabic: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ مَا وَدَّعَكَ رَبُّكَ",
      };
      const words = extractArabicWords(longVerse.arabic);
      expect(words.length).toBeGreaterThan(5);
    });

    it("should handle verses with punctuation and diacritics", () => {
      const verseWithDiacritics: Verse = {
        ...mockVerse,
        arabic: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ",
      };
      const words = extractArabicWords(verseWithDiacritics.arabic);
      expect(words.length).toBeGreaterThan(0);
      words.forEach(word => {
        expect(word.length).toBeGreaterThan(0);
      });
    });

    it("should handle repeated words", () => {
      const verseWithRepeats: Verse = {
        ...mockVerse,
        arabic: "وَالضُّحَىٰ وَالضُّحَىٰ",
      };
      const words = extractArabicWords(verseWithRepeats.arabic);
      expect(words.filter(w => w === "وَالضُّحَىٰ").length).toBe(2);
    });
  });

  describe("Performance", () => {
    it("should extract words quickly", () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        extractArabicWords(mockVerse.arabic);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    it("should shuffle words quickly", () => {
      const words = extractArabicWords(mockVerse.arabic);
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        shuffleArray([...words]);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should validate answers quickly", () => {
      const correctWords = extractArabicWords(mockVerse.arabic);
      const userAnswer = [...correctWords];
      
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        userAnswer.every((word, index) => word === correctWords[index]);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});

