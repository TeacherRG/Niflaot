/**
 * Respectful display of Divine Names. On screen and in print the Name Elokim is written
 * with ק instead of ה (as is customary for texts that may be printed and discarded).
 * Gematria is always computed from the real spelling — only the displayed text changes.
 */
export const displayNames = (s: string) => s.replace(/(^|[^א-ת])([והבכלמש]*)אלהים(?![א-ת])/g, '$1$2אלקים');
