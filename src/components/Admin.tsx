import { useEffect, useMemo, useState } from 'react';
import { LESSONS } from '../lessons';
import { LOCALES, type Locale } from '../i18n';
import ruUi from '../i18n/locales/ru';
import enUi from '../i18n/locales/en';
import deUi from '../i18n/locales/de';
import { PUBLISHED, entries, lessonKey, originalText, setText, stringFields, uiKey } from '../content';
import {
  REPO, deployState, discardDraft, getToken, loadDraft, publish, saveDraft, signIn, signOut,
  type DeployState, type Draft,
} from '../admin/github';

/**
 * `#/admin`, `#/admin/<slug>` — the admin's text editor (Russian only: it is the project owner's tool).
 * Every text of a lesson or of the interface, in every language; an edit is shown on the site at once
 * (in this browser), «Опубликовать» commits all edits and the site rebuilds in a couple of minutes.
 */
const UI_MESSAGES: Record<Locale, Record<string, unknown>> = { ru: ruUi, en: enUi, de: deUi };
const LOGIN_KEY = 'niflaot:admin-login';

const NAMES: Record<string, string> = {
  title: 'Название', hero: 'Шапка', heading: 'Заголовок', author: 'Автор', intro: 'Вступление',
  summary: 'Описание в каталоге', glossary: 'Словарь', riddles: 'Загадка', cond: 'Условие', steps: 'Шаг',
  q: 'Вопрос', hint: 'Подсказка', opts: 'Вариант', reveal: 'Ответ', h: 'Заголовок', p: 'Текст',
  lessons: 'Раздел', b: 'Текст', reflection: 'Вопрос к себе', takeaways: 'Конспект', puzzle: 'Пазл',
  pieces: 'Кусочек', meaning: 'Смысл', final: 'Итог', allSolved: 'Всё решено', memo: 'Memo', cards: 'Карточки',
  items: 'Пара', audience: 'Для кого', practice: 'Ораа ле-поаль', highlight: 'Подпись к картинке',
  caption: 'Подпись', note: 'Примечание',
};

/** `riddles/0/steps/1/q` → «Загадка 1 · Шаг 2 · Вопрос». */
const label = (path: string) =>
  path
    .split('/')
    .reduce<string[]>((out, seg) => {
      if (/^\d+$/.test(seg) && out.length) out[out.length - 1] += ` ${Number(seg) + 1}`;
      else out.push(NAMES[seg] ?? seg);
      return out;
    }, [])
    .join(' · ');

const isHtml = (s: string) => /<[a-z][^>]*>/i.test(s);

export function Admin({ slug }: { slug?: string }) {
  const [token, setToken] = useState(getToken);
  const [login, setLogin] = useState(() => {
    try {
      return localStorage.getItem(LOGIN_KEY) ?? '';
    } catch {
      return '';
    }
  });
  if (!token)
    return (
      <SignIn
        onDone={(t, l) => {
          try {
            localStorage.setItem(LOGIN_KEY, l);
          } catch {}
          setLogin(l);
          setToken(t);
        }}
      />
    );
  return (
    <Editor
      slug={slug}
      login={login}
      onSignOut={() => {
        signOut();
        setToken(null);
      }}
    />
  );
}

function SignIn({ onDone }: { onDone: (token: string, login: string) => void }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const t = value.trim();
      onDone(t, await signIn(t));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="admin">
      <h1>Вход для администратора</h1>
      <form className="admin-login" onSubmit={submit}>
        <label>
          GitHub-токен
          <input
            type="password"
            autoComplete="current-password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github_pat_…"
          />
        </label>
        <button className="btn" disabled={busy || !value.trim()}>
          {busy ? 'Проверяю…' : 'Войти'}
        </button>
        {error && <p className="admin-error">{error}</p>}
      </form>
      <details className="admin-help">
        <summary>Где взять токен</summary>
        <ol>
          <li>
            GitHub → Settings → Developer settings → Personal access tokens →{' '}
            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">
              Fine-grained tokens → Generate new token
            </a>
            .
          </li>
          <li>Repository access: Only select repositories → {REPO}.</li>
          <li>Permissions: Contents — Read and write; Actions — Read-only (чтобы видеть ход публикации).</li>
          <li>Скопируйте токен сюда. Он хранится только в этом браузере; «Выйти» его стирает.</li>
        </ol>
      </details>
    </main>
  );
}

interface Field {
  key: string;
  path: string;
  value: string;
}

function Editor({ slug, login, onSignOut }: { slug?: string; login: string; onSignOut: () => void }) {
  const [section, setSection] = useState(slug && LESSONS.some((l) => l.slug === slug) ? slug : LESSONS[0].slug);
  const [locale, setLocale] = useState<Locale>('ru');
  const [filter, setFilter] = useState('');
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [status, setStatus] = useState<{ text: string; url?: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [commit, setCommit] = useState<string | null>(null);
  const publishedKeys = useMemo(() => new Set(entries(PUBLISHED).map(([k]) => k)), []);

  const fields: Field[] = useMemo(() => {
    if (section === 'ui')
      return Object.entries(UI_MESSAGES[locale])
        .filter(([, v]) => typeof v === 'string')
        .map(([k, v]) => ({ key: uiKey(locale, k), path: k, value: v as string }));
    const text = LESSONS.find((l) => l.slug === section)?.texts[locale];
    return stringFields(text).map(({ path, value }) => ({ key: lessonKey(section, locale, path), path, value }));
    // `draft` is a dependency: the values are read from the (edited) lesson objects
  }, [section, locale, draft]);

  const q = filter.trim().toLowerCase();
  const shown = fields.filter(
    (f) =>
      (!onlyChanged || f.key in draft || publishedKeys.has(f.key)) &&
      (!q || f.value.toLowerCase().includes(q) || label(f.path).toLowerCase().includes(q) || f.path.includes(q)),
  );

  const edit = (key: string, value: string) => {
    const original = originalText(key);
    const next = { ...draft };
    // back to the source text: an unpublished edit just goes, a published one is removed on publishing
    if (value === original) {
      if (publishedKeys.has(key)) next[key] = null;
      else delete next[key];
    } else next[key] = value;
    setText(key, value === original ? null : value);
    saveDraft(next);
    setDraft(next);
  };

  // follow the deploy of the published commit
  useEffect(() => {
    if (!commit) return;
    let stop = false;
    const texts: Record<DeployState, string> = {
      waiting: 'Сохранено. Сборка сайта скоро начнётся…',
      running: 'Сохранено. Сайт собирается (1–3 минуты)…',
      done: 'Готово: правки на сайте. Обновите страницу у читателей — и они увидят новый текст.',
      failed: 'Сборка не прошла: проверка нашла ошибку в тексте. Откройте журнал сборки.',
    };
    const tick = async () => {
      try {
        const { state, url } = await deployState(commit);
        if (stop) return;
        setStatus({ text: texts[state], url, error: state === 'failed' });
        if (state === 'done' || state === 'failed') return;
      } catch {
        // a token without Actions access: just say where to look
        if (!stop) setStatus({ text: texts.waiting, url: `https://github.com/${REPO}/actions` });
      }
      if (!stop) setTimeout(tick, 10000);
    };
    tick();
    return () => {
      stop = true;
    };
  }, [commit]);

  const count = Object.keys(draft).length;
  const doPublish = async () => {
    setBusy(true);
    setStatus({ text: 'Публикую…' });
    try {
      const sha = await publish(draft, login);
      saveDraft({});
      setDraft({});
      setCommit(sha);
    } catch (err) {
      setStatus({ text: (err as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };
  const doDiscard = () => {
    if (!confirm(`Отменить ${count} неопубликованных правок?`)) return;
    discardDraft(PUBLISHED);
    setDraft({});
  };

  const viewHref = section === 'ui' ? '#/' : `#/${section}`;
  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Редактор текстов</h1>
        <span className="admin-who">{login && `@${login} · `}</span>
        <button className="btn ghost" onClick={onSignOut}>
          Выйти
        </button>
      </header>

      <div className="admin-bar">
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          {LESSONS.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.texts.ru?.title ?? l.slug}
            </option>
          ))}
          <option value="ui">Интерфейс сайта</option>
        </select>
        <div className="admin-langs" role="tablist">
          {(Object.keys(LOCALES) as Locale[]).map((l) => (
            <button key={l} className={l === locale ? 'on' : ''} onClick={() => setLocale(l)}>
              {LOCALES[l].short}
            </button>
          ))}
        </div>
        <input type="search" placeholder="Поиск по тексту" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <label className="admin-only">
          <input type="checkbox" checked={onlyChanged} onChange={(e) => setOnlyChanged(e.target.checked)} /> только
          изменённые
        </label>
        <a className="btn ghost" href={viewHref}>
          Посмотреть на сайте
        </a>
      </div>

      <div className="admin-publish">
        <span>{count ? `Неопубликованных правок: ${count}` : 'Все правки опубликованы'}</span>
        <button className="btn" disabled={!count || busy} onClick={doPublish}>
          Опубликовать
        </button>
        <button className="btn ghost" disabled={!count || busy} onClick={doDiscard}>
          Отменить правки
        </button>
        {status && (
          <p className={status.error ? 'admin-error' : 'admin-status'}>
            {status.text}{' '}
            {status.url && (
              <a href={status.url} target="_blank" rel="noopener">
                журнал сборки
              </a>
            )}
          </p>
        )}
      </div>

      <div className="admin-fields">
        {shown.map((f) => (
          <FieldEditor
            key={f.key}
            field={f}
            state={f.key in draft ? 'draft' : publishedKeys.has(f.key) ? 'published' : ''}
            onChange={(v) => edit(f.key, v)}
          />
        ))}
        {!shown.length && <p>Ничего не найдено.</p>}
      </div>
    </main>
  );
}

function FieldEditor({ field, state, onChange }: { field: Field; state: string; onChange: (v: string) => void }) {
  const original = originalText(field.key);
  const html = isHtml(field.value) || isHtml(original);
  const rows = Math.min(16, Math.max(1, Math.ceil(field.value.length / 90) + (field.value.match(/\n/g)?.length ?? 0)));
  return (
    <div className={`admin-field ${state}`}>
      <div className="admin-field-head">
        <b>{label(field.path)}</b>
        {html && <span className="admin-tag">HTML</span>}
        {state === 'draft' && <span className="admin-tag draft">черновик</span>}
        {state === 'published' && <span className="admin-tag">изменено на сайте</span>}
        {field.value !== original && (
          <button className="admin-reset" onClick={() => onChange(original)} title={original}>
            вернуть исходный текст
          </button>
        )}
      </div>
      <textarea value={field.value} rows={rows} dir="auto" onChange={(e) => onChange(e.target.value)} />
      {html && <div className="admin-preview" dangerouslySetInnerHTML={{ __html: field.value }} />}
    </div>
  );
}
