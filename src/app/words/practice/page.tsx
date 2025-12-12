"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WordMultipleChoice from "@/components/words/WordMultipleChoice";
import LearningPathSelector from "@/components/words/LearningPathSelector";
import { WORD_GAME_MODES, type WordGameMode } from "@/lib/wordGameModes";
import { getAllLearningPaths, getLearningPathById } from "@/lib/wordLearningPaths";
import {
  selectLearningPath,
  nextWord,
  submitWordAnswer,
  resetToPathSelection,
} from "@/lib/wordState";
import type { WordState } from "@/lib/wordState";
import { calculateScore } from "@/lib/scoreCalculator";
import type { LearningPath } from "@/lib/wordTypes";

function WordPracticeContent() {
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
  const [selectedMode, setSelectedMode] = useState<WordGameMode | null>(null);

  const pathId = searchParams.get("path");
  const modeParam = searchParams.get("mode") as WordGameMode | null;

  useEffect(() => {
    if (pathId) {
      const path = getLearningPathById(pathId);
      if (path) {
        setWordState((prev) => selectLearningPath(prev, path));
      }
    }
    if (modeParam && WORD_GAME_MODES.some((m) => m.id === modeParam)) {
      setSelectedMode(modeParam);
    }
  }, [pathId, modeParam]);

  const handleSelectPath = useCallback(
    (path: LearningPath) => {
      setWordState((prev) => selectLearningPath(prev, path));
      router.push(`/words/practice?path=${path.id}`);
    },
    [router]
  );

  const handleBack = useCallback(() => {
    router.push("/words");
  }, [router]);

  const handleSelectMode = useCallback(
    (mode: WordGameMode) => {
      setSelectedMode(mode);
      if (wordState.selectedLearningPath) {
        router.push(
          `/words/practice?path=${wordState.selectedLearningPath.id}&mode=${mode}`
        );
      }
    },
    [wordState.selectedLearningPath, router]
  );

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!selectedMode) return;

      // Calculate score (using a simple scoring system for words)
      const score = {
        points: isCorrect ? 10 : 0,
        maxPoints: 10,
      };

      setWordState((prev) => submitWordAnswer(prev, isCorrect, score));
    },
    [selectedMode]
  );

  const handleNext = useCallback(() => {
    setWordState((prev) => nextWord(prev));
  }, []);

  const currentWord = useMemo(() => {
    return wordState.words[wordState.currentWordIndex];
  }, [wordState.words, wordState.currentWordIndex]);

  const canGoNext = wordState.currentWordIndex < wordState.words.length - 1;

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

  // Show mode selector if no mode selected
  if (!selectedMode) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800 mb-4 touch-target english-text"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 english-text">
              Choose Practice Mode
            </h1>
            <p className="text-gray-600 english-text">
              Select how you want to practice
            </p>
          </div>

          <div className="space-y-3">
            {WORD_GAME_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleSelectMode(mode.id)}
                className="w-full p-4 rounded-xl text-left bg-white text-gray-800 shadow-md hover:shadow-lg transition-all touch-target"
              >
                <div className="font-semibold text-base mb-1 english-text">
                  {mode.name}
                </div>
                <div className="text-sm text-gray-600 english-text">
                  {mode.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!currentWord) {
    const totalScore = wordState.scores.reduce((sum, s) => sum + s.points, 0);
    const maxScore = wordState.scores.reduce((sum, s) => sum + s.maxPoints, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 english-text">
            Practice Complete!
          </h2>
          <div className="text-lg text-gray-600 mb-6 english-text">
            Score: {totalScore} / {maxScore} ({percentage}%)
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setWordState((prev) => selectLearningPath(prev, wordState.selectedLearningPath!));
                setSelectedMode(null);
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 english-text"
            >
              Practice Again
            </button>
            <button
              onClick={handleBack}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 english-text"
            >
              Back to Words
            </button>
          </div>
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
              onClick={() => {
                setSelectedMode(null);
                router.push(`/words/practice?path=${wordState.selectedLearningPath!.id}`);
              }}
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
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 english-text">
              {wordState.selectedLearningPath.name}
            </h2>
            <p className="text-sm text-gray-600 english-text">
              Word {wordState.currentWordIndex + 1} of {wordState.words.length}
            </p>
            {wordState.scores.length > 0 && (
              <p className="text-sm text-gray-600 english-text mt-1">
                Score:{" "}
                {wordState.scores.reduce((sum, s) => sum + s.points, 0)} /{" "}
                {wordState.scores.reduce((sum, s) => sum + s.maxPoints, 0)}
              </p>
            )}
          </div>
        </div>

        {/* Multiple Choice Component */}
        <WordMultipleChoice
          word={currentWord}
          allWords={wordState.words}
          mode={selectedMode}
          onAnswer={handleAnswer}
        />

        {/* Next Button */}
        {wordState.isAnswered && canGoNext && (
          <button
            onClick={handleNext}
            className="w-full mt-4 py-4 rounded-lg text-lg bg-green-600 text-white hover:bg-green-700 transition-colors touch-target english-text"
          >
            Next Word
          </button>
        )}

        {wordState.isAnswered && !canGoNext && (
          <button
            onClick={() => {
              setWordState((prev) => selectLearningPath(prev, wordState.selectedLearningPath!));
              setSelectedMode(null);
            }}
            className="w-full mt-4 py-4 rounded-lg text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors touch-target english-text"
          >
            Practice Again
          </button>
        )}
      </div>
    </main>
  );
}

export default function WordPracticePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center english-text">Loading...</div>
      </main>
    }>
      <WordPracticeContent />
    </Suspense>
  );
}

