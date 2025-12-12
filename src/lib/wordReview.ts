import type { Word, ReviewStats } from "./wordTypes";
import { updateSM2Item, createSM2Item } from "./spacedRepetition";

/**
 * Update word review data based on quality score
 */
export function updateWordReview(word: Word, quality: number): Word {
  const currentReviewData = word.reviewData || createSM2Item();
  const updatedReviewData = updateSM2Item(currentReviewData, quality);

  return {
    ...word,
    reviewData: updatedReviewData,
  };
}

/**
 * Get words that are due for review
 */
export function getWordsDueForReview(words: Word[]): Word[] {
  const now = new Date();
  return words.filter((word) => {
    if (!word.reviewData) {
      // Words without review data are considered new and due for review
      return true;
    }
    return new Date(word.reviewData.nextReview) <= now;
  });
}

/**
 * Get review statistics for words
 */
export function getWordReviewStats(words: Word[]): ReviewStats {
  const wordsWithReview = words.filter((w) => w.reviewData);
  const wordsDue = getWordsDueForReview(words);
  
  // Words are "mastered" if they have high ease factor and many repetitions
  const wordsMastered = wordsWithReview.filter(
    (w) => w.reviewData && w.reviewData.easeFactor >= 2.5 && w.reviewData.repetitions >= 5
  );
  
  const wordsLearning = wordsWithReview.filter(
    (w) => w.reviewData && w.reviewData.repetitions > 0 && w.reviewData.repetitions < 5
  );

  const totalEaseFactor = wordsWithReview.reduce(
    (sum, w) => sum + (w.reviewData?.easeFactor || 0),
    0
  );
  const averageEaseFactor =
    wordsWithReview.length > 0 ? totalEaseFactor / wordsWithReview.length : 0;

  return {
    totalWords: words.length,
    wordsDue: wordsDue.length,
    wordsMastered: wordsMastered.length,
    wordsLearning: wordsLearning.length,
    averageEaseFactor,
  };
}

/**
 * Initialize review data for a word (mark as new)
 */
export function initializeWordReview(word: Word): Word {
  return {
    ...word,
    reviewData: createSM2Item(),
  };
}

/**
 * Reset review data for a word
 */
export function resetWordReview(word: Word): Word {
  return {
    ...word,
    reviewData: createSM2Item(),
  };
}

