import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { audioList, audioUrl, clock, type AudioItem } from '../core/audio';
import { countEvent } from '../core/analytics';
import type { Section } from '../core/tanakhCycle';

const SPEEDS = [1, 1.25, 1.5, 2];
const SPEED_KEY = 'niflaot:audio-speed';
const posKey = (section: Section, date: string) => `niflaot:audio-pos:${section}/${date}`;

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {}
};

/**
 * «🎧 Урок дня» on the page of the passage of the day: the recorded lesson, when there is one for this day.
 * Speed 1×–2×, and the place where the listener stopped (per day, in this browser). The recording is in Russian.
 */
export function DayAudio({ section, date }: { section: Section; date: string }) {
  const { t, locale } = useI18n();
  const [item, setItem] = useState<AudioItem | null>(null);
  const [speed, setSpeed] = useState(() => {
    const s = Number(read(SPEED_KEY));
    return SPEEDS.includes(s) ? s : 1;
  });
  const audio = useRef<HTMLAudioElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    let live = true;
    setItem(null);
    counted.current = false;
    audioList(section).then((list) => live && setItem(list.find((a) => a.date === date) ?? null));
    return () => {
      live = false;
    };
  }, [section, date]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed, item]);

  if (!item) return null;
  const key = posKey(section, date);
  return (
    <section className="day-audio no-print no-speak" aria-label={t('audio.title')}>
      <div className="day-audio-head">
        <span className="day-audio-icon" aria-hidden="true">
          🎧
        </span>
        <div>
          <h2>{t('audio.title')}</h2>
          <p>{[item.title, item.duration > 0 && clock(item.duration), locale !== 'ru' && t('audio.inRussian')].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      <audio
        ref={audio}
        controls
        preload="none"
        src={audioUrl(section, item)}
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          a.playbackRate = speed;
          const at = Number(read(key));
          if (at > 5 && (!a.duration || at < a.duration - 5)) a.currentTime = at;
        }}
        onPlay={(e) => {
          e.currentTarget.playbackRate = speed;
          if (!counted.current) {
            counted.current = true;
            countEvent(`/${section}/${date}/listen`, `${t('audio.title')}: ${item.title}`);
          }
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (Math.floor(a.currentTime) % 5 === 0) write(key, String(Math.floor(a.currentTime)));
        }}
        onEnded={() => write(key, null)}
      />
      <div className="day-audio-speed" role="group" aria-label={t('audio.speed')}>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            className={s === speed ? 'on' : ''}
            aria-pressed={s === speed}
            onClick={() => {
              setSpeed(s);
              write(SPEED_KEY, String(s));
            }}
          >
            {String(s).replace('.', locale === 'en' ? '.' : ',')}×
          </button>
        ))}
      </div>
    </section>
  );
}
