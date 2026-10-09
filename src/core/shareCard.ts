import { displayNames } from './names';

export interface CardData {
  /** e.g. "НИФЛАОТ · БЕРЕЙШИТ 5787" */
  eyebrow: string;
  hebrewTitle: string;
  title: string;
  found: string;
  /** lines of tokens: Hebrew words, numbers, signs */
  highlight: string[][];
  caption: string;
  score: string;
  extra?: string;
  site: string;
}

const W = 1080;
const H = 1350;
const INK = '#141A33';
const GOLD = '#D8B565';
const GOLD_DEEP = '#A47C2F';
const MUTED = '#C9CEE0';
const FONTS = {
  display: '"Cormorant Garamond", Georgia, serif',
  he: '"Frank Ruhl Libre", "Times New Roman", serif',
  body: 'Manrope, system-ui, sans-serif',
  num: '"IBM Plex Mono", ui-monospace, monospace',
};
const isHebrew = (s: string) => /[א-ת]/.test(s);

/** Wraps text into lines that fit maxWidth. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws a line of tokens centred, left to right; each Hebrew word is drawn right-to-left on its own. */
function drawTokens(ctx: CanvasRenderingContext2D, tokens: string[], y: number, size: number) {
  const font = (t: string) => (isHebrew(t) ? `700 ${size}px ${FONTS.he}` : `600 ${Math.round(size * 0.82)}px ${FONTS.num}`);
  const gap = size * 0.32;
  const widths = tokens.map((t) => {
    ctx.font = font(t);
    return ctx.measureText(t).width;
  });
  let x = (W - (widths.reduce((a, b) => a + b, 0) + gap * (tokens.length - 1))) / 2;
  tokens.forEach((t, i) => {
    ctx.font = font(t);
    ctx.fillStyle = isHebrew(t) ? '#FFFFFF' : /\d/.test(t) ? GOLD : MUTED;
    // a single Hebrew word is shaped right-to-left by itself; the tokens are laid out left to right
    ctx.direction = 'ltr';
    ctx.textAlign = 'left';
    ctx.fillText(t, x, y);
    x += widths[i] + gap;
  });
}

export async function renderCard(d: CardData): Promise<Blob> {
  await Promise.all(
    [`700 80px ${FONTS.he}`, `700 60px ${FONTS.display}`, `600 40px ${FONTS.num}`, `600 30px ${FONTS.body}`].map((f) =>
      document.fonts.load(f).catch(() => undefined),
    ),
  );
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';

  // background
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 0, 50, W / 2, 0, 900);
  glow.addColorStop(0, '#2E3870');
  glow.addColorStop(1, 'rgba(20,26,51,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  // double gold frame
  ctx.strokeStyle = GOLD_DEEP;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  const center = (text: string, y: number, font: string, color: string, dir: CanvasDirection = 'ltr') => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.direction = dir;
    ctx.textAlign = 'center';
    ctx.fillText(text, W / 2, y);
    ctx.direction = 'ltr';
  };

  ctx.letterSpacing = '6px';
  center(d.eyebrow.toUpperCase(), 160, `700 26px ${FONTS.body}`, GOLD);
  ctx.letterSpacing = '0px';
  center(d.hebrewTitle, 270, `900 76px ${FONTS.he}`, GOLD, 'rtl');
  center(d.title, 350, `700 52px ${FONTS.display}`, '#FFFFFF');

  // ornament
  center('✦  ✦  ✦', 430, `400 28px ${FONTS.body}`, GOLD_DEEP);

  center(d.found, 520, `italic 600 44px ${FONTS.display}`, MUTED);

  // highlighted equation
  const size = d.highlight.some((l) => l.join(' ').length > 22) ? 70 : 84;
  d.highlight.forEach((line, i) => drawTokens(ctx, line.map(displayNames), 650 + i * (size + 46), size));

  // caption
  ctx.font = `500 34px ${FONTS.body}`;
  const capY = 650 + d.highlight.length * (size + 46) + 40;
  wrap(ctx, d.caption, W - 260).forEach((l, i) => center(l, capY + i * 48, `500 34px ${FONTS.body}`, '#E6E9F3'));

  center(d.score, H - 290, `600 38px ${FONTS.num}`, GOLD);
  if (d.extra) center(d.extra, H - 225, `italic 600 38px ${FONTS.display}`, MUTED);
  center(d.site, H - 120, `700 34px ${FONTS.body}`, '#FFFFFF');

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

/** One part of the answer: `= 471`, `= זנב + תאוה` (with its translation) or `→ אמת`. */
export interface FactAnswerPart {
  op: '=' | '→';
  /** numbers, e.g. "456 + 15" */
  num?: string;
  /** Hebrew (Names of G-d as on screen) */
  he?: string;
  gloss?: string;
}

export interface FactCardData {
  /** e.g. "Нифлаот · Знаете ли вы?" */
  eyebrow: string;
  /** whose lesson: "Рав Гинзбург · Тикун парцуф-занав" */
  source: string;
  /** "А вы знаете, чему равно" */
  question: string;
  /** the Hebrew the question is about (Names of G-d as on screen) */
  hebrew: string;
  /** its translation */
  gloss: string;
  /** "Ответ" */
  answerLabel: string;
  answer: FactAnswerPart[];
  /** where the explanation is: "Почему так — на сайте" */
  why: string;
  site: string;
  tagline: string;
}

/**
 * «Поделиться загадкой»: a card of the feed «Знаете ли вы?» as a picture — the riddle (the question, the Hebrew words
 * with their translation) and its answer; why it is so — on the site, signed at the bottom.
 */
export async function renderFactCard(d: FactCardData): Promise<Blob> {
  await Promise.all(
    [`700 100px ${FONTS.he}`, `italic 600 54px ${FONTS.display}`, `700 30px ${FONTS.body}`, `600 60px ${FONTS.num}`].map((f) =>
      document.fonts.load(f).catch(() => undefined),
    ),
  );
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.4, 760);
  glow.addColorStop(0, '#2E3870');
  glow.addColorStop(1, 'rgba(20,26,51,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = GOLD_DEEP;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(64, 64, W - 128, H - 128);

  const center = (text: string, y: number, font: string, color: string, dir: CanvasDirection = 'ltr') => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.direction = dir;
    ctx.textAlign = 'center';
    ctx.fillText(text, W / 2, y);
    ctx.direction = 'ltr';
  };
  const maxW = W - 220;

  ctx.letterSpacing = '6px';
  center(d.eyebrow.toUpperCase(), 150, `700 26px ${FONTS.body}`, GOLD);
  ctx.letterSpacing = '0px';
  ctx.font = `600 28px ${FONTS.body}`;
  wrap(ctx, d.source, maxW).slice(0, 2).forEach((l, i) => center(l, 200 + i * 38, `600 28px ${FONTS.body}`, MUTED));

  /**
   * Everything between the header and the footer as a list of lines, laid out at a scale `k`:
   * the largest scale that fits is used, and the block is centred.
   */
  type Line = { text: string; font: string; color: string; dir?: CanvasDirection; h: number; rule?: boolean };
  const build = (k: number): Line[] | null => {
    const lines: Line[] = [];
    const add = (text: string, font: string, color: string, h: number, dir?: CanvasDirection) => {
      ctx.font = font;
      for (const l of wrap(ctx, text, maxW)) {
        if (ctx.measureText(l).width > maxW) return false;
        lines.push({ text: l, font, color, dir, h });
      }
      return true;
    };
    const he = (size: number) => `700 ${Math.round(size)}px ${FONTS.he}`;
    const body = (size: number) => `500 ${Math.round(size)}px ${FONTS.body}`;
    if (!add(d.question, `italic 600 ${Math.round(52 * k)}px ${FONTS.display}`, '#E6E9F3', 64 * k)) return null;
    lines[lines.length - 1].h += 14 * k;
    // the Hebrew of the riddle; the «?» stays with its last word (never alone on a line)
    ctx.font = he(104 * k);
    const heLines = wrap(ctx, d.hebrew, maxW);
    heLines[heLines.length - 1] += ' ?';
    if (heLines.some((l) => ctx.measureText(l).width > maxW)) return null;
    heLines.forEach((l) => lines.push({ text: l, font: he(104 * k), color: '#FFFFFF', dir: 'rtl', h: 120 * k }));
    if (d.gloss && !add(d.gloss, body(32 * k), MUTED, 52 * k)) return null;
    lines.push({ text: d.answerLabel.toUpperCase(), font: `700 ${Math.round(24 * k)}px ${FONTS.body}`, color: GOLD, h: 96 * k, rule: true });
    for (const p of d.answer) {
      if (p.num && !add(`${p.op} ${p.num}`, `600 ${Math.round(66 * k)}px ${FONTS.num}`, GOLD, 84 * k)) return null;
      if (p.he) {
        // «= זנב + תאוה»: the sign on the left, the Hebrew read right to left
        if (!add(`${p.he} ${p.op}`, he(84 * k), '#FFFFFF', 98 * k, 'rtl')) return null;
        if (p.gloss && !add(p.gloss, body(30 * k), MUTED, 50 * k)) return null;
      }
    }
    return lines;
  };
  const TOP = 290;
  const BOTTOM = H - 290;
  let k = 1;
  let lines = build(k);
  while ((!lines || lines.reduce((a, l) => a + l.h, 0) > BOTTOM - TOP) && k > 0.5) {
    k -= 0.05;
    lines = build(k);
  }
  const all = lines ?? [];
  let y = TOP + (BOTTOM - TOP - all.reduce((a, l) => a + l.h, 0)) / 2;
  for (const l of all) {
    y += l.h;
    if (l.rule) {
      // «— ОТВЕТ —» between the riddle and its answer
      const yy = y - l.h * 0.55;
      ctx.font = l.font;
      ctx.letterSpacing = '6px';
      const w = ctx.measureText(l.text).width;
      center(l.text, yy + 9, l.font, l.color);
      ctx.letterSpacing = '0px';
      ctx.strokeStyle = GOLD_DEEP;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - w / 2 - 150, yy);
      ctx.lineTo(W / 2 - w / 2 - 24, yy);
      ctx.moveTo(W / 2 + w / 2 + 24, yy);
      ctx.lineTo(W / 2 + w / 2 + 150, yy);
      ctx.stroke();
      continue;
    }
    center(l.text, y - l.h * 0.22, l.font, l.color, l.dir);
  }

  // why — on the site; the signature
  center(d.why, H - 250, `600 36px ${FONTS.body}`, GOLD);
  center(d.site, H - 180, `700 44px ${FONTS.body}`, '#FFFFFF');
  center(d.tagline, H - 124, `italic 600 34px ${FONTS.display}`, MUTED);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

/** Shares the picture through the system sheet when possible, otherwise downloads it. Returns 'shared' | 'saved'. */
export async function shareOrSave(blob: Blob, filename: string, text: string): Promise<'shared' | 'saved'> {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch (e) {
      if ((e as DOMException).name === 'AbortError') return 'shared';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'saved';
}
