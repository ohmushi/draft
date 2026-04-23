import type { Metadata } from "next";
import { Playfair_Display, Newsreader, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import TitleUnderline from "@/components/TitleUnderline";
import WavyDivider from "@/components/WavyDivider";
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
  description: "un atelier ouvert — code, dessin, expériences, et tout le reste",
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
          <TitleUnderline />
          <p className="site-tagline">
            {metadata.description}
          </p>
          <nav>
            <Link href="/" className="active">
              flux
            </Link>
            <Link href="/about">à propos</Link>
          </nav>
        </header>

        <WavyDivider />

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
