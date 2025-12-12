import type { SM2Item } from "./spacedRepetition";

/**
 * Part of speech classification for Quranic words
 */
export type PartOfSpeech = "verb" | "noun" | "particle";

/**
 * Verse example showing where a word appears in the Quran
 */
export interface VerseExample {
  surah: number;
  verse: number;
  arabic: string;
  translation: string;
}

/**
 * Quranic word with all its properties
 */
export interface Word {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  root?: string; // Root letters (e.g., "ك ت ب")
  partOfSpeech: PartOfSpeech;
  frequency: number; // Occurrence count in the Quran
  verseExamples: VerseExample[]; // At least 1-2 examples from PDF
  combinations?: string[]; // Different forms/variations of the word
  reviewData?: SM2Item; // SRS data for spaced repetition
}

/**
 * Learning path for organizing words
 */
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  getWords: () => Word[];
}

/**
 * Word game mode types
 */
export type WordGameMode =
  | "arabic-to-translation"
  | "translation-to-arabic"
  | "transliteration-to-translation";

/**
 * Word state for managing learning sessions
 */
export interface WordState {
  selectedLearningPath: LearningPath | null;
  currentWordIndex: number;
  words: Word[];
  reviewMode: boolean;
  scores: Array<{ points: number; maxPoints: number }>;
  isAnswered: boolean;
}

/**
 * Review statistics for words
 */
export interface ReviewStats {
  totalWords: number;
  wordsDue: number;
  wordsMastered: number;
  wordsLearning: number;
  averageEaseFactor: number;
}

