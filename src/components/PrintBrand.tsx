import { useI18n } from '../i18n';
import { NIFLAOT_LOGO, PARTNERS } from '../core/partners';

/** The site's logo at the top of a printout. */
export function PrintLogo() {
  return (
    <div className="p-brand">
      <img src={NIFLAOT_LOGO} alt="Niflaot" />
    </div>
  );
}

/** «Партнёры» with their logos at the bottom of a printout. */
export function PrintPartners() {
  const { t } = useI18n();
  return (
    <div className="p-partners">
      <span>{t('partners.title')}:</span>
      {PARTNERS.map((p) => (
        <img key={p.id} src={p.logo} alt={p.name} />
      ))}
    </div>
  );
}
