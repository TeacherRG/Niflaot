import { useMemo } from 'react';
import './KabbalahMiniDial.css';

const HOURS = [
  ['ניסן', 'יהודה', '♈', 'יהוה'],
  ['אייר', 'יששכר', '♉', 'יההו'],
  ['סיוון', 'זבולון', '♊', 'יוהה'],
  ['תמוז', 'ראובן', '♋', 'הוהי'],
  ['אב', 'שמעון', '♌', 'הויה'],
  ['אלול', 'גד', '♍', 'ההוי'],
  ['תשרי', 'אפרים', '♎', 'והיה'],
  ['חשוון', 'מנשה', '♏', 'וההי'],
  ['כסלו', 'בנימין', '♐', 'ויהה'],
  ['טבת', 'דן', '♑', 'היהו'],
  ['שבט', 'אשר', '♒', 'היוה'],
  ['אדר', 'נפתלי', '♓', 'ההיו'],
] as const;

function point(angle: number, radius: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return [60 + radius * Math.cos(a), 60 + radius * Math.sin(a)] as const;
}
function sector(index: number) {
  const start = index * 30 - 15;
  const end = start + 30;
  const [x1, y1] = point(start, 56);
  const [x2, y2] = point(end, 56);
  return `M 60 60 L ${x1} ${y1} A 56 56 0 0 1 ${x2} ${y2} Z`;
}

/** Compact companion to the halachic clock: twelve months and their traditional correspondences. */
export function KabbalahMiniDial({ hour, day }: { hour: number; day: boolean }) {
  const active = Math.min(12, Math.max(1, hour)) - 1;
  const items = useMemo(() => HOURS, []);
  return (
    <aside className="clk-kmini" aria-label="Каббалистический циферблат: 12 месяцев и соответствий">
      <svg viewBox="0 0 120 120" role="img" aria-label={` ${day ? 'День' : 'Ночь'}, ${hour}-й час — ${items[active][0]}, колено ${items[active][1]}`}>
        <circle className="clk-kmini-aura" cx="60" cy="60" r="58" />
        {items.map((item, i) => {
          const angle = i * 30;
          const [x, y] = point(angle, 43);
          const [tx, ty] = point(angle, 31);
          return (
            <g key={item[0]} className={i === active ? 'active' : ''}>
              <path className="clk-kmini-sector" d={sector(i)} />
              <text className="clk-kmini-month" x={x} y={y} textAnchor="middle" dominantBaseline="central">{item[2]}</text>
              <title>{`${i + 1}-й час · ${item[0]} · ${item[1]} · ${day ? item[3] : 'אדני'}`}</title>
            </g>
          );
        })}
        <circle className="clk-kmini-core" cx="60" cy="60" r="23" />
        <text className="clk-kmini-number" x="60" y="56" textAnchor="middle" dominantBaseline="central">{hour}</text>
        <text className="clk-kmini-caption" x="60" y="69" textAnchor="middle">{day ? 'יום' : 'לילה'}</text>
      </svg>
      <div className="clk-kmini-current">
        <b>{items[active][0]}</b>
        <span>{items[active][1]}</span>
      </div>
    </aside>
  );
}
