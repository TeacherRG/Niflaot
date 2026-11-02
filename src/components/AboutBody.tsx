import { useMemo } from 'react';
import { Html, useI18n } from '../i18n';

const plain = (s: string) => s.replace(/<[^>]+>/g, '').trim();

/**
 * «О проекте» с содержанием (владелец, 02.11.2026: «структурируй, сделай план с переходами»): `about.body` разбит
 * на группы `<h3>` («Что учить», «Как учить», «О нас») и разделы `<h4>`; сверху — содержание, нажатие прокручивает к разделу
 * (кнопкой, не ссылкой `#…`: адрес после `#` — маршрут сайта), у каждого раздела — «↑ К содержанию».
 */
export function AboutBody() {
  const { t } = useI18n();
  const html = t('about.body');
  const { intro, groups } = useMemo(() => {
    const [intro, ...gs] = html.split(/(?=<h3>)/);
    let n = 0;
    const groups = gs.map((g) => {
      const [head, ...secs] = g.split(/(?=<h4>)/);
      return {
        title: plain(head.replace(/<h3>(.*?)<\/h3>[\s\S]*/, '$1')),
        lead: head.replace(/<h3>.*?<\/h3>/, ''),
        sections: secs.map((s) => {
          const m = s.match(/^<h4>(.*?)<\/h4>([\s\S]*)$/)!;
          return { id: `about-${n++}`, title: plain(m[1]), body: m[2] };
        }),
      };
    });
    return { intro, groups };
  }, [html]);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="about-body">
      <Html as="div" className="prose" html={intro} />
      <nav className="about-toc" id="about-toc" aria-label={t('about.toc')}>
        <p className="about-toc-h">{t('about.toc')}</p>
        {groups.map((g) => (
          <div key={g.title} className="about-toc-g">
            <b>{g.title}</b>
            <ul>
              {g.sections.map((s) => (
                <li key={s.id}>
                  <button type="button" className="link-btn" onClick={() => go(s.id)}>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {groups.map((g) => (
        <div key={g.title} className="about-group">
          <h3 className="about-group-h">{g.title}</h3>
          {g.lead && <Html as="div" className="prose" html={g.lead} />}
          {g.sections.map((s) => (
            <section key={s.id} id={s.id} className="about-sec prose">
              <h4>{s.title}</h4>
              <Html as="div" html={s.body} />
              <button type="button" className="link-btn about-top" onClick={() => go('about-toc')}>
                ↑ {t('about.top')}
              </button>
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}
