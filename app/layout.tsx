import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ThemedToaster from "@/components/ThemedToaster";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AppAssetGen — every app icon, one upload",
  description:
    "Upload one icon, get every iOS, Android, Web, and Windows size in an organized ZIP. Runs entirely in your browser.",
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* Ensure favicon matches header tile icon and bypass cache */}
        <link rel="icon" href="/icon.svg?v=4" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg?v=4" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased font-mono">
        <ThemeProvider>
          {children}
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
