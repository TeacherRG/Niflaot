import type { Lesson } from '../lessons/types';
import { LOCALES, type Locale } from '../i18n/config';
import ruUi from '../i18n/locales/ru';
import enUi from '../i18n/locales/en';
import deUi from '../i18n/locales/de';
import published from './overrides.json';

/**
 * Text edits made on the site by the admin (`#/admin`), on top of the texts in the source files.
 * `overrides.json`: `lessons.<slug>.<locale>.<path>` and `ui.<locale>.<key>` → the new string;
 * a path is the field's keys joined with "/" (`riddles/0/cond`). Applied once, before anything renders,
 * so the site, `npm run check` and the prerender all see the edited texts.
 */
export interface Overrides {
  lessons?: Record<string, Partial<Record<Locale, Record<string, string>>>>;
  ui?: Partial<Record<Locale, Record<string, string>>>;
}

const UI: Record<Locale, Record<string, unknown>> = { ru: ruUi, en: enUi, de: deUi };
const SEP = '/';

/** The source-file value of every field changed so far, by its full key (`lesson:<slug>:<locale>:<path>`, `ui:<locale>:<key>`). */
const ORIGINALS = new Map<string, string>();
let lessons: Lesson[] = [];

export const lessonKey = (slug: string, locale: Locale, path: string) => `lesson:${slug}:${locale}:${path}`;
export const uiKey = (locale: Locale, key: string) => `ui:${locale}:${key}`;

/** The object holding a field and its last key; undefined when the field doesn't exist or isn't a string. */
function locate(key: string): { obj: Record<string, unknown>; prop: string } | undefined {
  const [kind, ...rest] = key.split(':');
  let root: unknown;
  let path: string[];
  if (kind === 'lesson') {
    const [slug, locale, ...p] = rest;
    root = lessons.find((l) => l.slug === slug)?.texts[locale as Locale];
    path = p.join(':').split(SEP);
  } else {
    const [locale, ...k] = rest;
    root = UI[locale as Locale];
    path = [k.join(':')];
  }
  let obj = root as Record<string, unknown> | undefined;
  for (const p of path.slice(0, -1)) obj = obj?.[p] as Record<string, unknown> | undefined;
  const prop = path[path.length - 1];
  if (!obj || typeof obj !== 'object' || typeof obj[prop] !== 'string') return undefined;
  return { obj, prop };
}

/** Sets a text field; `null` brings back the source-file text. Returns false when there is no such text. */
export function setText(key: string, value: string | null): boolean {
  const at = locate(key);
  if (!at) return false;
  if (!ORIGINALS.has(key)) ORIGINALS.set(key, at.obj[at.prop] as string);
  at.obj[at.prop] = value ?? ORIGINALS.get(key)!;
  return true;
}

/** The text of the source files (before any edit); '' when there is no such text. */
export function originalText(key: string): string {
  if (ORIGINALS.has(key)) return ORIGINALS.get(key)!;
  const at = locate(key);
  return at ? (at.obj[at.prop] as string) : '';
}

/** Every full key of a set of overrides with its value. */
export function entries(ov: Overrides): [string, string][] {
  const out: [string, string][] = [];
  for (const [slug, byLocale] of Object.entries(ov.lessons ?? {}))
    for (const [locale, fields] of Object.entries(byLocale ?? {}))
      for (const [path, v] of Object.entries(fields ?? {})) out.push([lessonKey(slug, locale as Locale, path), v]);
  for (const [locale, fields] of Object.entries(ov.ui ?? {}))
    for (const [k, v] of Object.entries(fields ?? {})) out.push([uiKey(locale as Locale, k), v]);
  return out;
}

/** Puts a full key with its value into a set of overrides (`null` removes it). */
export function put(ov: Overrides, key: string, value: string | null) {
  const [kind, ...rest] = key.split(':');
  let fields: Record<string, string>;
  let field: string;
  if (kind === 'lesson') {
    const [slug, locale, ...p] = rest;
    const byLocale = ((ov.lessons ??= {})[slug] ??= {});
    fields = byLocale[locale as Locale] ??= {};
    field = p.join(':');
  } else {
    const [locale, ...k] = rest;
    fields = (ov.ui ??= {})[locale as Locale] ??= {};
    field = k.join(':');
  }
  if (value === null) delete fields[field];
  else fields[field] = value;
}

/** Applies a set of overrides; returns the keys that name no text (stale edits). */
export function applyOverrides(ov: Overrides): string[] {
  return entries(ov)
    .filter(([k, v]) => !setText(k, v))
    .map(([k]) => k);
}

/** Every string field of an object, with its path. */
export function stringFields(obj: unknown, prefix: string[] = []): { path: string; value: string }[] {
  if (typeof obj === 'string') return [{ path: prefix.join(SEP), value: obj }];
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj).flatMap(([k, v]) => stringFields(v, [...prefix, k]));
}

/** Edits whose fields are gone from the source files; reported by `npm run check`. */
export let staleOverrides: string[] = [];

/** Called by the lesson registry: applies the published edits. */
export function installOverrides(all: Lesson[]) {
  lessons = all;
  staleOverrides = applyOverrides(published as Overrides);
}

export const PUBLISHED = published as Overrides;
export const LOCALE_LIST = Object.keys(LOCALES) as Locale[];
