/**
 * Words the English and German texts must not use — the house style of chabad.org (English)
 * and de.chabad.org (German), described in docs/TRANSLATION-GUIDE.md. Checked by `npm run check`
 * on the project's own texts (lessons, Memo, cards, interface, glossary, partners, the project's translations
 * of sources); the Sefaria editions in sefaria.json are not ours and are not checked.
 *
 * `re` finds the wrong form, `use` says what to write instead.
 */
export interface StyleRule {
  re: RegExp;
  use: string;
}

export const STYLE_RULES: Record<'en' | 'de', StyleRule[]> = {
  en: [
    // Names of G-d and words of another religion
    { re: /\bGod(s|ly|liness)?\b/, use: 'G-d, G-dly, G-dliness' },
    { re: /\bLord\b/, use: 'L-rd (in a verse) or G-d, the Almighty' },
    { re: /\b(Jehovah|Yahweh|YHWH)\b/i, use: 'Hashem, “the Four-Letter Name”, ה׳' },
    { re: /\bOld Testament\b|\bBible\b|\bbiblical\b/i, use: 'Torah, Tanakh, Scripture' },
    { re: /\bMessiah|\bMashiach\b/, use: 'Moshiach' },
    { re: /\bSabbath\b|\bShabbos\b/, use: 'Shabbat' },
    // names and terms: Chabad's spelling
    { re: /\bEve\b/, use: 'Chavah' },
    { re: /\bChava\b/, use: 'Chavah' },
    { re: /\bAbraham/, use: 'Avraham' },
    { re: /\bIsaac\b/, use: 'Yitzchak' },
    { re: /\bJacob\b/, use: 'Yaakov' },
    { re: /\bMoses\b/, use: 'Moshe' },
    { re: /\bAaron\b/, use: 'Aharon' },
    { re: /\bRebecca\b|\bRivka\b/, use: 'Rivkah' },
    { re: /\bCain\b/, use: 'Kayin' },
    { re: /\bAbel\b/, use: 'Hevel' },
    { re: /\bBereshit\b|\bBereishis\b/, use: 'Bereishit' },
    { re: /\bSichos\b(?! in English)/, use: 'Sichot (Likkutei Sichot)' },
    { re: /\bTikun\b|\btikun\b/, use: 'tikkun' },
    { re: /\bBa'al\b|\bBa’al\b/, use: 'Baal (Baal HaTurim, Baal Shem Tov)' },
    { re: /\bmitzva\b|\bmitzvos\b|\bmitsva/i, use: 'mitzvah, mitzvot' },
    { re: /\bKabbala\b|\bCabala|\bQabbal/i, use: 'Kabbalah' },
    { re: /\bHasid|\bhasid/, use: 'Chassid, Chassidut, Chassidic' },
    // American spelling, as on chabad.org
    { re: /\b(colour|centre|honour|favour|behaviour|neighbour|labour)/i, use: 'color, center, honor, favor, behavior, neighbor, labor' },
  ],
  de: [
    // Namen G-ttes und Wörter einer anderen Religion
    { re: /\bGott|\bgött|\bGött/, use: 'G-tt, G-ttes, g-ttlich, G-ttlichkeit' },
    { re: /\b(Jahwe|Jehova|JHWH)\b/i, use: 'Haschem, „der Name aus vier Buchstaben“, ה׳' },
    { re: /\bAltes Testament|\bBibel/i, use: 'Tora, Tanach, die Schrift' },
    { re: /\bMessias|\bMaschiach\b/, use: 'Moschiach' },
    { re: /\bSabbat|\bSchabbes\b/, use: 'Schabbat' },
    { re: /\bThora\b/, use: 'Tora' },
    { re: /\bRabbiner/, use: 'Rabbi' },
    // Namen und Begriffe: Schreibweise von de.chabad.org
    { re: /\bEva\b/, use: 'Chawa' },
    { re: /\bAbraham/, use: 'Awraham' },
    { re: /\bIsaak\b/, use: 'Jizchak' },
    { re: /\bJakob\b/, use: 'Jaakow' },
    { re: /\bMoses\b/, use: 'Mosche' },
    { re: /\bAaron\b/, use: 'Aharon' },
    { re: /\bRebekka\b/, use: 'Riwka' },
    { re: /\bKain\b/, use: 'Kajin' },
    { re: /\bAbel\b/, use: 'Hewel' },
    { re: /\bHiob\b|\bIjob\b/, use: 'Ijow' },
    { re: /\bHenoch\b(?![^()]*\))/, use: 'Chanoch (die deutsche Form nur in Klammern: „Chanoch (Henoch)“)' },
    { re: /\bPsalm(?![^()]*\))/, use: 'Tehillim (die deutsche Form nur in Klammern)' },
    { re: /\bHoheslied(?![^()]*\))/, use: 'Schir HaSchirim (die deutsche Form nur in Klammern)' },
    { re: /\bBereshit\b|\bBereischit\b/, use: 'Bereschit' },
    { re: /\bLikkutei\b|\bSichos\b(?! in English)/, use: 'Likkutej Sichot' },
    { re: /\bMitzw|\bMitzv|\bMizv/, use: 'Mizwa, Mizwot' },
    { re: /\bKabbalah\b|\bCabala/, use: 'Kabbala' },
    { re: /\bTikun\b/, use: 'Tikkun' },
    { re: /\bTzaddik|\bZadik\b/, use: 'Zaddik' },
    // die Kinder sprechen wir mit „du“ an
    { re: /\b(Kommen|Lesen|Spielen|Prüfen|Tippen|Wählen) Sie\b|\bIhre Stadt\b|\bIhnen\b/, use: 'die du-Form („Komm…“, „deine Stadt“)' },
  ],
};

/** the first rule a text breaks, with the wrong form found; HTML tags and Hebrew are not checked */
export function styleErrors(lang: 'en' | 'de', text: string): string[] {
  const plain = text.replace(/<[^>]*>/g, ' ');
  return STYLE_RULES[lang].flatMap((r) => {
    const m = plain.match(r.re);
    return m ? [`«${m[0]}» → ${r.use}`] : [];
  });
}
