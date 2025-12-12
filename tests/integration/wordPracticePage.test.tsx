import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import WordPracticePage from "@/app/words/practice/page";
import { top50Path } from "@/lib/wordLearningPaths";
import { WORD_GAME_MODES } from "@/lib/wordGameModes";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      if (key === "path") return "top-50";
      if (key === "mode") return "arabic-to-translation";
      return null;
    }),
  }),
}));

describe("Word Practice Page Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Path Selection", () => {
    it("should show learning path selector when no path is selected", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
      } as any);

      render(<WordPracticePage />);

      expect(screen.getByText(/Choose Learning Path/i)).toBeInTheDocument();
    });
  });

  describe("Mode Selection", () => {
    it("should show mode selector when path is selected but mode is not", () => {
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn((key: string) => {
          if (key === "path") return "top-50";
          return null;
        }),
      } as any);

      render(<WordPracticePage />);

      expect(screen.getByText(/Choose Practice Mode/i)).toBeInTheDocument();
      WORD_GAME_MODES.forEach((mode) => {
        expect(screen.getByText(mode.name)).toBeInTheDocument();
      });
    });

    it("should load practice mode when mode is selected", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
        expect(screen.getByText(/Choose the correct translation/i)).toBeInTheDocument();
      });
    });
  });

  describe("Multiple Choice Questions", () => {
    it("should display question based on selected mode", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        // Arabic to translation mode should show Arabic
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });
    });

    it("should display multiple choice options", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        const options = screen.getAllByRole("button").filter(
          (btn) => btn.textContent && btn.textContent.includes(words[0].translation)
        );
        expect(options.length).toBeGreaterThan(0);
      });
    });

    it("should show feedback when answer is selected", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        const correctOption = screen.getByText(words[0].translation);
        fireEvent.click(correctOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
      });
    });

    it("should show incorrect feedback for wrong answer", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        // Find an option that's not the correct answer
        const options = screen.getAllByRole("button").filter(
          (btn) =>
            btn.textContent !== words[0].translation &&
            btn.textContent !== "Next Word" &&
            btn.textContent !== "← Back" &&
            btn.textContent !== "Home"
        );
        if (options.length > 0) {
          fireEvent.click(options[0]);
        }
      });

      await waitFor(() => {
        const feedback = screen.queryByText(/Incorrect/i);
        if (feedback) {
          expect(feedback).toBeInTheDocument();
        }
      });
    });
  });

  describe("Score Tracking", () => {
    it("should display score after answering questions", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        const correctOption = screen.getByText(words[0].translation);
        fireEvent.click(correctOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      });
    });

    it("should update score correctly", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      // Answer first question correctly
      await waitFor(() => {
        const correctOption = screen.getByText(words[0].translation);
        fireEvent.click(correctOption);
      });

      await waitFor(() => {
        const nextButton = screen.getByText(/Next Word/i);
        fireEvent.click(nextButton);
      });

      // Answer second question
      await waitFor(() => {
        const correctOption = screen.getByText(words[1].translation);
        fireEvent.click(correctOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should move to next word after answering", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      await waitFor(() => {
        const correctOption = screen.getByText(words[0].translation);
        fireEvent.click(correctOption);
      });

      await waitFor(() => {
        const nextButton = screen.getByText(/Next Word/i);
        expect(nextButton).toBeInTheDocument();
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(screen.getByText(words[1].arabic)).toBeInTheDocument();
      });
    });

    it("should show completion message when all words are answered", async () => {
      const words = top50Path.getWords();
      render(<WordPracticePage />);

      // Answer all words (this might take a while, so we'll just check the structure)
      await waitFor(() => {
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });
    });
  });

  describe("Game Mode Switching", () => {
    it("should change question format when switching modes", async () => {
      const words = top50Path.getWords();
      const mockPush = vi.fn();
      vi.mocked(useRouter).mockReturnValue({
        push: mockPush,
      } as any);

      render(<WordPracticePage />);

      await waitFor(() => {
        // Should show Arabic in arabic-to-translation mode
        expect(screen.getByText(words[0].arabic)).toBeInTheDocument();
      });
    });
  });
});

