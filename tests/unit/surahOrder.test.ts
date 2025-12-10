import { describe, it, expect } from "vitest";
import { getAvailableSurahs } from "@/lib/questions";

describe("Surah Ordering", () => {
  it("should return surahs sorted by chapter number", () => {
    const surahs = getAvailableSurahs();
    
    expect(surahs.length).toBeGreaterThan(0);
    
    // Verify they are sorted in ascending order
    for (let i = 1; i < surahs.length; i++) {
      expect(surahs[i].number).toBeGreaterThan(surahs[i - 1].number);
    }
  });

  it("should have Al-Fatihah (1) as the first surah", () => {
    const surahs = getAvailableSurahs();
    expect(surahs[0].number).toBe(1);
    expect(surahs[0].name).toBe("Al-Fatihah");
  });

  it("should have An-Nas (114) as the last surah", () => {
    const surahs = getAvailableSurahs();
    const lastSurah = surahs[surahs.length - 1];
    expect(lastSurah.number).toBe(114);
    expect(lastSurah.name).toBe("An-Nas");
  });

  it("should maintain order even after multiple calls", () => {
    const surahs1 = getAvailableSurahs();
    const surahs2 = getAvailableSurahs();
    
    expect(surahs1.length).toBe(surahs2.length);
    surahs1.forEach((surah, index) => {
      expect(surah.number).toBe(surahs2[index].number);
    });
  });

  it("should have all surahs in correct numerical order", () => {
    const surahs = getAvailableSurahs();
    const expectedOrder = [1, 49, 58, 59, 60, 61, 62, 63, 64, 65, 66, 73, 82, 84, 85, 86, 87, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
    
    expect(surahs.length).toBe(expectedOrder.length);
    surahs.forEach((surah, index) => {
      expect(surah.number).toBe(expectedOrder[index]);
    });
  });
});

