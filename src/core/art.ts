import type { Lesson } from '../lessons/types';

/**
 * Illustrations of a lesson: src/lessons/NN-<slug>/art/hero.webp (the picture at the top of the lesson, 16:9)
 * and art/riddle-N.webp (a picture above the condition of riddle N). Bundled by Vite; a lesson without them shows none.
 */
const ART = import.meta.glob<string>('../lessons/*/art/*.webp', { eager: true, query: '?url', import: 'default' });

export function lessonArt(lesson: Lesson, name: string): string | undefined {
  const hit = Object.entries(ART).find(([path]) => path.endsWith(`-${lesson.slug}/art/${name}.webp`));
  return hit?.[1];
}
