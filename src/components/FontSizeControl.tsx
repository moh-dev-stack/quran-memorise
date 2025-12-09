"use client";

import { useState, useEffect } from "react";

const ARABIC_FONT_SIZE_KEY = "quran-arabic-font-size";
const ENGLISH_FONT_SIZE_KEY = "quran-english-font-size";

const MIN_SIZE = 0.75; // 75%
const MAX_SIZE = 1.5; // 150%
const DEFAULT_ARABIC = 1.0;
const DEFAULT_ENGLISH = 1.0;

export default function FontSizeControl() {
  const [arabicSize, setArabicSize] = useState(DEFAULT_ARABIC);
  const [englishSize, setEnglishSize] = useState(DEFAULT_ENGLISH);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedArabic = localStorage.getItem(ARABIC_FONT_SIZE_KEY);
    const savedEnglish = localStorage.getItem(ENGLISH_FONT_SIZE_KEY);

    if (savedArabic) {
      const size = parseFloat(savedArabic);
      if (!isNaN(size) && size >= MIN_SIZE && size <= MAX_SIZE) {
        setArabicSize(size);
        document.documentElement.style.setProperty("--arabic-font-size", `${size}`);
      }
    } else {
      document.documentElement.style.setProperty("--arabic-font-size", `${DEFAULT_ARABIC}`);
    }

    if (savedEnglish) {
      const size = parseFloat(savedEnglish);
      if (!isNaN(size) && size >= MIN_SIZE && size <= MAX_SIZE) {
        setEnglishSize(size);
        document.documentElement.style.setProperty("--english-font-size", `${size}`);
      }
    } else {
      document.documentElement.style.setProperty("--english-font-size", `${DEFAULT_ENGLISH}`);
    }
  }, []);

  const handleArabicChange = (newSize: number) => {
    setArabicSize(newSize);
    localStorage.setItem(ARABIC_FONT_SIZE_KEY, newSize.toString());
    document.documentElement.style.setProperty("--arabic-font-size", `${newSize}`);
  };

  const handleEnglishChange = (newSize: number) => {
    setEnglishSize(newSize);
    localStorage.setItem(ENGLISH_FONT_SIZE_KEY, newSize.toString());
    document.documentElement.style.setProperty("--english-font-size", `${newSize}`);
  };

  const resetSizes = () => {
    handleArabicChange(DEFAULT_ARABIC);
    handleEnglishChange(DEFAULT_ENGLISH);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-2" style={{ paddingTop: 'max(env(safe-area-inset-top), 0.5rem)' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors touch-target text-sm font-medium text-gray-700"
            aria-label="Font size settings"
          >
            <span className="text-lg">🔤</span>
            <span>Font Size</span>
            <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {isOpen && (
            <button
              onClick={resetSizes}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors touch-target text-xs text-gray-600"
            >
              Reset
            </button>
          )}
        </div>

        {isOpen && (
          <div className="mt-3 space-y-4 pb-2">
            {/* Arabic Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Arabic Font Size
                </label>
                <span className="text-xs text-gray-500">
                  {Math.round(arabicSize * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleArabicChange(Math.max(MIN_SIZE, arabicSize - 0.1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center touch-target text-lg font-bold"
                  aria-label="Decrease Arabic font size"
                >
                  −
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${((arabicSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100}%`,
                    }}
                  />
                </div>
                <button
                  onClick={() => handleArabicChange(Math.min(MAX_SIZE, arabicSize + 0.1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center touch-target text-lg font-bold"
                  aria-label="Increase Arabic font size"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                <span className="arabic-text" style={{ fontSize: "calc(1rem * var(--arabic-font-size))" }}>
                  العربية
                </span>
              </div>
            </div>

            {/* English Font Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  English Font Size
                </label>
                <span className="text-xs text-gray-500">
                  {Math.round(englishSize * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEnglishChange(Math.max(MIN_SIZE, englishSize - 0.1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center touch-target text-lg font-bold"
                  aria-label="Decrease English font size"
                >
                  −
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
                    style={{
                      width: `${((englishSize - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100}%`,
                    }}
                  />
                </div>
                <button
                  onClick={() => handleEnglishChange(Math.min(MAX_SIZE, englishSize + 0.1))}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center touch-target text-lg font-bold"
                  aria-label="Increase English font size"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                <span style={{ fontSize: "calc(1rem * var(--english-font-size))" }}>
                  English Text
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

