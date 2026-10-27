/* Game runtime: state, rendering, interactions, and minigames. */
const KEY='koelet-game-v1';
const fresh=()=>({v:1,screen:'title',hero:{name:'',age:null,g:null,arch:0,look:0,outfit:0},w:0,s:0,ps:0,done:[0,0,0,0,0,0,0],sparks:0,ach:{},ans:{},qualities:[],lab:{can:[],like:[],need:[],help:[]},tools:{},help:0,insight:0,sound:false,phrase:null,own:{}});
let S=fresh();
/* Динамические стили. CSP разрешает стили только из styles.css (style-src 'self'), поэтому style="…" в
   разметке браузер выбросит. Шаблоны пишут data-css="свойство:значение;…", а здесь значения ставятся через
   el.style (CSSOM разрешён) — только известные свойства и значения без url(), так что вставленная
   чужая разметка не сможет так ничего нарисовать. Срабатывает на любой новый элемент на странице. */
const CSS_PROPS=/^(--[a-z]+|left|top|width|height|background|animation-delay|aspect-ratio|fill|stroke|stroke-width)$/;
function applyCss(root){
  const els=root.matches&&root.matches('[data-css]')?[root]:[];
  if(root.querySelectorAll)els.push(...root.querySelectorAll('[data-css]'));
  for(const el of els){
    for(const d of el.getAttribute('data-css').split(';')){const i=d.indexOf(':');if(i<0)continue;
      const k=d.slice(0,i).trim(),v=d.slice(i+1).trim();
      if(CSS_PROPS.test(k)&&/^[-\w.%#(),\s\/]*$/.test(v)&&!/url|expression/i.test(v))el.style.setProperty(k,v)}
    el.removeAttribute('data-css');
  }
}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)applyCss(n)}).observe(document.documentElement,{childList:true,subtree:true});
/* Фото для сертификата — только на время вкладки (sessionStorage): на общем или школьном компьютере
   оно не остаётся после закрытия игры. Прогресс и ответы — в localStorage, без фото. */
const PHOTO_KEY='koelet-photo';
function load(){
  try{const r=localStorage.getItem(KEY);if(r){const d=JSON.parse(r);if(d&&d.v===1){
    if(d.photo){delete d.photo;delete d.photoOff;localStorage.setItem(KEY,JSON.stringify(d))} // фото из старых версий стираем
    S=Object.assign(fresh(),d)}}}catch(e){}
  try{const p=sessionStorage.getItem(PHOTO_KEY);if(p)S.photo=p}catch(e){}
}
let savedPhoto;
function save(){
  try{localStorage.setItem(KEY,JSON.stringify(S,(k,v)=>k==='photo'?undefined:v))}catch(e){}
  if(S.photo!==savedPhoto){savedPhoto=S.photo;try{S.photo?sessionStorage.setItem(PHOTO_KEY,S.photo):sessionStorage.removeItem(PHOTO_KEY)}catch(e){}}
}

/* ================================================================
   HELPERS
   ================================================================ */
const $=s=>document.querySelector(s);
const stage=$('#stage');
const esc=s=>String(s).replace(/[&<>"{}]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','{':'&#123;','}':'&#125;'}[c]));
const heroName=()=>S.hero.name.trim()||t('hero.default');
/* возраст и род */
const young=()=>S.hero.age==='y';
const adult=()=>S.hero.age==='a';
const T=s=>typeof s==='string'?s.replace(/\{([^{}|]*)\|([^{}|]*)\}/g,(_,m,f)=>S.hero.g==='f'?f:m):s;
function R(v){
  if(typeof v==='string')return T(v);
  if(Array.isArray(v))return v.map(R);
  if(v&&typeof v==='object'){if(v.__ag)return R(young()?v.y:adult()&&'a' in v?v.a:v.t);const o={};for(const k in v)o[k]=R(v[k]);return o}
  return v;
}
/* age шага: "y" — только 8–11, "t" — с 12 лет (и для 16+), "a" — только 16+ */
const byAge=a=>a.filter(s=>typeof s==='function'||!s.age||(s.age==='y'?young():s.age==='t'?!young():adult()));
const PRO=()=>byAge(PROLOGUE);
const myQualities=()=>[...(S.qualities||[]),...(S.own&&S.own.quality?[S.own.quality]:[])];

/* роли героя: имя файла в art/<возраст>/avatar/ и значок, если у картинки нет своей роли */
const ARCH_ART=['explorer','inventor','chronicler','traveler','artist','musician'];
const ARCH_IC=['lens','bulb','scroll','compass','palette','note'];
/* картинка художника: m3-artist → m3 → m (m/f — мальчик/девочка, цифра — внешность 1–6) */
function avatarArt(p){
  if(p.g!=='m'&&p.g!=='f')return '';
  const g=p.g+((p.look||0)+1),r=ARCH_ART[p.arch];
  const src=artSrc('avatar',r&&g+'-'+r,g,r&&p.g+'-'+r,p.g);if(!src)return '';
  const own=r&&/-[a-z]+\.\w+/.test(src.split('/').pop().split('?')[0]);
  const badge=r&&!own?`<g transform="translate(72 72)"><circle cx="12" cy="12" r="13" fill="#fff" stroke="${OUTFITS[p.outfit||0]}" stroke-width="2.5"/><g transform="translate(3 3) scale(.75)" fill="none" stroke="#3a3a3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[ARCH_IC[p.arch]]}</g></g>`:'';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#f4efe6"/><rect width="100" height="100" fill="${OUTFITS[p.outfit||0]}" fill-opacity=".3"/><image href="${src}" width="100" height="100" preserveAspectRatio="xMidYMax slice"/>${badge}</svg>`;
}
function avatar(p){
  const art=avatarArt(p);if(art)return art;
  const L=LOOKS[p.look||0], out=OUTFITS[p.outfit||0], a=p.arch;
  let back='',hair='',acc='';
  if(L.style===2) back=`<path d="M30 40 Q30 17 50 17 Q70 17 70 40 L73 68 Q60 63 50 63 Q40 63 27 68Z" fill="${L.hair}"/>`;
  if(L.style===0||L.style===2) hair=`<path d="M31 41 Q30 19 50 19 Q70 19 69 41 Q63 29 50 29 Q37 29 31 41Z" fill="${L.hair}"/>`;
  if(L.style===1) hair=[[35,30],[42,23],[50,21],[58,23],[65,30],[33,38],[67,38]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="7.5" fill="${L.hair}"/>`).join('');
  if(L.style===3) hair=`<circle cx="50" cy="15" r="7" fill="${L.hair}"/><path d="M31 41 Q30 19 50 19 Q70 19 69 41 Q63 29 50 29 Q37 29 31 41Z" fill="${L.hair}"/>`;
  if(a===0) acc=`<path d="M24 31 L76 31 L70 27 L63 13 L37 13 L30 27Z" fill="#8a6a3f"/><rect x="30" y="25" width="40" height="4" fill="#5b4527"/>`;
  if(a===1) acc=`<rect x="31" y="28" width="38" height="4" rx="2" fill="#3b3b3b"/><circle cx="42" cy="30" r="6" fill="#9ad0d8" stroke="#ecc865" stroke-width="2.5"/><circle cx="58" cy="30" r="6" fill="#9ad0d8" stroke="#ecc865" stroke-width="2.5"/>`;
  if(a===2) acc=`<rect x="63" y="76" width="18" height="12" rx="3" fill="#f3ead8" stroke="#8a6a3f" stroke-width="2"/><path d="M68 80 H77 M68 84 H75" stroke="#8a6a3f" stroke-width="1.5"/>`;
  if(a===3) acc=`<path d="M35 65 Q50 75 65 65 L67 72 Q50 82 33 72Z" fill="#ecc865"/><path d="M58 72 L62 88 L55 86Z" fill="#ecc865"/>`;
  if(a===4) acc=`<path d="M29 31 Q33 15 52 16 Q72 17 71 29 Q50 24 29 31Z" fill="#c8445b"/><rect x="50" y="11" width="3" height="6" rx="1.5" fill="#c8445b"/>`;
  if(a===5) acc=`<path d="M30 44 Q29 17 50 17 Q71 17 70 44" stroke="#2b2b2b" stroke-width="4" fill="none"/><rect x="26" y="37" width="8" height="14" rx="3" fill="#3d7fb0"/><rect x="66" y="37" width="8" height="14" rx="3" fill="#3d7fb0"/>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#dcebe2"/>${back}<path d="M16 100 Q18 69 50 67 Q82 69 84 100Z" fill="${out}"/><rect x="45" y="56" width="10" height="12" fill="${L.skin}"/><circle cx="50" cy="42" r="18" fill="${L.skin}"/>${hair}<circle cx="43" cy="44" r="2.2" fill="#1b1b1b"/><circle cx="57" cy="44" r="2.2" fill="#1b1b1b"/><path d="M44 51 Q50 56 56 51" stroke="#7a3b2e" stroke-width="2" fill="none" stroke-linecap="round"/>${acc}</svg>`;
}
const PIECE='M12 12 H40 C38 2 62 2 60 12 H88 V40 C98 38 98 62 88 60 V88 H60 C62 78 38 78 40 88 H12 V60 C22 62 22 38 12 40 Z';
const pieceSvg=(fill,stroke)=>`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${PIECE}" data-css="fill:${fill};stroke:${stroke||'none'};stroke-width:3"/></svg>`;

function speaker(who,mood){
  if(who===M) return {name:t('mentor.name'),svg:mentorSvg(mood),m:1};
  if(who==='hero') return {name:heroName(),svg:avatar(S.hero)};
  return {name:who.name,svg:avatar(who.av)};
}
function sayHTML(who,text,mood){
  const sp=speaker(who,mood);
  return `<div class="say ${sp.m?'m':''}${who==='hero'?' me':''}"><div class="av">${sp.svg}</div><div class="bubble"><span class="who">${esc(sp.name)}</span><div class="txt">${text}</div></div></div>`;
}

function setMood(mood){const a=stage.querySelector('.say.m .av');if(a)a.innerHTML=mentorSvg(mood)}

/* ---------- тема мира: фон и акцентный цвет ---------- */
function themeKey(){
  const s=S.screen;
  if(s==='prologue')return 'library';
  if(s==='world'||s==='done')return WORLD_THEME[S.w]||'base';
  if(s==='map')return 'map';
  if(s==='final')return 'sukkah';
  if(s==='shabbat'||s==='pasuk'||s==='hayom'||s==='gallery'||s==='admin'||s==='lot')return 'library';
  return 'base';
}
function applyTheme(){
  const k=themeKey(),b=document.body;artPreload();if(b.dataset.theme===k&&b.dataset.art===artAge())return;
  const t=THEMES[k]||THEMES.base;b.dataset.theme=k;b.dataset.art=artAge();b.style.setProperty('--accent',t.accent);b.style.setProperty('--bg',t.bg);
  const sc=$('#scenery');if(sc)sc.innerHTML=sceneSvg(k);
}

/* ---------- sound (off by default) ---------- */
/* Браузеры (Chrome, Safari, Firefox) не дают странице играть звук до жеста пользователя
   и не показывают для этого запрос в адресной строке. Поэтому проверяем сами:
   «будим» AudioContext на первом касании и, если браузер всё равно держит его на паузе,
   показываем внутри страницы плашку с кнопкой «Включить звук» (нажатие = разрешение). */
let actx=null;
function getCtx(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)()}catch(e){actx=null}return actx}
async function unlockAudio(){
  const c=getCtx();if(!c)return 'unsupported';
  try{if(c.state!=='running')await Promise.race([c.resume(),new Promise(r=>setTimeout(r,800))])}catch(e){}
  try{const b=c.createBuffer(1,1,22050),src=c.createBufferSource();src.buffer=b;src.connect(c.destination);src.start(0)}catch(e){}
  return c.state==='running'?'ok':'blocked';
}
function soundBar(show){
  let bar=$('#soundbar');
  if(!show){if(bar)bar.remove();return}
  if(bar)return;
  bar=document.createElement('div');bar.id='soundbar';bar.className='soundbar';bar.setAttribute('role','alert');
  bar.innerHTML=`<span class="ic">${icon('mute')}</span><div><b>${esc(t('sound.blocked'))}</b><small>${esc(t('sound.blockedSub'))}</small></div>
    <button class="btn" id="sndon">${esc(t('sound.enable'))}</button><button class="iconbtn" id="sndoff" aria-label="${esc(t('btn.close'))}">✕</button>`;
  document.body.appendChild(bar);
  bar.querySelector('#sndon').onclick=async()=>{
    S.sound=true;save();
    const r=await unlockAudio();
    if(r==='ok'){soundBar(false);sfx.good()}
    else toast('mute',t('toast.soundBlocked'),t('sound.settings'));
  };
  bar.querySelector('#sndoff').onclick=()=>soundBar(false);
}
async function checkSound(){
  if(!S.sound)return;
  const r=await unlockAudio();
  if(r==='unsupported'){toast('mute',t('toast.soundFail'),t('toast.soundFailSub'));return}
  soundBar(r!=='ok');
}
/* первое касание / клавиша на странице — пробуем разрешить звук */
['pointerdown','keydown','touchend'].forEach(ev=>document.addEventListener(ev,()=>{if(S.sound&&(!actx||actx.state!=='running'))checkSound()},{capture:true,passive:true}));
function tone(f,d,type,vol){if(!S.sound)return;try{const c=getCtx();if(!c)return;
  const play=()=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.05,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+d+.05)};
  if(c.state==='running')play();else c.resume().then(()=>{if(c.state==='running')play()}).catch(()=>{})}catch(e){}}
const sfx={tap:()=>tone(520,.09),good:()=>{tone(660,.16);setTimeout(()=>tone(880,.22),110)},soft:()=>tone(330,.18,'triangle',.04),ach:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.28),i*120))};
function haptic(kind='tap'){
  if(!navigator.vibrate)return;
  try{navigator.vibrate(kind==='choice'?[18,24,34]:kind==='good'?22:10)}catch(e){}
}

/* ---------- progress ---------- */
const lvl=()=>Math.min(LEVELS.length,Math.floor(S.sparks/130)+1);
function addSparks(n,el){
  /* шаг, на который вернулись стрелкой «назад» (или мир переигрывают), искр не даёт повторно */
  if((S.screen==='world'||S.screen==='prologue')&&idx()<farSeen())return;
  const before=lvl();S.sparks+=n;
  if(el){const r=el.getBoundingClientRect();const p=document.createElement('div');p.className='plus';p.textContent='+'+n;p.style.left=(r.left+r.width/2-14)+'px';p.style.top=(r.top-6)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),1200)}
  if(lvl()>before){toast('up',t('toast.level',{name:T(LEVELS[lvl()-1])}),t('toast.levelN',{n:lvl()}));sfx.ach()}
  hud();save();
}
function unlock(id){
  if(S.ach[id])return;S.ach[id]=1;const a=ACHS[id];toast(a[0],t('toast.ach',{name:T(a[1])}),T(a[2]));sfx.ach();save();hud();
}
function toast(ic,title,sub){
  const t=document.createElement('div');t.className='toast';t.innerHTML=`<span class="ic">${icon(ic)}</span><div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;
  $('#toasts').appendChild(t);setTimeout(()=>t.remove(),4100);
}
function hud(){
  const h=$('#hud');
  const show=!['title','create','welcome','shabbat','pasuk','hayom','gallery','admin','lot'].includes(S.screen);
  h.hidden=!show;if(!show)return;
  const pieces=S.done.filter(Boolean).length;
  h.innerHTML=`<button class="hero-chip" id="herobtn" aria-haspopup="dialog" title="${t('hud.profile')}"><span class="hero-av">${avatar(S.hero)}</span><b>${esc(heroName())}</b><span class="sr-only">${t('hud.profile')}</span></button>
  <span class="pill" title="${t('hud.sparksTitle')}">${icon('sparkle')}<b>${S.sparks}</b><span class="sr-only">${t('hud.sparks')}</span></span>
  <span class="pill" title="${t('hud.piecesTitle')}">${icon('puzzle')}<b>${pieces}/7</b><span class="sr-only">${t('hud.pieces')}</span></span><span class="grow"></span>
  <button class="iconbtn" id="menubtn" aria-haspopup="dialog">${icon('menu')}<span>${t('hud.menu')}</span></button>`;
  $('#herobtn').onclick=showProfile;
  $('#menubtn').onclick=showMenu;
}
/* Bottom sheet with a title and ✕; closes on ✕, Escape or a tap outside and returns focus */
function openSheet(cls,title,body,wire){
  const m=document.createElement('div');m.className='modal';
  const back=document.activeElement;const close=()=>{m.remove();if(back&&back.isConnected)back.focus()};
  let drawn=false;
  const draw=()=>{
    const a=document.activeElement,keep=a&&m.contains(a)&&['m','audio','track','lang'].map(k=>a.dataset[k]!==undefined&&`[data-${k}="${a.dataset[k]}"]`).find(Boolean);
    m.innerHTML=`<div class="sheet ${cls}${drawn?' still':''}" role="dialog" aria-modal="true" aria-labelledby="sheet-h">
    <div class="sheet-head"><h2 class="sheet-h" id="sheet-h">${typeof title==='function'?title():title}</h2><button class="iconbtn qx" id="closeM" aria-label="${esc(t('btn.close'))}">✕</button></div>
    ${body()}</div>`;
    m.querySelector('#closeM').onclick=close;
    if(wire)wire(m,draw,close);
    const f=keep&&m.querySelector(keep);if(f)f.focus();
    drawn=true;
  };
  document.body.appendChild(m);draw();m.querySelector('#closeM').focus();
  m.onclick=e=>{if(e.target===m)close()};
  m.onkeydown=e=>{if(e.key==='Escape')close()};
}
/* Hero chip → the hero's own progress: level, sparks, pieces and achievements */
function showProfile(){
  const L=lvl(),into=L>=LEVELS.length?100:(S.sparks%130)/130*100;
  openSheet('profile',t('profile.title'),()=>`
    <div class="prof-top"><div class="prof-av">${avatar(S.hero)}</div><div class="prof-name"><b>${esc(heroName())}</b><span>${t('menu.level',{n:L})} · ${T(LEVELS[L-1])}</span></div></div>
    <div class="menu-lvl"><div class="bar"><i data-css="width:${into}%"></i></div><small>${t('menu.stats',{sparks:S.sparks,pieces:S.done.filter(Boolean).length})}</small></div>
    <div class="menu-sec"><span class="kicker">${t('ach.count',{n:Object.keys(S.ach).length})}</span>${achGrid()}</div>
    <p class="muted fs-sm">${t('ach.note')}</p>`);
}
/* Main menu: navigation first, then sound and language, then info and support */
function showMenu(){
  let mine=false;   // «Твоя часть в Торе» раскрывается и показывает стих Торы и «Айом-йом»
  const sfxRow=()=>`<button class="swrow" role="switch" data-m="snd" aria-checked="${S.sound}">${icon(S.sound?'sound':'mute')}<span>${t('menu.sfx')}</span><i class="switch" aria-hidden="true"></i></button>`;
  openSheet('menu',()=>t('hud.menu'),()=>`
    <nav class="menu-list" aria-label="${t('hud.menu')}">
      ${S.screen!=='map'?`<button class="mitem" data-m="map">${icon('map')}<span>${t('menu.map')}</span></button>`:''}
      <button class="mitem" data-m="home">${icon('home')}<span>${t('menu.home')}</span></button>
      <button class="mitem mgroup" data-m="mine" aria-expanded="${mine}" aria-controls="msub-mine">${icon('scroll')}<span>${t('menu.mine')}</span>${lotSeals()}<i class="mchev ${mine?'open':''}" aria-hidden="true">${icon('up')}</i></button>
      <div class="msub" id="msub-mine" ${mine?'':'hidden'}>
        <button class="mitem" data-m="lot">${icon('book')}<span>${t('menu.mineLot')}</span></button>
        <button class="mitem" data-m="pasuk">${icon('scroll')}<span>${t('menu.mineVerse')}</span></button>
        <button class="mitem" data-m="hayom">${icon('candles')}<span>${t('menu.mineHayom')}</span></button>
        <button class="mitem" data-m="parsha">${icon('book')}<span>${t('menu.mineParsha')}</span></button>
        ${adult()?`<button class="mitem" data-m="gallery">${icon('palette')}<span>${t('menu.mineArt')}</span></button>`:''}
      </div>
      <span class="menu-cap">${t('title.family')}</span>
      <button class="mitem" data-m="shab">${icon('candles')}<span>${t('shab.open')}</span></button>
      <button class="mitem" data-m="lesson">${icon('chat')}<span>${t('lesson.title')}</span></button>
      ${isAdmin()?`<button class="mitem" data-m="admin">${icon('key')}<span>${t('adm.menu')}</span></button>`:''}
    </nav>
    ${audioPanelHTML(false,{title:t('menu.soundH'),pre:sfxRow()})}
    ${langPicker('menu')}
    <div class="menu-foot">
      <button class="qlink" data-m="about">${icon('info')}<span>${t('about.title')}</span></button>
      <a class="qlink donate-link" href="${DONATE_URL}" target="_blank" rel="noopener">${icon('heart')}<span>${t('donate.label')}</span></a>
    </div>`,
  (m,draw,close)=>{
    wireLangPicker(m,()=>{langDdOpen=false;draw();hud();render()});
    wireAudioPanel(m,draw);
    m.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const k=b.dataset.m;
      if(k==='snd'){S.sound=!S.sound;save();if(S.sound)checkSound().then(()=>sfx.good());else soundBar(false);draw();return}
      if(k==='mine'){mine=!mine;sfx.tap();draw();return}
      if(k==='langs'){langDdOpen=!langDdOpen;sfx.tap();draw();return}
      m.remove();if(k==='map')go('map');if(k==='home')go('title');if(k==='about')showAbout();if(k==='lesson')showLesson();if(k==='shab')openShabbat();if(k==='pasuk')openPasuk();if(k==='hayom')openHayom();if(k==='gallery')openGallery();if(k==='admin')openAdmin();if(k==='lot')openLot();if(k==='parsha')openLot()});
  });
}
function achGrid(){return `<div class="achs">${Object.entries(ACHS).map(([k,a])=>`<div class="ach ${S.ach[k]?'':'lock'}"><span class="ic">${icon(S.ach[k]?a[0]:'lock')}</span><b>${esc(T(a[1]))}</b><small>${esc(T(a[2]))}</small></div>`).join('')}</div>`}
/* ---------- выбор языка ---------- */
let langDdOpen=false;
function langPicker(where){
  const codes=Object.keys(LANGS);if(codes.length<2)return '';
  /* в главном меню — подменю, как «Твоя часть в Торе»: пункт «Язык · текущий», под ним — все языки */
  if(where==='menu')return `<nav class="menu-list" aria-label="${t('lang.label')}"><button class="mitem mgroup" data-m="langs" aria-expanded="${langDdOpen}" aria-controls="msub-lang">${icon('globe')}<span>${t('lang.label')} · <span lang="${LANG}">${LANGS[LANG].name}</span></span><i class="mchev ${langDdOpen?'open':''}" aria-hidden="true">${icon('up')}</i></button>
    <div class="msub" id="msub-lang" ${langDdOpen?'':'hidden'}>${codes.map(c=>`<button class="mitem ${c===LANG?'on':''}" data-lang="${c}" lang="${c}" aria-current="${c===LANG}">${icon(c===LANG?'check':'globe')}<span>${LANGS[c].name}</span></button>`).join('')}
    ${S.started?`<small class="muted">${t('lang.note')}</small>`:''}</div></nav>`;
  return `<div class="langpick ${where||''}" role="group" aria-label="${t('lang.label')}"><span class="kicker">${t('lang.label')}</span><div class="seg">${codes.map(c=>`<button class="segb ${c===LANG?'on':''}" data-lang="${c}" lang="${c}" aria-pressed="${c===LANG}">${LANGS[c].name}</button>`).join('')}</div>${where==='title'||!S.started?'':`<small class="muted">${t('lang.note')}</small>`}</div>`;
}
function wireLangPicker(root,after){
  root.querySelectorAll('[data-lang]').forEach(b=>b.onclick=async()=>{
    if(b.dataset.lang===LANG)return;
    root.querySelectorAll('[data-lang]').forEach(x=>x.disabled=true);
    try{await setLang(b.dataset.lang);sfx.tap()}catch(e){toast('mute',LOAD_ERROR[b.dataset.lang]?.[0]||'Error','')}
    after();
  });
}

/* ---------- О приложении ---------- */
const PROJECT_URL='https://mychitas.app';
const APP_URL='https://mylot.mychitas.app';
const COPYRIGHT='©mychitas.app 5787';
const DONATE_URL='https://mychitas.app/donate';
function donateBtn(){
  let a=document.getElementById('donate');
  if(!a){a=document.createElement('a');a.id='donate';a.className='donate';a.target='_blank';a.rel='noopener';a.href=DONATE_URL;document.body.appendChild(a)}
  a.innerHTML=icon('heart');a.title=t('donate.label');a.setAttribute('aria-label',t('donate.label'));
  /* во время мини-игр сердечко прячется: оно закрывает угол игрового поля (монеты, детали пазла) */
  const st=(S.screen==='world'||S.screen==='prologue')&&steps()[idx()];
  a.hidden=S.screen==='title'||!!(st&&st.type==='mini');
}
function showAbout(){
  const link=`<a href="${PROJECT_URL}" target="_blank" rel="noopener">mychitas.app</a>`;
  const sec=(h,txt)=>`<section class="about-sec"><h3>${t(h)}</h3><p>${t(txt)}</p></section>`;
  infoModal('about',`<div class="about-head"><div class="about-m">${mentorSvg('smile')}</div><div><span class="kicker">${t('about.title')}</span>
    <h2 class="h2" id="about-h">${t('title.h1a')} ${t('title.h1b')}</h2><p class="about-made">${t('about.made',{link})}</p></div></div>
    <p>${t('about.text')}</p>
    ${sec('about.lessonH','about.lesson')}${sec('about.musicH','about.music')}${sec('about.codeH','about.code')}${sec('about.privacyH','about.privacy')}
    <p class="muted fs-sm"><button class="linkbtn" id="admabout">${icon('key')} ${t(isAdmin()?'adm.menu':'adm.open')}</button></p>`);
  const ad=$('#admabout');if(ad)ad.onclick=()=>{const m=ad.closest('.modal');if(m)m.remove();adminEntry()};
}
/* ---------- Провести урок онлайн: предложение автора проекта ---------- */
const LESSON_EMAIL='office@mychitas.app';
function showLesson(){
  const mail=`<a href="mailto:${LESSON_EMAIL}">${LESSON_EMAIL}</a>`;
  const sec=(h,txt,v)=>`<section class="about-sec"><h3>${t(h)}</h3><p>${t(txt,v)}</p></section>`;
  infoModal('lesson',`<div class="about-head"><div class="about-m">${mentorSvg('warm')}</div><div><span class="kicker">${t('lesson.title')}</span>
    <h2 class="h2" id="lesson-h">${t('lesson.h')}</h2></div></div>
    <p>${t('lesson.text')}</p>
    ${sec('lesson.formatH','lesson.format')}${sec('lesson.whoH','lesson.who')}${sec('lesson.contactH','lesson.contact',{mail})}`);
}
/* окно поверх игры (О приложении, урок онлайн): ✕ внизу, Escape, нажатие мимо */
function infoModal(cls,html){
  const m=document.createElement('div');m.className='modal';
  m.innerHTML=`<div class="sheet about ${cls}" role="dialog" aria-modal="true" aria-labelledby="${cls}-h">${html}
    <button class="btn ghost" id="closeA">${t('btn.close')}</button></div>`;
  const back=document.activeElement;const close=()=>{m.remove();if(back&&back.isConnected)back.focus()};
  document.body.appendChild(m);
  m.onclick=e=>{if(e.target===m)close()};m.onkeydown=e=>{if(e.key==='Escape')close()};
  const c=m.querySelector('#closeA');c.onclick=close;c.focus({preventScroll:true});m.querySelector('.sheet').scrollTop=0;
}

/* ================================================================
   SCREENS
   ================================================================ */
function go(screen,skipPrologue){
  if(skipPrologue){S.ps=PRO().length}
  S.screen=screen;save();render();window.scrollTo({top:0,behavior:'smooth'});
}
function render(){
  stopReading();stopCamera();applyTheme();hud();donateBtn();
  Voice.cancel();
  ({title:renderTitle,create:renderCreate,welcome:renderWelcome,prologue:renderStep,world:renderStep,map:renderMap,done:renderDone,final:renderFinal,shabbat:renderShabbat,pasuk:renderPasuk,hayom:renderHayom,gallery:renderGallery,admin:renderAdmin,lot:renderLot}[S.screen]||renderTitle)();
  backBar();armBack();
  if(S.screen==='title'&&Audio_.greeted)Audio_.greeted=false;else guideScreen();
}

/* ---------- шаг назад: кнопка внизу каждого экрана и системная кнопка «назад» телефона ---------- */
/* куда ведёт «назад» с текущего экрана; null — некуда (титульный экран) */
function backTarget(){
  const s=S.screen;
  if(s==='world')return S.s>0?()=>{S.s=idx()-1}:'map';
  if(s==='prologue')return S.ps>0?()=>{S.ps=idx()-1}:(S.mapSeen?'map':'welcome');
  if(s==='done')return ()=>{S.screen='world';S.s=steps().length-1};
  if(s==='final')return 'map';
  if(s==='map'||s==='create')return 'title';
  if(s==='welcome')return 'create';
  if(s==='shabbat')return S.shabFrom&&S.shabFrom!=='shabbat'?S.shabFrom:'title';
  if(s==='pasuk')return S.pasukFrom&&S.pasukFrom!=='pasuk'?S.pasukFrom:'title';
  if(s==='hayom')return S.hayomFrom&&S.hayomFrom!=='hayom'?S.hayomFrom:'title';
  if(s==='gallery')return S.galFrom&&S.galFrom!=='gallery'?S.galFrom:'title';
  if(s==='admin')return S.admFrom&&S.admFrom!=='admin'?S.admFrom:'title';
  if(s==='lot')return S.lotStep&&(S.lotDone||{})[S.lotStep]?()=>{S.lotStep=null}:lotBack();
  return null;
}
function goBack(){
  const to=backTarget();if(!to)return false;
  sfx.tap();
  if(typeof to==='string'){go(to);return true}
  to();save();render();window.scrollTo({top:0,behavior:'smooth'});return true;
}
function backBar(){
  const bar=$('#backbar');if(!bar)return;
  bar.hidden=!backTarget();
  bar.innerHTML=bar.hidden?'':`<button class="btn ghost small" id="stepback">${icon('up')}<span>${t('btn.back')}</span></button>`;
  const b=$('#stepback');if(b)b.onclick=goBack;
}
/* системная «назад»: держим в истории одну лишнюю запись; нажатие снимает её — закрываем окно или делаем шаг назад
   и ставим запись снова. На титульном экране спрашиваем «Выйти из игры?»: «Остаться» ставит запись снова,
   «Выйти» (или ещё одно «назад») уходит из игры. */
function armBack(){
  if(!(history.state&&history.state.koelet))try{history.pushState({koelet:1},'')}catch(e){}
}
function askExit(){
  const m=document.createElement('div');m.className='modal';m.id='exitq';
  m.innerHTML=`<div class="sheet about exitq" role="alertdialog" aria-modal="true" aria-labelledby="exitq-h" aria-describedby="exitq-p">
    <h2 class="h2" id="exitq-h">${t('menu.exitQ')}</h2><p class="muted" id="exitq-p">${t('menu.exitSub')}</p>
    <div class="actions"><button class="btn" id="exstay">${t('menu.exitStay')}</button><button class="btn ghost" id="exleave">${t('menu.exitLeave')}</button></div></div>`;
  document.body.appendChild(m);
  const stay=()=>{m.remove();armBack()};
  m.onclick=e=>{if(e.target===m)stay()};m.onkeydown=e=>{if(e.key==='Escape')stay()};
  $('#exstay').onclick=()=>{sfx.tap();stay()};
  /* запись-страж уже снята: ещё один шаг назад уходит со страницы; если уходить некуда (открыто как приложение) — закрываем окно */
  $('#exleave').onclick=()=>{m.remove();Voice.cancel();Music.stop();history.back();setTimeout(()=>{try{window.close()}catch(e){}},300)};
  $('#exstay').focus();
}
window.addEventListener('popstate',()=>{
  const m=document.querySelector('.modal'),q=$('#qmenu');
  if(m||q){if(m)m.remove();if(q)q.remove();armBack();return}
  if(goBack())return;
  if(S.screen==='title'){askExit();return}
  armBack();
});
/* запись-страж ставим после первого касания: без него браузер её пропускает */
['pointerdown','keydown'].forEach(e=>document.addEventListener(e,armBack,{once:true,capture:true}));

function renderTitle(){
  const cols=['#cfe3d6','#f3d9a0','#bcd6ea','#9fd0ae','#f2b8c2','#f2be3d','#d9cdea'];
  let wall='';for(let i=0;i<15;i++){wall+= i===7?`<div class="pw-hole">${pieceSvg('none')}</div>`:pieceSvg(cols[(i*3)%cols.length])}
  const pieces=S.done.filter(Boolean).length,adm=isAdmin()||/[?&]admin\b/.test(location.search);
  stage.innerHTML=`<section class="title-screen scene">
    <div class="title-bar"><span class="kicker">${t('title.kicker')}</span>${quickBtnHTML()}</div>
    <h1 class="h1">${t('title.h1a')}<br><span>${t('title.h1b')}</span></h1>
    <p class="lead">${t('title.both')}</p>
    <div class="doors">
      <article class="door door-q" aria-labelledby="door-q-h">
        <div class="puzzlewall" aria-hidden="true">${wall}</div>
        <span class="kicker">${icon('puzzle')} ${t('door.qK')}</span>
        <h2 class="h2" id="door-q-h">${t('door.qH')}</h2>
        <p>${t('door.q')}</p>
        ${S.sparks>0?`<p class="door-meta">${icon('puzzle')}<span>${t('door.qProgress',{n:pieces})}</span></p>`:''}
        <div class="actions" id="ta">
          ${S.sparks>0?`<button class="btn" id="cont">${t('btn.continue')}</button><button class="btn ghost" id="newg">${t('btn.restart')}</button>`:`<button class="btn" id="start">${t('btn.start')}</button>`}
        </div>
        <div id="conf"></div>
      </article>
      <article class="door door-l" aria-labelledby="door-l-h">
        <p class="door-quote heb" lang="he" dir="rtl">וְתֵן חֶלְקֵנוּ בְּתוֹרָתֶךָ</p>
        <span class="kicker">${icon('scroll')} ${t('door.lK')}</span>
        <h2 class="h2" id="door-l-h">${t('door.lH')}</h2>
        <p>${t('door.l')}</p>
        <p class="door-meta">${lotSeals()}<span>${t('door.lProgress',{n:lotCount()})}</span></p>
        <div class="actions"><button class="btn" id="lotbtn">${t(lotCount()?'door.lCont':'door.lGo')}</button></div>
      </article>
    </div>
    <div class="family"><span class="kicker">${t('title.family')}</span>
      <div class="family-l"><button class="linkbtn shablink" id="shabbtn">${icon('candles')} ${t('shab.open')}</button>
      <button class="linkbtn shablink" id="lessonbtn">${icon('chat')} ${t('lesson.title')}</button></div></div>
    <p class="foot">${t('title.foot')} <button class="linkbtn" id="aboutbtn">${icon('info')} ${t('about.title')}</button></p>
    ${adm?`<p class="foot"><button class="linkbtn" id="admbtn">${icon('key')} ${t(isAdmin()?'adm.menu':'adm.open')}</button></p>`:''}
    <p class="copy"><a href="${PROJECT_URL}" target="_blank" rel="noopener">©mychitas.app</a> 5787</p>
  </section>`;
  $('#setbtn').onclick=()=>quickMenu();
  $('#aboutbtn').onclick=showAbout;
  const ab=$('#admbtn');if(ab)ab.onclick=adminEntry;
  $('#shabbtn').onclick=()=>{sfx.tap();openShabbat()};
  $('#lessonbtn').onclick=()=>{sfx.tap();showLesson()};
  $('#lotbtn').onclick=()=>{sfx.tap();openLot()};
  const st=$('#start');if(st)st.onclick=()=>{sfx.tap();go('create')};
  const c=$('#cont');if(c)c.onclick=()=>{sfx.tap();const saved=S._last||'map';go(saved)};
  const n=$('#newg');if(n)n.onclick=()=>{
    $('#conf').innerHTML=`<div class="confirm"><p>${t('confirm.reset')}</p><div class="actions"><button class="btn small" id="yes">${t('btn.yesReset')}</button><button class="btn ghost small" id="no">${t('btn.cancel')}</button></div></div>`;
    $('#yes').onclick=()=>{const snd=S.sound;S=fresh();S.sound=snd;save();go('create')};
    $('#no').onclick=()=>{$('#conf').innerHTML=''};
  };
}
/* ---------- быстрые настройки на титульном экране: язык, музыка, голос ---------- */
function quickBtnHTML(){
  const P=Audio_.prefs,on=P.music||P.voice;
  return `<button class="qbtn" id="setbtn" aria-haspopup="dialog" aria-expanded="false" aria-label="${t('settings.title')}">${icon('globe')}<b>${LANG.toUpperCase()}</b><i class="qsep" aria-hidden="true"></i>${icon(on?'note':'mute')}</button>`;
}
function refreshQuickBtn(){
  const b=$('#setbtn');if(!b)return;const P=Audio_.prefs;
  b.querySelector('.ico:last-child').outerHTML=icon(P.music||P.voice?'note':'mute');
}
function quickMenu(){
  const btn=$('#setbtn');if(!btn||$('#qmenu'))return;
  const m=document.createElement('div');m.className='qmenu';m.id='qmenu';
  m.setAttribute('role','dialog');m.setAttribute('aria-label',t('settings.title'));
  const draw=()=>{
    m.innerHTML=`<div class="qhead"><span class="kicker">${t('settings.title')}</span><button class="iconbtn qx" id="qclose" aria-label="${esc(t('btn.close'))}">✕</button></div>
      ${langPicker('title')}
      ${audioPanelHTML(true)}
      <button class="qlink" id="qabout">${icon('info')}<span>${t('about.title')}</span></button>
      <button class="qlink" id="qlesson">${icon('chat')}<span>${t('lesson.title')}</span></button>`;
    wireLangPicker(m,()=>{close(false);renderTitle();quickMenu()});
    m.querySelectorAll('[data-audio]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.audio;setTimeout(()=>{const f=m.querySelector(`[data-audio="${k}"]`);if(f)f.focus()})}));
    wireAudioPanel(m,()=>{draw();refreshQuickBtn()});
    m.querySelector('#qclose').onclick=()=>close(true);
    m.querySelector('#qabout').onclick=()=>{close(false);showAbout()};
    m.querySelector('#qlesson').onclick=()=>{close(false);showLesson()};
  };
  const outside=e=>{if(!m.contains(e.target)&&!e.target.closest('#setbtn'))close(false)};
  const close=focus=>{m.remove();document.removeEventListener('pointerdown',outside,true);const b=$('#setbtn');if(b){b.setAttribute('aria-expanded','false');if(focus)b.focus()}};
  btn.setAttribute('aria-expanded','true');
  btn.onclick=()=>close(true);
  btn.closest('.title-bar').appendChild(m);draw();
  m.onkeydown=e=>{if(e.key==='Escape')close(true)};
  document.addEventListener('pointerdown',outside,true);
  (m.querySelector('.segb.on')||m.querySelector('button')).focus();
  sfx.tap();
}

/* «Готово» без возраста или обращения: поля с пропуском подсвечиваются красным */
let createTried=false;
function renderCreate(){
  const h=S.hero;
  const seg=(attr,val,label,sub,ic)=>`<button class="segb big ${h[attr]===val?'on':''}" data-${attr}="${val}" aria-pressed="${h[attr]===val}">${icon(h[attr]===val?'check':ic)}<span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span></button>`;
  const ok=!!(h.age&&h.g);
  const req=(id,n,title,miss,msg,body,cls)=>{const bad=createTried&&miss;
    return `<div class="req ${bad?'bad':''} ${miss?'':'ok'}" id="${id}"><h3 class="req-h" id="${id}-l"><span class="num" aria-hidden="true">${miss?n:icon('check')}</span>${title}</h3>
      <div class="seg${cls?' '+cls:''}" role="group" aria-labelledby="${id}-l"${bad?` aria-describedby="${id}-e" aria-invalid="true"`:''}>${body}</div>
      ${bad?`<p class="req-err" id="${id}-e" role="alert">${icon('info')}<span>${msg}</span></p>`:''}</div>`};
  stage.innerHTML=`<section class="scene create">
    <span class="kicker">${t('create.kicker')}</span>
    <h2 class="h2">${t('create.title')}</h2>
    <div class="create-top"><div class="preview" id="pv">${avatar(h)}</div>
      <div class="field"><label for="hname">${t('create.name')}</label><input id="hname" maxlength="16" autocomplete="off" placeholder="${esc(t('hero.default'))}" value="${esc(h.name)}"></div></div>
    ${req('f-age',1,t('create.age'),!h.age,t('create.needAge'),seg('age','y',t('create.ageY'),t('create.ageYs'),'book')+seg('age','t',t('create.ageT'),t('create.ageTs'),'compass')+seg('age','a',t('create.ageA'),t('create.ageAs'),'scroll'),'three')}
    ${h.age?`<p class="agenote">${t({y:'create.noteY',t:'create.noteT',a:'create.noteA'}[h.age])}</p>`:''}
    ${req('f-g',2,t('create.address'),!h.g,t('create.needG'),seg('g','m',t('create.m'),t('create.mSub'),'smile')+seg('g','f',t('create.f'),t('create.fSub'),'smile'))}
    <div class="group"><h3>${t('create.role')}</h3><div class="archs">${ARCHS.map((a,i)=>`<button class="arch ${h.arch===i?'on':''}" data-arch="${i}">${avatar({look:h.look,outfit:h.outfit,arch:i,g:h.g})}<span>${esc(T(a.name))}</span></button>`).join('')}</div></div>
    <div class="group"><h3>${t('create.looks')}</h3><div class="swatches">${LOOKS.map((l,i)=>`<button class="sw ${h.look===i?'on':''}" data-look="${i}" aria-label="${t('create.lookN',{n:i+1})}"><span data-css="background:linear-gradient(135deg,${l.hair} 50%,${l.skin} 50%)"></span></button>`).join('')}</div></div>
    <div class="group"><h3>${t('create.outfit')}</h3><div class="swatches">${OUTFITS.map((o,i)=>`<button class="sw ${h.outfit===i?'on':''}" data-outfit="${i}" aria-label="${t('create.outfitN',{n:i+1})}"><span data-css="background:${o}"></span></button>`).join('')}</div></div>
    <div class="actions"><button class="btn ${ok?'':'wait'}" id="ready">${t('create.ready')}</button>${ok?'':`<span class="need ${createTried?'bad':''}">${icon('info')}${t(!h.age&&!h.g?'create.need':!h.age?'create.needAge':'create.needG')}</span>`}</div>
  </section>`;
  const keep=()=>{const y=window.scrollY;renderCreate();window.scrollTo(0,y)};
  $('#hname').oninput=e=>{h.name=e.target.value;save()};
  stage.querySelectorAll('[data-age]').forEach(b=>b.onclick=()=>{h.age=b.dataset.age;sfx.tap();save();keep()});
  stage.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{h.g=b.dataset.g;sfx.tap();save();keep()});
  stage.querySelectorAll('[data-arch]').forEach(b=>b.onclick=()=>{h.arch=+b.dataset.arch;sfx.tap();save();keep()});
  stage.querySelectorAll('[data-look]').forEach(b=>b.onclick=()=>{h.look=+b.dataset.look;sfx.tap();save();keep()});
  stage.querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>{h.outfit=+b.dataset.outfit;sfx.tap();save();keep()});
  $('#ready').onclick=()=>{
    if(!(h.age&&h.g)){
      createTried=true;sfx.soft();haptic('choice');renderCreate();
      const f=$('#f-age.bad')||$('#f-g.bad');
      if(f){f.scrollIntoView({behavior:'smooth',block:'center'});f.querySelector('.segb').focus({preventScroll:true})}
      if(Audio_.prefs.voice&&Audio_.unlocked)Voice.say(!h.age?t('create.needAge'):t('create.needG'));
      return;
    }
    createTried=false;sfx.good();if(!S.started)S.started=new Date().toISOString();
    if(S.createFor==='lot'){S.createFor=null;openLot();return}   // пришли из «Моего удела в Торе» — туда и возвращаемся
    go('welcome')};
}

function renderWelcome(){
  stage.innerHTML=`<section class="scene">
    ${sayHTML(M,t('welcome.text',{name:esc(heroName())}),'open')}
    ${sayHTML('hero',esc(t('welcome.me')))}
    <div class="actions"><button class="btn" id="go">${t('welcome.go')}</button><button class="btn ghost" id="back">${t('welcome.back')}</button></div>
  </section>`;
  $('#go').onclick=()=>{sfx.good();S.ps=0;go('prologue')};
  $('#back').onclick=()=>go('create');
}

/* ---------- step engine ---------- */
function steps(){return S.screen==='prologue'?PRO():byAge(WORLDS[S.w].steps)}
function idx(){const n=steps().length-1;return Math.min(S.screen==='prologue'?S.ps:S.s,n)}
function next(){
  if(S.screen==='prologue'){S.ps=idx()+1;if(S.ps>=PRO().length){return go('map')}}
  else{S.s=idx()+1;if(S.s>=steps().length)return completeWorld()}
  save();render();window.scrollTo({top:0,behavior:'smooth'});
}
/* Дальний шаг, до которого игрок дошёл в прологе/мире: стрелки «назад/вперёд» ходят только до него.
   Пройденный мир открыт целиком. */
const farKey=()=>S.screen==='prologue'?'p':'w'+S.w;
const farSeen=()=>(S.far||{})[farKey()]??-1;
function farIdx(){return S.screen==='world'&&S.done[S.w]?steps().length-1:Math.max(farSeen(),idx())}
function stepNav(){
  const i=idx(),f=farIdx();
  return `<nav class="stepnav" aria-label="${t('head.step',{i:i+1,n:steps().length})}">
    <button class="iconbtn navbtn" data-nav="-1" ${i>0?'':'disabled'} aria-label="${t('hud.back')}" title="${t('hud.back')}">${icon('prev')}</button>
    <button class="iconbtn navbtn" data-nav="1" ${i<f?'':'disabled'} aria-label="${t('hud.fwd')}" title="${t('hud.fwd')}">${icon('next')}</button></nav>`;
}
function stepTo(d){
  const i=Math.max(0,Math.min(idx()+d,farIdx()));if(i===idx())return;
  if(S.screen==='prologue')S.ps=i;else S.s=i;
  sfx.tap();save();render();window.scrollTo({top:0,behavior:'smooth'});
}
stage.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(b&&!b.disabled)stepTo(+b.dataset.nav)});
function head(){
  const st=steps(),i=idx();
  const label=S.screen==='prologue'?t('head.prologue'):t('head.world',{n:S.w+1,name:WORLDS[S.w].name});
  const rd=young()&&canSpeak()?`<button class="iconbtn readbtn" data-read aria-label="${t('read.label')}">${icon('sound')}<span>${t('read.listen')}</span></button>`:'';
  return `${stepNav()}<div class="scene-head banner"><div class="bn-art" aria-hidden="true">${sceneSvg(themeKey(),'xMidYMid')}</div><span class="kicker bn-k">${label}</span><div class="bn-row"><div class="dots" role="img" aria-label="${t('head.step',{i:i+1,n:st.length})}">${st.map((_,k)=>`<i class="${k<i?'done':k===i?'on':''}"></i>`).join('')}</div>${rd}</div></div>`;
}
const letter=i=>(t('letters')[i]||String(i+1));
function optHTML(o,i){return `<button class="opt" data-i="${i}"><span class="ic ${o.ic?'e':''}" aria-hidden="true">${o.ic?icon(o.ic):letter(i)}</span><span class="ot"><span>${esc(o.t)}</span>${o.s?`<small>${esc(o.s)}</small>`:''}</span></button>`}
/* выбранный вариант подсвечен, остальные приглушены, но нажимаются — ответ можно поменять */
function markPick(sel,b){stage.querySelectorAll(sel).forEach(x=>{x.classList.remove('picked','dim');x.classList.add(x===b?'picked':'dim');x.setAttribute('aria-pressed',x===b)})}
function hintBtn(h){return h?`<button class="btn ghost small" data-hint>${t('hint.btn')}</button>`:''}
function wireHint(h,container){
  const b=(container||stage).querySelector('[data-hint]');if(!b)return;
  b.onclick=()=>{if(stage.querySelector('.hint'))return;const d=document.createElement('div');d.className='hint';d.innerHTML=icon('bulb')+' '+h;b.closest('.actions').before(d);sfx.soft()};
}
function toolbox(){if(!(S.screen==='world'&&WORLDS[S.w].tools))return '';
  return `<div class="toolbox" aria-label="${t('toolbox.label')}">${Object.entries(TOOLS).map(([k,t])=>`<div class="tool ${S.tools[k]?'on':''}" title="${t[1]}" aria-label="${t[1]}">${icon(t[0])}${S.tools[k]>1?`<sup>${S.tools[k]}</sup>`:''}</div>`).join('')}</div>`}

function renderStep(){
  let st=steps()[idx()];if(typeof st==='function')st=st(S);if(st&&(st.__dynamic||(st.body&&st.body.__dynamic)))st=resolveDynamic(st);st=R(st);
  S._last=S.screen;
  S.far=S.far||{};S.far[farKey()]=Math.max(farSeen(),idx());save();
  const fn={talk:rTalk,choice:rChoice,multi:rMulti,quote:rQuote,card:rCard,reveal:rReveal,mini:rMini}[st.type];
  fn(st);
}
function resolveDynamic(st){
  if(st.__dynamic==='city-year')return {type:'talk',who:M,text:CITY[S.city||'wealth'].year};
  if(st.__dynamic==='city-evening')return {type:'choice',who:M,text:CITY[S.city||'wealth'].evening,key:'evening',neutral:true,options:tl('evening.options')};
  if(st.body&&st.body.__dynamic==='strength-map')return {type:'card',kicker:t('lab.resultKicker'),title:t('lab.resultTitle'),art:'map',body:strengthMap(S),btn:t('lab.resultBtn')};
  return st;
}
function rTalk(st){
  stage.innerHTML=`<section class="scene talk">${head()}${toolbox()}${sayHTML(st.who,esc(st.text),st.mood||'point')}<div class="actions"><button class="btn" id="nx">${t('btn.next')}</button></div></section>`;
  $('#nx').onclick=()=>{sfx.tap();next()};
}
function ownHTML(o){return `<div class="own"><label for="ownin">${esc(o.label)}</label><div class="ownrow"><input id="ownin" maxlength="60" autocomplete="off" placeholder="${esc(o.ph||'')}"><button class="btn small" id="ownok" disabled>${t('own.ok')}</button></div><small>${esc(OWN_NOTE)}</small></div>`}
function rChoice(st){
  const hint=st.hint||(st.neutral?DEF_HINT:null);
  const whatif=st.whatif!==false&&new Set(st.options.map(o=>o.r)).size>1;
  stage.innerHTML=`<section class="scene">${head()}${toolbox()}${sayHTML(st.who,esc(st.text),st.mood||'think')}
    ${st.q?`<p class="h2 fs-md">${esc(st.q)}</p>`:''}
    <div class="opts ${st.compact?'compact':''}" role="group">${st.options.map((o,i)=>optHTML(o,i)).join('')}</div>
    ${st.own?ownHTML(st.own):''}
    <div id="out"></div><div id="wil"></div>
    <div class="actions" id="act">${hintBtn(hint)}</div></section>`;
  wireHint(hint);
  /* ответ можно поменять (случайное нажатие): счётчики прежнего ответа откатываются, искры — только за первый */
  let prev=null;
  const fx=(o,k)=>{
    if(o.help)S.help+=k;
    if(o.insight){S.insight+=k;if(/^mirror\d/.test(st.key||''))S.mi=(S.mi||0)+k}
    if(o.tool){S.tools[o.tool]=(S.tools[o.tool]||0)+k;if(S.tools[o.tool]<=0)delete S.tools[o.tool]}
  };
  const pick=(o,b)=>{
    if(prev&&(prev===o||(prev.own&&o.own&&prev.t===o.t)))return;
    haptic('choice');
    markPick('.opt',b);
    if(st.key){S.ans[st.key]=o.v||o.t;if(st.key==='city')S.city=o.v}
    if(prev)fx(prev,-1);fx(o,1);
    if(o.help&&S.help>=3)unlock('friend');
    let extra='';
    if(o.tool){const tool=TOOLS[o.tool];extra=`<p class="lit">${icon(tool[0])}<b>${t('choice.toolLit',{name:tool[1]})}</b></p>`}
    if(!prev)addSparks(10,b);else save();
    prev=o;sfx.good();setMood('warm'); // искры одинаковые за любой ответ
    Voice.say([o.r,st.after,t('voice.continue')]);
    $('#out').innerHTML=`${sayHTML('hero',esc(o.t))}<div class="resp"><span class="who">${t('choice.what')}</span><p>${esc(o.r)}</p>${extra}${st.after?`<p class="muted">${esc(st.after)}</p>`:''}</div>`;
    const tb=stage.querySelector('.toolbox');if(tb)tb.outerHTML=toolbox();
    const others=st.options.filter(x=>x!==o&&x.r!==o.r);$('#wil').innerHTML='';
    $('#act').innerHTML=`${whatif&&others.length?`<button class="btn ghost small" id="wi">${t('choice.whatif')}</button>`:''}<button class="btn" id="nx">${t('btn.continueShort')}</button>`;
    const wi=$('#wi');if(wi)wi.onclick=()=>{sfx.soft();wi.remove();
      $('#wil').innerHTML=`<div class="whatif"><span class="kicker">${t('choice.others')}</span>${others.map(x=>`<div class="wi"><b>${x.ic?icon(x.ic)+' ':''}${esc(x.t)}</b><p>${esc(x.r)}</p></div>`).join('')}</div>`;
      $('#wil').scrollIntoView({behavior:'smooth',block:'nearest'})};
    $('#nx').onclick=()=>{sfx.tap();next()};
    $('#out').scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  stage.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(st.options[+b.dataset.i],b));
  if(st.own){const inp=$('#ownin'),ok=$('#ownok');const prev=S.own[st.key]||'';inp.value=prev;ok.disabled=!prev.trim();
    inp.oninput=()=>{ok.disabled=!inp.value.trim()};
    inp.onkeydown=e=>{if(e.key==='Enter'&&!ok.disabled)ok.click()};
    ok.onclick=()=>{const own=inp.value.trim().slice(0,60);if(!own)return;S.own[st.key]=own;save();pick({t:own,v:own,r:st.own.r||t('own.default'),own:1},ok)}}
}
function rMulti(st){
  let sel=(S[st.key]||[]).filter(x=>st.options.includes(x));
  const ok=st.own&&st.own.key;
  const ownVal=()=>ok?(S.own[ok]||'').trim():'';
  const need=()=>Math.max(1,st.min-(ownVal()?1:0));
  const draw=()=>{
    stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,esc(st.text),'think')}
      <div class="chips">${st.options.map((o,i)=>`<button class="chip ${sel.includes(o)?'on':''}" data-i="${i}" aria-pressed="${sel.includes(o)}">${esc(o)}</button>`).join('')}</div>
      <p class="muted fs-sm">${t('multi.count',{n:sel.length,max:st.max})}</p>
      ${ok?`<div class="own"><label for="ownin">${esc(st.own.label)}</label><input id="ownin" maxlength="40" autocomplete="off" placeholder="${esc(st.own.ph||'')}" value="${esc(S.own[ok]||'')}"><small>${esc(OWN_NOTE)}</small></div>`:''}
      <div class="actions">${hintBtn(st.hint)}<button class="btn" id="nx" ${sel.length<need()?'disabled':''}>${t('btn.choose')}</button></div></section>`;
    wireHint(st.hint);
    stage.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{const o=st.options[+c.dataset.i];
      if(sel.includes(o))sel=sel.filter(x=>x!==o);else if(sel.length<st.max)sel.push(o);else{sel.shift();sel.push(o)}
      haptic();sfx.tap();draw()});
    const inp=$('#ownin');if(inp)inp.oninput=()=>{S.own[ok]=inp.value.slice(0,40);save();$('#nx').disabled=sel.length<need()};
    $('#nx').onclick=()=>{S[st.key]=sel;if(ok)S.own[ok]=ownVal();addSparks(15,$('#nx'));sfx.good();next()};
  };draw();
}
function rQuote(st){
  stage.innerHTML=`<section class="scene">${head()}
    <div class="card"><span class="kicker">${t('quote.kicker',{src:esc(st.src)})}</span><div class="quote-he" lang="he">${st.he}</div><div id="tr"></div></div>
    <div id="qq"></div>
    <div class="actions" id="act"><button class="btn" id="show">${t('quote.show')}</button></div></section>`;
  $('#show').onclick=()=>{sfx.tap();
    $('#tr').innerHTML=`<p class="fs-tr">${esc(st.tr??st.ru)}</p><p class="muted">${esc(st.plain)}</p>`;
    $('#qq').innerHTML=`${sayHTML(M,esc(st.q),'think')}<div class="opts mt12">${st.options.map((o,i)=>optHTML({t:o},i)).join('')}</div><div class="mt12" id="out"></div>`;
    $('#act').innerHTML=hintBtn(DEF_HINT);wireHint(DEF_HINT);
    let got=false;
    stage.querySelectorAll('#qq .opt').forEach(b=>b.onclick=()=>{
      if(b.classList.contains('picked'))return;
      haptic('choice');markPick('#qq .opt',b);
      if(!got)addSparks(10,b);got=true;sfx.good();
      $('#out').innerHTML=`<div class="resp"><span class="who">${t('mentor.name')}</span><p>${esc(st.r)}</p></div>`;setMood('warm');
      $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.continueShort')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()};
    });
    $('#qq').scrollIntoView({behavior:'smooth',block:'start'});
  };
}
function artHTML(a){
  if(a==='solomon')return `<div class="grid8">${tl('art.solomon').map(x=>[x]).map((r,i)=>`<div class="stat"><span>${r[0]}</span><div class="bar"><i data-css="animation-delay:${i*.15}s"></i></div></div>`).join('')}</div>`;
  if(a==='brothers')return `<div class="art-bro"><div class="tc"><div class="av84">${avatar({look:0,outfit:0,g:'m'})}</div><small class="muted">${t('art.menashe')}</small></div><div class="tc"><div class="av70">${avatar({look:1,outfit:2,g:'m'})}</div><small class="muted">${t('art.efraim')}</small></div></div>`;
  if(a==='map')return `<div class="art-map"><div class="av72">${avatar(S.hero)}</div><div><span class="kicker">${esc(heroName())}</span><p class="muted fs-sm">${t('art.mapNote')}</p></div></div>`;
  return '';
}
function rCard(st){
  stage.innerHTML=`<section class="scene">${head()}<article class="card">
    <span class="kicker">${esc(st.kicker)}</span><h2 class="h2">${esc(st.title)}</h2>
    ${st.heb?`<div class="bigheb" lang="he">${st.heb}</div>`:''}${picHTML(st.pic)}${artHTML(st.art)}${st.body}</article>
    <div class="actions"><button class="btn" id="nx">${esc(st.btn||t('btn.next'))}</button></div></section>`;
  $('#nx').onclick=()=>{sfx.tap();addSparks(5);next()};
}
function rReveal(st){
  stage.innerHTML=`<section class="scene">${head()}${toolbox()}<div class="card reveal"><div class="reveal-m">${mentorSvg('joy')}</div><span class="kicker">${t('reveal.kicker')}</span><p class="h1">${esc(st.text)}</p><span class="line"></span><p class="muted">${esc(st.sub)}</p></div>
    <div class="actions"><button class="btn" id="nx">${t('reveal.btn')}</button></div></section>`;
  sfx.good();$('#nx').onclick=()=>{sfx.tap();next()};
}

/* ---------- mini-games ---------- */
function rMini(st){({book:gBook,treasure:gTreasure,find:gFind,puzzle:gPuzzle,maslow:gMaslow,timeline:gTimeline,selfmirror:gSelfMirror,pasuk:gPasuk,species:gSpecies,sky:gSky,hands:gHands,circles:gCircles,final:gFinal})[st.game]()}

function gBook(){
  const cols=['#6e2433','#2c5564','#5a4a78','#3f6b4a','#8a6a3f','#1d2b44','#7a5a2a'];
  let shelves='';for(let s=0;s<3;s++){let sp='';for(let i=0;i<40;i++){sp+=`<span class="spine" data-css="width:${8+((i*7+s*3)%9)}px;height:${60+((i*13+s*11)%38)}%;background:${cols[(i+s*2)%cols.length]}"></span>`}shelves+=`<div class="shelf">${sp}</div>`}
  stage.innerHTML=`<section class="scene">${head()}
    <div class="library"><div class="shelves" aria-hidden="true">${shelves}</div><div class="lamp"></div>
      <button class="bookwrap" id="book" aria-label="${t('book.label')}"><div class="book-pages"><span class="glow heb">חֵלֶק ?</span></div><div class="book-cover"><span class="heb">קֹהֶלֶת</span><span class="lat">${t('book.cover')}</span></div><div class="letters" id="letters"></div></button>
    </div>
    <p class="lead" id="bt">${t('book.lead')}</p>
    <div class="actions" id="act"><button class="btn" id="tap">${t('book.tap')}</button></div></section>`;
  const open=()=>{
    const b=$('#book');if(b.classList.contains('open'))return;b.classList.add('open');sfx.ach();
    const L='אבגדהוזחטיכלמנסעפצקרשת';let h='';for(let i=0;i<16;i++){const dx=(Math.random()*260-130)|0,dy=-(60+Math.random()*140)|0;h+=`<span data-css="left:${40+Math.random()*40}%;top:45%;--dx:${dx}px;--dy:${dy}px;animation-delay:${.5+i*.08}s">${L[i%L.length]}</span>`}
    $('#letters').innerHTML=h;
    $('#bt').textContent=t('book.after');
    addSparks(10,b);
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()};
  };
  $('#book').onclick=open;$('#tap').onclick=open;
}

function gTreasure(){
  const c=CITY[S.city||'wealth'];let got=0,inner=20;const N=10;
  stage.innerHTML=`<section class="scene">${head()}
    ${sayHTML(M,t('treasure.say',{what:c.what}),'joy')}
    <div class="meters"><div class="meter"><span>${t('treasure.got',{what:c.what})}</span><b id="m1">0</b><div class="bar"><i class="w0" id="b1"></i></div></div>
    <div class="meter in"><span>${t('treasure.enough')}</span><b id="m2">20%</b><div class="bar"><i class="w20" id="b2"></i></div></div></div>
    <div class="arena" id="ar"></div><div id="out"></div><div class="actions" id="act">${hintBtn(t('treasure.hint'))}</div></section>`;
  wireHint(t('treasure.hint'));
  const ar=$('#ar');
  const spawn=()=>{
    const b=document.createElement('button');b.className='item';b.innerHTML=icon(c.item);b.setAttribute('aria-label',t('treasure.collect'));
    const w=ar.clientWidth-62,h=ar.clientHeight-62;b.style.left=(Math.random()*w)+'px';b.style.top=(Math.random()*h)+'px';
    b.onclick=()=>{if(b.classList.contains('got')||got>=N)return;b.classList.add('got');got++;tone(500+got*40,.1);
      $('#m1').textContent=got*(S.city==='fame'?100000:1000);$('#b1').style.width=(got/N*100)+'%';
      inner=Math.min(38,inner+14);$('#m2').textContent=inner+'%';$('#b2').style.width=inner+'%';
      setTimeout(()=>{inner=20+(got%2);const m2=$('#m2');if(m2&&$('#b2')){m2.textContent=inner+'%';$('#b2').style.width=inner+'%'}},700);
      setTimeout(()=>b.remove(),450);
      if(got<N)setTimeout(spawn,250);else setTimeout(done,900);
    };ar.appendChild(b);
  };
  const done=()=>{if(!document.body.contains(ar))return;addSparks(25,ar);
    $('#out').innerHTML=`${sayHTML(M,t('treasure.full'),'think')}<div class="opts mt12">${tl('treasure.opts').map((x,i)=>optHTML({t:x},i)).join('')}</div><div class="mt12" id="o2"></div>`;
    const RR=tl('treasure.resp');
    let got=false;
    stage.querySelectorAll('#out .opt').forEach(b=>b.onclick=()=>{if(b.classList.contains('picked'))return;haptic('choice');markPick('#out .opt',b);if(!got)addSparks(10,b);got=true;sfx.good();
      $('#o2').innerHTML=`<div class="resp"><span class="who">${t('choice.what')}</span><p>${esc(RR[+b.dataset.i])}</p></div>`;
      $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.continueShort')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}});
    $('#out').scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  spawn();
}

/* ---------- 16+: опыты Шломо (Коэлет 2) на пирамиде Маслоу; верного ответа нет, верхняя ступень остаётся пустой ---------- */
function gMaslow(){
  const L=tl('maslow.levels'),C=tl('maslow.cards'),at=C.map(()=>null),hint=t('maslow.hint');let sel=null,shown=false;
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,t('maslow.say'),'think')}
    <div class="mz" id="mz" aria-label="${esc(t('maslow.label'))}"></div><p class="muted mz-st" id="mzs" aria-live="polite"></p>
    <div id="out"></div><div class="actions" id="act">${hintBtn(hint)}</div></section>`;
  wireHint(hint);
  const draw=()=>{
    const top=L.length-1;
    $('#mz').innerHTML=`<div class="mz-pyr">${L.map((_,k)=>top-k).map(l=>{const ins=C.map((c,i)=>at[i]===l?`<button class="mz-chip${shown&&l===top?' vapor':''}" data-back="${i}" ${shown?'disabled':''}>${esc(c[0])}</button>`:'').join('');
      return `<div class="mz-row l${l}${shown&&l===top?' empty':''}"><button class="mz-drop" data-l="${l}" ${sel==null||shown?'disabled':''}>${esc(L[l])}</button>${ins?`<div class="mz-in">${ins}</div>`:''}${shown&&l===top?'<span class="mz-q" aria-hidden="true">?</span>':''}</div>`}).join('')}</div>
      ${shown?'':`<div class="mz-cards">${C.map((c,i)=>at[i]==null?`<button class="mz-card${sel===i?' on':''}" data-i="${i}" aria-pressed="${sel===i}"><span>${esc(c[0])}</span><small>${esc(c[1])}</small></button>`:'').join('')}</div>`}`;
    $('#mzs').textContent=shown?'':t(sel==null?'maslow.pick':'maslow.level');
    stage.querySelectorAll('.mz-card').forEach(b=>b.onclick=()=>{sel=sel===+b.dataset.i?null:+b.dataset.i;sfx.tap();draw()});
    stage.querySelectorAll('.mz-drop').forEach(b=>b.onclick=()=>{if(sel==null)return;at[sel]=+b.dataset.l;sel=null;tone(480+at.filter(x=>x!=null).length*40,.1);draw()});
    stage.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{at[+b.dataset.back]=null;sfx.soft();draw()});
    if(!shown&&at.every(x=>x!=null)&&!$('#see')){$('#act').innerHTML=`<button class="btn" id="see">${t('maslow.see')}</button>`;$('#see').onclick=verdict}
    if(!shown&&at.some(x=>x==null)&&$('#see')){$('#act').innerHTML=hintBtn(hint);wireHint(hint)}
  };
  const verdict=()=>{
    const topUsed=at.includes(L.length-1);shown=true;draw();setMood('wow');sfx.good();addSparks(25,$('#mz'));
    $('#out').innerHTML=`<div class="resp"><span class="who">${t('maslow.kicker')}</span><p class="quote-he" lang="he">וְהִנֵּה הַכֹּל הֶבֶל וּרְעוּת רוּחַ</p><p>${t(topUsed?'maslow.verdictTop':'maslow.verdict')}</p><p>${t('maslow.after')}</p></div>`;
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.continueShort')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()};
    $('#out').scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  draw();
}

/* ---------- 16+: лента истории — события по порядку, в конце своя деталь игрока ---------- */
function gTimeline(){
  const E=tl('timeline.events'),hint=t('timeline.hint'),order=E.map((_,i)=>i).sort(()=>Math.random()-.5);let k=0;
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,t('timeline.say'),'point')}
    <div class="tl-pool" id="tlp" role="group" aria-label="${esc(t('timeline.pool'))}">${order.map(i=>`<button class="tl-ev" data-n="${i}">${esc(E[i][0])}</button>`).join('')}</div>
    <p class="muted" id="tlm" aria-live="polite"></p>
    <ol class="tl-line" id="tll" aria-label="${esc(t('timeline.label'))}"><li class="tl-slot next"><span class="tl-n">1</span></li></ol>
    <div id="out"></div><div class="actions" id="act">${hintBtn(hint)}</div></section>`;
  wireHint(hint);
  const line=$('#tll');
  stage.querySelectorAll('.tl-ev').forEach(b=>b.onclick=()=>{
    if(+b.dataset.n!==k){b.classList.remove('no');void b.offsetWidth;b.classList.add('no');sfx.soft();$('#tlm').textContent=t('timeline.later');return}
    const [title,era]=E[k];b.remove();tone(520+k*45,.12);$('#tlm').textContent='';
    line.querySelector('.next').outerHTML=`<li class="tl-slot in"><span class="tl-n">${k+1}</span><div><small>${esc(era)}</small><b>${esc(title)}</b></div></li>`;
    k++;
    if(k<E.length){line.insertAdjacentHTML('beforeend',`<li class="tl-slot next"><span class="tl-n">${k+1}</span></li>`);return}
    line.insertAdjacentHTML('beforeend',`<li class="tl-slot me in"><span class="tl-av">${avatar(S.hero)}</span><div><small>${t('timeline.now')}</small><b>${t('timeline.me',{name:esc(heroName())})}</b></div></li>`);
    addSparks(25,line);sfx.ach();setMood('joy');
    $('#out').innerHTML=`<div class="resp"><span class="who">${t('timeline.doneKicker')}</span><p>${t('timeline.done')}</p></div>`;
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()};
    $('#out').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
}

function gFind(){
  const W='חֵלֶק',D=['הֶבֶל','שֶׁמֶשׁ','רוּחַ','עָמָל','לֵב','דּוֹר','זְמַן','חָכְמָה'];
  const tiles=[];for(let i=0;i<8;i++)tiles.push(W);for(let i=0;i<12;i++)tiles.push(D[i%D.length]);
  for(let i=tiles.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[tiles[i],tiles[j]]=[tiles[j],tiles[i]]}
  let found=0;
  const hint=t('find.hint');
  stage.innerHTML=`<section class="scene">${head()}
    <div class="target card"><span class="heb" lang="he">${W}</span><div><span class="kicker">${t('find.kicker')}</span><p>${t('find.task')}</p></div></div>
    <div class="findgrid">${tiles.map((x,i)=>`<button class="tile" data-t="${x===W?1:0}" lang="he">${x}</button>`).join('')}</div>
    <p class="muted" id="cnt">${t('find.count',{n:0})}</p><div class="actions" id="act">${hintBtn(hint)}</div></section>`;
  wireHint(hint);
  stage.querySelectorAll('.tile').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('hit'))return;
    if(b.dataset.t==='1'){b.classList.add('hit');found++;tone(600+found*50,.12);$('#cnt').textContent=t('find.count',{n:found});
      if(found===8){addSparks(25,b);sfx.ach();$('#cnt').innerHTML=`<b class="c-etrog">${t('find.done')}</b>`;$('#act').innerHTML=`<button class="btn" id="nx">${t('find.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}}}
    else{b.classList.remove('no');void b.offsetWidth;b.classList.add('no');sfx.soft()}
  });
}

/* ---------- настоящий пазл: библиотека headbreaker (vendor/), грузится только на этом шаге ---------- */
let hbLoading=null;
function loadHeadbreaker(){
  if(window.headbreaker)return Promise.resolve();
  if(!hbLoading)hbLoading=new Promise((res,rej)=>{const s=document.createElement('script');s.src='vendor/headbreaker.js';
    s.onload=res;s.onerror=()=>{hbLoading=null;s.remove();rej(new Error('headbreaker'))};document.head.appendChild(s)});
  return hbLoading;
}
/* Картина 3×3 для пазла: шесть частей доли, две «чужие» детали и «?» в центре. */
const JIG_LAYOUT=[0,'d',1,2,'h',3,4,'d',5];
/* Сколько деталей по стороне: 3×3, для 16+ — 5×5 (смысл детали — клетка картины под её центром). */
const jigN=()=>adult()?5:3;
const jigMeaning=(i,n)=>{const c=JIG_LAYOUT[Math.floor((Math.floor(i/n)+.5)*3/n)*3+Math.floor((i%n+.5)*3/n)];return typeof c==='number'?c:null};
function jigsawImage(P,cell){
  const S=cell*3,cols=['#f6d98a','#bcd6ea','#cfe3d6','#f2c4cc','#f2b8c2','#d9cdea'],ink=['#8a5d00','#3a669c','#276b3f','#a8324b','#a8324b','#56469c'];
  const wrap=s=>{const w=String(s).split(' ');if(s.length<12||w.length<2)return [s];let best=1,d=1e9;for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' ').length,b=w.slice(i).join(' ').length;if(Math.abs(a-b)<d){d=Math.abs(a-b);best=i}}return [w.slice(0,best).join(' '),w.slice(best).join(' ')]};
  let g='';
  JIG_LAYOUT.forEach((c,i)=>{
    const x=(i%3)*cell,y=Math.floor(i/3)*cell,cx=x+cell/2;
    const label=(lines,col,y0)=>{const fs=Math.min(cell*.125,cell*.9/(Math.max(...lines.map(l=>l.length))*.58));
      return lines.map((l,k)=>`<text x="${cx}" y="${y0+k*fs*1.2}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="700" fill="${col}">${esc(l)}</text>`).join('')};
    const ic=(name,col,s)=>`<g class="ic" color="${col}" transform="translate(${cx-s/2} ${y+cell*.16}) scale(${s/24})">${ICONS[name]||''}</g>`;
    if(c==='d'){g+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#e6ece8"/>${ic('friends','#6e817c',cell*.4)}${label(wrap(t('puzzle.deco')),'#4a5d58',y+cell*.75)}`}
    else if(c==='h'){g+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="#fbf6e6"/><rect x="${x+cell*.14}" y="${y+cell*.14}" width="${cell*.72}" height="${cell*.72}" rx="${cell*.1}" fill="none" stroke="#c9951f" stroke-width="${cell*.025}" stroke-dasharray="${cell*.06} ${cell*.05}"/><text x="${cx}" y="${y+cell*.64}" text-anchor="middle" font-size="${cell*.4}" font-weight="800" fill="#8a5d00">?</text>`}
    else {const [name,title]=P[c];g+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${cols[c]}"/>${ic(name,ink[c],cell*.42)}${label(wrap(title),'#17282e',y+cell*.76)}`}
  });
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><style>text{font-family:Onest,'Segoe UI',Arial,sans-serif}.ic *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.ic .f{fill:currentColor;fill-opacity:.25}</style>${g}</svg>`;
  return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
}
function gPuzzle(){
  const P=tl('puzzle.pieces');const shown=new Set();let done=false;
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,t(adult()?'puzzle.sayA':'puzzle.say'),'point')}
    <div class="jig" id="jig" aria-label="${esc(t('puzzle.label'))}"><p class="muted jig-wait">${t('puzzle.loading')}</p></div>
    <p class="muted fs-sm" id="jigcnt">${t('puzzle.count',{n:0})}</p>
    <div id="out"></div><div class="actions" id="act">${hintBtn(t('puzzle.hint'))}<button class="btn ghost small" id="autosolve">${t('puzzle.solve')}</button></div></section>`;
  wireHint(t('puzzle.hint'));
  const box=$('#jig');
  box.addEventListener('mousedown',e=>e.preventDefault()); // мышь тянет деталь, а не выделяет текст страницы
  const reveal=idx=>{if(idx==null||shown.has(idx))return;shown.add(idx);const p=P[idx];sfx.good();
    $('#out').innerHTML=`<div class="resp"><span class="who">${esc(p[1])}</span><p>${esc(p[2])}</p></div>`;
    $('#jigcnt').textContent=t('puzzle.count',{n:shown.size})};
  const finish=()=>{if(done||!document.body.contains(box))return;done=true;
    P.forEach((_,i)=>shown.add(i));$('#jigcnt').textContent=t('puzzle.count',{n:6});
    addSparks(25,box);sfx.ach();box.classList.add('solved');
    $('#out').insertAdjacentHTML('beforeend',`<div class="resp"><span class="who">${t('puzzle.doneKicker')}</span><p>${t('puzzle.done')}</p></div>`);
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}};
  const fail=()=>{box.innerHTML=`<p class="muted">${t('puzzle.fail')}</p>`;
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}};
  const n=jigN();
  Promise.all([loadHeadbreaker(),jigsawImage(P,200)]).then(([,img])=>{
    if(!document.body.contains(box))return;
    /* поле целиком помещается в окно (на ноутбуке иначе низ уходит за край экрана) */
    const W=Math.max(260,Math.floor(box.clientWidth)),H=Math.round(Math.min(n>3?Math.min(W*1.3,640):Math.min(W*1.05,560),Math.max(300,innerHeight-130)));
    const size=Math.floor(n>3?Math.min(W/7.2,H/7.2,80):Math.min(W/4.8,H/4.8,104));
    box.innerHTML='';box.style.height=H+'px';
    const cv=new headbreaker.Canvas('jig',{width:W,height:H,pieceSize:size,proximity:Math.round(size/5),borderFill:Math.round(size/10),
      strokeWidth:2,strokeColor:'#6d5a3a',lineSoftness:.18,image:img,maxPiecesCount:{x:n,y:n},preventOffstageDrag:true,fixed:true});
    cv.adjustImagesToPuzzleWidth();
    cv.autogenerate({horizontalPiecesCount:n,verticalPiecesCount:n,metadata:[...Array(n*n).keys()].map(i=>({id:'p'+i,meaning:jigMeaning(i,n)}))});
    cv.shuffle(.85);
    /* раскладываем детали по сетке n×n со случайным сдвигом, чтобы они не лежали стопкой */
    const cells=[...Array(n*n).keys()].sort(()=>Math.random()-.5),cw=W/n,ch=H/n,rad=size*.72,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
    cv.puzzle.pieces.forEach((pc,i)=>{const c=cells[i];
      pc.relocateTo(cl((c%n+.5)*cw+(Math.random()-.5)*Math.max(0,cw-2*rad),rad,W-rad),cl((Math.floor(c/n)+.5)*ch+(Math.random()-.5)*Math.max(0,ch-2*rad),rad,H-rad))});
    cv.attachSolvedValidator();
    /* собранная группа двигается целиком: поднимаем её над остальными деталями и после броска
       возвращаем в поле, если какая-то её часть уехала за край (иначе её не достать) */
    const group=pc=>{const g=[pc];for(let k=0;k<g.length;k++)g[k].presentConnections.forEach(x=>{if(!g.includes(x))g.push(x)});return g};
    const pieceOf=node=>cv.puzzle.pieces.find(pc=>{const f=cv.getFigure(pc);return f&&f.group===node});
    const stg=cv.__konvaLayer__.getStage(),pad=Math.round(size*.3);
    stg.on('dragmove',e=>{const pc=pieceOf(e.target);if(!pc)return;group(pc).forEach(x=>{if(x!==pc)cv.getFigure(x).group.moveToTop()});e.target.moveToTop()});
    stg.on('dragend',e=>{const pc=pieceOf(e.target);if(!pc)return;const g=group(pc);
      const l=Math.min(...g.map(x=>x.leftAnchor.x))-pad,r=Math.max(...g.map(x=>x.rightAnchor.x))+pad,
        u=Math.min(...g.map(x=>x.upAnchor.y))-pad,d=Math.max(...g.map(x=>x.downAnchor.y))+pad;
      const dx=l<0?-l:r>W?W-r:0,dy=u<0?-u:d>H?H-d:0;
      if(dx||dy){g.forEach(x=>x.translate(Math.round(dx),Math.round(dy)));cv.redraw()}});
    cv.onConnect((a,_fa,b)=>{tone(560,.08);reveal(a.metadata.meaning);reveal(b.metadata.meaning)});
    cv.onValid(()=>{if(cv.valid)finish()});
    cv.draw();box.scrollIntoView({behavior:'smooth',block:'nearest'});
    $('#autosolve').onclick=()=>{cv.solve();
      const xs=cv.puzzle.pieces.map(pc=>pc.centralAnchor.x),ys=cv.puzzle.pieces.map(pc=>pc.centralAnchor.y);
      cv.puzzle.translate(Math.round(W/2-(Math.min(...xs)+Math.max(...xs))/2),Math.round(H/2-(Math.min(...ys)+Math.max(...ys))/2));
      cv.redraw();cv.puzzle.validate();finish()};
  }).catch(fail);
  $('#autosolve').onclick=()=>finish();
}

/* ---------- настоящее зеркало: камера только по запросу, изображение не покидает устройство ---------- */
let camStream=null;
function stopCamera(){if(camStream){camStream.getTracks().forEach(tr=>tr.stop());camStream=null}}
window.addEventListener('pagehide',stopCamera);
// фото для сертификата — только по кнопке, квадрат 400 px только на время вкладки (sessionStorage, см. save()), никуда не отправляется
function snapPhoto(v){
  if(!v||!v.videoWidth)return null;
  const z=Math.min(v.videoWidth,v.videoHeight),N=400,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  x.translate(N,0);x.scale(-1,1);// как в зеркале
  x.drawImage(v,(v.videoWidth-z)/2,(v.videoHeight-z)/2,z,z,0,0,N,N);
  try{return c.toDataURL('image/jpeg',0.85)}catch(e){return null}
}
function gSelfMirror(){
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,tl('mirror.say'),'warm')}
    <div class="selfmirror"><div class="sm-frame"><div class="sm-glass" id="glass"><div class="sm-avatar">${avatar(S.hero)}</div></div></div>
      <p class="sm-cap" id="smcap" aria-live="polite"></p></div>
    <p class="muted sm-note">${icon('lock')} ${tl('mirror.privacy')}</p>
    <div id="out"></div>
    <div class="actions" id="act"><button class="btn" id="camon">${icon('mirror')}<span>${t('mirror.on')}</span></button><button class="btn ghost" id="camskip">${t('mirror.skip')}</button></div></section>`;
  const glass=$('#glass');
  const after=(msg)=>{
    $('#smcap').textContent=t('mirror.caption',{name:heroName()});
    $('#out').innerHTML=`<div class="resp"><span class="who">${t('mentor.name')}</span><p>${esc(msg||tl('mirror.after'))}</p></div>`;
    setMood('joy');addSparks(10,glass);sfx.good();
    $('#act').innerHTML=`${camStream?`<button class="btn ghost" id="snap">${icon('mirror')}<span>${t(S.photo?'mirror.retake':'mirror.snap')}</span></button><button class="btn ghost" id="camoff">${t('mirror.off')}</button>`:''}<button class="btn" id="nx">${t('btn.continueShort')}</button>`;
    const off=$('#camoff');if(off)off.onclick=()=>{stopCamera();glass.innerHTML=`<div class="sm-avatar">${avatar(S.hero)}</div>`;glass.classList.remove('live');off.remove();const sn=$('#snap');if(sn)sn.remove()};
    const snap=$('#snap');if(snap)snap.onclick=()=>{const url=snapPhoto(glass.querySelector('video'));if(!url)return;
      S.photo=url;S.photoOff=false;save();sfx.tap();
      glass.classList.remove('flash');void glass.offsetWidth;glass.classList.add('flash');
      $('#smcap').textContent=t('mirror.saved');snap.querySelector('span').textContent=t('mirror.retake')};
    $('#nx').onclick=()=>{stopCamera();sfx.tap();next()};
  };
  $('#camskip').onclick=()=>{sfx.tap();after(tl('mirror.afterNoCam'))};
  $('#camon').onclick=async()=>{
    const md=navigator.mediaDevices;
    if(!md||!md.getUserMedia||!window.isSecureContext){after(t('mirror.unsupported'));return}
    $('#camon').disabled=true;
    try{
      const stream=await md.getUserMedia({video:{facingMode:'user',width:{ideal:720},height:{ideal:720}},audio:false});
      if(!document.body.contains(glass)){stream.getTracks().forEach(tr=>tr.stop());return}
      stopCamera();camStream=stream;
      const v=document.createElement('video');v.className='sm-video';v.muted=true;v.playsInline=true;v.autoplay=true;v.setAttribute('playsinline','');v.setAttribute('aria-label',t('mirror.videoLabel'));
      v.srcObject=stream;glass.innerHTML='';glass.appendChild(v);glass.classList.add('live');
      try{await v.play()}catch(e){}
      after();
    }catch(e){
      after(e&&e.name==='NotAllowedError'?t('mirror.denied'):t('mirror.unsupported'));
    }
  };
}

function gSpecies(){
  const got=[];
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,tl('species.say'),'point')}
    <div class="species">${SPECIES.map((p,i)=>`<button class="sp" data-i="${i}"><span class="spic" aria-hidden="true">${icon(p.ic)}</span><b>${p.name}</b><span class="heb" lang="he">${p.he}</span></button>`).join('')}</div>
    <div class="bundle" id="bun" aria-live="polite"><span class="muted">${t('species.empty')}</span></div>
    <div id="out"></div><div class="actions" id="act"></div></section>`;
  stage.querySelectorAll('.sp').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i,p=SPECIES[i];
    if(!got.includes(i)){got.push(i);b.classList.add('on');tone(520+got.length*60,.14)}else sfx.tap();
    $('#bun').innerHTML=got.map(k=>`<span>${icon(SPECIES[k].ic)}</span>`).join('');
    $('#out').innerHTML=`<div class="resp"><span class="who">${p.name}</span><p>${esc(young()?p.y:p.t)}</p></div>`;
    if(got.length===SPECIES.length&&!$('#nx')){addSparks(25,$('#bun'));sfx.ach();$('#bun').classList.add('full');
      $('#out').insertAdjacentHTML('beforeend',`<div class="resp"><span class="who">${t('species.src')}</span><p>${esc(tl('species.end'))}</p></div>`);
      $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}}
  });
}

function gSky(){
  let stars='';for(let i=0;i<24;i++)stars+=`<span class="star" data-css="left:${(i*37)%100}%;top:${(i*23)%60}%"></span>`;
  stage.innerHTML=`<section class="scene">${head()}<article class="card"><span class="kicker">${t('sky.kicker')}</span><h2 class="h2">${t('sky.title')}</h2>
    <p>${esc(tl('sky.text'))}</p>
    <div class="sky" id="sky">${stars}<div class="sun"></div><div class="moon"></div><div class="ground"></div></div>
    <p id="skyt" class="muted">${t('sky.q')}</p></article>
    <div class="actions" id="act"><button class="btn" id="night">${t('sky.btn')}</button></div></section>`;
  $('#night').onclick=()=>{$('#sky').classList.add('night');sfx.good();addSparks(10,$('#sky'));
    setTimeout(()=>{if(!$('#skyt'))return;$('#skyt').innerHTML=t('sky.after')},1200);
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}};
}

function gHands(){
  stage.innerHTML=`<section class="scene">${head()}<article class="card"><span class="kicker">${t('hands.kicker')}</span><h2 class="h2">${t('hands.title')}</h2>
    <svg class="blessing" id="bl" viewBox="0 0 360 250" aria-hidden="true">
      <g transform="translate(130,6) scale(1)"><svg width="100" height="100" x="0" y="0" viewBox="0 0 120 150">${mentorSvg('warm').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>
      <path class="arm straight" d="M160 100 Q120 140 85 175"/><path class="arm straight" d="M200 100 Q240 140 275 175"/>
      <path class="arm crossed" d="M160 100 Q210 130 275 175"/><path class="arm crossed" d="M200 100 Q150 130 85 175"/>
      <svg x="40" y="160" width="90" height="90">${avatar({look:1,outfit:2,g:'m'})}</svg><svg x="230" y="160" width="90" height="90">${avatar({look:0,outfit:0,g:'m'})}</svg>
      <text x="85" y="248" text-anchor="middle" fill="#566d67" font-size="12" font-family="Onest,sans-serif">${esc(t('hands.efraim'))}</text><text x="275" y="248" text-anchor="middle" fill="#566d67" font-size="12" font-family="Onest,sans-serif">${esc(t('hands.menashe'))}</text>
    </svg>
    <p id="ht" class="muted">${t('hands.q')}</p></article>
    <div class="actions" id="act"><button class="btn" id="see">${t('hands.btn')}</button></div></section>`;
  $('#see').onclick=()=>{$('#bl').classList.add('x');sfx.good();addSparks(10);
    $('#ht').innerHTML=t('hands.after');
    $('#act').innerHTML=`<button class="btn" id="nx">${t('btn.next')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}};
}

const labOpts=k=>young()?LAB[k].opts.slice(0,LAB_Y[k]):LAB[k].opts;
function gCircles(){
  let act=null;
  const keys=Object.keys(LAB);
  const hint=t('circles.hint');
  const draw=()=>{
    const all=keys.every(k=>S.lab[k].length>0);
    stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,t('circles.say'),'point')}
      <div class="circles">${keys.map(k=>`<button class="circ ${act===k?'act':''} ${S.lab[k].length?'has':''}" data-k="${k}">${LAB[k].title}<small>${S.lab[k].length?t('circles.chosen',{n:S.lab[k].length}):t('circles.tap')}</small></button>`).join('')}</div>
      ${act?`<div class="card"><span class="kicker">${LAB[act].title}</span><div class="chips">${labOpts(act).map((o,i)=>`<button class="chip ${S.lab[act].includes(o)?'on':''}" data-o="${i}">${esc(o)}</button>`).join('')}</div></div>`:''}
      <div class="actions">${hintBtn(hint)}<button class="btn" id="nx" ${all?'':'disabled'}>${all?t('circles.build'):t('circles.fill')}</button></div></section>`;
    wireHint(hint);
    stage.querySelectorAll('.circ').forEach(b=>b.onclick=()=>{act=b.dataset.k;sfx.tap();draw()});
    stage.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const o=labOpts(act)[+b.dataset.o];const a=S.lab[act];
      if(a.includes(o))S.lab[act]=a.filter(x=>x!==o);else{if(a.length>=3)a.shift();a.push(o)}sfx.tap();save();
      const cur=act;if(S.lab[cur].length===3){const nk=keys.find(k=>!S.lab[k].length);if(nk)act=nk}draw()});
    $('#nx').onclick=()=>{addSparks(25,$('#nx'));sfx.good();next()};
  };draw();
}

function strengthMap(s){
  const L=s.lab,q=myQualities();const list=a=>a.map(esc).join(', ');
  /* какие умения из круга «Что у меня получается?» ведут к какой формулировке (по номеру варианта) */
  const COMBO_IDX=[[0,2,8],[1],[5],[4],[3,7,9],[6]],texts=tl('sm.combos')||[];
  const picked=(L.can||[]).map(x=>LAB.can.opts.indexOf(x)).filter(i=>i>=0);
  const ci=COMBO_IDX.findIndex(ix=>ix.some(i=>picked.includes(i)));const c=ci>=0&&texts[ci]?[null,texts[ci]]:null;
  const parts=[];
  if(q.length)parts.push(`<p>${t('sm.marked',{list:list(q)})}</p>`);
  if(L.can.length)parts.push(`<p>${t('sm.can',{list:list(L.can)})}</p>`);
  if(L.like.length)parts.push(`<p>${t('sm.like',{list:list(L.like)})}</p>`);
  if(L.need.length)parts.push(`<p>${t('sm.need',{list:list(L.need)})}${L.help.length?t('sm.help',{list:list(L.help)}):''}.</p>`);
  parts.push(`<p class="fs-share">${t('sm.share',{what:c?c[1]:t('sm.default')})}</p>`);
  parts.push(`<p>${t('sm.gift')}</p>`);
  if(s.ans.flow)parts.push(`<p class="muted">${t('sm.flow',{flow:esc(s.ans.flow)})}</p>`);
  parts.push(`<p class="muted fs-sm">${t('sm.rabbi')}</p>`);
  return parts.join('');
}

function gFinal(){
  stage.innerHTML=`<section class="scene">${head()}${sayHTML(M,t('final.say'),'warm')}
    <div class="bigboard" id="bb">${BOARD.map((b,i)=>b[1]?`<div class="bp" data-css="background:${b[1]};animation-delay:${i*.06}s">${b[0]}</div>`:`<div class="bp me" id="me">${esc(heroName())}?</div>`).join('')}</div>
    <div class="actions" id="act"><button class="btn" id="put">${t('final.put')}</button></div></section>`;
  $('#put').onclick=()=>{const me=$('#me');me.classList.add('in');me.innerHTML=avatar(S.hero);sfx.ach();
    setTimeout(()=>{const bb=$('#bb');if(bb)bb.classList.add('glow')},700);addSparks(30,me);
    $('#act').innerHTML=`<button class="btn" id="nx">${t('final.see')}</button>`;$('#nx').onclick=()=>{sfx.tap();next()}};
}

/* ---------- world flow ---------- */
function completeWorld(){
  const w=WORLDS[S.w];const first=!S.done[S.w];S.done[S.w]=1;
  if(first)S.sparks+=30;
  if(w.ach)unlock(w.ach);
  if(S.done.every(Boolean))unlock('explorer');
  save();
  if(S.w===6){if(!S.finished)S.finished=new Date().toISOString();S.screen='final';unlock('path');save();render();window.scrollTo({top:0});return}
  S.screen='done';save();render();window.scrollTo({top:0});
}
function renderDone(){
  const n=S.done.filter(Boolean).length;
  stage.innerHTML=`<section class="scene"><div class="card reveal"><span class="kicker">${t('done.kicker',{n:S.w+1})}</span>
    <div class="reveal-m">${mentorSvg('joy')}</div><div class="done-piece">${pieceSvg('var(--gold)')}</div>
    <p class="h2">${t('done.title',{name:esc(WORLDS[S.w].name)})}</p><p class="muted">${t('done.sub',{n})}</p></div>
    <div class="actions"><button class="btn" id="nx">${t('reveal.btn')}</button></div></section>`;
  $('#nx').onclick=()=>{sfx.tap();go('map')};
}
function renderMap(){
  S._last='map';S.mapSeen=1;
  const firstOpen=S.done.findIndex(d=>!d);
  const prologueDone=S.ps>=PRO().length;
  /* узлы: пролог + 7 миров; тропа петляет слева направо */
  const nodes=[{k:'pro',name:t('map.proName'),desc:t('map.proDesc'),ic:'book',theme:'library',state:prologueDone?'done':'open'},
    ...WORLDS.map((w,i)=>({k:i,name:w.name,desc:w.desc,ic:WORLD_ICON[i],theme:WORLD_THEME[i],state:S.done[i]?'done':prologueDone&&i===firstOpen?'open':'lock'}))];
  const STEP=124,TOP=70,Hh=TOP*2+STEP*(nodes.length-1);
  const X=k=>k%2?70:30,Y=k=>TOP+k*STEP;
  let road='';for(let k=1;k<nodes.length;k++){const x0=X(k-1),y0=Y(k-1),x1=X(k),y1=Y(k);
    road+=`<path class="road ${nodes[k].state!=='lock'?'lit':''}" d="M${x0} ${y0} C${x0} ${y0+STEP*.6} ${x1} ${y1-STEP*.6} ${x1} ${y1}"/>`}
  const status={done:t('map.done'),open:t('map.open'),lock:t('map.lock')};
  stage.innerHTML=`<section class="scene">
    <span class="kicker">${t('map.kicker')}</span><h2 class="h2">${t('map.title')}</h2>
    <div class="progress-wrap"><div class="pieces">${S.done.map(d=>pieceSvg(d?'var(--gold)':'none',d?'':'#9fb5aa')).join('')}</div>
    <div class="bar bar10"><i data-css="width:${S.done.filter(Boolean).length/7*100}%"></i></div></div>
    <div class="tmap" data-css="height:${Hh}px">
      <svg class="tmap-road" viewBox="0 0 100 ${Hh}" preserveAspectRatio="none" aria-hidden="true">${road.replace(/class="road[^"]*"/g,'class="road-bed"')}${road}</svg>
      ${nodes.map((n,k)=>`<button class="mnode ${n.state} ${k%2?'r':'l'}" data-css="left:${X(k)}%;top:${Y(k)}px;--c:${THEMES[n.theme].accent}" ${n.k==='pro'?'id="pro"':`data-w="${n.k}"`} ${n.state==='lock'?'disabled':''} aria-label="${esc(n.name)}. ${status[n.state]}">
        <span class="isle" aria-hidden="true"></span>
        <span class="disc" aria-hidden="true">${icon(n.state==='lock'?'lock':n.ic)}${n.state==='done'?`<span class="badge">${icon('check')}</span>`:''}</span>
        <span class="mlabel"><span class="st">${n.k==='pro'?(n.state==='done'?t('map.proDone'):t('map.proStart')):status[n.state]}</span><span class="nm">${esc(n.name)}</span><span class="ds">${esc(n.desc)}</span></span>
      </button>`).join('')}
    </div>
    ${S.done.every(Boolean)?`<div class="actions"><button class="btn" id="fin">${t('map.final')}</button></div>`:''}
  </section>`;
  const pro=$('#pro');if(pro)pro.onclick=()=>{S.ps=prologueDone?0:Math.min(S.ps,PRO().length-1);go('prologue')};
  stage.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{S.w=+b.dataset.w;S.s=0;sfx.good();go('world')});
  const f=$('#fin');if(f)f.onclick=()=>go('final');
}
function fmtDate(iso){try{return new Date(iso||Date.now()).toLocaleDateString(langLocale(),{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
function strengthsList(){const q=myQualities();const stem=x=>x.slice(0,6);
  const extra=(S.lab.can||[]).filter(x=>!q.some(y=>stem(y)===stem(x)||y.includes(x.split(' ').pop()))).slice(0,2);return [...q,...extra].slice(0,5)}
function worldReport(){
  const lit=Object.keys(S.tools).map(k=>TOOLS[k][1].toLowerCase());
  const lc=x=>(x||'—').toLowerCase(),W=k=>WORLDS[k].name;
  return [
    [W(0),S.city?t('rep.city',{choice:(tl('city.label')||{})[S.city]||S.city,evening:S.ans.evening||'—'}):'—',t('rep.cityD')],
    [W(1),t('rep.puzzle',{list:myQualities().join(', ')||'—'}),t('rep.puzzleD')],
    [W(2),t('rep.mirror'),t('rep.mirrorD')],
    [W(3),t('rep.brothers',{act:S.ans.awardAct||'—'}),t('rep.brothersD')],
    [W(4),lit.length?t('rep.tools',{list:lit.join(', ')}):t('rep.toolsNone'),t('rep.toolsD')],
    [W(5),t('rep.lab',{flow:lc(S.ans.flow),list:(S.lab.can||[]).join(', ')||'—'}),t('rep.labD')],
    [W(6),t('rep.final',{step:lc(S.ans.weekly)}),t('rep.finalD')]
  ];
}
function wrapLines(ctx,text,maxW){const words=text.split(' ');const lines=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);return lines}
async function drawCertificate(sc){
  sc=sc||1;const W=1600,H=1130,c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const x=c.getContext('2d');x.scale(sc,sc);
  try{await Promise.all(['800 60px Unbounded','700 40px Unbounded','400 30px Onest','500 30px Onest','700 60px "Frank Ruhl Libre"'].map(f=>document.fonts.load(f)))}catch(e){}
  const D='Unbounded, "Trebuchet MS", sans-serif',B='Onest, "Segoe UI", sans-serif',HB='"Frank Ruhl Libre", serif';
  x.fillStyle='#fbfdfb';x.fillRect(0,0,W,H);
  // corner puzzle motifs
  const piece=(px,py,sz,col,rot)=>{x.save();x.translate(px,py);x.rotate(rot);x.scale(sz/100,sz/100);x.translate(-50,-50);x.fillStyle=col;x.fill(new Path2D(PIECE));x.restore()};
  [[90,90,'#9fd0ae',0],[190,70,'#f2be3d',.3],[70,190,'#f2b8c2',-.2],[W-90,H-90,'#bcd6ea',0],[W-190,H-70,'#9fd0ae',.4],[W-70,H-190,'#f2be3d',-.3]].forEach(p=>piece(p[0],p[1],110,p[2],p[3]));
  x.strokeStyle='#c9951f';x.lineWidth=6;x.strokeRect(40,40,W-80,H-80);x.lineWidth=2;x.strokeRect(58,58,W-116,H-116);
  x.textAlign='center';x.fillStyle='#8a5d00';x.font=`500 26px ${B}`;x.fillText(t('cert.top').toUpperCase().split('').join(' '),W/2,170);
  x.fillStyle='#17282e';x.font=`800 92px ${D}`;x.fillText(t('cert.title'),W/2,280);
  x.fillStyle='#566d67';x.font=`400 32px ${B}`;x.fillText(t('cert.given'),W/2,350);
  x.fillStyle='#2f7d4a';let fs=86;x.font=`700 ${fs}px ${D}`;const nm=heroName();while(x.measureText(nm).width>1100&&fs>40){fs-=4;x.font=`700 ${fs}px ${D}`}x.fillText(nm,W/2,450);
  x.fillStyle='#17282e';x.font=`400 34px ${B}`;
  wrapLines(x,t('cert.for'),1150).forEach((l,i)=>x.fillText(l,W/2,530+i*46));
  const st=strengthsList();
  if(st.length){x.fillStyle='#566d67';x.font=`500 28px ${B}`;x.fillText(t('cert.gifts'),W/2,660);
    x.fillStyle='#17282e';x.font=`500 32px ${B}`;wrapLines(x,st.join(' · '),1200).slice(0,2).forEach((l,i)=>x.fillText(l,W/2,706+i*44))}
  x.fillStyle='#566d67';x.font=`400 28px ${B}`;x.fillText(t('cert.stats',{lvl:lvl(),lname:T(LEVELS[lvl()-1]),sparks:S.sparks,ach:Object.keys(S.ach).length}),W/2,820);
  // seal
  const photo=S.photo&&!S.photoOff?await new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src=S.photo}):null;
  x.save();x.translate(W/2,photo?918:922);x.fillStyle='#f2be3d';x.beginPath();for(let i=0;i<32;i++){const r=photo?(i%2?82:90):(i%2?74:84),a=i/32*Math.PI*2;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fill();
  if(photo){x.fillStyle='#fbfdfb';x.beginPath();x.arc(0,0,76,0,Math.PI*2);x.fill();x.save();x.beginPath();x.arc(0,0,71,0,Math.PI*2);x.clip();x.drawImage(photo,-71,-71,142,142);x.restore()}
  else{x.fillStyle='#fbfdfb';x.beginPath();x.arc(0,0,62,0,Math.PI*2);x.fill();x.fillStyle='#c8445b';x.font=`700 50px ${HB}`;x.fillText('חֵלֶק',0,16)}
  x.restore();
  x.textAlign='left';x.fillStyle='#17282e';x.font=`500 28px ${B}`;x.fillText(fmtDate(S.finished),190,930);
  x.strokeStyle='#b3c7bd';x.lineWidth=2;x.beginPath();x.moveTo(190,945);x.lineTo(560,945);x.stroke();
  x.fillStyle='#566d67';x.font=`400 22px ${B}`;x.fillText(t('cert.date'),190,975);
  x.textAlign='right';x.fillStyle='#17282e';x.font=`italic 500 32px ${B}`;x.fillText(t('cert.keeper'),W-190,930);
  x.beginPath();x.moveTo(W-560,945);x.lineTo(W-190,945);x.stroke();
  x.fillStyle='#566d67';x.font=`400 22px ${B}`;x.fillText(t('cert.sign'),W-190,975);
  x.textAlign='center';x.font=`400 20px ${B}`;x.fillText(t('cert.foot'),W/2,1028);
  // app link and copyright: the printed PDF is this same image
  x.fillStyle='#2f7d4a';x.font=`700 24px ${B}`;x.fillText(`${APP_URL.replace(/^https:\/\//,'')}   ·   ${COPYRIGHT}`,W/2,1058);
  return c.toDataURL('image/png');
}
/* ---------- личный лист: второй лист к сертификату — стих по имени и слово «Айом-йом» по дню рождения ---------- */
/* null, если игрок не указал ни имени на иврите, ни дня рождения */
async function drawPersonalSheet(sc){
  const heb=hebFinals(S.hebName||'').trim(),pv=heb?await personalVerse():null,hy=await personalHayom(),pp=await personalParsha();
  if(!pv&&!hy&&!pp)return null;
  sc=sc||1;const W=1600,H=1130,c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const x=c.getContext('2d');x.scale(sc,sc);
  try{await Promise.all(['700 60px Unbounded','500 30px Onest','500 40px "Frank Ruhl Libre"','700 60px "Frank Ruhl Libre"'].map(f=>document.fonts.load(f)))}catch(e){}
  const D='Unbounded, "Trebuchet MS", sans-serif',B='Onest, "Segoe UI", sans-serif',HB='"Frank Ruhl Libre", serif';
  const GOLD='#b8861b',INK='#1f2a2e',MUTE='#6b6656',LEAF='#2f7d4a';
  // бумага, двойная золотая рамка, ромбы в углах
  x.fillStyle='#fbf6ea';x.fillRect(0,0,W,H);
  const g=x.createRadialGradient(W/2,H/2,200,W/2,H/2,900);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.strokeStyle=GOLD;x.lineWidth=4;x.strokeRect(44,44,W-88,H-88);x.lineWidth=1.2;x.strokeRect(58,58,W-116,H-116);
  const diamond=(cx,cy,r,fill)=>{x.save();x.translate(cx,cy);x.rotate(Math.PI/4);x.fillStyle=fill;x.fillRect(-r,-r,2*r,2*r);x.restore()};
  [[58,58],[W-58,58],[58,H-58],[W-58,H-58]].forEach(([a,b])=>{diamond(a,b,11,'#fbf6ea');x.save();x.translate(a,b);x.rotate(Math.PI/4);x.strokeStyle=GOLD;x.lineWidth=2;x.strokeRect(-11,-11,22,22);x.restore();diamond(a,b,4,GOLD)});
  const rule=(y,half)=>{x.strokeStyle=GOLD;x.lineWidth=1.2;x.beginPath();x.moveTo(W/2-half,y);x.lineTo(W/2-14,y);x.moveTo(W/2+14,y);x.lineTo(W/2+half,y);x.stroke();diamond(W/2,y,5,GOLD)};
  // шапка: подзаголовок, имя героя и имя на иврите
  x.textAlign='center';x.fillStyle=GOLD;x.font=`500 22px ${B}`;x.fillText(t('sheet.kicker').toUpperCase().split('').join(' '),W/2,128);
  let fs=60;x.font=`700 ${fs}px ${D}`;const nm=heroName();while(x.measureText(nm).width>900&&fs>32){fs-=4;x.font=`700 ${fs}px ${D}`}
  x.fillStyle=LEAF;x.fillText(nm,W/2,210);
  let top=250;
  if(heb){x.save();x.direction='rtl';x.fillStyle=GOLD;x.font=`700 52px ${HB}`;x.fillText(heb,W/2,276);x.restore();top=306}
  rule(top,330);
  // панели
  const panels=[];
  const n=[pv,hy,pp].filter(Boolean).length;
  if(pv)panels.push({title:t('cert.verse'),he:'פָּסוּק',text:pv[3],max:[0,58,40,34][n],ref:`${tl('pasuk.books')[pv[0]]||''} ${pv[1]}:${pv[2]}`,href:`${PESUKIM.books[pv[0]]} ${hebNum(pv[1])}, ${hebNum(pv[2])}`,note:t('sheet.verseNote')});
  if(hy)panels.push({title:t('cert.hayom'),he:'הַיּוֹם יוֹם',text:hy.text.replace(/\n/g,' '),max:[0,38,30,26][n],ref:`${t('hy.cite')} · ${hyDate(hy)}`,href:`היום יום, ${hyHebDate(hy)}`,note:t('sheet.hayomNote')});
  if(pp)panels.push({title:t('cert.parsha'),he:'פָּרָשָׁה',text:`פרשת ${parshaHe(pp)}`,max:[0,64,52,44][n],ref:`${parshaName(pp)} · ${parshaRange(pp)}`,href:`שבת ${hebDateStr(rdToHeb(pp.sh))}`,note:t('sheet.parshaNote')});
  const gap=n===3?40:120,pw=n===1?1080:(1360-gap*(n-1))/n,py=top+36,ph=H-120-py;
  panels.forEach((p,k)=>{
    const cx=W/2+((n-1)/2-k)*(pw+gap);   // справа налево, как читают иврит: стих, «Айом-йом», глава
    const l=cx-pw/2;
    x.fillStyle='#fffdf8';x.strokeStyle='#e6d6ac';x.lineWidth=1.5;x.beginPath();x.roundRect(l,py,pw,ph,18);x.fill();x.stroke();
    x.fillStyle=MUTE;x.font=`500 20px ${B}`;x.textAlign='center';x.fillText(p.title.toUpperCase().split('').join(' ').replace(/ {3}/g,'  '),cx,py+52);
    x.save();x.direction='rtl';x.fillStyle=GOLD;x.font=`500 34px ${HB}`;x.fillText(p.he,cx,py+96);x.restore();
    // текст: самый крупный кегль, при котором он помещается в панель
    const tw=pw-90,aTop=py+130,aBot=py+ph-150;
    x.save();x.direction='rtl';x.fillStyle=INK;let f=p.max,lines,lh;
    for(;;){x.font=`500 ${f}px ${HB}`;lines=wrapLines(x,p.text,tw);lh=Math.round(f*1.55);if(lines.length*lh<=aBot-aTop||f<=20)break;f-=2}
    const fit=Math.floor((aBot-aTop)/lh);
    if(lines.length>fit){lines=lines.slice(0,fit);let last=lines[fit-1];while(last&&x.measureText(last+' …').width>tw)last=last.replace(/\s*\S+$/,'');lines[fit-1]=last+' …'}
    const y0=aTop+((aBot-aTop)-lines.length*lh)/2+f;
    lines.forEach((ln,i)=>x.fillText(ln,cx,y0+i*lh));x.restore();
    // ссылка и пояснение
    x.strokeStyle='#e6d6ac';x.lineWidth=1;x.beginPath();x.moveTo(cx-pw/2+60,py+ph-132);x.lineTo(cx+pw/2-60,py+ph-132);x.stroke();
    x.save();x.direction='rtl';x.fillStyle=GOLD;x.font=`500 24px ${HB}`;x.fillText(p.href,cx,py+ph-98);x.restore();
    x.fillStyle=MUTE;x.font=`400 19px ${B}`;x.fillText(p.ref,cx,py+ph-72);
    x.font=`italic 400 17px ${B}`;const nl=wrapLines(x,p.note,pw-80).slice(0,2);nl.forEach((n,i)=>x.fillText(n,cx,py+ph-(nl.length>1?44:30)+i*22));
  });
  for(let k=0;k<n-1;k++){const sx=W/2+((n-1)/2-k-.5)*(pw+gap);x.strokeStyle='#e6d6ac';x.lineWidth=1;x.beginPath();x.moveTo(sx,py+30);x.lineTo(sx,py+ph-30);x.stroke();diamond(sx,py+ph/2,5,GOLD)}
  // подвал
  x.textAlign='center';x.fillStyle=LEAF;x.font=`700 22px ${B}`;x.fillText(`${APP_URL.replace(/^https:\/\//,'')}   ·   ${COPYRIGHT}`,W/2,H-74);
  return c.toDataURL('image/png');
}
function renderFinal(){
  S._last='final';
  if(S.phrase===null){S.phrase=S.insight>=3?0:S.help>=3?2:1;save()}
  const tab=S._tab||'cert';
  const tabs=[['cert',t('final.tabCert'),'scroll'],['path',t('final.tabPath'),'map'],['ach',t('final.tabAch'),'medal']];
  stage.innerHTML=`<section class="scene final-grid">
    <div class="final-hero"><div class="final-m">${mentorSvg('joy')}</div><div><span class="kicker">${t('final.kicker',{name:esc(heroName())})}</span><h1 class="h1">${t('final.h1a')} <span class="c-pome">${t('final.h1b')}</span></h1>
    <p class="lead">${t('final.lead')}</p></div></div>
    <div class="tabs" role="tablist" aria-label="${t('final.tabs')}">${tabs.map(t=>`<button class="tab ${tab===t[0]?'on':''}" role="tab" id="tab-${t[0]}" aria-selected="${tab===t[0]}" aria-controls="tabp" data-tab="${t[0]}">${icon(t[2])}<span>${t[1]}</span></button>`).join('')}</div>
    <div id="tabp" role="tabpanel" aria-labelledby="tab-${tab}" class="final-grid">${({cert:finalCert,path:finalPath,ach:finalAch})[tab]()}</div>
    <div class="actions"><button class="btn" id="map">${t('final.backMap')}</button><button class="btn ghost" id="again">${t('final.again')}</button></div>
    <div id="conf"></div>
    <button class="linkbtn shablink" id="lotbtn">${icon('scroll')} ${t('door.lH')}</button>
    <button class="linkbtn shablink" id="shabbtn">${icon('candles')} ${t('shab.open')}</button>
    ${adult()?`<button class="linkbtn shablink" id="galbtn">${icon('palette')} ${t('gal.open')}</button>`:''}
    <p class="foot">${t('final.foot')}</p>
  </section>`;
  stage.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{S._tab=b.dataset.tab;save();sfx.tap();renderFinal();const t=$('#tab-'+S._tab);if(t)t.focus()});
  stage.querySelector('.tabs').onkeydown=e=>{const i=tabs.findIndex(t=>t[0]===tab);const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;S._tab=tabs[(i+d+tabs.length)%tabs.length][0];renderFinal();$('#tab-'+S._tab).focus()};
  ({cert:wireCert,path:wirePath,ach:()=>{}})[tab]();
  $('#map').onclick=()=>go('map');
  $('#shabbtn').onclick=()=>{sfx.tap();openShabbat()};
  $('#lotbtn').onclick=()=>{sfx.tap();openLot()};
  const gb=$('#galbtn');if(gb)gb.onclick=()=>{sfx.tap();openGallery()};
  $('#again').onclick=()=>{$('#conf').innerHTML=`<div class="confirm"><p>${t('final.confirm')}</p><div class="actions"><button class="btn small" id="yes">${t('btn.yes')}</button><button class="btn ghost small" id="no">${t('btn.cancel')}</button></div></div>`;
    $('#yes').onclick=()=>{const snd=S.sound;S=fresh();S.sound=snd;save();go('create')};$('#no').onclick=()=>{$('#conf').innerHTML=''}};
}
function finalCert(){
  return `<article class="card cert-card"><div class="cert-head"><span class="kicker">${t('cert.kicker')}</span><span class="muted fs-sm">${fmtDate(S.finished)}</span></div>
      <div class="field"><label for="certname">${t('cert.nameLabel')}</label><input id="certname" maxlength="24" autocomplete="off" placeholder="${esc(t('hero.default'))}" value="${esc(S.hero.name)}"></div>
      ${S.photo?`<div class="cert-photo"><img src="${S.photo}" alt=""><label class="cert-pt"><input type="checkbox" id="photoon" ${S.photoOff?'':'checked'}> <span>${t('cert.photoOn')}</span></label><button class="btn ghost small" id="photodel">${t('cert.photoDel')}</button></div>`:`<p class="muted fs-sm">${icon('mirror')} ${t('cert.photoHint')}</p>`}
      ${(S.hebName||'').trim()?'':`<p class="muted fs-sm">${icon('scroll')} ${t('cert.verseHint')} <button class="linkbtn" id="certverse">${t('door.lH')}</button></p>`}
      ${bdayHeb()?'':`<p class="muted fs-sm">${icon('candles')} ${t('cert.hayomHint')} <button class="linkbtn" id="certhayom">${t('door.lH')}</button></p>`}
      <div class="cert-frame" id="cert"><p class="muted">${t('cert.loading')}</p></div>
      <div class="cert-frame" id="cert2" hidden></div>
      <div class="actions"><button class="btn" id="print">${icon('scroll')}<span>${t('cert.print')}</span></button><a class="btn ghost" id="dl" download="${t('cert.file')}" href="#">${t('cert.download')}</a><a class="btn ghost" id="dl2" download="${t('sheet.file')}" href="#" hidden>${t('sheet.download')}</a></div>
      <p class="muted fs-sm" id="printnote">${t('cert.note')}</p></article>`;
}
function wireCert(){
  let tok=0;const paint=async()=>{const my=++tok;const url=await drawCertificate(),u2=await drawPersonalSheet();if(my!==tok||!$('#cert'))return;
    $('#cert').innerHTML=`<img src="${url}" alt="${t('cert.alt',{name:esc(heroName())})}">`;$('#dl').href=url;
    const c2=$('#cert2'),d2=$('#dl2');c2.hidden=d2.hidden=!u2;
    if(u2){c2.innerHTML=`<img src="${u2}" alt="${t('sheet.alt',{name:esc(heroName())})}">`;d2.href=u2}};
  paint();
  const pon=$('#photoon');if(pon)pon.onchange=()=>{S.photoOff=!pon.checked;save();paint()};
  const cv=$('#certverse');if(cv)cv.onclick=()=>{sfx.tap();openLot('name')};
  const ch=$('#certhayom');if(ch)ch.onclick=()=>{sfx.tap();openLot('date')};
  const pdel=$('#photodel');if(pdel)pdel.onclick=()=>{delete S.photo;delete S.photoOff;save();sfx.tap();renderFinal()};
  let tm;$('#certname').oninput=e=>{S.hero.name=e.target.value;save();clearTimeout(tm);tm=setTimeout(paint,350)};
  $('#dl').onclick=e=>{if($('#dl').getAttribute('href')==='#')e.preventDefault()};
  $('#dl2').onclick=e=>{if($('#dl2').getAttribute('href')==='#')e.preventDefault()};
  $('#print').onclick=async()=>{const b=$('#print');b.disabled=true;
    try{shabPrintDone();const url=await drawCertificate(2),u2=await drawPersonalSheet(2);const pr=$('#print-area');
      pr.innerHTML=`<img src="${url}" alt="">${u2?`<img src="${u2}" alt="">`:''}`;
      await Promise.all([...pr.querySelectorAll('img')].map(im=>new Promise(r=>{if(im.complete)r();else{im.onload=r;im.onerror=r}})));
      applyCss(document.body);window.print();
    }catch(e){$('#printnote').textContent=t('cert.noPrint')}
    b.disabled=false};
}
function finalPath(){
  const strengths=strengthsList(),rep=worldReport();
  return `<div class="duo">
      <div class="card"><span class="kicker">${t('path.gifts')}</span><div class="strengths">${strengths.map(x=>`<span>${esc(x)}</span>`).join('')||`<span>${t('path.none')}</span>`}</div></div>
      <div class="card"><span class="kicker">${t('path.step')}</span><p class="h2 fs-lg">${esc(S.ans.weekly||t('path.stepDefault'))}</p><p class="muted">${t('path.stepNote')}</p></div>
    </div>
    <div class="card"><span class="kicker">${t('path.phrase')}</span><p class="phrase" id="ph">${esc(T(PHRASES[S.phrase]))}</p><div class="actions"><button class="btn ghost small" id="nph">${t('path.otherPhrase')}</button><button class="btn ghost small" id="cp">${t('path.copy')}</button></div></div>
    <section class="report"><div><span class="kicker">${t('path.report')}</span><h2 class="h2">${t('path.reportTitle')}</h2>
      <p class="muted fs-15">${t('path.dates',{a:fmtDate(S.started),b:fmtDate(S.finished)})}</p></div>
      <div class="rgrid">${rep.map((r,i)=>`<article class="rcard"><div class="rtop"><span class="rnum">${i+1}</span><b>${esc(r[0])}</b></div><p>${esc(r[1])}</p><p class="disc"><span>${t('path.discovery')}</span>${esc(r[2])}</p></article>`).join('')}</div>
    </section>
    <div class="card"><span class="kicker">${t('path.solve')}</span><p>${t('path.solveText')}</p></div>
    <div class="card talk-card"><span class="kicker">${t('path.talk')}</span>
      <ol>${(tl('path.questions')||[]).map(q=>`<li>${q}</li>`).join('')}</ol></div>`;
}
function wirePath(){
  $('#nph').onclick=()=>{S.phrase=(S.phrase+1)%PHRASES.length;save();$('#ph').textContent=T(PHRASES[S.phrase]);sfx.tap()};
  $('#cp').onclick=()=>{const phrase=T(PHRASES[S.phrase]);const ok=()=>{$('#cp').textContent=t('path.copied')};
    try{navigator.clipboard.writeText(phrase).then(ok,()=>{selectText($('#ph'))})}catch(e){selectText($('#ph'))}};
}
function finalAch(){
  return `<div class="stats">
      <div class="statcard"><span class="k">${t('stat.sparks')}</span><b>${S.sparks}</b></div>
      <div class="statcard"><span class="k">${t('stat.level')}</span><b>${lvl()}</b><small>${T(LEVELS[lvl()-1])}</small></div>
      <div class="statcard"><span class="k">${t('stat.pieces')}</span><b>${S.done.filter(Boolean).length}/7</b></div>
      <div class="statcard"><span class="k">${t('stat.ach')}</span><b>${Object.keys(S.ach).length}/6</b></div>
    </div>
    <div class="card"><span class="kicker">${t('ach.collection')}</span>${achGrid()}<p class="muted fs-sm">${t('ach.note')}</p></div>`;
}
function selectText(el){try{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}

/* ---------- озвучка (для младших) ---------- */
function canSpeak(){return Voice.can()}
function stopReading(){if(Voice.reading)Voice.cancel();const b=stage.querySelector('[data-read]');if(b)b.innerHTML=icon('sound')+`<span>${t('read.listen')}</span>`}
function readAloud(btn){
  if(!canSpeak())return;
  if(Voice.reading){stopReading();return}
  const sel='.bubble .txt, .card .h2, .card p, .reveal .h1, .resp p, .wi b, .wi p, .lead, p.h2, .opt:not(.dim) .ot > span';
  const parts=[...stage.querySelectorAll(sel)].filter(el=>!el.closest('[lang="he"]')).map(el=>el.innerHTML.trim()).filter(Boolean);
  if(!parts.length)return;
  const idle=()=>{if(btn&&btn.isConnected)btn.innerHTML=icon('sound')+`<span>${t('read.listen')}</span>`};
  btn.innerHTML=icon('stop')+`<span>${t('read.stop')}</span>`;
  Audio_.unlocked=true;unlockAudio();
  /* false — браузер не дал звуку начаться */
  Voice.say(parts,{force:true,reading:true}).then(ok=>{idle();if(ok===false)toast('mute',t('toast.soundBlocked'),t('toast.soundBlockedSub'))});
}
stage.addEventListener('click',e=>{const b=e.target.closest('[data-read]');if(b)readAloud(b)});

/* ---------- boot ---------- */
function start(data){
  load();
  if(data&&data.state&&data.state.v===1)S=Object.assign(fresh(),data.state);
  if(['shabbat','pasuk','hayom','gallery','admin','lot'].includes(S.screen))S.screen='title';
  if(S.screen!=='title'&&S.screen!=='create'){S._last=S.screen;S.screen='title'}
  render();
  showGate(()=>{});
}
window.claude?.hot?.snapshot?.(()=>({state:S}));
/* тексты могут прийти раньше, чем выполнены shabbat.js и pasuk.js — ждём и их */
const DOM_READY=document.readyState==='loading'?new Promise(r=>document.addEventListener('DOMContentLoaded',r,{once:true})):Promise.resolve();
Promise.all([window.GAME_DATA_READY,DOM_READY,ART_READY]).then(()=>{
  window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
}).catch(()=>{
  const [h,p]=LOAD_ERROR[LANG]||LOAD_ERROR[DEFAULT_LANG];stage.innerHTML=`<section class="scene"><h1 class="h2">${h}</h1><p>${p}</p></section>`;
});
