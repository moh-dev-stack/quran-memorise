import { describe, it, expect, vi } from "vitest";
import {
  generateDistractors,
  generateTranslationOptions,
  generateArabicTransOptions,
} from "@/lib/distractorGenerator";
import { generateBlanks, generateMissingWordOptions } from "@/lib/blankGenerator";
import { getQuestionsForSurah, getAvailableSurahs } from "@/lib/questions";
import { selectMode, selectSurah, nextQuestion, submitAnswer } from "@/lib/gameState";
import { createSeededRandom } from "@/lib/seededRandom";
import { extractArabicWords } from "@/lib/wordExtractor";
import { shuffleArray } from "@/lib/utils";
import type { Question, Verse } from "@/lib/types";

describe("Performance Tests", () => {
  const allSurahs = getAvailableSurahs();
  const allQuestions: Question[] = [];
  allSurahs.forEach((surah) => {
    allQuestions.push(...getQuestionsForSurah(surah.number));
  });

  describe("Distractor Generation Performance", () => {
    it("should generate distractors quickly for large question sets", () => {
      const start = performance.now();
      const verse = allQuestions[0].verse;
      for (let i = 0; i < 100; i++) {
        generateDistractors(verse, allQuestions, 3);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });

    it("should handle very large question arrays efficiently", () => {
      const largeQuestionSet: Question[] = [];
      // Create a large set by duplicating questions
      for (let i = 0; i < 100; i++) {
        largeQuestionSet.push(...allQuestions);
      }
      
      const start = performance.now();
      const verse = allQuestions[0].verse;
      generateDistractors(verse, largeQuestionSet, 3);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should handle 1000+ questions quickly
    });

    it("should generate translation options efficiently", () => {
      const start = performance.now();
      const verse = allQuestions[0].verse;
      for (let i = 0; i < 50; i++) {
        generateTranslationOptions(verse, allQuestions);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should generate Arabic+Trans options efficiently", () => {
      const start = performance.now();
      const verse = allQuestions[0].verse;
      for (let i = 0; i < 50; i++) {
        generateArabicTransOptions(verse, allQuestions);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Blank Generation Performance", () => {
    it("should generate blanks quickly", () => {
      const verse = allQuestions[0].verse;
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        generateBlanks(verse, true);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it("should generate missing word options efficiently", () => {
      const verse = allQuestions[0].verse;
      const blanked = generateBlanks(verse, true);
      const allVerses = allQuestions.map((q) => q.verse);
      
      const start = performance.now();
      for (let i = 0; i < 50; i++) {
        generateMissingWordOptions(blanked.missingWords, allVerses, true);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Game State Performance", () => {
    it("should select mode quickly even with many questions", () => {
      const state = {
        selectedSurah: 93,
        allQuestions: allQuestions,
        questions: allQuestions,
        selectedMode: null,
        currentQuestionIndex: 0,
        scores: [],
        isAnswered: false,
        usedReveal: false,
      };

      const start = performance.now();
      for (let i = 0; i < 20; i++) {
        selectMode(state, "missing-word");
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it("should handle rapid state transitions efficiently", () => {
      let state = {
        selectedSurah: null,
        allQuestions: [],
        questions: [],
        selectedMode: null,
        currentQuestionIndex: 0,
        scores: [],
        isAnswered: false,
        usedReveal: false,
      };

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        state = selectSurah(state, 93, allQuestions);
        state = selectMode(state, "missing-word");
        state = submitAnswer(state, true, false);
        state = nextQuestion(state);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });

  describe("Memory Efficiency", () => {
    it("should not create excessive object copies", () => {
      const verse = allQuestions[0].verse;
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Generate many options
      for (let i = 0; i < 100; i++) {
        generateTranslationOptions(verse, allQuestions);
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Memory should not grow excessively
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Allow some memory growth but not excessive (10MB max)
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });

  describe("Concurrent Operations", () => {
    it("should handle concurrent distractor generation", async () => {
      const verse = allQuestions[0].verse;
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(generateDistractors(verse, allQuestions, 3))
      );
      
      const start = performance.now();
      await Promise.all(promises);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it("should handle concurrent blank generation", async () => {
      const verse = allQuestions[0].verse;
      const promises = Array.from({ length: 20 }, () =>
        Promise.resolve(generateBlanks(verse, true))
      );
      
      const start = performance.now();
      await Promise.all(promises);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe("Word Order Performance", () => {
    it("should extract and shuffle words quickly", () => {
      const verse = allQuestions[0].verse;
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const words = extractArabicWords(verse.arabic);
        shuffleArray([...words]);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should validate word order quickly", () => {
      const verse = allQuestions[0].verse;
      const correctWords = extractArabicWords(verse.arabic);
      const userAnswer = [...correctWords];
      
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        userAnswer.every((word, index) => word === correctWords[index]);
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should handle long verses efficiently", () => {
      // Find longest verse
      let longestVerse = allQuestions[0].verse;
      for (const q of allQuestions) {
        if (q.verse.arabic.length > longestVerse.arabic.length) {
          longestVerse = q.verse;
        }
      }
      
      const start = performance.now();
      const words = extractArabicWords(longestVerse.arabic);
      const shuffled = shuffleArray([...words]);
      const duration = performance.now() - start;
      
      expect(shuffled.length).toBe(words.length);
      expect(duration).toBeLessThan(10); // Should be very fast even for long verses
    });

    it("should handle concurrent word extraction", async () => {
      const promises = allQuestions.slice(0, 50).map((q) =>
        Promise.resolve(extractArabicWords(q.verse.arabic))
      );
      
      const start = performance.now();
      await Promise.all(promises);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe("Reading Mode Performance", () => {
    it("should find verse index quickly in large arrays", () => {
      const { extractArabicWords } = require("@/lib/wordExtractor");
      
      // Create large question array
      const largeQuestions: Question[] = [];
      for (let i = 0; i < 1000; i++) {
        largeQuestions.push({
          verse: {
            number: i + 1,
            arabic: `Arabic ${i + 1}`,
            transliteration: `Trans ${i + 1}`,
            translation: `Translation ${i + 1}`,
          },
          surahNumber: 93,
          surahName: "Ad-Duha",
        });
      }

      const targetQuestion = largeQuestions[500];
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        largeQuestions.findIndex(
          (q) => q.verse.number === targetQuestion.verse.number && q.surahNumber === targetQuestion.surahNumber
        );
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should handle verse navigation calculations efficiently", () => {
      const questions = allQuestions.slice(0, 100);
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const index = Math.floor(Math.random() * questions.length);
        const canGoPrevious = index > 0;
        const canGoNext = index < questions.length - 1;
        const currentVerse = questions[index];
        
        // Simulate navigation logic
        if (canGoPrevious) {
          const prevVerse = questions[index - 1];
        }
        if (canGoNext) {
          const nextVerse = questions[index + 1];
        }
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe("Stress Test Performance", () => {
    it("should handle 1000 distractor generations quickly", () => {
      const verse = allQuestions[0].verse;
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        generateDistractors(verse, allQuestions, 3);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it("should handle 1000 blank generations quickly", () => {
      const verse = allQuestions[0].verse;
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        generateBlanks(verse, true);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it("should handle 1000 option generations quickly", () => {
      const verse = allQuestions[0].verse;
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        generateTranslationOptions(verse, allQuestions);
        generateArabicTransOptions(verse, allQuestions);
      }
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe("Large Dataset Performance", () => {
    it("should handle very large question arrays", () => {
      // Create a very large array by duplicating
      const largeArray: Question[] = [];
      for (let i = 0; i < 10; i++) {
        largeArray.push(...allQuestions);
      }
      
      expect(largeArray.length).toBeGreaterThan(1000);
      
      const start = performance.now();
      const verse = largeArray[0].verse;
      generateDistractors(verse, largeArray, 3);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(200);
    });

    it("should handle all surahs simultaneously", () => {
      const allSurahs = getAvailableSurahs();
      const allQuestionsCombined: Question[] = [];
      
      const start = performance.now();
      for (const surah of allSurahs) {
        allQuestionsCombined.push(...getQuestionsForSurah(surah.number));
      }
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(100);
      expect(allQuestionsCombined.length).toBeGreaterThan(100);
    });
  });
});

