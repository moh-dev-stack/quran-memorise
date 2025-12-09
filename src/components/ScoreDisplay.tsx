"use client";

interface ScoreDisplayProps {
  score: number;
  total: number;
  currentQuestion: number;
  totalQuestions: number;
}

export default function ScoreDisplay({
  score,
  total,
  currentQuestion,
  totalQuestions,
}: ScoreDisplayProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="w-full max-w-md mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span>
          Score: {score}/{total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
}

