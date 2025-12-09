import type { Verse, Question } from "./types";
import { compareNormalized, isEmpty } from "./stringNormalizer";

/**
 * Generate distractors for multiple choice questions
 */
export function generateDistractors(
  correctVerse: Verse,
  allQuestions: Question[],
  count: number = 3
): Verse[] {
  if (!allQuestions || allQuestions.length === 0) {
    return [];
  }

  // Filter out the correct verse
  const otherVerses = allQuestions
    .filter((q) => q.verse.number !== correctVerse.number)
    .map((q) => q.verse);

  if (otherVerses.length === 0) {
    return [];
  }

  // Shuffle and take count (or all available if less than count)
  const shuffled = [...otherVerses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, otherVerses.length));
}

/**
 * Generate options for Arabic + Transliteration → Translation mode
 */
export function generateTranslationOptions(
  correctVerse: Verse,
  allQuestions: Question[]
): Array<{ text: string; isCorrect: boolean; id: string }> {
  if (isEmpty(correctVerse.translation)) {
    return [];
  }

  const distractors = generateDistractors(correctVerse, allQuestions, 3);
  const seenTranslations = new Set<string>();
  
  const options: Array<{ text: string; isCorrect: boolean; id: string }> = [
    { 
      text: correctVerse.translation, 
      isCorrect: true,
      id: `correct-${correctVerse.number}`
    },
  ];
  seenTranslations.add(correctVerse.translation.toLowerCase().trim());

  // Add unique distractors
  for (const distractor of distractors) {
    if (isEmpty(distractor.translation)) continue;
    
    const normalized = distractor.translation.toLowerCase().trim();
    if (!seenTranslations.has(normalized)) {
      options.push({
        text: distractor.translation,
        isCorrect: false,
        id: `distractor-${distractor.number}-${options.length}`,
      });
      seenTranslations.add(normalized);
    }
  }

  // If we don't have enough options, try to add more (but avoid duplicates)
  let attempts = 0;
  while (options.length < 4 && attempts < 10 && distractors.length > 0) {
    const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (randomDistractor && !isEmpty(randomDistractor.translation)) {
      const normalized = randomDistractor.translation.toLowerCase().trim();
      if (!seenTranslations.has(normalized)) {
        options.push({
          text: randomDistractor.translation,
          isCorrect: false,
          id: `distractor-${randomDistractor.number}-${options.length}`,
        });
        seenTranslations.add(normalized);
      }
    }
    attempts++;
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generate options for Translation → Arabic + Transliteration mode
 */
export function generateArabicTransOptions(
  correctVerse: Verse,
  allQuestions: Question[]
): Array<{ arabic: string; transliteration: string; isCorrect: boolean; id: string }> {
  if (isEmpty(correctVerse.arabic) || isEmpty(correctVerse.transliteration)) {
    return [];
  }

  const distractors = generateDistractors(correctVerse, allQuestions, 3);
  const seenPairs = new Set<string>();
  
  const options: Array<{ arabic: string; transliteration: string; isCorrect: boolean; id: string }> = [
    {
      arabic: correctVerse.arabic,
      transliteration: correctVerse.transliteration,
      isCorrect: true,
      id: `correct-${correctVerse.number}`,
    },
  ];
  seenPairs.add(`${correctVerse.arabic}::${correctVerse.transliteration}`);

  // Add unique distractors
  for (const distractor of distractors) {
    if (isEmpty(distractor.arabic) || isEmpty(distractor.transliteration)) continue;
    
    const pairKey = `${distractor.arabic}::${distractor.transliteration}`;
    if (!seenPairs.has(pairKey)) {
      options.push({
        arabic: distractor.arabic,
        transliteration: distractor.transliteration,
        isCorrect: false,
        id: `distractor-${distractor.number}-${options.length}`,
      });
      seenPairs.add(pairKey);
    }
  }

  // If we don't have enough options, try to add more
  let attempts = 0;
  while (options.length < 4 && attempts < 10 && distractors.length > 0) {
    const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (randomDistractor && !isEmpty(randomDistractor.arabic) && !isEmpty(randomDistractor.transliteration)) {
      const pairKey = `${randomDistractor.arabic}::${randomDistractor.transliteration}`;
      if (!seenPairs.has(pairKey)) {
        options.push({
          arabic: randomDistractor.arabic,
          transliteration: randomDistractor.transliteration,
          isCorrect: false,
          id: `distractor-${randomDistractor.number}-${options.length}`,
        });
        seenPairs.add(pairKey);
      }
    }
    attempts++;
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generate options for Arabic → Transliteration mode
 */
export function generateTransliterationOptions(
  correctVerse: Verse,
  allQuestions: Question[]
): Array<{ text: string; isCorrect: boolean; id: string }> {
  if (isEmpty(correctVerse.transliteration)) {
    return [];
  }

  const distractors = generateDistractors(correctVerse, allQuestions, 3);
  const seenTransliterations = new Set<string>();
  
  const options: Array<{ text: string; isCorrect: boolean; id: string }> = [
    {
      text: correctVerse.transliteration,
      isCorrect: true,
      id: `correct-${correctVerse.number}`,
    },
  ];
  seenTransliterations.add(correctVerse.transliteration.toLowerCase().trim());

  // Add unique distractors
  for (const distractor of distractors) {
    if (isEmpty(distractor.transliteration)) continue;
    
    const normalized = distractor.transliteration.toLowerCase().trim();
    if (!seenTransliterations.has(normalized)) {
      options.push({
        text: distractor.transliteration,
        isCorrect: false,
        id: `distractor-${distractor.number}-${options.length}`,
      });
      seenTransliterations.add(normalized);
    }
  }

  // If we don't have enough options, try to add more
  let attempts = 0;
  while (options.length < 4 && attempts < 10 && distractors.length > 0) {
    const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (randomDistractor && !isEmpty(randomDistractor.transliteration)) {
      const normalized = randomDistractor.transliteration.toLowerCase().trim();
      if (!seenTransliterations.has(normalized)) {
        options.push({
          text: randomDistractor.transliteration,
          isCorrect: false,
          id: `distractor-${randomDistractor.number}-${options.length}`,
        });
        seenTransliterations.add(normalized);
      }
    }
    attempts++;
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

/**
 * Generate options for Transliteration → Arabic mode
 */
export function generateArabicOptions(
  correctVerse: Verse,
  allQuestions: Question[]
): Array<{ text: string; isCorrect: boolean; id: string }> {
  if (isEmpty(correctVerse.arabic)) {
    return [];
  }

  const distractors = generateDistractors(correctVerse, allQuestions, 3);
  const seenArabic = new Set<string>();
  
  const options: Array<{ text: string; isCorrect: boolean; id: string }> = [
    {
      text: correctVerse.arabic,
      isCorrect: true,
      id: `correct-${correctVerse.number}`,
    },
  ];
  // Use normalized Arabic for duplicate detection
  const normalizedCorrect = correctVerse.arabic.replace(/[\u064B-\u065F\u0670\u0640]/g, "").trim();
  seenArabic.add(normalizedCorrect);

  // Add unique distractors
  for (const distractor of distractors) {
    if (isEmpty(distractor.arabic)) continue;
    
    const normalized = distractor.arabic.replace(/[\u064B-\u065F\u0670\u0640]/g, "").trim();
    if (!seenArabic.has(normalized)) {
      options.push({
        text: distractor.arabic,
        isCorrect: false,
        id: `distractor-${distractor.number}-${options.length}`,
      });
      seenArabic.add(normalized);
    }
  }

  // If we don't have enough options, try to add more
  let attempts = 0;
  while (options.length < 4 && attempts < 10 && distractors.length > 0) {
    const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (randomDistractor && !isEmpty(randomDistractor.arabic)) {
      const normalized = randomDistractor.arabic.replace(/[\u064B-\u065F\u0670\u0640]/g, "").trim();
      if (!seenArabic.has(normalized)) {
        options.push({
          text: randomDistractor.arabic,
          isCorrect: false,
          id: `distractor-${randomDistractor.number}-${options.length}`,
        });
        seenArabic.add(normalized);
      }
    }
    attempts++;
  }

  // Shuffle options
  return options.sort(() => Math.random() - 0.5);
}

