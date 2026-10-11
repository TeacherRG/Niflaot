import { ASSISTANT_URL } from './assistant';
import type { Section } from './tanakhCycle';

/**
 * «Урок дня» — the recorded lesson of the passage of the day (for now: «Писания»). The recordings live on the server
 * of the site (`assistant/src/audio.ts`, Cloudflare R2); the admin uploads them from `#/admin/audio`.
 * Without ASSISTANT_URL, or while the server has no recordings, there is no player.
 */
export const AUDIO_SECTIONS: Section[] = ['ketuvim'];

export interface AudioItem {
  date: string;
  title: string;
  /** seconds; 0 — unknown */
  duration: number;
  type: string;
  size: number;
  /** version: a new recording of the day gets a new link */
  v: string;
}

const lists = new Map<Section, Promise<AudioItem[]>>();

/** The recordings of a section (only the days that have come). One request per page load. */
export function audioList(section: Section): Promise<AudioItem[]> {
  if (!ASSISTANT_URL || !AUDIO_SECTIONS.includes(section)) return Promise.resolve([]);
  let p = lists.get(section);
  if (!p) {
    p = fetch(`${ASSISTANT_URL}/audio/list/${section}`)
      .then((r) => (r.ok ? (r.json() as Promise<AudioItem[]>) : []))
      .catch(() => []);
    lists.set(section, p);
  }
  return p;
}

export const audioUrl = (section: Section, a: Pick<AudioItem, 'date' | 'v'>) =>
  `${ASSISTANT_URL}/audio/file/${section}/${a.date}?v=${a.v}`;

/** 754 → «12:34», 3754 → «1:02:34» */
export function clock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/* ───── the admin's side ───── */

async function admin(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(`${ASSISTANT_URL}/audio/${path}`, {
    ...init,
    headers: { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 403) throw new Error('Сервер не принял токен: нужен токен с правом записи в репозиторий');
  if (res.status === 404 && path.startsWith('list/')) throw new Error('На сервере нет хранилища записей (R2) — см. assistant/wrangler.toml');
  if (!res.ok) throw new Error(`Сервер: ${res.status} ${await res.text().catch(() => '')}`);
  return res.json();
}

/** All the recordings of a section, the coming days too. */
export const adminAudioList = (section: Section, token: string) => admin(`list/${section}`, token) as Promise<AudioItem[]>;

export const deleteAudio = (section: Section, date: string, token: string) =>
  admin(`file/${section}/${date}`, token, { method: 'DELETE' });

/** Uploads a recording; XMLHttpRequest — for the progress bar. */
export function uploadAudio(
  section: Section,
  date: string,
  file: File,
  meta: { title: string; duration: number },
  token: string,
  onProgress: (part: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open('PUT', `${ASSISTANT_URL}/audio/file/${section}/${date}`);
    x.setRequestHeader('Authorization', `Bearer ${token}`);
    x.setRequestHeader('Content-Type', audioType(file));
    x.setRequestHeader('X-Title', encodeURIComponent(meta.title));
    x.setRequestHeader('X-Duration', String(Math.round(meta.duration)));
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    x.onload = () =>
      x.status < 300
        ? resolve()
        : reject(
            new Error(
              x.status === 403
                ? 'Сервер не принял токен'
                : x.status === 415
                  ? 'Этот формат не подходит: нужен mp3, m4a, ogg, webm или wav'
                  : x.status === 413
                    ? 'Файл слишком большой (до 95 МБ)'
                    : `Сервер: ${x.status}`,
            ),
          );
    x.onerror = () => reject(new Error('Нет связи с сервером'));
    x.send(file);
  });
}

/** The file's type; phones often leave it empty or odd — then by the extension. */
export function audioType(file: File): string {
  const t = file.type.toLowerCase();
  if (t.startsWith('audio/') && t !== 'audio/x-m4a') return t === 'audio/mp3' ? 'audio/mpeg' : t;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return { mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', webm: 'audio/webm', wav: 'audio/wav' }[ext ?? ''] ?? (t === 'audio/x-m4a' ? 'audio/mp4' : t);
}

/** The length of a local file, seconds (0 — the browser can't tell). */
export function fileDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const a = new Audio();
    const url = URL.createObjectURL(file);
    const done = (d: number) => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) ? d : 0);
    };
    a.preload = 'metadata';
    a.onloadedmetadata = () => done(a.duration);
    a.onerror = () => done(0);
    a.src = url;
  });
}
