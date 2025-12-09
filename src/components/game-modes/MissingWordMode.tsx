"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import VerseCard from "@/components/VerseCard";
import Feedback from "@/components/Feedback";
import RevealButton from "@/components/RevealButton";
import type { Question, Verse } from "@/lib/types";
import { generateBlanks, generateMissingWordOptions } from "@/lib/blankGenerator";

interface MissingWordModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean, usedReveal: boolean) => void;
}

export default function MissingWordMode({
  question,
  allQuestions,
  onAnswer,
}: MissingWordModeProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [blankSeed, setBlankSeed] = useState<number>(Math.random());

  // Reset state when question changes and generate new random seed for blanks
  useEffect(() => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
    setRevealed(false);
    // Generate new random seed each time question changes to ensure different blanks
    // Use multiple random sources to ensure uniqueness
    setBlankSeed(Math.random() * Date.now() + Math.random());
  }, [question.verse.number]);

  // Memoize blanked result - include blankSeed to ensure randomness each time
  const blanked = useMemo(() => {
    return generateBlanks(question.verse, true, blankSeed);
  }, [question.verse.number, question.verse.arabic, blankSeed]);

  // Memoize options to keep them stable - use content hash instead of array reference
  const allVersesHash = useMemo(() => {
    return allQuestions.map(q => `${q.verse.number}-${q.verse.arabic}`).join("|");
  }, [allQuestions]);
  
  const allVerses = useMemo(() => {
    return allQuestions.map((q) => q.verse);
  }, [allVersesHash, allQuestions]);

  const options = useMemo(() => {
    if (!blanked.missingWords || blanked.missingWords.length === 0) {
      return [];
    }
    return generateMissingWordOptions(
      blanked.missingWords,
      allVerses,
      true
    );
  }, [blanked.missingWords, allVerses]);

  const correctAnswer = useMemo(() => {
    return blanked.missingWords.join(" ");
  }, [blanked.missingWords]);

  const correctAnswerId = useMemo(() => {
    return options.find(o => o.isCorrect)?.id || null;
  }, [options]);

  const handleSelect = useCallback((optionId: string) => {
    if (isAnswered || !correctAnswerId) return;
    setSelectedAnswerId(optionId);
    setIsAnswered(true);
    const isCorrect = optionId === correctAnswerId;
    onAnswer(isCorrect, revealed);
  }, [isAnswered, correctAnswerId, revealed, onAnswer]);

  const handleReveal = useCallback(() => {
    if (revealed || isAnswered || !correctAnswerId) return;
    setRevealed(true);
    setSelectedAnswerId(correctAnswerId);
    setIsAnswered(true);
    onAnswer(true, true);
  }, [revealed, isAnswered, correctAnswerId, onAnswer]);

  // Early return after all hooks
  if (!options || options.length === 0) {
    return (
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-gray-600">Unable to generate options. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <div className="mb-4">
          <div className="arabic-text text-2xl md:text-3xl leading-relaxed text-center mb-4 text-gray-900">
            {blanked.blankedText}
          </div>
          <div className="text-center text-base text-gray-700">
            {question.verse.translation}
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          Verse {question.verse.number}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose the missing word(s):
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

      {!isAnswered && <RevealButton onReveal={handleReveal} revealed={revealed} />}

      {isAnswered && (
        <Feedback
          isCorrect={selectedAnswerId === correctAnswerId}
          correctAnswer={correctAnswer}
          userAnswer={selectedAnswerId ? options.find(o => o.id === selectedAnswerId)?.text : undefined}
        />
      )}
    </div>
  );
}

