import { useState } from 'react';
import { newsletterApi } from '../core/account';
import { useI18n } from '../i18n';

export function NewsletterUnsubscribe() {
  const { t } = useI18n();
  const token = new URLSearchParams(location.hash.split('?')[1] ?? '').get('token') ?? '';
  const [state, setState] = useState<'ready' | 'done' | 'bad'>('ready');
  const [busy, setBusy] = useState(false);

  const unsubscribe = async () => {
    setBusy(true);
    try {
      await newsletterApi('unsubscribe', { token });
      setState('done');
    } catch {
      setState('bad');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <section className="acc-card">
        <h1>{t('subscribe.unsubscribe.title')}</h1>
        {state === 'done' ? (
          <p role="status">{t('subscribe.unsubscribe.done')}</p>
        ) : state === 'bad' || !token ? (
          <p role="alert">{t('subscribe.unsubscribe.bad')}</p>
        ) : (
          <button className="btn" type="button" onClick={unsubscribe} disabled={busy}>
            {busy ? t('subscribe.wait') : t('subscribe.unsubscribe.action')}
          </button>
        )}
      </section>
    </main>
  );
}
