import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import type { GematriaSteps } from '../core/gematriaSteps';

/** The gematria of a word added in the head: hundreds, tens, units, then the group sums joined. */
export function GematriaSolution({ g }: { g: GematriaSteps }) {
  const { t } = useI18n();
  return (
    <ol className="hp-solution">
      {g.groups.map((gr) => (
        <li key={gr.rank}>
          <span className="hp-rank">{t(`helper.rank.${gr.rank}` as MessageKey)}</span>{' '}
          {gr.letters.map((c, i) => (
            <span key={i}>
              {i > 0 && ' + '}
              <span className="he">{c}</span>
            </span>
          ))}
          {' = '}
          {gr.values.length > 1 ? `${gr.values.join(' + ')} = ${gr.sum}` : gr.sum}
        </li>
      ))}
      {g.join.length > 0 && (
        <li>
          <span className="hp-rank">{t('helper.join')}</span> {g.join.join(' → ')}
        </li>
      )}
    </ol>
  );
}
