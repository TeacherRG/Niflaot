/**
 * Memo illustrations: black-and-white colouring pages, one style for all 12 —
 * the same square 1000×1000 sheet, frame, line widths and pencil wobble.
 * Only three captions on a picture: the portion (top left), the number (top right), © (bottom right).
 *
 *   npx tsx scripts/memo-art.ts   → src/lessons/01-baal-haturim-bereshit/memo/NN.svg
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'src/lessons/01-baal-haturim-bereshit/memo';
const PARSHA = 'Bereshit';

/* ───── tiny drawing helpers (all return SVG markup, outlines only) ───── */
const f = (n: number) => Math.round(n * 10) / 10;
const P = (d: string, w = 5) => `<path d="${d}" stroke-width="${w}"/>`;
const C = (cx: number, cy: number, r: number, w = 5) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="${w}"/>`;
const E = (cx: number, cy: number, rx: number, ry: number, w = 5, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" stroke-width="${w}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
const L = (x1: number, y1: number, x2: number, y2: number, w = 4) => P(`M${x1} ${y1}L${x2} ${y2}`, w);

/** five-pointed star */
function star(cx: number, cy: number, r: number, w = 3.5) {
  const pts = [...Array(10)].map((_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`;
  });
  return P(`M${pts.join('L')}Z`, w);
}
/** a little four-ray sparkle */
const spark = (x: number, y: number, r: number) =>
  P(`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`, 3);
/** rays around a centre */
function rays(cx: number, cy: number, r1: number, r2: number, n: number, w = 4, phase = 0) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = phase + (i * 2 * Math.PI) / n;
    s += L(f(cx + r1 * Math.cos(a)), f(cy + r1 * Math.sin(a)), f(cx + r2 * Math.cos(a)), f(cy + r2 * Math.sin(a)), w);
  }
  return s;
}
/** puffy cloud, width ≈ 2.4·s */
function cloud(x: number, y: number, s: number, w = 4.5) {
  return P(
    `M${x - s} ${y}` +
      `C${x - s * 1.25} ${y} ${x - s * 1.3} ${y - s * 0.55} ${x - s * 0.8} ${y - s * 0.55}` +
      `C${x - s * 0.75} ${y - s * 1.05} ${x - s * 0.1} ${y - s * 1.15} ${x + s * 0.05} ${y - s * 0.7}` +
      `C${x + s * 0.3} ${y - s * 1.05} ${x + s * 0.95} ${y - s * 0.95} ${x + s * 0.9} ${y - s * 0.45}` +
      `C${x + s * 1.35} ${y - s * 0.45} ${x + s * 1.35} ${y} ${x + s * 1.05} ${y}Z`,
    w,
  );
}
/** a grass tuft */
function tuft(x: number, y: number, s = 1) {
  return P(
    `M${x - 18 * s} ${y}Q${x - 14 * s} ${y - 22 * s} ${x - 22 * s} ${y - 38 * s}` +
      `M${x} ${y}Q${x + 2 * s} ${y - 30 * s} ${x - 4 * s} ${y - 50 * s}` +
      `M${x + 16 * s} ${y}Q${x + 18 * s} ${y - 20 * s} ${x + 28 * s} ${y - 34 * s}`,
    3.5,
  );
}
/** a wavy row of hills as the ground line */
const ground = (y: number) =>
  P(`M40 ${y + 20}C180 ${y - 30} 300 ${y + 10} 430 ${y - 10}S700 ${y - 40} 820 ${y}S940 ${y + 10} 960 ${y}`, 5);

/* ───── the 12 scenes ───── */
const SCENES: string[] = [
  // 1 · בראשית ברא = בראש השנה נברא — the newly created world and a shofar
  [
    C(500, 430, 240, 6),
    E(500, 430, 240, 80, 3.5),
    E(500, 430, 110, 240, 3.5),
    L(260, 430, 740, 430, 3),
    // continents
    P('M395 270C440 250 480 285 470 320C460 360 410 350 400 385C390 410 350 400 340 370C330 330 360 285 395 270Z', 4),
    P('M560 330C610 315 660 345 650 395C640 440 600 430 590 480C580 520 545 525 535 495C525 455 555 430 545 395C540 365 535 340 560 330Z', 4),
    P('M420 520C460 505 500 530 485 565C470 590 430 585 415 565C405 550 405 528 420 520Z', 4),
    rays(500, 430, 270, 320, 16, 4),
    // shofar
    P('M150 840C230 900 400 905 540 850C660 800 760 720 800 620', 6),
    P('M175 812C250 860 395 860 515 812C620 770 700 700 735 610', 6),
    E(768, 612, 36, 20, 6, -65),
    P('M150 840C155 828 165 818 175 812', 6),
    P('M300 873L305 840M420 868L415 832M540 842L525 808M650 775L622 748', 3),
    spark(140, 170, 28),
    spark(860, 190, 24),
    star(870, 800, 26),
  ].join(''),

  // 2 · בראשית ברא אלקים — ס״ת אמת: an open book on a lectern, light and the world above it
  [
    // lectern
    P('M300 690L700 690L640 760L360 760Z', 5),
    P('M470 760L440 900M530 760L560 900M400 900L600 900', 5),
    // open book
    P('M250 640C330 600 430 610 500 650C570 610 670 600 750 640L740 690C670 655 570 662 500 700C430 662 330 655 260 690Z', 5),
    P('M500 650L500 700', 4),
    P('M300 640C350 625 410 628 460 650M300 662C350 646 410 650 460 670M545 650C595 628 650 625 700 640M545 670C595 650 650 646 700 662', 3),
    // world rising
    C(500, 360, 150, 6),
    E(500, 360, 150, 50, 3),
    E(500, 360, 60, 150, 3),
    rays(500, 360, 180, 240, 20, 4),
    P('M445 285C470 270 500 290 492 315C485 340 450 335 440 315C433 300 432 292 445 285Z', 4),
    P('M535 380C565 370 590 395 575 420C560 440 530 432 525 410C522 395 524 385 535 380Z', 4),
    spark(170, 230, 28),
    spark(830, 250, 28),
    spark(200, 520, 18),
    spark(810, 520, 18),
  ].join(''),

  // 3 · את האור = בתורה = 613: a Torah scroll in a great light
  [
    C(500, 300, 120, 5),
    C(500, 300, 70, 3.5),
    rays(500, 300, 140, 230, 24, 4),
    rays(500, 300, 245, 270, 24, 3, Math.PI / 24),
    // parchment
    P('M300 560C400 545 600 545 700 560L700 820C600 805 400 805 300 820Z', 5),
    P('M340 600L480 595M340 630L480 625M340 660L480 655M340 690L480 685M340 720L480 715M340 750L480 745', 3),
    P('M520 595L660 600M520 625L660 630M520 655L660 660M520 685L660 690M520 715L660 720M520 745L660 750', 3),
    // rollers (עצי חיים)
    P('M255 540L345 540L345 840L255 840Z', 5),
    P('M655 540L745 540L745 840L655 840Z', 5),
    P('M285 540L285 470L315 470L315 540M285 840L285 910L315 910L315 840', 5),
    P('M685 540L685 470L715 470L715 540M685 840L685 910L715 910L715 840', 5),
    E(300, 465, 30, 12, 4),
    E(700, 465, 30, 12, 4),
    E(300, 915, 30, 12, 4),
    E(700, 915, 30, 12, 4),
    P('M255 600L345 600M255 780L345 780M655 600L745 600M655 780L745 780', 3),
  ].join(''),

  // 4 · ויבדל = 52: havdalah — braided candle, cup and spice tower under the first stars
  [
    // candle: two braided strands
    P('M465 740L465 440M535 740L535 440', 6),
    ...[0, 1, 2, 3, 4, 5, 6].map((k) => P(`M465 ${700 - k * 40}C490 ${700 - k * 40} 510 ${680 - k * 40} 535 ${660 - k * 40}`, 4)),
    ...[0, 1, 2, 3, 4, 5, 6].map((k) => P(`M465 ${670 - k * 40}C480 ${676 - k * 40} 490 ${690 - k * 40} 498 ${700 - k * 40}`, 3)),
    P('M465 440C480 430 520 430 535 440', 5),
    P('M470 740L530 740', 5),
    P('M500 430L500 405', 4),
    P('M500 405C470 370 475 330 500 290C525 330 530 370 500 405Z', 5),
    P('M500 395C488 375 490 355 500 335C510 355 512 375 500 395Z', 3),
    rays(500, 350, 70, 100, 10, 3.5, -Math.PI / 2 + 0.3),
    // holder
    P('M430 740L570 740L560 780L440 780Z', 5),
    // cup
    P('M180 560L340 560C340 650 300 690 260 695C220 690 180 650 180 560Z', 5),
    P('M260 695L260 800M210 820C210 795 310 795 310 820Z', 5),
    P('M190 600L330 600', 3),
    // spice tower
    P('M700 600L800 600L800 720L700 720Z', 5),
    P('M690 600L750 520L810 600Z', 5),
    C(750, 505, 14, 4),
    P('M750 491L750 470L775 478L750 486', 4),
    P('M720 640L740 640L740 690L720 690ZM760 640L780 640L780 690L760 690Z', 3),
    P('M720 720L730 800L770 800L780 720M705 820L795 820', 5),
    // table
    P('M100 830L900 830', 5),
    // night sky
    P('M190 190C150 230 160 300 210 320C170 320 140 280 150 240C155 215 170 200 190 190Z', 5),
    star(360, 160, 26),
    star(700, 150, 30),
    star(830, 300, 22),
  ].join(''),

  // 5 · מזריע זרע למינהו — ר״ת מזל: every plant has its star above it
  [
    ground(780),
    // wheat
    P('M200 790L215 520', 5),
    P('M215 520C190 530 185 560 210 570M212 560C188 570 184 600 208 610M215 520C240 530 245 560 220 570M213 560C238 570 242 600 218 610M216 480C205 500 205 515 215 520C225 515 228 500 216 480Z', 4),
    P('M210 680C170 650 160 620 170 600M212 700C250 670 265 640 255 615', 4),
    // flower
    P('M400 800L400 560', 5),
    C(400, 530, 26, 5),
    P('M400 504C375 460 425 460 400 504M426 530C470 505 470 555 426 530M400 556C425 600 375 600 400 556M374 530C330 555 330 505 374 530', 4),
    P('M400 700C360 690 345 660 350 640C380 645 400 670 400 700ZM400 650C440 640 455 610 450 590C420 595 400 620 400 650Z', 4),
    // sprout
    P('M600 790L600 640', 5),
    P('M600 680C550 680 525 650 525 620C575 620 600 650 600 680ZM600 650C650 650 675 620 675 590C625 590 600 620 600 650Z', 4),
    // bush
    P('M760 790C700 790 690 720 730 700C710 650 770 620 800 650C830 620 890 650 865 700C905 720 890 790 830 790Z', 5),
    P('M800 790L800 720M800 740L770 710M800 750L835 715', 3.5),
    tuft(300, 800),
    tuft(510, 800, 0.9),
    tuft(680, 795, 0.8),
    tuft(120, 805, 0.8),
    // their stars
    star(215, 230, 34),
    star(400, 170, 34),
    star(600, 250, 34),
    star(800, 190, 34),
    P('M215 275L215 450M400 215L400 470M600 295L600 570M800 235L800 610', 2.5).replace('stroke-width="2.5"', 'stroke-width="2.5" stroke-dasharray="6 14"'),
  ].join(''),

  // 6 · מארת חסר: one great light — the sun, and the small moon
  [
    C(340, 360, 150, 6),
    C(340, 360, 105, 3),
    rays(340, 360, 175, 255, 18, 5),
    P('M760 230C700 260 680 340 720 395C755 445 820 455 870 425C820 430 770 400 755 350C740 300 750 255 760 230Z', 6),
    star(860, 300, 16),
    spark(650, 160, 18),
    cloud(620, 560, 70),
    cloud(200, 640, 55),
    ground(800),
    P('M120 860C220 830 300 860 380 845M560 860C650 835 760 860 880 840', 3.5),
    tuft(470, 800),
    tuft(820, 805, 0.9),
  ].join(''),

  // 7 · האדם — אותיות אדמה: the man is made from the earth
  [
    // the earth mound in layers
    P('M90 880C180 700 360 640 500 640C640 640 820 700 910 880Z', 6),
    P('M170 790C280 720 400 700 500 700C600 700 720 720 830 790', 3.5),
    P('M130 845C260 790 400 770 500 770C600 770 740 790 870 845', 3.5),
    C(300, 820, 10, 3),
    C(620, 805, 8, 3),
    C(720, 850, 12, 3),
    C(420, 740, 7, 3),
    E(560, 740, 14, 8, 3),
    // a man standing on it, seen from behind, arms open
    C(500, 360, 44, 6),
    P('M470 405L440 640L560 640L530 405', 6),
    P('M475 430C420 450 380 470 340 440M525 430C580 450 620 470 660 440', 6),
    P('M340 440L325 420M340 440L320 448M660 440L675 420M660 440L680 448', 4),
    P('M445 600L555 600', 3),
    // sunrise behind
    P('M190 470C190 330 330 210 500 200C670 210 810 330 810 470', 3.5),
    rays(500, 470, 380, 430, 13, 4, Math.PI),
    spark(160, 200, 22),
    spark(850, 210, 22),
  ].join(''),

  // 8 · ויפח באפיו נשמת חיים — ס״ת חותם: a seal and the breath of life
  [
    // stamp handle
    P('M455 180C430 180 420 215 440 235L455 250L455 380L545 380L545 250L560 235C580 215 570 180 545 180Z', 6),
    P('M410 380L590 380L610 440L390 440Z', 6),
    P('M455 300L545 300M455 330L545 330', 3),
    // impression below
    E(500, 720, 210, 70, 6),
    E(500, 710, 150, 45, 4),
    P('M500 680L515 703L540 703L520 718L528 742L500 728L472 742L480 718L460 703L485 703Z', 4),
    P('M390 785C390 815 420 840 445 835M610 785C610 815 580 840 555 835', 4),
    // pressing motion
    P('M500 470L500 610', 4).replace('stroke-width="4"', 'stroke-width="4" stroke-dasharray="10 12"'),
    P('M480 590L500 620L520 590', 4),
    // breath swirls
    P('M120 360C200 300 290 330 270 390C255 435 195 420 205 385', 5),
    P('M90 480C200 450 280 480 300 520', 4),
    P('M880 360C800 300 710 330 730 390C745 435 805 420 795 385', 5),
    P('M910 480C800 450 720 480 700 520', 4),
    P('M150 600C220 580 260 600 280 630M850 600C780 580 740 600 720 630', 3.5),
    spark(240, 200, 24),
    spark(770, 200, 24),
    spark(170, 790, 18),
    spark(840, 790, 18),
  ].join(''),

  // 9 · בהבראם — אותיות באברהם: Abraham's tent under heaven and earth
  [
    ground(790),
    // tent
    P('M240 800L500 450L760 800Z', 6),
    P('M500 450L500 415L535 428L500 440', 5),
    P('M500 450L420 800M500 450L580 800', 4),
    P('M420 800C440 700 470 620 500 560C530 620 560 700 580 800', 5),
    P('M240 800L190 820M760 800L810 820M500 450L240 800', 4),
    // palm tree
    P('M845 800C835 700 840 620 860 540', 6),
    P('M860 540C820 500 770 505 740 530M860 540C850 490 810 460 770 455M860 540C900 495 945 500 965 525M860 540C875 490 910 465 945 460', 5),
    P('M840 760L860 760M838 700L858 702M842 640L862 645M848 580L866 586', 3),
    tuft(140, 805),
    tuft(320, 800, 0.8),
    // starry heaven
    star(150, 170, 26),
    star(300, 110, 20),
    star(430, 210, 28),
    star(580, 120, 22),
    star(700, 230, 26),
    star(850, 140, 24),
    star(230, 330, 18),
    star(760, 380, 18),
    spark(520, 300, 14),
    spark(360, 380, 12),
    spark(640, 330, 12),
  ].join(''),

  // 10 · ויבאה = 24: crown, necklace and jewels — כ״ד קישוטים
  [
    // crown
    P('M330 360L360 180L430 290L500 150L570 290L640 180L670 360Z', 6),
    P('M330 360L670 360L670 410L330 410Z', 6),
    C(360, 172, 14, 4),
    C(500, 138, 16, 4),
    C(640, 172, 14, 4),
    E(420, 385, 18, 12, 3.5),
    E(500, 385, 18, 12, 3.5),
    E(580, 385, 18, 12, 3.5),
    // necklace
    P('M260 470C300 640 700 640 740 470', 4),
    ...[0.12, 0.24, 0.36, 0.5, 0.64, 0.76, 0.88].map((t) => {
      const x = (1 - t) ** 3 * 260 + 3 * (1 - t) ** 2 * t * 300 + 3 * (1 - t) * t * t * 700 + t ** 3 * 740;
      const y = (1 - t) ** 3 * 470 + 3 * (1 - t) ** 2 * t * 640 + 3 * (1 - t) * t * t * 640 + t ** 3 * 470;
      return C(f(x), f(y), 14, 4);
    }),
    P('M500 597L530 640L500 690L470 640Z', 5),
    // rings, bracelet, earrings
    C(200, 760, 50, 5),
    C(200, 760, 36, 3),
    P('M185 705L200 680L215 705', 4),
    E(800, 760, 85, 40, 5),
    E(800, 760, 65, 26, 3),
    C(500, 800, 34, 5),
    P('M480 770L500 740L520 770', 4),
    P('M370 720L370 760M370 760C345 790 370 830 370 830C370 830 395 790 370 760Z', 4),
    P('M630 720L630 760M630 760C605 790 630 830 630 830C630 830 655 790 630 760Z', 4),
    // a tray beneath
    P('M110 880L890 880M150 880L180 910L820 910L850 880', 5),
    spark(180, 250, 24),
    spark(820, 250, 24),
    spark(150, 560, 16),
    spark(860, 560, 16),
  ].join(''),

  // 11 · אשר צויתיך לבלתי אכל — ס״ת רכיל: the tree and the whispering snake
  [
    ground(830),
    // trunk
    P('M440 840C460 720 450 600 420 470M560 840C540 720 560 600 590 470', 6),
    P('M420 470C380 420 300 420 260 380M590 470C640 420 720 420 760 370M470 470C470 420 500 400 500 360M530 470C540 430 560 410 580 390', 5),
    // crown of leaves
    P('M160 380C110 300 180 210 260 230C270 140 380 100 440 150C490 90 600 100 620 170C700 130 800 190 790 260C870 280 880 380 810 410C780 460 680 470 640 430C580 470 470 470 420 440C360 480 230 470 160 380Z', 6),
    // fruits
    C(270, 320, 26, 4),
    C(380, 230, 26, 4),
    C(560, 210, 26, 4),
    C(700, 300, 26, 4),
    C(470, 330, 26, 4),
    C(620, 360, 22, 4),
    P('M270 294L275 280M380 204L385 190M560 184L565 170M700 274L705 260M470 304L475 290M620 338L625 325', 3),
    // snake coiled round the trunk
    P('M420 800C520 780 580 760 560 730C540 700 440 710 440 680C440 650 560 640 565 610C570 580 460 580 455 550', 7),
    P('M455 550C450 520 500 500 560 510C610 518 650 500 680 480', 7),
    E(700, 470, 28, 18, 5, -20),
    C(705, 463, 4, 3),
    P('M726 468L760 462M760 462L772 452M760 462L772 472', 3),
    P('M440 690L455 695M550 615L562 610M470 552L480 545', 3),
    tuft(250, 840),
    tuft(760, 835, 0.9),
  ].join(''),

  // 12 · הנה בשמים עדי = חנוך = 84: seven steps up to heaven
  [
    P('M120 880L220 880L220 820L320 820L320 760L420 760L420 700L520 700L520 640L620 640L620 580L720 580L720 520L820 520', 6),
    P('M120 880L120 920L880 920L880 880', 5),
    P('M220 880L220 920M320 820L320 920M420 760L420 920M520 700L520 920M620 640L620 920M720 580L720 920M820 520L820 920', 3),
    // clouds of heaven at the top of the stair
    cloud(800, 470, 110, 6),
    cloud(560, 360, 70),
    cloud(260, 300, 60),
    P('M800 360C800 280 860 230 900 220', 3.5),
    rays(820, 250, 70, 130, 9, 4, -Math.PI * 0.95),
    star(160, 160, 28),
    star(420, 130, 22),
    star(640, 190, 26),
    spark(120, 480, 18),
    spark(330, 520, 16),
  ].join(''),
];

/* ───── one sheet for all ───── */
function sheet(n: number, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
<defs>
<filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${n}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
</filter>
<filter id="pencil2" x="-5%" y="-5%" width="110%" height="110%">
<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="${n + 40}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="7"/>
</filter>
</defs>
<rect width="1000" height="1000" fill="#fff"/>
<g fill="none" stroke="#1d1d1f" stroke-linecap="round" stroke-linejoin="round">
<rect x="22" y="22" width="956" height="956" rx="36" stroke-width="5" filter="url(#pencil)"/>
<g id="art" filter="url(#pencil)">${body}</g>
<g filter="url(#pencil2)" opacity=".35" transform="translate(1.5 -1)">${body.replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${f(w * 0.35)}"`)}</g>
</g>
<g fill="#1d1d1f" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="30">
<text x="56" y="76">${PARSHA}</text>
<text x="944" y="76" text-anchor="end">${n}</text>
<text x="944" y="950" text-anchor="end" font-size="22">© mychitas.app 5787</text>
</g>
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
SCENES.forEach((body, i) => writeFileSync(`${OUT}/${String(i + 1).padStart(2, '0')}.svg`, sheet(i + 1, body)));
console.log(`✓ ${SCENES.length} illustrations → ${OUT}`);
