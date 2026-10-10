import { useEffect, useMemo, useState } from 'react';
import { SITE_HOST, routeLink } from '../core/site';
import { renderFactCard, shareOrSave, type FactAnswerPart } from '../core/shareCard';
import { useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { NUMS, collectFacts, type Fact } from '../core/facts';
import { displayNames } from '../core/names';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { DailyCard } from './DailyCard';

/** Hebrew words in large type with their translations under them (each term of a sum separately); `ask` — ends with «?». */
function Words({ he, gloss, ask }: { he: string; gloss: Record<string, string>; ask?: boolean }) {
  const terms = he.split(' + ');
  return (
    <span className="fact-words">
      {terms.map((w, k) => (
        <span key={k} className="fact-term">
          {k > 0 && <span className="fact-op">+</span>}
          <span className="fact-w">
            <span className="he" lang="he">
              {displayNames(w)}
              {ask && k === terms.length - 1 && <span className="fact-mark"> ?</span>}
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
  const [open, setOpen] = useState(false);
  const text = pick(f.lesson.texts).value;
  const who = teacherOf(f.lesson);
  const base = `#/${f.lesson.slug}`;
  const [card, setCard] = useState<'idle' | 'making' | 'saved'>('idle');
  const question = f.kind === 'eq' ? t('facts.qEq') : t(`facts.qLt.${f.take}`);
  const he = f.kind === 'eq' ? f.q : f.from;

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
          ? f.rest.map((p) => (NUMS.test(p) ? { op: '=', num: p } : { op: '=', he: displayNames(p), gloss: gloss(p) }))
          : [{ op: '→', he: displayNames(f.word), gloss: gloss(f.word) }];
      const blob = await renderFactCard({
        eyebrow: `${t('app.title')} · ${t('facts.title')}`,
        // «Бааль ґа-Турим · Бааль ґа-Турим: Берешит» — the teacher only when the title doesn't name him
        source: text.title.includes(t(`teacher.${who}.short`)) ? text.title : `${t(`teacher.${who}.short`)} · ${text.title}`,
        question,
        hebrew: displayNames(he),
        gloss: gloss(he),
        answerLabel: t('facts.cardAnswerLabel'),
        answer,
        why: t('facts.cardWhy'),
        site: SITE_HOST,
        tagline: t('facts.cardTagline'),
      });
      const said = answer.map((p) => `${p.op} ${p.num ?? p.he}`).join(' ');
      const res = await shareOrSave(
        blob,
        `niflaot-${f.id}.png`,
        `${question} ${displayNames(he)}?\n${t('facts.answer')}: ${said}\n${t('facts.shareText')} 👉 ${routeLink(`facts/${f.id}`, 'card', locale)}`,
      );
      setCard(res === 'saved' ? 'saved' : 'idle');
      if (res === 'saved') setTimeout(() => setCard('idle'), 2500);
    } catch {
      setCard('idle');
    }
  };

  return (
    <article className={`fact t-${TEACHERS[who].color}${here ? ' here' : ''}`} id={f.id}>
      <div className="fact-src">
        <span className="h-badge">{t(`teacher.${who}.short`)}</span>
        {text.title}
      </div>
      <p className="fact-q">{question}</p>
      <div className="fact-he">
        <Words he={he} gloss={text.glossary} ask />
      </div>
      {open ? (
        <div className="fact-a pop">
          {f.kind === 'eq' ? (
            f.rest.map((p, k) => (
              <span key={k} className="fact-part">
                <span className="fact-op">=</span>
                {NUMS.test(p) ? <b className="num">{p}</b> : <Words he={p} gloss={text.glossary} />}
              </span>
            ))
          ) : (
            <span className="fact-part">
              <span className="fact-op">→</span>
              <Words he={f.word} gloss={text.glossary} />
            </span>
          )}
        </div>
      ) : (
        <button className="btn fact-show" onClick={() => setOpen(true)}>
          {t('facts.show')}
        </button>
      )}
      <button className="btn ghost fact-share" onClick={share} disabled={card === 'making'}>
        📤 {card === 'making' ? t('final.cardMaking') : card === 'saved' ? t('final.cardSaved') : t('facts.share')}
      </button>
      <div className="fact-links">
        {f.ri !== undefined && (
          <>
            <a href={`${base}/read/${f.ri + 1}`}>
              📖 {t('facts.where', { n: f.ri + 1 })} <q>{text.riddles[f.ri].title}</q> →
            </a>
            <a href={`${base}/r/${f.ri + 1}`}>🔢 {t('facts.solve')} →</a>
          </>
        )}
        {f.mi !== undefined && text.memo && (
          <a href={`${base}/memo/${f.mi + 1}`}>
            🃏 {t('facts.memo', { n: f.mi + 1 })} <q>{text.memo.items[f.mi].title}</q> →
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * «Знаете ли вы?» — every equality and letter hint of the lessons as a feed of short questions, without explanations:
 * the answer opens on a tap, the links lead to the lesson where it is explained.
 */
/** `at` — the fact a shared link points to (`#/facts/<id>`), or `daily` («Гиматрия дня», `#/daily`): the feed opens on it. */
export function FactsPage({ at }: { at?: string }) {
  const { t } = useI18n();
  const facts = useMemo(() => collectFacts(LESSONS), []);

  useEffect(() => {
    document.title = `${t('facts.title')} · ${t('app.title')}`;
  }, [t]);

  useEffect(() => {
    if (!at) return;
    const id = requestAnimationFrame(() => document.getElementById(at)?.scrollIntoView({ block: at === 'daily' ? 'start' : 'center' }));
    return () => cancelAnimationFrame(id);
  }, [at]);

  return (
    <>
      <TopBar title={t('facts.title')} />
      <div className="wrap">
        <header className="facts-head">
          <h1>{t('facts.title')}</h1>
          <p>{t('facts.intro', { n: facts.length })}</p>
        </header>
        <DailyCard />
        <main className="facts">
          {facts.map((f) => (
            <FactCard key={f.id} f={f} here={f.id === at} />
          ))}
        </main>
      </div>
      <Colophon />
    </>
  );
}
