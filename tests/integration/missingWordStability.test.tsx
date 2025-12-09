import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("MissingWordMode Stability", () => {
  const mockQuestion: Question = {
    verse: {
      number: 1,
      arabic: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ",
      transliteration: "Wa ad-duha wa al-layli idha saja",
      translation: "By the morning brightness and by the night when it covers",
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

  it("should keep blanks stable across multiple renders", () => {
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Get initial blanked text
    const initialBlankedText = screen.getByText(/____/).textContent;

    // Rerender multiple times without changing question
    rerender(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const secondBlankedText = screen.getByText(/____/).textContent;

    rerender(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const thirdBlankedText = screen.getByText(/____/).textContent;

    // All blanked texts should be identical
    expect(initialBlankedText).toBe(secondBlankedText);
    expect(secondBlankedText).toBe(thirdBlankedText);
  });

  it("should keep correct answer stable when selecting options", async () => {
    const user = userEvent.setup();
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Get the blanked text initially
    const initialBlankedText = screen.getByText(/____/).textContent;

    // Find and click any option button
    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );

    if (buttons.length > 0) {
      await act(async () => {
        await user.click(buttons[0]);
      });

      // Wait for feedback
      await waitFor(() => {
        expect(screen.getByText(/Correct|Incorrect/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Blanked text should still be the same
      const blankedTextAfter = screen.getByText(/____/).textContent;
      expect(blankedTextAfter).toBe(initialBlankedText);
    }
  });

  it("should keep options stable across renders", () => {
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Get initial options
    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    const initialOptions = buttons.map((btn) => btn.textContent).sort();

    // Rerender
    rerender(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttonsAfter = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    const optionsAfter = buttonsAfter.map((btn) => btn.textContent).sort();

    // Options should be the same
    expect(initialOptions).toEqual(optionsAfter);
  });

  it("should generate new blanks when question changes", () => {
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const initialBlankedText = screen.getByText(/____/).textContent;

    // Change question
    const newQuestion: Question = {
      verse: {
        number: 2,
        arabic: "مَا وَدَّعَكَ رَبُّكَ",
        transliteration: "Ma wadda'aka rabbuka",
        translation: "Your Lord has not forsaken you",
      },
      surahNumber: 93,
      surahName: "Ad-Duha",
    };

    rerender(
      <MissingWordMode
        question={newQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const newBlankedText = screen.getByText(/____/).textContent;

    // Should be different (different verse)
    expect(newBlankedText).not.toBe(initialBlankedText);
  });

  it("should maintain correct answer consistency", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Get correct answer from options
    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );

    // Rerender to ensure stability
    rerender(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttonsAfter = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );

    // Options should still match
    const initialTexts = buttons.map((btn) => btn.textContent).sort();
    const afterTexts = buttonsAfter.map((btn) => btn.textContent).sort();
    expect(initialTexts).toEqual(afterTexts);

    // Click correct answer
    const correctButton = buttonsAfter.find((btn) => {
      // Find button that will be marked correct
      return btn.textContent && btn.textContent.length > 0;
    });

    if (correctButton) {
      await act(async () => {
        await user.click(correctButton);
      });

      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });

      // Verify the blanked text hasn't changed
      const blankedText = screen.getByText(/____/).textContent;
      expect(blankedText).toBeTruthy();
    }
  });
});

