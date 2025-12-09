"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import VerseCard from "@/components/VerseCard";
import Feedback from "@/components/Feedback";
import type { Verse, Question } from "@/lib/types";
import { generateTranslationOptions } from "@/lib/distractorGenerator";
import { isEmpty } from "@/lib/stringNormalizer";
import { getQuestionHash } from "@/lib/questionHash";

interface ArabicTransToTranslationModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function ArabicTransToTranslationMode({
  question,
  allQuestions,
  onAnswer,
}: ArabicTransToTranslationModeProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
  }, [question.verse.number]);

  // Memoize options using question hash for stable dependencies
  const questionHash = useMemo(() => getQuestionHash(allQuestions), [allQuestions]);
  const options = useMemo(() => {
    if (!question?.verse || !allQuestions || allQuestions.length === 0) {
      return [];
    }
    return generateTranslationOptions(question.verse, allQuestions);
  }, [questionHash, question.verse, allQuestions]);

  const correctAnswerId = useMemo(() => {
    return options.find(o => o.isCorrect)?.id || null;
  }, [options]);

  const handleSelect = useCallback((optionId: string) => {
    if (isAnswered || !correctAnswerId) return;
    setSelectedAnswerId(optionId);
    setIsAnswered(true);
    const isCorrect = optionId === correctAnswerId;
    onAnswer(isCorrect);
  }, [isAnswered, correctAnswerId, onAnswer]);

  if (!options || options.length === 0) {
    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-gray-600">Unable to generate options. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <VerseCard
        verse={question.verse}
        showTranslation={false}
        showTransliteration={true}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose the correct translation:
        </h3>
        {options.map((option) => {
          const isSelected = selectedAnswerId === option.id;
          const showFeedback = isAnswered;
          const isCorrect = option.isCorrect;

          let buttonClass =
            "w-full py-4 px-4 rounded-lg text-base transition-colors touch-target ";
          if (showFeedback) {
            if (isCorrect) {
              buttonClass += "bg-green-500 text-white";
            } else if (isSelected && !isCorrect) {
              buttonClass += "bg-red-500 text-white";
            } else {
              buttonClass += "bg-gray-200 text-gray-700";
            }
          } else {
            buttonClass += isSelected
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isAnswered}
              className={buttonClass}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={selectedAnswerId === correctAnswerId}
          correctAnswer={question.verse.translation}
          userAnswer={selectedAnswerId ? options.find(o => o.id === selectedAnswerId)?.text : undefined}
        />
      )}
    </div>
  );
}

