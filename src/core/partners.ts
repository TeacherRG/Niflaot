/**
 * The site's logo and its partners (Jewish communities of Vienna): the home page, «Партнёры» (`#/partners`)
 * and every printout (`PrintBrand.tsx`). Files — src/assets/logos/ (transparent WebP, prepared from the originals).
 */
import niflaot from '../assets/logos/niflaot.webp';
import chabadHaus from '../assets/logos/chabad-haus-vienna.webp';
import jrcv from '../assets/logos/jrcv-vienna.webp';
import type { Locale } from '../i18n';

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
  /** one or two sentences about the partner, in every language of the site */
  about: Record<Locale, string>;
}

export const PARTNERS: Partner[] = [
  {
    id: 'chabad-haus-vienna',
    name: 'Chabad Haus Wien',
    he: 'בית חב״ד וינה',
    logo: chabadHaus,
    url: 'https://chabadvienna.com',
    about: {
      ru: 'Бейт Хабад в Вене — дом для каждого еврея: синагога, уроки Торы, праздники и общинная жизнь.',
      en: 'The Chabad House of Vienna — a home for every Jew: a synagogue, Torah classes, holidays and community life.',
      de: 'Das Chabad Haus Wien — ein Zuhause für jeden Juden: Synagoge, Tora-Unterricht, Feiertage und Gemeindeleben.',
    },
  },
  {
    id: 'jrcv-vienna',
    name: 'JRCV Vienna',
    logo: jrcv,
    url: 'https://jrcvienna.com',
    about: {
      ru: 'Русскоязычная еврейская община Вены: общинный центр, уроки Торы, субботние трапезы и праздники.',
      en: 'The Russian-speaking Jewish community of Vienna: a community center, Torah classes, Shabbat meals and holidays.',
      de: 'Die russischsprachige jüdische Gemeinde Wiens: Gemeindezentrum, Tora-Unterricht, Schabbat-Mahlzeiten und Feiertage.',
    },
  },
];
