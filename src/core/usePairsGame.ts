import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * The board of a pairs game (Memo of a commentary lesson, «Карточки» of a «Нифлаот Ребе» lesson):
 * screens, dealing, flipping two cards, the timer and the explanation shown after a found pair.
 * The way through it, as a teacher would lead it: study the pairs → an easy game of 6 pairs → the full game → what we learned.
 */

export type Screen = 'home' | 'rules' | 'study' | 'game' | 'end';
/** a card on the board: pair `p`, side `a` (picture / verse) or the other side (words / explanation) */
export type Card = { p: number; a: boolean };

export const EASY = 6;

// without a worker: the site's CSP allows no blob: workers
const celebrate = confetti.create(undefined, { resize: true, useWorker: false });

function deal(pairs: number[]): Card[] {
  const cards: Card[] = pairs.flatMap((p) => [
    { p, a: true },
    { p, a: false },
  ]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/** `n` random pairs of `total`, in their order */
const somePairs = (total: number, n: number) =>
  [...Array(total).keys()]
    .map((p) => ({ p, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, n)
    .map((x) => x.p)
    .sort((a, b) => a - b);

export function usePairsGame(total: number, initial: Screen = 'home') {
  const [screen, setScreen] = useState<Screen>(initial);
  const [pairs, setPairs] = useState<number[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
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

  const play = (n: number) => {
    const ps = n >= total ? [...Array(total).keys()] : somePairs(total, n);
    setPairs(ps);
    setCards(deal(ps));
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

  // two open cards: a pair stays and shows its explanation, otherwise both turn back
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open.map((i) => cards[i]);
    if (a.p === b.p) {
      const id = setTimeout(() => {
        setFound((f) => [...f, a.p]);
        setOpen([]);
        setShown(a.p);
      }, 500);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setOpen([]), 1400);
    return () => clearTimeout(id);
  }, [open, cards]);

  const flip = (i: number) => {
    if (busy || open.includes(i) || found.includes(cards[i].p)) return;
    if (open.length === 1) setMoves((m) => m + 1);
    setOpen((o) => [...o, i]);
  };

  const closeInfo = () => {
    setShown(null);
    if (found.length === pairs.length) {
      go('end');
      celebrate({ particleCount: 140, spread: 90, startVelocity: 40, origin: { y: 0.6 }, colors: ['#D8B565', '#A47C2F', '#2B4F95', '#2A7448'], disableForReducedMotion: true });
    }
  };

  return { screen, go, play, pairs, cards, open, found, moves, ms, shown, flip, closeInfo, box };
}
