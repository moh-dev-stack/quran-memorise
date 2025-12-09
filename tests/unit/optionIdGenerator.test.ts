import { describe, it, expect } from "vitest";
import {
  generateOptionId,
  generateOptionIds,
  generateArabicTransOptionId,
} from "@/lib/optionIdGenerator";

describe("optionIdGenerator", () => {
  describe("generateOptionId", () => {
    it("should generate unique IDs for different content", () => {
      const id1 = generateOptionId("hello", 0);
      const id2 = generateOptionId("world", 0);
      expect(id1).not.toBe(id2);
    });

    it("should generate same ID for same content and index", () => {
      const id1 = generateOptionId("hello", 0);
      const id2 = generateOptionId("hello", 0);
      expect(id1).toBe(id2);
    });

    it("should include prefix when provided", () => {
      const id = generateOptionId("test", 0, "prefix");
      expect(id).toContain("prefix-");
    });
  });

  describe("generateOptionIds", () => {
    it("should generate IDs for all contents", () => {
      const contents = ["a", "b", "c"];
      const ids = generateOptionIds(contents);
      expect(ids.length).toBe(3);
      expect(ids[0]).not.toBe(ids[1]);
    });
  });

  describe("generateArabicTransOptionId", () => {
    it("should generate IDs for Arabic+Transliteration pairs", () => {
      const id1 = generateArabicTransOptionId("والضحى", "Wa ad-duha", 0);
      const id2 = generateArabicTransOptionId("والضحى", "Wa ad-duha", 0);
      expect(id1).toBe(id2);
    });
  });
});

