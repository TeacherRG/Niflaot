/* «К Шабату»: листы A4 для печати — настольная игра, карточки вопросов, «Найди пару»,
   «Моя деталь пазла» и семейный пазл. В Шабат телефон не нужен: всё на бумаге.
   Тексты — ключи shab.* в locales (не озвучиваются), страница — HTML в мм, печать через #print-area. */
const SHAB_ITEMS = ['board','rules','cards','memory','piece','family'];
const SHAB_AGES = {y:'create.ageY',t:'create.ageT',a:'create.ageA'};
/* карточка вопроса → мир (иконка): по две на Город, Пазл, Братьев, Лабораторию и Финал */
const CARD_WORLD = [0,0,1,1,2,3,3,4,5,5,6,6];

/* raw-значение из локали с возрастом листа (а не героя) */
function shabAge(){return S.shabAge||S.hero.age||'t'}
function RA(v,ag){
  if(typeof v==='string')return T(v);
  if(Array.isArray(v))return v.map(x=>RA(x,ag));
  if(v&&typeof v==='object'){if(v.__ag)return RA(ag==='y'?v.y:ag==='a'&&'a' in v?v.a:v.t,ag);const o={};for(const k in v)o[k]=RA(v[k],ag);return o}
  return v;
}
const tla=(k,ag)=>RA(UI[k]??UI_BASE[k],ag);
/* иконка из ICONS внутри листа: свой класс, чтобы размер задавал лист, а не .ico */
const pic=(name,cls)=>`<svg class="pi ${cls||''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]||''}</svg>`;

function ppPage(kind,title,sub,body){
  return `<article class="pp pp-${kind}">
    <header class="pp-head"><span class="pp-k">${pic('candles')}${esc(t('title.h1a')+' '+t('title.h1b'))} · ${esc(t('shab.brand'))}</span>
      <h1>${esc(title)}</h1>${sub?`<p>${esc(sub)}</p>`:''}</header>
    <div class="pp-body">${body}</div>
    <footer class="pp-foot">${APP_URL.replace(/^https:\/\//,'')} · ${COPYRIGHT}</footer></article>`;
}
const cutMark=()=>`<p class="pp-cut">${pic('scissors')}<span>${esc(t('shab.cut'))}</span></p>`;

/* ---------- 1. Игровое поле: 36 клеток змейкой 6×6 ---------- */
const BOARD_N=36, BOARD_COLS=6;
function boardCell(i){
  if(i===0)return 'start';
  if(i%5===0)return 's';
  if([2,7,12,17,22,27,32].includes(i))return 'q';
  if([4,14,24,33].includes(i))return 'h';
  if([9,19,29].includes(i))return 'l';
  return '';
}
function boardPos(i){const r=Math.floor(i/BOARD_COLS),c=r%2?BOARD_COLS-1-i%BOARD_COLS:i%BOARD_COLS;return {r,c}}
function pageBoard(){
  const rows=BOARD_N/BOARD_COLS,W=100/BOARD_COLS,H=100/rows;
  const ctr=i=>{const p=boardPos(i);return [(p.c+.5)*W,(p.r+.5)*H]};
  let road='';for(let i=1;i<BOARD_N;i++){const [x0,y0]=ctr(i-1),[x1,y1]=ctr(i);road+=`M${x0} ${y0}L${x1} ${y1}`}
  const cells=[];
  for(let i=0;i<BOARD_N;i++){
    const k=boardCell(i),p=boardPos(i),st=`left:${p.c*W}%;top:${p.r*H}%;width:${W}%;height:${H}%`;
    let inner='';
    if(k==='start')inner=`${pic('book','big')}<b>${esc(t('shab.board.start'))}</b><small>${esc(t('map.proName'))}</small>`;
    else if(k==='s'){const w=i/5-1,th=THEMES[WORLD_THEME[w]];
      inner=`<span class="bc-n">${w+1}</span>${pic(WORLD_ICON[w],'big')}<b>${esc(WORLDS[w].name)}</b>${i===BOARD_N-1?`<small>${esc(t('shab.board.finish'))}</small>`:''}<svg class="bc-slot" viewBox="0 0 100 100" aria-hidden="true"><path d="${PIECE}"/></svg>`;
      cells.push(`<div class="bc s" data-css="${st};--c:${th.accent}">${inner}</div>`);continue}
    else if(k==='q')inner=`<span class="bc-q">?</span>`;
    else if(k==='h')inner=pic('heart','big');
    else if(k==='l')inner=pic('candles','big');
    cells.push(`<div class="bc ${k}" data-css="${st}"><span class="bc-i">${i}</span>${inner}</div>`);
  }
  const L=tla('shab.board.legend');
  const legend=`<ul class="pp-legend"><li><span class="bc-q">?</span>${esc(L.q)}</li><li>${pic('heart')}${esc(L.h)}</li><li>${pic('candles')}${esc(L.l)}</li><li><i class="lg-s"></i>${esc(L.s)}</li></ul>`;
  return ppPage('board',t('shab.board.h'),t('shab.board.sub'),
    `<div class="pboard"><svg class="pboard-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${road}"/></svg>${cells.join('')}</div>${legend}`);
}

/* ---------- 2. Правила, фишки, детали пазла и бумажный кубик ---------- */
function dieNet(){
  const s=20,pips={1:[[.5,.5]],2:[[.27,.27],[.73,.73]],3:[[.27,.27],[.5,.5],[.73,.73]],4:[[.27,.27],[.73,.27],[.27,.73],[.73,.73]],5:[[.27,.27],[.73,.27],[.5,.5],[.27,.73],[.73,.73]],6:[[.27,.25],[.73,.25],[.27,.5],[.73,.5],[.27,.75],[.73,.75]]};
  /* крест 3×4: столбец 1 — 1,2,6,5; по бокам второй строки — 3 и 4 (противоположные грани дают 7) */
  const faces=[[1,0,1],[1,1,2],[1,2,6],[1,3,5],[0,1,3],[2,1,4]];
  const o=6;/* поле для клапанов */
  const tab=(x0,y0,x1,y1,nx,ny)=>{const d=5,k=.22,ax=x0+(x1-x0)*k,ay=y0+(y1-y0)*k,bx=x1-(x1-x0)*k,by=y1-(y1-y0)*k;
    return `<path class="tab" d="M${x0} ${y0}L${ax+nx*d} ${ay+ny*d}L${bx+nx*d} ${by+ny*d}L${x1} ${y1}"/>`};
  const X=c=>o+c*s,Y=r=>o+r*s;
  let g='';
  /* клапаны: три свободных края у боковых граней и нижний край последней */
  g+=tab(X(0),Y(1),X(1),Y(1),0,-1)+tab(X(0),Y(1),X(0),Y(2),-1,0)+tab(X(0),Y(2),X(1),Y(2),0,1);
  g+=tab(X(2),Y(1),X(3),Y(1),0,-1)+tab(X(3),Y(1),X(3),Y(2),1,0)+tab(X(2),Y(2),X(3),Y(2),0,1);
  g+=tab(X(1),Y(4),X(2),Y(4),0,1);
  for(const [c,r,n] of faces){g+=`<rect class="face" x="${X(c)}" y="${Y(r)}" width="${s}" height="${s}"/>`;
    for(const [px,py] of pips[n])g+=`<circle cx="${X(c)+px*s}" cy="${Y(r)+py*s}" r="1.9"/>`}
  return `<svg class="die" viewBox="0 0 ${3*s+2*o} ${4*s+2*o}" aria-hidden="true">${g}</svg>`;
}
function tentToken(i){
  const av=avatar({look:i%LOOKS.length,outfit:i%OUTFITS.length,arch:i%ARCHS.length,g:i%2?'f':'m'});
  return `<div class="tok"><div class="tok-h flip">${av}</div><div class="tok-h">${av}</div></div>`;
}
function pageRules(){
  const rules=tla('shab.rules.list'),st=tla('shab.rules.st');
  return ppPage('rules',t('shab.rules.h'),'',
    `<div class="rules-top"><div>
      <p class="pp-need">${esc(t('shab.rules.need'))}</p>
      <ol class="pp-steps">${rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol>
      <h2>${esc(t('shab.rules.stH'))}</h2>
      <ol class="pp-st">${st.map((s,i)=>`<li><b>${esc(WORLDS[i].name)}.</b> ${esc(s)}</li>`).join('')}</ol>
    </div><div class="die-box"><h3>${esc(t('shab.rules.die'))}</h3>${dieNet()}</div></div>
    ${cutMark()}
    <h3>${esc(t('shab.rules.tokens'))}</h3><div class="toks">${[0,1,2,3,4,5].map(tentToken).join('')}</div>
    <h3>${esc(t('shab.rules.pieces'))}</h3><div class="wpieces">${WORLDS.map((w,i)=>`<div class="wpiece" data-css="--c:${THEMES[WORLD_THEME[i]].accent}"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="${PIECE}"/></svg>${pic(WORLD_ICON[i])}<span>${i+1}</span></div>`).join('')}</div>`);
}

/* ---------- 3. Вопросы к субботнему столу: 12 карточек ---------- */
function pageCards(){
  const ag=shabAge(),list=tla('shab.cards.list',ag);
  return ppPage('cards',t('shab.cards.h'),t('shab.cards.sub'),
    `<p class="pp-age">${esc(t('shab.cards.age',{age:t(SHAB_AGES[ag])}))}</p>
    <div class="qcards">${list.map((q,i)=>{const w=CARD_WORLD[i];return `<div class="qcard" data-css="--c:${THEMES[WORLD_THEME[w]].accent}">
      <div class="qc-top"><span class="qc-n">${i+1}</span>${pic(WORLD_ICON[w])}<small>${esc(WORLDS[w].name)}</small></div><p>${esc(q)}</p></div>`}).join('')}</div>`);
}

/* ---------- 4. «Найди пару»: иврит ↔ перевод ---------- */
function pageMemory(){
  const pairs=tla('shab.memory.pairs');
  const he=pairs.map((p,i)=>`<div class="mcard he"><p lang="he" dir="rtl">${esc(p.he)}</p><small>${esc(p.src)}</small></div>`);
  const tr=pairs.map((p,i)=>`<div class="mcard tr"><p>${esc(p.tr)}</p><small>${esc(p.src)}</small></div>`);
  /* переводы в другом порядке, чтобы пары не стояли столбиком */
  const order=[3,6,0,5,7,2,4,1];
  return ppPage('memory',t('shab.memory.h'),t('shab.memory.sub'),`<div class="mcards">${he.join('')}${order.map(i=>tr[i]).join('')}</div>`);
}

/* ---------- 5. Моя деталь пазла ---------- */
function pagePiece(){
  const zone=(k,ic)=>`<div class="pz"><b>${pic(ic)}${esc(t('shab.piece.'+k))}</b><i></i><i></i><i></i><i></i></div>`;
  return ppPage('piece',t('shab.piece.h'),t('shab.piece.sub'),
    `<p class="pp-name">${esc(t('shab.piece.name'))}: <i></i></p>
    <div class="bigpiece"><svg viewBox="2 2 96 96" aria-hidden="true"><path d="${PIECE}"/></svg>
      <div class="pz-grid">${zone('can','hammer')}${zone('like','heart')}${zone('help','helphand')}${zone('step','compass')}</div>
      <span class="pz-heb" lang="he">חֵלֶק</span></div>`);
}

/* ---------- 6. Пазл нашей семьи: 4×3 детали с замками ---------- */
function jigEdge(ax,ay,bx,by,d,m){
  /* от A к B; d — куда выступает замок (±1 по нормали), m — размер детали */
  const L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,nx=-uy*d,ny=ux*d;
  const mx=(ax+bx)/2,my=(ay+by)/2,w=m*.1,h=m*.24,f=v=>v.toFixed(2);
  return `L${f(mx-ux*w)} ${f(my-uy*w)}C${f(mx-ux*w*2.6+nx*h)} ${f(my-uy*w*2.6+ny*h)} ${f(mx+ux*w*2.6+nx*h)} ${f(my+uy*w*2.6+ny*h)} ${f(mx+ux*w)} ${f(my+uy*w)}L${f(bx)} ${f(by)}`;
}
function pageFamily(){
  const C=4,Rw=3,cw=46.5,ch=70,W=C*cw,H=Rw*ch,m=Math.min(cw,ch);
  let d='';
  for(let r=1;r<Rw;r++){d+=`M0 ${r*ch}`;for(let c=0;c<C;c++)d+=jigEdge(c*cw,r*ch,(c+1)*cw,r*ch,(r+c)%2?1:-1,m)}
  for(let c=1;c<C;c++){d+=`M${c*cw} 0`;for(let r=0;r<Rw;r++)d+=jigEdge(c*cw,r*ch,c*cw,(r+1)*ch,(r*3+c)%2?1:-1,m)}
  const cells=[];for(let r=0;r<Rw;r++)for(let c=0;c<C;c++){const k=r*C+c;
    cells.push(`<div class="fcell" data-css="left:${c/C*100}%;top:${r/Rw*100}%;width:${100/C}%;height:${100/Rw}%"><span>${esc(t('shab.family.name'))}:</span><i></i>${pic(['heart','star','sparkle','home','dove'][k%5]||'heart','ghost')}</div>`)}
  return ppPage('family',t('shab.family.h'),t('shab.family.sub'),
    `<div class="fam" data-css="aspect-ratio:${W}/${H}"><svg viewBox="-1 -1 ${W+2} ${H+2}" aria-hidden="true"><rect x="0" y="0" width="${W}" height="${H}" rx="3"/><path d="${d}"/></svg>${cells.join('')}</div>${cutMark()}`);
}

const SHAB_PAGES={board:pageBoard,rules:pageRules,cards:pageCards,memory:pageMemory,piece:pagePiece,family:pageFamily};

/* ---------- экран «К Шабату» ---------- */
function openShabbat(){if(S.screen!=='shabbat')S.shabFrom=S.screen;go('shabbat')}
function renderShabbat(){
  const sel=S.shabSel||SHAB_ITEMS,ag=shabAge(),items=tl('shab.items');
  const n=SHAB_ITEMS.filter(k=>sel.includes(k)).length;
  stage.innerHTML=`<section class="scene shab">
    <div><button class="btn ghost small" id="shback">${t('shab.back')}</button></div>
    <span class="kicker">${icon('candles')} ${t('shab.kicker')}</span>
    <h2 class="h2">${t('shab.title')}</h2>
    <p class="lead">${t('shab.lead')}</p>
    <p class="shab-note">${icon('info')}<span>${t('shab.note')}</span></p>
    <div class="group"><h3 id="shage-l">${t('shab.age')}</h3><div class="seg three" role="group" aria-labelledby="shage-l">${Object.keys(SHAB_AGES).map(a=>`<button class="segb ${a===ag?'on':''}" data-shage="${a}" aria-pressed="${a===ag}">${t(SHAB_AGES[a])}</button>`).join('')}</div></div>
    <div class="group"><h3>${t('shab.pick')}</h3>
    <div class="shab-list">${SHAB_ITEMS.map(k=>`<div class="shab-item ${sel.includes(k)?'on':''}">
      <button class="shab-thumb" data-view="${k}" aria-label="${esc(items[k].t)}"><span class="pp-scale">${SHAB_PAGES[k]()}</span></button>
      <label class="shab-lbl"><input type="checkbox" data-it="${k}" ${sel.includes(k)?'checked':''}><span><b>${esc(items[k].t)}</b><small>${esc(items[k].s)}</small></span></label></div>`).join('')}</div></div>
    <div class="actions"><button class="btn" id="shprint" ${n?'':'disabled'}>${icon('scroll')}<span>${t('shab.print')}</span></button><span class="muted" id="shcount">${n?t('shab.count',{n}):t('shab.none')}</span></div>
    <p class="muted fs-sm" id="shnote" aria-live="polite"></p>
  </section>`;
  const keep=()=>{const y=window.scrollY;renderShabbat();window.scrollTo(0,y)};
  $('#shback').onclick=()=>{sfx.tap();go(S.shabFrom&&S.shabFrom!=='shabbat'?S.shabFrom:'title')};
  stage.querySelectorAll('[data-shage]').forEach(b=>b.onclick=()=>{S.shabAge=b.dataset.shage;sfx.tap();save();keep();const f=stage.querySelector(`[data-shage="${S.shabAge}"]`);if(f)f.focus({preventScroll:true})});
  stage.querySelectorAll('[data-it]').forEach(c=>c.onchange=()=>{
    S.shabSel=[...stage.querySelectorAll('[data-it]:checked')].map(x=>x.dataset.it);save();sfx.tap();keep();
    const f=stage.querySelector(`[data-it="${c.dataset.it}"]`);if(f)f.focus({preventScroll:true})});
  stage.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{sfx.tap();viewPage(b.dataset.view)});
  $('#shprint').onclick=()=>printShabbat(SHAB_ITEMS.filter(k=>(S.shabSel||SHAB_ITEMS).includes(k)));
}
/* крупный просмотр одного листа */
function viewPage(k){
  openSheet('shab-view',esc(tl('shab.items')[k].t),()=>`<div class="pp-fit"><span class="pp-scale">${SHAB_PAGES[k]()}</span></div>`,
    m=>{const fit=m.querySelector('.pp-fit');const sc=()=>fit.style.setProperty('--s',fit.clientWidth/710.6);sc();requestAnimationFrame(sc)});
}
async function printShabbat(keys){
  if(!keys.length)return;
  const b=$('#shprint');if(b)b.disabled=true;
  try{
    const pr=$('#print-area');pr.innerHTML=keys.map(k=>SHAB_PAGES[k]()).join('');pr.classList.add('pp-print');
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    window.addEventListener('afterprint',shabPrintDone,{once:true});
    applyCss(document.body);window.print();
  }catch(e){const n=$('#shnote');if(n)n.textContent=t('shab.noPrint')}
  if(b)b.disabled=false;
}
function shabPrintDone(){const pr=$('#print-area');if(pr)pr.classList.remove('pp-print')}
