import { useI18n } from '../i18n';

/**
 * The newsletter's sign-up form: new lessons of the weekly portion by email. The list lives at a mailing service
 * (e.g. Buttondown — its «embed-subscribe» address); the site only posts the address there, in a new tab, where the
 * service asks to confirm it (double opt-in). `VITE_SUBSCRIBE_URL` (repository variable `SUBSCRIBE_URL`) — without it
 * the form is hidden. The language goes along as a tag, so each list gets its own language.
 */
export const SUBSCRIBE_URL: string = import.meta.env.VITE_SUBSCRIBE_URL ?? '';

export function Subscribe() {
  const { t, locale } = useI18n();
  if (!SUBSCRIBE_URL) return null;
  return (
    <section className="subscribe pop">
      <h2>✉️ {t('subscribe.title')}</h2>
      <p>{t('subscribe.lead')}</p>
      <form action={SUBSCRIBE_URL} method="post" target="_blank" className="subscribe-form">
        <input type="email" name="email" required autoComplete="email" placeholder={t('subscribe.placeholder')} aria-label={t('subscribe.placeholder')} />
        <input type="hidden" name="tag" value={locale} />
        <input type="hidden" name="referrer_url" value={`${location.origin}/?ref=mail`} />
        <button className="btn" type="submit">
          {t('subscribe.button')}
        </button>
      </form>
      <p className="subscribe-note">{t('subscribe.note')}</p>
    </section>
  );
}
