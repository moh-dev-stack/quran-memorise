import type { WordGameMode, Word } from "./wordTypes";
import { shuffleArray } from "./utils";
import { generateOptionId } from "./optionIdGenerator";

export interface WordGameModeOption {
  id: WordGameMode;
  name: string;
  description: string;
}

export const WORD_GAME_MODES: WordGameModeOption[] = [
  {
    id: "arabic-to-translation",
    name: "Arabic → Translation",
    description: "See Arabic word, choose the correct translation",
  },
  {
    id: "translation-to-arabic",
    name: "Translation → Arabic",
    description: "See translation, choose the correct Arabic word",
  },
  {
    id: "transliteration-to-translation",
    name: "Transliteration → Translation",
    description: "See transliteration, choose the correct translation",
  },
];

export function getWordGameModeById(id: WordGameMode): WordGameModeOption | undefined {
  return WORD_GAME_MODES.find((mode) => mode.id === id);
}

// Re-export WordGameMode type for convenience
export type { WordGameMode } from "./wordTypes";

/**
 * Generate distractors (wrong options) for multiple choice questions
 */
export function generateWordDistractors(
  correctWord: Word,
  allWords: Word[],
  count: number = 3
): Word[] {
  // Filter out the correct word and get words of similar type
  const candidates = allWords.filter(
    (w) => w.id !== correctWord.id && w.partOfSpeech === correctWord.partOfSpeech
  );

  // If not enough candidates of same type, include others
  const pool = candidates.length >= count ? candidates : allWords.filter((w) => w.id !== correctWord.id);

  // Shuffle and take first N
  const shuffled = shuffleArray([...pool]);
  return shuffled.slice(0, count);
}

