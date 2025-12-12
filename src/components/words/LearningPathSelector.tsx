"use client";

import type { LearningPath } from "@/lib/wordTypes";
import { getAllLearningPaths } from "@/lib/wordLearningPaths";

interface LearningPathSelectorProps {
  selectedPath: LearningPath | null;
  onSelectPath: (path: LearningPath) => void;
  onBack: () => void;
}

export default function LearningPathSelector({
  selectedPath,
  onSelectPath,
  onBack,
}: LearningPathSelectorProps) {
  const paths = getAllLearningPaths();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 mb-4 touch-target english-text"
            aria-label="Back to home"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 english-text">
            Choose Learning Path
          </h1>
          <p className="text-gray-600 english-text">
            Select how you want to learn Quranic words
          </p>
        </div>

        <div className="space-y-3">
          {paths.map((path) => {
            const words = path.getWords();
            const isSelected = selectedPath?.id === path.id;

            return (
              <button
                key={path.id}
                onClick={() => onSelectPath(path)}
                className={`w-full p-4 rounded-xl text-left transition-all touch-target ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-800 shadow-md hover:shadow-lg"
                }`}
                aria-label={`Select ${path.name}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-base mb-1 english-text">
                      {path.name}
                    </div>
                    <div
                      className={`text-sm ${
                        isSelected ? "text-blue-100" : "text-gray-600"
                      } english-text`}
                    >
                      {path.description}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isSelected ? "text-blue-200" : "text-gray-500"
                      } english-text`}
                    >
                      {words.length} words
                    </div>
                  </div>
                  <span
                    className={`text-xl ${isSelected ? "text-white" : "text-blue-600"} english-text`}
                  >
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

