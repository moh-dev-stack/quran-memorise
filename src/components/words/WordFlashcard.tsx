"use client";

import { useState, useCallback } from "react";
import type { Word } from "@/lib/wordTypes";
import VerseExampleModal from "./VerseExampleModal";

interface WordFlashcardProps {
  word: Word;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  onMarkKnown?: () => void;
  onMarkReview?: () => void;
  showBothSides?: boolean; // Show Arabic and translation side-by-side without flipping
}

export default function WordFlashcard({
  word,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  onMarkKnown,
  onMarkReview,
  showBothSides = false,
}: WordFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVerseExample, setShowVerseExample] = useState(false);

  const handleFlip = useCallback(() => {
    if (!showBothSides) {
      setIsFlipped((prev) => !prev);
    }
  }, [showBothSides]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    onNext?.();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    setIsFlipped(false);
    onPrevious?.();
  }, [onPrevious]);

  return (
    <>
      <div className="w-full max-w-md">
        {/* Flashcard */}
        {showBothSides ? (
          /* Side-by-side view */
          <div className="w-full rounded-xl shadow-lg bg-white overflow-hidden">
            {/* Arabic Side */}
            <div className="w-full p-6 bg-white border-b-2 border-gray-200">
              <div className="text-center">
                <div className="arabic-text text-4xl md:text-5xl mb-2 text-gray-900">
                  {word.arabic}
                </div>
              </div>
            </div>
            
            {/* Translation Side */}
            <div className="w-full p-6 bg-blue-50">
              <div className="text-center space-y-3">
                <div className="text-xl md:text-2xl text-gray-700 italic english-text">
                  {word.transliteration}
                </div>
                <div className="text-lg md:text-xl text-gray-800 font-semibold english-text">
                  {word.translation}
                </div>
                {word.root && (
                  <div className="text-sm text-gray-600 english-text">
                    Root: {word.root}
                  </div>
                )}
                {word.partOfSpeech && (
                  <div className="text-xs text-gray-500 english-text uppercase">
                    {word.partOfSpeech}
                  </div>
                )}
                {word.verseExamples && word.verseExamples.length > 0 && (
                  <button
                    onClick={() => setShowVerseExample(true)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors english-text text-sm"
                  >
                    Show Verse Example
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Flip card view */
          <div
            className="relative w-full h-96 perspective-1000 cursor-pointer"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full preserve-3d transition-transform duration-500 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front Side - Arabic */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-lg bg-white p-8 flex flex-col items-center justify-center ${
                  isFlipped ? "hidden" : ""
                }`}
              >
                <div className="text-center">
                  <div className="arabic-text text-5xl md:text-6xl mb-4 text-gray-900">
                    {word.arabic}
                  </div>
                  <p className="text-sm text-gray-500 english-text mt-4">
                    Tap to flip
                  </p>
                </div>
              </div>

              {/* Back Side - Transliteration + Translation */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg bg-blue-50 p-8 flex flex-col items-center justify-center ${
                  isFlipped ? "" : "hidden"
                }`}
              >
                <div className="text-center space-y-4">
                  <div className="text-2xl md:text-3xl text-gray-700 italic english-text mb-2">
                    {word.transliteration}
                  </div>
                  <div className="text-xl md:text-2xl text-gray-800 font-semibold english-text mb-4">
                    {word.translation}
                  </div>
                  {word.root && (
                    <div className="text-sm text-gray-600 english-text">
                      Root: {word.root}
                    </div>
                  )}
                  {word.partOfSpeech && (
                    <div className="text-xs text-gray-500 english-text uppercase">
                      {word.partOfSpeech}
                    </div>
                  )}
                  {word.verseExamples && word.verseExamples.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVerseExample(true);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors english-text text-sm"
                    >
                      Show Verse Example
                    </button>
                  )}
                  <p className="text-sm text-gray-500 english-text mt-4">
                    Tap to flip back
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation and Actions */}
        <div className="mt-6 space-y-3">
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={`flex-1 py-3 rounded-lg text-base transition-colors touch-target english-text ${
                canGoPrevious
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex-1 py-3 rounded-lg text-base transition-colors touch-target english-text ${
                canGoNext
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next →
            </button>
          </div>

          {/* Mark Buttons */}
          {(onMarkKnown || onMarkReview) && (
            <div className="flex gap-2">
              {onMarkKnown && (
                <button
                  onClick={onMarkKnown}
                  className="flex-1 py-2 rounded-lg text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors english-text"
                >
                  ✓ Mark as Known
                </button>
              )}
              {onMarkReview && (
                <button
                  onClick={onMarkReview}
                  className="flex-1 py-2 rounded-lg text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors english-text"
                >
                  ↻ Needs Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verse Example Modal */}
      {showVerseExample && word.verseExamples && word.verseExamples.length > 0 && (
        <VerseExampleModal
          examples={word.verseExamples}
          word={word}
          onClose={() => setShowVerseExample(false)}
        />
      )}
    </>
  );
}

