import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { NIFLAOT_LOGO } from '../core/partners';
import { savedHebrewLevel } from '../core/hebrewLevel';
import { setMode, useSavedMode, type Mode } from '../core/mode';
import { useUI } from './ui';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';

/**
 * «Кто будет учиться?» — on the first visit instead of the home page, and at `#/mode` (menu → «Режим · сменить»):
 * the children's site or the adults' one (src/core/mode.ts). After «Дети и семья» on the first visit — «Как играть»
 * with «Как вы с ивритом?».
 */
export function ModePicker() {
  const { t } = useI18n();
  const { open } = useUI();
  const saved = useSavedMode();

  useEffect(() => {
    document.title = `${t('mode.title')} · ${t('app.title')}`;
  }, [t]);

  const choose = (m: Mode) => {
    const first = saved === null;
    setMode(m);
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    window.scrollTo(0, 0);
    if (m === 'kids' && first && savedHebrewLevel() === null) {
      try {
        localStorage.setItem('niflaot:help-seen', '1');
      } catch {}
      setTimeout(() => open('help'), 300);
    }
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
        <h1>{t('mode.title')}</h1>
        <div className="mode-opts">
          {(['kids', 'adults'] as const).map((m) => (
            <button key={m} className={`mode-opt ${m}${saved === m ? ' on' : ''}`} onClick={() => choose(m)}>
              <span className="mode-ico" aria-hidden="true">
                {m === 'kids' ? '🧩' : '📖'}
              </span>
              <b>{t(`mode.${m}`)}</b>
              <small>{t(`mode.${m}Sub`)}</small>
            </button>
          ))}
        </div>
        <p className="mode-note">{t('mode.note')}</p>
      </main>
      <Colophon />
    </>
  );
}
