import { useI18n } from '../i18n';

/**
 * Значок перечёркнутой книги рядом с инфинитивом, которого в Танахе нет: форма построена по правилам грамматики
 * (владелец, 26.11.2026: «то, что не упоминается в Танахе, не должно влиять на общую структуру — можно поставить
 * рядом с инфинитивом значок перечёркнутой книги»). Подсказка — `title`, для экранного чтеца — `aria-label`.
 */
export function NoTanakh({ show = true }: { show?: boolean }) {
  const { t } = useI18n();
  if (!show) return null;
  const label = t('words.noTanakh');
  return (
    <span className="no-tanakh" role="img" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
        <path
          d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 19.7 4 20.5v-15zM20 5.5C20 4.7 19.3 4 18.5 4H13v15h5.5c.8 0 1.5.7 1.5 1.5v-15z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M3 21L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}
