/**
 * Canonical lexical model shared by Tanakh and Mishneh Torah.
 *
 * A lexeme is a lexical meaning, not a spelling. Homonyms with distinct meanings
 * MUST have distinct IDs even when their unvocalized spelling is identical.
 * Corpus tokens/forms point to lexeme IDs; they never own translations.
 */
export type LexemeId = string & { readonly __lexemeId: unique symbol };
export type Language = 'he' | 'ru' | 'en' | 'de';
export type PartOfSpeech =
  | 'verb' | 'noun' | 'adjective' | 'adverb' | 'pronoun'
  | 'preposition' | 'conjunction' | 'particle' | 'interjection'
  | 'proper-noun' | 'numeral' | 'phrase' | 'unknown';

export type Headword = {
  /** Fully vocalized normative dictionary form. */
  vocalized: string;
  /** Hebrew letters only, normalized for search; never used to merge entries. */
  normalized: string;
  /** For verbs: infinitive construct where attested; infinitive absolute only if construct is unavailable. */
  verbalForm?: 'infinitive-construct' | 'infinitive-absolute' | 'unverified';
};

export type GlossaryTerm = {
  language: Exclude<Language, 'he'>;
  label: string;
  definition: string;
};

export type LexicalSense = {
  id: string;
  translations: Partial<Record<Exclude<Language, 'he'>, string[]>>;
  /** Short explanation distinguishing this sense from homonyms. */
  definition?: Partial<Record<Exclude<Language, 'he'>, string>>;
  domain?: string[];
  /** Structured halakhic / domain glossary annotations, separate from translation. */
  terms?: GlossaryTerm[];
};

export type AttestedForm = {
  vocalized: string;
  normalized: string;
  /** Morphology is source-specific; keep the original tag as evidence. */
  morphology?: string;
  grammaticalDescription?: string;
  source: 'oshb' | 'sefaria' | 'manual';
  reference: string;
};

export type CorpusOccurrence = {
  corpus: 'tanakh' | 'mishneh-torah';
  /** Stable source locator, e.g. Gen.1.1 or sefer-hamada.1.2. */
  reference: string;
  /** The actual surface form in the source, including prefixes/suffixes. */
  surface: string;
  /** Link to an AttestedForm when a morphological analysis is available. */
  form?: string;
};

export type HebrewLexeme = {
  id: LexemeId;
  headword: Headword;
  partOfSpeech: PartOfSpeech;
  /** Corpus-specific statistics; never confuse Tanakh frequency with whole-language frequency. */
  corpusStats?: Partial<Record<'tanakh' | 'mishneh-torah', { frequency?: number }>>;
  /** Roots are linguistic data, not a fallback dictionary form. */
  root?: string;
  senses: LexicalSense[];
  forms: AttestedForm[];
  occurrences: CorpusOccurrence[];
  sources: Array<{ name: string; version?: string; license?: string; url?: string }>;
  /** Manual editorial state prevents guesses from silently becoming canonical data. */
  status: 'verified' | 'review' | 'unverified';
};

export type HebrewLexicon = {
  schemaVersion: 1;
  generatedAt: string;
  entries: HebrewLexeme[];
};

const HEBREW_MARKS = /[\u0591-\u05C7]/g;
const HEBREW_NONLETTERS = /[^\u05D0-\u05EA]/g;

/** Search normalization only. It must never be used as an identity/merge key. */
export function normalizeHebrew(value: string): string {
  return value.normalize('NFD').replace(HEBREW_MARKS, '').replace(HEBREW_NONLETTERS, '');
}

export function validateHebrewLexicon(data: HebrewLexicon): string[] {
  const errors: string[] = [];
  if (data.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!Number.isFinite(Date.parse(data.generatedAt))) errors.push('generatedAt must be an ISO date');
  const ids = new Set<string>();
  for (const entry of data.entries) {
    const at = entry.id || '<missing id>';
    if (!entry.id) errors.push('entry has no stable id');
    if (ids.has(entry.id)) errors.push(`duplicate lexeme id: ${entry.id}`);
    ids.add(entry.id);
    if (!entry.headword?.vocalized?.trim()) errors.push(`${at}: missing vocalized headword`);
    if (!entry.headword?.normalized?.trim()) errors.push(`${at}: missing normalized headword`);
    if (entry.headword?.normalized && entry.headword.normalized !== normalizeHebrew(entry.headword.vocalized))
      errors.push(`${at}: normalized headword does not match vocalized headword`);
    if (!entry.senses?.length) errors.push(`${at}: at least one lexical sense is required`);
    if (entry.partOfSpeech === 'verb' && !entry.headword.verbalForm)
      errors.push(`${at}: verb requires an explicit infinitive status`);\n    if (entry.headword?.verbalForm && !['infinitive-construct', 'infinitive-absolute', 'unverified'].includes(entry.headword.verbalForm))\n      errors.push(`${at}: unsupported verbal form type`);\n    for (const form of entry.forms ?? []) {\n      if (!form.vocalized?.trim() || form.normalized !== normalizeHebrew(form.vocalized))\n        errors.push(`${at}: attested form normalization mismatch`);\n      if (!form.reference?.trim()) errors.push(`${at}: attested form requires provenance`);\n    }\n    for (const term of entry.senses?.flatMap(sense => sense.terms ?? []) ?? []) {\n      if (!term.label?.trim() || !term.definition?.trim()) errors.push(`${at}: glossary term requires label and definition`);\n    }\n    for (const count of Object.values(entry.corpusStats ?? {})) {\n      if (count.frequency !== undefined && (!Number.isFinite(count.frequency) || count.frequency < 0))\n        errors.push(`${at}: corpus frequency must be a non-negative number`);\n    }
    const senseIds = new Set<string>();
    for (const sense of entry.senses ?? []) {
      if (!sense.id || senseIds.has(sense.id)) errors.push(`${at}: missing or duplicate sense id`);
      senseIds.add(sense.id);
    }
    for (const occurrence of entry.occurrences ?? []) {
      if (!occurrence.reference || !occurrence.surface)
        errors.push(`${at}: occurrence requires source reference and surface form`);
    }
  }
  return errors;
}
