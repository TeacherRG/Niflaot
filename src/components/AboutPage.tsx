import { Html, useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

/** Разделы академии на странице «О проекте» — карточка со ссылкой; тексты `about.<id>.h` / `about.<id>.p` (ru/en/de). */
const SECTIONS = [
  { id: 'torah', href: '#/', he: 'תּוֹרָה' },
  { id: 'tanakh', href: '#/neviim', he: 'נ״ך' },
  { id: 'atlas', href: '#/atlas', he: 'מִי וְאֵיפֹה' },
  { id: 'hemshech', href: '#/hemshech', he: 'חֲסִידוּת' },
  { id: 'lashon', href: '#/lashon', he: 'לָשׁוֹן' },
  { id: 'reading', href: '#/reading', he: 'תְּהִלִּים' },
  { id: 'koelet', href: '#/koelet', he: 'קֹהֶלֶת' },
  { id: 'daily', href: '#/facts', he: 'יוֹם יוֹם' },
  { id: 'family', href: '#/shabbat-table', he: 'שַׁבָּת' },
  { id: 'academy', href: '#/academy', he: 'תְּעוּדָה' },
] as const;

/**
 * «О проекте» (`#/about`; меню и подвал): что такое Нифлаот, два режима, разделы карточками со ссылками, как мы учим,
 * «Честно и спокойно», тексты и лицензии (свёрнуто), кто делает, партнёры, связь. Открыта и без входа (`gate.ts`).
 */
export function AboutPage() {
  const { t } = useI18n();
  return (
    <>
      <TopBar title={t('about.title')} />
      <div className="wrap free about">
        <header className="free-head about-head">
          <div className="about-mark he" aria-hidden="true">
            נפלאות
          </div>
          <h1>{t('about.title')}</h1>
          <Html as="p" className="free-lead" html={t('about.lead')} />
          <p className="free-badges">{t('about.badges')}</p>
        </header>

        <section className="about-sec">
          <h2>{t('about.modesH')}</h2>
          <div className="about-modes">
            <div className="about-mode kids">
              <b>{t('about.kids.h')}</b>
              <span>{t('about.kids.p')}</span>
            </div>
            <div className="about-mode adults">
              <b>{t('about.adults.h')}</b>
              <span>{t('about.adults.p')}</span>
            </div>
          </div>
          <p className="about-note">{t('about.modesNote')}</p>
        </section>

        <section className="about-sec">
          <h2>{t('about.learnH')}</h2>
          <ul className="free-grid">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a className="free-card" href={s.href}>
                  <span className="free-he he" lang="he" aria-hidden="true">
                    {s.he}
                  </span>
                  <b>{t(`about.${s.id}.h` as MessageKey)}</b>
                  <span>{t(`about.${s.id}.p` as MessageKey)}</span>
                  <small>{t('free.open')} →</small>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="about-two">
          <section className="about-sec prose">
            <h2>{t('about.howH')}</h2>
            <Html as="div" html={t('about.how')} />
          </section>
          <section className="about-sec prose">
            <h2>{t('about.honestH')}</h2>
            <Html as="div" html={t('about.honest')} />
          </section>
        </div>

        <details className="about-texts prose">
          <summary>{t('about.textsH')}</summary>
          <Html as="div" html={t('about.texts')} />
        </details>

        <section className="free-why about-contact">
          <h2>{t('about.contactH')}</h2>
          <Html as="p" html={t('about.contact')} />
          <Html as="p" html={t('about.partners')} />
          <p className="free-btns">
            <a className="btn" href="https://mychitas.app/donate" target="_blank" rel="noopener">
              {t('footer.donate')}
            </a>
            <a className="btn ghost" href="#/free">
              {t('free.menu')}
            </a>
            <a className="btn ghost" href="mailto:Office@mychitas.app">
              Office@mychitas.app
            </a>
          </p>
        </section>
      </div>
      <Colophon />
    </>
  );
}
