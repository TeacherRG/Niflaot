import { useI18n } from '../i18n';

/** The site's motto — Devarim 6:7, as written in the Torah (shown on the homes, in the Academy, on the Friday sheet). */
export const SLOGAN_HE = 'ושננתם לבניך ודברת בם';

/** The motto: the verse in Hebrew, under it the translation and the reference. */
export function Slogan() {
  const { t } = useI18n();
  return (
    <span className="slogan">
      <span className="slogan-he he" lang="he">
        {SLOGAN_HE}
      </span>
      <span className="slogan-tr">
        {t('slogan')} ({t('slogan.ref')})
      </span>
    </span>
  );
}
