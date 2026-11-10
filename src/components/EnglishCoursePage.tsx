import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { celebrate, feedback } from '../core/fx';
import { exampleOf, loadDict, loadExamples, type Dict } from '../core/words';
import {
  abcUnits,
  canSpeak,
  finishLesson,
  freshOf,
  GOAL,
  isDone,
  isOpen,
  makeLesson,
  metCount,
  NEW_PER_LESSON,
  readEn,
  speak,
  verseNearly,
  verseRight,
  verseWords,
  wordUnits,
  XP,
  XP_PERFECT,
  xpToday,
  xpTotal,
  type EnExercise,
  type EnItem,
  type EnStore,
  type EnUnit,
  type EnVerse,
  type Target,
} from '../core/enCourse';

/**
 * `#/english` — «אנגלית דרך התנ״ך»: English for Hebrew speakers (src/core/enCourse.ts). The whole page is in Hebrew, right to
 * left (`HE` — its texts; the site's languages ru/en/de are not used here), open without signing in (src/core/gate.ts).
 * The same page teaches Russian (`#/russian`) and German (`#/german`): `target`; the texts that name the language — getters by `TG`.
 */
/** the language being learned on the page now (one course page at a time) */
let TG: Target = 'en';
const LANG: Record<Target, { title: string; abc: string; in: string; tab: string; route: string }> = {
  en: { title: 'אנגלית דרך התנ״ך', abc: 'האותיות האנגליות', in: 'באנגלית', tab: 'אנגלית', route: 'english' },
  ru: { title: 'רוסית דרך התנ״ך', abc: 'האותיות הרוסיות', in: 'ברוסית', tab: 'רוסית', route: 'russian' },
  de: { title: 'גרמנית דרך התנ״ך', abc: 'האותיות הגרמניות', in: 'בגרמנית', tab: 'גרמנית', route: 'german' },
};
export const HE = {
  get title() {
    return LANG[TG].title;
  },
  sub: 'לדוברי עברית',
  get lead() {
    return `המילים שאתם מכירים מהתנ״ך — עכשיו ${LANG[TG].in}. מתחילים באותיות, ממשיכים למילים השכיחות ביותר בנביאים ובכתובים: 50 מילים בכל רמה. שיעור קצר — עד 5 מילים חדשות, תרגול ופסוק ${LANG[TG].in}.`;
  },
  get abcH() {
    return LANG[TG].abc;
  },
  choose: 'מה לומדים?',
  abcUnit: (a: string, b: string) => `אותיות ${a}–${b}`,
  wordsH: 'מילים מהתנ״ך',
  wordsUnit: (n: number) => `רמה ${n}`,
  wordsRange: (a: number, b: number) => `המילים השכיחות ${a}–${b}`,
  met: (k: number, n: number) => `${k} מתוך ${n}`,
  start: 'התחלה',
  cont: 'להמשיך',
  review: 'חזרה',
  locked: 'ייפתח אחרי הרמה הקודמת',
  today: (x: number, g: number) => `היום: ${x} נקודות מתוך ${g}`,
  goalHit: '✓ יעד היום הושג',
  total: (x: number) => `סך הכול: ${x} נקודות`,
  loading: 'טוען…',
  newWord: 'מילה חדשה',
  newLetter: 'אות חדשה',
  listen: 'להשמיע',
  get noVoice() {
    return `בדפדפן הזה אין קול ${LANG[TG].in}`;
  },
  name: 'שם האות:',
  sounds: 'נשמעת כמו:',
  asIn: 'כמו במילה',
  get askHe() {
    return `איך אומרים ${LANG[TG].in}?`;
  },
  askEn: 'מה פירוש המילה?',
  askHear: 'הקשיבו: מה שמעתם?',
  askLetterHe: 'איזו אות זו?',
  askLetterEn: 'איך קוראים לאות?',
  askLetterHear: 'הקשיבו: איזו אות שמעתם?',
  pairs: 'התאימו את הזוגות',
  get spell() {
    return `הרכיבו את המילה ${LANG[TG].in}`;
  },
  get verse() {
    return `סדרו את הפסוק ${LANG[TG].in}`;
  },
  verseWord: 'בפסוק — המילה',
  check: 'בדיקה',
  next: 'המשך',
  right: 'נכון!',
  wrong: 'התשובה הנכונה:',
  nearly: 'התקבל! הסדר המדויק:',
  combo: (n: number) => `${n} ברצף!`,
  close: 'סגירה',
  undo: 'ביטול',
  doneH: 'השיעור הושלם!',
  points: 'נקודות',
  accuracy: 'דיוק',
  perfect: 'בלי טעויות!',
  back: 'חזרה לדרך',
  again: 'שיעור נוסף',
  get credit() {
    return TG === 'en'
      ? 'המילים — Open Scriptures Hebrew Bible (CC BY 4.0) ומילון סטרונג (נחלת הכלל); התרגום לאנגלית — של הפרויקט; הפסוקים באנגלית — JPS 1985 (CC BY-NC); הקול — של הדפדפן.'
      : `המילים — Open Scriptures Hebrew Bible (CC BY 4.0) ומילון סטרונג (נחלת הכלל); התרגום והפסוקים ${LANG[TG].in} — של הפרויקט (CC BY-NC); הקול — של הדפדפן.`;
  },
};

/** «ii-samuel 3:5» → «II Samuel 3:5» (the English names of the books, as the verse slugs) */
const refName = (ref: string) => ref.replace(/^[\w-]+/, (b) => b.split('-').map((w) => (/^i+$/.test(w) ? w.toUpperCase() : w === 'of' ? w : w[0].toUpperCase() + w.slice(1))).join(' '));

const he = (s: string) => (
  <span className="he" lang="he">
    {s}
  </span>
);
const en = (s: string) => (
  <span className="enc-en" lang={TG} dir="ltr">
    {s}
  </span>
);

export function EnglishCoursePage({ target = 'en' }: { target?: Target }) {
  TG = target;
  const { t } = useI18n();
  const [dict, setDict] = useState<Dict | null>(null);
  const [verses, setVerses] = useState<Map<string, EnVerse>>(new Map());
  const [store, setStore] = useState<EnStore>(() => readEn(target));
  const [run, setRun] = useState<{ unit: EnUnit; ex: EnExercise[]; seed: number } | null>(null);

  useEffect(() => {
    document.title = `${HE.title} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    let live = true;
    loadDict(target).then((d) => live && setDict(d));
    loadExamples(target).then((all) => {
      if (!live) return;
      const m = new Map<string, EnVerse>();
      for (const id of Object.keys(all)) {
        const x = exampleOf(all, id);
        // Russian and German: only the project's own translation (an English JPS verse is no help here)
        if (x && (target === 'en' || !x.en)) m.set(id, { he: x.he.join(''), words: verseWords(x.tr), ref: refName(x.ref) });
      }
      setVerses(m);
    });
    return () => {
      live = false;
    };
  }, [target]);

  const units = useMemo(() => [...abcUnits(target), ...(dict ? wordUnits(dict.words, dict.tr) : [])], [dict, target]);
  const abc = units.filter((u) => u.track === 'abc');
  const words = units.filter((u) => u.track === 'words');

  const start = (unit: EnUnit) => {
    const s = readEn(target);
    const fresh = freshOf(unit, s).slice(0, NEW_PER_LESSON);
    const old = unit.items.filter((it) => s.s[it.key]);
    const seed = Date.now() % 100000;
    // a unit already done — a review of all its items
    const ex = makeLesson(unit, fresh, fresh.length ? old : unit.items, seed, { verse: (it) => verses.get(it.key), hear: canSpeak(), target });
    setRun({ unit, ex, seed });
  };

  const x = xpToday(store);
  return (
    <>
      <TopBar title={HE.title} />
      <div className="wrap enc" dir="rtl" lang="he">
        <header className="tk-head">
          <h1>
            {HE.title} <small className="enc-sub">{HE.sub}</small>
          </h1>
          <p className="ws-lead">{HE.lead}</p>
        </header>
        <nav className="enc-langs" aria-label={HE.choose}>
          {(['en', 'ru', 'de'] as const).map((l) => (
            <a key={l} href={`#/${LANG[l].route}`} className={l === target ? 'on' : undefined} aria-current={l === target ? 'page' : undefined}>
              {LANG[l].tab}
            </a>
          ))}
        </nav>
        <section className="ws-stats">
          <b className="ws-cov">{x >= GOAL ? HE.goalHit : HE.today(x, GOAL)}</b>
          <span className="tk-words-bar" role="img" aria-label={`${Math.min(100, Math.round((100 * x) / GOAL))}%`}>
            <span style={{ width: `${Math.min(100, (100 * x) / GOAL)}%` }} />
          </span>
          <small>{HE.total(xpTotal(store))}</small>
        </section>

        <h2 className="tw-h2">{HE.abcH}</h2>
        <Path units={abc} all={units} store={store} onStart={start} />

        <h2 className="tw-h2">{HE.wordsH}</h2>
        {dict ? <Path units={words} all={units} store={store} onStart={start} /> : <p className="ws-lead">{HE.loading}</p>}

        <p className="enc-credit">{HE.credit}</p>
      </div>
      <Colophon />
      {run && (
        <Session
          key={run.seed}
          unit={run.unit}
          queue={run.ex}
          onClose={() => (setRun(null), setStore(readEn(target)))}
          onAgain={() => {
            setStore(readEn(target));
            start(run.unit);
          }}
        />
      )}
    </>
  );
}

/** the levels of a track; ten at a time, the rest folded — as in «Святой язык» */
function Path({ units, all, store, onStart }: { units: EnUnit[]; all: EnUnit[]; store: EnStore; onStart: (u: EnUnit) => void }) {
  const [more, setMore] = useState(false);
  const cur = units.findIndex((u) => !isDone(u, store));
  const shown = more ? units : units.slice(0, Math.max(10, cur + 3));
  return (
    <ol className="enc-path">
      {shown.map((u) => {
        const i = all.indexOf(u);
        const open = isOpen(all, i, store);
        const done = isDone(u, store);
        const k = metCount(u, store);
        const first = u.items[0];
        const last = u.items[u.items.length - 1];
        return (
          <li key={u.id} className={`enc-unit${done ? ' done' : ''}${open ? '' : ' locked'}`}>
            <div className="enc-unit-h">
              <b>{u.track === 'abc' ? HE.abcUnit(first.main, last.main) : HE.wordsUnit(u.n)}</b>
              <small>
                {u.track === 'abc' ? (
                  en(u.items.map((x) => x.main).join(' '))
                ) : (
                  <>
                    {HE.wordsRange(u.from!, u.to!)} · {he(first.he)} — {en(first.main)}
                  </>
                )}
              </small>
              <span className="tk-words-bar">
                <span style={{ width: `${(100 * k) / u.items.length}%` }} />
              </span>
              <small>{HE.met(k, u.items.length)}</small>
            </div>
            <button type="button" className={`btn${done ? ' ghost' : ''}`} disabled={!open} onClick={() => onStart(u)} title={open ? undefined : HE.locked}>
              {!open ? '🔒' : done ? HE.review : k ? HE.cont : HE.start}
            </button>
          </li>
        );
      })}
      {shown.length < units.length && (
        <li className="enc-more">
          <button type="button" className="btn ghost" onClick={() => setMore(true)}>
            עוד {units.length - shown.length} רמות
          </button>
        </li>
      )}
    </ol>
  );
}

type State = 'answer' | 'right' | 'wrong';

function Session({ unit, queue: first, onClose, onAgain }: { unit: EnUnit; queue: EnExercise[]; onClose: () => void; onAgain: () => void }) {
  const [queue, setQueue] = useState(first);
  const [i, setI] = useState(0);
  const [state, setState] = useState<State>('answer');
  const [sel, setSel] = useState<string | null>(null);
  const [built, setBuilt] = useState<number[]>([]);
  const [nearly, setNearly] = useState(false);
  const [combo, setCombo] = useState(0);
  const [miss, setMiss] = useState<Set<string>>(new Set());
  const [asked, setAsked] = useState(0);
  const [done, setDone] = useState<{ xp: number; acc: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const letter = unit.track === 'abc';
  useEffect(() => {
    box.current?.focus();
    document.documentElement.classList.add('ln-open');
    return () => document.documentElement.classList.remove('ln-open');
  }, []);
  const ex = queue[i];
  // the word is spoken by itself on a new card and on «what did you hear?»
  useEffect(() => {
    if (!ex) return;
    if (ex.t === 'intro' || (ex.t === 'pick' && ex.ask === 'hear')) speak(ex.item.main, TG);
  }, [ex]);

  if (done)
    return (
      <div className="ln-session" role="dialog" aria-modal="true" aria-label={HE.doneH} dir="rtl" lang="he" ref={box} tabIndex={-1}>
        <div className="ln-body enc-end">
          <h2 className="ln-ask">{HE.doneH}</h2>
          {done.acc === 100 && <p className="ln-perfect">{HE.perfect}</p>}
          <div className="enc-tiles">
            <span>
              <b>{done.xp}</b>
              {HE.points}
            </span>
            <span>
              <b>{done.acc}%</b>
              {HE.accuracy}
            </span>
          </div>
          <span className="ws-btns">
            <button type="button" className="btn ghost" onClick={onClose}>
              {HE.back}
            </button>
            <button type="button" className="btn" onClick={onAgain}>
              {HE.again}
            </button>
          </span>
        </div>
      </div>
    );

  const finish = (missed: Set<string>, n: number) => {
    const keys = new Set(queue.flatMap((e) => (e.t === 'pairs' ? e.items : [e.item])).map((x) => x.key));
    const right = [...keys].filter((k) => !missed.has(k));
    const xp = missed.size ? XP : XP_PERFECT;
    finishLesson(right, xp, TG);
    const acc = Math.round((100 * Math.max(0, n - missed.size)) / Math.max(1, n));
    celebrate(missed.size ? 'small' : 'big', true);
    feedback(missed.size ? 'finish' : 'perfect');
    setDone({ xp, acc });
  };
  const next = () => {
    setSel(null);
    setBuilt([]);
    setNearly(false);
    setState('answer');
    if (i + 1 >= queue.length) finish(miss, asked);
    else setI(i + 1);
  };
  const answer = (ok: boolean, item: EnItem, near = false) => {
    setAsked((n) => n + 1);
    setNearly(near);
    if (ok) {
      setCombo((c) => c + 1);
      feedback(combo + 1 >= 5 && (combo + 1) % 5 === 0 ? 'combo' : 'right', combo + 1);
      setState('right');
    } else {
      setCombo(0);
      feedback('wrong');
      setMiss((m) => new Set(m).add(item.key));
      // a wrong answer comes back at the end of the lesson
      setQueue((q) => [...q, ex]);
      setState('wrong');
    }
  };
  const check = () => {
    if (ex.t === 'pick') answer(sel === ex.item.key, ex.item);
    else if (ex.t === 'spell') answer(built.map((k) => ex.tiles[k]).join('') === ex.item.main.toLowerCase(), ex.item);
    else if (ex.t === 'verse') {
      const got = built.map((k) => ex.tiles[k]);
      const ok = verseRight(ex.verse.words, got);
      const near = !ok && verseNearly(ex.verse.words, got);
      answer(ok || near, ex.item, near);
    }
  };
  const ready = ex.t === 'pick' ? !!sel : ex.t === 'spell' ? built.length === ex.item.main.length : ex.t === 'verse' ? built.length === ex.verse.words.length : false;

  return (
    <div className="ln-session enc-session" role="dialog" aria-modal="true" aria-label={HE.title} dir="rtl" lang="he" ref={box} tabIndex={-1}>
      <div className="ln-top">
        <button type="button" className="ln-x" onClick={onClose} aria-label={HE.close}>
          ✕
        </button>
        <span className="ln-bar" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={i}>
          <span style={{ width: `${(100 * i) / queue.length}%` }} />
        </span>
        {combo >= 3 && <span className="ln-combo">{combo}</span>}
      </div>

      <div className="ln-body" aria-live="polite">
        {ex.t === 'intro' && <Intro item={ex.item} letter={letter} />}
        {ex.t === 'pick' && <Pick ex={ex} letter={letter} sel={sel} state={state} onPick={setSel} />}
        {ex.t === 'pairs' && <Pairs key={i} items={ex.items} letter={letter} onMiss={(it) => (setMiss((m) => new Set(m).add(it.key)), feedback('wrong'))} onPair={() => feedback('pair')} onDone={() => (setAsked((n) => n + 1), setState('right'))} />}
        {(ex.t === 'spell' || ex.t === 'verse') && (
          <Build ex={ex} built={built} state={state} onBuilt={setBuilt} />
        )}
      </div>

      <div className={`ln-foot ${state}`}>
        {state !== 'answer' && ex.t !== 'pairs' && (
          <div className="ln-fb">
            <b>{state === 'right' ? (combo >= 3 ? HE.combo(combo) : HE.right) : HE.wrong}</b>
            {state === 'right' && nearly && <span className="ln-sol-h">{HE.nearly}</span>}
            {(state === 'wrong' || nearly) && <Solution ex={ex} />}
          </div>
        )}
        {ex.t === 'intro' || state !== 'answer' ? (
          <button type="button" className="btn ln-big" onClick={next} autoFocus>
            {HE.next}
          </button>
        ) : (
          ex.t !== 'pairs' && (
            <button type="button" className="btn ln-big" disabled={!ready} onClick={check}>
              {HE.check}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function Speak({ text }: { text: string }) {
  if (!canSpeak()) return <small className="ln-hint">{HE.noVoice}</small>;
  return (
    <button type="button" className="enc-speak" onClick={() => speak(text, TG)} aria-label={`${HE.listen}: ${text}`}>
      🔊 {HE.listen}
    </button>
  );
}

function Intro({ item, letter }: { item: EnItem; letter: boolean }) {
  return (
    <div className="ln-prompt">
      <span className="ln-new">{letter ? HE.newLetter : HE.newWord}</span>
      {letter ? (
        <>
          <p className="enc-big">{en(item.en)}</p>
          <p className="ln-intro-meta">
            {HE.name} {he(item.he)} · {HE.sounds} {he(item.sound!)}
          </p>
          <p className="ln-intro-meta">
            {HE.asIn} {en(item.word![0])} — {he(item.word![1])}
          </p>
        </>
      ) : (
        <>
          <p className="ln-he big">{item.he}</p>
          <p className="enc-big">{en(item.main)}</p>
          {item.en !== item.main && <p className="ln-intro-meta">{en(item.en)}</p>}
        </>
      )}
      <Speak text={letter && item.word ? `${item.main}. ${item.word[0]}` : item.main} />
    </div>
  );
}

/** what the learner sees as an option: English (`main`) or Hebrew */
const optText = (it: EnItem, inHebrew: boolean, letter: boolean) => (inHebrew ? he(it.he) : en(letter ? it.en : it.main));

function Pick({ ex, letter, sel, state, onPick }: { ex: Extract<EnExercise, { t: 'pick' }>; letter: boolean; sel: string | null; state: State; onPick: (k: string) => void }) {
  // `he` — Hebrew shown, English options; `en` / `hear` — English shown or heard, Hebrew options
  const optsHebrew = ex.ask !== 'he';
  const q = letter ? (ex.ask === 'he' ? HE.askLetterHe : ex.ask === 'en' ? HE.askLetterEn : HE.askLetterHear) : ex.ask === 'he' ? HE.askHe : ex.ask === 'en' ? HE.askEn : HE.askHear;
  return (
    <>
      <h2 className="ln-ask">{q}</h2>
      <div className="ln-prompt">
        {ex.ask === 'he' ? (
          letter ? (
            <p className="ln-intro-meta">
              {he(ex.item.he)} · {he(ex.item.sound!)}
            </p>
          ) : (
            <p className="ln-he big">{ex.item.he}</p>
          )
        ) : ex.ask === 'en' ? (
          <p className="enc-big">{en(letter ? ex.item.en : ex.item.main)}</p>
        ) : (
          <button type="button" className="enc-speak big" onClick={() => speak(ex.item.main, TG)} aria-label={HE.listen}>
            🔊
          </button>
        )}
      </div>
      <div className={`ln-opts${optsHebrew ? ' he-opts' : ''}`}>
        {ex.options.map((o) => {
          const cls = state === 'answer' ? (sel === o.key ? ' sel' : '') : o.key === ex.item.key ? ' right' : sel === o.key ? ' wrong' : ' gone';
          return (
            <button key={o.key} type="button" className={`ln-opt${cls}`} disabled={state !== 'answer'} onClick={() => onPick(o.key)} aria-pressed={sel === o.key}>
              {optText(o, optsHebrew, letter)}
            </button>
          );
        })}
      </div>
    </>
  );
}

function Pairs({ items, letter, onMiss, onPair, onDone }: { items: EnItem[]; letter: boolean; onMiss: (it: EnItem) => void; onPair: () => void; onDone: () => void }) {
  const right = useMemo(() => [...items].sort((a, b) => a.main.localeCompare(b.main)), [items]);
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [ok, setOk] = useState<Set<string>>(new Set());
  const [bad, setBad] = useState<string | null>(null);
  useEffect(() => {
    if (!a || !b) return;
    if (a === b) {
      const n = new Set(ok).add(a);
      setOk(n);
      onPair();
      if (n.size === items.length) window.setTimeout(onDone, 350);
    } else {
      setBad(`${a}|${b}`);
      onMiss(items.find((x) => x.key === a)!);
      window.setTimeout(() => setBad(null), 450);
    }
    setA(null);
    setB(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b]);
  const cls = (k: string, side: 'a' | 'b') =>
    `ln-opt${ok.has(k) ? ' right gone' : (side === 'a' ? a : b) === k ? ' sel' : ''}${bad && bad.split('|')[side === 'a' ? 0 : 1] === k ? ' wrong shake' : ''}`;
  return (
    <>
      <h2 className="ln-ask">{HE.pairs}</h2>
      <div className="ln-match">
        <div className="he-opts">
          {items.map((it) => (
            <button key={it.key} type="button" className={cls(it.key, 'a')} disabled={ok.has(it.key)} onClick={() => setA(it.key)}>
              {he(it.he)}
            </button>
          ))}
        </div>
        <div>
          {right.map((it) => (
            <button key={it.key} type="button" className={cls(it.key, 'b')} disabled={ok.has(it.key)} onClick={() => (setB(it.key), speak(it.main, TG))}>
              {en(letter ? it.en : it.main)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Build({ ex, built, state, onBuilt }: { ex: Extract<EnExercise, { t: 'spell' | 'verse' }>; built: number[]; state: State; onBuilt: (b: number[]) => void }) {
  const words = ex.t === 'verse';
  return (
    <>
      <h2 className="ln-ask">{words ? HE.verse : HE.spell}</h2>
      <div className="ln-prompt">
        {words ? (
          <>
            <p className="ln-he">{ex.verse.he}</p>
            <p className="ln-hint">
              {HE.verseWord} {he(ex.item.he)} — {en(ex.item.main)} · {en(ex.verse.ref)}
            </p>
          </>
        ) : (
          <>
            <p className="ln-he big">{ex.item.he}</p>
            <Speak text={ex.item.main} />
          </>
        )}
      </div>
      <div className={`ln-line enc-line${words ? ' words' : ''}`} dir="ltr" lang="en">
        {built.map((k, j) => (
          <button key={j} type="button" className="ln-tile" disabled={state !== 'answer'} onClick={() => onBuilt(built.filter((_, x) => x !== j))}>
            {ex.tiles[k]}
          </button>
        ))}
      </div>
      <div className="ln-bank enc-bank" dir="ltr" lang="en">
        {ex.tiles.map((w, k) => (
          <button key={k} type="button" className={`ln-tile${built.includes(k) ? ' used' : ''}`} disabled={state !== 'answer' || built.includes(k)} onClick={() => onBuilt([...built, k])}>
            {w}
          </button>
        ))}
      </div>
    </>
  );
}

function Solution({ ex }: { ex: EnExercise }) {
  if (ex.t === 'intro' || ex.t === 'pairs') return null;
  if (ex.t === 'verse') return <span className="ln-sol">{en(ex.verse.words.join(' '))}</span>;
  const it = ex.item;
  return (
    <span className="ln-sol">
      {he(it.he)} — {en(ex.t === 'pick' && it.key.startsWith('abc:') ? it.en : it.main)}
    </span>
  );
}
