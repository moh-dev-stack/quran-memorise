import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SequentialOrderMode from "@/components/game-modes/SequentialOrderMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("SequentialOrderMode", () => {
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
  ];

  const mockOnAnswer = vi.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it("should render verses to order", () => {
    render(
      <SequentialOrderMode
        questions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verses to Order/i)).toBeInTheDocument();
    expect(screen.getByText(/وَالضُّحَىٰ/i)).toBeInTheDocument();
  });

  it("should show order options", () => {
    render(
      <SequentialOrderMode
        questions={mockQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Choose the correct order/i)).toBeInTheDocument();
  });

  it("should allow selecting an order", async () => {
    const user = userEvent.setup();
    render(
      <SequentialOrderMode
        questions={mockQuestions}
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

  it("should reset state when questions change", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <SequentialOrderMode
        questions={mockQuestions}
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

    // Change questions
    const newQuestions = mockQuestions.slice(1);
    rerender(
      <SequentialOrderMode
        questions={newQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // State should be reset
    const newButtons = screen.getAllByRole("button");
    const disabledButtons = newButtons.filter((btn) => btn.disabled);
    expect(disabledButtons.length).toBe(0);
  });
});

