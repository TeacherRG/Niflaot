import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { KEYBOARD, VALUES, gematria, letters } from '../core/gematria';
import { displayNames } from '../core/names';
import type { Lesson } from '../lessons/types';
import { MathCoach } from './MathCoach';
import { HebrewRuns } from './Hebrew';
import type { CoachAction } from '../core/coach';
import { SWAPS, gematriaBy, katanMispari, riboa, swapWord, withKolel, type Method } from '../core/gematriaMethods';

const METHODS: Method[] = ['gadol', 'katan', 'siduri', 'kadmi', 'milui', 'neelam', 'atbash', 'albam'];

/** The word in every way of counting (docs/GEMATRIA-RULES.md), with the rule of each. */
function Methods({ text }: { text: string }) {
  const { t } = useI18n();
  const rows: { key: string; v: number; swapped?: string }[] = [
    ...METHODS.map((m) => ({ key: m, v: gematriaBy(m, text), swapped: SWAPS.has(m) ? swapWord(m, text) : undefined })),
    { key: 'kolel', v: withKolel(text) },
    { key: 'katanMispari', v: katanMispari(gematria(text)) },
    ...(text.trim().includes(' ') ? [] : [{ key: 'riboa', v: riboa(text) }]),
  ];
  return (
    <details className="calc-methods">
      <summary>{t('calc.methods')}</summary>
      <p className="sub">{t('calc.methodsSub')}</p>
      <ul>
        {rows.map((r) => (
          <li key={r.key}>
            <b>
              <HebrewRuns text={t(`method.${r.key}` as 'method.gadol')} />
            </b>
            {r.swapped && (
              <>
                {' '}
                <span dir="ltr">
                  <bdi className="he">{displayNames(text)}</bdi> → <bdi className="he">{r.swapped}</bdi>
                </span>
              </>
            )}{' '}
            = <span className="num">{r.v}</span>
            <small>
              <HebrewRuns text={t(`method.${r.key}.rule` as 'method.gadol.rule')} />
            </small>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Each word is spelled out letter by letter; several words are then added up. */
function wordActions(text: string): CoachAction[] {
  const words = text.split(/\s+/).filter((w) => letters(w).length);
  const acts: CoachAction[] = words.map((w) => ({ word: w }));
  if (words.length > 1) acts.push({ add: words.map((_, i) => `$${i + 1}` as const) });
  return acts;
}

export function Calculator({ lesson, done }: { lesson: Lesson; done: number[] }) {
  const { t } = useI18n();
  const [value, setValue] = useState('שלום');
  const [coach, setCoach] = useState(false);

  const known = useMemo(() => {
    const m = new Map<number, Set<string>>();
    const words = [...lesson.riddles.flatMap((r) => r.words), ...lesson.calculator.words];
    for (const w of words) {
      const v = gematria(w);
      if (!m.has(v)) m.set(v, new Set());
      m.get(v)!.add(w);
    }
    return m;
  }, [lesson]);

  const total = gematria(value);
  const secret = lesson.calculator.secrets[total];
  const hidden = secret !== undefined && !done.includes(secret);
  const matches = hidden ? [] : [...(known.get(total) ?? [])].filter((w) => w !== value.trim());

  const press = (k: string) => setValue((v) => (k === '⌫' ? [...v].slice(0, -1).join('') : v + k));

  return (
    <section className="calc" aria-labelledby="calc-h">
      <h2 id="calc-h">{t('calc.title')}</h2>
      <p className="sub">{t('calc.sub')}</p>
      <input
        className="calc-in"
        dir="rtl"
        lang="he"
        autoComplete="off"
        placeholder="אש"
        aria-label={t('calc.input')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="kbd">
        {KEYBOARD.map((k) => (
          <button key={k} className="key" aria-label={k} onClick={() => press(k)}>
            {k}
            <small>{VALUES[k]}</small>
          </button>
        ))}
        <button className="key wide" onClick={() => press(' ')}>
          {t('calc.space')}
        </button>
        <button className="key wide" onClick={() => press('⌫')}>
          {t('calc.backspace')}
        </button>
      </div>
      <div className="calc-out">
        <span className="total">{total}</span>
        <span className="match">
          {total > 0 &&
            (matches.length ? (
              <>
                {t('calc.equals')}{' '}
                {matches.map((w, i) => (
                  <span key={w}>
                    {i > 0 && ', '}
                    <span className="he">{displayNames(w)}</span>
                  </span>
                ))}
              </>
            ) : (
              t('calc.noMatch')
            ))}
        </span>
      </div>
      {letters(value).length > 0 && <Methods text={value} />}
      {letters(value).length > 1 && (
        <button className="coach-toggle" aria-expanded={coach} onClick={() => setCoach((c) => !c)}>
          🧮 {t(coach ? 'coach.hide' : 'coach.open')}
        </button>
      )}
      {coach && letters(value).length > 1 && (
        <MathCoach key={value} actions={wordActions(value)} />
      )}
    </section>
  );
}
