import { useEffect } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, RebbeCardsData } from '../lessons/types';
import { displayNames } from '../core/names';
import { TopBar } from './TopBar';
import { CardInfo } from './RebbeCards';
import { HebrewRuns } from './Hebrew';
import { Colophon } from './Colophon';

export type CardsReadMode = 'read' | 'poem';

/**
 * `#/<slug>/read` — «Прочитать» of a «Нифлаот Ребе» lesson: every verse with the Rebbe's explanation, in a row;
 * `#/<slug>/read/poem` — «Запомнить в стихах»: the same pairs as short rhymed poems. A switch at the top.
 */
export function CardsReadPage({ lesson, cards, mode }: { lesson: Lesson; cards: RebbeCardsData; mode: CardsReadMode }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);
  const items = text.cards?.items ?? [];

  useEffect(() => {
    document.title = `${t(mode === 'poem' ? 'cards.modePoem' : 'cards.tabRead')} · ${text.title} · ${t('app.title')}`;
  }, [mode, text.title, t]);

  return (
    <>
      <TopBar title={text.title} />
      <div className="wrap">
        {textLocale !== locale && <div className="fallback-note">{t('catalog.fallback')}</div>}
        <div className="memo-page-head">
          <div className="heb gold-text">{lesson.hebrewTitle}</div>
          <h1>{text.title}</h1>
        </div>
        <nav className="seg" aria-label={t('cards.tabRead')}>
          {(['read', 'poem'] as const).map((m) => (
            <a
              key={m}
              href={`#/${lesson.slug}/read${m === 'poem' ? '/poem' : ''}`}
              className={m === mode ? 'on' : undefined}
              aria-current={m === mode ? 'page' : undefined}
            >
              {m === 'read' ? '📖' : '🎵'} {t(m === 'read' ? 'cards.modeRead' : 'cards.modePoem')}
            </a>
          ))}
        </nav>
        <p className="read-intro">{t(mode === 'poem' ? 'cards.poemIntro' : 'cards.readIntro')}</p>

        {mode === 'read' ? (
          <div className="memo-study">
            {cards.items.map((it, k) => items[k] && <CardInfo key={k} item={it} text={items[k]} n={k + 1} />)}
          </div>
        ) : (
          <div className="poems">
            {cards.items.map(
              (it, k) =>
                items[k] && (
                  <article key={k} className="poem">
                    <div className="poem-head">
                      <span className="mi-n num">{k + 1}</span>
                      <h3>{items[k].title}</h3>
                    </div>
                    <div className="poem-verse">
                      <span className="he" lang="he">
                        {displayNames(it.verse)}
                      </span>
                      <span>{items[k].verse}</span>
                    </div>
                    <p className="poem-lines">
                      {items[k].poem.map((l, j) => (
                        <span key={j}>
                          <HebrewRuns text={l} />
                        </span>
                      ))}
                    </p>
                    <p className="rc-ls">{t('cards.ls', { vol: it.ls.vol, n: it.ls.sicha })}</p>
                  </article>
                ),
            )}
          </div>
        )}

        <section className="memo-cta">
          <span aria-hidden="true">🃏</span>
          <p>{t('cards.readCta')}</p>
          <a className="btn" href={`#/${lesson.slug}/cards`}>
            {t('cards.ctaBtn')} →
          </a>
        </section>
      </div>
      <Colophon source={text.source} />
    </>
  );
}
