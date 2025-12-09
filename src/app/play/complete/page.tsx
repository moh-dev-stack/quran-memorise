"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

function CompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const mode = searchParams.get("mode") || "";
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Game Complete!</h1>
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
          <div className="text-xl text-gray-700 mb-4">
            You scored {score} out of {total} points
          </div>
          {percentage >= 80 && (
            <div className="text-green-600 font-semibold text-lg">
              Excellent work! 🎉
            </div>
          )}
          {percentage >= 60 && percentage < 80 && (
            <div className="text-blue-600 font-semibold text-lg">Good job! 👍</div>
          )}
          {percentage < 60 && (
            <div className="text-orange-600 font-semibold text-lg">
              Keep practicing! 💪
            </div>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/play")}
            className="w-full py-4 rounded-lg text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors touch-target"
          >
            Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-lg text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors touch-target"
          >
            Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CompleteContent />
    </Suspense>
  );
}

