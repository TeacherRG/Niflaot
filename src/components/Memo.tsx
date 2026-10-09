import { useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import type { Lesson, MemoData, MemoItem, MemoItemText, MemoText } from '../lessons/types';
import { gematriaLines, lettersLine, memoImages } from '../core/memo';
import { displayNames } from '../core/names';
import { formatTime } from '../core/format';
import { SOURCES, sourceLabel } from '../sources';
import { HebrewRuns } from './Hebrew';
import { Icon, Sheet } from './ui';
import { EASY, usePairsGame, type Card } from '../core/usePairsGame';

/**
 * Memo — the second game of a commentary lesson. A pair is a picture and the Torah words it tells about; under the
 * board every picture of the game is explained («Что на картинках»); a found pair opens its explanation.
 */

/** One comment explained: picture, the Torah words, the commentary, «Знаете ли вы?», the numbers, «Чему это учит?». */
export function MemoInfo({ item, text, n, img, here }: { item: MemoItem; text: MemoItemText; n: number; img?: string; here?: boolean }) {
  const { t, locale } = useI18n();
  const src = SOURCES[item.source];
  return (
    <div className={`mi${here ? ' here' : ''}`} id={here !== undefined ? `memo-pair-${n}` : undefined}>
      <div className="mi-top">
        {img && <img className="mi-img" src={img} alt={text.caption} loading="lazy" />}
        <div className="mi-head">
          <span className="mi-n num">{n}</span>
          <h3>{text.title}</h3>
          <div className="mi-verse he">{displayNames(item.verse)}</div>
          <div className="mi-verse-tr">{text.verse}</div>
        </div>
      </div>
      <div className="mi-block mi-quote">
        <h4>{t('memo.commentary')}</h4>
        <p className="he" dir="rtl">
          {displayNames(item.quote)}
        </p>
        <p className="mi-quote-tr">{text.quote}</p>
        {src && (
          <a className="mi-src" href={src.url} target="_blank" rel="noopener">
            {sourceLabel(src, locale).title}
          </a>
        )}
      </div>
      <div className="mi-block">
        <h4>{t('memo.know')}</h4>
        <p>
          <HebrewRuns text={text.explain} />
        </p>
      </div>
      {item.gematria && (
        <div className="mi-block mi-calc">
          <h4>{t('memo.gematria')}</h4>
          <p className="mi-how">{t('memo.gematriaHow')}</p>
          {item.gematria.map((g, k) => (
            <div key={k} className="mi-eq">
              {gematriaLines(g).map((l, j) => (
                <div key={j}>
                  <HebrewRuns text={l} />
                </div>
              ))}
              {!g.b && text.note && (
                <div className="mi-note">
                  {g.v} = <HebrewRuns text={text.note} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {item.letters && (
        <div className="mi-block mi-calc">
          <h4>{t('memo.lettersTitle')}</h4>
          {item.letters.map((l, k) => (
            <div key={k} className="mi-eq">
              <span className="mi-kind">
                <HebrewRuns text={t(`memo.kind.${l.kind}`)} />
              </span>
              <span>
                <HebrewRuns text={lettersLine(l)} />
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="mi-block mi-moral">
        <h4>{t('memo.learn')}</h4>
        <p>{text.moral}</p>
      </div>
    </div>
  );
}

/** The face of a card: the picture alone, or the Torah words with a translation. */
function Face({ card, item, text, img }: { card: Card; item: MemoItem; text: MemoItemText; img?: string }) {
  return card.a ? (
    <span className="mc-pic">{img && <img src={img} alt="" draggable={false} />}</span>
  ) : (
    <span className="mc-words">
      <span className="mc-verse he">{displayNames(item.verse)}</span>
      <span className="mc-tr">{text.verse}</span>
    </span>
  );
}

function MemoCard({
  card,
  item,
  text,
  img,
  open,
  found,
  onClick,
}: {
  card: Card;
  item: MemoItem;
  text: MemoItemText;
  img?: string;
  open: boolean;
  found: boolean;
  onClick: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      className={`mc${open ? ' open' : ''}${found ? ' found' : ''}`}
      onClick={onClick}
      disabled={open}
      aria-label={
        open
          ? card.a
            ? t('memo.cardPic', { caption: text.caption })
            : t('memo.cardWords', { words: `${displayNames(item.verse)} — ${text.verse}` })
          : t('memo.closed')
      }
    >
      <span className="mc-in">
        <span className="mc-back" aria-hidden="true">
          <span>✦</span>
        </span>
        <span className="mc-face" aria-hidden="true">
          <Face card={card} item={item} text={text} img={img} />
        </span>
      </span>
    </button>
  );
}

export function Memo({ lesson, memo, text, at }: { lesson: Lesson; memo: MemoData; text: MemoText; at?: number }) {
  const { t } = useI18n();
  const images = useMemo(() => memoImages(lesson), [lesson]);
  const total = memo.items.length;
  const { screen, go, play, pairs, cards, open, found, moves, ms, shown, flip, closeInfo, box } = usePairsGame(total, at ? 'study' : 'home');

  // a link to one pair: open it in «Изучите пары»
  useEffect(() => {
    if (!at) return;
    const id = requestAnimationFrame(() => document.getElementById(`memo-pair-${at}`)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(id);
  }, [at]);

  const example = 0;
  const rules = (
    <div className="memo-rules">
      <h3>{t('memo.rules')}</h3>
      <ol>
        {(['memo.rule1', 'memo.rule2', 'memo.rule3', 'memo.rule4', 'memo.rule5'] as const).map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ol>
      <div className="memo-example">
        <div className="memo-example-lbl">{t('memo.example')}</div>
        <div className="memo-example-cards">
          {[true, false].map((pic) => (
            <span key={String(pic)} className="mc mc-sample">
              <span className="mc-in">
                <span className="mc-face">
                  <Face card={{ p: example, a: pic }} item={memo.items[example]} text={text.items[example]} img={images[example]} />
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="memo" ref={box} aria-labelledby="memo-h">
      <header className="memo-head">
        <h2 id="memo-h">{t('memo.title')}</h2>
        {(screen === 'home' || screen === 'rules') && (
          <>
            <p className="memo-intro">{text.intro}</p>
            <p className="memo-goal">{t('memo.goal')}</p>
          </>
        )}
      </header>

      {screen === 'home' && (
        <>
          <ol className="memo-steps">
            {(
              [
                ['memo.step1', 'memo.step1Note', () => go('study')],
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
            <a className="btn ghost" href={`#/${lesson.slug}/print/memo`}>
              <Icon name="print" size={18} />
              {t('memo.print')}
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
            {memo.items.map((it, k) => (
              <MemoInfo key={k} item={it} text={text.items[k]} n={k + 1} img={images[k]} here={at === k + 1} />
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
            {cards.map((c, i) => (
              <MemoCard
                key={i}
                card={c}
                item={memo.items[c.p]}
                text={text.items[c.p]}
                img={images[c.p]}
                open={open.includes(i) || found.includes(c.p)}
                found={found.includes(c.p)}
                onClick={() => flip(i)}
              />
            ))}
          </div>
          <div className="memo-legend">
            <h3>{t('memo.legend')}</h3>
            <p className="memo-legend-note">{t('memo.legendNote')}</p>
            <ul>
              {pairs.map((p) => (
                <li key={p} className={found.includes(p) ? 'found' : undefined}>
                  {images[p] && <img src={images[p]} alt="" loading="lazy" />}
                  <span>
                    <b>{text.items[p].title}</b>
                    {text.items[p].caption}
                  </span>
                </li>
              ))}
            </ul>
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
                  {images[p] && <img src={images[p]} alt="" loading="lazy" />}
                  <span>
                    <b>{text.items[p].title}.</b> {text.items[p].moral}
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
              {t('memo.toGematria')}
            </a>
          </div>
          <div className="memo-copy">© mychitas.app 2026</div>
        </div>
      )}

      <Sheet open={shown !== null} onClose={closeInfo} title={t('memo.found')} closeLabel={t('menu.close')}>
        {shown !== null && (
          <>
            <MemoInfo item={memo.items[shown]} text={text.items[shown]} n={shown + 1} img={images[shown]} />
            <button className="btn memo-next" data-autofocus onClick={closeInfo}>
              {found.length === pairs.length ? t('memo.finish') : t('memo.next')} →
            </button>
          </>
        )}
      </Sheet>
    </section>
  );
}
