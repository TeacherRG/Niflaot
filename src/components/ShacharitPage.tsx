import '@fontsource/noto-serif-hebrew/400.css';
import { useEffect, useState } from 'react';
import { loadView, saveView, stripTaamim, type View } from '../core/reading';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { useI18n } from '../i18n';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';
import { ReadingSettings } from './ReadingSettings';

/** Только слова молитвы — собирает `scripts/build-shacharit.py` из JSON сидура (без указаний и пояснений). */
const TEXT_URL = '/reading/siddur/shacharit-he.json';
const SOURCE_URL = 'https://www.sefaria.org/Weekday_Siddur_Chabad';
const HEBREW_WORD = /[\u05D0-\u05EA\uFB1D-\uFB4F][\u05D0-\u05EA\u05BE\uFB1D-\uFB4F\u0591-\u05C7\u05F0-\u05F4'"]*/gu;

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

/**
 * Транслит слева направо (как «Святое чтение» Теґилим): слово крупно, под ним иврит (`withHe`; «только транслит» — без него); знаки препинания — за словом,
 * начало строки и каждой фразы (после «:» и «.») — с большой буквы.
 */
function transliterateWordsHtml(line: string, lang: 'ru' | 'en' | 'de', pron: View['pron'], withHe = true) {
  const words = [...line.matchAll(HEBREW_WORD)];
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  let start = true;
  let out = escapeHtml(line.slice(0, words[0]?.index ?? line.length).trim());
  words.forEach((m, i) => {
    const word = m[0];
    const end = (m.index ?? 0) + word.length;
    const gap = line.slice(end, words[i + 1]?.index ?? line.length).trim();
    let tr = translitSiddurToken(word, lang, pron);
    if (start) tr = cap(tr);
    start = /[:.]/.test(gap);
    out +=
      `${i ? ' ' : ''}<span class="shacharit-word"><span class="shacharit-word-tr" lang="${lang}">` +
      `${escapeHtml(tr + gap)}</span>` +
      (withHe ? `<span class="shacharit-word-he he" dir="rtl" lang="he">${escapeHtml(word)}</span>` : '') +
      '</span>';
  });
  return out;
}

export function ShacharitPage() {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<TextStatus>('loading');
  const [data, setData] = useState<ShacharitText | null>(null);
  // те же настройки, что у Теґилим (`niflaot:reading-view`); звука пока нет
  const [view, setView] = useState<View>(loadView);

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
      <main className={`wrap rd shacharit-page${view.big ? ' rd-big' : ''}`}>
        <header className="tk-head">
          <p className="tk-kicker">{t('reading.siddur')}</p>
          <h1>{t('reading.shacharit')}</h1>
          {status === 'loading' && <p className="rd-note" role="status">{t('reading.shacharitChecking')}</p>}
          {status === 'missing' && <p className="rd-note" role="status">{t('reading.shacharitMissing')}</p>}
          {status === 'error' && <p className="rd-note" role="alert">{t('reading.shacharitError')}</p>}
        </header>
        {status === 'ready' && data && (
          <>
            <ReadingSettings view={view} setV={setV} audio={false} living={false} />
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
                        {view.tr === 'he' ? (
                          <div className="shacharit-line he" dir="rtl" lang="he">{view.taamim ? line : stripTaamim(line)}</div>
                        ) : (
                          <div
                            className={`shacharit-line shacharit-duo${view.tr === 'tr' ? ' shacharit-tr' : ''}`}
                            dir="ltr"
                            lang={translitLang}
                            dangerouslySetInnerHTML={{
                              __html: transliterateWordsHtml(view.taamim ? line : stripTaamim(line), translitLang, view.pron, view.tr === 'duo'),
                            }}
                          />
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
