import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { NUMS, collectFacts, type Fact } from '../core/facts';
import { displayNames } from '../core/names';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

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

function FactCard({ f }: { f: Fact }) {
  const { t, pick } = useI18n();
  const [open, setOpen] = useState(false);
  const text = pick(f.lesson.texts).value;
  const who = teacherOf(f.lesson);
  const why = f.game === 'memo' ? `#/${f.lesson.slug}/memo` : `#/${f.lesson.slug}`;

  return (
    <article className={`fact t-${TEACHERS[who].color}`} id={f.id}>
      <div className="fact-src">
        <span className="h-badge">{t(`teacher.${who}.short`)}</span>
        {text.title}
      </div>
      <p className="fact-q">
        {f.kind === 'eq' ? t('facts.qEq') : t(`facts.qLt.${f.take}`)}
      </p>
      <div className="fact-he">
        <Words he={f.kind === 'eq' ? f.q : f.from} gloss={text.glossary} ask />
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
      <div className="fact-links">
        <a href={why}>{t(f.game === 'memo' ? 'facts.whyMemo' : 'facts.why')} →</a>
        <a href={`#/${f.lesson.slug}/read`}>📖 {t('facts.read')}</a>
      </div>
    </article>
  );
}

/**
 * «Знаете ли вы?» — every equality and letter hint of the lessons as a feed of short questions, without explanations:
 * the answer opens on a tap, the links lead to the lesson where it is explained.
 */
export function FactsPage() {
  const { t } = useI18n();
  const facts = useMemo(() => collectFacts(LESSONS), []);

  useEffect(() => {
    document.title = `${t('facts.title')} · ${t('app.title')}`;
  }, [t]);

  return (
    <>
      <TopBar title={t('facts.title')} />
      <div className="wrap">
        <header className="facts-head">
          <h1>{t('facts.title')}</h1>
          <p>{t('facts.intro', { n: facts.length })}</p>
        </header>
        <main className="facts">
          {facts.map((f) => (
            <FactCard key={f.id} f={f} />
          ))}
        </main>
      </div>
      <Colophon />
    </>
  );
}
