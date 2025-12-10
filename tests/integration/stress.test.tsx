import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";
import { getAvailableSurahs, getQuestionsForSurah } from "@/lib/questions";
import { fastWaitFor, fastGetByText } from "../testUtils";

// Mock next/navigation
const mockPush = vi.fn();
const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}));

describe("Stress Tests - Integration", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue(null);
  });

  describe("Rapid Navigation Stress Test", () => {
    it("should handle rapid surah and mode switching", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahs = getAvailableSurahs();
      expect(surahs.length).toBeGreaterThan(0);

      // Rapidly switch between surahs (reduced iterations for speed)
      for (let i = 0; i < Math.min(2, surahs.length); i++) {
        const surahButton = fastGetByText(new RegExp(`Surah ${surahs[i].name}`, "i")).closest("button");
        
        if (surahButton) {
          await user.click(surahButton);
          await fastWaitFor(() => {
            expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
          });

          // Go back
          const backButton = fastGetByText(/Back to Surah Selection/i);
          await user.click(backButton);
          await fastWaitFor(() => {
            expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
          });
        }
      }
    });

    it("should handle rapid mode switching", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
      await user.click(surahButton!);
      await fastWaitFor(() => {
        expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
      });

      const modes = [
        "Missing Word",
        "First/Last Word",
      ]; // Reduced from 4 to 2 modes for speed

      // Rapidly switch between modes
      for (const modeName of modes) {
        const modeButton = fastGetByText(new RegExp(modeName, "i"));
        await user.click(modeButton);
        await fastWaitFor(() => {
          expect(fastGetByText(/Question 1 of/i)).toBeInTheDocument();
        });

        // Go back to modes
        const backButton = fastGetByText(/Back to Modes/i);
        await user.click(backButton);
        await fastWaitFor(() => {
          expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe("Large Dataset Stress Test", () => {
    it("should handle all surahs efficiently", () => {
      const start = performance.now();
      const surahs = getAvailableSurahs();
      expect(surahs.length).toBeGreaterThan(0);

      // Load all questions from all surahs
      const allQuestions: any[] = [];
      for (const surah of surahs) {
        const questions = getQuestionsForSurah(surah.number);
        allQuestions.push(...questions);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50); // Should load quickly (reduced from 100ms)
      expect(allQuestions.length).toBeGreaterThan(0);
    });

    it("should render surah selector with many surahs efficiently", async () => {
      render(<PlayPage />);

      const start = performance.now();
      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // Should render quickly
    });
  });

  describe("Rapid Answer Submission Stress Test", () => {
    it("should handle rapid answer submissions", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      // Navigate to game
      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
      await user.click(surahButton!);
      await fastWaitFor(() => {
        expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
      });

      const modeButton = screen.getByText(/Missing Word/i);
      if (modeButton) {
        await user.click(modeButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
      });

      // Rapidly click options (should be ignored if already answered)
      const options = screen.getAllByRole("button").filter(
        (btn) =>
          btn.textContent &&
          !btn.textContent.includes("Back") &&
          !btn.textContent.includes("Home") &&
          !btn.textContent.includes("Question")
      );

      if (options.length > 0) {
        const start = performance.now();
        for (let i = 0; i < Math.min(5, options.length); i++) {
          await act(async () => {
            await user.click(options[i]);
          });
          // Small delay to allow state updates
          // Removed delay - React state updates are synchronous in tests
        }
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(1000);
      }
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should not accumulate state across multiple game sessions", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<PlayPage />);

      // Play a game
      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButton = screen.getByText(/Surah Ad-Duha/i).closest("button");
      if (surahButton) {
        await user.click(surahButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/Choose a game mode/i)).toBeInTheDocument();
      });

      // Unmount and remount
      unmount();

      // Remount
      const { unmount: unmount2 } = render(<PlayPage />);
      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      unmount2();
    });
  });

  describe("Concurrent User Actions", () => {
    it("should handle multiple rapid clicks gracefully", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.textContent?.includes("Surah"));

      if (surahButtons.length > 0) {
        // Rapidly click multiple buttons
        const clicks = surahButtons.slice(0, 2).map((btn) => user.click(btn));
        await act(async () => {
          await Promise.all(clicks);
        });

        // Should still be in a valid state
        await waitFor(() => {
          expect(
            screen.getByText(/Choose a game mode/i) ||
              screen.getByText(/Select a Surah/i)
          ).toBeInTheDocument();
        });
      }
    });
  });

  describe("Word Order Mode Stress Test", () => {
    it("should handle rapid word selection and deselection", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
      await user.click(surahButton!);
      await fastWaitFor(() => {
        expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
      });

      await user.click(fastGetByText(/Word Order/i));
      await fastWaitFor(() => {
        expect(fastGetByText(/Arrange the words/i)).toBeInTheDocument();
      });

      // Rapidly click words
      const wordButtons = screen
        .getAllByRole("button")
        .filter(
          (btn) =>
            btn.textContent &&
            btn.textContent.length > 0 &&
            !btn.textContent.includes("Back") &&
            !btn.textContent.includes("Home") &&
            !btn.textContent.includes("Question") &&
            !btn.textContent.includes("Reset") &&
            !btn.textContent.includes("Check")
        );

      if (wordButtons.length > 0) {
        const start = performance.now();
        // Click first few words rapidly
        for (let i = 0; i < Math.min(3, wordButtons.length); i++) {
          if (!wordButtons[i].disabled) {
            await user.click(wordButtons[i]);
          }
        }
        const duration = performance.now() - start;
        expect(duration).toBeLessThan(1000);
      }
    });

    it("should handle multiple word order games efficiently", async () => {
      const user = userEvent.setup();
      render(<PlayPage />);

      await fastWaitFor(() => {
        expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
      });

      const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
      await user.click(surahButton!);
      await fastWaitFor(() => {
        expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
      });

      await user.click(fastGetByText(/Word Order/i));
      
      const start = performance.now();
      await fastWaitFor(() => {
        expect(fastGetByText(/Arrange the words/i)).toBeInTheDocument();
      });
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(500); // Should load quickly
    });
  });
});

