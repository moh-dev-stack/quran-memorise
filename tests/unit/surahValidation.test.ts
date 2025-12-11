import { describe, it, expect } from "vitest";
import { getAvailableSurahs, loadSurah } from "@/lib/questions";
import type { Surah } from "@/lib/types";

describe("Surah Validation", () => {
  const expectedSurahs = [
    { number: 1, name: "Al-Fatihah", verses: 7 },
    { number: 36, name: "Ya-Sin", verses: 83 },
    { number: 49, name: "Al-Hujurat", verses: 18 },
    { number: 56, name: "Al-Waqi'ah", verses: 96 },
    { number: 58, name: "Al-Mujadila", verses: 22 },
    { number: 59, name: "Al-Hashr", verses: 24 },
    { number: 60, name: "Al-Mumtahanah", verses: 13 },
    { number: 61, name: "As-Saff", verses: 14 },
    { number: 62, name: "Al-Jumu'ah", verses: 11 },
    { number: 63, name: "Al-Munafiqun", verses: 11 },
    { number: 64, name: "At-Taghabun", verses: 18 },
    { number: 65, name: "At-Talaq", verses: 12 },
    { number: 66, name: "At-Tahrim", verses: 12 },
    { number: 73, name: "Al-Muzzammil", verses: 20 },
    { number: 82, name: "Al-Infitar", verses: 19 },
    { number: 84, name: "Al-Inshiqap", verses: 25 },
    { number: 85, name: "Al-Buruj", verses: 22 },
    { number: 86, name: "At-Tariq", verses: 17 },
    { number: 87, name: "Al-A'la", verses: 19 },
    { number: 90, name: "Al-Balad", verses: 20 },
    { number: 91, name: "Ash-Shams", verses: 15 },
    { number: 92, name: "Al-Layl", verses: 21 },
    { number: 93, name: "Ad-Duha", verses: 11 },
    { number: 94, name: "Ash-Sharh", verses: 8 },
    { number: 95, name: "At-Tin", verses: 8 },
    { number: 96, name: "Al-Alaq", verses: 19 },
    { number: 97, name: "Al-Qadr", verses: 5 },
    { number: 98, name: "Al-Bayyinah", verses: 8 },
    { number: 99, name: "Az-Zalzalah", verses: 8 },
    { number: 100, name: "Al-Adiyat", verses: 11 },
    { number: 101, name: "Al-Qari'ah", verses: 11 },
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

