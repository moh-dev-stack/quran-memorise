import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("Score Tracking Integration", () => {
  it("should track score across multiple questions", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    });

    // Answer first question
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter(
      (btn) =>
        btn.textContent &&
        !btn.textContent.includes("Modes") &&
        !btn.textContent.includes("Home") &&
        !btn.textContent.includes("Question") &&
        !btn.textContent.includes("Change Mode")
    );

    if (optionButtons.length > 0) {
      await user.click(optionButtons[0]);
      await waitFor(() => {
        expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
      });

      // Check score is displayed
      const scoreText = screen.getByText(/Score:/i);
      expect(scoreText).toBeInTheDocument();

      // Move to next question
      await user.click(screen.getByText(/Next Question/i));

      await waitFor(() => {
        expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
      });

      // Score should still be visible
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    }
  });

  it("should show progress indicator", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 11/i)).toBeInTheDocument();
    });

    // Answer and move to next
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter(
      (btn) =>
        btn.textContent &&
        !btn.textContent.includes("Modes") &&
        !btn.textContent.includes("Home") &&
        !btn.textContent.includes("Question") &&
        !btn.textContent.includes("Change Mode")
    );

    if (optionButtons.length > 0) {
      await user.click(optionButtons[0]);
      await waitFor(() => {
        expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
      });

      await user.click(screen.getByText(/Next Question/i));

      await waitFor(() => {
        expect(screen.getByText(/Question 2 of 11/i)).toBeInTheDocument();
      });
    }
  });
});

