// The 100-day Gita plan, written by hand. Contains NO text from the book: only verse
// numbers, paragraph indices, and my own short bridges ("mine"), notes and scene lines.
// build-content.mjs turns this into gita/content/days.json (pointers only).
//
// Fields:
//   v        verse(s) of the day, book numbering, e.g. [2, 47] or [2, 62, 63] for a pair
//   why      why this verse was chosen (kept in the data, not shown)
//   mine     my bridge over the skipped verses (1-4 sentences), shown with a small marker
//   his      extra "his" thread segments: { c, v, p:[paragraphs] } from his commentary
//   words    explicit commentary picks: [{ c, v, p:[...] } | { c, closing:[...] }]
//            (omitted = the builder picks ~250-450 words in book order)
//   intro    explicit chapter-intro pointer (first day of a chapter)
//   close    extra item shown at the close, e.g. { c: 2, v: 72, part: "translation" }
//   scene    the setting for the day's painting (never the verse's metaphor)

export const days = [
  // ---------------- Chapter 1 ----------------
  {
    v: [1, 1],
    why: "The only words of Dhritarashtra in the Geeta; the frame of the whole dialogue.",
    intro: { generalIntro: [24, 25, 26, 27] },
    mine: "Thirteen years of exile are over, and the Pandavas' claim to their kingdom has been refused. Now two great armies stand facing each other on the plain of Kurukshetra. In the palace at Hastinapura, the blind king Dhritarashtra turns to Sanjaya, who has been granted divine sight to see the distant field, and asks what is happening.",
    words: [{ c: 1, v: 1, p: [0, 1, 2] }],
    scene: "a lamp-lit palace hall at Hastinapura at night, the blind king seated on his throne, Sanjaya beside him with eyes glowing with a distant vision of the battlefield",
  },
  {
    v: [1, 47],
    why: "Arjuna collapses on the chariot: the condition the whole teaching answers.",
    mine: "Bhishma's conch sounds, and both armies answer with conches, drums and horns (1.12–19). Arjuna asks Krishna to drive the chariot into the space between the armies so he can see whom he must fight (1.21–24). There he sees teachers, grandfathers, uncles, cousins and friends; his limbs fail, his mouth dries and the Gandiva bow slips from his hand (1.26–30). He argues that no kingdom is worth the death of kinsmen and the ruin of families (1.31–46).",
    words: [
      { c: 1, v: 47, p: [0, 1] },
      { c: 1, closing: [12, 13] },
    ],
    scene: "a lone chariot between two vast armies at dawn, Arjuna slumped with his bow on the chariot floor, Krishna shown only as a hand on the reins of white horses",
  },

  // ---------------- Chapter 2 ----------------
  {
    v: [2, 7],
    why: "Arjuna surrenders as a disciple; the teaching can begin.",
    intro: { generalIntro: [28, 29] },
    mine: "Krishna answers Arjuna's collapse with a sharp rebuke: this weakness is unworthy of a warrior; shake it off and stand up (2.2–3). Arjuna pleads that he cannot strike Bhishma and Drona, whom he reveres, and that he no longer knows which outcome would be better (2.4–6).",
    words: [{ c: 2, v: 7, p: [0, 1, 2, 3] }],
    scene: "Arjuna bowed low in the chariot before a figure seen from behind, wrapped in soft golden light",
  },
  {
    v: [2, 11],
    why: "The first words of the teaching: the wise grieve neither for the living nor the dead.",
    mine: "Having asked for guidance, Arjuna still declares, \"I will not fight,\" and falls silent (2.9). Then, between the two armies, Krishna seems to smile as he begins to speak (2.10).",
    his: [{ c: 2, v: 10, p: [0, 1] }],
    words: [{ c: 2, v: 11, p: [0, 1, 10] }],
    scene: "a single shaft of light falling on the chariot between the silent armies",
  },
  {
    v: [2, 12],
    why: "The eternity of the Self, stated for the first time.",
    words: [{ c: 2, v: 12, p: [0, 8] }],
    scene: "a river of morning light flowing between the two armies at dawn",
  },
  {
    v: [2, 13],
    why: "The argument from memory: the one who passes through childhood, youth and age.",
    words: [{ c: 2, v: 13, p: [0, 1, 2, 3] }],
    scene: "the frozen armies of Kurukshetra seen from high above, the chariot a small bright point at the center",
  },
  {
    v: [2, 14],
    why: "Bearing the pairs of opposites: change is the nature of experience.",
    mine: "Krishna has spoken of the one who remains through childhood, youth and old age. He now turns to the pleasures and pains that the senses bring, which come and go.",
    words: [{ c: 2, v: 14, p: [2, 3, 4] }],
    scene: "clouds and weather racing across the sky above a perfectly still chariot",
  },
  {
    v: [2, 16],
    why: "The Real and the unreal: the philosophical heart of chapter two.",
    mine: "Krishna adds that the steady person, whom these passing pairs of pleasure and pain do not shake, is fit for immortality (2.15).",
    words: [{ c: 2, v: 16, p: [1, 3, 4] }],
    scene: "dusk on the battlefield, torches being lit one by one along the lines of both armies",
  },
  {
    v: [2, 20],
    why: "The Self is not born and does not die: the classic statement.",
    mine: "That which pervades all this is indestructible, Krishna says; only bodies come to an end, so Arjuna should fight (2.17–18). Whoever thinks the Self kills, or is killed, does not understand (2.19).",
    words: [{ c: 2, v: 20, p: [0, 1] }],
    scene: "Krishna seen from behind on the chariot, a dark silhouette against a vast starry sky",
  },
  {
    v: [2, 22],
    why: "The image of the worn-out garments; the most quoted verse on rebirth.",
    mine: "How then could one who knows the Self as indestructible and unborn cause anyone to kill, or kill (2.21)?",
    words: [{ c: 2, v: 22, p: [0, 1, 3] }],
    scene: "close on the reins held in a steady hand, the white horses and the Hanuman banner above",
  },
  {
    v: [2, 23],
    why: "The Self beyond the elements: weapons cannot cleave it.",
    words: [{ c: 2, v: 23, p: [0, 1] }],
    scene: "smoke and banners swirling around a still circle of calm light where the chariot stands",
  },
  {
    v: [2, 47],
    why: "The most quoted verse of the Geeta: the right to action, not its fruits.",
    mine: "Krishna completes his teaching on the Self: eternal, all-pervading, unmanifest, beyond grief (2.24–30). Then he speaks of Arjuna's own duty as a warrior: a righteous war is a rare blessing, and to turn away would bring dishonour (2.31–37). Hold joy and sorrow, profit and loss, winning and losing as equal, he says, and fight (2.38).",
    his: [{ c: 2, v: 39, p: [0] }],
    words: [{ c: 2, v: 47, p: [4, 6, 7] }],
    scene: "sunrise over Kurukshetra, long shadows stretching from the chariot across the plain",
  },
  {
    v: [2, 48],
    why: "Yoga defined as evenness of mind.",
    words: [{ c: 2, v: 48, p: [5, 7] }],
    scene: "the view from Arjuna's seat in the chariot, a peacock feather glinting in the morning light",
  },
  {
    v: [2, 50],
    why: "Yoga as skill in action: the second definition.",
    mine: "Krishna declares that action done for the sake of its fruits is far inferior to action guided by this wisdom; take refuge in it (2.49).",
    words: [{ c: 2, v: 50, p: [0, 5, 6] }],
    scene: "the Gandiva bow resting in the chariot, bathed in clear light",
  },
  {
    v: [2, 55],
    why: "The first mark of the Sthita-Prajna, the one of steady wisdom.",
    mine: "The wise, acting this way, are freed from the bondage of birth (2.51). When the intellect has crossed beyond confusion and stands unshaken in the Self, it attains Yoga (2.52–53). Arjuna then asks how a person of steady wisdom speaks, sits and moves (2.54).",
    his: [{ c: 2, v: 54, p: [1] }],
    words: [{ c: 2, v: 55, p: [1, 5, 7] }],
    scene: "golden radiance slowly growing behind Krishna, seen from behind as he speaks",
  },
  {
    v: [2, 58],
    why: "The tortoise: withdrawing the senses at will.",
    mine: "Krishna continues: the sage of steady wisdom is not shaken by sorrow nor hungry for pleasure, and is free from attachment, fear and anger (2.56–57).",
    words: [{ c: 2, v: 58, p: [0, 2, 3] }],
    scene: "twilight on the field, the two conches resting quietly on the floor of the chariot",
  },
  {
    v: [2, 62, 63],
    why: "The ladder of the fall, from brooding to ruin: one sentence across two verses.",
    mine: "Objects fall away from one who abstains from them, Krishna says, but the craving remains until the Supreme is seen (2.59). The senses can carry away even a striving mind, so one should restrain them and sit absorbed in Me (2.60–61).",
    words: [{ c: 2, v: 63, p: [2, 3, 4] }],
    scene: "storm clouds massing over the Kaurava ranks while a steady light rests on the chariot",
  },
  {
    v: [2, 70],
    why: "The ocean that receives all rivers: the peace of the sage.",
    mine: "One who moves among objects with senses under control finds a serene mind, and in that serenity sorrows end (2.64–65). Without steadiness there is no peace, and without peace, how can there be happiness (2.66)? What is night for all beings is day for the self-controlled sage (2.69).",
    words: [{ c: 2, v: 70, p: [0, 4, 5] }],
    close: { c: 2, v: 72, part: "translation" },
    scene: "dawn over all of Kurukshetra, the chariot at the very center of the radiance",
  },

  // ---------------- Chapter 3 ----------------
  {
    v: [3, 1, 2],
    why: "Arjuna's confusion opens the chapter: if knowledge is higher, why action?",
    mine: "Chapter Two ended with the sage who rests in Brahman even at the end of life (2.72). Arjuna has heard both knowledge and action praised, and he is confused.",
    scene: "morning on the battlefield, Arjuna turned toward Krishna, who is seen only from behind in warm light",
  },
  {
    v: [3, 9],
    why: "Action as Yajna, offered rather than grasped; the key to the chapter.",
    mine: "Krishna answers that there are two paths, knowledge for the contemplative and action for the active, and that no one can stay without acting even for a moment (3.3–5). One who restrains the body but dwells on objects in the mind deceives himself; better to do one's appointed work with the senses under control (3.6–8).",
    scene: "the Pandava camp behind the lines at morning, tents and horses in soft gold light, the chariot ahead on the plain",
  },
  {
    v: [3, 19],
    why: "Must-include: perform action without attachment and reach the Supreme.",
    mine: "Krishna recalls how the Creator brought forth beings together with sacrifice, so that gods and humans might sustain one another (3.10–13). From food come beings, from rain comes food, from sacrifice comes rain, and the wheel turns (3.14–16). The one who delights in the Self alone has nothing left to do (3.17–18).",
    scene: "the distant hills beyond Kurukshetra in clear morning air, sunlight resting on the chariot",
  },
  {
    v: [3, 21],
    why: "Must-include: whatever the great do, others follow.",
    mine: "Janaka and other kings reached perfection through action alone; Krishna tells Arjuna to act with the welfare of the world in view (3.20).",
    scene: "the commanders of both armies watching from their chariots, banners raised, all eyes turned toward the center",
  },
  {
    v: [3, 27],
    why: "Prakriti does all; the ego thinks 'I am the doer'.",
    mine: "Krishna points to himself: there is nothing in the three worlds he needs to gain, yet he never stops acting, for if he paused, people would follow his example and the worlds would fall into ruin (3.22–24). The wise should act as eagerly as the ignorant, but without attachment, and should not unsettle the minds of those bound to action (3.25–26).",
    scene: "the whole field in motion, horses stamping and banners stirring, while the chariot at the center stays still",
  },
  {
    v: [3, 35],
    why: "Must-include: better one's own Dharma, though imperfect.",
    mine: "The knower of truth sees that it is the qualities of nature acting upon one another, and stays unattached (3.28–29). Surrender all actions to Me, Krishna says, and fight, free of longing and fever (3.30). Every being follows its own nature; attraction and aversion lie in wait in the senses (3.33–34).",
    scene: "Arjuna standing in the chariot with the Gandiva raised, Krishna a silhouette at the reins against the sun",
  },
  {
    v: [3, 37],
    why: "Desire and anger named as the enemy; the turn toward inner battle.",
    mine: "Arjuna asks what drives a person to sin even against his own will, as if pushed by force (3.36).",
    scene: "dust storms sweeping across the edge of the battlefield, the chariot steady in a pool of light",
  },

  // ---------------- Chapter 4 ----------------
  {
    v: [4, 7],
    why: "Must-include: whenever Dharma declines, I manifest myself.",
    mine: "Chapter Three ended with Krishna urging Arjuna to slay the enemy, desire, hard to overcome (3.38–43). Krishna now reveals that he taught this same Yoga long ago to Vivasvan, the sun, and it passed down the line of royal sages until it was lost (4.1–3). Arjuna wonders how this can be, since Krishna was born so recently; Krishna answers that though unborn, he takes birth through his own power (4.4–6).",
    scene: "the sun rising enormous behind the chariot, Krishna's silhouette outlined in gold",
  },
  {
    v: [4, 8],
    why: "Must-include: to protect the good and establish Dharma, age after age.",
    scene: "the radiance around Krishna widening across the armies, his form seen only from behind",
  },
  {
    v: [4, 18],
    why: "Must-include: seeing inaction in action and action in inaction.",
    mine: "One who truly knows Krishna's divine birth and action is not reborn, but comes to him (4.9–10). The four orders were created by him according to qualities and actions, yet he remains the non-doer (4.13). Even the wise are puzzled about what is action and what is inaction, so Krishna promises to explain (4.16–17).",
    scene: "midmorning stillness over the field, every warrior waiting, light glinting on spears and chariot wheels",
  },
  {
    v: [4, 24],
    why: "Brahmarpanam: the offering, the fire and the offerer are all Brahman.",
    mine: "The wise call that person learned whose undertakings are free of desire and whose actions are burnt in the fire of knowledge (4.19). Content, free from dependence, untouched by success or failure, such a one acts and is not bound (4.20–23).",
    scene: "late morning over the field, dust settling, Krishna seen from behind with the reins gathered in one hand",
  },
  {
    v: [4, 34],
    why: "Must-include: learn by humility, inquiry and service from those who have seen.",
    mine: "Krishna describes many kinds of sacrifice: offerings into fire, restraint of the senses, charity, austerity, study, and the regulation of breath (4.25–30). Of all of them, the sacrifice of knowledge is the highest, for all action culminates in knowledge (4.33).",
    scene: "Arjuna kneeling on the floor of the chariot, Krishna seen from behind, seated above him in gentle light",
  },
  {
    v: [4, 38],
    why: "Nothing purifies like knowledge; it comes in time to the one perfected in Yoga.",
    mine: "Knowing this, Krishna says, Arjuna will never again fall into delusion, and will see all beings in the Self and in him (4.35). Even the worst sinner crosses all evil on the raft of knowledge, as a fire turns fuel to ashes (4.36–37).",
    scene: "the white horses bathed in clear light, their manes lifted by a cool wind",
  },

  // ---------------- Chapter 5 ----------------
  {
    v: [5, 2],
    why: "Opens the chapter: both paths lead to the highest, but action is easier.",
    mine: "Chapter Four closed with the call to cut doubt with the sword of knowledge and rise to Yoga (4.41–42). Arjuna is again unsure: Krishna praises both renunciation of action and the Yoga of action, so which is better (5.1)?",
    scene: "a quiet hour on the field, the armies at rest, the chariot glowing softly at the center",
  },
  {
    v: [5, 10],
    why: "Must-include: like a lotus leaf untouched by water.",
    mine: "The true renunciate is one who neither hates nor desires; such a person is easily freed (5.3). Only the immature say that knowledge and action lead to different ends (5.4–5). The one who knows the truth thinks, \"I do nothing at all,\" even while seeing, hearing, eating and breathing (5.8–9).",
    scene: "morning haze over the plain, the Hanuman banner lifting gently above the chariot",
  },
  {
    v: [5, 18],
    why: "Equal vision: the sage sees the same in all beings.",
    mine: "Yogis act with body, mind and senses only to purify themselves, giving up attachment (5.11). The embodied one, having renounced all actions in the mind, rests at ease in the city of nine gates (5.13). Knowledge destroys the ignorance that veils it, revealing the Supreme like the sun (5.16–17).",
    scene: "sunlight falling evenly across both armies, every helmet and banner lit alike",
  },
  {
    v: [5, 29],
    why: "Closes the chapter: knowing the Lord as friend of all beings, one attains peace.",
    mine: "Those whose minds rest in sameness have conquered the world here itself (5.19). Their happiness is within, their delight within, their light within (5.24). The sage who shuts out external contacts, steadies the breath and masters mind and intellect is ever free (5.27–28).",
    scene: "late afternoon, warm gold light around Krishna seen from behind, the field hushed",
  },

  // ---------------- Chapter 6 ----------------
  {
    v: [6, 1],
    why: "Opens the chapter on meditation: the true Sannyasin acts without depending on fruits.",
    mine: "Chapter Five closed with the sage who knows Krishna as the friend of all beings and attains peace (5.29). Krishna now begins to describe the discipline of meditation.",
    scene: "before dawn, the battlefield silent under fading stars, a faint glow around the chariot",
  },
  {
    v: [6, 5],
    why: "Must-include: lift yourself by yourself; you are your own friend and enemy.",
    mine: "Renunciation and Yoga are one, Krishna says, for no one becomes a yogi without giving up the restless planning of the mind (6.2). For the one climbing, action is the means; for the one who has arrived, stillness is the means (6.3–4).",
    scene: "Arjuna rising to his feet in the chariot at first light, Krishna's hand resting on the reins",
  },
  {
    v: [6, 17],
    why: "Moderation in food, sleep and effort: practical ground of meditation.",
    mine: "Krishna describes the one who has conquered himself: equal toward friend and foe, gold and stone (6.7–9). He then teaches the practice: a clean, steady seat, the mind made single-pointed, the body, head and neck held erect, the gaze resting (6.10–14). Yoga is not for one who eats too much or too little, or sleeps too much or too little (6.16).",
    scene: "the quiet edge of the battlefield at sunrise, mountains blue in the distance, the chariot small against them",
  },
  {
    v: [6, 19],
    why: "Must-include: the lamp in a windless place.",
    mine: "When the disciplined mind rests in the Self alone, free from longing for any object, one is said to be established in Yoga (6.18).",
    scene: "night over Kurukshetra, the camps asleep, a soft steady glow around the chariot under the stars",
  },
  {
    v: [6, 29],
    why: "Seeing the Self in all beings and all beings in the Self.",
    mine: "In that state the mind, restrained by practice, sees the Self by the Self and is content (6.20). Gaining this, one counts no other gain greater, and is not shaken even by heavy sorrow (6.22). Slowly, step by step, with patient intellect, one should still the mind (6.25).",
    scene: "dawn light spreading across both armies at once, every part of the land touched by it",
  },
  {
    v: [6, 35],
    why: "Must-include: the mind is restless, but it is held by practice and dispassion.",
    mine: "Whoever sees Krishna everywhere and everything in him is never lost to him (6.30). Arjuna then confesses his difficulty: the mind is restless, turbulent and strong, as hard to hold as the wind (6.33–34).",
    scene: "afternoon light slanting across the armies, Arjuna leaning toward Krishna, who is seen from behind",
  },
  {
    v: [6, 47],
    why: "Closes the chapter: of all yogis, the one who worships with faith is dearest.",
    mine: "Arjuna asks what becomes of one who has faith but falls short of the goal (6.37–39). Krishna assures him that no one who does good comes to grief; such a seeker is reborn in a pure and prosperous home, or among wise yogis, and continues the journey (6.40–45). The yogi is greater than the ascetic, the scholar and the ritualist; therefore be a yogi, Arjuna (6.46).",
    scene: "golden hour, Krishna seen from behind with a peacock feather catching the light",
  },

  // ---------------- Chapter 7 ----------------
  {
    v: [7, 3],
    why: "Opens the chapter: among thousands, scarcely one strives; among them, scarcely one knows.",
    mine: "Chapter Six ended with Krishna's praise of the one who worships him with faith (6.47). Now he promises to give Arjuna both knowledge and its realization, knowing which nothing more remains to be known (7.1–2).",
    scene: "the vast armies seen from a low angle at morning, banners in long rows, the chariot glowing at the center",
  },
  {
    v: [7, 7],
    why: "Must-include: all this is strung on Me like pearls on a thread.",
    mine: "Earth, water, fire, air, space, mind, intellect and ego: this is Krishna's lower nature, eightfold (7.4). Beyond it is his higher nature, the life that sustains the world, and he is the origin and the dissolution of the whole universe (7.5–6).",
    scene: "the sun at its height over Kurukshetra, a soft radiance surrounding Krishna's figure from behind",
  },
  {
    v: [7, 14],
    why: "Maya is hard to cross; those who take refuge in Me cross it.",
    mine: "Krishna is the taste in water, the light of the sun and moon, the sacred syllable Om, the strength of the strong (7.8–11). The whole world, deluded by the three qualities of nature, does not know him who is beyond them (7.13).",
    scene: "heat haze shimmering over the plain, the chariot clear and bright within it",
  },
  {
    v: [7, 19],
    why: "After many births the wise one sees: Vasudeva is all.",
    mine: "The wicked and deluded do not seek Krishna (7.15). Four kinds of good people turn to him: those in distress, those who long to know, those who seek prosperity, and the wise, whom he holds as his very Self (7.16–18).",
    scene: "evening, the radiance behind Krishna now brighter than the setting sun",
  },

  // ---------------- Chapter 8 ----------------
  {
    v: [8, 5],
    why: "Opens the chapter's teaching: whoever departs remembering Me reaches Me.",
    mine: "Chapter Seven ended with the promise that those who know Krishna even at the time of death are steadfast in mind (7.30). Arjuna asks what Brahman is, what action is, and how Krishna is to be known at the time of departure (8.1–2), and Krishna begins to answer (8.3–4).",
    scene: "dusk on the field, smoke from the evening fires drifting low, the chariot lit from within",
  },
  {
    v: [8, 7],
    why: "Must-include: remember Me at all times, and fight.",
    mine: "Whatever state of being a person dwells on when leaving the body, that alone does one reach, having long been absorbed in it (8.6).",
    scene: "the Gandiva in Arjuna's hand, Krishna's hand on the reins, both outlined in steady light",
  },
  {
    v: [8, 14],
    why: "The Lord is easily reached by the ever-steadfast yogi.",
    mine: "With a mind disciplined by practice, meditating on the Supreme Person, one goes to him (8.8). Krishna describes the departure of the yogi who at the end gathers the breath between the brows and utters Om, the one syllable, remembering him (8.10–13).",
    scene: "a moonlit night over Kurukshetra, the chariot glowing silver-gold in the stillness",
  },

  // ---------------- Chapter 9 ----------------
  {
    v: [9, 4],
    why: "Opens the royal secret: all this is pervaded by Me in my unmanifest form.",
    mine: "Chapter Eight ended with the yogi who goes beyond all merit to the supreme, primal abode (8.28). Krishna now offers the royal knowledge, the royal secret, the purifier, directly realized (9.1–3).",
    scene: "aerial view of the entire battlefield at dawn, a faint radiance spreading outward from the chariot over everything",
  },
  {
    v: [9, 22],
    why: "Must-include: to those who worship Me alone, I bring what they lack and keep what they have.",
    mine: "Yet beings do not dwell in him, Krishna adds; behold his divine mystery (9.5). At the end of each cycle all beings return to his nature, and at the beginning he sends them forth again, remaining unattached (9.7–10). Those who perform rituals for heaven enjoy it and return when their merit is spent (9.20–21).",
    scene: "golden light pouring over the Pandava camp, Krishna seen from behind standing tall in the chariot",
  },
  {
    v: [9, 26],
    why: "Must-include: a leaf, a flower, a fruit, water, offered with love.",
    mine: "Even those who worship other gods with faith worship Krishna alone, though not in the right way (9.23). Worshippers of the gods go to the gods, worshippers of the ancestors to the ancestors, and his devotees come to him (9.25).",
    scene: "Arjuna seated in the chariot in tender morning light, Krishna's silhouette beside him",
  },
  {
    v: [9, 27],
    why: "Whatever you do, eat, give or offer, do it as an offering to Me.",
    mine: "Krishna has said that he accepts the humblest gift, if it is offered with devotion (9.26). Now he widens the offering to the whole of life.",
    scene: "the full camp at work at sunrise, horses watered and fires lit, all lit by the same soft radiance",
  },
  {
    v: [9, 29],
    why: "I am the same to all; those who worship Me with devotion are in Me and I in them.",
    mine: "Offering everything thus, one is freed from the bonds of action and its fruits, and, liberated, comes to him (9.28).",
    scene: "light from the chariot touching both armies equally, no line falling in shadow",
  },
  {
    v: [9, 34],
    why: "Must-include: fix your mind on Me, be devoted to Me; you shall come to Me.",
    mine: "Even a person of very wicked conduct who worships Krishna with undivided devotion is to be regarded as righteous, for he has resolved rightly (9.30). Such a one soon becomes righteous and attains lasting peace; Krishna's devotee never perishes (9.31).",
    scene: "Arjuna with joined palms in the chariot, Krishna before him seen from behind in deep golden radiance",
  },

  // ---------------- Chapter 10 ----------------
  {
    v: [10, 8],
    why: "I am the source of all; the wise worship Me with understanding.",
    mine: "Chapter Nine ended with the call to fix the mind on Krishna and make him the goal (9.34). Out of love for Arjuna, Krishna speaks again: neither gods nor sages know his origin, for he is the source of them all (10.1–3). All the varied states of beings arise from him alone (10.4–7).",
    scene: "the Himalayas visible far beyond Kurukshetra at dawn, the chariot shining on the plain below",
  },
  {
    v: [10, 20],
    why: "Must-include: I am the Self seated in the heart of all beings.",
    mine: "Those whose minds dwell on Krishna enlighten one another and are content (10.9). To them he gives the yoga of understanding, and from within lights the lamp of knowledge (10.10–11). Arjuna, moved, asks Krishna to describe his divine glories in full (10.12–18).",
    scene: "a great radiance rising from within the chariot, filling the morning sky above the armies",
  },
  {
    v: [10, 41],
    why: "Whatever is glorious or mighty springs from a spark of My splendour.",
    mine: "Krishna names his glories one by one: among the Adityas he is Vishnu, among lights the radiant sun, among mountains Meru, among rivers the Ganga, among letters the letter A (10.21–33). There is no end to his divine glories, he says; what he has told is only a glimpse (10.40).",
    scene: "the whole battlefield glittering in sunlight, every weapon and banner shining, the brightest light at the center",
  },

  // ---------------- Chapter 11 ----------------
  {
    v: [11, 4],
    why: "Opens the chapter: Arjuna asks to see the Lord's universal form.",
    mine: "Chapter Ten closed with Krishna saying that he supports the whole universe with a single fragment of himself (10.42). Arjuna, his delusion gone, now longs to see that form of the Lord with his own eyes (11.1–3).",
    scene: "the sky above Kurukshetra beginning to blaze, Arjuna looking up, Krishna seen from behind becoming pure light",
  },
  {
    v: [11, 12],
    why: "The light of a thousand suns: the moment of the vision.",
    mine: "Behold my forms, Krishna says, by hundreds and thousands, many-coloured and divine (11.5–7). Since human eyes cannot see it, he grants Arjuna divine sight (11.8). Sanjaya tells the king that Krishna then revealed his supreme form, boundless and wondrous, adorned with divine garlands and garments (11.9–11).",
    scene: "a radiance brighter than a thousand suns filling the whole sky over the battlefield, the armies tiny beneath it",
  },
  {
    v: [11, 32],
    why: "Must-include: I am Time, the destroyer of worlds.",
    mine: "Arjuna, his hair standing on end, bows and praises the form without beginning, middle or end (11.14–20). He sees the warriors of both armies rushing into the flaming mouths of that form, like rivers into the sea (11.26–30). Terrified, he asks who this is, in so fearful a form (11.31).",
    scene: "cosmic fire and light towering over the field, the armies in shadow, the chariot small and still at the center",
  },
  {
    v: [11, 33, 34],
    why: "Be merely the instrument: one thought across two verses, commented on together.",
    scene: "the blaze settling into a vast golden dawn, Arjuna rising with the Gandiva in hand",
  },
  {
    v: [11, 54],
    why: "By devotion alone can I be known and seen as I am.",
    mine: "Trembling, Arjuna praises Krishna and begs forgiveness for every time he treated him casually as a friend (11.35–44). He asks to see again the gentle, familiar form, and Krishna resumes it and comforts him (11.45–51). Krishna says this form is hard to see; neither study nor austerity nor gifts can reveal it (11.52–53).",
    scene: "the sky softening to a gentle gold, Krishna once more a familiar figure from behind at the reins",
  },
  {
    v: [11, 55],
    why: "Must-include: work for Me, free from enmity toward all beings; such a one comes to Me.",
    scene: "evening calm after the vision, the chariot glowing softly, a peacock feather lit by the last light",
  },

  // ---------------- Chapter 12 ----------------
  {
    v: [12, 2],
    why: "Opens the chapter: those who fix their minds on Me with faith are the best in Yoga.",
    mine: "Chapter Eleven ended with Krishna's description of the devotee who works for him and is free of enmity toward all (11.55). Arjuna asks which devotees are better: those who worship the Lord with form, or those who worship the imperishable, unmanifest (12.1)?",
    scene: "dawn over the field, Arjuna seated close to Krishna, who is seen from behind in tender light",
  },
  {
    v: [12, 8],
    why: "Fix your mind on Me alone; you shall live in Me.",
    mine: "Those who worship the unmanifest also reach him, but the path is harder for embodied beings (12.3–5). Those who surrender all actions to him and meditate on him with single devotion, he swiftly lifts from the ocean of death and change (12.6–7).",
    scene: "the morning sun climbing over the chariot, its light resting on Arjuna's bowed head",
  },
  {
    v: [12, 12],
    why: "The ladder of practice: knowledge, meditation, and above them, giving up the fruits.",
    mine: "If the mind cannot be fixed on him, Krishna says, seek him through practice; if not practice, work for his sake; if not even that, give up the fruits of all action (12.9–11).",
    scene: "the chariot's wheels resting in soft earth, light gathered around the axle",
  },
  {
    v: [12, 13, 14],
    why: "Must-include: the beloved devotee, without hatred, friendly and compassionate (one sentence).",
    scene: "a gentle radiance spreading from the chariot over warriors of both sides alike",
  },
  {
    v: [12, 20],
    why: "Closes the chapter: those who follow this immortal Dharma with faith are exceedingly dear.",
    mine: "Krishna continues his portrait of the beloved devotee: one who does not disturb the world and is not disturbed by it (12.15), who expects nothing (12.16), who neither rejoices nor hates (12.17), equal in honour and dishonour and content with anything (12.18–19).",
    scene: "twilight, the conches resting in the chariot, Krishna's silhouette against a rose and gold sky",
  },

  // ---------------- Chapter 13 ----------------
  {
    v: [13, 2],
    why: "Opens the chapter: the body is the field; the one who knows it is the knower.",
    mine: "Chapter Twelve ended with Krishna's love for those who hold to this immortal teaching with faith (12.20). Arjuna asks about Prakriti and Purusha, about Kshetra and Kshetrajna, and about knowledge and its object (13.1).",
    scene: "the wide plain of Kurukshetra itself at first light, the field stretching to the horizon around the chariot",
  },
  {
    v: [13, 8],
    why: "The values of knowledge begin: humility, unpretentiousness, non-injury.",
    mine: "Krishna declares that he is the Kshetrajna dwelling in every body (13.3). He lists the elements of the field: the elements, ego, intellect, the unmanifest, the senses, desire and aversion, pleasure and pain (13.6–7).",
    scene: "Arjuna listening in stillness, his bow laid down, the morning light clear and cool",
  },
  {
    v: [13, 13],
    why: "That which is to be known: the beginningless Supreme Brahman.",
    mine: "Krishna continues the list of qualities that make up knowledge: dispassion, absence of ego, steady even-mindedness, unswerving devotion, and constant inquiry into truth (13.9–12). All the rest is ignorance.",
    scene: "the sky over Kurukshetra deep and clear, the chariot luminous beneath it",
  },
  {
    v: [13, 23],
    why: "The Supreme Self in the body is the witness, the permitter, the supporter.",
    mine: "That Supreme is outside and inside all beings, moving and unmoving, far and near, undivided yet seeming divided (13.14–17). Krishna explains that Prakriti and Purusha are both beginningless, and that the Purusha seated in Prakriti experiences its qualities (13.20–22).",
    scene: "the chariot seen from far above, its light the still center of the moving armies",
  },
  {
    v: [13, 28],
    why: "Must-include (13.27 in other editions): he sees who sees the Lord equally in all.",
    mine: "Some see the Self through meditation, some through knowledge, some through action, and others, hearing of it from others, worship and cross beyond death (13.24–26). Whatever is born arises from the union of the field and its knower (13.27).",
    scene: "golden light falling evenly on every warrior, horse and banner across the whole field",
  },

  // ---------------- Chapter 14 ----------------
  {
    v: [14, 5],
    why: "The three Gunas, born of Prakriti, bind the embodied.",
    mine: "Chapter Thirteen closed with the vision of the difference between the field and its knower (13.35). Krishna offers again the highest knowledge, by which sages have reached perfection, and calls great Prakriti his womb, into which he places the seed (14.1–4).",
    scene: "dawn over the waiting armies, clouds lit gold and rose, the chariot shining below",
  },
  {
    v: [14, 19],
    why: "The seer sees no agent other than the Gunas, and knows what is beyond them.",
    mine: "Sattva binds through attachment to happiness and knowledge, rajas through attachment to action, and tamas through heedlessness and sleep (14.6–9). Each quality rises by overpowering the others, and each leads to its own end (14.10–18).",
    scene: "midday over the field, the colours of the sky shifting while the chariot's light stays constant",
  },
  {
    v: [14, 26],
    why: "Must-include: one who serves Me with unswerving devotion goes beyond the Gunas.",
    mine: "Rising above the three qualities, the soul is released from birth, decay and death (14.20). Arjuna asks the marks of one who has gone beyond them, and Krishna describes one who sits as if unconcerned, steady in pleasure and pain, equal toward friend and foe (14.21–25).",
    scene: "Krishna seen from behind, radiant, Arjuna kneeling at his side in the chariot",
  },
  {
    v: [14, 27],
    why: "Closes the chapter: I am the abode of Brahman, of immortality and bliss.",
    scene: "dusk deepening to gold, the chariot shining like a lamp on the darkening plain",
  },

  // ---------------- Chapter 15 ----------------
  {
    v: [15, 1],
    why: "Must-include: the eternal Ashvattha tree with roots above.",
    mine: "Chapter Fourteen ended with Krishna as the abode of Brahman, the eternal, and absolute bliss (14.27). He now begins a new teaching.",
    scene: "the wide open plain of Kurukshetra at dawn, the chariot standing alone in the light",
  },
  {
    v: [15, 7],
    why: "Must-include: an eternal portion of Myself becomes the living being.",
    mine: "With the sharp weapon of detachment, Krishna says, one must fell it, and then seek the goal from which no one returns (15.3–4). Neither sun nor moon nor fire illumines it; that is his supreme abode (15.6).",
    scene: "morning light streaming through the dust, a warm glow at the heart of the chariot",
  },
  {
    v: [15, 15],
    why: "Must-include: I am seated in the hearts of all; from Me come memory and knowledge.",
    mine: "When the Lord takes up a body and leaves it, he carries the mind and senses as the wind carries scents (15.8). The deluded do not see him, but the yogis see him dwelling within (15.10–11). He is the light of the sun, the nourishing moon, and the fire of life within living bodies (15.12–14).",
    scene: "Krishna seen from behind, the sun directly beyond him so that he seems made of light",
  },
  {
    v: [15, 19],
    why: "Closes the teaching: the one who knows Me as the Supreme Person worships Me with all.",
    mine: "Krishna speaks of two kinds of being, the changing and the changeless, and of the Supreme Person beyond both, who upholds the three worlds (15.16–18).",
    scene: "the high noon sky blazing over the field, the chariot at the center of the light",
  },

  // ---------------- Chapter 16 ----------------
  {
    v: [16, 1, 3],
    why: "The divine qualities, beginning with fearlessness (one list across three verses).",
    mine: "Chapter Fifteen ended with Krishna calling this the most secret teaching, knowing which one becomes wise (15.20). He now sets out two kinds of nature: the divine and the demonic.",
    scene: "dawn across both armies, banners still, the chariot at the center lit from within",
  },
  {
    v: [16, 21],
    why: "Must-include: desire, anger and greed, the triple gate to hell.",
    mine: "Hypocrisy, arrogance, anger and harshness belong to the demonic nature; the divine leads to freedom, the demonic to bondage (16.4–5). Krishna describes those who say the world has no truth and no God, consumed by endless desire, who fall again and again into lower births (16.8–20).",
    scene: "heavy afternoon clouds over the far side of the field, steady light on the chariot",
  },
  {
    v: [16, 24],
    why: "Closes the chapter: let the scriptures be your authority.",
    mine: "Released from these three gates, one does what is good and reaches the highest (16.22). Whoever ignores the scriptures and acts on impulse reaches neither perfection nor happiness (16.23).",
    scene: "morning light on the Gandiva resting in the chariot, Krishna's hand steady on the reins",
  },

  // ---------------- Chapter 17 ----------------
  {
    v: [17, 3],
    why: "Must-include: a person is made of faith; as the faith, so the person.",
    mine: "Chapter Sixteen ended with the scriptures as the guide to what should be done (16.24). Arjuna asks about those who set aside the scriptures but worship with faith: is their faith of sattva, rajas or tamas (17.1)? Krishna answers that faith is of three kinds, according to one's nature (17.2).",
    scene: "evening over the camps, lamps being lit along the lines, the chariot glowing softly",
  },
  {
    v: [17, 15],
    why: "Austerity of speech: truthful, pleasant, beneficial.",
    mine: "Food, sacrifice, austerity and charity each take three forms according to the qualities (17.7–13). Austerity of the body is reverence, purity, straightforwardness, celibacy and non-violence (17.14).",
    scene: "a quiet dawn, Arjuna listening in silence, Krishna seen from behind in calm light",
  },
  {
    v: [17, 23],
    why: "Om Tat Sat: the threefold designation of Brahman.",
    mine: "Serenity of mind, gentleness, silence and self-control are the austerity of the mind (17.16). Charity given to a worthy person at the right time and place, without expecting return, is sattvic (17.20).",
    scene: "sunrise over the field in still air, the conches resting in the chariot",
  },

  // ---------------- Chapter 18 ----------------
  {
    v: [18, 2],
    why: "Opens the final chapter: Sannyasa and Tyaga defined.",
    mine: "Chapter Seventeen closed with Om Tat Sat and the reminder that whatever is done without faith is unreal (17.28). Arjuna asks to know the true nature of renunciation and of relinquishment (18.1).",
    scene: "the last morning before the battle, the armies drawn up, the chariot shining at the center",
  },
  {
    v: [18, 14],
    why: "The five factors in every action.",
    mine: "Sacrifice, giving and austerity are not to be abandoned, but done without attachment and without wanting their results (18.5–6). Relinquishment of the fruit is true relinquishment (18.9–11). Krishna then names the five causes behind the accomplishment of every action (18.13).",
    scene: "close on the chariot: wheel, axle, horses and reins, all in steady golden light",
  },
  {
    v: [18, 45],
    why: "Devoted to one's own duty, one attains perfection.",
    mine: "Knowledge, action and the doer are each of three kinds, and so are intellect, steadiness and happiness (18.19–39). The duties of brahmins, kshatriyas, vaishyas and shudras arise from the qualities born of their own nature (18.41–44).",
    scene: "warriors of every rank at their posts at sunrise, each lit by the same light",
  },
  {
    v: [18, 46],
    why: "Must-include: worshipping Him through one's own work, a person attains perfection.",
    scene: "Arjuna checking the string of the Gandiva, Krishna's hand steady on the reins",
  },
  {
    v: [18, 47],
    why: "Must-include: better one's own Dharma, though imperfect.",
    scene: "the white horses pawing the earth, ready, the banner of Hanuman lifted in the breeze",
  },
  {
    v: [18, 54],
    why: "Become Brahman, serene; attain supreme devotion to Me.",
    mine: "One should not abandon one's natural duty even if it seems flawed, for every undertaking is clouded by some fault, as fire by smoke (18.48). Krishna describes the one with purified intellect who, firm and dispassionate, devoted to meditation, free of ego and possessiveness, becomes fit to be one with Brahman (18.51–53).",
    scene: "a serene golden radiance over the whole field, the armies hushed",
  },
  {
    v: [18, 61],
    why: "Must-include: the Lord dwells in the hearts of all beings.",
    mine: "By devotion one knows Krishna as he truly is and enters into him (18.55). Taking refuge in him while doing all actions, one reaches the eternal abode by his grace (18.56–57). If, out of egoism, Arjuna refuses to fight, his own nature will compel him (18.59–60).",
    scene: "Krishna seen from behind at the reins, the radiance around him reaching to the horizon",
  },
  {
    v: [18, 63],
    why: "Reflect on it fully, then do as you wish: the teacher's freedom given.",
    mine: "Take refuge in him with your whole being, Krishna says; by his grace you will gain supreme peace and the eternal abode (18.62).",
    scene: "Arjuna standing alone in thought in the chariot, a soft light at his side",
  },
  {
    v: [18, 65],
    why: "Must-include: fix your mind on Me; you shall come to Me, I promise you.",
    mine: "Krishna says once more the most secret word of all, because Arjuna is dearly loved (18.64).",
    scene: "dawn breaking full and golden, Arjuna with joined palms, Krishna's silhouette within the light",
  },
  {
    v: [18, 66],
    why: "Must-include: abandoning all Dharmas, take refuge in Me alone.",
    scene: "the chariot at the center of an immense radiance, a peacock feather bright against the sky",
  },
  {
    v: [18, 73],
    why: "Must-include: 'My delusion is destroyed; I will do Your word.'",
    mine: "This teaching is not for those without austerity or devotion, or for those who scoff; but whoever shares it with devotees reaches Krishna (18.67–69). Krishna asks: have you heard this with a single-pointed mind? Has your delusion born of ignorance been destroyed (18.72)?",
    scene: "Arjuna standing tall with the Gandiva raised, Krishna seen from behind at the reins, the conches lifted",
  },
  {
    v: [18, 78],
    why: "Must-include: wherever Krishna and Arjuna are, there are fortune, victory and justice.",
    mine: "Sanjaya tells the king that he has heard this wondrous dialogue by the grace of Vyasa (18.74–75). Remembering it again and again, and that wondrous form of Hari, he rejoices again and again (18.76–77).",
    scene: "the full sunrise of victory over Kurukshetra, the chariot of Krishna and Arjuna radiant at the center of the world",
  },
];
