import { useState } from 'react';
import { useI18n } from '../i18n';
import { Sheet } from './ui';

const MAIL = 'Office@mychitas.app';

/**
 * The week's dedication (לעילוי נשמת) at the bottom of both homes; texts — `dedication.*`; empty name — no plaque.
 * `line` — the adults' home: one line, «🕯️ לעילוי נשמת · Для поднятия души Павел бен Яаков» (owner, 28.10.2026: more room
 * for the running gematria); on a phone — without the Hebrew words.
 * A candle — the elevation of a soul (owner, 10.11.2026); the plaque opens «Посвятить учёбу» — your own dedication, for the
 * success and health of those close to you or for the elevation of a soul, by mail.
 */
export function Dedication({ line = false }: { line?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const name = t('dedication.name');
  if (!name) return null;
  const candle = (
    <span className="ded-candle" aria-hidden="true">
      🕯️
    </span>
  );
  const plaque = line ? (
    <button type="button" className="dedication line" onClick={() => setOpen(true)} aria-label={`${t('dedication.lead')} ${name}. ${t('dedication.more')}`}>
      {candle}
      <span className="ded-he he" lang="he">
        לעילוי נשמת
      </span>
      <span className="ded-short">{t('dedication.short')}</span> <b className="ded-name">{name}</b>
    </button>
  ) : (
    <button type="button" className="dedication" onClick={() => setOpen(true)} aria-label={`${t('dedication.lead')} ${name}. ${t('dedication.more')}`}>
      <span className="ded-he he" lang="he">
        {candle} לעילוי נשמת
      </span>
      <span className="ded-lead">{t('dedication.lead')}</span>
      <span className="ded-name">{name}</span>
      <span className="ded-more">{t('dedication.more')}</span>
    </button>
  );
  const subject = encodeURIComponent(t('dedication.mailSubject'));
  return (
    <>
      {plaque}
      <Sheet open={open} onClose={() => setOpen(false)} title={t('dedication.title')} closeLabel={t('menu.close')}>
        <div className="ded-sheet">
          <div className="ded-sheet-now">
            <span className="ded-sheet-candle" aria-hidden="true">
              🕯️
            </span>
            <span className="ded-he he" lang="he">
              לעילוי נשמת
            </span>
            <span className="ded-lead">{t('dedication.lead')}</span>
            <span className="ded-name">{name}</span>
          </div>
          <p className="ded-sheet-lead">{t('dedication.yours')}</p>
          <ul className="ded-sheet-kinds">
            <li>
              <span aria-hidden="true">🕯️</span> {t('dedication.kindSoul')}
            </li>
            <li>
              <span aria-hidden="true">💚</span> {t('dedication.kindHealth')}
            </li>
            <li>
              <span aria-hidden="true">✨</span> {t('dedication.kindSuccess')}
            </li>
          </ul>
          <p className="ded-sheet-how">{t('dedication.how')}</p>
          <a className="btn ded-sheet-btn" href={`mailto:${MAIL}?subject=${subject}`}>
            {t('dedication.write')}
          </a>
          <p className="ded-sheet-mail">{MAIL}</p>
        </div>
      </Sheet>
    </>
  );
}
