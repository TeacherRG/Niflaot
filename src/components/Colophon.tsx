import { useState } from 'react';
import { Html, useI18n } from '../i18n';
import { copyText } from '../core/format';

const MAIL = 'Office@mychitas.app';

export function Colophon({ source }: { source?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(MAIL, document.getElementById('mail'))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <footer className="colophon">
      <div className="col-in">
        <div className="col-top">
          <div className="orn">✦ ✦ ✦</div>
          <Html as="p" className="rights" html={t('footer.rights')} />
        </div>
        <div className="col-grid">
          <div className="col-card">
            <span className="lbl">{t('footer.idea')}</span>
            <span className="val">
              {t('footer.ideaVal')}{' '}
              <a href="https://mychitas.app" target="_blank" rel="noopener">
                mychitas.app
              </a>
            </span>
          </div>
          <div className="col-card">
            <span className="lbl">{t('footer.contact')}</span>
            <span className="val" id="mail">
              {MAIL}
            </span>
            <button className="copy" onClick={copy}>
              {copied ? t('footer.copied') : t('footer.copyMail')}
            </button>
          </div>
        </div>
        <div className="donate">
          <div>
            <h3>{t('footer.donate')}</h3>
            <p>{t('footer.donateText')}</p>
          </div>
          <a className="cta" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            mychitas.app/donate
          </a>
        </div>
        <div className="fine">
          {source && (
            <>
              {source}
              <br />
            </>
          )}
          {t('footer.fine')}
        </div>
      </div>
    </footer>
  );
}
