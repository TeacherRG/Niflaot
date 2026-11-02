import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { atlasName, loadAtlasDay, loadAtlasTexts, osmLink, placeSure, sectionEntities, type AtlasDay, type AtlasEntity, type AtlasLang, type AtlasTexts } from '../core/atlas';
import { AtlasMap } from './AtlasMap';

type Section = 'neviim' | 'ketuvim';

const initial = (he: string) => he.replace(/[^א-ת]/g, '').charAt(0);

/** Семья одной строкой: «отец · Нун, мать · …» (только те, о ком есть данные). */
export function Family({ e, get, tx, lang }: { e: AtlasEntity; get: (id: string) => AtlasEntity | undefined; tx: AtlasTexts | null; lang: AtlasLang }) {
  const { t } = useI18n();
  const rows: [string, string[]][] = [
    ['atlas.fa', e.fa ? [e.fa] : []],
    ['atlas.mo', e.mo ? [e.mo] : []],
    ['atlas.sp', e.sp ?? []],
    ['atlas.ch', e.ch ?? []],
  ];
  const shown = rows.filter(([, ids]) => ids.length);
  if (!shown.length) return null;
  return (
    <ul className="ta-fam">
      {shown.map(([k, ids]) => (
        <li key={k}>
          <span>{t(k as MessageKey)}</span> {ids.slice(0, 6).map((i) => atlasName(i, get(i), tx, lang)).join(', ')}
          {ids.length > 6 && ' …'}
        </li>
      ))}
    </ul>
  );
}

/**
 * «Кто и где в этом отрывке» — под отрывком дня Пророков / Писаний: люди и народы карточками, места — на своей карте с
 * номерами и списком. Данные — scripts/fetch-atlas.py, справки — src/tanakh/atlas/<язык>.json.
 */
export function TanakhAtlas({ section, date }: { section: Section; date: string }) {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [data, setData] = useState<{ day: AtlasDay; tx: AtlasTexts } | null>(null);

  useEffect(() => {
    let live = true;
    setData(null);
    Promise.all([loadAtlasDay(date), loadAtlasTexts(lang)]).then(([day, tx]) => live && day && setData({ day, tx }));
    return () => {
      live = false;
    };
  }, [date, lang]);

  if (!data) return null;
  const { day, tx } = data;
  const { people, places } = sectionEntities(day, section);
  if (!people.length && !places.length) return null;
  const name = (id: string) => atlasName(id, day.e[id], tx, lang);
  const onMap = places.filter((id) => day.e[id].ll);
  const num = new Map(onMap.map((id, i) => [id, i + 1]));

  return (
    <section className="ta no-print" aria-labelledby="ta-h">
      <h2 id="ta-h">
        {t('atlas.title')}{' '}
        <span className="he" lang="he">
          מִי וְאֵיפֹה
        </span>
      </h2>
      <p className="ta-lead">{t('atlas.lead')}</p>

      {people.length > 0 && (
        <>
          <h3 className="ta-sub">{t('atlas.people')}</h3>
          <ul className="ta-people">
            {people.map((id) => {
              const e = day.e[id];
              return (
                <li key={id} className="ta-card" id={`ta-${id}`}>
                  <span className="ta-av he" lang="he" aria-hidden="true">
                    {initial(e.he)}
                  </span>
                  <div>
                    <p className="ta-name">
                      <b>{name(id)}</b>{' '}
                      <span className="he" lang="he">
                        {e.he}
                      </span>{' '}
                      <small className="ta-kind">{t(`atlas.kind.${e.k}` as MessageKey)}</small>
                    </p>
                    <p className="ta-d">{tx[id]?.d ?? t('atlas.noText')}</p>
                    <Family e={e} get={(i) => day.e[i]} tx={tx} lang={lang} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {places.length > 0 && (
        <>
          <h3 className="ta-sub">{t('atlas.places')}</h3>
          {onMap.length > 0 && (
            <div className="ta-map">
              <AtlasMap label={t('atlas.mapLabel')} points={onMap.map((id) => ({ id, ll: day.e[id].ll!, label: name(id), n: num.get(id) }))} />
            </div>
          )}
          <ol className="ta-places">
            {places.map((id) => {
              const e = day.e[id];
              const n = num.get(id);
              return (
                <li key={id} id={`ta-${id}`}>
                  <span className={n ? 'ta-n' : 'ta-n off'} aria-hidden="true">
                    {n ?? '·'}
                  </span>
                  <div>
                    <p className="ta-name">
                      <b>{name(id)}</b>{' '}
                      <span className="he" lang="he">
                        {e.he}
                      </span>
                    </p>
                    <p className="ta-d">{tx[id]?.d ?? t('atlas.noText')}</p>
                    {e.ll && (
                      <p className="ta-meta">
                        <span className={`ta-sure s${placeSure(e.q)}`}>{t(`atlas.sure.${placeSure(e.q)}` as MessageKey)}</span> ·{' '}
                        <a href={osmLink(e.ll)} target="_blank" rel="noopener noreferrer">
                          {t('atlas.osm')}
                        </a>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
      <p className="ta-credit">{t('atlas.credit')}</p>
    </section>
  );
}
