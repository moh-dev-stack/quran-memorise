/**
 * String normalization utilities for consistent comparison
 */

/**
 * Normalize whitespace in a string
 */
export function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Remove punctuation from a string
 */
export function removePunctuation(text: string): string {
  return text.replace(/[^\w\s\u0600-\u06FF]/g, "");
}

/**
 * Normalize Arabic text for comparison
 * Removes diacritics and normalizes whitespace
 */
export function normalizeArabic(text: string): string {
  // Remove Arabic diacritics (harakat)
  const withoutDiacritics = text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Arabic diacritics
    .replace(/[\u0640]/g, "") // Tatweel (elongation)
    .trim();

  return normalizeWhitespace(withoutDiacritics);
}

/**
 * Normalize transliteration for comparison
 */
export function normalizeTransliteration(text: string): string {
  return normalizeWhitespace(
    removePunctuation(text.toLowerCase())
  );
}

/**
 * Normalize translation for comparison
 */
export function normalizeTranslation(text: string): string {
  return normalizeWhitespace(
    removePunctuation(text.toLowerCase())
  );
}

/**
 * Compare two strings with normalization
 */
export function compareNormalized(
  str1: string,
  str2: string,
  type: "arabic" | "transliteration" | "translation"
): boolean {
  let normalized1: string;
  let normalized2: string;

  switch (type) {
    case "arabic":
      normalized1 = normalizeArabic(str1);
      normalized2 = normalizeArabic(str2);
      break;
    case "transliteration":
      normalized1 = normalizeTransliteration(str1);
      normalized2 = normalizeTransliteration(str2);
      break;
    case "translation":
      normalized1 = normalizeTranslation(str1);
      normalized2 = normalizeTranslation(str2);
      break;
  }

  return normalized1 === normalized2;
}

/**
 * Check if string is empty or null
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

