"use client";

import { useCallback } from "react";
import type { Word, VerseExample } from "@/lib/wordTypes";

interface VerseExampleModalProps {
  examples: VerseExample[];
  word: Word;
  onClose: () => void;
}

export default function VerseExampleModal({
  examples,
  word,
  onClose,
}: VerseExampleModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 english-text">
            Verse Examples for: {word.translation}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl english-text"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {examples.map((example, index) => (
            <div
              key={`${example.surah}-${example.verse}-${index}`}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600 english-text">
                  Surah {example.surah}, Verse {example.verse}
                </span>
              </div>
              <div className="arabic-text text-2xl md:text-3xl leading-relaxed text-center mb-3 text-gray-900">
                {example.arabic}
              </div>
              <div className="text-base text-gray-700 text-center english-text">
                {example.translation}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors english-text"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

