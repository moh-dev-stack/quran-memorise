import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("Mode Switching", () => {
  it("should show mode selector initially", async () => {
    render(<PlayPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Choose Game Mode/i)).toBeInTheDocument();
    });
  });

  it("should show game modes in selector", async () => {
    render(<PlayPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic \+ Transliteration → Translation/i)).toBeInTheDocument();
      expect(screen.getByText(/Missing Word/i)).toBeInTheDocument();
    });
  });

  it("should switch to game mode when selected", async () => {
    const user = userEvent.setup();
    render(<PlayPage />);
    
    await waitFor(() => {
      const modeButton = screen.getByText(/Arabic \+ Transliteration → Translation/i);
      expect(modeButton).toBeInTheDocument();
    });

    const modeButton = screen.getByText(/Arabic \+ Transliteration → Translation/i);
    await user.click(modeButton);

    await waitFor(() => {
      expect(screen.getByText(/Modes/i)).toBeInTheDocument();
    });
  });
});

