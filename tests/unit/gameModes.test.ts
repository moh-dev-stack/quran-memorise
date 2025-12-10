import { describe, it, expect } from "vitest";
import { GAME_MODES, getGameModeById, isValidGameMode } from "@/lib/gameModes";
import type { GameMode } from "@/lib/types";

describe("gameModes", () => {
  describe("GAME_MODES", () => {
    it("should have 8 game modes", () => {
      expect(GAME_MODES).toHaveLength(8);
    });

    it("should have reading-mode as the first mode", () => {
      expect(GAME_MODES[0].id).toBe("reading-mode");
    });

    it("should have all required properties for each mode", () => {
      GAME_MODES.forEach((mode) => {
        expect(mode).toHaveProperty("id");
        expect(mode).toHaveProperty("name");
        expect(mode).toHaveProperty("description");
        expect(typeof mode.id).toBe("string");
        expect(typeof mode.name).toBe("string");
        expect(typeof mode.description).toBe("string");
      });
    });
  });

  describe("getGameModeById", () => {
    it("should return correct mode for valid id", () => {
      const mode = getGameModeById("arabic-trans-to-translation");
      expect(mode).toBeDefined();
      expect(mode?.id).toBe("arabic-trans-to-translation");
    });

    it("should return undefined for invalid id", () => {
      const mode = getGameModeById("invalid-mode" as GameMode);
      expect(mode).toBeUndefined();
    });
  });

  describe("isValidGameMode", () => {
    it("should return true for valid game modes", () => {
      expect(isValidGameMode("arabic-trans-to-translation")).toBe(true);
      expect(isValidGameMode("missing-word")).toBe(true);
      expect(isValidGameMode("sequential-order")).toBe(true);
    });

    it("should return false for invalid game modes", () => {
      expect(isValidGameMode("invalid-mode")).toBe(false);
      expect(isValidGameMode("")).toBe(false);
    });
  });
});

