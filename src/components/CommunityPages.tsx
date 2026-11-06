import { useEffect, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { classView, confirmConsent, leaders, removeFromClass, useAccount, userStats, type ClassView, type Leaders, type UserStats } from '../core/account';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

const useTitle = (title: string) => {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${title} · ${t('app.title')}`;
  }, [title, t]);
};

/** The leaderboard — only in the admin (`#/admin/leaders`, `#/admin/leaders/<class>`): everyone who agreed to be shown, or a class; points, streak, days. */
export function LeadersPage({ cls }: { cls?: string }) {
  const { t } = useI18n();
  const { me } = useAccount();
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
            {cls && <a href="#/admin/leaders">{t('leaders.all')} →</a>}
            <a href="#/admin">← Редактор текстов</a>
          </p>
        </main>
      </div>
      <Colophon />
    </>
  );
}

/**
 * «Пользователи» — only in the admin (`#/admin/users`): how many people have accounts and how many came lately.
 * Accounts are people (GoatCounter counts visits and devices). Numbers only; the admin's GitHub token signs the request.
 */
export function UsersPage({ token }: { token: string }) {
  const [data, setData] = useState<UserStats | null>(null);
  const [err, setErr] = useState('');
  useTitle('Пользователи');
  useEffect(() => {
    userStats(token).then(setData, (e) => setErr(e?.status === 403 ? 'Этот токен GitHub не даёт доступа к сводке.' : 'Не удалось загрузить сводку.'));
  }, [token]);
  const days = data ? Object.entries(data.daily).reverse() : [];
  const max = Math.max(1, ...days.map(([, d]) => d.active));
  const LANG: Record<string, string> = { ru: 'русский', en: 'English', de: 'Deutsch' };
  return (
    <>
      <div className="wrap acc">
        <header className="partners-head">
          <h1>Пользователи</h1>
          <p>Аккаунты — это люди (вход по email или Google; одно и то же на всех устройствах). Гости в пробный месяц здесь не видны — их устройства считает GoatCounter: событие «new-device».</p>
        </header>
        <main className="acc-card">
          {err && <p className="acc-err">{err}</p>}
          {!data && !err && <p className="acc-note">Загрузка…</p>}
          {data && (
            <>
              <div className="us-tiles">
                <div><b className="num">{data.total}</b><span>всего аккаунтов</span></div>
                <div><b className="num">{data.active[1]}</b><span>заходили за сутки</span></div>
                <div><b className="num">{data.active[7]}</b><span>за 7 дней</span></div>
                <div><b className="num">{data.active[30]}</b><span>за 30 дней</span></div>
              </div>
              <ul className="us-list">
                <li>Новых: за сутки — <b>{data.joined[1]}</b>, за 7 дней — <b>{data.joined[7]}</b>, за 30 дней — <b>{data.joined[30]}</b></li>
                <li>14+ — <b>{data.adults}</b>, дети с согласием родителя — <b>{data.children}</b>, ждут согласия — <b>{data.pending}</b></li>
                <li>Сохраняют прогресс на сервере — <b>{data.withProgress}</b></li>
                <li>Не закончили регистрацию (нет ника, удаляются через 7 дней) — <b>{data.unfinished}</b></li>
                <li>
                  Язык:{' '}
                  {Object.entries(data.langs)
                    .sort((a, b) => b[1] - a[1])
                    .map(([l, n]) => `${LANG[l] ?? l} — ${n}`)
                    .join(', ') || '—'}
                </li>
              </ul>
              <h2 className="us-h">По дням (30 дней)</h2>
              <p className="acc-note">«Заходили» — по последнему заходу: человек, который был и вчера, и сегодня, виден только сегодня.</p>
              <table className="us-days">
                <thead>
                  <tr><th>День</th><th>Новые</th><th>Последний заход</th></tr>
                </thead>
                <tbody>
                  {days.map(([d, v]) => (
                    <tr key={d}>
                      <td>{new Date(d).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}</td>
                      <td className="num">{v.joined || ''}</td>
                      <td>
                        <span className="us-bar" style={{ width: `${(v.active / max) * 70}%` }} />
                        <span className="num">{v.active || ''}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <p className="acc-row">
            <a href="https://niflaot.goatcounter.com" target="_blank" rel="noopener">GoatCounter ↗</a>
            <a href="#/admin">← Редактор текстов</a>
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
