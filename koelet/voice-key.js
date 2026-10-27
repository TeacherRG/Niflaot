/* ================================================================
   Ключи готовой озвучки (общие для игры и для tools/tts.mjs)
   Текст режется на предложения; каждое предложение — отдельный mp3
   audio/<язык>/<ключ>.mp3. Ключ — хэш предложения без тегов, знаков
   препинания и регистра, поэтому текст из JSON и текст с экрана дают
   один и тот же ключ.
   ================================================================ */
const VoiceKey = (() => {
  const ENT = {amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', '#123': '{', '#125': '}', '#39': "'"};
  /* HTML → обычный текст: теги → пробел, сущности → символы, иврит убран (Хранитель
     не читает его голосом другого языка), пробелы схлопнуты. */
  const plain = s => String(s == null ? '' : s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\u0591-\u05F4\uFB1D-\uFB4F]+/g, ' ').replace(/\(\s*\)/g, ' ')
    .replace(/&(amp|lt|gt|quot|nbsp|#123|#125|#39);/g, (_, e) => ENT[e])
    .replace(/\s+/g, ' ').trim();
  /* Предложения: граница — абзац (<p>, <br>) и .!?… (с закрывающими кавычками), за
     которыми пробел и не строчная буква, или конец текста. «т. е.» не режется. */
  const sentences = s => String(s == null ? '' : s).split(/<\/?(?:p|br|li|div|h\d)\b[^>]*>/i).flatMap(split);
  const split = s => {
    const text = plain(s), out = [];
    const re = /[.!?…]+[»"“”)\]]*(?=\s+[^\p{Ll}]|\s*$)/gu;
    let from = 0, m;
    while ((m = re.exec(text))) { out.push(text.slice(from, m.index + m[0].length).trim()); from = m.index + m[0].length; }
    out.push(text.slice(from).trim());
    return out.filter(x => /[\p{L}\p{N}]/u.test(x));
  };
  const norm = s => plain(s).toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  /* cyrb53 — короткий стабильный хэш строки. */
  const hash = str => {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  };
  const key = s => { const n = norm(s); return n ? hash(n) : ''; };
  return {plain, sentences, norm, key};
})();
if (typeof module !== 'undefined') module.exports = VoiceKey;
