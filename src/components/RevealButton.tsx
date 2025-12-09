"use client";

interface RevealButtonProps {
  onReveal: () => void;
  revealed: boolean;
  disabled?: boolean;
}

export default function RevealButton({
  onReveal,
  revealed,
  disabled = false,
}: RevealButtonProps) {
  if (revealed) {
    return (
      <div className="w-full max-w-md mt-4 p-3 bg-yellow-100 border-2 border-yellow-500 rounded-lg text-center">
        <span className="text-yellow-800 font-semibold">Answer Revealed</span>
      </div>
    );
  }

  return (
    <button
      onClick={onReveal}
      disabled={disabled}
      className="w-full max-w-md mt-4 py-3 px-4 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors touch-target"
    >
      Reveal Answer
    </button>
  );
}

