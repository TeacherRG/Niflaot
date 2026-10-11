import { Suspense, lazy, useSyncExternalStore } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, findLesson } from '../lessons';
import { VALUES } from '../core/gematria';
import { OPS, SIGN } from '../core/mentalMath';
import { Icon, Sheet, useUI } from './ui';
import { ASSISTANT_URL } from '../core/assistant';
import { lessonGames } from './lessonGames';
import { canInstall, install, subscribeInstall } from '../core/install';

/** Gematria step by step, sources and FAQ (with all the primary sources) load when «Как играть» opens. */
const HelperContent = lazy(() => import('./Helper').then((m) => ({ default: m.HelperContent })));
import { HEBREW_LEVELS, savedHebrewLevel, setHebrewLevel, useHebrewLevel } from '../core/hebrewLevel';
import { letterName } from '../core/letterNames';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));

/**
 * «Как вы с ивритом?» — at the top of «Как играть» (it opens by itself on the first visit): the answer sets how much
 * help the letters get (src/core/hebrewLevel.ts). Before an answer no option is marked (the default is «Узнаю буквы»).
 */
function HebrewLevelPicker({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const level = useHebrewLevel();
  const answered = savedHebrewLevel() !== null;
  return (
    <section className="hb-level" aria-labelledby="hb-q">
      <h3 id="hb-q" className="sheet-h3">
        {t('hebrew.q')}
      </h3>
      <div className="hb-opts" role="radiogroup" aria-labelledby="hb-q">
        {HEBREW_LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={answered && level === l}
            className={`hb-opt${answered && level === l ? ' on' : ''}`}
            onClick={() => setHebrewLevel(l)}
          >
            <b>{t(`hebrew.${l}`)}</b>
            <small>{t(`hebrew.${l}.sub`)}</small>
          </button>
        ))}
      </div>
      {answered && level === 'none' && (
        <a className="btn hb-cta" href="#/letters" onClick={onStart}>
          <span className="he">אבג</span> · {t('abc.cta')} →
        </a>
      )}
      <p className="sheet-note">{t('hebrew.note')}</p>
    </section>
  );
}

/** Side menu + "How to play" + "About" — rendered once at the app root. */
export function Panels() {
  const { t, pick, locale } = useI18n();
  const { panel, open, lessonSlug } = useUI();
  const level = useHebrewLevel();
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const close = () => open(null);
  // the page a menu link points to is open (#/<slug> or #/<slug>/memo, #/<slug>/cards)
  const isHere = (href: string) => location.hash.split('?')[0] === href;
  // the portion of the open lesson or of its «Нифлаот Ребе» page: only its group is unfolded
  const currentParsha = lessonSlug ? findLesson(lessonSlug)?.parsha : location.hash.match(/^#\/rebbe\/([^/?]+)/)?.[1];

  return (
    <>
      <Sheet variant="drawer" open={panel === 'menu'} onClose={close} title={t('app.title')} closeLabel={t('menu.close')}>
        <nav className="menu">
          <a href="#/" onClick={close} className="menu-item" aria-current={!location.hash || location.hash === '#/' ? 'page' : undefined}>
            <Icon name="home" />
            <span>{t('menu.home')}</span>
          </a>
          <a href="#/facts" onClick={close} className="menu-item" aria-current={location.hash === '#/facts' || location.hash === '#/daily' ? 'page' : undefined}>
            <Icon name="hash" />
            <span>
              {t('facts.title')}
              <small>{t('facts.menuSub')}</small>
            </span>
          </a>
          <div className="menu-lbl">{t('menu.lessons')}</div>
          {LESSON_GROUPS.map((g) => (
            <details key={g.id} className="menu-group" open={!currentParsha || currentParsha === g.id}>
              <summary className="menu-item">
                <Icon name="book" />
                <span>
                  {g.name[locale as keyof typeof g.name] ?? g.name.ru}
                  <small>
                    <span lang="he">{g.he}</span> · {g.year}
                  </small>
                </span>
                <span className="menu-count">{g.lessons.length}</span>
              </summary>
              <div className="menu-sub">
                {g.lessons.map((l) => {
                  const games = lessonGames(l);
                  return (
                    <div key={l.slug} className="menu-lesson">
                      <a
                        href={`#/${l.slug}`}
                        onClick={close}
                        className="menu-item"
                        aria-current={l.slug === lessonSlug && !games ? 'page' : undefined}
                      >
                        <span className="menu-num">{l.number}</span>
                        <span>
                          {pick(l.texts).value.title}
                          <small lang="he">{l.hebrewTitle}</small>
                        </span>
                      </a>
                      {/* a lesson with two games (Baal HaTurim: gematria and Memo): both right under it */}
                      {games?.map((game) => (
                        <a
                          key={game.href}
                          href={game.href}
                          onClick={close}
                          className="menu-item menu-game"
                          aria-current={isHere(game.href) ? 'page' : undefined}
                        >
                          <span className="menu-num">{game.icon}</span>
                          <span>{t(game.label)}</span>
                        </a>
                      ))}
                    </div>
                  );
                })}
                <a
                  href={`#/rebbe/${g.id}`}
                  onClick={close}
                  className="menu-item"
                  aria-current={location.hash === `#/rebbe/${g.id}` ? 'page' : undefined}
                >
                  <span className="menu-num">✦</span>
                  <span>
                    {t('rebbe.title')}
                    {!g.rebbe.length && <small>{t('rebbe.menuSub')}</small>}
                  </span>
                </a>
                {/* «Нифлаот Ребе»: the investigation (named by the lesson's title) and its cards, right under the section */}
                {g.rebbe.flatMap((l) =>
                  (lessonGames(l) ?? []).map((game, k) => (
                    <a
                      key={game.href}
                      href={game.href}
                      onClick={close}
                      className="menu-item menu-game"
                      aria-current={isHere(game.href) ? 'page' : undefined}
                    >
                      <span className="menu-num">{game.icon}</span>
                      {k === 0 ? (
                        <span>
                          {pick(l.texts).value.title}
                          <small lang="he">{l.hebrewTitle}</small>
                        </span>
                      ) : (
                        <span>{t(game.label)}</span>
                      )}
                    </a>
                  )),
                )}
              </div>
            </details>
          ))}
          <details className="menu-group" open={location.hash.startsWith('#/math') || location.hash === '#/letters'}>
            <summary className="menu-item">
              <Icon name="calc" />
              <span>{t('math.title')}</span>
            </summary>
            <div className="menu-sub">
              <a href="#/letters" onClick={close} className="menu-item" aria-current={location.hash === '#/letters' ? 'page' : undefined}>
                <span className="menu-num he">א</span>
                <span>
                  {t('abc.title')}
                  <small>{t('abc.menuSub')}</small>
                </span>
              </a>
              {OPS.map((o) => (
                <a
                  key={o}
                  href={`#/math/${o}`}
                  onClick={close}
                  className="menu-item"
                  aria-current={location.hash === `#/math/${o}` ? 'page' : undefined}
                >
                  <span className="menu-num">{SIGN[o]}</span>
                  <span>{t(`math.op.${o}`)}</span>
                </a>
              ))}
            </div>
          </details>
          {lessonSlug && (
            <a href={`#/${lessonSlug}/print`} onClick={close} className="menu-item">
              <Icon name="print" />
              <span>{t('print.button')}</span>
            </a>
          )}
          <div className="menu-sep" />
          <button className="menu-item" onClick={() => open('help')}>
            <Icon name="help" />
            <span>{t('help.title')}</span>
          </button>
          <button className="menu-item" onClick={() => open('help')}>
            <span className="menu-num he">א</span>
            <span>
              {t('hebrew.menu')}
              <small>{t(`hebrew.${level}`)}</small>
            </span>
          </button>
          <button className="menu-item" onClick={() => open('assistant')}>
            <Icon name="spark" />
            <span>{t(ASSISTANT_URL ? 'ai.title' : 'helper.title')}</span>
          </button>
          {installable && (
            <button
              className="menu-item"
              onClick={() => {
                close();
                install();
              }}
            >
              <Icon name="phone" />
              <span>
                {t('install.button')}
                <small>{t('install.sub')}</small>
              </span>
            </button>
          )}
          <a href="#/teacher" onClick={close} className="menu-item" aria-current={location.hash === '#/teacher' ? 'page' : undefined}>
            <Icon name="user" />
            <span>{t('teacher.title')}</span>
          </a>
          <a href="#/partners" onClick={close} className="menu-item" aria-current={location.hash === '#/partners' ? 'page' : undefined}>
            <Icon name="heart" />
            <span>{t('partners.title')}</span>
          </a>
          <button className="menu-item" onClick={() => open('about')}>
            <Icon name="info" />
            <span>{t('about.title')}</span>
          </button>
          <div className="menu-sep" />
          <a className="menu-item" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            <Icon name="heart" />
            <span>{t('footer.donate')}</span>
          </a>
          <a className="menu-item" href="mailto:Office@mychitas.app">
            <Icon name="mail" />
            <span>{t('footer.contact')}</span>
          </a>
        </nav>
      </Sheet>

      <Sheet open={panel === 'help'} onClose={close} title={t('help.title')} closeLabel={t('menu.close')}>
        <HebrewLevelPicker onStart={close} />
        <Html as="div" className="prose" html={t('help.body')} />
        <h3 className="sheet-h3">{t('help.scoring')}</h3>
        <ul className="score-list">
          {(['rules.first', 'rules.next', 'rules.hint', 'rules.limit', 'rules.lesson'] as const).map((k) => (
            <Html as="li" key={k} html={t(k)} />
          ))}
        </ul>
        <h3 className="sheet-h3">{t('help.table')}</h3>
        <div className="gtable" dir="rtl">
          {TABLE.map(([c, v]) => (
            <span key={c}>
              <b>{c}</b>
              <i>{v}</i>
              {level !== 'reads' && <small className="ln">{letterName(c, locale)}</small>}
            </span>
          ))}
        </div>
        <p className="sheet-note">{t('help.finals')}</p>
        <p className="sheet-note">
          <a href="#/letters" onClick={close}>
            <span className="he">אבג</span> · {t('abc.title')} →
          </a>
        </p>
        <p className="sheet-note">{t('help.names')}</p>
        <h3 className="sheet-h3">{t('help.more')}</h3>
        {panel === 'help' && (
          <Suspense fallback={null}>
            <HelperContent inHelp />
          </Suspense>
        )}
        <button className="btn sheet-cta" data-autofocus onClick={close}>
          {t('help.go')}
        </button>
      </Sheet>

      <Sheet open={panel === 'about'} onClose={close} title={t('about.title')} closeLabel={t('menu.close')}>
        <div className="about-mark he">נפלאות</div>
        <Html as="div" className="prose" html={t('about.body')} />
        <div className="about-links">
          <a className="btn" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            {t('footer.donate')}
          </a>
          <a className="btn ghost" href="mailto:Office@mychitas.app">
            Office@mychitas.app
          </a>
        </div>
      </Sheet>
    </>
  );
}
