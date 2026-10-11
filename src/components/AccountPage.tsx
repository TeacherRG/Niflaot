import { useEffect, useState, type FormEvent } from 'react';
import { Html, useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import {
  AccountError,
  createClass,
  deleteAccount,
  joinClass,
  leaveClass,
  loadConfig,
  login,
  logout,
  refreshMe,
  resendConsent,
  saveProfile,
  sendCode,
  useAccount,
} from '../core/account';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

/** the server's error code → the text for the player */
function useErr() {
  const { t } = useI18n();
  return (e: unknown) => {
    const code = e instanceof AccountError ? e.code : 'failed';
    const key = `acc.err.${code}` as MessageKey;
    const s = t(key);
    return s === key ? t('acc.err.failed') : s;
  };
}

/** a form action with «busy» and an error line */
function useAction() {
  const errText = useErr();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const run = async (f: () => Promise<unknown>) => {
    setBusy(true);
    setErr('');
    try {
      await f();
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(false);
    }
  };
  return { busy, err, setErr, run };
}

/** Guest: what an account gives; email → the 6-digit code → signed in. */
function SignIn() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const { busy, err, run } = useAction();

  const ask = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await sendCode(email.trim(), locale);
      setSent(true);
    });
  };
  const enter = (e: FormEvent) => {
    e.preventDefault();
    run(() => login(email.trim(), code, locale));
  };

  return (
    <section className="acc-card">
      <h2>👤 {t('acc.guest')}</h2>
      <p>{t('acc.guestLead')}</p>
      <Html as="div" className="prose" html={t('acc.benefits')} />
      {!sent ? (
        <form className="acc-form" onSubmit={ask}>
          <label>
            {t('acc.email')}
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button className="btn" disabled={busy}>
            {t('acc.sendCode')}
          </button>
        </form>
      ) : (
        <form className="acc-form" onSubmit={enter}>
          <p className="acc-note">{t('acc.codeSent', { email })}</p>
          <label>
            {t('acc.code')}
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]{6,7}"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="btn" disabled={busy}>
            {t('acc.login')}
          </button>
          <button type="button" className="link-btn" onClick={() => setSent(false)}>
            {t('acc.otherEmail')}
          </button>
        </form>
      )}
      {err && <p className="acc-err" role="alert">{err}</p>}
      <p>
        <a href="#/">← {t('acc.guestGo')}</a>
      </p>
    </section>
  );
}

/** Nickname, age group (once), a parent's email for a child, the leaderboard choice, the privacy policy. */
function ProfileForm({ first }: { first: boolean }) {
  const { t, locale } = useI18n();
  const { me } = useAccount();
  const u = me!.user;
  const [nick, setNick] = useState(u.nick ?? '');
  const [age, setAge] = useState<'adult' | 'child' | null>(u.age);
  const [parent, setParent] = useState(u.parentEmail ?? '');
  const [board, setBoard] = useState(u.board);
  const [agree, setAgree] = useState(!first);
  const { busy, err, setErr, run } = useAction();

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!age) return setErr(t('acc.err.age'));
    if (!agree) return setErr(t('acc.err.agree'));
    run(async () => {
      const me = await saveProfile({ nick, age, parentEmail: age === 'child' ? parent : undefined, board, lang: locale });
      // saved: the profile closes (a child waiting for the parent's consent stays — the page says what to do next)
      if (me.user.active) location.hash = '#/';
    });
  };

  return (
    <form className="acc-form" onSubmit={save}>
      <label>
        {t('acc.nick')}
        <input required minLength={3} maxLength={20} autoComplete="nickname" value={nick} onChange={(e) => setNick(e.target.value)} />
        <small>{t('acc.nickHint')}</small>
      </label>
      {!u.age && (
        <fieldset>
          <legend>{t('acc.age')}</legend>
          <label className="acc-radio">
            <input type="radio" name="age" checked={age === 'adult'} onChange={() => (setAge('adult'), setBoard(true))} /> {t('acc.adult')}
          </label>
          <label className="acc-radio">
            {/* a child is not on the public board unless chosen (data minimisation for children) */}
            <input type="radio" name="age" checked={age === 'child'} onChange={() => (setAge('child'), setBoard(false))} /> {t('acc.child')}
          </label>
        </fieldset>
      )}
      {age === 'child' && !u.parentOk && (
        <label>
          {t('acc.parent')}
          <input type="email" required value={parent} onChange={(e) => setParent(e.target.value)} />
          <small>{t('acc.parentHint')}</small>
        </label>
      )}
      <label className="acc-check">
        <input type="checkbox" checked={board} onChange={(e) => setBoard(e.target.checked)} /> {t('acc.board')}
      </label>
      {first && (
        <label className="acc-check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> <Html as="span" html={t('acc.agree')} />
        </label>
      )}
      <button className="btn" disabled={busy}>
        {t('acc.save')}
      </button>
      {err && <p className="acc-err" role="alert">{err}</p>}
    </form>
  );
}

/** A child's account before the parent's consent. */
function Pending() {
  const { t } = useI18n();
  const { me } = useAccount();
  const [note, setNote] = useState('');
  const { busy, err, run } = useAction();
  return (
    <section className="acc-card">
      <h2>⏳ {t('acc.pending')}</h2>
      <p>{t('acc.pendingLead', { email: me!.user.parentEmail ?? '' })}</p>
      <div className="acc-row">
        <button className="btn" disabled={busy} onClick={() => run(async () => (await refreshMe(), setNote('')))}>
          {t('acc.check')}
        </button>
        <button className="btn ghost" disabled={busy} onClick={() => run(async () => (await resendConsent(), setNote(t('acc.resent'))))}>
          {t('acc.resend')}
        </button>
      </div>
      {note && <p className="acc-note">{note}</p>}
      {err && <p className="acc-err" role="alert">{err}</p>}
    </section>
  );
}

function Classes() {
  const { t } = useI18n();
  const { me } = useAccount();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const { busy, err, run } = useAction();
  const classes = me!.classes;
  return (
    <section className="acc-card">
      <h2>🏫 {t('acc.classes')}</h2>
      {classes.length ? (
        <ul className="acc-classes">
          {classes.map((c) => (
            <li key={c.id}>
              <b>{c.name}</b>
              {c.teacher && <span className="acc-note"> — {t('acc.teacherOf', { code: c.code ?? '' })}</span>}
              <span className="acc-row">
                {c.teacher && <a href={`#/class/${c.id}`}>{t('acc.open')} →</a>}
                <a href={`#/leaders/${c.id}`}>{t('leaders.title')} →</a>
                <button className="link-btn" disabled={busy} onClick={() => run(() => leaveClass(c.id))}>
                  {t(c.teacher ? 'acc.closeClass' : 'acc.leave')}
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="acc-note">{t('acc.noClasses')}</p>
      )}
      <form
        className="acc-form acc-inline"
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => (await joinClass(code), setCode('')));
        }}
      >
        <input aria-label={t('acc.join')} placeholder={t('acc.join')} value={code} onChange={(e) => setCode(e.target.value)} required maxLength={8} />
        <button className="btn ghost" disabled={busy}>
          {t('acc.joinBtn')}
        </button>
      </form>
      {me!.user.age === 'adult' && (
        <form
          className="acc-form acc-inline"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => (await createClass(name), setName('')));
          }}
        >
          <input aria-label={t('acc.create')} placeholder={t('acc.create')} value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
          <button className="btn ghost" disabled={busy}>
            {t('acc.createBtn')}
          </button>
        </form>
      )}
      {err && <p className="acc-err" role="alert">{err}</p>}
    </section>
  );
}

/** «Классы» are hidden for now (the server and `#/class/<id>` stay); true brings the section back to the profile. */
const SHOW_CLASSES = false;

/** `#/account`: guest mode and sign-in, the profile, the parent's consent, classes, sign out, delete. */
export function AccountPage() {
  const { t } = useI18n();
  const { token, me, mail } = useAccount();
  const { busy, err, run } = useAction();

  useEffect(() => {
    document.title = `${t('acc.title')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    loadConfig();
    if (token) refreshMe().catch(() => {});
  }, [token]);

  const u = me?.user;
  return (
    <>
      <TopBar title={t('acc.title')} />
      <div className="wrap acc">
        <header className="partners-head">
          <h1>{u?.nick ?? t('acc.title')}</h1>
          {u && <p>{u.email}</p>}
        </header>
        <main>
          {!token && mail === false && (
            <section className="acc-card">
              <h2>👤 {t('acc.guest')}</h2>
              <p>{t('acc.off')}</p>
            </section>
          )}
          {!token && mail && <SignIn />}
          {token && u && !u.nick && (
            <section className="acc-card">
              <h2>{t('acc.profile')}</h2>
              <ProfileForm first />
            </section>
          )}
          {token && u?.nick && !u.active && <Pending />}
          {token && u?.active && (
            <>
              <section className="acc-card">
                <p className="acc-ok">✓ {t('acc.synced')}</p>
                <p className="acc-note">{t('acc.ai', { today: me!.ai.today, total: me!.ai.total })}</p>
                <p>
                  <a href="#/leaders">🏆 {t('leaders.title')} →</a>
                </p>
              </section>
              {SHOW_CLASSES && <Classes />}
              <section className="acc-card">
                <h2>{t('acc.profile')}</h2>
                <ProfileForm first={false} />
              </section>
            </>
          )}
          {token && (
            <section className="acc-card acc-row">
              <button className="btn ghost" disabled={busy} onClick={() => run(logout)}>
                {t('acc.logout')}
              </button>
              <button className="link-btn acc-danger" disabled={busy} onClick={() => confirm(t('acc.deleteConfirm')) && run(deleteAccount)}>
                {t('acc.delete')}
              </button>
            </section>
          )}
          {err && <p className="acc-err" role="alert">{err}</p>}
          <p className="acc-note">
            <a href="#/privacy">{t('privacy.title')}</a>
          </p>
        </main>
      </div>
      <Colophon />
    </>
  );
}
