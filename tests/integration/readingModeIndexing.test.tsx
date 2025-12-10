import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReadingMode from "@/components/game-modes/ReadingMode";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";

describe("Reading Mode Verse Number Indexing", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(93); // Ad-Duha
    mockOnAnswer = vi.fn();
  });

  it("should display verse 5 when on verse 5", () => {
    const verse5Question = questions.find(q => q.verse.number === 5);
    expect(verse5Question).toBeDefined();
    
    render(
      <ReadingMode
        question={verse5Question!}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should show "Verse 5 of 11" not "Verse 5 of 11" meaning index 5
    expect(screen.getByText(/Verse 5 of 11/i)).toBeInTheDocument();
    expect(screen.getByText(verse5Question!.verse.arabic)).toBeInTheDocument();
  });

  it("should display verse 1 when on first verse", () => {
    const verse1Question = questions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1Question!}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1 of 11/i)).toBeInTheDocument();
    expect(screen.getByText(verse1Question!.verse.arabic)).toBeInTheDocument();
  });

  it("should display verse 11 when on last verse", () => {
    const verse11Question = questions.find(q => q.verse.number === 11);
    
    render(
      <ReadingMode
        question={verse11Question!}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 11 of 11/i)).toBeInTheDocument();
    expect(screen.getByText(verse11Question!.verse.arabic)).toBeInTheDocument();
  });

  it("should show correct verse numbers in indicator buttons", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that buttons show actual verse numbers (1, 2, 3...) not indices (1, 2, 3...)
    const verseButtons = screen.getAllByRole("button").filter(
      (btn) => /^\d+$/.test(btn.textContent || "")
    );

    // First button should show "1" (verse 1)
    expect(verseButtons[0].textContent).toBe("1");
    
    // Fifth button should show "5" (verse 5)
    expect(verseButtons[4].textContent).toBe("5");
    
    // Last button should show "11" (verse 11)
    expect(verseButtons[verseButtons.length - 1].textContent).toBe("11");
  });

  it("should navigate to verse 5 when clicking button labeled 5", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Find button with text "5"
    const verse5Button = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "5"
    );

    expect(verse5Button).toBeDefined();
    await user.click(verse5Button!);

    await waitFor(() => {
      const verse5Question = questions.find(q => q.verse.number === 5);
      expect(screen.getByText(verse5Question!.verse.arabic)).toBeInTheDocument();
      expect(screen.getByText(/Verse 5 of 11/i)).toBeInTheDocument();
    });
  });

  it("should navigate in correct verse number order", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Navigate forward
    const nextButton = screen.getByText(/Next/i);
    
    // Click next 4 times to get to verse 5
    for (let i = 0; i < 4; i++) {
      await user.click(nextButton);
    }

    await waitFor(() => {
      const verse5Question = questions.find(q => q.verse.number === 5);
      expect(screen.getByText(verse5Question!.verse.arabic)).toBeInTheDocument();
      expect(screen.getByText(/Verse 5 of 11/i)).toBeInTheDocument();
    });
  });

  it("should handle questions array that is not pre-sorted", () => {
    // Create unsorted array
    const unsortedQuestions: Question[] = [
      questions[4], // verse 5
      questions[0], // verse 1
      questions[2], // verse 3
      questions[1], // verse 2
      questions[3], // verse 4
    ];

    render(
      <ReadingMode
        question={unsortedQuestions[0]} // Start with verse 5
        allQuestions={unsortedQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should still display verse 5 correctly
    expect(screen.getByText(/Verse 5 of 5/i)).toBeInTheDocument();
    
    // Buttons should show verse numbers in order: 1, 2, 3, 4, 5
    const verseButtons = screen.getAllByRole("button").filter(
      (btn) => /^\d+$/.test(btn.textContent || "")
    );
    
    expect(verseButtons[0].textContent).toBe("1");
    expect(verseButtons[1].textContent).toBe("2");
    expect(verseButtons[2].textContent).toBe("3");
    expect(verseButtons[3].textContent).toBe("4");
    expect(verseButtons[4].textContent).toBe("5");
  });

  it("should update display when question prop changes", () => {
    const { rerender } = render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1 of 11/i)).toBeInTheDocument();

    // Change to verse 5
    const verse5Question = questions.find(q => q.verse.number === 5);
    rerender(
      <ReadingMode
        question={verse5Question!}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 5 of 11/i)).toBeInTheDocument();
    expect(screen.getByText(verse5Question!.verse.arabic)).toBeInTheDocument();
  });
});

