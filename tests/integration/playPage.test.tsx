import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";

// Mock next/navigation
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("PlayPage", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render the play page with first verse", async () => {
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/Ad-Duha/i)).toBeInTheDocument();
    });

    // Should show Arabic text
    expect(screen.getByText(/وَالضُّحَىٰ/i)).toBeInTheDocument();
  });

  it("should allow user to input answer and check it", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type the verse/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type the verse/i);
    await user.type(input, "Wa ad-duha");

    const checkButton = screen.getByText(/Check Answer/i);
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText(/Correct/i)).toBeInTheDocument();
    });
  });

  it("should show feedback for incorrect answer", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type the verse/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type the verse/i);
    await user.type(input, "wrong answer");

    const checkButton = screen.getByText(/Check Answer/i);
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText(/Incorrect/i)).toBeInTheDocument();
    });
  });

  it("should show progress indicator", async () => {
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(/1 of 11/i)).toBeInTheDocument();
    });
  });

  it("should navigate to next question after checking", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type the verse/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Type the verse/i);
    await user.type(input, "Wa ad-duha");

    const checkButton = screen.getByText(/Check Answer/i);
    await user.click(checkButton);

    await waitFor(() => {
      expect(screen.getByText(/Correct/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByText(/Next Verse/i);
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/2 of 11/i)).toBeInTheDocument();
    });
  });
});

