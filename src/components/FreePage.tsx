import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { FREE_FEATURES } from '../core/freeFeatures';

/** «Всё бесплатно» (`#/free`): что даёт Нифлаот без подписки — карточки со ссылками, «Почему бесплатно?», поддержать. */
export function FreePage() {
  const { t } = useI18n();
  return (
    <>
      <TopBar title={t('free.title')} />
      <div className="wrap free">
        <header className="free-head">
          <h1>{t('free.title')}</h1>
          <p className="free-lead">{t('free.lead')}</p>
          <p className="free-badges">{t('free.badges')}</p>
        </header>
        <ul className="free-grid">
          {FREE_FEATURES.map((f) => (
            <li key={f.id}>
              <a className="free-card" href={f.href}>
                <span className="free-he he" lang="he" aria-hidden="true">
                  {f.he}
                </span>
                <b>{t(`free.${f.id}.h` as MessageKey)}</b>
                <span>{t(`free.${f.id}.p` as MessageKey)}</span>
                <small>{t('free.open')} →</small>
              </a>
            </li>
          ))}
        </ul>
        <section className="free-why">
          <h2>{t('free.whyH')}</h2>
          <p>{t('free.whyP')}</p>
          <p className="free-btns">
            <a className="btn" href="#/">
              {t('free.start')}
            </a>
            <a className="btn ghost" href="https://mychitas.app/donate" target="_blank" rel="noopener">
              {t('free.donate')}
            </a>
          </p>
        </section>
      </div>
      <Colophon />
    </>
  );
}
