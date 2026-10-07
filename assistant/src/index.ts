/**
 * Niflaot AI assistant — a small Cloudflare Worker between the static site and the Claude API.
 * The API key lives only here (secret ANTHROPIC_API_KEY), never in the site bundle.
 *
 * POST /chat  { locale, messages: [{role, content}], context?: string }
 *   → application/x-ndjson stream of {"t": "<text>"} chunks, then {"done": true} or {"error": "..."}.
 */
import Anthropic from '@anthropic-ai/sdk';
import { gematria, letters, VALUES } from '../../src/core/gematria';

interface Env {
  ANTHROPIC_API_KEY: string;
  /** comma-separated list of allowed page origins */
  ALLOWED_ORIGINS?: string;
}

const MODEL = 'claude-opus-5-5';
const MAX_TURNS = 24;
const MAX_MESSAGE = 2000;
const MAX_CONTEXT = 24000;
const MAX_TOOL_ROUNDS = 5;

const SYSTEM = `You are the study assistant of "Niflaot" (niflaot.mychitas.app) — gematria games based on articles by Rabbi Yitzchak Ginsburgh from the "Niflaot" booklet (Gal Einai), made by the mychitas.app Torah project.

Who you help: parents learning with children, Chitas readers, children who love numbers. Be warm, clear and brief (a few short paragraphs at most). Answer in the language of the user's latest message (Russian or English most often).

What you do:
- Explain the lesson the user is on, Hebrew words, terms and the primary sources quoted in it.
- Teach mental arithmetic with gematria: show how to add letter values step by step (by place value, left to right; counting up for subtraction; splitting a factor for multiplication; division by chunks).
- Help with riddles by guiding, not by giving the answer. First ask what the user has tried, then give the smallest useful hint (e.g. which letters to add, or how to group them). Give the final number only if the user explicitly asks for it after trying. The lesson context marks which riddles are already solved — for those you may discuss everything.
- Encourage the "question for yourself" and the practical conclusion of the lesson, without preaching.

Accuracy rules:
- Never compute gematria in your head: call the gematria tool for every Hebrew word or phrase whose value you state, and use only its results.
- Attribute to Rabbi Ginsburgh only what is in the lesson context. If something is not there, say that it is your own general explanation, or that you don't know. Do not invent quotes, sources or page numbers.
- For questions of practical halacha, refer the user to a competent rabbi.
- Out of respect for G-d's Names, write אלקים (not with ה), ה׳ for the Tetragrammaton, and "Б-г" / "G-d" in Russian / English. Gematria is still computed from the real spelling (the tool handles that if you pass the real spelling).
- Stay on topic: Torah, this lesson, gematria, Hebrew, mental math, how to use the site. Politely decline unrelated requests.

How the site works (for "how do I…" questions): tap a word card to see its letters and values, then add them yourself; answer step by step; "Hint" costs points; after solving, the explanation, the lesson text, "Primary sources" (original + translation, link to Sefaria) and a question for yourself open. The menu has "Mental math" with a technique and trainer for each operation, a gematria calculator at the bottom of a lesson, and a printable version.

Format: plain text with short paragraphs; you may use simple "-" lists and **bold**. No tables, no headings.`;

const GEMATRIA_TOOL: Anthropic.Beta.BetaTool = {
  name: 'gematria',
  description:
    'Standard gematria (mispar hechrechi) of Hebrew text: א=1 … ת=400, final letters equal regular ones, non-Hebrew characters ignored. Returns the total, the value of each word and the letter-by-letter breakdown. Use it for every gematria value you mention.',
  input_schema: {
    type: 'object',
    properties: { text: { type: 'string', description: 'Hebrew word or phrase, real spelling' } },
    required: ['text'],
    additionalProperties: false,
  },
  strict: true,
};

function runGematria(text: string) {
  const words = text.split(/\s+/).filter((w) => letters(w).length);
  return {
    total: gematria(text),
    words: words.map((w) => ({
      word: w,
      value: gematria(w),
      letters: letters(w).map((c) => `${c}=${VALUES[c]}`).join(' + '),
    })),
  };
}

type Turn = { role: 'user' | 'assistant'; content: string };

function parse(body: unknown): { messages: Turn[]; context: string } | string {
  if (!body || typeof body !== 'object') return 'bad body';
  const { messages, context } = body as { messages?: unknown; context?: unknown };
  if (!Array.isArray(messages) || !messages.length || messages.length > MAX_TURNS) return 'bad messages';
  const out: Turn[] = [];
  for (const m of messages) {
    const role = (m as Turn)?.role;
    const content = (m as Turn)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim()) return 'bad message';
    if (content.length > MAX_MESSAGE * (role === 'assistant' ? 4 : 1)) return 'message too long';
    out.push({ role, content });
  }
  if (out[0].role !== 'user' || out[out.length - 1].role !== 'user') return 'bad order';
  if (context !== undefined && typeof context !== 'string') return 'bad context';
  return { messages: out, context: (context ?? '').slice(0, MAX_CONTEXT) };
}

function cors(origin: string | null, env: Env): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS ?? 'https://niflaot.mychitas.app').split(',').map((s) => s.trim());
  const ok = origin && (allowed.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function chat(env: Env, input: { messages: Turn[]; context: string }, write: (o: object) => Promise<void>) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const messages: Anthropic.Beta.BetaMessageParam[] = input.messages.map((m) => ({ role: m.role, content: m.content }));
  // the lesson context rides in front of the conversation so the system prompt stays cacheable
  if (input.context) {
    messages[0] = {
      role: 'user',
      content: [
        { type: 'text', text: `<lesson_context>\n${input.context}\n</lesson_context>` },
        { type: 'text', text: input.messages[0].content },
      ],
    };
  }

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      tools: [GEMATRIA_TOOL],
      messages,
    });
    for await (const ev of stream) {
      if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') await write({ t: ev.delta.text });
    }
    const msg = await stream.finalMessage();
    if (msg.stop_reason === 'refusal') return write({ error: 'refusal' });
    if (msg.stop_reason !== 'tool_use') return write({ done: true });

    messages.push({ role: 'assistant', content: msg.content });
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const b of msg.content) {
      if (b.type !== 'tool_use') continue;
      const text = (b.input as { text?: unknown })?.text;
      results.push(
        typeof text === 'string'
          ? { type: 'tool_result', tool_use_id: b.id, content: JSON.stringify(runGematria(text)) }
          : { type: 'tool_result', tool_use_id: b.id, content: 'text must be a string', is_error: true },
      );
    }
    messages.push({ role: 'user', content: results });
  }
  return write({ done: true });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const headers = cors(req.headers.get('Origin'), env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (req.method !== 'POST' || new URL(req.url).pathname !== '/chat')
      return new Response('Not found', { status: 404, headers });

    const input = parse(await req.json().catch(() => null));
    if (typeof input === 'string') return new Response(input, { status: 400, headers });

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    const enc = new TextEncoder();
    const write = (o: object) => writer.write(enc.encode(JSON.stringify(o) + '\n'));

    ctx.waitUntil(
      chat(env, input, write)
        .catch(async (e) => {
          console.error(e);
          const busy = e instanceof Anthropic.RateLimitError || e instanceof Anthropic.InternalServerError;
          await write({ error: busy ? 'busy' : 'failed' }).catch(() => {});
        })
        .finally(() => writer.close().catch(() => {})),
    );
    return new Response(readable, {
      headers: { ...headers, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  },
};
