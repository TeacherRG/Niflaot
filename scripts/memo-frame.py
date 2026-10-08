#!/usr/bin/env python3
"""
Memo pictures → src/lessons/<lesson>/memo/NN.png: one size (1200×1600, portrait 3:4), white background,
and the three captions on every picture: the portion (top left), the number (top right), © (bottom right).

  # 12 separate files 01.png … 12.png (any size, portrait 3:4):
  python3 scripts/memo-frame.py <dir> src/lessons/01-baal-haturim-bereshit/memo Bereshit
  # or one sheet of 12 panels, 4 columns × 3 rows, each with its own frame line:
  python3 scripts/memo-frame.py --sheet <sheet.png> src/lessons/01-baal-haturim-bereshit/memo Bereshit

Saved as 32-level grayscale PNG (line art). Needs Pillow and numpy.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 1600
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
FONT_I = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf'


def font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.truetype(FONT, size)


def lines(dark: np.ndarray, axis: int, n: int) -> list[int]:
    """Positions of the panels' frame lines along an axis: the n·2 longest dark lines, merged."""
    counts = dark.sum(axis=axis)
    idx = [i for i in np.argsort(-counts) if counts[i] > dark.shape[axis] * 0.6]
    picked: list[int] = []
    for i in sorted(idx):
        if not picked or i - picked[-1] > 3:
            picked.append(int(i))
    if len(picked) != n * 2:
        sys.exit(f'expected {n * 2} frame lines, found {len(picked)}: {picked}')
    return picked


def panels(sheet: Path) -> list[Image.Image]:
    im = Image.open(sheet).convert('RGB')
    dark = np.array(im.convert('L')) < 100
    xs = lines(dark, 0, 4)
    ys = lines(dark, 1, 3)
    out = []
    for r in range(3):
        for c in range(4):
            out.append(im.crop((xs[c * 2], ys[r * 2], xs[c * 2 + 1] + 1, ys[r * 2 + 1] + 1)))
    return out


def label(d: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, f, anchor: str):
    """Text on a small white plate, so it reads over any drawing."""
    box = d.textbbox(xy, text, font=f, anchor=anchor)
    pad = 10
    d.rounded_rectangle((box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad), radius=10, fill='white')
    d.text(xy, text, font=f, fill='#1d1d1f', anchor=anchor)


def frame(pic: Image.Image, n: int, parsha: str) -> Image.Image:
    pic = pic.convert('RGB')
    scale = min(W / pic.width, H / pic.height)
    pic = pic.resize((round(pic.width * scale), round(pic.height * scale)), Image.LANCZOS)
    out = Image.new('RGB', (W, H), 'white')
    out.paste(pic, ((W - pic.width) // 2, (H - pic.height) // 2))
    d = ImageDraw.Draw(out)
    m = 64
    label(d, (m, m), parsha, font(FONT_I, 40), 'lt')
    label(d, (W - m, m), str(n), font(FONT, 44), 'rt')
    label(d, (W - m, H - m), '© mychitas.app 5787', font(FONT_I, 30), 'rb')
    return out


def main():
    args = sys.argv[1:]
    sheet = args[0] == '--sheet'
    if sheet:
        args = args[1:]
    if len(args) != 3:
        sys.exit(__doc__)
    src, dst, parsha = Path(args[0]), Path(args[1]), args[2]
    pics = panels(src) if sheet else [Image.open(src / f'{k:02d}.png') for k in range(1, 13)]
    dst.mkdir(parents=True, exist_ok=True)
    for k, p in enumerate(pics, 1):
        frame(p, k, parsha).convert('L').quantize(32).save(dst / f'{k:02d}.png', optimize=True)
    print(f'✓ {len(pics)} pictures → {dst}')


if __name__ == '__main__':
    main()
