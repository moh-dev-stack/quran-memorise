import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReadingMode from "@/components/game-modes/ReadingMode";
import { getQuestionsForSurah, getAvailableSurahs } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { fastWaitFor, fastGetByText } from "../testUtils";

describe("Reading Mode Stress Tests", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(93); // Ad-Duha
    mockOnAnswer = vi.fn();
  });

  describe("Rapid Navigation Stress", () => {
    it("should handle 100 rapid next clicks", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const start = performance.now();

      // Rapidly click next (will stop at last verse)
      for (let i = 0; i < 100; i++) {
        if (!nextButton.disabled) {
          await user.click(nextButton);
        } else {
          break;
        }
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
      
      // Should end up on last verse
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`Verse ${questions.length} of`))).toBeInTheDocument();
      });
    });

    it("should handle rapid back and forth navigation 50 times", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[Math.floor(questions.length / 2)]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const previousButton = screen.getByText(/Previous/i);
      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        await user.click(nextButton);
        await user.click(previousButton);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(3000);
    });

    it("should handle rapid verse number button clicks", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const start = performance.now();
      
      // Click through all verse numbers rapidly
      for (let i = 1; i <= Math.min(questions.length, 20); i++) {
        const verseButtons = screen.getAllByRole("button").filter(
          (btn) => btn.textContent === i.toString() && !btn.disabled
        );
        if (verseButtons.length > 0) {
          await user.click(verseButtons[0]);
        }
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe("Large Dataset Stress", () => {
    it("should handle surah with many verses efficiently", async () => {
      const allSurahs = getAvailableSurahs();
      let largestSurah = allSurahs[0];
      
      // Find surah with most verses
      for (const surah of allSurahs) {
        if (surah.verses.length > largestSurah.verses.length) {
          largestSurah = surah;
        }
      }

      const largeQuestions = getQuestionsForSurah(largestSurah.number);
      const start = performance.now();

      render(
        <ReadingMode
          question={largeQuestions[0]}
          allQuestions={largeQuestions}
          onAnswer={mockOnAnswer}
        />
      );

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500); // Should render quickly even with many verses
      
      // Verify all verse numbers are displayed
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`Verse 1 of ${largeQuestions.length}`))).toBeInTheDocument();
      });
    });

    it("should navigate through large surah efficiently", async () => {
      const user = userEvent.setup();
      const allSurahs = getAvailableSurahs();
      let largestSurah = allSurahs[0];
      
      for (const surah of allSurahs) {
        if (surah.verses.length > largestSurah.verses.length) {
          largestSurah = surah;
        }
      }

      const largeQuestions = getQuestionsForSurah(largestSurah.number);
      
      render(
        <ReadingMode
          question={largeQuestions[0]}
          allQuestions={largeQuestions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const start = performance.now();

      // Navigate through first 10 verses
      for (let i = 0; i < Math.min(10, largeQuestions.length - 1); i++) {
        await user.click(nextButton);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe("Concurrent Operations Stress", () => {
    it("should handle multiple rapid state updates", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const previousButton = screen.getByText(/Previous/i);
      const firstButton = screen.getByText(/First Verse/i);
      const lastButton = screen.getByText(/Last Verse/i);

      // Rapidly trigger multiple navigation actions
      const actions = [
        user.click(nextButton),
        user.click(nextButton),
        user.click(previousButton),
        user.click(firstButton),
        user.click(lastButton),
      ];

      await Promise.all(actions);

      // Should end up in a valid state
      await waitFor(() => {
        const verseText = screen.getByText(/Verse \d+ of/i);
        expect(verseText).toBeInTheDocument();
      });
    });

    it("should handle rapid verse number button clicks", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const verseButtons = screen.getAllByRole("button").filter(
        (btn) => /^\d+$/.test(btn.textContent || "")
      );

      // Click multiple verse buttons rapidly
      const clicks = verseButtons.slice(0, 5).map(btn => user.click(btn));
      await Promise.all(clicks);

      // Should end up on one of the clicked verses
      await waitFor(() => {
        const verseText = screen.getByText(/Verse \d+ of/i);
        expect(verseText).toBeInTheDocument();
      });
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should not accumulate state across multiple renders", () => {
      const { unmount, rerender } = render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Render multiple times
      for (let i = 0; i < 10; i++) {
        rerender(
          <ReadingMode
            question={questions[i % questions.length]}
            allQuestions={questions}
            onAnswer={mockOnAnswer}
          />
        );
      }

      unmount();

      // Component should clean up properly
      expect(mockOnAnswer).toHaveBeenCalled();
    });

    it("should handle unmount during navigation", async () => {
      const user = userEvent.setup();
      const { unmount } = render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const clickPromise = user.click(nextButton);
      
      // Unmount during navigation
      unmount();
      
      await clickPromise;
      // Should not throw errors
    });
  });

  describe("Edge Case Stress", () => {
    it("should handle question prop changing rapidly", () => {
      const { rerender } = render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Rapidly change question prop
      for (let i = 0; i < questions.length; i++) {
        rerender(
          <ReadingMode
            question={questions[i]}
            allQuestions={questions}
            onAnswer={mockOnAnswer}
          />
        );
      }

      // Should display last question
      expect(screen.getByText(questions[questions.length - 1].verse.arabic)).toBeInTheDocument();
    });

    it("should handle allQuestions array changing", () => {
      const { rerender } = render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Change to different surah
      const otherSurah = getQuestionsForSurah(94);
      rerender(
        <ReadingMode
          question={otherSurah[0]}
          allQuestions={otherSurah}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(otherSurah[0].verse.arabic)).toBeInTheDocument();
    });

    it("should handle single verse surah navigation", async () => {
      const user = userEvent.setup();
      const singleVerse: Question[] = [questions[0]];
      
      render(
        <ReadingMode
          question={singleVerse[0]}
          allQuestions={singleVerse}
          onAnswer={mockOnAnswer}
        />
      );

      // Try to navigate (should be disabled)
      const nextButton = screen.getByText(/Next/i);
      const previousButton = screen.getByText(/Previous/i);
      
      expect(nextButton).toBeDisabled();
      expect(previousButton).toBeDisabled();

      // Clicking should not cause errors
      await user.click(nextButton);
      await user.click(previousButton);

      // Should still show verse 1
      expect(screen.getByText(/Verse 1 of 1/i)).toBeInTheDocument();
    });
  });

  describe("Performance Under Load", () => {
    it("should render quickly with many verses", () => {
      const allSurahs = getAvailableSurahs();
      const allQuestions: Question[] = [];
      
      for (const surah of allSurahs) {
        allQuestions.push(...getQuestionsForSurah(surah.number));
      }

      const start = performance.now();
      render(
        <ReadingMode
          question={allQuestions[0]}
          allQuestions={allQuestions}
          onAnswer={mockOnAnswer}
        />
      );
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it("should handle 1000 navigation actions efficiently", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      const previousButton = screen.getByText(/Previous/i);
      
      const start = performance.now();
      
      // Alternate between next and previous
      for (let i = 0; i < 1000; i++) {
        if (i % 2 === 0 && !nextButton.disabled) {
          await user.click(nextButton);
        } else if (!previousButton.disabled) {
          await user.click(previousButton);
        }
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10000); // Should complete in under 10 seconds
    });
  });
});

