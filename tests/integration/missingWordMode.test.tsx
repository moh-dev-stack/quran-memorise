import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import type { Question } from "@/lib/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("MissingWordMode", () => {
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

  it("should render missing word mode", () => {
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1/i)).toBeInTheDocument();
  });

  it("should show blanked text", () => {
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/____/)).toBeInTheDocument();
  });

  it("should allow selecting an option", async () => {
    const user = userEvent.setup();
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const options = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    
    if (options.length > 0) {
      await user.click(options[0]);
      await waitFor(() => {
        expect(mockOnAnswer).toHaveBeenCalled();
      });
    }
  });

  it("should show reveal button", () => {
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Reveal Answer/i)).toBeInTheDocument();
  });

  it("should call onAnswer with reveal flag when reveal is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    const revealButton = screen.getByText(/Reveal Answer/i);
    await user.click(revealButton);

    await waitFor(() => {
      expect(mockOnAnswer).toHaveBeenCalledWith(true, true);
    });
  });

  it("should reset state when question changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MissingWordMode
        question={mockQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Select an option
    const options = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    
    if (options.length > 0) {
      await user.click(options[0]);
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
      <MissingWordMode
        question={newQuestion}
        allQuestions={mockAllQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // State should be reset - buttons should not be disabled
    const newButtons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && !btn.textContent.includes("Reveal")
    );
    const disabledButtons = newButtons.filter((btn) => btn.disabled);
    expect(disabledButtons.length).toBe(0);
  });
});

