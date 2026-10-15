import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { NIFLAOT_LOGO } from '../core/partners';
import { HEBREW_LEVELS, savedHebrewLevel, setHebrewLevel, type HebrewLevel } from '../core/hebrewLevel';
import { setMode, useSavedMode, type Mode } from '../core/mode';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';

/**
 * The onboarding — one window on the first visit instead of the home page (and at `#/mode`): two short questions,
 * 1) who is learning — the children's site or the adults' one (src/core/mode.ts),
 * 2) «Как вы с ивритом?» — how much help the letters get (src/core/hebrewLevel.ts);
 * «Начать» saves both and opens the home page. Both are changed later in the account window (👤).
 */
export function ModePicker() {
  const { t } = useI18n();
  const saved = useSavedMode();
  const [mode, pickMode] = useState<Mode | null>(saved);
  const [level, pickLevel] = useState<HebrewLevel | null>(savedHebrewLevel);

  useEffect(() => {
    document.title = `${t('mode.title')} · ${t('app.title')}`;
  }, [t]);

  const start = () => {
    if (!mode || !level) return;
    setHebrewLevel(level);
    try {
      localStorage.setItem('niflaot:help-seen', '1');
    } catch {}
    setMode(mode);
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* the language and «Войти» are needed before the choice too: a visitor may read another language, or come back on a new device */}
      <TopBar title={t('app.title')} wide />
      <main className="mode-pick">
        <img className="h-logo" src={NIFLAOT_LOGO} alt="Niflaot" width={760} height={298} fetchPriority="high" />
        <p className="mode-brand">
          {t('mode.brand')} · <span className="mode-promise">{t('home.promise')}</span>
        </p>
        <h1 id="mode-q1" className="mode-q">
          <span className="mode-n">1</span>
          {t('mode.title')}
        </h1>
        <div className="mode-opts" role="radiogroup" aria-labelledby="mode-q1">
          {(['kids', 'adults'] as const).map((m) => (
            <button key={m} role="radio" aria-checked={mode === m} className={`mode-opt ${m}${mode === m ? ' on' : ''}`} onClick={() => pickMode(m)}>
              <span className="mode-ico" aria-hidden="true">
                {m === 'kids' ? '🧩' : '📖'}
              </span>
              <b>{t(`mode.${m}`)}</b>
              <small>{t(`mode.${m}Short`)}</small>
            </button>
          ))}
        </div>
        <h2 id="mode-q2" className="mode-q">
          <span className="mode-n">2</span>
          {t('hebrew.q')}
        </h2>
        <div className="mode-hb" role="radiogroup" aria-labelledby="mode-q2">
          {HEBREW_LEVELS.map((l) => (
            <button key={l} role="radio" aria-checked={level === l} className={`mode-hb-opt${level === l ? ' on' : ''}`} onClick={() => pickLevel(l)}>
              <b>{t(`hebrew.${l}.short`)}</b>
              <small>{t(`hebrew.${l}.sub`)}</small>
            </button>
          ))}
        </div>
        <button className="btn mode-start" disabled={!mode || !level} onClick={start}>
          {t('mode.start')} →
        </button>
        <p className="mode-note">{t('mode.note')}</p>
      </main>
      <Colophon />
    </>
  );
}
