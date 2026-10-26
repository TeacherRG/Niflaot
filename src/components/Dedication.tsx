import { useI18n } from '../i18n';

/** The week's dedication (לעילוי נשמת) at the bottom of both homes; texts — `dedication.*`; empty name — no plaque. */
export function Dedication() {
  const { t } = useI18n();
  const name = t('dedication.name');
  if (!name) return null;
  return (
    <aside className="dedication" aria-label={t('dedication.lead')}>
      <span className="ded-he he" lang="he">
        לעילוי נשמת
      </span>
      <span className="ded-lead">{t('dedication.lead')}</span>
      <span className="ded-name">{name}</span>
    </aside>
  );
}
