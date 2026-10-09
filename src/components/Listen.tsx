import { useEffect, useRef, useState, type RefObject } from 'react';
import { useI18n } from '../i18n';
import { canSpeak, checkSpeech, loadVoices, speak, speechBlocks, type SpeechCheck } from '../core/speech';

type Note = SpeechCheck['status'] | 'testing';

/**
 * «🔊 Слушать»: reads the block `target` aloud (the browser's own voice, no network), highlighting the paragraph
 * being read; pause / continue / stop. «🔈 Проверить звук» says one phrase and tells whether the browser can play
 * speech here (no voices, no voice for the language, sound blocked or silent). Hidden without speech synthesis.
 */
export function Listen({ target, lang }: { target: RefObject<HTMLElement | null>; lang: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [note, setNote] = useState<{ s: Note; voice?: string } | null>(null);
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

  const play = async () => {
    const root = target.current;
    if (!root) return;
    // no voices on the device: say so instead of «playing» in silence
    const voices = await loadVoices();
    if (!voices.length) return setNote({ s: 'no-voice' });
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

  const test = async () => {
    setNote({ s: 'testing' });
    const r = await checkSpeech(lang, t('listen.phrase'));
    setNote({ s: r.status, voice: r.voice });
  };

  return (
    <div className="listen no-speak" role="group" aria-label={t('listen.title')}>
      {state === 'idle' ? (
        <>
          <button className="btn ghost" onClick={play} title={t('listen.title')}>
            🔊 {t('listen.play')}
          </button>
          <button className="btn ghost listen-test" onClick={test} disabled={note?.s === 'testing'}>
            🔈 {t('listen.test')}
          </button>
        </>
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
      {note && (
        <p className={`listen-note${note.s === 'ok' ? ' ok' : note.s === 'testing' ? '' : ' no'}`} role="status">
          {t(`listen.${note.s}`, { voice: note.voice ?? '' })}
        </p>
      )}
    </div>
  );
}
