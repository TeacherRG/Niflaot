/**
 * The alarm of «Часы» (`#/clock`): storage, the watch and the ring. The rules — src/core/clock.ts.
 *
 * A web page cannot wake a closed app: the alarm rings while the site is open (any page) — a sound (Web Audio, after
 * any tap in this visit: browsers keep a page silent until then), a vibration, a window with «Стоп» and «Ещё 5 минут»,
 * and a system notification if the reader has already allowed the reminders (no new request here). On Shabbat the site
 * itself is closed (ShabbatRest), on Yom Tov and Yom Kippur the watch keeps quiet (restAt).
 */
import { ALARM_EVENT, ALARM_KEY } from './alarmStore';
import { cleanAlarm, inIsrael, nextRing, restAt, type Alarm, type Spot } from './clock';
import { currentPlace } from './places';

const SINCE_KEY = 'niflaot:alarm-since';
const DONE_KEY = 'niflaot:alarm-done';
/** the app was opened a little late — the alarm still rings */
export const LATE_MS = 10 * 60_000;
export const SNOOZE_MIN = 5;
/** nobody stopped it — it stops itself */
const RING_MS = 3 * 60_000;
const TICK_MS = 10_000;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

export function loadAlarm(): Alarm {
  try {
    return cleanAlarm(JSON.parse(read(ALARM_KEY) ?? 'null'));
  } catch {
    return cleanAlarm(null);
  }
}

/** Save the alarm; rings that were due before this moment are not rung (a time set to five minutes ago is tomorrow's). */
export function saveAlarm(a: Alarm) {
  write(ALARM_KEY, JSON.stringify(cleanAlarm(a)));
  write(SINCE_KEY, String(Date.now()));
  try {
    window.dispatchEvent(new Event(ALARM_EVENT));
  } catch {}
}

/** The reader's city as the clock needs it; null — no city (the calendar offers to choose one). */
export function currentSpot(): Spot | null {
  const { place, zone } = currentPlace();
  return place ? { lat: place.lat, lon: place.lon, zone, il: inIsrael(zone) } : null;
}

// ——— the sound ———

let audio: AudioContext | null = null;
let beeper = 0;

/** Call on a tap: after it the browser lets the page sound. True — the sound is ready. */
export function armSound(): boolean {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume();
    return audio.state === 'running';
  } catch {
    return false;
  }
}
export const soundReady = () => audio?.state === 'running';

/** one phrase of the alarm: four rising notes, about a second */
function phrase() {
  const a = audio;
  if (!a || a.state !== 'running') return;
  const now = a.currentTime;
  [659, 784, 988, 1319].forEach((f, i) => {
    const o = a.createOscillator();
    const g = a.createGain();
    const at = now + i * 0.17;
    o.type = 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.32, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + (i === 3 ? 0.5 : 0.16));
    o.connect(g).connect(a.destination);
    o.start(at);
    o.stop(at + 0.55);
  });
}
function startSound() {
  stopSound();
  armSound();
  const beat = () => {
    phrase();
    try {
      navigator.vibrate?.([220, 120, 220, 120, 400]);
    } catch {}
  };
  beat();
  beeper = window.setInterval(beat, 1500);
}
function stopSound() {
  clearInterval(beeper);
  beeper = 0;
  try {
    navigator.vibrate?.(0);
  } catch {}
}

// ——— the ring ———

export interface Ring {
  /** when it was due */
  at: Date;
  /** «Проверить звонок» on the clock page */
  test?: boolean;
}

let ringing: Ring | null = null;
let snoozeAt = 0;
let quiet = 0;
const listeners = new Set<(r: Ring | null) => void>();
const tell = () => listeners.forEach((f) => f(ringing));
export const currentRing = () => ringing;
export function onRing(f: (r: Ring | null) => void) {
  listeners.add(f);
  return () => void listeners.delete(f);
}

const TAG = 'niflaot-alarm';
function notify(title: string, body: string) {
  try {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted' || !navigator.serviceWorker) return;
    void navigator.serviceWorker.ready
      .then((reg) => reg.showNotification(title, { body, tag: TAG, icon: '/icons/icon-192.png', requireInteraction: true, data: { url: '/#/clock' } }))
      .catch(() => {});
  } catch {}
}
function unnotify() {
  try {
    void navigator.serviceWorker?.ready.then((reg) => reg.getNotifications({ tag: TAG })).then((list) => list.forEach((n) => n.close())).catch(() => {});
  } catch {}
}

/** the words of the system notification — the page sets them in its language */
let words = { title: 'Niflaot', body: '' };
export const setRingWords = (title: string, body: string) => void (words = { title, body });

export function ring(r: Ring) {
  ringing = r;
  startSound();
  if (!r.test && document.visibilityState !== 'visible') notify(words.title, words.body);
  clearTimeout(quiet);
  quiet = window.setTimeout(stopRing, RING_MS);
  tell();
}
export function stopRing() {
  clearTimeout(quiet);
  stopSound();
  unnotify();
  ringing = null;
  tell();
}
export function snooze() {
  const test = ringing?.test;
  stopRing();
  if (!test) snoozeAt = Date.now() + SNOOZE_MIN * 60_000;
}

function tick() {
  if (ringing) return;
  const a = loadAlarm();
  const s = currentSpot();
  if (!a.on || !s) return void (snoozeAt = 0);
  const now = new Date();
  if (snoozeAt && now.getTime() >= snoozeAt) {
    snoozeAt = 0;
    if (!restAt(now, s, a.chm)) ring({ at: now });
    return;
  }
  const since = Number(read(SINCE_KEY)) || 0;
  const r = nextRing(a, new Date(Math.max(now.getTime() - LATE_MS, since)), s, 1);
  if (!r || r.at > now) return;
  const id = String(r.at.getTime());
  if (read(DONE_KEY) === id) return;
  write(DONE_KEY, id);
  if (!restAt(now, s, a.chm)) ring({ at: r.at });
}

/** Watch the clock while the site is open; returns «stop watching». */
export function watchAlarm(): () => void {
  tick();
  const id = window.setInterval(tick, TICK_MS);
  // a phone wakes the page up: look at once, not at the next tick
  const seen = () => document.visibilityState === 'visible' && tick();
  document.addEventListener('visibilitychange', seen);
  // any tap of this visit lets the page sound when the time comes
  const arm = () => armSound();
  document.addEventListener('pointerdown', arm, { passive: true });
  document.addEventListener('keydown', arm);
  return () => {
    clearInterval(id);
    document.removeEventListener('visibilitychange', seen);
    document.removeEventListener('pointerdown', arm);
    document.removeEventListener('keydown', arm);
  };
}
