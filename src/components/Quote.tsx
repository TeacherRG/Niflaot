import { Html, useI18n } from '../i18n';
import { quoteView, type QuoteRef } from '../core/quotes';

/** The commentator's own words: the original (Sefaria) with its translation, in the section that explains them. */
export function Quote({ q }: { q: QuoteRef }) {
  const { t, locale } = useI18n();
  const v = quoteView(q, locale);
  return (
    <figure className="read-quote">
      <figcaption>
        📜 {v.title}
        <a href={v.url} target="_blank" rel="noopener" className="no-speak">
          {' '}
          · {t('sources.open')} ↗
        </a>
      </figcaption>
      {v.segs.map((s, i) => (
        <div key={i} className="rq-seg">
          <Html as="p" className="rq-he" html={s.he} />
          {s.tr && <Html as="p" className="rq-tr" html={s.tr} />}
        </div>
      ))}
      {v.fixes.map(([from, to]) => (
        <p key={from} className="rq-fix">
          {t('read.fixed')} <span className="he">{from}</span> → <span className="he">{to}</span>
        </p>
      ))}
    </figure>
  );
}
