import { useEffect } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, PARSHIOT, weekParsha, type ParshaId } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { NUMS, type Fact } from '../core/facts';
import { VALUES } from '../core/gematria';
import { letterName } from '../core/letterNames';
import { displayNames } from '../core/names';
import { stripFootnotes } from '../sources/footnotes';
import { tableSheet } from '../core/shabbatTable';
import { SITE_HOST } from '../core/site';
import { Icon } from './ui';
import { PrintMasthead } from './PrintBrand';
import { NotFound } from './PageStates';
import { SLOGAN_HE, Slogan } from './Slogan';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));

/** Hebrew words with their translations, each term of a sum separately; `ask` — ends with «?». */
function Words({ he, gloss, ask }: { he: string; gloss: Record<string, string>; ask?: boolean }) {
  const terms = he.split(' + ');
  return (
    <>
      {terms.map((w, k) => (
        <span key={k} className="st-w">
          {k > 0 && <span className="st-op">+</span>}
          <span className="he" lang="he">
            {displayNames(w)}
            {ask && k === terms.length - 1 && <span className="st-ask">?</span>}
          </span>
          {gloss[w] && <small>{gloss[w]}</small>}
        </span>
      ))}
    </>
  );
}

/** A riddle of «Знаете ли вы?» for the children: the question, the Hebrew with its translation, a line to write the answer. */
function Riddle({ f, n }: { f: Fact; n: number }) {
  const { t, pick } = useI18n();
  const gloss = pick(f.lesson.texts).value.glossary;
  return (
    <li className="st-riddle">
      <span className="st-n">{n}</span>
      <div>
        <p className="st-q">{f.kind === 'eq' ? t('facts.qEq') : t(`facts.qLt.${f.take}`)}</p>
        <p className="st-he">
          <Words he={f.kind === 'eq' ? f.q : f.from} gloss={gloss} ask />
        </p>
        <p className="st-line">{t(f.kind === 'eq' ? 'table.count' : 'table.word')} ______________</p>
      </div>
    </li>
  );
}

/** The answer of a riddle, for the foot of the sheet: no calculations, only the value and the equal words. */
function Answer({ f, n }: { f: Fact; n: number }) {
  const { pick } = useI18n();
  const gloss = pick(f.lesson.texts).value.glossary;
  return (
    <li>
      <b>{n}.</b>{' '}
      {f.kind === 'eq' ? (
        f.rest.map((p, k) => (
          <span key={k}>
            {k > 0 && ' = '}
            {NUMS.test(p) ? <b className="num">{p}</b> : <Words he={p} gloss={gloss} />}
          </span>
        ))
      ) : (
        <Words he={f.word} gloss={gloss} />
      )}
    </li>
  );
}

/**
 * `#/shabbat-table[/<глава>]` — «К шабатнему столу»: the Friday sheet of the week's portion (src/core/shabbatTable.ts),
 * to print before Shabbat and read aloud at the table — riddles for the children, the investigations of the Rebbe,
 * questions for the adults, «Ґораа ле-поаль», the Memo games to print; the answers upside down at the foot.
 */
export function ShabbatTable({ parsha }: { parsha?: string }) {
  const { t, pick, locale } = useI18n();
  const id = (parsha && parsha in PARSHIOT ? parsha : weekParsha()) as ParshaId;
  const sheet = tableSheet(id);
  const p = PARSHIOT[id];
  const name = p.name[locale as keyof typeof p.name] ?? p.name.ru;

  useEffect(() => {
    document.title = `${t('table.title')} · ${name} · ${t('app.title')}`;
  }, [t, name]);

  if (!sheet) return <NotFound />;
  const groups = LESSON_GROUPS.filter((g) => tableSheet(g.id));
  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href="#/">
          {t('table.back')}
        </a>
        {groups.length > 1 && (
          <label className="print-opts">
            {t('table.parsha')}
            <select value={id} onChange={(e) => (location.hash = `#/shabbat-table/${e.target.value}`)}>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name[locale as keyof typeof g.name] ?? g.name.ru}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="btn" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {t('print.print')}
        </button>
      </div>
      <p className="st-tip no-print">{t('table.tip')}</p>

      <article className="sheet-paper st">
        <PrintMasthead parsha={id} route={sheet.lessons[0].slug} />
        <header className="st-head">
          <p className="p-label">{t('table.kicker')}</p>
          <h1>
            {t('table.title')} · {name}
          </h1>
          <p className="st-tag">
            <Slogan />
          </p>
          <p className="st-how">{t('table.how')}</p>
        </header>

        {sheet.facts.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">🧒 {t('table.kids')}</h2>
            <p className="st-note">{t('table.kidsNote')}</p>
            <ol className="st-riddles">
              {sheet.facts.map((f, k) => (
                <Riddle key={f.id} f={f} n={k + 1} />
              ))}
            </ol>
            <div className="p-letters-block">
              <h3 className="p-label">{t('print.letters')}</h3>
              <div className="p-table" dir="rtl">
                {TABLE.map(([c, v]) => (
                  <span key={c}>
                    <b>{c}</b>
                    <i>{v}</i>
                    <small className="ln">{letterName(c, locale)}</small>
                  </span>
                ))}
              </div>
              <p className="p-finals">
                {t('print.finals')}{' '}
                <span className="he" dir="rtl">
                  ך = כ · ם = מ · ן = נ · ף = פ · ץ = צ
                </span>
              </p>
            </div>
          </section>
        )}

        {sheet.rebbe.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">✦ {t('table.rebbe')}</h2>
            <p className="st-note">{t('table.rebbeNote')}</p>
            {sheet.rebbe.map(({ lesson, ri }) => {
              const r = pick(lesson.texts).value.riddles[ri];
              return (
                <div key={`${lesson.slug}-${ri}`} className="st-inv">
                  <h3>{r.title}</h3>
                  <Html as="div" className="p-cond" html={stripFootnotes(r.cond)} />
                  <p className="st-line">{t('table.think')}</p>
                </div>
              );
            })}
          </section>
        )}

        <section className="p-block">
          <h2 className="st-h2">💬 {t('table.adults')}</h2>
          <ul className="st-list">
            {sheet.reflections.map(({ lesson, ri }) => (
              <li key={`${lesson.slug}-${ri}`}>{pick(lesson.texts).value.riddles[ri].reflection}</li>
            ))}
          </ul>
        </section>

        <section className="p-block">
          <h2 className="st-h2">✋ {t('table.practice')}</h2>
          <ul className="st-list">
            {sheet.lessons.map((l) => {
              const tx = pick(l.texts).value;
              return (
                <li key={l.slug}>
                  <b>{t(`teacher.${teacherOf(l)}.short`)}:</b> {tx.practice}
                </li>
              );
            })}
          </ul>
        </section>

        {sheet.memo.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">🃏 {t('table.memo')}</h2>
            <p className="st-note">
              {t('table.memoNote')}{' '}
              {sheet.memo.map((l, k) => (
                <span key={l.slug}>
                  {k > 0 && ' · '}
                  <a href={`#/${l.slug}/print/memo`}>
                    {SITE_HOST}/#/{l.slug}/print/memo
                  </a>
                </span>
              ))}
            </p>
          </section>
        )}

        {sheet.facts.length > 0 && (
          <section className="st-answers" aria-label={t('table.answers')}>
            <div>
              <h3 className="p-label">{t('table.answers')}</h3>
              <ol>
                {sheet.facts.map((f, k) => (
                  <Answer key={f.id} f={f} n={k + 1} />
                ))}
              </ol>
              <p>{t('table.why')}</p>
            </div>
          </section>
        )}

        <footer className="p-foot">
          <span className="he" lang="he">{SLOGAN_HE}</span> · {t('app.title')} · {SITE_HOST} · © mychitas.app 5787
        </footer>
      </article>
    </div>
  );
}
