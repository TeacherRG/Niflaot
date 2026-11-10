import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'The Ashes of Yitzchak',
  hero: {
    heading: 'Why are “<i>the ashes of Yitzchak heaped upon the altar</i>,” when the ashes of an offering are removed?',
    author: 'based on a talk of the Lubavitcher Rebbe · Likkutei Sichot, vol. 25, Toldot',
    intro:
      'G-d tells Yitzchak: “Do not go down to Egypt… sojourn in this land” — for he is an “olah temimah,” an offering that may not be taken out. And the Sages say that the merit of the Binding of Yitzchak is his “ashes, heaped upon the altar.” But by law the ashes of an offering are taken off and carried out! Investigate together with the Rebbe — from the laws of the Temple to how Yitzchak is “burning” even now.',
  },
  summary:
    'Yitzchak is an “olah temimah”: the ram was offered “in the stead of his son,” so he may not leave the Land of Israel. The Sages say his ashes are “heaped upon the altar,” although by law the ashes of offerings are removed. The Rebbe explains: at the Akeidah there was neither “terumat hadeshen” nor removal of the ashes; and more deeply — the Akeidah goes on always, as though Yitzchak is burning now. Ashes stand for the everyday, the permitted; with Yitzchak, whose self-sacrifice reached his very body, even the “ashes” stayed on the altar. The lesson: after prayer, deal with everyday matters “beside the altar” — so as to pray better tomorrow.',
  glossary: {},
  riddles: [
    {
      title: 'Olah Temimah',
      cond: `<p>During a famine G-d appeared to Yitzchak and said:</p><p class="verse" dir="rtl" lang="he">אל תרד מצרימה… גור בארץ הזאת</p><p>“Do not go down to Egypt… sojourn in this land.”<sup data-src="gen-26-2"></sup> Rashi explains: “You are an olah temimah (a perfect burnt offering), and outside the Land is not fitting for you.”<sup data-src="rashi-26-2"></sup></p><p>But the holiness of an offering begins when it is offered on the altar — and Yitzchak was not offered. And what does it mean that his “ashes” lie on the altar?</p>`,
      steps: [
        {
          q: 'Why was Yitzchak not allowed to go down to Egypt?',
          hint: 'Rashi’s words on our verse.',
          opts: ['“because you are an olah temimah”', '“because the famine in Egypt is worse”', '“because Avimelech will not let him go”', '“because the road is dangerous”'],
        },
        {
          q: 'What happens to an olah that goes out beyond the curtains — outside the Temple courtyard?',
          hint: 'The Midrash: “so you, too, if you leave the Land…”',
          opts: ['“it becomes unfit”', '“it becomes even holier”', '“it is brought back”', '“the kohanim eat it”'],
        },
        {
          q: 'What was the whole Land of Israel for Yitzchak, as the commentators explain?',
          hint: 'And everything outside the Land is like “outside the…”',
          opts: ['“like the Temple courtyard — the azarah”', '“like a city of refuge”', '“like the camp of the Levites”', '“like the desert”'],
        },
        {
          q: 'Where, at first sight, does the holiness of an olah begin — the holiness that going out spoils?',
          hint: 'Before an olah is offered, leaving the courtyard does not spoil it.',
          opts: ['“on the altar”', '“in Avraham’s house”', '“in any place”', '“in the land of Moriah”'],
        },
        {
          q: 'The ram was offered “in the stead of his son.” What did Avraham pray at every act he did with the ram?',
          hint: 'Rashi on Genesis 22:13.',
          opts: ['“as though my son were slaughtered”', '“that the ram be without blemish”', '“that Yitzchak not be afraid”', '“that fire come down from heaven”'],
        },
        {
          q: 'Where, the Sages say, are “the ashes of Yitzchak”?',
          hint: 'By them the place of the altar of the Second Temple was found.',
          opts: ['“heaped upon the altar”', '“scattered by the wind”', '“carried outside the camp”', '“buried in Chevron”'],
        },
      ],
      reveal: {
        h: 'Ashes that were not removed',
        p: 'Yitzchak is an olah temimah: the ram was offered “in the stead of his son,” and everything done with the ram counts as if it was done to Yitzchak — as though he was offered on the altar. So leaving the Land, which for him is like the Temple courtyard, would make him unfit. But this raises a question: the Sages say the merit of the Akeidah is “the ashes of Yitzchak, heaped upon the altar,” and by them the place of the altar of the Second Temple was even found. Yet by law the ashes of an offering do not stay on the altar: they are taken up and carried out. How, then, are Yitzchak’s ashes “heaped and lying upon the altar”?',
      },
      lessons: [
        {
          h: '“Sojourn in this land”',
          b: `<p>On the verse “sojourn in this land”<sup data-src="gen-26-2"></sup> the Sages say that Yitzchak was forbidden to leave the Land of Israel, because he was an “olah temimah”: “Just as an olah that goes out beyond the curtains becomes unfit, so you, too, if you go out of the Land, become unfit.”<sup data-src="bereshit-rabbah-64-3"></sup> And Rashi: “You are an olah temimah, and outside the Land is not fitting for you.”<sup data-src="rashi-26-2"></sup></p>`,
        },
        {
          h: 'The whole Land — like the Temple courtyard',
          b: `<p>The commentators explain: the whole Land of Israel was for him “as important as the azarah” — the Temple courtyard — and everything outside the Land “like outside the azarah.” Therefore, since he is an “olah temimah” — and an olah is “most holy” — he may not leave the Land of Israel, just as “the most holy does not go out of the azarah.”<sup data-src="rashi-26-2"></sup></p>`,
        },
        {
          h: 'A holiness that begins on the altar',
          b: `<p>We must understand: why does Yitzchak have the holiness of an olah in such a way that “if it went out beyond the curtains, it becomes unfit”? At first sight, such holiness arises only after the olah is offered on the altar; while an olah temimah is still alive, it does not become unfit if it is taken out of the azarah.<sup data-src="bereshit-rabbah-64-3"></sup></p>`,
        },
        {
          h: '“In the stead of his son”',
          b: `<p>The explanation is understood from the words of the Sages on the verse “and offered him up for a burnt offering in the stead of his son”:<sup data-src="gen-22-13"></sup> the ram was offered in Yitzchak’s place — “in the stead of his son” — and it is as though Yitzchak was the offering. In Rashi’s words, at every act Avraham prayed: “May this be as though it were done to my son: as though my son were slaughtered… his blood sprinkled… his skin flayed, as though he were burnt and turned to ashes.”<sup data-src="rashi-22-13"></sup></p><p>And since all these acts are considered done to Yitzchak, and he was offered on the altar, he was sanctified with the holiness of an olah temimah, which becomes unfit when it “goes out.”</p>`,
        },
        {
          h: '“The ashes of Yitzchak heaped upon the altar”',
          b: `<p>But if Yitzchak is considered an offering already brought on the altar, an explanation is needed. About the merit of the Akeidah the Sages say in several places that “the ashes of Yitzchak are as though heaped upon the altar.” And Rashi: “the ashes of Yitzchak appear before Me, heaped and lying upon the altar.”<sup data-src="rashi-lev-26-42"></sup> From the precise words of the Sages — “heaped <b>upon the altar</b>,” and not simply “heaped and standing for atonement,” as Rashi says elsewhere — we see that the merit of the Akeidah is bound up with Yitzchak’s ashes <b>remaining</b>, as it were, on the altar.</p>`,
        },
        {
          h: 'The ashes showed the place of the altar',
          b: `<p>Moreover, in tractate Zevachim the Gemara asks how the builders of the Second Temple knew the place of the altar, and answers: “They saw the ashes of Yitzchak — that they were lying in that place.”<sup data-src="zevachim-62a"></sup> By them they <b>fixed</b> the place of the altar.</p>`,
        },
        {
          h: 'But the ashes of an offering are removed',
          b: `<p>And this is puzzling: the place of the “deshen” — the ashes left from the offering (with Yitzchak this corresponds to “the ashes of Yitzchak,” the very same as the “deshen” of the ram) — is <b>not</b> on the altar. For with the ashes one performs “terumat hadeshen” — the taking up of the ashes — and the carrying out of the ashes.<sup data-src="lev-6-3"></sup></p><p>How, then, can it be said that Yitzchak’s ashes are “heaped (and lying) upon the altar”?</p>`,
        },
      ],
      reflection: 'Is there a place that is like a “Temple courtyard” for me — one I do not leave?',
      takeaways: [
        'Yitzchak may not leave the Land of Israel: he is an “olah temimah,” and for him the Land is like the Temple courtyard.',
        'The holiness of an olah that going out spoils begins on the altar.',
        'The ram was offered “in the stead of his son” — as though Yitzchak was slaughtered and burnt.',
        'The Sages: the merit of the Akeidah is “the ashes of Yitzchak heaped upon the altar”; by them the place of the altar was found.',
        'The question: by law the ashes of an offering are taken off and carried out.',
      ],
      puzzle: {
        q: 'Put together the course of the investigation: from the ban on leaving the Land — to the question of the ashes.',
        pieces: ['Sojourn in this land', 'Yitzchak — olah temimah', 'The ram — in place of the son', 'Ashes heaped upon the altar', 'But ashes are removed'],
        meaning: 'Yitzchak counts as an offering already brought — that is why he is an “olah temimah.” But why did his ashes stay on the altar, if the ashes of an offering are removed?',
      },
    },
    {
      title: 'The Akeidah Now',
      cond: `<p>The law of the ashes of the altar:</p><p class="verse" dir="rtl" lang="he">והרים את הדשן… ושמו אצל המזבח… והוציא את הדשן אל מחוץ למחנה</p><p>“He shall take up the ashes… and put them beside the altar… and carry the ashes outside the camp.”<sup data-src="lev-6-3"></sup></p><p>Why was this not done with Yitzchak’s ashes? And why do the Sages see the merit of the Akeidah precisely in the ashes — when ashes mean the offering has already burnt and is no more?</p>`,
      steps: [
        {
          q: 'Where are the ashes put at “terumat hadeshen”?',
          hint: 'The verse Leviticus 6:3.',
          opts: ['“beside the altar”', '“on top of the altar”', '“outside the city”', '“inside the Sanctuary”'],
        },
        {
          q: 'When, according to Rashi, are the ashes carried outside the camp?',
          hint: 'It is not a duty of every day.',
          opts: ['“when there is no room for the ‘maarachah’ — the wood pile”', '“every day”', '“only on Shabbat”', '“when the ashes have cooled”'],
        },
        {
          q: 'What is said about whatever touches the altar?',
          hint: 'Exodus 29:37.',
          opts: ['“whatever touches the altar becomes holy”', '“whatever touches the altar becomes impure”', '“the altar may not be touched”', '“the altar is holy only by day”'],
        },
        {
          q: 'When does an olah bring G-d “nachat ruach” — pleasure?',
          hint: '“And the L-rd smelled the sweet savour.”',
          opts: ['“while it burns — the ‘sweet savour’”', '“once it has turned to ashes”', '“before it is slaughtered”', '“when it is eaten”'],
        },
        {
          q: 'Which mitzvah set King David’s mind at ease in the bathhouse, when he saw himself “naked, without a mitzvah”?',
          hint: 'It is in his body.',
          opts: ['“circumcision”', '“tefillin”', '“tzitzit”', '“mezuzah”'],
        },
        {
          q: 'So how does the merit of the Akeidah work?',
          hint: 'Like circumcision, not like tefillin.',
          opts: ['“as though Yitzchak is burning now”', '“done once and finished”', '“long forgotten”', '“only on Rosh Hashanah”'],
        },
      ],
      reveal: {
        h: 'Yitzchak is burning now',
        p: 'Simply: at the Akeidah there was no “terumat hadeshen” — a small altar has no “beside the altar”; and there was no reason to carry out the ashes — no room was needed there for the next “maarachah.” And what has touched the altar does not come down from it; so the ashes stayed. But the Sages tie the very merit of the Akeidah to the ashes. Ashes are already a different entity, and the pleasure of an olah is while it burns. So the merit of the Akeidah is like the mitzvah of circumcision, which renews itself every moment: Yitzchak is as though burning on the altar now, anew, and the “sweet savour” rises now. That is why the ashes are “heaped upon the altar.”',
      },
      lessons: [
        {
          h: 'There was no “terumat hadeshen”',
          b: `<p>The simple explanation, in the revealed sense: when the ram was offered, neither “terumat hadeshen” nor the carrying out of the ashes was done.</p><p>“Terumat hadeshen” was impossible: this service ends with the words “and he shall put them beside the altar.”<sup data-src="lev-6-3"></sup> But the Akeidah counted as a “small altar” — a bamah — and there was no such place as “beside the altar”: everything that is not on the altar itself counts as “outside.”</p>`,
        },
        {
          h: 'Nor were the ashes carried out',
          b: `<p>And the reason for carrying out the ashes, in Rashi’s words: “when there is no room for the maarachah”<sup data-src="rashi-lev-6-4"></sup> — if the ashes are not removed from the altar, there will be no room for the next “maarachah” (wood pile). Clearly, this reason does not apply to the altar Avraham built for the Binding of Yitzchak.</p>`,
        },
        {
          h: 'What touches the altar does not come down',
          b: `<p>One may say: since there was no duty to remove the ashes from the altar, it is understandable that the ashes <b>remained</b> on the altar. For the law is: “whatever touches the altar becomes holy,”<sup data-src="ex-29-37"></sup> and “even an unfit offering that went up on it… shall not come down.” Therefore, when there is no duty and no special reason to remove the ashes, they “shall not come down.”</p><p>And so “the ashes of Yitzchak,” the very same as the “deshen” of the ram, are “heaped upon the altar.”</p>`,
        },
        {
          h: 'But this is the merit of the Akeidah itself',
          b: `<p>But a further explanation is needed. What we said explains why Yitzchak’s ashes <b>could</b> remain, and did remain, “heaped upon the altar.” But since the Sages tie Yitzchak’s merit to “his ashes… heaped upon the altar,” it is clear that this is bound up precisely with <b>the merit of the Akeidah itself</b>.<sup data-src="rashi-lev-26-42"></sup></p><p>And we must say: although normally the “deshen” of an olah must be removed from the altar — even though it is wholly for G-d — Yitzchak’s holiness of an olah, through the Akeidah, is such that the “ashes” stay “heaped (and lying) upon the altar.”</p>`,
        },
        {
          h: 'Ashes are something else',
          b: `<p>To explain this, an introduction is needed.</p><p>a) In general, it is evident also from practical law: when something has turned to ashes, it is <b>no longer</b> in its former existence. An example is the destruction of chametz according to the view that it is destroyed only by burning: after the burning, ashes still remain, but that is already a different entity.</p><p>b) The effect, the “nachat ruach” — the pleasure — of an olah, whose offering is completed by burning on the altar, is the “sweet savour” <b>at the time</b> it burns: “and the L-rd smelled the sweet savour…”<sup data-src="gen-8-21"></sup> — and while it turns to ashes, but not afterwards.</p><p>Then it is hard to understand the saying that the merit of the Akeidah stands for all generations in the expression “the <b>ashes</b> of Yitzchak”: the word “ashes” emphasizes exactly the <b>opposite</b> — that the Akeidah, the act of offering itself, no longer exists!</p>`,
        },
        {
          h: 'Three kinds of merit',
          b: `<p>To understand this, we must first say that the merit of a mitzvah acts after it was done in several ways:</p><p>a) A merit that was already <b>completed</b> in the past: the mitzvah creates a merit that stays with a person forever, but the cause of the merit was already done and finished in the past.</p><p>b) The mitzvah was done in the past, but its effect <b>continues</b> — so its merit continues too, also at the time when that merit is needed.</p><p>c) The earlier act continues and <b>renews itself</b> all the time, so that even after time has passed it is as though the mitzvah is being performed <b>now</b>.</p>`,
        },
        {
          h: 'King David in the bathhouse',
          b: `<p>This explains what is said about King David: “When David entered the bathhouse and saw himself standing naked, he said: Woe to me that I stand naked, without a mitzvah! But once he remembered the circumcision in his flesh, his mind was put at ease.”<sup data-src="menachot-43b"></sup></p><p>Yet at first sight, in David’s mind and heart the “subjugation of the heart and mind” from his earlier putting on of tefillin was surely felt. Why, then, did he feel “naked, without a mitzvah”?</p><p>The explanation: the subjugation of heart and mind is the continuing effect of tefillin put on <b>before</b>, but the mitzvah itself is not being done now. Whereas the mitzvah of circumcision — to be circumcised — renews itself every moment, and a person counts as though he were circumcised <b>now</b>.</p>`,
        },
        {
          h: 'The Akeidah — every moment',
          b: `<p>And this is the novelty of the Akeidah: the merit of the Akeidah exists as though Yitzchak is <b>burning now</b> (every moment) — <b>anew</b> upon the altar. That is why “the ashes of Yitzchak… are heaped upon the altar”: he is burning <b>now</b> upon the altar, and now the “sweet savour” rises.<sup data-src="gen-8-21"></sup></p>`,
        },
      ],
      reflection: 'Which of my good deeds can “go on” today too — and not stay only in the past?',
      takeaways: [
        'At the Akeidah there was no “terumat hadeshen”: a small altar has no “beside the altar.”',
        'Nor were the ashes carried out: that is done “when there is no room for the maarachah.”',
        'What has touched the altar does not come down from it — so the ashes stayed.',
        'But ashes are already a different entity, and the pleasure of an olah is while it burns.',
        'The merit of the Akeidah is like circumcision: it renews every moment, as though Yitzchak is burning now.',
      ],
      puzzle: {
        q: 'Put together the explanation: from the laws of the ashes — to an Akeidah that goes on.',
        pieces: ['No “beside the altar”', 'No need to carry out', 'It does not come down', 'Circumcision — every moment', 'Yitzchak is burning now'],
        meaning: 'The ashes stayed because they did not need to be removed; but the merit is that the Akeidah goes on always — as though Yitzchak is burning on the altar now.',
      },
    },
    {
      title: 'Ashes Are the Everyday',
      cond: `<p>What does the “deshen” — the ashes of the altar — mean in a person’s service? The Rebbe brings two ways of dealing with everyday, permitted matters:</p><p class="verse" dir="rtl" lang="he">כל מעשיך יהיו לשם שמים</p><p>“Let all your deeds be for the sake of Heaven.”<sup data-src="avot-2-12"></sup></p><p class="verse" dir="rtl" lang="he">בכל דרכיך דעהו</p><p>“In all your ways know Him.”<sup data-src="prov-3-6"></sup></p><p>Which of them is the ashes carried outside the camp, and which is the ashes beside the altar?</p>`,
      steps: [
        {
          q: 'What are ashes, as the Alter Rebbe explains in the Tanya?',
          hint: 'Fire has no power over it; it sinks down.',
          opts: ['“the element of earth — the coarsest”', '“the element of fire”', '“the element of water”', '“the element of air”'],
        },
        {
          q: 'What does the part of the offering that burns on the altar hint at?',
          hint: 'The finer things of the world, which can be wholly included in holiness.',
          opts: ['“things used for mitzvot”', '“permitted everyday matters”', '“sins”', '“food”'],
        },
        {
          q: 'And what do the ashes that remain hint at?',
          hint: 'What a Jew cannot do without, but which is not holy.',
          opts: ['“permitted everyday matters”', '“holy objects”', '“words of Torah”', '“holy books”'],
        },
        {
          q: 'The ashes are carried “outside the camp — to a clean place.” Which way is this?',
          hint: 'The deeds are “yours,” but the aim is holiness.',
          opts: ['“‘Let all your deeds be for the sake of Heaven’”', '“‘In all your ways know Him’”', '“‘Love your fellow as yourself’”', '“‘Turn from evil and do good’”'],
        },
        {
          q: 'And the ashes of “terumat hadeshen” are put “beside the altar.” Which way is this?',
          hint: 'It is the higher one.',
          opts: ['“‘In all your ways know Him’”', '“‘Let all your deeds be for the sake of Heaven’”', '“‘Be careful with a light mitzvah’”', '“‘Make for yourself a teacher’”'],
        },
        {
          q: 'What becomes holiness in the way of “In all your ways know Him”?',
          hint: 'Not only what will come of it later.',
          opts: ['“the permitted matters themselves”', '“only the benefit that comes later”', '“nothing”', '“only the mitzvot”'],
        },
      ],
      reveal: {
        h: 'Beside the altar — and outside the camp',
        p: 'Ashes are the coarsest thing, the element of earth. What burns stands for the finer things of the world, used for mitzvot; the ashes stand for the permitted, everyday matters, which cannot enter the fire of the altar, the highest holiness — so ashes do not stay on the altar. But there are two levels. Ashes carried “outside the camp, to a clean place,” are “all your deeds for the sake of Heaven”: everyday deeds, but for holiness — the benefit comes later. The ashes of “terumat hadeshen,” put “beside the altar,” are “in all your ways know Him”: the everyday matters themselves become holiness; they do not stay on the altar, but lie beside it and are absorbed in their place.',
      },
      lessons: [
        {
          h: 'Ashes — the coarsest thing',
          b: `<p>The explanation of all this in a person’s spiritual service.</p><p>The meaning of “deshen” in a person’s service: <b>ashes</b> in themselves, apart from whatever turned a thing to ashes, are utter physicality. As the Alter Rebbe explains in the Tanya: the ashes left from “burnt wood” are the element of earth in it, “which sinks down, and the fire has no power over it… earth is more material than all” the other elements.</p>`,
        },
        {
          h: 'What burns and what remains',
          b: `<p>This is the meaning of the ashes of the altar. The part of the offering that burns on the altar hints at the “finer” things of the world, which can rise and be wholly included in holiness: in general, these are the things of the world with which a mitzvah is done — articles used for a mitzvah, holy articles and the like.</p><p>And the ashes left from the offering hint at the lower part of the world, which <b>cannot</b> enter the fire of the altar — absolute holiness. In general these are the <b>permitted</b>, everyday matters that a Jew needs.</p><p>That is why the ashes cannot remain on the altar — the height of holiness.<sup data-src="lev-6-3"></sup></p>`,
        },
        {
          h: 'Two levels',
          b: `<p>There are two levels in this: a) the “deshen” with which “terumat hadeshen” is performed — it stays at least “beside the altar”; b) the “deshen” that is carried “outside the camp.”<sup data-src="lev-6-3"></sup></p><p>One may say that this is the difference between two ways of spiritual service: “let all your deeds be for the sake of Heaven”<sup data-src="avot-2-12"></sup> and “in all your ways know Him.”<sup data-src="prov-3-6"></sup></p>`,
        },
        {
          h: '“All your deeds — for the sake of Heaven”',
          b: `<p>The meaning of “let all your deeds be for the sake of Heaven”: when a person does these deeds, for him they are “<b>your</b> deeds,” permitted matters; only he does them “for the sake of Heaven,” for the sake of holiness — later, a <b>benefit</b> for heavenly matters will grow from them.<sup data-src="avot-2-12"></sup></p><p>This way is hinted at in the ashes carried “outside the camp”: they are <b>not</b> in the camp of holiness. But they are carried “to a <b>clean</b> place”<sup data-src="lev-6-3"></sup> — the person does permitted things for the sake of Heaven, for holiness.</p>`,
        },
        {
          h: '“In all your ways know Him”',
          b: `<p>A higher way in everyday matters is “in all your ways <b>know Him</b>”:<sup data-src="prov-3-6"></sup> not only that <b>later</b>, through them, he will come to “know Him,” but <b>in them themselves</b> — “in all your ways” — “know Him.” They are indeed “<b>your</b> ways” — permitted matters, yet the permitted matters themselves become holiness.</p><p>This is like “terumat hadeshen”: the ashes cannot remain on the altar itself — they are “your ways” — and yet “he shall put them beside the altar”:<sup data-src="lev-6-3"></sup> they stay right next to the altar and are absorbed in their place.</p>`,
        },
      ],
      reflection: 'When I eat, work or rest — do I do it “for the sake of Heaven,” or can I “know Him” in it too?',
      takeaways: [
        'Ashes are the element of earth, the most material.',
        'What burns on the altar stands for things used for mitzvot; the ashes — for permitted everyday matters.',
        'Ashes carried outside the camp “to a clean place” — “all your deeds for the sake of Heaven”: the benefit comes later.',
        'Ashes beside the altar — “in all your ways know Him”: the everyday itself becomes holiness.',
        'On the altar itself the ashes do not remain — that is the highest holiness.',
      ],
      puzzle: {
        q: 'Put together the Rebbe’s explanation: what ashes are in a person’s service.',
        pieces: ['Ashes — the element of earth', 'What burns — used for mitzvot', 'Ashes — the permitted', 'Outside the camp — for Heaven', 'Beside the altar — know Him'],
        meaning: 'Everyday matters are “ashes”: they have no place on the altar. But they can be carried “to a clean place” — for the sake of Heaven — or left “beside the altar,” so as to know G-d in them themselves.',
      },
    },
    {
      title: 'Wholly upon the Altar',
      cond: `<p>The Midrash tells:</p><p class="verse" dir="rtl" lang="he">כיון שהגיע החרב על צוארו, פרחה ויצאה נפשו של יצחק</p><p>“When the blade touched his neck, the soul of Yitzchak flew away and departed” — and when the voice said “do not lay your hand,” it returned.<sup data-src="pdre-31"></sup></p><p>How is Yitzchak’s self-sacrifice different from Avraham’s — and why, because of it, did even Yitzchak’s “ashes” stay on the altar? And what does this teach each of us after the morning prayer?</p>`,
      steps: [
        {
          q: 'What happened to Yitzchak when the blade touched his neck?',
          hint: 'Pirkei DeRabbi Eliezer, ch. 31.',
          opts: ['“his soul flew away and departed”', '“he ran away from the mountain”', '“he fell asleep”', '“he called his father”'],
        },
        {
          q: 'And what happened to Avraham in the fiery furnace in Ur Kasdim?',
          hint: 'So there was no actual self-sacrifice of the body there.',
          opts: ['“the fire did not touch him”', '“he burnt and turned to ashes”', '“he ran out of the furnace”', '“he was not thrown into the furnace”'],
        },
        {
          q: 'How far did Yitzchak’s self-sacrifice reach?',
          hint: 'It comes from the very essence of the soul.',
          opts: ['“to the body as well”', '“only to his thoughts”', '“only to his speech”', '“only to his property”'],
        },
        {
          q: '“And Yitzchak sowed.” What did he “sow,” according to the Midrash?',
          hint: '“Sow for yourselves in righteousness.”',
          opts: ['“a tithe of his wealth — as tzedakah”', '“wheat for Avimelech”', '“seeds for Esav”', '“a vineyard for Avraham”'],
        },
        {
          q: 'What do the prayers correspond to, according to the Gemara?',
          hint: 'And the daily offering is an olah, wholly for G-d.',
          opts: ['“the daily offerings — the tamid”', '“the days of the week”', '“the tribes of Israel”', '“the angels”'],
        },
        {
          q: 'When may one “go outside the camp” — to everyday matters — after prayer?',
          hint: 'The ashes are carried out only when “there is no room for the maarachah.”',
          opts: ['“when it brings a benefit: to pray better tomorrow”', '“when one wants to get rich”', '“when one needs a rest from prayer”', '“always, for no reason”'],
        },
      ],
      reveal: {
        h: 'Even the ashes are upon the altar',
        p: 'At the Akeidah Yitzchak gave himself in actual fact — his soul flew away — while the fire did not touch Avraham. Such self-sacrifice comes from the very essence of the soul and reaches the body. So Yitzchak was sanctified completely: even his physical side became an olah, “wholly for G-d” — even when he sowed wheat, its meaning was “sow for yourselves in righteousness.” So there is no room in him for the everyday “outside”: even the “ashes” are heaped upon the altar. The lesson: prayer is in place of the daily olah offering; after it we go out to our affairs, but “outside the camp” only for the sake of the next “maarachah” — to pray better tomorrow. A Jew’s place is inside, “beside the altar”; and inwardly, by the level of Yitzchak within him, his “ashes” are upon the altar.',
      },
      lessons: [
        {
          h: 'Self-sacrifice in actual fact',
          b: `<p>From this we understand why “the ashes of Yitzchak are as though heaped upon the altar.”</p><p>The novelty of the Binding of Yitzchak is self-sacrifice <b>in actual fact</b>, giving up the body in the plain sense. When Avraham went into the fiery furnace in Ur Kasdim, there was no actual self-sacrifice of the body: the fire did not touch him at all. But with Yitzchak, at the time of the Akeidah, “the soul of Yitzchak flew away and departed,”<sup data-src="pdre-31"></sup> — and afterwards he experienced resurrection of the dead.</p>`,
        },
        {
          h: 'Down to the very body',
          b: `<p>This level of self-sacrifice comes from the very essence of the soul, which cleaves to and is united with G-dliness in complete unity, so that it penetrates every part of a person equally — the physical body too. That is why it is expressed in giving up the <b>body</b> for the Holy One, blessed be He.</p><p>Therefore, through the Akeidah, Yitzchak was sanctified so that even his <b>body</b> became <b>wholly holy</b>, and even the <b>physical</b> parts of Yitzchak rose to the level of an olah, “wholly for G-d”: his physical matters were so nullified before holiness that he did not “feel” his “physicality” at all, and his whole being was “the service of G-d.”<sup data-src="pdre-31"></sup></p>`,
        },
        {
          h: '“And Yitzchak sowed” — tzedakah',
          b: `<p>As explained at length elsewhere, about what Pirkei DeRabbi Eliezer says on the verse “and Yitzchak sowed”:<sup data-src="gen-26-12"></sup> “Did Yitzchak sow wheat, heaven forbid? No — he took a tithe of all his wealth and sowed tzedakah for the poor, as it is said: ‘Sow for yourselves in righteousness.’”<sup data-src="pdre-33"></sup><sup data-src="hosea-10-12"></sup></p><p>A verse does not depart from its plain meaning: Yitzchak sowed wheat in the plain sense, and that was the wealth from which he took a tithe. But “heaven forbid” to say that his act “and he sowed” was, in its <b>meaning and essence</b>, the sowing of wheat. Rather, for <b>him</b> the meaning of the act “sowing wheat” was “sow for yourselves in righteousness.”</p>`,
        },
        {
          h: 'The tithe — for the sake of tzedakah',
          b: `<p>One may also note, according to another saying of the Sages: Yitzchak instituted tithes,<sup data-src="rambam-kings-9-1"></sup> and a tithe is given precisely from produce that belongs to the person himself — therefore, and only therefore, he sowed wheat: in order to separate a tithe.</p><p>And one may say that it is one and the same: the root of the mitzvah of tithes and the like is tzedakah.</p>`,
        },
        {
          h: 'Through the Akeidah even the “ashes” were sanctified',
          b: `<p>Therefore “the ashes of Yitzchak… are heaped upon the altar”: through the Akeidah Yitzchak was sanctified in such a way that no room was left for the “mundane,” which belongs “outside” — even his “<b>ashes</b>,” all his physical matters, are “heaped upon the altar,” all of them wholly for G-d.</p><p>This also explains why the merit of the Akeidah is expressed precisely in the word “ashes”: the merit of the Akeidah rests on the way Yitzchak gave himself — the special quality of his self-sacrifice lies precisely in the novelty that “his ashes… are heaped upon the altar.”<sup data-src="rashi-lev-26-42"></sup></p>`,
        },
        {
          h: 'Prayer — in place of the daily offering',
          b: `<p>The lesson from this for the service of each and every one:</p><p>One of the reasons the section of the Akeidah is said every day is “to subdue one’s inclination to serve G-d, as Yitzchak gave his soul.” One must know: this subduing must lead to the “<b>ashes</b>” (the physicality) of a Jew being “heaped upon the altar” too.</p><p>The meaning of this: “the prayers were instituted in place of the daily offerings,”<sup data-src="berakhot-26b"></sup> and the daily offering is an olah, wholly for G-d. For the perfection of prayer is that a Jew gives himself entirely to the Holy One, blessed be He.</p>`,
        },
        {
          h: '“When there is no room for the maarachah”',
          b: `<p>But the self-nullification and self-sacrifice in prayer “allow” a Jew, after prayer, to go “outside the camp” and deal with his physical affairs. True, prayer brings it about that these affairs will be only “to a clean place” — all your deeds for the sake of Heaven — but still they are <b>outside</b> the camp.</p><p>To this comes the clarification: the reason for carrying out the ashes is “when there is no room for the maarachah”;<sup data-src="rashi-lev-6-4"></sup> but if there <b>is</b> room for the maarachah, the ashes are not removed. The “permission” to deal with physical things in this way, “outside the camp,” is only if a benefit grows from it for the next maarachah: so that the next day one can pray better.</p>`,
        },
        {
          h: 'A Jew’s place is inside',
          b: `<p>A Jew’s place is inside. True, he is a soul in a body and has physical needs — but it is enough for him to deal with physicality “beside the altar”; going “outside the camp” is not a Jew’s place. Even when he deals with permitted matters for the sake of Heaven, it is a lower service: he is not pouring a cup for his master but cooking a pot for his master, and must change “his garments” (his enthusiasm — for the “cooking” — in deed, speech and thought).<sup data-src="lev-6-3"></sup></p>`,
        },
        {
          h: 'The level of Yitzchak in everyone',
          b: `<p>That is why the section of the Akeidah is said before all the matters of the day: to feel this, self-sacrifice like Yitzchak’s is needed. The self-sacrifice in prayer must be such that it “sweeps along” the body and all one’s physical affairs, until one feels that one has no “outside the camp” and one’s physicality is wholly permeated with holiness.</p><p>And then, even going out after prayer “outside the camp” to deal with the matters of the world, conducting them in the way of the world — he feels that being “outside the camp” is only external. His inner self, and especially from the side of his soul — the level of Yitzchak within him — is “the ashes… heaped upon the altar.”</p><p>And through this, his dealing with physicality is such that his whole intention is only for the benefit that will grow from it for the service of G-d, the place of the maarachah.</p>`,
        },
      ],
      reflection: 'After the morning prayer — what do I take with me into the day’s affairs, and do they help me pray better tomorrow?',
      takeaways: [
        'At the Akeidah Yitzchak gave himself in actual fact: his soul flew away; the fire did not touch Avraham.',
        'Such self-sacrifice comes from the essence of the soul and reached the body: all of Yitzchak’s physicality became an olah.',
        '“And Yitzchak sowed”: the meaning of sowing wheat was tzedakah.',
        'So with Yitzchak even the “ashes” are upon the altar: there is no room for “outside.”',
        'The lesson: after prayer, deal with everyday matters “beside the altar” — so as to pray better tomorrow.',
      ],
      puzzle: {
        q: 'Put together the Rebbe’s answer: from the Akeidah — to the morning of every day.',
        pieces: ['Yitzchak’s soul flew away', 'Self-sacrifice — to the body', 'Sowing — for tzedakah', 'Even the ashes upon the altar', 'The everyday — for the maarachah'],
        meaning: 'Yitzchak’s self-sacrifice sanctified even his everyday; so prayer, too, must sweep along the whole body, so that afterwards the day’s affairs serve the next “maarachah.”',
      },
    },
  ],
  final: {
    title: 'Investigation solved',
    allSolved:
      'All four riddles solved. Yitzchak’s ashes stayed on the altar: at the Akeidah there was neither “terumat hadeshen” nor removal of the ashes; and more deeply — the Akeidah goes on every moment, and Yitzchak’s self-sacrifice, which reached his body, sanctified even his everyday. So we, too, after prayer — deal with our affairs “beside the altar.”',
  },
  puzzle: {
    q: 'Put together the path of the talk.',
    pieces: ['Yitzchak — olah temimah', 'Ashes heaped upon the altar', 'The Akeidah — now', 'Ashes — the everyday', 'The everyday — by the altar'],
    meaning: 'From the question of Yitzchak’s ashes — to the main point: Yitzchak’s self-sacrifice sanctified even his “ashes,” and the prayer of each of us can sanctify our everyday affairs.',
  },
  audience: 'From age 11: the laws of the olah offering and the ashes of the altar, midrashim on the Akeidah and a lesson for every day. Younger children — together with adults.',
  practice:
    'Today, after the morning prayer, choose one everyday task — a meal, homework, work — and do it so that it helps you pray and learn better tomorrow: for example, go to bed on time, or do the task calmly and honestly.',
  highlight: '“The ashes of Yitzchak appear before Me, heaped and lying upon the altar” (Rashi, Leviticus 26:42): the Akeidah goes on every moment.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Why do the Sages say “the ashes of Yitzchak are heaped upon the altar,” when by law the ashes of an offering are removed?

I’m investigating with the Lubavitcher Rebbe — “Niflaot of the Rebbe,” Parshat Toldot. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: olah temimah, the Akeidah now, ashes are the everyday, and wholly upon the altar.
Play 👉 ${site}

©mychitas.app`,
  source:
    'The investigation follows a talk of the Lubavitcher Rebbe on Shabbat Behar-Bechukotai 5728 (Likkutei Sichot, vol. 25, Toldot, talk 3), in Hebrew translation; retold by the project.',
};

export default en;
