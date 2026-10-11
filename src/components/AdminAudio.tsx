import { useCallback, useEffect, useMemo, useState } from 'react';
import { ASSISTANT_URL } from '../core/assistant';
import { CYCLE, localToday } from '../core/tanakh';
import { rangeLabel, type Section } from '../core/tanakhCycle';
import { civilDate } from '../core/hebrewDate';
import {
  adminAudioList, audioType, audioUrl, clock, deleteAudio, fileDuration, uploadAudio, type AudioItem,
} from '../core/audio';

/**
 * `#/admin/audio` — «Урок дня»: the admin uploads the recording of the passage of the day («Писания»), recorded
 * on a phone or anywhere else. A recording made ahead appears on the site on its day by itself.
 */
const SECTION: Section = 'ketuvim';
/** the days shown: a week back and two months ahead */
const BACK = 7;
const AHEAD = 50;

export function AdminAudio({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const today = localToday();
  const days = useMemo(() => {
    const i = Math.max(0, CYCLE.findIndex((d) => d.date >= today));
    return CYCLE.slice(Math.max(0, i - BACK), i + AHEAD);
  }, [today]);
  const [items, setItems] = useState<Record<string, AudioItem>>({});
  const [error, setError] = useState('');

  const reload = useCallback(
    () =>
      adminAudioList(SECTION, token)
        .then((list) => {
          setItems(Object.fromEntries(list.map((a) => [a.date, a])));
          setError('');
        })
        .catch((e) => setError((e as Error).message)),
    [token],
  );
  useEffect(() => {
    if (ASSISTANT_URL) reload();
  }, [reload]);

  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Урок дня · Писания</h1>
        <a className="btn ghost" href="#/admin">
          Редактор текстов
        </a>
        <button className="btn ghost" onClick={onSignOut}>
          Выйти
        </button>
      </header>
      <details className="admin-help">
        <summary>Как это работает</summary>
        <ol>
          <li>Запишите урок к отрывку «Писаний» на телефон: диктофон, голосовое в Telegram или любая программа.</li>
          <li>Здесь, в строке нужного дня, выберите файл (mp3, m4a, ogg, webm или wav, до 95 МБ), проверьте название и нажмите «Загрузить».</li>
          <li>
            На странице «Писания» этого дня появится плеер «🎧 Урок дня». Запись на будущий день видна только здесь — на сайте она
            откроется в свой день сама. Шабат и праздники в списке не показаны: в эти дни чтения нет.
          </li>
          <li>Новая запись того же дня заменяет старую.</li>
        </ol>
      </details>
      {!ASSISTANT_URL && <p className="admin-error">Сервер сайта не подключён (переменная ASSISTANT_URL) — загрузка недоступна.</p>}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-audio">
        {days.map((d) => (
          <DayRow key={d.date} date={d.date} range={rangeLabel(SECTION, d[SECTION], 'ru')} today={d.date === today} item={items[d.date]} token={token} onChange={reload} />
        ))}
      </div>
    </main>
  );
}

function DayRow({
  date, range, today, item, token, onChange,
}: { date: string; range: string; today: boolean; item?: AudioItem; token: string; onChange: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(`Писания: ${range}`);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const upload = async () => {
    if (!file) return;
    setError('');
    setProgress(0);
    try {
      const duration = await fileDuration(file);
      await uploadAudio(SECTION, date, file, { title: title.trim() || `Писания: ${range}`, duration }, token, setProgress);
      setFile(null);
      setPreview('');
      onChange();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProgress(null);
    }
  };
  const remove = async () => {
    if (!confirm(`Удалить запись урока ${civilDate(date, 'ru')}?`)) return;
    try {
      await deleteAudio(SECTION, date, token);
      onChange();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className={`admin-audio-row${item ? ' has' : ''}${today ? ' today' : ''}`}>
      <header>
        <b>
          {civilDate(date, 'ru')}
          {today && ' · сегодня'}
        </b>
        <span>{range}</span>
        <a href={`#/${SECTION}/${date}`}>открыть на сайте</a>
      </header>
      {item && (
        <>
          <div className="admin-field-head">
            <span>
              🎧 {[item.title || 'без названия', item.duration ? clock(item.duration) : '', `${(item.size / 1048576).toFixed(1)} МБ`].filter(Boolean).join(' · ')}
            </span>
            <button className="admin-reset" onClick={remove}>
              удалить
            </button>
          </div>
          <audio controls preload="none" src={audioUrl(SECTION, item)} />
        </>
      )}
      <div className="admin-audio-form">
        <input
          type="file"
          accept="audio/*,.mp3,.m4a,.ogg,.opus,.webm,.wav"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setError('');
          }}
        />
        {file && (
          <>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Название" />
            <button className="btn" disabled={progress !== null} onClick={upload}>
              {item ? 'Заменить' : 'Загрузить'}
            </button>
          </>
        )}
      </div>
      {file && preview && (
        <>
          <audio controls preload="metadata" src={preview} />
          {!/^audio\/(mpeg|mp4|aac|ogg|webm|x-wav|wav)$/.test(audioType(file)) && (
            <p className="admin-error">Этот формат сервер не примет — нужен mp3, m4a, ogg, webm или wav.</p>
          )}
        </>
      )}
      {progress !== null && <progress value={progress} max={1} />}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
