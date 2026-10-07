import { useEffect, useState } from 'react';
import { findLesson } from './lessons';
import { Catalog } from './components/Catalog';
import { LessonPage } from './components/LessonPage';

const SIGNATURE = '\n\n©pnimi.org.il\n©mychitas.app';

/** Hash routing: `#/` — catalog, `#/<lesson-slug>` — lesson. Works on any static host. */
function useRoute() {
  const read = () => location.hash.replace(/^#\/?/, '').split(/[?/]/)[0];
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
      e.clipboardData.setData('text/html', div.innerHTML + '<br><br>©pnimi.org.il<br>©mychitas.app');
      e.preventDefault();
    };
    document.addEventListener('copy', on);
    return () => document.removeEventListener('copy', on);
  }, []);
}

export function App() {
  const route = useRoute();
  useCopySignature();
  const lesson = route ? findLesson(route) : undefined;
  return lesson ? <LessonPage key={lesson.slug} lesson={lesson} /> : <Catalog />;
}
