import { useState } from 'react';
import { useI18n } from '../i18n';
import { displayNames } from '../core/names';
import { letters } from '../core/gematria';
import { asWord, checkLetters, expectedTiles, phraseTiles, plainLetter } from '../core/letterPuzzle';
import type { LettersStep, TapStep } from '../lessons/types';
import type { StepState } from '../core/useLessonState';

/**
 * «Собери слово»: tap letters of the phrase to fill the slots; tap a filled slot to give its letter back.
 * After a hint the letters the rule takes are marked; once solved they stay marked and the word is shown.
 */
export function LettersPuzzle({
  step,
  x,
  locked,
  onCheck,
}: {
  step: LettersStep;
  x: StepState;
  locked: boolean;
  onCheck: (result: 'ok' | 'place' | 'no') => void;
}) {
  const { t } = useI18n();
  const [picked, setPicked] = useState<number[]>([]);
  const tiles = phraseTiles(displayNames(step.from));
  const exp = expectedTiles(phraseTiles(step.from), step.take);
  const n = letters(step.a).length;
  const done = x.ok;
  const words = [...new Set(tiles.map((tl) => tl.w))];
  const mark = done || x.hint;

  const check = () => {
    const res = checkLetters(step.from, step.take, step.a, picked);
    setPicked([]);
    onCheck(res);
  };

  return (
    <div className="lt">
      <div className="lt-bank" dir="rtl" lang="he" aria-label={t('letters.bank')}>
        {words.map((w) => (
          <span key={w} className="lt-word">
            {tiles
              .filter((tl) => tl.w === w)
              .map((tl) => {
                const used = picked.includes(tl.i);
                return (
                  <button
                    key={tl.i}
                    className={`lt-tile${used ? ' used' : ''}${mark && exp.has(tl.i) ? ' hl' : ''}`}
                    disabled={done || locked || used || picked.length >= n}
                    onClick={() => setPicked((p) => [...p, tl.i])}
                  >
                    {tl.c}
                  </button>
                );
              })}
          </span>
        ))}
      </div>
      <div className="lt-row">
        <div className="lt-slots" dir="rtl" lang="he" aria-label={t('letters.slots')}>
          {done
            ? [...asWord(step.a)].map((c, k) => (
                <span key={k} className="lt-slot full ok">
                  {c}
                </span>
              ))
            : Array.from({ length: n }, (_, k) => {
                const i = picked[k];
                return (
                  <button
                    key={k}
                    className={`lt-slot${i !== undefined ? ' full' : ''}`}
                    disabled={i === undefined}
                    aria-label={i === undefined ? t('letters.empty') : t('letters.remove')}
                    onClick={() => setPicked((p) => p.filter((_, j) => j !== k))}
                  >
                    {i !== undefined ? plainLetter(tiles[i].c) : ''}
                  </button>
                );
              })}
        </div>
        {!done && (
          <>
            <button className="btn" disabled={picked.length < n || locked} onClick={check}>
              {t('riddle.check')}
            </button>
            {picked.length > 0 && (
              <button className="btn ghost" onClick={() => setPicked([])}>
                {t('letters.clear')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** «Найди букву»: the word as letter tiles; a tap is an attempt. */
export function TapPuzzle({ step, x, locked, onTap }: { step: TapStep; x: StepState; locked: boolean; onTap: (k: number) => void }) {
  const { t } = useI18n();
  return (
    <div className="lt-bank tap" dir="rtl" lang="he" aria-label={t('letters.word')}>
      <span className="lt-word">
        {letters(displayNames(step.word)).map((c, k) => {
          const wrong = x.pick.includes(k) && k !== step.a;
          const right = x.ok && k === step.a;
          return (
            <button
              key={k}
              className={`lt-tile big${wrong ? ' wrong' : ''}${right ? ' right' : ''}`}
              disabled={x.ok || locked || wrong}
              onClick={() => onTap(k)}
            >
              {c}
            </button>
          );
        })}
      </span>
    </div>
  );
}
