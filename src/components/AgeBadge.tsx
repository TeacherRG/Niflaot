import { useI18n } from '../i18n';

/** «8+ · от 8 лет и взрослым»: the recommended minimum age of a lesson; the range is open upward. */
export function AgeBadge({ age, long = true }: { age: number; long?: boolean }) {
  const { t } = useI18n();
  return (
    <span className="age" title={`${t('age.title')}: ${t('age.long', { n: age })}`}>
      <b>{t('age.short', { n: age })}</b>
      {long && <span>{t('age.long', { n: age })}</span>}
    </span>
  );
}
