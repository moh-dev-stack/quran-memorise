import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LearningPathSelector from "@/components/words/LearningPathSelector";
import { getAllLearningPaths } from "@/lib/wordLearningPaths";
import type { LearningPath } from "@/lib/wordTypes";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("Learning Path Flow Integration Tests", () => {
  let mockOnSelectPath: ReturnType<typeof vi.fn>;
  let mockOnBack: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSelectPath = vi.fn();
    mockOnBack = vi.fn();
  });

  describe("LearningPathSelector Component", () => {
    it("should display all available learning paths", () => {
      const paths = getAllLearningPaths();
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      paths.forEach((path) => {
        expect(screen.getByText(path.name)).toBeInTheDocument();
        expect(screen.getByText(path.description)).toBeInTheDocument();
      });
    });

    it("should display word count for each path", () => {
      const paths = getAllLearningPaths();
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      paths.forEach((path) => {
        const words = path.getWords();
        expect(screen.getByText(new RegExp(`${words.length} words`))).toBeInTheDocument();
      });
    });

    it("should call onSelectPath when a path is clicked", () => {
      const paths = getAllLearningPaths();
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      const firstPathButton = screen.getByText(paths[0].name).closest("button");
      if (firstPathButton) {
        fireEvent.click(firstPathButton);
        expect(mockOnSelectPath).toHaveBeenCalledWith(paths[0]);
      }
    });

    it("should highlight selected path", () => {
      const paths = getAllLearningPaths();
      const selectedPath = paths[0];

      render(
        <LearningPathSelector
          selectedPath={selectedPath}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      const selectedButton = screen.getByText(selectedPath.name).closest("button");
      expect(selectedButton).toHaveClass("bg-blue-600");
    });

    it("should call onBack when back button is clicked", () => {
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByText(/← Back to Home/i);
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Path Selection Flow", () => {
    it("should allow selecting different paths", () => {
      const paths = getAllLearningPaths();
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      // Select first path
      const firstPathButton = screen.getByText(paths[0].name).closest("button");
      if (firstPathButton) {
        fireEvent.click(firstPathButton);
        expect(mockOnSelectPath).toHaveBeenCalledWith(paths[0]);
      }

      // Select second path
      const secondPathButton = screen.getByText(paths[1].name).closest("button");
      if (secondPathButton) {
        fireEvent.click(secondPathButton);
        expect(mockOnSelectPath).toHaveBeenCalledWith(paths[1]);
      }
    });

    it("should show correct word counts for frequency-based paths", () => {
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      // Top 50 should show 50 words
      expect(screen.getByText(/50 words/i)).toBeInTheDocument();
    });

    it("should show correct word counts for part-of-speech paths", () => {
      const paths = getAllLearningPaths();
      const verbsPath = paths.find((p) => p.id === "verbs");
      const nounsPath = paths.find((p) => p.id === "nouns");
      const particlesPath = paths.find((p) => p.id === "particles");

      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      if (verbsPath) {
        const verbsCount = verbsPath.getWords().length;
        expect(screen.getByText(new RegExp(`${verbsCount} words`))).toBeInTheDocument();
      }

      if (nounsPath) {
        const nounsCount = nounsPath.getWords().length;
        expect(screen.getByText(new RegExp(`${nounsCount} words`))).toBeInTheDocument();
      }

      if (particlesPath) {
        const particlesCount = particlesPath.getWords().length;
        expect(screen.getByText(new RegExp(`${particlesCount} words`))).toBeInTheDocument();
      }
    });
  });

  describe("Path Information Display", () => {
    it("should display path name and description", () => {
      const paths = getAllLearningPaths();
      render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      paths.forEach((path) => {
        expect(screen.getByText(path.name)).toBeInTheDocument();
        expect(screen.getByText(path.description)).toBeInTheDocument();
      });
    });

    it("should show visual indicator for selected path", () => {
      const paths = getAllLearningPaths();
      const selectedPath = paths[0];

      const { rerender } = render(
        <LearningPathSelector
          selectedPath={null}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      rerender(
        <LearningPathSelector
          selectedPath={selectedPath}
          onSelectPath={mockOnSelectPath}
          onBack={mockOnBack}
        />
      );

      const selectedButton = screen.getByText(selectedPath.name).closest("button");
      expect(selectedButton).toHaveClass("bg-blue-600");
    });
  });
});

