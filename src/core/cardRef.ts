import type { MessageKey } from '../i18n/locales/ru';
import type { RebbeCard } from '../lessons/types';

type Vars = Record<string, string | number>;

/** Where the talk of a «Карточки» pair is: «Ликутей сихот, т. 25, беседа 3» / «…, с. 83–85» / «Торат Менахем, 5743, т. 3, с. 1223». */
export function cardRef(card: RebbeCard, t: (key: MessageKey, vars?: Vars) => string): string {
  if (card.tm) return t('cards.tm', { year: card.tm.year, vol: card.tm.vol, p: card.tm.pages });
  const ls = card.ls!;
  return ls.sicha ? t('cards.ls', { vol: ls.vol, n: ls.sicha }) : t('cards.lsPages', { vol: ls.vol, p: ls.pages ?? '' });
}
