import { useEffect, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { Icon, useUI } from './ui';

type Tab = { href: string; label: string; icon: ReactNode; here: boolean };

/**
 * The bottom tab bar on a phone (≤ 640 px, CSS) — the main sections under the thumb, like an app; «Меню» opens the
 * side menu (it holds the rest: Torah, help, about). Children: Главная · Слова Торы · Знаете ли вы? · Академия · Меню;
 * adults: Сегодня · Танах · Хасидут · Мои слова · Меню. Not on printouts, the admin, the onboarding and the quiz
 * host's big screen. While it is shown, `html.tabbed` hides the top bar's ☰ and lifts the ✦ button above it.
 */
export function TabBar({ slug, view }: { slug: string; view?: string }) {
  const { t } = useI18n();
  const { open, panel } = useUI();
  const adults = useMode() === 'adults';
  const shown = !(slug === 'admin' || slug === 'mode' || view === 'print' || (slug === 'quiz' && view === 'host'));
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
  const tabs: Tab[] = adults
    ? [
        { href: '#/', label: t('tab.today'), icon: <Icon name="home" />, here: !slug },
        { href: '#/neviim', label: t('tab.tanakh'), icon: <Icon name="book" />, here: slug === 'neviim' || slug === 'ketuvim' },
        { href: '#/hemshech', label: t('hs.menuLbl'), icon: <Icon name="spark" />, here: slug === 'hemshech' },
        { href: '#/words', label: t('tab.words'), icon: he('אב'), here: slug === 'words' },
      ]
    : [
        { href: '#/', label: t('menu.home'), icon: <Icon name="home" />, here: !slug },
        { href: '#/torah-words', label: t('tab.words'), icon: he('אב'), here: slug === 'torah-words' },
        { href: '#/facts', label: t('tab.facts'), icon: <Icon name="hash" />, here: slug === 'facts' || slug === 'daily' },
        { href: '#/academy', label: t('academy.title'), icon: <Icon name="award" />, here: slug === 'academy' },
      ];
  return (
    <nav className={`tabbar no-print${adults ? ' adults' : ''}`} aria-label={t('tab.label')}>
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
    </nav>
  );
}
