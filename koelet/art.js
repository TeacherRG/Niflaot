/* Game art: one icon set, the Keeper (mentor) with moods, and a backdrop per world.
   Icons: 24×24, 2px round stroke, soft fill (class "f") — один стиль на всех устройствах. */
const ICONS = {
  coin:'<circle class="f" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
  star:'<path class="f" d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"/>',
  book:'<path class="f" d="M3 5.5c2.5-1 6-1 9 1 3-2 6.5-2 9-1v13c-2.5-1-6-1-9 1-3-2-6.5-2-9-1z"/><path d="M12 6.5v13"/>',
  friends:'<circle class="f" cx="8.5" cy="8.5" r="3"/><circle class="f" cx="16" cy="9.5" r="2.5"/><path d="M3 19c0-3.3 2.5-5.5 5.5-5.5S14 15.7 14 19M14 14.4c.6-.5 1.3-.8 2-.8 2.5 0 4 1.8 4 4.4"/>',
  home:'<path class="f" d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  dove:'<path class="f" d="M3 13c3 0 5-1 7-4 1-1.5 2.5-3 4.5-3 1.5 0 2.5 1 3 2l3 .5-2.5 1.5c0 5-4 9-10 9-2 0-3.5-.5-5-1.5 2-.5 3.5-1.5 4.5-3C5 15 3.5 14.5 3 13z"/>',
  heart:'<path class="f" d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  trophy:'<path class="f" d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8 20.5h8M9.5 17h5v3.5"/>',
  smile:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M8.5 14c.9 1.4 2.1 2 3.5 2s2.6-.6 3.5-2M9 9.5v1M15 9.5v1"/>',
  globe:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.7 5.2 3.7 8.5s-1.2 6.2-3.7 8.5c-2.5-2.3-3.7-5.2-3.7-8.5s1.2-6.2 3.7-8.5z"/>',
  bulb:'<path class="f" d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/><path d="M9.5 20.5h5"/>',
  crown:'<path class="f" d="M4 17 3 8l5 4 4-6 4 6 5-4-1 9z"/><path d="M4 20.5h16"/>',
  castle:'<path class="f" d="M4 20.5V9h3v2h2V9h2v2h2V9h2v2h2V9h3v11.5z"/><path d="M10 20.5V17a2 2 0 0 1 4 0v3.5M12 9V3.5l3 1.2-3 1.2"/>',
  sail:'<path class="f" d="M11.5 3v12H5z"/><path class="f" d="M13.5 6v9H19z"/><path d="M3 17.5h18l-2 3H5z"/>',
  palette:'<path class="f" d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.4-1.2-1.7-1.2-2.8 0-1 .8-1.5 1.8-1.5h2.1a4 4 0 0 0 4-4c0-3.9-3.8-7-8.5-7z"/><circle cx="8" cy="11" r="1"/><circle cx="11" cy="7.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/>',
  ball:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M12 8.2l3 2.1-1.1 3.5h-3.8L9 10.3zM12 3.5v4.7M15 10.3l4.8-1.6M13.9 13.8l2.7 4.6M10.1 13.8l-2.7 4.6M9 10.3 4.2 8.7"/>',
  numbers:'<rect class="f" x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8M8.5 12h1M11.5 12h1M14.5 12h1M8.5 16h1M11.5 16h1M14.5 16h1"/>',
  chat:'<path class="f" d="M4 5h16v10H10l-4 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  helphand:'<path class="f" d="M12 11.5S8.5 9.4 8.5 6.9A2 2 0 0 1 12 5.6a2 2 0 0 1 3.5 1.3c0 2.5-3.5 4.6-3.5 4.6z"/><path d="M3 14h3l3.5 1.5H13a1.5 1.5 0 0 1 0 3H9.5M6 14v6.5H3M13.2 18.3l4.8-2.2c1-.5 2.2 0 2.5 1L14 20.5H6"/>',
  note:'<path d="M9 17V5l10-2v12"/><circle class="f" cx="6.5" cy="17" r="2.5"/><circle class="f" cx="16.5" cy="15" r="2.5"/>',
  paw:'<ellipse class="f" cx="12" cy="15.5" rx="4" ry="3.5"/><circle class="f" cx="6" cy="10.5" r="1.8"/><circle class="f" cx="9.5" cy="6.5" r="1.8"/><circle class="f" cx="14.5" cy="6.5" r="1.8"/><circle class="f" cx="18" cy="10.5" r="1.8"/>',
  pot:'<path class="f" d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M2 10h20M9 6.5c0-1 1-1 1-2M13 6.5c0-1 1-1 1-2"/>',
  sparkle:'<path class="f" d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  target:'<circle class="f" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
  clock:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  mirror:'<ellipse class="f" cx="12" cy="9.5" rx="5.5" ry="6.5"/><path d="M12 16v3.5M8.5 21h7M9.8 7.5l2-2M10 10.5l4-4"/>',
  letter:'<rect class="f" x="3" y="6" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6.5L20.5 7"/>',
  party:'<path class="f" d="M4 20l4.5-12 7.5 7.5z"/><path d="M14 3.5v2M19 9h2M16.8 6.2l1.5-1.5M12 8c1-1 1-2.5 0-3.5M16 12c1-1 2.5-1 3.5 0"/>',
  compass:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  brush:'<path class="f" d="M14.5 4.5l5 5-7 7-5-5z"/><path d="M7.5 11.5C5.5 11.5 4 13.1 4 15c0 1.4-.5 2.5-1.5 3.5 3 .5 7-.5 7.5-3.5"/>',
  hammer:'<path class="f" d="M13 3.5l6 6-2.5 2.5-6-6z"/><path d="M11.5 7.5l-8 8a1.8 1.8 0 0 0 2.5 2.5l8-8"/>',
  puzzle:'<path class="f" d="M5 5h4.5a2 2 0 1 1 4 0H18v4.5a2 2 0 1 1 0 4V18h-4.5a2 2 0 1 0-4 0H5v-4.5a2 2 0 1 0 0-4z"/>',
  lens:'<circle class="f" cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
  mic:'<rect class="f" x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  wrench:'<path class="f" d="M14.5 3.5a5 5 0 0 0-4.8 6.4l-6.2 6.2a1.9 1.9 0 0 0 2.7 2.7l6.2-6.2A5 5 0 0 0 19 7.6l-3 3-2.8-.5-.5-2.8 3-3a5 5 0 0 0-1.2-.8z"/>',
  medal:'<path d="M8 3l3 6M16 3l-3 6"/><circle class="f" cx="12" cy="14.5" r="5.5"/><path d="M12 12v5M10 14.5h4"/>',
  map:'<path class="f" d="M3 6l6-2.5 6 2.5 6-2.5v14l-6 2.5-6-2.5-6 2.5z"/><path d="M9 3.5v14M15 6v14"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  info:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".6"/>',
  sound:'<path class="f" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute:'<path class="f" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  up:'<circle class="f" cx="12" cy="12" r="8.5"/><path d="M12 16.5v-9M8 11l4-4 4 4"/>',
  scroll:'<path class="f" d="M7 4h11a2 2 0 0 1 2 2v1h-3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1h3z"/><path d="M10 9h5M10 12.5h5M10 16h3"/>',
  key:'<circle class="f" cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15.5 12v2"/>',
  wheat:'<path d="M12 21V8"/><path class="f" d="M12 8c-2-1-2.5-3-2-5 2 1 2.5 3 2 5zm0 0c2-1 2.5-3 2-5-2 1-2.5 3-2 5zm0 5c-2.5-.5-3.5-2.5-3.5-4.5 2.5.5 3.5 2.5 3.5 4.5zm0 0c2.5-.5 3.5-2.5 3.5-4.5-2.5.5-3.5 2.5-3.5 4.5zm0 5c-2.5-.5-3.5-2.5-3.5-4.5 2.5.5 3.5 2.5 3.5 4.5zm0 0c2.5-.5 3.5-2.5 3.5-4.5-2.5.5-3.5 2.5-3.5 4.5z"/>',
  fruit:'<path class="f" d="M12 7c4.5 0 7.5 3 7.5 6.8S16.2 21 12 21s-7.5-3.4-7.5-7.2S7.5 7 12 7z"/><path d="M9.5 7.3 9 4.5l1.8 1.2L12 3.5l1.2 2.2L15 4.5l-.5 2.8"/>',
  sukkah:'<path class="f" d="M4 9h16v11.5H4z"/><path d="M2.5 9h19M3.5 6.5c2 .8 3.5-1 5.5 0s3.5-1 5.5 0 3.5-1 6 0M9 20.5V15h6v5.5"/>',
  gift:'<rect class="f" x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1-3-5-4-5-1.5S12 9 12 9zm0 0c1-3 5-4 5-1.5S12 9 12 9z"/>',
  candles:'<path class="f" d="M7 11h3v9H7zm7 0h3v9h-3z"/><path d="M8.5 8.5c-.8-.8-.8-2 0-3.5.8 1.5.8 2.7 0 3.5zm7 0c-.8-.8-.8-2 0-3.5.8 1.5.8 2.7 0 3.5zM5 20.5h14"/>',
  ring:'<circle class="f" cx="12" cy="14.5" r="6"/><path d="M9.5 5h5l1.5 2.5-4 3.5-4-3.5z"/>',
  bucket:'<path class="f" d="M5 8h14l-1.8 12.5H6.8z"/><path d="M5 8c0-3 3-5 7-5s7 2 7 5"/>',
  moon:'<path class="f" d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
  hospital:'<path class="f" d="M4 20.5V8l8-4 8 4v12.5z"/><path d="M12 9.5v6M9 12.5h6"/>',
  etrog:'<path class="f" d="M12 5c4.3 0 7 3.6 7 7.8S15.8 20.5 12 20.5 5 17 5 12.8 7.7 5 12 5z"/><path d="M12 5V3M12 3c1.5-.8 3-.5 4 .5-1.5.8-3 .5-4-.5z"/>',
  lulav:'<path d="M12 21.5V3"/><path class="f" d="M12 3c1.3 1.6 1.6 4.2 1.3 7.3-.2 3.1-.7 6.2-1.3 8.2-.6-2-1.1-5.1-1.3-8.2C10.4 7.2 10.7 4.6 12 3z"/>',
  hadas:'<path d="M12 21.5V3"/><path class="f" d="M12 6c-1.8 0-3-1-3.5-2.5 1.8 0 3 1 3.5 2.5zm0 0c1.8 0 3-1 3.5-2.5-1.8 0-3 1-3.5 2.5zm0 5c-1.8 0-3-1-3.5-2.5 1.8 0 3 1 3.5 2.5zm0 0c1.8 0 3-1 3.5-2.5-1.8 0-3 1-3.5 2.5zm0 5c-1.8 0-3-1-3.5-2.5 1.8 0 3 1 3.5 2.5zm0 0c1.8 0 3-1 3.5-2.5-1.8 0-3 1-3.5 2.5z"/>',
  arava:'<path d="M12 21.5V3"/><path class="f" d="M12 8C9.5 7.5 8 6 7.5 3.5 10 4 11.5 5.5 12 8zm0 5c2.5-.5 4-2 4.5-4.5-2.5.5-4 2-4.5 4.5zm0 5c-2.5-.5-4-2-4.5-4.5 2.5.5 4 2 4.5 4.5z"/>',
  lock:'<rect class="f" x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  prev:'<path d="M14.5 6l-6 6 6 6"/>',
  next:'<path d="M9.5 6l6 6-6 6"/>',
  stop:'<rect class="f" x="6" y="6" width="12" height="12" rx="2"/>',
  flask:'<path class="f" d="M10.5 3.5V9L5 18.5A1.5 1.5 0 0 0 6.3 21h11.4a1.5 1.5 0 0 0 1.3-2.5L13.5 9V3.5"/><path d="M9.5 3.5h5M7.5 15h9"/>',
  tent:'<path class="f" d="M3 20.5L12 4l9 16.5z"/><path d="M9 20.5l3-6 3 6"/>',
  market:'<path class="f" d="M4 10h16v10.5H4z"/><path d="M3 10l2-5h14l2 5c0 1.3-1 2.2-2.2 2.2S16.5 11.3 16.5 10c0 1.3-1 2.2-2.2 2.2S12 11.3 12 10c0 1.3-1 2.2-2.2 2.2S7.5 11.3 7.5 10c0 1.3-1 2.2-2.2 2.2S3 11.3 3 10zM10 20.5V15h4v5.5"/>',
  twins:'<circle class="f" cx="8" cy="8" r="3"/><circle class="f" cx="16" cy="8" r="3"/><path d="M3 19.5c0-3 2.2-5 5-5s5 2 5 5M11 19.5c0-3 2.2-5 5-5s5 2 5 5"/>',
  diamond:'<path class="f" d="M12 3l8 9-8 9-8-9z"/>',
  circle:'<circle class="f" cx="12" cy="12" r="8"/>',
  triangle:'<path class="f" d="M12 4l9 15.5H3z"/>',
  square:'<rect class="f" x="4.5" y="4.5" width="15" height="15" rx="2"/>',
  scissors:'<circle class="f" cx="6.5" cy="6.5" r="3"/><circle class="f" cx="6.5" cy="17.5" r="3"/><path d="M9 8.5l11 9M9 15.5l11-9"/>'
};
function icon(name,cls){
  const d=ICONS[name];if(!d)return '';
  return `<svg class="ico ${cls||''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
}
/* «pic» на карточке: несколько имён иконок через пробел */
const picHTML=s=>s?`<div class="pic" aria-hidden="true">${s.split(' ').map(n=>icon(n)).join('')}</div>`:'';

/* ---------- Картинки художника: art/<возраст>/{bg,keeper,avatar}/ ----------
   Свой стиль для каждой возрастной группы (y 8–11, t 12–15, a 16+). Какие файлы есть —
   art/manifest.json (собирает npm run art). Чего нет — рисуется кодом, как раньше. См. art/README.md */
let ARTSET={};
const ART_READY=fetch('art/manifest.json').then(r=>r.ok?r.json():{}).then(m=>{ARTSET=m&&typeof m==='object'?m:{}}).catch(()=>{});
const artAge=()=>(typeof S!=='undefined'&&S&&S.hero&&S.hero.age)||'t';
/* первый найденный файл из names в наборе текущего возраста, иначе '' */
function artSrc(kind,...names){
  const a=artAge(),k=ARTSET[a]&&ARTSET[a][kind];if(!k)return '';
  for(const n of names)if(n&&k[n])return `art/${a}/${kind}/${k[n]}`;
  return '';
}
/* подгрузить всех Хранителей возраста заранее, чтобы смена настроения не мигала */
let artWarm='';
function artPreload(){
  const a=artAge();if(artWarm===a)return;artWarm=a;
  for(const m in MOODS){const src=artSrc('keeper',m);if(src)new Image().src=src}
}

/* ---------- Хранитель: 5 выражений лица × 5 жестов ---------- */
const MOODS = {smile:['smile','book'],joy:['joy','open'],think:['think','chin'],wow:['wow','open'],warm:['warm','heart'],point:['smile','point']};
function mentorSvg(mood){
  const src=artSrc('keeper',MOODS[mood]?mood:'smile','smile');
  if(src)return `<svg class="mentor" viewBox="0 0 120 150" role="img" aria-label="${typeof t==='function'?t('mentor.name'):''}"><image href="${src}" width="120" height="150" preserveAspectRatio="xMidYMax meet"/></svg>`;
  return mentorVec(mood);
}
function mentorVec(mood){
  const [face,gest]=MOODS[mood]||MOODS.smile;
  const skin='#e7b894',robe='#5a4a78',ink='#2a2a2a';
  const arm=(d)=>`<path d="${d}" stroke="${robe}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${skin}"/>`;
  const G={
    book:arm('M41 76 Q34 98 50 99')+arm('M79 76 Q86 98 70 99')+`<rect x="44" y="88" width="32" height="20" rx="2" fill="#6e2433"/><path d="M47 90 H59 V105 H47Z M61 90 H73 V105 H61Z" fill="#f7f0df"/>`+hand(48,100)+hand(72,100),
    open:arm('M41 76 Q26 84 16 66')+arm('M79 76 Q94 84 104 66')+hand(15,63)+hand(105,63),
    point:arm('M41 76 Q35 100 41 114')+hand(41,116)+arm('M79 76 Q96 74 97 52')+hand(97,49)+`<path d="M97 44 V35" stroke="${skin}" stroke-width="4.5" stroke-linecap="round"/>`,
    chin:arm('M41 76 Q38 98 62 99')+hand(64,99)+arm('M79 76 Q94 96 73 84')+hand(71,83),
    heart:arm('M41 76 Q35 100 41 114')+hand(41,116)+arm('M79 76 Q88 98 67 94')+hand(65,93)
  };
  const F={
    smile:`<circle cx="52" cy="44" r="1.9" fill="${ink}"/><circle cx="68" cy="44" r="1.9" fill="${ink}"/><path d="M46.5 35.5 Q52 33 56.5 35.5 M63.5 35.5 Q68 33 73.5 35.5" stroke="#bfb8ac" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M54 61 Q60 65.5 66 61" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    joy:`<path d="M48.5 45 Q52 41.5 55.5 45 M64.5 45 Q68 41.5 71.5 45" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M46.5 33.5 Q52 30.5 56.5 33.5 M63.5 33.5 Q68 30.5 73.5 33.5" stroke="#bfb8ac" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M53 60 Q60 69 67 60Z" fill="#7a3b2e"/><circle cx="46" cy="52" r="3" fill="#e58f7a" opacity=".35"/><circle cx="74" cy="52" r="3" fill="#e58f7a" opacity=".35"/>`,
    think:`<circle cx="53.5" cy="42.5" r="1.9" fill="${ink}"/><circle cx="69.5" cy="42.5" r="1.9" fill="${ink}"/><path d="M46.5 33 Q52 29.5 56.5 33.5 M63.5 36 L73.5 35" stroke="#bfb8ac" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M55 62 Q60 61 65.5 63" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    wow:`<circle cx="52" cy="44" r="2.7" fill="${ink}"/><circle cx="68" cy="44" r="2.7" fill="${ink}"/><path d="M46.5 32 Q52 28 56.5 32 M63.5 32 Q68 28 73.5 32" stroke="#bfb8ac" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="62" rx="2.8" ry="3.4" fill="#7a3b2e"/>`,
    warm:`<path d="M48.5 43.5 Q52 46.5 55.5 43.5 M64.5 43.5 Q68 46.5 71.5 43.5" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M46.5 35 Q52 33 56.5 35 M63.5 35 Q68 33 73.5 35" stroke="#bfb8ac" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M54 61 Q60 65 66 61" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="46" cy="52" r="3" fill="#e58f7a" opacity=".35"/><circle cx="74" cy="52" r="3" fill="#e58f7a" opacity=".35"/>`
  };
  return `<svg class="mentor" viewBox="0 0 120 150" role="img" aria-label="${typeof t==='function'?t('mentor.name'):''}">
    <ellipse cx="60" cy="146" rx="34" ry="4" fill="rgba(23,40,46,.12)"/>
    <path d="M40 70 Q60 61 80 70 L96 146 H24Z" fill="${robe}"/>
    <path d="M26 132 H94 M25 138 H95" stroke="#1d2b44" stroke-width="2.5" opacity=".5"/>
    <path d="M55 68 L60 146 L65 68Z" fill="#ecc865" opacity=".85"/>
    <circle cx="60" cy="44" r="20" fill="${skin}"/>
    <path d="M40.5 46 Q42 79 60 85 Q78 79 79.5 46 Q72 58 60 58 Q48 58 40.5 46Z" fill="#ece6dc"/>
    <path d="M50 55.5 Q55 52.5 60 55.5 Q65 52.5 70 55.5 Q65 58.5 60 56.5 Q55 58.5 50 55.5Z" fill="#ddd6ca"/>
    <path d="M40 38 Q41 28 46 27 L45 42Z M80 38 Q79 28 74 27 L75 42Z" fill="#ece6dc"/>
    <path d="M44 29 Q60 17 76 29 Q60 25 44 29Z" fill="#1d2b44"/>
    ${F[face]}
    <circle cx="52" cy="44" r="6.2" fill="none" stroke="${ink}" stroke-width="1.5"/><circle cx="68" cy="44" r="6.2" fill="none" stroke="${ink}" stroke-width="1.5"/><path d="M58.2 44 H61.8" stroke="${ink}" stroke-width="1.5"/>
    ${G[gest]}
  </svg>`;
}

/* ---------- Темы миров: свой фон и акцентный цвет ---------- */
const THEMES = {
  base:{accent:'#8a5d00',bg:'#edf3ef'},
  library:{accent:'#7a4b2a',bg:'#f1ebe1'},
  city:{accent:'#a63f1c',bg:'#f7eee6'},
  puzzle:{accent:'#276b3f',bg:'#ecf3ee'},
  mirror:{accent:'#3a669c',bg:'#eaf0f7'},
  tent:{accent:'#8f521a',bg:'#f6efe2'},
  workshop:{accent:'#744d2b',bg:'#f2ece4'},
  lab:{accent:'#56469c',bg:'#efedf8'},
  sukkah:{accent:'#276b3f',bg:'#eef4ea'},
  map:{accent:'#7a5200',bg:'#f4efe1'}
};
const WORLD_THEME = ['city','puzzle','mirror','tent','workshop','lab','sukkah'];
const WORLD_ICON = ['market','puzzle','mirror','tent','wrench','flask','sukkah'];

/* Фоновые иллюстрации. viewBox 1200×800, привязка к низу экрана. */
const SCENES = {
  library(){
    const cols=['#c9a883','#a9bba9','#cfa7a2','#b3b0cf','#dcc084','#b89b7c'];
    const shelf=(x,w)=>{let s=`<rect x="${x}" y="300" width="${w}" height="460" rx="6" fill="#dcc9ad"/>`;
      for(let r=0;r<4;r++){let bx=x+10;const y=320+r*108;s+=`<rect x="${x}" y="${y+92}" width="${w}" height="10" fill="#c7ae8b"/>`;
        for(let i=0;bx<x+w-18;i++){const bw=12+((i*7+r*5)%10),bh=58+((i*13+r*7)%30);s+=`<rect x="${bx}" y="${y+92-bh}" width="${bw}" height="${bh}" rx="2" fill="${cols[(i+r)%cols.length]}"/>`;bx+=bw+3}}
      return s};
    return `<radialGradient id="lg" cx=".5" cy=".35" r=".55"><stop offset="0" stop-color="#fff4d8"/><stop offset="1" stop-color="#fff4d8" stop-opacity="0"/></radialGradient>
      <rect width="1200" height="800" fill="url(#lg)"/>${shelf(40,300)}${shelf(370,170)}${shelf(660,170)}${shelf(860,300)}
      <path d="M548 420V250a52 52 0 0 1 104 0v170z" fill="#fbf3e0" stroke="#d2bd98" stroke-width="8"/><path d="M600 200v220M548 300h104" stroke="#d2bd98" stroke-width="5"/>
      <rect y="760" width="1200" height="40" fill="#d6c3a4"/>`;
  },
  city(){
    let stalls='';const aw=['#d9826a','#e8b04f','#7fa9c9','#9cc49a','#d98aa6','#e0a15e'];
    for(let i=0;i<6;i++){const x=i*205-10,c=aw[i];let sc='';for(let k=0;k<6;k++)sc+=`<path d="M${x+k*30} 610 q15 22 30 0" fill="${k%2?'#fbf1e4':c}"/>`;
      stalls+=`<rect x="${x+8}" y="610" width="176" height="190" fill="#ecdcc8"/><path d="M${x} 560 H${x+180} L${x+190} 610 H${x-10}Z" fill="${c}"/>${sc}
      <rect x="${x+20}" y="700" width="150" height="16" rx="4" fill="#c9a37c"/>${[0,1,2,3,4].map(j=>`<circle cx="${x+40+j*28}" cy="${690}" r="11" fill="${aw[(i+j+1)%6]}"/>`).join('')}`}
    let lamps='';for(let i=0;i<14;i++){const x=40+i*84,y=420+Math.sin(i/13*Math.PI)*70;lamps+=`<circle cx="${x}" cy="${y+18}" r="24" fill="#f7cf62" opacity=".25"/><path d="M${x-8} ${y+6} h16 l-3 22 h-10z" fill="#f2be3d"/>`}
    return `<linearGradient id="cs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1c4a9"/><stop offset=".45" stop-color="#f5dccb"/><stop offset=".75" stop-color="#f7eee6" stop-opacity="0"/></linearGradient>
      <rect width="1200" height="800" fill="url(#cs)"/>
      <path d="M0 540 V470 h80 v-40 a40 40 0 0 1 80 0 v40 h90 v-70 h60 v70 h120 v-30 a50 50 0 0 1 100 0 v30 h140 v-50 h50 v50 h110 a45 45 0 0 1 90 0 h130 v-40 h70 v40 h80 V540z" fill="#ecd0bb"/>
      <path d="M0 420 Q600 560 1200 420" stroke="#8a6a4f" stroke-width="2" fill="none" opacity=".6"/>${lamps}${stalls}`;
  },
  puzzle(){
    const cols=['#cfe3d6','#f3d9a0','#bcd6ea','#f2c4cc','#d9cdea'];let p='';
    [[120,180,1.6,-.3],[980,140,1.4,.4],[300,520,1.2,.2],[860,480,1.5,-.2],[560,90,1,.1],[40,620,1.3,.5],[1080,640,1.2,-.4]].forEach((a,i)=>p+=`<g transform="translate(${a[0]} ${a[1]}) rotate(${a[3]*57}) scale(${a[2]})"><path d="${PIECE}" fill="${cols[i%cols.length]}"/></g>`);
    return `${p}<path d="M0 700 Q300 640 600 690 T1200 670 V800 H0z" fill="#cfe3d6"/><path d="M0 740 Q400 700 800 740 T1200 730 V800 H0z" fill="#b9d6c3"/>`;
  },
  mirror(){
    let m='';for(let i=0;i<7;i++){const x=20+i*170;m+=`<path d="M${x} 640 V330 a70 70 0 0 1 140 0 V640z" fill="#dbe6f2" stroke="#c7b27a" stroke-width="8"/><path d="M${x+20} 600 V340 a50 50 0 0 1 60 -40" stroke="#fff" stroke-width="10" opacity=".8" fill="none"/><path d="M${x+40} 620 l60 -120" stroke="#fff" stroke-width="6" opacity=".6"/>`}
    let f='';for(let r=0;r<4;r++)for(let c=0;c<14;c++)if((r+c)%2)f+=`<rect x="${c*90-r*12}" y="${660+r*36}" width="90" height="36" fill="#d4e0ee"/>`;
    return `<rect width="1200" height="800" fill="#e8eef6"/><rect y="660" width="1200" height="140" fill="#eef3f9"/>${f}${m}`;
  },
  tent(){
    return `<circle cx="1020" cy="170" r="70" fill="#f6d98a" opacity=".6"/>
      <path d="M0 620 Q250 540 520 600 T1200 580 V800 H0z" fill="#efdcbc"/><path d="M0 700 Q350 640 700 690 T1200 680 V800 H0z" fill="#e8cfa6"/>
      <path d="M380 690 L600 330 L820 690z" fill="#d9a46e"/><path d="M600 330 L470 690 M600 330 L530 690 M600 330 L670 690 M600 330 L730 690" stroke="#c78a52" stroke-width="10"/>
      <path d="M560 690 L600 520 L640 690z" fill="#8a5a32" opacity=".55"/><path d="M600 330 V300" stroke="#8a5a32" stroke-width="6"/><path d="M600 300 l30 10 -30 10z" fill="#c8445b"/>
      <path d="M170 700 C176 600 190 520 200 470" stroke="#a07a4e" stroke-width="12" fill="none"/>${[-60,-20,20,60,100].map(a=>`<path d="M200 470 q${a} -40 ${a*1.6} ${30+Math.abs(a)/3}" stroke="#8fb07e" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M1000 700 C1006 620 1016 560 1024 520" stroke="#a07a4e" stroke-width="10" fill="none"/>${[-50,-10,30,70].map(a=>`<path d="M1024 520 q${a} -34 ${a*1.5} ${26+Math.abs(a)/3}" stroke="#8fb07e" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}`;
  },
  workshop(){
    let planks='';for(let i=0;i<20;i++)planks+=`<rect x="${i*60}" y="0" width="58" height="800" fill="${i%2?'#efe5d8':'#eadfcf'}"/>`;
    let holes='';for(let r=0;r<6;r++)for(let c=0;c<16;c++)holes+=`<circle cx="${290+c*40}" cy="${250+r*40}" r="4" fill="#cdb898"/>`;
    return `${planks}<rect x="270" y="230" width="660" height="250" rx="10" fill="#e0cfb4"/>${holes}
      <path d="M340 270 v140 M320 270 h40" stroke="#b08e66" stroke-width="14" stroke-linecap="round"/>
      <path d="M470 280 l120 0 l-10 60 l-110 0z" fill="#c9b08e"/><path d="M590 300 h40" stroke="#b08e66" stroke-width="12" stroke-linecap="round"/>
      <path d="M720 270 a24 24 0 1 0 20 38 l60 90" stroke="#b08e66" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M850 260 v160" stroke="#b08e66" stroke-width="8"/><path d="M835 260 h30 v40 h-30z" fill="#b08e66"/>
      <rect x="40" y="600" width="1120" height="36" rx="6" fill="#c49a6c"/><rect x="80" y="636" width="30" height="164" fill="#a97f55"/><rect x="1090" y="636" width="30" height="164" fill="#a97f55"/>
      <rect x="160" y="560" width="120" height="40" rx="4" fill="#9a7a58"/><rect x="420" y="575" width="260" height="25" rx="3" fill="#dcbf94"/><rect x="450" y="552" width="200" height="23" rx="3" fill="#e6cfa8"/>
      <path d="M760 596 q20 -30 40 0 q20 -30 40 0" stroke="#dcbf94" stroke-width="5" fill="none"/>`;
  },
  lab(){
    let tiles='';for(let r=0;r<10;r++)for(let c=0;c<15;c++)tiles+=`<rect x="${c*80+2}" y="${r*80+2}" width="76" height="76" rx="6" fill="#f3f1fa"/>`;
    const liq=['#c9bff0','#bfe3d4','#f2c9d6','#f3dea0','#bcd6ea'];let fl='';
    for(let s=0;s<2;s++){const y=s?560:340;fl+=`<rect x="60" y="${y}" width="1080" height="12" rx="4" fill="#d6cfe9"/>`;
      for(let i=0;i<9;i++){const x=110+i*120,c=liq[(i+s*2)%5];
        fl+=(i+s)%2?`<path d="M${x-10} ${y-90} v30 l-28 50 a8 8 0 0 0 7 10 h62 a8 8 0 0 0 7 -10 l-28 -50 v-30z" fill="#fff" stroke="#cfc6e6" stroke-width="4"/><path d="M${x-33} ${y-20} h66 l6 10 a8 8 0 0 1 -7 10 h-64 a8 8 0 0 1 -7 -10z" fill="${c}"/>`
          :`<circle cx="${x}" cy="${y-38}" r="34" fill="#fff" stroke="#cfc6e6" stroke-width="4"/><path d="M${x-34} ${y-38} a34 34 0 0 0 68 0z" fill="${c}"/><rect x="${x-9}" y="${y-100}" width="18" height="34" fill="#fff" stroke="#cfc6e6" stroke-width="4"/>`;
        if(i%3===0)fl+=`<circle cx="${x+4}" cy="${y-120}" r="6" fill="${c}"/><circle cx="${x-6}" cy="${y-140}" r="4" fill="${c}"/>`}}
    return `<rect width="1200" height="800" fill="#ebe8f5"/>${tiles}${fl}<rect y="700" width="1200" height="100" fill="#ddd6ee"/>`;
  },
  sukkah(){
    let stars='';for(let i=0;i<30;i++)stars+=`<circle cx="${(i*197)%1200}" cy="${(i*89)%300+20}" r="${1.5+(i%3)}" fill="#fff" opacity=".8"/>`;
    let sch='';for(let i=0;i<40;i++){const x=150+i*23;sch+=`<path d="M${x} 300 q12 -30 30 -8 q10 -28 26 4" stroke="${i%2?'#7fae7d':'#5f9a63'}" stroke-width="9" fill="none" stroke-linecap="round"/>`}
    const dec=['#e36b7f','#f2be3d','#86b9da','#b99ad8','#9fd0ae'];let hang='';
    for(let i=0;i<9;i++){const x=220+i*95,l=40+(i%3)*25;hang+=`<path d="M${x} 310 v${l}" stroke="#a88a5c" stroke-width="2"/><circle cx="${x}" cy="${320+l}" r="14" fill="${dec[i%5]}"/>`}
    return `<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e2f2"/><stop offset=".5" stop-color="#eef4ea"/></linearGradient>
      <rect width="1200" height="800" fill="url(#sk)"/>${stars}
      <rect x="160" y="300" width="880" height="500" fill="#f6efdc"/><path d="M160 300 V800 M1040 300 V800 M600 300 V800" stroke="#b08e66" stroke-width="16"/>
      <path d="M160 300 H1040" stroke="#b08e66" stroke-width="12"/>${sch}${hang}
      <rect x="360" y="640" width="480" height="20" rx="4" fill="#c49a6c"/><rect x="390" y="660" width="16" height="140" fill="#a97f55"/><rect x="794" y="660" width="16" height="140" fill="#a97f55"/>
      <path d="M470 640 q30 -40 60 0z" fill="#e8c14f"/><path d="M660 640 v-120" stroke="#6f9b5e" stroke-width="10" stroke-linecap="round"/>`;
  },
  map(){
    let c='';for(let i=0;i<9;i++)c+=`<path d="M0 ${120+i*80} Q300 ${80+i*80} 600 ${130+i*80} T1200 ${110+i*80}" stroke="#e4d9bd" stroke-width="3" fill="none"/>`;
    return `${c}<g transform="translate(1060 690)" opacity=".7"><circle r="70" fill="none" stroke="#d6c69c" stroke-width="4"/><path d="M0 -90 L14 0 L0 90 L-14 0Z M-90 0 L0 -14 L90 0 L0 14Z" fill="#d6c69c"/></g>`;
  }
};
function sceneSvg(key,align){
  const src=artSrc('bg',key);
  if(src){
    /* фон уходит под карточку: на телефоне (портрет) — свой вертикальный файл, если он есть */
    const p=align?'':artSrc('bg',key+'-p');
    return `<picture class="${align?'mid':'low'}">${p?`<source media="(orientation: portrait)" srcset="${p}">`:''}<img src="${src}" alt="" decoding="async"></picture>`;
  }
  const f=SCENES[key];if(!f)return '';
  return `<svg viewBox="0 0 1200 800" preserveAspectRatio="${align||'xMidYMax'} slice" aria-hidden="true" focusable="false">${f()}</svg>`;
}
