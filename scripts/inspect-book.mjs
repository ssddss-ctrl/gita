// Dev only. Usage:
//   node scripts/inspect-book.mjs                 overview of chapters and verses
//   node scripts/inspect-book.mjs 2 47            paragraph indices of verse 2.47
//   node scripts/inspect-book.mjs intro 3         chapter 3 intro paragraphs ("intro 0" = General Introduction)
//   node scripts/inspect-book.mjs closing 1       chapter 1 closing paragraphs
//   node scripts/inspect-book.mjs find 2 farmer   paragraphs in chapter 2 containing a word
// Prints only indices, word counts and the first ~10 words. Output stays in the terminal.
import { loadBook } from "./book-node.mjs";
const words = (t) => t.split(/\s+/).filter(Boolean);
const head = (t, n = 10) => words(t).slice(0, n).join(" ");
const book = await loadBook();
const [a, b, ...rest] = process.argv.slice(2);
const list = (paras, label) => paras.forEach((p, i) => console.log(`${label}[${i}] ${words(p).length}w  ${head(p)}`));
if (!a) {
  console.log("General introduction paragraphs:", book.generalIntro.length);
  for (const [n, ch] of Object.entries(book.chapters)) {
    const keys = Object.keys(ch.verses).map(Number);
    const covered = Object.keys(ch.verseIndex).map(Number);
    const max = Math.max(...covered);
    const missing = [];
    for (let v = 1; v <= max; v++) if (!ch.verseIndex[v]) missing.push(v);
    const groups = keys.filter((k) => ch.verses[k].range[1] > k).map((k) => ch.verses[k].range.join("-"));
    const links = keys.filter((k) => ch.verses[k].linkLine).length;
    console.log(`Ch ${n}: ${keys.length} entries, verses 1-${max}, missing [${missing}], groups [${groups}], intro ${ch.intro.length}p, closing ${ch.closing.length}p, link lines ${links}, title "${head(ch.sanskritTitle, 5)}" / "${head(ch.englishTitle, 6)}"`);
  }
} else if (a === "intro" || a === "closing") {
  const paras = a === "intro" ? (Number(b) === 0 ? book.generalIntro : book.chapters[b].intro) : book.chapters[b].closing;
  list(paras, a);
} else if (a === "find") {
  const term = rest.join(" ").toLowerCase();
  const ch = book.chapters[b];
  const scan = (paras, label) => paras.forEach((p, i) => p.toLowerCase().includes(term) && console.log(`${label}[${i}] ${words(p).length}w  ${head(p)}`));
  if (Number(b) === 0) scan(book.generalIntro, "intro0");
  else {
    scan(ch.intro, `ch${b}.intro`);
    for (const [k, v] of Object.entries(ch.verses)) { scan(v.commentary, `${b}.${k}.c`); if (v.linkLine.toLowerCase().includes(term)) console.log(`${b}.${k}.link`); }
    scan(ch.closing, `ch${b}.closing`);
  }
} else {
  const v = book.chapters[a].verses[book.chapters[a].verseIndex[b]];
  console.log(`${a}.${v.range.join("-")} speaker="${v.speaker}" translation ${words(v.translation).length}w: ${head(v.translation, 8)}`);
  list(v.commentary, "c");
  console.log(`link: ${v.linkLine ? words(v.linkLine).length + "w " + head(v.linkLine, 8) : "(none)"}`);
}
