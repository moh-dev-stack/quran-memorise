import { extractArabicWords, extractTransliterationWords } from "./wordExtractor";
import { createSeededRandom, seedFromValues } from "./seededRandom";
import type { Verse } from "./types";

export interface BlankedVerse {
  blankedText: string;
  missingWords: string[];
  missingIndices: number[];
}

/**
 * Generate blanks for missing word mode
 * Returns verse with 1-2 words blanked out
 * @param verse - The verse to blank
 * @param useArabic - Whether to use Arabic (true) or transliteration (false)
 * @param seed - Optional seed for random generation. If not provided, uses Math.random()
 */
export function generateBlanks(
  verse: Verse,
  useArabic: boolean = true,
  seed?: number
): BlankedVerse {
  const words = useArabic
    ? extractArabicWords(verse.arabic)
    : extractTransliterationWords(verse.transliteration);
  const originalText = useArabic ? verse.arabic : verse.transliteration;

  if (words.length <= 1) {
    // If only one word, blank it
    return {
      blankedText: "____",
      missingWords: words,
      missingIndices: [0],
    };
  }

  // Use seeded random if seed provided, otherwise use Math.random()
  const rng = seed !== undefined 
    ? createSeededRandom(seedFromValues(verse.number, seed))
    : null;

  // Randomly select 1-2 words to blank (max 2 for short verses, 1-2 for longer)
  const numBlanks = Math.min(2, Math.max(1, Math.floor(words.length / 3)));
  const indicesToBlank: number[] = [];
  const availableIndices = words.map((_, i) => i);

  for (let i = 0; i < numBlanks && availableIndices.length > 0; i++) {
    const randomIndex = rng
      ? rng.nextInt(0, availableIndices.length)
      : Math.floor(Math.random() * availableIndices.length);
    indicesToBlank.push(availableIndices[randomIndex]);
    availableIndices.splice(randomIndex, 1);
  }

  indicesToBlank.sort((a, b) => a - b);

  // Create blanked text
  const blankedWords = words.map((word, index) =>
    indicesToBlank.includes(index) ? "____" : word
  );
  const blankedText = blankedWords.join(" ");

  const missingWords = indicesToBlank.map((idx) => words[idx]);

  return {
    blankedText,
    missingWords,
    missingIndices: indicesToBlank,
  };
}

/**
 * Generate options for missing word mode
 * Includes correct word(s) and distractors
 */
export function generateMissingWordOptions(
  correctWords: string[],
  allVerses: Verse[],
  useArabic: boolean = true
): Array<{ text: string; isCorrect: boolean; id: string }> {
  if (!correctWords || correctWords.length === 0) {
    return [];
  }

  // Get all words from other verses as potential distractors
  const allWords = new Set<string>();
  allVerses.forEach((verse) => {
    const words = useArabic
      ? extractArabicWords(verse.arabic)
      : extractTransliterationWords(verse.transliteration);
    words.forEach((word) => {
      if (word && word.trim().length > 0) {
        allWords.add(word);
      }
    });
  });

  // Remove correct words from distractors
  correctWords.forEach((word) => allWords.delete(word));

  // Convert to array and shuffle efficiently
  const distractorArray = Array.from(allWords);
  for (let i = distractorArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractorArray[i], distractorArray[j]] = [distractorArray[j], distractorArray[i]];
  }

  // If multiple words missing, combine them as one option
  const correctOption = correctWords.join(" ");
  const options: Array<{ text: string; isCorrect: boolean; id: string }> = [
    { text: correctOption, isCorrect: true, id: `correct-${correctOption}` },
    ...distractorArray
      .slice(0, 3)
      .map((word, index) => ({ text: word, isCorrect: false, id: `distractor-${word}-${index}` })),
  ];

  // Shuffle options efficiently
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

