/**
 * Extract words from Arabic text
 */
export function extractArabicWords(text: string): string[] {
  // Split by spaces and filter out empty strings
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/**
 * Extract words from transliteration text
 */
export function extractTransliterationWords(text: string): string[] {
  // Split by spaces, remove punctuation, filter empty
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^\w\s]/g, ""))
    .filter((word) => word.length > 0);
}

/**
 * Extract words from translation text
 */
export function extractTranslationWords(text: string): string[] {
  // Split by spaces, remove punctuation, filter empty
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[^\w\s]/g, "").toLowerCase())
    .filter((word) => word.length > 0);
}

/**
 * Get word count for a text
 */
export function getWordCount(text: string, type: "arabic" | "transliteration" | "translation"): number {
  switch (type) {
    case "arabic":
      return extractArabicWords(text).length;
    case "transliteration":
      return extractTransliterationWords(text).length;
    case "translation":
      return extractTranslationWords(text).length;
  }
}

