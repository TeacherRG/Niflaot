export type NewsletterFile = { filename: string; content: string };

export const newsletterEnabled = () => !!(process.env.ASSISTANT_URL && process.env.NEWSLETTER_SECRET);

export async function deliverNewsletter(issue: {
  frequency: 'daily' | 'weekly';
  date: string;
  lang: 'ru' | 'en' | 'de';
  subject: string;
  text: string;
  attachments: NewsletterFile[];
}) {
  const { ASSISTANT_URL, NEWSLETTER_SECRET } = process.env;
  if (!ASSISTANT_URL || !NEWSLETTER_SECRET) {
    console.warn('Email newsletter is not configured; set ASSISTANT_URL and the NEWSLETTER_SECRET Actions secret.');
    return;
  }
  const response = await fetch(`${ASSISTANT_URL.replace(/\/$/, '')}/account/newsletter/deliver`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${NEWSLETTER_SECRET}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      frequency: issue.frequency,
      issue: issue.date,
      lang: issue.lang,
      subject: issue.subject,
      text: issue.text,
      attachments: issue.attachments,
    }),
  });
  const result = (await response.json().catch(() => ({}))) as { error?: string; sent?: number };
  if (!response.ok) throw new Error(`newsletter ${issue.lang}: ${result.error ?? response.status}`);
  console.log(`newsletter ${issue.lang}: emailed ${result.sent ?? 0} ${issue.frequency} subscribers for ${issue.date}`);
}

export const plainNewsletterText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|quot|#39);/gi, (entity) => {
      switch (entity.toLowerCase()) {
        case '&amp;':
          return '&';
        case '&quot;':
          return '"';
        default:
          return "'";
      }
    })
    .trim();

/**
 * Email through Buttondown (owner, 11.11.2026: «через Buttondown, со ссылками вместо вложений»): one issue for every
 * subscriber of the Buttondown list, all three languages in it (Russian first) — the same text as the Telegram post,
 * and links to the page / its print view instead of PDF attachments. Needs the Actions secret BUTTONDOWN_API_KEY.
 * The idempotency key (`niflaot-<kind>-<date>`) keeps a retried run from sending the issue twice.
 */
export const buttondownEnabled = () => !!process.env.BUTTONDOWN_API_KEY;

export type MailSection = { lang: 'ru' | 'en' | 'de'; heading: string; text: string; links: { label: string; url: string }[] };

/** Telegram HTML → Markdown for Buttondown: plain text, every line kept, bare links clickable */
export function mailMarkdown(html: string): string {
  return plainNewsletterText(html)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<>)]+)/g, '$1<$2>')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('  \n');
}

export async function sendButtondown(issue: { key: string; subject: string; sections: MailSection[] }) {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) throw new Error('BUTTONDOWN_API_KEY is not set');
  const body = issue.sections
    .map((s) => [`# ${s.heading}`, '', mailMarkdown(s.text), '', ...s.links.map((l) => `**[${l.label}](${l.url})**  `)].join('\n'))
    .join('\n\n---\n\n');
  const res = await fetch('https://api.buttondown.com/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Buttondown-Live-Dangerously': 'true',
      'X-Idempotency-Key': `niflaot-${issue.key}`,
    },
    body: JSON.stringify({ subject: issue.subject, body, status: 'about_to_send' }),
  });
  if (!res.ok) throw new Error(`Buttondown ${issue.key}: ${res.status} ${(await res.text().catch(() => '')).slice(0, 300)}`);
  console.log(`Buttondown: issue ${issue.key} sent («${issue.subject}»)`);
}
