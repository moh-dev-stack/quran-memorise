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
});

