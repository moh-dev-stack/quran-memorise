import type { LearningPath, Word, PartOfSpeech } from "./wordTypes";
import { getAllWords, getWordsByFrequency, getWordsByPartOfSpeech } from "./wordData";

/**
 * Learning path: Top 50 most frequent words
 */
export const top50Path: LearningPath = {
  id: "top-50",
  name: "Top 50 Words",
  description: "The 50 most frequently occurring words in the Quran",
  getWords: () => getWordsByFrequency(50),
};

/**
 * Learning path: Top 125 most frequent words
 */
export const top125Path: LearningPath = {
  id: "top-125",
  name: "Top 125 Words",
  description: "All 125 most frequently occurring words (50% of Quranic vocabulary)",
  getWords: () => getWordsByFrequency(125),
};

/**
 * Learning path: Top 300 most frequent words
 */
export const top300Path: LearningPath = {
  id: "top-300",
  name: "Top 300 Words",
  description: "300 most frequently occurring words (expanded vocabulary)",
  getWords: () => getWordsByFrequency(300),
};

/**
 * Learning path: Verbs only
 */
export const verbsPath: LearningPath = {
  id: "verbs",
  name: "Verbs",
  description: "Learn all verbs from the 125 words",
  getWords: () => getWordsByPartOfSpeech("verb"),
};

/**
 * Learning path: Nouns only
 */
export const nounsPath: LearningPath = {
  id: "nouns",
  name: "Nouns",
  description: "Learn all nouns from the 125 words",
  getWords: () => getWordsByPartOfSpeech("noun"),
};

/**
 * Learning path: Particles only
 */
export const particlesPath: LearningPath = {
  id: "particles",
  name: "Particles",
  description: "Learn all particles from the 125 words",
  getWords: () => getWordsByPartOfSpeech("particle"),
};

/**
 * Learning path: Mixed (all parts of speech)
 */
export const mixedPath: LearningPath = {
  id: "mixed",
  name: "Mixed",
  description: "Learn words from all parts of speech",
  getWords: () => getAllWords(),
};

/**
 * Get all available learning paths
 */
export function getAllLearningPaths(): LearningPath[] {
  return [
    top50Path,
    top125Path,
    top300Path,
    verbsPath,
    nounsPath,
    particlesPath,
    mixedPath,
  ];
}

/**
 * Get a learning path by ID
 */
export function getLearningPathById(id: string): LearningPath | undefined {
  return getAllLearningPaths().find((path) => path.id === id);
}

