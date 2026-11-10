import { useState, type FormEvent } from 'react';
import { useI18n } from '../i18n';
import { AccountError, newsletterApi, useAccount } from '../core/account';
import { ASSISTANT_URL } from '../core/assistant';

type Frequency = 'daily' | 'weekly';
type ErrorKey =
  | 'subscribe.error.email'
  | 'subscribe.error.frequency'
  | 'subscribe.error.wait'
  | 'subscribe.error.expired'
  | 'subscribe.error.code'
  | 'subscribe.error.mail'
  | 'subscribe.error.failed';
const ERROR_TEXT: Record<string, ErrorKey> = {
  email: 'subscribe.error.email',
  frequency: 'subscribe.error.frequency',
  wait: 'subscribe.error.wait',
  expired: 'subscribe.error.expired',
  code: 'subscribe.error.code',
  mail: 'subscribe.error.mail',
};

export function Subscribe({ mini = false }: { mini?: boolean }) {
  const { t, locale } = useI18n();
  const { me, mail } = useAccount();
  const known = me?.user.age === 'adult' ? me.user.email : '';
  const parentRequired = me?.user.age === 'child';
  const [email, setEmail] = useState(known);
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!ASSISTANT_URL || !mail) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (codeSent) {
        await newsletterApi('confirm', { email, code });
        setDone(true);
      } else {
        await newsletterApi('code', { email, frequency, lang: locale });
        setCodeSent(true);
      }
    } catch (e) {
      const reason = e instanceof AccountError ? e.code : 'failed';
      setError(t(ERROR_TEXT[reason] ?? 'subscribe.error.failed'));
    } finally {
      setBusy(false);
    }
  };

  const status = done ? <p className="subscribe-ok" role="status">✓ {t('subscribe.sent')}</p> : null;
  const form = done ? null : (
    <form className="subscribe-form" onSubmit={submit}>
      {known ? (
        <input type="hidden" name="email" value={email} />
      ) : (
        <input
          type="email"
          value={email}
          required
          autoComplete="email"
          placeholder={t('subscribe.placeholder')}
          aria-label={t('subscribe.placeholder')}
          onChange={(e) => setEmail(e.target.value)}
          disabled={codeSent}
        />
      )}
      {!codeSent && (
        <label className="subscribe-frequency">
          <span>{t('subscribe.frequency')}</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
            <option value="daily">{t('subscribe.daily')}</option>
            <option value="weekly">{t('subscribe.weekly')}</option>
          </select>
        </label>
      )}
      {codeSent && (
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          value={code}
          placeholder={t('subscribe.code')}
          aria-label={t('subscribe.code')}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
      )}
      <button className={mini ? 'btn ghost' : 'btn'} type="submit" disabled={busy}>
        {busy ? t('subscribe.wait') : codeSent ? t('subscribe.confirm') : t('subscribe.button')}
      </button>
      {error && <span className="subscribe-error" role="alert">{error}</span>}
    </form>
  );

  if (mini)
    return (
      <section className="subscribe subscribe-mini">
        <span className="subscribe-mini-t">✉️ {t('subscribe.short')}</span>
        {codeSent && !done && <span className="subscribe-note">{t('subscribe.codeSent')}</span>}
        {status ?? form}
      </section>
    );
  return (
    <section className="acc-card subscribe">
      <h2>✉️ {t('subscribe.title')}</h2>
      <p>{t('subscribe.lead')}</p>
      {codeSent && !done && <p className="subscribe-note">{t('subscribe.codeSent')}</p>}
      {status ?? form}
      {!done && <p className="subscribe-note">{t(parentRequired ? 'subscribe.parentNote' : 'subscribe.note')}</p>}
    </section>
  );
}
