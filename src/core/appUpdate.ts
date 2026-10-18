/**
 * The installed app (and an open tab) gets the new version of the site by itself.
 *
 * An app on the phone is rarely started anew: the system keeps it in the background for days and only shows it again,
 * so the browser never looks for a new service worker and the page keeps running the old code. Therefore:
 * the worker (public/sw.js) is checked when the app comes back to the screen (not more often than every 5 minutes)
 * and once an hour; when a new version has taken over, the page reloads at a moment that loses nothing — while it is
 * hidden, on the next move to another page of the site, or right away if nothing has been touched since it came back.
 */
const CHECK_GAP = 5 * 60_000;

export function installServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const sw = navigator.serviceWorker;
  // the first worker taking over a page that had none is not an update
  const hadController = !!sw.controller;
  let pending = false;
  let touched = false;
  let lastCheck = Date.now();

  const reload = () => location.reload();
  sw.addEventListener('controllerchange', () => {
    if (!hadController || pending) return;
    pending = true;
    if (document.visibilityState === 'hidden' || !touched) reload();
  });
  addEventListener('hashchange', () => pending && reload());
  for (const ev of ['pointerdown', 'keydown'] as const) addEventListener(ev, () => (touched = true), { passive: true, capture: true });

  addEventListener('load', () => {
    sw.register('/sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        const check = () => {
          lastCheck = Date.now();
          reg.update().catch(() => {});
        };
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
            if (pending) reload();
            return;
          }
          touched = false;
          if (Date.now() - lastCheck > CHECK_GAP) check();
        });
        setInterval(() => document.visibilityState === 'visible' && check(), 60 * 60_000);
      })
      .catch(() => {});
  });
}
