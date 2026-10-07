import { useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { copyText, formatTime } from '../core/format';
import { stepState, type GameState } from '../core/useLessonState';
import type { Lesson, LessonText } from '../lessons/types';

export function Final({ lesson, text, S, onReset }: { lesson: Lesson; text: LessonText; S: GameState; onReset: () => void }) {
  const { t } = useI18n();
  const [confirm, setConfirm] = useState(false);
  const [copyLabel, setCopyLabel] = useState<string | null>(null);
  const pre = useRef<HTMLPreElement>(null);

  const total = lesson.riddles.length;
  const max = lesson.riddles.reduce((a, r) => a + r.steps.length * 10, 0);
  const time = formatTime(S.time.reduce((a, b) => a + b, 0));
  const allSolved = S.done.length === total;
  const grid = lesson.riddles
    .map(
      (r, ri) =>
        `${ri + 1} ` +
        r.steps
          .map((_, i) => {
            const x = stepState(S, ri, i);
            return !x.ok ? '⬜' : x.fail ? '🟥' : x.tries === 1 && !x.hint ? '🟩' : '🟨';
          })
          .join(''),
    )
    .join('\n');
  const share = text.share({ score: S.score, max, time, grid, allSolved });

  const copy = async () => {
    const ok = await copyText(share, pre.current);
    setCopyLabel(t(ok ? 'final.copied' : 'final.selected'));
    if (ok) setTimeout(() => setCopyLabel(null), 2000);
  };

  return (
    <section className="final pop">
      <h2>{text.final.title}</h2>
      <div className="big">
        {S.score}
        <span style={{ fontSize: 24, color: '#D7DCEA' }}> / {max}</span>
      </div>
      <div className="time">
        ⏱ {time}
        {allSolved ? '' : t('final.inProgress')}
      </div>
      <p>{allSolved ? text.final.allSolved : t('final.partial', { done: S.done.length, total })}</p>
      <div className="share">
        <div className="share-lbl">{t('final.share')}</div>
        <pre className="share-txt" ref={pre}>
          {share}
        </pre>
        <div className="share-btns">
          <button className="btn gold" onClick={copy}>
            {copyLabel ?? t('final.copy')}
          </button>
          <a className="btn ghost-l" href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <a
            className="btn ghost-l"
            href={`https://t.me/share/url?url=${encodeURIComponent('https://mychitas.app')}&text=${encodeURIComponent(share)}`}
            target="_blank"
            rel="noopener"
          >
            Telegram
          </a>
        </div>
        <div className="share-legend">{t('final.legend')}</div>
      </div>
      {confirm ? (
        <div className="confirm">
          <span>{t('final.confirm')}</span>
          <button className="btn ghost-l" onClick={() => setConfirm(false)}>
            {t('final.no')}
          </button>
          <button className="btn" onClick={onReset}>
            {t('final.yes')}
          </button>
        </div>
      ) : (
        <button className="btn" onClick={() => setConfirm(true)}>
          {t('final.restart')}
        </button>
      )}
    </section>
  );
}
