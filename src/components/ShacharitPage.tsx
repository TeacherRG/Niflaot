import '@fontsource/noto-serif-hebrew/400.css';
import { useEffect, useState } from 'react';
import { sanitizeHtml } from '../core/sanitize';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { useI18n } from '../i18n';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';

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

function transliterateHtml(html: string, lang: 'ru' | 'en' | 'de') {
  const template = document.createElement('template');
  template.innerHTML = sanitizeHtml(html).replace(/<br\s*\/?>/gi, ' ');
  const text = template.content.textContent ?? '';
  return text.replace(HEBREW_WORD, (word) => translitSiddurToken(word, lang));
}

export function ShacharitPage() {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<TextStatus>('loading');
  const [data, setData] = useState<ShacharitText | null>(null);

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
        .map(([sourceTitle, lines], index) => ({
          title: SECTION_TITLES[sourceTitle] ?? 'תפילה',
          id: `shacharit-section-${index + 1}`,
          lines: lines.filter((line) => line.trim() && line.trim() !== ':'),
        }))
        .filter((section) => section.lines.length > 0)
    : [];
  const translitLang = locale === 'ru' || locale === 'de' ? locale : 'en';
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
                          className="shacharit-line he"
                          dir="rtl"
                          lang="he"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(line) }}
                        />
                        <div className="shacharit-translit" dir="ltr" lang={translitLang}>
                          {transliterateHtml(line, translitLang)}
                        </div>
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
