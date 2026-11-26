/**
 * «⚙ Настройки чтения» — одно меню на все страницы «Святого чтения» (Теґилим, сидур, «Шнаим микра»; владелец, 26.11.2026: «настройки
 * одинаковы во всех разделах»): помощь при чтении (только где есть запись), как показывать текст (иврит / транслит и иврит / только
 * транслит), произношение, вид текста (кантилляция, размер текста − / + — иврит и транслит вместе, фон).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { Icon, useDismiss } from './ui';
import { PLAY_MODES, READING_BGS, SIZE_MAX, SIZE_MIN, sizeScale, type View } from '../core/reading';
import { PRONS, TR_MODES } from '../core/tehillimTranslit';

/** фон и размер текста страницы чтения: html[data-rbg], --rd-k (масштаб текста); уходя со страницы — снимаются */
export function useReadingLook(view: View) {
  useEffect(() => {
    const html = document.documentElement;
    if (view.bg === 'site') delete html.dataset.rbg;
    else html.dataset.rbg = view.bg;
    html.style.setProperty('--rd-k', String(sizeScale(view.size)));
  }, [view.bg, view.size]);
  useEffect(
    () => () => {
      delete document.documentElement.dataset.rbg;
      document.documentElement.style.removeProperty('--rd-k');
    },
    [],
  );
}

export function ReadingSettings({
  view,
  setV,
  audio,
  onBoth,
  living = true,
  layout = false,
  translit = true,
}: {
  view: View;
  setV: (v: View) => void;
  audio: boolean;
  onBoth?: () => void;
  /** пункт «Маячки — мысль к стиху» (у Теґилим; в Шахарите маячков нет) */
  living?: boolean;
  /** с транслитом — направление строк и что крупнее (Шахарит) */
  layout?: boolean;
  /** есть ли у страницы транслит («Шнаим микра» — только иврит и Таргум) */
  translit?: boolean;
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
            {translit ? t(`reading.tr.${view.tr}`) : t('reading.tr.he')}
            {layout && view.glossLang === 'de' && <> · Deutsch</>}
            {translit && view.tr !== 'he' && <> · {t(`reading.pron.${view.pron}`)}</>}
            {` · ${Math.round(sizeScale(view.size) * 100)} %`}
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
          {translit && (
            <>
              <div className="tk-view-head">{t('reading.tr')}</div>
              {TR_MODES.map((m) =>
                item(view.tr === m, m === 'he' ? 'אב' : m === 'duo' ? `${t('reading.tr.ab')}+אב` : t('reading.tr.ab'), t(`reading.tr.${m}`), t(`reading.tr.${m}.d`), () => setV({ ...view, tr: m })),
              )}
            </>
          )}
          {translit && view.tr !== 'he' && (
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
          {translit && <div className="tk-view-sep" />}
          <div className="tk-view-head">{t('reading.size')}</div>
          <div className="rd-size" role="group" aria-label={t('reading.size')}>
            <button type="button" className="rd-size-btn" disabled={view.size <= SIZE_MIN} aria-label={t('reading.sizeDown')} title={t('reading.sizeDown')} onClick={() => setV({ ...view, size: view.size - 1 })}>
              <span aria-hidden="true">A−</span>
            </button>
            <button type="button" className="rd-size-now" title={t('reading.sizeReset')} aria-label={`${t('reading.sizeReset')} · ${Math.round(sizeScale(view.size) * 100)} %`} onClick={() => setV({ ...view, size: 0 })}>
              {Math.round(sizeScale(view.size) * 100)} %
            </button>
            <button type="button" className="rd-size-btn rd-size-up" disabled={view.size >= SIZE_MAX} aria-label={t('reading.sizeUp')} title={t('reading.sizeUp')} onClick={() => setV({ ...view, size: view.size + 1 })}>
              <span aria-hidden="true">A+</span>
            </button>
          </div>
          <small className="rd-set-d rd-size-d">{t('reading.size.d')}</small>
          <div className="tk-view-sep" />
          <div className="tk-view-head">{t('reading.bg')}</div>
          <div className="rd-bgs" role="group" aria-label={t('reading.bg')}>
            {READING_BGS.map((b) => (
              <button key={b} type="button" role="menuitemradio" aria-checked={view.bg === b} className={`rd-bg-chip rd-bg-${b}`} onClick={() => setV({ ...view, bg: b })}>
                <span className="rd-bg-sw" aria-hidden="true" />
                <span>{t(`reading.bg.${b}`)}</span>
              </button>
            ))}
          </div>
          <div className="tk-view-sep" />
          <div className="tk-view-head">{t('reading.look')}</div>
          {item(view.taamim, '♫', t('reading.v.taamim'), t('reading.v.taamim.d'), () => setV({ ...view, taamim: !view.taamim }), 'menuitemcheckbox')}
          {living && item(view.living, '●', t('living.set'), t('living.set.d'), () => setV({ ...view, living: !view.living }), 'menuitemcheckbox')}
        </div>
      )}
    </div>
  );
}

