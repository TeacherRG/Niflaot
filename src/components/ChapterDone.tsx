import { useI18n } from '../i18n';
import { LESSON_GROUPS, type Lesson } from '../lessons';
import { chapterDay, dayDate, isMarked, setTorahDone, useTorahDone, weekdayName, dayMonth, type TorahToday } from '../core/torahDaily';
import { teacherOf } from '../lessons/teachers';

/**
 * «Я прочитал(а) эту главу» at the end of a chapter of «Читать» / «Беседа» (src/core/torahDaily.ts) and its day in the plan
 * of the week («Тора на каждый день»: Sunday … Friday), with a link to the plan.
 */
export function ChapterDone({ lesson, ri }: { lesson: Lesson; ri: number }) {
  const { t, locale } = useI18n();
  const store = useTorahDone();
  const on = isMarked(store, lesson.slug, ri);
  const k = chapterDay(lesson, ri);
  const g = LESSON_GROUPS.find((x) => x.id === lesson.parsha);
  const date = g && k >= 0 ? dayDate(g, k) : undefined;
  return (
    <div className={`tk-done td-done no-print no-speak${on ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={on} onChange={(e) => setTorahDone(lesson.slug, ri, e.target.checked)} />
        <span>{t('td.doneCheck')}</span>
      </label>
      {date && (
        <p>
          {t('td.planDay', { day: `${weekdayName(date, locale)}, ${dayMonth(date, locale)}` })} ·{' '}
          <a href={`#/torah/${lesson.parsha}`}>{t('td.weekLink')}</a>
        </p>
      )}
    </div>
  );
}

/** Today's chapters in one line — «Бааль ґа-Турим · гл. 2, Нифлаот Ребе · гл. 1» — or ✓ when they are all done. */
export function torahLine(tt: TorahToday, t: ReturnType<typeof useI18n>['t']): string {
  if (tt.chapters.length && tt.done >= tt.chapters.length) return t('td.homeDone');
  // in the order of the day: Baal HaTurim (his chapter or his Memo pairs) first
  const parts = [
    ...tt.pairs.map((p) => t('td.homePairs', { who: t(`teacher.${teacherOf(p.lesson)}.short`), list: p.pairs.map((i) => i + 1).join(', ') })),
    ...tt.chapters.map((p) => t('td.homeSub', { who: t(`teacher.${teacherOf(p.lesson)}.short`), n: p.ri + 1 })),
  ];
  return parts.join(', ');
}
