"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import VerseCard from "@/components/VerseCard";
import type { Question } from "@/lib/types";

interface ReadingModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function ReadingMode({
  question,
  allQuestions,
  onAnswer,
}: ReadingModeProps) {
  // Sort questions by verse number to ensure correct order
  const sortedQuestions = useMemo(() => {
    return [...allQuestions].sort((a, b) => {
      // First sort by surah number, then by verse number
      if (a.surahNumber !== b.surahNumber) {
        return a.surahNumber - b.surahNumber;
      }
      return a.verse.number - b.verse.number;
    });
  }, [allQuestions]);

  // Find current verse index in sorted array
  const currentIndex = useMemo(() => {
    return sortedQuestions.findIndex(
      (q) => q.verse.number === question.verse.number && q.surahNumber === question.surahNumber
    );
  }, [question, sortedQuestions]);

  const [currentVerseIndex, setCurrentVerseIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  // Update currentVerseIndex when question changes
  useEffect(() => {
    const newIndex = sortedQuestions.findIndex(
      (q) => q.verse.number === question.verse.number && q.surahNumber === question.surahNumber
    );
    if (newIndex >= 0 && newIndex !== currentVerseIndex) {
      setCurrentVerseIndex(newIndex);
    }
  }, [question.verse.number, question.surahNumber, sortedQuestions, currentVerseIndex]);

  const currentVerse = useMemo(() => {
    if (currentVerseIndex >= 0 && currentVerseIndex < sortedQuestions.length) {
      return sortedQuestions[currentVerseIndex];
    }
    return question;
  }, [currentVerseIndex, sortedQuestions, question]);

  const canGoPrevious = currentVerseIndex > 0;
  const canGoNext = currentVerseIndex < sortedQuestions.length - 1;

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentVerseIndex((prev) => prev - 1);
      // Call onAnswer with true since reading mode doesn't have scoring
      onAnswer(true);
    }
  }, [canGoPrevious, onAnswer]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setCurrentVerseIndex((prev) => prev + 1);
      // Call onAnswer with true since reading mode doesn't have scoring
      onAnswer(true);
    }
  }, [canGoNext, onAnswer]);

  const handleFirst = useCallback(() => {
    setCurrentVerseIndex(0);
    onAnswer(true);
  }, [onAnswer]);

  const handleLast = useCallback(() => {
    setCurrentVerseIndex(sortedQuestions.length - 1);
    onAnswer(true);
  }, [sortedQuestions.length, onAnswer]);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header with surah info */}
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-4 mb-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-1 english-text">
            {currentVerse.surahName}
          </h3>
          <p className="text-sm text-gray-600 english-text">
            Verse {currentVerse.verse.number} of {sortedQuestions.length}
          </p>
        </div>
      </div>

      {/* Verse Card */}
      <VerseCard
        verse={currentVerse.verse}
        showTranslation={true}
        showTransliteration={true}
      />

      {/* Navigation Controls */}
      <div className="flex flex-col gap-2">
        {/* Main navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`flex-1 py-3 rounded-lg text-base transition-colors touch-target english-text ${
              canGoPrevious
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Previous verse"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex-1 py-3 rounded-lg text-base transition-colors touch-target english-text ${
              canGoNext
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Next verse"
          >
            Next →
          </button>
        </div>

        {/* Jump to first/last buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFirst}
            disabled={currentVerseIndex === 0}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors touch-target english-text ${
              currentVerseIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="First verse"
          >
            First Verse
          </button>
          <button
            onClick={handleLast}
            disabled={currentVerseIndex === sortedQuestions.length - 1}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors touch-target english-text ${
              currentVerseIndex === sortedQuestions.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Last verse"
          >
            Last Verse
          </button>
        </div>
      </div>

      {/* Verse list indicator */}
      <div className="flex flex-wrap gap-1 justify-center">
        {sortedQuestions.map((q, index) => (
          <button
            key={`${q.surahNumber}-${q.verse.number}`}
            onClick={() => {
              setCurrentVerseIndex(index);
              onAnswer(true);
            }}
            className={`w-8 h-8 rounded text-xs transition-colors touch-target ${
              index === currentVerseIndex
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={`Go to verse ${q.verse.number}`}
          >
            {q.verse.number}
          </button>
        ))}
      </div>
    </div>
  );
}

