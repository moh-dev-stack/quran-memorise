import { describe, it, expect } from "vitest";
import {
  extractArabicWords,
  extractTransliterationWords,
  extractTranslationWords,
  getWordCount,
} from "@/lib/wordExtractor";

describe("wordExtractor", () => {
  describe("extractArabicWords", () => {
    it("should extract words from Arabic text", () => {
      const text = "وَالضُّحَىٰ وَاللَّيْلِ";
      const words = extractArabicWords(text);
      expect(words.length).toBeGreaterThan(0);
      expect(words).toContain("وَالضُّحَىٰ");
    });

    it("should handle single word", () => {
      const words = extractArabicWords("وَالضُّحَىٰ");
      expect(words).toEqual(["وَالضُّحَىٰ"]);
    });

    it("should filter out empty strings", () => {
      const words = extractArabicWords("  وَالضُّحَىٰ  ");
      expect(words).toEqual(["وَالضُّحَىٰ"]);
    });
  });

  describe("extractTransliterationWords", () => {
    it("should extract words from transliteration", () => {
      const text = "Wa ad-duha wa al-layli";
      const words = extractTransliterationWords(text);
      expect(words.length).toBeGreaterThan(0);
      expect(words).toContain("Wa");
    });

    it("should remove punctuation", () => {
      const words = extractTransliterationWords("Wa ad-duha!");
      expect(words).toContain("adduha");
    });

    it("should handle empty string", () => {
      const words = extractTransliterationWords("");
      expect(words).toEqual([]);
    });
  });

  describe("extractTranslationWords", () => {
    it("should extract words from translation", () => {
      const text = "By the morning brightness";
      const words = extractTranslationWords(text);
      expect(words.length).toBeGreaterThan(0);
      expect(words).toContain("by");
    });

    it("should convert to lowercase", () => {
      const words = extractTranslationWords("By The Morning");
      expect(words.every((w) => w === w.toLowerCase())).toBe(true);
    });
  });

  describe("getWordCount", () => {
    it("should count Arabic words", () => {
      const count = getWordCount("وَالضُّحَىٰ وَاللَّيْلِ", "arabic");
      expect(count).toBe(2);
    });

    it("should count transliteration words", () => {
      const count = getWordCount("Wa ad-duha", "transliteration");
      expect(count).toBe(2);
    });

    it("should count translation words", () => {
      const count = getWordCount("By the morning", "translation");
      expect(count).toBe(3);
    });
  });
});

