import { useI18n } from '../i18n';
import { NIFLAOT_LOGO, PARTNERS } from '../core/partners';
import { PARSHIOT } from '../lessons/parshiot';
import { civilDate, jewishDate } from '../core/hebrewDate';
import type { Lesson } from '../lessons/types';
import { lessonLink, routeLink } from '../core/site';
import { QrCode } from './QrCode';

/**
 * The masthead of every printout, on its first page: the site's logo and the partners' logos, then the weekly portion
 * («Недельная глава · Берейшит · פרשת בראשית») and its Shabbat — the civil date and the Jewish date in Hebrew;
 * a QR code to the lesson online (`?ref=qr`: GoatCounter counts the visits that came from paper).
 */
function PrintLogos() {
  return (
    <div className="p-logos">
      <img className="p-logo-main" src={NIFLAOT_LOGO} alt="Niflaot" />
      <span className="p-logos-partners">
        {PARTNERS.map((p) => (
          <img key={p.id} src={p.logo} alt={p.name} />
        ))}
      </span>
    </div>
  );
}

export function PrintMasthead({ lesson }: { lesson: Lesson }) {
  const { t, locale } = useI18n();
  const parsha = PARSHIOT[lesson.parsha];
  return (
    <div className="p-mast">
      <PrintLogos />
      <div className="p-parsha">
        <div>
          <div className="p-parsha-lbl">{t('print.parsha')}</div>
          <div className="p-parsha-name">
            {parsha.name[locale as keyof typeof parsha.name] ?? parsha.name.ru}{' '}
            <span className="he">פרשת {parsha.he}</span>
          </div>
        </div>
        <div className="p-dates">
          <div>
            {t('print.shabbat')}, {civilDate(parsha.shabbat, locale)}
          </div>
          <div className="he">{jewishDate(parsha.shabbat)}</div>
        </div>
        <div className="p-qr">
          <QrCode value={lessonLink(lesson.slug, 'qr', locale)} size={64} title={t('print.qr')} />
          <span>{t('print.qr')}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * The masthead of a printed passage of «Пророки» / «Писания»: the logos, «Отрывок дня» with the section's name,
 * the day's civil and Jewish date, and a QR code to this day's page online.
 */
export function TanakhMasthead({ title, he, route, date }: { title: string; he: string; route: string; date: string }) {
  const { t, locale } = useI18n();
  return (
    <div className="p-mast print-only">
      <PrintLogos />
      <div className="p-parsha">
        <div>
          <div className="p-parsha-lbl">{t('tanakh.daySub')}</div>
          <div className="p-parsha-name">
            {title} <span className="he">{he}</span>
          </div>
        </div>
        <div className="p-dates">
          <div>{civilDate(date, locale)}</div>
          <div className="he">{jewishDate(date)}</div>
        </div>
        <div className="p-qr">
          <QrCode value={routeLink(route, 'qr', locale)} size={64} title={t('tanakh.printQr')} />
          <span>{t('tanakh.printQr')}</span>
        </div>
      </div>
    </div>
  );
}
