import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { ASSISTANT_URL, askAssistant, type ChatTurn } from '../core/assistant';
import { HebrewRuns } from './Hebrew';
import { Icon, Sheet, useUI } from './ui';
import { Helper } from './Helper';

const SUGGEST: MessageKey[] = ['ai.s.lesson', 'ai.s.hint', 'ai.s.math', 'ai.s.source'];
const MAX_TURNS = 20;

/** **bold** inside a line; Hebrew runs are isolated so "ש = 300" keeps its order. */
function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <b key={i}>
        <HebrewRuns text={p.slice(2, -2)} />
      </b>
    ) : (
      <HebrewRuns key={i} text={p} />
    ),
  );
}

/** Minimal, safe rendering of the assistant's plain-text answer: paragraphs, "-" lists and bold. */
function Answer({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-•*]\s/.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, k) => (
                <li key={k}>{inline(l.replace(/^\s*[-•*]\s/, ''))}</li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            {lines.map((l, k) => (
              <Fragment key={k}>
                {k > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/**
 * Floating button + helper sheet. With the AI endpoint configured — a chat with Claude;
 * without it — the offline helper (gematria step by step, sources, answers to common questions).
 */
export function Assistant() {
  const { t } = useI18n();
  const { open } = useUI();
  const title = t(ASSISTANT_URL ? 'ai.title' : 'helper.title');
  return (
    <>
      <button className="ai-fab" onClick={() => open('assistant')} aria-label={title} title={title}>
        <Icon name="spark" size={20} />
      </button>
      {ASSISTANT_URL ? <AiChat /> : <Helper />}
    </>
  );
}

/** Chat with the AI assistant; its state lives here, so closing the sheet keeps the conversation. */
function AiChat() {
  const { t, locale } = useI18n();
  const { panel, open } = useUI();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const abort = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [turns, panel]);

  const send = async (q: string) => {
    q = q.trim();
    if (!q || busy) return;
    const history: ChatTurn[] = [...turns, { role: 'user' as const, content: q }].slice(-MAX_TURNS);
    if (history[0].role !== 'user') history.shift();
    setTurns([...history, { role: 'assistant', content: '' }]);
    setDraft('');
    setError('');
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    let answer = '';
    try {
      await askAssistant(
        history,
        locale,
        (chunk) => {
          answer += chunk;
          setTurns([...history, { role: 'assistant', content: answer }]);
        },
        ctrl.signal,
      );
    } catch (e) {
      if (!ctrl.signal.aborted) setError(String((e as Error).message) === 'busy' ? t('ai.busy') : t('ai.error'));
    } finally {
      // a failed or stopped exchange without any text is dropped so the next request stays valid
      if (!answer.trim()) setTurns(history.slice(0, -1));
      if (!answer.trim() && !ctrl.signal.aborted) setDraft(q);
      setBusy(false);
      abort.current = null;
    }
  };

  const clear = () => {
    abort.current?.abort();
    setTurns([]);
    setError('');
  };

  return (
    <Sheet open={panel === 'assistant'} onClose={() => open(null)} title={t('ai.title')} closeLabel={t('menu.close')}>
      <div className="ai">
        <div className="ai-log" ref={log} aria-live="polite">
          {!turns.length && (
            <div className="ai-hello">
              <p>{t('ai.hello')}</p>
              <div className="ai-suggest">
                {SUGGEST.map((k) => (
                  <button key={k} className="chip" onClick={() => send(t(k))}>
                    {t(k)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="ai-msg ai-user">
                <HebrewRuns text={m.content} />
              </div>
            ) : (
              <div key={i} className="ai-msg ai-bot">
                {m.content ? <Answer text={m.content} /> : <span className="ai-dots" aria-label={t('ai.thinking')} />}
              </div>
            ),
          )}
          {error && <div className="ai-error">{error}</div>}
        </div>
        <form
          className="ai-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <textarea
            data-autofocus
            value={draft}
            rows={2}
            maxLength={2000}
            placeholder={t('ai.placeholder')}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          {busy ? (
            <button type="button" className="btn ghost" onClick={() => abort.current?.abort()}>
              {t('ai.stop')}
            </button>
          ) : (
            <button type="submit" className="btn" disabled={!draft.trim()}>
              {t('ai.send')}
            </button>
          )}
        </form>
        <div className="ai-foot">
          <span>{t('ai.note')}</span>
          {turns.length > 0 && (
            <button className="link-btn" onClick={clear}>
              {t('ai.clear')}
            </button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
