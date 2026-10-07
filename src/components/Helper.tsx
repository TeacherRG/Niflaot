import { useState, useSyncExternalStore } from 'react';
import { Html, useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { KEYBOARD, VALUES } from '../core/gematria';
import { gematriaSteps } from '../core/gematriaSteps';
import { getPageState, subscribePageState } from '../core/assistant';
import { SOURCES, sourceLabel } from '../sources';
import { HebrewRuns } from './Hebrew';
import { Sheet, useUI } from './ui';

const EXAMPLES = ['שלום', 'חכמה', 'אהבה', 'תורה'];
const FAQ = ['count', 'stuck', 'finals', 'names', 'sources', 'progress', 'print', 'contact'] as const;

/** Gematria of any word, explained the way you'd add it in your head. */
function StepByStep({ words }: { words: string[] }) {
  const { t } = useI18n();
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [verdict, setVerdict] = useState<'ok' | 'bad' | null>(null);
  const [shown, setShown] = useState(false);
  const g = gematriaSteps(word);

  const pick = (w: string) => {
    setWord(w);
    setGuess('');
    setVerdict(null);
    setShown(false);
  };
  const press = (k: string) => pick(k === '⌫' ? [...word].slice(0, -1).join('') : word + k);

  return (
    <div className="hp-steps">
      <div className="ai-suggest">
        {words.map((w) => (
          <button key={w} className="chip he" onClick={() => pick(w)}>
            <HebrewRuns text={w} />
          </button>
        ))}
      </div>
      <input
        className="calc-in hp-in"
        dir="rtl"
        lang="he"
        autoComplete="off"
        placeholder="שלום"
        aria-label={t('calc.input')}
        value={word}
        onChange={(e) => pick(e.target.value)}
      />
      <details className="hp-kbd">
        <summary>{t('helper.keyboard')}</summary>
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
      </details>

      {g.letters.length > 0 && (
        <>
          <div className="hp-letters" dir="rtl">
            {g.letters.map((l, i) => (
              <span key={i}>
                <b>{l.c}</b>
                <i>{l.v}</i>
              </span>
            ))}
          </div>
          {!shown && (
            <form
              className="hp-try"
              onSubmit={(e) => {
                e.preventDefault();
                setVerdict(Number(guess) === g.total ? 'ok' : 'bad');
              }}
            >
              <label>
                {t('helper.try')}
                <input inputMode="numeric" value={guess} onChange={(e) => setGuess(e.target.value.replace(/\D/g, ''))} />
              </label>
              <button className="btn" disabled={!guess}>
                {t('math.check')}
              </button>
              <button type="button" className="btn ghost" onClick={() => setShown(true)}>
                {t('math.show')}
              </button>
            </form>
          )}
          {verdict === 'ok' && <div className="fb ok">{t('math.correct')}</div>}
          {verdict === 'bad' && !shown && <div className="fb no">{t('math.wrong')}</div>}
          {(shown || verdict === 'ok') && (
            <ol className="hp-solution">
              {g.groups.map((gr) => (
                <li key={gr.rank}>
                  <span className="hp-rank">{t(`helper.rank.${gr.rank}` as MessageKey)}</span>{' '}
                  {gr.letters.map((c, i) => (
                    <span key={i}>
                      {i > 0 && ' + '}
                      <span className="he">{c}</span>
                    </span>
                  ))}
                  {' = '}
                  {gr.values.length > 1 ? `${gr.values.join(' + ')} = ${gr.sum}` : gr.sum}
                </li>
              ))}
              {g.join.length > 0 && (
                <li>
                  <span className="hp-rank">{t('helper.join')}</span> {g.join.join(' → ')}
                </li>
              )}
            </ol>
          )}
          {(shown || verdict === 'ok') && (
            <div className="hp-total">
              {t('math.answer')}: {g.total}
            </div>
          )}
          {(shown || verdict) && (
            <a className="hint-link" href="#/math/add">
              {t('helper.moreAdd')}
            </a>
          )}
        </>
      )}
    </div>
  );
}

/** Primary sources of the riddles already solved; the rest stay closed until solved, like in the lesson. */
function LessonSources() {
  const { t, locale } = useI18n();
  const page = useSyncExternalStore(subscribePageState, getPageState);
  if (!page) return <p className="sheet-note">{t('helper.sourcesNoLesson')}</p>;
  const ids = (done: boolean) =>
    [...new Set(page.lesson.riddles.flatMap((r, i) => (page.done.includes(i) === done ? (r.sources ?? []) : [])))].filter(
      (id) => SOURCES[id],
    );
  const open = ids(true);
  const locked = ids(false).filter((id) => !open.includes(id)).length;
  return (
    <>
      {open.length > 0 && (
        <ul className="hp-sources">
          {open.map((id) => (
            <li key={id}>
              <span className="src-kind">{sourceLabel(SOURCES[id], locale).kind}</span>{' '}
              <a href={SOURCES[id].url} target="_blank" rel="noopener">
                {sourceLabel(SOURCES[id], locale).title}
              </a>
            </li>
          ))}
        </ul>
      )}
      {locked > 0 && <p className="sheet-note">{t('helper.sourcesLocked', { n: locked })}</p>}
      {open.length > 0 && <p className="sheet-note">{t('helper.sourcesWhere')}</p>}
    </>
  );
}

/** The helper that works without any server: gematria step by step, sources, answers to common questions. */
export function Helper() {
  const { t } = useI18n();
  const { panel, open } = useUI();
  const page = useSyncExternalStore(subscribePageState, getPageState);
  const cards = page ? [...new Set(page.lesson.riddles[Math.min(page.lvl, page.lesson.riddles.length - 1)].words)] : EXAMPLES;

  return (
    <Sheet open={panel === 'assistant'} onClose={() => open(null)} title={t('helper.title')} closeLabel={t('menu.close')}>
      <p className="hp-intro">{t('helper.intro')}</p>

      <h3 className="sheet-h3">{t('helper.stepsTitle')}</h3>
      <p className="sheet-note hp-lead">{t('helper.stepsLead')}</p>
      <StepByStep words={cards} />

      <h3 className="sheet-h3">{t('sources.title')}</h3>
      <LessonSources />

      <h3 className="sheet-h3">{t('helper.faqTitle')}</h3>
      <div className="hp-faq">
        {FAQ.map((k) => (
          <details key={k}>
            <summary>{t(`helper.q.${k}` as MessageKey)}</summary>
            <Html as="div" className="prose" html={t(`helper.a.${k}` as MessageKey)} />
          </details>
        ))}
      </div>

      <div className="about-links">
        <button className="btn ghost" onClick={() => open('help')}>
          {t('help.title')}
        </button>
        <a className="btn ghost" href="#/math/add" onClick={() => open(null)}>
          {t('math.title')}
        </a>
      </div>
    </Sheet>
  );
}
