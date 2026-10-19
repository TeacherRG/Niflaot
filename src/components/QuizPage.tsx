import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { QrCode } from './QrCode';
import { HebrewRuns } from './Hebrew';
import { useMode } from '../core/mode';
import { routeLink, SITE_HOST } from '../core/site';
import { GAME_SIZES, validCode, type View } from '../core/quizGame';
import type { DeckInfo, DeckKind, QuizLang } from '../core/quizDecks';
import { createRoom, hostKey, loadDecks, playerId, quizAvailable, rememberName, useCountdown, useRoom } from '../core/liveQuiz';

/**
 * «Викторина вместе» (`#/quiz`): ведущий выбирает вопросы (главу Торы; взрослым — и неделю Пророков и Писаний, маамар
 * Хасидута) и создаёт комнату — `#/quiz/host/<код>`: большой экран с QR-кодом, вопросом, таймером и итогами; игроки
 * входят по коду или QR — `#/quiz/<код>`: имя на эту игру и кнопки вариантов. Правила — src/core/quizGame.ts,
 * связь — src/core/liveQuiz.ts, сервер — assistant/src/quiz.ts.
 */
export function QuizPage({ code, host }: { code?: string; host?: boolean }) {
  const { t } = useI18n();
  useEffect(() => {
    document.title = `${t('lq.title')} · ${t('app.title')}`;
  }, [t]);
  const ok = code && validCode(code.toUpperCase());
  return (
    <>
      <TopBar title={t('lq.title')} />
      <main className={`quiz-page${host ? ' quiz-host' : ''}`}>
        {!quizAvailable() ? (
          <p className="quiz-note">{t('lq.offline')}</p>
        ) : !code ? (
          <QuizHome />
        ) : !ok ? (
          <p className="quiz-note">{t('lq.closed')}</p>
        ) : host ? (
          <Host code={code.toUpperCase()} />
        ) : (
          <Player code={code.toUpperCase()} />
        )}
      </main>
      <Colophon />
    </>
  );
}

const LETTERS = ['A', 'B', 'C', 'D'];

/** Вопрос с Ивритом — справа налево в своих кусочках. */
const Text = ({ s }: { s: string }) => <HebrewRuns text={s} />;

function QuizHome() {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const [decks, setDecks] = useState<DeckInfo[] | null>(null);
  const [deck, setDeck] = useState('');
  const [n, setN] = useState<number>(12);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [join, setJoin] = useState('');
  const lang = (['ru', 'en', 'de'].includes(locale) ? locale : 'ru') as QuizLang;

  useEffect(() => {
    loadDecks().then(
      (all) => {
        // the children — the Torah only; a week's deck once the week has begun; the newest chapter / week first
        const today = new Date().toLocaleDateString('sv');
        const shown = all.filter((d) => (adults || d.kind === 'torah') && (!d.from || d.from <= today)).reverse();
        setDecks(shown);
        setDeck((shown.find((d) => d.kind === 'torah') ?? shown[0])?.id ?? '');
      },
      () => setNote(t('lq.failed')),
    );
  }, [adults, t]);

  const groups = useMemo(() => {
    const kinds: DeckKind[] = ['torah', 'tanakh', 'hs'];
    return kinds.map((k) => ({ k, decks: (decks ?? []).filter((d) => d.kind === k) })).filter((g) => g.decks.length);
  }, [decks]);

  const create = async () => {
    setBusy(true);
    setNote('');
    try {
      const c = await createRoom(deck, lang, n);
      location.hash = `#/quiz/host/${c}`;
    } catch {
      setNote(t('lq.failed'));
    } finally {
      setBusy(false);
    }
  };
  const code = join.toUpperCase().replace(/[^A-Z0-9]/g, '');

  return (
    <>
      <h1>{t('lq.title')}</h1>
      <p className="quiz-lead">{t('lq.lead')}</p>
      <section className="quiz-card">
        <h2>{t('lq.joinH')}</h2>
        <form
          className="quiz-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (validCode(code)) location.hash = `#/quiz/${code}`;
          }}
        >
          <input className="quiz-code-in" value={join} onChange={(e) => setJoin(e.target.value)} maxLength={5} placeholder="ABC23" aria-label={t('lq.code')} autoCapitalize="characters" autoComplete="off" spellCheck={false} />
          <button className="btn" disabled={!validCode(code)}>
            {t('lq.go')}
          </button>
        </form>
      </section>
      <section className="quiz-card">
        <h2>{t('lq.hostH')}</h2>
        {!decks ? (
          <p className="quiz-note">{note || t('lq.loading')}</p>
        ) : (
          <>
            {groups.map((g) => (
              <fieldset key={g.k} className="quiz-decks">
                <legend>{t(`lq.group.${g.k}`)}</legend>
                {g.decks.map((d) => (
                  <label key={d.id} className={`quiz-deck${deck === d.id ? ' on' : ''}`}>
                    <input type="radio" name="deck" checked={deck === d.id} onChange={() => setDeck(d.id)} />
                    <span>{d.title[lang]}</span>
                    <small>{t('lq.count', { n: d.n })}</small>
                  </label>
                ))}
              </fieldset>
            ))}
            <div className="quiz-row">
              <label>
                {t('lq.size')}{' '}
                <select value={n} onChange={(e) => setN(Number(e.target.value))}>
                  {GAME_SIZES.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn" disabled={busy || !deck} onClick={create}>
                {t('lq.create')}
              </button>
            </div>
            <p className="quiz-note">{t('lq.hostNote')}</p>
            {note && (
              <p className="quiz-note" role="status">
                {note}
              </p>
            )}
          </>
        )}
      </section>
    </>
  );
}

function Connection({ status, error }: { status: string; error?: string }) {
  const { t } = useI18n();
  if (status === 'closed') return <p className="quiz-note">{t('lq.closed')}</p>;
  if (status !== 'open')
    return (
      <p className="quiz-status" role="status">
        {t(status === 'lost' ? 'lq.lost' : 'lq.connecting')}
      </p>
    );
  return error ? (
    <p className="quiz-status" role="status">
      {t(`lq.err.${error as 'full' | 'started' | 'name'}`)}
    </p>
  ) : null;
}

/** Таблица мест (после вопроса и в конце). */
function Board({ v, me }: { v: View; me?: string }) {
  return (
    <ol className="quiz-board">
      {v.top.map((p, k) => (
        <li key={k} className={p.name === me ? 'me' : undefined}>
          <span className="num">{k + 1}</span>
          <span className="quiz-board-name">{p.name}</span>
          <b className="num">{p.score}</b>
        </li>
      ))}
    </ol>
  );
}

function Options({ v, pick, onPick, big }: { v: View; pick?: number; onPick?: (k: number) => void; big?: boolean }) {
  const a = v.reveal?.a;
  return (
    <div className={`quiz-opts${big ? ' big' : ''}`}>
      {v.q!.o.map((o, k) => {
        const cls = [`quiz-opt`, `c${k}`, a !== undefined && (k === a ? 'ok' : 'off'), pick === k && 'picked'].filter(Boolean).join(' ');
        const body = (
          <>
            <span className="quiz-letter" aria-hidden="true">
              {LETTERS[k]}
            </span>
            <span className="quiz-opt-text">
              <Text s={o} />
            </span>
            {v.reveal && <span className="quiz-count num">{v.reveal.counts[k]}</span>}
          </>
        );
        return onPick ? (
          <button key={k} className={cls} disabled={pick !== undefined || !!v.reveal} onClick={() => onPick(k)}>
            {body}
          </button>
        ) : (
          <div key={k} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

function Host({ code }: { code: string }) {
  const { t, locale } = useI18n();
  const key = hostKey(code);
  const { view: v, status, send, offset } = useRoom(code, `role=host&key=${encodeURIComponent(key ?? '')}`);
  const left = useCountdown(v?.phase === 'question' ? v.q?.deadline : undefined, offset);
  if (!key) return <p className="quiz-note">{t('lq.notHost')}</p>;
  const cmd = (c: string) => send({ t: 'cmd', cmd: c });
  if (!v) return <Connection status={status} />;
  const link = routeLink(`quiz/${code}`, 'quiz', locale);
  return (
    <div className="quiz-screen" lang={v.lang}>
      <Connection status={status} />
      <p className="quiz-eyebrow">{v.title}</p>
      {v.phase === 'lobby' && (
        <div className="quiz-lobby">
          <div className="quiz-join">
            <QrCode value={link} size={220} title={t('lq.qr')} />
            <div>
              <p>{t('lq.scan', { site: `${SITE_HOST}/#/quiz` })}</p>
              <p className="quiz-big-code num">{code}</p>
            </div>
          </div>
          <h2>{t('lq.players', { n: v.players })}</h2>
          <ul className="quiz-names">{v.names.length ? v.names.map((nm, k) => <li key={k}>{nm}</li>) : <li className="quiz-note">{t('lq.waitPlayers')}</li>}</ul>
          <button className="btn quiz-go" disabled={!v.players} onClick={() => cmd('start')}>
            {t('lq.start')}
          </button>
        </div>
      )}
      {(v.phase === 'question' || v.phase === 'reveal') && v.q && (
        <>
          <div className="quiz-qhead">
            <span>{t('lq.qn', { i: v.i + 1, n: v.n })}</span>
            {v.phase === 'question' ? <span className="quiz-timer num">{left}</span> : null}
            <span>{t('lq.answered', { a: v.answered, n: v.players })}</span>
          </div>
          <h2 className="quiz-q">
            <Text s={v.q.q} />
          </h2>
          <Options v={v} big />
          {v.reveal?.ex && <p className="quiz-ex">{v.reveal.ex}</p>}
          {v.phase === 'reveal' && <Board v={v} />}
          <div className="quiz-row">
            {v.phase === 'question' ? (
              <button className="btn" onClick={() => cmd('reveal')}>
                {t('lq.reveal')}
              </button>
            ) : (
              <button className="btn quiz-go" onClick={() => cmd('next')}>
                {t(v.i + 1 < v.n ? 'lq.next' : 'lq.finish')}
              </button>
            )}
            <button className="btn ghost" onClick={() => confirm(t('lq.endAsk')) && cmd('end')}>
              {t('lq.end')}
            </button>
          </div>
        </>
      )}
      {v.phase === 'final' && (
        <>
          <h2>{t('lq.final')}</h2>
          {v.top.length ? <Board v={v} /> : <p className="quiz-note">{t('lq.noPlayers')}</p>}
          <a className="btn" href="#/quiz">
            {t('lq.again')}
          </a>
        </>
      )}
    </div>
  );
}

function Player({ code }: { code: string }) {
  const { t } = useI18n();
  const me = useMemo(() => playerId(code), [code]);
  const [name, setName] = useState(me.name);
  const [joined, setJoined] = useState(false);
  const { view: v, status, error, send } = useRoom(code, `role=player&pid=${me.pid}`);
  const inGame = !!v?.me;
  // back in the same room (a reload): the server knows the player — say hello again with the same name
  useEffect(() => {
    if (status === 'open' && (joined || inGame) && name.trim()) send({ t: 'hello', name });
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!v) return <Connection status={status} />;
  if (!v.me)
    return (
      <div className="quiz-screen">
        <Connection status={status} error={error} />
        <p className="quiz-eyebrow">{v.title}</p>
        <form
          className="quiz-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            rememberName(code, me.pid, name.trim());
            setJoined(true);
            send({ t: 'hello', name: name.trim() });
          }}
        >
          <label className="quiz-name">
            {t('lq.name')}
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder={t('lq.namePh')} autoComplete="nickname" />
          </label>
          <button className="btn quiz-go" disabled={!name.trim() || v.phase === 'final'}>
            {t('lq.enter')}
          </button>
          <p className="quiz-note">{t('lq.nameNote')}</p>
        </form>
      </div>
    );
  const m = v.me;
  return (
    <div className="quiz-screen" lang={v.lang}>
      <Connection status={status} error={error} />
      <p className="quiz-me">
        <b>{m.name}</b> · {t('lq.score', { n: m.score })}
      </p>
      {v.phase === 'lobby' && <p className="quiz-wait">{t('lq.waiting')}</p>}
      {(v.phase === 'question' || v.phase === 'reveal') && v.q && (
        <>
          <p className="quiz-eyebrow">{t('lq.qn', { i: v.i + 1, n: v.n })}</p>
          <h2 className="quiz-q small">
            <Text s={v.q.q} />
          </h2>
          <Options v={v} pick={m.pick} onPick={(c) => send({ t: 'answer', i: v.i, c })} />
          {v.phase === 'question' && m.pick !== undefined && <p className="quiz-wait">{t('lq.sent')}</p>}
          {v.phase === 'reveal' && (
            <p className={`quiz-result ${m.got ? 'ok' : 'bad'}`}>
              {m.got ? t('lq.correct', { n: m.got }) : t(m.pick === undefined ? 'lq.missed' : 'lq.wrong')}
              {' · '}
              {t('lq.place', { n: m.place })}
            </p>
          )}
        </>
      )}
      {v.phase === 'final' && (
        <>
          <h2>{t('lq.final')}</h2>
          <p className="quiz-result ok">{t('lq.place', { n: m.place })}</p>
          <Board v={v} me={m.name} />
        </>
      )}
    </div>
  );
}
