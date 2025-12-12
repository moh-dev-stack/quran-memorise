"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import WordFlashcard from "@/components/words/WordFlashcard";
import { getAllWords } from "@/lib/wordData";
import { getWordsDueForReview, updateWordReview, getWordReviewStats } from "@/lib/wordReview";
import { initializeWordReview } from "@/lib/wordReview";
import type { Word } from "@/lib/wordTypes";

export default function WordReviewPage() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quality, setQuality] = useState<number | null>(null);

  useEffect(() => {
    const allWords = getAllWords();
    const wordsDue = getWordsDueForReview(allWords);
    setWords(wordsDue);
    setCurrentIndex(0);
  }, []);

  const currentWord = useMemo(() => {
    return words[currentIndex];
  }, [words, currentIndex]);

  const stats = useMemo(() => {
    return getWordReviewStats(getAllWords());
  }, []);

  const handleQualityRating = useCallback(
    (rating: number) => {
      if (!currentWord) return;

      const wordWithReview = currentWord.reviewData
        ? currentWord
        : initializeWordReview(currentWord);
      const updatedWord = updateWordReview(wordWithReview, rating);

      // Update word in the list
      const updatedWords = [...words];
      updatedWords[currentIndex] = updatedWord;
      setWords(updatedWords);
      setQuality(null);

      // Move to next word
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All words reviewed, go back to words page
        router.push("/words");
      }
    },
    [currentWord, currentIndex, words, router]
  );

  const canGoNext = currentIndex < words.length - 1;
  const canGoPrevious = currentIndex > 0;

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
      setQuality(null);
    }
  }, [canGoNext]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1);
      setQuality(null);
    }
  }, [canGoPrevious]);

  if (words.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 english-text">
            No Words Due for Review
          </h2>
          <p className="text-gray-600 mb-6 english-text">
            Great job! You&apos;re all caught up. Come back later for more reviews.
          </p>
          <button
            onClick={() => router.push("/words")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 english-text"
          >
            Back to Words
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => router.push("/words")}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
            >
              ← Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
            >
              Home
            </button>
          </div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 english-text">
              Review Words
            </h2>
            <p className="text-sm text-gray-600 english-text">
              Word {currentIndex + 1} of {words.length}
            </p>
            <p className="text-xs text-gray-500 english-text mt-1">
              {stats.wordsMastered} mastered • {stats.wordsLearning} learning
            </p>
          </div>
        </div>

        {/* Flashcard */}
        {currentWord && (
          <WordFlashcard
            word={currentWord}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        )}

        {/* Quality Rating Buttons */}
        {currentWord && (
          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-600 english-text mb-2">
              How well did you remember this word?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleQualityRating(rating)}
                  className={`py-3 rounded-lg text-sm font-semibold transition-colors touch-target english-text ${
                    quality === rating
                      ? "bg-blue-600 text-white"
                      : rating < 3
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : rating === 3
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center english-text mt-2">
              <div>0-2: Forgot • 3: Hard • 4: Good • 5: Easy</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

