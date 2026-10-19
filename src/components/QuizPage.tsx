import { useEffect, useMemo, useRef, useState } from 'react';
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

/* ───── pictures of the start page (inline SVG, the colours of the answer buttons) ───── */

const C = ['#B4461B', '#2B4F95', '#A47C2F', '#2A7448'];

/** The big screen: a monitor with the question and the QR code. */
function ScreenArt() {
  return (
    <svg viewBox="0 0 120 90" className="quiz-art" aria-hidden="true">
      <rect x="6" y="6" width="108" height="64" rx="6" fill="#141A33" />
      <rect x="12" y="12" width="96" height="52" rx="3" fill="#fff" />
      <rect x="18" y="18" width="50" height="6" rx="3" fill="#141A33" opacity=".8" />
      {C.map((c, k) => (
        <rect key={k} x={18 + (k % 2) * 26} y={30 + Math.floor(k / 2) * 14} width="23" height="10" rx="2" fill={c} />
      ))}
      <rect x="76" y="20" width="26" height="26" rx="2" fill="#fff" stroke="#141A33" strokeWidth="2" />
      <path d="M80 24h6v6h-6zM92 24h6v6h-6zM80 36h6v6h-6zM90 34h3v3h-3zM95 39h3v3h-3zM90 40h3v2h-3z" fill="#141A33" />
      <rect x="52" y="70" width="16" height="10" fill="#141A33" />
      <rect x="36" y="80" width="48" height="5" rx="2.5" fill="#141A33" />
    </svg>
  );
}

/** A phone with the four answer buttons. */
function PhoneArt() {
  return (
    <svg viewBox="0 0 120 90" className="quiz-art" aria-hidden="true">
      <rect x="40" y="2" width="40" height="86" rx="7" fill="#141A33" />
      <rect x="44" y="10" width="32" height="70" rx="3" fill="#fff" />
      <rect x="48" y="15" width="24" height="4" rx="2" fill="#141A33" opacity=".7" />
      {C.map((c, k) => (
        <rect key={k} x="48" y={24 + k * 13} width="24" height="10" rx="2" fill={c} />
      ))}
      <circle cx="18" cy="30" r="4" fill={C[2]} />
      <circle cx="102" cy="50" r="4" fill={C[1]} />
      <path d="M14 56l6-3M100 24l6-3M98 70l7 2" stroke={C[0]} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** The results: a cup and the places. */
function CupArt() {
  return (
    <svg viewBox="0 0 120 90" className="quiz-art" aria-hidden="true">
      <rect x="22" y="58" width="24" height="26" rx="2" fill={C[1]} />
      <rect x="48" y="44" width="24" height="40" rx="2" fill={C[2]} />
      <rect x="74" y="66" width="24" height="18" rx="2" fill={C[0]} />
      <text x="34" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">2</text>
      <text x="60" y="68" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">1</text>
      <text x="86" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">3</text>
      <path d="M50 8h20v10a10 10 0 01-20 0z" fill="#D8B565" stroke="#A47C2F" strokeWidth="2" />
      <path d="M50 11h-5a5 5 0 005 7M70 11h5a5 5 0 01-5 7" fill="none" stroke="#A47C2F" strokeWidth="2" />
      <rect x="57" y="28" width="6" height="6" fill="#A47C2F" />
      <rect x="52" y="34" width="16" height="4" rx="2" fill="#A47C2F" />
    </svg>
  );
}

/** The kind of a deck: a Torah scroll, an open book, a flame. */
function KindIcon({ k }: { k: DeckKind }) {
  return (
    <svg viewBox="0 0 32 32" className={`quiz-kind k-${k}`} aria-hidden="true">
      {k === 'torah' ? (
        <>
          <rect x="4" y="5" width="5" height="22" rx="2.5" fill="currentColor" />
          <rect x="23" y="5" width="5" height="22" rx="2.5" fill="currentColor" />
          <rect x="9" y="8" width="14" height="16" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 12h8M12 15h8M12 18h6" stroke="currentColor" strokeWidth="1.3" />
        </>
      ) : k === 'tanakh' ? (
        <>
          <path d="M3 8c4-2 9-2 13 1v17c-4-3-9-3-13-1z" fill="#fff" stroke="currentColor" strokeWidth="1.8" />
          <path d="M29 8c-4-2-9-2-13 1v17c4-3 9-3 13-1z" fill="currentColor" />
        </>
      ) : (
        <path d="M16 3c1 6 8 8 8 15a8 8 0 01-16 0c0-4 2-6 4-8 0 3 1 5 3 5-1-4 0-8 1-12z" fill="currentColor" />
      )}
    </svg>
  );
}

/** A game takes about 45 s a question: 30 to answer and the answer with the places. */
const minutes = (n: number) => Math.round((n * 45) / 60);

function QuizHome() {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const [decks, setDecks] = useState<DeckInfo[] | null>(null);
  const [deck, setDeck] = useState('');
  const [n, setN] = useState<number>(12);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [join, setJoin] = useState('');
  const [hosting, setHosting] = useState(false);
  const setup = useRef<HTMLElement>(null);
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

  // «Я веду игру»: the setup opens below — bring it into view
  useEffect(() => {
    if (hosting) setup.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hosting]);

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
  const chosen = decks?.find((d) => d.id === deck);

  return (
    <>
      <header className="quiz-hero">
        <h1>{t('lq.title')}</h1>
        <p className="quiz-lead">{t('lq.lead')}</p>
      </header>

      <section className="quiz-how" aria-labelledby="quiz-how-h">
        <h2 id="quiz-how-h">{t('lq.howH')}</h2>
        <ol>
          {[<ScreenArt key="s" />, <PhoneArt key="p" />, <CupArt key="c" />].map((art, k) => (
            <li key={k}>
              {art}
              <span className="quiz-step num">{k + 1}</span>
              <b>{t(`lq.how${k + 1}` as 'lq.how1')}</b>
              <span>{t(`lq.how${k + 1}s` as 'lq.how1s')}</span>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="quiz-choose">{t('lq.chooseH')}</h2>
      <div className="quiz-roles">
        <section className="quiz-role play">
          <PhoneArt />
          <h3>{t('lq.playH')}</h3>
          <p>{t('lq.playSub')}</p>
          <form
            className="quiz-join-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (validCode(code)) location.hash = `#/quiz/${code}`;
            }}
          >
            <label className="quiz-code-lbl">
              {t('lq.code')}
              <input className="quiz-code-in" value={join} onChange={(e) => setJoin(e.target.value)} maxLength={5} placeholder="ABC23" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
            </label>
            <button className="btn quiz-go" disabled={!validCode(code)}>
              {t('lq.go')} →
            </button>
          </form>
          <p className="quiz-note">{t('lq.playNote')}</p>
        </section>
        <section className={`quiz-role host${hosting ? ' on' : ''}`}>
          <ScreenArt />
          <h3>{t('lq.hostH')}</h3>
          <p>{t('lq.hostSub')}</p>
          <button className="btn quiz-go" aria-expanded={hosting} onClick={() => setHosting(true)}>
            {t('lq.hostGo')} ↓
          </button>
          <p className="quiz-note">{t('lq.hostWhere')}</p>
        </section>
      </div>

      {hosting && (
        <section className="quiz-setup" ref={setup} aria-labelledby="quiz-setup-h">
          <h2 id="quiz-setup-h">{t('lq.setupH')}</h2>
          <div className="quiz-setup-step">
            <h3>
              <span className="quiz-step num">1</span> {t('lq.step1')}
            </h3>
            {!decks ? (
              <p className="quiz-note">{note || t('lq.loading')}</p>
            ) : (
              groups.map((g) => (
                <fieldset key={g.k} className="quiz-decks">
                  <legend>
                    <KindIcon k={g.k} /> {t(`lq.group.${g.k}`)}
                  </legend>
                  <div className="quiz-deck-grid">
                    {g.decks.map((d) => (
                      <label key={d.id} className={`quiz-deck k-${g.k}${deck === d.id ? ' on' : ''}`}>
                        <input type="radio" name="deck" checked={deck === d.id} onChange={() => setDeck(d.id)} />
                        {/* under the group's heading — without the group's name: «глава Лех леха», «18.10–23.10.2026» */}
                        <span>{d.title[lang].split(' · ').slice(1).join(' · ') || d.title[lang]}</span>
                        <small>{t('lq.count', { n: d.n })}</small>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))
            )}
          </div>
          <div className="quiz-setup-step">
            <h3>
              <span className="quiz-step num">2</span> {t('lq.step2')}
            </h3>
            <div className="quiz-sizes" role="radiogroup" aria-label={t('lq.step2')}>
              {GAME_SIZES.map((k) => (
                <button key={k} role="radio" aria-checked={n === k} className={`quiz-size${n === k ? ' on' : ''}`} onClick={() => setN(k)}>
                  <b className="num">{k}</b>
                  <small>{t('lq.minutes', { n: minutes(Math.min(k, chosen?.n ?? k)) })}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="quiz-setup-step">
            <h3>
              <span className="quiz-step num">3</span> {t('lq.step3')}
            </h3>
            <button className="btn quiz-go quiz-create" disabled={busy || !deck} onClick={create}>
              {t('lq.create')}
            </button>
            <p className="quiz-note">{t('lq.hostNote')}</p>
            {note && (
              <p className="quiz-note" role="status">
                {note}
              </p>
            )}
          </div>
        </section>
      )}
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
