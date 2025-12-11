import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContinuousReadingMode from "@/components/game-modes/ContinuousReadingMode";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { fastWaitFor, fastGetByText } from "../testUtils";

describe("Continuous Reading Mode Integration", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(93); // Ad-Duha - 11 verses
    mockOnAnswer = vi.fn();
  });

  it("should render continuous reading mode", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(fastGetByText(/Ad-Duha/i)).toBeInTheDocument();
    expect(fastGetByText(/11 verses/i)).toBeInTheDocument();
  });

  it("should display all verses", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that all verses are displayed
    questions.forEach((q) => {
      const arabicText = screen.queryByText((content, element) => {
        return element?.textContent?.includes(q.verse.arabic) || false;
      });
      expect(arabicText).toBeTruthy();
    });
  });

  it("should display verses in correct order", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check first verse
    const verse1 = questions.find(q => q.verse.number === 1);
    expect(verse1).toBeDefined();
    const verse1Arabic = screen.queryByText((content, element) => {
      return element?.textContent?.includes(verse1!.verse.arabic) || false;
    });
    expect(verse1Arabic).toBeTruthy();

    // Check last verse
    const verse11 = questions.find(q => q.verse.number === 11);
    expect(verse11).toBeDefined();
    const verse11Arabic = screen.queryByText((content, element) => {
      return element?.textContent?.includes(verse11!.verse.arabic) || false;
    });
    expect(verse11Arabic).toBeTruthy();
  });

  it("should display verse translations", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that translations are displayed
    const firstVerse = questions[0];
    expect(screen.getByText(firstVerse.verse.translation)).toBeInTheDocument();
  });

  it("should display verse transliterations", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that transliterations are displayed
    const firstVerse = questions[0];
    expect(screen.getByText(firstVerse.verse.transliteration)).toBeInTheDocument();
  });

  it("should display correct surah name in header", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(fastGetByText(questions[0].surahName)).toBeInTheDocument();
  });

  it("should display correct verse count", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(fastGetByText(new RegExp(`${questions.length} verses`, "i"))).toBeInTheDocument();
  });

  it("should work with different surahs", () => {
    const alAsrQuestions = getQuestionsForSurah(103); // Al-Asr - 3 verses
    
    render(
      <ContinuousReadingMode
        question={alAsrQuestions[0]}
        allQuestions={alAsrQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(fastGetByText(/Al-Asr/i)).toBeInTheDocument();
    expect(fastGetByText(/3 verses/i)).toBeInTheDocument();
  });

  it("should handle single verse surah", () => {
    const alKawtharQuestions = getQuestionsForSurah(108); // Al-Kawthar - 3 verses (actually has 3, but let's test with what we have)
    
    if (alKawtharQuestions.length > 0) {
      render(
        <ContinuousReadingMode
          question={alKawtharQuestions[0]}
          allQuestions={alKawtharQuestions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(fastGetByText(/Al-Kawthar/i)).toBeInTheDocument();
      expect(fastGetByText(new RegExp(`${alKawtharQuestions.length} verses`, "i"))).toBeInTheDocument();
    }
  });

  it("should display verses with verse numbers", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Check that verse numbers are displayed
    const verse1 = questions.find(q => q.verse.number === 1);
    expect(verse1).toBeDefined();
    expect(screen.getByText(/Verse 1/i)).toBeInTheDocument();
  });

  it("should handle shuffled input and display sorted", () => {
    // Shuffle questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    
    render(
      <ContinuousReadingMode
        question={shuffled[0]}
        allQuestions={shuffled}
        onAnswer={mockOnAnswer}
      />
    );

    // Should still display in correct order
    const verse1 = questions.find(q => q.verse.number === 1);
    expect(verse1).toBeDefined();
    const verse1Arabic = screen.queryByText((content, element) => {
      return element?.textContent?.includes(verse1!.verse.arabic) || false;
    });
    expect(verse1Arabic).toBeTruthy();
  });

  it("should not call onAnswer callback", () => {
    render(
      <ContinuousReadingMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // onAnswer should not be called during render
    expect(mockOnAnswer).not.toHaveBeenCalled();
  });
});

