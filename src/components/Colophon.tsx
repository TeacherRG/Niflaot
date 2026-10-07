import { useI18n } from '../i18n';

/** Slim footer: lesson source and copyright. Contacts and donation live in the menu / top bar. */
export function Colophon({ source }: { source?: string }) {
  const { t } = useI18n();
  return (
    <footer className="colophon">
      {source && <p>{source}</p>}
      <p>{t('footer.fine')}</p>
    </footer>
  );
}
