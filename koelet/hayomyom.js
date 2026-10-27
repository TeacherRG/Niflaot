/* «Твой день в „Айом-йом“»: по дню рождения — обычному (переводим в еврейский) или еврейскому — запись из книги
   Любавичского Ребе «היום יום» на этот день. Данные — data/hayomyom.json (tools/build-hayomyom.mjs), грузятся только здесь.
   Дата рождения хранится только на устройстве (S.bday). Тексты — hy.* в locales. */

/* ---------- еврейский календарь (алгоритм «Calendrical Calculations»: R.D.-дни, молад, отсрочки Рош а-Шана) ---------- */
const HEB_EPOCH=-1373427;   // R.D. 1 Тишрея 1 года
const hebLeap=y=>(7*y+1)%19<7;
function hebElapsed(y){
  const m=Math.floor((235*y-234)/19),parts=12084+13753*m;let d=29*m+Math.floor(parts/25920);
  if((3*(d+1))%7<3)d++;
  return d;
}
function hebNewYear(y){
  const a=hebElapsed(y-1),b=hebElapsed(y),c=hebElapsed(y+1);
  return HEB_EPOCH+b+(c-b===356?2:b-a===382?1:0);
}
const gregRD=(y,m,d)=>{const p=y-1;return 365*p+Math.floor(p/4)-Math.floor(p/100)+Math.floor(p/400)+Math.floor((367*m-362)/12)+(m<=2?0:(y%4===0&&(y%100!==0||y%400===0))?-1:-2)+d};
/* месяцы года по порядку с Тишрея: [индекс в книге, дней]; в простом году Адар = «אדר ב» книги (так у Хабада: день рождения в Адаре простого года — в Адар II) */
function hebMonths(y){
  const len=hebNewYear(y+1)-hebNewYear(y),leap=hebLeap(y);
  return [[0,30],[1,len%10===5?30:29],[2,len%10===3?29:30],[3,29],[4,30],...(leap?[[5,30],[6,29]]:[[6,29]]),[7,30],[8,29],[9,30],[10,29],[11,30],[12,29]];
}
/* обычная дата → {y, m (индекс месяца книги), d, leap} */
function gregToHeb(gy,gm,gd){
  const rd=gregRD(gy,gm,gd);let y=gy+3760;
  while(rd>=hebNewYear(y+1))y++;
  while(rd<hebNewYear(y))y--;
  let left=rd-hebNewYear(y);
  for(const [m,n] of hebMonths(y)){if(left<n)return {y,m,d:left+1,leap:hebLeap(y)};left-=n}
  return null;
}
/* число буквами: 15 → ט״ו */
function hebNum(n){
  const ones=['','א','ב','ג','ד','ה','ו','ז','ח','ט'],tens=['','י','כ','ל'];
  let s=n===15?'טו':n===16?'טז':tens[Math.floor(n/10)]+ones[n%10];
  return s.length>1?s.slice(0,-1)+'״'+s.slice(-1):s+'׳';
}

/* ---------- данные и выбор записи ---------- */
let HAYOM=null,hayomLoad=null;
function loadHayom(){
  if(!hayomLoad)hayomLoad=fetch('data/hayomyom.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>HAYOM=d)
    .catch(e=>{hayomLoad=null;throw e});
  return hayomLoad;
}
/* месяцы в списке выбора: «Адар» простого года отдельно от Адара I и II */
const HY_PICK=[0,1,2,3,4,'adar',5,6,7,8,9,10,11,12];
/* день рождения → {m, d, leap?, adar?} в индексах книги или null */
function bdayHeb(){
  const b=S.bday;if(!b)return null;
  if(b.mode==='h'){if(!b.hd||b.hm==null||b.hm==='')return null;const adar=b.hm==='adar';return {m:adar?6:+b.hm,d:+b.hd,adar}}
  const m=(b.g||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;
  let [y,mo,d]=[+m[1],+m[2],+m[3]];
  if(b.sunset){const t=new Date(Date.UTC(y,mo-1,d+1));y=t.getUTCFullYear();mo=t.getUTCMonth()+1;d=t.getUTCDate()}
  const h=gregToHeb(y,mo,d);if(!h)return null;
  return {m:h.m,d:h.d,leap:h.leap,adar:!h.leap&&h.m===6};
}
/* запись книги на этот день: {text, m, d, near} — near, если такого дня в книге нет и взят соседний */
function hayomEntry(h){
  if(!h||!HAYOM)return null;
  let d=h.d,near=false;
  while(d>0&&!HAYOM.days[`${h.m}-${d}`]){d--;near=true}
  const text=HAYOM.days[`${h.m}-${d}`];
  return text?{text,m:h.m,d,near,adar:h.adar}:null;
}
const hyHebDate=e=>`${hebNum(e.d)} ${e.adar?'אדר':HAYOM.months[e.m]}`;
const hyDate=e=>t('hy.date',{d:e.d,m:e.adar?t('hy.adar'):tl('hy.months')[e.m]});
/* запись для сертификата (или null) */
async function personalHayom(){
  const h=bdayHeb();if(!h)return null;
  try{await loadHayom()}catch(e){return null}
  return hayomEntry(h);
}

/* ---------- экран ---------- */
function openHayom(){if(S.screen!=='hayom')S.hayomFrom=S.screen;go('hayom')}
/* форма дня рождения: здесь и в мастере «Мой удел в Торе» (full — ещё год по еврейскому счёту и место рождения:
   они нужны главе рождения) */
function bdayFormHTML(full){
  const b=S.bday||(S.bday={mode:'g',g:'',sunset:false,hd:'',hm:''});
  const months=tl('hy.months'),thisYear=new Date().getFullYear()+3761;
  return `<div class="group"><h3 id="hymode-l">${t('hy.modeH')}</h3>
      <div class="seg" role="group" aria-labelledby="hymode-l">${['g','h'].map(k=>`<button class="segb ${b.mode===k?'on':''}" data-hymode="${k}" aria-pressed="${b.mode===k}">${t('hy.mode.'+k)}</button>`).join('')}</div>
      ${b.mode==='g'?`<div class="field"><label for="hyg">${t('hy.gLabel')}</label><input type="date" id="hyg" max="${new Date().toISOString().slice(0,10)}" value="${esc(b.g||'')}"></div>
        <label class="cert-pt"><input type="checkbox" id="hysun" ${b.sunset?'checked':''}> <span>${t('hy.sunset')}</span></label>`
      :`<div class="hy-row"><div class="field"><label for="hyd">${t('hy.dLabel')}</label><select id="hyd"><option value="">—</option>${Array.from({length:30},(_,i)=>`<option value="${i+1}" ${+b.hd===i+1?'selected':''}>${i+1}</option>`).join('')}</select></div>
        <div class="field"><label for="hym">${t('hy.mLabel')}</label><select id="hym"><option value="">—</option>${HY_PICK.map(k=>`<option value="${k}" ${String(b.hm)===String(k)?'selected':''}>${esc(k==='adar'?t('hy.adar'):months[k])}</option>`).join('')}</select></div></div>
        ${full?`<div class="field"><label for="hyy">${t('hy.yLabel')}</label><input type="number" id="hyy" inputmode="numeric" min="5600" max="${thisYear}" placeholder="${thisYear-30}" value="${esc(b.hy||'')}"></div>
        <p class="muted pasuk-hint">${t('hy.yHint')}</p>`:''}`}
    </div>
    ${full?`<div class="group"><h3 id="hyil-l">${t('hy.placeH')}</h3>
      <div class="seg" role="group" aria-labelledby="hyil-l">${[[0,'hy.place.d'],[1,'hy.place.il']].map(([v,k])=>`<button class="segb ${!!b.il===!!v?'on':''}" data-hyil="${v}" aria-pressed="${!!b.il===!!v}">${t(k)}</button>`).join('')}</div>
      <p class="muted pasuk-hint">${t('hy.placeHint')}</p></div>`:''}`;
}
/* again() — перерисовать форму (смена «обычная/еврейская»), upd() — дата изменилась */
function wireBdayForm(again,upd){
  const b=S.bday,ch=()=>{save();upd()};
  stage.querySelectorAll('[data-hymode]').forEach(x=>x.onclick=()=>{b.mode=x.dataset.hymode;sfx.tap();save();again();const f=stage.querySelector(`[data-hymode="${b.mode}"]`);if(f)f.focus()});
  stage.querySelectorAll('[data-hyil]').forEach(x=>x.onclick=()=>{b.il=x.dataset.hyil==='1';sfx.tap();save();again();const f=stage.querySelector(`[data-hyil="${x.dataset.hyil}"]`);if(f)f.focus()});
  const g=$('#hyg');if(g)g.onchange=g.oninput=()=>{b.g=g.value;ch()};
  const sun=$('#hysun');if(sun)sun.onchange=()=>{b.sunset=sun.checked;ch()};
  const d=$('#hyd');if(d)d.onchange=()=>{b.hd=d.value;ch()};
  const m=$('#hym');if(m)m.onchange=()=>{b.hm=m.value;ch()};
  const y=$('#hyy');if(y)y.oninput=()=>{b.hy=y.value.replace(/\D/g,'').slice(0,4);ch()};
}
function renderHayom(){
  stage.innerHTML=`<section class="scene pasuk hayom">
    <div><button class="btn ghost small" id="hyback">${t('shab.back')}</button></div>
    <span class="kicker">${icon('candles')} ${t('hy.kicker')}</span>
    <h2 class="h2">${t('hy.title')}</h2>
    <p class="lead">${t('hy.lead')}</p>
    <p class="shab-note">${icon('lock')}<span>${t('hy.note')}</span></p>
    ${bdayFormHTML(false)}
    <div id="hyres" aria-live="polite"></div>
    <p class="muted pasuk-src">${t('hy.src')}</p>
  </section>`;
  wireBdayForm(renderHayom,showHayom);
  $('#hyback').onclick=()=>{sfx.tap();go(S.hayomFrom&&S.hayomFrom!=='hayom'?S.hayomFrom:'title')};
  showHayom();
}
function showHayom(){
  const box=$('#hyres');if(!box)return;
  const h=bdayHeb();
  if(!h){box.innerHTML=`<p class="muted">${t('hy.empty')}</p>`;return}
  if(!HAYOM){box.innerHTML=`<p class="muted">${t('pasuk.loading')}</p>`;
    loadHayom().then(showHayom).catch(()=>{const b=$('#hyres');if(b)b.innerHTML=`<p class="muted">${t('hy.error')}</p>`});return}
  const e=hayomEntry(h);
  const head=`<div class="pasuk-name"><span class="heb" lang="he">${esc(hebNum(h.d)+' '+(h.adar?'אדר':HAYOM.months[h.m]))}</span><span class="hy-loc">${esc(t('hy.date',{d:h.d,m:h.adar?t('hy.adar'):tl('hy.months')[h.m]}))}</span></div>`;
  if(!e){box.innerHTML=`<div class="pasuk-card">${head}<p class="muted">${t('hy.none')}</p></div>`;return}
  box.innerHTML=`<div class="pasuk-card">${head}
    ${e.near?`<p class="pasuk-what">${t('hy.near',{date:esc(hyDate(e))})}</p>`:''}
    <figure class="pasuk-v hy-v"><blockquote class="heb" lang="he" dir="rtl">${e.text.split('\n').map(p=>`<p>${esc(p)}</p>`).join('')}</blockquote>
    <figcaption>${t('hy.cite')} · <span class="heb" lang="he">היום יום, ${esc(hyHebDate(e))}</span></figcaption></figure>
    <p class="pasuk-src">${t('hy.cert')}</p></div>`;
}
