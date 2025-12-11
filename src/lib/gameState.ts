import type { Question, GameMode } from "./types";
import { createSeededRandom, seedFromValues } from "./seededRandom";

export interface GameState {
  selectedSurah: number | null;
  allQuestions: Question[];
  questions: Question[];
  selectedMode: GameMode | null;
  currentQuestionIndex: number;
  scores: Array<{ points: number; maxPoints: number }>;
  isAnswered: boolean;
  usedReveal: boolean;
}

export const initialGameState: GameState = {
  selectedSurah: null,
  allQuestions: [],
  questions: [],
  selectedMode: null,
  currentQuestionIndex: 0,
  scores: [],
  isAnswered: false,
  usedReveal: false,
};

/**
 * Resets game state to initial values
 */
export function resetGameState(): GameState {
  return { ...initialGameState };
}

/**
 * Creates a new game state with surah selected
 */
export function selectSurah(
  state: GameState,
  surahNumber: number,
  questions: Question[]
): GameState {
  if (!questions || questions.length === 0) {
    return state;
  }
  
  return {
    ...state,
    selectedSurah: surahNumber,
    allQuestions: questions,
    questions: questions,
    selectedMode: null,
    currentQuestionIndex: 0,
    scores: [],
    isAnswered: false,
    usedReveal: false,
  };
}

/**
 * Creates a new game state with mode selected and questions shuffled
 */
export function selectMode(
  state: GameState,
  mode: GameMode
): GameState {
  if (!state.allQuestions || state.allQuestions.length === 0) {
    return state;
  }

  // For reading modes, keep questions sorted by verse number (no shuffling)
  // For other modes, shuffle questions randomly
  let questionsToUse: Question[];
  if (mode === "reading-mode" || mode === "continuous-reading-mode") {
    questionsToUse = [...state.allQuestions].sort((a, b) => {
      // First sort by surah number, then by verse number
      if (a.surahNumber !== b.surahNumber) {
        return a.surahNumber - b.surahNumber;
      }
      return a.verse.number - b.verse.number;
    });
  } else {
    // Shuffle questions randomly for other modes
    const randomComponent = Math.random().toString(36).substring(2, 15);
    const seed = seedFromValues(
      mode,
      Date.now().toString(),
      randomComponent,
      Math.random().toString()
    );
    const rng = createSeededRandom(seed);
    questionsToUse = rng.shuffle([...state.allQuestions]);
  }

  return {
    ...state,
    selectedMode: mode,
    questions: questionsToUse,
    currentQuestionIndex: 0,
    scores: [],
    isAnswered: false,
    usedReveal: false,
  };
}

/**
 * Handles answer submission
 */
export function submitAnswer(
  state: GameState,
  isCorrect: boolean,
  revealUsed: boolean
): GameState {
  if (!state.selectedMode || state.isAnswered) {
    return state;
  }

  return {
    ...state,
    isAnswered: true,
    usedReveal: revealUsed,
  };
}

/**
 * Moves to next question
 */
export function nextQuestion(state: GameState): GameState {
  if (
    state.questions.length === 0 ||
    state.currentQuestionIndex >= state.questions.length - 1
  ) {
    return state;
  }

  return {
    ...state,
    currentQuestionIndex: state.currentQuestionIndex + 1,
    isAnswered: false,
    usedReveal: false,
  };
}

/**
 * Resets to mode selection
 */
export function resetToModeSelection(state: GameState): GameState {
  return {
    ...state,
    selectedMode: null,
    currentQuestionIndex: 0,
    scores: [],
    isAnswered: false,
    usedReveal: false,
    questions: state.allQuestions.length > 0 ? [...state.allQuestions] : [],
  };
}

/**
 * Resets to surah selection
 */
export function resetToSurahSelection(): GameState {
  return resetGameState();
}

