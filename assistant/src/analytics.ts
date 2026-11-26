/**
 * Private GoatCounter read-only proxy. The browser supplies the admin's existing GitHub PAT;
 * we verify repository push permission on every request. GoatCounter's API key stays in Worker secrets.
 */
export interface AnalyticsEnv {
  GOATCOUNTER_API_KEY?: string;
  LIMITER?: { limit(o: { key: string }): Promise<{ success: boolean }> };
}

const json = (data: unknown, status = 200, headers: Record<string,string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

export async function analyticsRoute(req: Request, env: AnalyticsEnv): Promise<Response> {
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
  const auth = req.headers.get('Authorization') ?? '';
  if (!/^Bearer\s+\S+$/i.test(auth)) return json({ error: 'admin_auth_required' }, 401);

  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.LIMITER && !(await env.LIMITER.limit({ key: `analytics:${ip}` })).success)
    return json({ error: 'rate_limited' }, 429, { 'Retry-After': '60' });

  // The same GitHub credential used to enter the editor must have push access to this exact repository.
  const github = await fetch('https://api.github.com/repos/TeacherRG/Niflaot', {
    headers: { Authorization: auth, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'niflaot-admin-analytics' },
  });
  if (!github.ok) return json({ error: github.status === 401 ? 'github_token_invalid' : 'admin_access_denied' }, github.status === 401 ? 401 : 403);
  const access = await github.json() as { permissions?: { push?: boolean } };
  if (!access.permissions?.push) return json({ error: 'admin_access_denied' }, 403);
  if (!env.GOATCOUNTER_API_KEY) return json({ error: 'analytics_not_configured' }, 503);

  const requested = new URL(req.url).searchParams.get('days');
  const days = requested === '7' || requested === '90' ? Number(requested) : 30;
  const end = new Date();
  end.setUTCMinutes(0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  start.setUTCHours(0, 0, 0, 0);
  const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
  const headers = { Authorization: `Bearer ${env.GOATCOUNTER_API_KEY}`, 'Content-Type': 'application/json' };

  try {
    const [totalRes, hitsRes] = await Promise.all([
      fetch(`https://niflaot.goatcounter.com/api/v0/stats/total?${params}`, { headers }),
      fetch(`https://niflaot.goatcounter.com/api/v0/stats/hits?${new URLSearchParams({ ...Object.fromEntries(params), group: 'day', limit: '100' })}`, { headers }),
    ]);
    if (!totalRes.ok || !hitsRes.ok) return json({ error: 'goatcounter_api_error', status: !totalRes.ok ? totalRes.status : hitsRes.status }, 502);
    const [total, hits] = await Promise.all([totalRes.json(), hitsRes.json()]);
    return json({ days, start: start.toISOString(), end: end.toISOString(), total, hits });
  } catch {
    return json({ error: 'analytics_upstream_unavailable' }, 502);
  }
}
