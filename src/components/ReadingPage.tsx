import '@fontsource/noto-serif-hebrew/400.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n, uiLang } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { NotFound, PageLoading } from './PageStates';
import { Icon, Sheet, useDismiss } from './ui';
import { hebrewNumber } from '../core/hebrewDate';
import { markStudied, todayIso, useHabit } from '../core/habit';
import { earn } from '../core/coins';
import { useHebrewLevel } from '../core/hebrewLevel';
import { resumeVoice, setVoicePitch } from '../core/voicePitch';
import { isAdmin } from '../admin/github';
import { PRONS, TR_MODES, translitToken } from '../core/tehillimTranslit';
import {
  CHAPTERS,
  PLAY_MODES,
  chapterAudioTracks,
  currentHebrewDay,
  dailyPortion,
  loadHaazinu,
  loadChapter,
  loadIndex,
  loadView,
  markedTimes,
  loadAutoTimes,
  personalPsalms,
  saveTimes,
  savePersonalPsalms,
  saveView,
  shortHebrewMonth,
  splitLong,
  startTimes,
  stripTaamim,
  todayISO,
  tokens,
  weekdayOf,
  weekdayPortion,
  type ReadingIndex,
  type ReadingId,
  type PersonalPsalm,
  type PsalmPortion,
  type Token,
  type View,
} from '../core/reading';

/** скорость записи — список в плеере */
const RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5];
interface Tok extends Token {
  /** the verse it belongs to */
  v: number;
}
interface TextSection {
  chapter: number;
  verses: string[];
  firstVerse: number;
  /** «Мои главы»: для кого читается глава */
  label?: string;
}
/** часть подборки: глава (или её часть) и, в «Моих главах», имя */
type Part = PsalmPortion & { label?: string };

/** воскресенье — для названий дней недели */
const SUNDAY = '2026-11-01';
const WEEK_DAYS = 7;

/**
 * «Святое чтение»: порция Теґилим на день еврейского месяца (`#/reading[/day/<день>]`) или отдельная глава
 * (`#/reading/<глава>`). Аудио порции: подсветка идёт за голосом, нажатие на слово — подсветка с него, скорость 0.5–3.5×;
 * режим — «Голос и подсветка», «Только голос» или «Только подсветка» (без звука). «Разметка аудио» — только у админа. Данные — src/core/reading.ts.
 */
export function ReadingPage({ chapter, day }: { chapter?: string; day?: string }) {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  /** 1 — воскресенье … 7 — Шабат */
  const dayName = (n: number) =>
    n === WEEK_DAYS
      ? t('shn.shabbat')
      : new Intl.DateTimeFormat(uiLang(locale), { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.parse(`${SUNDAY}T12:00:00Z`) + (n - 1) * 864e5));
  const haazinu = chapter === 'haazinu';
  const week = chapter === 'week';
  const mine = chapter === 'mine';
  const daily = chapter === undefined;
  const single = !haazinu && !week && !mine && !daily;
  const currentDay = currentHebrewDay();
  const dailyDay = day === undefined ? currentDay : Number(day);
  const weekDay = week ? (day === undefined ? weekdayOf(todayISO()) : Number(day)) : 0;
  const c = haazinu ? 32 : daily ? dailyPortion(dailyDay)[0]?.chapter ?? 1 : single ? Number(chapter) : 0;
  const shortMonth = shortHebrewMonth(todayISO());
  const maxDailyDay = shortMonth ? 29 : 30;
  const [myPsalms, setMyPsalms] = useState<PersonalPsalm[]>(personalPsalms);
  const portions: Part[] = useMemo(
    () =>
      daily
        ? dailyPortion(dailyDay, dailyDay === 29 && shortMonth)
        : week
          ? weekdayPortion(weekDay)
          : mine
            ? myPsalms.flatMap(({ chapter: n, name }) => splitLong([{ chapter: n }]).map((p) => ({ ...p, label: name.trim() })))
            : haazinu
              ? []
              : splitLong([{ chapter: c }]),
    [daily, dailyDay, shortMonth, week, weekDay, mine, myPsalms, haazinu, c],
  );
  const readingId: ReadingId = haazinu ? 'haazinu' : daily ? `day-${dailyDay}` : week ? `week-${weekDay}` : mine ? 'mine' : c;
  const tracks = useMemo(
    () => (haazinu ? [{ chapter: 32, src: 'reading/Audio/tora_53.mp3', markId: 'haazinu' }] : chapterAudioTracks(portions, readingId)),
    [haazinu, portions, readingId],
  );
  const valid =
    haazinu ||
    mine ||
    (week
      ? Number.isInteger(weekDay) && weekDay >= 1 && weekDay <= WEEK_DAYS
      : daily
        ? Number.isInteger(dailyDay) && dailyDay >= 1 && dailyDay <= maxDailyDay
        : Number.isInteger(c) && c >= 1 && c <= CHAPTERS);
  const [idx, setIdx] = useState<ReadingIndex | null>(null);
  const [sections, setSections] = useState<TextSection[] | null>(null);
  const [source, setSource] = useState<{ title: string; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>(loadView);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  // подсказка «нажмите слово, которое слышите» — при выборе «Голос и подсветка» и один раз при первом запуске
  const [tip, setTip] = useState(false);
  useEffect(() => {
    if (!tip) return;
    const id = setTimeout(() => setTip(false), 9000);
    return () => clearTimeout(id);
  }, [tip]);
  const [menuSection, setMenuSection] = useState<'home' | 'all' | 'edit'>('home');
  const [saveError, setSaveError] = useState(false);
  const [active, setActive] = useState(-1);
  const [trackIndex, setTrackIndex] = useState(0);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncOffset = useRef(0);
  const pendingPlay = useRef(false);
  const pendingWord = useRef<number | null>(null);
  const [audioState, setAudioState] = useState<'stopped' | 'playing' | 'paused'>('stopped');

  /** «Только голос» — без подсветки; «Только подсветка» — запись идёт без звука, подсветка задаёт темп (владелец, 02.11.2026) */
  const light = view.play !== 'voice';
  const verses = sections?.flatMap((section) => section.verses) ?? null;
  const toks = useMemo<Tok[]>(() => (verses ?? []).flatMap((v, i) => tokens(v).map((x) => ({ ...x, v: i }))), [verses]);
  // транслит каждого куска — на языке сайта; первое слово стиха — с большой буквы
  const trLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const trs = useMemo(() => {
    if (view.tr === 'he') return [];
    let verse = -1;
    return toks.map((x) => {
      const r = translitToken(x.s, trLang, view.pron);
      if (!r || x.v === verse) return r;
      verse = x.v;
      return r.charAt(0).toUpperCase() + r.slice(1);
    });
  }, [toks, trLang, view.tr, view.pron]);
  const trOn = view.tr !== 'he';
  const trackTokenIndices = useMemo(() => {
    let firstVerse = 0;
    return (sections ?? []).map((section) => {
      const start = firstVerse;
      firstVerse += section.verses.length;
      return toks.flatMap((token, i) => (token.v >= start && token.v < firstVerse ? [i] : []));
    });
  }, [sections, toks]);
  const audio = sections ? tracks[trackIndex] ?? null : null;
  // разметка по паузам чтеца; своя разметка учителя важнее
  const [autoTimes, setAutoTimes] = useState<Record<string, number[] | null>>({});
  useEffect(() => {
    let live = true;
    for (const tr of tracks)
      void loadAutoTimes(tr.src).then((times) => live && setAutoTimes((m) => (tr.src in m ? m : { ...m, [tr.src]: times })));
    return () => {
      live = false;
    };
  }, [tracks]);
  const timesOf = (tr: { markId: string; src: string }) => markedTimes(tr.markId) ?? autoTimes[tr.src] ?? null;
  // следующая запись подборки грузится заранее — без паузы между главами
  useEffect(() => {
    const next = tracks[trackIndex + 1];
    if (!next || audioState !== 'playing') return;
    const a = new Audio();
    a.preload = 'auto';
    a.src = src_(next.src);
  }, [tracks, trackIndex, audioState]);
  const playAudio = useCallback((restart = true) => {
    if (!tracks.length) return;
    setAudioFailed(false);
    if (restart && trackIndex !== 0) {
      pendingPlay.current = true;
      pendingWord.current = null;
      setTrackIndex(0);
      return;
    }
    const player = audioRef.current;
    if (!player) return;
    if (restart) {
      player.currentTime = 0;
      syncOffset.current = 0;
    }
    resumeVoice();
    if (view.play === 'both') {
      try {
        if (!localStorage.getItem('niflaot:reading-tip')) {
          localStorage.setItem('niflaot:reading-tip', '1');
          setTip(true);
        }
      } catch {
        /* private mode */
      }
    }
    void player.play().catch(() => {
      setAudioState('paused');
      setAudioFailed(true);
    });
  }, [tracks.length, trackIndex, view.play]);
  const pauseAudio = useCallback(() => {
    pendingPlay.current = false;
    audioRef.current?.pause();
    setAudioState('paused');
  }, []);
  const stopAudio = useCallback(() => {
    pendingPlay.current = false;
    pendingWord.current = null;
    syncOffset.current = 0;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setTrackIndex(0);
    setAudioState('stopped');
    setActive(-1);
  }, []);
  useEffect(() => {
    if (!pendingPlay.current || !audioRef.current) return;
    pendingPlay.current = false;
    void audioRef.current.play().catch(() => {
      setAudioState('paused');
      setAudioFailed(true);
    });
  }, [trackIndex]);
  // подсветка — за временем записи; timeupdate приходит лишь ~4 раза в секунду (на 3,5× короткие слова
  // проскакивали), поэтому, пока играет, — ещё и каждый кадр
  const syncHighlight = (player: HTMLAudioElement) => {
    if (player.paused && player.currentTime === 0) {
      setActive(-1);
      return;
    }
    if (!player.duration || !audio) return;
    const indices = trackTokenIndices[trackIndex] ?? [];
    const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
    const starts = startTimes(localTokens, player.duration, timesOf(audio));
    let i = -1;
    for (let k = 0; k < starts.length; k++) if (localTokens[k].w && starts[k] <= player.currentTime + syncOffset.current) i = k;
    setActive(player.ended || i < 0 ? -1 : indices[i]);
  };
  const syncRef = useRef(syncHighlight);
  syncRef.current = syncHighlight;
  useEffect(() => {
    if (audioState !== 'playing' || !light) return;
    let raf = 0;
    const tick = () => {
      if (audioRef.current) syncRef.current(audioRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audioState, light]);

  // Нажатие на слово: есть разметка (по паузам чтеца или учителя) — запись перематывается к нему;
  // нет — подсветка сдвигается и идёт дальше с этого слова.
  const seekAudioToWord = (i: number) => {
    const player = audioRef.current;
    const nextTrackIndex = trackTokenIndices.findIndex((indices) => indices.includes(i));
    if (!audio || nextTrackIndex < 0) {
      setActive(i);
      return;
    }
    if (nextTrackIndex !== trackIndex) {
      pendingPlay.current = true;
      pendingWord.current = i;
      syncOffset.current = 0;
      setTrackIndex(nextTrackIndex);
      setActive(i);
      return;
    }
    if (!player || !Number.isFinite(player.duration)) {
      setActive(i);
      return;
    }
    const indices = trackTokenIndices[trackIndex] ?? [];
    const localIndex = indices.indexOf(i);
    const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
    const times = timesOf(audio);
    const starts = startTimes(localTokens, player.duration, times);
    if (exact(times, localTokens)) {
      // слова размечены — запись перематывается к слову
      syncOffset.current = 0;
      player.currentTime = starts[localIndex] ?? 0;
    } else syncOffset.current = (starts[localIndex] ?? 0) - player.currentTime;
    setActive(i);
    if (player.paused || player.ended) playAudio(false);
  };

  useEffect(() => {
    // what people search: «Теґилим 23», «Теґилим на сегодня»
    const unit = haazinu
      ? t('reading.haazinuTitle')
      : daily
        ? t('reading.docDay', { psalms: dailyPortionLabel(dailyDay) })
        : week
          ? t('reading.forWeekday', { day: dayName(weekDay) })
          : mine
            ? `${t('reading.book')} · ${t('reading.myChapters')}`
            : t('reading.docChapter', { n: c });
    document.title = `${unit} · ${t('app.title')}`;
  }, [t, haazinu, daily, dailyDay, week, weekDay, mine, c]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = audioRate;
    void setVoicePitch(audioRef.current, audioRate);
  }, [audioRate, audio]);
  // «Только подсветка»: the recording runs silently and only paces the highlight
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = view.play === 'light';
  }, [view.play, audio]);
  useEffect(() => {
    if (!valid) return;
    stopAudio();
    setAudioFailed(false);
    setFailed(false);
    setSource(null);
    setIdx(null);
    setSections(null);
    setActive(-1);
    let live = true;
    if (haazinu) {
      loadHaazinu()
        .then((h) => {
          if (!live) return;
          setSource({ title: 'Sefaria · Deuteronomy 32', url: h.source });
          setSections([{ chapter: h.chapter, firstVerse: 1, verses: h.v }]);
        })
        .catch(() => live && setFailed(true));
    } else {
      Promise.all([loadIndex(), ...portions.map(({ chapter: n }) => loadChapter(n))])
        .then(([i, ...loaded]) => {
          if (!live) return;
          const nextSections = portions.map((portion, index) => {
            const all = loaded[index] as string[];
            const from = portion.fromVerse ?? 1;
            const to = portion.toVerse ?? all.length;
            return { chapter: portion.chapter, firstVerse: from, verses: all.slice(from - 1, to), label: portion.label };
          });
          setIdx(i as ReadingIndex);
          setSource({ title: i.version.title, url: i.version.source });
          setSections(nextSections);
        })
        .catch(() => live && setFailed(true));
    }
    return () => {
      live = false;
    };
  }, [c, dailyDay, valid, stopAudio, portions, haazinu]);

  const setV = (v: View) => {
    setView(v);
    saveView(v);
  };
  const updateMyPsalms = (next: PersonalPsalm[]) => {
    setMyPsalms(next);
    setSaveError(!savePersonalPsalms(next));
  };
  /** выбор в меню «Мои Теґилим» сразу меняет то, что показано в окне чтения */
  const show = (hash: string) => {
    setMenuOpen(false);
    if (location.hash !== hash) location.hash = hash;
  };
  const openPsalms = (n: number) => show(`#/reading/${n}`);
  const goWeek = (n: number) => {
    location.hash = `#/reading/week/${n}`;
  };
  const go = (n: number) => {
    location.hash = `#/reading/${n}`;
  };
  const goDay = (n: number) => {
    location.hash = `#/reading/day/${n}`;
  };
  const dailyPortionLabel = (n: number) => {
    const ps = dailyPortion(n, n === 29 && shortMonth);
    if (ps.length && ps[0].chapter === 119) {
      return `119:${ps[0].fromVerse}–${ps[0].toVerse}`;
    }
    return ps.length > 1 ? `${ps[0].chapter}–${ps[ps.length - 1].chapter}` : String(ps[0]?.chapter ?? '');
  };
  const todayDate = new Date(`${todayISO()}T12:00:00`);
  const hebrewDate = new Intl.DateTimeFormat(`${uiLang(locale)}-u-ca-hebrew`, { day: 'numeric', month: 'long' }).format(todayDate);
  const todayWeekDay = weekdayOf(todayISO());
  const weekPortionLabel = (n: number) => {
    const ps = weekdayPortion(n);
    return ps.length ? `${ps[0].chapter}–${ps[ps.length - 1].chapter}` : '';
  };
  const menuTitles = {
    home: t('reading.myTehillim'),
    all: t('reading.allTehillim'),
    edit: t('reading.editChapters'),
  };
  /** что сейчас в окне — этот пункт меню отмечен */
  const current = (on: boolean) => (on ? { className: 'rd-menu-choice rd-menu-on', 'aria-current': 'page' as const } : { className: 'rd-menu-choice' });

  // the word in the light stays in sight
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active < 0 || !light) return;
    textRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active, light]);

  if (!valid) return <NotFound />;

  return (
    <>
      <TopBar title={t('reading.title')} />
      <div className={`wrap rd${view.big ? ' rd-big' : ''}`}>
        <header className="tk-head">
          <p className="tk-kicker">
            📖 {t('reading.title')} · {t('reading.h1')}
          </p>
          <h1>
            {haazinu ? t('reading.haazinuTitle') : single ? t('reading.docChapter', { n: c }) : t('reading.book')}{' '}
            <span className="he">{haazinu ? 'הַאֲזִינוּ' : single ? `תְּהִלִּים ${hebrewNumber(c)}` : 'תְּהִלִּים'}</span>
          </h1>
          {mine && <p className="rd-now">{t('reading.mineHeader', { n: myPsalms.length })}</p>}
          {haazinu ? (
            <p className="ac-lead">{t('reading.haazinuLead')}</p>
          ) : (
            <>
              {(['why', 'zriz', 'so'] as const).map((k, n) => (
                <p key={k} id={n ? `rd-lead-${k}` : undefined} className={`ac-lead rd-lead${n ? ` rd-lead-more${leadOpen ? ' open' : ''}` : ''}`}>
                  <b>{t(`reading.${k}H`)}</b> {t(`reading.${k}`)}
                </p>
              ))}
              {/* на телефоне виден только первый абзац — остальные по «Подробнее» */}
              <button type="button" className="rd-more-btn no-print" aria-expanded={leadOpen} aria-controls="rd-lead-zriz rd-lead-so" onClick={() => setLeadOpen((o) => !o)}>
                {t(leadOpen ? 'reading.less' : 'reading.more')}
              </button>
            </>
          )}
          {haazinu && <p className="ac-lead">{t('reading.haazinuAbout')}</p>}
          {level === 'none' && (
            <p className="rd-note">
              {t('reading.noLetters')} <a href="#/letters">{t('abc.title')}</a>
            </p>
          )}
        </header>

        {!haazinu && (
          <>
          <div className="rd-bar no-print">
          <button
            type="button"
            className="btn ghost rd-menu-open"
            onClick={() => { setMenuSection('home'); setMenuOpen(true); }}
            aria-label={t('reading.myTehillim')}
            title={t('reading.myTehillim')}
          >
            ☰<span className="rd-menu-lbl"> {t('reading.myTehillim')}</span>
          </button>
          {!mine && (
          <nav className="rd-nav" aria-label={t(daily ? 'reading.dayPick' : week ? 'reading.weekPick' : 'reading.pick')}>
            <button
              type="button"
              className="rd-arrow"
              onClick={() => (daily ? goDay(dailyDay - 1) : week ? goWeek(weekDay - 1) : go(c - 1))}
              disabled={daily ? dailyDay <= 1 : week ? weekDay <= 1 : c <= 1}
              aria-label={t('reading.prev')}
            >
              ‹
            </button>
            <label className="rd-pick">
              <span className="sr-only">{t(daily ? 'reading.dayPick' : week ? 'reading.weekPick' : 'reading.pick')}</span>
              <select
                value={daily ? dailyDay : week ? weekDay : c}
                onChange={(e) => (daily ? goDay(Number(e.target.value)) : week ? goWeek(Number(e.target.value)) : go(Number(e.target.value)))}
              >
                {Array.from({ length: daily ? maxDailyDay : week ? WEEK_DAYS : CHAPTERS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {daily
                      ? `${t('reading.day')} ${n} · ${dailyPortionLabel(n)}`
                      : week
                        ? `${dayName(n)} · ${weekPortionLabel(n)}${n === todayWeekDay ? ` · ${t('shn.today')}` : ''}`
                        : `${t('reading.book')} ${n}${idx ? ` — ${t('reading.words', { n: idx.words[n - 1] })}` : ''}`}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="rd-arrow"
              onClick={() => (daily ? goDay(dailyDay + 1) : week ? goWeek(weekDay + 1) : go(c + 1))}
              disabled={daily ? dailyDay >= maxDailyDay : week ? weekDay >= WEEK_DAYS : c >= CHAPTERS}
              aria-label={t('reading.next')}
            >
              ›
            </button>
          </nav>
          )}
          </div>
          </>
        )}

        <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title={menuTitles[menuSection]} closeLabel={t('menu.close')}>
          {menuSection === 'home' ? (
            <div className="rd-menu-list">
              <button type="button" {...current(single)} onClick={() => setMenuSection('all')}>
                {t('reading.allTehillim')}
              </button>
              <button type="button" {...current(daily && dailyDay === currentDay)} onClick={() => show('#/reading')}>
                {t('reading.forDate', { date: hebrewDate })}
              </button>
              <button type="button" {...current(week && weekDay === todayWeekDay)} onClick={() => show('#/reading/week')}>
                {t('reading.forWeekday', { day: dayName(todayWeekDay) })}
              </button>
              <button
                type="button"
                {...current(mine)}
                className={`${current(mine).className} rd-menu-mine`}
                onClick={() => (myPsalms.length ? show('#/reading/mine') : setMenuSection('edit'))}
              >
                <span>{t('reading.myChapters')}</span>
                <span className="rd-menu-count">{myPsalms.length}</span>
              </button>
              <button type="button" className="btn ghost" onClick={() => setMenuSection('edit')}>{t('reading.editChapters')}</button>
            </div>
          ) : menuSection === 'edit' ? (
            <div className="rd-menu-edit">
              <p className="rd-hint">{t('reading.savedOnDevice')}</p>
              {saveError && <p className="rd-note" role="alert">{t('reading.saveFailed')}</p>}
              {myPsalms.map((item, index) => (
                <div className="rd-person-row" key={index}>
                  <label>
                    <span>{t('reading.chapterNumber')}</span>
                    <select
                      value={item.chapter}
                      onChange={(e) => updateMyPsalms(myPsalms.map((row, i) => i === index ? { ...row, chapter: Number(e.target.value) } : row))}
                    >
                      {Array.from({ length: CHAPTERS }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className="rd-person-name">
                    <span>{t('reading.forWhom')}</span>
                    <input
                      type="text"
                      maxLength={80}
                      value={item.name}
                      placeholder={t('reading.namePlaceholder')}
                      onChange={(e) => updateMyPsalms(myPsalms.map((row, i) => i === index ? { ...row, name: e.target.value } : row))}
                    />
                  </label>
                  <button
                    type="button"
                    className="icon-btn rd-person-remove"
                    aria-label={t('reading.removeChapter')}
                    onClick={() => updateMyPsalms(myPsalms.filter((_, i) => i !== index))}
                  >×</button>
                </div>
              ))}
              <button type="button" className="btn ghost" onClick={() => updateMyPsalms([...myPsalms, { chapter: 1, name: '' }])}>
                + {t('reading.addChapter')}
              </button>
              <button
                type="button"
                className="btn rd-menu-done"
                onClick={() => (myPsalms.length ? show('#/reading/mine') : setMenuSection('home'))}
              >
                {myPsalms.length ? t('reading.showMine') : t('reading.backToMenu')}
              </button>
            </div>
          ) : (
            <div className="rd-menu-chapters">
              <button type="button" className="btn ghost rd-menu-back" onClick={() => setMenuSection('home')}>‹ {t('reading.backToMenu')}</button>
              {Array.from({ length: CHAPTERS }, (_, i) => i + 1).map((n) => (
                <button
                  type="button"
                  className={`rd-menu-chapter${single && n === c ? ' rd-menu-on' : ''}`}
                  aria-current={single && n === c ? 'page' : undefined}
                  key={n}
                  onClick={() => openPsalms(n)}
                >
                  <strong>{t('reading.book')} {n}</strong>
                </button>
              ))}
            </div>
          )}
        </Sheet>

        <ReadingSettings view={view} setV={setV} audio={tracks.length > 0} onBoth={() => setTip(true)} />

        {audio && (
          <audio
            key={audio.src}
            ref={audioRef}
            src={src_(audio.src)}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const word = pendingWord.current;
              if (word === null) return;
              pendingWord.current = null;
              const indices = trackTokenIndices[trackIndex] ?? [];
              const localIndex = indices.indexOf(word);
              if (localIndex < 0) return;
              const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
              const times = timesOf(audio);
              const starts = startTimes(localTokens, e.currentTarget.duration, times);
              if (exact(times, localTokens)) {
                syncOffset.current = 0;
                e.currentTarget.currentTime = starts[localIndex] ?? 0;
              } else syncOffset.current = starts[localIndex] ?? 0;
              setActive(word);
            }}
            onTimeUpdate={(e) => syncHighlight(e.currentTarget)}
            onEnded={() => {
              if (trackIndex + 1 < tracks.length) {
                syncOffset.current = 0;
                pendingPlay.current = true;
                setTrackIndex(trackIndex + 1);
              } else {
                setActive(-1);
                setAudioState('stopped');
                setReadDone(readingId, true);
              }
            }}
            onPlay={() => setAudioState('playing')}
            onPause={() => setAudioState((state) => (state === 'stopped' ? state : 'paused'))}
            onError={() => setAudioFailed(true)}
          />
        )}
        {audioFailed && <p className="rd-note" role="alert">{t('reading.audioFailed')}</p>}
        {audio && light && !tip && audioState !== 'stopped' && <p className="rd-hint rd-tap-hint no-print">{t('reading.tapSync')}</p>}
        {tip && tracks.length > 0 && view.play === 'both' && (
          <div className="rd-tip no-print" role="status">
            <span aria-hidden="true">👆</span>
            <p>{t('reading.tapSync')}</p>
            <button type="button" aria-label={t('reading.tipClose')} onClick={() => setTip(false)}>
              ×
            </button>
          </div>
        )}

        {audio && (
          <div className="rd-audio-float no-print" role="group" aria-label={t('reading.audioControls')}>
            <button
              type="button"
              className="btn"
              onClick={() => (audioState === 'playing' ? pauseAudio() : playAudio(audioState === 'stopped'))}
              aria-label={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
              title={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
            >
              {audioState === 'playing' ? '⏸' : '▶'}
              <span className="rd-lbl"> {t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}</span>
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={stopAudio}
              disabled={audioState === 'stopped'}
              aria-label={t('reading.stop')}
              title={t('reading.stop')}
            >
              ■<span className="rd-lbl"> {t('reading.stop')}</span>
            </button>
            <label className="rd-rate" title={t('reading.speed')}>
              <span className="sr-only">{t('reading.speed')}</span>
              <select value={audioRate} onChange={(e) => setAudioRate(Number(e.target.value))}>
                {RATES.map((r) => (
                  <option key={r} value={r}>
                    {r}×
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {failed ? (
          <p className="rd-note">{t('reading.failed')}</p>
        ) : mine && !myPsalms.length ? (
          <p className="rd-note">
            {t('reading.noChapters')}{' '}
            <button type="button" className="rd-inline-button" onClick={() => { setMenuSection('edit'); setMenuOpen(true); }}>
              {t('reading.editChapters')}
            </button>
          </p>
        ) : !verses ? (
          <PageLoading />
        ) : (
          <article
            className={trOn ? `rd-text rd-tr rd-tr-${view.tr}` : 'rd-text he'}
            lang={trOn ? locale : 'he'}
            dir={trOn ? 'ltr' : 'rtl'}
            ref={textRef}
          >
            {sections?.map((section, si) => {
              const verseOffset = sections.slice(0, si).reduce((sum, previous) => sum + previous.verses.length, 0);
              return (
                <section key={`${si}-${section.chapter}-${section.firstVerse}`}>
                  {(si === 0 || sections[si - 1].chapter !== section.chapter || section.firstVerse === 1) && (
                    <>
                      {mine && (
                        <p className="rd-for" dir="auto">
                          {section.label ? t('reading.readFor', { name: section.label }) : t('reading.nameNotSet')}
                        </p>
                      )}
                      <h2 className="rd-ch">
                        {trOn ? `${t('reading.book')} ${section.chapter} · ` : ''}
                        <span className="he" lang="he">פֶּרֶק {hebrewNumber(section.chapter)}</span>
                      </h2>
                    </>
                  )}
                  {section.verses.map((_, vi) => {
                    const globalVerse = verseOffset + vi;
                    return (
                      <p key={globalVerse} className="rd-v">
                        <span className="rd-vn" aria-hidden="true">
                          {trOn ? section.firstVerse + vi : hebrewNumber(section.firstVerse + vi).replace(/[׳״]/g, '')}
                        </span>{' '}
                        {toks.map((x, i) =>
                          x.v !== globalVerse ? null : (
                            <span key={i}>
                              <span
                                data-i={i}
                                className={`rd-w${!light ? '' : i === active ? ' rd-on' : active > i ? ' rd-past' : ''}${x.w ? '' : ' rd-paseq'}`}
                                onClick={() => light && x.w && seekAudioToWord(i)}
                              >
                                {!trOn ? (
                                  view.taamim ? x.s : stripTaamim(x.s)
                                ) : view.tr === 'tr' ? (
                                  trs[i]
                                ) : (
                                  <>
                                    <span className="rd-tr-w">{trs[i]}</span>
                                    <span className="rd-tr-h he" lang="he" dir="rtl">
                                      {view.taamim ? x.s : stripTaamim(x.s)}
                                    </span>
                                  </>
                                )}
                              </span>{' '}
                            </span>
                          ),
                        )}
                      </p>
                    );
                  })}
                </section>
              );
            })}
          </article>
        )}

        {verses && <ReadDone id={readingId} />}

        {verses &&
          isAdmin() &&
          tracks.map((track, i) => {
            const indices = trackTokenIndices[i] ?? [];
            return (
              <Marking
                key={`${i}-${track.markId}`}
                c={track.markId}
                label={haazinu ? t('reading.haazinuMark') : `${t('reading.book')} ${track.chapter}`}
                toks={indices.map((tokenIndex) => toks[tokenIndex])}
                src={track.src}
                setActive={(word) => setActive(indices[word] ?? -1)}
              />
            );
          })}

        {!haazinu && tracks.length > 0 && (
          <p className="rd-credit">
            {t('reading.audioCredit')}{' '}
            <a href="https://talkingtehillim.com/" target="_blank" rel="noopener">
              talkingtehillim.com
            </a>
          </p>
        )}
        {source && (
          <p className="rd-credit">
            {t('reading.credit')}{' '}
            <a href={source.url} target="_blank" rel="noopener">
              {source.title}
            </a>{' '}
            · {t('reading.pd')}
          </p>
        )}
      </div>
      <Colophon />
    </>
  );
}

/** разметка подходит к тексту записи — по куску со словами на время */
const exact = (times: number[] | null, toks: { w: number }[]) => !!times && times.length === toks.filter((x) => x.w).length;

const src_ = (src: string) => (/^https?:/.test(src) ? src : `${import.meta.env.BASE_URL}${src}`);

/** «Разметка аудио (для учителя)»: the recording slowly from the start; a press at the start of every word. */
/** One labelled menu instead of three unlabelled bars: reading help, how to show the text, the look. */
function ReadingSettings({ view, setV, audio, onBoth }: { view: View; setV: (v: View) => void; audio: boolean; onBoth: () => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  const item = (on: boolean, code: string, name: string, desc: string, onClick: () => void, role = 'menuitemradio') => (
    <button key={name} type="button" role={role} aria-checked={on} onClick={onClick}>
      <span className="code">{code}</span>
      <span className="name">
        {name}
        <small className="rd-set-d">{desc}</small>
      </span>
      {on && <Icon name="check" size={16} />}
    </button>
  );
  return (
    <div className="tk-view rd-set no-print no-speak" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">⚙</span>
        <span>
          {t('reading.view')}
          <small>
            {' · '}
            {audio && <>{t(`reading.mode.${view.play}`)} · </>}
            {t(`reading.tr.${view.tr}`)}
            {view.tr !== 'he' && <> · {t(`reading.pron.${view.pron}`)}</>}
          </small>
        </span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div className="lang-list tk-view-list rd-set-list" role="menu" aria-label={t('reading.view')}>
          {audio && (
            <>
              <div className="tk-view-head">{t('reading.help')}</div>
              {PLAY_MODES.map((m) =>
                item(view.play === m, m === 'both' ? '♪✦' : m === 'voice' ? '♪' : '✦', t(`reading.mode.${m}`), t(`reading.mode.${m}.d`), () => {
                  setV({ ...view, play: m });
                  if (m === 'both') {
                    onBoth();
                    close();
                  }
                }),
              )}
              <div className="tk-view-sep" />
            </>
          )}
          <div className="tk-view-head">{t('reading.tr')}</div>
          {TR_MODES.map((m) =>
            item(view.tr === m, m === 'he' ? 'אב' : m === 'duo' ? `${t('reading.tr.ab')}+אב` : t('reading.tr.ab'), t(`reading.tr.${m}`), t(`reading.tr.${m}.d`), () => setV({ ...view, tr: m })),
          )}
          {view.tr !== 'he' && (
            <>
              <div className="tk-view-sep" />
              <div className="tk-view-head">{t('reading.pron')}</div>
              {PRONS.map((p) =>
                item(view.pron === p, p === 'ash' ? 'אָ=o' : 'אָ=a', t(`reading.pron.${p}`), t(`reading.pron.${p}.d`), () => setV({ ...view, pron: p })),
              )}
            </>
          )}
          <div className="tk-view-sep" />
          <div className="tk-view-head">{t('reading.look')}</div>
          {item(view.taamim, '♫', t('reading.v.taamim'), t('reading.v.taamim.d'), () => setV({ ...view, taamim: !view.taamim }), 'menuitemcheckbox')}
          {item(view.big, 'A+', t('reading.v.big'), t('reading.v.big.d'), () => setV({ ...view, big: !view.big }), 'menuitemcheckbox')}
        </div>
      )}
    </div>
  );
}

function Marking({ c, label, toks, src, setActive }: { c: ReadingId; label: string; toks: Tok[]; src: string; setActive: (i: number) => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLAudioElement>(null);
  const words = useMemo(() => toks.map((x, i) => (x.w ? i : -1)).filter((i) => i >= 0), [toks]);
  const [marks, setMarks] = useState<number[] | null>(null);
  const [saved, setSaved] = useState<number[] | null>(() => markedTimes(c));
  const [copied, setCopied] = useState(false);
  const run = marks !== null;

  const stop = (m: number[]) => {
    ref.current?.pause();
    setMarks(null);
    setActive(-1);
    if (m.length) {
      saveTimes(c, m);
      setSaved(m);
    }
  };
  const tap = () => {
    const a = ref.current;
    if (!a || !marks) return;
    const m = [...marks, Math.round(a.currentTime * 100) / 100];
    if (m.length >= words.length) stop(m);
    else {
      setMarks(m);
      setActive(words[m.length]);
    }
  };
  const tapRef = useRef(tap);
  tapRef.current = tap;
  useEffect(() => {
    if (!run) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        tapRef.current();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [run]);

  const json = saved ? JSON.stringify({ chapter: c, times: saved }) : '';
  return (
    <details className="rd-mark no-print">
      <summary>{label} · {t('reading.markTitle')}</summary>
      <p className="rd-hint">{t('reading.markHow')}</p>
      <audio ref={ref} src={src_(src)} preload="none" onEnded={() => marks && stop(marks)} />
      {run ? (
        <div className="rd-row">
          <button type="button" className="btn rd-tap" onClick={tap}>
            {t('reading.markTap', { n: marks.length + 1, m: words.length })}
          </button>
          <button type="button" className="btn ghost" onClick={() => stop(marks)}>
            {t('reading.markStop')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            a.currentTime = 0;
            a.playbackRate = 0.6;
            setMarks([]);
            setActive(words[0]);
            void a.play();
          }}
        >
          ▶ {t('reading.markStart')}
        </button>
      )}
      {saved && !run && (
        <>
          <p className="rd-hint">{t('reading.markSaved', { n: saved.length, m: words.length })}</p>
          <textarea className="rd-json" readOnly value={json} rows={3} onFocus={(e) => e.target.select()} />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              void navigator.clipboard?.writeText(json).then(() => setCopied(true));
            }}
          >
            {copied ? `✓ ${t('reading.copied')}` : t('reading.copy')}
          </button>
        </>
      )}
    </details>
  );
}

/**
 * «Я прочитал(а)» под Теґилим (владелец, 03.11.2026): день засчитывается в учебную серию (src/core/habit.ts), как галочка
 * у Пророков и Писаний. Теґилим читают каждый день заново — отметка только на сегодня, по подборке (`ReadingId`: глава,
 * порция дня, день недели, «Мои главы»); дослушанная запись ставит её сама. `niflaot:reading-done` = { "<дата>": [подборки] },
 * последние 60 дней, только на этом устройстве (серия сама синхронизируется с аккаунтом).
 */
const DONE_KEY = 'niflaot:reading-done';
const DONE_EVENT = 'niflaot:reading-done';
const readDoneLog = (): Record<string, string[]> => {
  try {
    const v = JSON.parse(localStorage.getItem(DONE_KEY) ?? '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
};
const isReadDone = (id: ReadingId) => (readDoneLog()[todayIso()] ?? []).includes(String(id));
function setReadDone(id: ReadingId, on: boolean) {
  const today = todayIso();
  const log = readDoneLog();
  const day = new Set(log[today] ?? []);
  if (on) day.add(String(id));
  else day.delete(String(id));
  log[today] = [...day];
  for (const d of Object.keys(log)) if (d < new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10)) delete log[d];
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(log));
  } catch {}
  if (on) (markStudied(), earn('read', `th:${id}:${today}`));
  window.dispatchEvent(new Event(DONE_EVENT));
}

function ReadDone({ id }: { id: ReadingId }) {
  const { t } = useI18n();
  const h = useHabit();
  const [done, setDone] = useState(() => isReadDone(id));
  useEffect(() => {
    const on = () => setDone(isReadDone(id));
    on();
    window.addEventListener(DONE_EVENT, on);
    return () => window.removeEventListener(DONE_EVENT, on);
  }, [id]);
  return (
    <div className={`tk-done rd-done no-print${done ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => setReadDone(id, e.target.checked)} />
        <span>{t('reading.doneCheck')}</span>
      </label>
      <p>
        {done ? t('reading.doneOn') : t('reading.doneOff')}
        {h.streak > 0 && ` · 🔥 ${t('habit.streak', { n: h.streak })}`}
      </p>
    </div>
  );
}
