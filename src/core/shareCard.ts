import { displayNames } from './names';
import { NIFLAOT_SEAL } from './partners';
import qrcode from 'qrcode-generator';

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
      document.fonts.load(f, 'Aa Ая Ää אבְּ').catch(() => undefined),
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

  center(d.found, 520, `italic 500 44px ${FONTS.display}`, MUTED);

  // highlighted equation
  const size = d.highlight.some((l) => l.join(' ').length > 22) ? 70 : 84;
  d.highlight.forEach((line, i) => drawTokens(ctx, line.map(displayNames), 650 + i * (size + 46), size));

  // caption
  ctx.font = `500 34px ${FONTS.body}`;
  const capY = 650 + d.highlight.length * (size + 46) + 40;
  wrap(ctx, d.caption, W - 260).forEach((l, i) => center(l, capY + i * 48, `500 34px ${FONTS.body}`, '#E6E9F3'));

  center(d.score, H - 290, `600 38px ${FONTS.num}`, GOLD);
  if (d.extra) center(d.extra, H - 225, `italic 500 38px ${FONTS.display}`, MUTED);
  center(d.site, H - 120, `700 34px ${FONTS.body}`, '#FFFFFF');

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

/** One part of the answer: `= 471`, `= זנב + תאוה` (with its translation) or `→ אמת`. */
export interface FactAnswerPart {
  /** the sign before the part; none — the first part (the words of the Torah themselves) */
  op?: '=';
  /** numbers, e.g. "37" */
  num?: string;
  /** Hebrew (Names of G-d as on screen) */
  he?: string;
  gloss?: string;
}

export interface FactCardData {
  /** e.g. "Нифлаот · Знаете ли вы?" */
  eyebrow: string;
  /** whose lesson: "Бааль ґа-Турим · Берешит" */
  source: string;
  /** the answer at once: «ויהיו = 37» or the hidden word «משה» */
  answer: FactAnswerPart[];
  /** «Последние буквы слов עם האיש הזה» — when the meaning doesn't say it */
  from?: string;
  /** «По закону Моше» */
  title?: string;
  /** what it means (plain text) */
  text?: string;
  /** «Чему это учит?» and its text */
  moralLabel?: string;
  moral?: string;
  /** where the lesson is: "Весь урок — на сайте" */
  why: string;
  site: string;
  tagline: string;
}

/**
 * «Поделиться»: a card of the feed «Знаете ли вы?» as a picture, as on the screen — the answer at once (the hidden word or
 * the equality, with translation), its title, what it means and «Чему это учит?» (owner, 02.11.2026: «вопрос непонятен
 * и неинтересен — сразу ответ»); the lesson — on the site, signed at the bottom.
 */
export async function renderFactCard(d: FactCardData): Promise<Blob> {
  await Promise.all(
    [`700 100px ${FONTS.he}`, `italic 500 54px ${FONTS.display}`, `700 30px ${FONTS.body}`, `500 30px ${FONTS.body}`, `600 60px ${FONTS.num}`].map((f) =>
      document.fonts.load(f, 'Aa Ая Ää אבְּ').catch(() => undefined),
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
    for (const p of d.answer) {
      if (p.num && !add(`${p.op ?? ''} ${p.num}`.trim(), `600 ${Math.round(80 * k)}px ${FONTS.num}`, GOLD, 96 * k)) return null;
      if (p.he) {
        // «= זנב + תאוה»: the sign on the left, the Hebrew read right to left
        if (!add(p.op ? `${p.he} ${p.op}` : p.he, he(104 * k), '#FFFFFF', 118 * k, 'rtl')) return null;
        if (p.gloss && !add(p.gloss, body(30 * k), MUTED, 48 * k)) return null;
      }
    }
    if (d.from && !add(d.from, body(30 * k), MUTED, 48 * k)) return null;
    if (d.title) {
      lines.push({ text: '', font: '', color: '', h: 56 * k, rule: true });
      if (!add(d.title, `italic 500 ${Math.round(56 * k)}px ${FONTS.display}`, '#FFFFFF', 68 * k)) return null;
      lines[lines.length - 1].h += 12 * k;
    }
    if (d.text && !add(d.text, body(34 * k), '#E6E9F3', 48 * k)) return null;
    if (d.moral) {
      if (d.moralLabel) {
        if (!add(d.moralLabel, `700 ${Math.round(32 * k)}px ${FONTS.body}`, GOLD, 64 * k)) return null;
      }
      if (!add(d.moral, body(34 * k), '#E6E9F3', 48 * k)) return null;
    }
    return lines;
  };
  const TOP = 270;
  const BOTTOM = H - 300;
  let k = 1;
  let lines = build(k);
  while ((!lines || lines.reduce((a, l) => a + l.h, 0) > BOTTOM - TOP) && k > 0.4) {
    k -= 0.05;
    lines = build(k);
  }
  const all = lines ?? [];
  let y = TOP + (BOTTOM - TOP - all.reduce((a, l) => a + l.h, 0)) / 2;
  for (const l of all) {
    y += l.h;
    if (l.rule) {
      // a short gold line between the answer and what it means
      const yy = y - l.h * 0.5;
      ctx.strokeStyle = GOLD_DEEP;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 120, yy);
      ctx.lineTo(W / 2 + 120, yy);
      ctx.stroke();
      continue;
    }
    center(l.text, y - l.h * 0.22, l.font, l.color, l.dir);
  }

  // the lesson — on the site; the signature
  center(d.why, H - 250, `600 36px ${FONTS.body}`, GOLD);
  center(d.site, H - 180, `700 44px ${FONTS.body}`, '#FFFFFF');
  center(d.tagline, H - 124, `italic 500 34px ${FONTS.display}`, MUTED);

  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

export interface VerseCardData {
  /** «Нифлаот · Пророки» */
  eyebrow: string;
  /** «Йеґошуа 1:8 · יהושע» */
  source: string;
  /** стих на иврите (может не быть — только перевод) */
  hebrew?: string;
  /** перевод стиха */
  translation?: string;
  /** подпись над QR-кодом: «Весь отрывок — с переводом и комментариями» */
  cta: string;
  /** ссылка на день цикла — QR-кодом на картинке */
  link: string;
  site: string;
  tagline: string;
}

/**
 * «Поделиться стихом» (Пророки и Писания, `VerseTools`): картинка 1080×1350 — стих на иврите и перевод (помещаются масштабом),
 * внизу под чертой — QR-код на день цикла на сайте и адрес сайта (владелец, 01.11.2026: «не комментарий — ссылка на проект»).
 */
export async function renderVerseCard(d: VerseCardData): Promise<Blob> {
  await Promise.all(
    // with a sample of every script: a font's Cyrillic and Hebrew are separate files (unicode-range), loaded only on demand
    [`700 64px ${FONTS.he}`, `italic 500 44px ${FONTS.display}`, `500 34px ${FONTS.body}`, `700 26px ${FONTS.body}`, `600 34px ${FONTS.body}`].map((f) =>
      document.fonts.load(f, 'Aa Ая Ää אבְּ').catch(() => undefined),
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
  center(d.source, 206, `600 34px ${FONTS.body}`, '#FFFFFF');

  type Line = { text: string; font: string; color: string; dir?: CanvasDirection; h: number };
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
    if (d.hebrew && !add(d.hebrew, `700 ${Math.round(70 * k)}px ${FONTS.he}`, '#FFFFFF', 98 * k, 'rtl')) return null;
    if (d.hebrew && d.translation) lines.push({ text: '', font: '', color: '', h: 40 * k });
    if (d.translation && !add(d.translation, `italic 500 ${Math.round(50 * k)}px ${FONTS.display}`, '#E6E9F3', 64 * k)) return null;
    return lines;
  };
  // the verse between the header and the link block at the bottom
  const TOP = 250;
  const BOTTOM = H - 470;
  const fits = (ls: Line[] | null) => !!ls && ls.reduce((a, l) => a + l.h, 0) <= BOTTOM - TOP;
  let k = 1;
  let lines = build(k);
  while (!fits(lines) && k > 0.4) {
    k -= 0.04;
    lines = build(k);
  }
  const all = lines ?? [];
  let y = TOP + (BOTTOM - TOP - all.reduce((a, l) => a + l.h, 0)) / 2;
  for (const l of all) {
    y += l.h;
    if (l.text) center(l.text, y - l.h * 0.22, l.font, l.color, l.dir);
  }

  // «— Весь отрывок — с переводом и комментариями —», under it the QR code of the day on the site, the address, the tagline
  const ruleY = H - 425;
  const cta = d.cta.toUpperCase();
  ctx.letterSpacing = '3px';
  // a long caption (German) gets a smaller font, never wider than the frame
  let size = 22;
  ctx.font = `700 ${size}px ${FONTS.body}`;
  while (ctx.measureText(cta).width > W - 200 && size > 14) ctx.font = `700 ${--size}px ${FONTS.body}`;
  const ctaFont = ctx.font;
  const cw = ctx.measureText(cta).width;
  center(cta, ruleY + 8, ctaFont, GOLD);
  ctx.letterSpacing = '0px';
  // the short gold lines on both sides — only where they fit inside the frame
  const room = (W - 160 - cw) / 2 - 24;
  if (room > 30) {
    const len = Math.min(110, room);
    ctx.strokeStyle = GOLD_DEEP;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - cw / 2 - 24 - len, ruleY);
    ctx.lineTo(W / 2 - cw / 2 - 24, ruleY);
    ctx.moveTo(W / 2 + cw / 2 + 24, ruleY);
    ctx.lineTo(W / 2 + cw / 2 + 24 + len, ruleY);
    ctx.stroke();
  }
  const qr = qrcode(0, 'M');
  qr.addData(d.link);
  qr.make();
  const n = qr.getModuleCount();
  const box = 190;
  const cell = Math.floor((box - 24) / n);
  const side = cell * n + 24;
  const qx = Math.round(W / 2 - side / 2);
  const qy = H - 390;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(qx, qy, side, side, 14);
  ctx.fill();
  ctx.fillStyle = '#000000';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(qx + 12 + c * cell, qy + 12 + r * cell, cell, cell);
  center(d.site, H - 132, `700 44px ${FONTS.body}`, '#FFFFFF');
  center(d.tagline, H - 84, `italic 500 30px ${FONTS.display}`, MUTED);
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

export interface TextCardSection {
  heading: string;
  text: string;
  hebrew?: boolean;
}

export interface TextCardData {
  eyebrow: string;
  source: string;
  title: string;
  sections: TextCardSection[];
  site: string;
}

/** A share image for a review card in the «Cards» feed. */
export async function renderTextCard(d: TextCardData): Promise<Blob> {
  await Promise.all(
    [`700 64px ${FONTS.display}`, `700 32px ${FONTS.body}`, `500 38px ${FONTS.body}`, `700 54px ${FONTS.he}`].map((f) =>
      document.fonts.load(f, 'Aa Ая Ää אבְּ').catch(() => undefined),
    ),
  );
  const logo = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = NIFLAOT_SEAL;
  });
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 0, 50, W / 2, 0, 900);
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

  if (logo) {
    const lh = 140;
    const lw = Math.min(360, (logo.naturalWidth / logo.naturalHeight) * lh);
    ctx.drawImage(logo, (W - lw) / 2, 86, lw, lw * (logo.naturalHeight / logo.naturalWidth));
  }
  ctx.letterSpacing = '5px';
  center(d.eyebrow.toUpperCase(), 245, `700 26px ${FONTS.body}`, GOLD);
  ctx.letterSpacing = '0px';
  ctx.font = `500 28px ${FONTS.body}`;
  wrap(ctx, d.source, W - 240).slice(0, 2).forEach((line, i) => center(line, 295 + i * 36, `500 28px ${FONTS.body}`, MUTED));

  type Line = { text: string; font: string; color: string; dir?: CanvasDirection; height: number };
  const top = 380;
  const bottom = H - 190;
  const build = (scale: number): Line[] | null => {
    const lines: Line[] = [];
    const add = (text: string, font: string, color: string, height: number, dir?: CanvasDirection) => {
      ctx.font = font;
      const wrapped = text.split('\n').flatMap((part) => (part ? wrap(ctx, part, W - 240) : ['']));
      if (wrapped.some((line) => ctx.measureText(line).width > W - 240)) return false;
      wrapped.forEach((line) => lines.push({ text: line, font, color, dir, height }));
      return true;
    };
    if (!add(d.title, `700 ${Math.round(60 * scale)}px ${FONTS.display}`, '#FFFFFF', 72 * scale)) return null;
    for (const section of d.sections) {
      if (section.heading && !add(section.heading, `700 ${Math.round(28 * scale)}px ${FONTS.body}`, GOLD, 42 * scale)) return null;
      if (!add(section.text, `${section.hebrew ? '700' : '500'} ${Math.round((section.hebrew ? 54 : 36) * scale)}px ${section.hebrew ? FONTS.he : FONTS.body}`, '#E6E9F3', (section.hebrew ? 68 : 48) * scale, section.hebrew ? 'rtl' : undefined)) return null;
    }
    return lines;
  };
  let scale = 1;
  let lines = build(scale);
  while ((!lines || lines.reduce((sum, line) => sum + line.height, 0) > bottom - top) && scale > 0.5) {
    scale -= 0.05;
    lines = build(scale);
  }
  const content = lines ?? [];
  let y = top + (bottom - top - content.reduce((sum, line) => sum + line.height, 0)) / 2;
  for (const line of content) {
    y += line.height;
    center(line.text, y - line.height * 0.2, line.font, line.color, line.dir);
  }
  center(d.site, H - 120, `700 38px ${FONTS.body}`, '#FFFFFF');

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
