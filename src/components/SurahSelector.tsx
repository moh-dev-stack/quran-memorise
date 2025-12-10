"use client";

import type { Surah } from "@/lib/types";

interface SurahSelectorProps {
  surahs: Surah[];
  onSelectSurah: (surahNumber: number) => void;
  onBack: () => void;
}

export default function SurahSelector({
  surahs,
  onSelectSurah,
  onBack,
}: SurahSelectorProps) {
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
            Select a Surah
          </h1>
          <p className="text-gray-600 english-text">
            Choose a surah to memorize
          </p>
        </div>
        <div className="space-y-3">
          {surahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => onSelectSurah(surah.number)}
              className="w-full p-4 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 transition-colors text-left touch-target"
              aria-label={`Select Surah ${surah.name}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800 english-text">
                    {surah.number}. Surah {surah.name}
                  </div>
                  <div className="text-sm text-gray-600 arabic-text">
                    {surah.nameArabic} • {surah.verses.length} verses
                  </div>
                </div>
                <span className="text-blue-600 english-text">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

