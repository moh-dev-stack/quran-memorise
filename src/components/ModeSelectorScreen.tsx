"use client";

import ModeSelector from "@/components/ModeSelector";
import type { Question, GameMode } from "@/lib/types";

interface ModeSelectorScreenProps {
  questions: Question[];
  selectedMode: GameMode | null;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export default function ModeSelectorScreen({
  questions,
  selectedMode,
  onSelectMode,
  onBack,
}: ModeSelectorScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 mb-4 touch-target english-text"
            aria-label="Back to surah selection"
          >
            ← Back to Surah Selection
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 english-text">
            {questions[0]?.surahName}
          </h1>
          <p className="text-gray-600 english-text">
            {questions.length} verses • Choose a game mode
          </p>
        </div>
        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={onSelectMode}
        />
      </div>
    </main>
  );
}

