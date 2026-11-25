import '@fontsource/noto-serif-hebrew/400.css';
import { useKeepAwake } from '../core/keepAwake';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadView, saveView, stripTaamim, type View } from '../core/reading';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { markStudied } from '../core/habit';
import { PRAYERS, type Prayer } from '../core/siddur';
import { useI18n } from '../i18n';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';
import { ReadingSettings } from './ReadingSettings';
import { Icon, useDismiss } from './ui';

/** Только слова молитвы — собирает `scripts/build-siddur.py` из JSON сидура (без указаний и пояснений). */
const PRAYER_KEY = { shacharit: 'reading.shacharit', mincha: 'reading.mincha', maariv: 'reading.maariv', 'birkat-hamazon': 'reading.birkat' } as const;
const textUrl = (prayer: Prayer) => `/reading/siddur/${prayer}-he.json`;
const SOURCE_URL = 'https://www.sefaria.org/Weekday_Siddur_Chabad';
const HEBREW_WORD = /[\u05D0-\u05EA\uFB1D-\uFB4F][\u05D0-\u05EA\u05BE\uFB1D-\uFB4F\u0591-\u05C7\u05F0-\u05F4'"]*/gu;

type SectionName = { title: string; t?: Partial<Record<TrLang, string>> };
interface ShacharitText {
  version: string;
  sections: ({ key: string; lines: string[] } & SectionName)[];
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

const HIGHLIGHT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5];
type TrLang = 'ru' | 'en' | 'de';
/** раздел, к которому прокрутить после перехода на другую молитву из меню «Разделы» */
const GO_KEY = 'niflaot:siddur-go';
const sectionId = (i: number) => `shacharit-section-${i + 1}`;
/** названия разделов всех молитв для меню — `index.json` (`build-siddur.py`) */
let indexLoad: Promise<Record<string, SectionName[]>> | null = null;
const loadIndex = () =>
  (indexLoad ??= fetch('/reading/siddur/index.json')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))) as Promise<Record<string, SectionName[]>>;

/** Слово молитвы: номер по всему Шахариту (для подсветки), иврит, знаки после него, начинает ли фразу. */
interface Word {
  i: number;
  he: string;
  gap: string;
  start: boolean;
}
interface Line {
  lead: string;
  words: Word[];
  first: number;
  last: number;
}

/** Строки на слова; начало строки и фразы (после «:» и «.») — с большой буквы в транслите. */
function splitLines(sections: ShacharitText['sections']): Line[][] {
  let n = 0;
  return sections.map((section) =>
    section.lines.map((text) => {
      const found = [...text.matchAll(HEBREW_WORD)];
      let start = true;
      const words = found.map((m, k) => {
        const end = (m.index ?? 0) + m[0].length;
        const gap = text.slice(end, found[k + 1]?.index ?? text.length).trim();
        const w = { i: n++, he: m[0], gap, start };
        start = /[:.]/.test(gap);
        return w;
      });
      return { lead: text.slice(0, found[0]?.index ?? text.length).trim(), words, first: words[0]?.i ?? n, last: (words.at(-1)?.i ?? n) };
    }),
  );
}

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

interface LineProps {
  line: Line;
  tr: View['tr'];
  lang: TrLang;
  pron: View['pron'];
  taamim: boolean;
  dir: View['trDir'];
  /** номер подсвеченного слова в этой строке, иначе -1 */
  active: number;
  /** вся строка уже прочитана */
  past: boolean;
  onTap: (i: number) => void;
  translate?: boolean;
  glossary?: Record<string, string>;
}

/**
 * Строка молитвы. Иврит — справа налево; с транслитом — слово крупно и под ним иврит (или наоборот, `trBig` — классом страницы),
 * направление строки — по выбору (`trDir`). Нажатие на слово — подсветка с него, прочитанные — бледнее.
 */
const normalizeGlossWord = (x: string) => x.normalize('NFD').replace(/[\u0591-\u05C7]/g, '').replace(/[־]/g, '');

/**
 * Пословный немецкий перевод: файл и разделы молитвы, где он есть. Ключ словаря — слово без огласовок (слова через макаф — одно);
 * ключ «слово следующее» — значение слова перед этим следующим (אל תשיבנו — «nicht», а не «G-tt»).
 */
const GLOSS_DE: Partial<Record<Prayer, { url: string; sections?: string[] }>> = {
  shacharit: { url: '/reading/siddur/morning-blessings-de.json', sections: ['Shacharit/Morning Blessings'] },
  mincha: { url: '/reading/siddur/mincha-de.json' },
};
const glossOf = (glossary: Record<string, string>, words: Word[], k: number) => {
  const w = normalizeGlossWord(words[k].he);
  const next = words[k + 1];
  return (next && glossary[`${w} ${normalizeGlossWord(next.he)}`]) ?? glossary[w] ?? '…';
};

const PrayerLine = memo(function PrayerLine({ line, tr, lang, pron, taamim, dir, active, past, onTap, translate = false, glossary = {} }: LineProps) {
  const he = (x: string) => (taamim ? x : stripTaamim(x));
  const trs = useMemo(
    () => (tr === 'he' ? [] : line.words.map((w) => (w.start ? cap : (x: string) => x)(translitSiddurToken(stripTaamim(w.he), lang, pron)))),
    [line, tr, lang, pron],
  );
  const cls = (w: Word) => `rd-w${w.i === active ? ' rd-on' : past || (active >= 0 && w.i < active) ? ' rd-past' : ''}`;
  if (tr === 'he' && !translate)
    return (
      <div className="shacharit-line he" dir="rtl" lang="he">
        {line.lead && `${line.lead} `}
        {line.words.map((w) => (
          <span key={w.i}>
            <span data-i={w.i} className={cls(w)} onClick={() => onTap(w.i)}>
              {he(w.he)}
            </span>
            {w.gap}{' '}
          </span>
        ))}
      </div>
    );
  return (
    <div className={`shacharit-line shacharit-duo${tr === 'tr' ? ' shacharit-tr' : ''}`} dir={dir} lang={lang}>
      {line.words.map((w, k) => (
        <span key={w.i}>
          <span data-i={w.i} className={`shacharit-word ${cls(w)}`} onClick={() => onTap(w.i)}>
            <span className="shacharit-word-tr" dir="ltr">
              {(translate ? glossOf(glossary, line.words, k) : trs[k]) + w.gap}
            </span>
            {(tr === 'duo' || (translate && tr === 'he')) && (
              <span className="shacharit-word-he he" dir="rtl" lang="he">
                {he(w.he)}
              </span>
            )}
          </span>{' '}
        </span>
      ))}
    </div>
  );
});

/**
 * Меню сидура (левый верхний угол): все молитвы и их разделы — на языке сайта, мелко иврит (владелец, 18.11.2026: «меню сидура
 * на языке пользователя и полное, чтобы перейти на любую молитву»); раздел этой молитвы — прокрутка, другой — её страница на этом месте.
 */
function SectionsMenu({ prayer, sections, onGo }: { prayer: Prayer; sections: ({ id: string } & SectionName)[]; onGo: (id: string) => void }) {
  const { t, locale, ui } = useI18n();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(sections[0]?.id ?? '');
  const [index, setIndex] = useState<Record<string, SectionName[]>>({});
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  useEffect(() => {
    let live = true;
    void loadIndex().then((x) => live && setIndex(x));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const onScroll = () => {
      let id = sections[0]?.id ?? '';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 160) id = s.id;
      }
      setCurrent(id);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);
  // открыли меню — список сразу на этой молитве
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const head = list?.querySelector<HTMLElement>('.shacharit-menu-now');
    if (list && head) list.scrollTop = head.offsetTop - 6;
  }, [open]);
  const lang: TrLang = locale === 'ru' || locale === 'de' ? locale : 'en';
  const nameOf = (s: SectionName) => (ui === 'he' ? s.title : s.t?.[lang] ?? s.title);
  const now = sections.find((s) => s.id === current);
  const go = (p: Prayer, i: number) => {
    close();
    if (p === prayer) onGo(sectionId(i));
    else {
      try {
        sessionStorage.setItem(GO_KEY, String(i));
      } catch {
        /* без хранилища — откроется начало молитвы */
      }
      location.hash = `#/reading/siddur/${p}`;
    }
  };
  return (
    <div className="tk-view rd-set shacharit-menu" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">☰</span>
        <span>
          {t('reading.siddurContents')}
          {now && <small>{` · ${nameOf(now)}`}</small>}
        </span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div ref={listRef} className="lang-list tk-view-list rd-set-list shacharit-menu-list" role="menu" aria-label={t('reading.siddurContents')}>
          {PRAYERS.map((p, pi) => {
            const list: SectionName[] = p === prayer ? sections : index[p] ?? [];
            return (
              <div key={p} role="group" aria-label={t(PRAYER_KEY[p])}>
                {pi > 0 && <div className="tk-view-sep" />}
                <div className={`tk-view-head${p === prayer ? ' shacharit-menu-now' : ''}`}>{t(PRAYER_KEY[p])}</div>
                {list.map((s, i) => {
                  const on = p === prayer && sectionId(i) === current;
                  return (
                    <button key={i} type="button" role="menuitemradio" aria-checked={on} onClick={() => go(p, i)}>
                      <span className="name">
                        {nameOf(s)}
                        {ui !== 'he' && (
                          <small className="rd-set-d he" dir="rtl" lang="he">
                            {s.title}
                          </small>
                        )}
                      </span>
                      {on && <Icon name="check" size={16} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ShacharitPage({ prayer = 'shacharit' }: { prayer?: Prayer }) {
  const { t, locale, ui } = useI18n();
  const [status, setStatus] = useState<TextStatus>('loading');
  const [data, setData] = useState<ShacharitText | null>(null);
  const [germanGlossary, setGermanGlossary] = useState<Record<string, string>>({});
  // те же настройки, что у Теґилим (`niflaot:reading-view`); звука пока нет
  const [view, setView] = useState<View>(loadView);

  useEffect(() => {
    let active = true;
    const gloss = GLOSS_DE[prayer];
    if (gloss && view.glossLang === 'de') {
      fetch(gloss.url)
        .then((r) => (r.ok ? r.json() : {}))
        .then((x: unknown) => { if (active && x && typeof x === 'object') setGermanGlossary(x as Record<string, string>); })
        .catch(() => { if (active) setGermanGlossary({}); });
    } else setGermanGlossary({});
    fetch(textUrl(prayer))
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
  }, [prayer, view.glossLang]);

  // переход из меню «Разделы» другой молитвы: прокрутить к выбранному разделу, иначе — к началу
  useEffect(() => {
    if (status !== 'ready') return;
    let go: string | null = null;
    try {
      go = sessionStorage.getItem(GO_KEY);
      sessionStorage.removeItem(GO_KEY);
    } catch {
      /* нет хранилища */
    }
    requestAnimationFrame(() => {
      if (go !== null) document.getElementById(sectionId(Number(go)))?.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
    });
  }, [status]);

  useEffect(() => {
    document.title = `${t(PRAYER_KEY[prayer])} · ${t('reading.siddur')} · ${t('app.title')}`;
  }, [t, prayer]);

  const sections = data
    ? data.sections.map((section, index) => ({ ...section, id: sectionId(index) }))
    : [];
  const lines = useMemo(() => (data ? splitLines(data.sections) : []), [data]);
  const words = useMemo(() => lines.flat().flatMap((l) => l.words), [lines]);
  const translitLang: TrLang = locale === 'ru' || locale === 'de' ? locale : 'en';

  // подсветка, как в «Шнаим микра»: нажатие на слово — с него; ▶ — дальше сама, по длине слова и скорости
  const [active, setActive] = useState(-1);
  const [hl, setHl] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  useKeepAwake(hl === 'playing');
  const [rate, setRate] = useState(1);
  const remainingMs = useRef<number | null>(null);
  const deadline = useRef(0);
  const total = words.length;
  useEffect(() => {
    if (hl !== 'playing' || active < 0) return;
    const letters = (words[active]?.he ?? '').replace(/[^א-ת]/g, '').length;
    const duration = remainingMs.current ?? (220 + Math.max(1, letters) * 90) / rate;
    remainingMs.current = null;
    deadline.current = Date.now() + duration;
    const timer = window.setTimeout(() => {
      if (active + 1 >= total) {
        setHl('stopped');
        markStudied();
        return;
      }
      setActive(active + 1);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [active, hl, rate, total, words]);
  useEffect(() => {
    if (active < 0) return;
    document.querySelector(`.shacharit-text [data-i="${active}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active]);
  const onTap = useCallback(
    (i: number) => {
      remainingMs.current = null;
      setActive(i);
      if (i === total - 1) markStudied();
    },
    [total],
  );
  const play = () => {
    if (hl === 'playing') {
      remainingMs.current = Math.max(0, deadline.current - Date.now());
      setHl('paused');
      return;
    }
    if (hl === 'stopped' && (active < 0 || active >= total - 1)) setActive(0);
    remainingMs.current = hl === 'paused' ? remainingMs.current : null;
    setHl('playing');
  };
  const stop = () => {
    remainingMs.current = null;
    setHl('stopped');
    setActive(-1);
  };
  const hlLabel = t(hl === 'playing' ? 'shn.pauseHighlight' : hl === 'paused' ? 'shn.resumeHighlight' : 'shn.startHighlight');
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
      <main className={`wrap rd shacharit-page${view.big ? ' rd-big' : ''}${view.tr === 'duo' && view.trBig === 'he' ? ' shacharit-hebig' : ''}`}>
        <header className="tk-head">
          <p className="tk-kicker">{t('reading.siddur')}</p>
          <h1>{t(PRAYER_KEY[prayer])}</h1>
          {status === 'loading' && <p className="rd-note" role="status">{t('reading.shacharitChecking')}</p>}
          {status === 'missing' && <p className="rd-note" role="status">{t('reading.shacharitMissing')}</p>}
          {status === 'error' && <p className="rd-note" role="alert">{t('reading.shacharitError')}</p>}
        </header>
        {status === 'ready' && data && (
          <>
            {/* меню сидура — всегда в левом верхнем углу, настройки чтения — в правом (владелец, 18.11.2026) */}
            <div className="rd-corner no-print">
              <SectionsMenu prayer={prayer} sections={sections} onGo={scrollTo} />
              <ReadingSettings view={view} setV={setV} audio={false} living={false} layout />
            </div>
            <p className="rd-hint no-print">{t('shn.tap')}</p>
            <article className="shacharit-text">
              {sections.map((section, si) => (
                <section className="shacharit-section" id={section.id} key={section.id}>
                  <h2 className="shacharit-h">
                    <span dir="rtl" lang="he">{section.title}</span>
                    {ui !== 'he' && section.t?.[translitLang] && <small>{section.t[translitLang]}</small>}
                  </h2>
                  {lines[si].map((line, index) => (
                    <div key={index} className="shacharit-prayer">
                      <PrayerLine
                        line={line}
                        tr={view.tr}
                        lang={translitLang}
                        pron={view.pron}
                        taamim={view.taamim}
                        dir={view.trDir}
                        active={active >= line.first && active <= line.last ? active : -1}
                        past={active > line.last}
                        onTap={onTap}
                        translate={view.glossLang === 'de' && !!GLOSS_DE[prayer] && (GLOSS_DE[prayer]?.sections?.includes(section.key) ?? true)}
                        glossary={germanGlossary}
                      />
                    </div>
                  ))}
                </section>
              ))}
            </article>
            {total > 0 && (
              <div className="rd-audio-float no-print" role="group" aria-label={t('shn.highlightControls')}>
                <button type="button" className="btn" onClick={play} aria-label={hlLabel} title={hlLabel}>
                  {hl === 'playing' ? '⏸' : '▶'}
                  <span className="rd-lbl"> {hlLabel}</span>
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={stop}
                  disabled={hl === 'stopped' && active < 0}
                  aria-label={t('reading.stop')}
                  title={t('reading.stop')}
                >
                  <span className="rd-stop-sq" aria-hidden="true" /><span className="rd-lbl"> {t('reading.stop')}</span>
                </button>
                <label className="rd-rate" title={t('reading.speed')}>
                  <span className="sr-only">{t('reading.speed')}</span>
                  <select value={rate} onChange={(e) => setRate(Number(e.target.value))}>
                    {HIGHLIGHT_RATES.map((r) => (
                      <option key={r} value={r}>
                        {r}×
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
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
