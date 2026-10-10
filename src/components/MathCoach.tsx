import { useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { SIGN, coachSteps, type CoachStep } from '../core/mentalMath';
import { buildCoach, type CoachAction, type CoachPart } from '../core/coach';

/**
 * «Посчитать вместе»: walks through the concrete example of a hint, one small question at a time,
 * using the mental-math technique of each operation. The final result can be put into the answer field.
 */
export function MathCoach({ actions, onFill }: { actions: CoachAction[]; onFill?: (n: number) => void }) {
  const { t } = useI18n();
  const parts = useMemo(() => buildCoach(actions), [actions]);
  const steps = useMemo(() => {
    const labels = { from: (a: number, b: number) => t('coach.from', { a, b }), left: (a: number, b: number) => `${a} − ${b}` };
    return parts.flatMap((p, k) => [
      { kind: 'head' as const, part: p, k },
      ...coachSteps(p.expr, labels),
    ]) as (CoachStep | { kind: 'head'; part: CoachPart; k: number })[];
  }, [parts, t]);
  const asks = steps.map((s, i) => (s.kind === 'ask' ? i : -1)).filter((i) => i >= 0);
  const [done, setDone] = useState(0); // number of answered questions
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'no' | 'tip'>('idle');
  const input = useRef<HTMLInputElement>(null);
  const current = asks[done];
  // a part is shown once the walkthrough reaches it — later heads would give away results
  const reached = (i: number) => current === undefined || i <= current;
  const finished = done >= asks.length;
  const result = parts[parts.length - 1].result;
  const op = parts[parts.length - 1].expr.op;

  const check = () => {
    const s = steps[current] as Extract<CoachStep, { kind: 'ask' }>;
    const v = parseInt(value.replace(/\s/g, ''), 10);
    if (isNaN(v)) return input.current?.focus();
    if (v === s.answer) {
      setDone((d) => d + 1);
      setValue('');
      setState('idle');
      requestAnimationFrame(() => input.current?.focus());
    } else {
      setState('no');
      input.current?.select();
    }
  };

  const help = () => {
    const s = steps[current] as Extract<CoachStep, { kind: 'ask' }>;
    if (s.tip && state !== 'tip') setState('tip');
    else {
      setValue(String(s.answer));
      setState('idle');
      input.current?.focus();
    }
  };

  return (
    <div className="coach">
      <ol className="coach-steps">
        {steps.map((s, i) => {
          if (s.kind === 'head' && !reached(i)) return null;
          if (s.kind === 'head')
            return s.part.word ? (
              // a word: show its letters with their values, then add them up
              <li key={i} className="coach-word">
                <span className="he">{s.part.word}</span>
                {s.part.swapped && (
                  <>
                    {' → '}
                    <span className="he">{s.part.swapped}</span>
                  </>
                )}
                {s.part.method && <small className="coach-method">{t(`method.${s.part.method}` as 'method.gadol')}</small>}
                <span className="coach-letters" dir="rtl">
                  {s.part.letters!.map(([c, v], k) => (
                    <span key={k}>
                      <b>{c}</b>
                      <i>{v}</i>
                    </span>
                  ))}
                </span>
              </li>
            ) : parts.length > 1 ? (
              <li key={i} className="coach-head num">
                {s.part.expr.text}
              </li>
            ) : null;
          if (s.kind === 'info')
            return i < (current ?? Infinity) || finished ? (
              <li key={i} className="coach-info num">
                {s.text}
              </li>
            ) : null;
          const n = asks.indexOf(i);
          if (n < done)
            return (
              <li key={i} className="coach-done num">
                <span className="ok">✓</span> {s.ask} = <b>{s.answer}</b>
              </li>
            );
          if (n > done) return null;
          return (
            <li key={i} className="coach-now">
              <div className="coach-q num">
                {s.ask} = <span className="m-q">?</span>
                <span className="coach-count">
                  {t('coach.step', { i: done + 1, n: asks.length })}
                </span>
              </div>
              <div className="row">
                <input
                  ref={input}
                  className="inp"
                  inputMode="numeric"
                  aria-label={s.ask}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && check()}
                />
                <button className="btn" onClick={check}>
                  {t('coach.check')}
                </button>
                <button className="btn ghost" onClick={help}>
                  {t('coach.help')}
                </button>
              </div>
              {state === 'no' && <div className="fb no">{t('coach.wrong')}</div>}
              {state === 'tip' && s.tip && (
                <div className="fb hint num">
                  {s.tip.map((l, k) => (
                    <div key={k}>{l}</div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {finished && (
        <div className="coach-end">
          <span>
            {t('coach.done')} <b className="num">{result}</b>
          </span>
          {onFill && (
            <button className="btn gold-btn" onClick={() => onFill(result)}>
              {t('coach.fill')}
            </button>
          )}
        </div>
      )}
      <a className="coach-more" href={`#/math/${op}`}>
        {SIGN[op]} {t(`math.howTo.${op}`)} →
      </a>
    </div>
  );
}
