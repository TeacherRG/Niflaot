import { useEffect, useRef, useState, type RefObject } from 'react';
import { useI18n } from '../i18n';
import { mediaControls, type MediaControls } from '../core/mediaControls';
import { canSpeak, loadVoices, speak, speechBlocks } from '../core/speech';

type Note = 'no-voice' | 'no-lang' | 'blocked' | 'failed' | 'silent';

/**
 * «🔊 Слушать»: reads the block `target` aloud (the browser's own voice, no network), highlighting the paragraph
 * being read; pause / continue / stop — here and in the browser's own media controls (`mediaControls`). Says why when
 * nothing sounds (no voices, no voice for the language, sound blocked or silent). Hidden without speech synthesis.
 */
export function Listen({ target, lang }: { target: RefObject<HTMLElement | null>; lang: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [note, setNote] = useState<{ s: Note } | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const current = useRef<HTMLElement | null>(null);
  const media = useRef<MediaControls | null>(null);

  const unmark = () => {
    current.current?.classList.remove('speaking');
    current.current = null;
  };

  // stop when the page (or the text) changes
  useEffect(
    () => () => {
      stop.current?.();
    },
    [lang],
  );

  if (!canSpeak()) return null;

  const pause = () => {
    speechSynthesis.pause();
    media.current?.paused(true);
    setState('paused');
  };
  const resume = () => {
    speechSynthesis.resume();
    media.current?.paused(false);
    setState('playing');
  };

  const play = async () => {
    const root = target.current;
    if (!root) return;
    // the browser's play / pause / stop buttons: started right on the tap, before any waiting
    media.current?.stop();
    media.current = mediaControls(
      {
        title: root.querySelector('h1')?.textContent?.trim() || document.title,
        artist: root.querySelector('.author')?.textContent?.trim() || t('app.title'),
      },
      { play: resume, pause, stop: () => stop.current?.() },
    );
    // no voices on the device: say so instead of «playing» in silence
    const voices = await loadVoices();
    if (!voices.length) {
      media.current?.stop();
      media.current = null;
      return setNote({ s: 'no-voice' });
    }
    const own = voices.some((v) => v.lang.toLowerCase().startsWith(lang));
    setNote(own ? null : { s: 'no-lang' });
    const blocks = speechBlocks(root);
    setState('playing');
    // nothing sounds in a few seconds: the sound is probably off — say so (reading goes on if it starts later)
    let started = false;
    const watch = setTimeout(() => !started && setNote({ s: 'silent' }), 4000);
    stop.current = speak(
      blocks,
      lang,
      (i) => {
        unmark();
        current.current = blocks[i];
        blocks[i].classList.add('speaking');
        blocks[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
      },
      () => {
        clearTimeout(watch);
        unmark();
        media.current?.stop();
        media.current = null;
        stop.current = null;
        setState('idle');
      },
      {
        onFail: (s) => setNote({ s }),
        onSound: () => {
          started = true;
          clearTimeout(watch);
          setNote((n) => (n?.s === 'silent' ? null : n));
        },
      },
    );
  };

  return (
    <div className="listen no-speak" role="group" aria-label={t('listen.title')}>
      {state === 'idle' ? (
        <button className="btn ghost" onClick={play} title={t('listen.title')}>
          🔊 {t('listen.play')}
        </button>
      ) : (
        <>
          <button
            className="btn ghost"
            onClick={state === 'playing' ? pause : resume}
          >
            {state === 'playing' ? `⏸ ${t('listen.pause')}` : `▶ ${t('listen.resume')}`}
          </button>
          <button className="btn ghost" onClick={() => stop.current?.()}>
            ⏹ {t('listen.stop')}
          </button>
        </>
      )}
      {note && (
        <p className="listen-note no" role="status">
          {t(`listen.${note.s}`)}
        </p>
      )}
    </div>
  );
}
