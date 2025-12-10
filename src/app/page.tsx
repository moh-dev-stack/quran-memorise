import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 english-text">Quran Memorization</h1>
        <p className="text-gray-600 mb-8 english-text">Memorize the Quran with spaced repetition</p>

        <div className="space-y-4">
          <Link
            href="/play"
            className="block w-full py-4 rounded-lg text-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg english-text"
          >
            Start Memorizing
          </Link>
        </div>
      </div>
    </main>
  );
}

