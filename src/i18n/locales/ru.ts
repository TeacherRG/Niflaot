/**
 * UI strings. Values may contain {placeholders}; plural forms are objects keyed
 * by Intl.PluralRules categories (one / few / many / other).
 * Keys marked HTML may contain inline markup.
 */
const ru = {
  'app.title': 'Нифлаот',
  'app.brandSub': 'MyChitas',
  'app.language': 'Язык',

  'catalog.heading': 'Уроки',
  'catalog.intro':
    'Игры-гиматрии по статьям рава Ицхака Гинзбурга из брошюры «Нифлаот». Считайте числовые значения слов, находите скрытые равенства и открывайте их смысл.',
  'catalog.lesson': 'Урок {n}',
  'catalog.riddles': { one: '{n} загадка', few: '{n} загадки', many: '{n} загадок', other: '{n} загадки' },
  'catalog.progress': 'решено {done} из {total}',
  'catalog.soon': 'Новые уроки скоро',
  'catalog.back': '← Все уроки',
  'catalog.fallback': 'Этот урок пока не переведён на выбранный язык — показан русский текст.',

  'top.timer': 'Время игры',
  'top.points': { one: '{n} очко', few: '{n} очка', many: '{n} очков', other: '{n} очка' },
  'top.riddle': 'Загадка {n}',
  'top.summary': 'Итог',

  /** HTML */
  'rules.first': 'верно с первой попытки — <b>10</b>',
  'rules.next': 'со второй — <b>5</b>, с третьей — <b>2</b>',
  'rules.hint': 'после подсказки — <b>3</b>',
  'rules.limit': 'лимит ошибок: 3 в числах, 2 в выборе — затем ответ открывается за <b>0</b>',
  'rules.lesson': 'урок открывается после решения',

  'riddle.of': 'Загадка {n} из {total}',
  'riddle.locked': '📜 Урок к этой загадке откроется после решения',
  'riddle.sumYourself': 'сложите сами',
  'riddle.answer': 'Ответ',
  'riddle.check': 'Проверить',
  'riddle.hint': 'Подсказка',
  'riddle.hintPrefix': 'Подсказка:',
  'riddle.correct': 'Верно! +{p}',
  'riddle.outOfTries': 'Попытки закончились. Ответ:',
  'riddle.zeroPoints': '0 очков',
  'riddle.triesLeft': 'Осталось попыток: {n}.',
  'riddle.wrongNum': 'Не сходится. Проверьте значения букв и попробуйте ещё раз.',
  'riddle.wrongChoice': 'Не то. Посмотрите на число этого варианта и выберите другой.',
  'riddle.prev': '← Назад',
  'riddle.next': 'Следующая загадка →',
  'riddle.toSummary': 'К итогу →',

  'lessons.title': 'Урок открыт',
  'lessons.sub': '· изложение своими словами',
  'refl.title': 'Вопрос к себе',
  'refl.sub': '· правильного ответа нет',
  'refl.placeholder': 'Запишите мысль. Она останется только на этом устройстве.',

  'final.inProgress': ' · игра продолжается',
  'final.partial': 'Разгадано загадок: {done} из {total}. Вернитесь к остальным через номера вверху.',
  'final.share': 'Поделиться результатом',
  'final.copy': 'Скопировать текст',
  'final.copied': 'Скопировано ✓',
  'final.selected': 'Текст выделен, нажмите «Копировать»',
  'final.legend': '🟩 с первой попытки · 🟨 со второй или с подсказкой · 🟥 ответ открыт · ⬜ не решено',
  'final.restart': 'Начать заново',
  'final.confirm': 'Стереть очки, время и заметки?',
  'final.no': 'Нет',
  'final.yes': 'Да, начать заново',

  'calc.title': 'Калькулятор гиматрии',
  'calc.sub':
    'Введите слово на иврите или наберите его на клавиатуре. Если число совпадёт со словом из игры, вы это увидите.',
  'calc.input': 'Слово на иврите',
  'calc.equals': 'Равно:',
  'calc.noMatch': 'Совпадений среди слов игры нет',
  'calc.space': 'пробел',
  'calc.backspace': 'стереть',

  /** HTML */
  'footer.rights': 'Все тексты целиком принадлежат <b>раву Ицхаку Гинзбургу</b>.',
  'footer.idea': 'Идея и проект',
  'footer.ideaVal': 'Тора-проект',
  'footer.contact': 'Вопросы и пожелания',
  'footer.copyMail': 'Скопировать адрес',
  'footer.copied': 'Скопировано',
  'footer.donate': 'Поддержать проект',
  'footer.donateText': 'Ваш вклад помогает создавать новые игры и материалы по Торе.',
  'footer.fine': '© MyChitas · Тексты: рав Ицхак Гинзбург',
} satisfies Record<string, string | PluralForms>;

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
export type Messages = { [K in keyof typeof ru]: (typeof ru)[K] extends string ? string : PluralForms };
export type MessageKey = keyof Messages;

export default ru as Messages;
