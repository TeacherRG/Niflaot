/**
 * Keeps `og:title` equal to the page title as the app changes it (`document.title = …` on every page):
 * a browser's reading mode and «share» take the title from these tags, and the static one names the whole site.
 */
export function installTitleSync() {
  const title = document.querySelector('title');
  const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (!title || !og) return;
  const sync = () => {
    og.content = document.title;
  };
  sync();
  const mo = new MutationObserver(sync);
  mo.observe(title, { childList: true, characterData: true, subtree: true });
  return () => mo.disconnect();
}
