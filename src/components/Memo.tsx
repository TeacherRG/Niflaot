import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Lesson, MemoData, MemoItem } from '../lessons/types';
import { gematriaLines, lettersLine, memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { formatTime } from '../core/format';
import { SOURCES } from '../sources';
import { HebrewRuns } from './Hebrew';
import { Icon, Sheet } from './ui';

// without a worker: the site's CSP allows no blob: workers
const celebrate = confetti.create(undefined, { resize: true, useWorker: false });

/**
 * Memo («משחק זיכרון») at the very end of a commentary lesson: 24 cards, 12 pairs — a picture and the Torah words
 * of one comment. A found pair opens its explanation: הידעת? · גימטריה · מה לומדים מזה?
 * Played in Hebrew, whatever the interface language.
 */

type Screen = 'intro' | 'rules' | 'study' | 'game' | 'end';
/** a card on the board: pair `p`, picture or words */
type Card = { p: number; pic: boolean };

const RULES = [
  'על הלוח 24 קלפים — 12 זוגות.',
  'בכל זוג: קלף עם ציור וקלף עם מילים מן התורה. לשניהם אותו מספר.',
  'פותחים שני קלפים בכל תור.',
  'מצאתם זוג? הוא שלכם — ומיד מופיע ההסבר: מה גילה בעל הטורים.',
  'לא מצאתם? הקלפים נסגרים. נסו לזכור איפה כל קלף!',
  'מסיימים כשכל 12 הזוגות נמצאו.',
];

function shuffle(n: number): Card[] {
  const cards: Card[] = [...Array(n).keys()].flatMap((p) => [
    { p, pic: true },
    { p, pic: false },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/** «Kitzur Ba'al HaTurim on Genesis 2:7» → «בעל הטורים, בראשית 2:7» */
function sourceRef(id: string) {
  const s = SOURCES[id];
  const m = s?.ref.match(/Genesis (\d+:\d+)/);
  return s ? { label: `בעל הטורים, בראשית ${m?.[1] ?? ''}`.trim(), url: s.url } : null;
}

/** One comment explained: picture, the commentary's words, הידעת?, גימטריה, מה לומדים מזה? */
export function MemoInfo({ item, n, img }: { item: MemoItem; n: number; img?: string }) {
  const src = sourceRef(item.source);
  return (
    <div className="mi" dir="rtl" lang="he">
      <div className="mi-top">
        {img && <img className="mi-img" src={img} alt={item.title} loading="lazy" />}
        <div className="mi-head">
          <span className="mi-n num">{n}</span>
          <h3>{item.title}</h3>
          <div className="mi-verse">{displayNames(item.verse)}</div>
        </div>
      </div>
      <blockquote className="mi-quote">
        {displayNames(item.quote)}
        {src && (
          <cite>
            <a href={src.url} target="_blank" rel="noopener">
              {src.label}
            </a>
          </cite>
        )}
      </blockquote>
      <div className="mi-block">
        <h4>הידעת?</h4>
        <p>{displayNames(item.explain)}</p>
      </div>
      {(item.gematria || item.letters) && (
        <div className="mi-block mi-calc">
          <h4>{item.gematria ? 'גימטריה' : 'רמז באותיות'}</h4>
          {item.gematria?.map((g, k) => (
            <div key={k} className="mi-eq">
              {gematriaLines(g).map((l, j) => (
                <div key={j} className="num" dir="rtl">
                  <HebrewRuns text={l} />
                </div>
              ))}
              {g.note && <div className="mi-note">{g.v} = {g.note}</div>}
            </div>
          ))}
          {item.letters?.map((l, k) => (
            <div key={k} className="mi-eq">
              <span className="mi-kind">{l.kind}</span>
              <span dir="rtl">{lettersLine(l)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mi-block mi-moral">
        <h4>מה לומדים מזה?</h4>
        <p>{item.moral}</p>
      </div>
    </div>
  );
}

function MemoCard({ card, item, img, open, found, onClick }: { card: Card; item: MemoItem; img?: string; open: boolean; found: boolean; onClick: () => void }) {
  return (
    <button
      className={`mc${open ? ' open' : ''}${found ? ' found' : ''}`}
      onClick={onClick}
      disabled={open}
      aria-label={open ? (card.pic ? `ציור ${card.p + 1}: ${item.title}` : `${card.p + 1}: ${displayNames(item.verse)}`) : 'קלף סגור'}
    >
      <span className="mc-in">
        <span className="mc-back" aria-hidden="true">
          <span>✦</span>
        </span>
        <span className="mc-face" aria-hidden="true">
          {card.pic ? (
            img && <img src={img} alt="" draggable={false} />
          ) : (
            <span className="mc-words">
              <span className="mc-n num">{card.p + 1}</span>
              <span className="mc-verse">{displayNames(item.verse)}</span>
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export function Memo({ lesson, memo }: { lesson: Lesson; memo: MemoData }) {
  const images = useMemo(() => memoImages(lesson), [lesson]);
  const n = memo.items.length;
  const [screen, setScreen] = useState<Screen>('intro');
  const [cards, setCards] = useState<Card[]>(() => shuffle(n));
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [shown, setShown] = useState<number | null>(null);
  const [ms, setMs] = useState(0);
  const box = useRef<HTMLElement>(null);
  const busy = open.length === 2;

  const go = (s: Screen) => {
    setScreen(s);
    requestAnimationFrame(() => box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const start = () => {
    setCards(shuffle(n));
    setOpen([]);
    setFound([]);
    setMoves(0);
    setMs(0);
    go('game');
  };

  // timer while the board is in play (paused when the tab is hidden or an explanation is open)
  useEffect(() => {
    if (screen !== 'game' || shown !== null) return;
    const id = setInterval(() => !document.hidden && setMs((x) => x + 1000), 1000);
    return () => clearInterval(id);
  }, [screen, shown]);

  // two open cards: a pair stays and shows its explanation, otherwise both close again
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((i) => cards[i]);
    if (a.p === b.p) {
      const id = setTimeout(() => {
        setFound((f) => [...f, a.p]);
        setOpen([]);
        setShown(a.p);
      }, 450);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setOpen([]), 1100);
    return () => clearTimeout(id);
  }, [open, cards]);

  const flip = (i: number) => {
    if (busy || open.includes(i) || found.includes(cards[i].p)) return;
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((o) => [...o, i]);
  };

  const closeInfo = () => {
    setShown(null);
    if (found.length === n) {
      go('end');
      celebrate({ particleCount: 140, spread: 90, startVelocity: 40, origin: { y: 0.6 }, colors: ['#D8B565', '#A47C2F', '#2B4F95', '#2A7448'], disableForReducedMotion: true });
    }
  };

  return (
    <section className="memo pop" ref={box} dir="rtl" lang="he" aria-labelledby="memo-h">
      <header className="memo-head">
        <div className="memo-eyebrow">משחק זיכרון · בעל הטורים</div>
        <h2 id="memo-h">פרשת {lesson.hebrewTitle.split('·').pop()?.trim()}</h2>
        <div className="memo-sub">משחק ← ציור ← סקרנות ← פירוש ← גימטריה ← לימוד תורה</div>
      </header>

      {screen !== 'game' && screen !== 'end' && (
        <nav className="memo-menu">
          <button className={`btn${screen === 'intro' ? '' : ' ghost'}`} onClick={start}>
            התחל משחק
          </button>
          <button className={`btn ${screen === 'rules' ? 'gold' : 'ghost'}`} onClick={() => go(screen === 'rules' ? 'intro' : 'rules')}>
            איך משחקים?
          </button>
          <button className={`btn ${screen === 'study' ? 'gold' : 'ghost'}`} onClick={() => go(screen === 'study' ? 'intro' : 'study')}>
            למדו את הפרשה
          </button>
        </nav>
      )}

      {screen === 'intro' && (
        <div className="memo-intro">
          <p>
            12 פירושים של בעל הטורים על פרשת בראשית — גימטריות, ראשי תיבות וסופי תיבות. מצאו את הזוגות: כל ציור והמילים שלו מן התורה.
          </p>
          <div className="memo-strip" aria-hidden="true">
            {images.slice(0, 6).map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
          <a className="memo-print" href={`#/${lesson.slug}/print/memo`}>
            <Icon name="print" size={16} /> הדפסת המשחק — קלפים וגיליונות צביעה
          </a>
        </div>
      )}

      {screen === 'rules' && (
        <ol className="memo-rules">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
          <li>
            אחרי כל זוג: <b>הידעת?</b> — הסבר קצר, <b>גימטריה</b> — החשבון, <b>מה לומדים מזה?</b> — מסקנה.
          </li>
        </ol>
      )}

      {screen === 'study' && (
        <div className="memo-study">
          {memo.items.map((it, k) => (
            <MemoInfo key={k} item={it} n={k + 1} img={images[k]} />
          ))}
        </div>
      )}

      {screen === 'game' && (
        <>
          <div className="memo-stats num">
            <span>זוגות: {found.length} / {n}</span>
            <span>ניסיונות: {moves}</span>
            <span>⏱ {formatTime(ms)}</span>
            <button className="btn ghost" onClick={() => go('intro')}>
              תפריט
            </button>
          </div>
          <div className="memo-board">
            {cards.map((c, i) => (
              <MemoCard
                key={i}
                card={c}
                item={memo.items[c.p]}
                img={images[c.p]}
                open={open.includes(i) || found.includes(c.p)}
                found={found.includes(c.p)}
                onClick={() => flip(i)}
              />
            ))}
          </div>
        </>
      )}

      {screen === 'end' && (
        <div className="memo-end">
          <div className="memo-bravo">כל הכבוד!</div>
          <p>
            מצאתם את כל {n} הזוגות ב־{moves} ניסיונות · ⏱ {formatTime(ms)}
          </p>
          <div className="memo-shabbat">שבת שלום!</div>
          <div className="memo-btns">
            <button className="btn" onClick={start}>
              לשחק שוב
            </button>
            <button className="btn ghost" onClick={() => go('study')}>
              למדו את הפרשה
            </button>
          </div>
          <div className="memo-copy">© mychitas.app 2026</div>
        </div>
      )}

      <Sheet open={shown !== null} onClose={closeInfo} title={'מצאתם זוג!\u200F'} closeLabel="סגור">
        {shown !== null && (
          <>
            <MemoInfo item={memo.items[shown]} n={shown + 1} img={images[shown]} />
            <button className="btn memo-next" data-autofocus onClick={closeInfo}>
              {found.length === n ? 'לסיום ←' : 'ממשיכים לשחק ←'}
            </button>
          </>
        )}
      </Sheet>
    </section>
  );
}
