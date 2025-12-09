import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FirstLastWordMode from "@/components/game-modes/FirstLastWordMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("FirstLastWordMode", () => {
  const mockQuestion: Question = {
    verse: {
      number: 1,
      arabic: "وَالضُّحَىٰ وَاللَّيْلِ",
      transliteration: "Wa ad-duha wa al-layli",
      translation: "By the morning brightness and by the night",
    },
    surahNumber: 93,
    surahName: "Ad-Duha",
  };

  const mockAllQuestions: Question[] = [
    mockQuestion,
    {
      verse: {
        number: 2,
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

  it("should render first or last words", () => {
    render(
      <FirstLastWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(
      screen.getByText(/First Word|Last Word/i)
    ).toBeInTheDocument();
  });

  it("should show verse options", () => {
    render(
      <FirstLastWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Choose the complete verse/i)).toBeInTheDocument();
  });

  it("should allow selecting an option", async () => {
    const user = userEvent.setup();
    render(
      <FirstLastWordMode
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
      <FirstLastWordMode
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
        arabic: "مَا وَدَّعَكَ",
        transliteration: "Ma wadda'aka",
        translation: "Your Lord has not forsaken",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    };

    rerender(
      <FirstLastWordMode
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

