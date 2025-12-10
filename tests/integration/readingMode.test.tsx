import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReadingMode from "@/components/game-modes/ReadingMode";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";

describe("Reading Mode Integration", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(93); // Ad-Duha
    mockOnAnswer = vi.fn();
  });

  it("should render reading mode", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Ad-Duha/i)).toBeInTheDocument();
    expect(screen.getByText(/Verse 1 of/i)).toBeInTheDocument();
  });

  it("should display current verse", () => {
    const question = questions[0];
    render(
      <ReadingMode
        question={question}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(question.verse.arabic)).toBeInTheDocument();
    expect(screen.getByText(question.verse.transliteration)).toBeInTheDocument();
    expect(screen.getByText(question.verse.translation)).toBeInTheDocument();
  });

  it("should show navigation buttons", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
    expect(screen.getByText(/First Verse/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Verse/i)).toBeInTheDocument();
  });

  it("should disable previous button on first verse", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const previousButton = screen.getByText(/Previous/i);
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button on last verse", () => {
    const lastQuestion = questions[questions.length - 1];
    render(
      <ReadingMode
        question={lastQuestion}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeDisabled();
  });

  it("should navigate to next verse", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(questions[1].verse.arabic)).toBeInTheDocument();
    });

    expect(screen.getByText(/Verse 2 of/i)).toBeInTheDocument();
  });

  it("should navigate to previous verse", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[1]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const previousButton = screen.getByText(/Previous/i);
    await user.click(previousButton);

    await waitFor(() => {
      expect(screen.getByText(questions[0].verse.arabic)).toBeInTheDocument();
    });

    expect(screen.getByText(/Verse 1 of/i)).toBeInTheDocument();
  });

  it("should jump to first verse", async () => {
    const user = userEvent.setup();
    const middleQuestion = questions[Math.floor(questions.length / 2)];
    
    render(
      <ReadingMode
        question={middleQuestion}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const firstButton = screen.getByText(/First Verse/i);
    await user.click(firstButton);

    await waitFor(() => {
      expect(screen.getByText(questions[0].verse.arabic)).toBeInTheDocument();
    });

    expect(screen.getByText(/Verse 1 of/i)).toBeInTheDocument();
  });

  it("should jump to last verse", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const lastButton = screen.getByText(/Last Verse/i);
    await user.click(lastButton);

    await waitFor(() => {
      const lastQuestion = questions[questions.length - 1];
      expect(screen.getByText(lastQuestion.verse.arabic)).toBeInTheDocument();
    });

    expect(screen.getByText(new RegExp(`Verse ${questions.length} of`))).toBeInTheDocument();
  });

  it("should navigate via verse number buttons", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Click on verse 3 button (index 2)
    const verseButtons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent === "3"
    );

    if (verseButtons.length > 0) {
      await user.click(verseButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(questions[2].verse.arabic)).toBeInTheDocument();
      });

      expect(screen.getByText(/Verse 3 of/i)).toBeInTheDocument();
    }
  });

  it("should highlight current verse in verse list", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // First verse button should be highlighted
    const verseButtons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent === "1"
    );
    
    expect(verseButtons.length).toBeGreaterThan(0);
    // The verse indicator button should have blue background
    const verseIndicator = verseButtons.find(btn => 
      btn.className.includes("bg-blue-600")
    );
    expect(verseIndicator).toBeDefined();
  });

  it("should call onAnswer when navigating", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    await user.click(nextButton);

    expect(mockOnAnswer).toHaveBeenCalledWith(true);
  });

  it("should handle single verse surah", () => {
    const singleVerseSurah: Question[] = [questions[0]];
    
    render(
      <ReadingMode
        question={singleVerseSurah[0]}
        allQuestions={singleVerseSurah}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1 of 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Previous/i)).toBeDisabled();
    expect(screen.getByText(/Next/i)).toBeDisabled();
  });
});

