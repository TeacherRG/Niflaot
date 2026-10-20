/* The reader's look before the page is drawn (no white flash in the dark theme): theme, background and text size from
   localStorage `niflaot:look` → html[data-theme|data-bg|data-size]. The same rules — src/core/look.ts (the settings). */
(function () {
  try {
    var l = JSON.parse(localStorage.getItem('niflaot:look') || 'null') || {};
    var h = document.documentElement;
    var dark = l.theme === 'dark';
    if (dark) h.setAttribute('data-theme', 'dark');
    var bg = dark ? (l.bg === 'black' ? 'black' : '') : ['white', 'cream', 'sepia'].indexOf(l.bg) >= 0 ? l.bg : '';
    if (bg) h.setAttribute('data-bg', bg);
    if (l.size === 2 || l.size === 3) h.setAttribute('data-size', String(l.size));
  } catch (e) {}
})();
