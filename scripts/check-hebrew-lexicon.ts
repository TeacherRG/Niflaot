import { normalizeHebrew, validateHebrewLexicon, type HebrewLexicon } from '../src/core/hebrewLexicon';
import { migrateLegacyWordProgress } from '../src/core/hebrewLexiconProgress';

const valid: HebrewLexicon = {
  schemaVersion: 1,
  generatedAt: '2026-11-25T00:00:00.000Z',
  entries: [{
    id: 'oshb:1234:sense-1' as HebrewLexicon['entries'][number]['id'],
    headword: { vocalized: 'לִמְסֹךְ', normalized: normalizeHebrew('לִמְסֹךְ'), verbalForm: 'infinitive-construct' },
    partOfSpeech: 'verb',
    senses: [{ id: 'sense-1', translations: { ru: ['лить'] }, terms: [{ language: 'ru', label: 'термин', definition: 'пояснение' }] }],
    forms: [{ vocalized: 'מָסַךְ', normalized: normalizeHebrew('מָסַךְ'), source: 'oshb', reference: 'Gen.1.1', morphology: 'Vqc' }],
    corpusStats: { tanakh: { frequency: 2 } },
    occurrences: [{ corpus: 'tanakh', reference: 'Gen.1.1', surface: 'מָסַךְ' }],
    sources: [{ name: 'Open Scriptures Hebrew Bible', license: 'CC BY 4.0' }],
    status: 'verified',
  }],
};
const errors = validateHebrewLexicon(valid);
if (errors.length) throw new Error(errors.join('
'));
if (normalizeHebrew('מָסַךְ') !== normalizeHebrew('מַסָּךְ')) {
  // Normalization strips vowel points; homonym identity is handled by stable IDs, not this helper.
  throw new Error('Hebrew search normalization failed');
}
const invalid = structuredClone(valid);
invalid.entries.push(invalid.entries[0]);
if (!validateHebrewLexicon(invalid).some((x) => x.includes('duplicate lexeme id')))
  throw new Error('Duplicate IDs must be rejected');
const noInfinitive = structuredClone(valid);
noInfinitive.entries[0].headword.verbalForm = undefined;
if (!validateHebrewLexicon(noInfinitive).some((x) => x.includes('explicit infinitive status')))
  throw new Error('Verbs without an explicit infinitive status must be rejected');
const badForm = structuredClone(valid);
badForm.entries[0].forms[0].normalized = 'שקר';
if (!validateHebrewLexicon(badForm).some((x) => x.includes('attested form normalization mismatch')))
  throw new Error('Attested form normalization must be checked');
const badFrequency = structuredClone(valid);
badFrequency.entries[0].corpusStats!.tanakh!.frequency = -1;
if (!validateHebrewLexicon(badFrequency).some((x) => x.includes('corpus frequency')))
  throw new Error('Negative corpus frequency must be rejected');
const migrated = migrateLegacyWordProgress(
  { words: { '1234': [100, 3, 9] }, 'halacha-words': { 'אב': [200, 2, 10], 'unknown': 1 } },
  { ids: { 'words:1234': ['tanakh:strong:1234'], 'halacha-words:אב': ['rambam:a', 'rambam:b'] } },
);
if (!Array.isArray(migrated.entries['tanakh:strong:1234']?.sources.words?.value))
  throw new Error('One-to-one progress must be copied verbatim');
if (migrated.unresolved.length !== 2 || migrated.unresolved[0].candidates.length !== 2)
  throw new Error('Ambiguous and unknown progress must be preserved as unresolved');
console.log('Hebrew lexicon schema and progress migration: OK');
