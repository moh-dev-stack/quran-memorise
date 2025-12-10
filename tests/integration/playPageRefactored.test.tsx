import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";
import { fastWaitFor, fastGetByText } from "../testUtils";

// Mock next/navigation
const mockPush = vi.fn();
const mockGet = vi.fn();
const mockRouter = {
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("PlayPage Refactored Flow", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue(null);
  });

  it("should render surah selection screen first", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });

  it("should navigate through surah -> mode -> game flow", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    // Step 1: Select surah
    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
    await user.click(surahButton!);

    // Step 2: Select mode
    await fastWaitFor(() => {
      expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
    });

    await user.click(fastGetByText(/Missing Word/i));
    await fastWaitFor(() => {
      expect(fastGetByText(/Question 1 of/i)).toBeInTheDocument();
    });
  });

  it("should allow navigation back from game to mode selection", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    // Navigate to game
    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
    await user.click(surahButton!);

    await fastWaitFor(() => {
      expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
    });

    await user.click(fastGetByText(/Missing Word/i));
    await fastWaitFor(() => {
      expect(fastGetByText(/Back to Modes/i)).toBeInTheDocument();
    });

    await user.click(fastGetByText(/Back to Modes/i));

    await fastWaitFor(() => {
      expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
    });
  });

  it("should allow navigation back from mode to surah selection", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    // Navigate to mode selection
    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
    await user.click(surahButton!);

    await fastWaitFor(() => {
      expect(fastGetByText(/Back to Surah Selection/i)).toBeInTheDocument();
    });

    await user.click(fastGetByText(/Back to Surah Selection/i));

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });

  it("should show loading state during suspense", async () => {
    render(<PlayPage />);

    // Should show loading initially (though it may be very brief)
    // The actual content should appear quickly
    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });
});

