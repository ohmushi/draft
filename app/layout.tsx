import type { Metadata } from "next";
import { Playfair_Display, Newsreader, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Draft",
  description: "un atelier ouvert — code, dessin, musique, et tout le reste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <header>
          <h1 className="site-title">Draft</h1>
          <svg
            className="title-underline"
            viewBox="0 0 200 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 5.5 C30 2, 60 7, 90 4.5 S150 2, 198 5"
              stroke="#C0392B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <p className="site-tagline">
            un atelier ouvert — code, dessin, musique, et tout le reste
          </p>
          <nav>
            <Link href="/" className="active">
              flux
            </Link>
            <Link href="/about">à propos</Link>
          </nav>
        </header>

        <div className="divider">
          <svg
            viewBox="0 0 640 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 6 C80 2, 160 9, 240 5.5 S400 3, 480 6.5 S580 8, 640 5"
              stroke="#1C1A17"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.15"
              fill="none"
            />
          </svg>
        </div>

        {children}

        <footer>
          <span>Draft — atelier ouvert depuis 2026</span>
          <div className="footer-dot" />
          <span>tout est en cours</span>
        </footer>
      </body>
    </html>
  );
}
