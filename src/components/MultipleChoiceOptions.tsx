"use client";

interface MultipleChoiceOptionsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  selectedAnswer?: string;
}

export default function MultipleChoiceOptions({
  options,
  onSelect,
  disabled = false,
  correctAnswer,
  selectedAnswer,
}: MultipleChoiceOptionsProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md space-y-2">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = correctAnswer && option === correctAnswer;
        const showFeedback = correctAnswer && isSelected;

        let buttonClass =
          "w-full py-3 rounded-lg text-lg mt-2 transition-colors ";
        if (showFeedback) {
          buttonClass += isCorrect
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white";
        } else if (isSelected) {
          buttonClass += "bg-blue-500 text-white";
        } else {
          buttonClass += "bg-gray-200 text-gray-800 hover:bg-gray-300";
        }

        if (disabled) {
          buttonClass += " opacity-50 cursor-not-allowed";
        }

        return (
          <button
            key={index}
            onClick={() => !disabled && onSelect(option)}
            disabled={disabled}
            className={buttonClass}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

