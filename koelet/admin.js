/* Вход для админов и загрузка готовых картин к стихам. Сайт статический (GitHub Pages), поэтому «вход» — личный
   ключ GitHub (fine-grained token: доступ только к репозиторию игры, Contents: Read and write). Ключ хранится только
   в этом браузере (localStorage koelet-admin, не в сохранении игры) и уходит только на api.github.com — у игроков
   запросов туда нет. Загрузка = коммит в main: файл в gallery/ и строка в gallery/verses.json
   («книга-глава-стих» → список файлов); GitHub Pages публикует его за 1–2 минуты. Картина — готовая работа,
   игроки 16+ видят её как есть в «Картине со стихом» (galAuthor() в gallery.js). Тексты — adm.* в locales. */
const ADM_REPO='TeacherRG/Koelet',ADM_BRANCH='main',ADM_KEY='koelet-admin',ADM_API='https://api.github.com';
const ADM_MAX=4e6;   // больше — уменьшаем перед загрузкой (так же проверяет test:data)
let ADM=null;try{ADM=JSON.parse(localStorage.getItem(ADM_KEY)||'null')}catch(e){}
const isAdmin=()=>!!(ADM&&ADM.token);
function admSave(){try{ADM?localStorage.setItem(ADM_KEY,JSON.stringify(ADM)):localStorage.removeItem(ADM_KEY)}catch(e){}}
async function gh(path,opt={}){
  const r=await fetch(ADM_API+path,{...opt,cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+ADM.token,
    'X-GitHub-Api-Version':'2022-11-28',...(opt.body?{'Content-Type':'application/json'}:{})}});
  if(!r.ok){const e=new Error('GitHub '+r.status);e.status=r.status;throw e}
  return r.status===204?null:r.json();
}
/* ошибка GitHub — понятным текстом: 401 — ключ не принят (выходим), 403/404 — нет права записи */
function admErr(e){
  if(e.status===401){ADM=null;admSave();return t('adm.bad')}
  if(e.status===403||e.status===404)return t('adm.noRights');
  return t('adm.fail',{err:e.status?'GitHub '+e.status:e.message});
}
/* base64 для GitHub: файл и текст в UTF-8 */
const admB64=blob=>new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>ok(String(fr.result).split(',')[1]);fr.onerror=no;fr.readAsDataURL(blob)});
function admUtf8B64(s){const b=new TextEncoder().encode(s);let out='';for(let i=0;i<b.length;i+=0x8000)out+=String.fromCharCode(...b.subarray(i,i+0x8000));return btoa(out)}
const admFromB64=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
const admRefHe=key=>{const [b,c,v]=key.split('-').map(Number);return `${(PESUKIM&&PESUKIM.books[b])||b} ${hebNum(c)}, ${hebNum(v)}`};
const admRef=key=>{const [b,c,v]=key.split('-').map(Number);return `${tl('pasuk.books')[b]||''} ${c}:${v}`};

/* ---------- вход ---------- */
function showAdminLogin(){
  openSheet('admin',t('adm.loginH'),()=>`
    <p>${t('adm.loginText')}</p>
    <ol class="adm-steps">${(tl('adm.steps')||[]).map(s=>`<li>${s}</li>`).join('')}</ol>
    <p><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">${t('adm.tokenLink')}</a></p>
    <div class="field"><label for="admtok">${t('adm.token')}</label><input id="admtok" type="password" autocomplete="off" spellcheck="false"></div>
    <p class="muted fs-sm" id="admmsg" aria-live="polite">${t('adm.tokenNote')}</p>
    <div class="actions"><button class="btn" id="admgo">${icon('key')}<span>${t('adm.login')}</span></button></div>`,
  (m,draw,close)=>{
    const inp=m.querySelector('#admtok'),btn=m.querySelector('#admgo'),msg=m.querySelector('#admmsg');
    inp.onkeydown=e=>{if(e.key==='Enter')btn.click()};
    btn.onclick=async()=>{
      const tok=inp.value.trim();if(!tok){inp.focus();return}
      btn.disabled=true;msg.textContent=t('adm.checking');ADM={token:tok};
      try{
        const r=await gh('/repos/'+ADM_REPO);
        if(r&&r.permissions&&!r.permissions.push){const e=new Error();e.status=403;throw e}
        /* репозиторий публичный — прочитать его может любой ключ. Право записи проверяем делом: пустой blob
           (Contents: write) ни в один коммит не попадает и в истории не виден */
        await gh(`/repos/${ADM_REPO}/git/blobs`,{method:'POST',body:JSON.stringify({content:'',encoding:'utf-8'})});
        let login='';try{login=(await gh('/user')).login||''}catch(e){}
        ADM={token:tok,login};admSave();close();sfx.good();toast('key',t('adm.in'),login?'@'+login:'');openAdmin();
      }catch(e){ADM=null;msg.textContent=t(e.status===401?'adm.bad':e.status===403||e.status===404?'adm.noRights':'adm.net');btn.disabled=false}
    };
  });
}
/* кнопка на титульном экране: вход или, если уже вошёл, — сразу к загрузке */
function adminEntry(){sfx.tap();isAdmin()?openAdmin():showAdminLogin()}
function admLogout(){ADM=null;admSave();toast('lock',t('adm.out'),'');go('title')}

/* ---------- экран загрузки: как «Твой стих в Танахе», нажатие на стих открывает загрузку ---------- */
function openAdmin(){if(!isAdmin()){showAdminLogin();return}if(S.screen!=='admin')S.admFrom=S.screen;go('admin')}
function renderAdmin(){
  if(!isAdmin()){S.screen='title';render();return}
  stage.innerHTML=`<section class="scene pasuk adm">
    <div><button class="btn ghost small" id="admback">${t('shab.back')}</button></div>
    <span class="kicker">${icon('key')} ${t('adm.kicker')}${ADM.login?' · @'+esc(ADM.login):''}</span>
    <h2 class="h2">${t('adm.title')}</h2>
    <p class="lead">${t('adm.lead')}</p>
    ${hebNameHTML()}
    <div class="actions"><button class="btn ghost small" id="admout">${icon('lock')}<span>${t('adm.logout')}</span></button></div>
  </section>`;
  $('#admback').onclick=()=>{sfx.tap();go(S.admFrom&&S.admFrom!=='admin'?S.admFrom:'title')};
  $('#admout').onclick=admLogout;
  wireHebName();
  const box=$('#pares');
  box.addEventListener('click',admPick);
  box.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-v]')){e.preventDefault();admPick(e)}});
}
function admPick(e){
  if(e.target.closest('.adm-up')||e.target.closest('summary'))return;
  const el=e.target.closest('[data-v]');if(!el)return;
  if(el.classList.contains('adm-on'))return;
  sfx.tap();
  stage.querySelectorAll('.adm-up').forEach(p=>p.remove());stage.querySelectorAll('.adm-on').forEach(x=>x.classList.remove('adm-on'));
  el.classList.add('adm-on');
  const key=el.dataset.v,p=document.createElement('div');p.className='adm-up';
  p.innerHTML=`<p class="adm-for">${t('adm.for')} <b>${esc(admRef(key))}</b> · <span class="heb" lang="he">${esc(admRefHe(key))}</span></p>
    <div class="adm-imgs" aria-live="polite"><p class="muted fs-sm">${t('pasuk.loading')}</p></div>
    <label class="btn adm-file">${icon('up')}<span>${t('adm.upload')}</span><input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only"></label>
    <p class="muted fs-sm adm-st" aria-live="polite">${t('adm.hint')}</p>`;
  el.appendChild(p);
  const inp=p.querySelector('input[type=file]');
  inp.onchange=()=>{const f=inp.files&&inp.files[0];inp.value='';if(f)admUpload(key,f,p)};
  admShow(key,p);
}
/* список картин стиха — свежий, прямо из репозитория */
async function admMap(){
  try{const c=await gh(`/repos/${ADM_REPO}/contents/gallery/verses.json?ref=${ADM_BRANCH}`);return {map:JSON.parse(admFromB64(c.content)),sha:c.sha}}
  catch(e){if(e.status===404)return {map:{},sha:undefined};throw e}
}
/* правка списка: читаем, меняем, пишем; если кто-то успел записать раньше (409) — ещё раз */
async function admEditMap(fn,message){
  for(let i=0;i<3;i++){
    const {map,sha}=await admMap();fn(map);
    const body={message,branch:ADM_BRANCH,content:admUtf8B64(JSON.stringify(map,null,2)+'\n')};if(sha)body.sha=sha;
    try{await gh(`/repos/${ADM_REPO}/contents/gallery/verses.json`,{method:'PUT',body:JSON.stringify(body)});return map}
    catch(e){if(e.status!==409||i===2)throw e}
  }
}
async function admShow(key,p,fresh){
  const box=p.querySelector('.adm-imgs');
  let map;try{map=(await admMap()).map}catch(e){box.innerHTML=`<p class="muted fs-sm">${t('adm.net')}</p>`;return}
  if(!p.isConnected)return;
  const list=(map[key]||[]).filter(f=>/^[\w.-]+$/.test(f));
  box.innerHTML=list.length?`<p class="muted fs-sm">${t('adm.have',{n:list.length})}</p><div class="gal-author">${list.map(f=>`<figure>
      <img src="${fresh&&fresh[f]||'gallery/'+esc(f)}" alt="${esc(t('gal.alt',{ref:admRef(key)}))}">
      <button class="btn ghost small" data-del="${esc(f)}">${t('adm.del')}</button></figure>`).join('')}</div>`
    :`<p class="muted fs-sm">${t('adm.none')}</p>`;
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>admRemove(key,b.dataset.del,p));
}
/* слишком большой файл — уменьшаем до 3508 px по длинной стороне, JPEG */
async function admShrink(file){
  const bm=await createImageBitmap(file),k=Math.min(1,3508/Math.max(bm.width,bm.height));
  const c=document.createElement('canvas');c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);
  c.getContext('2d').drawImage(bm,0,0,c.width,c.height);
  for(const q of [.9,.8,.7]){const b=await new Promise(r=>c.toBlob(r,'image/jpeg',q));if(b&&b.size<=ADM_MAX)return b}
  throw new Error(t('adm.big'));
}
async function admUpload(key,file,p){
  const st=p.querySelector('.adm-st'),lab=p.querySelector('.adm-file');
  if(!/^image\/(jpeg|png|webp)$/.test(file.type)){st.textContent=t('adm.type');return}
  lab.classList.add('busy');st.textContent=t('adm.sending');
  try{
    const blob=file.size>ADM_MAX?await admShrink(file):file;
    const ext={'image/png':'png','image/webp':'webp'}[blob.type]||'jpg';
    const name=`v-${key}-${Date.now().toString(36)}.${ext}`,ref=admRefHe(key);
    await gh(`/repos/${ADM_REPO}/contents/gallery/${name}`,{method:'PUT',body:JSON.stringify({message:`Картина к стиху ${ref}`,branch:ADM_BRANCH,content:await admB64(blob)})});
    await admEditMap(m=>{(m[key]=m[key]||[]).push(name)},`Картина к стиху ${ref}: в списке галереи`);
    sfx.good();st.textContent=t('adm.done');
    admShow(key,p,{[name]:URL.createObjectURL(blob)});   // на сайте файл появится позже — показываем свой
  }catch(e){st.textContent=admErr(e)}
  finally{lab.classList.remove('busy')}
}
async function admRemove(key,name,p){
  if(!confirm(t('adm.delAsk')))return;
  const st=p.querySelector('.adm-st');st.textContent=t('adm.sending');
  try{
    const ref=admRefHe(key);
    await admEditMap(m=>{m[key]=(m[key]||[]).filter(f=>f!==name);if(!m[key].length)delete m[key]},`Картина к стиху ${ref}: убрана из галереи`);
    try{const f=await gh(`/repos/${ADM_REPO}/contents/gallery/${name}?ref=${ADM_BRANCH}`);
      await gh(`/repos/${ADM_REPO}/contents/gallery/${name}`,{method:'DELETE',body:JSON.stringify({message:`Картина к стиху ${ref}: файл удалён`,sha:f.sha,branch:ADM_BRANCH})})}
    catch(e){if(e.status!==404)throw e}
    st.textContent=t('adm.deleted');admShow(key,p);
  }catch(e){st.textContent=admErr(e)}
}
