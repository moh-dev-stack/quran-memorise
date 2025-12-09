"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Feedback from "@/components/Feedback";
import type { Question } from "@/lib/types";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";

interface VerseNumberModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function VerseNumberMode({
  question,
  allQuestions,
  onAnswer,
}: VerseNumberModeProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
  }, [question.verse.number]);

  // Generate verse number options
  const options = useMemo(() => {
    const correctNumber = question.verse.number;
    const allNumbers = allQuestions.map((q) => q.verse.number);
    const minNumber = Math.min(...allNumbers);
    const maxNumber = Math.max(...allNumbers);

    // Generate wrong options - mix nearby numbers and random ones
    const wrongOptions: number[] = [];
    const seen = new Set([correctNumber]);

    // Add nearby numbers (±1, ±2)
    for (let offset of [-2, -1, 1, 2]) {
      const candidate = correctNumber + offset;
      if (candidate >= minNumber && candidate <= maxNumber && !seen.has(candidate)) {
        wrongOptions.push(candidate);
        seen.add(candidate);
      }
    }

    // Add random numbers if we need more
    const availableNumbers = allNumbers.filter((n) => !seen.has(n));
    const seed = seedFromValues(question.verse.number, question.verse.arabic);
    const rng = createSeededRandom(seed);
    const shuffled = rng.shuffle([...availableNumbers]);

    for (const num of shuffled) {
      if (wrongOptions.length >= 3) break;
      if (!seen.has(num)) {
        wrongOptions.push(num);
        seen.add(num);
      }
    }

    // Create options array
    const optionsArray = [
      {
        id: `correct-${correctNumber}`,
        number: correctNumber,
        isCorrect: true,
      },
      ...wrongOptions.slice(0, 3).map((num) => ({
        id: `wrong-${num}`,
        number: num,
        isCorrect: false,
      })),
    ];

    // Shuffle options
    return rng.shuffle(optionsArray);
  }, [question.verse.number, question.verse.arabic, allQuestions]);

  const correctAnswerId = useMemo(() => {
    return options.find((o) => o.isCorrect)?.id || null;
  }, [options]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (isAnswered || !correctAnswerId) return;
      setSelectedAnswerId(optionId);
      setIsAnswered(true);
      const isCorrect = optionId === correctAnswerId;
      onAnswer(isCorrect);
    },
    [isAnswered, correctAnswerId, onAnswer]
  );

  if (!options || options.length === 0) {
    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-gray-600">
          Unable to generate options. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          What is the verse number?
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="arabic-text text-2xl md:text-3xl mb-3 text-center text-gray-900">
              {question.verse.arabic}
            </div>
            <div className="text-base italic text-gray-700 text-center mb-2">
              {question.verse.transliteration}
            </div>
            <div className="text-sm text-gray-600 text-center">
              {question.verse.translation}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Choose the verse number:
        </h3>
        {options.map((option) => {
          const isSelected = selectedAnswerId === option.id;
          const showFeedback = isAnswered;
          const isCorrect = option.isCorrect;

          let buttonClass =
            "w-full py-4 px-4 rounded-lg text-base transition-colors touch-target font-semibold ";
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
              Verse {option.number}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={selectedAnswerId === correctAnswerId}
          correctAnswer={`Verse ${question.verse.number}`}
          userAnswer={
            selectedAnswerId
              ? `Verse ${options.find((o) => o.id === selectedAnswerId)?.number}`
              : undefined
          }
        />
      )}
    </div>
  );
}

