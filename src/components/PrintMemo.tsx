import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, MemoData } from '../lessons/types';
import { memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { Icon } from './ui';
import { MemoInfo } from './Memo';

const OPTS_KEY = 'niflaot:print-memo-options';
type Options = { cards: boolean; info: boolean; color: boolean };

function loadOptions(): Options {
  try {
    return { cards: true, info: true, color: false, ...JSON.parse(localStorage.getItem(OPTS_KEY) ?? '{}') };
  } catch {
    return { cards: true, info: true, color: false };
  }
}

/** A page of 12 cards to cut out: 4 × 3, dashed cut lines. */
function CardPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pm-page">
      <div className="pm-page-h">✂ {title}</div>
      <div className="pm-cards">{children}</div>
    </section>
  );
}

/** The Memo on paper — a separate print variant: cards to cut out, the explanations of the pairs, colouring pages. */
export function PrintMemo({ lesson, memo }: { lesson: Lesson; memo: MemoData }) {
  const { t } = useI18n();
  const images = useMemo(() => memoImages(lesson), [lesson]);
  const [opt, setOpt] = useState(loadOptions);
  const parsha = lesson.hebrewTitle.split('·').pop()?.trim();

  useEffect(() => {
    document.title = `Memo · ${lesson.hebrewTitle} · ${t('print.button')}`;
  }, [lesson.hebrewTitle, t]);

  const toggle = (k: keyof Options) =>
    setOpt((o) => {
      const n = { ...o, [k]: !o[k] };
      try {
        localStorage.setItem(OPTS_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href={`#/${lesson.slug}`}>
          {t('print.back')}
        </a>
        <div className="print-variant" role="group">
          <a className="btn ghost" href={`#/${lesson.slug}/print`}>
            {t('print.worksheet')}
          </a>
          <span className="btn gold" aria-current="page">
            {t('print.memo')}
          </span>
        </div>
        <div className="print-opts" role="group" aria-label={t('print.options')}>
          {(
            [
              ['cards', 'print.memoCards'],
              ['info', 'print.memoInfo'],
              ['color', 'print.memoColor'],
            ] as const
          ).map(([k, label]) => (
            <label key={k}>
              <input type="checkbox" checked={opt[k]} onChange={() => toggle(k)} />
              {t(label)}
            </label>
          ))}
        </div>
        <button className="btn" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {t('print.print')}
        </button>
      </div>

      <article className="sheet-paper pm" dir="rtl" lang="he">
        <header className="pm-head">
          <div className="pm-eyebrow">משחק זיכרון · בעל הטורים</div>
          <h1>פרשת {parsha}</h1>
          <p>
            24 קלפים — 12 זוגות: ציור והמילים שלו מן התורה. גוזרים את הקלפים לאורך הקווים המקווקווים, הופכים ומערבבים.
            בכל תור פותחים שני קלפים; מצאתם זוג — הוא שלכם, וקוראים את ההסבר שלו בדף „הסברים”.
          </p>
        </header>

        {opt.cards && (
          <>
            <CardPage title="קלפי ציור">
              {memo.items.map((it, k) => (
                <div key={k} className="pm-card">
                  <img src={images[k]} alt={it.title} />
                </div>
              ))}
            </CardPage>
            <CardPage title="קלפי מילים">
              {memo.items.map((it, k) => (
                <div key={k} className="pm-card pm-words">
                  <span className="pm-n">{k + 1}</span>
                  <span className="pm-verse">{displayNames(it.verse)}</span>
                  <span className="pm-copy">© mychitas.app 5787</span>
                </div>
              ))}
            </CardPage>
          </>
        )}

        {opt.info && (
          <section className="pm-info">
            <h2>הסברים — מה גילה בעל הטורים?</h2>
            {memo.items.map((it, k) => (
              <MemoInfo key={k} item={it} n={k + 1} img={images[k]} />
            ))}
          </section>
        )}

        {opt.color &&
          memo.items.map((it, k) => (
            <section key={k} className="pm-color">
              <img src={images[k]} alt={it.title} />
              <p>
                {k + 1}. {it.title} — <span>{displayNames(it.verse)}</span>
              </p>
            </section>
          ))}

        <footer className="p-foot">
          <p className="p-holy">בדפים אלה דברי תורה — נא לא לזרוק אותם לפח, אלא לשים בגניזה.</p>
          כל הכבוד! · שבת שלום! · © mychitas.app 2026
        </footer>
      </article>
    </div>
  );
}
