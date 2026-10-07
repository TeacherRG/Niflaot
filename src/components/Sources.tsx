import { Html, useI18n } from '../i18n';
import { SOURCES, translation } from '../sources';

/** Collapsible list of primary sources (original + translation), taken from Sefaria. */
export function Sources({
  ri,
  ids,
  number,
  refs,
}: {
  ri: number;
  ids: string[];
  number: Record<string, number>;
  refs: Record<string, string[]>;
}) {
  const { t, locale } = useI18n();
  const list = ids.filter((id) => SOURCES[id]);
  if (!list.length) return null;
  const lang = locale === 'ru' ? 'ru' : 'en';

  return (
    <details className="sources">
      <summary>
        <span className="src-title">
          {t('sources.title')} <span>· {t('sources.count', { n: list.length })}</span>
        </span>
      </summary>
      <div className="src-list">
        {list.map((id) => {
          const s = SOURCES[id];
          const tr = translation(s, id, locale);
          return (
            <details key={id} className="src" id={`src-${ri}-${id}`}>
              <summary>
                {number[id] && <span className="src-num">{number[id]}</span>}
                <span className="src-kind">{s.kind[lang]}</span>
                <span className="src-name">{s.title[lang]}</span>
              </summary>
              <div className="src-body">
                {s.he.map((he, i) => (
                  <div key={i} className="src-seg">
                    <Html as="p" className="src-he" html={he} />
                    {tr.lines[i] && <Html as="p" className="src-tr" html={tr.lines[i]} />}
                  </div>
                ))}
                <p className="src-credit">
                  {t('sources.original')}: {s.versions.he?.title} ({s.versions.he?.license}) ·{' '}
                  {t('sources.translation')}:{' '}
                  {tr.by === 'project' ? t('sources.project') : `${tr.version} (${tr.license})`} ·{' '}
                  <a href={s.url} target="_blank" rel="noopener">
                    {t('sources.open')} ↗
                  </a>
                  {refs[id]?.map((r, k) => (
                    <a key={r} className="fn-back" role="button" tabIndex={0} data-back={r} aria-label={t('sources.back')}>
                      {' '}↩{refs[id].length > 1 ? <sup>{k + 1}</sup> : null}
                    </a>
                  ))}
                </p>
              </div>
            </details>
          );
        })}
      </div>
    </details>
  );
}
