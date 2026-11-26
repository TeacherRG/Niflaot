/**
 * Private admin entry point for the existing privacy-friendly GoatCounter installation.
 * The actual dashboard remains protected by GoatCounter's own authentication; no API secret
 * is placed in the public client bundle.
 */
export function AnalyticsPage() {
  const dashboard = 'https://niflaot.goatcounter.com';
  return (
    <main className="admin">
      <header className="admin-head">
        <h1>Статистика посещаемости</h1>
        <a href="#/admin">← В административный центр</a>
      </header>

      <section className="admin-publish">
        <h2>Закрытая аналитика Нифлаот</h2>
        <p>Статистика уже собирается через GoatCounter. Откройте защищённую панель сервиса — для просмотра потребуется отдельный вход владельца GoatCounter.</p>
        <p><a className="btn" href={dashboard} target="_blank" rel="noopener noreferrer">Открыть статистику GoatCounter ↗</a></p>
        <p className="admin-status">Панель не публикуется на сайте для посетителей. Ссылка доступна только после входа в административный раздел Нифлаот.</p>
      </section>

      <section className="admin-fields">
        <div className="admin-field">
          <h3>Что уже учитывается</h3>
          <ul>
            <li>Просмотры страниц и разделов сайта.</li>
            <li>Источники переходов и страны в агрегированном виде.</li>
            <li>События обучения: начало и завершение урока, учебные дни, возвращение к занятиям, серия из 7 дней и переход из напоминания.</li>
            <li>Активное использование сайта и активное время внутри начатых уроков — минутные события.</li>
            <li>Событие «Новое устройство» — ориентировочная оценка новых браузеров, а не точное число людей.</li>
          </ul>
        </div>
        <div className="admin-field">
          <h3>Защита конфиденциальности</h3>
          <ul>
            <li>Посещения администратора и страницы /admin исключены из счётчика.</li>
            <li>GoatCounter работает без cookies и не создаёт рекламные профили посетителей.</li>
            <li>В статистику не передаются имена, адреса электронной почты или учебный прогресс конкретного человека.</li>
          </ul>
        </div>
        <div className="admin-field">
          <h3>Что пока нельзя утверждать</h3>
          <ul>
            <li>«Посетители» GoatCounter — оценка сессий, а не уникальных людей.</li>
            <li>Активное время — оценка по действиям пользователя: минута учитывается, если вкладка видима и было взаимодействие за последние 90 секунд. Это не доказательство непрерывного чтения.</li>
            <li>Учебный день фиксируется при первом учебном действии за день на устройстве; начало и завершение урока — отдельные события.</li>
          </ul>
          <p>Поэтому не следует представлять просмотры как число учеников или время на сайте как подтверждённое время изучения.</p>
        </div>
      </section>
    </main>
  );
}
