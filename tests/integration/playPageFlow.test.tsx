import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("PlayPage Flow Integration", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should show mode selector initially", async () => {
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Choose Game Mode/i)).toBeInTheDocument();
    });
  });

  it("should show all 7 game modes", async () => {
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
      expect(screen.getByText(/Translation → Arabic \+ Transliteration/i)).toBeInTheDocument();
      expect(screen.getByText(/Missing Word/i)).toBeInTheDocument();
      expect(screen.getByText(/Arabic → Transliteration/i)).toBeInTheDocument();
      expect(screen.getByText(/Transliteration → Arabic/i)).toBeInTheDocument();
      expect(screen.getByText(/Sequential Order/i)).toBeInTheDocument();
      expect(screen.getByText(/First\/Last Word/i)).toBeInTheDocument();
    });
  });

  it("should navigate to game mode when selected", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    const modeButton = screen.getByText(/Arabic \+ Transliteration → Translation/i);
    await user.click(modeButton);

    await waitFor(() => {
      expect(screen.getByText(/Modes/i)).toBeInTheDocument();
      expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    });
  });

  it("should show score display after selecting mode", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    });
  });

  it("should allow answering a question and moving to next", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    // Select mode
    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Choose the correct translation/i)).toBeInTheDocument();
    });

    // Select an answer
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter(
      (btn) => btn.textContent && !btn.textContent.includes("Modes") && !btn.textContent.includes("Home") && !btn.textContent.includes("Question")
    );

    if (optionButtons.length > 0) {
      await user.click(optionButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Next Question|Finish/i)).toBeInTheDocument();
      });

      // Click next
      const nextButton = screen.getByText(/Next Question/i);
      if (nextButton) {
        await user.click(nextButton);

        await waitFor(() => {
          expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
        });
      }
    }
  });

  it("should reset game state when changing modes", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    // Select first mode
    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Modes/i)).toBeInTheDocument();
    });

    // Go back to mode selection
    await user.click(screen.getByText(/← Modes/i));

    await waitFor(() => {
      expect(screen.getByText(/Choose Game Mode/i)).toBeInTheDocument();
    });

    // Select different mode
    await user.click(screen.getByText(/Missing Word/i));

    await waitFor(() => {
      expect(screen.getByText(/Choose the missing word/i)).toBeInTheDocument();
    });
  });

  it("should show next button only after answering", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Choose the correct translation/i)).toBeInTheDocument();
    });

    // Next button should not be visible yet
    expect(screen.queryByText(/Next Question/i)).not.toBeInTheDocument();

    // Answer question
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter(
      (btn) => btn.textContent && !btn.textContent.includes("Modes") && !btn.textContent.includes("Home") && !btn.textContent.includes("Question")
    );

    if (optionButtons.length > 0) {
      await user.click(optionButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
      });
    }
  });

  it("should prevent selecting multiple answers", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
    });

    await user.click(screen.getByText(/Arabic \+ Transliteration → Translation/i));

    await waitFor(() => {
      expect(screen.getByText(/Choose the correct translation/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter(
      (btn) => btn.textContent && !btn.textContent.includes("Modes") && !btn.textContent.includes("Home") && !btn.textContent.includes("Question")
    );

    if (optionButtons.length > 1) {
      // Click first option
      await user.click(optionButtons[0]);

      await waitFor(() => {
        // All buttons should now be disabled
        const disabledButtons = optionButtons.filter((btn) => btn.disabled);
        expect(disabledButtons.length).toBe(optionButtons.length);
      });
    }
  });
});

