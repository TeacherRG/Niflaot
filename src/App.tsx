import { useEffect, useMemo, useState } from 'react';
import { findLesson } from './lessons';
import { Catalog } from './components/Catalog';
import { LessonPage } from './components/LessonPage';
import { PrintLesson } from './components/PrintLesson';
import { PrintMemo } from './components/PrintMemo';
import { MemoPage } from './components/MemoPage';
import { ShabbatRest, useShabbatRest } from './components/ShabbatRest';
import { MathPage } from './components/MathPage';
import { OPS, type Op } from './core/mentalMath';
import { Panels } from './components/Panels';
import { TermPopover } from './components/TermPopover';
import { Assistant } from './components/Assistant';
import { setPageState } from './core/assistant';
import { installFootnoteNavigation } from './sources/footnotes';
import { DonateFab, UIContext, type Panel } from './components/ui';
import { useI18n } from './i18n';

import { SITE_HOST } from './core/site';

const SIGNATURE = `\n\n${SITE_HOST}\n©pnimi.org.il\n©mychitas.app`;

/**
 * Hash routing: `#/` — catalog, `#/<lesson-slug>` — lesson, `#/<lesson-slug>/print` — printable version,
 * `#/<lesson-slug>/memo` — the lesson's Memo game, `#/<lesson-slug>/print/memo` — the Memo on paper.
 * Works on any static host. Without a hash, `/<lesson-slug>/` (the static page for search engines,
 * written by scripts/prerender.ts) opens that lesson.
 */
function readRoute() {
  if (location.hash) return location.hash.replace(/^#\/?/, '').split('?')[0];
  const seg = location.pathname.split('/').filter(Boolean).pop() ?? '';
  return findLesson(seg) ? seg : '';
}

function useRoute() {
  const read = readRoute;
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

/** Appends the copyright line to any text copied from the page (except form fields). */
function useCopySignature() {
  useEffect(() => {
    const on = (e: ClipboardEvent) => {
      const a = document.activeElement;
      if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')) return;
      const sel = getSelection();
      const text = sel?.toString() ?? '';
      if (!sel || !text.trim() || !e.clipboardData || text.includes('©mychitas.app')) return;
      const div = document.createElement('div');
      for (let i = 0; i < sel.rangeCount; i++) div.appendChild(sel.getRangeAt(i).cloneContents());
      e.clipboardData.setData('text/plain', text + SIGNATURE);
      e.clipboardData.setData('text/html', `${div.innerHTML}<br><br>${SITE_HOST}<br>©pnimi.org.il<br>©mychitas.app`);
      e.preventDefault();
    };
    document.addEventListener('copy', on);
    return () => document.removeEventListener('copy', on);
  }, []);
}

/** Shows "How to play" once, on the very first visit. */
function useFirstVisitHelp(open: (p: Panel) => void) {
  useEffect(() => {
    const KEY = 'niflaot:help-seen';
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return; // no storage — don't nag on every visit
    }
    const id = setTimeout(() => {
      try {
        localStorage.setItem(KEY, '1');
      } catch {}
      open('help');
    }, 400);
    return () => clearTimeout(id);
  }, [open]);
}

/** The site rests on Shabbat (Friday 21:00 – Saturday 21:00, user's time): nothing but the greeting. */
export function App() {
  return useShabbatRest() ? <ShabbatRest /> : <Site />;
}

function Site() {
  const { t } = useI18n();
  const route = useRoute();
  useCopySignature();
  useEffect(installFootnoteNavigation, []);
  const [panel, open] = useState<Panel>(null);
  useFirstVisitHelp(open);
  const [slug, view, variant] = route.split('/');
  const lesson = slug ? findLesson(slug) : undefined;
  // outside a lesson the helper knows no lesson (the lesson page sets its own state)
  useEffect(() => {
    if (!lesson || view === 'print' || view === 'memo') setPageState(null);
  }, [lesson, view]);
  const ui = useMemo(() => ({ panel, open, lessonSlug: lesson?.slug }), [panel, lesson]);
  return (
    <UIContext.Provider value={ui}>
      {slug === 'math' ? (
        <MathPage op={OPS.includes(view as Op) ? (view as Op) : 'add'} />
      ) : !lesson ? (
        <Catalog />
      ) : view === 'print' && variant === 'memo' && lesson.memo ? (
        <PrintMemo key={lesson.slug} lesson={lesson} memo={lesson.memo} />
      ) : view === 'memo' && lesson.memo ? (
        <MemoPage key={lesson.slug} lesson={lesson} memo={lesson.memo} />
      ) : view === 'print' ? (
        <PrintLesson key={lesson.slug} lesson={lesson} />
      ) : (
        <LessonPage key={lesson.slug} lesson={lesson} />
      )}
      <Panels />
      <TermPopover />
      <Assistant />
      <DonateFab label={t('footer.donate')} />
    </UIContext.Provider>
  );
}
