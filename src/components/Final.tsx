import { useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { copyText, formatTime } from '../core/format';
import { SITE_HOST, SITE_URL } from '../core/site';
import { stepState, type GameState } from '../core/useLessonState';
import type { Lesson, LessonText } from '../lessons/types';
import { HebrewRuns } from './Hebrew';

/** Concise summary of what was covered: key equations and takeaways of every solved riddle. */
function Conspect({ lesson, text, S, onOpen }: { lesson: Lesson; text: LessonText; S: GameState; onOpen: (ri: number) => void }) {
  const { t } = useI18n();
  return (
    <section className="conspect pop" aria-labelledby="conspect-h">
      <h2 id="conspect-h">
        {t('final.conspect')} <span>{t('final.conspectSub')}</span>
      </h2>
      {lesson.riddles.map((r, ri) => {
        const rt = text.riddles[ri];
        const solved = S.done.includes(ri);
        return (
          <div key={ri} className={`cs-item${solved ? '' : ' locked'}`}>
            <h3>
              <span className="cs-n">{ri + 1}</span>
              {rt.title}
            </h3>
            {solved ? (
              <>
                <div className="cs-eqs">
                  {r.equations.map((e, k) => (
                    <span key={k} className="cs-eq num">
                      <HebrewRuns text={e} />
                    </span>
                  ))}
                </div>
                <ul>
                  {(rt.takeaways ?? [rt.reveal.p]).map((x, k) => (
                    <li key={k}>
                      <HebrewRuns text={x} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="cs-locked">
                {t('final.unsolved')}{' '}
                <button className="btn ghost" onClick={() => onOpen(ri)}>
                  {t('final.goSolve')} →
                </button>
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

export function Final({
  lesson,
  text,
  S,
  onReset,
  onOpen,
}: {
  lesson: Lesson;
  text: LessonText;
  S: GameState;
  onReset: () => void;
  onOpen: (ri: number) => void;
}) {
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
  const share = text.share({ score: S.score, max, time, grid, allSolved, site: SITE_HOST });

  const copy = async () => {
    const ok = await copyText(share, pre.current);
    setCopyLabel(t(ok ? 'final.copied' : 'final.selected'));
    if (ok) setTimeout(() => setCopyLabel(null), 2000);
  };

  return (
    <>
    <Conspect lesson={lesson} text={text} S={S} onOpen={onOpen} />
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
            href={`https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(share)}`}
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
    </>
  );
}
