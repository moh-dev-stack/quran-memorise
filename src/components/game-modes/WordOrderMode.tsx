"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Feedback from "@/components/Feedback";
import type { Question } from "@/lib/types";
import { extractArabicWords } from "@/lib/wordExtractor";
import { shuffleArray } from "@/lib/utils";

interface WordOrderModeProps {
  question: Question;
  allQuestions: Question[];
  onAnswer: (isCorrect: boolean) => void;
}

export default function WordOrderMode({
  question,
  allQuestions,
  onAnswer,
}: WordOrderModeProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(Math.random());

  // Extract correct words
  const correctWords = useMemo(() => {
    return extractArabicWords(question.verse.arabic);
  }, [question.verse.arabic]);

  // Reset state when question changes
  useEffect(() => {
    setIsAnswered(false);
    setSelectedWords([]);
    // Generate new random seed for shuffling
    setShuffleSeed(Math.random() * Date.now() + Math.random());
  }, [question.verse.number]);

  // Shuffle words when seed changes
  useEffect(() => {
    if (correctWords.length === 0) return;
    
    // Use shuffleArray which uses Math.random() internally
    // The shuffleSeed ensures we get a new shuffle each time
    const shuffled = shuffleArray([...correctWords]);
    setAvailableWords(shuffled);
  }, [correctWords, shuffleSeed, question.verse.number]);

  const handleWordSelect = useCallback((word: string, index: number) => {
    if (isAnswered) return;
    
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  }, [isAnswered]);

  const handleWordRemove = useCallback((index: number) => {
    if (isAnswered) return;
    
    const wordToRemove = selectedWords[index];
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, wordToRemove]);
  }, [isAnswered, selectedWords]);

  const handleCheckAnswer = useCallback(() => {
    if (isAnswered || selectedWords.length !== correctWords.length) return;
    
    const isCorrect = selectedWords.every((word, index) => word === correctWords[index]);
    setIsAnswered(true);
    onAnswer(isCorrect);
  }, [isAnswered, selectedWords, correctWords, onAnswer]);

  const handleReset = useCallback(() => {
    if (isAnswered) return;
    
    setSelectedWords([]);
    // Re-shuffle available words
    const shuffled = shuffleArray([...correctWords]);
    setAvailableWords(shuffled);
    // Update seed to trigger re-shuffle
    setShuffleSeed(Math.random() * Date.now() + Math.random());
  }, [isAnswered, correctWords]);

  const isComplete = selectedWords.length === correctWords.length;
  const isCorrect = useMemo(() => {
    if (!isAnswered || selectedWords.length !== correctWords.length) return false;
    return selectedWords.every((word, index) => word === correctWords[index]);
  }, [isAnswered, selectedWords, correctWords]);

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Instructions */}
      <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 english-text">
          Arrange the words in the correct order
        </h3>
        <p className="text-sm text-gray-600 english-text mb-4">
          Click words below to add them to your answer. Click on selected words to remove them.
        </p>
        <div className="text-center mb-2">
          <div className="text-sm text-gray-500 english-text mb-2">Correct verse:</div>
          <div className="arabic-text text-xl text-gray-700">
            {question.verse.arabic}
          </div>
          <div className="text-sm italic text-gray-600 english-text mt-2">
            {question.verse.transliteration}
          </div>
        </div>
      </div>

      {/* Selected words (answer area) */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-gray-800 english-text">
          Your Answer:
        </h4>
        <div className="min-h-[60px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-wrap gap-2 items-start">
          {selectedWords.length === 0 ? (
            <span className="text-gray-400 english-text text-sm">Click words below to build your answer...</span>
          ) : (
            selectedWords.map((word, index) => {
              const isCorrectPosition = isAnswered && word === correctWords[index];
              const isWrongPosition = isAnswered && !isCorrectPosition;
              
              return (
                <button
                  key={`selected-${index}-${word}`}
                  onClick={() => handleWordRemove(index)}
                  disabled={isAnswered}
                  className={`px-3 py-2 rounded-lg text-base transition-colors touch-target arabic-text ${
                    isAnswered
                      ? isCorrectPosition
                        ? "bg-green-500 text-white"
                        : isWrongPosition
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700"
                      : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  {word}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Available words */}
      <div className="space-y-2">
        <h4 className="text-base font-semibold text-gray-800 english-text">
          Available Words:
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableWords.length === 0 ? (
            <span className="text-gray-400 english-text text-sm">All words selected</span>
          ) : (
            availableWords.map((word, index) => (
              <button
                key={`available-${index}-${word}`}
                onClick={() => handleWordSelect(word, index)}
                disabled={isAnswered}
                className="px-3 py-2 rounded-lg text-base bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500 transition-colors touch-target arabic-text disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          disabled={isAnswered || selectedWords.length === 0}
          className="flex-1 py-3 rounded-lg text-base bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors touch-target disabled:opacity-50 disabled:cursor-not-allowed english-text"
        >
          Reset
        </button>
        <button
          onClick={handleCheckAnswer}
          disabled={isAnswered || !isComplete}
          className={`flex-1 py-3 rounded-lg text-base transition-colors touch-target english-text ${
            isComplete && !isAnswered
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Check Answer
        </button>
      </div>

      {/* Feedback */}
      {isAnswered && (
        <Feedback
          isCorrect={isCorrect}
          correctAnswer={question.verse.arabic}
          userAnswer={selectedWords.join(" ")}
        />
      )}
    </div>
  );
}

