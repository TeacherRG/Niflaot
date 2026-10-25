import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { fetchPart, loadNarration, silence } from '../core/listen';
import { ASSISTANT_URL } from '../core/assistant';
import type { Narration } from '../core/speech';

const SPEEDS = [1, 1.25, 1.5, 0.85];

type Status = 'off' | 'loading' | 'playing' | 'paused' | 'error' | 'done';

/**
 * «Слушать урок» on a read page: the lesson read aloud by a male voice (Gemini TTS, src/core/listen.ts), part after
 * part; the next part is fetched while one plays. The first listener of a part waits while it is recorded (the note
 * says so); everyone after gets it at once. Hidden when the lesson has no recording (no assistant / dev build).
 * `load` — the parts made on the page (a passage of the Prophets / Writings: src/core/tanakhNarration.ts); a lesson's
 * are loaded from the site.
 */
export function ListenBar({
  slug,
  lang,
  title,
  load,
  passage,
}: {
  slug: string;
  lang: string;
  title: string;
  load?: () => Promise<Narration | null>;
  /** a passage of the day, not a lesson: the button's words */
  passage?: boolean;
}) {
  const { t } = useI18n();
  const [nar, setNar] = useState<Narration | null>(null);
  const [status, setStatus] = useState<Status>('off');
  const [at, setAt] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [slow, setSlow] = useState(false);
  const [quota, setQuota] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const urls = useRef(new Map<number, Promise<string>>());
  const run = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const loader = useRef(load);
  loader.current = load;

  useEffect(() => {
    let live = true;
    setNar(null);
    (ASSISTANT_URL ? (loader.current?.() ?? loadNarration(lang, slug)) : Promise.resolve(null))
      .catch(() => null)
      .then((n) => live && setNar(n?.parts.length ? n : null));
    return () => {
      live = false;
    };
  }, [lang, slug]);

  // leaving the page: stop and free the recordings
  useEffect(
    () => () => {
      abort.current?.abort();
      abort.current = null;
      run.current++;
      audio.current?.pause();
      setStatus('off');
      setAt(0);
      urls.current.forEach((p) => p.then(URL.revokeObjectURL, () => {}));
      urls.current.clear();
    },
    [lang, slug],
  );

  if (!nar) return null;
  const parts = nar.parts;

  const get = (i: number) => {
    let p = urls.current.get(i);
    if (!p) {
      abort.current ??= new AbortController();
      p = fetchPart(nar.lang ?? lang, slug, parts[i].h, abort.current.signal);
      // a failed part is fetched again on the next try
      p.catch(() => urls.current.delete(i));
      urls.current.set(i, p);
    }
    return p;
  };

  const play = async (i: number) => {
    const a = (audio.current ??= new Audio());
    const me = ++run.current;
    setAt(i);
    setStatus('loading');
    setSlow(false);
    const timer = setTimeout(() => run.current === me && setSlow(true), 2500);
    try {
      const url = await get(i);
      if (run.current !== me) return;
      a.src = url;
      a.playbackRate = SPEEDS[speed];
      a.onended = () => {
        if (run.current !== me) return;
        if (i + 1 < parts.length) play(i + 1);
        else setStatus('done');
      };
      await a.play();
      if (run.current !== me) return;
      setStatus('playing');
      // the part after this one — while this one plays; the ones before are not needed any more
      if (i + 1 < parts.length) get(i + 1).catch(() => {});
      for (const [k, p] of urls.current)
        if (k < i - 1) {
          urls.current.delete(k);
          p.then(URL.revokeObjectURL, () => {});
        }
      media(i);
    } catch (e) {
      if (run.current !== me) return;
      setQuota((e as Error).message === 'quota');
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  };

  const media = (i: number) => {
    const ms = navigator.mediaSession;
    if (!ms) return;
    try {
      ms.metadata = new MediaMetadata({ title: parts[i].label, artist: title, album: t('app.title') });
      ms.setActionHandler('play', () => resume());
      ms.setActionHandler('pause', () => pause());
      ms.setActionHandler('previoustrack', () => play(Math.max(0, i - 1)));
      ms.setActionHandler('nexttrack', () => i + 1 < parts.length && play(i + 1));
    } catch {}
  };

  const start = () => {
    // in the tap itself: Safari lets the element play what arrives after the wait
    const a = (audio.current ??= new Audio());
    const s = silence();
    a.src = s;
    a.play().catch(() => {}).finally(() => URL.revokeObjectURL(s));
    play(status === 'done' ? 0 : at);
  };
  const pause = () => {
    audio.current?.pause();
    setStatus('paused');
  };
  const resume = () => {
    audio.current?.play().then(() => setStatus('playing'), () => setStatus('error'));
  };
  const close = () => {
    run.current++;
    audio.current?.pause();
    setStatus('off');
  };
  const nextSpeed = () => {
    const k = (speed + 1) % SPEEDS.length;
    setSpeed(k);
    if (audio.current) audio.current.playbackRate = SPEEDS[k];
  };

  if (status === 'off')
    return (
      <div className="listen no-speak">
        <button type="button" className="btn listen-go" onClick={start}>
          🎧 {t(passage ? 'listen.btnPassage' : 'listen.btn')}
        </button>
      </div>
    );

  return (
    <div className="listen on no-speak" role="region" aria-label={t(passage ? 'listen.btnPassage' : 'listen.btn')}>
      <div className="listen-row">
        <button type="button" className="listen-ic" onClick={() => play(Math.max(0, at - 1))} disabled={at === 0} aria-label={t('listen.prev')}>
          ⏮
        </button>
        {status === 'playing' ? (
          <button type="button" className="listen-ic main" onClick={pause} aria-label={t('listen.pause')}>
            ⏸
          </button>
        ) : (
          <button
            type="button"
            className="listen-ic main"
            onClick={status === 'paused' ? resume : start}
            disabled={status === 'loading'}
            aria-label={t('listen.play')}
          >
            {status === 'loading' ? <span className="listen-spin" aria-hidden="true" /> : '▶'}
          </button>
        )}
        <button type="button" className="listen-ic" onClick={() => play(at + 1)} disabled={at + 1 >= parts.length} aria-label={t('listen.next')}>
          ⏭
        </button>
        <div className="listen-what">
          <b>{parts[at].label}</b>
          <span>{t('listen.part', { n: at + 1, total: parts.length })}</span>
        </div>
        <button type="button" className="listen-speed num" onClick={nextSpeed} aria-label={t('listen.speed')}>
          {SPEEDS[speed]}×
        </button>
        <button type="button" className="listen-ic" onClick={close} aria-label={t('listen.close')}>
          ✕
        </button>
      </div>
      <div className="listen-bar" aria-hidden="true">
        <i style={{ width: `${((at + (status === 'done' ? 1 : 0)) / parts.length) * 100}%` }} />
      </div>
      {status === 'loading' && slow && <p className="listen-msg">{t('listen.preparing')}</p>}
      {status === 'error' && (
        <p className="listen-msg bad">
          {t(quota ? 'listen.quota' : 'listen.error')}{' '}
          <button type="button" className="linklike" onClick={() => play(at)}>
            {t('listen.retry')}
          </button>
        </p>
      )}
      {status === 'done' && <p className="listen-msg">{t('listen.done')}</p>}
    </div>
  );
}
