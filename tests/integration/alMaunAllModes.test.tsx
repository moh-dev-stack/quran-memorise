import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getQuestionsForSurah } from "@/lib/questions";
import type { Question } from "@/lib/types";
import { fastWaitFor, fastGetByText } from "../testUtils";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

// Import all game mode components
import ArabicTransToTranslationMode from "@/components/game-modes/ArabicTransToTranslationMode";
import TranslationToArabicTransMode from "@/components/game-modes/TranslationToArabicTransMode";
import MissingWordMode from "@/components/game-modes/MissingWordMode";
import SequentialOrderMode from "@/components/game-modes/SequentialOrderMode";
import FirstLastWordMode from "@/components/game-modes/FirstLastWordMode";
import VerseNumberMode from "@/components/game-modes/VerseNumberMode";
import WordOrderMode from "@/components/game-modes/WordOrderMode";
import ReadingMode from "@/components/game-modes/ReadingMode";
import ContinuousReadingMode from "@/components/game-modes/ContinuousReadingMode";

describe("Al-Ma'un (107) - All Game Modes", () => {
  let questions: Question[];
  let mockOnAnswer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    questions = getQuestionsForSurah(107); // Al-Ma'un - 7 verses
    mockOnAnswer = vi.fn();
  });

  describe("Data Validation", () => {
    it("should have correct number of verses", () => {
      expect(questions.length).toBe(7);
    });

    it("should have correct surah information", () => {
      expect(questions[0].surahNumber).toBe(107);
      expect(questions[0].surahName).toBe("Al-Ma'un");
    });

    it("should have all verses numbered correctly", () => {
      questions.forEach((q, index) => {
        expect(q.verse.number).toBe(index + 1);
      });
    });

    it("should have all required verse properties", () => {
      questions.forEach((q) => {
        expect(q.verse.arabic).toBeTruthy();
        expect(q.verse.transliteration).toBeTruthy();
        expect(q.verse.translation).toBeTruthy();
        expect(q.verse.number).toBeGreaterThan(0);
      });
    });
  });

  describe("Arabic + Transliteration → Translation Mode", () => {
    it("should render correctly", () => {
      render(
        <ArabicTransToTranslationMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(questions[0].verse.arabic)).toBeInTheDocument();
      expect(screen.getByText(questions[0].verse.transliteration)).toBeInTheDocument();
    });

    it("should display multiple choice options", () => {
      render(
        <ArabicTransToTranslationMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0 && !btn.textContent.includes("Reveal")
      );
      expect(optionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Translation → Arabic + Transliteration Mode", () => {
    it("should render correctly", () => {
      render(
        <TranslationToArabicTransMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(questions[0].verse.translation)).toBeInTheDocument();
    });

    it("should display multiple choice options", () => {
      render(
        <TranslationToArabicTransMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0 && !btn.textContent.includes("Reveal")
      );
      expect(optionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Missing Word Mode", () => {
    it("should render correctly", () => {
      render(
        <MissingWordMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Should show verse with blanks
      const verseText = screen.queryByText((content, element) => {
        return element?.textContent?.includes(questions[0].verse.arabic.substring(0, 10)) || false;
      });
      expect(verseText || screen.getByText(/Choose the missing word/i)).toBeTruthy();
    });

    it("should display multiple choice options", () => {
      render(
        <MissingWordMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0 && !btn.textContent.includes("Reveal")
      );
      expect(optionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Sequential Order Mode", () => {
    it("should render correctly", () => {
      render(
        <SequentialOrderMode
          question={questions[2]} // Use verse 3
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(questions[2].verse.translation)).toBeInTheDocument();
    });

    it("should display multiple choice options", () => {
      render(
        <SequentialOrderMode
          question={questions[2]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0
      );
      expect(optionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("First/Last Word Mode", () => {
    it("should render correctly", () => {
      render(
        <FirstLastWordMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Should show first/last words or verse
      expect(screen.getByText(/Choose the correct verse/i) || screen.getByText(/first|last/i)).toBeTruthy();
    });

    it("should display multiple choice options", () => {
      render(
        <FirstLastWordMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0
      );
      expect(optionButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Verse Number Mode", () => {
    it("should render correctly", () => {
      render(
        <VerseNumberMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(questions[0].verse.translation)).toBeInTheDocument();
    });

    it("should display verse number options", () => {
      render(
        <VerseNumberMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Should show numbers 1-7 as options
      const buttons = screen.getAllByRole("button");
      const numberButtons = buttons.filter(
        (btn) => btn.textContent && /^\d+$/.test(btn.textContent.trim())
      );
      expect(numberButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Word Order Mode", () => {
    it("should render correctly", () => {
      render(
        <WordOrderMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(questions[0].verse.translation)).toBeInTheDocument();
      expect(fastGetByText(/Arrange the words/i)).toBeInTheDocument();
    });

    it("should display Arabic words for arrangement", () => {
      render(
        <WordOrderMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const buttons = screen.getAllByRole("button");
      const wordButtons = buttons.filter(
        (btn) => btn.textContent && btn.textContent.length > 0 && 
        !btn.textContent.includes("Reset") && 
        !btn.textContent.includes("Check") &&
        !btn.textContent.includes("Available") &&
        !btn.textContent.includes("Your Answer")
      );
      expect(wordButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Reading Mode", () => {
    it("should render correctly", () => {
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(fastGetByText(/Al-Ma'un/i)).toBeInTheDocument();
      expect(screen.getByText(questions[0].verse.arabic)).toBeInTheDocument();
      expect(screen.getByText(questions[0].verse.translation)).toBeInTheDocument();
    });

    it("should show navigation buttons", () => {
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(screen.getByText(/Previous/i)).toBeInTheDocument();
      expect(screen.getByText(/Next/i)).toBeInTheDocument();
    });

    it("should navigate through all verses", async () => {
      const user = userEvent.setup();
      render(
        <ReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      const nextButton = screen.getByText(/Next/i);
      
      // Navigate through all verses
      for (let i = 0; i < questions.length - 1; i++) {
        await user.click(nextButton);
        await fastWaitFor(() => {
          const currentVerse = questions[i + 1];
          const arabicText = screen.queryByText((content, element) => {
            return element?.textContent?.includes(currentVerse.verse.arabic) || false;
          });
          expect(arabicText).toBeTruthy();
        });
      }
    });
  });

  describe("Continuous Reading Mode", () => {
    it("should render correctly", () => {
      render(
        <ContinuousReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      expect(fastGetByText(/Al-Ma'un/i)).toBeInTheDocument();
      expect(fastGetByText(/7 verses/i)).toBeInTheDocument();
    });

    it("should display all verses", () => {
      render(
        <ContinuousReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Check that all 7 verses are displayed
      questions.forEach((q) => {
        const arabicText = screen.queryByText((content, element) => {
          return element?.textContent?.includes(q.verse.arabic) || false;
        });
        expect(arabicText).toBeTruthy();
      });
    });

    it("should display verses in correct order", () => {
      render(
        <ContinuousReadingMode
          question={questions[0]}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );

      // Check first verse
      const verse1 = questions.find(q => q.verse.number === 1);
      expect(verse1).toBeDefined();
      const verse1Arabic = screen.queryByText((content, element) => {
        return element?.textContent?.includes(verse1!.verse.arabic) || false;
      });
      expect(verse1Arabic).toBeTruthy();

      // Check last verse
      const verse7 = questions.find(q => q.verse.number === 7);
      expect(verse7).toBeDefined();
      const verse7Arabic = screen.queryByText((content, element) => {
        return element?.textContent?.includes(verse7!.verse.arabic) || false;
      });
      expect(verse7Arabic).toBeTruthy();
    });
  });

  describe("All Verses Content", () => {
    it("should have correct Arabic text for all verses", () => {
      const expectedVerses = [
        "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
        "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
        "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ",
        "فَوَيْلٌ لِّلْمُصَلِّينَ",
        "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",
        "الَّذِينَ هُمْ يُرَاءُونَ",
        "وَيَمْنَعُونَ الْمَاعُونَ",
      ];

      questions.forEach((q, index) => {
        expect(q.verse.arabic).toBe(expectedVerses[index]);
      });
    });

    it("should have correct translations for all verses", () => {
      const expectedTranslations = [
        "Have you seen the one who denies the Recompense?",
        "For that is the one who drives away the orphan",
        "And does not encourage the feeding of the poor",
        "So woe to those who pray",
        "[But] who are heedless of their prayer",
        "Those who make show [of their deeds]",
        "And withhold [simple] assistance",
      ];

      questions.forEach((q, index) => {
        expect(q.verse.translation).toBe(expectedTranslations[index]);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle first verse correctly in all modes", () => {
      const firstVerse = questions[0];
      
      // Test a few key modes
      const { rerender } = render(
        <ReadingMode
          question={firstVerse}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );
      expect(screen.getByText(firstVerse.verse.arabic)).toBeInTheDocument();

      rerender(
        <VerseNumberMode
          question={firstVerse}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );
      expect(screen.getByText(firstVerse.verse.translation)).toBeInTheDocument();
    });

    it("should handle last verse correctly in all modes", () => {
      const lastVerse = questions[questions.length - 1];
      
      const { rerender } = render(
        <ReadingMode
          question={lastVerse}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );
      expect(screen.getByText(lastVerse.verse.arabic)).toBeInTheDocument();

      rerender(
        <VerseNumberMode
          question={lastVerse}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );
      expect(screen.getByText(lastVerse.verse.translation)).toBeInTheDocument();
    });

    it("should handle middle verse correctly", () => {
      const middleVerse = questions[3]; // Verse 4
      
      render(
        <ReadingMode
          question={middleVerse}
          allQuestions={questions}
          onAnswer={mockOnAnswer}
        />
      );
      expect(screen.getByText(middleVerse.verse.arabic)).toBeInTheDocument();
    });
  });
});

