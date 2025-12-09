# Quran Memorization App

A modern web application for memorizing the Quran using spaced repetition, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📖 Memorize Quran verses with Arabic text, transliteration, and translation
- ✅ Answer checking with Arabic normalization and transliteration matching
- 📊 Progress tracking and scoring
- 📱 Mobile-first responsive design with proper Arabic RTL support
- 🧪 Comprehensive test coverage (Unit, Integration, E2E)
- 🚀 Ready for deployment on Railway

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library, Playwright
- **State Management**: Zustand (optional)
- **Deployment**: Railway (Docker)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit and integration tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    layout.tsx           # Root layout with Arabic fonts
    page.tsx             # Home page
    play/                # Memorization game
      page.tsx
      complete/          # Completion page
  components/            # React components
    VerseCard.tsx        # Display verse with Arabic RTL
    AnswerInput.tsx      # Answer input field
    Feedback.tsx         # Correct/incorrect feedback
  lib/                   # Core logic
    types.ts             # TypeScript types
    answerChecker.ts     # Answer validation
    spacedRepetition.ts  # SM2 algorithm
    questions.ts         # Question loading
  data/
    surahs/              # Surah data (JSON)
      ad-duha.json       # Surah 93

tests/
  unit/                  # Unit tests
  integration/           # Integration tests
e2e/                     # E2E tests (Playwright)
```

## Arabic Support

The app includes proper Arabic text rendering:

- **Fonts**: Amiri and Noto Sans Arabic loaded from Google Fonts
- **RTL Support**: Proper right-to-left text direction for Arabic verses
- **Normalization**: Arabic diacritics normalization for answer checking
- **Transliteration**: Case-insensitive transliteration matching

## Adding New Surahs

To add a new surah, create a JSON file in `src/data/surahs/` following this structure:

```json
{
  "number": 93,
  "name": "Ad-Duha",
  "nameArabic": "الضحى",
  "verses": [
    {
      "number": 1,
      "arabic": "وَالضُّحَىٰ",
      "transliteration": "Wa ad-duha",
      "translation": "By the morning brightness"
    }
  ]
}
```

Then update `src/lib/questions.ts` to load the new surah.

## Deployment

### Railway

1. Push your code to GitHub
2. Connect your repository to Railway
3. Railway will automatically detect the Dockerfile and deploy
4. Set environment variables if needed (prefixed with `NEXT_PUBLIC_` for client-side)

The app will be available at your Railway-provided URL.

## Testing

### Unit Tests
Tests for pure functions (answer checking, spaced repetition):
```bash
npm test
```

### Integration Tests
Tests for React components:
```bash
npm test
```

### E2E Tests
Full browser tests with mobile emulation:
```bash
npm run test:e2e
```

## License

MIT

