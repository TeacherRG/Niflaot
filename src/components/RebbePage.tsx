import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { PARSHIOT, type ParshaId } from '../lessons';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

/** «Нифлаот Ребе» of a Torah portion (`#/rebbe/<parsha>`): a section of its own in every portion; lessons are in preparation. */
export function RebbePage({ parsha }: { parsha: ParshaId }) {
  const { t, locale } = useI18n();
  const p = PARSHIOT[parsha];
  const name = p.name[locale as keyof typeof p.name] ?? p.name.ru;

  useEffect(() => {
    document.title = `${t('rebbe.title')} · ${name} · ${t('app.title')}`;
  }, [t, name]);

  return (
    <>
      <TopBar title={t('app.title')} />
      <div className="wrap">
        <article className="m-card">
          <div className="eyebrow">
            {name} · <span lang="he">{p.he}</span> · {p.year}
          </div>
          <h1>{t('rebbe.title')}</h1>
          <p>{t('rebbe.intro')}</p>
        </article>
        <div className="cards">
          <div className="card soon">{t('rebbe.soon', { parsha: name })}</div>
        </div>
      </div>
      <Colophon />
    </>
  );
}
