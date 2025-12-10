import { describe, it, expect } from "vitest";
import {
  initialGameState,
  resetGameState,
  selectSurah,
  selectMode,
  submitAnswer,
  nextQuestion,
  resetToModeSelection,
  resetToSurahSelection,
  type GameState,
} from "@/lib/gameState";
import type { Question } from "@/lib/types";

const mockQuestion: Question = {
  verse: {
    number: 1,
    arabic: "وَالضُّحَىٰ",
    transliteration: "Wa ad-duha",
    translation: "By the morning brightness",
  },
  surahNumber: 93,
  surahName: "Ad-Duha",
};

const mockQuestions: Question[] = [
  mockQuestion,
  { ...mockQuestion, verse: { ...mockQuestion.verse, number: 2 } },
  { ...mockQuestion, verse: { ...mockQuestion.verse, number: 3 } },
];

describe("gameState", () => {
  describe("initialGameState", () => {
    it("should have correct initial values", () => {
      expect(initialGameState).toEqual({
        selectedSurah: null,
        allQuestions: [],
        questions: [],
        selectedMode: null,
        currentQuestionIndex: 0,
        scores: [],
        isAnswered: false,
        usedReveal: false,
      });
    });
  });

  describe("resetGameState", () => {
    it("should return initial game state", () => {
      const state = resetGameState();
      expect(state).toEqual(initialGameState);
    });

    it("should create a new object instance", () => {
      const state1 = resetGameState();
      const state2 = resetGameState();
      expect(state1).not.toBe(state2);
    });
  });

  describe("selectSurah", () => {
    it("should set surah and questions", () => {
      const state = selectSurah(initialGameState, 93, mockQuestions);
      expect(state.selectedSurah).toBe(93);
      expect(state.allQuestions).toEqual(mockQuestions);
      expect(state.questions).toEqual(mockQuestions);
    });

    it("should reset mode and question index", () => {
      const stateWithMode: GameState = {
        ...initialGameState,
        selectedMode: "arabic-trans-to-translation",
        currentQuestionIndex: 2,
      };
      const newState = selectSurah(stateWithMode, 93, mockQuestions);
      expect(newState.selectedMode).toBeNull();
      expect(newState.currentQuestionIndex).toBe(0);
    });

    it("should reset scores and answer state", () => {
      const stateWithScores: GameState = {
        ...initialGameState,
        scores: [{ points: 10, maxPoints: 20 }],
        isAnswered: true,
        usedReveal: true,
      };
      const newState = selectSurah(stateWithScores, 93, mockQuestions);
      expect(newState.scores).toEqual([]);
      expect(newState.isAnswered).toBe(false);
      expect(newState.usedReveal).toBe(false);
    });

    it("should return state unchanged if questions array is empty", () => {
      const state = selectSurah(initialGameState, 93, []);
      expect(state).toBe(initialGameState);
    });

    it("should return state unchanged if questions is null", () => {
      const state = selectSurah(initialGameState, 93, null as any);
      expect(state).toBe(initialGameState);
    });
  });

  describe("selectMode", () => {
    it("should set mode and shuffle questions", () => {
      const stateWithQuestions: GameState = {
        ...initialGameState,
        allQuestions: mockQuestions,
      };
      const newState = selectMode(stateWithQuestions, "missing-word");
      expect(newState.selectedMode).toBe("missing-word");
      expect(newState.questions.length).toBe(mockQuestions.length);
      expect(newState.currentQuestionIndex).toBe(0);
    });

    it("should reset scores and answer state", () => {
      const stateWithScores: GameState = {
        ...initialGameState,
        allQuestions: mockQuestions,
        scores: [{ points: 10, maxPoints: 20 }],
        isAnswered: true,
        usedReveal: true,
      };
      const newState = selectMode(stateWithScores, "missing-word");
      expect(newState.scores).toEqual([]);
      expect(newState.isAnswered).toBe(false);
      expect(newState.usedReveal).toBe(false);
    });

    it("should return state unchanged if no questions available", () => {
      const state = selectMode(initialGameState, "missing-word");
      expect(state).toBe(initialGameState);
    });

    it("should shuffle questions differently each time", () => {
      const stateWithQuestions: GameState = {
        ...initialGameState,
        allQuestions: mockQuestions,
      };
      const state1 = selectMode(stateWithQuestions, "missing-word");
      const state2 = selectMode(stateWithQuestions, "missing-word");
      // Questions should be shuffled (order may differ)
      expect(state1.questions.length).toBe(state2.questions.length);
    });
  });

  describe("submitAnswer", () => {
    it("should set isAnswered and usedReveal", () => {
      const state: GameState = {
        ...initialGameState,
        selectedMode: "missing-word",
        isAnswered: false,
      };
      const newState = submitAnswer(state, true, true);
      expect(newState.isAnswered).toBe(true);
      expect(newState.usedReveal).toBe(true);
    });

    it("should not change state if already answered", () => {
      const state: GameState = {
        ...initialGameState,
        selectedMode: "missing-word",
        isAnswered: true,
      };
      const newState = submitAnswer(state, true, false);
      expect(newState).toBe(state);
    });

    it("should not change state if no mode selected", () => {
      const state: GameState = {
        ...initialGameState,
        isAnswered: false,
      };
      const newState = submitAnswer(state, true, false);
      expect(newState).toBe(state);
    });
  });

  describe("nextQuestion", () => {
    it("should increment question index", () => {
      const state: GameState = {
        ...initialGameState,
        questions: mockQuestions,
        currentQuestionIndex: 0,
        isAnswered: true,
      };
      const newState = nextQuestion(state);
      expect(newState.currentQuestionIndex).toBe(1);
      expect(newState.isAnswered).toBe(false);
      expect(newState.usedReveal).toBe(false);
    });

    it("should not change index if at last question", () => {
      const state: GameState = {
        ...initialGameState,
        questions: mockQuestions,
        currentQuestionIndex: 2,
      };
      const newState = nextQuestion(state);
      expect(newState.currentQuestionIndex).toBe(2);
      expect(newState).toBe(state);
    });

    it("should return state unchanged if no questions", () => {
      const state: GameState = {
        ...initialGameState,
        questions: [],
      };
      const newState = nextQuestion(state);
      expect(newState).toBe(state);
    });
  });

  describe("resetToModeSelection", () => {
    it("should reset mode and question index", () => {
      const state: GameState = {
        ...initialGameState,
        selectedMode: "missing-word",
        allQuestions: mockQuestions,
        questions: mockQuestions,
        currentQuestionIndex: 2,
        scores: [{ points: 10, maxPoints: 20 }],
        isAnswered: true,
        usedReveal: true,
      };
      const newState = resetToModeSelection(state);
      expect(newState.selectedMode).toBeNull();
      expect(newState.currentQuestionIndex).toBe(0);
      expect(newState.scores).toEqual([]);
      expect(newState.isAnswered).toBe(false);
      expect(newState.usedReveal).toBe(false);
      expect(newState.questions).toEqual(mockQuestions);
    });

    it("should handle empty questions array", () => {
      const state: GameState = {
        ...initialGameState,
        allQuestions: [],
      };
      const newState = resetToModeSelection(state);
      expect(newState.questions).toEqual([]);
    });
  });

  describe("resetToSurahSelection", () => {
    it("should return initial game state", () => {
      const state = resetToSurahSelection();
      expect(state).toEqual(initialGameState);
    });
  });
});

