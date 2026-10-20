import { useI18n } from '../i18n';
import { startRepair, useHabit } from '../core/habit';
import { useMode } from '../core/mode';

/**
 * «Учёба каждый день» (src/core/habit.ts): ✓ дня и серия по всем разделам; пока сегодня не учились — «минимум на сегодня»
 * (взрослым — отрывок дня, детям — «Гематрия дня») и короткий вариант на 2 минуты; после перерыва — «С возвращением»
 * без упрёков; один пропуск раз в 30 дней — «Восполнить» (ташлумин): следующее дело засчитается за пропущенный день
 * (взрослым — отрывок того дня, детям — «Слова Торы»). Блоки — `div`, не `p`: на телефоне в шапке главной абзацы скрыты (`.h-hero p`). `account` — строка итогов в «Моём пути» (серия, лучшая серия, всего дней).
 */
export function HabitCard({ account = false }: { account?: boolean }) {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const h = useHabit();
  if (account)
    return h.total > 0 && (
      <p className="habit-line">
        🔥 {t('habit.streak', { n: h.streak })} · {t('habit.best', { n: h.best })} · {t('habit.total', { n: h.total })}
      </p>
    );
  return (
    <section className={`habit${h.today ? ' habit-done' : ''}`} aria-label={t('habit.title')}>
      <div className="habit-head">
        {/* a newcomer (no study day yet) is invited to start, not told «вы ещё не учились» */}
        <b>{h.today ? `✓ ${t('habit.today')}` : t(h.back ? 'habit.back' : h.total ? 'habit.notYet' : 'habit.first')}</b>
        {h.streak > 0 && <span className="habit-streak">🔥 {t('habit.streak', { n: h.streak })}</span>}
      </div>
      {!h.today && (
        <div className="habit-min">
          {t('habit.min')}{' '}
          {adults ? (
            <>
              <a href="#/neviim">{t('habit.minAdults')} →</a> <span className="habit-short">{t('habit.short')} <a href="#/daily">{t('habit.shortDaily')}</a></span>
            </>
          ) : (
            <a href="#/daily">{t('habit.minKids')} →</a>
          )}
        </div>
      )}
      {h.repair && <Repair day={h.repair.day} streak={h.repair.streak} pending={h.pending === h.repair.day} adults={adults} locale={locale} />}
      <div className="habit-note">{t('habit.rest')}</div>
    </section>
  );
}

/** «Восполнить пропуск»: кнопка ведёт к делу на пропущенный день; нажата — подсказка, что следующее дело его восполнит. */
function Repair({ day, streak, pending, adults, locale }: { day: string; streak: number; pending: boolean; adults: boolean; locale: string }) {
  const { t } = useI18n();
  const date = new Date(`${day}T12:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const href = adults ? `#/neviim/${day}` : '#/torah-words';
  if (pending)
    return (
      <div className="habit-repair">
        {t('habit.repairPending', { date })} <a href={href}>{t(adults ? 'habit.repairAdults' : 'habit.repairKids')} →</a>
      </div>
    );
  return (
    <div className="habit-repair">
      {t('habit.repair', { date })}{' '}
      <a
        className="btn ghost"
        href={href}
        onClick={() => startRepair(day)}
      >
        {t('habit.repairBtn')} · 🔥 {t('habit.streak', { n: streak })}
      </a>
    </div>
  );
}
