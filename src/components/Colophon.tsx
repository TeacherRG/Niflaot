import { useI18n } from '../i18n';
import { SITE_HOST, SITE_URL } from '../core/site';

/** Slim footer: lesson source and copyright. Contacts and donation live in the menu / top bar. */
export function Colophon({ source }: { source?: string }) {
  const { t } = useI18n();
  return (
    <footer className="colophon">
      {source && <p>{source}</p>}
      <p>
        <a href={SITE_URL}>{SITE_HOST}</a> · {t('footer.fine')}
      </p>
    </footer>
  );
}
