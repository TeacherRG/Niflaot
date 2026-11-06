/* «Стих твоего имени — картина» (только 16+): личный стих пары букв имени как художественная работа —
   обои для телефона и компьютера и лист A4 для печати. Фон рисуется кодом (три сюжета; расположение звёзд,
   пузырьков и скал зависит от пары букв), текст стиха ставится настоящим шрифтом прямо из data/pesukim
   (тот же стих, что в разделе «Твой стих в Танахе»), ничего не генерирует ИИ. Всё рисуется на устройстве,
   имя никуда не отправляется. Работы бесплатны; рядом — ссылка на страницу пожертвования mychitas.app,
   в ссылке только язык и вид работы, без букв и имени. Выбор — S.gal {a, b, style, fmt, name}; тексты — gal.* в locales.
   Свои фоны автора (картины без текста) — gallery/backgrounds.json и файлы рядом, как добавить — gallery/README.md;
   они идут в списке сюжетов первыми, стих на них ставится так же, шрифтом. */
const GAL_FMT={phone:[1170,2532],screen:[3840,2160],print:[2480,3508]};   // print — A4 при 300 dpi
const GAL_PREV={phone:300,screen:640,print:360};                          // ширина превью
const GAL_STYLES=['deep','night','dawn'];
const DONATE_ART_URL=DONATE_URL+'/art';

function openGallery(){
  if(!adult())return;
  if(S.screen!=='gallery')S.galFrom=S.screen;
  const g=galState(),n=galName();
  if(n){g.a=baseL(n[0]);g.b=baseL(n.at(-1))}   // по умолчанию — буквы своего имени
  galLoadOwn().then(()=>go('gallery'));
}
/* свои фоны: {id, name:{ru,uk,de,en}, files:{phone,screen,print}, pairs?, band?, shade?, frame?} */
let GAL_OWN=null,galOwnLoad=null,GAL_VERSES={};
const galJson=f=>fetch('gallery/'+f,{cache:'no-cache'}).then(r=>r.ok?r.json():{}).catch(()=>({}));
function galLoadOwn(){
  if(!galOwnLoad)galOwnLoad=Promise.all([galJson('backgrounds.json'),galJson('verses.json')]).then(([d,v])=>{
    GAL_OWN=((d&&d.scenes)||[]).filter(s=>s&&s.id&&s.files&&!GAL_STYLES.includes(s.id));
    GAL_VERSES=v&&typeof v==='object'?v:{}});
  return galOwnLoad;
}
/* готовые картины автора к этому стиху (загружает админ, admin.js) — показываем как есть, с кнопкой «Скачать» */
function galAuthor(v){
  const box=$('#galauthor');if(!box)return;
  const key=`${v[0]}-${v[1]}-${v[2]}`,list=(GAL_VERSES[key]||[]).filter(f=>/^[\w.-]+$/.test(f));
  const ref=`${tl('pasuk.books')[v[0]]||''} ${v[1]}:${v[2]}`;
  box.innerHTML=list.length?`<div class="group"><h3>${t('gal.authorH')}</h3><p class="muted pasuk-hint">${t('gal.authorNote')}</p>
    <div class="gal-author">${list.map(f=>`<figure><img src="gallery/${esc(f)}" alt="${esc(t('gal.alt',{ref}))}" loading="lazy">
      <a class="btn ghost small" href="gallery/${esc(f)}" download="mylot-${esc(f)}">${icon('next')}<span>${t('gal.download')}</span></a></figure>`).join('')}</div></div>`:'';
}
const galOwn=id=>(GAL_OWN||[]).find(s=>s.id===id);
/* сюжеты для пары: сначала свои (если фон подходит к этой паре букв), потом нарисованные кодом */
const galStyles=g=>[...(GAL_OWN||[]).filter(s=>!s.pairs||!s.pairs.length||s.pairs.includes(g.a+g.b)).map(s=>s.id),...GAL_STYLES];
const galStyleName=k=>{const s=galOwn(k);return s?esc((s.name||{})[LANG]||(s.name||{}).ru||k):t('gal.style.'+k)};
/* форматы: у своего фона — только те, для которых есть файл */
const galFmts=st=>{const s=galOwn(st);return Object.keys(GAL_FMT).filter(f=>!s||s.files[f])};
function galState(){return S.gal||(S.gal={a:'א',b:'ה',style:'deep',fmt:'phone',name:true})}
/* первое имя на иврите, если оно есть */
function galName(){const n=hebFinals(S.hebName||'').trim().split(' ')[0]||'';return n.length>=2?n:''}
/* имя пишем на картине, только если стих — его: буквы пары совпадают с буквами имени */
function galNameFits(){const g=galState(),n=galName();return !!n&&baseL(n[0])===g.a&&baseL(n.at(-1))===g.b}
const galKind=g=>g.name&&galNameFits()?'personal':g.fmt==='print'?'print':'wallpaper';
const galDonateHref=g=>`${DONATE_ART_URL}?lang=${LANG}&kind=${galKind(g)}`;

function renderGallery(){
  if(!adult()){S.screen='title';render();return}
  const g=galState(),L=tl('pasuk.letters'),styles=galStyles(g);
  if(!styles.includes(g.style))g.style=styles[0];
  const fmts=galFmts(g.style);if(!fmts.includes(g.fmt))g.fmt=fmts[0];
  const opt=sel=>HEB_AB.map((c,i)=>`<option value="${c}" ${c===sel?'selected':''}>${c} · ${esc(L[i]||'')}</option>`).join('');
  const segs=(name,keys,cur,lab,cls)=>`<div class="seg gal-seg ${cls||''}" role="group" aria-labelledby="${name}-l">${keys.map(k=>`<button class="segb ${cur===k?'on':''}" data-${name}="${esc(k)}" aria-pressed="${cur===k}">${lab(k)}</button>`).join('')}</div>`;
  const n=galName();
  stage.innerHTML=`<section class="scene pasuk gal">
    <div><button class="btn ghost small" id="galback">${t('shab.back')}</button></div>
    <span class="kicker">${icon('palette')} ${t('gal.kicker')}</span>
    <h2 class="h2">${t('gal.title')}</h2>
    <p class="lead">${t('gal.lead')}</p>
    <div class="group"><h3>${t('gal.pairH')}</h3>
      <div class="hy-row"><div class="field"><label for="gala">${t('gal.first')}</label><select id="gala">${opt(g.a)}</select></div>
        <div class="field"><label for="galb">${t('gal.last')}</label><select id="galb">${opt(g.b)}</select></div></div>
      ${n?(galNameFits()?`<label class="cert-pt"><input type="checkbox" id="galnm" ${g.name?'checked':''}> <span>${t('gal.nameOn')} <span class="heb" lang="he">${esc(n)}</span></span></label>`
        :`<p class="muted pasuk-hint">${t('gal.notMine')} <button class="linkbtn" id="galmine">${t('gal.mine')} <span class="heb" lang="he">${esc(n)}</span></button></p>`)
        :`<p class="muted pasuk-hint">${t('gal.noName')} <button class="linkbtn" id="galpasuk">${t('pasuk.open')}</button></p>`}
    </div>
    <div id="galauthor"></div>
    <div class="group"><h3 id="gst-l">${t('gal.styleH')}</h3>${segs('gst',styles,g.style,galStyleName,styles.length>3?'wrap':'')}</div>
    <div class="group"><h3 id="gfmt-l">${t('gal.fmtH')}</h3>${segs('gfmt',fmts,g.fmt,k=>t('gal.fmt.'+k))}
      <p class="muted pasuk-hint">${t('gal.size.'+g.fmt)}</p></div>
    <div class="gal-prev" id="galprev" aria-live="polite"><p class="muted">${t('pasuk.loading')}</p></div>
    <div class="actions"><button class="btn" id="galdl" disabled>${icon('next')}<span>${t('gal.download')}</span></button></div>
    <p class="shab-note">${icon('lock')}<span>${t('gal.device')}</span></p>
    <aside class="card gal-donate"><span class="kicker">${icon('heart')} ${t('gal.donateK')}</span><p>${t('gal.donate')}</p>
      <div class="actions"><a class="btn ghost" id="galdon" href="${galDonateHref(g)}" target="_blank" rel="noopener">${icon('heart')}<span>${t('donate.label')}</span></a></div></aside>
    <p class="shab-note">${icon('info')}<span>${t('pasuk.custom')}</span></p>
    <p class="muted pasuk-src">${t('gal.src')}</p>
  </section>`;
  const redo=()=>{save();renderGallery();};
  $('#galback').onclick=()=>{sfx.tap();go(S.galFrom&&S.galFrom!=='gallery'?S.galFrom:'title')};
  $('#gala').onchange=e=>{g.a=e.target.value;redo();$('#gala').focus()};
  $('#galb').onchange=e=>{g.b=e.target.value;redo();$('#galb').focus()};
  const nm=$('#galnm');if(nm)nm.onchange=()=>{g.name=nm.checked;redo();$('#galnm').focus()};
  const mine=$('#galmine');if(mine)mine.onclick=()=>{sfx.tap();g.a=baseL(n[0]);g.b=baseL(n.at(-1));redo()};
  const pa=$('#galpasuk');if(pa)pa.onclick=()=>{sfx.tap();openPasuk()};
  stage.querySelectorAll('[data-gst]').forEach(b=>b.onclick=()=>{sfx.tap();g.style=b.dataset.gst;redo();stage.querySelector(`[data-gst="${CSS.escape(g.style)}"]`).focus()});
  stage.querySelectorAll('[data-gfmt]').forEach(b=>b.onclick=()=>{sfx.tap();g.fmt=b.dataset.gfmt;redo();stage.querySelector(`[data-gfmt="${g.fmt}"]`).focus()});
  $('#galdl').onclick=galDownload;
  galPreview();
}
/* стих пары (первый — личный) или null */
async function galVerse(g){
  await loadPesukim([HEB_AB.indexOf(g.a)]);
  return pairVerses(g.a+g.b)[0]||null;
}
let galTok=0;
async function galPreview(){
  const my=++galTok,g=galState(),box=$('#galprev');
  let v;try{v=await galVerse(g)}catch(e){if(my===galTok&&box)box.innerHTML=`<p class="muted">${t('pasuk.error')}</p>`;return}
  if(my!==galTok||!$('#galprev'))return;
  if(!v){box.innerHTML=`<p class="muted">${t('pasuk.none')}</p>`;$('#galauthor').innerHTML='';return}
  galAuthor(v);
  const [W,H]=GAL_FMT[g.fmt],w=GAL_PREV[g.fmt];
  let c;try{c=await galDraw(g,v,w,Math.round(w*H/W),g.fmt)}catch(e){if(my===galTok&&$('#galprev'))box.innerHTML=`<p class="muted">${t('gal.imgError')}</p>`;return}
  if(my!==galTok||!$('#galprev'))return;
  c.className='gal-cv gal-'+g.fmt;c.setAttribute('role','img');
  c.setAttribute('aria-label',t('gal.alt',{ref:`${tl('pasuk.books')[v[0]]||''} ${v[1]}:${v[2]}`}));
  box.innerHTML=`<figure class="pasuk-v gal-fig"><blockquote class="heb" lang="he" dir="rtl">${esc(v[3])}</blockquote>
    <figcaption>${verseRef(v)}</figcaption></figure>`;
  box.prepend(c);
  $('#galdl').disabled=false;
}
/* полноразмерная работа: canvas нужного формата (для скачивания и для проверки в тестах) */
async function galCanvas(fmt){
  const g=galState(),v=await galVerse(g);if(!v)return null;
  fmt=fmt||g.fmt;const [W,H]=GAL_FMT[fmt];return galDraw(g,v,W,H,fmt);
}
async function galDownload(){
  const b=$('#galdl'),g=galState();b.disabled=true;
  try{
    const c=await galCanvas(g.fmt);if(!c)return;
    const png=g.fmt==='print',blob=await new Promise(r=>c.toBlob(r,png?'image/png':'image/jpeg',.92));
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`mylot-pasuk-${HEB_AB.indexOf(g.a)+1}-${HEB_AB.indexOf(g.b)+1}-${g.fmt}.${png?'png':'jpg'}`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    sfx.good();toast('palette',t('gal.saved'),t('gal.savedSub'));
  }catch(e){toast('mute',t('gal.fail'),'')}
  finally{if(b.isConnected)b.disabled=false}
}

/* ---------- рисование ---------- */
/* одинаковая пара и сюжет — одинаковая картина в любом формате */
function galRand(g){
  let a=[...(g.a+g.b+g.style)].reduce((s,c)=>Math.imul(s^c.charCodeAt(0),16777619),2166136261)>>>0;
  return ()=>{a=(a+0x6D2B79F5)>>>0;let z=a;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);return ((z^z>>>14)>>>0)/4294967296};
}
function galGlow(x,cx,cy,r,col,a){
  const gr=x.createRadialGradient(cx,cy,0,cx,cy,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);
  x.fillStyle=gr;x.fillRect(cx-r,cy-r,2*r,2*r);
}
function galVGrad(x,H,stops){const gr=x.createLinearGradient(0,0,0,H);stops.forEach(([o,c])=>gr.addColorStop(o,c));return gr}
/* холмы: ломаная или плавная линия от края до края, снизу закрашено */
function galRidge(x,W,H,y0,amp,r,fill,rim,u,jag){
  const pts=[],n=jag?26:60;const ph=r()*6,k=(1.5+r()*2)*Math.PI*2/W;
  for(let i=0;i<=n;i++){const px=W*i/n;pts.push([px,y0+Math.sin(px*k+ph)*amp+Math.sin(px*k*2.7+ph*2)*amp*.4+(jag?(r()-.5)*amp*1.2:0)])}
  x.beginPath();x.moveTo(0,H);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(W,H);x.closePath();x.fillStyle=fill;x.fill();
  if(rim){x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    const sg=x.createLinearGradient(0,0,W,0);sg.addColorStop(0,'rgba(240,190,90,0)');sg.addColorStop(.5,rim);sg.addColorStop(1,'rgba(240,190,90,0)');
    x.strokeStyle=sg;x.lineWidth=u*2;x.stroke()}
}
/* «Глубокие воды» (Мишлей 20:5): поверхность, золотая нить света, пузырьки, скалы на дне */
function galDeep(x,W,H,u,r,land){
  const sea=H*(land?.2:.27),cx=W/2;
  x.fillStyle=galVGrad(x,H,[[0,'#03050a'],[sea/H-.01,'#0a1622'],[sea/H+.01,'#0c2436'],[.6,'#071a29'],[1,'#020509']]);x.fillRect(0,0,W,H);
  const th=x.createLinearGradient(0,0,0,sea);th.addColorStop(0,'rgba(255,214,120,0)');th.addColorStop(1,'rgba(255,214,120,.95)');
  x.fillStyle=th;x.fillRect(cx-u*1.3,0,u*2.6,sea);
  x.save();x.globalCompositeOperation='lighter';
  galGlow(x,cx,sea,W*.32,'255,196,96',.45);
  for(let i=0;i<16;i++){const y0=sea-u*34+i*u*5,amp=u*(2+r()*4),k=(2+r()*3)*Math.PI*2/W,ph=r()*6;
    x.beginPath();for(let s=0;s<=160;s++){const px=W*s/160,y=y0+Math.sin(px*k+ph)*amp+Math.sin(px*k*2.3+ph*1.7)*amp*.5;s?x.lineTo(px,y):x.moveTo(px,y)}
    const sg=x.createLinearGradient(0,0,W,0);sg.addColorStop(0,'rgba(90,130,160,.04)');sg.addColorStop(.5,`rgba(255,205,115,${.18+r()*.3})`);sg.addColorStop(1,'rgba(90,130,160,.04)');
    x.strokeStyle=sg;x.lineWidth=u*(.8+r()*1.6);x.stroke()}
  for(let i=0;i<10;i++){const sx=cx+(r()-.5)*W*.5,sp=(r()-.5)*W*.6,w=u*(8+r()*28);
    const rg=x.createLinearGradient(0,sea,0,H*.85);rg.addColorStop(0,`rgba(120,180,215,${.035+r()*.05})`);rg.addColorStop(1,'rgba(120,180,215,0)');
    x.fillStyle=rg;x.beginPath();x.moveTo(sx-w/2,sea);x.lineTo(sx+w/2,sea);x.lineTo(sx+sp+w*3,H*.85);x.lineTo(sx+sp-w*3,H*.85);x.closePath();x.fill()}
  const col=x.createLinearGradient(0,sea,0,H);col.addColorStop(0,'rgba(255,200,100,.35)');col.addColorStop(1,'rgba(255,190,90,.06)');
  x.fillStyle=col;x.fillRect(cx-u*2.5,sea,u*5,H-sea);
  galGlow(x,cx,H*.95,Math.max(W,H)*.32,'255,180,80',.5);
  for(let i=0;i<90;i++){const y=sea+u*10+r()*(H-sea)*.92,off=(r()-.5)*(r()-.5)*W*.9,rad=u*(1.2+r()*r()*7);
    x.strokeStyle=`rgba(255,215,140,${.2+r()*.5})`;x.lineWidth=u*.9;x.beginPath();x.arc(cx+off,y,rad,0,Math.PI*2);x.stroke()}
  x.restore();
  // скалы по краям, просвет — посередине
  for(const side of [-1,1]){
    const edge=side<0?0:W,inner=cx+side*W*(land?.12:.08),top=H*(land?.68:.66)+r()*H*.04,pts=[[edge,top]];
    for(let i=1;i<=9;i++){const f=i/9;pts.push([edge+(inner-edge)*f+(r()-.5)*u*30,top+(H-top)*Math.pow(f,1.6)*.9+(r()-.5)*u*40])}
    x.beginPath();x.moveTo(edge,H);pts.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(inner,H);x.closePath();
    x.fillStyle=galVGrad(x,H,[[0,'#0b141c'],[1,'#030609']]);x.fill();
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));
    const eg=x.createLinearGradient(edge,0,inner,0);eg.addColorStop(0,'rgba(230,170,70,.08)');eg.addColorStop(1,'rgba(255,200,100,.7)');
    x.strokeStyle=eg;x.lineWidth=u*2.2;x.stroke();
  }
  return land?[.3,.66]:[.36,.62];
}
/* «Звёздное небо» (Берешит 15:5): звёзды над тёмными холмами */
function galNight(x,W,H,u,r,land){
  x.fillStyle=galVGrad(x,H,[[0,'#02030a'],[.55,'#0a1030'],[.85,'#181a3c'],[1,'#0d0f24']]);x.fillRect(0,0,W,H);
  x.save();x.globalCompositeOperation='lighter';
  x.translate(W/2,H*.4);x.rotate(-.5);galGlow(x,0,0,Math.max(W,H)*.5,'120,120,190',.12);x.rotate(.5);x.translate(-W/2,-H*.4);
  const n=Math.round(260+W*H/(u*u*2600));
  for(let i=0;i<n;i++){const px=r()*W,py=r()*H*.86,s=u*(.5+r()*r()*r()*3),gold=r()<.3;
    x.fillStyle=gold?`rgba(255,215,140,${.4+r()*.6})`:`rgba(225,230,255,${.25+r()*.6})`;x.beginPath();x.arc(px,py,s,0,Math.PI*2);x.fill()}
  for(let i=0;i<7;i++){const px=W*(.1+r()*.8),py=H*(.05+r()*.7),s=u*(10+r()*16);
    galGlow(x,px,py,s*2.4,'255,205,120',.35);x.strokeStyle='rgba(255,226,160,.8)';x.lineWidth=u*1.2;
    x.beginPath();x.moveTo(px-s,py);x.lineTo(px+s,py);x.moveTo(px,py-s);x.lineTo(px,py+s);x.stroke();
    x.fillStyle='#fff2cf';x.beginPath();x.arc(px,py,u*2.4,0,Math.PI*2);x.fill()}
  x.restore();
  galRidge(x,W,H,H*.84,u*26,r,'#0b0d22',null,u);
  galRidge(x,W,H,H*.9,u*18,r,'#05060f','rgba(255,200,110,.55)',u);
  return land?[.22,.72]:[.3,.66];
}
/* «Рассвет»: солнце встаёт над холмами, тёмное небо сверху */
function galDawn(x,W,H,u,r,land){
  const hz=H*(land?.8:.82),cx=W*(.35+r()*.3);
  x.fillStyle=galVGrad(x,H,[[0,'#0c0919'],[.35,'#24132f'],[.6,'#5a2440'],[hz/H-.05,'#c4612f'],[hz/H,'#f2b65c'],[1,'#f2b65c']]);x.fillRect(0,0,W,H);
  x.save();x.globalCompositeOperation='lighter';
  galGlow(x,cx,hz,Math.max(W,H)*.45,'255,170,80',.5);
  for(let i=0;i<14;i++){const a=Math.PI*(1.05+r()*.9),len=Math.max(W,H)*(.4+r()*.5);
    x.strokeStyle=`rgba(255,210,140,${.025+r()*.045})`;x.lineWidth=u*(6+r()*20);x.lineCap='round';x.beginPath();x.moveTo(cx,hz);x.lineTo(cx+Math.cos(a)*len,hz+Math.sin(a)*len);x.stroke()}
  x.restore();
  x.fillStyle='#ffe6ad';x.beginPath();x.arc(cx,hz,u*70,Math.PI,0);x.fill();
  galRidge(x,W,H,hz,u*14,r,'#7a3330',null,u);
  galRidge(x,W,H,hz+u*40,u*22,r,'#4a1d2a','rgba(255,200,120,.5)',u);
  galRidge(x,W,H,hz+u*110,u*30,r,'#220e18',null,u);
  return land?[.14,.6]:[.2,.62];
}
/* свой фон: картина автора заполняет весь лист (лишнее по краям обрезается), под полосой текста — лёгкое затемнение */
const galImgs={};
function galImg(src){
  return galImgs[src]||(galImgs[src]=new Promise((ok,no)=>{const im=new Image();
    im.onload=()=>ok(im);im.onerror=()=>{delete galImgs[src];no(new Error(src))};im.src='gallery/'+src}));
}
async function galPhoto(x,W,H,s,fmt,land){
  const im=await galImg(s.files[fmt]);
  const k=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*k,h=im.naturalHeight*k;
  x.drawImage(im,(W-w)/2,(H-h)/2,w,h);
  const band=(s.band&&s.band[fmt])||(land?[.25,.7]:[.33,.64]),shade=s.shade==null?.35:s.shade;
  if(shade>0){const a=H*(band[0]-.08),b=H*(band[1]+.08),gr=x.createLinearGradient(0,a,0,b);
    gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.25,`rgba(0,0,0,${shade})`);gr.addColorStop(.75,`rgba(0,0,0,${shade})`);gr.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=gr;x.fillRect(0,a,W,b-a)}
  return band;
}
async function galDraw(g,v,W,H,fmt){
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const HB='"Frank Ruhl Libre", serif',B='Onest, "Segoe UI", sans-serif';
  try{await Promise.all([document.fonts.load(`700 40px ${HB}`,v[3]),document.fonts.load(`500 40px ${HB}`,'אב'),document.fonts.load(`500 20px ${B}`,'Aa')])}catch(e){}
  const u=Math.min(W,H)/1000,land=W>H,r=galRand(g);
  const own=galOwn(g.style);
  const [bt,bb]=own?await galPhoto(x,W,H,own,fmt,land):({deep:galDeep,night:galNight,dawn:galDawn}[g.style]||galDeep)(x,W,H,u,r,land);
  const print=fmt==='print';
  // текст: самый крупный кегль, при котором стих помещается в свою полосу
  const tw=W*(land?.6:.8),top=H*bt,bot=H*bb,name=g.name&&galNameFits()?galName():'';
  const nameH=name?u*90:0,tailH=u*150;
  x.textAlign='center';x.direction='rtl';
  let f=u*(land?110:96),lines,lh;
  for(;;){x.font=`700 ${f}px ${HB}`;lines=wrapLines(x,v[3],tw);lh=f*1.5;if(lines.length*lh+nameH+tailH<=bot-top||f<=u*26)break;f-=u*2}
  let y=top+((bot-top)-(lines.length*lh+nameH+tailH))/2;
  const gold=(y0,size)=>{const gr=x.createLinearGradient(0,y0-size,0,y0);gr.addColorStop(0,'#fff3cc');gr.addColorStop(.55,'#ebc66b');gr.addColorStop(1,'#b8862b');return gr};
  const glowText=(s,px,py,size)=>{
    x.save();x.shadowColor='rgba(0,0,0,.65)';x.shadowBlur=size*.25;x.fillStyle='rgba(0,0,0,.35)';x.fillText(s,px,py);x.restore();
    x.save();x.shadowColor='rgba(255,190,80,.45)';x.shadowBlur=size*.35;x.fillStyle=gold(py,size);x.fillText(s,px,py);x.restore()};
  const diamond=(cx,cy,s)=>{x.save();x.translate(cx,cy);x.rotate(Math.PI/4);x.fillStyle='#e3b55a';x.fillRect(-s,-s,2*s,2*s);x.restore()};
  const rule=(cy,half)=>{x.strokeStyle='rgba(227,181,90,.75)';x.lineWidth=u*1.6;x.beginPath();x.moveTo(W/2-half,cy);x.lineTo(W/2-u*16,cy);x.moveTo(W/2+u*16,cy);x.lineTo(W/2+half,cy);x.stroke();diamond(W/2,cy,u*6)};
  if(name){const s=u*52;x.font=`700 ${s}px ${HB}`;glowText(name,W/2,y+s,s);y+=nameH}
  x.font=`700 ${f}px ${HB}`;
  lines.forEach((ln,i)=>glowText(ln,W/2,y+f+i*lh,f));
  y+=lines.length*lh+u*36;
  rule(y,u*140);
  x.font=`500 ${u*40}px ${HB}`;x.fillStyle='#e9c77c';x.fillText(`${PESUKIM.books[v[0]]} ${hebNum(v[1])}, ${hebNum(v[2])}`,W/2,y+u*66);
  x.direction='ltr';x.font=`400 ${u*24}px ${B}`;x.fillStyle='rgba(235,222,190,.8)';x.fillText(`${tl('pasuk.books')[v[0]]||''} ${v[1]}:${v[2]}`,W/2,y+u*106);
  // рамка для печати и подпись сайта
  if(print&&!(own&&own.frame===false)){x.strokeStyle='rgba(227,181,90,.8)';x.lineWidth=u*3;x.strokeRect(u*50,u*50,W-u*100,H-u*100);x.lineWidth=u*1.2;x.strokeRect(u*66,u*66,W-u*132,H-u*132)}
  x.font=`500 ${u*20}px ${B}`;x.fillStyle='rgba(235,222,190,.55)';x.fillText(APP_URL.replace(/^https:\/\//,''),W/2,H-u*(print?90:44));
  return c;
}
