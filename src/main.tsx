import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './i18n';
import { App } from './App';
import { applyDraft } from './admin/github';
// fonts are served by the site itself (no render-blocking request to Google Fonts);
// each face loads only the alphabets a page uses (unicode-range)
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/frank-ruhl-libre/400.css';
import '@fontsource/frank-ruhl-libre/500.css';
import '@fontsource/frank-ruhl-libre/700.css';
import '@fontsource/frank-ruhl-libre/900.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import { installAnalytics } from './core/analytics';
import { installPrompt } from './core/install';
import { startAccountSync } from './core/account';
import { initTelegram } from './core/telegram';
import { installServiceWorker } from './core/appUpdate';
import './styles.css';

// opened as a Telegram Mini App: Telegram's address → ours, before anything reads it (src/core/telegram.ts)
initTelegram();
// the admin's unpublished text edits are shown on the site in their browser
applyDraft();
// visit statistics (GoatCounter, no cookies)
installAnalytics();
// «Установить на телефон» in the menu, when the browser can install the site
installPrompt();
// the optional account: progress on every device (src/core/account.ts)
startAccountSync();
// offline use and the daily reminder (public/sw.js); not in development, where the files change all the time
// the installed app looks for a new version when it comes back to the screen (src/core/appUpdate.ts)
if (import.meta.env.PROD) installServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
