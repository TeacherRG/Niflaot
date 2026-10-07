import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { buildTags } from '../core/tags';
import { displayNames } from '../core/names';
import { HebrewRuns } from './Hebrew';

/** Catalog tag cloud: terms and Hebrew words of all lessons; a tap shows the meaning and the lessons. */
export function TagCloud() {
  const { t, pick, locale } = useI18n();
  const tags = useMemo(() => buildTags(locale), [locale]);
  const [sel, setSel] = useState<string | null>(null);
  const cur = tags.find((x) => x.id === sel);
  if (!tags.length) return null;
  return (
    <section className="tagcloud" aria-labelledby="tagcloud-h">
      <h2 id="tagcloud-h">{t('catalog.tags')}</h2>
      <p className="tagcloud-sub">{t('catalog.tagsSub')}</p>
      <ul className="tags">
        {tags.map((x) => (
          <li key={x.id}>
            <button
              type="button"
              className={`tag s${x.size}${x.he ? ' he' : ''}${x.id === sel ? ' on' : ''}`}
              aria-pressed={x.id === sel}
              aria-controls="tagcloud-card"
              onClick={() => setSel(x.id === sel ? null : x.id)}
            >
              {x.he ? displayNames(x.label) : x.label}
            </button>
          </li>
        ))}
      </ul>
      <div id="tagcloud-card" aria-live="polite">
        {cur && (
          <div className="tag-card">
            <p>
              <HebrewRuns text={cur.def} />
            </p>
            <div className="tag-links">
              {cur.lessons.map((l) => (
                <a key={l.slug} href={`#/${l.slug}`}>
                  {t('catalog.lesson', { n: l.number })} · {pick(l.texts).value.title} →
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
