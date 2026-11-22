// Dev only: turn scripts/plan.mjs into gita/content/days.json using the parsed book.
// The output holds POINTERS ONLY (chapter, verse, paragraph indices) plus anchors of at
// most 6 words, never book text. Run: node scripts/build-content.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBook } from "./book-node.mjs";
import { days as plan } from "./plan.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content/days.json");
const ANCHOR_WORDS = 6; // the copyright rule allows up to 8
const WORDS_MAX = 450; // about 2-3 minutes of reading
const INTRO_MAX = 220;
const MIN_PARAGRAPH_WORDS = 3; // skip stray marks such as footnote numbers

const book = await loadBook();
const words = (t) => t.split(/\s+/).filter(Boolean);
const anchor = (t) => words(t).slice(0, ANCHOR_WORDS).join(" ");
const entry = (c, n) => book.chapters[c].verses[book.chapters[c].verseIndex[n]];
const keyOf = (c, n) => book.chapters[c].verseIndex[n];

function pointer(c, v, p) {
  const paras = book.chapters[c].verses[v].commentary;
  p.forEach((i) => {
    if (!paras[i]) throw new Error(`No paragraph ${c}.${v} c[${i}]`);
  });
  return { part: "commentary", c, v, p, a: anchor(paras[p[0]]) };
}

function autoPick(c, keys, skip = new Set()) {
  // Whole paragraphs, in book order, up to about 450 words (at least one).
  const picks = [];
  let total = 0;
  for (const v of keys) {
    const p = [];
    book.chapters[c].verses[v].commentary.forEach((text, i) => {
      const n = words(text).length;
      if (skip.has(`${v}:${i}`) || n < MIN_PARAGRAPH_WORDS) return;
      if (total + n <= WORDS_MAX || total === 0) {
        p.push(i);
        total += n;
      }
    });
    if (p.length) picks.push(pointer(c, v, p));
    if (total >= WORDS_MAX * 0.6) break;
  }
  return picks;
}

const out = { version: 1, generatedFrom: "Holy Geeta (owner's PDF, parsed on device)", chapters: {}, days: [] };
const seenChapters = new Set();

plan.forEach((d, i) => {
  const [c, a, b = a] = d.v;
  const keys = [...new Set(Array.from({ length: b - a + 1 }, (_, k) => keyOf(c, a + k)))];
  const day = {
    day: i + 1,
    chapter: c,
    verses: Array.from({ length: b - a + 1 }, (_, k) => a + k),
    ref: a === b ? `${c}.${a}` : `${c}.${a}–${b}`,
    why: d.why,
    scene: d.scene,
    thread: [],
    words: [],
  };

  // Chapter intro on the first day of each chapter.
  const skip = new Set();
  if (!seenChapters.has(c)) {
    seenChapters.add(c);
    out.chapters[c] = { firstDay: day.day };
    if (d.intro?.generalIntro) {
      const p = d.intro.generalIntro;
      day.intro = { part: "generalIntro", p, a: anchor(book.generalIntro[p[0]]) };
    } else {
      // His chapter-opening commentary: the start of the first commentary in the chapter
      // (verse 1, or verse 2 when the book comments on 1-2 together).
      const introKey = Object.keys(book.chapters[c].verses)
        .map(Number)
        .sort((x, y) => x - y)
        .find((k) => book.chapters[c].verses[k].commentary.some((t) => words(t).length >= MIN_PARAGRAPH_WORDS));
      const first = book.chapters[c].verses[introKey];
      const p = [];
      let total = 0;
      // When the intro comes from the day's own verse, take one paragraph and leave the
      // rest for "In his words".
      const ownVerse = keys.includes(introKey);
      for (const [k, text] of first.commentary.entries()) {
        const n = words(text).length;
        if (n < MIN_PARAGRAPH_WORDS) continue;
        if (p.length && (ownVerse || total + n > INTRO_MAX)) break;
        p.push(k);
        total += n;
      }
      day.intro = pointer(c, introKey, p);
      if (keys.includes(introKey)) p.forEach((k) => skip.add(`${introKey}:${k}`));
    }
  }

  // The thread: my bridge, any extra "his" passages, then his linking line into this verse.
  if (d.mine) day.thread.push({ by: "mine", text: d.mine });
  for (const h of d.his || []) day.thread.push({ by: "his", ...pointer(h.c, keyOf(h.c, h.v), h.p) });
  const prevKey = a > 1 ? keyOf(c, a - 1) : null;
  if (prevKey && prevKey !== keys[0] && book.chapters[c].verses[prevKey].linkLine) {
    day.thread.push({ by: "his", part: "link", c, v: prevKey, a: anchor(book.chapters[c].verses[prevKey].linkLine) });
  }

  // His words for the day.
  day.words = d.words
    ? d.words.map((w) =>
        w.closing
          ? { part: "closing", c: w.c, p: w.closing, a: anchor(book.chapters[w.c].closing[w.closing[0]]) }
          : pointer(w.c, keyOf(w.c, w.v), w.p),
      )
    : autoPick(c, keys, skip);
  // The full commentary for the expander: every commentary paragraph of the day's verses.
  day.full = keys.map((v) => ({ c, v }));
  if (d.close) day.close = { part: d.close.part, c: d.close.c, v: keyOf(d.close.c, d.close.v) };
  out.days.push(day);
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${out.days.length} days to ${path.relative(ROOT, OUT)}`);
