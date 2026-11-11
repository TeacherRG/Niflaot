import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { LEARN_ROUTE, useLearnLang } from '../core/learnLang';
import { LESSON_GROUPS, findLesson, weekParsha } from '../lessons';
import { Icon, Sheet, useUI } from './ui';

type Tab = { href: string; label: string; icon: ReactNode; here: boolean };

/**
 * The bottom tab bar on a phone (≤ 640 px, CSS) — the main sections under the thumb, like an app; «Меню» opens the
 * side menu (it holds the rest: Torah, help, about). Children: Главная · Слова Торы · Знаете ли вы? · Академия · Меню;
 * adults: Печать · Танах · Хасидут · Иврит (`#/lashon`, «Святой язык») · Меню — «Печать» opens a sheet of what can be printed
 * (owner, 10.11.2026: «Сегодня» repeated the avatar button; «Мои слова» → the whole «Святой язык»). Not on printouts, the admin, the onboarding, the quiz
 * host's big screen and «Тайна Коэлета» (the game has its own bar at the bottom). While it is shown, `html.tabbed` hides the top bar's ☰ and lifts the ✦ button above it.
 */
export function TabBar({ slug, view }: { slug: string; view?: string }) {
  const { t } = useI18n();
  const { open, panel } = useUI();
  const adults = useMode() === 'adults';
  const learn = useLearnLang();
  const [printing, setPrinting] = useState(false);
  const shown = !(slug === 'admin' || slug === 'mode' || view === 'print' || (slug === 'quiz' && view === 'host') || slug === 'koelet');
  useEffect(() => {
    document.documentElement.classList.toggle('tabbed', shown);
    return () => document.documentElement.classList.remove('tabbed');
  }, [shown]);
  if (!shown) return null;
  const he = (s: string) => (
    <span className="he tab-he" aria-hidden="true">
      {s}
    </span>
  );
  // «Иврит» leads to the language chosen in the account («Какой язык вы будете учить?»)
  const learnHref = `#/${LEARN_ROUTE[learn ?? 'he']}`;
  const learnLabel = learn && learn !== 'he' ? t(`learn.${learn}`) : null;
  const langHere = slug === 'lashon' || slug === 'words' || slug === 'pics' || slug === 'letters' || slug === 'english' || slug === 'russian' || slug === 'german';
  const tabs: Tab[] = adults
    ? [
        { href: '#/neviim', label: t('tab.tanakh'), icon: <Icon name="book" />, here: slug === 'neviim' || slug === 'ketuvim' },
        { href: '#/hemshech', label: t('hs.menuLbl'), icon: <Icon name="spark" />, here: slug === 'hemshech' },
        { href: learnHref, label: learnLabel ?? t('tab.lashon'), icon: he('אב'), here: langHere },
      ]
    : [
        { href: '#/', label: t('menu.home'), icon: <Icon name="home" />, here: !slug },
        { href: learnHref, label: learnLabel ?? t('tab.words'), icon: he('אב'), here: langHere || slug === 'torah-words' },
        { href: '#/facts', label: t('tab.facts'), icon: <Icon name="hash" />, here: slug === 'facts' || slug === 'daily' },
        { href: '#/academy', label: t('academy.title'), icon: <Icon name="award" />, here: slug === 'academy' },
      ];
  return (
    <nav className={`tabbar no-print${adults ? ' adults' : ''}`} aria-label={t('tab.label')}>
      {adults && (
        <button type="button" className="tab" aria-haspopup="dialog" aria-expanded={printing} aria-current={view === 'print' || slug === 'shabbat-table' || slug === 'digest' ? 'page' : undefined} onClick={() => setPrinting(true)}>
          <span className="tab-ic">
            <Icon name="print" />
          </span>
          {t('tab.print')}
        </button>
      )}
      {tabs.map((tab) => (
        <a key={tab.href} href={tab.href} className="tab" aria-current={tab.here && panel !== 'menu' ? 'page' : undefined}>
          <span className="tab-ic">{tab.icon}</span>
          {tab.label}
        </a>
      ))}
      <button type="button" className="tab" aria-expanded={panel === 'menu'} onClick={() => open('menu')}>
        <span className="tab-ic">
          <Icon name="menu" />
        </span>
        {t('tab.menu')}
      </button>
      {adults && <PrintSheet open={printing} onClose={() => setPrinting(false)} slug={slug} view={view} />}
    </nav>
  );
}

/**
 * «Печать» of the bottom bar (adults): this page (a lesson — its print page) and the sheets made for paper — the passage
 * of the day of the Prophets and Writings, Baal ha-Turim of the day, «К шабатнему столу», «Неделя в Академии» and the lesson
 * of the week. Each page has its own «Распечатать» with its options, so the items only open them.
 */
function PrintSheet({ open, onClose, slug, view }: { open: boolean; onClose: () => void; slug: string; view?: string }) {
  const { t } = useI18n();
  const lesson = slug ? findLesson(slug) : undefined;
  const weekLesson = LESSON_GROUPS.find((g) => g.id === weekParsha())?.lessons[0];
  const item = (href: string, title: string, sub?: string) => (
    <a href={href} className="menu-item" onClick={onClose}>
      <Icon name="print" />
      <span>
        {title}
        {sub && <small>{sub}</small>}
      </span>
    </a>
  );
  return (
    <Sheet open={open} onClose={onClose} title={t('tab.printTitle')} closeLabel={t('menu.close')}>
      <div className="print-sheet">
        {slug && view !== 'print' && (lesson ? (
          item(`#/${lesson.slug}/print`, t('tab.printThis'))
        ) : (
          <button
            type="button"
            className="menu-item"
            onClick={() => {
              onClose();
              // after the sheet has gone, so it isn't on the paper
              setTimeout(() => window.print(), 50);
            }}
          >
            <Icon name="print" />
            <span>{t('tab.printThis')}</span>
          </button>
        ))}
        {item('#/neviim', t('tab.printTanakh'), t('tab.printTanakhSub'))}
        {item('#/turim', t('turim.title'))}
        {item('#/shabbat-table', t('table.title'), t('table.menuSub'))}
        {item('#/digest', t('digest.title'), t('digest.menuSub'))}
        {weekLesson && item(`#/${weekLesson.slug}/print`, t('tab.printLesson'), t('tab.printLessonSub'))}
        <p className="print-sheet-note">{t('tab.printNote')}</p>
      </div>
    </Sheet>
  );
}
