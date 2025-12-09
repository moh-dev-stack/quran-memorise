"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Feedback from "@/components/Feedback";
import type { Question } from "@/lib/types";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";

interface SequentialOrderModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function SequentialOrderMode({
  question,
  allQuestions,
  onAnswer,
}: SequentialOrderModeProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
  }, [question.verse.number]);

  // Find the verse that comes before the current verse
  const previousVerse = useMemo(() => {
    const currentVerseNumber = question.verse.number;
    if (currentVerseNumber <= 1) {
      return null; // No verse before verse 1
    }
    return allQuestions.find((q) => q.verse.number === currentVerseNumber - 1);
  }, [question.verse.number, allQuestions]);

  // Generate options - correct answer + distractors
  const options = useMemo(() => {
    if (!previousVerse) {
      return [];
    }

    const correctAnswer = previousVerse.verse.number;
    const allVerseNumbers = allQuestions.map((q) => q.verse.number);
    const minNumber = Math.min(...allVerseNumbers);
    const maxNumber = Math.max(...allVerseNumbers);

    // Generate wrong options - mix nearby numbers and random ones
    const wrongOptions: number[] = [];
    const seen = new Set([correctAnswer, question.verse.number]);

    // Add nearby numbers (±1, ±2, ±3)
    for (let offset of [-3, -2, -1, 1, 2, 3]) {
      const candidate = correctAnswer + offset;
      if (
        candidate >= minNumber &&
        candidate <= maxNumber &&
        !seen.has(candidate)
      ) {
        wrongOptions.push(candidate);
        seen.add(candidate);
      }
    }

    // Add random numbers if we need more
    const availableNumbers = allVerseNumbers.filter((n) => !seen.has(n));
    const seed = seedFromValues(
      question.verse.number,
      question.verse.arabic
    );
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
        id: `correct-${correctAnswer}`,
        verseNumber: correctAnswer,
        isCorrect: true,
      },
      ...wrongOptions.slice(0, 3).map((num) => ({
        id: `wrong-${num}`,
        verseNumber: num,
        isCorrect: false,
      })),
    ];

    // Shuffle options
    return rng.shuffle(optionsArray);
  }, [previousVerse, question.verse.number, question.verse.arabic, allQuestions]);

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

  if (!previousVerse || !options || options.length === 0) {
    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-gray-600">
          {!previousVerse
            ? "This is the first verse. No verse comes before it."
            : "Unable to generate options. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Which verse comes before this one?
        </h3>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 mb-4">
          <div className="arabic-text text-2xl md:text-3xl mb-3 text-center text-gray-900">
            {question.verse.arabic}
          </div>
          <div className="text-base italic text-gray-700 text-center mb-2">
            {question.verse.transliteration}
          </div>
          <div className="text-sm text-gray-600 text-center mb-2">
            {question.verse.translation}
          </div>
          <div className="text-center text-gray-500 font-semibold mt-2">
            Verse {question.verse.number}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Choose the verse that comes before:
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
              Verse {option.verseNumber}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={selectedAnswerId === correctAnswerId}
          correctAnswer={`Verse ${previousVerse.verse.number}`}
          userAnswer={
            selectedAnswerId
              ? `Verse ${options.find((o) => o.id === selectedAnswerId)?.verseNumber}`
              : undefined
          }
        />
      )}
    </div>
  );
}
