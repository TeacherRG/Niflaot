/* Защита от встраивания игры в чужую страницу (clickjacking). GitHub Pages не даёт задать заголовки
   X-Frame-Options / CSP frame-ancestors, а в <meta> frame-ancestors не работает, поэтому проверка здесь:
   внутри чужого <iframe> страница скрывается и пробует открыться в окне целиком.
   Свой сайт — можно: «Нифлаот» показывает игру курсом академии (#/koelet, KoeletPage.tsx) в <iframe> того же адреса;
   тогда у страницы класс html.embed (см. EMBED в game.js). */
(function () {
  var framed; try { framed = window.top !== window.self; } catch (e) { framed = true; }
  if (!framed) {
    /* /koelet/ на сайте «Нифлаот» (из поиска, по старой ссылке) — открываем курс внутри сайта: меню, Шабат, «Мои курсы».
       Свой язык игры (украинский) — запоминаем для игры. Локальный сервер игры (npm start, тесты) — не трогаем. */
    if (/^\/koelet\//.test(location.pathname) && !/[?&]solo\b/.test(location.search)) {
      var l = (location.search.match(/[?&]lang=(ru|uk|de|en)\b/) || [])[1];
      try { if (l) localStorage.setItem('koelet-lang', l); } catch (e) {}
      location.replace('/' + (l && l !== 'uk' ? '?lang=' + l : '') + '#/koelet');
    }
    return;
  }
  var own = false; try { own = window.parent.location.origin === window.location.origin; } catch (e) {}
  if (own) { document.documentElement.classList.add('embed'); return; }
  document.documentElement.style.display = 'none';
  try { window.top.location.replace(window.location.href); } catch (e) {}
  try { window.stop(); } catch (e) {}   // а саму игру в чужой рамке не загружаем
})();
