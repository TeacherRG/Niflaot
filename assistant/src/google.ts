/**
 * «Войти через Google» (owner, 02.11.2026): the site sends the person to Google (OpenID Connect, `response_type=id_token`,
 * scope `openid email`) and back with an ID token in the address; the server checks it here and signs in by its email —
 * the same account as with the code to the email. Only the email is taken from Google (no name, no picture).
 *
 * The token is a JWT signed by Google (RS256); its keys — https://www.googleapis.com/oauth2/v3/certs, kept in memory
 * as long as Google allows (Cache-Control max-age). Checked: the signature, `iss`, `aud` = our client id,
 * `exp`/`iat`, `email_verified`, and `nonce` — the one the site made for this sign-in.
 */
export interface GoogleClaims {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  email?: string;
  email_verified?: boolean | string;
  nonce?: string;
}
type Jwk = JsonWebKey & { kid: string };

const CERTS = 'https://www.googleapis.com/oauth2/v3/certs';
const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
/** the clocks of Google and of the server may differ a little */
const SKEW = 300;

let cache: { keys: Jwk[]; until: number } | null = null;
async function googleKeys(): Promise<Jwk[]> {
  if (cache && cache.until > Date.now()) return cache.keys;
  const res = await fetch(CERTS);
  if (!res.ok) throw new Error(`google certs ${res.status}`);
  const age = Number(/max-age=(\d+)/.exec(res.headers.get('Cache-Control') ?? '')?.[1] ?? 3600);
  const keys = ((await res.json()) as { keys: Jwk[] }).keys;
  cache = { keys, until: Date.now() + Math.min(age, 86400) * 1000 };
  return keys;
}

const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

/** The claims of a valid token, or the reason it is refused. `keys` and `now` (s) — for the tests. */
export async function verifyGoogleToken(
  token: string,
  o: { clientId: string; nonce: string; keys?: Jwk[]; now?: number },
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const parts = token.split('.');
  if (parts.length !== 3 || token.length > 4096) return { ok: false, error: 'format' };
  let header: { alg?: string; kid?: string };
  let claims: GoogleClaims;
  try {
    header = JSON.parse(new TextDecoder().decode(unb64(parts[0])));
    claims = JSON.parse(new TextDecoder().decode(unb64(parts[1])));
  } catch {
    return { ok: false, error: 'format' };
  }
  if (header.alg !== 'RS256') return { ok: false, error: 'alg' };
  const jwk = (o.keys ?? (await googleKeys())).find((k) => k.kid === header.kid);
  if (!jwk) return { ok: false, error: 'key' };
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  if (!(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, unb64(parts[2]), signed))) return { ok: false, error: 'signature' };
  const now = o.now ?? Math.floor(Date.now() / 1000);
  if (!ISSUERS.includes(claims.iss)) return { ok: false, error: 'iss' };
  if (claims.aud !== o.clientId) return { ok: false, error: 'aud' };
  if (!(claims.exp > now - SKEW) || !(claims.iat < now + SKEW)) return { ok: false, error: 'expired' };
  if (!o.nonce || claims.nonce !== o.nonce) return { ok: false, error: 'nonce' };
  if (!claims.email || !(claims.email_verified === true || claims.email_verified === 'true')) return { ok: false, error: 'email' };
  return { ok: true, email: claims.email.trim().toLowerCase() };
}
