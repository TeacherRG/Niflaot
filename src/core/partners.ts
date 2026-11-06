/**
 * The site's logo and its partners (Jewish communities of Vienna): the home page, «Партнёры» (`#/partners`)
 * and every printout (`PrintBrand.tsx`). Files — src/assets/logos/ (transparent WebP, prepared from the originals).
 */
import niflaotLight from '../assets/logos/niflaot-light.webp';
import niflaotSmall from '../assets/logos/niflaot-128.webp';
import niflaotSeal from '../assets/logos/niflaot.webp';
import chabadHaus from '../assets/logos/chabad-haus-vienna.webp';
import jrcv from '../assets/logos/jrcv-vienna.webp';
import type { Locale } from '../i18n';

/**
 * The site's logo — the round seal «נפלאות» (owner, 28.10.2026: one logo everywhere). On light pages, print and the
 * certificate — without the dark background (the gold on transparency, 400 px); the top bar — the seal's centre, the word and the
 * book on their night-blue (128 px: the whole seal is a blur at 40 px); on dark pictures
 * (the share card; previews and icons — scripts/og-images.ts) — the seal on its night-blue.
 */
export const NIFLAOT_LOGO = niflaotLight;
export const NIFLAOT_MARK = niflaotSmall;
export const NIFLAOT_SEAL = niflaotSeal;

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
      ru: 'Дом Хабада в Вене — еврейский общинный центр с синагогой, занятиями Торой и встречами к праздникам.',
      en: 'Chabad Haus Wien is a Jewish community center in Vienna, with a synagogue, Torah learning and holiday gatherings.',
      de: 'Das Chabad Haus Wien ist ein jüdisches Gemeindezentrum mit Synagoge, Tora-Lernen und Treffen zu den Feiertagen.',
    },
  },
  {
    id: 'jrcv-vienna',
    name: 'JRCV Vienna',
    logo: jrcv,
    url: 'https://jrcvienna.com',
    about: {
      ru: 'Еврейский центр JRCV в Вене, объединяющий русскоязычную общину и проводящий учебные и общинные программы.',
      en: 'JRCV is a Jewish center in Vienna serving the Russian-speaking community with educational and community programs.',
      de: 'JRCV ist ein jüdisches Zentrum in Wien, das die russischsprachige Gemeinde mit Bildungs- und Gemeinschaftsangeboten unterstützt.',
    },
  },
];
