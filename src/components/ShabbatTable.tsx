import { useEffect } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, PARSHIOT, weekParsha, type Lesson, type ParshaId } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { displayNames } from '../core/names';
import { stripFootnotes } from '../sources/footnotes';
import { tableSheet } from '../core/shabbatTable';
import { SITE_HOST } from '../core/site';
import { Icon } from './ui';
import { PrintMasthead } from './PrintBrand';
import { NotFound } from './PageStates';
import { SLOGAN_HE, Slogan } from './Slogan';

/** Torah words in Hebrew with their translation under them. */
function Verse({ he, tr }: { he: string; tr: string }) {
  return (
    <p className="st-verse">
      <span className="he" lang="he" dir="rtl">
        {displayNames(he)}
      </span>
      <span className="st-tr">«{tr}»</span>
    </p>
  );
}

/** The invitation to play at the end of a talk's intro («Расследуйте вместе с Ребе…») — on paper there is nothing to play. */
const INVITE = /\s*(Расследуйте|Investigate|Ermittle)[^]*$/;

/** The talk of «Нифлаот Ребе» told plainly: its question, then riddle by riddle the Rebbe's answer. */
function Sicha({ lesson }: { lesson: Lesson }) {
  const { pick } = useI18n();
  const tx = pick(lesson.texts).value;
  return (
    <div className="st-sicha">
      <Html as="h3" html={tx.hero.heading} />
      <p className="st-by">{tx.hero.author}</p>
      <p className="st-intro">{tx.hero.intro.replace(INVITE, '')}</p>
      {tx.riddles.map((r, ri) => (
        <div key={ri} className="st-part">
          <h4>{r.title}</h4>
          <p>
            <b>{r.reveal.h}.</b> <Html html={stripFootnotes(r.reveal.p)} />
          </p>
        </div>
      ))}
    </div>
  );
}

/** The Rebbe's explanation of a verse as a short rhymed poem («Запомнить в стихах» of a «Карточки» pair). */
function RebbePoem({ lesson, k }: { lesson: Lesson; k: number }) {
  const { pick } = useI18n();
  const c = pick(lesson.texts).value.cards!.items[k];
  return (
    <li className="st-item">
      <Verse he={lesson.cards!.items[k].verse} tr={c.verse} />
      <p className="st-poem">
        {c.poem.map((line, j) => (
          <span key={j}>{line}</span>
        ))}
      </p>
    </li>
  );
}

/** A gematria of the Baal HaTurim with its explanation and lesson (a Memo pair). */
function Gematria({ lesson, k }: { lesson: Lesson; k: number }) {
  const { t, pick } = useI18n();
  const m = lesson.memo!.items[k];
  const tx = pick(lesson.texts).value.memo!.items[k];
  return (
    <li className="st-item">
      <h4>{tx.title}</h4>
      <div className="st-gline">
        <Verse he={m.verse} tr={tx.verse} />
        {m.gematria!.map((g, j) => (
          <p key={j} className="st-eq" dir="rtl">
            <span className="he" lang="he">
              {displayNames(g.a)}
            </span>
            <span className="st-op">=</span>
            <b className="num">{g.v}</b>
            {g.b && (
              <>
                <span className="st-op">=</span>
                <span className="he" lang="he">
                  {displayNames(g.b)}
                </span>
              </>
            )}
          </p>
        ))}
      </div>
      <p>{tx.explain}</p>
      <p className="st-moral">
        <b>{t('memo.learn')}</b> {tx.moral}
      </p>
    </li>
  );
}

/**
 * `#/shabbat-table[/<глава>]` — «К шабатнему столу»: the Friday sheet of the week's portion (src/core/shabbatTable.ts),
 * to print before Shabbat and read aloud at the table — the Rebbe's talk told plainly, verses of the portion with the
 * Rebbe's explanation, gematrias of the Baal HaTurim with their explanation, questions to talk over, «Ґораа ле-поаль».
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
        </header>

        {sheet.sicha && (
          <section className="p-block">
            <h2 className="st-h2">✦ {t('table.sicha')}</h2>
            <p className="st-note">{t('table.sichaNote')}</p>
            <Sicha lesson={sheet.sicha} />
          </section>
        )}

        {sheet.verses.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">📜 {t('table.verses')}</h2>
            <ol className="st-items poems">
              {sheet.verses.map(({ lesson, k }) => (
                <RebbePoem key={`${lesson.slug}-${k}`} lesson={lesson} k={k} />
              ))}
            </ol>
          </section>
        )}

        {sheet.gematria.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">🔢 {t('table.gematria')}</h2>
            <p className="st-note">{t('table.gematriaNote')}</p>
            <ol className="st-items">
              {sheet.gematria.map(({ lesson, k }) => (
                <Gematria key={`${lesson.slug}-${k}`} lesson={lesson} k={k} />
              ))}
            </ol>
          </section>
        )}

        <div className="st-end">
          <section className="p-block">
            <h2 className="st-h2">💬 {t('table.adults')}</h2>
            <ul className="st-list">
              {sheet.questions.map(({ lesson, ri }) => (
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
        </div>

        <footer className="p-foot">
          <span className="he" lang="he">
            {SLOGAN_HE}
          </span>{' '}
          · {t('app.title')} · {SITE_HOST} · © mychitas.app 5787
        </footer>
      </article>
    </div>
  );
}
