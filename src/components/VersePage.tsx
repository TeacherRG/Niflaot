import { useEffect } from 'react';
import { useMode } from '../core/mode';
import { useCourses } from '../core/courses';
import { readingPlan } from '../core/tanakh';
import { dayOfVerse } from '../core/citations';
import { gotoVerse } from '../core/notes';
import { NotFound, PageLoading } from './PageStates';

/**
 * `#/verse/<книга>-<глава>-<стих>` — стих Пророков или Писаний (ссылки ИИ-учителя, src/core/citations.ts): открывает
 * день цикла читателя, где этот стих, и прокручивает к нему. Нет такого стиха — «Такой страницы нет».
 */
export function VersePage({ id }: { id: string }) {
  const plan = readingPlan(useCourses(useMode()));
  const m = id.match(/^([a-z-]+)-(\d+)-(\d+)$/);
  const at = m ? dayOfVerse(m[1], Number(m[2]), Number(m[3]), plan.days) : null;
  useEffect(() => {
    if (!at || !m) return;
    gotoVerse(`v-${m[1]}-${m[2]}-${m[3]}`);
    location.replace(`#/${at.section}/${at.date}`);
  }, [at?.section, at?.date]);
  return at ? <PageLoading /> : <NotFound />;
}
