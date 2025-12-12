"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WordFlashcard from "@/components/words/WordFlashcard";
import LearningPathSelector from "@/components/words/LearningPathSelector";
import { getAllLearningPaths, getLearningPathById } from "@/lib/wordLearningPaths";
import {
  selectLearningPath,
  nextWord,
  previousWord,
  resetToPathSelection,
} from "@/lib/wordState";
import type { WordState } from "@/lib/wordState";
import { initializeWordReview, updateWordReview } from "@/lib/wordReview";
import { getQualityScore } from "@/lib/spacedRepetition";
import type { LearningPath, Word } from "@/lib/wordTypes";

function WordStudyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wordState, setWordState] = useState<WordState>({
    selectedLearningPath: null,
    currentWordIndex: 0,
    words: [],
    reviewMode: false,
    scores: [],
    isAnswered: false,
  });
  const [showBothSides, setShowBothSides] = useState(false);

  // Check if path is specified in URL
  const pathId = searchParams.get("path");

  useEffect(() => {
    if (pathId) {
      const path = getLearningPathById(pathId);
      if (path) {
        setWordState((prev) => selectLearningPath(prev, path));
      }
    }
  }, [pathId]);

  const handleSelectPath = useCallback((path: LearningPath) => {
    setWordState((prev) => selectLearningPath(prev, path));
    router.push(`/words/study?path=${path.id}`);
  }, [router]);

  const handleBack = useCallback(() => {
    router.push("/words");
  }, [router]);

  const handleNext = useCallback(() => {
    setWordState((prev) => nextWord(prev));
  }, []);

  const handlePrevious = useCallback(() => {
    setWordState((prev) => previousWord(prev));
  }, []);

  const handleMarkKnown = useCallback(() => {
    const currentWord = wordState.words[wordState.currentWordIndex];
    if (!currentWord) return;

    const quality = 5; // Easy/known
    const updatedWord = updateWordReview(
      currentWord.reviewData ? currentWord : initializeWordReview(currentWord),
      quality
    );

    // Update word in state
    const updatedWords = [...wordState.words];
    updatedWords[wordState.currentWordIndex] = updatedWord;
    setWordState((prev) => ({
      ...prev,
      words: updatedWords,
    }));

    // Move to next word after a short delay
    setTimeout(() => {
      handleNext();
    }, 500);
  }, [wordState, handleNext]);

  const handleMarkReview = useCallback(() => {
    const currentWord = wordState.words[wordState.currentWordIndex];
    if (!currentWord) return;

    const quality = 3; // Needs review
    const updatedWord = updateWordReview(
      currentWord.reviewData ? currentWord : initializeWordReview(currentWord),
      quality
    );

    // Update word in state
    const updatedWords = [...wordState.words];
    updatedWords[wordState.currentWordIndex] = updatedWord;
    setWordState((prev) => ({
      ...prev,
      words: updatedWords,
    }));

    // Move to next word after a short delay
    setTimeout(() => {
      handleNext();
    }, 500);
  }, [wordState, handleNext]);

  const currentWord = useMemo(() => {
    return wordState.words[wordState.currentWordIndex];
  }, [wordState.words, wordState.currentWordIndex]);

  const canGoNext = wordState.currentWordIndex < wordState.words.length - 1;
  const canGoPrevious = wordState.currentWordIndex > 0;

  // Show path selector if no path selected
  if (!wordState.selectedLearningPath || wordState.words.length === 0) {
    return (
      <LearningPathSelector
        selectedPath={wordState.selectedLearningPath}
        onSelectPath={handleSelectPath}
        onBack={handleBack}
      />
    );
  }

  if (!currentWord) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 english-text">
            No words available
          </h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 english-text"
          >
            Back to Paths
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
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
            >
              ← Back
            </button>
            <button
              onClick={() => router.push("/words")}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
            >
              Home
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 english-text">
              {wordState.selectedLearningPath.name}
            </h2>
            <p className="text-sm text-gray-600 english-text">
              Word {wordState.currentWordIndex + 1} of {wordState.words.length}
            </p>
            <button
              onClick={() => setShowBothSides(!showBothSides)}
              className="mt-2 px-4 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors english-text"
            >
              {showBothSides ? "Switch to Flip Mode" : "Switch to Side-by-Side View"}
            </button>
          </div>
        </div>

        {/* Flashcard */}
        <WordFlashcard
          word={currentWord}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          onMarkKnown={handleMarkKnown}
          onMarkReview={handleMarkReview}
          showBothSides={showBothSides}
        />
      </div>
    </main>
  );
}

export default function WordStudyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center english-text">Loading...</div>
        </main>
      }
    >
      <WordStudyContent />
    </Suspense>
  );
}

