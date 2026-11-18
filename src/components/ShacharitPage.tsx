import '@fontsource/noto-serif-hebrew/400.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadView, saveView, type View } from '../core/reading';
import { sanitizeHtml } from '../core/sanitize';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { useI18n } from '../i18n';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';
import { Icon, useDismiss } from './ui';

const TEXT_URL = '/reading/siddur/Weekday%20Siddur%20Chabad%20-%20he%20-%20merged.json';
const SOURCE_URL = 'https://www.sefaria.org/Weekday_Siddur_Chabad';
const HEBREW_WORD = /[\u05D0-\u05EA\uFB1D-\uFB4F][\u05D0-\u05EA\u05BE\uFB1D-\uFB4F\u0591-\u05C7\u05F0-\u05F4'"]*/gu;
const SECTION_TITLES: Record<string, string> = {
  'Upon Arising': 'בקימה',
  'Morning Blessings': 'ברכות השחר',
  'Tzitzit and Tallit': 'ציצית וטלית',
  Tefillin: 'תפילין',
  'Morning Prayer': 'תפילת שחרית',
  'Kaddish DeRabbanan': 'קדיש דרבנן',
  Hodu: 'הודו',
  'Pesukei Dezimra': 'פסוקי דזמרה',
  'Blessings of the Shema': 'ברכות קריאת שמע',
  'The Amidah': 'תפילת העמידה',
  Tachnun: 'תחנון',
  'Torah Reading': 'קריאת התורה',
  'Ashrei Uva LeZion': 'אשרי ובא לציון',
  'Song of the Day': 'שיר של יום',
  "Mourner's Kaddish": 'קדיש יתום',
  Kaveh: 'קווה',
  Aleinu: 'עלינו לשבח',
  'Rabbenu Tam': 'תפילין דרבנו תם',
  'Six Remembrances': 'שש זכירות',
};
const PRAYER_SECTIONS = new Set([
  'Morning Blessings',
  'Morning Prayer',
  'Kaddish DeRabbanan',
  'Hodu',
  'Pesukei Dezimra',
  'Blessings of the Shema',
  'The Amidah',
  'Tachnun',
  'Torah Reading',
  'Ashrei Uva LeZion',
  'Song of the Day',
  "Mourner's Kaddish",
  'Kaveh',
  'Aleinu',
]);
const SHACHARIT_TR_MODES = ['he', 'duo'] as const;

interface ShacharitText {
  versionSource: string;
  versions?: string[][];
  language: 'he';
  text: { Shacharit: Record<string, string[]> };
}

type TextStatus = 'loading' | 'ready' | 'missing' | 'error';

function isShacharitText(value: unknown): value is ShacharitText {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const text = record.text;
  if (record.language !== 'he' || typeof record.versionSource !== 'string' || !text || typeof text !== 'object') return false;
  const shacharit = (text as Record<string, unknown>).Shacharit;
  return (
    !!shacharit &&
    typeof shacharit === 'object' &&
    Object.entries(shacharit).every(
      ([title, lines]) =>
        Object.prototype.hasOwnProperty.call(SECTION_TITLES, title) &&
        Array.isArray(lines) &&
        lines.every((line) => typeof line === 'string'),
    )
  );
}

function transliterateWordsHtml(html: string, lang: 'ru' | 'en' | 'de', pron: View['pron']) {
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
  return sanitizeHtml(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(HEBREW_WORD, (word) => (
      `<span class="shacharit-word"><span class="shacharit-word-tr" dir="ltr" lang="${lang}">` +
      `${escapeHtml(translitSiddurToken(word, lang, pron))}</span>` +
      `<span class="shacharit-word-he he" dir="rtl" lang="he">${escapeHtml(word)}</span></span>`
    ));
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
    ? Object.entries(data.text.Shacharit)
        .filter(([sourceTitle]) => PRAYER_SECTIONS.has(sourceTitle))
        .map(([sourceTitle, lines], index) => ({
          title: SECTION_TITLES[sourceTitle] ?? 'תפילה',
          id: `shacharit-section-${index + 1}`,
          lines: lines.filter((line) => line.trim() && line.trim() !== ':'),
        }))
        .filter((section) => section.lines.length > 0)
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
                        <div
                          className={`shacharit-line he${view.tr === 'duo' ? ' shacharit-duo' : ''}`}
                          dir="rtl"
                          lang="he"
                          dangerouslySetInnerHTML={{
                            __html: view.tr === 'duo'
                              ? transliterateWordsHtml(line, translitLang, view.pron)
                              : sanitizeHtml(line),
                          }}
                        />
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
              {t('reading.shacharitSource', { source: data.versions?.[0]?.[0] ?? 'Sefaria' })}{' '}
              <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Sefaria</a>
            </p>
          </>
        )}
        <Colophon />
      </main>
    </>
  );
}
