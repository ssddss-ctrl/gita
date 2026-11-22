// Automated quality checks for the Gita content (instead of a manual review).
//   node scripts/validate-content.mjs              full check (needs the PDF)
//   node scripts/validate-content.mjs --structure  checks that need no book (CI)
// Exit code 1 if anything fails. Prints a one-page summary at the end.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "content/days.json"), "utf8"));
const sanskrit = JSON.parse(fs.readFileSync(path.join(ROOT, "content/sanskrit.json"), "utf8")).verses;
const structureOnly = process.argv.includes("--structure");
const problems = [];
const fail = (msg) => problems.push(msg);
const days = content.days;
const dailyLife = JSON.parse(fs.readFileSync(path.join(ROOT, "content/daily-life.json"), "utf8")).days;

// ---------- Structure (no book needed) ----------
// "In daily life" notes: one per day, short, and (checked with the book below) never the book's words.
for (const d of days) {
  const note = dailyLife[d.day];
  if (!note) fail(`Day ${d.day} has no daily-life note`);
  else {
    const words = note.split(/\s+/).length;
    if (words < 15 || words > 60) fail(`Day ${d.day}: daily-life note is ${words} words (want 15-60)`);
  }
}
for (const k of Object.keys(dailyLife)) if (!days.some((d) => String(d.day) === k)) fail(`Daily-life note for unknown day ${k}`);
const MUST = ["2.47", "3.19", "3.21", "3.35", "4.7", "4.8", "4.18", "4.34", "5.10", "6.5", "6.19", "6.35", "7.7", "8.7", "9.22", "9.26", "9.34", "10.20", "11.32", "11.55", "12.13", "13.27|13.28", "14.26", "15.1", "15.7", "15.15", "16.21", "17.3", "18.46", "18.47", "18.61", "18.65", "18.66", "18.73", "18.78"];
const covered = new Set(days.flatMap((d) => d.verses.map((v) => `${d.chapter}.${v}`)));
for (const m of MUST) if (!m.split("|").some((r) => covered.has(r))) fail(`Must-include verse missing: ${m}`);
if (days.length < 95 || days.length > 105) fail(`Total days ${days.length} is not about 100`);
days.forEach((d, i) => {
  const prev = days[i - 1];
  if (prev && (d.chapter < prev.chapter || (d.chapter === prev.chapter && d.verses[0] <= prev.verses.at(-1))))
    fail(`Day ${d.day} (${d.ref}) is out of book order`);
  if (!d.thread.length) fail(`Day ${d.day} has no thread`);
  for (const t of d.thread.filter((t) => t.by === "mine")) {
    const sentences = (t.text.match(/[.!?](?=\s|$)/g) || []).length;
    if (sentences < 1 || sentences > 4) fail(`Day ${d.day}: "mine" bridge has ${sentences} sentences (want 1-4)`);
  }
  if (!d.words.length) fail(`Day ${d.day} has no commentary selected`);
  for (const v of [...d.verses.map((n) => `${d.chapter}.${n}`), ...(d.close ? [`${d.close.c}.${d.close.v}`] : [])]) {
    const s = sanskrit[v];
    if (!s) fail(`Day ${d.day}: no Sanskrit for ${v}`);
    else if (s.devanagari.length < 2 || s.devanagari.length > 6 || s.iast.length !== s.devanagari.length)
      fail(`Day ${d.day}: implausible Sanskrit line count for ${v} (${s.devanagari.length})`);
  }
  // Scenes: setting only, Krishna never face-on, no illustration of the verse's metaphor.
  const scene = d.scene.toLowerCase();
  if (/\b(face|faces|facing|portrait|frontal|smil\w*|gaze of krishna|krishna's eyes)\b/.test(scene))
    fail(`Day ${d.day}: scene uses a forbidden word: "${d.scene}"`);
  if (/krishna/.test(scene) && !/(behind|silhouette|hand|light|radian|glow|feather|outlined|shining|figure)/.test(scene))
    fail(`Day ${d.day}: scene mentions Krishna without a permitted depiction`);
  const METAPHORS = {
    "2.22": /cloth|garment/, "2.58": /tortoise/, "2.70": /ocean|sea|river/, "5.10": /lotus/,
    "6.19": /lamp|windless/, "6.35": /wind/, "7.7": /pearl|thread/, "9.26": /leaf|leaves|flower|fruit/,
    "14.5": /three|seed|womb/, "15.1": /tree|banyan|root/, "16.21": /gate/,
  };
  const metaphor = METAPHORS[`${d.chapter}.${d.verses[0]}`];
  if (metaphor && metaphor.test(scene)) fail(`Day ${d.day}: scene illustrates the verse's metaphor`);
});

// ---------- Book-based checks ----------
if (!structureOnly) {
  const { loadBook } = await import("./book-node.mjs");
  const book = await loadBook();
  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const grams = (n) => {
    const set = new Set();
    const add = (t) => {
      const w = norm(t);
      for (let i = 0; i + n <= w.length; i++) set.add(w.slice(i, i + n).join(" "));
    };
    book.generalIntro.forEach(add);
    for (const ch of Object.values(book.chapters)) {
      [ch.sanskritTitle, ch.englishTitle, ...ch.intro, ...ch.closing].forEach(add);
      for (const v of Object.values(ch.verses)) [v.translation, v.linkLine, ...v.commentary].forEach(add);
    }
    return set;
  };
  const eight = grams(8);
  const twelve = grams(12);
  const runs = (text, set, n) => {
    const w = norm(text);
    const hits = [];
    for (let i = 0; i + n <= w.length; i++) if (set.has(w.slice(i, i + n).join(" "))) hits.push(w.slice(i, i + n).join(" "));
    return hits;
  };
  const words = (t) => t.split(/\s+/).filter(Boolean);
  const anchorOf = (t) => words(t).slice(0, 6).join(" ");
  const resolve = (ptr) => {
    if (ptr.part === "generalIntro") return ptr.p.map((i) => book.generalIntro[i]);
    const ch = book.chapters[ptr.c];
    if (ptr.part === "closing") return ptr.p.map((i) => ch?.closing[i]);
    const v = ch?.verses[ptr.v];
    if (ptr.part === "link") return [v?.linkLine || undefined];
    if (ptr.part === "translation") return [v?.translation];
    return ptr.p.map((i) => v?.commentary[i]);
  };
  for (const d of days) {
    const check = (ptr, label) => {
      const texts = resolve(ptr);
      if (texts.some((t) => !t)) return fail(`Day ${d.day}: ${label} pointer does not resolve`);
      if (ptr.a && anchorOf(texts[0]) !== ptr.a) fail(`Day ${d.day}: ${label} anchor does not match the book`);
      return texts;
    };
    const selected = d.words.flatMap((w) => check(w, "commentary") || []);
    const total = selected.reduce((n, t) => n + words(t).length, 0);
    const single = d.words.length === 1 && d.words[0].p.length === 1;
    if (total === 0) fail(`Day ${d.day}: selected commentary is empty`);
    if (total > 470 && !single) fail(`Day ${d.day}: selected commentary is ${total} words (over ~450)`);
    d._words = total;
    if (d.intro) check(d.intro, "intro");
    if (d.close) check(d.close, "close");
    for (const t of d.thread) {
      if (t.by === "his") check(t, "thread");
      else {
        const hits = runs(t.text, eight, 8);
        if (hits.length) fail(`Day ${d.day}: "mine" bridge matches the book for 8+ words: "${hits[0]}"`);
      }
    }
    if (dailyLife[d.day]) {
      const hits = runs(dailyLife[d.day], eight, 8);
      if (hits.length) fail(`Day ${d.day}: daily-life note matches the book for 8+ words: "${hits[0]}"`);
    }
  }
  // No committed file may contain a 12-word run from the book.
  const scan = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return e.name === "vendor" || e.name === "node_modules" || e.name.startsWith(".") ? [] : scan(p);
      return /\.(json|js|mjs|html|css|md|txt|py|yml)$/.test(e.name) ? [p] : [];
    });
  const files = scan(ROOT);
  for (const f of files) {
    const hits = runs(fs.readFileSync(f, "utf8"), twelve, 12);
    if (hits.length) fail(`${path.relative(ROOT, f)} contains a 12-word run from the book`);
  }
  console.log(`Copyright scan: ${files.length} files checked for 12-word runs.`);
}

// ---------- Summary ----------
const byChapter = {};
for (const d of days) (byChapter[d.chapter] ||= []).push(d.ref + (d._words ? `(${d._words}w)` : ""));
console.log(`\nGita content: ${days.length} days across ${Object.keys(byChapter).length} chapters`);
for (const [c, refs] of Object.entries(byChapter)) console.log(`  Ch ${String(c).padStart(2)} (${refs.length}): ${refs.join(" ")}`);
const flagged = Object.entries(sanskrit).filter(([, v]) => v.needsVerification).map(([k]) => k);
console.log(`Sanskrit verses: ${Object.keys(sanskrit).length}; needsVerification: ${flagged.join(", ") || "none"}`);
const mine = days.flatMap((d) => d.thread.filter((t) => t.by === "mine")).length;
const his = days.flatMap((d) => d.thread.filter((t) => t.by === "his")).length;
console.log(`Thread segments: ${his} his, ${mine} mine`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}
console.log("\nAll content checks passed.");
