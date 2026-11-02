import { useState } from 'react';
import { useI18n } from '../i18n';
import { useAccount } from '../core/account';

/**
 * The newsletter's sign-up form: new lessons of the weekly portion by email. The list lives at a mailing service
 * (Buttondown — its «embed-subscribe» address); the site only posts the address there, in a new tab, where the
 * service asks to confirm it (double opt-in). `VITE_SUBSCRIBE_URL` (repository variable `SUBSCRIBE_URL`) — without it
 * the form is hidden. The language goes along as a tag, so each list gets its own language.
 *
 * Where (owner, 02.11.2026: «в конце ленты — совершенно не её место»): next to «Напоминать каждый день» — the card in the
 * account (`card`, how the site keeps in touch) and one line under the reminder in the lesson's final (`mini`, right after
 * the lesson, when the player wants the next one). The signed-in player's email is known — one tap, no typing.
 * Sent once — `niflaot:mail-sub` (this device only): the line in the final is gone, the card says «done».
 */
export const SUBSCRIBE_URL: string = import.meta.env.VITE_SUBSCRIBE_URL ?? '';
const SENT = 'niflaot:mail-sub';
const wasSent = () => {
  try {
    return !!localStorage.getItem(SENT);
  } catch {
    return false;
  }
};

export function Subscribe({ mini = false }: { mini?: boolean }) {
  const { t, locale } = useI18n();
  const known = useAccount().me?.user.email ?? '';
  const [sent, setSent] = useState(wasSent);
  const [justSent, setJustSent] = useState(false);
  if (!SUBSCRIBE_URL) return null;
  if (mini && sent && !justSent) return null;

  const onSubmit = () => {
    try {
      localStorage.setItem(SENT, String(Date.now()));
    } catch {}
    setSent(true);
    setJustSent(true);
  };
  const form = (
    <form action={SUBSCRIBE_URL} method="post" target="_blank" className="subscribe-form" onSubmit={onSubmit}>
      {known ? (
        <input type="hidden" name="email" value={known} />
      ) : (
        <input type="email" name="email" required autoComplete="email" placeholder={t('subscribe.placeholder')} aria-label={t('subscribe.placeholder')} />
      )}
      <input type="hidden" name="tag" value={locale} />
      <input type="hidden" name="referrer_url" value={`${location.origin}/?ref=mail`} />
      <button className={mini ? 'btn ghost' : 'btn'} type="submit">
        {t('subscribe.button')}
      </button>
    </form>
  );
  const status = justSent ? (
    <p className="subscribe-ok" role="status">✓ {t('subscribe.sent')}</p>
  ) : null;

  if (mini)
    return (
      <section className="subscribe subscribe-mini">
        <span className="subscribe-mini-t">✉️ {t('subscribe.short')}</span>
        {justSent ? status : form}
      </section>
    );
  return (
    <section className="acc-card subscribe">
      <h2>✉️ {t('subscribe.title')}</h2>
      <p>{t('subscribe.lead')}</p>
      {status ?? (sent ? <p className="subscribe-ok">✓ {t('subscribe.done')}</p> : null)}
      {!justSent && form}
      {!justSent && known && <p className="subscribe-note">{t('subscribe.as', { email: known })}</p>}
      {!justSent && <p className="subscribe-note">{t('subscribe.note')}</p>}
    </section>
  );
}
