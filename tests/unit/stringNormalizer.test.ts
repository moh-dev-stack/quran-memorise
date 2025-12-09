import { describe, it, expect } from "vitest";
import {
  normalizeWhitespace,
  removePunctuation,
  normalizeArabic,
  normalizeTransliteration,
  normalizeTranslation,
  compareNormalized,
  isEmpty,
} from "@/lib/stringNormalizer";

describe("stringNormalizer", () => {
  describe("normalizeWhitespace", () => {
    it("should trim and normalize whitespace", () => {
      expect(normalizeWhitespace("  hello   world  ")).toBe("hello world");
      expect(normalizeWhitespace("hello\n\tworld")).toBe("hello world");
    });

    it("should handle empty strings", () => {
      expect(normalizeWhitespace("")).toBe("");
      expect(normalizeWhitespace("   ")).toBe("");
    });
  });

  describe("removePunctuation", () => {
    it("should remove punctuation", () => {
      expect(removePunctuation("hello, world!")).toBe("hello world");
      expect(removePunctuation("test-case")).toBe("testcase");
    });

    it("should preserve Arabic characters", () => {
      expect(removePunctuation("وَالضُّحَىٰ")).toBe("وَالضُّحَىٰ");
    });
  });

  describe("normalizeArabic", () => {
    it("should remove Arabic diacritics", () => {
      const withDiacritics = "وَالضُّحَىٰ";
      const normalized = normalizeArabic(withDiacritics);
      expect(normalized).not.toContain("\u064B");
    });

    it("should normalize whitespace", () => {
      expect(normalizeArabic("  والضحى  ")).toBe("والضحى");
    });
  });

  describe("normalizeTransliteration", () => {
    it("should lowercase and remove punctuation", () => {
      expect(normalizeTransliteration("Wa ad-duha!")).toBe("wa adduha");
    });

    it("should normalize whitespace", () => {
      expect(normalizeTransliteration("  Wa   ad-duha  ")).toBe("wa adduha");
    });
  });

  describe("normalizeTranslation", () => {
    it("should lowercase and normalize", () => {
      expect(normalizeTranslation("By The Morning")).toBe("by the morning");
    });
  });

  describe("compareNormalized", () => {
    it("should compare Arabic correctly", () => {
      expect(compareNormalized("وَالضُّحَىٰ", "والضحى", "arabic")).toBe(true);
    });

    it("should compare transliteration correctly", () => {
      expect(compareNormalized("Wa ad-duha", "wa adduha", "transliteration")).toBe(true);
    });

    it("should compare translation correctly", () => {
      expect(compareNormalized("By The Morning", "by the morning", "translation")).toBe(true);
    });

    it("should return false for different strings", () => {
      expect(compareNormalized("hello", "world", "translation")).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("should detect empty strings", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should detect non-empty strings", () => {
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty("  hello  ")).toBe(false);
    });
  });
});

