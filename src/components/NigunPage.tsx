import { useEffect } from 'react';
import { AddCourse } from './AddCourse';
import { useI18n } from '../i18n';
import { NIGUNIM, findNigun } from '../nigun';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { NotFound } from './PageStates';
import { Karaoke } from './Karaoke';

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** Every lesson ends with a direct link to the source of the recording and the text (the condition of the permission). */
function Credit({ name, url }: { name: string; url: string }) {
  const { t } = useI18n();
  return (
    <p className="ng-credit">
      {t('nigun.credit')}{' '}
      <a href={url} target="_blank" rel="noopener">
        {name}
      </a>{' '}
      · © {name}
    </p>
  );
}

/**
 * «Святая музыка» — the faculty of the niggun: `#/nigun` — the lessons, `#/nigun/<id>` — a lesson: what the niggun is
 * and who sang it, then the karaoke to learn it; at the foot — the link to m770.org.
 */
export function NigunPage({ id }: { id?: string }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const n = id ? findNigun(id) : undefined;
  useEffect(() => {
    document.title = `${n ? n.title[lang] : t('nigun.title')} · ${t('app.title')}`;
  }, [n, lang, t]);
  if (id && !n) return <NotFound />;

  return (
    <>
      <TopBar title={t('nigun.title')} />
      <div className="wrap ng">
        {n ? (
          <article>
            <p className="tk-kicker">
              <a href="#/nigun">🎵 {t('nigun.title')}</a> · <span className="he">ניגון</span>
            </p>
            <h1>{n.title[lang]}</h1>
            <AddCourse course="nigun" />
            <p className="ng-about">{n.about[lang]}</p>
            <h2 className="ng-h2">{t('nigun.karaoke')}</h2>
            <p className="ac-note">{t('nigun.how')}</p>
            <Karaoke nigun={n} />
            <Credit {...n.source} />
          </article>
        ) : (
          <>
            <header className="tk-head">
              <p className="tk-kicker">
                🎵 {t('nigun.sub')} · <span className="he">ניגון</span>
              </p>
              <h1>{t('nigun.title')}</h1>
              <p className="ac-lead">{t('nigun.lead')}</p>
              <AddCourse course="nigun" />
            </header>
            <ul className="ng-list">
              {NIGUNIM.map((x) => (
                <li key={x.id}>
                  <a href={`#/nigun/${x.id}`}>
                    <b>{x.title[lang]}</b>
                    <span>{x.about[lang].split('. ')[0]}.</span>
                  </a>
                </li>
              ))}
            </ul>
            <Credit name="m770.org" url="https://m770.org/" />
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}
