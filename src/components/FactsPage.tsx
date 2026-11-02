import { useEffect, useMemo, useState } from 'react';
import { SITE_HOST, routeLink } from '../core/site';
import { renderFactCard, shareOrSave, type FactAnswerPart } from '../core/shareCard';
import { useI18n } from '../i18n';
import { LESSONS, lessonsByNearness } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { NUMS, collectFacts, factMeaning, type Fact } from '../core/facts';
import { HebrewRuns } from './Hebrew';
import { displayNames } from '../core/names';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { DailyCard } from './DailyCard';
import { CardFeed } from './CardFeed';

/** Hebrew words in large type with their translations under them (each term of a sum separately). */
function Words({ he, gloss }: { he: string; gloss: Record<string, string> }) {
  const terms = he.split(' + ');
  return (
    <span className="fact-words">
      {terms.map((w, k) => (
        <span key={k} className="fact-term">
          {k > 0 && <span className="fact-op">+</span>}
          <span className="fact-w">
            <span className="he" lang="he">
              {displayNames(w)}
            </span>
            <small>{gloss[w]}</small>
          </span>
        </span>
      ))}
    </span>
  );
}

function FactCard({ f, here }: { f: Fact; here?: boolean }) {
  const { t, pick, locale } = useI18n();
  const text = pick(f.lesson.texts).value;
  const who = teacherOf(f.lesson);
  const base = `#/${f.lesson.slug}`;
  const [card, setCard] = useState<'idle' | 'making' | 'saved'>('idle');
  // what the answer means — not just the number: the pair's explanation and «Чему это учит?» (owner, 01.11.2026)
  const meaning = factMeaning(f, text);
  // «Последние буквы слов עם האיש הזה» — when the meaning doesn't say where the word was taken from
  const fromLine = f.kind !== 'eq' && !meaning.text?.includes(f.from) ? `${t(`facts.from.${f.take}`)} ${displayNames(f.from)}` : undefined;
  const why = f.ri !== undefined ? `${base}/read/${f.ri + 1}` : f.mi !== undefined ? `${base}/memo/${f.mi + 1}` : base;

  /** «Поделиться загадкой»: the riddle and its answer as a picture signed with the site; why it is so — behind the link. */
  const share = async () => {
    setCard('making');
    try {
      const gloss = (h: string) =>
        h
          .split(' + ')
          .map((w) => text.glossary[w])
          .filter(Boolean)
          .join(' · ');
      const answer: FactAnswerPart[] =
        f.kind === 'eq'
          ? [
              { he: displayNames(f.q), gloss: gloss(f.q) },
              ...f.rest.map((p): FactAnswerPart => (NUMS.test(p) ? { op: '=', num: p } : { op: '=', he: displayNames(p), gloss: gloss(p) })),
            ]
          : [{ he: displayNames(f.word), gloss: gloss(f.word) }];
      // plain text; each run of Hebrew words isolated right-to-left (U+2067…U+2069), as <HebrewRuns> on the screen —
      // else the canvas reorders «ם, ש, ה — משה» together with the punctuation around it
      const plain = (h?: string) =>
        h &&
        displayNames(h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).replace(
          /[א-ת][א-ת׳״־]*(?:\s[א-ת][א-ת׳״־]*)*/g,
          (m) => `\u2067${m}\u2069`,
        );
      const moralLabel = meaning.moral ? (meaning.moralLabel ?? t('memo.learn')) : undefined;
      const blob = await renderFactCard({
        eyebrow: `${t('app.title')} · ${t('facts.title')}`,
        // «Бааль ґа-Турим · Бааль ґа-Турим: Берешит» — the teacher only when the title doesn't name him
        source: text.title.includes(t(`teacher.${who}.short`)) ? text.title : `${t(`teacher.${who}.short`)} · ${text.title}`,
        answer,
        from: fromLine,
        title: meaning.title,
        text: plain(meaning.text),
        moralLabel,
        moral: plain(meaning.moral),
        why: t('facts.cardLesson'),
        site: SITE_HOST,
        tagline: t('facts.cardTagline'),
      });
      const said = answer.map((p) => `${p.op ?? ''} ${p.num ?? p.he}`.trim()).join(' ');
      const res = await shareOrSave(
        blob,
        `niflaot-${f.id}.png`,
        [said, meaning.title, moralLabel && `${moralLabel} ${plain(meaning.moral)}`, `${t('facts.shareText')} 👉 ${routeLink(`facts/${f.id}`, 'card', locale)}`]
          .filter(Boolean)
          .join('\n'),
      );
      setCard(res === 'saved' ? 'saved' : 'idle');
      if (res === 'saved') setTimeout(() => setCard('idle'), 2500);
    } catch {
      setCard('idle');
    }
  };

  return (
    <article className={`fact t-${TEACHERS[who].color}${here ? ' here' : ''}`} id={f.id}>
      {/* the answer at once — a question card was unclear and dull (owner, 02.11.2026) */}
      <div className="fact-ans">
        {f.kind === 'eq' ? (
          <span className="fact-part">
            <Words he={f.q} gloss={text.glossary} />
            {f.rest.map((p, k) => (
              <span key={k} className="fact-part">
                <span className="fact-op">=</span>
                {NUMS.test(p) ? <b className="num">{p}</b> : <Words he={p} gloss={text.glossary} />}
              </span>
            ))}
          </span>
        ) : (
          <Words he={f.word} gloss={text.glossary} />
        )}
      </div>
      {meaning.title && <h3 className="fact-point">{meaning.title}</h3>}
      {fromLine && f.kind !== 'eq' && (
        <p className="fact-from">
          {t(`facts.from.${f.take}`)} <span className="he" lang="he">{displayNames(f.from)}</span>
        </p>
      )}
      {meaning.text && (
        <p className="fact-mean">
          <HebrewRuns text={meaning.text} />
        </p>
      )}
      {meaning.moral && (
        <p className="fact-moral">
          <b>{meaning.moralLabel ?? t('memo.learn')}</b> <HebrewRuns text={meaning.moral} />
        </p>
      )}
      <div className="fact-foot">
        <a href={why}>{t('facts.why')} →</a>
        <span className="fact-src">{text.title}</span>
        <button
          className="btn ghost fact-share"
          onClick={share}
          disabled={card === 'making'}
          aria-label={t('facts.share')}
          title={t('facts.share')}
        >
          📤{card === 'making' ? ` ${t('final.cardMaking')}` : card === 'saved' ? ` ${t('final.cardSaved')}` : ''}
        </button>
      </div>
    </article>
  );
}

/**
 * «Знаете ли вы?» — every equality and letter hint of the lessons as a feed: the answer at once (the word or the equality),
 * what it means and «Чему это учит?»; «Почему так?» leads to the lesson where it is explained.
 */
/** `at` — the fact a shared link points to (`#/facts/<id>`), or `daily` («Гематрия дня», `#/daily`): the feed opens on it. */
export function FactsPage({ at }: { at?: string }) {
  const { t } = useI18n();
  const lessons = useMemo(() => lessonsByNearness(), []);
  // the facts of the lessons nearest to today first (collectFacts itself keeps its order: «Гематрия дня» draws on it)
  const facts = useMemo(() => {
    const all = collectFacts(LESSONS);
    return lessons.flatMap((l) => all.filter((f) => f.lesson === l));
  }, [lessons]);
  const showCards = at === 'cards';

  useEffect(() => {
    document.title = `${t('facts.title')} · ${t('app.title')}`;
  }, [t]);

  useEffect(() => {
    if (!at || showCards) return;
    const id = requestAnimationFrame(() => document.getElementById(at)?.scrollIntoView({ block: at === 'daily' ? 'start' : 'center' }));
    return () => cancelAnimationFrame(id);
  }, [at, showCards]);

  return (
    <>
      <TopBar title={t('facts.title')} />
      <div className="wrap">
        <header className="facts-head">
          <h1>{t('facts.title')}</h1>
          <p>{showCards ? t('facts.cardsIntro') : t('facts.intro', { n: facts.length })}</p>
        </header>
        <nav className="facts-tabs" aria-label={t('facts.feedSwitch')}>
          <a href="#/facts" aria-current={!showCards ? 'page' : undefined}>{t('facts.riddlesTab')}</a>
          <a href="#/facts/cards" aria-current={showCards ? 'page' : undefined}>{t('facts.cardsTab')}</a>
        </nav>
        {showCards ? (
          <CardFeed lessons={lessons} />
        ) : (
          <>
            <DailyCard />
            <main className="facts">
              {facts.map((f) => (
                <FactCard key={f.id} f={f} here={f.id === at} />
              ))}
            </main>
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}
