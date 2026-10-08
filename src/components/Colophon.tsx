import { useI18n } from '../i18n';
import { SITE_URL } from '../core/site';
import { useUI } from './ui';

/** The footer of every page: the lesson's source (if any), then a band with the site, the year and MyChitas. */
export function Colophon({ source }: { source?: string }) {
  const { t } = useI18n();
  const { open } = useUI();
  return (
    <footer className="colophon">
      {source && <p className="colophon-source">{source}</p>}
      <div className="site-foot">
        <div className="site-foot-in">
          <a className="site-foot-brand" href={SITE_URL}>
            {t('app.title')}{' '}
            <span className="he" lang="he">
              נפלאות
            </span>
          </a>
          <span className="num site-foot-year">
            5787 · <span className="he">ה׳תשפ״ז</span>
          </span>
          <span className="site-foot-by">
            <span className="site-foot-more">{t('footer.project')} </span>
            <a href="https://mychitas.app" target="_blank" rel="noopener">
              mychitas.app
            </a>{' '}
            <span className="site-foot-more">· © 2026</span>
          </span>
          <button type="button" className="site-foot-more" onClick={() => open('about')}>
            {t('about.title')}
          </button>
          <a className="site-foot-more" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            {t('footer.donate')}
          </a>
        </div>
        <p className="site-foot-fine">{t('footer.fine').replace(/^©\s*mychitas\.app\s*·\s*/, '')}</p>
      </div>
    </footer>
  );
}
