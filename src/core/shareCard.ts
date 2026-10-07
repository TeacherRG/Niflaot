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
