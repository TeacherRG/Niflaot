import { useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { copyText, formatTime } from '../core/format';
import { SITE_HOST, SITE_URL } from '../core/site';
import { placePiece, stepState, type GameState } from '../core/useLessonState';
import type { Lesson, LessonText } from '../lessons/types';
import { HebrewRuns } from './Hebrew';
import { Icon } from './ui';
import { Puzzle } from './Puzzle';
import { PARSHIOT } from '../lessons/parshiot';
import { renderCard, shareOrSave } from '../core/shareCard';

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
  update,
  onReset,
  onOpen,
}: {
  lesson: Lesson;
  text: LessonText;
  S: GameState;
  update: (fn: (d: GameState) => void) => void;
  onReset: () => void;
  onOpen: (ri: number) => void;
}) {
  const { t, locale } = useI18n();
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
  const [cardState, setCardState] = useState<'idle' | 'making' | 'saved'>('idle');

  const shareCard = async () => {
    setCardState('making');
    const parsha = PARSHIOT[lesson.parsha];
    const day = new Date().getDay();
    try {
      const blob = await renderCard({
        eyebrow: `${t('app.title')} · ${parsha.name[locale as keyof typeof parsha.name] ?? parsha.name.ru} ${parsha.year}`,
        hebrewTitle: lesson.hebrewTitle,
        title: text.title,
        found: `${t('final.cardFound')}:`,
        highlight: lesson.highlight,
        caption: text.highlight,
        score: `✦ ${S.score} / ${max} · ⏱ ${time}`,
        // Thursday and Friday: a note for the Shabbat table
        extra: day === 4 || day === 5 ? t('final.cardShabbat') : undefined,
        site: SITE_HOST,
      });
      const res = await shareOrSave(blob, `niflaot-${lesson.slug}.png`, share);
      setCardState(res === 'saved' ? 'saved' : 'idle');
      if (res === 'saved') setTimeout(() => setCardState('idle'), 2500);
    } catch {
      setCardState('idle');
    }
  };

  const copy = async () => {
    const ok = await copyText(share, pre.current);
    setCopyLabel(t(ok ? 'final.copied' : 'final.selected'));
    if (ok) setTimeout(() => setCopyLabel(null), 2000);
  };

  return (
    <>
    <Conspect lesson={lesson} text={text} S={S} onOpen={onOpen} />
    {allSolved && (
      <div className="final-puzzle pop">
        <Puzzle
          id={`${lesson.slug}:final`}
          title={t('puzzle.final')}
          puzzle={text.puzzle}
          placed={S.puz.final ?? []}
          onPlace={(i) => update((d) => placePiece(d, 'final', i))}
        />
      </div>
    )}
    {allSolved && (
      <section className="practice pop">
        <div className="practice-lbl">{t('final.practice')}</div>
        <p>{text.practice}</p>
      </section>
    )}
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
          <button className="btn gold" onClick={shareCard} disabled={cardState === 'making'}>
            <Icon name="image" size={18} />
            {cardState === 'making' ? t('final.cardMaking') : cardState === 'saved' ? t('final.cardSaved') : t('final.card')}
          </button>
          <button className="btn ghost-l" onClick={copy}>
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
    <a className="mychitas pop" href="https://mychitas.app" target="_blank" rel="noopener">
      <span className="mc-mark">MyChitas</span>
      <span className="mc-text">{t('final.mychitas')}</span>
      <span className="mc-cta">{t('final.mychitasCta')}</span>
    </a>
    </>
  );
}
