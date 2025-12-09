import type { Verse } from "@/lib/types";

interface VerseCardProps {
  verse: Verse;
  showTranslation?: boolean;
  showTransliteration?: boolean;
}

export default function VerseCard({
  verse,
  showTranslation = true,
  showTransliteration = true,
}: VerseCardProps) {
  return (
    <div className="w-full max-w-sm md:max-w-md rounded-xl shadow-lg bg-white p-6 mb-4">
      <div className="mb-4">
        <div className="arabic-text text-2xl md:text-3xl leading-relaxed text-center mb-4 text-gray-900">
          {verse.arabic}
        </div>
        {showTransliteration && (
          <div className="text-center text-lg text-gray-600 italic mb-2">
            {verse.transliteration}
          </div>
        )}
        {showTranslation && (
          <div className="text-center text-base text-gray-700">
            {verse.translation}
          </div>
        )}
      </div>
      <div className="text-center text-sm text-gray-500">
        Verse {verse.number}
      </div>
    </div>
  );
}

