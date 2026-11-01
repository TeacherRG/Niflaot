import { useState } from 'react';
import { useI18n } from '../i18n';
import { Icon } from './ui';
import { NOTE_MAX, setNote, toggleMark, type VerseNote, type VerseRef } from '../core/notes';

/**
 * «Мои закладки» у стиха (src/core/notes.ts): справа над стихом — закладка и «заметка», под стихом — своя заметка
 * (нажатие — править). Только на экране: в печать не идёт.
 */
export function VerseTools({ vref, entry, onNote, onShare }: { vref: VerseRef; entry?: VerseNote; onNote: () => void; onShare?: () => Promise<'shared' | 'saved'> }) {
  const { t } = useI18n();
  const marked = entry?.m === 1;
  const [share, setShare] = useState<'idle' | 'busy' | 'saved'>('idle');
  return (
    <span className="tk-vtools no-print">
      {share === 'saved' && (
        <small className="tk-vsaved" role="status">
          {t('notes.shareSaved')}
        </small>
      )}
      {onShare && (
        <button
          type="button"
          className="tk-vbtn"
          title={t('notes.share')}
          aria-label={t('notes.share')}
          disabled={share === 'busy'}
          onClick={async () => {
            setShare('busy');
            try {
              const r = await onShare();
              setShare(r === 'saved' ? 'saved' : 'idle');
              if (r === 'saved') setTimeout(() => setShare('idle'), 3000);
            } catch {
              setShare('idle');
            }
          }}
        >
          <Icon name="share" size={17} />
        </button>
      )}
      <button type="button" className={`tk-vbtn${marked ? ' on' : ''}`} aria-pressed={marked} title={t(marked ? 'notes.unmark' : 'notes.mark')} aria-label={t(marked ? 'notes.unmark' : 'notes.mark')} onClick={() => toggleMark(vref)}>
        <Icon name="bookmark" size={17} />
      </button>
      <button type="button" className={`tk-vbtn${entry?.n ? ' on' : ''}`} title={t(entry?.n ? 'notes.edit' : 'notes.add')} aria-label={t(entry?.n ? 'notes.edit' : 'notes.add')} onClick={onNote}>
        <Icon name="pen" size={17} />
      </button>
    </span>
  );
}

/** заметка под стихом: показ или правка */
export function VerseNoteBox({ vref, entry, editing, onDone }: { vref: VerseRef; entry?: VerseNote; editing: boolean; onDone: (edit?: boolean) => void }) {
  const { t } = useI18n();
  const [text, setText] = useState(entry?.n ?? '');
  if (editing)
    return (
      <form
        className="tk-vnote edit no-print"
        onSubmit={(e) => {
          e.preventDefault();
          setNote(vref, text);
          onDone();
        }}
      >
        <label className="tk-vnote-head" htmlFor={`note-${vref.key}`}>
          {t('notes.my')}
        </label>
        <textarea id={`note-${vref.key}`} value={text} maxLength={NOTE_MAX} rows={3} autoFocus placeholder={t('notes.placeholder')} onChange={(e) => setText(e.target.value)} />
        <span className="tk-vnote-btns">
          <button type="submit" className="btn">
            {t('notes.save')}
          </button>
          <button type="button" className="btn ghost" onClick={() => onDone()}>
            {t('notes.cancel')}
          </button>
          {entry?.n && (
            <button
              type="button"
              className="btn ghost tk-vnote-del"
              onClick={() => {
                setNote(vref, '');
                onDone();
              }}
            >
              {t('notes.delete')}
            </button>
          )}
        </span>
      </form>
    );
  if (!entry?.n) return null;
  return (
    <button type="button" className="tk-vnote no-print" onClick={() => onDone(true)} title={t('notes.edit')}>
      <span className="tk-vnote-head">{t('notes.my')}</span>
      <span className="tk-vnote-text">{entry.n}</span>
    </button>
  );
}

