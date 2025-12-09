/**
 * Spaced Repetition Algorithm (SM-2 inspired)
 * Based on SuperMemo 2 algorithm for optimal review scheduling
 */

export interface SM2Item {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

/**
 * Calculates the next review date and updates item parameters based on quality
 * @param item Current SM2 item state
 * @param quality Quality of recall (0-5): 0=complete blackout, 5=perfect response
 * @returns Updated SM2 item with new interval and next review date
 */
export function updateSM2Item(item: SM2Item, quality: number): SM2Item {
  let { easeFactor, interval, repetitions } = item;

  // Update ease factor based on quality
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(easeFactor, MIN_EASE_FACTOR);

  // Update repetitions and interval based on quality
  if (quality < 3) {
    // If quality is low, reset repetitions
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview,
  };
}

/**
 * Creates a new SM2 item with initial values
 */
export function createSM2Item(): SM2Item {
  return {
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
  };
}

/**
 * Determines quality score from user's answer correctness
 * @param isCorrect Whether the answer was correct
 * @param isEasy Whether the user marked it as easy (optional)
 * @returns Quality score (0-5)
 */
export function getQualityScore(isCorrect: boolean, isEasy: boolean = false): number {
  if (!isCorrect) return 0;
  if (isEasy) return 5;
  return 4; // Correct but not marked as easy
}

