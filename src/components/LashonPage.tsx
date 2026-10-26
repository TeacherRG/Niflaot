import { useEffect, useMemo, useRef, useState } from 'react';
import { AddCourse } from './AddCourse';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LESSONS, PARSHIOT, type ParshaId } from '../lessons';
import { useMode } from '../core/mode';
import { useHebrewLevel } from '../core/hebrewLevel';
import { useHabit } from '../core/habit';
import { memoImages } from '../core/memo';
import { FINALS, letterName } from '../core/letterNames';
import { answerWord, torahWords, useStars } from '../core/torahWords';
import { exampleOf, inDeck, loadDict, loadExamples, markKnown, markLearn, readWordStore, useWordStore, type WordLang } from '../core/words';
import {
  GOAL,
  TANAKH_GROUP,
  XP,
  XP_PERFECT,
  XP_EXAM,
  EXAM_LIVES,
  makeExam,
  passExam,
  abcUnits,
  finishLesson,
  isOpen,
  isRight,
  nearlyRight,
  isDone,
  makeLesson,
  newItems,
  nextPart,
  progressOf,
  reviewsOf,
  REVIEWS,
  readCourse,
  type Known,
  nextUnit,
  tanakhUnits,
  torahUnits,
  torahVerses,
  verseOf,
  type Verse,
  useCourse,
  xpToday,
  xpTotal,
  type Exercise,
  type Item,
  type Unit,
  type Answers,
  dueItems,
  weakItems,
  weakUnit,
  WARM,
  SPACING,
  dayNo,
} from '../core/lashon';

type T = ReturnType<typeof useI18n>['t'];
const SOUND_KEY = 'niflaot:lashon-sound';
const soundOn = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== '0';
  } catch {
    return true;
  }
};

/** a short tone after «Проверить»: up — right, down — wrong (Web Audio, no files; only after a tap) */
let audio: AudioContext | null = null;
function tone(right: boolean) {
  if (!soundOn()) return;
  try {
    audio ??= new AudioContext();
    const now = audio.currentTime;
    (right ? [660, 880] : [330, 247]).forEach((f, i) => {
      const o = audio!.createOscillator();
      const g = audio!.createGain();
      o.frequency.value = f;
      o.type = 'sine';
      g.gain.setValueAtTime(0.0001, now + i * 0.11);
      g.gain.exponentialRampToValueAtTime(0.15, now + i * 0.11 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.11 + 0.18);
      o.connect(g).connect(audio!.destination);
      o.start(now + i * 0.11);
      o.stop(now + i * 0.11 + 0.2);
    });
  } catch {}
}

/** the lessons of a unit done: a bar */
const Bar = ({ k, n }: { k: number; n: number }) => (
  <span className="tk-words-bar ln-ubar" role="img" aria-label={`${k}/${n}`}>
    <span style={{ width: `${(100 * k) / n}%` }} />
  </span>
);

/**
 * `#/lashon` — «Святой язык — уроки» (src/core/lashon.ts): a course of short lessons, as in Duolingo — the path of units
 * (the letters, then the words: the children's Torah words of the lessons, the adults' most frequent words of Tanakh),
 * three ★ a unit, the points of the day and the streak. A lesson opens over the page: one exercise at a time, «Проверить»,
 * the answer at once; a mistake comes back at the end.
 */
export function LashonPage() {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const store = useCourse();
  const habit = useHabit();
  // a player who reads Hebrew («Читаю на иврите», src/core/hebrewLevel.ts) doesn't see the letters — only the words
  const reads = useHebrewLevel() === 'reads';
  const abc = useMemo(() => abcUnits(locale), [locale]);
  // children: the short Torah verses of the lessons' sources (src/sources — loaded apart) for «Составьте стих»
  const [verses, setVerses] = useState<Map<string, Verse[]>>(new Map());
  useEffect(() => {
    if (adults) return;
    let live = true;
    import('../sources').then(({ SOURCES, translation }) => {
      const source = (id: string) => {
        const s = SOURCES[id];
        if (!s) return undefined;
        const tr = translation(s, id, locale).lines;
        // a translation in the site's language only (not the English fallback)
        return { torah: s.kind.en === 'Torah', ref: s.ref, title: s.title[locale] ?? s.title.en, he: s.he, tr: locale !== 'en' && tr === s.en ? [] : tr };
      };
      if (live) setVerses(torahVerses(LESSONS, source, locale));
    });
    return () => {
      live = false;
    };
  }, [adults, locale]);
  const torah = useMemo(() => (adults ? [] : torahUnits(torahWords(LESSONS, locale, memoImages), verses)), [adults, locale, verses]);
  const [tanakh, setTanakh] = useState<Unit[] | null>(adults ? null : []);
  useEffect(() => {
    if (!adults) return;
    let live = true;
    const lang = (locale === 'en' || locale === 'de' ? locale : 'ru') as WordLang;
    // the words and their example verses (for «Составьте стих»)
    Promise.all([loadDict(lang), loadExamples(lang)]).then(([d, ex]) => live && setTanakh(tanakhUnits(d, (id) => verseOf(exampleOf(ex, id), lang))));
    return () => {
      live = false;
    };
  }, [adults, locale]);
  const words = adults ? tanakh ?? [] : torah;
  const units = useMemo(() => [...abc, ...words], [abc, words]);
  const [run, setRun] = useState<{ unit: Unit; part: Item[] | null; hard?: boolean; exam?: boolean; warm?: Item[] } | null>(null);
  // the words already met outside the course: the adults' «Мои слова» (in the deck), the children's «Слова Торы» (played)
  const deck = useWordStore();
  const stars = useStars();
  const known: Known = (key) => (adults ? inDeck(deck, key) : key in stars);
  const knownOf = (u: Unit): Known => (u.track === 'abc' ? () => false : known);

  useEffect(() => {
    document.title = `${t('ln.title')} · ${t('app.title')}`;
  }, [t]);

  const today = xpToday(store);
  // the next new items; none — «Повторение» (the second one, and a finished unit played again, harder)
  // before it — «Повторим»: the hard and the longest not seen of the earlier lessons of the track (spaced, mixed retrieval);
  // a review starts with the hard and the old ones of the unit itself
  const trackItems = (u: Unit) => (u.track === 'abc' ? abc : words).flatMap((x) => x.items);
  const start = (unit: Unit) => {
    const part = nextPart(unit, store, knownOf(unit));
    const warm = dueItems(trackItems(unit), store, WARM, part.length ? part : unit.items);
    const focus = part.length ? undefined : dueItems(unit.items, store, 3, [], dayNo() + SPACING);
    setRun({ unit: focus ? { ...unit, focus } : unit, part: part.length ? part : null, hard: reviewsOf(store, unit) >= REVIEWS - 1, warm });
  };
  /** «Трудные: N» — a lesson of the letters / words missed lately (3 at least: the pairs and the options need them) */
  const weak = (list: Unit[]) => {
    const items = weakItems(list.flatMap((u) => u.items), store);
    if (items.length < 3 || !list.length) return null;
    return (
      <p className="ln-weak">
        <span>{t(list[0].track === 'abc' ? 'ln.weakLetters' : 'ln.weakWords', { n: items.length })}</span>
        <button type="button" className="btn ghost" onClick={() => setRun({ unit: weakUnit(list[0].track, items, list.flatMap((u) => u.items)), part: null })}>
          {t('ln.weakBtn')}
        </button>
      </p>
    );
  };
  const unitTitle = (u: Unit) =>
    u.track === 'abc'
      ? `${u.items[0].he}–${u.items.filter((x) => !FINALS[x.key]).at(-1)!.he}${u.items.some((x) => FINALS[x.key]) ? ' · ךםןףץ' : ''}`
      : adults
        ? t('ln.group', { n: u.n, a: (u.n - 1) * TANAKH_GROUP + 1, b: (u.n - 1) * TANAKH_GROUP + u.items.length })
        : PARSHIOT[u.parsha as ParshaId]?.name[locale] ?? PARSHIOT[u.parsha as ParshaId]?.name.ru ?? u.parsha!;
  /** «Новых: 35 · уроков: 7» / «Повторение» / «Пройдено» */
  const stepLabel = (u: Unit) => {
    const left = newItems(u, store, knownOf(u)).length;
    return isDone(u, store, knownOf(u))
      ? t('ln.unitDone')
      : left
        ? t(u.track === 'abc' ? 'ln.newLetters' : 'ln.newWords', { n: left, k: Math.ceil(left / u.size) })
        : t('ln.review');
  };
  /** «Уже знакомо по «Моим словам»: 12» */
  const metOutside = (u: Unit) => (u.track === 'abc' ? 0 : u.items.filter((it) => !store.s[it.key] && known(it.key)).length);

  // on the circle: the first letter, or the shortest word of the unit
  const sym = (u: Unit) => (u.track === 'abc' ? u.items[0].he : [...u.items.flatMap((x) => x.he.split(' '))].sort((a, b) => a.length - b.length)[0]);
  const path = (list: Unit[]) => (
    <ol className="ln-path">
      {list.map((u) => {
        const i = units.indexOf(u);
        const open = isOpen(units, i, store, knownOf(u));
        const p = progressOf(u, store, knownOf(u));
        const full = isDone(u, store, knownOf(u));
        const cur = open && !full && nextUnit(u.track === 'abc' ? abc : words, store, knownOf(u)) === u;
        const met = metOutside(u);
        return (
          <li key={u.id} className={`ln-node${cur ? ' cur' : ''}${full ? ' full' : ''}${open ? '' : ' locked'}`} style={{ ['--off' as string]: [0, 1, 2, 1, 0, -1, -2, -1][i % 8] }}>
            <button type="button" className="ln-dot" disabled={!open} onClick={() => start(u)} aria-label={`${unitTitle(u)} · ${stepLabel(u)}`}>
              <span className={`he${u.track === 'abc' ? '' : ' w'}`} lang="he" data-len={Math.min(6, sym(u).length)}>
                {sym(u)}
              </span>
              {full && <i className="ln-crown">✓</i>}
            </button>
            {cur && <span className="ln-go">{t(p > 0 ? 'ln.continue' : 'ln.start')}</span>}
            <span className="ln-lbl">
              <b className={u.track === 'abc' ? 'he' : undefined} lang={u.track === 'abc' ? 'he' : undefined}>
                {unitTitle(u)}
              </b>
              {open ? (
                <>
                  <small>{stepLabel(u)}</small>
                  <Bar k={p} n={1} />
                  {met > 0 && <small className="ln-met">{t(adults ? 'ln.metWords' : 'ln.metTorah', { n: met })}</small>}
                  {/* «Экзамен»: the whole unit at once — passed, the next one opens */}
                  {!full && (
                    <button type="button" className="ln-exam-btn" onClick={() => setRun({ unit: u, part: null, exam: true })}>
                      {t('ln.exam')}
                    </button>
                  )}
                </>
              ) : (
                <small>🔒 {t('ln.locked')}</small>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <TopBar title={t('ln.title')} />
      <div className={`wrap lash${adults ? ' adults' : ''}`}>
        <header className="tk-head">
          <p className={`wing-tag${adults ? '' : ' kids'}`}>{t(adults ? 'wing.adults' : 'wing.kids')}</p>
          <h1>
            {t('ln.title')}{' '}
            <span className="he" lang="he">
              לשון הקודש
            </span>
          </h1>
          <p className="ws-lead">{t(adults ? (reads ? 'ln.leadAdultsReads' : 'ln.leadAdults') : reads ? 'ln.leadReads' : 'ln.lead')}</p>
          <AddCourse course="lashon" />
        </header>

        <section className="ln-stats" aria-label={t('ln.statsLbl')}>
          <span className="ln-stat">
            <b>{adults ? '' : '🔥 '}{habit.streak}</b>
            <small>{t('ln.streak')}</small>
          </span>
          <span className="ln-stat ln-goal">
            <b>{today >= GOAL ? t('ln.goalDone') : t('ln.goal', { xp: today, goal: GOAL })}</b>
            <span className="tk-words-bar" role="img" aria-label={`${Math.min(100, Math.round((100 * today) / GOAL))}%`}>
              <span style={{ width: `${Math.min(100, (100 * today) / GOAL)}%` }} />
            </span>
          </span>
          <span className="ln-stat">
            <b>{adults ? '' : '⚡ '}{xpTotal(store)}</b>
            <small>{t('ln.total')}</small>
          </span>
        </section>

        {!reads && (
          <section className="ln-track">
            <h2 className="tw-h2">
              {t('ln.abc')} <small>{t('ln.abcSub')}</small>
            </h2>
            {weak(abc)}
            {path(abc)}
          </section>
        )}

        <section className="ln-track">
          <h2 className="tw-h2">
            {t(adults ? 'ln.tanakh' : 'ln.torah')} <small>{t(adults ? 'ln.tanakhSub' : 'ln.torahSub')}</small>
          </h2>
          {!adults || tanakh ? (
            <>
              {weak(words)}
              {path(words)}
            </>
          ) : (
            <p className="ln-group">{t('ln.loading')}</p>
          )}
        </section>

        <p className="ac-fac-links">
          {adults ? (
            <a href="#/words">{t('words.mine')} →</a>
          ) : (
            <a href="#/torah-words">{t('tw.title')} →</a>
          )}
          {!reads && <a href="#/letters">{t('abc.title')} →</a>}
          <a href="#/academy">{t('academy.title')} →</a>
        </p>
      </div>
      <Colophon />
      {run && <Lesson key={`${run.unit.id}-${run.part?.[0]?.key}-${run.exam}`} unit={run.unit} part={run.part} hard={run.hard} exam={run.exam} warm={run.warm} known={knownOf(run.unit)} adults={adults} onClose={() => setRun(null)} />}
    </>
  );
}

type State = 'answer' | 'right' | 'wrong';

/**
 * One lesson over the page: the exercises one by one; a wrong one comes back once at the end. An `exam` — the whole unit,
 * no second chances: ♥ for the mistakes left; one more than `EXAM_LIVES` — failed.
 */
function Lesson({ unit, part, hard, exam, warm, known, adults, onClose }: { unit: Unit; part: Item[] | null; hard?: boolean; exam?: boolean; warm?: Item[]; known: Known; adults: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [queue, setQueue] = useState<Exercise[]>(() => (exam ? makeExam(unit) : makeLesson(unit, part, hard, warm)));
  /** the first answer for each letter / word — remembered after the lesson (spacing, «Трудные»); the missed — shown at the end */
  const answers = useRef<Answers>({});
  const missed = useRef<Item[]>([]);
  const [failed, setFailed] = useState(false);
  const [i, setI] = useState(0);
  const [state, setState] = useState<State>('answer');
  const [sel, setSel] = useState<string | null>(null);
  const [built, setBuilt] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [combo, setCombo] = useState(0);
  /** «Составьте стих»: counted, but the order was not exact — the right verse is shown */
  const [nearly, setNearly] = useState(false);
  const [sound, setSound] = useState(soundOn);
  const [done, setDone] = useState<{ xp: number; added: number } | null>(null);
  const [requeued, setRequeued] = useState(false);
  const retried = useRef(new Set<Exercise>());
  const asked = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  // the lesson covers the page: Escape closes it, the page under it doesn't scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    box.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', key);
    };
  }, [onClose]);

  const ex = queue[i];
  const next = () => {
    setState('answer');
    setRequeued(false);
    setSel(null);
    setBuilt([]);
    setNearly(false);
    if (exam && mistakes > EXAM_LIVES) setFailed(true);
    else if (i + 1 < queue.length) setI(i + 1);
    else if (exam) {
      passExam(unit, answers.current);
      // adults: the words of a unit passed at once — «Знаю» in «Мои слова» (the review there confirms them)
      let added = 0;
      if (adults && unit.track === 'words') {
        const s = readWordStore();
        for (const it of unit.items) if (!inDeck(s, it.key)) (markKnown(it.key), added++);
      }
      setDone({ xp: XP_EXAM, added });
    } else {
      const xp = mistakes ? XP : XP_PERFECT;
      finishLesson(unit, part, xp, answers.current);
      // adults: the new words of the lesson go to «Мои слова» — the review there counts for the certificate
      let added = 0;
      if (adults && unit.track === 'words' && part) {
        const s = readWordStore();
        for (const it of part) if (!inDeck(s, it.key)) (markLearn(it.key), added++);
      }
      setDone({ xp, added });
    }
  };
  const answer = (right: boolean) => {
    setState(right ? 'right' : 'wrong');
    tone(right);
    if (right) setCombo((n) => n + 1);
    else setCombo(0);
    if (!retried.current.has(ex)) {
      asked.current++;
      if (right) setFirstTry((n) => n + 1);
      // the item asked: a verse — its word of the lesson (a verse without one is not a word to remember)
      const it = ex.t === 'build' ? (ex.verse ? ex.word : ex.item) : ex.t === 'intro' || ex.t === 'match' ? undefined : ex.item;
      if (it && !(it.key in answers.current)) {
        answers.current[it.key] = right;
        if (!right) missed.current.push(it);
      }
    }
    if (!right) {
      setMistakes((n) => n + 1);
      if (!exam && !retried.current.has(ex)) {
        retried.current.add(ex);
        setQueue((q) => [...q, ex]);
        setRequeued(true);
      }
    }
    // children: the Torah words keep their stars («Слова Торы»)
    if (!adults && unit.track === 'words' && ex.t === 'pick') answerWord(ex.item.key, right);
  };
  const check = () => {
    if (!ex || ex.t === 'intro' || ex.t === 'match') return;
    if (ex.t === 'build') {
      const words = built.map((k) => ex.tiles[k]);
      setNearly(nearlyRight(ex, words));
      answer(isRight(ex, words));
    }
    else if (sel != null) answer(isRight(ex, sel));
  };
  const ready = ex && (ex.t === 'build' ? built.length > 0 : sel != null);

  if (failed)
    return (
      <div className="ln-session" role="dialog" aria-modal="true" aria-label={t('ln.exam')} ref={box} tabIndex={-1}>
        <div className="ln-end">
          <h2>{t('ln.examFail')}</h2>
          <p>{t('ln.examFailNote', { n: EXAM_LIVES })}</p>
          <button type="button" className="btn ln-big" onClick={onClose}>
            {t('ln.continueBtn')}
          </button>
        </div>
      </div>
    );

  if (done)
    return (
      <div className="ln-session" role="dialog" aria-modal="true" aria-label={t('ln.title')} ref={box} tabIndex={-1}>
        <div className="ln-end">
          {!adults && (
            <p className="ln-end-ic" aria-hidden="true">
              {mistakes ? '🎉' : '🏆'}
            </p>
          )}
          <h2>{t(exam ? 'ln.examPass' : 'ln.done')}</h2>
          <p className="ln-xp">{t('ln.xp', { n: done.xp })}</p>
          {!mistakes && <p className="ln-perfect">{t('ln.perfect')}</p>}
          <p>{t('ln.acc', { k: firstTry, n: asked.current })}</p>
          <p>
            <Bar k={progressOf(unit, readCourse(), known)} n={1} />
          </p>
          {done.added > 0 && <p className="ln-note">{t(exam ? 'ln.addedKnown' : 'ln.added', { n: done.added })}</p>}
          {/* the mistakes once more, quietly: what to remember — they come back in the next lessons («Повторим») */}
          {missed.current.length > 0 && (
            <div className="ln-missed">
              <h3>{t('ln.missed')}</h3>
              <ul>
                {missed.current.map((it) => (
                  <li key={it.key}>
                    <span className="he" lang="he">
                      {it.he}
                    </span>{' '}
                    — {it.tr}
                  </li>
                ))}
              </ul>
              <small>{t(unit.track === 'abc' ? 'ln.missedNoteLetters' : 'ln.missedNote')}</small>
            </div>
          )}
          <button type="button" className="btn ln-big" onClick={onClose}>
            {t('ln.continueBtn')}
          </button>
        </div>
      </div>
    );

  return (
    <div className="ln-session" role="dialog" aria-modal="true" aria-label={t('ln.title')} ref={box} tabIndex={-1}>
      <div className="ln-top">
        <button type="button" className="ln-x" onClick={onClose} aria-label={t('ln.close')}>
          ✕
        </button>
        <span className="ln-bar" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={i}>
          <span style={{ width: `${(100 * i) / queue.length}%` }} />
        </span>
        {exam && (
          <span className="ln-lives" aria-label={t('ln.lives', { n: Math.max(0, EXAM_LIVES - mistakes) })}>
            {'♥'.repeat(Math.max(0, EXAM_LIVES - mistakes))}
            <i>{'♥'.repeat(Math.min(EXAM_LIVES, mistakes))}</i>
          </span>
        )}
        {combo >= 3 && <span className="ln-combo">{adults ? '' : '🔥 '}{combo}</span>}
        <button
          type="button"
          className="ln-x"
          aria-pressed={sound}
          aria-label={t('ln.sound')}
          onClick={() => {
            try {
              localStorage.setItem(SOUND_KEY, sound ? '0' : '1');
            } catch {}
            setSound(!sound);
          }}
        >
          {sound ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="ln-body" aria-live="polite">
        {ex.t === 'intro' && <Intro item={ex.item} letter={unit.track === 'abc'} />}
        {ex.t === 'pick' && <Pick ex={ex} letter={unit.track === 'abc'} sel={sel} state={state} onPick={setSel} />}
        {ex.t === 'match' && <Match key={i} pairs={ex.pairs} onMiss={() => (!exam && setMistakes((n) => n + 1), tone(false))} onDone={() => answer(true)} />}
        {ex.t === 'build' && <Build ex={ex} built={built} state={state} onBuilt={setBuilt} />}
        {ex.t === 'gap' && <Gap ex={ex} sel={sel} state={state} onPick={setSel} />}
        {ex.t === 'root' && <Root ex={ex} sel={sel} state={state} onPick={setSel} />}
      </div>

      <div className={`ln-foot ${state}`}>
        {state !== 'answer' && (
          <div className="ln-fb">
            <b>{state === 'right' ? (combo >= 3 ? t('ln.combo', { n: combo }) : t('ln.right')) : t('ln.wrong')}</b>
            {state === 'right' && nearly && <span className="ln-sol-h">{t('ln.nearly')}</span>}
            {(state === 'wrong' || (state === 'right' && nearly)) && <Solution ex={ex} t={t} />}
            {requeued && <small>{t('ln.retry')}</small>}
          </div>
        )}
        {ex.t === 'intro' ? (
          <button type="button" className="btn ln-big" onClick={next}>
            {t('ln.continueBtn')}
          </button>
        ) : state === 'answer' ? (
          ex.t !== 'match' && (
            <button type="button" className="btn ln-big" disabled={!ready} onClick={check}>
              {t('ln.check')}
            </button>
          )
        ) : (
          <button type="button" className="btn ln-big" onClick={next} autoFocus>
            {t('ln.continueBtn')}
          </button>
        )}
      </div>
    </div>
  );
}

/** the right answer under a wrong one */
function Solution({ ex, t }: { ex: Exercise; t: T }) {
  if (ex.t === 'intro' || ex.t === 'match') return null;
  const he = ex.t === 'gap' ? ex.item.he : ex.t === 'root' ? ex.item.root! : ex.item.he;
  const tail = ex.t === 'pick' && ex.ask === 'value' ? ` = ${ex.item.value}` : ex.t === 'pick' && ex.ask === 'sound' ? ` — ${ex.item.sound}` : ` — ${ex.item.tr}`;
  return (
    <span className="ln-sol">
      {ex.t === 'root' && <>{t('ln.rootOf')} </>}
      <span className="he" lang="he">
        {he}
      </span>
      {tail}
    </span>
  );
}

function Prompt({ item, letter, big }: { item: Item; letter: boolean; big?: boolean }) {
  const level = useHebrewLevel();
  return (
    <div className="ln-prompt">
      {item.img && <img src={item.img} alt="" />}
      <span className={`he ln-he${big || letter ? ' big' : ''}`} lang="he">
        {item.he}
      </span>
      {level === 'none' && item.translit && <small className="tw-translit">{item.translit}</small>}
    </div>
  );
}

function Intro({ item, letter }: { item: Item; letter: boolean }) {
  const { t } = useI18n();
  return (
    <>
      <p className="ln-ask">
        <span className="ln-new">{t(letter ? 'ln.newLetter' : 'ln.new')}</span>
      </p>
      <Prompt item={item} letter={letter} big />
      <p className="ln-intro-tr">{item.tr}</p>
      {letter && (
        <p className="ln-intro-meta">
          {t('ln.soundIs', { s: item.sound ?? '' })} · {t('ln.valueIs', { n: item.value ?? 0 })}
        </p>
      )}
      {item.root && (
        <p className="ln-intro-meta">
          {t('ln.rootOf')}{' '}
          <span className="he" lang="he">
            {item.root}
          </span>
        </p>
      )}
      {/* a word is remembered in its sentence: the short verse with it, as it stands in the Tanakh */}
      {item.verse && (
        <blockquote className="ln-intro-verse">
          <span className="he" lang="he">
            {item.verse.words.join(' ')}
          </span>
          <span>
            {item.verse.tr} <small>({item.verse.ref})</small>
          </span>
        </blockquote>
      )}
    </>
  );
}

const ASK: Record<string, MessageKey> = { tr: 'ln.q.tr', he: 'ln.q.he', value: 'ln.q.value', sound: 'ln.q.sound' };

function Pick({ ex, letter, sel, state, onPick }: { ex: Extract<Exercise, { t: 'pick' }>; letter: boolean; sel: string | null; state: State; onPick: (k: string) => void }) {
  const { t } = useI18n();
  const he = ex.ask === 'he';
  return (
    <>
      <p className="ln-ask">
        {ex.warm && <span className="ln-new ln-warm">{t('ln.warm')}</span>}
        {t(letter && ex.ask === 'tr' ? 'ln.q.name' : ASK[ex.ask])}
      </p>
      {he ? <p className="ln-tr-big">{ex.item.tr}</p> : <Prompt item={ex.item} letter={letter} />}
      <div className={`ln-opts${he ? ' he-opts' : ''}`}>
        {ex.options.map((o) => {
          const mark = state === 'answer' ? (sel === o.key ? ' sel' : '') : o.key === ex.item.key ? ' right' : sel === o.key ? ' wrong' : '';
          return (
            <button key={o.key} type="button" className={`ln-opt${mark}`} disabled={state !== 'answer'} onClick={() => onPick(o.key)}>
              {he ? (
                <span className="he" lang="he">
                  {o.he}
                </span>
              ) : ex.ask === 'value' ? (
                <span className="num">{o.value}</span>
              ) : ex.ask === 'sound' ? (
                o.sound
              ) : (
                o.tr
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

/** «Найдите пары»: the Hebrew on one side, the translations on the other; a right pair goes grey, a wrong one shakes */
function Match({ pairs, onMiss, onDone }: { pairs: Item[]; onMiss: () => void; onDone: () => void }) {
  const { t } = useI18n();
  const [left] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [right] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [ok, setOk] = useState<string[]>([]);
  const [bad, setBad] = useState<string[]>([]);
  useEffect(() => {
    if (!a || !b) return;
    if (a === b) {
      const all = [...ok, a];
      setOk(all);
      if (all.length === pairs.length) onDone();
      setA(null);
      setB(null);
      return;
    }
    setBad([a, b]);
    onMiss();
    const id = setTimeout(() => {
      setBad([]);
      setA(null);
      setB(null);
    }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b]);
  const cls = (k: string, side: string | null) => `ln-opt${ok.includes(k) ? ' gone' : bad.includes(k) && side === k ? ' wrong shake' : side === k ? ' sel' : ''}`;
  return (
    <>
      <p className="ln-ask">{t('ln.q.match')}</p>
      <div className="ln-match">
        <div>
          {left.map((x) => (
            <button key={x.key} type="button" className={`${cls(x.key, a)} he-opt`} disabled={ok.includes(x.key)} onClick={() => setA(x.key)}>
              <span className="he" lang="he">
                {x.he}
              </span>
            </button>
          ))}
        </div>
        <div>
          {right.map((x) => (
            <button key={x.key} type="button" className={cls(x.key, b)} disabled={ok.includes(x.key)} onClick={() => setB(x.key)}>
              {x.tr}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/** «Соберите слово» / «Расставьте слова»: tap a tile to put it in the line (right to left), tap it there to take it back */
function Build({ ex, built, state, onBuilt }: { ex: Extract<Exercise, { t: 'build' }>; built: number[]; state: State; onBuilt: (b: number[]) => void }) {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  const tile = (k: number) => (
    <>
      <span className="he" lang="he">
        {ex.tiles[k]}
      </span>
      {level === 'none' && !ex.words && <small>{letterName(ex.tiles[k][0], locale)}</small>}
    </>
  );
  return (
    <>
      <p className="ln-ask">{t(ex.verse ? 'ln.q.verse' : ex.words ? 'ln.q.order' : 'ln.q.build')}</p>
      <p className="ln-tr-big">
        {ex.item.tr}
        {ex.verse && (
          <small className="ln-ref">
            {ex.verse.ref}
          </small>
        )}
      </p>
      {ex.word && (
        <p className="ln-hint">
          {t('ln.verseWord')}{' '}
          <span className="he" lang="he">
            {ex.word.he}
          </span>{' '}
          — {ex.word.tr}
        </p>
      )}
      {/* a verse — no picture: the tiles stay on the screen */}
      {ex.item.img && !ex.verse && (
        <div className="ln-prompt">
          <img src={ex.item.img} alt="" />
        </div>
      )}
      <div className={`ln-line${ex.words ? ' words' : ''}`} dir="rtl" aria-label={t('ln.line')}>
        {built.map((k) => (
          <button key={k} type="button" className="ln-tile" disabled={state !== 'answer'} onClick={() => onBuilt(built.filter((x) => x !== k))}>
            {tile(k)}
          </button>
        ))}
      </div>
      <div className="ln-bank" dir="rtl">
        {ex.tiles.map((_, k) => (
          <button key={k} type="button" className={`ln-tile${built.includes(k) ? ' used' : ''}`} disabled={state !== 'answer' || built.includes(k)} onClick={() => onBuilt([...built, k])}>
            {tile(k)}
          </button>
        ))}
      </div>
      <small className="ln-hint">{t('ln.rtl')}</small>
    </>
  );
}

function Gap({ ex, sel, state, onPick }: { ex: Extract<Exercise, { t: 'gap' }>; sel: string | null; state: State; onPick: (k: string) => void }) {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  return (
    <>
      <p className="ln-ask">{t('ln.q.gap')}</p>
      <p className="ln-tr-big">{ex.item.tr}</p>
      <p className="he ln-he big" lang="he">
        {ex.parts.map((p, k) =>
          k === ex.at ? (
            <span key={k} className="ln-hole">
              {state === 'right' || state === 'wrong' ? ex.parts[ex.at] : sel ?? '  '}
            </span>
          ) : (
            p
          ),
        )}
      </p>
      <div className="ln-opts he-opts four">
        {ex.options.map((o) => {
          const mark = state === 'answer' ? (sel === o ? ' sel' : '') : o === ex.parts[ex.at] ? ' right' : sel === o ? ' wrong' : '';
          return (
            <button key={o} type="button" className={`ln-opt${mark}`} disabled={state !== 'answer'} onClick={() => onPick(o)}>
              <span className="he" lang="he">
                {o}
              </span>
              {level === 'none' && <small>{letterName(o[0], locale)}</small>}
            </button>
          );
        })}
      </div>
    </>
  );
}

function Root({ ex, sel, state, onPick }: { ex: Extract<Exercise, { t: 'root' }>; sel: string | null; state: State; onPick: (k: string) => void }) {
  const { t } = useI18n();
  return (
    <>
      <p className="ln-ask">{t('ln.q.root')}</p>
      <Prompt item={ex.item} letter={false} />
      <p className="ln-intro-tr">{ex.item.tr}</p>
      <div className="ln-opts he-opts">
        {ex.options.map((o) => {
          const mark = state === 'answer' ? (sel === o ? ' sel' : '') : o === ex.item.root ? ' right' : sel === o ? ' wrong' : '';
          return (
            <button key={o} type="button" className={`ln-opt${mark}`} disabled={state !== 'answer'} onClick={() => onPick(o)}>
              <span className="he" lang="he">
                {o}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
