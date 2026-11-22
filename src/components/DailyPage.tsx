import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { DailyCard } from './DailyCard';

/** «Гематрия дня» — a standalone daily puzzle, separate from the «Знаете ли вы?» facts feed. */
export function DailyPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t('daily.seoTitle')} · ${t('app.title')}`;
  }, [t]);

  return (
    <>
      <TopBar title={t('daily.title')} />
      <div className="wrap">
        <header className="facts-head">
          <h1>{t('daily.seoTitle')}</h1>
          <p>{t('daily.seoLead')}</p>
        </header>
        <main>
          <DailyCard />
        </main>
      </div>
      <Colophon />
    </>
  );
}
