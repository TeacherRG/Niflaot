import { useI18n } from '../i18n';

/**
 * The week's dedication (לעילוי נשמת) at the bottom of both homes; texts — `dedication.*`; empty name — no plaque.
 * `line` — the adults' home: one line, «לעילוי נשמת · Для поднятия души Павел бен Яаков» (owner, 28.10.2026: more room
 * for the running gematria); on a phone — without the Hebrew words.
 */
export function Dedication({ line = false }: { line?: boolean }) {
  const { t } = useI18n();
  const name = t('dedication.name');
  if (!name) return null;
  if (line)
    return (
      <aside className="dedication line" aria-label={`${t('dedication.lead')} ${name}`}>
        <span className="ded-he he" lang="he">
          לעילוי נשמת
        </span>
        <span className="ded-short">{t('dedication.short')}</span> <b className="ded-name">{name}</b>
      </aside>
    );
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
