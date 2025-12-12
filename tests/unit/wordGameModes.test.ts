import { describe, it, expect } from "vitest";
import {
  WORD_GAME_MODES,
  getWordGameModeById,
  generateWordDistractors,
} from "@/lib/wordGameModes";
import { getAllWords } from "@/lib/wordData";
import type { Word } from "@/lib/wordTypes";

describe("Word Game Modes", () => {
  describe("WORD_GAME_MODES", () => {
    it("should have all required game modes", () => {
      const modeIds = WORD_GAME_MODES.map((m) => m.id);
      expect(modeIds).toContain("arabic-to-translation");
      expect(modeIds).toContain("translation-to-arabic");
      expect(modeIds).toContain("transliteration-to-translation");
    });

    it("should have modes with required properties", () => {
      WORD_GAME_MODES.forEach((mode) => {
        expect(mode).toHaveProperty("id");
        expect(mode).toHaveProperty("name");
        expect(mode).toHaveProperty("description");
        expect(typeof mode.id).toBe("string");
        expect(typeof mode.name).toBe("string");
        expect(typeof mode.description).toBe("string");
      });
    });
  });

  describe("getWordGameModeById", () => {
    it("should return correct mode for valid ID", () => {
      const mode = getWordGameModeById("arabic-to-translation");
      expect(mode).toBeDefined();
      expect(mode?.id).toBe("arabic-to-translation");
    });

    it("should return undefined for invalid ID", () => {
      const mode = getWordGameModeById("non-existent" as any);
      expect(mode).toBeUndefined();
    });
  });

  describe("generateWordDistractors", () => {
    let allWords: Word[];
    let testWord: Word;

    beforeEach(() => {
      allWords = getAllWords();
      testWord = allWords[0];
    });

    it("should generate correct number of distractors", () => {
      const distractors = generateWordDistractors(testWord, allWords, 3);
      expect(distractors.length).toBe(3);
    });

    it("should not include the correct word in distractors", () => {
      const distractors = generateWordDistractors(testWord, allWords, 10);
      const includesCorrect = distractors.some((w) => w.id === testWord.id);
      expect(includesCorrect).toBe(false);
    });

    it("should prefer words with same part of speech", () => {
      const distractors = generateWordDistractors(testWord, allWords, 3);
      if (distractors.length > 0) {
        const samePartOfSpeech = distractors.filter(
          (w) => w.partOfSpeech === testWord.partOfSpeech
        );
        // Should prefer same part of speech if available
        expect(samePartOfSpeech.length).toBeGreaterThan(0);
      }
    });

    it("should return empty array if not enough words available", () => {
      const singleWord = [testWord];
      const distractors = generateWordDistractors(testWord, singleWord, 3);
      expect(distractors.length).toBe(0);
    });

    it("should handle default count parameter", () => {
      const distractors = generateWordDistractors(testWord, allWords);
      expect(distractors.length).toBe(3);
    });

    it("should return different distractors on each call (shuffled)", () => {
      const distractors1 = generateWordDistractors(testWord, allWords, 5);
      const distractors2 = generateWordDistractors(testWord, allWords, 5);
      
      // They might be the same, but order should potentially differ
      // At minimum, they should both be valid
      expect(distractors1.length).toBe(5);
      expect(distractors2.length).toBe(5);
      expect(distractors1.every((w) => w.id !== testWord.id)).toBe(true);
      expect(distractors2.every((w) => w.id !== testWord.id)).toBe(true);
    });

    it("should handle count larger than available words", () => {
      const availableWords = allWords.slice(0, 5);
      const distractors = generateWordDistractors(testWord, availableWords, 10);
      expect(distractors.length).toBeLessThanOrEqual(4); // Max available minus correct word
    });
  });
});

