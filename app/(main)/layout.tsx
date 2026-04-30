import Link from "next/link";
import TitleUnderline from "@/components/TitleUnderline";
import WavyDivider from "@/components/WavyDivider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <h1 className="site-title">Draft</h1>
        <TitleUnderline />
        <p className="site-tagline">
          un atelier ouvert — code, dessin, expériences, et tout le reste
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
    </>
  );
}
