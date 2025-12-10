import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";
import { fastWaitFor, fastGetByText } from "../testUtils";
import { fastWaitFor } from "../testUtils";

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

describe("Surah Selection Flow Integration", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue(null);
  });

  it("should show surah selection screen initially", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });

    expect(fastGetByText(/Choose a surah to memorize/i)).toBeInTheDocument();
  });

  it("should display available surahs", async () => {
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    expect(fastGetByText(/الضحى/i)).toBeInTheDocument();
  });

  it("should navigate to mode selection when surah is selected", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
    expect(surahButton).toBeInTheDocument();
    await user.click(surahButton!);

    await fastWaitFor(() => {
      expect(fastGetByText(/Ad-Duha/i)).toBeInTheDocument();
      expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
    });
  });

  it("should show back button on surah selection screen", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Back to Home/i)).toBeInTheDocument();
    });

    await user.click(fastGetByText(/Back to Home/i));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should show back to surah selection button on mode selection screen", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Surah Ad-Duha/i)).toBeInTheDocument();
    });

    const surahButton = fastGetByText(/Surah Ad-Duha/i).closest("button");
    await user.click(surahButton!);
    await fastWaitFor(() => {
      expect(fastGetByText(/Back to Surah Selection/i)).toBeInTheDocument();
    });

    const backButton = screen.getByText(/Back to Surah Selection/i);
    await user.click(backButton);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });

  it("should handle surah selection from URL params", async () => {
    mockGet.mockReturnValue("93");
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Ad-Duha/i)).toBeInTheDocument();
      expect(fastGetByText(/Choose a game mode/i)).toBeInTheDocument();
    });
  });

  it("should ignore invalid surah number in URL params", async () => {
    mockGet.mockReturnValue("999");
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });

  it("should ignore non-numeric surah param", async () => {
    mockGet.mockReturnValue("invalid");
    render(<PlayPage />);

    await fastWaitFor(() => {
      expect(fastGetByText(/Select a Surah/i)).toBeInTheDocument();
    });
  });
});

