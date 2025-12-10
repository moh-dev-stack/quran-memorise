import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WordOrderMode from "@/components/game-modes/WordOrderMode";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { fastWaitFor, fastGetByText } from "../testUtils";

describe("Word Order Mode - Translation Display", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(93); // Ad-Duha
    mockOnAnswer = vi.fn();
  });

  it("should display only the translation, not Arabic or transliteration", () => {
    const question = questions[0];
    
    render(
      <WordOrderMode
        question={question}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should show translation
    expect(fastGetByText(/Translate this verse:/i)).toBeInTheDocument();
    expect(screen.getByText(question.verse.translation)).toBeInTheDocument();
    
    // Should NOT show Arabic text in the hint area
    expect(screen.queryByText(question.verse.arabic)).not.toBeInTheDocument();
    
    // Should NOT show transliteration in the hint area
    expect(screen.queryByText(question.verse.transliteration)).not.toBeInTheDocument();
  });

  it("should display shuffled Arabic words for arrangement", () => {
    const question = questions[0];
    
    render(
      <WordOrderMode
        question={question}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should show available words section
    expect(fastGetByText(/Available Words:/i)).toBeInTheDocument();
    
    // Should show Arabic words (they are shuffled, so we check that words exist)
    const wordButtons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && btn.textContent.length > 0 && 
      !btn.textContent.includes("Reset") && 
      !btn.textContent.includes("Check") &&
      !btn.textContent.includes("Available") &&
      !btn.textContent.includes("Your Answer") &&
      !btn.textContent.includes("Arrange") &&
      !btn.textContent.includes("Click words")
    );
    
    // Should have Arabic words available
    expect(wordButtons.length).toBeGreaterThan(0);
  });

  it("should allow user to select words and build answer", async () => {
    const user = userEvent.setup();
    const question = questions[0];
    
    render(
      <WordOrderMode
        question={question}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Find available word buttons (Arabic words)
    const availableWordButtons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent && 
      btn.textContent.length > 0 &&
      !btn.textContent.includes("Reset") &&
      !btn.textContent.includes("Check") &&
      !btn.textContent.includes("Available") &&
      !btn.textContent.includes("Your Answer") &&
      !btn.textContent.includes("Arrange") &&
      !btn.textContent.includes("Click words") &&
      !btn.textContent.includes("Translate")
    );

    if (availableWordButtons.length > 0) {
      // Click first word
      await user.click(availableWordButtons[0]);
      
      // Should show "Your Answer" section with the word
      await fastWaitFor(() => {
        expect(fastGetByText(/Your Answer:/i)).toBeInTheDocument();
      });
    }
  });

  it("should show correct translation for different verses", () => {
    // Test with verse 5
    const verse5 = questions.find(q => q.verse.number === 5);
    expect(verse5).toBeDefined();
    
    const { rerender } = render(
      <WordOrderMode
        question={questions[0]}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(questions[0].verse.translation)).toBeInTheDocument();

    // Change to verse 5
    rerender(
      <WordOrderMode
        question={verse5!}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(screen.getByText(verse5!.verse.translation)).toBeInTheDocument();
    expect(screen.queryByText(questions[0].verse.translation)).not.toBeInTheDocument();
  });

  it("should not reveal Arabic text before checking answer", () => {
    const question = questions[0];
    
    render(
      <WordOrderMode
        question={question}
        allQuestions={questions}
        onAnswer={mockOnAnswer}
      />
    );

    // Arabic text should not be visible in the hint/instruction area
    const instructionArea = screen.getByText(/Translate this verse:/i).closest("div");
    expect(instructionArea).toBeTruthy();
    
    // The Arabic text should not be in the instruction area
    if (instructionArea) {
      expect(instructionArea.textContent).not.toContain(question.verse.arabic);
    }
  });
});
