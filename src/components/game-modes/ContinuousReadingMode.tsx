"use client";

import { useMemo } from "react";
import VerseCard from "@/components/VerseCard";
import type { Question } from "@/lib/types";

interface ContinuousReadingModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function ContinuousReadingMode({
  question,
  allQuestions,
  onAnswer,
}: ContinuousReadingModeProps) {
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

  return (
    <div className="w-full max-w-md">
      {/* Header with surah info - sticky at top */}
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-4 mb-4 sticky top-0 z-10">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-1 english-text">
            {question.surahName}
          </h3>
          <p className="text-sm text-gray-600 english-text">
            {sortedQuestions.length} verses
          </p>
        </div>
      </div>

      {/* Scrollable verse list */}
      <div className="space-y-4 pb-8">
        {sortedQuestions.map((q) => (
          <div key={`${q.surahNumber}-${q.verse.number}`}>
            <VerseCard
              verse={q.verse}
              showTranslation={true}
              showTransliteration={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

