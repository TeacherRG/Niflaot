import { useI18n } from '../i18n';
import { useHabit } from '../core/habit';
import { useMode } from '../core/mode';

/**
 * «Учёба каждый день» (src/core/habit.ts): ✓ дня и серия по всем разделам; пока сегодня не учились — «минимум на сегодня»
 * (взрослым — отрывок дня, детям — «Гематрия дня») и короткий вариант на 2 минуты; после перерыва — «С возвращением»
 * без упрёков. Блоки — `div`, не `p`: на телефоне в шапке главной абзацы скрыты (`.h-hero p`). `account` — строка итогов в «Моём пути» (серия, лучшая серия, всего дней).
 */
export function HabitCard({ account = false }: { account?: boolean }) {
  const { t } = useI18n();
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
        <b>{h.today ? `✓ ${t('habit.today')}` : t(h.back ? 'habit.back' : 'habit.notYet')}</b>
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
      <div className="habit-note">{t('habit.rest')}</div>
    </section>
  );
}
