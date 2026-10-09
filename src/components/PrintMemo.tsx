import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, MemoData } from '../lessons/types';
import { memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { SITE_HOST } from '../core/site';
import { Icon } from './ui';
import { PrintMasthead } from './PrintBrand';
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
  const { t, pick } = useI18n();
  const text = pick(lesson.texts).value;
  const mt = text.memo;
  const images = useMemo(() => memoImages(lesson), [lesson]);
  const [opt, setOpt] = useState(loadOptions);

  useEffect(() => {
    document.title = `${t('memo.tabMemo')} · ${text.title} · ${t('print.button')}`;
  }, [text.title, t]);

  const toggle = (k: keyof Options) =>
    setOpt((o) => {
      const n = { ...o, [k]: !o[k] };
      try {
        localStorage.setItem(OPTS_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  if (!mt) return null;
  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href={`#/${lesson.slug}/memo`}>
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

      <article className="sheet-paper pm">
        <PrintMasthead lesson={lesson} />
        <header className="pm-head">
          <div className="p-heb he">{lesson.hebrewTitle}</div>
          <h1>
            {t('memo.title')} · {text.title}
          </h1>
          <p>{mt.intro}</p>
          <p>{t('memo.printIntro')}</p>
        </header>

        {opt.cards && (
          <>
            <CardPage title={t('memo.picCards')}>
              {memo.items.map((_, k) => (
                <div key={k} className="pm-card pm-pic">
                  <img src={images[k]} alt="" />
                </div>
              ))}
            </CardPage>
            <CardPage title={t('memo.wordCards')}>
              {memo.items.map((it, k) => (
                <div key={k} className="pm-card pm-words">
                  <span className="pm-verse he">{displayNames(it.verse)}</span>
                  <span className="pm-tr">{mt.items[k].verse}</span>
                  <span className="pm-copy">© mychitas.app 5787</span>
                </div>
              ))}
            </CardPage>
            <section className="pm-legend">
              <h2>{t('memo.legend')}</h2>
              <ol>
                {mt.items.map((it, k) => (
                  <li key={k}>
                    <b>{it.title}.</b> {it.caption}
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        {opt.info && (
          <section className="pm-info">
            <h2>{t('memo.explanations')}</h2>
            {memo.items.map((it, k) => (
              <MemoInfo key={k} item={it} text={mt.items[k]} n={k + 1} img={images[k]} />
            ))}
          </section>
        )}

        {opt.color &&
          memo.items.map((it, k) => (
            <section key={k} className="pm-color">
              <img src={images[k]} alt={mt.items[k].caption} />
              <p>
                {k + 1}. {mt.items[k].title} — <span className="he">{displayNames(it.verse)}</span>
              </p>
            </section>
          ))}

        <footer className="p-foot">
          <p className="p-holy">{t('print.holy')}</p>
          {SITE_HOST} · {t('memo.shabbat')} · © mychitas.app 2026
        </footer>
      </article>
    </div>
  );
}
