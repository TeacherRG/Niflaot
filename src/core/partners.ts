/**
 * The site's logo and its partners (Jewish communities of Vienna): the home page, «Партнёры» (`#/partners`)
 * and every printout (`PrintBrand.tsx`). Files — src/assets/logos/ (transparent WebP, prepared from the originals).
 */
import niflaot from '../assets/logos/niflaot.webp';
import chabadHaus from '../assets/logos/chabad-haus-vienna.webp';
import jrcv from '../assets/logos/jrcv-vienna.webp';

export const NIFLAOT_LOGO = niflaot;

export interface Partner {
  id: string;
  /** the name as the partner writes it (not translated) */
  name: string;
  /** the Hebrew name, if the partner has one (it is on the logo; kept for the image description) */
  he?: string;
  logo: string;
  /** the partner's site — only a real address the partner gave */
  url?: string;
}

export const PARTNERS: Partner[] = [
  { id: 'chabad-haus-vienna', name: 'Chabad Haus Wien', he: 'בית חב״ד וינה', logo: chabadHaus },
  { id: 'jrcv-vienna', name: 'JRCV Vienna', logo: jrcv },
];
