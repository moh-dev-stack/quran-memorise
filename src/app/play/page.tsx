"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ModeSelector from "@/components/ModeSelector";
import ScoreDisplay from "@/components/ScoreDisplay";
import ArabicTransToTranslationMode from "@/components/game-modes/ArabicTransToTranslationMode";
import TranslationToArabicTransMode from "@/components/game-modes/TranslationToArabicTransMode";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import SequentialOrderMode from "@/components/game-modes/SequentialOrderMode";
import FirstLastWordMode from "@/components/game-modes/FirstLastWordMode";
import VerseNumberMode from "@/components/game-modes/VerseNumberMode";
import { getQuestionsForSurah } from "@/lib/questions";
import { calculateScore } from "@/lib/scoreCalculator";
import type { Question, GameMode } from "@/lib/types";
import { isValidGameMode } from "@/lib/gameModes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";

const SURAH_NUMBER = 93; // Ad-Duha

interface ScoreEntry {
  points: number;
  maxPoints: number;
}

export default function PlayPage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [usedReveal, setUsedReveal] = useState(false);

  useEffect(() => {
    const loadedQuestions = getQuestionsForSurah(SURAH_NUMBER);
    if (loadedQuestions.length === 0) {
      router.push("/");
      return;
    }
    setAllQuestions(loadedQuestions);
    // Initially set questions in order (will be shuffled when mode is selected)
    setQuestions(loadedQuestions);
  }, [router]);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setCurrentQuestionIndex(0);
    setScores([]);
    setIsAnswered(false);
    setUsedReveal(false);
    
    // Shuffle questions randomly for this mode
    // Use mode + timestamp for seed to ensure different order each time
    const seed = seedFromValues(mode, Date.now().toString());
    const rng = createSeededRandom(seed);
    const shuffled = rng.shuffle([...allQuestions]);
    setQuestions(shuffled);
  };

  const handleAnswer = useCallback((isCorrect: boolean, revealUsed: boolean = false) => {
    if (!selectedMode || isAnswered) return;
    
    setIsAnswered(true);
    setUsedReveal(revealUsed);
    
    const scoreResult = calculateScore(selectedMode, isCorrect, revealUsed);
    setScores((prev) => [...prev, scoreResult]);
  }, [selectedMode, isAnswered]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      setUsedReveal(false);
    } else {
      // Game completed
      const totalScore = scores.reduce((sum, s) => sum + s.points, 0);
      const maxScore = scores.reduce((sum, s) => sum + s.maxPoints, 0);
      router.push(
        `/play/complete?score=${totalScore}&total=${maxScore}&mode=${selectedMode}`
      );
    }
  };

  const handleRestart = () => {
    setSelectedMode(null);
    setCurrentQuestionIndex(0);
    setScores([]);
    setIsAnswered(false);
    setUsedReveal(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalScore = scores.reduce((sum, s) => sum + s.points, 0);
  const maxScore = scores.reduce((sum, s) => sum + s.maxPoints, 0);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Mode selection screen
  if (!selectedMode) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 mb-4 touch-target"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {questions[0]?.surahName}
            </h1>
            <p className="text-gray-600">
              {questions.length} verses • Choose a game mode
            </p>
          </div>
          <ModeSelector
            selectedMode={selectedMode}
            onSelectMode={handleModeSelect}
          />
        </div>
      </main>
    );
  }

  // Game mode screen
  return (
    <main className="min-h-screen flex flex-col items-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-gray-600 hover:text-gray-800 touch-target"
            >
              ← Modes
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-800 touch-target"
            >
              Home
            </button>
          </div>
          <ScoreDisplay
            score={totalScore}
            total={maxScore}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        {/* Game Mode Component */}
        {currentQuestion && (
          <ErrorBoundary>
            <div className="mb-4" key={`${selectedMode}-${currentQuestionIndex}`}>
              {selectedMode === "arabic-trans-to-translation" && (
                <ArabicTransToTranslationMode
                  question={currentQuestion}
                  allQuestions={questions}
                  onAnswer={handleAnswer}
                />
              )}
              {selectedMode === "translation-to-arabic-trans" && (
                <TranslationToArabicTransMode
                  question={currentQuestion}
                  allQuestions={questions}
                  onAnswer={handleAnswer}
                />
              )}
              {selectedMode === "missing-word" && (
                <MissingWordMode
                  question={currentQuestion}
                  allQuestions={questions}
                  onAnswer={handleAnswer}
                />
              )}
              {selectedMode === "sequential-order" && (
                <SequentialOrderMode
                  questions={(() => {
                    // For sequential order, pick random verses (not sequential)
                    // Shuffle available questions and pick 4 random ones
                    const seed = seedFromValues(
                      "sequential-order",
                      currentQuestionIndex.toString(),
                      questions.length.toString()
                    );
                    const rng = createSeededRandom(seed);
                    const shuffled = rng.shuffle([...questions]);
                    return shuffled.slice(0, Math.min(4, shuffled.length));
                  })()}
                  onAnswer={handleAnswer}
                />
              )}
              {selectedMode === "first-last-word" && (
                <FirstLastWordMode
                  question={currentQuestion}
                  allQuestions={questions}
                  onAnswer={handleAnswer}
                />
              )}
              {selectedMode === "verse-number" && (
                <VerseNumberMode
                  question={currentQuestion}
                  allQuestions={questions}
                  onAnswer={handleAnswer}
                />
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* Next Button */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 rounded-lg text-lg bg-green-600 text-white hover:bg-green-700 transition-colors touch-target mb-2"
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish"}
          </button>
        )}

        {/* Restart Button */}
        {scores.length > 0 && (
          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-lg text-base bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors touch-target"
          >
            Change Mode
          </button>
        )}
      </div>
    </main>
  );
}
