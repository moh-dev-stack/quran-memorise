"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import LearningPathSelector from "@/components/words/LearningPathSelector";
import type { LearningPath } from "@/lib/wordTypes";
import { getWordsDueForReview } from "@/lib/wordReview";
import { getAllWords } from "@/lib/wordData";

export default function WordsPage() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  const handleSelectPath = useCallback((path: LearningPath) => {
    setSelectedPath(path);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedPath(null);
  }, []);

  // Check if there are words due for review
  const allWords = getAllWords();
  const wordsDue = getWordsDueForReview(allWords);
  const hasWordsDue = wordsDue.length > 0;

  if (selectedPath) {
    // Redirect to study page with selected path
    // For now, we'll handle this in the study page component
    return null; // Will be handled by routing
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 mb-4 inline-block touch-target english-text"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 english-text">
            Memorize Words
          </h1>
          <p className="text-gray-600 english-text">
            Learn the 125 most common words of the Quran
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/words/study"
            className="block w-full p-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg english-text text-center"
          >
            <div className="text-xl font-semibold mb-1">Start Learning</div>
            <div className="text-sm text-blue-100">
              Choose a learning path and begin
            </div>
          </Link>

          {hasWordsDue && (
            <Link
              href="/words/review"
              className="block w-full p-6 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg english-text text-center"
            >
              <div className="text-xl font-semibold mb-1">Review Words</div>
              <div className="text-sm text-green-100">
                {wordsDue.length} word{wordsDue.length !== 1 ? "s" : ""} due for review
              </div>
            </Link>
          )}

          <Link
            href="/words/practice"
            className="block w-full p-6 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg english-text text-center"
          >
            <div className="text-xl font-semibold mb-1">Practice Mode</div>
            <div className="text-sm text-purple-100">
              Test your knowledge with multiple choice
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

