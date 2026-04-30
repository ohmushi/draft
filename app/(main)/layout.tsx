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
        <div className="header-top">
          <h1 className="site-title">Draft</h1>
          <Link href="/studio" className="studio-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            éclair
          </Link>
        </div>
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

      <Link href="/studio" className="fab" aria-label="Nouvelle entrée">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </Link>

      <footer>
        <span>Draft — atelier ouvert depuis 2026</span>
        <div className="footer-dot" />
        <span>tout est en cours</span>
      </footer>
    </>
  );
}
