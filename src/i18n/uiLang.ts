/** The interface language, for dates and times on screen (no React here — scripts import modules that use it). */
let currentUi = 'ru';

export const setUiLang = (ui: string) => {
  currentUi = ui;
};

/** The language for dates and times: the interface's (Hebrew — he), not the content's. */
export const uiLang = (locale: string): string => (currentUi === 'he' ? 'he' : locale);
