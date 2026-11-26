import { useCallback, useEffect, useMemo, useState } from 'react';
import { ASSISTANT_URL } from '../core/assistant';

type Hit = { path: string; title?: string; count: number; event?: boolean; stats?: { day: string; daily?: number; hourly?: number[] }[] };
type Payload = {
  days: number;
  start: string;
  end: string;
  total: { total?: number; total_events?: number; stats?: { day: string; daily?: number; hourly?: number[] }[] };
  hits: { hits?: Hit[]; total?: number; more?: boolean };
};

const number = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const date = (s: string) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(s));

export function AnalyticsPage({ token }: { token: string }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Payload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!ASSISTANT_URL) {
      setError('Сервер аналитики не подключён: проверьте переменную ASSISTANT_URL.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${ASSISTANT_URL.replace(/\/$/, '')}/admin/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
      const body = await res.json();
      if (!res.ok) {
        const messages: Record<string, string> = {
          analytics_not_configured: 'Осталось подключить ключ GoatCounter в GitHub Secrets (GOATCOUNTER_API_KEY), затем повторно опубликовать Worker.',
          github_token_invalid: 'GitHub-токен истёк или недействителен. Выйдите и войдите в админку снова.',
          admin_access_denied: 'У этого GitHub-токена нет права записи в репозиторий TeacherRG/Niflaot.',
          goatcounter_api_error: `GoatCounter вернул ошибку (${body.status ?? 'неизвестный статус'}). Проверьте права API-ключа.`,
        };
        throw new Error(messages[body.error] ?? body.error ?? `Ошибка сервера: ${res.status}`);
      }
      setData(body as Payload);
    } catch (e) {
      setError((e as Error).message || 'Не удалось загрузить статистику.');
    } finally {
      setBusy(false);
    }
  }, [days, token]);

  useEffect(() => { void load(); }, [load]);

  const daily = useMemo(() => {
    const values = data?.total?.stats ?? [];
    return values.map((x) => ({ day: x.day, count: x.daily ?? x.hourly?.reduce((a, b) => a + b, 0) ?? 0 }));
  }, [data]);
  const maxDaily = Math.max(1, ...daily.map((x) => x.count));
  const events = (data?.hits?.hits ?? []).filter((x) => x.event).sort((a, b) => b.count - a.count);
  const pages = (data?.hits?.hits ?? []).filter((x) => !x.event).sort((a, b) => b.count - a.count).slice(0, 10);
  const totalSessions = Math.max(0, (data?.total?.total ?? 0) - (data?.total?.total_events ?? 0));

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Статистика Нифлаот</h1>
        <a href="#/admin">← В административный центр</a>
      </header>

      <section className="admin-publish">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h2>Аналитика посещений и обучения</h2>
            <p>Данные GoatCounter. Сессии — не уникальные люди; события обучения считаются отдельно.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select aria-label="Период статистики" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>7 дней</option><option value={30}>30 дней</option><option value={90}>90 дней</option>
            </select>
            <button className="btn" onClick={() => void load()} disabled={busy}>{busy ? 'Обновляю…' : 'Обновить'}</button>
          </div>
        </div>
        {data && <p className="admin-status">Период: {date(data.start)} — {date(data.end)} · обновляется при открытии страницы</p>}
        {error && <p className="admin-error">{error}</p>}
        {!data && busy && <p>Загружаю статистику…</p>}
      </section>

      {data && <>
        <section className="admin-fields">
          <div className="admin-field"><h3>Сессии посетителей</h3><p style={{ fontSize: 28, fontWeight: 700 }}>{number(totalSessions)}</p><p>Оценка сессий, не число людей</p></div>
          <div className="admin-field"><h3>События обучения</h3><p style={{ fontSize: 28, fontWeight: 700 }}>{number(data.total?.total_events ?? 0)}</p><p>Включая старты и завершения уроков</p></div>
          <div className="admin-field"><h3>Всего записей</h3><p style={{ fontSize: 28, fontWeight: 700 }}>{number(data.total?.total ?? 0)}</p><p>Сессии и события вместе</p></div>
        </section>

        <section className="admin-fields">
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <h3>Динамика по дням</h3>
            {daily.length ? <div style={{ display: 'flex', alignItems: 'end', gap: 3, minHeight: 150, paddingTop: 12 }}>
              {daily.map((x) => <div key={x.day} title={`${date(x.day)}: ${number(x.count)}`} style={{ flex: 1, minWidth: 2, height: `${Math.max(3, x.count / maxDaily * 120)}px`, background: 'var(--accent, #8b6b36)', borderRadius: '3px 3px 0 0' }} />)}
            </div> : <p>Пока нет дневных данных за этот период.</p>}
            <p style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, opacity: .7 }}><span>{daily[0] ? date(daily[0].day) : ''}</span><span>{daily.at(-1) ? date(daily.at(-1)!.day) : ''}</span></p>
          </div>
        </section>

        <section className="admin-fields">
          <div className="admin-field">
            <h3>Популярные страницы</h3>
            {pages.length ? <ol>{pages.map((x) => <li key={x.path}>{x.title || x.path} — <strong>{number(x.count)}</strong></li>)}</ol> : <p>Нет данных.</p>}
          </div>
          <div className="admin-field">
            <h3>Учебные события</h3>
            {events.length ? <ul>{events.map((x) => <li key={x.path}>{x.title || x.path} — <strong>{number(x.count)}</strong></li>)}</ul> : <p>Пока нет событий за выбранный период.</p>}
          </div>
        </section>
      </>}

      <section className="admin-fields">
        <div className="admin-field">
          <h3>Как читать показатели</h3>
          <ul>
            <li>GoatCounter считает посетителей как сессии (приблизительно IP + браузер), а не как отдельных людей.</li>
            <li>«События обучения» — сумма событий, а не число учеников: один человек может создать несколько событий.</li>
            <li>Активные минуты — эвристическая оценка взаимодействия с видимой вкладкой, а не доказательство чтения.</li>
            <li>Реальные зарегистрированные аккаунты и возвращающихся пользователей смотрите также в разделе «Пользователи».</li>
          </ul>
          <p><a href="https://niflaot.goatcounter.com" target="_blank" rel="noopener noreferrer">Открыть полную панель GoatCounter ↗</a></p>
        </div>
      </section>
    </main>
  );
}
