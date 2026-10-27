/* Load the interface strings and story content in the chosen language (see i18n.js).
   If that language fails to load, fall back to the default one. */
window.GAME_DATA_READY = loadLang(LANG).catch(err => {
  if (LANG === DEFAULT_LANG) throw err;
  return loadLang(DEFAULT_LANG);
});
