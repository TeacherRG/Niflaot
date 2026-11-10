# Email newsletter

`src/components/Subscribe.tsx` offers daily or weekly email in Russian, English, or German. A six-digit, one-time code
sent through the existing Resend setup confirms the address; codes expire after 10 minutes, allow five guesses, and
are rate-limited per address. The subscriber list and delivery history live in the `Accounts` Durable Object.

## What is sent

- **Daily:** on each study day, the text and printable PDF from the daily Prophets and Writings Telegram post.
- **Weekly:** on Wednesday, the Academy Week post and its PDF, plus the printable Memo game PDF for that week's Torah
  portion. Both attachments are rendered from the live site by the existing Playwright jobs.

Messages are sent only to confirmed subscribers matching both the requested frequency and site language. A delivery
record keyed by address, frequency, and issue prevents retries from sending the same issue twice. Shabbat and days
without a daily reading do not produce a daily email. Every email contains an unsubscribe link and one-click list
unsubscribe headers.

## Setup

1. Keep the existing Worker secrets `RESEND_API_KEY` and `MAIL_FROM` configured; the sender domain must be verified
   with Resend.
2. Generate a long random secret and set it in both places:
   - Worker: `cd assistant && npx wrangler secret put NEWSLETTER_SECRET`
   - Repository: Settings → Secrets and variables → Actions → Secrets → `NEWSLETTER_SECRET`.
3. Ensure the repository Actions variable `ASSISTANT_URL` points to the deployed Worker. The site already uses this
   variable for the assistant and account service.
4. Deploy the site and Worker. The existing `telegram-tanakh` and `telegram-digest` workflows deliver matching email
   issues as well as their Telegram posts. Missing newsletter secrets disable email delivery in those jobs with a
   warning; Telegram delivery continues.

The shared secret authorizes only the scheduled delivery endpoint; subscriber addresses are never returned to
GitHub Actions. Confirmation and unsubscribe tokens are stored as hashes. An email address can change its language or
frequency by subscribing again and confirming the new one-time code.
