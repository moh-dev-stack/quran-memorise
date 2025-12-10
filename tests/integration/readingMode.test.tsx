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

  it("should update verse counter when navigating", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(/Verse 1 of/i)).toBeInTheDocument();

    const nextButton = screen.getByText(/Next/i);
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Verse 2 of/i)).toBeInTheDocument();
    });
  });

  it("should update highlighted verse indicator when navigating", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Initially verse 1 should be highlighted
    const verse1Buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent === "1" && btn.className.includes("bg-blue-600")
    );
    expect(verse1Buttons.length).toBeGreaterThan(0);

    // Navigate to verse 2
    const nextButton = screen.getByText(/Next/i);
    await user.click(nextButton);

    await waitFor(() => {
      const verse2Buttons = screen.getAllByRole("button").filter(
        (btn) => btn.textContent === "2" && btn.className.includes("bg-blue-600")
      );
      expect(verse2Buttons.length).toBeGreaterThan(0);
    });
  });

  it("should handle rapid navigation", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    
    // Rapidly click next multiple times
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Verse 4 of/i)).toBeInTheDocument();
    });
  });

  it("should handle rapid back and forth navigation", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[1]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    const previousButton = screen.getByText(/Previous/i);

    await user.click(nextButton);
    await user.click(previousButton);
    await user.click(previousButton);

    await waitFor(() => {
      expect(screen.getByText(/Verse 1 of/i)).toBeInTheDocument();
    });
  });

  it("should disable First Verse button when on first verse", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const firstButton = screen.getByText(/First Verse/i);
    expect(firstButton).toBeDisabled();
  });

  it("should disable Last Verse button when on last verse", () => {
    const lastQuestion = questions[questions.length - 1];
    render(
      <ReadingMode
        question={lastQuestion}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const lastButton = screen.getByText(/Last Verse/i);
    expect(lastButton).toBeDisabled();
  });

  it("should enable First Verse button when not on first verse", () => {
    render(
      <ReadingMode
        question={questions[1]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const firstButton = screen.getByText(/First Verse/i);
    expect(firstButton).not.toBeDisabled();
  });

  it("should enable Last Verse button when not on last verse", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const lastButton = screen.getByText(/Last Verse/i);
    expect(lastButton).not.toBeDisabled();
  });

  it("should call onAnswer for each navigation action", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    mockOnAnswer.mockClear();

    await user.click(screen.getByText(/Next/i));
    await user.click(screen.getByText(/Previous/i));
    await user.click(screen.getByText(/First Verse/i));
    await user.click(screen.getByText(/Last Verse/i));

    expect(mockOnAnswer).toHaveBeenCalledTimes(4);
    expect(mockOnAnswer).toHaveBeenCalledWith(true);
  });

  it("should handle question prop changes", () => {
    const { rerender } = render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(questions[0].verse.arabic)).toBeInTheDocument();

    rerender(
      <ReadingMode
        question={questions[2]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(questions[2].verse.arabic)).toBeInTheDocument();
    expect(screen.getByText(/Verse 3 of/i)).toBeInTheDocument();
  });

  it("should display all verse numbers in indicator", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that all verse numbers are displayed
    for (let i = 1; i <= questions.length; i++) {
      const verseButtons = screen.getAllByRole("button").filter(
        (btn) => btn.textContent === i.toString()
      );
      expect(verseButtons.length).toBeGreaterThan(0);
    }
  });

  it("should navigate through all verses sequentially", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Navigate through all verses
    for (let i = 0; i < questions.length - 1; i++) {
      const nextButton = screen.getByText(/Next/i);
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`Verse ${i + 2} of`))).toBeInTheDocument();
      });
    }

    // Should be on last verse
    expect(screen.getByText(/Next/i)).toBeDisabled();
  });

  it("should handle clicking on same verse number button", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const verse1Buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent === "1"
    );

    if (verse1Buttons.length > 0) {
      const initialCallCount = mockOnAnswer.mock.calls.length;
      await user.click(verse1Buttons[0]);
      
      // Should still call onAnswer even if clicking same verse
      expect(mockOnAnswer.mock.calls.length).toBeGreaterThan(initialCallCount);
    }
  });

  it("should maintain correct state after multiple rapid clicks", async () => {
    const user = userEvent.setup();
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    const nextButton = screen.getByText(/Next/i);
    
    // Click next multiple times rapidly
    await Promise.all([
      user.click(nextButton),
      user.click(nextButton),
      user.click(nextButton),
    ]);

    await waitFor(() => {
      // Should end up on a valid verse (not beyond bounds)
      const verseText = screen.getByText(/Verse \d+ of/i);
      expect(verseText).toBeInTheDocument();
    });
  });

  it("should handle empty questions array gracefully", () => {
    const emptyQuestions: Question[] = [];
    const mockQuestion: Question = {
      verse: {
        number: 1,
        arabic: "Test",
        transliteration: "Test",
        translation: "Test",
      },
      surahNumber: 93,
      surahName: "Test",
    };

    render(
      <ReadingMode
        question={mockQuestion}
        allQuestions={emptyQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should still render without crashing
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("should display correct surah name", () => {
    render(
      <ReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(questions[0].surahName)).toBeInTheDocument();
  });

  it("should update surah name when navigating to different surah", () => {
    const differentSurahQuestion: Question = {
      ...questions[0],
      surahNumber: 94,
      surahName: "Ash-Sharh",
    };

    const mixedQuestions = [questions[0], differentSurahQuestion];

    const { rerender } = render(
      <ReadingMode
        question={questions[0]}
        allQuestions={mixedQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(questions[0].surahName)).toBeInTheDocument();

    rerender(
      <ReadingMode
        question={differentSurahQuestion}
        allQuestions={mixedQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText("Ash-Sharh")).toBeInTheDocument();
  });
});

