import { useEffect, useRef } from 'react';
import { Html, useI18n } from '../i18n';
import { VALUES, gematria, letters } from '../core/gematria';
import { formatTime } from '../core/format';
import { MAX_WRONG, award, draftStep, stepState, type GameState } from '../core/useLessonState';
import type { Lesson, LessonText } from '../lessons/types';
import { HebrewRuns } from './Hebrew';
import { opInText } from '../core/mentalMath';

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
  const { t } = useI18n();
  const r = lesson.riddles[ri];
  const rt = text.riddles[ri];
  const total = lesson.riddles.length;
  const solvedRiddle = S.done.includes(ri);
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

  /** Records an attempt; `correct` decides the outcome. */
  const attempt = (i: number, correct: boolean, kind: 'num' | 'ch', pick?: number) =>
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
        x.last = 'no';
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
      </div>
      <Html as="div" className="cond" html={rt.cond} />
      {!solved && <div className="les-lock">{t('riddle.locked')}</div>}

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
          return (
            <div key={i} className={`step${locked ? ' locked' : ''}`}>
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
                    <>
                      <button className="btn" onClick={() => checkNum(i, s.a)}>
                        {t('riddle.check')}
                      </button>
                      {!x.hint && st.hint && (
                        <button className="btn ghost" onClick={() => update((d) => void (draftStep(d, ri, i).hint = true))}>
                          {t('riddle.hint')}
                        </button>
                      )}
                    </>
                  )}
                </div>
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
                  {t('riddle.outOfTries')} <b>{s.t === 'num' ? s.a : s.opts[s.c].h}</b> · {t('riddle.zeroPoints')}
                </div>
              ) : x.ok ? (
                <div className="fb ok">{t('riddle.correct', { p: x.pts ?? 0 })}</div>
              ) : x.hint && st.hint ? (
                <div className="fb hint">
                  {t('riddle.hintPrefix')} {st.hint}
                  {opInText(st.hint) && (
                    <a className="hint-link" href={`#/math/${opInText(st.hint)}`}>
                      {t(`math.howTo.${opInText(st.hint)!}`)} →
                    </a>
                  )}
                </div>
              ) : null}
              {!x.ok && x.tries > 0 && x.last === 'no' && (
                <div className="fb no">
                  {t('riddle.triesLeft', { n: left })} {t(s.t === 'num' ? 'riddle.wrongNum' : 'riddle.wrongChoice')}
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
            <p>{rt.reveal.p}</p>
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
                <Html as="div" className="les-b" html={l.b} />
              </details>
            ))}
          </div>
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
