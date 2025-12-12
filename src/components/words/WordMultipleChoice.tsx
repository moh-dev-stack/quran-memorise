"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Word, WordGameMode } from "@/lib/wordTypes";
import { generateWordDistractors } from "@/lib/wordGameModes";
import { generateOptionId } from "@/lib/optionIdGenerator";
import { shuffleArray } from "@/lib/utils";
import Feedback from "@/components/Feedback";

interface WordMultipleChoiceProps {
  word: Word;
  allWords: Word[];
  mode: WordGameMode;
  onAnswer: (isCorrect: boolean) => void;
}

interface WordOption {
  id: string;
  word: Word;
  displayText: string;
  isCorrect: boolean;
}

export default function WordMultipleChoice({
  word,
  allWords,
  mode,
  onAnswer,
}: WordMultipleChoiceProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when word changes
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
  }, [word.id]);

  // Generate options based on mode
  const options = useMemo(() => {
    const distractors = generateWordDistractors(word, allWords, 3);
    const allOptions = [word, ...distractors];
    const shuffled = shuffleArray(allOptions);

    return shuffled.map((w, index) => {
      let displayText = "";
      switch (mode) {
        case "arabic-to-translation":
          displayText = w.translation;
          break;
        case "translation-to-arabic":
          displayText = w.arabic;
          break;
        case "transliteration-to-translation":
          displayText = w.translation;
          break;
      }

      return {
        id: generateOptionId(w.id + displayText, index, "word"),
        word: w,
        displayText,
        isCorrect: w.id === word.id,
      };
    });
  }, [word, allWords, mode]);

  const correctOption = useMemo(() => {
    return options.find((opt) => opt.isCorrect);
  }, [options]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (isAnswered) return;
      setSelectedOptionId(optionId);
      setIsAnswered(true);

      const selected = options.find((opt) => opt.id === optionId);
      const isCorrect = selected?.isCorrect || false;
      onAnswer(isCorrect);
    },
    [isAnswered, options, onAnswer]
  );

  // Get question text based on mode
  const questionText = useMemo(() => {
    switch (mode) {
      case "arabic-to-translation":
        return word.arabic;
      case "translation-to-arabic":
        return word.translation;
      case "transliteration-to-translation":
        return word.transliteration;
    }
  }, [mode, word]);

  const correctAnswer = useMemo(() => {
    if (!correctOption) return "";
    switch (mode) {
      case "arabic-to-translation":
        return correctOption.word.translation;
      case "translation-to-arabic":
        return correctOption.word.arabic;
      case "transliteration-to-translation":
        return correctOption.word.translation;
    }
  }, [mode, correctOption]);

  const userAnswer = useMemo(() => {
    if (!selectedOptionId) return "";
    const selected = options.find((opt) => opt.id === selectedOptionId);
    return selected?.displayText || "";
  }, [selectedOptionId, options]);

  const isCorrect = useMemo(() => {
    if (!selectedOptionId || !correctOption) return false;
    return selectedOptionId === correctOption.id;
  }, [selectedOptionId, correctOption]);

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Question */}
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 english-text">
            {mode === "arabic-to-translation" && "Choose the correct translation"}
            {mode === "translation-to-arabic" && "Choose the correct Arabic word"}
            {mode === "transliteration-to-translation" && "Choose the correct translation"}
          </h3>
          <div
            className={`text-4xl md:text-5xl mb-4 ${
              mode === "translation-to-arabic" ? "arabic-text" : "english-text"
            }`}
          >
            {questionText}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const showCorrect = isAnswered && option.isCorrect;
          const showIncorrect = isAnswered && isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-lg text-left transition-colors touch-target ${
                showCorrect
                  ? "bg-green-500 text-white"
                  : showIncorrect
                  ? "bg-red-500 text-white"
                  : isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500"
              } disabled:opacity-100 ${
                mode === "translation-to-arabic" ? "arabic-text text-2xl" : "english-text text-lg"
              }`}
            >
              {option.displayText}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <Feedback
          isCorrect={isCorrect}
          correctAnswer={correctAnswer || ""}
          userAnswer={userAnswer}
        />
      )}
    </div>
  );
}

