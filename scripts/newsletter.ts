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
