import { useEffect, useRef, useState, type RefObject } from 'react';
import { useI18n } from '../i18n';
import { canSpeak, speak, speechBlocks } from '../core/speech';

/**
 * «🔊 Слушать»: reads the block `target` aloud (the browser's own voice, no network), highlighting the paragraph
 * being read; pause / continue / stop. Hidden where the browser has no speech synthesis.
 */
export function Listen({ target, lang }: { target: RefObject<HTMLElement | null>; lang: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const stop = useRef<(() => void) | null>(null);
  const current = useRef<HTMLElement | null>(null);

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

  const play = () => {
    const root = target.current;
    if (!root) return;
    const blocks = speechBlocks(root);
    setState('playing');
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
        unmark();
        stop.current = null;
        setState('idle');
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
            onClick={() => {
              if (state === 'playing') {
                speechSynthesis.pause();
                setState('paused');
              } else {
                speechSynthesis.resume();
                setState('playing');
              }
            }}
          >
            {state === 'playing' ? `⏸ ${t('listen.pause')}` : `▶ ${t('listen.resume')}`}
          </button>
          <button className="btn ghost" onClick={() => stop.current?.()}>
            ⏹ {t('listen.stop')}
          </button>
        </>
      )}
    </div>
  );
}
