import { describe, it, expect } from "vitest";
import {
  getAllLearningPaths,
  getLearningPathById,
  top50Path,
  top125Path,
  top300Path,
  verbsPath,
  nounsPath,
  particlesPath,
  mixedPath,
} from "@/lib/wordLearningPaths";
import { getAllWords } from "@/lib/wordData";

describe("Word Learning Paths", () => {
  describe("getAllLearningPaths", () => {
    it("should return all available learning paths", () => {
      const paths = getAllLearningPaths();
      expect(paths.length).toBeGreaterThan(0);
      expect(paths.length).toBe(7); // top50, top125, top300, verbs, nouns, particles, mixed
    });

    it("should return paths with required properties", () => {
      const paths = getAllLearningPaths();
      paths.forEach((path) => {
        expect(path).toHaveProperty("id");
        expect(path).toHaveProperty("name");
        expect(path).toHaveProperty("description");
        expect(path).toHaveProperty("getWords");
        expect(typeof path.id).toBe("string");
        expect(typeof path.name).toBe("string");
        expect(typeof path.description).toBe("string");
        expect(typeof path.getWords).toBe("function");
      });
    });

    it("should return consistent results across multiple calls", () => {
      const paths1 = getAllLearningPaths();
      const paths2 = getAllLearningPaths();
      expect(paths1.length).toBe(paths2.length);
      expect(paths1.map((p) => p.id)).toEqual(paths2.map((p) => p.id));
    });
  });

  describe("getLearningPathById", () => {
    it("should return the correct path for a valid ID", () => {
      const path = getLearningPathById("top-50");
      expect(path).toBeDefined();
      expect(path?.id).toBe("top-50");
    });

    it("should return undefined for an invalid ID", () => {
      const path = getLearningPathById("non-existent");
      expect(path).toBeUndefined();
    });

    it("should return undefined for empty string ID", () => {
      const path = getLearningPathById("");
      expect(path).toBeUndefined();
    });
  });

  describe("top50Path", () => {
    it("should return exactly 50 words", () => {
      const words = top50Path.getWords();
      expect(words.length).toBe(50);
    });

    it("should return words sorted by frequency (descending)", () => {
      const words = top50Path.getWords();
      for (let i = 0; i < words.length - 1; i++) {
        expect(words[i].frequency).toBeGreaterThanOrEqual(words[i + 1].frequency);
      }
    });

    it("should return words with highest frequencies", () => {
      const words = top50Path.getWords();
      const allWords = getAllWords();
      const sortedAll = [...allWords].sort((a, b) => b.frequency - a.frequency);
      const top50FromAll = sortedAll.slice(0, 50);
      
      expect(words.map((w) => w.id).sort()).toEqual(top50FromAll.map((w) => w.id).sort());
    });
  });

  describe("top125Path", () => {
    it("should return exactly 125 words or all available words if less than 125", () => {
      const words = top125Path.getWords();
      const allWords = getAllWords();
      expect(words.length).toBe(Math.min(125, allWords.length));
    });

    it("should return words sorted by frequency", () => {
      const words = top125Path.getWords();
      for (let i = 0; i < words.length - 1; i++) {
        expect(words[i].frequency).toBeGreaterThanOrEqual(words[i + 1].frequency);
      }
    });
  });

  describe("top300Path", () => {
    it("should return up to 300 words", () => {
      const words = top300Path.getWords();
      expect(words.length).toBeLessThanOrEqual(300);
    });

    it("should return all words if total is less than 300", () => {
      const words = top300Path.getWords();
      const allWords = getAllWords();
      if (allWords.length < 300) {
        expect(words.length).toBe(allWords.length);
      }
    });
  });

  describe("verbsPath", () => {
    it("should return only verbs", () => {
      const words = verbsPath.getWords();
      words.forEach((word) => {
        expect(word.partOfSpeech).toBe("verb");
      });
    });

    it("should return all verbs from the dataset", () => {
      const words = verbsPath.getWords();
      const allWords = getAllWords();
      const allVerbs = allWords.filter((w) => w.partOfSpeech === "verb");
      expect(words.length).toBe(allVerbs.length);
      expect(words.map((w) => w.id).sort()).toEqual(allVerbs.map((w) => w.id).sort());
    });
  });

  describe("nounsPath", () => {
    it("should return only nouns", () => {
      const words = nounsPath.getWords();
      words.forEach((word) => {
        expect(word.partOfSpeech).toBe("noun");
      });
    });

    it("should return all nouns from the dataset", () => {
      const words = nounsPath.getWords();
      const allWords = getAllWords();
      const allNouns = allWords.filter((w) => w.partOfSpeech === "noun");
      expect(words.length).toBe(allNouns.length);
      expect(words.map((w) => w.id).sort()).toEqual(allNouns.map((w) => w.id).sort());
    });
  });

  describe("particlesPath", () => {
    it("should return only particles", () => {
      const words = particlesPath.getWords();
      words.forEach((word) => {
        expect(word.partOfSpeech).toBe("particle");
      });
    });

    it("should return all particles from the dataset", () => {
      const words = particlesPath.getWords();
      const allWords = getAllWords();
      const allParticles = allWords.filter((w) => w.partOfSpeech === "particle");
      expect(words.length).toBe(allParticles.length);
      expect(words.map((w) => w.id).sort()).toEqual(allParticles.map((w) => w.id).sort());
    });
  });

  describe("mixedPath", () => {
    it("should return all words", () => {
      const words = mixedPath.getWords();
      const allWords = getAllWords();
      expect(words.length).toBe(allWords.length);
      expect(words.map((w) => w.id).sort()).toEqual(allWords.map((w) => w.id).sort());
    });

    it("should include words from all parts of speech", () => {
      const words = mixedPath.getWords();
      const partsOfSpeech = new Set(words.map((w) => w.partOfSpeech));
      expect(partsOfSpeech.size).toBeGreaterThan(1);
    });
  });
});

