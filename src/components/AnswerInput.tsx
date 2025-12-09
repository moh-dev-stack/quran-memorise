"use client";

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your answer...",
}: AnswerInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-sm md:max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg"
        autoFocus
      />
    </div>
  );
}

