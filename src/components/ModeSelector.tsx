"use client";

import type { GameMode, GameModeOption } from "@/lib/types";
import { GAME_MODES } from "@/lib/gameModes";

interface ModeSelectorProps {
  selectedMode: GameMode | null;
  onSelectMode: (mode: GameMode) => void;
}

export default function ModeSelector({
  selectedMode,
  onSelectMode,
}: ModeSelectorProps) {
  return (
    <div className="w-full max-w-md space-y-3">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Choose Game Mode
      </h2>
      {GAME_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={`w-full p-4 rounded-xl text-left transition-all touch-target ${
            selectedMode === mode.id
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-800 shadow-md hover:shadow-lg"
          }`}
        >
          <div className="font-semibold text-base mb-1">{mode.name}</div>
          <div
            className={`text-sm ${
              selectedMode === mode.id ? "text-blue-100" : "text-gray-600"
            }`}
          >
            {mode.description}
          </div>
        </button>
      ))}
    </div>
  );
}

