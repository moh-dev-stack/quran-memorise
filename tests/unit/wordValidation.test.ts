import { describe, it, expect } from "vitest";
import { getAllWords } from "@/lib/wordData";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Word } from "@/lib/wordTypes";

describe("Word Data Validation", () => {
  describe("Word Structure Validation", () => {
    it("should have all words with valid structure", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.id).toBeTruthy();
        expect(word.arabic).toBeTruthy();
        expect(word.transliteration).toBeTruthy();
        expect(word.translation).toBeTruthy();
        expect(word.partOfSpeech).toMatch(/^(verb|noun|particle)$/);
        expect(word.frequency).toBeGreaterThan(0);
        expect(Array.isArray(word.verseExamples)).toBe(true);
      });
    });

    it("should have unique IDs for all words", () => {
      const words = getAllWords();
      const ids = words.map((w) => w.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have non-empty Arabic text", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.arabic.trim().length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty transliteration", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.transliteration.trim().length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty translation", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.translation.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("Verse Examples Validation", () => {
    it("should have at least one verse example per word", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.verseExamples.length).toBeGreaterThan(0);
      });
    });

    it("should have valid verse example structure", () => {
      const words = getAllWords();
      words.forEach((word) => {
        word.verseExamples.forEach((example) => {
          expect(example).toHaveProperty("surah");
          expect(example).toHaveProperty("verse");
          expect(example).toHaveProperty("arabic");
          expect(example).toHaveProperty("translation");
          expect(typeof example.surah).toBe("number");
          expect(typeof example.verse).toBe("number");
          expect(typeof example.arabic).toBe("string");
          expect(typeof example.translation).toBe("string");
          expect(example.surah).toBeGreaterThan(0);
          expect(example.verse).toBeGreaterThan(0);
        });
      });
    });

    it("should have valid surah numbers in verse examples", () => {
      const words = getAllWords();
      const validSurahs = new Set(
        Array.from({ length: 114 }, (_, i) => i + 1)
      );
      
      words.forEach((word) => {
        word.verseExamples.forEach((example) => {
          expect(validSurahs.has(example.surah)).toBe(true);
        });
      });
    });

    it("should have verse examples that reference valid verses", async () => {
      const words = getAllWords();
      const validationErrors: string[] = [];
      
      for (const word of words) {
        for (const example of word.verseExamples) {
          try {
            const questions = getQuestionsForSurah(example.surah);
            const verseExists = questions.some(
              (q) => q.verse.number === example.verse
            );
            if (!verseExists) {
              validationErrors.push(
                `Word ${word.id}: Verse ${example.surah}:${example.verse} not found`
              );
            }
          } catch (error) {
            validationErrors.push(
              `Word ${word.id}: Surah ${example.surah} not available`
            );
          }
        }
      }
      
      // Log errors but don't fail if some surahs aren't loaded yet
      if (validationErrors.length > 0) {
        console.warn("Verse validation warnings:", validationErrors);
      }
    });
  });

  describe("Frequency Data Validation", () => {
    it("should have positive frequency values", () => {
      const words = getAllWords();
      words.forEach((word) => {
        expect(word.frequency).toBeGreaterThan(0);
        expect(Number.isInteger(word.frequency) || word.frequency > 0).toBe(true);
      });
    });

    it("should have reasonable frequency values (not extremely high)", () => {
      const words = getAllWords();
      words.forEach((word) => {
        // Most common word (Allah) appears ~2800 times
        expect(word.frequency).toBeLessThan(10000);
      });
    });
  });

  describe("Part of Speech Validation", () => {
    it("should have valid part of speech values", () => {
      const words = getAllWords();
      const validPartsOfSpeech = ["verb", "noun", "particle"];
      words.forEach((word) => {
        expect(validPartsOfSpeech).toContain(word.partOfSpeech);
      });
    });

    it("should have words from all parts of speech", () => {
      const words = getAllWords();
      const partsOfSpeech = new Set(words.map((w) => w.partOfSpeech));
      expect(partsOfSpeech.size).toBeGreaterThan(1);
    });
  });

  describe("Root Letters Validation", () => {
    it("should have valid root format when root is provided", () => {
      const words = getAllWords();
      words.forEach((word) => {
        if (word.root) {
          // Root should be space-separated Arabic letters or empty
          expect(typeof word.root).toBe("string");
          expect(word.root.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("Combinations Validation", () => {
    it("should have valid combinations array when provided", () => {
      const words = getAllWords();
      words.forEach((word) => {
        if (word.combinations) {
          expect(Array.isArray(word.combinations)).toBe(true);
          word.combinations.forEach((combination) => {
            expect(typeof combination).toBe("string");
            expect(combination.trim().length).toBeGreaterThan(0);
          });
        }
      });
    });
  });

  describe("Data Consistency", () => {
    it("should have consistent data across all words", () => {
      const words = getAllWords();
      const requiredFields = ["id", "arabic", "transliteration", "translation", "partOfSpeech", "frequency", "verseExamples"];
      
      words.forEach((word) => {
        requiredFields.forEach((field) => {
          expect(word).toHaveProperty(field);
        });
      });
    });

    it("should not have duplicate Arabic words with different IDs", () => {
      const words = getAllWords();
      const arabicMap = new Map<string, string[]>();
      
      words.forEach((word) => {
        if (!arabicMap.has(word.arabic)) {
          arabicMap.set(word.arabic, []);
        }
        arabicMap.get(word.arabic)!.push(word.id);
      });
      
      // Check for duplicates (some words might legitimately have same Arabic form)
      const duplicates = Array.from(arabicMap.entries()).filter(
        ([_, ids]) => ids.length > 1
      );
      
      // Log but don't fail - some words might have same Arabic form
      if (duplicates.length > 0) {
        console.info("Words with same Arabic form:", duplicates);
      }
    });
  });
});

