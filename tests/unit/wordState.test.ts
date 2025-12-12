import { describe, it, expect } from "vitest";
import {
  initialWordState,
  resetWordState,
  selectLearningPath,
  setReviewMode,
  submitWordAnswer,
  nextWord,
  previousWord,
  jumpToWord,
  resetToPathSelection,
} from "@/lib/wordState";
import { top50Path } from "@/lib/wordLearningPaths";
import type { WordState } from "@/lib/wordState";

describe("Word State Management", () => {
  describe("initialWordState", () => {
    it("should have correct initial values", () => {
      expect(initialWordState.selectedLearningPath).toBeNull();
      expect(initialWordState.currentWordIndex).toBe(0);
      expect(initialWordState.words).toEqual([]);
      expect(initialWordState.reviewMode).toBe(false);
      expect(initialWordState.scores).toEqual([]);
      expect(initialWordState.isAnswered).toBe(false);
    });
  });

  describe("resetWordState", () => {
    it("should reset state to initial values", () => {
      const modifiedState: WordState = {
        selectedLearningPath: top50Path,
        currentWordIndex: 5,
        words: [],
        reviewMode: true,
        scores: [{ points: 10, maxPoints: 10 }],
        isAnswered: true,
      };
      
      const reset = resetWordState();
      expect(reset).toEqual(initialWordState);
    });
  });

  describe("selectLearningPath", () => {
    it("should set the learning path and load words", () => {
      const state = initialWordState;
      const newState = selectLearningPath(state, top50Path);
      
      expect(newState.selectedLearningPath).toBe(top50Path);
      expect(newState.words.length).toBe(50);
      expect(newState.currentWordIndex).toBe(0);
      expect(newState.reviewMode).toBe(false);
      expect(newState.scores).toEqual([]);
      expect(newState.isAnswered).toBe(false);
    });

    it("should reset current word index when selecting a path", () => {
      const state: WordState = {
        ...initialWordState,
        currentWordIndex: 10,
      };
      
      const newState = selectLearningPath(state, top50Path);
      expect(newState.currentWordIndex).toBe(0);
    });
  });

  describe("setReviewMode", () => {
    it("should set review mode to true", () => {
      const state = initialWordState;
      const newState = setReviewMode(state, true);
      
      expect(newState.reviewMode).toBe(true);
      expect(newState.currentWordIndex).toBe(0);
      expect(newState.isAnswered).toBe(false);
    });

    it("should set review mode to false", () => {
      const state: WordState = {
        ...initialWordState,
        reviewMode: true,
      };
      
      const newState = setReviewMode(state, false);
      expect(newState.reviewMode).toBe(false);
    });
  });

  describe("submitWordAnswer", () => {
    it("should mark answer as submitted and add score", () => {
      const state: WordState = {
        ...initialWordState,
        isAnswered: false,
      };
      
      const score = { points: 10, maxPoints: 10 };
      const newState = submitWordAnswer(state, true, score);
      
      expect(newState.isAnswered).toBe(true);
      expect(newState.scores).toContainEqual(score);
    });

    it("should not submit answer if already answered", () => {
      const state: WordState = {
        ...initialWordState,
        isAnswered: true,
        scores: [{ points: 5, maxPoints: 10 }],
      };
      
      const score = { points: 10, maxPoints: 10 };
      const newState = submitWordAnswer(state, true, score);
      
      expect(newState.scores.length).toBe(1);
      expect(newState.scores[0].points).toBe(5);
    });
  });

  describe("nextWord", () => {
    it("should increment current word index", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any, { id: "word-2" } as any],
        currentWordIndex: 0,
      };
      
      const newState = nextWord(state);
      expect(newState.currentWordIndex).toBe(1);
      expect(newState.isAnswered).toBe(false);
    });

    it("should not increment if at last word", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any],
        currentWordIndex: 0,
      };
      
      const newState = nextWord(state);
      expect(newState.currentWordIndex).toBe(0);
    });

    it("should not increment if words array is empty", () => {
      const state: WordState = {
        ...initialWordState,
        words: [],
        currentWordIndex: 0,
      };
      
      const newState = nextWord(state);
      expect(newState.currentWordIndex).toBe(0);
    });
  });

  describe("previousWord", () => {
    it("should decrement current word index", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any, { id: "word-2" } as any],
        currentWordIndex: 1,
      };
      
      const newState = previousWord(state);
      expect(newState.currentWordIndex).toBe(0);
      expect(newState.isAnswered).toBe(false);
    });

    it("should not decrement if at first word", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any],
        currentWordIndex: 0,
      };
      
      const newState = previousWord(state);
      expect(newState.currentWordIndex).toBe(0);
    });
  });

  describe("jumpToWord", () => {
    it("should jump to valid index", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any, { id: "word-2" } as any, { id: "word-3" } as any],
        currentWordIndex: 0,
      };
      
      const newState = jumpToWord(state, 2);
      expect(newState.currentWordIndex).toBe(2);
      expect(newState.isAnswered).toBe(false);
    });

    it("should not jump to negative index", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any],
        currentWordIndex: 0,
      };
      
      const newState = jumpToWord(state, -1);
      expect(newState.currentWordIndex).toBe(0);
    });

    it("should not jump to index beyond array length", () => {
      const state: WordState = {
        ...initialWordState,
        words: [{ id: "word-1" } as any],
        currentWordIndex: 0,
      };
      
      const newState = jumpToWord(state, 10);
      expect(newState.currentWordIndex).toBe(0);
    });
  });

  describe("resetToPathSelection", () => {
    it("should reset state to initial values", () => {
      const state: WordState = {
        selectedLearningPath: top50Path,
        currentWordIndex: 5,
        words: [],
        reviewMode: true,
        scores: [{ points: 10, maxPoints: 10 }],
        isAnswered: true,
      };
      
      const reset = resetToPathSelection();
      expect(reset).toEqual(initialWordState);
    });
  });
});

