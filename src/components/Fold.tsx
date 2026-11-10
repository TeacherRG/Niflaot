import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Блок под отрывком дня Невиим и Ктувим, который раскрывается по нажатию (владелец, 10.11.2026: «кто и где, слова,
 * самопроверка — изначально в закрытом раскрывающемся элементе, граф — раскрытый с возможностью скрыть»). Выбор читателя
 * помнится на этом устройстве (`niflaot:tanakh-fold` = {<id>: открыт}). Заголовок — в строке <summary>; свой заголовок блока
 * внутри прячется (CSS `.tk-fold-body > section > h2:first-child`). Пустой блок (данных нет) — не показывается.
 */
const KEY = 'niflaot:tanakh-fold';
function readFold(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function Fold({ id, title, he, open: byDefault, children }: { id: string; title: string; he?: string; open: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(() => readFold()[id] ?? byDefault);
  const body = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(false);
  // the block inside loads its data by itself: watch whether it rendered anything
  useLayoutEffect(() => {
    const el = body.current;
    if (!el) return;
    const check = () => setEmpty(!el.childElementCount);
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true });
    return () => mo.disconnect();
  }, []);
  return (
    <details
      className="tk-fold no-print"
      open={open}
      hidden={empty}
      onToggle={(e) => {
        const now = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(now);
        try {
          localStorage.setItem(KEY, JSON.stringify({ ...readFold(), [id]: now }));
        } catch {
          /* the choice is only a convenience */
        }
      }}
    >
      <summary>
        <span className="tk-fold-t">{title}</span>
        {he && (
          <span className="he" lang="he">
            {he}
          </span>
        )}
      </summary>
      <div className="tk-fold-body" ref={body}>
        {children}
      </div>
    </details>
  );
}
