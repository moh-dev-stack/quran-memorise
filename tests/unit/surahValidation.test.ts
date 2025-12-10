import { describe, it, expect } from "vitest";
import { getAvailableSurahs, loadSurah } from "@/lib/questions";
import type { Surah } from "@/lib/types";

describe("Surah Validation", () => {
  const expectedSurahs = [
    { number: 93, name: "Ad-Duha", verses: 11 },
    { number: 94, name: "Ash-Sharh", verses: 8 },
    { number: 95, name: "At-Tin", verses: 8 },
    { number: 97, name: "Al-Qadr", verses: 5 },
    { number: 98, name: "Al-Bayyinah", verses: 8 },
    { number: 99, name: "Az-Zalzalah", verses: 8 },
    { number: 102, name: "At-Takathur", verses: 8 },
    { number: 103, name: "Al-Asr", verses: 3 },
    { number: 104, name: "Al-Humazah", verses: 9 },
    { number: 105, name: "Al-Fil", verses: 5 },
    { number: 106, name: "Quraysh", verses: 4 },
    { number: 107, name: "Al-Ma'un", verses: 7 },
    { number: 108, name: "Al-Kawthar", verses: 3 },
    { number: 109, name: "Al-Kafirun", verses: 6 },
    { number: 110, name: "An-Nasr", verses: 3 },
    { number: 111, name: "Al-Masad", verses: 5 },
    { number: 112, name: "Al-Ikhlas", verses: 4 },
    { number: 113, name: "Al-Falaq", verses: 5 },
    { number: 114, name: "An-Nas", verses: 6 },
  ];

  describe("Verse Count Validation", () => {
    expectedSurahs.forEach(({ number, name, verses }) => {
      it(`should have ${verses} verses for Surah ${number} (${name})`, () => {
        const surah = loadSurah(number);
        expect(surah).not.toBeNull();
        expect(surah?.verses.length).toBe(verses);
      });
    });
  });

  describe("Surah Structure Validation", () => {
    it("should load all expected surahs", () => {
      const surahs = getAvailableSurahs();
      expect(surahs.length).toBe(expectedSurahs.length);
    });

    expectedSurahs.forEach(({ number, name }) => {
      it(`should have correct structure for Surah ${number} (${name})`, () => {
        const surah = loadSurah(number);
        expect(surah).not.toBeNull();
        expect(surah?.number).toBe(number);
        expect(surah?.name).toBe(name);
        expect(surah?.nameArabic).toBeDefined();
        expect(surah?.nameArabic.length).toBeGreaterThan(0);
        expect(Array.isArray(surah?.verses)).toBe(true);
      });
    });
  });

  describe("Verse Structure Validation", () => {
    expectedSurahs.forEach(({ number }) => {
      it(`should have valid verse structure for Surah ${number}`, () => {
        const surah = loadSurah(number);
        expect(surah).not.toBeNull();
        
        surah?.verses.forEach((verse, index) => {
          expect(verse.number).toBe(index + 1);
          expect(verse.arabic).toBeDefined();
          expect(verse.arabic.length).toBeGreaterThan(0);
          expect(verse.transliteration).toBeDefined();
          expect(verse.transliteration.length).toBeGreaterThan(0);
          expect(verse.translation).toBeDefined();
          expect(verse.translation.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Surah Ordering", () => {
    it("should return surahs sorted by number", () => {
      const surahs = getAvailableSurahs();
      for (let i = 1; i < surahs.length; i++) {
        expect(surahs[i].number).toBeGreaterThan(surahs[i - 1].number);
      }
    });
  });
});

