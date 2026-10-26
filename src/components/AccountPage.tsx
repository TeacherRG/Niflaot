import { useEffect, useState, type FormEvent } from 'react';
import { Html, useI18n } from '../i18n';
import { MODES, savedMode, setMode, useMode } from '../core/mode';
import { HEBREW_LEVELS, savedHebrewLevel, setHebrewLevel, useHebrewLevel } from '../core/hebrewLevel';
import { BGS, SIZES, THEMES, setLook, useLook } from '../core/look';
import { COURSES, PACES, coursesChosen, setCourses, useCourses } from '../core/courses';
import { BookProgress } from './BookProgress';
import { DailyReminder } from './DailyReminder';
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
  syncNow,
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
      {/* the leaderboard is in the admin for now (#/admin/leaders); true brings the choice back to the profile */}
      {SHOW_BOARD && (
        <label className="acc-check">
          <input type="checkbox" checked={board} onChange={(e) => setBoard(e.target.checked)} /> {t('acc.board')}
        </label>
      )}
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

/** Whether the progress reached the account: the last exchange of this tab, and «Синхронизировать сейчас». */
function SyncLine() {
  const { t, locale } = useI18n();
  const { sync } = useAccount();
  const { busy, run } = useAction();
  const time = sync && new Date(sync.at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return (
    <>
      {sync && !sync.ok ? (
        <p className="acc-err" role="status">
          {t('acc.syncFailed', { time: time! })}
        </p>
      ) : (
        <p className="acc-ok">
          ✓ {t('acc.synced')}
          {sync && ` ${t('acc.syncedAt', { time: time! })}`}
        </p>
      )}
      <button className="link-btn" disabled={busy} onClick={() => run(syncNow)}>
        {t('acc.syncNow')}
      </button>
    </>
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

/** The public leaderboard is hidden: only the admin sees it (`#/admin/leaders`). */
const SHOW_BOARD = false;

/**
 * The onboarding answers (ModePicker.tsx), switched here right away: the site's mode (src/core/mode.ts) — who is
 * learning, the Hebrew level (src/core/hebrewLevel.ts) and the courses (src/core/courses.ts); kept on the device and in the account.
 */
const close = (e: { currentTarget: HTMLElement }) => e.currentTarget.closest('details')?.removeAttribute('open');

function ModeCard() {
  const { t } = useI18n();
  const mode = useMode();
  const level = useHebrewLevel();
  // an answer already given is one line with «Изменить»; the choices open on a tap (and stay open while unanswered)
  const modeSet = savedMode() !== null;
  const levelSet = savedHebrewLevel() !== null;
  return (
    <section className="acc-card">
      <h2>{t('acc.settings')}</h2>
      <details className="acc-pick" open={!modeSet}>
        <summary>
          <span className="acc-pick-q">{t('mode.title')}</span>
          {modeSet && <b>{t(`mode.${mode}`)}</b>}
          <span className="acc-pick-edit">{t('acc.change')}</span>
        </summary>
        <div className="acc-modes" role="radiogroup" aria-label={t('mode.menu')}>
          {MODES.map((m) => (
            <button key={m} role="radio" aria-checked={modeSet && mode === m} className={`acc-mode${modeSet && mode === m ? ' on' : ''}`} onClick={(e) => (setMode(m), close(e))}>
              <b>{t(`mode.${m}`)}</b>
              <small>{t(`mode.${m}Sub`)}</small>
            </button>
          ))}
        </div>
      </details>
      <details className="acc-pick" open={!levelSet}>
        <summary>
          <span className="acc-pick-q" id="acc-hb">{t('hebrew.q')}</span>
          {levelSet && <b>{t(`hebrew.${level}`)}</b>}
          <span className="acc-pick-edit">{t('acc.change')}</span>
        </summary>
        <div className="acc-modes" role="radiogroup" aria-labelledby="acc-hb">
          {HEBREW_LEVELS.map((l) => (
            <button key={l} role="radio" aria-checked={levelSet && level === l} className={`acc-mode${levelSet && level === l ? ' on' : ''}`} onClick={(e) => (setHebrewLevel(l), close(e))}>
              <b>{t(`hebrew.${l}`)}</b>
              <small>{t(`hebrew.${l}.sub`)}</small>
            </button>
          ))}
        </div>
      </details>
      <CoursesPicker />
      <LookPicker />
    </section>
  );
}

/**
 * «Что вы хотите учить?» (src/core/courses.ts): the courses besides the weekly Torah portion, ticked on and off at once,
 * and the pace of the Prophets and Writings; the answer — one line, the choices under «Изменить».
 */
function CoursesPicker() {
  const { t } = useI18n();
  const { c, pace } = useCourses(useMode());
  const chosen = coursesChosen();
  return (
    <details className="acc-pick" open={!chosen}>
      <summary>
        <span className="acc-pick-q" id="acc-courses">{t('courses.q')}</span>
        {chosen && <b>{c.length ? c.map((x) => t(`courses.${x}`)).join(', ') : t('courses.none')}</b>}
        <span className="acc-pick-edit">{t('acc.change')}</span>
      </summary>
      <p className="acc-courses-note">{t('courses.qSub')}</p>
      <div className="acc-modes" role="group" aria-labelledby="acc-courses">
        {COURSES.map((x) => {
          const on = c.includes(x);
          return (
            <button key={x} role="checkbox" aria-checked={on} className={`acc-mode${on ? ' on' : ''}`} onClick={() => setCourses({ c: on ? c.filter((y) => y !== x) : [...c, x], pace })}>
              <b>
                {on ? '✓' : '+'} {t(`courses.${x}`)}
              </b>
              <small>{t(`courses.${x}.sub`)}</small>
            </button>
          );
        })}
      </div>
      {(c.includes('neviim') || c.includes('ketuvim')) && (
        <div className="acc-modes acc-pace" role="radiogroup" aria-label={t('courses.paceQ')}>
          <span className="acc-pick-q">{t('courses.paceQ')}</span>
          {PACES.map((p) => (
            <button key={p} role="radio" aria-checked={pace === p} className={`acc-mode${pace === p ? ' on' : ''}`} onClick={() => setCourses({ c, pace: p })}>
              <b>{t(`courses.pace.${p}`)}</b>
              <small>{t(`courses.pace.${p}.sub`)}</small>
            </button>
          ))}
        </div>
      )}
    </details>
  );
}

/**
 * «Вид» (src/core/look.ts): the theme (light by default, or dark), the text size and the background — three rows of
 * buttons, applied at once; only on this device.
 */
function LookPicker() {
  const { t } = useI18n();
  const look = useLook();
  const row = <V extends string | number>(id: string, label: string, values: V[], on: V, name: (v: V) => string, pick: (v: V) => void, swatch?: boolean) => (
    <div className="acc-look-row">
      <span className="acc-pick-q" id={id}>
        {label}
      </span>
      <div className="acc-look-opts" role="radiogroup" aria-labelledby={id}>
        {values.map((v) => (
          <button key={v} type="button" role="radio" aria-checked={v === on} className={`acc-look-opt${v === on ? ' on' : ''}`} onClick={() => pick(v)}>
            {swatch && <i className={`acc-swatch sw-${look.theme}-${v}`} aria-hidden="true" />}
            {name(v)}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="acc-pick acc-look">
      <h3 className="acc-look-h">{t('look.title')}</h3>
      {row('acc-theme', t('look.theme'), THEMES, look.theme, (v) => t(`look.${v}`), (theme) => setLook({ theme }))}
      {row('acc-size', t('look.size'), SIZES, look.size, (v) => t(`look.size${v}`), (size) => setLook({ size }))}
      {row('acc-bg', t('look.bg'), BGS[look.theme], look.bg, (v) => t(`look.bg.${v}`), (bg) => setLook({ bg }), true)}
      <p className="acc-look-note">{t('look.note')}</p>
    </div>
  );
}

/** «Классы» are hidden for now (the server and `#/class/<id>` stay); true brings the section back to the profile. */
const SHOW_CLASSES = false;

/** `#/account`: guest mode and sign-in, the settings, «Напоминать каждый день», «Мой путь по книгам» (progress and milestones), the profile, the parent's consent, classes, sign out, delete. */
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
          <ModeCard />
          <section className="acc-card">
            <h2>🔔 {t('push.title')}</h2>
            <DailyReminder sheet />
          </section>
          <BookProgress />
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
                <SyncLine />
                <p className="acc-note">{t('acc.ai', { today: me!.ai.today, total: me!.ai.total })}</p>
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
