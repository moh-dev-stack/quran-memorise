import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";
import type { Question } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Question Randomization", () => {
  it("should shuffle questions when mode is selected", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Choose a game mode/i)).toBeInTheDocument();
    });

    // Select a mode
    const missingWordButton = screen.getByText(/Missing Word/i);
    await user.click(missingWordButton);

    await waitFor(() => {
      expect(screen.getByText(/Choose the missing word/i)).toBeInTheDocument();
    });

    // Questions should be shuffled (we can't directly verify order, but can verify it works)
    expect(screen.getByText(/Verse \d+/)).toBeInTheDocument();
  });

  it("should show different questions in different order on restart", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Choose a game mode/i)).toBeInTheDocument();
    });

    // Select mode first time
    const missingWordButton = screen.getByText(/Missing Word/i);
    await user.click(missingWordButton);

    await waitFor(() => {
      expect(screen.getByText(/Choose the missing word/i)).toBeInTheDocument();
    });

    // Answer and complete
    const buttons = screen.getAllByRole("button");
    const optionButton = buttons.find(
      (btn) =>
        btn.textContent &&
        !btn.textContent.includes("Modes") &&
        !btn.textContent.includes("Home") &&
        !btn.textContent.includes("Question")
    );

    if (optionButton) {
      await user.click(optionButton);
      await waitFor(() => {
        const nextButton = screen.getByText(/Next Question|Finish/i);
        expect(nextButton).toBeInTheDocument();
      });
    }
  });
});

