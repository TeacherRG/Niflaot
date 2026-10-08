import { useEffect, useRef, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { withTerms } from '../i18n/glossary';
import { VALUES, gematria, letters } from '../core/gematria';
import { formatEstimate, formatTime, readingSec } from '../core/format';
import { MAX_WRONG, award, draftStep, placePiece, stepState, type GameState } from '../core/useLessonState';
import type { Lesson, LessonText } from '../lessons/types';
import { HebrewRuns } from './Hebrew';
import { Sources } from './Sources';
import { MathCoach } from './MathCoach';
import { Puzzle } from './Puzzle';
import { footnotes } from '../sources/footnotes';
import { LettersPuzzle, TapPuzzle } from './LetterSteps';
import { asWord } from '../core/letterPuzzle';
import { displayNames } from '../core/names';

/** «⏱ ≈ 1 мин · ●●○ средний»: average time and difficulty of a step (or of the whole riddle). */
function Estimate({ time, level }: { time: string; level: 1 | 2 | 3 }) {
  const { t } = useI18n();
  return (
    <div className={`est l${level}`} title={t('est.title')}>
      <span className="est-time">⏱ {time}</span>
      <span className="est-lvl" aria-label={`${t('est.title')}: ${t(`est.l${level}`)}`}>
        <span className="est-dots" aria-hidden="true">
          {[1, 2, 3].map((k) => (
            <i key={k} className={k <= level ? 'on' : ''} />
          ))}
        </span>
        {t(`est.l${level}`)}
      </span>
    </div>
  );
}

interface Props {
  lesson: Lesson;
  text: LessonText;
  ri: number;
  S: GameState;
  update: (fn: (d: GameState) => void) => void;
  running: boolean;
  onNavigate: (lvl: number) => void;
}

export function Riddle({ lesson, text, ri, S, update, running, onNavigate }: Props) {
  const { t, pick, locale } = useI18n();
  const textLocale = pick(lesson.texts).locale;
  const r = lesson.riddles[ri];
  const rt = text.riddles[ri];
  const total = lesson.riddles.length;
  const solvedRiddle = S.done.includes(ri);
  const [coachOpen, setCoachOpen] = useState<Record<number, boolean>>({});
  const focusId = useRef<{ id: string; select?: boolean } | null>(null);

  useEffect(() => {
    if (!focusId.current) return;
    const el = document.getElementById(focusId.current.id) as HTMLInputElement | null;
    if (el) focusId.current.select ? el.select() : el.focus();
    focusId.current = null;
  });

  let firstOpen = r.steps.findIndex((_, i) => !stepState(S, ri, i).ok);
  if (firstOpen < 0) firstOpen = r.steps.length;
  const solved = firstOpen >= r.steps.length;

  // footnotes: numbered in reading order; before the riddle is solved the sources are hidden, so no marks
  const fn = footnotes([rt.cond, rt.reveal.p, ...rt.lessons.map((l) => l.b)], solved ? (r.sources ?? []) : [], ri, t('sources.footnote'));
  const [condHtml, revealHtml, ...lessonHtml] = fn.html;

  /** Records an attempt; `correct` decides the outcome. */
  const attempt = (i: number, correct: boolean, kind: keyof typeof MAX_WRONG, pick?: number, miss: 'no' | 'place' | 'order' = 'no') =>
    update((d) => {
      const x = draftStep(d, ri, i);
      x.tries++;
      if (pick !== undefined) x.pick.push(pick);
      if (correct) {
        x.ok = true;
        x.pts = award(x);
        d.score += x.pts;
        x.last = 'ok';
      } else {
        x.last = miss;
        if (x.tries >= MAX_WRONG[kind]) {
          x.ok = true;
          x.fail = true;
          x.pts = 0;
        }
      }
      if (r.steps.every((_, k) => stepState(d, ri, k).ok) && !d.done.includes(ri)) d.done.push(ri);
    });

  const checkNum = (i: number, answer: number) => {
    const id = `in-${ri}-${i}`;
    const inp = document.getElementById(id) as HTMLInputElement;
    const v = parseInt(inp.value.replace(/\s/g, ''), 10);
    if (isNaN(v)) return inp.focus();
    const correct = v === answer;
    const willFinish = correct || stepState(S, ri, i).tries + 1 >= MAX_WRONG.num;
    focusId.current = willFinish ? { id: `in-${ri}-${i + 1}` } : { id, select: true };
    attempt(i, correct, 'num');
  };

  return (
    <article className="riddle">
      <div className="r-head">
        <span className="eyebrow">
          {t('riddle.of', { n: ri + 1, total })}
          <span className={`r-time${running ? ' run' : ''}`}>⏱ {formatTime(S.time[ri])}</span>
        </span>
        <h2>{rt.title}</h2>
        <Estimate
          level={Math.max(...r.steps.map((s) => s.est.level)) as 1 | 2 | 3}
          time={`${t('est.solve', { t: formatEstimate(readingSec(rt.cond) + r.steps.reduce((a, s) => a + s.est.sec, 0), locale, t) })} · ${t('est.read', {
            t: formatEstimate(rt.lessons.reduce((a, l) => a + readingSec(l.b), 0), locale, t),
          })}`}
        />
      </div>
      <Html as="div" className="cond" html={withTerms(condHtml, textLocale)} />
      {!solved && <div className="les-lock">{t('riddle.locked')}</div>}

      {r.words.length > 0 && (
        <div className="words">
          {r.words.map((w) => {
            const key = `${ri}:${w}`;
            const open = S.open[key];
            return (
              <button key={w} className="word" onClick={() => update((d) => void (d.open[key] = !d.open[key]))}>
                <span className="w" lang="he">
                  {w}
                </span>
                <span className="t">{text.glossary[w] ?? ''}</span>
                {open && (
                  <>
                    <span className="tiles">
                      {letters(w).map((c, k) => (
                        <span key={k} className="tile">
                          <b>{c}</b>
                          <i>{VALUES[c]}</i>
                        </span>
                      ))}
                    </span>
                    {solvedRiddle ? (
                      <span className="sum">= {gematria(w)}</span>
                    ) : (
                      <span className="sum hide">{t('riddle.sumYourself')}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {r.balance && (
        <div className="balance">
          {r.balance.map((b, k) => {
            const lit = stepState(S, ri, k).ok;
            return [
              k > 0 && (
                <span key={`m${k}`} className="mid">
                  {r.balance!.every((_, j) => stepState(S, ri, j).ok) ? '=' : '⚖'}
                </span>
              ),
              <div key={k} className={`pan${lit ? ' lit' : ''}`}>
                <span className="he">{b.expr}</span>
                <span className="num">{lit ? b.value : '?'}</span>
              </div>,
            ];
          })}
        </div>
      )}

      <div className="steps">
        {r.steps.map((s, i) => {
          const x = stepState(S, ri, i);
          const st = rt.steps[i];
          const locked = i > firstOpen;
          const left = MAX_WRONG[s.t] - x.tries;
          const hintBtn = !x.ok && !x.hint && st.hint && (
            <button className="btn ghost" onClick={() => update((d) => void (draftStep(d, ri, i).hint = true))}>
              {t('riddle.hint')}
            </button>
          );
          return (
            <div key={i} className={`step${locked ? ' locked' : ''}`}>
              <Estimate time={formatEstimate(s.est.sec, locale, t)} level={s.est.level} />
              <div className="q">
                <span className="n">{i + 1}.</span>
                <Html html={st.q} />
              </div>

              {s.t === 'num' ? (
                <div className="row">
                  <input
                    key={x.ok ? 'ok' : 'open'}
                    className="inp"
                    id={`in-${ri}-${i}`}
                    inputMode="numeric"
                    aria-label={t('riddle.answer')}
                    defaultValue={x.ok ? s.a : undefined}
                    disabled={x.ok}
                    onKeyDown={(e) => e.key === 'Enter' && checkNum(i, s.a)}
                  />
                  {!x.ok && (
                    <button className="btn" onClick={() => checkNum(i, s.a)}>
                      {t('riddle.check')}
                    </button>
                  )}
                  {hintBtn}
                </div>
              ) : s.t === 'lt' ? (
                <>
                  <LettersPuzzle step={s} x={x} locked={locked} onCheck={(res) => attempt(i, res === 'ok', 'lt', undefined, res === 'ok' ? 'no' : res)} />
                  {hintBtn && <div className="row">{hintBtn}</div>}
                </>
              ) : s.t === 'tap' ? (
                <>
                  <TapPuzzle step={s} x={x} locked={locked} onTap={(k) => attempt(i, k === s.a, 'tap', k)} />
                  {hintBtn && <div className="row">{hintBtn}</div>}
                </>
              ) : (
                <div className="opts">
                  {(S.ord[`${ri}-${i}`] ?? s.opts.map((_, k) => k)).map((k) => {
                    const o = s.opts[k];
                    const picked = x.pick.includes(k);
                    const cls = picked ? (k === s.c ? ' right' : ' wrong') : x.ok && k === s.c ? ' right' : '';
                    return (
                      <button
                        key={k}
                        className={`opt${cls}`}
                        disabled={x.ok}
                        onClick={() => !picked && attempt(i, k === s.c, 'ch', k)}
                      >
                        <span className="oh" lang="he">
                          {o.h}
                        </span>
                        <span className="or">{st.opts?.[k]}</span>
                        <span className="ov">{(picked || x.ok) && o.v != null ? `= ${o.v}` : ''}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {x.ok && x.fail ? (
                <div className="fb no">
                  {t('riddle.outOfTries')}{' '}
                  <b>{s.t === 'num' ? s.a : s.t === 'ch' ? s.opts[s.c].h : <span className="he">{s.t === 'lt' ? asWord(s.a) : letters(displayNames(s.word))[s.a]}</span>}</b> · {t('riddle.zeroPoints')}
                </div>
              ) : x.ok ? (
                <div className="fb ok">{t('riddle.correct', { p: x.pts ?? 0 })}</div>
              ) : x.hint && st.hint ? (
                <div className="fb hint">
                  {t('riddle.hintPrefix')} <HebrewRuns text={st.hint} />
                  {s.t === 'num' && s.coach && (
                    <button className="coach-toggle" aria-expanded={!!coachOpen[i]} onClick={() => setCoachOpen((o) => ({ ...o, [i]: !o[i] }))}>
                      🧮 {t(coachOpen[i] ? 'coach.hide' : 'coach.open')}
                    </button>
                  )}
                </div>
              ) : null}
              {!x.ok && s.t === 'num' && s.coach && x.hint && coachOpen[i] && (
                <MathCoach
                  actions={s.coach}
                  onFill={(n) => {
                    const el = document.getElementById(`in-${ri}-${i}`) as HTMLInputElement | null;
                    if (el) {
                      el.value = String(n);
                      el.focus();
                    }
                  }}
                />
              )}
              {!x.ok && x.tries > 0 && (x.last === 'no' || x.last === 'place' || x.last === 'order') && (
                <div className="fb no">
                  {t('riddle.triesLeft', { n: left })}{' '}
                  {t(x.last === 'place' ? 'riddle.wrongPlace' : x.last === 'order' ? 'riddle.wrongOrder' : ({ num: 'riddle.wrongNum', ch: 'riddle.wrongChoice', lt: 'riddle.wrongWord', tap: 'riddle.wrongLetter' } as const)[s.t])}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {solved && (
        <>
          <div className="reveal pop">
            <h3>{rt.reveal.h}</h3>
            {r.equations.map((e, k) => (
              <div key={k} className="eq">
                <HebrewRuns text={e} />
              </div>
            ))}
            <Html as="p" html={withTerms(revealHtml, textLocale)} />
          </div>
          <div className="lessons">
            <div className="les-title">
              {t('lessons.title')} <span>{t('lessons.sub')}</span>
            </div>
            {rt.lessons.map((l, k) => (
              <details key={k} className="les">
                <summary>
                  <span>
                    <HebrewRuns text={l.h} />
                  </span>
                </summary>
                <Html as="div" className="les-b" html={withTerms(lessonHtml[k], textLocale)} />
              </details>
            ))}
          </div>
          {r.sources && <Sources ri={ri} ids={fn.ordered} number={fn.number} refs={fn.refs} />}
          <Puzzle
            id={`${lesson.slug}:${ri}`}
            puzzle={rt.puzzle}
            placed={S.puz[ri] ?? []}
            onPlace={(i) => update((d) => placePiece(d, ri, i))}
          />
          <div className="refl">
            <div className="refl-lbl">
              {t('refl.title')} <span>{t('refl.sub')}</span>
            </div>
            <p>{rt.reflection}</p>
            <textarea
              rows={3}
              placeholder={t('refl.placeholder')}
              value={S.notes[ri] ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                update((d) => void (d.notes[ri] = v));
              }}
            />
          </div>
        </>
      )}

      <div className="nav">
        <button className="btn ghost" disabled={ri === 0} onClick={() => onNavigate(ri - 1)}>
          {t('riddle.prev')}
        </button>
        <button className="btn" disabled={!solved} onClick={() => onNavigate(ri + 1)}>
          {t(ri === total - 1 ? 'riddle.toSummary' : 'riddle.next')}
        </button>
      </div>
    </article>
  );
}
