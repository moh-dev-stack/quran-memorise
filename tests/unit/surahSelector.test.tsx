import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SurahSelector from "@/components/SurahSelector";
import { getAvailableSurahs } from "@/lib/questions";
import type { Surah } from "@/lib/types";

// Mock the onSelectSurah and onBack functions
const mockOnSelectSurah = vi.fn();
const mockOnBack = vi.fn();

describe("SurahSelector Component", () => {
  it("should display surah number prefix in format 'N. Surah Name'", () => {
    const surahs = getAvailableSurahs();
    const adDuha = surahs.find(s => s.number === 93);
    
    expect(adDuha).toBeDefined();
    
    render(
      <SurahSelector
        surahs={[adDuha!]}
        onSelectSurah={mockOnSelectSurah}
        onBack={mockOnBack}
      />
    );

    // Should display as "93. Surah Ad-Duha"
    expect(screen.getByText(/93\. Surah Ad-Duha/i)).toBeInTheDocument();
  });

  it("should display all surahs with number prefix", () => {
    const surahs = getAvailableSurahs();
    
    render(
      <SurahSelector
        surahs={surahs}
        onSelectSurah={mockOnSelectSurah}
        onBack={mockOnBack}
      />
    );

    // Check that each surah displays with its number prefix
    surahs.forEach((surah) => {
      const regex = new RegExp(`${surah.number}\\. Surah ${surah.name}`, "i");
      expect(screen.getByText(regex)).toBeInTheDocument();
    });
  });

  it("should display Arabic name and verse count", () => {
    const surahs = getAvailableSurahs();
    const adDuha = surahs.find(s => s.number === 93);
    
    render(
      <SurahSelector
        surahs={[adDuha!]}
        onSelectSurah={mockOnSelectSurah}
        onBack={mockOnBack}
      />
    );

    // Should show Arabic name and verse count
    expect(screen.getByText(new RegExp(adDuha!.nameArabic))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${adDuha!.verses.length} verses`))).toBeInTheDocument();
  });
});

