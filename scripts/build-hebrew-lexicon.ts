import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { normalizeHebrew, validateHebrewLexicon, type HebrewLexeme, type HebrewLexicon, type PartOfSpeech } from '../src/core/hebrewLexicon';

const root = process.cwd();
const readJson = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(root, file), 'utf8')) as T;
const vocalKey = (s: string) => s.normalize('NFD').replace(/[\\u0591-\\u05AF\\u05BC-\\u05C7]/g, '').replace(/[^\\u05D0-\\u05EA]/g, '');
const cleanVocalized = (s: string) => s.normalize('NFD').replace(/[\\u0591-\\u05AF]/g, '').normalize('NFC').trim();
const stableId = (prefix: string, value: string) => `${prefix}:${createHash('sha256').update(value).digest('hex').slice(0, 16)}`;

const [tanakh, ru, en, de] = await Promise.all([
  readJson<{ words: Array<{ id: string; he: string; pos: string; n: number; root?: string; aram?: number }>; total: number }>('src/tanakh/words.json'),
  readJson<Record<string, string>>('src/tanakh/words/ru.json'),
  readJson<Record<string, string>>('src/tanakh/words/en.json'),
  readJson<Record<string, string>>('src/tanakh/words/de.json'),
]);

const infinitives = await readJson<Record<string, string>>('public/tanakh/words/infinitives.json').catch(() => ({}));
const entries: HebrewLexeme[] = [];
const legacy: Record<string, string> = {};
const tanakhByExactHeadword = new Map<string, string>();

const pos = (raw: string): PartOfSpeech => {
  const p = raw.split(/\\s+/);
  if (p.includes('v')) return 'verb';
  if (p.some(x => x.startsWith('n'))) return 'noun';
  if (p.includes('a')) return 'adjective';
  if (p.includes('adv')) return 'adverb';
  if (p.includes('p')) return 'pronoun';
  if (p.includes('prep')) return 'preposition';
  if (p.includes('conj')) return 'conjunction';
  if (p.includes('i')) return 'interjection';
  if (p.includes('np')) return 'proper-noun';
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
  const infinitive = infinitives[w.id];
  const headword = isVerb && infinitive
    ? { vocalized: infinitive, normalized: normalizeHebrew(infinitive), verbalForm: 'infinitive-construct' as const }
    : isVerb
      ? { vocalized: w.he, normalized: normalizeHebrew(w.he), verbalForm: 'unverified' as const }
      : { vocalized: w.he, normalized: normalizeHebrew(w.he) };
  const entry: HebrewLexeme = {
    id: id as HebrewLexeme['id'],
    headword,
    partOfSpeech: pos(w.pos),
    ...(w.root ? { root: w.root } : {}),
    senses: [{ id: `${id}:sense:1`, translations }],
    forms: [{ vocalized: w.he, normalized: normalizeHebrew(w.he), source: 'oshb', reference: `Strong:${w.id}` }],
    occurrences: [],
    sources: [
      { name: 'Open Scriptures Hebrew Bible', license: 'CC BY 4.0', url: 'https://github.com/openscriptures/morphhb' },
      { name: 'Strong’s Hebrew Dictionary / Brown–Driver–Briggs', license: 'Public Domain' },
    ],
    status: isVerb && !infinitive ? 'review' : 'verified',
  };
  entries.push(entry);
  legacy[`tanakh:${w.id}`] = id;
  const exact = cleanVocalized(headword.vocalized);
  if (!tanakhByExactHeadword.has(exact)) tanakhByExactHeadword.set(exact, id);
}

const rambamFiles = ['src/rambam/words/ru-1.txt', 'src/rambam/words/ru-2.txt', 'src/rambam/words/ru-3.txt'];
const rambamRows = new Map<string, { surface: string; translation: string; lemma: string; file: string; line: number }>();
for (const file of rambamFiles) {
  const body = await readFile(path.join(root, file), 'utf8');
  body.split(/\\r?\\n/).forEach((line, index) => {
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
for (const line of (await readFile(path.join(root, 'src/rambam/words/lexicon-ru.txt'), 'utf8')).split(/\\r?\\n/)) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [he, translation] = line.split('|');
  if (he && translation) lexiconRu.set(cleanVocalized(he), translation.trim());
}

for (const row of rambamRows.values()) {
  const lemma = row.lemma || row.surface;
  const id = stableId('rambam', cleanVocalized(lemma));
  const existing = entries.find(e => e.id === id);
  if (existing) {
    if (!existing.senses[0].translations.ru?.includes(row.translation)) existing.senses[0].translations.ru?.push(row.translation);
    existing.forms.push({ vocalized: row.surface, normalized: normalizeHebrew(row.surface), source: 'sefaria', reference: `${row.file}:${row.line}` });
    continue;
  }
  const exactTanakh = tanakhByExactHeadword.get(cleanVocalized(lemma));
  const generalGloss = lexiconRu.get(cleanVocalized(lemma));
  entries.push({
    id: id as HebrewLexeme['id'],
    headword: { vocalized: lemma, normalized: normalizeHebrew(lemma), verbalForm: 'unverified' },
    partOfSpeech: 'unknown',
    senses: [{ id: `${id}:sense:1`, translations: { ru: [generalGloss || row.translation] }, ...(exactTanakh ? { definition: { ru: ['Отдельная лексема Рамбама; совпадение написания с Танахом само по себе не означает тождества значения.'] } } : {}) }],
    forms: [{ vocalized: row.surface, normalized: normalizeHebrew(row.surface), source: 'sefaria', reference: `${row.file}:${row.line}` }],
    occurrences: [],
    sources: [{ name: 'Niflaot project Mishneh Torah word list', license: 'Project-authored translation; source text: Sefaria / Torat Emet 363' }],
    status: 'review',
  });
  legacy[`rambam:${vocalKey(row.surface)}`] = id;
}

const lexicon: HebrewLexicon = { schemaVersion: 1, generatedAt: new Date().toISOString(), entries };
const errors = validateHebrewLexicon(lexicon);
if (errors.length) throw new Error(errors.join('\\n'));

const out = path.join(root, 'src/data');
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'hebrew-lexicon.json'), JSON.stringify(lexicon, null, 2) + '\\n');
await writeFile(path.join(out, 'hebrew-lexicon-legacy-map.json'), JSON.stringify({
  schemaVersion: 1,
  policy: 'Legacy IDs are aliases only. Never merge lexemes by normalized spelling.',
  ids: legacy,
}, null, 2) + '\\n');
console.log(`Built ${entries.length} lexemes; ${Object.keys(legacy).length} legacy keys mapped; ${entries.filter(x => x.status === 'review').length} need editorial review.`);
