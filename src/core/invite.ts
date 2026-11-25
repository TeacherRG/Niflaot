/**
 * «Три сокровища» on the site (rules — src/core/inviteRules.ts, server — assistant/src/accounts.ts):
 * - the learner: while the campaign runs and they are signed in, their code is added to the links they share (src/core/site.ts);
 * - the friend: a device that opens a link with `r=<code>` for the first time (no `niflaot:trial` yet) is reported once,
 *   with the category of the page it landed on; its first day of study during the campaign — once more (+2 tickets).
 * Nothing personal leaves the friend's browser: a random device id and the category.
 */
import { authToken, inviteActive, inviteVisit, myInvite, useAccount, type InviteState } from './account';
import { CODE_RE, inCampaign, nomOf, type Nom } from './inviteRules';
import { setInviteCode } from './site';
import { STUDY_EVENT } from './habit';
import { useEffect, useState } from 'react';

const INVITED_KEY = 'niflaot:invited';
const CODE_KEY = 'niflaot:invite-code';
/** the trial start (src/core/gate.ts): set on a device's first visit — a device that has it is not new */
const TRIAL_KEY = 'niflaot:trial';

interface Invited {
  c: string;
  d: string;
  n: Nom;
  /** 1 — the server took the visit; 2 — and the day of study */
  s: 0 | 1 | 2;
}

const read = <T,>(k: string): T | null => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? 'null');
  } catch {
    return null;
  }
};
const write = (k: string, v: unknown) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const deviceId = () => Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => (b % 36).toString(36)).join('');

let sending: Promise<void> | null = null;
function report(inv: Invited) {
  return (sending ??= send(inv).finally(() => (sending = null)));
}
async function send(inv: Invited) {
  if (!inCampaign()) return;
  try {
    if (inv.s === 0) {
      await inviteVisit({ code: inv.c, device: inv.d, nom: inv.n });
      inv.s = 1;
      write(INVITED_KEY, inv);
    }
  } catch {}
}

/** First thing on the page (src/main.tsx), before the trial starts: a friend's device came by a learner's link. */
export function takeInvite() {
  try {
    const url = new URL(location.href);
    const code = url.searchParams.get('r');
    if (!code) return;
    url.searchParams.delete('r');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    if (!CODE_RE.test(code) || !inCampaign() || localStorage.getItem(TRIAL_KEY) || read<Invited>(INVITED_KEY)) return;
    const inv: Invited = { c: code, d: deviceId(), n: nomOf(location.pathname, location.hash), s: 0 };
    write(INVITED_KEY, inv);
    void report(inv);
  } catch {}
}

/** The friend studied: the person who brought them gets the extra tickets (once). Also the learner's code for the links. */
export function startInvites() {
  window.addEventListener(STUDY_EVENT, async () => {
    const inv = read<Invited>(INVITED_KEY);
    if (!inv || inv.s === 2 || !inCampaign()) return;
    await report(inv);
    if (inv.s !== 1) return;
    try {
      await inviteActive(inv.d);
      inv.s = 2;
      write(INVITED_KEY, inv);
    } catch {}
  });
  const cached = read<string>(CODE_KEY);
  if (authToken() && inCampaign()) {
    if (cached) setInviteCode(cached);
    else
      myInvite().then(
        (s) => {
          write(CODE_KEY, s.code);
          setInviteCode(s.code);
        },
        () => {},
      );
  }
  const inv = read<Invited>(INVITED_KEY);
  if (inv && inv.s === 0) void report(inv);
}

/** The learner's own counts (the account page); also keeps the code for the links. null — not signed in or no server. */
export function useMyInvite(): InviteState | null {
  const { token } = useAccount();
  const [state, setState] = useState<InviteState | null>(null);
  useEffect(() => {
    if (!token) {
      setInviteCode(null);
      write(CODE_KEY, null);
      setState(null);
      return;
    }
    let live = true;
    myInvite().then(
      (s) => {
        if (!live) return;
        write(CODE_KEY, s.code);
        if (inCampaign()) setInviteCode(s.code);
        setState(s);
      },
      () => {},
    );
    return () => {
      live = false;
    };
  }, [token]);
  return state;
}
