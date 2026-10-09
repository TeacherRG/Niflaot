import silence from '../assets/listen.wav';

/**
 * The browser's own controls for «Слушать»: speech synthesis alone gets none, so while the page is read aloud a
 * silent looping track plays and the Media Session API names it — the browser then shows its play / pause / stop
 * buttons itself (Android: the media notification and the lock screen; desktop Chrome: the media button in the
 * toolbar) and «Звук» in the site's settings. No permission is asked: the track starts on the user's tap.
 */
export type MediaControls = { paused(p: boolean): void; stop(): void };

export function mediaControls(
  meta: { title: string; artist: string },
  on: { play: () => void; pause: () => void; stop: () => void },
): MediaControls {
  const audio = new Audio(silence);
  audio.loop = true;
  audio.play().catch(() => {}); // refused or no sound: reading goes on, just without the browser's buttons
  const ms = 'mediaSession' in navigator ? navigator.mediaSession : null;
  if (ms) {
    try {
      ms.metadata = new MediaMetadata({ ...meta, album: 'Niflaot' });
    } catch {
      /* MediaMetadata missing */
    }
    const handlers: [MediaSessionAction, () => void][] = [
      ['play', on.play],
      ['pause', on.pause],
      ['stop', on.stop],
    ];
    for (const [a, h] of handlers) {
      try {
        ms.setActionHandler(a, h);
      } catch {
        /* action not supported */
      }
    }
    ms.playbackState = 'playing';
  }
  return {
    paused(p) {
      if (p) audio.pause();
      else audio.play().catch(() => {});
      if (ms) ms.playbackState = p ? 'paused' : 'playing';
    },
    stop() {
      audio.pause();
      audio.removeAttribute('src');
      if (!ms) return;
      ms.playbackState = 'none';
      ms.metadata = null;
      for (const a of ['play', 'pause', 'stop'] as MediaSessionAction[]) {
        try {
          ms.setActionHandler(a, null);
        } catch {
          /* action not supported */
        }
      }
    },
  };
}
