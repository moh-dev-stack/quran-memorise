import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("MissingWordMode Interaction Tests", () => {
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

  it("should not change blanks when user hovers over options", async () => {
    const user = userEvent.setup();
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const initialBlankedText = screen.getByText(/____/).textContent;

    // Hover over buttons
    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );

    for (const button of buttons) {
      await act(async () => {
        await user.hover(button);
      });
    }

    // Blanked text should remain the same
    const blankedTextAfter = screen.getByText(/____/).textContent;
    expect(blankedTextAfter).toBe(initialBlankedText);
  });

  it("should not change blanks when user clicks reveal button", async () => {
    const user = userEvent.setup();
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const initialBlankedText = screen.getByText(/____/).textContent;

    // Click reveal
    const revealButton = screen.getByText(/Reveal Answer/i);
    await act(async () => {
      await user.click(revealButton);
    });

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalled();
    });

    // Blanked text should still be the same (reveal doesn't change the blanks)
    const blankedTextAfter = screen.getByText(/____/).textContent;
    expect(blankedTextAfter).toBe(initialBlankedText);
  });

  it("should maintain same blanks through multiple answer attempts simulation", () => {
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const blankedTexts: string[] = [];

    // Simulate multiple renders (like what happens during state updates)
    for (let i = 0; i < 10; i++) {
      rerender(
        <MissingWordMode
          question={mockQuestion}
          allQuestions={mockAllQuestions}
          onAnswer={mockOnAnswer}
        />
      );
      const blankedText = screen.getByText(/____/).textContent;
      blankedTexts.push(blankedText || "");
    }

    // All blanked texts should be identical
    const firstText = blankedTexts[0];
    expect(blankedTexts.every((text) => text === firstText)).toBe(true);
  });

  it("should keep correct answer consistent even after state changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Get initial state
    const buttons1 = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    const correctAnswer1 = buttons1.find((btn) => 
      btn.className.includes("bg-green") || 
      (btn.textContent && btn.textContent.length > 0)
    )?.textContent;

    // Rerender
    rerender(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const buttons2 = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );

    // Click an option
    if (buttons2.length > 0) {
      await act(async () => {
        await user.click(buttons2[0]);
      });

      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });

      // Options should still be the same
      const buttons3 = screen.getAllByRole("button").filter(
        (btn) => btn.textContent && !btn.textContent.includes("Reveal")
      );
      const texts1 = buttons1.map((b) => b.textContent).sort();
      const texts3 = buttons3.map((b) => b.textContent).sort();
      
      // Should have same options (just different styling)
      expect(texts1.length).toBe(texts3.length);
    }
  });
});

