import { describe, it, expect } from "vitest";
import { selectMode } from "@/lib/gameState";
import { getQuestionsForSurah } from "@/lib/questions";
import type { GameState } from "@/lib/gameState";

describe("Game Modes - Question Ordering", () => {
  const mockQuestions = getQuestionsForSurah(93); // Ad-Duha - 11 verses

  const createStateWithQuestions = (): GameState => ({
    selectedSurah: 93,
    allQuestions: mockQuestions,
    questions: mockQuestions,
    selectedMode: null,
    currentQuestionIndex: 0,
    scores: [],
    isAnswered: false,
    usedReveal: false,
  });

  describe("Reading Modes", () => {
    const readingModes = ["reading-mode", "continuous-reading-mode"] as const;

    it.each(readingModes)("should keep questions sorted by verse number for %s", (mode) => {
      const state = createStateWithQuestions();
      const newState = selectMode(state, mode);

      // Questions should be sorted by verse number (1, 2, 3, ..., 11)
      expect(newState.questions.length).toBe(11);
      for (let i = 0; i < newState.questions.length; i++) {
        expect(newState.questions[i].verse.number).toBe(i + 1);
      }
    });

    it.each(readingModes)("should maintain sorted order across multiple calls for %s", (mode) => {
      const state = createStateWithQuestions();
      const state1 = selectMode(state, mode);
      const state2 = selectMode(state, mode);

      // Both should have same order (sorted)
      expect(state1.questions.map(q => q.verse.number)).toEqual(
        state2.questions.map(q => q.verse.number)
      );
    });
  });

  describe("Other Game Modes", () => {
    const nonReadingModes = [
      "arabic-trans-to-translation",
      "translation-to-arabic-trans",
      "missing-word",
      "sequential-order",
      "first-last-word",
      "verse-number",
      "word-order",
    ] as const;

    it.each(nonReadingModes)("should shuffle questions for %s mode", (mode) => {
      const state = createStateWithQuestions();
      const newState = selectMode(state, mode);

      // Questions should be shuffled (order should differ from original)
      expect(newState.questions.length).toBe(11);
      
      // Check that order is different (very unlikely to be same after shuffle)
      const originalOrder = mockQuestions.map(q => q.verse.number);
      const shuffledOrder = newState.questions.map(q => q.verse.number);
      
      // At least one position should be different (very high probability)
      const isDifferent = originalOrder.some((num, idx) => num !== shuffledOrder[idx]);
      expect(isDifferent).toBe(true);
    });

    it.each(nonReadingModes)("should shuffle differently each time for %s mode", (mode) => {
      const state = createStateWithQuestions();
      const state1 = selectMode(state, mode);
      const state2 = selectMode(state, mode);

      // Both should be shuffled but likely in different orders
      expect(state1.questions.length).toBe(11);
      expect(state2.questions.length).toBe(11);

      // Order should likely be different (very high probability with random shuffle)
      const order1 = state1.questions.map(q => q.verse.number);
      const order2 = state2.questions.map(q => q.verse.number);
      
      // Very unlikely to be identical with random shuffle
      const isDifferent = order1.some((num, idx) => num !== order2[idx]);
      expect(isDifferent).toBe(true);
    });

    it.each(nonReadingModes)("should preserve all questions for %s mode", (mode) => {
      const state = createStateWithQuestions();
      const newState = selectMode(state, mode);

      // All verse numbers should be present
      const originalVerseNumbers = new Set(mockQuestions.map(q => q.verse.number));
      const shuffledVerseNumbers = new Set(newState.questions.map(q => q.verse.number));
      
      expect(shuffledVerseNumbers.size).toBe(originalVerseNumbers.size);
      expect([...shuffledVerseNumbers].sort()).toEqual([...originalVerseNumbers].sort());
    });
  });

  describe("Mode Switching", () => {
    it("should maintain correct order when switching from reading mode to another mode", () => {
      const state = createStateWithQuestions();
      
      // First select reading mode (sorted)
      const readingState = selectMode(state, "reading-mode");
      expect(readingState.questions.map(q => q.verse.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      
      // Then switch to another mode (should shuffle)
      const shuffledState = selectMode(readingState, "missing-word");
      const shuffledOrder = shuffledState.questions.map(q => q.verse.number);
      
      // Should be shuffled (different from sorted order)
      expect(shuffledOrder).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it("should maintain correct order when switching from another mode to reading mode", () => {
      const state = createStateWithQuestions();
      
      // First select a shuffled mode
      const shuffledState = selectMode(state, "missing-word");
      const shuffledOrder = shuffledState.questions.map(q => q.verse.number);
      
      // Then switch to reading mode (should be sorted)
      const readingState = selectMode(shuffledState, "reading-mode");
      expect(readingState.questions.map(q => q.verse.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });
  });
});
