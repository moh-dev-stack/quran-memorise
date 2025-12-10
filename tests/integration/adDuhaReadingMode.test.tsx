import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReadingMode from "@/components/game-modes/ReadingMode";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { fastWaitFor, fastGetByText } from "../testUtils";

describe("Ad-Duha Reading Mode - Verse Number Indexing", () => {
  let adDuhaQuestions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    adDuhaQuestions = getQuestionsForSurah(93); // Ad-Duha has 11 verses
    mockOnAnswer = vi.fn();
  });

  it("should display verse 1 when starting from verse 1", () => {
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    expect(verse1).toBeDefined();
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    expect(fastGetByText(/Verse 1 of 11/i)).toBeInTheDocument();
    expect(screen.getByText(/وَالضُّحَىٰ/i)).toBeInTheDocument(); // Arabic for verse 1
  });

  it("should display verse 5 when clicking button labeled 5", async () => {
    const user = userEvent.setup();
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Find button with text "5"
    const verse5Button = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "5"
    );

    expect(verse5Button).toBeDefined();
    await user.click(verse5Button!);

    await fastWaitFor(() => {
      // Should show verse 5
      expect(fastGetByText(/Verse 5 of 11/i)).toBeInTheDocument();
      // Should show Arabic text for verse 5: وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ
      const verse5Arabic = adDuhaQuestions.find(q => q.verse.number === 5)!.verse.arabic;
      const arabicElements = screen.queryAllByText((content, element) => {
        return element?.textContent?.includes(verse5Arabic) || false;
      });
      // Should find at least one element with the Arabic text
      expect(arabicElements.length).toBeGreaterThan(0);
    });
  });

  it("should display verse 11 when clicking button labeled 11", async () => {
    const user = userEvent.setup();
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Find button with text "11"
    const verse11Button = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "11"
    );

    expect(verse11Button).toBeDefined();
    await user.click(verse11Button!);

    await fastWaitFor(() => {
      expect(fastGetByText(/Verse 11 of 11/i)).toBeInTheDocument();
      // Should show Arabic text for verse 11: وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ
      const verse11Arabic = adDuhaQuestions.find(q => q.verse.number === 11)!.verse.arabic;
      const arabicElements = screen.queryAllByText((content, element) => {
        return element?.textContent?.includes(verse11Arabic) || false;
      });
      // Should find at least one element with the Arabic text
      expect(arabicElements.length).toBeGreaterThan(0);
    });
  });

  it("should display correct verse when clicking each verse number button", async () => {
    const user = userEvent.setup();
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Test clicking each verse number button (1 through 11)
    for (let verseNum = 1; verseNum <= 11; verseNum++) {
      const verseButton = screen.getAllByRole("button").find(
        (btn) => btn.textContent === verseNum.toString()
      );

      expect(verseButton).toBeDefined();
      await user.click(verseButton!);

      await fastWaitFor(() => {
        expect(fastGetByText(new RegExp(`Verse ${verseNum} of 11`, "i"))).toBeInTheDocument();
        
        const expectedVerse = adDuhaQuestions.find(q => q.verse.number === verseNum)!;
        const arabicElements = screen.queryAllByText((content, element) => {
          return element?.textContent?.includes(expectedVerse.verse.arabic) || false;
        });
        // Should find at least one element with the Arabic text
        expect(arabicElements.length).toBeGreaterThan(0);
      });
    }
  });

  it("should navigate correctly using Next button", async () => {
    const user = userEvent.setup();
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Start at verse 1
    expect(fastGetByText(/Verse 1 of 11/i)).toBeInTheDocument();

    // Click Next 4 times to get to verse 5
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 4; i++) {
      await user.click(nextButton);
    }

    await fastWaitFor(() => {
      expect(fastGetByText(/Verse 5 of 11/i)).toBeInTheDocument();
      const verse5Arabic = adDuhaQuestions.find(q => q.verse.number === 5)!.verse.arabic;
      const arabicElements = screen.queryAllByText((content, element) => {
        return element?.textContent?.includes(verse5Arabic) || false;
      });
      expect(arabicElements.length).toBeGreaterThan(0);
    });
  });

  it("should navigate correctly using Previous button", async () => {
    const user = userEvent.setup();
    const verse5 = adDuhaQuestions.find(q => q.verse.number === 5);
    
    render(
      <ReadingMode
        question={verse5!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Start at verse 5
    await fastWaitFor(() => {
      expect(fastGetByText(/Verse 5 of 11/i)).toBeInTheDocument();
    });

    // Click Previous 4 times to get to verse 1
    const prevButton = screen.getByText(/Previous/i);
    for (let i = 0; i < 4; i++) {
      await user.click(prevButton);
    }

    await fastWaitFor(() => {
      expect(fastGetByText(/Verse 1 of 11/i)).toBeInTheDocument();
      const verse1Arabic = adDuhaQuestions.find(q => q.verse.number === 1)!.verse.arabic;
      const arabicElements = screen.queryAllByText((content, element) => {
        return element?.textContent?.includes(verse1Arabic) || false;
      });
      expect(arabicElements.length).toBeGreaterThan(0);
    });
  });

  it("should highlight correct verse number button when on that verse", async () => {
    const user = userEvent.setup();
    const verse1 = adDuhaQuestions.find(q => q.verse.number === 1);
    
    render(
      <ReadingMode
        question={verse1!}
        allQuestions={adDuhaQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Click verse 5 button
    const verse5Button = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "5"
    );
    await user.click(verse5Button!);

    await fastWaitFor(() => {
      // Verse 5 button should be highlighted (have blue background)
      const allVerse5Buttons = screen.getAllByRole("button").filter(
        (btn) => btn.textContent === "5"
      );
      const highlightedButton = allVerse5Buttons.find(btn => 
        btn.className.includes("bg-blue-600")
      );
      expect(highlightedButton).toBeDefined();
    });
  });

  it("should handle unsorted question array correctly", () => {
    // Create unsorted array (verse 5, 1, 3, 2, 4)
    const unsortedQuestions: Question[] = [
      adDuhaQuestions.find(q => q.verse.number === 5)!,
      adDuhaQuestions.find(q => q.verse.number === 1)!,
      adDuhaQuestions.find(q => q.verse.number === 3)!,
      adDuhaQuestions.find(q => q.verse.number === 2)!,
      adDuhaQuestions.find(q => q.verse.number === 4)!,
    ];

    render(
      <ReadingMode
        question={unsortedQuestions[0]} // Start with verse 5
        allQuestions={unsortedQuestions}
        onAnswer={mockOnAnswer}
      />
    );

    // Should still display verse 5 correctly
    expect(fastGetByText(/Verse 5 of 5/i)).toBeInTheDocument();
    
    // Buttons should show verse numbers in order: 1, 2, 3, 4, 5
    const verseButtons = screen.getAllByRole("button").filter(
      (btn) => /^\d+$/.test(btn.textContent || "")
    );
    
    expect(verseButtons[0].textContent).toBe("1");
    expect(verseButtons[1].textContent).toBe("2");
    expect(verseButtons[2].textContent).toBe("3");
    expect(verseButtons[3].textContent).toBe("4");
    expect(verseButtons[4].textContent).toBe("5");
  });
});

