import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { ASSISTANT_URL } from '../core/assistant';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { Icon, useUI } from './ui';

const AUTHOR_MAIL = 'Office@mychitas.app';

/** `#/teacher` — «Учитель»: the AI teacher (the assistant chat, symbolic price) or a human one (write to the site's author). */
export function TeacherPage() {
  const { t } = useI18n();
  const { open } = useUI();

  useEffect(() => {
    document.title = `${t('teacher.title')} · ${t('app.title')}`;
  }, [t]);

  return (
    <>
      <TopBar title={t('teacher.title')} />
      <div className="wrap">
        <header className="partners-head">
          <h1>{t('teacher.title')}</h1>
          <p>{t('teacher.intro')}</p>
        </header>
        <main className="teacher-opts">
          <section className="teacher-opt">
            <h2>
              <Icon name="spark" size={22} />
              {t('teacher.ai.title')}
            </h2>
            <p>{t('teacher.ai.body')}</p>
            <span className="teacher-price">{t('teacher.ai.price')}</span>
            {!ASSISTANT_URL && <p className="teacher-note">{t('teacher.ai.soon')}</p>}
            <button className="btn" onClick={() => open('assistant')}>
              {t('teacher.ai.go')}
            </button>
            <p className="teacher-note">{t('teacher.ai.note')}</p>
          </section>
          <section className="teacher-opt">
            <h2>
              <Icon name="user" size={22} />
              {t('teacher.human.title')}
            </h2>
            <p>{t('teacher.human.body')}</p>
            <a className="btn" href={`mailto:${AUTHOR_MAIL}?subject=${encodeURIComponent(t('teacher.human.subject'))}`}>
              <Icon name="mail" size={18} /> {t('teacher.human.go')}
            </a>
            <p className="teacher-note">{AUTHOR_MAIL}</p>
          </section>
        </main>
      </div>
      <Colophon />
    </>
  );
}
