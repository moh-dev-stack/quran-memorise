import type { Metadata, Viewport } from "next";
import "./globals.css";
import FontSizeControl from "@/components/FontSizeControl";

export const metadata: Metadata = {
  title: "Quran Memorization",
  description: "Memorize the Quran with spaced repetition",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quran Memorization",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-gray-50 safe-area-inset">
        <FontSizeControl />
        <div style={{ paddingTop: 'calc(max(env(safe-area-inset-top), 0.5rem) + 3.5rem)' }}>{children}</div>
      </body>
    </html>
  );
}

