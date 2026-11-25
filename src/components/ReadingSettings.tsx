/**
 * «⚙ Настройки чтения» — одно меню для «Святого чтения» (Теґилим) и Шахарита: помощь при чтении (только где есть запись),
 * как показывать текст (иврит / транслит и иврит / только транслит), произношение, вид текста (кантилляция, крупный шрифт).
 */
import { useCallback, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { Icon, useDismiss } from './ui';
import { PLAY_MODES, type View } from '../core/reading';
import { PRONS, TR_MODES } from '../core/tehillimTranslit';

export function ReadingSettings({
  view,
  setV,
  audio,
  onBoth,
  living = true,
  layout = false,
}: {
  view: View;
  setV: (v: View) => void;
  audio: boolean;
  onBoth?: () => void;
  /** пункт «Маячки — мысль к стиху» (у Теґилим; в Шахарите маячков нет) */
  living?: boolean;
  /** с транслитом — направление строк и что крупнее (Шахарит) */
  layout?: boolean;
}) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  // строки «слово над словом» — транслит или пословный перевод (сидур): им можно выбрать направление (владелец, 25.11.2026: «знающие
  // иврит читают справа налево, начинающие — слева направо»); под словом иврит — ещё и «что крупнее»
  const gloss = layout && view.glossLang === 'de';
  const paired = view.tr !== 'he' || gloss;
  const withHebrew = view.tr === 'duo' || (gloss && view.tr === 'he');
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  const item = (on: boolean, code: string, name: string, desc: string, onClick: () => void, role = 'menuitemradio') => (
    <button key={name} type="button" role={role} aria-checked={on} onClick={onClick}>
      <span className="code">{code}</span>
      <span className="name">
        {name}
        <small className="rd-set-d">{desc}</small>
      </span>
      {on && <Icon name="check" size={16} />}
    </button>
  );
  return (
    <div className="tk-view rd-set no-print no-speak" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">⚙</span>
        <span>
          {t('reading.view')}
          <small>
            {' · '}
            {audio && <>{t(`reading.mode.${view.play}`)} · </>}
            {t(`reading.tr.${view.tr}`)}
            {layout && view.glossLang === 'de' && <> · Deutsch</>}
            {view.tr !== 'he' && <> · {t(`reading.pron.${view.pron}`)}</>}
          </small>
        </span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div className="lang-list tk-view-list rd-set-list" role="menu" aria-label={t('reading.view')}>
          {audio && (
            <>
              <div className="tk-view-head">{t('reading.help')}</div>
              {PLAY_MODES.map((m) =>
                item(view.play === m, m === 'both' ? '♪✦' : m === 'voice' ? '♪' : '✦', t(`reading.mode.${m}`), t(`reading.mode.${m}.d`), () => {
                  setV({ ...view, play: m });
                  if (m === 'both') {
                    onBoth?.();
                    close();
                  }
                }),
              )}
              <div className="tk-view-sep" />
            </>
          )}
          <div className="tk-view-head">{t('reading.tr')}</div>
          {TR_MODES.map((m) =>
            item(view.tr === m, m === 'he' ? 'אב' : m === 'duo' ? `${t('reading.tr.ab')}+אב` : t('reading.tr.ab'), t(`reading.tr.${m}`), t(`reading.tr.${m}.d`), () => setV({ ...view, tr: m })),
          )}
          {view.tr !== 'he' && (
            <>
              <div className="tk-view-sep" />
              <div className="tk-view-head">{t('reading.pron')}</div>
              {PRONS.map((p) =>
                item(view.pron === p, p === 'ash' ? 'אָ=o' : 'אָ=a', t(`reading.pron.${p}`), t(`reading.pron.${p}.d`), () => setV({ ...view, pron: p })),
              )}
            </>
          )}
          {layout && (
            <>
              <div className="tk-view-sep" />
              <div className="tk-view-head">{locale === 'de' ? 'Übersetzungssprache' : locale === 'en' ? 'Translation language' : 'Язык перевода'}</div>
              {item(view.glossLang === 'none', 'אב', locale === 'de' ? 'Keine Übersetzung' : locale === 'en' ? 'No translation' : 'Без перевода', locale === 'de' ? 'Transliteration anzeigen' : locale === 'en' ? 'Show transliteration' : 'Показывать транслитерацию', () => setV({ ...view, glossLang: 'none' }))}
              {item(view.glossLang === 'de', 'DE', 'Deutsch', locale === 'de' ? 'Wort-für-Wort-Übersetzung: Morgensegen, Mincha und Maariw' : locale === 'en' ? 'Word-by-word translation: morning blessings, Mincha and Maariv' : 'Пословный перевод: утренние благословения, Минха и Маарив', () => setV({ ...view, glossLang: 'de' }))}
            </>
          )}
          {layout && paired && (
            <>
              <div className="tk-view-sep" />
              <div className="tk-view-head">{t('reading.trDir')}</div>
              {(['rtl', 'ltr'] as const).map((d) =>
                item(view.trDir === d, d === 'rtl' ? '←' : '→', t(`reading.trDir.${d}`), t(`reading.trDir.${d}.d`), () => setV({ ...view, trDir: d })),
              )}
              {withHebrew && (
                <>
                  <div className="tk-view-sep" />
                  <div className="tk-view-head">{t('reading.trBig')}</div>
                  {(['tr', 'he'] as const).map((b) =>
                    item(view.trBig === b, b === 'tr' ? `${t('reading.tr.ab')}+` : 'אב+', t(`reading.trBig.${b}`), t(`reading.trBig.${b}.d`), () => setV({ ...view, trBig: b })),
                  )}
                </>
              )}
            </>
          )}
          <div className="tk-view-sep" />
          <div className="tk-view-head">{t('reading.look')}</div>
          {item(view.taamim, '♫', t('reading.v.taamim'), t('reading.v.taamim.d'), () => setV({ ...view, taamim: !view.taamim }), 'menuitemcheckbox')}
          {item(view.big, 'A+', t('reading.v.big'), t('reading.v.big.d'), () => setV({ ...view, big: !view.big }), 'menuitemcheckbox')}
          {living && item(view.living, '●', t('living.set'), t('living.set.d'), () => setV({ ...view, living: !view.living }), 'menuitemcheckbox')}
        </div>
      )}
    </div>
  );
}

