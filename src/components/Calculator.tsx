import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { KEYBOARD, VALUES, gematria } from '../core/gematria';
import type { Lesson } from '../lessons/types';

export function Calculator({ lesson, done }: { lesson: Lesson; done: number[] }) {
  const { t } = useI18n();
  const [value, setValue] = useState('שלום');

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
                    <span className="he">{w}</span>
                  </span>
                ))}
              </>
            ) : (
              t('calc.noMatch')
            ))}
        </span>
      </div>
    </section>
  );
}
