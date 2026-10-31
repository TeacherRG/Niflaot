import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Chosen Forever',
  hero: {
    heading: 'Why does the haftarah end with “<i>May King David live forever</i>”?',
    author: 'based on a talk of the Lubavitcher Rebbe · Likkutei Sichot, vol. 25, Chayei Sarah',
    intro:
      'In the parshah Avraham “was old, advanced in days” and chooses his heir — Yitzchak. In the haftarah King David, too, has grown old and chooses his heir — Shlomo. But the haftarah breaks off at David’s oath and does not tell how Shlomo was anointed king. Why? Investigate together with the Rebbe — from the dispute between Rashi and the Rambam to a choice that never changes.',
  },
  summary:
    'The haftarah of Chayei Sarah tells of the old King David and his heir Shlomo, just as the parshah tells of the old Avraham and Yitzchak. Why, then, does it end with the oath “May my lord King David live forever” and say nothing of Shlomo’s anointing? The Rebbe explains: the kingship of the House of David is eternal — G-d chose it, and His choice is beyond any change, like the choice of Avraham and Yitzchak. And the choice of the Avot was completed in the kings of the House of David, who made Israel one people and built the Beit HaMikdash.',
  glossary: {},
  riddles: [
    {
      title: 'The Haftarah — a Mirror of the Parshah',
      cond: `<p>A haftarah must be “on the subject of the parshah” — and even resemble its ending. The haftarah of Chayei Sarah begins:</p><p class="verse" dir="rtl" lang="he">והמלך דוד זקן בא בימים</p><p>“King David was old, advanced in days.”<sup data-src="kings1-1-1"></sup> And in the parshah: “Avraham was old, advanced in days.”<sup data-src="gen-24-1"></sup></p><p>Not only the words are alike. Find what else the parshah and the haftarah share — and what seems to be missing from the haftarah.</p>`,
      steps: [
        {
          q: 'Who in the haftarah is “old, advanced in days,” like Avraham in the parshah?',
          hint: 'The first verse of the haftarah.',
          opts: ['“King David”', '“Shlomo”', '“Natan the prophet”', '“Adoniyahu”'],
        },
        {
          q: 'Which son of David exalted himself, saying: “I will be king”?',
          hint: 'The elder of the two brothers in the haftarah.',
          opts: ['“Adoniyahu”', '“Shlomo”', '“Avshalom”', '“Amnon”'],
        },
        {
          q: 'And who in the parshah argued with his brother: “I am greater than you”?',
          hint: 'Avraham’s elder son.',
          opts: ['“Yishmael”', '“Yitzchak”', '“Esav”', '“Eliezer”'],
        },
        {
          q: 'To whom did Avraham give “all that he had”?',
          hint: 'The sons of the concubines he sent away with gifts.',
          opts: ['“to Yitzchak”', '“to Yishmael”', '“to the sons of the concubines”', '“to Eliezer”'],
        },
        {
          q: 'What do David and Avraham have in common in choosing an heir?',
          hint: 'Shlomo is younger than Adoniyahu, Yitzchak is younger than Yishmael.',
          opts: ['“the younger son is chosen”', '“the elder son is chosen”', '“the strongest is chosen”', '“the choice is by lot”'],
        },
        {
          q: 'The parshah also tells what happened after Avraham’s death: “G-d blessed Yitzchak.” What would you expect in the haftarah too — but it is not there?',
          hint: 'How did Shlomo’s story actually end in this chapter of I Kings?',
          opts: ['“Shlomo’s anointing and ‘Shlomo sat on the throne’”', '“David’s death”', '“Adoniyahu’s reign”', '“the building of the Beit HaMikdash”'],
        },
      ],
      reveal: {
        h: 'Why does the haftarah stop?',
        p: 'The haftarah mirrors the parshah. David, like Avraham, is “old, advanced in days”; David has two sons, Adoniyahu and Shlomo, Avraham has Yishmael and Yitzchak. The elder makes a claim (“I will be king,” “I am greater than you”), but the younger is chosen: David swears that “Shlomo your son shall reign after me,” Avraham gives “all that he had” to Yitzchak. Yet the parshah goes further — after Avraham’s death G-d blesses Yitzchak. Why, then, does the haftarah not read on — how Shlomo was anointed and “sat on the royal throne”?',
      },
      lessons: [
        {
          h: 'A haftarah on the subject of the parshah',
          b: `<p>The law is that the haftarah of a parshah must be “on the subject of the parshah,” and even more — resemble the end of the parshah.</p><p>The simple connection between our parshah, Chayei Sarah, and its haftarah: the haftarah tells of the events and deeds of David when he was “old, advanced in days”<sup data-src="kings1-1-1"></sup> — just as most of the parshah deals with the time when “Avraham was old, advanced in days.”<sup data-src="gen-24-1"></sup></p><p>But the likeness is not only that the events happened when Avraham and David were “old, advanced in days” — it is also in the content itself.</p>`,
        },
        {
          h: 'Two sons of David — two sons of Avraham',
          b: `<p>The haftarah tells of David’s two sons, Adoniyahu and Shlomo: how Adoniyahu “exalted himself, saying, ‘I will be king’”<sup data-src="kings1-1-5"></sup> and how things led to David swearing to Bat-Sheva that his earlier oath — “Shlomo your son shall reign after me, and he shall sit on my throne in my place” — “so will I do this very day.”<sup data-src="kings1-1-30"></sup></p><p>And this resembles what happened in the parshah between Avraham’s two sons, Yitzchak and Yishmael. Yishmael claimed: “I am greater (more beloved) than Yitzchak,”<sup data-src="sanhedrin-89b"></sup> — and still Avraham made Yitzchak his heir. He also took care to find Yitzchak a wife, and “Avraham gave all that he had to Yitzchak”; while “to the sons of the concubines … Avraham gave gifts, and he sent them away from Yitzchak his son while he was still alive.”<sup data-src="gen-25-5"></sup> And of the sons of Yishmael, the end of the parshah says: “These are their names by their villages and their encampments — twelve princes of their nations,” — and the bond between them and Avraham was cut (as happened to Yishmael himself: “Drive out …”).</p>`,
        },
        {
          h: 'The younger one is chosen',
          b: `<p>One can put it a little differently: the likeness is that just as David chose his younger son instead of the elder — so that the younger would continue David’s kingship — so with Avraham his younger son, Yitzchak, was chosen to continue the House of Avraham.<sup data-src="gen-25-5"></sup></p><p>And this right was taken from the other children — even from the family of the elder son, Yishmael: they settled “in their villages and their encampments, twelve princes of their nations … and they dwelt from Chavilah to Shur” — with no bond to Avraham.</p>`,
        },
        {
          h: 'What is missing',
          b: `<p>But the matter is not yet fully “smooth.” The parshah also tells of the time after Avraham’s death: “And it was after Avraham’s death, and G-d blessed Yitzchak his son …”<sup data-src="gen-25-11"></sup> Why, then, do we not end the haftarah too by reading the following verses — how Shlomo was anointed and “Shlomo is already sitting on the royal throne”?<sup data-src="kings1-1-46"></sup></p>`,
        },
      ],
      reflection: 'Do I sometimes choose not what is louder and stronger, but what is right?',
      takeaways: [
        'A haftarah must be “on the subject of the parshah” and resemble its end.',
        'David, like Avraham, was “old, advanced in days.”',
        'Adoniyahu: “I will be king”; Yishmael: “I am greater than you.”',
        'The younger is chosen: Shlomo is David’s heir, Yitzchak is Avraham’s heir.',
        'The question: the parshah also tells what came after Avraham — why is the haftarah silent about Shlomo’s anointing?',
      ],
      puzzle: {
        q: 'Put together the investigation: from the rule of the haftarah to the Rebbe’s question.',
        pieces: ['Haftarah on the parshah’s subject', 'David, like Avraham, grew old', 'Two sons — the elder claims', 'The younger is chosen', 'Why no anointing of Shlomo?'],
        meaning: 'The haftarah repeats the parshah: an old father, two sons, the younger chosen. But its ending — how Shlomo sat on the throne — is not there.',
      },
    },
    {
      title: 'Anointed Because of a Dispute',
      cond: `<p>The Gemara teaches: “A king, son of a king, is not anointed. And if you ask: why then was Shlomo anointed? — Because of the dispute of Adoniyahu.”<sup data-src="horayot-11b"></sup> So the son of a king normally receives the kingship by inheritance. What does a dispute change?</p><p>Rashi and the Rambam explain this differently — and where the haftarah ends depends on it. By the custom of the Rambam its last verse is:</p><p class="verse" dir="rtl" lang="he">יחי אדני המלך דוד לעלם</p><p>“May my lord King David live forever!”<sup data-src="kings1-1-30"></sup></p>`,
      steps: [
        {
          q: 'What does the Gemara say about a king, son of a king?',
          hint: 'The kingship is an inheritance.',
          opts: ['“he is not anointed”', '“every king is anointed”', '“only the firstborn is anointed”', '“he is anointed only in Yerushalayim”'],
        },
        {
          q: 'Why, then, was Shlomo anointed?',
          hint: 'His brother said: “I will be king.”',
          opts: ['“because of Adoniyahu’s dispute”', '“because he was the younger”', '“because of David’s death”', '“because of a war with the Philistines”'],
        },
        {
          q: 'How does Rashi explain it: what happens to the kingship when there is a dispute?',
          hint: 'Anointing “from the start.”',
          opts: ['“it is no longer an inheritance — he must be anointed anew”', '“the inheritance stays; anointing only ends the dispute”', '“no anointing is needed”', '“the king chooses whomever he wants”'],
        },
        {
          q: 'And according to the Rambam, why is a king’s son anointed when there was a dispute?',
          hint: 'The inheritance is not cancelled.',
          opts: ['“to end the dispute”', '“to create a new kingship”', '“so that he inherits his father”', '“to make the people happy”'],
        },
        {
          q: 'With which verse does the haftarah end, by the custom of the Rambam?',
          hint: 'Bat-Sheva’s words after David’s oath.',
          opts: ['“‘May my lord King David live forever!’”', '“‘And Shlomo is already sitting on the royal throne’”', '“‘And Shlomo sat on the throne of David his father’”', '“‘King David was old’”'],
        },
        {
          q: 'Other customs read further — also about Shlomo’s anointing. Following whose view?',
          hint: 'The one for whom, in a dispute, the kingship is no longer an inheritance.',
          opts: ['“Rashi’s view”', '“the Rambam’s view”', '“the custom of Yerushalayim”', '“no view — just so”'],
        },
      ],
      reveal: {
        h: 'The oath already decided',
        p: 'According to Rashi, when there is a dispute the kingship stops being an inheritance, and the anointing is like appointing a new king; so Shlomo became king only through his anointing — and that is why many communities read about it in the haftarah. According to the Rambam the inheritance is not cancelled, not even changed: the anointing only “ends the dispute.” Shlomo’s kingship was decided by David’s oath: “so will I do this very day” — so by the custom of the Rambam the haftarah ends with “May my lord King David live forever!” and does not mention the anointing. But the question remains: the parshah does tell of Yitzchak’s standing after Avraham’s death — the “Master of blessings” Himself came and blessed him.',
      },
      lessons: [
        {
          h: 'The Gemara: a king, son of a king, is not anointed',
          b: `<p>At first glance one could say: the fact that the haftarah does not include the continuation — the verses about Shlomo’s anointing — follows the Rambam’s view of what the anointing of a “king, son of a king” is, including the anointing of Shlomo.</p><p>The Gemara says: “A king, son of a king, is not anointed. And if you ask: why then was Shlomo anointed? — Because of the dispute of Adoniyahu.” And the Gemara asks further: “From where do we know that when there is a dispute, anointing is needed, and it is not that any king, whenever he wishes, passes the kingship to his son? Rav Pappa said: the verse says, ‘he and his sons in the midst of Israel’ — when there is peace in Israel.”<sup data-src="horayot-11b"></sup></p><p>Rashi explains: “When there is peace in Israel, the kingship is an inheritance and no anointing is needed; but when there is a dispute, it is not an inheritance, and an anointing from the start is needed.”</p>`,
        },
        {
          h: 'Rashi and the Rambam',
          b: `<p>But the Rambam rules: “A king, son of a king, is not anointed, for the kingship is an inheritance for the king forever … And if there was a dispute, he is anointed in order to end the dispute and to let everyone know that he alone is king, as Shlomo was anointed because of the dispute of Adoniyahu …”<sup data-src="rambam-vessels-1-11"></sup></p><p>The later authorities explain the dispute between Rashi and the Rambam. According to Rashi, when there is a dispute the kingship stops being an inheritance, and so the anointing is like setting up a new king. According to the Rambam, the inheritance of the kingship is not cancelled and not even changed, and the anointing is only “to end the dispute” — to remove an obstacle.</p>`,
        },
        {
          h: 'Why the haftarah ends with the oath',
          b: `<p>From this one can explain — and it makes clearer — the Rambam’s custom of ending the haftarah with the verse “May my lord King David live forever!” without mentioning Shlomo’s anointing at all.<sup data-src="kings1-1-30"></sup> For in his view the anointing of a king, son of a king, is not to create the kingship but only “to end the dispute.” So the story of Shlomo’s anointing is not added to the haftarah: David’s oath — “as I swore to you by the L-rd, the G-d of Israel, saying, ‘Shlomo your son shall reign after me, and he shall sit on my throne in my place,’ so will I do this very day” — had already decided, once and for all, who would be king.</p>`,
        },
        {
          h: 'The other customs — following Rashi',
          b: `<p>And the other customs, by which the haftarah reads on — about David’s command to anoint Shlomo, up to the anointing itself — and all the more the view of the Abudraham that one reads until after David’s death: “And Shlomo sat on the throne of David his father, and his kingship was firmly established,”<sup data-src="kings1-2-12"></sup> — they follow Rashi’s view. According to Rashi, when there is a dispute, the kingship is not an inheritance and a new anointing is needed: the anointing appoints a new king. So Shlomo too became king only through his anointing.</p>`,
        },
        {
          h: 'The question remains',
          b: `<p>But this is not yet fully “smooth” either. For the parshah tells not only how Avraham sent away the sons of the concubines and chose Yitzchak, but also of Yitzchak’s standing and greatness after Avraham’s death: “And it was after Avraham’s death, and G-d blessed Yitzchak …” — anew.<sup data-src="gen-25-11"></sup> In Rashi’s words: “the Master of blessings” — the Holy One, blessed be He, Himself — “came and blessed him.”<sup data-src="rashi-25-11"></sup></p><p>If so, it would have been fitting to read in the haftarah too how Shlomo’s appointment was completed (through the anointing) and how he actually became king — all the more since this happened while David was still alive.</p>`,
        },
      ],
      reflection: 'When I have promised something, do I keep my word as firmly as David kept his oath?',
      takeaways: [
        'The Gemara: a king, son of a king, is not anointed; Shlomo was anointed because of Adoniyahu’s dispute.',
        'Rashi: in a dispute the kingship is no longer an inheritance; the anointing sets up a new king.',
        'The Rambam: the inheritance stays; the anointing only ends the dispute.',
        'So by the Rambam’s custom the haftarah ends with the oath: “May my lord King David live forever!”',
        'But the question remains: the parshah speaks of Yitzchak after Avraham too — G-d Himself blessed him.',
      ],
      puzzle: {
        q: 'Put together the explanation: from the Gemara to the end of the haftarah.',
        pieces: ['A king’s son is not anointed', 'Shlomo anointed due to a dispute', 'Rambam: only to end the dispute', 'David’s oath decided', 'The haftarah ends with the oath'],
        meaning: 'For the Rambam, Shlomo’s anointing created nothing — David’s oath decided the kingship; so the haftarah ends there.',
      },
    },
    {
      title: 'A Horn, Not a Flask',
      cond: `<p>Channah prophesied: “My horn is exalted in the L-rd.”<sup data-src="samuel1-2-1"></sup> The Gemara explains:</p><p class="verse" dir="rtl" lang="he">רמה קרני ולא רמה פכי</p><p>“‘My horn is exalted’ — and not ‘my flask is exalted’: David and Shlomo, who were anointed from a horn — their kingship continued; Shaul and Yehu, who were anointed from a flask — their kingship did not continue.”<sup data-src="megillah-14a-2"></sup></p><p>But according to the Rambam, as soon as David was anointed, the kingship became his and his sons’ forever.<sup data-src="rambam-kings-1-7"></sup> Why, then, name Shlomo separately, as if it were a new kingship?</p>`,
      steps: [
        {
          q: 'Whose kingship, says the Gemara, continued — those anointed from a horn?',
          hint: 'The father and son of our haftarah.',
          opts: ['“David and Shlomo”', '“Shaul and Yehu”', '“David and Shaul”', '“Shlomo and Yehu”'],
        },
        {
          q: 'Which reason for anointing in a dispute does the Rambam add in the “Laws of the Vessels of the Sanctuary” — and not in the “Laws of Kings”?',
          hint: 'Not only to end the dispute, but also …',
          opts: ['“to let everyone know that he alone is king”', '“to make the people happy”', '“to save the oil”', '“to teach him Torah”'],
        },
        {
          q: 'Who is anointed with the anointing oil that Moshe made?',
          hint: 'Of the kings — only one dynasty.',
          opts: ['“only the kings of the House of David”', '“all the kings of Israel”', '“kings and prophets”', '“only Shlomo”'],
        },
        {
          q: 'And with what are the kings from the other tribes anointed?',
          hint: 'So Elisha anointed Yehu.',
          opts: ['“with balsam oil”', '“with the anointing oil”', '“with wine”', '“with spring water”'],
        },
        {
          q: '“This shall be a holy anointing oil to Me …” — for how long?',
          hint: 'The same oil will last even for the time to come.',
          opts: ['“throughout your generations”', '“for one year”', '“only in the desert”', '“until entering the Land”'],
        },
        {
          q: 'What does “he alone is king” mean for the kings of the House of David?',
          hint: 'Not only “he, and not his brother.”',
          opts: ['“he is always king — even when there is a king from the other tribes”', '“he is king instead of the brother who disputed”', '“he has no sons”', '“he rules without advisers”'],
        },
      ],
      reveal: {
        h: 'Oil for all generations',
        p: 'The kings of the House of David are anointed with the oil Moshe made — “throughout your generations”: it lasts forever. So David’s anointing created the eternity of his kingship — “your throne shall be established forever.” A son without a dispute needs no anointing: his father’s anointing works in him too. But when there is a dispute, the eternity of the kingship is not visible in the son, and he is anointed for two reasons: to end the dispute — this applies also to kings from the other tribes (they are anointed with balsam oil), and “to let everyone know that he alone is king” — this belongs only to the kings of the House of David. The main kingship always belongs to David and his sons; so this reason is written in the laws of the anointing oil, not in the general “Laws of Kings.”',
      },
      lessons: [
        {
          h: 'A horn and a flask',
          b: `<p>This will be understood after first explaining more about what Shlomo’s anointing was.</p><p>The Gemara says about Channah’s prophecy “My horn is exalted in the L-rd”:<sup data-src="samuel1-2-1"></sup> “‘My horn is exalted’ — and not ‘my flask is exalted’: David and Shlomo, who were anointed from a horn — their kingship continued; Shaul and Yehu, who were anointed from a flask — their kingship did not continue.”<sup data-src="megillah-14a-2"></sup></p><p>At first glance this is hard to understand. The Rambam rules: “As soon as David was anointed, he acquired the crown of kingship, and the kingship is his and his male sons’ forever, as it says, ‘Your throne shall be established forever.’”<sup data-src="rambam-kings-1-7"></sup><sup data-src="samuel2-7-16"></sup> That is, Shlomo’s kingship was a continuation (“his kingship continued”) of David’s kingship. What, then, does “David and Shlomo, who were anointed from a horn — their kingship continued” mean, as if each of them were a separate kingship and Shlomo’s were the beginning of a new kingship (like Shaul and Yehu, each of whom was a king at the start, not a king, son of a king)? After all, Shlomo’s kingship took effect at once, “as soon as David was anointed” — then he “acquired the crown of kingship … forever” — and Shlomo’s anointing was only “to end the dispute and to let everyone know that he alone is king.”</p>`,
        },
        {
          h: 'Two laws — in two books',
          b: `<p>We also need to understand: the law “a king, son of a king, is not anointed” is brought by the Rambam both in the “Laws of the Vessels of the Sanctuary” and in the “Laws of Kings.” In the “Laws of the Vessels of the Sanctuary” he writes in the words quoted above: “to end the dispute and to let everyone know that he alone is king, as Shlomo was anointed because of the dispute of Adoniyahu, and Yoash because of Atalyah, and Yehoachaz because of Yehoyakim his brother.”<sup data-src="rambam-vessels-1-11"></sup> But in the “Laws of Kings” he says only “to end the dispute” — and does not add “and to let everyone know that he alone is king.”</p><p>At first glance: the Rambam usually relies on what he wrote earlier in his book, and the “Laws of the Vessels of the Sanctuary” come before the “Laws of Kings” — he need not repeat it. But here the question is different: a subject that deals directly with kings — a detailed explanation of the laws of kings and of their anointing — belongs mainly in the “Laws of Kings,” not among the laws of the anointing oil, where the laws of anointing a king are mentioned in passing. If so, the reason for the law — and especially the added reason, “to let everyone know that he alone is king” — should have its place only in the “Laws of Kings”?</p>`,
        },
        {
          h: 'Kings of the House of David and kings of the other tribes',
          b: `<p>The point of the explanation: the reason the Rambam gives, “to let everyone know that he alone is king,” belongs mainly to the kings of the House of David. So in the “Laws of the Vessels of the Sanctuary,” where the laws of anointing a king are a detail of the laws of the anointing oil — and of the kings, only “the kings of the House of David” are anointed with the anointing oil<sup data-src="rambam-vessels-1-7"></sup> — he writes that the anointing of a king, son of a king, is also “to let everyone know that he alone is king.”</p><p>But in the “Laws of Kings” — the laws of a king in general — next to the law “as soon as David was anointed, he acquired the crown of kingship,” another is brought: “A prophet who set up a king from the other tribes of Israel, and that king walks in the way of the Torah and the mitzvah and fights the wars of G-d — he is a king, and all the mitzvot of kingship apply to him … For Achiyah of Shiloh set up Yarovam and told him: ‘… I will build you a lasting house, as I built for David.’”<sup data-src="rambam-kings-1-8"></sup> (Only he adds that the kings of Israel are anointed not with the anointing oil but with balsam oil.) So there, bringing the law “a king, son of a king, is not anointed unless there was a dispute or a war,” he gives the reason “to end the dispute” — which applies to the kings of Israel too.</p>`,
        },
        {
          h: 'The main kingship belongs to David',
          b: `<p>The explanation of this: although according to the Rambam, even after David acquired the crown of kingship, “a prophet who set up a king from the other tribes of Israel — he is a king,” there is a fundamental difference between them. The Rambam continues: “The kings of the House of David are the ones who stand forever, as it says, ‘Your throne shall be established forever’; but if a king arises from the rest of Israel, the kingship will cease from his house.”<sup data-src="rambam-kings-1-9"></sup> And even when there is a king from the other tribes, “the main kingship belongs to David.”<sup data-src="rambam-kings-1-8"></sup></p><p>Moreover, the Rambam writes in his “Book of the Mitzvot”: “As for the kingship — you already know from the words of the books of the prophets that David acquired it. And they said explicitly: David acquired the crown of kingship. And so his descendants after him until the end of all generations: there is no king for one who believes in the Torah of Moshe our teacher except from the seed of David and from the seed of Shlomo; and anyone not of this honored seed is called, regarding kingship, ‘a stranger’ — just as anyone not of the seed of Aharon is called, regarding the service, ‘an outsider.’”</p><p>It follows that the difference between the kingship of the House of David and the kings of Israel is not only in time — that the kings of the House of David stand forever and the kings of Israel do not. It is a difference in the very essence of kingship: David acquired the crown of kingship. The essence of kingship is always only with David and his sons; it can happen that “by G-d’s command” a particular king is appointed from the other tribes, but that is not “the main kingship.” So much so that, in regard to David’s kingship, [another] “is called a stranger,” as the Mechilta says: “Once David was chosen, all [the rest of] Israel went out.”</p>`,
        },
        {
          h: 'The anointing oil — “throughout your generations”',
          b: `<p>One can say: this is why only the kings of the House of David were anointed with the anointing oil. This is understood from the plain words of the Rambam: “As soon as David was anointed, he acquired the crown of kingship, and the kingship is his and his male sons’ forever.”<sup data-src="rambam-kings-1-7"></sup> David’s anointing with the anointing oil was not just one more detail of his appointment as king: it brought about the permanence and eternity of David’s kingship, “forever.”</p><p>The reason: the anointing oil is the oil that Moshe made, so that “this shall be to Me throughout your generations,”<sup data-src="ex-30-31"></sup> and “all of it will remain for the time to come.”<sup data-src="horayot-11b"></sup> As the Rambam says in the “Laws of the Vessels of the Sanctuary”: “they put it away in a vessel for the generations,” and “no other oil was ever made besides what Moshe made.” So anointing with the anointing oil works “throughout your generations” too — it brings about the permanence and eternity of the kingship, in which “the kings of the House of David are the ones who stand forever.”</p>`,
        },
        {
          h: '“He alone is king”',
          b: `<p>This is what the Rambam says: “A king, son of a king, is not anointed, for the kingship is an inheritance for the king forever … And if there was a dispute, he is anointed in order to end the dispute and to let everyone know that he alone is king.”<sup data-src="rambam-vessels-1-11"></sup> When there is no dispute, a king’s son needs no anointing: the anointing with which his father was anointed works on the sons too, and they are like their father. But when “there was a dispute,” the permanence and eternity — what the anointing with the anointing oil brings about — are not visible and not known in the son. Then he must be anointed for two reasons: a) to end the dispute — this applies not only to the kings of the House of David, who are anointed with the anointing oil, but also to a king from the other tribes, who is anointed with balsam oil; b) “to let everyone know that he alone is king” — this is unique to the kings of the House of David.</p><p>This is the precision and the addition in the Rambam’s words: “to let everyone know that he alone is king.” Otherwise, why the word “alone”? The Rambam means not only that he is the king and not the other one who disputed with him, but that “he alone is king” always and in every situation — not only as in the days of David and Shlomo, but also when there is a king from the other tribes: it was specifically David and his seed who acquired the crown of kingship forever. That is why the Rambam says this in the “Laws of the Vessels of the Sanctuary”: it is a detail not of the laws of a king (a king may also not be “alone”), but of the laws of the anointing oil — to reveal also in a king, son of a king (over whom there was a dispute), the “he alone is king” found in the kings of the House of David: in him, too, is their eternity — they “stand forever.”</p>`,
        },
      ],
      reflection: 'What in me is “forever,” even when everything around me changes and argues?',
      takeaways: [
        'The Gemara: David and Shlomo were anointed from a horn — their kingship continued; Shaul and Yehu — from a flask.',
        'Only the kings of the House of David are anointed with Moshe’s anointing oil; kings of the other tribes — with balsam oil.',
        'The anointing oil is “throughout your generations”: it brought about the eternity of David’s kingship.',
        'In a dispute the king’s son is anointed: to end the dispute and “to let everyone know that he alone is king.”',
        '“He alone” — always: the main kingship is David’s, even when there is a king from the other tribes.',
      ],
      puzzle: {
        q: 'Put together the Rebbe’s explanation: from the horn to “he alone is king.”',
        pieces: ['Anointed from a horn — it continued', 'Moshe’s oil — only for David’s House', 'The oil — for your generations', 'David’s kings stand forever', 'He alone is king'],
        meaning: 'The anointing oil is eternal, and only the House of David is anointed with it; so anointing in a dispute reveals that a king of the House of David is the only one, forever.',
      },
    },
    {
      title: 'Chosen Forever',
      cond: `<p>Why, then, does the Gemara say “<b>David and Shlomo</b>” — together — although Shlomo was a king, son of a king? The Rambam writes in the Thirteen Principles of Faith: “there is no king for Israel except from the House of David and from the seed of Shlomo.”</p><p>Of both David and Shlomo it says: “He chose.”<sup data-src="ps-78-70"></sup> Of Shlomo:</p><p class="verse" dir="rtl" lang="he">ויבחר בשלמה בני לשבת על כסא מלכות ה׳ על ישראל</p><p>“… He chose Shlomo my son to sit on the throne of the kingship of the L-rd over Israel.”<sup data-src="chron1-28-4"></sup> And how is this connected to Avraham and Yitzchak — and to the end of the haftarah?</p>`,
      steps: [
        {
          q: 'The Rambam: there is no king for Israel except from the House of David and from the seed of …',
          hint: 'David’s son in our haftarah.',
          opts: ['“Shlomo”', '“Avshalom”', '“Natan”', '“Adoniyahu”'],
        },
        {
          q: 'Which prophecy about Shlomo did David receive?',
          hint: 'About the eternity of his kingship.',
          opts: ['“‘I will establish the throne of his kingship over Israel forever’”', '“‘he built the house and finished it’”', '“‘Shlomo loved foreign wives’”', '“‘Shlomo lay with his fathers’”'],
        },
        {
          q: 'Even if David’s sons forsake the Torah, what did G-d promise?',
          hint: 'Psalms 89.',
          opts: ['“‘My kindness I will not take away from him’”', '“‘I will tear away the kingdom’”', '“‘I will choose another king’”', '“‘I will forget My covenant’”'],
        },
        {
          q: 'Which promise continued the House of Avraham through Yitzchak?',
          hint: 'G-d told Avraham this when Sarah said to drive out Yishmael.',
          opts: ['“‘for through Yitzchak shall offspring be called yours’”', '“‘drive out this maidservant and her son’”', '“‘Avraham was old’”', '“‘take, please, your son’”'],
        },
        {
          q: 'When were the fathers of the people complete — “only three are called Avot”?',
          hint: '“Through Yitzchak” — and not all of Yitzchak.',
          opts: ['“with the birth of Yaakov”', '“with Avraham’s death”', '“with Yitzchak’s marriage”', '“with Yishmael’s birth”'],
        },
        {
          q: 'When is a people a complete people?',
          hint: 'The mitzvah to appoint a king “who will gather our whole nation.”',
          opts: ['“when it is one, united — through a king”', '“when it is numerous”', '“when it is rich”', '“when each one is on his own”'],
        },
      ],
      reveal: {
        h: 'A choice that never changes',
        p: 'The eternity of David’s kingship is said specifically about Shlomo: “I will establish the throne of his kingship over Israel forever,” and Shlomo was chosen, like David — so the Gemara names them together. David’s crown is bound up with G-d’s choice, and in His choice there is no true break or change: “May my lord King David live forever” — even if his sons do not behave as they should, “My kindness I will not take away from him.” So too the choice of Avraham: “You chose Avram” — forever, and it continued through “for through Yitzchak shall offspring be called yours.” But in our parshah the Avot are not yet complete — not until Yaakov is born; so the haftarah, too, stops at the oath. And the choice of the Avot was completed in the kings of the House of David: a king makes Israel one people, and David and Shlomo built the Beit HaMikdash — the Shechinah’s permanent dwelling in the people of Israel.',
      },
      lessons: [
        {
          h: 'Why “David and Shlomo”',
          b: `<p>From this one can explain why the Gemara explicitly says: “David and Shlomo, who were anointed from a horn — their kingship continued,”<sup data-src="megillah-14a-2"></sup> although Shlomo was a king, son of a king, and was anointed only “to end the dispute.”</p><p>Although “as soon as David was anointed, he acquired the crown of kingship,”<sup data-src="rambam-kings-1-7"></sup> the continuation and the main point of the kingship are specifically through Shlomo. The Rambam says in his “Book of the Mitzvot,” as quoted above: “there is no king for one who believes in the Torah of Moshe except from the seed of David and from the seed of Shlomo,” — and he includes this in the Thirteen Principles of Faith, in the twelfth principle: “And included in this principle (of the days of Moshiach) is … that there is no king for Israel except from the House of David and from the seed of Shlomo alone.”</p><p>It follows that Shlomo’s kingship and anointing were not only the actual continuation of David’s kingship — as his heir. The very essence of the kingship of the House of David — a kingship “forever” — came (after David) specifically through the kingship of Shlomo.</p>`,
        },
        {
          h: 'Shlomo’s prophecy and Shlomo’s choice',
          b: `<p>That is why we find that Shlomo’s kingship differed from all the other kings of the House of David: he was in fact and openly “he alone is king,” like David his father — unlike the other kings of the House of David, who were not sole kings over all Israel, for in their time, by the word of a prophet, a king from the other tribes was appointed over the ten tribes.</p><p>The reason: from the very start there was a clear prophecy to David about the eternity of Shlomo’s kingship: “Behold, a son will be born to you; he will be a man of rest … for Shlomo will be his name … He will build a house for My Name … and I will establish the throne of his kingship over Israel forever.”<sup data-src="chron1-22-9"></sup></p><p>What is more: just as about David’s choice it says, “And He chose David His servant”<sup data-src="ps-78-70"></sup> — and thereby “all [the rest of] Israel went out” of kingship, as quoted from the Mechilta — so it says about Shlomo: “The L-rd … chose me out of all my father’s house to be king over Israel forever … He wanted me, to make me king over all Israel. And of all my sons — for the L-rd has given me many sons — He chose Shlomo my son to sit on the throne of the kingship of the L-rd over Israel.”<sup data-src="chron1-28-4"></sup> And so all of David’s other sons went out.</p><p>That is why both are named together: “David and Shlomo, who were anointed from a horn — their kingship continued.” Since the eternity of David’s kingship was said especially and only about Shlomo — “I will establish the throne of his kingship over Israel forever” — it is this very thing that continues in Shlomo’s anointing: “to let everyone know that he alone is king.” So the kingship is called by the names of both — David and Shlomo.</p>`,
        },
        {
          h: '“May King David live forever”',
          b: `<p>From all of the above one can explain how the haftarah is “on the subject of the parshah”: both in its content and as a continuation of the parshah.</p><p>The fact that “the kings of the House of David are the ones who stand forever,” and Bat-Sheva’s proclamation at the end of the haftarah — after David swore to her “so will I do this very day” (that Shlomo would be king) — “May my lord King David live forever!”<sup data-src="kings1-1-30"></sup> mean that “the kingship will never be cut off from the seed of David,” even if, G-d forbid, they do not behave as they should: “The Holy One, blessed be He, promised him this, as it says: ‘If his sons forsake My Torah and do not walk in My laws … I will punish their transgression with the rod and their sin with plagues, but My kindness I will not take away from him.’”<sup data-src="rambam-kings-1-7"></sup><sup data-src="ps-89-31"></sup> This is because the crown of kingship of David is bound up with the choice of the Holy One, blessed be He, and in it there is no (true) break or change at all.</p>`,
        },
        {
          h: 'Like the choice of Avraham',
          b: `<p>And this is like the uniqueness of the Jewish people as the children of Avraham, Yitzchak and Yaakov: what the Avot — Avraham, Yitzchak and Yaakov — passed on to their children after them, to each and every one of the Jewish people, lasts until the end of all generations. For in the choice of the Holy One, blessed be He — “Who chose Avram”<sup data-src="neh-9-7"></sup> — there is no change.</p><p>And just as with the kings of the House of David, “May my lord King David live forever” was carried out in the continuation of the kingship — in that “Shlomo your son shall reign after me,” for “He chose Shlomo my son to sit on the throne of the kingship of the L-rd over Israel” — so in our parshah the continuation of Avraham (“Who chose Avram”) was carried out in the fulfillment of G-d’s promise, “for through Yitzchak shall offspring be called yours”:<sup data-src="gen-21-12"></sup> Yitzchak actually continued the House of Avraham.</p>`,
        },
        {
          h: 'Only three are called Avot',
          b: `<p>From this one can say why, by the Rambam’s text (and by the custom of most Jewish communities today), the verse about Shlomo’s actual reign is not said in the haftarah. For in our parshah, too, the Avot — Avraham, Yitzchak (and Yaakov) — as the foundation of the whole Jewish people, which they passed on to their children forever, are not yet complete (in our parshah) — not until Yaakov is born (in Parshat Toldot). For “through Yitzchak” — “and not all of Yitzchak,”<sup data-src="nedarim-31a"></sup> — and only then were the Avot complete: “only three are called Avot.”<sup data-src="berakhot-16b"></sup></p>`,
        },
        {
          h: 'One people — one king',
          b: `<p>One can say that what is “on the subject of the parshah” in this haftarah is not only the correspondence between the kingship of the House of David — David and Shlomo — and the Avot, but also that the completion of the choice of Avraham and Yitzchak — the foundation of the Jewish people — was revealed in the kings of the House of David.</p><p>The explanation: a “people” is complete precisely when it becomes one united people, not when each one is on his own. And this is done through a king — in the Rambam’s words about the mitzvah to appoint a king: “that He commanded us to appoint over us a king who will gather our whole nation and lead us.” So the choice of the whole Jewish people as one people is expressed in that the Holy One, blessed be He, chose a king over all Israel forever — the choice of David and Shlomo: “the kings of the House of David … stand forever,” and through them continues “the kingship of the L-rd over Israel.”<sup data-src="chron1-28-4"></sup></p>`,
        },
        {
          h: 'The kingship and the Beit HaMikdash',
          b: `<p>And more. As has been said many times, the kingship of the House of David is bound up with the Beit HaMikdash, as it is written: “I did not choose a city among all the tribes of Israel to build a house for My Name to be there; and I chose David to be over My people Israel.”<sup data-src="kings1-8-16"></sup> So the building of the Beit HaMikdash was specifically through David — who prepared everything for building the house — and Shlomo, of whom it says, “he will build a house for My Name,”<sup data-src="chron1-22-9"></sup> in actual fact.</p><p>Through the choice of the kings of the House of David and the building of the House, the Jewish people came “to the rest and to the inheritance” — together with the rest and the inheritance of the Shechinah: the dwelling of the Shechinah — “this is the house of the L-rd G-d …,” “this is My resting place forever.”<sup data-src="ps-132-14"></sup></p><p>So the revelation of the choice of Avraham and the Avot after him as the fathers of the Jewish people came at the time when “May my lord King David live forever” was fulfilled — in the kingship of David and Shlomo, who built the Beit HaMikdash: the Shechinah’s permanent dwelling in the Jewish people.</p>`,
        },
      ],
      reflection: 'G-d chose me — forever, no matter what. What can I do today so that this choice can be seen?',
      takeaways: [
        'The eternity of David’s kingship was said specifically about Shlomo; so the Gemara names them together.',
        'David’s crown is G-d’s choice, and it does not change: “My kindness I will not take away from him.”',
        'So too the choice of Avraham is forever; it continued through “through Yitzchak shall offspring be called yours.”',
        'The Avot are complete only with Yaakov — so the haftarah, too, stops at the oath.',
        'The choice of the Avot was completed in the kings of the House of David: one people with one king — and the Beit HaMikdash.',
      ],
      puzzle: {
        q: 'Put together the Rebbe’s answer: from the choice to the Beit HaMikdash.',
        pieces: ['Shlomo chosen, like David', 'G-d’s choice does not change', 'Like “You chose Avram”', 'The Avot complete with Yaakov', 'One king — one people — the Temple'],
        meaning: 'The choice of the House of David, like the choice of the Avot, is forever; and the choice of the Avot was completed when the kings of the House of David united the people and built the Beit HaMikdash.',
      },
    },
  ],
  final: {
    title: 'Investigation solved',
    allSolved:
      'All four riddles are solved. The haftarah ends with the oath “May my lord King David live forever” because the kingship of the House of David is G-d’s choice, which does not change — like the choice of Avraham and Yitzchak; and the choice of the Avot was completed in the kings of the House of David, who united the people and built the Beit HaMikdash.',
  },
  puzzle: {
    q: 'Put together the path of the talk.',
    pieces: ['The haftarah mirrors the parshah', 'Anointed due to a dispute', 'The oil — for your generations', 'The choice does not change', 'One people and the Temple'],
    meaning: 'From the question about the end of the haftarah to the main point: G-d chose Avraham and David forever, and this choice made Israel one people with the Beit HaMikdash in its midst.',
  },
  audience: 'Ages 11+: the link between haftarah and parshah, the dispute of Rashi and the Rambam, and the laws of anointing a king. Younger children — together with an adult.',
  practice:
    'G-d chose Avraham — and each of his children — forever, and it does not depend on how well we behaved today. Today, do something that unites: help someone, make peace, learn together with another — for a people is complete when it is one.',
  highlight: '“May my lord King David live forever!” (I Kings 1:31): G-d’s choice does not change — like the choice of Avraham and Yitzchak.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Why does the haftarah of Chayei Sarah end with “May King David live forever” — and not tell how Shlomo was anointed king?

I’m investigating together with the Lubavitcher Rebbe — “Niflaot of the Rebbe,” Parshat Chayei Sarah. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: the haftarah mirrors the parshah, anointed because of a dispute, a horn and not a flask, and chosen forever.
Play 👉 ${site}

©mychitas.app`,
  source:
    'The investigation follows a talk of the Lubavitcher Rebbe on the Shabbatot of Vayeira and Chayei Sarah 5743 (Likkutei Sichot, vol. 25, Chayei Sarah, talk 3), in Hebrew translation; retold by the project.',
};

export default en;
