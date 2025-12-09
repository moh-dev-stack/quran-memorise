import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransliterationToArabicMode from "@/components/game-modes/TransliterationToArabicMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("TransliterationToArabicMode", () => {
  const mockQuestion: Question = {
    verse: {
      number: 1,
      arabic: "وَالضُّحَىٰ",
      transliteration: "Wa ad-duha",
      translation: "By the morning brightness",
    },
    surahNumber: 93,
    surahName: "Ad-Duha",
  };

  const mockAllQuestions: Question[] = [
    mockQuestion,
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
  ];

  const mockOnAnswer = vi.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it("should render transliteration", () => {
    render(
      <TransliterationToArabicMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Wa ad-duha/i)).toBeInTheDocument();
  });

  it("should show Arabic options", () => {
    render(
      <TransliterationToArabicMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Choose the correct Arabic/i)).toBeInTheDocument();
  });

  it("should allow selecting an option", async () => {
    const user = userEvent.setup();
    render(
      <TransliterationToArabicMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }
  });

  it("should reset state when question changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TransliterationToArabicMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Select an option
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }

    // Change question
    const newQuestion: Question = {
      verse: {
        number: 2,
        arabic: "وَاللَّيْلِ",
        transliteration: "Wa al-layli",
        translation: "And by the night",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    };

    rerender(
      <TransliterationToArabicMode
        question={newQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // State should be reset
    const newButtons = screen.getAllByRole("button");
    const disabledButtons = newButtons.filter((btn) => btn.disabled);
    expect(disabledButtons.length).toBe(0);
  });
});

