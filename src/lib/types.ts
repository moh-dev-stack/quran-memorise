export interface Verse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  verses: Verse[];
}

export interface Question {
  verse: Verse;
  surahNumber: number;
  surahName: string;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  totalAnswered: number;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
}

export interface ReviewItem {
  verse: Verse;
  surahNumber: number;
  surahName: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

export type GameMode =
  | "continuous-reading-mode"
  | "arabic-trans-to-translation"
  | "translation-to-arabic-trans"
  | "missing-word"
  | "sequential-order"
  | "first-last-word"
  | "verse-number"
  | "word-order"
  | "reading-mode";

export interface GameModeOption {
  id: GameMode;
  name: string;
  description: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  isCorrect: boolean;
}

export interface MissingWordQuestion {
  verse: Verse;
  blankedText: string;
  missingWords: string[];
  options: MultipleChoiceOption[];
}

export interface SequentialOrderQuestion {
  verses: Verse[];
  correctOrder: number[];
  options: Array<{
    id: string;
    order: number[];
    display: string;
  }>;
}

