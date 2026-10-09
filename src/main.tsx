import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n';
import { App } from './App';
import { applyDraft } from './admin/github';
import { installAnalytics } from './core/analytics';
import './styles.css';

// the admin's unpublished text edits are shown on the site in their browser
applyDraft();
// visit statistics (GoatCounter, no cookies)
installAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
