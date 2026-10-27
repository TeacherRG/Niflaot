/* Защита от встраивания игры в чужую страницу (clickjacking). GitHub Pages не даёт задать заголовки
   X-Frame-Options / CSP frame-ancestors, а в <meta> frame-ancestors не работает, поэтому проверка здесь:
   внутри чужого <iframe> страница скрывается и пробует открыться в окне целиком. */
(function () {
  var framed; try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (!framed) return;
  document.documentElement.style.display = 'none';
  try { window.top.location.replace(window.location.href); } catch (e) {}
})();
