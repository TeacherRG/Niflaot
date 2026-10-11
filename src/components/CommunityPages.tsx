import { useEffect, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { classView, confirmConsent, leaders, removeFromClass, useAccount, type ClassView, type Leaders } from '../core/account';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

const useTitle = (title: string) => {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${title} · ${t('app.title')}`;
  }, [title, t]);
};

/** `#/leaders` (everyone who agreed to be shown) and `#/leaders/<class>` (a class): points, streak, days. */
export function LeadersPage({ cls }: { cls?: string }) {
  const { t } = useI18n();
  const { me, token } = useAccount();
  const [data, setData] = useState<Leaders | null>(null);
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState<keyof Leaders>('points');
  const className = cls ? me?.classes.find((c) => c.id === cls)?.name : undefined;
  useTitle(t('leaders.title'));

  useEffect(() => {
    setData(null);
    leaders(cls).then(setData, () => setErr(true));
  }, [cls]);

  const rows = data?.[tab] ?? [];
  return (
    <>
      <TopBar title={t('leaders.title')} />
      <div className="wrap acc">
        <header className="partners-head">
          <h1>🏆 {t('leaders.title')}</h1>
          {className && <p>{className}</p>}
        </header>
        <main className="acc-card">
          <div className="seg" role="tablist">
            {(['points', 'streak', 'days'] as const).map((k) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                {t(`leaders.${k}`)}
              </button>
            ))}
          </div>
          {err && <p className="acc-err">{t('acc.err.failed')}</p>}
          {data && !rows.length && <p className="acc-note">{t('leaders.empty')}</p>}
          {rows.length > 0 && (
            <ol className="leaders">
              {rows.map((r, i) => (
                <li key={r.nick} className={r.nick === me?.user.nick ? 'me' : ''}>
                  <span className="num">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
                  <span>{r.nick}</span>
                  <b className="num">{r.v}</b>
                </li>
              ))}
            </ol>
          )}
          <p className="acc-row">
            {cls && <a href="#/leaders">{t('leaders.all')} →</a>}
            {me?.classes.filter((c) => c.id !== cls).map((c) => (
              <a key={c.id} href={`#/leaders/${c.id}`}>
                {c.name} →
              </a>
            ))}
            {!token && <a href="#/account">{t('leaders.join')} →</a>}
          </p>
        </main>
      </div>
      <Colophon />
    </>
  );
}

/** `#/class/<id>` — for its teacher: the code for the students and every student's progress. */
export function ClassPage({ id }: { id: string }) {
  const { t, pick } = useI18n();
  const [data, setData] = useState<ClassView | null>(null);
  const [err, setErr] = useState(false);
  useTitle(data?.class.name ?? t('acc.classes'));
  const load = () => classView(id).then(setData, () => setErr(true));
  useEffect(() => {
    load();
  }, [id]);
  const date = (ms: number | null) => (ms ? new Date(ms).toLocaleDateString() : '—');

  return (
    <>
      <TopBar title={t('acc.classes')} />
      <div className="wrap acc">
        <header className="partners-head">
          <h1>🏫 {data?.class.name ?? '…'}</h1>
          {data && (
            <p>
              <b className="num">{t('class.code', { code: data.class.code })}</b> — {t('class.codeHint')}
            </p>
          )}
        </header>
        <main className="acc-card">
          {err && <p className="acc-err">{t('acc.err.class')}</p>}
          {data && !data.members.length && <p className="acc-note">{t('class.empty')}</p>}
          {data && data.members.length > 0 && (
            <div className="acc-table-wrap">
              <table className="acc-table">
                <thead>
                  <tr>
                    <th>{t('class.nick')}</th>
                    <th>{t('class.solved')}</th>
                    <th>{t('class.points')}</th>
                    <th>{t('class.streak')}</th>
                    <th>{t('class.last')}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.members.map((m) => (
                    <tr key={m.nick}>
                      <td>
                        <b>{m.nick}</b>
                        <small className="acc-lessons">
                          {LESSONS.filter((l) => m.lessons[l.slug]).map((l) => `${pick(l.texts).value.title}: ${m.lessons[l.slug]}/${l.riddles.length}`).join(' · ')}
                        </small>
                      </td>
                      <td className="num">{m.solved}</td>
                      <td className="num">{m.points}</td>
                      <td className="num">{m.streak}</td>
                      <td>{date(m.updated)}</td>
                      <td>
                        <button className="link-btn" onClick={() => removeFromClass(id, m.nick).then(load)}>
                          {t('class.remove')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="acc-row">
            <a href={`#/leaders/${id}`}>🏆 {t('leaders.title')} →</a>
            <a href="#/account">{t('acc.title')} →</a>
          </p>
        </main>
      </div>
      <Colophon />
    </>
  );
}

/** `#/consent/<token>` — the link in the email to a parent: what is kept, and «Разрешаю». */
export function ConsentPage({ token }: { token: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<{ nick?: string; bad?: boolean; busy?: boolean }>({});
  useTitle(t('consent.title'));
  const yes = () => {
    setState({ busy: true });
    confirmConsent(token).then(
      (r) => setState({ nick: r.nick }),
      () => setState({ bad: true }),
    );
  };
  return (
    <>
      <TopBar title={t('consent.title')} />
      <div className="wrap acc">
        <header className="partners-head">
          <h1>{t('consent.title')}</h1>
        </header>
        <main className="acc-card">
          {state.nick ? (
            <p className="acc-ok">✓ {t('consent.done', { nick: state.nick })}</p>
          ) : state.bad ? (
            <p className="acc-err">{t('consent.bad')}</p>
          ) : (
            <>
              <p>{t('consent.lead')}</p>
              <p className="acc-row">
                <button className="btn" disabled={state.busy} onClick={yes}>
                  {t('consent.yes')}
                </button>
                <a href="#/privacy">{t('privacy.title')} →</a>
              </p>
            </>
          )}
        </main>
      </div>
      <Colophon />
    </>
  );
}

/** `#/privacy` — what the site keeps, where, why and for how long. */
export function PrivacyPage() {
  const { t } = useI18n();
  useTitle(t('privacy.title'));
  return (
    <>
      <TopBar title={t('privacy.title')} />
      <div className="wrap acc">
        <header className="partners-head">
          <h1>{t('privacy.title')}</h1>
        </header>
        <Html as="main" className="prose acc-card" html={t('privacy.body')} />
      </div>
      <Colophon />
    </>
  );
}
