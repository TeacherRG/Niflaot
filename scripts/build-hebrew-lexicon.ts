import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { normalizeHebrew, validateHebrewLexicon, type HebrewLexeme, type HebrewLexicon, type PartOfSpeech } from '../src/core/hebrewLexicon';

const root = process.cwd();
const readJson = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(root, file), 'utf8')) as T;
const vocalKey = (s: string) => s.normalize('NFD').replace(/[\u0591-\u05AF\u05BC-\u05C7]/g, '').replace(/[^\u05D0-\u05EA]/g, '');
const cleanVocalized = (s: string) => s.normalize('NFD').replace(/[\u0591-\u05AF]/g, '').normalize('NFC').trim();
const stableId = (prefix: string, value: string) => `${prefix}:${createHash('sha256').update(value).digest('hex').slice(0, 16)}`;

const [tanakh, ru, en, de] = await Promise.all([
  readJson<{ words: Array<{ id: string; he: string; pos: string; n: number; root?: string; aram?: number; inf?: string; infType?: 'infinitive-construct' | 'infinitive-absolute' }>; total: number }>('src/tanakh/words.json'),
  readJson<Record<string, string>>('src/tanakh/words/ru.json'),
  readJson<Record<string, string>>('src/tanakh/words/en.json'),
  readJson<Record<string, string>>('src/tanakh/words/de.json'),
]);

const entries: HebrewLexeme[] = [];
const legacy: Record<string, string[]> = {};

const pos = (raw: string): PartOfSpeech => {
  const p = raw.split(/\s+/);
  if (p.includes('v')) return 'verb';
  if (p.includes('np')) return 'proper-noun';
  if (p.some(x => x.startsWith('n'))) return 'noun';
  if (p.includes('a')) return 'adjective';
  if (p.includes('adv')) return 'adverb';
  if (p.includes('p')) return 'pronoun';
  if (p.includes('prep')) return 'preposition';
  if (p.includes('conj')) return 'conjunction';
  if (p.includes('i')) return 'interjection';
  if (p.includes('d')) return 'particle';
  if (p.includes('prt') || p.includes('r') || p.includes('dp')) return 'particle';
  return 'unknown';
};

for (const w of tanakh.words) {
  const translations = {
    ...(ru[w.id] ? { ru: [ru[w.id]] } : {}),
    ...(en[w.id] ? { en: [en[w.id]] } : {}),
    ...(de[w.id] ? { de: [de[w.id]] } : {}),
  };
  if (!Object.keys(translations).length) continue;
  const id = `tanakh:strong:${w.id}`;
  const isVerb = pos(w.pos) === 'verb';
  const infinitive = w.inf;
  const headword = isVerb && infinitive
    ? { vocalized: infinitive, normalized: normalizeHebrew(infinitive), verbalForm: w.infType ?? 'unverified' as const }
    : isVerb
      ? { vocalized: w.he, normalized: normalizeHebrew(w.he), verbalForm: 'unverified' as const }
      : { vocalized: w.he, normalized: normalizeHebrew(w.he) };
  const entry: HebrewLexeme = {
    id: id as HebrewLexeme['id'],
    headword,
    partOfSpeech: pos(w.pos),
    ...(w.root ? { root: w.root } : {}),
    corpusStats: { tanakh: { frequency: w.n } },
    senses: [{ id: `${id}:sense:1`, translations }],
    // Strong's headword is dictionary evidence, not a corpus-attested token form.
    forms: [],
    occurrences: [],
    sources: [
      { name: 'Open Scriptures Hebrew Bible', license: 'CC BY 4.0', url: 'https://github.com/openscriptures/morphhb' },
      { name: 'Strong’s Hebrew Dictionary / Brown–Driver–Briggs', license: 'Public Domain' },
    ],
    status: isVerb && (!infinitive || !w.infType) ? 'review' : 'verified',
  };
  entries.push(entry);
  legacy[`tanakh:${w.id}`] = [id];
}

const rambamFiles = ['src/rambam/words/ru-1.txt', 'src/rambam/words/ru-2.txt', 'src/rambam/words/ru-3.txt'];
const rambamRows = new Map<string, { surface: string; translation: string; lemma: string; file: string; line: number }>();
for (const file of rambamFiles) {
  const body = await readFile(path.join(root, file), 'utf8');
  body.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim() || line.startsWith('#')) return;
    const parts = line.split('|');
    if (parts.length !== 3 || !parts[1].trim()) throw new Error(`${file}:${index + 1}: expected surface|translation|lemma`);
    const surface = parts[0].trim();
    const lemma = parts[2].trim() || surface;
    const key = `${cleanVocalized(surface)}|ru|${parts[1].trim()}`;
    rambamRows.set(key, { surface, translation: parts[1].trim(), lemma, file, line: index + 1 });
  });
}

const lexiconRu = new Map<string, string>();
for (const line of (await readFile(path.join(root, 'src/rambam/words/lexicon-ru.txt'), 'utf8')).split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [he, translation] = line.split('|');
  if (he && translation) lexiconRu.set(cleanVocalized(he), translation.trim());
}


type Term = { title: string; definition: string };
const terms = new Map<string, Term>();
for (const line of (await readFile(path.join(root, 'src/rambam/words/terms-ru.txt'), 'utf8')).split(/\r?\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [he, title, definition] = line.split('|');
  if (he && title && definition) {
    const key = cleanVocalized(he);
    if (terms.has(key)) throw new Error(`Duplicate halakhic term key: ${he}`);
    terms.set(key, { title: title.trim(), definition: definition.trim() });
  }
}

for (const row of rambamRows.values()) {
  const lemma = row.lemma || row.surface;
  const gloss = lexiconRu.get(cleanVocalized(lemma)) || row.translation;
  const id = stableId('rambam', `${cleanVocalized(lemma)}|${row.translation}`);
  const legacyKey = `rambam:${vocalKey(row.surface)}`;
  legacy[legacyKey] = [...new Set([...(legacy[legacyKey] ?? []), id])];
  const term = terms.get(cleanVocalized(lemma)) ?? terms.get(cleanVocalized(row.surface));
  const existing = entries.find(e => e.id === id);
  if (existing) {
    if (!existing.senses[0].translations.ru?.includes(row.translation)) existing.senses[0].translations.ru?.push(row.translation);
    existing.forms.push({ vocalized: row.surface, normalized: normalizeHebrew(row.surface), source: 'manual', reference: `project-word-list:${row.file}:${row.line}` });
    if (term) {
      existing.senses[0].domain = [...new Set([...(existing.senses[0].domain ?? []), 'halakha'])];
      if (!existing.senses[0].terms?.some(t => t.label === term.title)) existing.senses[0].terms = [...(existing.senses[0].terms ?? []), { language: 'ru', label: term.title, definition: term.definition }];
    }
    continue;
  }
  entries.push({
    id: id as HebrewLexeme['id'],
    headword: { vocalized: lemma, normalized: normalizeHebrew(lemma) },
    partOfSpeech: 'unknown',
    senses: [{ id: `${id}:sense:1`, translations: { ru: [gloss] }, ...(term ? { terms: [{ language: 'ru', label: term.title, definition: term.definition }], domain: ['halakha'] } : {}) }],
    forms: [{ vocalized: row.surface, normalized: normalizeHebrew(row.surface), source: 'manual', reference: `project-word-list:${row.file}:${row.line}` }],
    occurrences: [],
    sources: [{ name: 'Niflaot project Mishneh Torah word list', license: 'Project-authored translation; source text: Sefaria / Torat Emet 363' }],
    status: 'review',
  });
}


for (const [he, translation] of lexiconRu) {
  const id = stableId('rambam', `${cleanVocalized(he)}|${translation}`);
  if (entries.some(entry => entry.id === id)) continue;
  const term = terms.get(cleanVocalized(he));
  const legacyKey = `rambam:${vocalKey(he)}`;
  legacy[legacyKey] = [...new Set([...(legacy[legacyKey] ?? []), id])];
  entries.push({
    id: id as HebrewLexeme['id'],
    headword: { vocalized: he, normalized: normalizeHebrew(he) },
    partOfSpeech: 'unknown',
    senses: [{ id: `${id}:sense:1`, translations: { ru: [translation] }, ...(term ? { terms: [{ language: 'ru', label: term.title, definition: term.definition }], domain: ['halakha'] } : {}) }],
    forms: [],
    occurrences: [],
    sources: [{ name: 'Niflaot project Rambam supplementary lexicon', license: 'Project-authored translation; source text: Sefaria / Torat Emet 363' }],
    status: 'review',
  });
}

const lexicon: HebrewLexicon = { schemaVersion: 1, generatedAt: new Date().toISOString(), entries };
const errors = validateHebrewLexicon(lexicon);
if (errors.length) throw new Error(errors.join('\n'));

const out = path.join(root, 'src/data');
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'hebrew-lexicon.json'), JSON.stringify(lexicon, null, 2) + '\n');
await writeFile(path.join(out, 'hebrew-lexicon-legacy-map.json'), JSON.stringify({
  schemaVersion: 1,
  policy: 'Legacy IDs are aliases only. Never merge lexemes by normalized spelling.',
  ids: legacy,
  ambiguous: Object.entries(legacy).filter(([, ids]) => ids.length > 1).map(([key, ids]) => ({ key, ids })),
}, null, 2) + '\n');
console.log(`Built ${entries.length} lexemes; ${Object.keys(legacy).length} legacy keys mapped; ${entries.filter(x => x.status === 'review').length} need editorial review.`);
