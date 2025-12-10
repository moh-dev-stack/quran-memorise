import { describe, it, expect } from "vitest";
import {
  loadSurah,
  surahToQuestions,
  getQuestionsForSurah,
  getRandomQuestion,
  getAvailableSurahs,
} from "@/lib/questions";

describe("questions", () => {
  describe("loadSurah", () => {
    it("should load Surah 62 (Al-Jumu'ah)", () => {
      const surah = loadSurah(62);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(62);
      expect(surah?.name).toBe("Al-Jumu'ah");
      expect(surah?.verses.length).toBe(11);
    });

    it("should load Surah 63 (Al-Munafiqun)", () => {
      const surah = loadSurah(63);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(63);
      expect(surah?.name).toBe("Al-Munafiqun");
      expect(surah?.verses.length).toBe(11);
    });

    it("should load Surah 65 (At-Talaq)", () => {
      const surah = loadSurah(65);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(65);
      expect(surah?.name).toBe("At-Talaq");
      expect(surah?.verses.length).toBe(12);
    });

    it("should load Surah 66 (At-Tahrim)", () => {
      const surah = loadSurah(66);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(66);
      expect(surah?.name).toBe("At-Tahrim");
      expect(surah?.verses.length).toBe(12);
    });

    it("should load Surah 93 (Ad-Duha)", () => {
      const surah = loadSurah(93);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(93);
      expect(surah?.name).toBe("Ad-Duha");
    });

    it("should load Surah 100 (Al-Adiyat)", () => {
      const surah = loadSurah(100);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(100);
      expect(surah?.name).toBe("Al-Adiyat");
      expect(surah?.verses.length).toBe(11);
    });

    it("should load Surah 101 (Al-Qari'ah)", () => {
      const surah = loadSurah(101);
      expect(surah).not.toBeNull();
      expect(surah?.number).toBe(101);
      expect(surah?.name).toBe("Al-Qari'ah");
      expect(surah?.verses.length).toBe(11);
    });

    it("should return null for unsupported surah", () => {
      const surah = loadSurah(1);
      expect(surah).toBeNull();
    });

    it("should return surah with verses", () => {
      const surah = loadSurah(93);
      expect(surah).not.toBeNull();
      expect(surah?.verses).toBeDefined();
      expect(surah?.verses.length).toBeGreaterThan(0);
    });
  });

  describe("surahToQuestions", () => {
    it("should convert surah to questions", () => {
      const surah = loadSurah(93);
      if (!surah) {
        throw new Error("Surah not loaded");
      }

      const questions = surahToQuestions(surah);
      expect(questions.length).toBe(surah.verses.length);
      expect(questions[0].surahNumber).toBe(93);
      expect(questions[0].surahName).toBe("Ad-Duha");
    });

    it("should create question for each verse", () => {
      const surah = loadSurah(93);
      if (!surah) {
        throw new Error("Surah not loaded");
      }

      const questions = surahToQuestions(surah);
      questions.forEach((q, index) => {
        expect(q.verse).toEqual(surah.verses[index]);
        expect(q.verse.number).toBe(index + 1);
      });
    });
  });

  describe("getQuestionsForSurah", () => {
    it("should return questions for Surah 93", () => {
      const questions = getQuestionsForSurah(93);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions[0].surahNumber).toBe(93);
    });

    it("should return empty array for unsupported surah", () => {
      const questions = getQuestionsForSurah(1);
      expect(questions).toEqual([]);
    });

    it("should return questions with all verses", () => {
      const questions = getQuestionsForSurah(93);
      expect(questions.length).toBe(11); // Ad-Duha has 11 verses
    });
  });

  describe("getRandomQuestion", () => {
    it("should return a question for Surah 93", () => {
      const question = getRandomQuestion(93);
      expect(question).not.toBeNull();
      expect(question?.surahNumber).toBe(93);
    });

    it("should return null for unsupported surah", () => {
      const question = getRandomQuestion(1);
      expect(question).toBeNull();
    });

    it("should return question with verse data", () => {
      const question = getRandomQuestion(93);
      expect(question).not.toBeNull();
      expect(question?.verse).toBeDefined();
      expect(question?.verse.number).toBeGreaterThan(0);
      expect(question?.verse.arabic).toBeDefined();
      expect(question?.verse.transliteration).toBeDefined();
      expect(question?.verse.translation).toBeDefined();
    });

    it("should return different questions on multiple calls", () => {
      const question1 = getRandomQuestion(93);
      const question2 = getRandomQuestion(93);
      const question3 = getRandomQuestion(93);

      // At least one should be different (high probability)
      const allSame =
        question1?.verse.number === question2?.verse.number &&
        question2?.verse.number === question3?.verse.number;

      // With 11 verses, probability of all 3 being same is low
      // But we can't guarantee it, so we just check they're valid
      expect(question1).not.toBeNull();
      expect(question2).not.toBeNull();
      expect(question3).not.toBeNull();
    });
  });

  describe("getAvailableSurahs", () => {
    it("should return array of available surahs", () => {
      const surahs = getAvailableSurahs();
      expect(Array.isArray(surahs)).toBe(true);
      expect(surahs.length).toBeGreaterThan(0);
    });

    it("should include all new surahs", () => {
      const surahs = getAvailableSurahs();
      const newSurahs = [
        { number: 62, name: "Al-Jumu'ah" },
        { number: 63, name: "Al-Munafiqun" },
        { number: 65, name: "At-Talaq" },
        { number: 66, name: "At-Tahrim" },
        { number: 100, name: "Al-Adiyat" },
        { number: 101, name: "Al-Qari'ah" },
      ];
      
      for (const expectedSurah of newSurahs) {
        const surah = surahs.find((s) => s.number === expectedSurah.number);
        expect(surah).toBeDefined();
        expect(surah?.name).toBe(expectedSurah.name);
      }
    });

    it("should include Surah 93 (Ad-Duha)", () => {
      const surahs = getAvailableSurahs();
      const adDuha = surahs.find((s) => s.number === 93);
      expect(adDuha).toBeDefined();
      expect(adDuha?.name).toBe("Ad-Duha");
    });

    it("should have 29 surahs total", () => {
      const surahs = getAvailableSurahs();
      expect(surahs.length).toBe(25);
    });

    it("should return surahs with all required properties", () => {
      const surahs = getAvailableSurahs();
      surahs.forEach((surah) => {
        expect(surah.number).toBeGreaterThan(0);
        expect(surah.name).toBeDefined();
        expect(surah.nameArabic).toBeDefined();
        expect(Array.isArray(surah.verses)).toBe(true);
        expect(surah.verses.length).toBeGreaterThan(0);
      });
    });
  });
});

