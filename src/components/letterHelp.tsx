import { useI18n } from '../i18n';
import { useHebrewLevel } from '../core/hebrewLevel';
import { letterName, letterTitle } from '../core/letterNames';

/**
 * Help for a letter tile by the player's Hebrew level (src/core/hebrewLevel.ts):
 * `title` — «мем · 40» on a long press / hover (unless the player reads Hebrew);
 * `Name` — the letter's name under it, only for a player who doesn't know the letters yet.
 */
export function useLetterHelp() {
  const { locale } = useI18n();
  const level = useHebrewLevel();
  return {
    level,
    title: (c: string) => (level === 'reads' ? undefined : letterTitle(c, locale)),
    Name: ({ c }: { c: string }) => (level === 'none' ? <small className="ln">{letterName(c, locale)}</small> : null),
  };
}
