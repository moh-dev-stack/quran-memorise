import { describe, it, expect } from "vitest";
import { generateBlanks, generateMissingWordOptions } from "@/lib/blankGenerator";
import type { Verse } from "@/lib/types";

describe("blankGenerator", () => {
  const mockVerse: Verse = {
    number: 1,
    arabic: "وَالضُّحَىٰ وَاللَّيْلِ",
    transliteration: "Wa ad-duha wa al-layli",
    translation: "By the morning brightness and by the night",
  };

  describe("generateBlanks", () => {
    it("should generate blanks for Arabic text", () => {
      const result = generateBlanks(mockVerse, true);
      expect(result).toHaveProperty("blankedText");
      expect(result).toHaveProperty("missingWords");
      expect(result).toHaveProperty("missingIndices");
      expect(result.missingWords.length).toBeGreaterThan(0);
    });

    it("should generate blanks for transliteration", () => {
      const result = generateBlanks(mockVerse, false);
      expect(result).toHaveProperty("blankedText");
      expect(result.missingWords.length).toBeGreaterThan(0);
    });

    it("should contain blanks in blankedText", () => {
      const result = generateBlanks(mockVerse, true);
      expect(result.blankedText).toContain("____");
    });

    it("should have correct number of missing words", () => {
      const result = generateBlanks(mockVerse, true);
      expect(result.missingWords.length).toBeGreaterThanOrEqual(1);
      expect(result.missingWords.length).toBeLessThanOrEqual(2);
    });

    it("should handle single word verse", () => {
      const singleWordVerse: Verse = {
        ...mockVerse,
        arabic: "وَالضُّحَىٰ",
      };
      const result = generateBlanks(singleWordVerse, true);
      expect(result.missingWords.length).toBe(1);
    });
  });

  describe("generateMissingWordOptions", () => {
    const allVerses: Verse[] = [
      mockVerse,
      {
        number: 2,
        arabic: "مَا وَدَّعَكَ",
        transliteration: "Ma wadda'aka",
        translation: "Your Lord has not forsaken",
      },
    ];

    it("should generate options with correct answer", () => {
      const options = generateMissingWordOptions(
        ["وَالضُّحَىٰ"],
        allVerses,
        true
      );
      expect(options.length).toBe(4);
      expect(options.some((o) => o.isCorrect)).toBe(true);
    });

    it("should include correct word in options", () => {
      const correctWords = ["وَالضُّحَىٰ"];
      const options = generateMissingWordOptions(
        correctWords,
        allVerses,
        true
      );
      const correctOption = options.find((o) => o.isCorrect);
      expect(correctOption).toBeDefined();
      expect(correctOption?.text).toContain("وَالضُّحَىٰ");
    });

    it("should generate distractors from other verses", () => {
      const options = generateMissingWordOptions(
        ["وَالضُّحَىٰ"],
        allVerses,
        true
      );
      const incorrectOptions = options.filter((o) => !o.isCorrect);
      expect(incorrectOptions.length).toBe(3);
    });
  });
});

