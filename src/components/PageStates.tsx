import { Component, useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

/**
 * The states of a page around the routes in App.tsx: loading its code (shown after a moment, so a fast load
 * doesn't flash), its code that didn't load (a new version of the site, or no network) and a route that doesn't exist.
 */

export function PageLoading() {
  const { t } = useI18n();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShown(true), 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="page-loading" role="status" aria-live="polite">
      {shown && (
        <>
          <span className="ai-dots" aria-hidden="true" />
          <span className="sr-only">{t('page.loading')}</span>
        </>
      )}
    </div>
  );
}

function LoadError() {
  const { t } = useI18n();
  return (
    <main className="wrap page-state" role="alert">
      <h1>{t('page.loadError')}</h1>
      <p>{t('page.loadErrorText')}</p>
      <button className="btn" onClick={() => location.reload()}>
        {t('page.reload')}
      </button>
    </main>
  );
}

const RELOADED = 'niflaot:chunk-reload';
/** a lazy page whose file is gone: the site was published again since this tab opened */
const isChunkError = (e: unknown) =>
  /dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically|ChunkLoadError/i.test(
    String((e as Error)?.message ?? e),
  );

/**
 * Catches a page whose code fails to load: once a minute it simply reloads the site (the new version's files are
 * there), otherwise — a message with "Reload". Keyed by the route in App.tsx, so another page starts afresh.
 */
export class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.error(e);
    if (!isChunkError(e)) return;
    try {
      const last = Number(sessionStorage.getItem(RELOADED) ?? 0);
      if (Date.now() - last > 60_000) {
        sessionStorage.setItem(RELOADED, String(Date.now()));
        location.reload();
      }
    } catch {}
  }
  render() {
    return this.state.failed ? <LoadError /> : this.props.children;
  }
}

/** A route that doesn't exist (a mistyped or outdated link): say so and lead home. */
export function NotFound() {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${t('notFound.title')} · ${t('app.title')}`;
  }, [t]);
  return (
    <>
      <TopBar title={t('notFound.title')} share={false} />
      <main className="wrap page-state">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <a className="btn" href="#/">
          {t('notFound.home')}
        </a>
      </main>
      <Colophon />
    </>
  );
}
