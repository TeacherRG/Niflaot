import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { PARSHIOT, cardsOnly, findLesson, type ParshaId } from './lessons';
import { Catalog } from './components/Catalog';
import { ModePicker } from './components/ModePicker';
import { isReader, savedMode, useSavedMode } from './core/mode';
import { savedHebrewLevel } from './core/hebrewLevel';
import { ShabbatRest, useShabbatRest } from './components/ShabbatRest';
import { isAdmin } from './admin/github';
import { OPS, type Op } from './core/mentalMath';
import { Panels } from './components/Panels';
import { TermPopover } from './components/TermPopover';
import { Assistant } from './components/Assistant';
import { setPageState } from './core/assistant';
import { onPulled } from './core/account';
import { installFootnoteNavigation } from './sources/footnotes';
import { installLangMarkup } from './core/langMarkup';
import { installTitleSync } from './core/pageMeta';
import { DonateFab, UIContext, type Panel } from './components/ui';
import { TabBar } from './components/TabBar';
import { NotFound, PageBoundary, PageLoading } from './components/PageStates';
import { useI18n } from './i18n';

import { SITE_HOST, STATIC_PAGES, type StaticPage } from './core/site';

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
const TeacherPage = page(() => import('./components/TeacherPage'), 'TeacherPage');
const AccountPage = page(() => import('./components/AccountPage'), 'AccountPage');
const ClassPage = page<'ClassPage', { id: string }>(() => import('./components/CommunityPages'), 'ClassPage');
const ConsentPage = page<'ConsentPage', { token: string }>(() => import('./components/CommunityPages'), 'ConsentPage');
const PrivacyPage = page<'PrivacyPage', object>(() => import('./components/CommunityPages'), 'PrivacyPage');
const CardsReadPage = page(() => import('./components/CardsReadPage'), 'CardsReadPage');
const MathPage = page(() => import('./components/MathPage'), 'MathPage');
const LettersPage = page(() => import('./components/LettersPage'), 'LettersPage');
const RebbePage = page(() => import('./components/RebbePage'), 'RebbePage');
const TanakhPage = page(() => import('./components/TanakhPage'), 'TanakhPage');
const WordsPage = page(() => import('./components/WordsPage'), 'WordsPage');
const TorahWordsPage = page(() => import('./components/TorahWordsPage'), 'TorahWordsPage');
const LashonPage = page(() => import('./components/LashonPage'), 'LashonPage');
const ReadingPage = page(() => import('./components/ReadingPage'), 'ReadingPage');
const TanakhQuizPage = page(() => import('./components/TanakhQuizPage'), 'TanakhQuizPage');
const HemshechPage = page(() => import('./components/HemshechPage'), 'HemshechPage');
const AcademyPage = page(() => import('./components/AcademyPage'), 'AcademyPage');
const QuizPage = page(() => import('./components/QuizPage'), 'QuizPage');
const NigunPage = page(() => import('./components/NigunPage'), 'NigunPage');
const ShabbatTable = page(() => import('./components/ShabbatTable'), 'ShabbatTable');
const WeekDigest = page(() => import('./components/WeekDigest'), 'WeekDigest');
const KoeletPage = page(() => import('./components/KoeletPage'), 'KoeletPage');
const Admin = page(() => import('./components/Admin'), 'Admin');

const SIGNATURE = `\n\n${SITE_HOST}\n©mychitas.app`;

/**
 * Hash routing: `#/` — catalog, `#/<lesson-slug>` — lesson, `#/<lesson-slug>/print` — printable version,
 * `#/<lesson-slug>/memo` — the lesson's Memo game, `#/<lesson-slug>/read` — the lesson to read with ready answers (`/read/<n>`, `/memo/<n>`, `/r/<n>` — opened at riddle or Memo pair n), `#/<lesson-slug>/cards` — the «Карточки» of a «Нифлаот Ребе» lesson, `#/rebbe/<parsha>` — «Нифлаот Ребе» of a portion, `#/partners` — «Партнёры», `#/teacher` — «Учитель» (ИИ или человек), `#/account` — аккаунт (гость / вход по коду / профиль, классы), `#/admin/leaders[/<class>]` — таблица лидеров (только в админке), `#/class/<id>` — класс для учителя, `#/consent/<token>` — согласие родителя, `#/privacy` — конфиденциальность, `#/facts` — «Знаете ли вы?», the equalities of all lessons (`#/facts/<id>` — opened at one of them), `#/<lesson-slug>/print/memo` — the Memo on paper, `#/<lesson-slug>/print/cards` — the «Карточки» on paper, `#/letters` — «Буквы за 5 минут», `#/neviim[/<date>]`, `#/ketuvim[/<date>]` — «Пророки», «Писания»: отрывок дня трёхлетнего цикла (`/<date>/quiz`, `/quiz` — «Вопросы к отрывку»), `#/academy[/<id>]` — «Академия»: сертификаты за книги, `#/words` — «Мои слова»: слова Танаха с повторением, `#/torah-words[/<глава>]` — «Слова Торы»: детская игра со словами уроков, `#/lashon` — «Святой язык — уроки»: курс иврита по шагам (буквы и слова), `#/mode` — «Кто будет учиться?» (режим сайта; без выбора — вместо главной), `#/quiz` — «Викторина вместе» (`#/quiz/<код>` — игрок, `#/quiz/host/<код>` — ведущий), `#/shabbat-table[/<глава>]` — «К шабатнему столу»: лист главы для печати, `#/digest[/<воскресенье>]` — «Неделя в Академии»: Пророки, Писания, Хасидут и нигун недели короткими цитатами, `#/nigun[/<id>]` — «Святая музыка»: нигуны и караоке, `#/koelet` — «Тайна Коэлета»: квест по книге Коэлет (koelet/, в iframe),  `#/reading[/<глава>]` — «Святое чтение»: проворное чтение Теґилим.
 * `#/daily` — «Знаете ли вы?» opened on «Гематрия дня», its first card; `#/math/<op>` — «Устный счёт».
 * Works on any static host. Without a hash, `/<lesson-slug>/` (the static page for search engines,
 * written by scripts/prerender.ts) opens that lesson; `/mental-math/` and `/daily/` (also under `/en/`, `/de/`) — those pages.
 * `#/reading` opens the Tehillim portion for today's Hebrew date; `#/reading/day/<day>` selects another date, `#/reading/<chapter>` opens one chapter, and `#/reading/haazinu` opens Deuteronomy 32 («Песнь Аазину»).
 */
function readRoute() {
  if (location.hash) return location.hash.replace(/^#\/?/, '').split('?')[0];
  const seg = location.pathname.split('/').filter(Boolean).pop() ?? '';
  if (seg in STATIC_PAGES) return STATIC_PAGES[seg as StaticPage];
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
      e.clipboardData.setData('text/html', `${div.innerHTML}<br><br>${SITE_HOST}<br>©mychitas.app`);
      e.preventDefault();
    };
    document.addEventListener('copy', on);
    return () => document.removeEventListener('copy', on);
  }, []);
}

/**
 * Shows "How to play" once, on the first visit of a person who came straight to a lesson (a shared link) and is not
 * in the adults' mode. On the home page the first visit gets the onboarding instead (ModePicker.tsx: who is learning
 * and «Как вы с ивритом?»), and after it "How to play" doesn't open by itself.
 */
function useFirstVisitHelp(open: (p: Panel) => void, onLesson: boolean) {
  useEffect(() => {
    if (!onLesson || isReader() || savedMode() === 'adults') return;
    const KEY = 'niflaot:help-seen';
    try {
      if (localStorage.getItem(KEY) || savedHebrewLevel() !== null) return;
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
  }, [open, onLesson]);
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
  const [slug, view, variant] = route.split('/');
  const lesson = slug ? findLesson(slug) : undefined;
  useFirstVisitHelp(open, !!lesson);
  // who is learning: asked on the home page until chosen (not of machines), and at #/mode
  const mode = useSavedMode();
  // the account brought progress from another device: the home page is drawn again from it
  const [pulled, setPulled] = useState(0);
  useEffect(() => onPulled(() => setPulled((n) => n + 1)), []);
  // outside a lesson the helper knows no lesson (the lesson page sets its own state)
  useEffect(() => {
    if (!lesson || view === 'print' || view === 'memo' || view === 'cards' || view === 'read') setPageState(null);
  }, [lesson, view]);
  const ui = useMemo(() => ({ panel, open, lessonSlug: lesson?.slug }), [panel, lesson]);
  return (
    <UIContext.Provider value={ui}>
      <PageBoundary key={route}>
        <Suspense fallback={<PageLoading />}>
          {slug === 'mode' || (!slug && mode === null && !isReader()) ? (
            <ModePicker />
          ) : slug === 'admin' ? (
            <Admin slug={view} leaders={variant} />
          ) : slug === 'partners' ? (
            <PartnersPage />
          ) : slug === 'teacher' ? (
            <TeacherPage />
          ) : slug === 'account' ? (
            <AccountPage />
          ) : slug === 'class' && view ? (
            <ClassPage id={view} />
          ) : slug === 'consent' && view ? (
            <ConsentPage token={view} />
          ) : slug === 'privacy' ? (
            <PrivacyPage />
          ) : slug === 'facts' ? (
            <FactsPage at={view || undefined} />
          ) : slug === 'daily' ? (
            <FactsPage at="daily" />
          ) : slug === 'letters' ? (
            <LettersPage />
          ) : slug === 'math' && (!view || OPS.includes(view as Op)) ? (
            <MathPage op={(view as Op) || 'add'} />
          ) : slug === 'hemshech' ? (
            <HemshechPage key={route} passage={view || undefined} />
          ) : slug === 'words' ? (
            <WordsPage />
          ) : slug === 'lashon' ? (
            <LashonPage />
          ) : slug === 'reading' ? (
            <ReadingPage key={route} chapter={view === 'day' ? undefined : view || undefined} day={view === 'day' ? variant : undefined} />
          ) : slug === 'torah-words' ? (
            <TorahWordsPage key={route} parsha={view || undefined} />
          ) : slug === 'quiz' ? (
            <QuizPage code={view === 'host' ? variant : view} host={view === 'host'} />
          ) : slug === 'nigun' ? (
            <NigunPage key={route} id={view || undefined} />
          ) : slug === 'koelet' ? (
            <KoeletPage />
          ) : slug === 'shabbat-table' ? (
            <ShabbatTable key={route} parsha={view || undefined} />
          ) : slug === 'digest' && (!view || /^\d{4}-\d{2}-\d{2}$/.test(view)) ? (
            <WeekDigest key={route} week={view || undefined} />
          ) : slug === 'academy' ? (
            <AcademyPage key={route} id={view || undefined} sample={location.hash.includes('?sample')} />
          ) : (slug === 'neviim' || slug === 'ketuvim') && (view === 'quiz' || variant === 'quiz') ? (
            <TanakhQuizPage key={route} section={slug} date={/^\d{4}-\d{2}-\d{2}$/.test(view ?? '') ? view : undefined} />
          ) : slug === 'neviim' || slug === 'ketuvim' ? (
            <TanakhPage key={`${slug}/${view}`} section={slug} date={/^\d{4}-\d{2}-\d{2}$/.test(view ?? '') ? view : undefined} />
          ) : slug === 'rebbe' && view in PARSHIOT ? (
            <RebbePage parsha={view as ParshaId} />
          ) : !slug ? (
            <Catalog key={pulled} />
          ) : !lesson ? (
            // a mistyped or outdated link (and #/math/<unknown>): say so, not the home page
            <NotFound />
          ) : view === 'print' && variant === 'memo' && lesson.memo ? (
            <PrintMemo key={lesson.slug} lesson={lesson} memo={lesson.memo} />
          ) : cardsOnly(lesson) && (view === 'print' ? variant !== 'memo' : view !== 'cards' && view !== 'read') ? (
            // a lesson with only cards so far: its page and its printout are the cards
            view === 'print' ? (
              <PrintCards key={lesson.slug} lesson={lesson} cards={lesson.cards!} />
            ) : (
              <CardsPage key={lesson.slug} lesson={lesson} cards={lesson.cards!} />
            )
          ) : view === 'print' && variant === 'cards' && lesson.cards ? (
            <PrintCards key={lesson.slug} lesson={lesson} cards={lesson.cards} />
          ) : view === 'cards' && lesson.cards ? (
            <CardsPage key={lesson.slug} lesson={lesson} cards={lesson.cards} />
          ) : view === 'memo' && lesson.memo ? (
            <MemoPage key={lesson.slug} lesson={lesson} memo={lesson.memo} at={Number(variant) || undefined} />
          ) : view === 'read' && lesson.kind === 'sicha' ? (
            <CardsReadPage
              key={lesson.slug}
              lesson={lesson}
              cards={lesson.cards}
              mode={!lesson.cards ? ('talk' as const) : variant === 'poem' ? ('poem' as const) : variant === 'cards' || !lesson.riddles.length ? ('read' as const) : ('talk' as const)}
            />
          ) : view === 'read' && lesson.kind !== 'sicha' ? (
            <ReadPage key={lesson.slug} lesson={lesson} at={Number(variant) || undefined} />
          ) : view === 'print' ? (
            <PrintLesson key={lesson.slug} lesson={lesson} />
          ) : (
            <LessonPage key={lesson.slug} lesson={lesson} at={view === 'r' ? Number(variant) || undefined : undefined} />
          )}
        </Suspense>
      </PageBoundary>
      <Panels />
      <TermPopover />
      {/* «Тайна Коэлета» has its own guide (the Keeper) and buttons at the bottom of the game */}
      {slug !== 'koelet' && <Assistant />}
      {slug !== 'koelet' && <DonateFab label={t('footer.donate')} />}
      <TabBar slug={slug} view={view} />
      {isAdmin() && slug !== 'admin' && view !== 'print' && (
        <a className="admin-fab" href={lesson ? `#/admin/${lesson.slug}` : '#/admin'} title="Редактор текстов">
          ✎ Править
        </a>
      )}
    </UIContext.Provider>
  );
}
