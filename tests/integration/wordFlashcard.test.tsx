import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WordFlashcard from "@/components/words/WordFlashcard";
import type { Word } from "@/lib/wordTypes";
import { getAllWords } from "@/lib/wordData";

describe("WordFlashcard Integration Tests", () => {
  let testWord: Word;
  let mockOnNext: ReturnType<typeof vi.fn>;
  let mockOnPrevious: ReturnType<typeof vi.fn>;
  let mockOnMarkKnown: ReturnType<typeof vi.fn>;
  let mockOnMarkReview: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const allWords = getAllWords();
    testWord = allWords[0];
    mockOnNext = vi.fn();
    mockOnPrevious = vi.fn();
    mockOnMarkKnown = vi.fn();
    mockOnMarkReview = vi.fn();
  });

  describe("Flip Mode (Default)", () => {
    it("should render Arabic text on front side initially", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      expect(screen.getByText(testWord.arabic)).toBeInTheDocument();
      expect(screen.getByText(/Tap to flip/i)).toBeInTheDocument();
    });

    it("should flip to show translation when clicked", async () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
      }

      await waitFor(() => {
        expect(screen.getByText(testWord.translation)).toBeInTheDocument();
        expect(screen.getByText(testWord.transliteration)).toBeInTheDocument();
      });
    });

    it("should flip back to Arabic when clicked again", async () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        await waitFor(() => {
          expect(screen.getByText(testWord.translation)).toBeInTheDocument();
        });
        fireEvent.click(card);
        await waitFor(() => {
          expect(screen.getByText(testWord.arabic)).toBeInTheDocument();
        });
      }
    });

    it("should show transliteration and translation on back side", async () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        await waitFor(() => {
          expect(screen.getByText(testWord.transliteration)).toBeInTheDocument();
          expect(screen.getByText(testWord.translation)).toBeInTheDocument();
        });
      }
    });

    it("should show root and part of speech if available", async () => {
      const wordWithRoot: Word = {
        ...testWord,
        root: "ك ت ب",
        partOfSpeech: "noun",
      };

      render(
        <WordFlashcard
          word={wordWithRoot}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(wordWithRoot.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        await waitFor(() => {
          expect(screen.getByText(/Root: ك ت ب/i)).toBeInTheDocument();
          expect(screen.getByText(/NOUN/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe("Side-by-Side Mode", () => {
    it("should show both Arabic and translation simultaneously", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          showBothSides={true}
        />
      );

      expect(screen.getByText(testWord.arabic)).toBeInTheDocument();
      expect(screen.getByText(testWord.translation)).toBeInTheDocument();
      expect(screen.getByText(testWord.transliteration)).toBeInTheDocument();
    });

    it("should not flip when clicked in side-by-side mode", async () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          showBothSides={true}
        />
      );

      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        // Both should still be visible
        await waitFor(() => {
          expect(screen.getByText(testWord.arabic)).toBeInTheDocument();
          expect(screen.getByText(testWord.translation)).toBeInTheDocument();
        });
      }
    });

    it("should display Arabic in top section and translation in bottom section", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          showBothSides={true}
        />
      );

      const arabicElement = screen.getByText(testWord.arabic);
      const translationElement = screen.getByText(testWord.translation);

      // Check that Arabic appears before translation in DOM order
      const arabicPosition = arabicElement.compareDocumentPosition(translationElement);
      expect(arabicPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("should call onNext when Next button is clicked", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          canGoNext={true}
        />
      );

      const nextButton = screen.getByText(/Next →/i);
      fireEvent.click(nextButton);

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it("should call onPrevious when Previous button is clicked", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          canGoPrevious={true}
        />
      );

      const previousButton = screen.getByText(/← Previous/i);
      fireEvent.click(previousButton);

      expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("should disable Next button when canGoNext is false", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          canGoNext={false}
        />
      );

      const nextButton = screen.getByText(/Next →/i);
      expect(nextButton).toBeDisabled();
    });

    it("should disable Previous button when canGoPrevious is false", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          canGoPrevious={false}
        />
      );

      const previousButton = screen.getByText(/← Previous/i);
      expect(previousButton).toBeDisabled();
    });

    it("should reset flip state when navigating to next word", () => {
      const { rerender } = render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      // Flip the card
      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
      }

      // Navigate to next
      const nextButton = screen.getByText(/Next →/i);
      fireEvent.click(nextButton);

      // When word changes, card should reset to front
      const newWord = getAllWords()[1];
      rerender(
        <WordFlashcard
          word={newWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      expect(screen.getByText(newWord.arabic)).toBeInTheDocument();
    });
  });

  describe("Mark Actions", () => {
    it("should call onMarkKnown when Mark as Known button is clicked", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          onMarkKnown={mockOnMarkKnown}
        />
      );

      const markKnownButton = screen.getByText(/Mark as Known/i);
      fireEvent.click(markKnownButton);

      expect(mockOnMarkKnown).toHaveBeenCalledTimes(1);
    });

    it("should call onMarkReview when Needs Review button is clicked", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          onMarkReview={mockOnMarkReview}
        />
      );

      const markReviewButton = screen.getByText(/Needs Review/i);
      fireEvent.click(markReviewButton);

      expect(mockOnMarkReview).toHaveBeenCalledTimes(1);
    });

    it("should not show mark buttons when callbacks are not provided", () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      expect(screen.queryByText(/Mark as Known/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Needs Review/i)).not.toBeInTheDocument();
    });
  });

  describe("Verse Example Modal", () => {
    it("should open verse example modal when button is clicked", async () => {
      const wordWithExamples: Word = {
        ...testWord,
        verseExamples: [
          {
            surah: 1,
            verse: 1,
            arabic: "بِسْمِ اللَّهِ",
            translation: "In the name of Allah",
          },
        ],
      };

      render(
        <WordFlashcard
          word={wordWithExamples}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      // Flip to back side first
      const card = screen.getByText(wordWithExamples.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        await waitFor(() => {
          const showExampleButton = screen.getByText(/Show Verse Example/i);
          fireEvent.click(showExampleButton);
        });

        await waitFor(() => {
          expect(screen.getByText(/Surah 1, Verse 1/i)).toBeInTheDocument();
          expect(screen.getByText("بِسْمِ اللَّهِ")).toBeInTheDocument();
        });
      }
    });

    it("should close verse example modal when close button is clicked", async () => {
      const wordWithExamples: Word = {
        ...testWord,
        verseExamples: [
          {
            surah: 1,
            verse: 1,
            arabic: "بِسْمِ اللَّهِ",
            translation: "In the name of Allah",
          },
        ],
      };

      render(
        <WordFlashcard
          word={wordWithExamples}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      // Open modal
      const card = screen.getByText(wordWithExamples.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
        await waitFor(() => {
          const showExampleButton = screen.getByText(/Show Verse Example/i);
          fireEvent.click(showExampleButton);
        });

        // Close modal
        await waitFor(() => {
          const closeButton = screen.getByText(/Close/i);
          fireEvent.click(closeButton);
        });

        await waitFor(() => {
          expect(screen.queryByText(/Surah 1, Verse 1/i)).not.toBeInTheDocument();
        });
      }
    });

    it("should not show verse example button if word has no examples", () => {
      const wordWithoutExamples: Word = {
        ...testWord,
        verseExamples: [],
      };

      render(
        <WordFlashcard
          word={wordWithoutExamples}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(wordWithoutExamples.arabic).closest("div");
      if (card) {
        fireEvent.click(card);
      }

      expect(screen.queryByText(/Show Verse Example/i)).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle word with minimal data", () => {
      const minimalWord: Word = {
        id: "test-word",
        arabic: "اللَّه",
        transliteration: "Allah",
        translation: "Allah",
        partOfSpeech: "noun",
        frequency: 1,
        verseExamples: [],
      };

      render(
        <WordFlashcard
          word={minimalWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      expect(screen.getByText("اللَّه")).toBeInTheDocument();
      expect(screen.getByText("Allah")).toBeInTheDocument();
    });

    it("should handle rapid clicking without errors", async () => {
      render(
        <WordFlashcard
          word={testWord}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
        />
      );

      const card = screen.getByText(testWord.arabic).closest("div");
      if (card) {
        // Rapid clicks
        for (let i = 0; i < 5; i++) {
          fireEvent.click(card);
        }

        // Should still render correctly
        await waitFor(() => {
          expect(screen.getByText(testWord.arabic)).toBeInTheDocument();
        });
      }
    });
  });
});

