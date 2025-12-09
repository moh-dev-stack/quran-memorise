import type { Question } from "./types";

/**
 * Generate a stable hash from questions array content
 * Uses verse numbers and key content to create a deterministic hash
 */
export function generateQuestionHash(questions: Question[]): string {
  if (!questions || questions.length === 0) {
    return "empty";
  }

  // Create hash from verse numbers and key content
  const hashParts = questions.map((q) => {
    const verse = q.verse;
    return `${q.verse.number}-${verse.arabic?.slice(0, 10)}-${verse.transliteration?.slice(0, 10)}-${verse.translation?.slice(0, 10)}`;
  });

  // Simple hash function
  let hash = 0;
  const combined = hashParts.join("|");
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Generate hash from questions array for use in dependency arrays
 * This ensures memoization updates when content changes, not just length
 * Note: This is NOT a React hook despite the name - it's a utility function
 */
export function getQuestionHash(questions: Question[]): string {
  return generateQuestionHash(questions);
}

