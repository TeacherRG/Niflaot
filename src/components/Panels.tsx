import { Html, useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { VALUES } from '../core/gematria';
import { Icon, Sheet, useUI } from './ui';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));

/** Side menu + "How to play" + "About" — rendered once at the app root. */
export function Panels() {
  const { t, pick } = useI18n();
  const { panel, open } = useUI();
  const close = () => open(null);

  return (
    <>
      <Sheet variant="drawer" open={panel === 'menu'} onClose={close} title={t('app.title')} closeLabel={t('menu.close')}>
        <nav className="menu">
          <div className="menu-lbl">{t('menu.lessons')}</div>
          {LESSONS.map((l) => (
            <a key={l.slug} href={`#/${l.slug}`} onClick={close} className="menu-item">
              <span className="menu-num">{l.number}</span>
              <span>
                {pick(l.texts).value.title}
                <small lang="he">{l.hebrewTitle}</small>
              </span>
            </a>
          ))}
          <a href="#/" onClick={close} className="menu-item">
            <Icon name="book" />
            <span>{t('menu.allLessons')}</span>
          </a>
          <div className="menu-sep" />
          <button className="menu-item" onClick={() => open('help')}>
            <Icon name="help" />
            <span>{t('help.title')}</span>
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
