/**
 * The podcast «Нифлаот — уроки вслух»: where its audio lives (scripts/podcast.ts makes it, scripts/prerender.ts writes
 * the feeds dist/podcast.xml, podcast-en.xml, podcast-de.xml from the list of episodes).
 */
export const PODCAST_RELEASE = {
  tag: 'podcast',
  /** the MP3 files and episodes.json are assets of this release of the public repository */
  base: 'https://github.com/TeacherRG/Niflaot/releases/download/podcast',
  manifest: 'https://github.com/TeacherRG/Niflaot/releases/download/podcast/episodes.json',
};
/** raise it to make every episode anew (another pause, bitrate, tags); 2 — the parts with dropouts recorded again */
export const PODCAST_VERSION = 2;
/** the feed of each language */
export const PODCAST_FEEDS = { ru: 'podcast.xml', en: 'podcast-en.xml', de: 'podcast-de.xml' } as const;

export interface PodcastEpisode {
  /** the asset's name: `<lang>-<slug>-<id>.mp3` */
  file: string;
  /** the hash of the parts' hashes — the episode's text */
  id: string;
  bytes: number;
  seconds: number;
}
export type PodcastEpisodes = Partial<Record<'ru' | 'en' | 'de', Record<string, PodcastEpisode>>>;

/** an episode's name: «Бааль ґа-Турим: Ноах» names the portion itself, «Выйди из ковчега» gets it in front */
export const episodeTitle = (title: string, parsha: string) => (title.includes(':') ? title : `${parsha} · ${title}`);
