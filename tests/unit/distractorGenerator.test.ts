import { describe, it, expect } from "vitest";
import {
  generateDistractors,
  generateTranslationOptions,
  generateArabicTransOptions,
  generateTransliterationOptions,
  generateArabicOptions,
} from "@/lib/distractorGenerator";
import type { Verse, Question } from "@/lib/types";

describe("distractorGenerator", () => {
  const mockVerse: Verse = {
    number: 1,
    arabic: "وَالضُّحَىٰ",
    transliteration: "Wa ad-duha",
    translation: "By the morning brightness",
  };

  const mockQuestions: Question[] = [
    {
      verse: mockVerse,
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 2,
        arabic: "وَاللَّيْلِ",
        transliteration: "Wa al-layli",
        translation: "And by the night",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 3,
        arabic: "مَا وَدَّعَكَ",
        transliteration: "Ma wadda'aka",
        translation: "Your Lord has not forsaken",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
  ];

  describe("generateDistractors", () => {
    it("should generate correct number of distractors", () => {
      const distractors = generateDistractors(mockVerse, mockQuestions, 2);
      expect(distractors.length).toBe(2);
    });

    it("should not include correct verse", () => {
      const distractors = generateDistractors(mockVerse, mockQuestions, 3);
      expect(distractors.every((v) => v.number !== mockVerse.number)).toBe(
        true
      );
    });
  });

  describe("generateTranslationOptions", () => {
    it("should generate at least 2 options", () => {
      const options = generateTranslationOptions(mockVerse, mockQuestions);
      expect(options.length).toBeGreaterThanOrEqual(2);
      // With only 2 questions total, we get 1 correct + 1 distractor = 2 options minimum
      // With more questions, we get 4 options
    });

    it("should include correct translation", () => {
      const options = generateTranslationOptions(mockVerse, mockQuestions);
      expect(options.some((o) => o.isCorrect && o.text === mockVerse.translation)).toBe(
        true
      );
    });

    it("should have exactly one correct option", () => {
      const options = generateTranslationOptions(mockVerse, mockQuestions);
      const correctCount = options.filter((o) => o.isCorrect).length;
      expect(correctCount).toBe(1);
    });
  });

  describe("generateArabicTransOptions", () => {
    it("should generate at least 2 options", () => {
      const options = generateArabicTransOptions(mockVerse, mockQuestions);
      expect(options.length).toBeGreaterThanOrEqual(2);
    });

    it("should include correct Arabic and transliteration", () => {
      const options = generateArabicTransOptions(mockVerse, mockQuestions);
      const correctOption = options.find((o) => o.isCorrect);
      expect(correctOption?.arabic).toBe(mockVerse.arabic);
      expect(correctOption?.transliteration).toBe(mockVerse.transliteration);
    });
  });

  describe("generateTransliterationOptions", () => {
    it("should generate at least 2 options", () => {
      const options = generateTransliterationOptions(mockVerse, mockQuestions);
      expect(options.length).toBeGreaterThanOrEqual(2);
    });

    it("should include correct transliteration", () => {
      const options = generateTransliterationOptions(mockVerse, mockQuestions);
      expect(
        options.some(
          (o) => o.isCorrect && o.text === mockVerse.transliteration
        )
      ).toBe(true);
    });
  });

  describe("generateArabicOptions", () => {
    it("should generate at least 2 options", () => {
      const options = generateArabicOptions(mockVerse, mockQuestions);
      expect(options.length).toBeGreaterThanOrEqual(2);
    });

    it("should include correct Arabic", () => {
      const options = generateArabicOptions(mockVerse, mockQuestions);
      expect(
        options.some((o) => o.isCorrect && o.text === mockVerse.arabic)
      ).toBe(true);
    });
  });
});

