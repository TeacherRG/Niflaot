/**
 * «Слова отрывка» — иврит по словам Танаха (TanakhWords.tsx под отрывком дня Пророков и Писаний).
 *
 * Словарь — src/tanakh/words.json (scripts/fetch-words.py): самые частые слова Пророков и Писаний в основной форме
 * (по разметке Open Scriptures Hebrew Bible, CC BY 4.0), без имён собственных, по порядку частоты; `cov` — сколько
 * процентов текста покрывают это слово и все более частые. Переводы — проекта: src/tanakh/words/<ru|en|de>.json;
 * учить можно только переведённые слова (начало списка). По дню — public/tanakh/words/<дата>.json: сколько слов в
 * отрывке раздела (`n`, без имён) и сколько раз в нём встречается каждое слово словаря (`w`).
 *
 * «Мои слова» — localStorage `niflaot:words` = { номер слова: [время, коробка, день повторения] } (ниже),
 * синхронизируется с аккаунтом (src/core/sync.ts: у одного слова — более позднее изменение).
 */
import { useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { localToday, root } from './tanakh';
import { normWord, type WordEntry } from './sync';
import type { Certificate, Progress } from './academy';
import { markStudied } from './habit';
import { noteAnswer } from './lashonStore';

export interface Word {
  /** номер Стронга */
  id: string;
  /** основная форма с огласовками (Имена — как во всём проекте) */
  he: string;
  pos: string;
  /** сколько раз встречается в Пророках и Писаниях */
  n: number;
  /** корень (у глагола — он сам) */
  root?: string;
  /** арамейское слово (Даниэль, Эзра) */
  aram?: 1;
  /** % текста, который покрывают это слово и все более частые */
  cov: number;
}
export type WordLang = 'ru' | 'en' | 'de';
export interface Dict {
  words: Word[];
  /** слов в Пророках и Писаниях без имён */
  total: number;
  /** номер слова → место по частоте (с 1) */
  rank: Map<string, number>;
  /** номер слова → перевод на языке сайта; только переведённые слова можно учить */
  tr: Record<string, string>;
}
/**
 * `v` — the words of each verse parsed (WordPop.tsx): «книга глава:стих» → for each word of our text (split at spaces and
 * maqaf) «prefixes|number|ending» (prefixes — OSHB letters b c d i k l m s; number `n` — a name, `H` — the Name; `!` first —
 * a ketiv), 0 — the word didn't match.
 */
export type DayWords = Record<Section, { n: number; w: Record<string, number>; v?: Record<string, (string | 0)[]> }>;

/** сколько слов отрывка предлагать в день */
export const PER_DAY = 5;

const dicts = new Map<WordLang, Promise<Dict>>();
/** Словарь и переводы — отдельным куском кода, только на странице отрывка. */
export function loadDict(lang: WordLang): Promise<Dict> {
  let p = dicts.get(lang);
  if (!p) {
    p = Promise.all([import('../tanakh/words.json'), import(`../tanakh/words/${lang}.json`)]).then(([w, tr]) => {
      const { words, total } = w.default as { words: Word[]; total: number };
      return { words, total, rank: new Map(words.map((x, i) => [x.id, i + 1])), tr: tr.default as Record<string, string> };
    });
    dicts.set(lang, p);
  }
  return p;
}

let lex: Promise<Record<string, string>> | undefined;
/** The dictionary form of the words outside the dictionary (public/tanakh/words/lex.json), for the window over a word. */
export function loadLex(): Promise<Record<string, string>> {
  lex ??= fetch(`${root()}tanakh/words/lex.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : {}))
    .catch(() => ({}));
  return lex;
}

const days = new Map<string, Promise<DayWords | null>>();
export function loadDayWords(date: string): Promise<DayWords | null> {
  let p = days.get(date);
  if (!p) {
    p = fetch(`${root()}tanakh/words/${date}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<DayWords>) : null))
      .catch(() => null);
    days.set(date, p);
  }
  return p;
}

/**
 * Пример стиха к слову (scripts/fetch-words.py → public/tanakh/words/examples-<язык>.json): стих Пророков или Писаний,
 * где слово встречается, — дата и раздел дня цикла, «книга глава:стих», иврит [до, слово, после], перевод стиха (проекта;
 * `en` — английский JPS 1985, на этом языке стих ещё не переведён).
 */
export interface Example {
  date: string;
  section: Section;
  ref: string;
  he: [string, string, string];
  tr: string;
  en: boolean;
}
type RawExample = [string, Section, string, [string, string, string], string, 1?];
const examples = new Map<WordLang, Promise<Record<string, RawExample>>>();
export function loadExamples(lang: WordLang): Promise<Record<string, RawExample>> {
  let p = examples.get(lang);
  if (!p) {
    p = fetch(`${root()}tanakh/words/examples-${lang}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, RawExample>>) : {}))
      .catch(() => ({}));
    examples.set(lang, p);
  }
  return p;
}
export const exampleOf = (all: Record<string, RawExample>, id: string): Example | undefined => {
  const x = all[id];
  return x && { date: x[0], section: x[1], ref: x[2], he: x[3], tr: x[4], en: x[5] === 1 };
};

export const WORDS_KEY = 'niflaot:words';
const EVENT = 'niflaot:words';
/**
 * Слово в «Моих словах»: [время изменения, с; коробка; день следующего повторения]. Коробки — как «карточки с
 * коробками»: 0 — убрано, 1–2 — учу, 3–5 — знаю. Вспомнил — следующая коробка, повтор через `INTERVALS[коробка]` дней;
 * не вспомнил — снова коробка 1, повтор завтра. «Знаю» сразу — коробка 3 (проверка через неделю), «Учу» — коробка 1
 * (повторить сегодня). Дни — номера дней с 1970-01-01 по дате устройства.
 */
export type { WordEntry } from './sync';
export type WordStore = Record<string, WordEntry>;
export const INTERVALS = [0, 1, 3, 7, 21, 60];
export const KNOWN_BOX = 3;

/** сегодня (по дате устройства) — номер дня */
export const today = () => {
  const [y, m, d] = localToday().split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 864e5);
};
export const boxOf = (s: WordStore, id: string) => s[id]?.[1] ?? 0;
export const isKnown = (s: WordStore, id: string) => boxOf(s, id) >= KNOWN_BOX;
export const inDeck = (s: WordStore, id: string) => boxOf(s, id) > 0;
/** слова, которые пора повторить сегодня (сначала — те, что ждут дольше) */
export const dueWords = (s: WordStore, day = today()) =>
  Object.keys(s)
    .filter((id) => s[id][1] > 0 && s[id][2] <= day)
    .sort((a, b) => s[a][2] - s[b][2]);

/**
 * Повторение на сегодня (владелец, 01.11.2026: «повторять нужно слова „учу“ и следующие 20–30»): все «учу» (коробки 1–2),
 * которые пора повторить, и не больше `DAILY_KNOWN` «знаю» за день (сначала — те, что ждут дольше); остальные «знаю»
 * ждут следующих дней (их день повтора не меняется). Сколько «знаю» уже повторено сегодня — `niflaot:words-day`
 * (только на устройстве). `more` — сколько «знаю» ещё ждёт сверх дневной порции (кнопка «Ещё»).
 */
export const DAILY_KNOWN = 25;
const DAY_KEY = 'niflaot:words-day';
export function knownReviewedToday(day = today()): number {
  try {
    const [d, n] = JSON.parse(localStorage.getItem(DAY_KEY) ?? '[]');
    return d === day && typeof n === 'number' ? n : 0;
  } catch {
    return 0;
  }
}
export function todaysReview(s: WordStore, due: string[], day = today(), reviewed = knownReviewedToday(day)) {
  const learn = due.filter((id) => s[id][1] < KNOWN_BOX);
  const known = due.filter((id) => s[id][1] >= KNOWN_BOX);
  const n = Math.max(0, DAILY_KNOWN - reviewed);
  return { ids: [...learn, ...known.slice(0, n)], more: known.slice(n) };
}

/** номера Стронга, слитые в словаре с другим (`MERGE` и `ARAM_MERGE` в scripts/fetch-words.py): יָלַךְ — это הָלַךְ;
 * арамейские номера слов, которые есть и в иврите (כֹּל, מֶלֶךְ, יוֹם…), — ивритский номер. Проверяет scripts/check-words.ts */
export const MERGED: Record<string, string> = {
  '3212': '1980', '786': '3426', '4430': '4428', '4481': '4480', '3606': '3605', '5922': '5921', '3809': '3808', '560': '559',
  '1934': '1933', '3046': '3045', '1005': '1004', '5705': '5704', '6966': '6965', '6032': '6030', '3052': '3051',
  '7761': '7760', '4406': '4405', '1932': '1931', '5974': '5973', '8133': '8132', '1400': '1399', '2006': '2005',
  '6755': '6754', '3028': '3027', '858': '857', '7229': '7227', '3118': '3117', '5972': '5971', '5103': '5104',
  '2298': '2297', '1882': '1881', '7217': '7218', '7972': '7971', '7162': '7161', '7690': '7689', '4101': '4100',
  '3702': '3701', '1965': '1964', '3202': '3201', '7606': '7605', '8036': '8034', '5457': '5456', '7412': '7411',
  '3792': '3791', '2166': '2165', '927': '926', '1123': '1121', '7308': '7307', '5308': '5307', '4083': '4082',
  '7123': '7121', '7990': '7989', '1855': '1854', '6347': '6346', '1541': '1540', '2': '1', '324': '323',
  '8086': '8085', '7127': '7126', '3779': '3778', '2452': '2451', '3652': '3651', '69': '68', '524': '523',
  '3345': '3344', '703': '702', '3790': '3789', '3969': '3967', '3549': '3548', '7': '6', '3367': '3366',
  '6992': '6991', '5415': '5414', '236': '235', '3825': '3824', '7271': '7272', '1753': '1752', '7981': '7980',
  '2429': '2428', '399': '398', '7560': '7559', '8140': '8141', '633': '632', '3675': '3674', '3635': '3634',
  '7593': '7592', '826': '825', '1505': '1504', '4903': '4904', '2255': '2254', '7236': '7235', '6600': '6599',
  '5182': '5181', '6236': '6235', '2562': '2561', '989': '988', '2417': '2416', '5649': '5650', '744': '738',
  '7655': '7651', '2749': '2748', '1289': '1288', '7624': '7623', '8624': '8623', '5460': '5461', '7314': '7312',
  '8631': '8630', '5491': '5490', '2920': '2919', '5870': '5869', '1780': '1779', '8355': '8354', '2941': '2940',
  '4449': '4448', '5609': '5612', '1240': '1239', '7868': '7867', '5648': '5647', '2493': '2472', '3861': '3860',
  '409': '408', '638': '637', '5946': '5945', '5029': '5030', '1547': '1546', '521': '520', '7313': '7311',
  '8214': '8213', '506': '505', '6744': '6743', '2499': '2498', '6056': '6057', '6151': '6148', '5069': '5068',
  '3879': '3881', '6676': '6677', '2597': '2598', '4061': '4060',
  // шестая часть (3051+): арамейские слова Даниэля и Эзры, которые есть и в иврите
  '6902': '6901', '7844': '7843', '1321': '1320', '2269': '2270', '311': '310', '5376': '5375', '677': '676',
  '7118': '7117', '540': '539', '1981': '1980', '8177': '8181', '5338': '5337', '7680': '7679', '852': '226',
  '8232': '8231', '4': '3', '8330': '8328', '613': '612', '2508': '2506', '1923': '1926', '1922': '1921',
  '7695': '7694', '3848': '3847', '8000': '7999', '7284': '7283', '8128': '8127', '1169': '1167', '7792': '7791',
  '4416': '4417', '5407': '5406', '2987': '2986', '1596': '1595',
  // слова, что встречаются 2 раза: арамейские слова Даниэля и Эзры, которые есть и в иврите
  '1370': '1369', '3029': '3034', '4391': '4390', '2632': '2633', '8632': '8633', '5776': '5775', '7490': '7489', '5487': '5486',
  '4504': '4503', '5208': '5207', '3831': '3830', '1821': '1819', '4398': '4397', '7739': '7737', '2379': '2380', '4203': '4202',
  '1414': '1413', '3983': '3982', '7932': '7931', '2604': '2603', '3393': '3391', '5403': '5404', '5191': '5190', '735': '734',
  '3797': '3796', '4433': '4436', '2112': '2111', '6655': '6654', '6606': '6605', '6928': '6927', '3221': '3220', '997': '996',
  '7512': '7511', '6268': '6267', '7240': '7239', '2631': '2630', '3358': '3357', '1701': '1700', '1888': '1887', '7187': '7189',
  '2528': '2534', '7631': '7632', '5232': '5233', '1325': '1324',
};

export function readWordStore(): WordStore {
  try {
    const raw = JSON.parse(localStorage.getItem(WORDS_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return {};
    const out: WordStore = {};
    for (const [k, v] of Object.entries(raw)) {
      const id = MERGED[k] ?? k;
      const w = normWord(v);
      if (!out[id] || out[id][0] < w[0]) out[id] = w;
    }
    return out;
  } catch {
    return {};
  }
}

function put(id: string, box: number, due: number) {
  const s = readWordStore();
  s[id] = [Math.floor(Date.now() / 1000), box, due];
  try {
    localStorage.setItem(WORDS_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (box > 0) markStudied();
}
/** «Знаю» — проверить через неделю; «Учу» — повторить сегодня; убрать из моих слов */
export const markKnown = (id: string) => put(id, KNOWN_BOX, today() + INTERVALS[KNOWN_BOX]);
export const markLearn = (id: string) => put(id, 1, today());
export const unmark = (id: string) => put(id, 0, 0);
/**
 * итог повторения слова: вспомнил — следующая коробка, нет — снова коробка 1, завтра. `course` — и в «Святой язык — уроки»
 * (вспомнил — слово встречено сегодня, «Повторим» не спросит его раньше времени; нет — оно в «Трудных»); из самого курса — false:
 * курс записывает свои ответы сам.
 */
export function review(id: string, remembered: boolean, course = true) {
  if (course) noteAnswer(id, remembered);
  const box = boxOf(readWordStore(), id);
  if (box >= KNOWN_BOX) {
    const day = today();
    try {
      localStorage.setItem(DAY_KEY, JSON.stringify([day, knownReviewedToday(day) + 1]));
    } catch {}
  }
  if (remembered) {
    const next = Math.min(box + 1, INTERVALS.length - 1);
    put(id, next, today() + INTERVALS[next]);
  } else put(id, 1, today() + 1);
}

export function useWordStore(): WordStore {
  const [s, set] = useState(readWordStore);
  useEffect(() => {
    const on = () => set(readWordStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/**
 * Ответы урока «Святого языка» — в «Мои слова» (владелец, 02.11.2026: «синхронизация святой язык уроки и мои слова»): слово, которое
 * уже было в колоде, — повторение: пора повторять — «вспомнил» / «забыл»; ещё не пора — засчитывается только ошибка (вспомнить
 * раньше срока — не повторение). Возвращает, сколько слов повторено.
 */
export function reviewFromCourse(answers: Record<string, boolean>, s: WordStore = readWordStore()): number {
  let n = 0;
  const day = today();
  for (const [id, right] of Object.entries(answers)) {
    if (!inDeck(s, id)) continue;
    const due = s[id][2] <= day;
    if (!due && right) continue;
    review(id, right, false);
    n++;
  }
  return n;
}

/** Слова дня: самые частые переведённые слова отрывка, которых нет в «Моих словах». */
export function pickWords(day: DayWords[Section], dict: Dict, known: WordStore, n = PER_DAY): Word[] {
  return Object.keys(day.w)
    .filter((id) => dict.tr[id] && !inDeck(known, id))
    .sort((a, b) => dict.rank.get(a)! - dict.rank.get(b)!)
    .slice(0, n)
    .map((id) => dict.words[dict.rank.get(id)! - 1]);
}

/** Сколько процентов слов отрывка игрок узнаёт (имена не считаются). */
export function coverage(day: DayWords[Section], known: WordStore): number {
  if (!day.n) return 100;
  let k = 0;
  for (const [id, c] of Object.entries(day.w)) if (isKnown(known, id)) k += c;
  return Math.round((k / day.n) * 100);
}

/** Следующие самые частые переведённые слова, которых нет в «Моих словах». */
export const nextWords = (dict: Dict, s: WordStore, n = PER_DAY) => dict.words.filter((w) => dict.tr[w.id] && !inDeck(s, w.id)).slice(0, n);

/** Words of «Мои слова» not learned yet («учу», boxes 1–2): due today first, then the rest by the day of their review. */
export function unlearnedWords(dict: Dict, s: WordStore): string[] {
  const due = new Set(dueWords(s));
  return Object.keys(s)
    .filter((id) => s[id][1] > 0 && s[id][1] < KNOWN_BOX && dict.tr[id] && dict.rank.has(id))
    .sort((a, b) => Number(due.has(b)) - Number(due.has(a)) || s[a][2] - s[b][2] || dict.rank.get(a)! - dict.rank.get(b)!);
}

/** Сколько переведённых слов словаря игрок знает. */
export const knownCount = (dict: Dict, known: WordStore) => Object.keys(dict.tr).filter((id) => isKnown(known, id)).length;

/** Сколько процентов слов Пророков и Писаний (без имён) покрывают знакомые слова. */
export const textCoverage = (dict: Dict, s: WordStore) =>
  Math.round((dict.words.reduce((a, w) => a + (isKnown(s, w.id) ? w.n : 0), 0) / dict.total) * 100);

/**
 * Все слова Пророков и Писаний (без имён, мест и надписей) — `all` в src/tanakh/words.json (`fetch-words.py build`; сверяет
 * `check-words.ts`): последняя веха и сертификат «Раввин языка Танаха» (`w-all`). Пока словарь не дописан до всех слов, его не получить.
 */
export const WORDS_ALL = 5413;
/** Вехи «Моих слов» — по ним и сертификаты «Академии» (следующий этап). */
export const WORD_GOALS = [100, 300, 500, 1000, 1500, 2000, 2500, 3000, WORDS_ALL];

/**
 * Сертификаты «Академии» «100 / 300 / 500 / 1000 / 1500 / 2000 / 2500 / 3000 слов Танаха» (`w-<число>`) и «Раввин языка Танаха» — все слова (`w-all`): засчитываются только слова, **подтверждённые
 * повторением** — вспомненные на карточке хотя бы раз после «Знаю» / выученные (коробка `VERIFIED_BOX` и выше), а не
 * просто отмеченные. got — подтверждено (не больше вехи), done — «знаю» всего.
 */
export const VERIFIED_BOX = 4;
export const verifiedCount = (s: WordStore) => Object.values(s).filter((e) => e[1] >= VERIFIED_BOX).length;
const W_NAME = (n: number) =>
  n === WORDS_ALL
    ? { ru: `все ${n} слов Пророков и Писаний`, en: `all ${n} words of the Prophets and Writings`, de: `alle ${n} Wörter der Propheten und Schriften` }
    : { ru: `${n} слов Танаха`, en: `${n} words of Tanakh`, de: `${n} Wörter des Tanach` };
export function wordsCertificates(s: WordStore): (Certificate & { goal: number; progress: Progress })[] {
  const verified = verifiedCount(s);
  const known = Object.values(s).filter((e) => e[1] >= KNOWN_BOX).length;
  return WORD_GOALS.map((goal) => ({
    id: goal === WORDS_ALL ? 'w-all' : `w-${goal}`,
    kind: 'words' as const,
    goal,
    book: { id: String(goal), he: 'מִלִּים', name: W_NAME(goal) },
    progress: { got: Math.min(verified, goal), max: goal, done: known, parts: goal, complete: true, earned: verified >= goal },
  }));
}

/**
 * «Слово дня» (пост в Telegram): из обоих отрывков дня — переведённое слово, которое встречается в них чаще всего,
 * кроме 50 самых частых (служебных) слов; при равенстве — более частое в Танахе. Нет такого — самое частое из всех.
 */
export function wordOfDay(day: DayWords, words: Word[], tr: Record<string, string>): Word | undefined {
  const rank = new Map(words.map((w, i) => [w.id, i]));
  const count = new Map<string, number>();
  for (const s of Object.values(day)) for (const [id, c] of Object.entries(s.w)) count.set(id, (count.get(id) ?? 0) + c);
  const pick = (min: number) =>
    [...count.keys()]
      .filter((id) => tr[id] && (rank.get(id) ?? -1) >= min)
      .sort((a, b) => count.get(b)! - count.get(a)! || rank.get(a)! - rank.get(b)!)[0];
  const id = pick(50) ?? pick(0);
  return id ? words[rank.get(id)!] : undefined;
}
