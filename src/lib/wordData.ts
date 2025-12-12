import type { Word, PartOfSpeech } from "./wordTypes";
import quranicWords from "@/data/words/quranic-words.json";

/**
 * Get all 125 Quranic words
 */
export function getAllWords(): Word[] {
  return quranicWords as Word[];
}

/**
 * Get words filtered by frequency (top N most frequent)
 */
export function getWordsByFrequency(limit: number): Word[] {
  const allWords = getAllWords();
  return allWords
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

/**
 * Get words filtered by part of speech
 */
export function getWordsByPartOfSpeech(type: PartOfSpeech): Word[] {
  return getAllWords().filter((word) => word.partOfSpeech === type);
}

/**
 * Get a word by its ID
 */
export function getWordById(id: string): Word | undefined {
  return getAllWords().find((word) => word.id === id);
}

/**
 * Get words that are due for review (based on SRS)
 */
export function getWordsForReview(words: Word[]): Word[] {
  const now = new Date();
  return words.filter((word) => {
    if (!word.reviewData) return false;
    return new Date(word.reviewData.nextReview) <= now;
  });
}

/**
 * Search words by Arabic text (normalized)
 */
export function searchWordsByArabic(arabic: string): Word[] {
  const normalized = arabic.trim();
  return getAllWords().filter((word) =>
    word.arabic.includes(normalized) || normalized.includes(word.arabic)
  );
}

/**
 * Search words by translation
 */
export function searchWordsByTranslation(query: string): Word[] {
  const lowerQuery = query.toLowerCase();
  return getAllWords().filter((word) =>
    word.translation.toLowerCase().includes(lowerQuery)
  );
}

