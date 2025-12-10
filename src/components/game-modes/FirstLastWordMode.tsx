"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import VerseCard from "@/components/VerseCard";
import Feedback from "@/components/Feedback";
import type { Question } from "@/lib/types";
import { extractArabicWords, extractTransliterationWords } from "@/lib/wordExtractor";
import { generateArabicTransOptions } from "@/lib/distractorGenerator";
import { createSeededRandom, seedFromValues } from "@/lib/seededRandom";
import { getQuestionHash } from "@/lib/questionHash";

interface FirstLastWordModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function FirstLastWordMode({
  question,
  allQuestions,
  onAnswer,
}: FirstLastWordModeProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswerId(null);
    setIsAnswered(false);
  }, [question.verse.number]);

  // Randomly choose first or last words (different each time)
  const useFirst = useMemo(() => {
    // Use verse number + timestamp + random for varied pattern each time
    const seed = seedFromValues(
      question.verse.number,
      Date.now().toString(),
      Math.random().toString()
    );
    const rng = createSeededRandom(seed);
    return rng.next() > 0.5;
  }, [question.verse.number]);

  // Memoize word extraction
  const arabicWords = useMemo(() => {
    return extractArabicWords(question.verse.arabic);
  }, [question.verse.arabic]);

  const transliterationWords = useMemo(() => {
    return extractTransliterationWords(question.verse.transliteration);
  }, [question.verse.transliteration]);

  // Memoize shown words
  const shownArabic = useMemo(() => {
    const numWords = Math.min(2, arabicWords.length);
    return useFirst
      ? arabicWords.slice(0, numWords).join(" ")
      : arabicWords.slice(-numWords).join(" ");
  }, [useFirst, arabicWords]);

  const shownTransliteration = useMemo(() => {
    const numWords = Math.min(2, transliterationWords.length);
    return useFirst
      ? transliterationWords.slice(0, numWords).join(" ")
      : transliterationWords.slice(-numWords).join(" ");
  }, [useFirst, transliterationWords]);

  // Memoize options using question hash for stable dependencies
  const questionHash = useMemo(() => getQuestionHash(allQuestions), [allQuestions]);
  const rawOptions = useMemo(() => {
    if (!question?.verse || !allQuestions || allQuestions.length === 0) {
      return [];
    }
    return generateArabicTransOptions(question.verse, allQuestions);
  }, [questionHash, question.verse, allQuestions]);

  // Process options to remove shown words
  const options = useMemo(() => {
    if (!rawOptions || rawOptions.length === 0) {
      return [];
    }

    // Number of words shown (same logic as shownArabic/shownTransliteration)
    const numWordsShown = Math.min(2, arabicWords.length);

    return rawOptions.map((option) => {
      // Extract words from option verses
      const optionArabicWords = extractArabicWords(option.arabic);
      const optionTransWords = extractTransliterationWords(option.transliteration);

      let remainingArabicWords: string[];
      let remainingTransWords: string[];

      if (useFirst) {
        // Remove first words (same number as shown)
        remainingArabicWords = optionArabicWords.slice(numWordsShown);
        remainingTransWords = optionTransWords.slice(numWordsShown);
      } else {
        // Remove last words (same number as shown)
        remainingArabicWords = optionArabicWords.slice(0, -numWordsShown);
        remainingTransWords = optionTransWords.slice(0, -numWordsShown);
      }

      // Handle edge case: if all words removed, show placeholder
      const displayArabic = remainingArabicWords.length > 0 
        ? remainingArabicWords.join(" ") 
        : "...";
      const displayTrans = remainingTransWords.length > 0 
        ? remainingTransWords.join(" ") 
        : "...";

      return {
        ...option,
        arabic: displayArabic,
        transliteration: displayTrans,
      };
    });
  }, [rawOptions, useFirst, arabicWords.length]);

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
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {useFirst ? "First" : "Last"} Word(s):
          </h3>
          <div className="arabic-text text-2xl mb-2">{shownArabic}</div>
          <div className="text-lg italic text-gray-600">{shownTransliteration}</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose the complete verse:
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
              <div className="arabic-text text-lg mb-1">{option.arabic}</div>
              <div className="text-sm italic text-gray-600">
                {option.transliteration}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {option.transliteration === question.verse.transliteration 
                  ? question.verse.translation 
                  : ""}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Feedback
          isCorrect={selectedAnswerId === correctAnswerId}
          correctAnswer={`${question.verse.arabic} - ${question.verse.transliteration}`}
          userAnswer={selectedAnswerId ? options.find(o => o.id === selectedAnswerId)?.transliteration : undefined}
        />
      )}
    </div>
  );
}

