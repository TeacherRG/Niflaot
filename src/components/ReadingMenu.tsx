/**
 * «☰ Разделы» — одно меню на все страницы «Святого чтения» (владелец, 26.11.2026: «структурированное общее меню, чтобы можно было
 * переходить»): Теґилим (на сегодня, по дням недели, мои главы, все 150 глав, Песнь Аазину), Сидур — четыре молитвы, у каждой её
 * разделы (открытая молитва раскрыта, другие — по ▸), «Шнаим микра» (только у администратора). Вместе с «⚙ Настройками чтения» —
 * сразу под верхней панелью, над заголовком страницы.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { isAdmin } from '../admin/github';
import { PRAYERS, type Prayer } from '../core/siddur';
import { useI18n } from '../i18n';
import { Icon, useDismiss } from './ui';

export const PRAYER_KEY = { shacharit: 'reading.shacharit', mincha: 'reading.mincha', maariv: 'reading.maariv', 'birkat-hamazon': 'reading.birkat' } as const;
export type TrLang = 'ru' | 'en' | 'de';
export type SectionName = { title: string; t?: Partial<Record<TrLang, string>> };
/** раздел, к которому прокрутить после перехода на другую молитву из меню */
export const GO_KEY = 'niflaot:siddur-go';
export const sectionId = (i: number) => `shacharit-section-${i + 1}`;
/** названия разделов всех молитв для меню — `index.json` (`build-siddur.py`) */
let indexLoad: Promise<Record<string, SectionName[]>> | null = null;
export const loadIndex = () =>
  (indexLoad ??= fetch('/reading/siddur/index.json')
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))) as Promise<Record<string, SectionName[]>>;

export function ReadingMenu({
  prayer,
  sections,
  onGo,
  onTehillim,
}: {
  /** страница сидура: эта молитва, её разделы, прокрутка к разделу */
  prayer?: Prayer;
  sections?: ({ id: string } & SectionName)[];
  onGo?: (id: string) => void;
  /** страница Теґилим: «Все Теґилим» и «Изменить мои главы» — её окно; на других страницах — переход */
  onTehillim?: (what: 'all' | 'edit') => void;
}) {
  const { t, locale, ui } = useI18n();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(sections?.[0]?.id ?? '');
  const [index, setIndex] = useState<Record<string, SectionName[]>>({});
  const [unfolded, setUnfolded] = useState<Prayer | null>(prayer ?? null);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  useEffect(() => {
    if (!open) return;
    let live = true;
    void loadIndex().then((x) => live && setIndex(x));
    return () => {
      live = false;
    };
  }, [open]);
  useEffect(() => {
    if (!sections?.length) return;
    const onScroll = () => {
      let id = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 160) id = s.id;
      }
      setCurrent(id);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);
  // открыли меню — список сразу на том, что открыто
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const here = list?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (list && here) list.scrollTop = Math.max(0, here.offsetTop - 60);
  }, [open]);

  const lang: TrLang = locale === 'ru' || locale === 'de' ? locale : 'en';
  const nameOf = (s: SectionName) => (ui === 'he' ? s.title : s.t?.[lang] ?? s.title);
  const hash = location.hash.replace(/\?.*$/, '');
  const now = sections?.find((s) => s.id === current);

  const to = (href: string) => {
    close();
    location.hash = href;
  };
  const goSection = (p: Prayer, i: number) => {
    close();
    if (p === prayer && onGo) onGo(sectionId(i));
    else {
      try {
        sessionStorage.setItem(GO_KEY, String(i));
      } catch {
        /* без хранилища — откроется начало молитвы */
      }
      location.hash = `#/reading/siddur/${p}`;
    }
  };
  const link = (on: boolean, label: string, onClick: () => void, sub?: string) => (
    <button key={label} type="button" role="menuitemradio" aria-checked={on} onClick={onClick}>
      <span className="name">
        {label}
        {sub && <small className="rd-set-d">{sub}</small>}
      </span>
      {on && <Icon name="check" size={16} />}
    </button>
  );
  const tehillimHere = /^#\/reading(\/(\d+|day\/\d+|week(\/\d+)?|mine))?$/.test(hash);

  return (
    <div className="tk-view rd-set rd-nav-menu shacharit-menu" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">☰</span>
        <span>
          {t('reading.siddurContents')}
          <small>{` · ${now ? nameOf(now) : prayer ? t(PRAYER_KEY[prayer]) : hash.startsWith('#/reading/shnayim') ? t('reading.menuShnayim') : hash === '#/reading/haazinu' ? t('reading.menuHaazinu') : t('reading.book')}`}</small>
        </span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div ref={listRef} className="lang-list tk-view-list rd-set-list shacharit-menu-list" role="menu" aria-label={t('reading.siddurContents')}>
          <div role="group" aria-label={t('reading.book')}>
            <div className={`tk-view-head rd-nav-group${tehillimHere ? ' shacharit-menu-now' : ''}`}>📖 {t('reading.book')}</div>
            {link(hash === '#/reading' || hash.startsWith('#/reading/day'), t('rmenu.today'), () => to('#/reading'))}
            {link(hash.startsWith('#/reading/week'), t('rmenu.week'), () => to('#/reading/week'))}
            {link(hash === '#/reading/mine', t('reading.myChapters'), () => to('#/reading/mine'))}
            {link(/^#\/reading\/\d+$/.test(hash), t('rmenu.all'), () => (onTehillim ? (close(), onTehillim('all')) : to('#/reading/1')))}
            {onTehillim && link(false, t('rmenu.editMine'), () => (close(), onTehillim('edit')))}
            {link(hash === '#/reading/haazinu', t('reading.menuHaazinu'), () => to('#/reading/haazinu'))}
          </div>
          <div className="tk-view-sep" />
          <div role="group" aria-label={t('reading.siddur')}>
            <div className={`tk-view-head rd-nav-group${prayer ? ' shacharit-menu-now' : ''}`}>📘 {t('reading.siddur')}</div>
            {PRAYERS.map((p) => {
              const list: SectionName[] = p === prayer && sections ? sections : index[p] ?? [];
              const unfold = unfolded === p;
              return (
                <div key={p} role="group" aria-label={t(PRAYER_KEY[p])} className="rd-nav-prayer">
                  <div className="rd-nav-row">
                    <button type="button" role="menuitemradio" aria-checked={p === prayer && !onGo} className="rd-nav-name" onClick={() => (p === prayer && onGo ? goSection(p, 0) : to(`#/reading/siddur/${p}`))}>
                      <span className="name">
                        <b>{t(PRAYER_KEY[p])}</b>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rd-nav-fold"
                      aria-expanded={unfold}
                      aria-label={t('rmenu.sectionsOf', { name: t(PRAYER_KEY[p]) })}
                      onClick={() => setUnfolded(unfold ? null : p)}
                    >
                      {unfold ? '▾' : '▸'}
                    </button>
                  </div>
                  {unfold &&
                    list.map((s, i) => {
                      const on = p === prayer && sectionId(i) === current;
                      return (
                        <button key={i} type="button" role="menuitemradio" aria-checked={on} className="rd-nav-sub" onClick={() => goSection(p, i)}>
                          <span className="name">
                            {nameOf(s)}
                            {ui !== 'he' && (
                              <small className="rd-set-d he" dir="rtl" lang="he">
                                {s.title}
                              </small>
                            )}
                          </span>
                          {on && <Icon name="check" size={16} />}
                        </button>
                      );
                    })}
                </div>
              );
            })}
          </div>
          {isAdmin() && (
            <>
              <div className="tk-view-sep" />
              <div className={`tk-view-head rd-nav-group${hash.startsWith('#/reading/shnayim') ? ' shacharit-menu-now' : ''}`}>📜 {t('reading.menuShnayim')}</div>
              {link(hash.startsWith('#/reading/shnayim'), t('reading.menuShnayimSub'), () => to('#/reading/shnayim'))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
