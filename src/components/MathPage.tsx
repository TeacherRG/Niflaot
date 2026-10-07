import { useEffect, useRef, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { EXAMPLES, OPS, SIGN, answer, generate, solve, type Op, type Problem } from '../core/mentalMath';
import { TopBar } from './TopBar';
import { MathCoach } from './MathCoach';
import type { CoachAction } from '../core/coach';
import { HebrewRuns } from './Hebrew';
import { Colophon } from './Colophon';

const LEVEL_KEY = 'niflaot:math-level';

function Solution({ p }: { p: Problem }) {
  const { t } = useI18n();
  return (
    <ol className="m-steps">
      {solve(p).map((s, i) => (
        <li key={i}>
          <span className="num">{s.text}</span>
          {'left' in s && (
            <span className="m-left">
              {' '}
              · {t('math.left')} <b className="num">{s.left}</b>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Trainer({ op }: { op: Op }) {
  const { t } = useI18n();
  const [level, setLevel] = useState(() => {
    try {
      return Math.min(2, Math.max(0, Number(localStorage.getItem(LEVEL_KEY)) || 0));
    } catch {
      return 0;
    }
  });
  const [p, setP] = useState(() => generate(op, level));
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'ok' | 'no' | 'shown'>('idle');
  const [coach, setCoach] = useState(false);
  const [streak, setStreak] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const next = (lv = level) => {
    setP(generate(op, lv));
    setValue('');
    setState('idle');
    setCoach(false);
    requestAnimationFrame(() => input.current?.focus());
  };

  const pickLevel = (lv: number) => {
    setLevel(lv);
    try {
      localStorage.setItem(LEVEL_KEY, String(lv));
    } catch {}
    next(lv);
  };

  const check = () => {
    const v = parseInt(value.replace(/\s/g, ''), 10);
    if (isNaN(v)) return input.current?.focus();
    if (v === answer(p)) {
      setState('ok');
      setStreak((s) => (state === 'shown' ? s : s + 1));
    } else {
      setState('no');
      setStreak(0);
      input.current?.select();
    }
  };

  return (
    <section className="m-trainer">
      <div className="m-trainer-head">
        <h3>{t('math.trainer')}</h3>
        <div className="m-levels" role="group">
          {[0, 1, 2].map((lv) => (
            <button key={lv} aria-pressed={lv === level} onClick={() => pickLevel(lv)}>
              {t(`math.level${lv}` as 'math.level0')}
            </button>
          ))}
        </div>
      </div>
      <div className="m-problem num">
        {p.a} {SIGN[op]} {p.b} = <span className="m-q">?</span>
      </div>
      <div className="row">
        <input
          ref={input}
          className="inp"
          inputMode="numeric"
          aria-label={t('math.answer')}
          value={value}
          readOnly={state === 'ok'}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (state === 'ok' ? next() : check())}
        />
        {state === 'ok' ? (
          <button className="btn" onClick={() => next()}>
            {t('math.next')} →
          </button>
        ) : (
          <>
            <button className="btn" onClick={check}>
              {t('math.check')}
            </button>
            {state !== 'shown' && !coach && (
              <button className="btn ghost" onClick={() => (setCoach(true), setStreak(0))}>
                🧮 {t('coach.open')}
              </button>
            )}
            {state !== 'shown' && (
              <button className="btn ghost" onClick={() => (setState('shown'), setStreak(0), setCoach(false))}>
                {t('math.show')}
              </button>
            )}
          </>
        )}
      </div>
      {coach && state !== 'ok' && state !== 'shown' && (
        <MathCoach
          key={`${p.a}${op}${p.b}`}
          actions={[{ [op]: [p.a, p.b] } as CoachAction]}
          onFill={(n) => {
            setValue(String(n));
            input.current?.focus();
          }}
        />
      )}
      {state === 'ok' && <div className="fb ok">{t('math.correct')}</div>}
      {state === 'no' && <div className="fb no">{t('math.wrong')}</div>}
      {(state === 'ok' || state === 'shown') && <Solution p={p} />}
      {state === 'shown' && (
        <button className="btn ghost m-next" onClick={() => next()}>
          {t('math.next')} →
        </button>
      )}
      {streak > 1 && <div className="m-streak">{t('math.streak', { n: streak })}</div>}
    </section>
  );
}

/** "Mental math": one technique per operation, worked examples from the lessons, and a trainer. */
export function MathPage({ op }: { op: Op }) {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t(`math.op.${op}`)} · ${t('math.title')}`;
  }, [op, t]);

  return (
    <>
      <TopBar title={t('math.title')} />
      <div className="wrap">
        <nav className="m-tabs" aria-label={t('math.title')}>
          {OPS.map((o) => (
            <a key={o} href={`#/math/${o}`} aria-current={o === op ? 'page' : undefined}>
              <span className="m-sign">{SIGN[o]}</span>
              {t(`math.op.${o}`)}
            </a>
          ))}
        </nav>

        <article className="m-card">
          <div className="eyebrow">{t(`math.howTo.${op}`)}</div>
          <h1>{t(`math.name.${op}`)}</h1>
          <Html as="div" className="prose" html={t(`math.idea.${op}`)} />
        </article>

        <section className="m-card">
          <h3 className="m-h3">{t('math.examples')}</h3>
          <div className="m-examples">
            {EXAMPLES[op].map((e) => (
              <div key={e.label} className="m-example">
                <div className="m-label">
                  <HebrewRuns text={e.label} />
                </div>
                <div className="m-problem num small">
                  {e.a} {SIGN[op]} {e.b} = {answer(e)}
                </div>
                <Solution p={e} />
              </div>
            ))}
          </div>
        </section>

        <Trainer key={op} op={op} />
        <p className="m-intro">{t('math.intro')}</p>
      </div>
      <Colophon />
    </>
  );
}
