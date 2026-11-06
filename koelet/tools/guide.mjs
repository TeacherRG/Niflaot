// Учебник ведущего для офлайн-проведения: npm run guide → docs/guide.ru.md
// Вводная часть — tools/guide-intro.ru.md (пишется вручную), сценарии миров собираются
// из content/ru и locales/ru.json, поэтому учебник не расходится с текстами игры.
// tests/check-data.mjs проверяет, что docs/guide.ru.md пересобран после правки текстов.
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = 'docs/guide.ru.md';
const FILES = ['prologue', 'city-of-success', 'puzzle', 'mirror', 'brothers', 'workshop', 'heleq-lab', 'one-piece'];
const read = p => JSON.parse(readFileSync(ROOT + p, 'utf8'));
const AG = {y: '8–11', t: '12–15', a: '16+'};

/* Как провести мини-игру без экрана и какие её тексты нужны ведущему (ключи locales/ru.json). */
const MINI = {
  book: ['«Старая книга»', 'Положите на стол «старую книгу» (любую книгу в обёртке или свиток) со словом «Коэлет» на обложке. Участник открывает её — и путешествие начинается.', ['book.lead', 'book.after']],
  treasure: ['«Собери сокровища»', 'Разложите на столе много мелких предметов (монеты, фишки, звёздочки). Участник 30 секунд собирает их одной рукой. Ведущий рисует на доске две шкалы: «Собрано» и «Чувство, что всего хватает». Первая растёт, вторая почти стоит на месте. Спросите: почему?', ['treasure.full', 'treasure.opts', 'treasure.resp']],
  maslow: ['«Опыты Шломо на пирамиде Маслоу»', 'Нарисуйте на доске пирамиду из четырёх ступеней и раздайте карточки с опытами царя Шломо. Группа раскладывает их по ступеням, потом ведущий читает, что сказал Шломо.', ['maslow.say', 'maslow.levels', 'maslow.cards', 'maslow.hint', 'maslow.verdict', 'maslow.verdictTop', 'maslow.after']],
  find: ['«Найди слово хелек»', 'Распечатайте сетку букв 8×8 и спрячьте в ней 8 раз слово חֵלֶק (хелек), а рядом несколько раз הֶבֶל (хевел, «суета»). Участники ищут и обводят «хелек».', ['find.hint', 'find.task', 'find.done', 'find.next']],
  puzzle: ['«Пазл с пустым местом»', 'Возьмите настоящий пазл (9 деталей для младших, 25 для 16+). Одну деталь из центра заранее спрячьте. Группа собирает пазл и обнаруживает пустое место. На обратной стороне деталей (или на доске) — части доли.', ['puzzle.pieces', 'puzzle.hint', 'puzzle.done']],
  species: ['«Четыре вида»', 'Принесите четыре вида (этрог, лулав, мирт, ивы) или их картинки. Участник берёт каждый вид по очереди, ведущий читает объяснение. В конце виды связывают в букет.', ['species.say', 'species.end']],
  sky: ['«Солнце и луна»', 'Погасите свет или задёрните шторы, включите фонарик-«луну». Ведущий читает текст, задаёт вопрос, после ответов гасит свет — и читает объяснение.', ['sky.text', 'sky.q', 'sky.after']],
  selfmirror: ['«Зеркало»', 'Поставьте зеркало (или пусть участники посмотрят друг на друга). Каждый называет одну вещь, которую видит в себе хорошего, не сравнивая с другими. Никого не заставляйте.', ['mirror.say', 'mirror.caption', 'mirror.after']],
  pasuk: ['«Твой стих»', 'Ведущий читает слова Хранителя. Каждый, кто хочет, называет своё еврейское имя; вместе ищите стих Танаха, который начинается на первую букву имени и кончается на последнюю (в игре — раздел «Твой стих в Танахе», там же список стихов из «Тора Эмет»). Имя на иврите можно уточнить у родителей; никто не обязан его называть.', ['mirror.verse', 'pasuk.cert']],
  hands: ['«Руки Яакова»', 'Двое участников играют Эфраима и Менаше, третий — Яакова. Остальные сначала угадывают, что произойдёт, потом «Яаков» скрещивает руки и кладёт правую на голову младшего.', ['hands.q', 'hands.after']],
  circles: ['«Четыре круга»', 'Нарисуйте на доске четыре пересекающихся круга (названия и списки — в конце мира). Каждый выбирает до трёх ответов в каждый круг.', ['circles.say', 'circles.hint']],
  timeline: ['«Лента истории»', 'Распечатайте карточки событий, перемешайте и попросите разложить их от самого древнего к нашему времени. Последней кладётся пустая карточка «Ты».', ['timeline.say', 'timeline.hint', 'timeline.events', 'timeline.done']],
  final: ['«Большой пазл»', 'Разложите большой пазл из 12 деталей с героями игры. Место «Твоя деталь» оставьте пустым: участник кладёт туда свою деталь (в группе — каждый по очереди, со своим именем).', ['final.say']]
};

export function build() {
  const L = read('locales/ru.json'), SH = read('content/ru/shared.json');
  // {мальчик|девочка} → обе формы целым словом; {{name}} → [имя]
  const g = s => {
    let prev;
    do { prev = s; s = s.replace(/([^\s{}«»"(]*)\{([^{}|]*)\|([^{}|]*)\}([^\s{}»".,!?:;)]*)/, (_, p, m, f, q) => `${p}${m}${q}/${p}${f}${q}`); } while (s !== prev);
    return s.replace(/\{\{name\}\}/g, '[имя]').replace(/\{\{(\w+)\}\}/g, '[$1]');
  };
  const html = s => g(String(s)).replace(/<\/p>\s*<p>/g, '\n\n').replace(/<\/?p>/g, '').replace(/<br\s*\/?>/g, '\n\n')
    .replace(/<b(\s[^>]*)?>|<\/b>|<strong>|<\/strong>/g, '**').replace(/<[^>]+>/g, '').replace(/\|/g, '/').trim();
  const isAg = v => v && typeof v === 'object' && !Array.isArray(v) && v.__ag;
  const pick = (v, a) => isAg(v) ? (a === 'y' ? v.y : a === 'a' && 'a' in v ? v.a : v.t) : v;
  // значения по возрастам; одинаковые склеиваются: [['8–11', …], ['12–15, 16+', …]]
  const variants = v => {
    if (!isAg(v)) return [['', v]];
    const out = [];
    for (const a of ['y', 't', 'a']) {
      const x = pick(v, a), ex = out.find(o => JSON.stringify(o[1]) === JSON.stringify(x));
      if (ex) ex[0] += ', ' + AG[a]; else out.push([AG[a], x]);
    }
    return out.length === 1 ? [['', out[0][1]]] : out;
  };
  const txt = (v, quote) => variants(v).map(([a, x]) => {
    const t = html(x), body = quote ? t.split(/\n\n+/).map(p => '> ' + p).join('\n>\n') : t;
    return a ? `**${a}:**\n\n${body}` : body;
  }).join('\n\n');
  const inline = v => variants(v).map(([a, x]) => (a ? `**${a}:** ` : '') + html(x).replace(/\n+/g, ' ')).join(' ');
  const who = w => w === 'mentor' ? 'Хранитель' : w === 'hero' ? 'Герой' : (w && w.name) || 'Хранитель';
  const ageMark = s => s.age ? ` _(только ${s.age === 'y' ? '8–11' : s.age === 't' ? '12+: 12–15 и 16+' : '16+'})_` : '';
  const table = (head, rows) => `| ${head.join(' | ')} |\n| ${head.map(() => '---').join(' | ')} |\n` + rows.map(r => `| ${r.map(c => String(c).replace(/\|/g, '/').replace(/\n+/g, ' ')).join(' | ')} |`).join('\n');
  const mark = o => [o.s && html(o.s), o.help && 'помощь другому', o.insight && 'открытие о себе', o.tool && `инструмент: ${(SH.TOOLS[o.tool] || [])[1] || o.tool}`].filter(Boolean);

  function options(opts, withResult) {
    return variants(opts).map(([a, list]) => {
      const pre = a ? `**${a}:** ` : '';
      const plain = list.every(o => typeof o === 'string' || !o.r);
      if (!withResult || plain) return pre + 'Варианты: ' + list.map(o => html(typeof o === 'string' ? o : o.t)).join(' · ');
      if (new Set(list.map(o => o.r)).size === 1) return pre + list.map(o => html(o.t)).join(' · ') + `\n\nПосле любого ответа: ${html(list[0].r)}`;
      return (a ? `**${a}:**\n\n` : '') + table(['№', 'Вариант', 'Что происходит дальше (ведущий читает после выбора)'],
        list.map((o, i) => { const m = mark(o).filter(x => !o.s || x !== html(o.s)); return [i + 1, `**${html(o.t)}**${o.s ? ' — ' + html(o.s) : ''}${m.length ? ` _(${m.join('; ')})_` : ''}`, html(o.r || '')]; }));
    }).join('\n\n');
  }
  function localeBlock(keys) {
    return keys.map(k => {
      const v = L[k]; if (v == null) return '';
      if (Array.isArray(v)) return v.map(x => '- ' + (Array.isArray(x) ? x.filter(y => !/^[a-z]+$/.test(y)).map(html).join(' — ') : html(x))).join('\n');
      return '- ' + inline(v).replace(/^[.\s]+/, '');
    }).filter(Boolean).join('\n');
  }
  function mini(s) {
    return variants(s.game).map(([a, gm]) => {
      const [name, how, keys] = MINI[gm] || [gm, '', []];
      let extra = '';
      if (gm === 'species') extra = '\n\n' + table(['Вид', '8–11', '12–15, 16+'], SH.SPECIES.map(x => [`${x.name} (${x.he})`, html(x.y), html(x.t)]));
      return `${a ? `**${a}:** ` : ''}**${name}.** ${how}\n\nТексты из игры:\n\n${localeBlock(keys)}${extra}`;
    }).join('\n\n');
  }
  function step(s, n) {
    const h = `### Шаг ${n}`;
    if (s.__dynamic === 'city-year') return `${h} · Хранитель: «Прошёл год»\n\nВедущий читает «Год спустя» для выбора участника (таблица в конце мира).`;
    if (s.__dynamic === 'city-evening') return `${h} · Хранитель: вечер\n\nВедущий читает «Вечер» для выбора участника (таблица в конце мира) и спрашивает: «Что ты чувствуешь?»\n\n${options(L['evening.options'] || [], true)}`;
    if (s.body && s.body.__dynamic === 'strength-map') return `${h} · Карта сильных сторон\n\nВедущий вместе с участником собирает на листе всё, что тот выбрал в четырёх кругах и раньше в игре (качества из Мира 2, дело из этого мира). Удобно записать это на листе «Моя деталь пазла». Фразы, которыми игра собирает карту:\n\n${localeBlock(['sm.marked', 'sm.can', 'sm.like', 'sm.need', 'sm.help', 'sm.share', 'sm.combos', 'sm.default', 'sm.gift', 'sm.flow', 'sm.rabbi'])}`;
    switch (s.type) {
      case 'talk': return `${h} · ${who(s.who)}${ageMark(s)}\n\n${txt(s.text, true)}`;
      case 'card': return `${h} · Карточка «${html(pick(s.title, 't'))}»${ageMark(s)}\n\n${s.kicker ? `_${html(s.kicker)}_\n\n` : ''}${s.heb ? `Слово на иврите: **${s.heb}**\n\n` : ''}${txt(s.body, true)}`;
      case 'quote': return `${h} · Цитата${ageMark(s)}\n\n**${s.he}** (${html(s.src)})\n\nПеревод: ${html(s.tr)}\n\n${txt(s.plain)}` +
        (s.q ? `\n\nВопрос ведущего: **${inline(s.q)}**\n\n${options(s.options || [], false)}${s.r ? `\n\nПосле ответа: ${inline(s.r)}` : ''}` : '');
      case 'reveal': return `${h} · Открытие${ageMark(s)}\n\n**${html(s.text)}**${s.sub ? '\n\n' + txt(s.sub) : ''}`;
      case 'choice': return `${h} · Выбор${ageMark(s)} (говорит: ${who(s.who)})\n\n${txt(s.text, true)}${s.q ? `\n\nВопрос: **${inline(s.q)}**` : ''}\n\n${options(s.options, true)}` +
        (s.own ? '\n\nСвой вариант: участник может ответить своими словами.' : '') +
        (s.after ? `\n\nПосле выбора Хранитель добавляет: ${inline(s.after)}` : '') +
        (s.hint ? `\n\nПодсказка, если участник затрудняется: ${inline(s.hint)}` : '');
      case 'multi': return `${h} · Выбор качеств${ageMark(s)}\n\n${txt(s.text, true)}\n\n${variants(s.options).map(([a, l]) => (a ? `**${a}:** ` : '') + l.map(html).join(' · ')).join('\n\n')}` +
        (s.own ? '\n\nСвой вариант: участник может назвать своё качество.' : '') + (s.hint ? `\n\nПодсказка: ${inline(s.hint)}` : '');
      case 'mini': return `${h} · Мини-игра${ageMark(s)}\n\n${mini(s)}`;
    }
    return `${h} · ${s.type}`;
  }

  let md = readFileSync(ROOT + 'tools/guide-intro.ru.md', 'utf8').trim() + '\n\n# Сценарии и тексты\n\n' +
    'Ниже — все тексты игры по шагам, сгенерированные из её файлов. Реплики Хранителя набраны цитатой. Пометки «8–11», «12–15», «16+» показывают текст для каждой группы. [имя] — имя участника; «готов/готова» — форма по участнику. Пометки «помощь другому» и «открытие о себе» в игре влияют на итоговую фразу финала, вслух их не читают.\n';
  FILES.forEach((f, i) => {
    const d = read(`content/ru/${f}.json`), st = Array.isArray(d) ? d : d.steps;
    md += `\n## ${f === 'prologue' ? 'Пролог. Библиотека Хранителя' : `Мир ${i}. ${d.name}`}\n\n${d.desc ? `_${html(d.desc)}_\n\n` : ''}`;
    if (f === 'prologue') md += `### Шаг 0 · Хранитель встречает героя\n\n> ${html(L['welcome.text'])}\n\nГерой отвечает: «${html(L['welcome.me'])}»\n\n`;
    md += st.map((s, k) => step(s, k + 1)).join('\n\n') + '\n';
    if (f === 'city-of-success') md += '\n### Год спустя и вечер — тексты по выбору участника\n\n' +
      table(['Выбор', 'Год спустя', 'Вечер'], Object.entries(SH.CITY).map(([k, v]) => [(L['city.label'] || {})[k] || k, html(v.year), html(v.evening)])) + '\n';
    if (f === 'heleq-lab') md += '\n### Списки для четырёх кругов\n\n' + Object.values(SH.LAB).map(v => `**${html(v.title)}** ${v.opts.map(html).join(' · ')}`).join('\n\n') + '\n';
    if (f === 'one-piece') md += '\n### Герои большого пазла\n\n' + SH.BOARD.map(b => b[0]).join(' · ') + '\n';
  });
  return md.replace(/\n{3,}/g, '\n\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(ROOT + OUT, build());
  console.log(`✓ ${OUT}`);
}
