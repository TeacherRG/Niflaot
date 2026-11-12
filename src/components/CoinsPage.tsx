import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { uiLang } from '../i18n/uiLang';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { useAccount } from '../core/account';
import { useHabit, todayIso } from '../core/habit';
import { buy, give, hasPushka, loadPushka, pendingGifts, useCoins, usePushka } from '../core/coins';
import { balance, CAUSES, CHEST_DAYS, chestProgress, earnedOn, earnedTotal, givenTotal, ITEMS, maaserDue, maaserKept, owns, PUSHKA_TARGET, READ_CAP, readsOn, REWARD, type Cause } from '../core/coinsRules';
import coin from '../assets/coins/coin.webp';
import coin3 from '../assets/coins/coin3.webp';
import chest from '../assets/coins/chest.webp';
import pushkaArt from '../assets/coins/pushka.webp';
import scroll from '../assets/coins/scroll.webp';

const CAUSE_KEY = 'niflaot:coins-cause';
const GIFTS = [5, 10, 25];

/**
 * «Pelecoin» (`#/coins`): the player's game coins — the balance, what was earned today, the chest of the week, the common
 * tzedakah box of all players (a round of PUSHKA_TARGET coins; the vote — which cause the round goes to) and the
 * «Свитки мудрости». The rules — src/core/coinsRules.ts.
 */
export function CoinsPage() {
  const { t, locale } = useI18n();
  const { token } = useAccount();
  const s = useCoins();
  const h = useHabit();
  const box = usePushka();
  const today = todayIso();
  const have = balance(s);
  const [cause, setCause] = useState<Cause>(() => {
    try {
      const c = localStorage.getItem(CAUSE_KEY);
      return CAUSES.includes(c as Cause) ? (c as Cause) : CAUSES[0];
    } catch {
      return CAUSES[0];
    }
  });
  const [msg, setMsg] = useState('');
  const [waiting, setWaiting] = useState(pendingGifts);

  useEffect(() => {
    document.title = `${t('coins.name')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    loadPushka(token).then(() => setWaiting(pendingGifts()));
  }, [token]);

  const pick = (c: Cause) => {
    setCause(c);
    try {
      localStorage.setItem(CAUSE_KEY, c);
    } catch {}
  };
  const onGive = (n: number) => {
    if (!give(n, cause, token)) return setMsg(t('coins.noCoins'));
    setMsg(t('coins.gave', { n }));
    setWaiting(pendingGifts());
    setTimeout(() => setWaiting(pendingGifts()), 2500);
  };

  const due = maaserDue(s);
  const chestDays = chestProgress(s, h.streak, today);
  const votes = box?.votes ?? {};
  const voted = Object.values(votes).reduce((a, n) => a + n, 0);
  const date = (at: number) => new Date(at).toLocaleDateString(uiLang(locale), { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <TopBar title={t('coins.name')} />
      <div className="wrap coins">
        <header className="coins-head">
          <img src={coin} alt="" width={112} height={112} />
          <div>
            <h1>{t('coins.title')}</h1>
            <p className="coins-balance">
              <b>{have}</b> {t('coins.name')}
            </p>
            <p className="coins-lead">{t('coins.lead')}</p>
            <p className="coins-stat">{t('coins.stat', { earned: earnedTotal(s), given: givenTotal(s) })}</p>
          </div>
        </header>

        <section className="coins-today" aria-label={t('coins.todayH')}>
          <div className="coins-tile">
            <img src={coin3} alt="" width={56} height={56} />
            <div>
              <b>{t('coins.todayH')}</b>
              <span>{t('coins.todayEarned', { n: earnedOn(s, today) })}</span>
              <span>{t('coins.reads', { n: readsOn(s, today), cap: READ_CAP })}</span>
            </div>
          </div>
          <div className="coins-tile">
            <img src={chest} alt="" width={56} height={56} />
            <div>
              <b>{t('coins.chestH')}</b>
              <span className="coins-dots" role="img" aria-label={t('coins.chestDays', { n: chestDays, of: CHEST_DAYS })}>
                {Array.from({ length: CHEST_DAYS }, (_, i) => (
                  <i key={i} className={i < chestDays ? 'on' : ''} />
                ))}
              </span>
              <span>{chestDays >= CHEST_DAYS ? t('coins.chestOpen', { n: REWARD.chest }) : t('coins.chest', { n: REWARD.chest })}</span>
            </div>
          </div>
        </section>

        <section className="coins-box">
          <div className="coins-box-head">
            <img src={pushkaArt} alt="" width={96} height={96} />
            <div>
              <h2>{t('coins.pushkaH')}</h2>
              <p>{t('coins.pushkaLead', { target: PUSHKA_TARGET.toLocaleString(uiLang(locale)) })}</p>
            </div>
          </div>
          {box ? (
            <>
              <p className="coins-round">
                <b>{t('coins.round', { n: box.round })}</b>
                <span>{t('coins.roundOf', { coins: box.coins.toLocaleString(uiLang(locale)), target: box.target.toLocaleString(uiLang(locale)) })}</span>
              </p>
              <div className="coins-bar" role="progressbar" aria-valuemin={0} aria-valuemax={box.target} aria-valuenow={box.coins}>
                <i style={{ width: `${Math.max(box.coins ? 2 : 0, (100 * box.coins) / box.target)}%` }} />
              </div>
              {!!box.mine && <p className="coins-mine">{t('coins.mine', { n: box.mine })}</p>}
            </>
          ) : (
            <p className="coins-note">{t(hasPushka ? 'coins.pushkaWait' : 'coins.pushkaOff')}</p>
          )}

          <fieldset className="coins-vote">
            <legend>{t('coins.voteH')}</legend>
            {CAUSES.map((c) => (
              <label key={c} className={c === cause ? 'on' : ''}>
                <input type="radio" name="cause" checked={c === cause} onChange={() => pick(c)} />
                <span>{t(`coins.cause.${c}` as MessageKey)}</span>
                {voted > 0 && <small>{Math.round((100 * (votes[c] ?? 0)) / voted)}%</small>}
              </label>
            ))}
          </fieldset>

          <div className="coins-give">
            <b>{t('coins.giveH')}</b>
            {GIFTS.map((n) => (
              <button key={n} className="btn ghost" disabled={have < n || !hasPushka} onClick={() => onGive(n)}>
                {n}
              </button>
            ))}
            {due > 0 && (
              <button className="btn" disabled={!hasPushka} onClick={() => onGive(due)}>
                {t('coins.giveMaaser', { n: due })}
              </button>
            )}
          </div>
          <p className="coins-note" role="status">
            {msg}
          </p>
          <p className="coins-note">{maaserKept(s) ? t('coins.maaserOn') : t('coins.maaserOff')}</p>
          {waiting > 0 && (
            <p className="coins-note">
              {t('coins.pending', { n: waiting })} {!token && <a href="#/account">{t('coins.signIn')}</a>}
            </p>
          )}
          {!!box?.closed.length && (
            <>
              <h3>{t('coins.closedH')}</h3>
              <ul className="coins-closed">
                {box.closed.map((c) => (
                  <li key={c.n}>
                    {t('coins.round', { n: c.n })} · {date(c.at)} · {t(`coins.cause.${CAUSES.includes(c.cause as Cause) ? c.cause : CAUSES[0]}` as MessageKey)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section>
          <h2>{t('coins.shopH')}</h2>
          <p className="coins-lead">{t('coins.shopLead')}</p>
          <ul className="coins-shop">
            {ITEMS.map((it) => {
              const mine = owns(s, it.id);
              return (
                <li key={it.id} className={mine ? 'open' : ''}>
                  <img src={scroll} alt="" width={64} height={64} />
                  <span className="he coins-he" lang="he" aria-hidden="true">
                    {it.he}
                  </span>
                  <b>{t(`coins.item.${it.id}.t` as MessageKey)}</b>
                  {mine ? (
                    <p>{t(`coins.item.${it.id}.b` as MessageKey)}</p>
                  ) : (
                    <button className="btn" disabled={have < it.cost} onClick={() => buy(it.id)}>
                      {t('coins.buy', { n: it.cost })}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="coins-how">
          <h2>{t('coins.howH')}</h2>
          <ul>
            {(['read', 'answer', 'chest', 'maaser'] as const).map((k) => (
              <li key={k}>{t(`coins.how.${k}` as MessageKey)}</li>
            ))}
          </ul>
          <h2>{t('coins.rulesH')}</h2>
          <ul>
            {[1, 2, 3, 4].map((k) => (
              <li key={k}>{t(`coins.rules.${k}` as MessageKey)}</li>
            ))}
          </ul>
        </section>
      </div>
      <Colophon />
    </>
  );
}
