import '@fontsource/noto-serif-hebrew/400.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadView, saveView, type View } from '../core/reading';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { useI18n } from '../i18n';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';
import { Icon, useDismiss } from './ui';

/** Только слова молитвы — собирает `scripts/build-shacharit.py` из JSON сидура (без указаний и пояснений). */
const TEXT_URL = '/reading/siddur/shacharit-he.json';
const SOURCE_URL = 'https://www.sefaria.org/Weekday_Siddur_Chabad';
const HEBREW_WORD = /[\u05D0-\u05EA\uFB1D-\uFB4F][\u05D0-\u05EA\u05BE\uFB1D-\uFB4F\u0591-\u05C7\u05F0-\u05F4'"]*/gu;
const SHACHARIT_TR_MODES = ['he', 'duo'] as const;

interface ShacharitText {
  version: string;
  sections: { key: string; title: string; lines: string[] }[];
}

type TextStatus = 'loading' | 'ready' | 'missing' | 'error';

function isShacharitText(value: unknown): value is ShacharitText {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.version === 'string' &&
    Array.isArray(record.sections) &&
    record.sections.every(
      (s) =>
        !!s &&
        typeof s === 'object' &&
        typeof (s as Record<string, unknown>).title === 'string' &&
        Array.isArray((s as Record<string, unknown>).lines) &&
        ((s as Record<string, unknown>).lines as unknown[]).every((line) => typeof line === 'string'),
    )
  );
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char] ?? '&#39;'
));

/** Под каждым словом молитвы — его чтение; текст строки — простой текст без тегов. */
function transliterateWordsHtml(line: string, lang: 'ru' | 'en' | 'de', pron: View['pron']) {
  let out = '';
  let last = 0;
  for (const m of line.matchAll(HEBREW_WORD)) {
    const word = m[0];
    out += escapeHtml(line.slice(last, m.index));
    out +=
      `<span class="shacharit-word"><span class="shacharit-word-tr" dir="ltr" lang="${lang}">` +
      `${escapeHtml(translitSiddurToken(word, lang, pron))}</span>` +
      `<span class="shacharit-word-he he" dir="rtl" lang="he">${escapeHtml(word)}</span></span>`;
    last = (m.index ?? 0) + word.length;
  }
  return out + escapeHtml(line.slice(last));
}

export function ShacharitPage() {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<TextStatus>('loading');
  const [data, setData] = useState<ShacharitText | null>(null);
  const [view, setView] = useState<View>(() => {
    const saved = loadView();
    return saved.tr === 'tr' ? { ...saved, tr: 'he' } : saved;
  });
  const [viewOpen, setViewOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const closeView = useCallback(() => setViewOpen(false), []);
  useDismiss(viewOpen, viewRef, closeView);

  useEffect(() => {
    let active = true;
    fetch(TEXT_URL)
      .then(async (response) => {
        if (response.status === 404) {
          if (active) setStatus('missing');
          return;
        }
        if (!response.ok) throw new Error(`Could not load Shacharit text (${response.status})`);
        const content: unknown = await response.json();
        if (!isShacharitText(content)) throw new Error('Invalid Shacharit text data');
        if (active) {
          setData(content);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.title = `${t('reading.shacharit')} · ${t('reading.siddur')} · ${t('app.title')}`;
  }, [t]);

  const sections = data
    ? data.sections.map((section, index) => ({ ...section, id: `shacharit-section-${index + 1}` }))
    : [];
  const translitLang = locale === 'ru' || locale === 'de' ? locale : 'en';
  const setV = (next: View) => {
    setView(next);
    saveView(next);
  };
  const scrollTo = (id: string) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
  };

  return (
    <>
      <TopBar title={t('reading.title')} />
      <main className="wrap rd shacharit-page">
        <header className="tk-head">
          <p className="tk-kicker">{t('reading.siddur')}</p>
          <h1>{t('reading.shacharit')}</h1>
          {status === 'loading' && <p className="rd-note" role="status">{t('reading.shacharitChecking')}</p>}
          {status === 'missing' && <p className="rd-note" role="status">{t('reading.shacharitMissing')}</p>}
          {status === 'error' && <p className="rd-note" role="alert">{t('reading.shacharitError')}</p>}
        </header>
        {status === 'ready' && data && (
          <>
            <div className="tk-view rd-set no-print no-speak" ref={viewRef}>
              <button
                type="button"
                className="lang-btn tk-view-btn"
                aria-haspopup="true"
                aria-expanded={viewOpen}
                onClick={() => setViewOpen((open) => !open)}
              >
                <span aria-hidden="true">⚙</span>
                <span>
                  {t('reading.view')}
                  <small>{` · ${t(`reading.tr.${view.tr}`)}`}</small>
                </span>
                <Icon name="chevron" size={14} />
              </button>
              {viewOpen && (
                <div className="lang-list tk-view-list rd-set-list" role="menu" aria-label={t('reading.view')}>
                  <div className="tk-view-head">{t('reading.tr')}</div>
                  {SHACHARIT_TR_MODES.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      role="menuitemradio"
                      aria-checked={view.tr === mode}
                      onClick={() => {
                        setV({ ...view, tr: mode });
                        setViewOpen(false);
                      }}
                    >
                      <span className="code">{mode === 'he' ? 'אב' : `${t('reading.tr.ab')}+אב`}</span>
                      <span className="name">
                        {t(`reading.tr.${mode}`)}
                        <small className="rd-set-d">{t(`reading.tr.${mode}.d`)}</small>
                      </span>
                      {view.tr === mode && <Icon name="check" size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <nav id="shacharit-contents" className="shacharit-toc" aria-label={t('reading.shacharitContents')}>
              <h2>{t('reading.shacharitContents')}</h2>
              <div>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    dir="rtl"
                    lang="he"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(section.id);
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>
            <article className="shacharit-text">
              {sections.map((section) => (
                <section className="shacharit-section" id={section.id} key={section.id}>
                  <h2 dir="rtl" lang="he">{section.title}</h2>
                  {section.lines.map((line, index) => {
                    return (
                      <div key={index} className="shacharit-prayer">
                        {view.tr === 'duo' ? (
                          <div
                            className="shacharit-line he shacharit-duo"
                            dir="rtl"
                            lang="he"
                            dangerouslySetInnerHTML={{ __html: transliterateWordsHtml(line, translitLang, view.pron) }}
                          />
                        ) : (
                          <div className="shacharit-line he" dir="rtl" lang="he">{line}</div>
                        )}
                      </div>
                    );
                  })}
                  <a
                    className="shacharit-back"
                    href="#shacharit-contents"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo('shacharit-contents');
                    }}
                  >
                    {t('reading.shacharitBack')}
                  </a>
                </section>
              ))}
            </article>
            <p className="shacharit-credit">
              {t('reading.shacharitSource', { source: data.version })}{' '}
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Sefaria</a>
            </p>
          </>
        )}
        <Colophon />
      </main>
    </>
  );
}
