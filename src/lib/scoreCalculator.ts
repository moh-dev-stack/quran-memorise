import type { GameMode } from "./types";

export interface ScoreResult {
  points: number;
  maxPoints: number;
}

/**
 * Calculate score for a game mode answer
 */
export function calculateScore(
  mode: GameMode,
  isCorrect: boolean,
  usedReveal: boolean = false
): ScoreResult {
  const maxPoints = 10;

  switch (mode) {
    case "arabic-trans-to-translation":
    case "translation-to-arabic-trans":
    case "sequential-order":
    case "first-last-word":
    case "verse-number":
      return {
        points: isCorrect ? maxPoints : 0,
        maxPoints,
      };

    case "missing-word":
      if (!isCorrect) {
        return { points: 0, maxPoints };
      }
      // 8 points if no reveal, 4 points if reveal was used
      return {
        points: usedReveal ? 4 : 8,
        maxPoints,
      };

    default:
      return { points: 0, maxPoints };
  }
}

/**
 * Calculate total score from game session
 */
export function calculateTotalScore(
  scores: Array<{ points: number; maxPoints: number }>
): { total: number; maxTotal: number; percentage: number } {
  const total = scores.reduce((sum, s) => sum + s.points, 0);
  const maxTotal = scores.reduce((sum, s) => sum + s.maxPoints, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;

  return { total, maxTotal, percentage };
}

