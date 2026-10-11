/**
 * «Установить на телефон»: the browser's own install dialog (Chrome, Edge, Samsung Internet on Android and desktop).
 * The browser offers it only when the site can be installed (manifest — scripts/prerender.ts) and not yet installed;
 * the event is kept from the start, and the menu shows the button while it can be used. Safari has no such event —
 * there it is «На экран Домой» in the share menu. Nothing is asked of the browser until the player taps the button.
 */
interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());

export function installPrompt() {
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    notify();
  });
  addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export const canInstall = () => deferred !== null;
export const subscribeInstall = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};

export async function install() {
  const e = deferred;
  if (!e) return;
  deferred = null;
  notify();
  await e.prompt();
}
