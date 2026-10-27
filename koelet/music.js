/* ================================================================
   Музыка и голос-гид («музыкальный текстовый квест»)
   - Music: фоновая музыка из music/tracks.json (одна мелодия по кругу или все по очереди),
     громкость, приглушение во время речи, пауза в скрытой вкладке.
   - Voice: голос Хранителя (готовая озвучка Azure из audio/, иначе синтез речи браузера):
     приветствие, подсказка «что делать» на каждом экране и рассказ о последствиях выбора.
   - Музыка и голос включены при каждом открытии игры: «Без звука» и
     выключатели в меню действуют до перезагрузки страницы. Мелодия и
     громкость запоминаются (localStorage «koelet-audio», отдельно от прогресса).
   - Если Хранитель молчит минуту, он спрашивает «Тебе чем-то помочь?» и
     повторяет, что делать на этом экране.
   Браузеры не дают играть звук до первого касания, поэтому звук включается
   кнопкой на приветственном экране (gate) — это и есть «разрешение».
   ================================================================ */
const AUDIO_KEY = 'koelet-audio';
const AUDIO_DEFAULTS = {music: true, voice: true, track: 'all', volume: 0.35};
const Audio_ = {prefs: {...AUDIO_DEFAULTS}, tracks: [], unlocked: false};
try { const p = JSON.parse(localStorage.getItem(AUDIO_KEY) || '{}'); for (const k of ['track', 'volume']) if (k in p) Audio_.prefs[k] = p[k]; } catch (e) {}
const MUSIC_READY = (async () => { try { const r = await fetch('music/tracks.json'); if (r.ok) Audio_.tracks = (await r.json()).tracks || []; } catch (e) {} })();
function saveAudioPrefs(){ try { const {track, volume} = Audio_.prefs; localStorage.setItem(AUDIO_KEY, JSON.stringify({track, volume})); } catch (e) {} }

/* ---------- Музыка ---------- */
const Music = {
  el: null, idx: 0, ducked: false, fadeT: null,
  title(tr){ return tr ? (tr.title && (tr.title[LANG] || tr.title[DEFAULT_LANG])) || tr.he || tr.id : ''; },
  current(){ return Audio_.tracks[this.idx]; },
  _pick(){
    const p = Audio_.prefs.track, i = Audio_.tracks.findIndex(x => x.id === p);
    if (i >= 0) this.idx = i;
    else if (this.idx >= Audio_.tracks.length) this.idx = 0;
  },
  _ensure(){
    if (this.el) return this.el;
    const a = document.createElement('audio');
    a.preload = 'none';
    a.addEventListener('ended', () => {            // «все по очереди» → следующая мелодия
      if (Audio_.prefs.track === 'all' && Audio_.tracks.length) { this.idx = (this.idx + 1) % Audio_.tracks.length; this._src(); this._play(); }
    });
    this.el = a; return a;
  },
  _src(){
    const a = this._ensure(), tr = this.current(); if (!tr) return;
    a.loop = Audio_.prefs.track !== 'all';
    if (!a.src.endsWith(tr.file)) a.src = tr.file;
  },
  _target(){ return Math.max(0, Math.min(1, Audio_.prefs.volume)) * (this.ducked ? 0.3 : 1); },
  _fade(to, ms = 600){
    const a = this.el; if (!a) return;
    clearInterval(this.fadeT);
    const from = a.volume, steps = 12; let k = 0;
    this.fadeT = setInterval(() => { k++; a.volume = Math.max(0, Math.min(1, from + (to - from) * k / steps)); if (k >= steps) clearInterval(this.fadeT); }, ms / steps);
  },
  _play(){
    const a = this.el; if (!a) return Promise.resolve(false);
    return a.play().then(() => true, () => false);
  },
  /* Запуск (вызывать из обработчика нажатия — так браузер разрешит звук). */
  async start(){
    if (!Audio_.prefs.music || !Audio_.tracks.length) return false;
    this._pick(); this._src();
    const a = this.el; a.volume = 0;
    const ok = await this._play();
    if (ok) this._fade(this._target(), 1500);
    return ok;
  },
  stop(){ if (this.el) { clearInterval(this.fadeT); this.el.pause(); } },
  get playing(){ return !!(this.el && !this.el.paused); },
  setMusic(on){ Audio_.prefs.music = on; saveAudioPrefs(); on ? this.start() : this.stop(); },
  setTrack(id){
    Audio_.prefs.track = id; saveAudioPrefs();
    if (id === 'all') { if (this.el) this.el.loop = false; return; }
    this._pick(); this._src();
    if (Audio_.prefs.music) { this.el.currentTime = 0; this.start(); }
  },
  setVolume(v){ Audio_.prefs.volume = v; saveAudioPrefs(); if (this.el) { clearInterval(this.fadeT); this.el.volume = this._target(); } },
  duck(on){ if (this.ducked === on) return; this.ducked = on; if (this.playing) this._fade(this._target(), 400); }
};
/* Скрытая вкладка — пауза, вернулись — продолжаем. */
document.addEventListener('visibilitychange', () => {
  if (!Music.el || !Audio_.prefs.music || !Audio_.unlocked) return;
  if (document.hidden) Music.el.pause(); else Music._play();
});

/* ---------- Голос-гид ---------- */
/* Сначала — готовая озвучка Azure (audio/<язык>/<ключ>.mp3, по предложению на файл,
   см. voice-key.js и tools/tts.mjs). Предложения, которых нет в audio/<язык>/index.json
   (имя героя, числа, новые тексты), говорит синтез речи браузера. */
const Voice = {
  seq: 0, idleMs: 60000, gapMs: 500, idleT: null, el: null, keys: null, keysLang: null, speaking: false, reading: false,
  synthOk(){ try { return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'; } catch (e) { return false; } },
  can(){ return !!this.keys || this.synthOk(); },
  /* Список готовых фраз для текущего языка (один раз на язык). */
  load(){
    if (this.keysLang === LANG) return;
    const lang = this.keysLang = LANG; this.keys = null;
    fetch(`audio/${lang}/index.json`).then(r => r.ok ? r.json() : null).then(j => { if (j && lang === LANG) this.keys = new Set(j.keys || []); }).catch(() => {});
  },
  /* Файл для предложения; если в нём имя героя — ищем то же предложение без имени. */
  clip(s){
    if (!this.keys) return null;
    let k = VoiceKey.key(s);
    if (!this.keys.has(k)) {
      const name = typeof S !== 'undefined' && S.hero && S.hero.name.trim();
      if (!name) return null;
      k = VoiceKey.key(VoiceKey.plain(s).split(name).join(' '));
      if (!this.keys.has(k)) return null;
    }
    return `audio/${this.keysLang}/${k}.mp3`;
  },
  cancel(){
    this.seq++; this.speaking = this.reading = false; this.idle();
    if (this.el) { try { this.el.pause(); } catch (e) {} }
    if (this._stop) this._stop();
    try { if (this.synthOk()) speechSynthesis.cancel(); } catch (e) {}
    Music.duck(false);
  },
  _audio(){
    if (!this.el) { this.el = new Audio(); this.el.preload = 'auto'; this.el.setAttribute('playsinline', ''); }
    return this.el;
  },
  /* Один кусок: готовый файл или синтез браузера. true — прозвучал, false — не смог. */
  _clip(url, my){
    const a = this._audio();
    return new Promise(res => {
      const end = ok => { a.onended = a.onerror = null; this._stop = null; res(ok); };
      this._stop = () => end(false);
      a.onended = () => end(true); a.onerror = () => end(false);
      a.src = url; a.playbackRate = typeof young === 'function' && young() ? .95 : 1;
      a.play().then(() => { if (my !== this.seq) a.pause(); }, () => end(false));
    });
  },
  /* Хранитель — мужчина: из голосов браузера берём мужской (по имени голоса),
     иначе — любой голос этого языка. */
  MALE: /\b(male|mann|dmitr|dmitry|pavel|yuri|maxim|mikhail|ostap|conrad|killian|stefan|markus|florian|hans|jonas|bernd|christoph|ralf|kasper|andrew|guy|davis|brian|christopher|eric|roger|steffan|daniel|arthur|oliver|george|ryan|thomas|alex|fred|tom)\b|муж|чолов/i,
  maleVoice(){
    const all = speechSynthesis.getVoices().filter(x => x.lang && x.lang.toLowerCase().startsWith(LANG));
    return all.find(x => this.MALE.test(x.name) && !/female|frau|жен/i.test(x.name)) || all[0] || null;
  },
  _synth(text, my){
    if (!this.synthOk()) return Promise.resolve(false);
    return new Promise(res => {
      let fin = false; const end = ok => { if (!fin) { fin = true; res(ok); } };
      const u = new SpeechSynthesisUtterance(text.replace(/[«»„“”"]/g, ''));
      u.lang = langLocale(); u.rate = typeof young === 'function' && young() ? .92 : 1; u.pitch = .95;
      const v = this.maleVoice(); if (v) u.voice = v;
      u.onend = () => end(true); u.onerror = () => end(false);
      try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { end(false); }
      setTimeout(() => { if (my === this.seq && !speechSynthesis.speaking) end(false); }, 4000);
    });
  },
  /* Произносит текст (или несколько фраз подряд). Promise: true — договорил,
     false — звук не смог начаться, null — речь прервана. */
  say(parts, {force = false, reading = false} = {}){
    this.load();
    if ((!Audio_.prefs.voice && !force) || !this.can() || !Audio_.unlocked) return Promise.resolve(false);
    const sents = [].concat(parts).filter(Boolean).flatMap((p, n) => VoiceKey.sentences(p).map(text => ({text, n})));
    if (!sents.length) return Promise.resolve(false);
    /* Заголовок и текст, фраза и подсказка — разные части: между ними пауза. Строка без точки
       в конце (заголовок) тоже отделяется паузой, а для синтеза браузера получает точку. */
    const open = s => !/[.!?…:;][»"“”)\]]*$/.test(s);
    const items = [];
    for (const {text: s, n} of sents) {
      const url = this.clip(s), last = items[items.length - 1];
      const gap = !last ? 0 : last.n !== n || open(last.text) ? this.gapMs : 0;
      /* подряд идущие предложения без файла — одной фразой, чтобы синтез звучал связно */
      if (!url && last && !last.url && !gap) last.text += ' ' + s; else items.push({url, text: s, n, gap});
    }
    this.cancel(); const my = this.seq;
    this.speaking = true; this.reading = reading; clearTimeout(this.idleT); Music.duck(true);
    /* первый play() — синхронно, внутри нажатия: так iOS разрешит звук */
    return (async () => {
      let any = false;
      for (const it of items) {
        if (it.gap && any) await new Promise(r => setTimeout(r, it.gap));
        if (my !== this.seq) return null;
        let ok = it.url ? await this._clip(it.url, my) : false;
        if (!ok && my === this.seq) ok = await this._synth(open(it.text) ? it.text + '.' : it.text, my);
        any = any || ok;
      }
      if (my !== this.seq) return null;
      this.speaking = this.reading = false; Music.duck(false); this.idle();
      return any;
    })();
  },
  setVoice(on){ Audio_.prefs.voice = on; saveAudioPrefs(); if (!on) this.cancel(); },
  /* Минута тишины (Хранитель молчит, игрок ничего не нажимает) → «Тебе чем-то помочь?»
     и снова подсказка, что делать. Отсчёт заново после каждой речи и каждого касания. */
  idle(){
    clearTimeout(this.idleT);
    if (!Audio_.prefs.voice || !Audio_.unlocked) return;
    this.idleT = setTimeout(() => {
      if (document.hidden || document.querySelector('#gate, .sheet') || this.speaking) return this.idle();
      const hint = guideParts().filter(Boolean).pop();
      this.say([t('voice.idle'), hint]);
    }, this.idleMs);
  }
};
Voice.load();
['pointerdown', 'keydown'].forEach(e => document.addEventListener(e, () => Voice.idle(), {passive: true, capture: true}));

/* ---------- Подсказка «что делать» для текущего экрана ---------- */
/* Первая фраза — главный текст экрана (слова Хранителя), вторая — что нажать. */
function guideParts(){
  const $s = sel => document.querySelector('#stage ' + sel);
  const txt = el => el ? el.innerHTML.trim() : '';   // HTML: теги станут пробелами, как в tools/tts.mjs
  const scr = S.screen;
  if (scr === 'title') return [t(S.sparks > 0 ? 'voice.titleBack' : 'voice.title')];
  if (scr === 'create') return [t('voice.create')];
  if (scr === 'welcome') return [txt($s('.bubble .txt')), t('voice.welcome')];
  if (scr === 'map') {
    if (S.done.every(Boolean)) return [t('voice.mapDone')];
    const open = S.ps < PRO().length ? t('map.proName') : (WORLDS[S.done.findIndex(d => !d)] || {}).name;
    return [t('voice.map', {name: open || ''})];
  }
  if (scr === 'done') return [txt($s('.reveal .h2')), t('voice.done')];
  if (scr === 'final') return [t('voice.final')];
  if (scr === 'shabbat') return [t('voice.shabbat')];
  if (scr === 'pasuk') return [t('voice.pasuk')];
  if (scr === 'hayom') return [t('voice.hayom')];
  if (scr === 'gallery') return [t('voice.gallery')];
  if (scr === 'lot') return [txt($s('.bubble .txt')), t(S.lotStep === 'name' ? 'voice.lotName' : S.lotStep === 'date' ? 'voice.lotDate' : 'voice.lot')];
  if (scr !== 'world' && scr !== 'prologue') return [];
  let st = steps()[idx()]; if (!st) return [];
  if (typeof st === 'function') st = st(S);
  if (st.__dynamic || (st.body && st.body.__dynamic)) st = resolveDynamic(st);
  const type = st.type, game = R(st.game);
  if (!type) return [];
  if (type === 'mini') return [txt($s('.bubble .txt')) || txt($s('.lead')), t('voice.mini.' + game)];
  if (type === 'card') return [txt($s('.card .h2')), young() ? txt($s('.card p')) : '', t('voice.card')];
  if (type === 'reveal') return [txt($s('.reveal .h1')), t('voice.reveal')];
  if (type === 'quote') return [t('voice.quote')];
  return [txt($s('.bubble .txt')), txt($s('p.h2')), t('voice.' + type)];
}
let guideTimer = null;
function guideScreen(){
  clearTimeout(guideTimer);
  if (!Audio_.prefs.voice || !Audio_.unlocked) return;
  guideTimer = setTimeout(() => { const parts = guideParts(); if (parts.some(Boolean)) Voice.say(parts); }, 450);
}

/* ---------- Настройки (меню и титульный экран) ---------- */
function audioPanelHTML(compact, opt){
  const P = Audio_.prefs, o = opt || {};
  const sw = (k, ic, on) => `<button class="swrow" role="switch" data-audio="${k}" aria-checked="${on}">${icon(on ? ic : 'mute')}<span>${t('audio.' + k)}</span><i class="switch" aria-hidden="true"></i></button>`;
  const head = `<span class="kicker">${o.title || t('audio.title')}</span>${o.pre || ''}${sw('music', 'note', P.music)}${sw('voice', 'chat', P.voice)}`;
  if (compact) return `<div class="audiopanel compact" role="group" aria-label="${t('audio.title')}">${head}</div>`;
  const opts = [['all', t('audio.all')], ...Audio_.tracks.map(tr => [tr.id, Music.title(tr)])];
  const cur = (opts.find(([id]) => id === P.track) || opts[0])[1];
  /* мелодии, громкость и авторство — в подменю «Мелодия · текущая», как «Твоя часть в Торе» и «Язык» */
  return `<div class="audiopanel" role="group" aria-label="${o.title || t('audio.title')}">${head}
    ${Audio_.tracks.length ? `<button class="mitem mgroup" data-trkgrp aria-expanded="${!!Audio_.ddOpen}" aria-controls="msub-trk">${icon('note')}<span>${t('audio.track')} · ${esc(cur)}</span><i class="mchev ${Audio_.ddOpen ? 'open' : ''}" aria-hidden="true">${icon('up')}</i></button>
    <div class="msub" id="msub-trk" ${Audio_.ddOpen ? '' : 'hidden'}>${opts.map(([id, name]) => `<button class="mitem ${P.track === id ? 'on' : ''}" data-track="${id}" aria-current="${P.track === id}">${icon(P.track === id ? 'check' : 'note')}<span>${esc(name)}</span></button>`).join('')}
    <label class="lbl" for="vol">${t('audio.volume')}</label><input type="range" id="vol" min="0" max="100" step="5" value="${Math.round(P.volume * 100)}">
    <small>${t('audio.credit')}</small></div>` : ''}</div>`;
}

function wireAudioPanel(root, redraw){
  root.querySelectorAll('[data-audio]').forEach(b => b.onclick = () => {
    Audio_.unlocked = true;
    if (b.dataset.audio === 'music') Music.setMusic(!Audio_.prefs.music);
    else { Voice.setVoice(!Audio_.prefs.voice); if (Audio_.prefs.voice) Voice.say(t('voice.on')); }
    redraw();
  });
  root.querySelectorAll('[data-track]').forEach(b => b.onclick = () => { Audio_.unlocked = true; if (!Audio_.prefs.music) Audio_.prefs.music = true; Music.setTrack(b.dataset.track); if (!Music.playing) Music.start(); redraw(); });
  const grp = root.querySelector('[data-trkgrp]'); if (grp) grp.onclick = () => { Audio_.ddOpen = !Audio_.ddOpen; if (typeof sfx !== 'undefined') sfx.tap(); redraw(); };
  const vol = root.querySelector('#vol'); if (vol) vol.oninput = () => Music.setVolume(vol.value / 100);
}

/* ---------- Приветственный экран: первое касание включает звук ---------- */
function showGate(onDone){
  const g = document.createElement('div');
  g.className = 'gate'; g.id = 'gate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-labelledby', 'gate-h');
  g.innerHTML = `<div class="gate-card"><div class="gate-m">${mentorSvg('joy')}</div>
    <span class="kicker">${t('title.kicker')}</span><h1 class="h2" id="gate-h">${t('title.h1a')} ${t('title.h1b')}</h1>
    <p>${t(S.sparks > 0 ? 'voice.titleBack' : 'voice.title')}</p>
    <button class="btn" id="gate-go">${icon('note')}<span>${t('gate.go')}</span></button>
    <button class="btn ghost small" id="gate-quiet">${t('gate.quiet')}</button></div>`;
  document.body.appendChild(g);
  const close = () => { g.remove(); onDone(); if (typeof refreshQuickBtn === 'function') refreshQuickBtn(); };
  g.querySelector('#gate-go').onclick = () => {
    Audio_.unlocked = true;
    Audio_.prefs.music = Audio_.prefs.voice = true;
    if (typeof unlockAudio === 'function') unlockAudio();
    Music.start().then(ok => { if (!ok) MUSIC_READY.then(() => Music.start()); });   // тут же, в обработчике нажатия
    Voice.say(t(S.sparks > 0 ? 'voice.titleBack' : 'voice.title'));
    Audio_.greeted = true;
    close();
  };
  g.querySelector('#gate-quiet').onclick = () => { Audio_.unlocked = true; Audio_.prefs.music = false; Audio_.prefs.voice = false; close(); };   // только до перезагрузки
  g.querySelector('#gate-go').focus();
}
