"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
import SurahSelector from "@/components/SurahSelector";
import ModeSelectorScreen from "@/components/ModeSelectorScreen";
import GameScreen from "@/components/GameScreen";
import { getQuestionsForSurah, getAvailableSurahs } from "@/lib/questions";
import { calculateScore } from "@/lib/scoreCalculator";
import type { Question, GameMode, Surah } from "@/lib/types";
import {
  selectSurah,
  selectMode,
  submitAnswer,
  nextQuestion,
  resetToModeSelection,
  resetToSurahSelection,
  type GameState,
} from "@/lib/gameState";

function PlayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState>({
    selectedSurah: null,
    allQuestions: [],
    questions: [],
    selectedMode: null,
    currentQuestionIndex: 0,
    scores: [],
    isAnswered: false,
    usedReveal: false,
  });
  const [availableSurahs, setAvailableSurahs] = useState<Surah[]>([]);

  // Load available surahs
  useEffect(() => {
    const surahs = getAvailableSurahs();
    setAvailableSurahs(surahs);
    
    // Check if surah is specified in URL params
    const surahParam = searchParams.get("surah");
    if (surahParam) {
      const surahNumber = parseInt(surahParam, 10);
      if (!isNaN(surahNumber) && surahs.some(s => s.number === surahNumber)) {
        const questions = getQuestionsForSurah(surahNumber);
        if (questions.length > 0) {
          setGameState((prev) => selectSurah(prev, surahNumber, questions));
        }
      }
    }
  }, [searchParams]);

  // Load questions when surah is selected
  useEffect(() => {
    if (gameState.selectedSurah && gameState.allQuestions.length === 0) {
      const loadedQuestions = getQuestionsForSurah(gameState.selectedSurah);
      if (loadedQuestions.length === 0) {
        router.push("/");
        return;
      }
      setGameState((prev) => selectSurah(prev, gameState.selectedSurah!, loadedQuestions));
    }
  }, [gameState.selectedSurah, gameState.allQuestions.length, router]);

  const handleSurahSelect = useCallback((surahNumber: number) => {
    const questions = getQuestionsForSurah(surahNumber);
    if (questions.length === 0) {
      router.push("/");
      return;
    }
    setGameState((prev) => selectSurah(prev, surahNumber, questions));
  }, [router]);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setGameState((prev) => selectMode(prev, mode));
  }, []);

  const handleAnswer = useCallback((isCorrect: boolean, revealUsed: boolean = false) => {
    setGameState((prev) => {
      if (!prev.selectedMode || prev.isAnswered) return prev;
      
      const newState = submitAnswer(prev, isCorrect, revealUsed);
      const scoreResult = calculateScore(prev.selectedMode!, isCorrect, revealUsed);
      
      return {
        ...newState,
        scores: [...prev.scores, scoreResult],
      };
    });
  }, []);

  const handleNextQuestion = useCallback(() => {
    setGameState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return nextQuestion(prev);
      } else {
        // Game completed
        const totalScore = prev.scores.reduce((sum, s) => sum + s.points, 0);
        const maxScore = prev.scores.reduce((sum, s) => sum + s.maxPoints, 0);
        router.push(
          `/play/complete?score=${totalScore}&total=${maxScore}&mode=${prev.selectedMode}`
        );
        return prev;
      }
    });
  }, [router]);

  const handleBackToSurahSelection = useCallback(() => {
    setGameState(resetToSurahSelection());
  }, []);

  const handleRestart = useCallback(() => {
    setGameState((prev) => resetToModeSelection(prev));
  }, []);

  const handleBackToModes = useCallback(() => {
    setGameState((prev) => resetToModeSelection(prev));
  }, []);

  const currentQuestion = useMemo(
    () => gameState.questions[gameState.currentQuestionIndex],
    [gameState.questions, gameState.currentQuestionIndex]
  );

  const totalScore = useMemo(
    () => gameState.scores.reduce((sum, s) => sum + s.points, 0),
    [gameState.scores]
  );

  const maxScore = useMemo(
    () => gameState.scores.reduce((sum, s) => sum + s.maxPoints, 0),
    [gameState.scores]
  );

  // Surah selection screen
  if (!gameState.selectedSurah) {
    return (
      <SurahSelector
        surahs={availableSurahs}
        onSelectSurah={handleSurahSelect}
        onBack={() => router.push("/")}
      />
    );
  }

  // Mode selection screen
  if (!gameState.selectedMode) {
    return (
      <ModeSelectorScreen
        questions={gameState.questions}
        selectedMode={gameState.selectedMode}
        onSelectMode={handleModeSelect}
        onBack={handleBackToSurahSelection}
      />
    );
  }

  // Game mode screen
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <GameScreen
      currentQuestion={currentQuestion}
      questions={gameState.questions}
      allQuestions={gameState.allQuestions}
      selectedMode={gameState.selectedMode}
      currentQuestionIndex={gameState.currentQuestionIndex}
      totalScore={totalScore}
      maxScore={maxScore}
      isAnswered={gameState.isAnswered}
      onAnswer={handleAnswer}
      onNextQuestion={handleNextQuestion}
      onBackToModes={handleBackToModes}
      onRestart={handleRestart}
      onHome={() => router.push("/")}
    />
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <PlayPageContent />
    </Suspense>
  );
}
