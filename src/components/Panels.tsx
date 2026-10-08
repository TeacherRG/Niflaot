import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, findLesson } from '../lessons';
import { VALUES } from '../core/gematria';
import { OPS, SIGN } from '../core/mentalMath';
import { Icon, Sheet, useUI } from './ui';
import { ASSISTANT_URL } from '../core/assistant';
import { lessonGames } from './LessonTabs';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));

/** Side menu + "How to play" + "About" — rendered once at the app root. */
export function Panels() {
  const { t, pick, locale } = useI18n();
  const { panel, open, lessonSlug } = useUI();
  const close = () => open(null);
  // the portion of the open lesson or of its «Нифлаот Ребе» page: only its group is unfolded
  const currentParsha = lessonSlug ? findLesson(lessonSlug)?.parsha : location.hash.match(/^#\/rebbe\/([^/?]+)/)?.[1];

  return (
    <>
      <Sheet variant="drawer" open={panel === 'menu'} onClose={close} title={t('app.title')} closeLabel={t('menu.close')}>
        <nav className="menu">
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
                {g.lessons.map((l) => (
                  <a
                    key={l.slug}
                    href={`#/${l.slug}`}
                    onClick={close}
                    className="menu-item"
                    aria-current={l.slug === lessonSlug ? 'page' : undefined}
                  >
                    <span className="menu-num">{l.number}</span>
                    <span>
                      {pick(l.texts).value.title}
                      <small lang="he">{l.hebrewTitle}</small>
                    </span>
                  </a>
                ))}
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
                {g.rebbe.map((l) => (
                  <div key={l.slug} className="menu-rebbe">
                    <a href={`#/${l.slug}`} onClick={close} className="menu-item">
                      <span className="menu-num">{l.number}</span>
                      <span>
                        {pick(l.texts).value.title}
                        <small lang="he">{l.hebrewTitle}</small>
                      </span>
                    </a>
                    {/* the lesson's two games: «Расследование» and «Карточки» */}
                    {lessonGames(l)?.map((game) => (
                      <a
                        key={game.href}
                        href={game.href}
                        onClick={close}
                        className="menu-item menu-game"
                        aria-current={location.hash === game.href ? 'page' : undefined}
                      >
                        <span className="menu-num">{game.icon}</span>
                        <span>{t(game.label)}</span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </details>
          ))}
          <a href="#/" onClick={close} className="menu-item">
            <Icon name="book" />
            <span>{t('menu.allLessons')}</span>
          </a>
          <details className="menu-group" open={location.hash.startsWith('#/math')}>
            <summary className="menu-item">
              <Icon name="calc" />
              <span>{t('math.title')}</span>
            </summary>
            <div className="menu-sub">
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
          {/* the two games of a commentary lesson; a «Нифлаот Ребе» lesson has them under its section above */}
          {lessonSlug &&
            !findLesson(lessonSlug)!.series &&
            lessonGames(findLesson(lessonSlug)!)?.map((g) => (
              <a key={g.href} href={g.href} onClick={close} className="menu-item">
                <span className="menu-num">{g.icon}</span>
                <span>{t(g.label)}</span>
              </a>
            ))}
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
          <button className="menu-item" onClick={() => open('assistant')}>
            <Icon name="spark" />
            <span>{t(ASSISTANT_URL ? 'ai.title' : 'helper.title')}</span>
          </button>
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
            </span>
          ))}
        </div>
        <p className="sheet-note">{t('help.finals')}</p>
        <p className="sheet-note">{t('help.names')}</p>
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
