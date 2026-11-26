import '@fontsource/frank-ruhl-libre/400.css';
import { useKeepAwake } from '../core/keepAwake';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadView, saveView, stripTaamim, type View } from '../core/reading';
import { translitSiddurToken } from '../core/tehillimTranslit';
import { markStudied } from '../core/habit';
import type { Prayer } from '../core/siddur';
import { todaysConds } from '../core/siddurDay';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';
import { ReadingSettings, useReadingLook } from './ReadingSettings';
import { GO_KEY, PRAYER_KEY, ReadingMenu, sectionId, type SectionName, type TrLang } from './ReadingMenu';

/** Только слова молитвы — собирает `scripts/build-siddur.py` из JSON сидура (без указаний и пояснений). */
const textUrl = (prayer: Prayer) => `/reading/siddur/${prayer}-he.json`;
const SOURCE_URL = 'https://www.sefaria.org/Weekday_Siddur_Chabad';
const HEBREW_WORD = /[\u05D0-\u05EA\uFB1D-\uFB4F][\u05D0-\u05EA\u05BE\uFB1D-\uFB4F\u0591-\u05C7\u05F0-\u05F4'"]*/gu;

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

/** Слово молитвы: номер по всему Шахариту (для подсветки), иврит, знаки после него, начинает ли фразу. */
interface Word {
  i: number;
  he: string;
  gap: string;
  start: boolean;
  /** пометки перед словом (Амида: «зимой», «в пост»…) — ключи `siddur.note.<ключ>`; не слова, не подсвечиваются */
  notes?: string[];
  /** первое слово благословения Амиды — с большой первой буквой */
  big?: boolean;
}
interface Line {
  lead: string;
  words: Word[];
  first: number;
  last: number;
  /** пометки после последнего слова строки */
  tail?: string[];
  /** строка начинает отдельную молитву или благословение — черта над ней */
  sep?: boolean;
  /** название молитвы над чертой — ключ `siddur.p.<ключ>` (Кадиш, Ашрей, Алейну…) */
  label?: string;
}

/**
 * Разметка текста (`build-siddur.py`): ⟦ключ⟧ — пометка (`siddur.note.<ключ>`); ⟦?усл⟧ … ⟦/⟧ — вставка, которую говорят, только когда
 * условие выполнено (⟦?!усл⟧ — когда нет); условия на сегодня — `todaysConds` (`src/core/siddurDay.ts`).
 */
/**
 * Начало отдельной молитвы — черта и большая первая буква, без подписи (владелец, 25.11.2026): ⟦b1⟧…⟦b19⟧, ⟦after⟧ — благословения
 * Амиды, ⟦p⟧ — молитвы и благословения других разделов; ⟦pr-<ключ>⟧ — то же с названием над чертой (`siddur.p.<ключ>`). Название — не слово.
 */
const BLESSING = /^(b\d+|after|p)$/;
const PRAYER_NAME = /^pr-([a-z-]+)$/;
const TOKEN = new RegExp(`⟦\\?(!?)([a-z0-9]+)⟧|⟦/⟧|⟦([a-z0-9-]+)⟧|${HEBREW_WORD.source}`, 'gu');
/** что показывать: условия дня; `null` — всё, как в сидуре (с пометками) */
type Shown = ReadonlySet<string> | null;

/** Строки на слова; начало строки и фразы (после «:» и «.») — с большой буквы в транслите. Вставки не на сегодня — пропускаются. */
function splitLines(sections: ShacharitText['sections'], shown: Shown): Line[][] {
  let n = 0;
  return sections.map((section) =>
    section.lines
      .map((text): Line => {
        const stack: boolean[] = [];
        const visible = () => stack.every(Boolean);
        const words: Word[] = [];
        let lead = '';
        let pending: string[] = [];
        let big = false;
        let sep = false;
        let label: string | undefined;
        let start = true;
        let pos = 0;
        const text_ = (raw: string) => {
          if (!visible() || !raw) return;
          const last = words.at(-1);
          if (last) last.gap += raw;
          else lead += raw;
        };
        for (const m of text.matchAll(TOKEN)) {
          text_(text.slice(pos, m.index));
          pos = (m.index ?? 0) + m[0].length;
          if (m[2] !== undefined) stack.push(shown === null || shown.has(m[2]) !== (m[1] === '!'));
          else if (m[0] === '⟦/⟧') stack.pop();
          else if (m[3] !== undefined) {
            if (visible()) {
              const name = PRAYER_NAME.exec(m[3]);
              if (BLESSING.test(m[3]) || name) {
                big = true;
                if (!words.length) sep = true;
                if (name && !words.length) label = name[1];
              } else pending.push(m[3]);
            }
          } else if (visible()) {
            const prev = words.at(-1);
            if (prev) start = /[:.]/.test(prev.gap);
            // «׃» (соф пасук) — не часть слова, а конец стиха: «:» в иврите, точка в транслите и переводе
            const sof = m[0].endsWith('׃');
            words.push({ i: n++, he: sof ? m[0].slice(0, -1) : m[0], gap: sof ? ':' : '', start: start || big, ...(pending.length ? { notes: pending } : {}), ...(big ? { big } : {}) });
            pending = [];
            big = false;
          }
        }
        text_(text.slice(pos));
        const clean = (x: string) => x.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').trim();
        for (const w of words) w.gap = clean(w.gap);
        return {
          lead: clean(lead),
          words,
          first: words[0]?.i ?? n,
          last: words.at(-1)?.i ?? n,
          ...(pending.length ? { tail: pending } : {}),
          ...(sep ? { sep } : {}),
          ...(label ? { label } : {}),
        };
      })
      .filter((line) => line.words.length > 0),
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
  maariv: { url: '/reading/siddur/maariv-de.json' },
};
const glossOf = (glossary: Record<string, string>, words: Word[], k: number) => {
  const w = normalizeGlossWord(words[k].he);
  const next = words[k + 1];
  return (next && glossary[`${w} ${normalizeGlossWord(next.he)}`]) ?? glossary[w] ?? '…';
};


/**
 * Пометки сидура: когда говорят вставку (зимой, в пост, в Рош ходеш…) и номер благословения Амиды. Только пояснение —
 * не слова молитвы: без `data-i`, не подсвечиваются и не читаются в транслите.
 */
function Notes({ keys }: { keys: string[] }) {
  const { t } = useI18n();
  return (
    <>
      {keys.map((k, i) => (
        <span key={i} className="sd-note" dir="auto">
          {t(`siddur.note.${k}` as MessageKey)}
        </span>
      ))}{' '}
    </>
  );
}

const PrayerLine = memo(function PrayerLine({ line, tr, lang, pron, taamim, dir, active, past, onTap, translate = false, glossary = {} }: LineProps) {
  const he = (x: string) => (taamim ? x : stripTaamim(x));
  const trs = useMemo(
    () => (tr === 'he' ? [] : line.words.map((w) => (w.start ? cap : (x: string) => x)(translitSiddurToken(stripTaamim(w.he), lang, pron)))),
    [line, tr, lang, pron],
  );
  const cls = (w: Word) => `rd-w${w.big ? ' sd-big' : ''}${w.i === active ? ' rd-on' : past || (active >= 0 && w.i < active) ? ' rd-past' : ''}`;
  if (tr === 'he' && !translate)
    return (
      <div className="shacharit-line he" dir="rtl" lang="he">
        {line.lead && `${line.lead} `}
        {line.words.map((w) => (
          <span key={w.i}>
            {w.notes && <Notes keys={w.notes} />}
            <span data-i={w.i} className={cls(w)} onClick={() => onTap(w.i)}>
              {he(w.he)}
            </span>
            {w.gap}{' '}
          </span>
        ))}
        {line.tail && <Notes keys={line.tail} />}
      </div>
    );
  return (
    <div className={`shacharit-line shacharit-duo${tr === 'tr' ? ' shacharit-tr' : ''}`} dir={dir} lang={lang}>
      {line.words.map((w, k) => (
        <span key={w.i}>
          {w.notes && <Notes keys={w.notes} />}
          <span data-i={w.i} className={`shacharit-word ${cls(w)}`} onClick={() => onTap(w.i)}>
            <span className="shacharit-word-tr" dir="ltr">
              {(translate ? (w.big ? cap : (x: string) => x)(glossOf(glossary, line.words, k)) : trs[k]) +
                (k === line.words.length - 1 ? w.gap.replace(/:$/, '.') : w.gap)}
            </span>
            {(tr === 'duo' || (translate && tr === 'he')) && (
              <span className="shacharit-word-he he" dir="rtl" lang="he">
                {he(w.he)}
              </span>
            )}
          </span>{' '}
        </span>
      ))}
      {line.tail && <Notes keys={line.tail} />}
    </div>
  );
});


export function ShacharitPage({ prayer = 'shacharit' }: { prayer?: Prayer }) {
  const { t, locale, ui } = useI18n();
  const [status, setStatus] = useState<TextStatus>('loading');
  const [data, setData] = useState<ShacharitText | null>(null);
  const [germanGlossary, setGermanGlossary] = useState<Record<string, string>>({});
  // те же настройки, что у Теґилим (`niflaot:reading-view`); звука пока нет
  const [view, setView] = useState<View>(loadView);
  useReadingLook(view);
  const readerRef = useRef<HTMLElement>(null);
  const [fullscreenFallback, setFullscreenFallback] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const active = document.fullscreenElement === readerRef.current;
      setIsFullscreen(active);
      if (!document.fullscreenElement) setFullscreenFallback(false);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = readerRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      await document.exitFullscreen?.();
      return;
    }
    if (document.fullscreenElement) await document.exitFullscreen?.();
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        setFullscreenFallback(true);
        setIsFullscreen(true);
      }
    } else {
      setFullscreenFallback(true);
      setIsFullscreen(true);
    }
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenFallback) {
        setFullscreenFallback(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [fullscreenFallback]);

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

  const sections = useMemo(() => (data ? data.sections.map((section, index) => ({ ...section, id: sectionId(index) })) : []), [data]);
  // вставки Амиды — по календарю на сегодня; «Показать все вставки» — весь текст сидура с пометками
  const [allInserts, setAllInserts] = useState(false);
  const shown = useMemo<Shown>(() => (allInserts ? null : todaysConds(prayer)), [allInserts, prayer]);
  const lines = useMemo(() => (data ? splitLines(data.sections, shown) : []), [data, shown]);
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
      <main ref={readerRef} className={`wrap rd shacharit-page${(view.tr === 'duo' || (view.tr === 'he' && view.glossLang === 'de')) && view.trBig === 'he' ? ' shacharit-hebig' : ''}${fullscreenFallback ? ' sd-fullscreen-fallback' : ''}`}>
        {/* «☰ Разделы» и «⚙ Настройки чтения» — сразу под верхней панелью, заголовки ниже (владелец, 26.11.2026) */}
        <div className="rd-corner no-print">
          <ReadingMenu prayer={prayer} sections={sections} onGo={scrollTo} />
          <div className="sd-reader-actions">
            <ReadingSettings view={view} setV={setV} audio={false} living={false} layout />
            <button type="button" className="sd-fullscreen-btn" onClick={() => void toggleFullscreen()} aria-label="Полноэкранный режим" title="Полноэкранный режим" aria-pressed={isFullscreen}>⛶</button>
          </div>
        </div>
        <header className="tk-head">
          <p className="tk-kicker">{t('reading.siddur')}</p>
          <h1>{t(PRAYER_KEY[prayer])}</h1>
          {status === 'loading' && <p className="rd-note" role="status">{t('reading.shacharitChecking')}</p>}
          {status === 'missing' && <p className="rd-note" role="status">{t('reading.shacharitMissing')}</p>}
          {status === 'error' && <p className="rd-note" role="alert">{t('reading.shacharitError')}</p>}
        </header>
        {status === 'ready' && data && (
          <>
            <p className="rd-hint no-print">{t('shn.tap')}</p>
            {/* вставки по календарю — одна строка на всю молитву (Амида, Таханун, Песнь дня, Биркат ґа-мазон…) */}
            {sections.some((x) => x.lines.some((l) => l.includes('⟦?'))) && (
              <p className="sd-auto no-print">
                <span>{t(allInserts ? 'siddur.allNote' : 'siddur.auto')}</span>{' '}
                <button type="button" className="sd-auto-btn" onClick={() => setAllInserts((x) => !x)}>
                  {t(allInserts ? 'siddur.showToday' : 'siddur.showAll')}
                </button>
              </p>
            )}
            <article className="shacharit-text">
              {sections.map((section, si) => (
                <section className="shacharit-section" id={section.id} key={section.id}>
                  {lines[si].length > 0 && (
                    <h2 className="shacharit-h">
                      <span dir="rtl" lang="he">{section.title}</span>
                      {ui !== 'he' && section.t?.[translitLang] && <small>{section.t[translitLang]}</small>}
                    </h2>
                  )}
                  {lines[si].map((line, index) => (
                    <div key={index} className={`shacharit-prayer${line.sep ? ' sd-sep' : ''}`}>
                      {line.label && (
                        <div className="sd-bless" dir="auto">
                          {t(`siddur.p.${line.label}` as MessageKey)}
                        </div>
                      )}
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
            <button
              type="button"
              className="sd-fullscreen-exit"
              onClick={() => void toggleFullscreen()}
              aria-label="Выйти из полноэкранного режима"
              title="Выйти из полноэкранного режима"
            >
              <span aria-hidden="true">✕</span>
            </button>
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
                <button
                  type="button"
                  className="rd-rate sd-rate-button"
                  onClick={() => setRate((current) => HIGHLIGHT_RATES[(HIGHLIGHT_RATES.indexOf(current) + 1) % HIGHLIGHT_RATES.length])}
                  aria-label={t('reading.speed')}
                  title={t('reading.speed')}
                >
                  {rate}×
                </button>
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
