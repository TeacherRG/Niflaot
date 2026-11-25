import type { LexemeId } from './hebrewLexicon';

export type LegacyStore = 'words' | 'halacha-words';
export type LegacyAliasMap = { ids: Record<string, string[]> };
export type LegacyProgressStores = Partial<Record<LegacyStore, Record<string, unknown>>>;
export type CanonicalProgress = {
  schemaVersion: 1;
  entries: Record<string, { sources: Partial<Record<LegacyStore, { legacyKey: string; value: unknown }>> }>;
  unresolved: Array<{ store: LegacyStore; legacyKey: string; value: unknown; candidates: string[] }>;
};

const stores: LegacyStore[] = ['words', 'halacha-words'];

/**
 * Additive, lossless migration preview.
 * Existing localStorage keys are never changed or deleted. Only a one-to-one alias
 * is copied to the canonical lexeme ID. Unknown and ambiguous aliases are preserved
 * in unresolved, with their original store, key, value and candidate IDs.
 * Values are copied verbatim because the two legacy stores have different schemas.
 */
export function migrateLegacyWordProgress(legacy: LegacyProgressStores, aliases: LegacyAliasMap): CanonicalProgress {
  const result: CanonicalProgress = { schemaVersion: 1, entries: {}, unresolved: [] };
  for (const store of stores) {
    for (const [legacyKey, value] of Object.entries(legacy[store] ?? {})) {
      const candidates = [...new Set(aliases.ids[`${store}:${legacyKey}`] ?? [])];
      if (candidates.length !== 1) {
        result.unresolved.push({ store, legacyKey, value, candidates });
        continue;
      }
      const lexemeId = candidates[0] as LexemeId;
      const entry = result.entries[lexemeId] ?? { sources: {} };
      entry.sources[store] = { legacyKey, value };
      result.entries[lexemeId] = entry;
    }
  }
  return result;
}
