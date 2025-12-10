import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";
import { getAvailableSurahs } from "@/lib/questions";
import { fastWaitFor, fastGetByText } from "../testUtils";

// Mock next/navigation
const mockPush = vi.fn();
const mockGet = vi.fn();
const mockRouter = {
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("All Surahs Display in UI", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue(null);
  });

  it("should display all available surahs in the surah selector", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const allSurahs = getAvailableSurahs();
    
    // Verify all surahs are displayed
    for (const surah of allSurahs) {
      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(`Surah ${surah.name}`, "i"))).toBeInTheDocument();
      });
    }
  });

  it("should display correct verse counts for all surahs", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const allSurahs = getAvailableSurahs();
    
    // Verify verse counts are displayed correctly
    for (const surah of allSurahs) {
      await fastWaitFor(() => {
        const surahElement = fastGetByText(new RegExp(`Surah ${surah.name}`, "i"));
        expect(surahElement).toBeInTheDocument();
        
        // Check that verse count is displayed
        const parent = surahElement.closest("button");
        expect(parent).toBeInTheDocument();
        expect(parent?.textContent).toContain(`${surah.verses.length} verses`);
      });
    }
  });

  it("should display Arabic names for all surahs", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const allSurahs = getAvailableSurahs();
    
    // Verify Arabic names are displayed
    for (const surah of allSurahs) {
      await fastWaitFor(() => {
        const surahElement = fastGetByText(new RegExp(`Surah ${surah.name}`, "i"));
        const parent = surahElement.closest("button");
        expect(parent?.textContent).toContain(surah.nameArabic);
      });
    }
  });

  it("should include all new surahs with 11 verses", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const surahsWith11Verses = [
      { number: 62, name: "Al-Jumu'ah" },
      { number: 63, name: "Al-Munafiqun" },
      { number: 93, name: "Ad-Duha" },
      { number: 100, name: "Al-Adiyat" },
      { number: 101, name: "Al-Qari'ah" },
    ];

    for (const surah of surahsWith11Verses) {
      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(`Surah ${surah.name}`, "i"))).toBeInTheDocument();
      });
    }
  });

  it("should include all new surahs with 12 verses", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const surahsWith12Verses = [
      { number: 65, name: "At-Talaq" },
      { number: 66, name: "At-Tahrim" },
    ];

    for (const surah of surahsWith12Verses) {
      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(`Surah ${surah.name}`, "i"))).toBeInTheDocument();
      });
    }
  });

  it("should allow selecting each surah", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    const allSurahs = getAvailableSurahs();
    
    // Test selecting a few surahs
    const testSurahs = [
      { number: 62, name: "Al-Jumu'ah" },
      { number: 65, name: "At-Talaq" },
      { number: 100, name: "Al-Adiyat" },
    ];

    for (const surah of testSurahs) {
      // Go back to surah selection if needed
      await fastWaitFor(() => {
        const surahButton = screen.queryByText(new RegExp(`Surah ${surah.name}`, "i"));
        if (!surahButton) {
          // If we're not on surah selection, go back
          const backButton = screen.queryByText(/Back to Surah Selection/i);
          if (backButton) {
            user.click(backButton);
          }
        }
      });

      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(`Surah ${surah.name}`, "i"))).toBeInTheDocument();
      });

      const surahButton = fastGetByText(new RegExp(`Surah ${surah.name}`, "i")).closest("button");
      expect(surahButton).toBeInTheDocument();
      await user.click(surahButton!);

      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(surah.name, "i"))).toBeInTheDocument();
        expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
      });
    }
  });

  it("should have correct total count of surahs", async () => {
    const allSurahs = getAvailableSurahs();
    
    // Should have 25 surahs total (6 new + 19 existing)
    expect(allSurahs.length).toBe(25);
    
    // Verify specific surahs are included
    const surahNumbers = allSurahs.map(s => s.number);
    expect(surahNumbers).toContain(62);
    expect(surahNumbers).toContain(63);
    expect(surahNumbers).toContain(65);
    expect(surahNumbers).toContain(66);
    expect(surahNumbers).toContain(100);
    expect(surahNumbers).toContain(101);
    expect(surahNumbers).toContain(93);
  });
});
