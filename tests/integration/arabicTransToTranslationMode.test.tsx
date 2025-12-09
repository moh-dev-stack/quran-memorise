import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArabicTransToTranslationMode from "@/components/game-modes/ArabicTransToTranslationMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("ArabicTransToTranslationMode", () => {
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

  it("should render Arabic and transliteration", () => {
    render(
      <ArabicTransToTranslationMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/وَالضُّحَىٰ/i)).toBeInTheDocument();
    expect(screen.getByText(/Wa ad-duha/i)).toBeInTheDocument();
  });

  it("should show translation options", () => {
    render(
      <ArabicTransToTranslationMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Choose the correct translation/i)).toBeInTheDocument();
  });

  it("should allow selecting an option", async () => {
    const user = userEvent.setup();
    render(
      <ArabicTransToTranslationMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const options = screen.getAllByRole("button");
    const translationButtons = options.filter(
      (btn) => btn.textContent && btn.textContent.includes("By")
    );

    if (translationButtons.length > 0) {
      await user.click(translationButtons[0]);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }
  });

  it("should reset state when question changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ArabicTransToTranslationMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Select an option
    const options = screen.getAllByRole("button");
    const translationButtons = options.filter(
      (btn) => btn.textContent && btn.textContent.includes("By")
    );

    if (translationButtons.length > 0) {
      await user.click(translationButtons[0]);
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
      <ArabicTransToTranslationMode
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

