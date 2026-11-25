import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { chapterOn, loadSlides, slideSrc, heNum, type Slide } from '../core/rambam';
import { localToday } from '../core/tanakh';

/**
 * «Презентация главы» — `#/rambam/<дата>/slides`: все слайды одного перека подряд, для печати и «Сохранить как PDF»:
 * страница PDF — один слайд, во всю страницу, в пропорциях слайда (не A4). Картинки — те же, что на странице главы (R2).
 */
export function RambamDeck({ date: asked }: { date?: string }) {
  const { t } = useI18n();
  const date = asked ?? localToday();
  const day = useMemo(() => chapterOn(date), [date]);
  const [slides, setSlides] = useState<Slide[] | null | undefined>(undefined);
  const [ready, setReady] = useState(0);

  useEffect(() => {
    let live = true;
    loadSlides(day.id).then((x) => live && setSlides(x));
    return () => {
      live = false;
    };
  }, [day.id]);

  const title = `${day.book.he ?? ''} · פרק ${heNum(day.perek)}`;
  useEffect(() => {
    document.title = `${t('rm.deck')} · ${t('rm.title')} ${day.perek} · ${t('app.title')}`;
  }, [t, day.perek]);

  const first = slides?.[0];
  // страница PDF — размер слайда: ширина 297 мм, высота — по пропорции
  const page = first ? `@page{size:297mm ${((297 * first.h) / first.w).toFixed(1)}mm;margin:0}` : '';
  const all = !!slides && ready >= slides.length;

  return (
    <>
      <TopBar title={t('rm.title')} />
      <div className="wrap rm-deck">
        {page && <style>{page}</style>}
        <header className="no-print rm-deck-head">
          <p className="tk-kicker">{t('rm.deck')}</p>
          <h1 className="he" lang="he" dir="rtl">
            {title}
          </h1>
          {slides && (
            <>
              <p className="rm-deck-note">{t('rm.deckNote', { n: slides.length })}</p>
              <div className="rm-deck-bar">
                <button type="button" className="btn" onClick={() => window.print()} disabled={!all}>
                  {all ? t('rm.deckPrint') : t('rm.deckLoading', { n: ready, m: slides.length })}
                </button>
                <a className="btn ghost" href={`#/rambam/${date}`}>
                  ← {t('rm.deckBack')}
                </a>
              </div>
            </>
          )}
        </header>
        {slides === undefined ? (
          <p className="tk-note">{t('rm.loading')}</p>
        ) : slides === null ? (
          <p className="tk-note">{t('rm.deckNone')}</p>
        ) : (
          <div className="rm-deck-list">
            {slides.map((s) => (
              <figure key={s.img} className="rm-deck-slide">
                <img
                  src={slideSrc(day.id, s.img)}
                  width={s.w}
                  height={s.h}
                  alt={`${s.title}. ${s.text}`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setReady((n) => n + 1)}
                  onError={() => setReady((n) => n + 1)}
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
