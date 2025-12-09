import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerseNumberMode from "@/components/game-modes/VerseNumberMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("VerseNumberMode", () => {
  const mockQuestions: Question[] = [
    {
      verse: {
        number: 1,
        arabic: "وَالضُّحَىٰ",
        transliteration: "Wa ad-duha",
        translation: "By the morning brightness",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 2,
        arabic: "وَاللَّيْلِ",
        transliteration: "Wa al-layli",
        translation: "And by the night",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 3,
        arabic: "مَا وَدَّعَكَ",
        transliteration: "Ma wadda'aka",
        translation: "Your Lord has not forsaken",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 4,
        arabic: "وَمَا قَلَىٰ",
        transliteration: "Wa ma qala",
        translation: "Nor has He become displeased",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
    {
      verse: {
        number: 5,
        arabic: "وَلَلْآخِرَةُ",
        transliteration: "Wa la al-akhiratu",
        translation: "And the Hereafter",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    },
  ];

  const mockOnAnswer = vi.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it("should render verse and ask for verse number", () => {
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/What is the verse number/i)).toBeInTheDocument();
    expect(screen.getByText(/مَا وَدَّعَكَ/i)).toBeInTheDocument();
    expect(screen.getByText(/Ma wadda'aka/i)).toBeInTheDocument();
  });

  it("should show verse number options", () => {
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Choose the verse number/i)).toBeInTheDocument();
    // Should have multiple verse number options
    const verseButtons = screen.getAllByText(/Verse \d+/);
    expect(verseButtons.length).toBeGreaterThan(1);
  });

  it("should include correct verse number in options", () => {
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 3/)).toBeInTheDocument();
  });

  it("should call onAnswer when option is selected", async () => {
    const user = userEvent.setup();
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons = screen.getAllByRole("button");
    const verseButton = buttons.find((btn) => btn.textContent?.includes("Verse"));
    
    if (verseButton) {
      await user.click(verseButton);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }
  });

  it("should show feedback after answering", async () => {
    const user = userEvent.setup();
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons = screen.getAllByRole("button");
    const verseButton = buttons.find((btn) => btn.textContent?.includes("Verse"));
    
    if (verseButton) {
      await user.click(verseButton);
      await waitFor(() => {
        expect(screen.getByText(/Correct|Incorrect/i)).toBeInTheDocument();
      });
    }
  });

  it("should disable buttons after answering", async () => {
    const user = userEvent.setup();
    render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons = screen.getAllByRole("button");
    const verseButton = buttons.find((btn) => btn.textContent?.includes("Verse"));
    
    if (verseButton) {
      await user.click(verseButton);
      await waitFor(() => {
        const allButtons = screen.getAllByRole("button");
        const disabledButtons = allButtons.filter((btn) => btn.disabled);
        expect(disabledButtons.length).toBeGreaterThan(0);
      });
    }
  });

  it("should reset state when question changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <VerseNumberMode
        question={mockQuestions[2]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons = screen.getAllByRole("button");
    const verseButton = buttons.find((btn) => btn.textContent?.includes("Verse"));
    
    if (verseButton) {
      await user.click(verseButton);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }

    // Change question
    rerender(
      <VerseNumberMode
        question={mockQuestions[3]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // State should be reset
    const newButtons = screen.getAllByRole("button");
    const disabledButtons = newButtons.filter((btn) => btn.disabled);
    expect(disabledButtons.length).toBe(0);
  });

  it("should handle first verse correctly", () => {
    render(
      <VerseNumberMode
        question={mockQuestions[0]}
        allQuestions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1/)).toBeInTheDocument();
  });
});
