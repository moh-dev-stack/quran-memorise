"use client";

interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer?: string;
  userAnswer?: string;
}

export default function Feedback({
  isCorrect,
  correctAnswer,
  userAnswer,
}: FeedbackProps) {
  if (isCorrect) {
    return (
      <div className="w-full max-w-sm md:max-w-md mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
        <div className="text-center text-green-800 font-semibold text-lg">
          ✓ Correct!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm md:max-w-md mt-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
      <div className="text-center text-red-800 font-semibold text-lg mb-2">
        ✗ Incorrect
      </div>
      {userAnswer && (
        <div className="text-center text-gray-700 mb-1">
          Your answer: <span className="font-medium">{userAnswer}</span>
        </div>
      )}
      {correctAnswer && (
        <div className="text-center text-gray-700">
          Correct answer: <span className="font-medium">{correctAnswer}</span>
        </div>
      )}
    </div>
  );
}

