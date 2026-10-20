/* GitHub Pages serves this page for any address without a file. The app routes by hash, so a typed address like
   /admin or /en/academy/ goes to /#/admin (/?lang=en#/academy); the app shows «Такой страницы нет» if it doesn't know it. */
(function () {
  var parts = location.pathname.split('/').filter(Boolean);
  if (parts.length && /\.[a-z0-9]+$/i.test(parts[parts.length - 1])) return; // a missing file — no app route
  var q = location.search.replace(/^\?/, '');
  if (parts[0] === 'en' || parts[0] === 'de') q = 'lang=' + parts.shift() + (q ? '&' + q : '');
  location.replace('/' + (q ? '?' + q : '') + '#/' + parts.join('/'));
})();
