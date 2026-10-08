import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n';
import { App } from './App';
import { applyDraft } from './admin/github';
import './styles.css';

// the admin's unpublished text edits are shown on the site in their browser
applyDraft();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
