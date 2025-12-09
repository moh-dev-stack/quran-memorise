/**
 * Normalizes Arabic text by removing diacritics (tashkeel)
 */
function normalizeArabic(text: string): string {
  // Remove Arabic diacritics (harakat)
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // Arabic diacritics
    .replace(/[\u0640]/g, "") // Tatweel (elongation)
    .trim();
}

/**
 * Normalizes transliteration text for comparison
 */
function normalizeTransliteration(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Checks if user answer matches the correct answer
 * Supports both Arabic and transliteration matching
 */
export function checkAnswer(
  userAnswer: string,
  correctArabic: string,
  correctTransliteration: string
): boolean {
  const normalizedUser = userAnswer.trim();
  if (!normalizedUser) return false;

  // Check Arabic match (with normalization)
  const normalizedArabic = normalizeArabic(correctArabic);
  const normalizedUserArabic = normalizeArabic(normalizedUser);
  if (normalizedUserArabic === normalizedArabic) {
    return true;
  }

  // Check transliteration match (case-insensitive, punctuation-insensitive)
  const normalizedTransliteration = normalizeTransliteration(correctTransliteration);
  const normalizedUserTransliteration = normalizeTransliteration(normalizedUser);
  if (normalizedUserTransliteration === normalizedTransliteration) {
    return true;
  }

  // Partial match for longer verses (at least 70% match)
  const minLength = Math.min(
    normalizedUserTransliteration.length,
    normalizedTransliteration.length
  );
  if (minLength > 0) {
    let matches = 0;
    const shorter = normalizedUserTransliteration.length < normalizedTransliteration.length
      ? normalizedUserTransliteration
      : normalizedTransliteration;
    const longer = normalizedUserTransliteration.length >= normalizedTransliteration.length
      ? normalizedUserTransliteration
      : normalizedTransliteration;

    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) {
        matches++;
      }
    }

    const similarity = matches / shorter.length;
    if (similarity >= 0.7 && shorter.length >= 5) {
      return true;
    }
  }

  return false;
}

