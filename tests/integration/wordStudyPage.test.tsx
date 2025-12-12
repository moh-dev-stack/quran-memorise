import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import WordStudyPage from "@/app/words/study/page";
import { getAllWords } from "@/lib/wordData";
import { top50Path } from "@/lib/wordLearningPaths";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      if (key === "path") return "top-50";
      return null;
    }),
  }),
}));

describe("Word Study Page Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Path Selection", () => {
    it("should show learning path selector when no path is selected", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
      } as any);

      render(<WordStudyPage />);

      expect(screen.getByText(/Choose Learning Path/i)).toBeInTheDocument();
    });

    it("should load words when path is selected from URL", async () => {
      const words = top50Path.getWords();
      expect(words.length).toBeGreaterThan(0);

      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });
    });
  });

  describe("Flashcard Display", () => {
    it("should display current word flashcard", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });
    });

    it("should show word counter", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(/Word 1 of/i)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`Word 1 of ${words.length}`)))).toBeInTheDocument();
      });
    });

    it("should show learning path name", async () => {
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(/Top 50 Words/i)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to next word when Next button is clicked", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      const nextButton = screen.getByText(/Next →/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
        expect(screen.getByText(/Word 2 of/i)).toBeInTheDocument();
      });
    });

    it("should navigate to previous word when Previous button is clicked", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      // Go to second word first
      const nextButton = screen.getByText(/Next →/i);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
      });

      // Then go back
      const previousButton = screen.getByText(/← Previous/i);
      fireEvent.click(previousButton);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
        expect(screen.getByText(/Word 1 of/i)).toBeInTheDocument();
      });
    });

    it("should disable Previous button on first word", async () => {
      render(<WordStudyPage />);

      await waitFor(() => {
        const previousButton = screen.getByText(/← Previous/i);
        expect(previousButton).toBeDisabled();
      });
    });

    it("should disable Next button on last word", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      // Navigate to last word
      for (let i = 0; i < words.length - 1; i++) {
        await waitFor(() => {
          const nextButton = screen.getByText(/Next →/i);
          if (!nextButton.hasAttribute("disabled")) {
            fireEvent.click(nextButton);
          }
        });
      }

      await waitFor(() => {
        const nextButton = screen.getByText(/Next →/i);
        expect(nextButton).toBeDisabled();
      });
    });
  });

  describe("View Mode Toggle", () => {
    it("should toggle between flip mode and side-by-side view", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      // Initially in flip mode - only Arabic visible
      expect(screen.queryByText(words[0].translation)).not.toBeInTheDocument();

      // Toggle to side-by-side
      const toggleButton = screen.getByText(/Switch to Side-by-Side View/i);
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
        expect(screen.getByText(words[0].translation)).toBeInTheDocument();
        expect(screen.getByText(/Switch to Flip Mode/i)).toBeInTheDocument();
      });

      // Toggle back to flip mode
      const flipToggleButton = screen.getByText(/Switch to Flip Mode/i);
      fireEvent.click(flipToggleButton);

      await waitFor(() => {
        expect(screen.getByText(/Switch to Side-by-Side View/i)).toBeInTheDocument();
      });
    });

    it("should maintain view mode when navigating between words", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      // Switch to side-by-side
      const toggleButton = screen.getByText(/Switch to Side-by-Side View/i);
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText(words[0].translation)).toBeInTheDocument();
      });

      // Navigate to next word
      const nextButton = screen.getByText(/Next →/i);
      fireEvent.click(nextButton);

      // Should still be in side-by-side mode
      await waitFor(() => {
        expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
        expect(screen.getByText(words[1].translation)).toBeInTheDocument();
      });
    });
  });

  describe("Mark Actions", () => {
    it("should mark word as known and move to next", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      const markKnownButton = screen.getByText(/Mark as Known/i);
      fireEvent.click(markKnownButton);

      // Should move to next word after delay
      await waitFor(
        () => {
          expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should mark word for review and move to next", async () => {
      const words = top50Path.getWords();
      render(<WordStudyPage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });

      const markReviewButton = screen.getByText(/Needs Review/i);
      fireEvent.click(markReviewButton);

      // Should move to next word after delay
      await waitFor(
        () => {
          expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Back Navigation", () => {
    it("should navigate back to words page when Back button is clicked", async () => {
      const mockPush = vi.fn();
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
      } as any);

      render(<WordStudyPage />);

      await waitFor(() => {
        const backButton = screen.getByText(/← Back/i);
        fireEvent.click(backButton);
      });

      expect(mockPush).toHaveBeenCalledWith("/words");
    });

    it("should navigate to home when Home button is clicked", async () => {
      const mockPush = vi.fn();
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
      } as any);

      render(<WordStudyPage />);

      await waitFor(() => {
        const homeButton = screen.getByText(/Home/i);
        fireEvent.click(homeButton);
      });

      expect(mockPush).toHaveBeenCalledWith("/words");
    });
  });

  describe("Empty State", () => {
    it("should show message when no words are available", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => "non-existent-path"),
      } as any);

      render(<WordStudyPage />);

      expect(screen.getByText(/No words available/i)).toBeInTheDocument();
    });
  });
});

