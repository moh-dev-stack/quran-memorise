"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Feedback from "@/components/Feedback";
import type { Question } from "@/lib/types";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";
import { numberArraysEqual } from "@/lib/arrayComparator";

interface SequentialOrderModeProps {
  questions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function SequentialOrderMode({
  questions,
  onAnswer,
}: SequentialOrderModeProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when questions change
  const questionsKey = useMemo(() => {
    return questions.map((q) => q.verse.number).join(",");
  }, [questions]);
  
  useEffect(() => {
    setSelectedOrder(null);
    setIsAnswered(false);
  }, [questionsKey]);

  // Memoize verses to show - shuffle them for better challenge
  const versesToShow = useMemo(() => {
    if (!questions || questions.length === 0) {
      return [];
    }
    const verses = questions.slice(0, Math.min(4, questions.length));
    // Shuffle verses but remember original order for correct answer
    const seed = seedFromValues(...verses.map(q => q.verse.number));
    const rng = createSeededRandom(seed);
    return rng.shuffle([...verses]);
  }, [questionsKey, questions]);

  const correctOrder = useMemo(() => {
    return versesToShow.map((q) => q.verse.number);
  }, [versesToShow]);

  // Memoize options generation with stable shuffle
  const options = useMemo(() => {
    if (versesToShow.length < 2) {
      return [];
    }

    const optionsArray = [
      {
        id: `correct-${correctOrder.join("-")}`,
        order: [...correctOrder],
        display: correctOrder.join(" → "),
      },
    ];

    // Generate wrong orders by swapping adjacent pairs
    // Generate up to 3 wrong options, but handle cases with fewer verses
    const maxWrongOptions = Math.min(3, versesToShow.length - 1);
    for (let i = 0; i < maxWrongOptions; i++) {
      const wrongOrder = [...correctOrder];
      const swapIndex = i % (versesToShow.length - 1);
      [wrongOrder[swapIndex], wrongOrder[swapIndex + 1]] = [
        wrongOrder[swapIndex + 1],
        wrongOrder[swapIndex],
      ];
      optionsArray.push({
        id: `wrong-${wrongOrder.join("-")}-${i}`,
        order: wrongOrder,
        display: wrongOrder.join(" → "),
      });
    }

    // Use seeded random for stable shuffle based on question content
    const seed = seedFromValues(...correctOrder.map(String));
    const rng = createSeededRandom(seed);
    return rng.shuffle(optionsArray);
  }, [correctOrder, versesToShow.length]);

  const correctAnswerId = useMemo(() => {
    return options.find(o => numberArraysEqual(o.order, correctOrder))?.id || null;
  }, [options, correctOrder]);

  const handleSelect = useCallback((optionId: string) => {
    if (isAnswered || !correctAnswerId) return;
    setSelectedOrder(optionId);
    setIsAnswered(true);
    const isCorrect = optionId === correctAnswerId;
    onAnswer(isCorrect);
  }, [isAnswered, correctAnswerId, onAnswer]);

  // Early return after all hooks
  if (!options || options.length === 0 || versesToShow.length < 2) {
    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-gray-600">Not enough verses to generate order options.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Arrange these verses in order:
        </h3>
        <div className="space-y-3">
          {versesToShow.map((q, index) => (
            <div
              key={`${q.verse.number}-${index}`}
              className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm"
            >
              <div className="arabic-text text-xl mb-2 text-center">{q.verse.arabic}</div>
              <div className="text-sm italic text-gray-600 text-center mb-2">
                {q.verse.transliteration}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {q.verse.translation}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Select the correct sequence of verse numbers
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose the correct order:
        </h3>
        {options.map((option) => {
          const isSelected = selectedOrder === option.id;
          const showFeedback = isAnswered;
          const isCorrect = option.id === correctAnswerId;

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
              {option.display}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={selectedOrder === correctAnswerId}
          correctAnswer={correctOrder.join(" → ")}
          userAnswer={
            selectedOrder
              ? options.find((o) => o.id === selectedOrder)?.display
              : undefined
          }
        />
      )}
    </div>
  );
}

