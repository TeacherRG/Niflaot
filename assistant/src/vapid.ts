/**
 * VAPID (RFC 8292) for empty Web Push messages: an ES256 key pair and the `Authorization` header.
 * Plain WebCrypto, no dependencies — runs in the worker and in Node (scripts/check-push.ts checks it).
 */
export interface VapidKeys {
  /** the private key, JWK */
  jwk: JsonWebKey;
  /** the public key, raw P-256 point, base64url — the site's `applicationServerKey` */
  pub: string;
}

export const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const enc = new TextEncoder();
const P256 = { name: 'ECDSA', namedCurve: 'P-256' } as const;

export async function makeVapidKeys(): Promise<VapidKeys> {
  const pair = (await crypto.subtle.generateKey(P256, true, ['sign', 'verify'])) as CryptoKeyPair;
  return {
    jwk: (await crypto.subtle.exportKey('jwk', pair.privateKey)) as JsonWebKey,
    pub: b64url((await crypto.subtle.exportKey('raw', pair.publicKey)) as ArrayBuffer),
  };
}

/** `vapid t=<JWT>, k=<public key>` for a push to `endpoint`, valid 12 hours */
export async function vapidAuth(endpoint: string, keys: VapidKeys, contact: string, now = Date.now()) {
  const priv = await crypto.subtle.importKey('jwk', keys.jwk, P256, false, ['sign']);
  const head = b64url(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const body = b64url(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 12 * 3600, sub: contact })));
  // WebCrypto gives the raw r‖s signature (64 bytes) — exactly what JWS ES256 wants
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, priv, enc.encode(`${head}.${body}`));
  return `vapid t=${head}.${body}.${b64url(sig)}, k=${keys.pub}`;
}
