import { describe, it, expect } from "vitest";
import { generateQuestionHash, getQuestionHash } from "@/lib/questionHash";
import type { Question } from "@/lib/types";

describe("questionHash", () => {
  const mockQuestions: Question[] = [
    {
      verse: {
        number: 1,
        arabic: "وَالضُّحَىٰ",
        transliteration: "Wa ad-duha",
        translation: "By the morning brightness",
      },
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
  ];

  describe("generateQuestionHash", () => {
    it("should generate hash for questions array", () => {
      const hash = generateQuestionHash(mockQuestions);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should generate same hash for same questions", () => {
      const hash1 = generateQuestionHash(mockQuestions);
      const hash2 = generateQuestionHash(mockQuestions);
      expect(hash1).toBe(hash2);
    });

    it("should generate different hash for different questions", () => {
      const hash1 = generateQuestionHash(mockQuestions);
      const differentQuestions: Question[] = [
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
      const hash2 = generateQuestionHash(differentQuestions);
      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty array", () => {
      const hash = generateQuestionHash([]);
      expect(hash).toBe("empty");
    });

    it("should generate different hash when order changes", () => {
      const reversed = [...mockQuestions].reverse();
      const hash1 = generateQuestionHash(mockQuestions);
      const hash2 = generateQuestionHash(reversed);
      // Order matters in hash generation
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("getQuestionHash", () => {
    it("should return hash string", () => {
      const hash = getQuestionHash(mockQuestions);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should return same hash for same questions", () => {
      const hash1 = getQuestionHash(mockQuestions);
      const hash2 = getQuestionHash(mockQuestions);
      expect(hash1).toBe(hash2);
    });

    it("should delegate to generateQuestionHash", () => {
      const hash1 = getQuestionHash(mockQuestions);
      const hash2 = generateQuestionHash(mockQuestions);
      expect(hash1).toBe(hash2);
    });
  });
});

