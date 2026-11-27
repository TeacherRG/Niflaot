import { useEffect, useState } from 'react';
import './KabbalahPage.css';

/** The full interactive Kabbalistic dial, preserved from the supplied HTML source. */
export function KabbalahPage() {
  const [sharedQuery, setSharedQuery] = useState('');

  useEffect(() => {
    document.title = 'Каббалистический циферблат · niflaot.app';

    // The outer app owns the hash route; forward only the shared hour state to the standalone dial.
    const hashQuery = window.location.hash.split('?')[1] ?? '';
    const params = new URLSearchParams(hashQuery);
    const hour = params.get('hour');
    const mode = params.get('mode');
    if (hour && /^([1-9]|1[0-2])$/.test(hour) && (mode === 'day' || mode === 'night')) {
      setSharedQuery(`?hour=${hour}&mode=${mode}`);
    }
  }, []);

  return (
    <main className="kabbalah-page" aria-label="Каббалистический циферблат">
      <iframe
        className="kabbalah-page-frame"
        src={`/kabbalah.html${sharedQuery}`}
        title="Каббалистический циферблат — 12 часов и соответствий"
        loading="eager"
        allow="fullscreen"
      />
    </main>
  );
}
