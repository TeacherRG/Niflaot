import { useI18n } from '../i18n';
import { uiLang } from '../i18n/uiLang';
import { useMyInvite } from '../core/invite';
import { CAMPAIGN, DAY_CAP, NOMS, campaignShown, inCampaign } from '../core/inviteRules';

/**
 * «Три сокровища» in the account (src/core/invite.ts): the learner's friends by category and their tickets for the wheel.
 * Shown from a week before the campaign to two days after the draw; only to a signed-in learner whose account is active.
 */
export function InviteCard() {
  const { t, locale } = useI18n();
  const me = useMyInvite();
  if (!campaignShown()) return null;
  const date = (iso: string, time = false) =>
    new Date(iso).toLocaleString(uiLang(locale), { day: 'numeric', month: 'long', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}), timeZone: 'Europe/Vienna' });
  const now = Date.now();
  const before = now < Date.parse(CAMPAIGN.from);
  const total = me ? NOMS.reduce((n, k) => n + me.noms[k].tickets, 0) : 0;
  return (
    <section className="acc-card inv-card">
      <h2>✨ {t('inv.title')}</h2>
      <p>{t('inv.lead', { from: date(CAMPAIGN.from), to: date(CAMPAIGN.to, true), draw: date(CAMPAIGN.draw, true) })}</p>
      <p className="acc-note">{t('inv.how', { cap: DAY_CAP })}</p>
      {before && <p className="inv-status">{t('inv.soon', { from: date(CAMPAIGN.from) })}</p>}
      {!before && !inCampaign() && <p className="inv-status">{t('inv.closed')}</p>}
      {me && (
        <>
          <table className="inv-table">
            <thead>
              <tr>
                <th>{t('inv.nom')}</th>
                <th>{t('inv.friends')}</th>
                <th>{t('inv.active')}</th>
                <th>{t('inv.tickets')}</th>
              </tr>
            </thead>
            <tbody>
              {NOMS.map((n) => (
                <tr key={n}>
                  <td>{t(`inv.nom.${n}`)}</td>
                  <td className="num">{me.noms[n].friends}</td>
                  <td className="num">{me.noms[n].active}</td>
                  <td className="num"><b>{me.noms[n].tickets}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="acc-note">{t('inv.total', { n: total })} · {t('inv.code', { code: me.code })}</p>
        </>
      )}
      <p className="acc-note">{t('inv.fair')}</p>
    </section>
  );
}
