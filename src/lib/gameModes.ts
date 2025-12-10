import type { GameMode, GameModeOption, Verse, Question } from "./types";

export const GAME_MODES: GameModeOption[] = [
  {
    id: "arabic-trans-to-translation",
    name: "Arabic + Transliteration → Translation",
    description: "See Arabic and transliteration, choose the correct translation",
  },
  {
    id: "translation-to-arabic-trans",
    name: "Translation → Arabic + Transliteration",
    description: "See translation, choose the correct Arabic and transliteration",
  },
  {
    id: "missing-word",
    name: "Missing Word",
    description: "Fill in the missing word(s) from multiple choice options",
  },
  {
    id: "sequential-order",
    name: "Sequential Order",
    description: "See a verse, identify which verse comes before it",
  },
  {
    id: "first-last-word",
    name: "First/Last Word",
    description: "See first or last words, choose the complete verse",
  },
  {
    id: "verse-number",
    name: "Verse Number",
    description: "See a verse, identify its verse number",
  },
  {
    id: "word-order",
    name: "Word Order",
    description: "Arrange Arabic words in the correct order to form the verse",
  },
];

export function getGameModeById(id: GameMode): GameModeOption | undefined {
  return GAME_MODES.find((mode) => mode.id === id);
}

export function isValidGameMode(mode: string): mode is GameMode {
  return GAME_MODES.some((m) => m.id === mode);
}

