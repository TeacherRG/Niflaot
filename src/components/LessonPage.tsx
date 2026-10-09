import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { formatTime } from '../core/format';
import { useLessonState } from '../core/useLessonState';
import type { Lesson } from '../lessons/types';
import { TopBar } from './TopBar';
import { Hero } from './Hero';
import { Riddle } from './Riddle';
import { Final } from './Final';
import { Calculator } from './Calculator';
import { Colophon } from './Colophon';
import { setPageState } from '../core/assistant';

/** `at` — the riddle (1-based) a link points to (`#/<slug>/r/<n>`): the lesson opens on it. */
export function LessonPage({ lesson, at }: { lesson: Lesson; at?: number }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);
  const [S, update, reset] = useLessonState(lesson);
  const game = useRef<HTMLElement>(null);
  const total = lesson.riddles.length;
  const summary = S.lvl >= total;
  const running = !summary && !!S.started[S.lvl] && !S.done.includes(S.lvl);

  useEffect(() => {
    document.title = `${text.title} · ${t('app.title')}`;
  }, [text.title, t]);

  // what the helper knows: the lesson, where the user is and which riddles are solved
  useEffect(() => {
    setPageState({ lesson, locale: textLocale, done: S.done, lvl: S.lvl });
  }, [lesson, textLocale, S.done, S.lvl]);

  // play timer: counts while the current riddle is started, unsolved and the tab is visible
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const d = Math.min(now - last, 5000);
      last = now;
      if (!document.hidden) update((s) => void (s.time[s.lvl] += d));
    }, 1000);
    return () => clearInterval(id);
  }, [running, update]);

  const goTo = (lvl: number, scroll = true) => {
    update((d) => void (d.lvl = lvl));
    if (scroll) requestAnimationFrame(() => window.scrollTo({ top: (game.current?.offsetTop ?? 0) - 70, behavior: 'smooth' }));
  };

  useEffect(() => {
    if (at && at >= 1 && at <= total) goTo(at - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);

  // the timer of a riddle starts on the first interaction inside it (not the nav buttons)
  const start = (e: React.SyntheticEvent) => {
    const el = e.target as HTMLElement;
    if (!summary && !S.started[S.lvl] && el.closest('.riddle') && !el.closest('.nav'))
      update((d) => void (d.started[d.lvl] = true));
  };

  return (
    <>
      <TopBar title={text.title}>
        <div className="levels">
          {lesson.riddles.map((_, i) => (
            <button
              key={i}
              className={`lv${i === S.lvl ? ' cur' : ''}${S.done.includes(i) ? ' done' : ''}`}
              aria-label={t('top.riddle', { n: i + 1 })}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
          <button className={`lv${summary ? ' cur' : ''}`} aria-label={t('top.summary')} onClick={() => goTo(total)}>
            ★
          </button>
        </div>
        <div className={`timer num${running ? ' run' : ''}`} title={t('top.timer')}>
          ⏱ {formatTime(S.time.reduce((a, b) => a + b, 0))}
        </div>
        <div className="score num" title={t('top.points', { n: S.score })}>
          <span className="score-full">{t('top.points', { n: S.score })}</span>
          <span className="score-short" aria-hidden="true">
            ✦ {S.score}
          </span>
        </div>
      </TopBar>

      <div className="wrap">
        {textLocale !== locale && <div className="fallback-note">{t('catalog.fallback')}</div>}
        <Hero lesson={lesson} text={text} />
        <main id="game" ref={game} onClickCapture={start} onFocusCapture={start}>
          {summary ? (
            <Final
              lesson={lesson}
              text={text}
              S={S}
              update={update}
              onOpen={(ri) => goTo(ri)}
              onReset={() => {
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <Riddle
              key={S.lvl}
              lesson={lesson}
              text={text}
              ri={S.lvl}
              S={S}
              update={update}
              running={running}
              onNavigate={(l) => goTo(l, l > S.lvl)}
            />
          )}
        </main>
        {lesson.kind !== 'sicha' && <Calculator lesson={lesson} done={S.done} />}
      </div>

      <Colophon source={text.source} />
    </>
  );
}
