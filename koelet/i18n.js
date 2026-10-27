/* ================================================================
   Многоязычность / Mehrsprachigkeit
   Новый язык добавляется так:
   1. папка content/<код>/ с теми же JSON-файлами, что и content/ru/;
   2. файл locales/<код>.json со строками интерфейса (ключи как в ru.json);
   3. строка в LANGS ниже.
   Если в локали не хватает ключа, берётся строка из русской локали.
   ================================================================ */
const LANGS = {
  ru:{name:'Русский', locale:'ru-RU'},
  uk:{name:'Українська', locale:'uk-UA'},
  de:{name:'Deutsch', locale:'de-DE'},
  en:{name:'English', locale:'en-GB'}
};
const DEFAULT_LANG = 'ru';
const LANG_KEY = 'koelet-lang';
const CONTENT_FILES = ['shared','prologue','city-of-success','puzzle','mirror','brothers','workshop','heleq-lab','one-piece'];
const LOAD_ERROR = {
  ru:['Не удалось загрузить тексты игры','Проверь подключение и обнови страницу.'],
  uk:['Не вдалося завантажити тексти гри','Перевір підключення й онови сторінку.'],
  de:['Die Texte des Spiels konnten nicht geladen werden','Prüfe die Verbindung und lade die Seite neu.'],
  en:['Could not load the game texts','Check your connection and reload the page.']
};

/* ?lang=en в адресе — у каждого языка своя страница для поисковиков (hreflang в index.html) */
function urlLang(){try{const l=new URLSearchParams(location.search).get('lang');return LANGS[l]?l:null}catch(e){return null}}
function detectLang(){
  const u=urlLang();if(u)return u;
  try{const saved=localStorage.getItem(LANG_KEY);if(saved&&LANGS[saved])return saved}catch(e){}
  const prefs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);
  for(const p of prefs){const code=String(p).slice(0,2).toLowerCase();if(LANGS[code])return code}
  return DEFAULT_LANG;
}
let LANG = detectLang();
let UI = {}, UI_BASE = {};

/* t('ключ', {переменные}) — строка интерфейса. Переменные пишутся как {{name}},
   формы рода — как {он|она} (их разрешает T() из game.js). */
function t(key,vars){
  let s=UI[key]??UI_BASE[key];
  if(s==null)return key;
  if(typeof s!=='string')return s;
  if(vars)s=s.replace(/\{\{(\w+)\}\}/g,(_,n)=>vars[n]??'');
  return typeof T==='function'?T(s):s;
}
/* tl('ключ') — массив или объект из локали (с учётом возраста и рода). */
function tl(key){const v=UI[key]??UI_BASE[key];return typeof R==='function'?R(v):v}
const langLocale=()=>(LANGS[LANG]||LANGS[DEFAULT_LANG]).locale;

async function fetchJSON(path){
  const r=await fetch(path);
  if(!r.ok)throw new Error('Could not load '+path);
  return r.json();
}
/* Загружает строки интерфейса и все тексты игры на языке lang. */
async function loadLang(lang){
  if(!LANGS[lang])lang=DEFAULT_LANG;
  const [base,ui,...content]=await Promise.all([
    lang===DEFAULT_LANG?null:fetchJSON(`locales/${DEFAULT_LANG}.json`),
    fetchJSON(`locales/${lang}.json`),
    ...CONTENT_FILES.map(n=>fetchJSON(`content/${lang}/${n}.json`))
  ]);
  const [shared,prologue,...worlds]=content;
  UI=ui;UI_BASE=base||ui;
  Object.assign(window,shared,{PROLOGUE:prologue,WORLDS:worlds});
  LANG=lang;
  document.documentElement.lang=lang;
  document.title=t('doc.title');
  setMeta(lang);
}
/* описание, canonical и og-теги под язык: Google видит страницу каждого языка на её языке */
function setMeta(lang){
  const url=location.origin+location.pathname+(lang===DEFAULT_LANG?'':'?lang='+lang);
  const set=(sel,attr,v)=>{const el=document.querySelector(sel);if(el)el.setAttribute(attr,v)};
  set('meta[name="description"]','content',t('doc.desc'));
  set('meta[property="og:description"]','content',t('doc.desc'));
  set('meta[property="og:title"]','content',t('doc.title'));
  set('meta[property="og:locale"]','content',langLocale().replace('-','_'));
  if(/^https:/.test(location.origin))set('link[rel="canonical"]','href',url);
}
/* Переключение языка: сохраняем выбор и перезагружаем тексты. */
async function setLang(lang){
  if(!LANGS[lang]||lang===LANG)return false;
  try{localStorage.setItem(LANG_KEY,lang)}catch(e){}
  if(urlLang())try{const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(history.state,'',u)}catch(e){}
  await loadLang(lang);
  return true;
}
