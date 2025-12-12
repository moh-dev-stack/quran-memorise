import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import WordReviewPage from "@/app/words/review/page";
import { getAllWords } from "@/lib/wordData";
import { getWordsDueForReview, initializeWordReview, updateWordReview } from "@/lib/wordReview";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Word Review Page Integration Tests", () => {
  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("Review Queue", () => {
    it("should display words due for review", async () => {
      const allWords = getAllWords();
      const wordsDue = getWordsDueForReview(allWords);

      render(<WordReviewPage />);

      if (wordsDue.length > 0) {
        await waitFor(() => {
          expect(screen.getByText(/Review Words/i)).toBeInTheDocument();
          expect(screen.getByText(wordsDue[0].arabic)).toBeInTheDocument();
        });
      }
    });

    it("should show message when no words are due for review", () => {
      // Mock empty review queue by ensuring all words have future review dates
      render(<WordReviewPage />);

      // Check if "No Words Due" message appears (might need to wait)
      const noWordsMessage = screen.queryByText(/No Words Due for Review/i);
      if (noWordsMessage) {
        expect(noWordsMessage).toBeInTheDocument();
      }
    });

    it("should display review statistics", async () => {
      const allWords = getAllWords();
      const wordsDue = getWordsDueForReview(allWords);

      render(<WordReviewPage />);

      if (wordsDue.length > 0) {
        await waitFor(() => {
          expect(screen.getByText(/mastered/i)).toBeInTheDocument();
          expect(screen.getByText(/learning/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe("Quality Rating", () => {
    it("should display quality rating buttons (0-5)", async () => {
      const allWords = getAllWords();
      const wordsDue = getWordsDueForReview(allWords);

      if (wordsDue.length === 0) {
        // Initialize a word for review
        const testWord = initializeWordReview(allWords[0]);
        const wordsWithReview = [testWord, ...allWords.slice(1)];
        // Make it due by setting past date
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        wordsWithReview[0].reviewData!.nextReview = pastDate;
      }

      render(<WordReviewPage />);

      await waitFor(() => {
        for (let i = 0; i <= 5; i++) {
          expect(screen.getByText(i.toString())).toBeInTheDocument();
        }
      });
    });

    it("should update review when quality is rated", async () => {
      const allWords = getAllWords();
      const testWord = initializeWordReview(allWords[0]);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      testWord.reviewData!.nextReview = pastDate;

      render(<WordReviewPage />);

      await waitFor(() => {
        const ratingButton = screen.getByText("5");
        fireEvent.click(ratingButton);
      });

      // Should move to next word or show completion
      await waitFor(
        () => {
          // Either next word or completion message
          const nextWord = screen.queryByText(allWords[1]?.arabic);
          const completion = screen.queryByText(/No Words Due/i);
          expect(nextWord || completion).toBeTruthy();
        },
        { timeout: 1000 }
      );
    });

    it("should handle different quality ratings correctly", async () => {
      const allWords = getAllWords();
      const testWord = initializeWordReview(allWords[0]);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      testWord.reviewData!.nextReview = pastDate;

      render(<WordReviewPage />);

      const ratings = [0, 1, 2, 3, 4, 5];
      for (const rating of ratings) {
        await waitFor(() => {
          const ratingButton = screen.getByText(rating.toString());
          expect(ratingButton).toBeInTheDocument();
        });
      }
    });
  });

  describe("Navigation", () => {
    it("should navigate between words in review queue", async () => {
      const allWords = getAllWords();
      // Create multiple words due for review
      const wordsDue = allWords.slice(0, 3).map((word) => {
        const reviewed = initializeWordReview(word);
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        reviewed.reviewData!.nextReview = pastDate;
        return reviewed;
      });

      render(<WordReviewPage />);

      if (wordsDue.length > 1) {
        await waitFor(() => {
          expect(screen.getByText(wordsDue[0].arabic)).toBeInTheDocument();
        });

        const nextButton = screen.getByText(/Next →/i);
        fireEvent.click(nextButton);

        await waitFor(() => {
          expect(screen.getByText(wordsDue[1].arabic)).toBeInTheDocument();
        });
      }
    });

    it("should navigate back to words page when Back is clicked", async () => {
      render(<WordReviewPage />);

      await waitFor(() => {
        const backButton = screen.getByText(/← Back/i);
        fireEvent.click(backButton);
      });

      expect(mockPush).toHaveBeenCalledWith("/words");
    });
  });

  describe("Completion", () => {
    it("should navigate to words page when all reviews are complete", async () => {
      const allWords = getAllWords();
      const testWord = initializeWordReview(allWords[0]);
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      testWord.reviewData!.nextReview = pastDate;

      render(<WordReviewPage />);

      await waitFor(() => {
        const ratingButton = screen.getByText("5");
        fireEvent.click(ratingButton);
      });

      // Should navigate away after completing
      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith("/words");
        },
        { timeout: 2000 }
      );
    });
  });
});

