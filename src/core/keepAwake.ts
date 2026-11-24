/**
 * The screen stays on while the text plays by itself — the reading of Tehillim with its recording, the siddur and
 * «Шнаим микра» with the highlight running, the karaoke of a niggun (owner, 24.11.2026: «тухнет экран, когда идёт
 * подсветка, и нужно прикасаться к экрану»). Screen Wake Lock API: no prompt, the browser grants it to a visible page;
 * it is released when the page is hidden, so it is asked for again when the page comes back. No API (old Safari,
 * Firefox before 126) — nothing happens, as before.
 */
import { useEffect } from 'react';

type Sentinel = { released: boolean; release(): Promise<void>; addEventListener(t: 'release', f: () => void): void };
type WakeLock = { request(type: 'screen'): Promise<Sentinel> };

const users = new Set<object>();
let lock: Sentinel | null = null;
let asking = false;

function api(): WakeLock | undefined {
  return typeof navigator !== 'undefined' ? (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock : undefined;
}

async function acquire() {
  const w = api();
  if (!w || asking || !users.size || document.visibilityState !== 'visible' || (lock && !lock.released)) return;
  asking = true;
  try {
    const s = await w.request('screen');
    s.addEventListener('release', () => {
      if (lock === s) lock = null;
    });
    lock = s;
    if (!users.size) void drop();
  } catch {
    // refused (battery saver, the page not focused) — the screen just behaves as usual
  } finally {
    asking = false;
  }
}

async function drop() {
  const s = lock;
  lock = null;
  try {
    await s?.release();
  } catch {
    /* already released */
  }
}

if (typeof document !== 'undefined')
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void acquire();
  });

/** Keeps the screen on while `on` (and the page is visible). */
export function useKeepAwake(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const me = {};
    users.add(me);
    void acquire();
    return () => {
      users.delete(me);
      if (!users.size) void drop();
    };
  }, [on]);
}
