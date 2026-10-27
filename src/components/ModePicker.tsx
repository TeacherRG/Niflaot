import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { savedHebrewLevel, setHebrewLevel, HEBREW_LEVELS, type HebrewLevel } from '../core/hebrewLevel';
import { setMode, type Mode } from '../core/mode';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';

const MIN_AGE = 8;
const MAX_AGE = 120;
const ADULT_AGE = 14;

/** A compact first-visit setup: age selects the site mode and Hebrew level adjusts hints; courses can be chosen later in the Academy. */
export function ModePicker() {
  const { t } = useI18n();
  const [age, pickAge] = useState<number | null>(null);
  const [level, pickLevel] = useState<HebrewLevel | null>(savedHebrewLevel);
  const mode: Mode | null = age === null ? null : age < ADULT_AGE ? 'kids' : 'adults';
  const hebrewLevel = level ?? 'letters';
  const ageOptions = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

  useEffect(() => {
    document.title = `${t('onboarding.title')} · ${t('app.title')}`;
  }, [t]);

  const start = () => {
    if (mode === null || age === null) return;
    if (level) setHebrewLevel(level);
    try {
      localStorage.setItem('niflaot:help-seen', '1');
    } catch {}
    setMode(mode);
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    window.scrollTo(0, 0);
  };

  return (
    <>
      <TopBar title={t('app.title')} wide />
      <main className="mode-pick">
        <h1 className="mode-title">{t('onboarding.title')}</h1>

        <section className="mode-section" aria-labelledby="onboarding-age">
          <label className="mode-field-label" htmlFor="onboarding-age">{t('onboarding.age')}</label>
          <select
            id="onboarding-age"
            className="mode-age"
            value={age ?? ''}
            onChange={(event) => pickAge(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="" disabled>{t('onboarding.agePlaceholder')}</option>
            {ageOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <p className="mode-hint">
            {t('onboarding.ageHint')}
            {mode && <span className="mode-result">{t(`mode.${mode}`)}</span>}
          </p>
        </section>

        <section className="mode-section" aria-labelledby="onboarding-hebrew">
          <div className="mode-field-label" id="onboarding-hebrew">{t('hebrew.q')}</div>
          <output className="mode-level" htmlFor="onboarding-hebrew">{t(`hebrew.${hebrewLevel}.short`)}</output>
          <input
            className="mode-range"
            type="range"
            min="0"
            max={HEBREW_LEVELS.length - 1}
            step="1"
            value={HEBREW_LEVELS.indexOf(hebrewLevel)}
            aria-label={t('hebrew.q')}
            aria-valuetext={t(`hebrew.${hebrewLevel}.short`)}
            onChange={(event) => pickLevel(HEBREW_LEVELS[Number(event.target.value)])}
          />
          <div className="mode-range-labels" aria-hidden="true">
            {HEBREW_LEVELS.map((l) => <span key={l}>{t(`hebrew.${l}.short`)}</span>)}
          </div>
          <p className="mode-hint">{t('onboarding.hebrewHint')}</p>
          <button className="mode-skip" type="button" onClick={() => pickLevel(null)}>{t('hebrew.skip')}</button>
        </section>

        <button className="btn mode-start" disabled={mode === null} onClick={start}>
          {t('mode.start')} →
        </button>
        <p className="mode-note">{t('onboarding.note')}</p>
      </main>
      <Colophon />
    </>
  );
}
