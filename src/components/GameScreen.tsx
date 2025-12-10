"use client";

import ScoreDisplay from "@/components/ScoreDisplay";
import ArabicTransToTranslationMode from "@/components/game-modes/ArabicTransToTranslationMode";
import TranslationToArabicTransMode from "@/components/game-modes/TranslationToArabicTransMode";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import SequentialOrderMode from "@/components/game-modes/SequentialOrderMode";
import FirstLastWordMode from "@/components/game-modes/FirstLastWordMode";
import VerseNumberMode from "@/components/game-modes/VerseNumberMode";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Question, GameMode } from "@/lib/types";

interface GameScreenProps {
  currentQuestion: Question;
  questions: Question[];
  allQuestions: Question[];
  selectedMode: GameMode;
  currentQuestionIndex: number;
  totalScore: number;
  maxScore: number;
  isAnswered: boolean;
  onAnswer: (isCorrect: boolean, revealUsed?: boolean) => void;
  onNextQuestion: () => void;
  onBackToModes: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export default function GameScreen({
  currentQuestion,
  questions,
  allQuestions,
  selectedMode,
  currentQuestionIndex,
  totalScore,
  maxScore,
  isAnswered,
  onAnswer,
  onNextQuestion,
  onBackToModes,
  onRestart,
  onHome,
}: GameScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onBackToModes}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
              aria-label="Back to mode selection"
            >
              ← Back to Modes
            </button>
            <button
              onClick={onHome}
              className="text-gray-600 hover:text-gray-800 touch-target english-text"
              aria-label="Go to home page"
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
        <ErrorBoundary>
          <div className="mb-4" key={`${selectedMode}-${currentQuestionIndex}`}>
            {selectedMode === "arabic-trans-to-translation" && (
              <ArabicTransToTranslationMode
                question={currentQuestion}
                allQuestions={questions}
                onAnswer={onAnswer}
              />
            )}
            {selectedMode === "translation-to-arabic-trans" && (
              <TranslationToArabicTransMode
                question={currentQuestion}
                allQuestions={questions}
                onAnswer={onAnswer}
              />
            )}
            {selectedMode === "missing-word" && (
              <MissingWordMode
                question={currentQuestion}
                allQuestions={questions}
                onAnswer={onAnswer}
              />
            )}
            {selectedMode === "sequential-order" && (
              <SequentialOrderMode
                question={currentQuestion}
                allQuestions={allQuestions}
                onAnswer={onAnswer}
              />
            )}
            {selectedMode === "first-last-word" && (
              <FirstLastWordMode
                question={currentQuestion}
                allQuestions={questions}
                onAnswer={onAnswer}
              />
            )}
            {selectedMode === "verse-number" && (
              <VerseNumberMode
                question={currentQuestion}
                allQuestions={questions}
                onAnswer={onAnswer}
              />
            )}
          </div>
        </ErrorBoundary>

        {/* Next Button */}
        {isAnswered && (
          <button
            onClick={onNextQuestion}
            className="w-full py-4 rounded-lg text-lg bg-green-600 text-white hover:bg-green-700 transition-colors touch-target mb-2"
            aria-label={
              currentQuestionIndex < questions.length - 1
                ? "Go to next question"
                : "Finish game"
            }
          >
            {currentQuestionIndex < questions.length - 1
              ? "Next Question"
              : "Finish"}
          </button>
        )}

        {/* Restart Button */}
        {isAnswered && (
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-lg text-base bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors touch-target"
            aria-label="Change game mode"
          >
            Change Mode
          </button>
        )}
      </div>
    </main>
  );
}

