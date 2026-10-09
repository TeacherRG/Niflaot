import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { PARSHIOT, findLesson, type ParshaId } from './lessons';
import { Catalog } from './components/Catalog';
import { ShabbatRest, useShabbatRest } from './components/ShabbatRest';
import { isAdmin } from './admin/github';
import { OPS, type Op } from './core/mentalMath';
import { Panels } from './components/Panels';
import { TermPopover } from './components/TermPopover';
import { Assistant } from './components/Assistant';
import { setPageState } from './core/assistant';
import { installFootnoteNavigation } from './sources/footnotes';
import { installLangMarkup } from './core/langMarkup';
import { installTitleSync } from './core/pageMeta';
import { DonateFab, UIContext, type Panel } from './components/ui';
import { useI18n } from './i18n';

import { SITE_HOST } from './core/site';

/** Every page but the catalog loads on demand: the first screen gets only its own code. */
const page = <K extends string, P>(load: () => Promise<Record<K, ComponentType<P>>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));
const LessonPage = page(() => import('./components/LessonPage'), 'LessonPage');
const PrintLesson = page(() => import('./components/PrintLesson'), 'PrintLesson');
const PrintMemo = page(() => import('./components/PrintMemo'), 'PrintMemo');
const PrintCards = page(() => import('./components/PrintCards'), 'PrintCards');
const MemoPage = page(() => import('./components/MemoPage'), 'MemoPage');
const CardsPage = page(() => import('./components/CardsPage'), 'CardsPage');
const ReadPage = page(() => import('./components/ReadPage'), 'ReadPage');
const FactsPage = page(() => import('./components/FactsPage'), 'FactsPage');
const PartnersPage = page(() => import('./components/PartnersPage'), 'PartnersPage');
const CardsReadPage = page(() => import('./components/CardsReadPage'), 'CardsReadPage');
const MathPage = page(() => import('./components/MathPage'), 'MathPage');
const RebbePage = page(() => import('./components/RebbePage'), 'RebbePage');
const Admin = page(() => import('./components/Admin'), 'Admin');

const SIGNATURE = `\n\n${SITE_HOST}\n©pnimi.org.il\n©mychitas.app`;

/**
 * Hash routing: `#/` — catalog, `#/<lesson-slug>` — lesson, `#/<lesson-slug>/print` — printable version,
 * `#/<lesson-slug>/memo` — the lesson's Memo game, `#/<lesson-slug>/read` — the lesson to read with ready answers (`/read/<n>`, `/memo/<n>`, `/r/<n>` — opened at riddle or Memo pair n), `#/<lesson-slug>/cards` — the «Карточки» of a «Нифлаот Ребе» lesson, `#/rebbe/<parsha>` — «Нифлаот Ребе» of a portion, `#/partners` — «Партнёры», `#/facts` — «Знаете ли вы?», the equalities of all lessons (`#/facts/<id>` — opened at one of them), `#/<lesson-slug>/print/memo` — the Memo on paper, `#/<lesson-slug>/print/cards` — the «Карточки» on paper.
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

/**
 * A page opened by a machine, not a person: the browser's «listen to this page» (Google-Read-Aloud), search engines,
 * previews. It gets the page itself — no «How to play» on top of it.
 */
const isReader = () =>
  navigator.webdriver ||
  /Google-Read-Aloud|bot\b|crawler|spider|Headless|Lighthouse|Google-InspectionTool/i.test(navigator.userAgent);

/** Shows "How to play" once, on the very first visit (of a person). */
function useFirstVisitHelp(open: (p: Panel) => void) {
  useEffect(() => {
    if (isReader()) return;
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

/** The site rests on Shabbat (candle lighting – end of Shabbat in the user's city): nothing but the greeting. */
export function App() {
  return useShabbatRest() ? <ShabbatRest /> : <Site />;
}

function Site() {
  const { t } = useI18n();
  const route = useRoute();
  useCopySignature();
  useEffect(installFootnoteNavigation, []);
  useEffect(installLangMarkup, []);
  useEffect(installTitleSync, []);
  const [panel, open] = useState<Panel>(null);
  useFirstVisitHelp(open);
  const [slug, view, variant] = route.split('/');
  const lesson = slug ? findLesson(slug) : undefined;
  // outside a lesson the helper knows no lesson (the lesson page sets its own state)
  useEffect(() => {
    if (!lesson || view === 'print' || view === 'memo' || view === 'cards' || view === 'read') setPageState(null);
  }, [lesson, view]);
  const ui = useMemo(() => ({ panel, open, lessonSlug: lesson?.slug }), [panel, lesson]);
  return (
    <UIContext.Provider value={ui}>
      <Suspense fallback={null}>
        {slug === 'admin' ? (
          <Admin slug={view} />
        ) : slug === 'partners' ? (
          <PartnersPage />
        ) : slug === 'facts' ? (
          <FactsPage at={view || undefined} />
        ) : slug === 'math' ? (
          <MathPage op={OPS.includes(view as Op) ? (view as Op) : 'add'} />
        ) : slug === 'rebbe' && view in PARSHIOT ? (
          <RebbePage parsha={view as ParshaId} />
        ) : !lesson ? (
          <Catalog />
        ) : view === 'print' && variant === 'memo' && lesson.memo ? (
          <PrintMemo key={lesson.slug} lesson={lesson} memo={lesson.memo} />
        ) : view === 'print' && variant === 'cards' && lesson.cards ? (
          <PrintCards key={lesson.slug} lesson={lesson} cards={lesson.cards} />
        ) : view === 'cards' && lesson.cards ? (
          <CardsPage key={lesson.slug} lesson={lesson} cards={lesson.cards} />
        ) : view === 'memo' && lesson.memo ? (
          <MemoPage key={lesson.slug} lesson={lesson} memo={lesson.memo} at={Number(variant) || undefined} />
        ) : view === 'read' && lesson.cards ? (
          <CardsReadPage key={lesson.slug} lesson={lesson} cards={lesson.cards} mode={variant === 'poem' ? 'poem' : 'read'} />
        ) : view === 'read' && lesson.kind !== 'sicha' ? (
          <ReadPage key={lesson.slug} lesson={lesson} at={Number(variant) || undefined} />
        ) : view === 'print' ? (
          <PrintLesson key={lesson.slug} lesson={lesson} />
        ) : (
          <LessonPage key={lesson.slug} lesson={lesson} at={view === 'r' ? Number(variant) || undefined : undefined} />
        )}
      </Suspense>
      <Panels />
      <TermPopover />
      <Assistant />
      <DonateFab label={t('footer.donate')} />
      {isAdmin() && slug !== 'admin' && view !== 'print' && (
        <a className="admin-fab" href={lesson ? `#/admin/${lesson.slug}` : '#/admin'} title="Редактор текстов">
          ✎ Править
        </a>
      )}
    </UIContext.Provider>
  );
}
