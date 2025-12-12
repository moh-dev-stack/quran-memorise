import type { LearningPath, Word, WordState } from "./wordTypes";
import type { ScoreResult } from "./scoreCalculator";

export type { WordState };

export const initialWordState: WordState = {
  selectedLearningPath: null,
  currentWordIndex: 0,
  words: [],
  reviewMode: false,
  scores: [],
  isAnswered: false,
};

/**
 * Reset word state to initial values
 */
export function resetWordState(): WordState {
  return { ...initialWordState };
}

/**
 * Select a learning path and load words
 */
export function selectLearningPath(
  state: WordState,
  path: LearningPath
): WordState {
  const words = path.getWords();
  
  return {
    ...state,
    selectedLearningPath: path,
    words: words,
    currentWordIndex: 0,
    reviewMode: false,
    scores: [],
    isAnswered: false,
  };
}

/**
 * Set review mode
 */
export function setReviewMode(
  state: WordState,
  reviewMode: boolean
): WordState {
  return {
    ...state,
    reviewMode,
    currentWordIndex: 0,
    isAnswered: false,
  };
}

/**
 * Submit answer for current word
 */
export function submitWordAnswer(
  state: WordState,
  isCorrect: boolean,
  score: ScoreResult
): WordState {
  if (state.isAnswered) {
    return state;
  }

  return {
    ...state,
    isAnswered: true,
    scores: [...state.scores, score],
  };
}

/**
 * Move to next word
 */
export function nextWord(state: WordState): WordState {
  if (
    state.words.length === 0 ||
    state.currentWordIndex >= state.words.length - 1
  ) {
    return state;
  }

  return {
    ...state,
    currentWordIndex: state.currentWordIndex + 1,
    isAnswered: false,
  };
}

/**
 * Move to previous word
 */
export function previousWord(state: WordState): WordState {
  if (state.currentWordIndex <= 0) {
    return state;
  }

  return {
    ...state,
    currentWordIndex: state.currentWordIndex - 1,
    isAnswered: false,
  };
}

/**
 * Jump to specific word index
 */
export function jumpToWord(state: WordState, index: number): WordState {
  if (index < 0 || index >= state.words.length) {
    return state;
  }

  return {
    ...state,
    currentWordIndex: index,
    isAnswered: false,
  };
}

/**
 * Reset to learning path selection
 */
export function resetToPathSelection(): WordState {
  return resetWordState();
}

