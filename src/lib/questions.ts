import type { Surah, Question } from "./types";
import adDuha from "@/data/surahs/ad-duha.json";

/**
 * Loads a surah by its number
 * Currently supports Surah 93 (Ad-Duha)
 * Can be extended to load from a database or API
 */
export function loadSurah(surahNumber: number): Surah | null {
  switch (surahNumber) {
    case 93:
      return adDuha as Surah;
    default:
      return null;
  }
}

/**
 * Converts a surah into an array of questions
 */
export function surahToQuestions(surah: Surah): Question[] {
  return surah.verses.map((verse) => ({
    verse,
    surahNumber: surah.number,
    surahName: surah.name,
  }));
}

/**
 * Gets all questions for a surah
 */
export function getQuestionsForSurah(surahNumber: number): Question[] {
  const surah = loadSurah(surahNumber);
  if (!surah) {
    return [];
  }
  return surahToQuestions(surah);
}

/**
 * Gets a random question from a surah
 */
export function getRandomQuestion(surahNumber: number): Question | null {
  const questions = getQuestionsForSurah(surahNumber);
  if (questions.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

