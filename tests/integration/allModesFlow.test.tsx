import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayPage from "@/app/play/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("All Game Modes Flow", () => {
  const testModeFlow = async (modeName: string, expectedText: string) => {
    const user = userEvent.setup();
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText(new RegExp(modeName, "i"))).toBeInTheDocument();
    });

    await user.click(screen.getByText(new RegExp(modeName, "i")));

    await waitFor(() => {
      expect(screen.getByText(new RegExp(expectedText, "i"))).toBeInTheDocument();
    });

    // Verify we can answer
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
        expect(screen.getByText(/Next Question|Finish/i)).toBeInTheDocument();
      });
    }
  };

  it("should work with Arabic+Trans to Translation mode", async () => {
    await testModeFlow(
      "Arabic \\+ Transliteration → Translation",
      "Choose the correct translation"
    );
  });

  it("should work with Translation to Arabic+Trans mode", async () => {
    await testModeFlow(
      "Translation → Arabic \\+ Transliteration",
      "Choose the correct Arabic"
    );
  });

  it("should work with Missing Word mode", async () => {
    await testModeFlow("Missing Word", "Choose the missing word");
  });

  it("should work with Arabic to Transliteration mode", async () => {
    await testModeFlow("Arabic → Transliteration", "Choose the correct transliteration");
  });

  it("should work with Transliteration to Arabic mode", async () => {
    await testModeFlow("Transliteration → Arabic", "Choose the correct Arabic");
  });

  it("should work with Sequential Order mode", async () => {
    await testModeFlow("Sequential Order", "Choose the correct order");
  });

  it("should work with First/Last Word mode", async () => {
    await testModeFlow("First/Last Word", "Choose the complete verse");
  });
});

