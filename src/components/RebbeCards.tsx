import { useI18n } from '../i18n';
import type { Lesson, RebbeCard, RebbeCardText, RebbeCardsData, RebbeCardsText } from '../lessons/types';
import { displayNames } from '../core/names';
import { formatTime } from '../core/format';
import { SOURCES, sourceLabel, translation } from '../sources';
import { EASY, usePairsGame, type Card } from '../core/usePairsGame';
import { HebrewRuns } from './Hebrew';
import { Icon, Sheet } from './ui';

/**
 * «Карточки» — the second game of a «Нифлаот Ребе» lesson: a pair is a verse of the portion and one explanation
 * of the Rebbe on it (Likkutei Sichos). The way through it is the Memo's: study → 6 pairs → 12 pairs → what we learned.
 */

/** One pair explained: the verse (whole, with translation), the Rebbe's explanation, the practical lesson, where to learn it. */
export function CardInfo({ item, text, n }: { item: RebbeCard; text: RebbeCardText; n: number }) {
  const { t, locale } = useI18n();
  const src = SOURCES[item.source];
  const tr = src && translation(src, item.source, locale);
  return (
    <div className="mi rc-info">
      <div className="mi-head">
        <span className="mi-n num">{n}</span>
        <h3>{text.title}</h3>
        <div className="mi-verse he">{displayNames(item.verse)}</div>
        <div className="mi-verse-tr">{text.verse}</div>
      </div>
      {src && (
        <div className="mi-block mi-quote">
          <h4>{t('cards.verse')}</h4>
          <p className="he" dir="rtl">
            {src.he.join(' ')}
          </p>
          {tr && <p className="mi-quote-tr">{tr.lines.join(' ')}</p>}
          <a className="mi-src" href={src.url} target="_blank" rel="noopener">
            {sourceLabel(src, locale).title}
          </a>
        </div>
      )}
      <div className="mi-block">
        <h4>{t('cards.rebbe')}</h4>
        <p>
          <HebrewRuns text={text.explain} />
        </p>
        <p className="rc-ls">{t('cards.ls', { vol: item.ls.vol, n: item.ls.sicha })}</p>
      </div>
      <div className="mi-block mi-moral">
        <h4>{t('cards.horaah')}</h4>
        <p>
          <HebrewRuns text={text.horaah} />
        </p>
      </div>
    </div>
  );
}

/** The face of a card: the Torah words with a translation, or the Rebbe's explanation in one line. */
function Face({ card, item, text }: { card: Card; item: RebbeCard; text: RebbeCardText }) {
  return card.a ? (
    <span className="mc-words">
      <span className="mc-verse he">{displayNames(item.verse)}</span>
      <span className="mc-tr">{text.verse}</span>
    </span>
  ) : (
    <span className="mc-expl">
      <span className="mc-expl-mark" aria-hidden="true">
        ✦
      </span>
      <span>{text.card}</span>
    </span>
  );
}

export function RebbeCards({ lesson, cards: data, text }: { lesson: Lesson; cards: RebbeCardsData; text: RebbeCardsText }) {
  const { t } = useI18n();
  const total = data.items.length;
  const { screen, go, play, pairs, cards, open, found, moves, ms, shown, flip, closeInfo, box } = usePairsGame(total);

  const rules = (
    <div className="memo-rules">
      <h3>{t('memo.rules')}</h3>
      <ol>
        {(['cards.rule1', 'cards.rule2', 'cards.rule3', 'memo.rule4', 'cards.rule5'] as const).map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ol>
      <div className="memo-example">
        <div className="memo-example-lbl">{t('memo.example')}</div>
        <div className="memo-example-cards">
          {[true, false].map((a) => (
            <span key={String(a)} className="mc mc-sample">
              <span className="mc-in">
                <span className="mc-face">
                  <Face card={{ p: 0, a }} item={data.items[0]} text={text.items[0]} />
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="memo rc" ref={box} aria-labelledby="cards-h">
      <header className="memo-head">
        <h2 id="cards-h">{t('cards.title')}</h2>
        {(screen === 'home' || screen === 'rules') && (
          <>
            <p className="memo-intro">{text.intro}</p>
            <p className="memo-goal">{t('cards.goal')}</p>
          </>
        )}
      </header>

      {screen === 'home' && (
        <>
          <ol className="memo-steps">
            {(
              [
                ['memo.step1', 'cards.step1Note', () => go('study')],
                ['memo.step2', 'memo.step2Note', () => play(EASY)],
                ['memo.step3', 'memo.step3Note', () => play(total)],
              ] as const
            ).map(([h, note, on], k) => (
              <li key={h}>
                <button className="memo-step" onClick={on}>
                  <span className="memo-step-n num">{k + 1}</span>
                  <span className="memo-step-h">{t(h)}</span>
                  <span className="memo-step-note">{t(note)}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="memo-links">
            <button className="btn ghost" onClick={() => go('rules')}>
              <Icon name="help" size={18} />
              {t('memo.rules')}
            </button>
            <a className="btn ghost" href={`#/${lesson.slug}/print/cards`}>
              <Icon name="print" size={18} />
              {t('cards.print')}
            </a>
          </div>
        </>
      )}

      {screen === 'rules' && (
        <>
          {rules}
          <div className="memo-links">
            <button className="btn" onClick={() => go('study')}>
              1 · {t('memo.step1')}
            </button>
            <button className="btn ghost" onClick={() => play(EASY)}>
              2 · {t('memo.step2')}
            </button>
            <button className="btn ghost" onClick={() => go('home')}>
              {t('memo.menu')}
            </button>
          </div>
        </>
      )}

      {screen === 'study' && (
        <>
          <div className="memo-study">
            {data.items.map((it, k) => (
              <CardInfo key={k} item={it} text={text.items[k]} n={k + 1} />
            ))}
          </div>
          <div className="memo-links">
            <button className="btn" onClick={() => play(EASY)}>
              2 · {t('memo.step2')} — {t('memo.step2Note')}
            </button>
            <button className="btn ghost" onClick={() => go('home')}>
              {t('memo.menu')}
            </button>
          </div>
        </>
      )}

      {screen === 'game' && (
        <>
          <div className="memo-stats">
            <span>{t('memo.pairs', { found: found.length, total: pairs.length })}</span>
            <span>{t('memo.moves', { n: moves })}</span>
            <span>⏱ {formatTime(ms)}</span>
            <button className="btn ghost" onClick={() => go('home')}>
              {t('memo.menu')}
            </button>
          </div>
          <div className={`memo-board${pairs.length > EASY ? ' full' : ''}`}>
            {cards.map((c, i) => {
              const item = data.items[c.p];
              const tx = text.items[c.p];
              const isOpen = open.includes(i) || found.includes(c.p);
              return (
                <button
                  key={i}
                  className={`mc${isOpen ? ' open' : ''}${found.includes(c.p) ? ' found' : ''}`}
                  onClick={() => flip(i)}
                  disabled={isOpen}
                  aria-label={
                    isOpen
                      ? c.a
                        ? t('cards.cardVerse', { words: `${displayNames(item.verse)} — ${tx.verse}` })
                        : t('cards.cardExpl', { text: tx.card })
                      : t('memo.closed')
                  }
                >
                  <span className="mc-in">
                    <span className="mc-back" aria-hidden="true">
                      <span>✦</span>
                    </span>
                    <span className="mc-face" aria-hidden="true">
                      <Face card={c} item={item} text={tx} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {screen === 'end' && (
        <div className="memo-end">
          <div className="memo-bravo">{t('memo.bravo')}</div>
          <p>{t('memo.allFound', { n: pairs.length, moves, time: formatTime(ms) })}</p>
          <div className="memo-review">
            <h3>{t('memo.review')}</h3>
            <ul>
              {pairs.map((p) => (
                <li key={p}>
                  <span className="rc-review-he he">{displayNames(data.items[p].verse)}</span>
                  <span>
                    <b>{text.items[p].title}.</b> <HebrewRuns text={text.items[p].horaah} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="memo-shabbat">{t('memo.shabbat')}</div>
          <div className="memo-links">
            {pairs.length < total && (
              <button className="btn" onClick={() => play(total)}>
                {t('memo.full')}
              </button>
            )}
            <button className={`btn${pairs.length < total ? ' ghost' : ''}`} onClick={() => play(pairs.length)}>
              {t('memo.again')}
            </button>
            <a className="btn ghost" href={`#/${lesson.slug}`}>
              {t('cards.toLesson')}
            </a>
          </div>
          <div className="memo-copy">© mychitas.app 2026</div>
        </div>
      )}

      <Sheet open={shown !== null} onClose={closeInfo} title={t('memo.found')} closeLabel={t('menu.close')}>
        {shown !== null && (
          <>
            <CardInfo item={data.items[shown]} text={text.items[shown]} n={shown + 1} />
            <button className="btn memo-next" data-autofocus onClick={closeInfo}>
              {found.length === pairs.length ? t('memo.finish') : t('memo.next')} →
            </button>
          </>
        )}
      </Sheet>
    </section>
  );
}
