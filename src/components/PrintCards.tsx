import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, RebbeCardsData } from '../lessons/types';
import { displayNames } from '../core/names';
import { SITE_HOST } from '../core/site';
import { Icon } from './ui';
import { PrintLogo, PrintPartners } from './PrintBrand';
import { CardInfo } from './RebbeCards';

const OPTS_KEY = 'niflaot:print-cards-options';
type Options = { cards: boolean; info: boolean };

function loadOptions(): Options {
  try {
    return { cards: true, info: true, ...JSON.parse(localStorage.getItem(OPTS_KEY) ?? '{}') };
  } catch {
    return { cards: true, info: true };
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

/** «Карточки» of a «Нифлаот Ребе» lesson on paper: verse cards and explanation cards to cut out, the pairs explained. */
export function PrintCards({ lesson, cards }: { lesson: Lesson; cards: RebbeCardsData }) {
  const { t, pick } = useI18n();
  const text = pick(lesson.texts).value;
  const ct = text.cards;
  const [opt, setOpt] = useState(loadOptions);

  useEffect(() => {
    document.title = `${t('cards.tab')} · ${text.title} · ${t('print.button')}`;
  }, [text.title, t]);

  const toggle = (k: keyof Options) =>
    setOpt((o) => {
      const n = { ...o, [k]: !o[k] };
      try {
        localStorage.setItem(OPTS_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  if (!ct) return null;
  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href={`#/${lesson.slug}/cards`}>
          {t('print.back')}
        </a>
        <div className="print-variant" role="group">
          <a className="btn ghost" href={`#/${lesson.slug}/print`}>
            {t('print.worksheet')}
          </a>
          <span className="btn gold" aria-current="page">
            {t('cards.tab')}
          </span>
        </div>
        <div className="print-opts" role="group" aria-label={t('print.options')}>
          {(
            [
              ['cards', 'print.memoCards'],
              ['info', 'print.memoInfo'],
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
        <PrintLogo />
        <header className="pm-head">
          <div className="p-heb he">{lesson.hebrewTitle}</div>
          <h1>
            {t('cards.title')} · {text.title}
          </h1>
          <p>{ct.intro}</p>
          <p>{t('cards.printIntro')}</p>
        </header>

        {opt.cards && (
          <>
            <CardPage title={t('cards.verseCards')}>
              {cards.items.map((it, k) => (
                <div key={k} className="pm-card pm-words">
                  <span className="pm-verse he">{displayNames(it.verse)}</span>
                  <span className="pm-tr">{ct.items[k].verse}</span>
                  <span className="pm-copy">© mychitas.app 5787</span>
                </div>
              ))}
            </CardPage>
            <CardPage title={t('cards.explCards')}>
              {ct.items.map((it, k) => (
                <div key={k} className="pm-card pm-expl">
                  <span className="pm-expl-mark">✦</span>
                  <span className="pm-expl-t">{it.card}</span>
                  <span className="pm-copy">© mychitas.app 5787</span>
                </div>
              ))}
            </CardPage>
          </>
        )}

        {opt.info && (
          <section className="pm-info">
            <h2>{t('memo.explanations')}</h2>
            {cards.items.map((it, k) => (
              <CardInfo key={k} item={it} text={ct.items[k]} n={k + 1} />
            ))}
          </section>
        )}

        <footer className="p-foot">
          <PrintPartners />
          <p className="p-holy">{t('print.holy')}</p>
          {SITE_HOST} · {t('memo.shabbat')} · © mychitas.app 2026
        </footer>
      </article>
    </div>
  );
}
