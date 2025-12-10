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
            className="block w-full py-4 rounded-lg text-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Memorizing
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Surahs
          </h2>
          <div className="text-left space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">Surah Ad-Duha</div>
                <div className="text-sm text-gray-600">الضحى • 11 verses</div>
              </div>
              <Link
                href="/play"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Play →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

