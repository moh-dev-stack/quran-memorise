import { describe, it, expect } from "vitest";
import { checkAnswer } from "@/lib/answerChecker";

describe("answerChecker", () => {
  describe("checkAnswer", () => {
    it("should return true for exact Arabic match", () => {
      const result = checkAnswer(
        "وَالضُّحَىٰ",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });

    it("should return true for Arabic match without diacritics", () => {
      const result = checkAnswer(
        "والضحى",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });

    it("should return true for exact transliteration match", () => {
      const result = checkAnswer(
        "Wa ad-duha",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });

    it("should return true for case-insensitive transliteration", () => {
      const result = checkAnswer(
        "wa ad-duha",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });

    it("should return true for transliteration with different punctuation", () => {
      const result = checkAnswer(
        "Wa ad duha",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });

    it("should return false for incorrect answer", () => {
      const result = checkAnswer(
        "wrong answer",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(false);
    });

    it("should return false for empty answer", () => {
      const result = checkAnswer("", "وَالضُّحَىٰ", "Wa ad-duha");
      expect(result).toBe(false);
    });

    it("should return true for partial match on longer verses", () => {
      const arabic = "وَاللَّيْلِ إِذَا سَجَىٰ";
      const transliteration = "Wa al-layli idha saja";
      const result = checkAnswer(
        "Wa al-layli idha",
        arabic,
        transliteration
      );
      expect(result).toBe(true);
    });

    it("should handle Arabic text with whitespace", () => {
      const result = checkAnswer(
        "  والضحى  ",
        "وَالضُّحَىٰ",
        "Wa ad-duha"
      );
      expect(result).toBe(true);
    });
  });
});

