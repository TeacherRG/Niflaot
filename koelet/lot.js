/* «Мой удел в Торе» — вторая половина игры наравне с квестом. «וְתֵן חֶלְקֵנוּ בְּתוֹרָתֶךָ» (Пиркей авот 5:20):
   квест — что ты делаешь со своим уделом, здесь — где он записан. Нужны только имя на иврите и день рождения;
   мастер спрашивает их по одному (S.lotStep 'name' → 'date', любой шаг можно пропустить, S.lotDone), потом
   Хранитель открывает три свитка: 1) стих имени (pasuk.js), 2) «Айом-йом» на день рождения (hayomyom.js),
   3) глава рождения — недельная глава субботы той недели, когда родился (на эту субботу или ближайшую после);
   если на ту субботу выпал праздник и недельной главы не было — предыдущая глава. Расписание глав —
   data/parsha.json (tools/build-parsha.mjs, по типам года, Израиль и заграница отдельно), тексты о главах —
   content/<lang>/parsha.json (пишет автор, пустые поля не показываются). Всё остаётся на устройстве.
   Тексты — lot.* и parsha.names в locales. */

/* ---------- глава рождения: расчёт ---------- */
let PARSHA=null,parshaLoad=null,PARSHA_TXT=null,parshaTxtLoad=null;
function loadParsha(){
  if(!parshaLoad)parshaLoad=fetch('data/parsha.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>PARSHA=d)
    .catch(e=>{parshaLoad=null;throw e});
  return parshaLoad;
}
/* тексты о главах — на языке игры; если файла нет, глава показывается без них */
function loadParshaTexts(){
  if(!parshaTxtLoad||parshaTxtLoad.lang!==LANG){
    const lang=LANG;
    parshaTxtLoad=fetch(`content/${lang}/parsha.json`).then(r=>r.ok?r.json():{}).catch(()=>({})).then(d=>{if(lang===LANG)PARSHA_TXT=d;return d});
    parshaTxtLoad.lang=lang;
  }
  return parshaTxtLoad;
}
const SHABBAT=6;   // R.D. % 7: 0 — воскресенье … 6 — суббота
const nextShabbat=rd=>rd+((SHABBAT-rd%7)+7)%7;
/* еврейский год, в котором лежит день rd */
function hebYearOf(rd){
  let y=Math.floor((rd-HEB_EPOCH)/365.2468)+1;
  while(rd>=hebNewYear(y+1))y++;
  while(rd<hebNewYear(y))y--;
  return y;
}
/* R.D. → {y, m (индекс месяца книги «Айом-йом»), d, leap} */
function rdToHeb(rd){
  const y=hebYearOf(rd);let left=rd-hebNewYear(y);
  for(const [m,n] of hebMonths(y)){if(left<n)return {y,m,d:left+1,leap:hebLeap(y)};left-=n}
  return null;
}
/* что читали в эту субботу: номер главы, [a, b] (две вместе) или null — праздник */
function parshaOnShabbat(sh,il){
  const y=hebYearOf(sh),rh=hebNewYear(y),list=PARSHA[il?'il':'d'][`${rh%7}-${hebNewYear(y+1)-rh}`];
  if(!list)return null;
  const v=list[(sh-nextShabbat(rh))/7];
  return v===undefined?null:v;
}
/* глава недели дня rd: суббота в этот день или ближайшая после; праздничная суббота → предыдущая глава */
function parshaOf(rd,il){
  const first=nextShabbat(rd);
  for(let sh=first;sh>first-7*8;sh-=7){
    const p=parshaOnShabbat(sh,il);
    if(p!=null)return {p:[].concat(p),sh,moved:sh!==first,holiday:first};
  }
  return null;
}
/* день рождения в R.D. или null (еврейской дате нужен год) */
function birthRD(){
  const b=S.bday;if(!b)return null;
  if(b.mode==='h'){
    const y=+b.hy;if(!b.hd||b.hm==null||b.hm===''||!(y>=3762&&y<=6500))return null;
    const want=b.hm==='adar'||(+b.hm===5&&!hebLeap(y))?6:+b.hm;
    let rd=hebNewYear(y);
    for(const [m,n] of hebMonths(y)){if(m===want)return rd+Math.min(+b.hd,n)-1;rd+=n}
    return null;
  }
  const m=(b.g||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;
  return gregRD(+m[1],+m[2],+m[3])+(b.sunset?1:0);
}
/* глава рождения для свитка и личного листа: {p, sh, moved} или null */
async function personalParsha(){
  const rd=birthRD();if(rd==null)return null;
  try{await loadParsha()}catch(e){return null}
  return parshaOf(rd,!!(S.bday&&S.bday.il));
}
const HEB_MONTH=['תשרי','חשון','כסלו','טבת','שבט','אדר א׳','אדר ב׳','ניסן','אייר','סיון','תמוז','אב','אלול'];
const hebDateStr=h=>`${hebNum(h.d)} ${h.m===6&&!h.leap?'אדר':HEB_MONTH[h.m]} ${hebYearStr(h.y)}`;
function hebYearStr(y){const n=y%1000,h=['','ק','ר','ש','ת','תק','תר','תש','תת','תתק'][Math.floor(n/100)],r=n%100;
  let s=h+(r===15?'טו':r===16?'טז':['','י','כ','ל','מ','נ','ס','ע','פ','צ'][Math.floor(r/10)]+['','א','ב','ג','ד','ה','ו','ז','ח','ט'][r%10]);
  return s.length>1?s.slice(0,-1)+'״'+s.slice(-1):s+'׳'}
const parshaHe=pp=>pp.p.map(i=>PARSHA.he[i]).join('־');
const parshaName=pp=>pp.p.map(i=>(tl('parsha.names')||[])[i]||PARSHA.he[i]).join(' – ');
function parshaRange(pp){
  const a=PARSHA.ranges[pp.p[0]],b=PARSHA.ranges[pp.p.at(-1)];
  return `${tl('pasuk.books')[a[0]]||''} ${a[1]}:${a[2]}–${b[3]}:${b[4]}`;
}
/* гражданская дата дня rd на языке игры */
function rdDate(rd){try{return new Date((rd-gregRD(1970,1,1))*864e5).toLocaleDateString(langLocale(),{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}catch(e){return ''}}
/* текст автора о главе: строка или {__ag, y, t, a} — пустое не показываем */
function parshaText(v){
  if(v&&typeof v==='object'&&v.__ag)v=young()?v.y:adult()&&v.a?v.a:v.t;
  return typeof v==='string'&&v.trim()?T(v):'';
}

/* ---------- что уже есть: три печати ---------- */
const lotHas=()=>({verse:hebFinals(S.hebName||'').trim().split(' ')[0].length>=2,hayom:!!bdayHeb(),parsha:birthRD()!=null});
const lotCount=()=>Object.values(lotHas()).filter(Boolean).length;
function lotSeals(){const h=lotHas();return `<span class="lot-seals" aria-label="${esc(t('lot.seals',{n:lotCount()}))}">${['verse','hayom','parsha'].map(k=>`<i class="${h[k]?'on':''}"></i>`).join('')}</span>`}

/* ---------- экран ---------- */
function openLot(step){
  if(!['lot','create'].includes(S.screen))S.lotFrom=S.screen;
  if(!S.hero.age||!S.hero.g){S.createFor='lot';go('create');return}   // сначала — кто ты (тот же экран, что у квеста)
  const done=S.lotDone||(S.lotDone={});
  // имя или дату уже ввели в «Зеркале», «Твоём стихе» или «Айом-йом» — этот шаг не повторяем
  if((S.hebName||'').trim())done.name=1;
  if(birthRD()!=null||bdayHeb())done.date=1;
  S.lotStep=step||(!done.name?'name':!done.date?'date':null);
  go('lot');
}
function lotNext(){
  const done=S.lotDone||(S.lotDone={});
  if(S.lotStep)done[S.lotStep]=1;
  S.lotStep=!done.name?'name':!done.date?'date':null;
  if(!S.lotStep)S.lotReveal=true;   // Хранитель открывает свитки по одному
  sfx.good();save();render();window.scrollTo({top:0,behavior:'smooth'});
}
function lotBack(){return S.lotFrom&&!['lot','create'].includes(S.lotFrom)?S.lotFrom:'title'}
function renderLot(){
  if(!S.hero.age){S.screen='title';render();return}
  const step=S.lotStep;
  const top=`<div><button class="btn ghost small" id="lotback">${t('shab.back')}</button></div>
    <span class="kicker">${icon('scroll')} ${t('lot.kicker')}${step?` · ${t('lot.step',{n:step==='name'?1:2})}`:''}</span>`;
  if(step==='name'){
    stage.innerHTML=`<section class="scene pasuk lot">${top}
      ${sayHTML(M,t('lot.nameSay',{name:esc(heroName())}),'warm')}
      ${hebNameHTML(true)}
      <div class="actions"><button class="btn" id="lotnx">${t('btn.next')}</button><button class="btn ghost" id="lotskip">${t('lot.skip')}</button></div>
    </section>`;
    wireHebName();
  }else if(step==='date'){
    stage.innerHTML=`<section class="scene pasuk hayom lot">${top}
      ${sayHTML(M,t('lot.dateSay'),'warm')}
      <p class="shab-note">${icon('lock')}<span>${t('hy.note')}</span></p>
      ${bdayFormHTML(true)}
      <div class="actions"><button class="btn" id="lotnx">${t('lot.open')}</button><button class="btn ghost" id="lotskip">${t('lot.skip')}</button></div>
    </section>`;
    wireBdayForm(renderLot,()=>{});
  }else{
    const reveal=!!S.lotReveal;S.lotReveal=false;
    const heb=hebFinals(S.hebName||'').trim();
    const card=(k,n,ic,he)=>`<article class="lot-card ${reveal?'rv':''}" id="lot-${k}" data-css="animation-delay:${reveal?(n-1)*.6:0}s">
      <div class="lot-card-h"><span class="lot-n">${n}</span><div><h3>${t('lot.'+k+'H')}</h3><span class="heb" lang="he">${he}</span></div>${icon(ic)}</div>
      <div class="lot-body"><p class="muted">${t('pasuk.loading')}</p></div></article>`;
    stage.innerHTML=`<section class="scene lot">${top}
      <h2 class="h2">${t('lot.title')}</h2>
      <blockquote class="lot-quote"><span class="heb" lang="he" dir="rtl">וְתֵן חֶלְקֵנוּ בְּתוֹרָתֶךָ</span><small>${t('lot.quote')}</small></blockquote>
      ${reveal?sayHTML(M,t('lot.revealSay',{name:esc(heroName())}),'joy'):`<p class="lead">${t('lot.lead')}</p>`}
      <div class="lot-me card"><div><b>${esc(heroName())}</b>${heb?` · <span class="heb" lang="he">${esc(heb)}</span>`:''}${lotSeals()}</div>
        <div class="lot-me-a"><button class="btn ghost small" id="lotname">${icon('letter')}<span>${t('lot.editName')}</span></button><button class="btn ghost small" id="lotdate">${icon('candles')}<span>${t('lot.editDate')}</span></button></div></div>
      <div class="lot-cards">${card('verse',1,'scroll','פָּסוּק')}${card('hayom',2,'candles','הַיּוֹם יוֹם')}${card('parsha',3,'book','פָּרָשָׁה')}</div>
      <article class="card lot-sheet"><span class="kicker">${icon('scroll')} ${t('lot.sheetH')}</span><p>${t('lot.sheet')}</p>
        <div class="cert-frame" id="lotsheet" hidden></div>
        <div class="actions"><a class="btn" id="lotdl" download="${t('sheet.file')}" href="#" hidden>${t('sheet.download')}</a><button class="btn ghost" id="lotprint" hidden>${icon('scroll')}<span>${t('cert.print')}</span></button></div>
        <p class="muted fs-sm" id="lotsheetnote">${t('lot.sheetEmpty')}</p></article>
      ${adult()?`<button class="linkbtn shablink" id="galbtn">${icon('palette')} ${t('gal.open')}</button>`:''}
      <article class="card lot-quest"><span class="kicker">${icon('puzzle')} ${t('lot.questH')}</span><p>${t('lot.quest')}</p>
        <div class="actions"><button class="btn ghost" id="lotquest">${t(S.sparks>0?'btn.continue':'btn.start')}</button></div></article>
      <p class="muted pasuk-src">${t('lot.src')}</p>
    </section>`;
    $('#lotname').onclick=()=>{sfx.tap();S.lotStep='name';save();render()};
    $('#lotdate').onclick=()=>{sfx.tap();S.lotStep='date';save();render()};
    const gb=$('#galbtn');if(gb)gb.onclick=()=>{sfx.tap();openGallery()};
    $('#lotquest').onclick=()=>{sfx.tap();if(S.sparks>0)go(S._last&&S._last!=='lot'?S._last:'map');else go('welcome')};
    fillLot();
  }
  $('#lotback').onclick=()=>{sfx.tap();if(step&&(S.lotDone||{})[step]){S.lotStep=null;save();render()}else go(lotBack())};
  const nx=$('#lotnx');if(nx)nx.onclick=lotNext;
  const sk=$('#lotskip');if(sk)sk.onclick=lotNext;
}
/* три свитка и личный лист — данные грузятся только здесь */
async function fillLot(){
  const set=(k,html)=>{const b=stage.querySelector(`#lot-${k} .lot-body`);if(b)b.innerHTML=html};
  const need=(k,step)=>set(k,`<p class="muted">${t('lot.'+k+'Need')}</p><div class="actions"><button class="btn ghost small" data-lotstep="${step}">${t(step==='name'?'lot.editName':'lot.editDate')}</button></div>`);
  const wire=()=>stage.querySelectorAll('[data-lotstep]').forEach(b=>b.onclick=()=>{sfx.tap();S.lotStep=b.dataset.lotstep;save();render()});
  const has=lotHas();
  // 1. стих имени
  if(!has.verse)need('verse','name');
  else personalVerse().then(v=>set('verse',v?`${verseHTML(v,true)}<p class="lot-more"><button class="linkbtn" data-open="pasuk">${t('lot.verseMore')}</button></p>`:`<p class="muted">${t('pasuk.none')}</p>`)).then(wireOpen);
  // 2. «Айом-йом»
  if(!has.hayom)need('hayom','date');
  else personalHayom().then(e=>set('hayom',e?`<p class="lot-when">${esc(hyDate(e))} · <span class="heb" lang="he">${esc(hyHebDate(e))}</span></p>
      <figure class="pasuk-v hy-v"><blockquote class="heb" lang="he" dir="rtl"><p>${esc(lotShort(e.text))}</p></blockquote><figcaption>${t('hy.cite')}</figcaption></figure>
      ${e.near?`<p class="pasuk-what">${t('hy.near',{date:esc(hyDate(e))})}</p>`:''}<p class="lot-more"><button class="linkbtn" data-open="hayom">${t('lot.hayomMore')}</button></p>`
    :`<p class="muted">${t('hy.error')}</p>`)).then(wireOpen);
  // 3. глава рождения
  if(!has.parsha)need('parsha','date');
  else Promise.all([personalParsha(),loadParshaTexts()]).then(([pp])=>{
    if(!pp){set('parsha',`<p class="muted">${t('lot.parshaError')}</p>`);return}
    const tx=((PARSHA_TXT&&PARSHA_TXT.parshiot)||[]),theme=pp.p.map(i=>parshaText((tx[i]||{}).theme)).filter(Boolean),q=pp.p.map(i=>parshaText((tx[i]||{}).question)).filter(Boolean);
    set('parsha',`<div class="pasuk-name"><span class="heb" lang="he">פָּרָשַׁת ${esc(parshaHe(pp))}</span><span class="hy-loc">${esc(parshaName(pp))}</span></div>
      <p class="lot-when">${t('lot.parshaWhen',{date:esc(rdDate(pp.sh))})} · <span class="heb" lang="he">${esc(hebDateStr(rdToHeb(pp.sh)))}</span></p>
      <p class="pasuk-what">${t('lot.parshaRange',{range:esc(parshaRange(pp))})}</p>
      ${pp.moved?`<p class="shab-note">${icon('info')}<span>${t('lot.parshaMoved',{date:esc(rdDate(pp.holiday))})}</span></p>`:''}
      ${theme.map(x=>`<p>${x}</p>`).join('')}${q.length?`<p class="lot-q">${icon('chat')}<span>${q.join(' ')}</span></p>`:''}
      <p class="muted fs-sm">${t(S.bday&&S.bday.il?'lot.parshaIL':'lot.parshaD')}</p>`);
  });
  wire();
  // личный лист: стих, «Айом-йом» и глава — то же, что второй лист сертификата
  const url=await drawPersonalSheet();
  if(!$('#lotsheet'))return;
  const ok=!!url;$('#lotsheet').hidden=$('#lotdl').hidden=$('#lotprint').hidden=!ok;$('#lotsheetnote').hidden=ok;
  if(ok){$('#lotsheet').innerHTML=`<img src="${url}" alt="${t('sheet.alt',{name:esc(heroName())})}">`;$('#lotdl').href=url}
  $('#lotprint').onclick=async()=>{const b=$('#lotprint');b.disabled=true;
    try{shabPrintDone();const u=await drawPersonalSheet(2);const pr=$('#print-area');pr.innerHTML=`<img src="${u}" alt="">`;
      await Promise.all([...pr.querySelectorAll('img')].map(im=>new Promise(r=>{if(im.complete)r();else{im.onload=r;im.onerror=r}})));
      applyCss(document.body);window.print()}catch(e){}
    b.disabled=false};
}
/* в свитке — начало слова, целиком — в разделе «Айом-йом» */
function lotShort(s){s=s.replace(/\n+/g,' ');return s.length>320?s.slice(0,s.lastIndexOf(' ',300))+' …':s}
function wireOpen(){stage.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{sfx.tap();b.dataset.open==='pasuk'?openPasuk():openHayom()})}
