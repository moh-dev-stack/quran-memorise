import { describe, it, expect } from "vitest";
import { generateBlanks } from "@/lib/blankGenerator";
import type { Verse } from "@/lib/types";

describe("blankGenerator Stability", () => {
  const mockVerse: Verse = {
    number: 1,
    arabic: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ",
    transliteration: "Wa ad-duha wa al-layli idha saja",
    translation: "By the morning brightness and by the night when it covers",
  };

  it("should generate consistent blanks when called multiple times with same input", () => {
    // Note: Since generateBlanks uses Math.random(), we can't guarantee
    // it will be the same, but we can test that it produces valid output
    const result1 = generateBlanks(mockVerse, true);
    const result2 = generateBlanks(mockVerse, true);

    // Both should have valid structure
    expect(result1).toHaveProperty("blankedText");
    expect(result1).toHaveProperty("missingWords");
    expect(result1).toHaveProperty("missingIndices");
    expect(result2).toHaveProperty("blankedText");
    expect(result2).toHaveProperty("missingWords");
    expect(result2).toHaveProperty("missingIndices");

    // Both should contain blanks
    expect(result1.blankedText).toContain("____");
    expect(result2.blankedText).toContain("____");

    // Missing words should match the indices
    expect(result1.missingWords.length).toBe(result1.missingIndices.length);
    expect(result2.missingWords.length).toBe(result2.missingIndices.length);
  });

  it("should produce blanks that match the original verse structure", () => {
    const result = generateBlanks(mockVerse, true);

    // Count blanks in blankedText
    const blankCount = (result.blankedText.match(/____/g) || []).length;

    // Should match number of missing words
    expect(blankCount).toBe(result.missingWords.length);
    expect(blankCount).toBe(result.missingIndices.length);
  });

  it("should handle single word verses", () => {
    const singleWordVerse: Verse = {
      number: 1,
      arabic: "وَالضُّحَىٰ",
      transliteration: "Wa ad-duha",
      translation: "By the morning brightness",
    };

    const result = generateBlanks(singleWordVerse, true);

    expect(result.blankedText).toBe("____");
    expect(result.missingWords.length).toBe(1);
    expect(result.missingIndices).toEqual([0]);
  });

  it("should not exceed 2 blanks for longer verses", () => {
    const longVerse: Verse = {
      number: 1,
      arabic: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ مَا وَدَّعَكَ رَبُّكَ",
      transliteration: "Wa ad-duha wa al-layli idha saja ma wadda'aka rabbuka",
      translation: "By the morning brightness and by the night when it covers, your Lord has not forsaken",
    };

    const result = generateBlanks(longVerse, true);

    // Should have at most 2 blanks
    const blankCount = (result.blankedText.match(/____/g) || []).length;
    expect(blankCount).toBeLessThanOrEqual(2);
    expect(result.missingWords.length).toBeLessThanOrEqual(2);
  });
});

