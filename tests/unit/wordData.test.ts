import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllWords,
  getWordsByFrequency,
  getWordsByPartOfSpeech,
  getWordById,
  getWordsForReview,
  searchWordsByArabic,
  searchWordsByTranslation,
} from "@/lib/wordData";
import type { Word, PartOfSpeech } from "@/lib/wordTypes";
import { createSM2Item } from "@/lib/spacedRepetition";

describe("Word Data Utilities", () => {
  let allWords: Word[];

  beforeEach(() => {
    allWords = getAllWords();
  });

  describe("getAllWords", () => {
    it("should return all words from the dataset", () => {
      const words = getAllWords();
      expect(words).toBeInstanceOf(Array);
      expect(words.length).toBeGreaterThan(0);
    });

    it("should return words with all required properties", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word).toHaveProperty("id");
        expect(word).toHaveProperty("arabic");
        expect(word).toHaveProperty("transliteration");
        expect(word).toHaveProperty("translation");
        expect(word).toHaveProperty("partOfSpeech");
        expect(word).toHaveProperty("frequency");
        expect(word).toHaveProperty("verseExamples");
        expect(typeof word.id).toBe("string");
        expect(typeof word.arabic).toBe("string");
        expect(typeof word.transliteration).toBe("string");
        expect(typeof word.translation).toBe("string");
        expect(["verb", "noun", "particle"]).toContain(word.partOfSpeech);
        expect(typeof word.frequency).toBe("number");
        expect(word.frequency).toBeGreaterThan(0);
        expect(Array.isArray(word.verseExamples)).toBe(true);
      });
    });

    it("should return consistent results across multiple calls", () => {
      const words1 = getAllWords();
      const words2 = getAllWords();
      expect(words1.length).toBe(words2.length);
      expect(words1.map((w) => w.id)).toEqual(words2.map((w) => w.id));
    });
  });

  describe("getWordsByFrequency", () => {
    it("should return top N words sorted by frequency", () => {
      const top10 = getWordsByFrequency(10);
      expect(top10.length).toBe(10);
      
      // Verify sorting (descending)
      for (let i = 0; i < top10.length - 1; i++) {
        expect(top10[i].frequency).toBeGreaterThanOrEqual(top10[i + 1].frequency);
      }
    });

    it("should return all words if limit exceeds total count", () => {
      const allWords = getAllWords();
      const top1000 = getWordsByFrequency(1000);
      expect(top1000.length).toBe(allWords.length);
    });

    it("should return empty array for limit of 0", () => {
      const words = getWordsByFrequency(0);
      expect(words).toEqual([]);
    });

    it("should return words with highest frequencies first", () => {
      const top5 = getWordsByFrequency(5);
      const allWords = getAllWords();
      const maxFrequency = Math.max(...allWords.map((w) => w.frequency));
      expect(top5[0].frequency).toBe(maxFrequency);
    });
  });

  describe("getWordsByPartOfSpeech", () => {
    it("should return only verbs when filtering for verbs", () => {
      const verbs = getWordsByPartOfSpeech("verb");
      expect(verbs.length).toBeGreaterThan(0);
      verbs.forEach((word) => {
        expect(word.partOfSpeech).toBe("verb");
      });
    });

    it("should return only nouns when filtering for nouns", () => {
      const nouns = getWordsByPartOfSpeech("noun");
      expect(nouns.length).toBeGreaterThan(0);
      nouns.forEach((word) => {
        expect(word.partOfSpeech).toBe("noun");
      });
    });

    it("should return only particles when filtering for particles", () => {
      const particles = getWordsByPartOfSpeech("particle");
      expect(particles.length).toBeGreaterThan(0);
      particles.forEach((word) => {
        expect(word.partOfSpeech).toBe("particle");
      });
    });

    it("should return empty array if no words match part of speech", () => {
      // Assuming we don't have "adjective" as a part of speech
      const adjectives = getWordsByPartOfSpeech("adjective" as PartOfSpeech);
      expect(adjectives).toEqual([]);
    });
  });

  describe("getWordById", () => {
    it("should return the correct word for a valid ID", () => {
      const allWords = getAllWords();
      if (allWords.length > 0) {
        const testWord = allWords[0];
        const foundWord = getWordById(testWord.id);
        expect(foundWord).toBeDefined();
        expect(foundWord?.id).toBe(testWord.id);
        expect(foundWord?.arabic).toBe(testWord.arabic);
      }
    });

    it("should return undefined for an invalid ID", () => {
      const word = getWordById("non-existent-id");
      expect(word).toBeUndefined();
    });

    it("should return undefined for empty string ID", () => {
      const word = getWordById("");
      expect(word).toBeUndefined();
    });
  });

  describe("getWordsForReview", () => {
    it("should return words without review data as due for review", () => {
      const words = getAllWords();
      const wordsDue = getWordsForReview(words);
      
      // All words without review data should be due
      const wordsWithoutReview = words.filter((w) => !w.reviewData);
      expect(wordsDue.length).toBeGreaterThanOrEqual(wordsWithoutReview.length);
    });

    it("should return words with past due review dates", () => {
      const words = getAllWords();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const wordWithPastReview: Word = {
        ...words[0],
        reviewData: {
          ...createSM2Item(),
          nextReview: pastDate,
        },
      };
      
      const testWords = [wordWithPastReview, ...words.slice(1)];
      const wordsDue = getWordsForReview(testWords);
      
      expect(wordsDue).toContainEqual(wordWithPastReview);
    });

    it("should not return words with future review dates", () => {
      const words = getAllWords();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const wordWithFutureReview: Word = {
        ...words[0],
        reviewData: {
          ...createSM2Item(),
          nextReview: futureDate,
        },
      };
      
      const testWords = [wordWithFutureReview, ...words.slice(1)];
      const wordsDue = getWordsForReview(testWords);
      
      expect(wordsDue).not.toContainEqual(wordWithFutureReview);
    });

    it("should handle empty array", () => {
      const wordsDue = getWordsForReview([]);
      expect(wordsDue).toEqual([]);
    });
  });

  describe("searchWordsByArabic", () => {
    it("should find words containing the Arabic text", () => {
      const allWords = getAllWords();
      if (allWords.length > 0) {
        const testWord = allWords[0];
        const searchTerm = testWord.arabic.substring(0, 2);
        const results = searchWordsByArabic(searchTerm);
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((w) => w.id === testWord.id)).toBe(true);
      }
    });

    it("should return empty array for non-existent Arabic text", () => {
      const results = searchWordsByArabic("غيرموجود");
      expect(results).toEqual([]);
    });

    it("should handle empty search string", () => {
      const results = searchWordsByArabic("");
      expect(results.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("searchWordsByTranslation", () => {
    it("should find words containing the translation text", () => {
      const allWords = getAllWords();
      if (allWords.length > 0) {
        const testWord = allWords[0];
        const searchTerm = testWord.translation.split(" ")[0];
        const results = searchWordsByTranslation(searchTerm);
        expect(results.length).toBeGreaterThan(0);
        expect(results.some((w) => w.id === testWord.id)).toBe(true);
      }
    });

    it("should be case-insensitive", () => {
      const allWords = getAllWords();
      if (allWords.length > 0) {
        const testWord = allWords[0];
        const searchTerm = testWord.translation.toUpperCase();
        const results = searchWordsByTranslation(searchTerm);
        expect(results.some((w) => w.id === testWord.id)).toBe(true);
      }
    });

    it("should return empty array for non-existent translation", () => {
      const results = searchWordsByTranslation("nonexistentword");
      expect(results).toEqual([]);
    });
  });
});

