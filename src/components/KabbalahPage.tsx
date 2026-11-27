import { useEffect } from 'react';
import './KabbalahPage.css';

/** The full interactive Kabbalistic dial, preserved from the supplied HTML source. */
export function KabbalahPage() {
  useEffect(() => {
    document.title = 'Каббалистический циферблат · niflaot.app';
  }, []);

  return (
    <main className="kabbalah-page" aria-label="Каббалистический циферблат">
      <iframe
        className="kabbalah-page-frame"
        src="/kabbalah.html"
        title="Каббалистический циферблат — 12 часов и соответствий"
        loading="eager"
        allow="fullscreen"
      />
    </main>
  );
}
