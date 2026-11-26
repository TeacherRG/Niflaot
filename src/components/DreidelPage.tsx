import { useEffect, useMemo, useRef, useState } from 'react';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { QrCode } from './QrCode';
import { Dreidel3D } from './Dreidel3D';
import { validCode } from '../core/quizGame';
import { createDreidelRoom, dreidelAvailable, dreidelHostKey, dreidelPlayer, saveDreidelName, useDreidelRoom } from '../core/liveDreidel';
import type { DreidelView } from '../core/liveDreidel';
import './dreidelPage.css';

export function DreidelPage({ code, host }: { code?: string; host?: boolean }) {
  const valid = code && validCode(code.toUpperCase());
  return <><TopBar title="Дрейдл · Нифлаот" /><main className="dreidel-page">
    {!dreidelAvailable() ? <section className="dreidel-panel"><h1>Дрейдл</h1><p>Онлайн-игра сейчас недоступна.</p></section>
      : !code ? <DreidelHome />
      : !valid ? <p className="dreidel-muted">Неверный код комнаты.</p>
      : host ? <DreidelHost code={code.toUpperCase()} />
      : <DreidelPlayer code={code.toUpperCase()} />}
  </main><Colophon /></>;
}

function DreidelHome() {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const join = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const create = async () => {
    setBusy(true); setNote('');
    try { const room = await createDreidelRoom(); location.hash = '#/dreidel/host/' + room; }
    catch { setNote('Не удалось создать комнату. Попробуйте ещё раз.'); }
    finally { setBusy(false); }
  };
  return <><header className="dreidel-hero"><span>🪙</span><h1>Играем в дрейдл вместе</h1><p>Создайте комнату и пригласите друзей по ссылке WhatsApp. Игра откроется прямо внутри WhatsApp.</p></header>
    <section className="dreidel-panel"><h2>Начать игру</h2><button className="btn dreidel-primary" disabled={busy} onClick={create}>{busy ? 'Создаём…' : 'Создать комнату'}</button>
      <div className="dreidel-or">или войти по коду</div><form className="dreidel-join" onSubmit={(e) => { e.preventDefault(); if (validCode(join)) location.hash = '#/dreidel/' + join; }}>
        <label>Код комнаты<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={5} autoCapitalize="characters" autoComplete="off" placeholder="ABC23" /></label>
        <button className="btn" disabled={!validCode(join)}>Войти</button>
      </form>{note && <p className="dreidel-error" role="status">{note}</p>}
    </section>
    <section className="dreidel-rules"><h2>Как играть</h2><ul>
      <li><b>נ — Нун:</b> ничего не происходит.</li><li><b>ג — Гимел:</b> забрать весь банк.</li>
      <li><b>ה — Хей:</b> забрать половину банка.</li><li><b>ש — Шин:</b> положить одну монету в банк.</li>
    </ul><p>В начале у каждого 10 монет; каждый кладёт одну в общий банк. Затем игроки по очереди крутят волчок.</p></section>
  </>;
}

function Status({ status, error }: { status: string; error?: string }) {
  if (status === 'closed') return <p className="dreidel-error">Комната закрыта или не найдена.</p>;
  if (status !== 'open') return <p className="dreidel-muted">{status === 'lost' ? 'Связь прервалась, восстанавливаем…' : 'Подключаемся к комнате…'}</p>;
  if (error) return <p className="dreidel-error">{error === 'full' ? 'В комнате уже 30 игроков.' : error === 'started' ? 'Игра уже началась.' : 'Введите имя.'}</p>;
  return null;
}

function Invite({ code }: { code: string }) {
  const link = location.origin + location.pathname + '#/dreidel/' + code;
  const message = 'Давай сыграем в дрейдл в Нифлаот! Открой ссылку прямо в WhatsApp: ' + link;
  return <div className="dreidel-invite"><QrCode value={link} size={168} title="QR-код входа в игру" /><div><b>Код комнаты</b><strong className="dreidel-code">{code}</strong><a className="btn dreidel-whatsapp" href={'https://wa.me/?text=' + encodeURIComponent(message)} target="_blank" rel="noopener noreferrer">Пригласить в WhatsApp</a><button className="dreidel-copy" onClick={() => { void navigator.clipboard?.writeText(link); }}>Скопировать ссылку</button></div></div>;
}

function DreidelHost({ code }: { code: string }) {
  const key = dreidelHostKey(code);
  const { view, status, send } = useDreidelRoom(code, 'role=host&key=' + encodeURIComponent(key ?? ''));
  if (!key) return <p className="dreidel-error">Ключ ведущего не найден на этом устройстве.</p>;
  if (!view) return <Status status={status} />;
  return <div className="dreidel-room"><Status status={status} /><h1>Комната дрейдла</h1>
    {view.phase === 'lobby' ? <><Invite code={code} /><h2>Участники · {view.count}</h2><PlayerList view={view} /><button className="btn dreidel-primary" disabled={view.count < 2} onClick={() => send({ t: 'start' })}>Начать игру</button><p className="dreidel-muted">Нужно минимум два игрока.</p></>
      : <><GameBoard view={view} /><div className="dreidel-host-actions">{view.phase === 'playing' && <button className="btn" onClick={() => send({ t: 'end' })}>Завершить игру</button>}<a href="#/dreidel" className="btn">Новая игра</a></div></>}
  </div>;
}

function PlayerList({ view }: { view: DreidelView }) {
  return <ul className="dreidel-player-list">{view.players.map((p) => <li key={p.id}><span>{p.name}</span></li>)}</ul>;
}

function GameBoard({ view, me, onSpin }: { view: DreidelView; me?: boolean; onSpin?: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const lastSeen = useRef<number | null>(null);
  useEffect(() => {
    const id = view.last?.id ?? 0;
    if (lastSeen.current === null) { lastSeen.current = id; return; }
    if (id !== lastSeen.current) { lastSeen.current = id; setSpinning(true); }
  }, [view.last?.id]);
  const last = view.last;
  return <section className="dreidel-game"><div className="dreidel-score"><span>Общий банк <b>{view.pot}</b></span><span>Ходит <b>{view.turnName ?? '—'}</b></span></div>
    <Dreidel3D face={last?.face} spinning={spinning} onSpinEnd={() => setSpinning(false)} />
    {last && <p className="dreidel-last"><b>{last.name}</b>: выпало <strong>{last.face}</strong> · {last.delta > 0 ? '+' + last.delta : last.delta}</p>}
    <PlayerCoins view={view} />
    {me && view.me?.canSpin && <button className="btn dreidel-primary dreidel-spin" disabled={spinning} onClick={onSpin}>Крутить дрейдл</button>}
    {me && !view.me?.canSpin && view.phase === 'playing' && <p className="dreidel-muted">Сейчас ход игрока: {view.turnName}</p>}
    {view.phase === 'final' && <h2 className="dreidel-finished">Игра завершена</h2>}
  </section>;
}

function PlayerCoins({ view }: { view: DreidelView }) {
  return <ul className="dreidel-coins">{view.players.map((p) => <li key={p.id}><span>{p.name}</span><b>{p.coins} 🪙</b></li>)}</ul>;
}

function DreidelPlayer({ code }: { code: string }) {
  const stored = useMemo(() => dreidelPlayer(code), [code]);
  const [name, setName] = useState(stored.name);
  const [joined, setJoined] = useState(false);
  const { view, status, error, send } = useDreidelRoom(code, 'role=player&pid=' + stored.pid);
  useEffect(() => {
    if (status === 'open' && (joined || view?.me) && name.trim()) send({ t: 'hello', name });
  }, [status]);
  if (!view) return <Status status={status} />;
  if (!view.me) return <div className="dreidel-room"><Status status={status} error={error} /><h1>Войти в игру</h1><form className="dreidel-join-card" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; saveDreidelName(code, name.trim()); setJoined(true); send({ t: 'hello', name: name.trim() }); }}>
    <label>Ваше имя<input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoComplete="nickname" placeholder="Как вас зовут?" /></label><button className="btn dreidel-primary" disabled={!name.trim()}>Присоединиться</button>
  </form></div>;
  return <div className="dreidel-room"><Status status={status} error={error} /><h1>Дрейдл · {view.me.name}</h1><GameBoard view={view} me onSpin={() => send({ t: 'spin' })} /><p className="dreidel-muted">Ваши монеты: {view.me.coins}</p></div>;
}
