// Dev only: fetch the public-domain Sanskrit for every verse in content/days.json.
// Primary: IIT Kanpur Gita Supersite (heritage.iitk.ac.in/SBG). Check: the open
// vedicscriptures/bhagavad-gita-data dataset. Verses whose Devanagari differs between
// the two are kept but marked needsVerification. Run: node scripts/fetch-sanskrit.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { toIAST, splitVerse, comparable } from "./sanskrit.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "content/sanskrit.json");
const days = JSON.parse(fs.readFileSync(path.join(ROOT, "content/days.json"), "utf8")).days;
const existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")).verses : {};

const wanted = new Set();
for (const d of days) {
  d.verses.forEach((v) => wanted.add(`${d.chapter}.${v}`));
  if (d.close) wanted.add(`${d.close.c}.${d.close.v}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function supersite(ref) {
  const html = await (await fetch(`https://heritage.iitk.ac.in/SBG/${ref}`)).text();
  const m = html.match(/"@type":"Quotation".*?"text":"(.*?)","inLanguage":"sa-Deva"/s);
  if (!m) throw new Error("Supersite verse not found");
  return JSON.parse(`"${m[1]}"`);
}
async function dataset(ref) {
  const [c, v] = ref.split(".");
  const url = `https://raw.githubusercontent.com/vedicscriptures/bhagavad-gita-data/main/slok/bhagavadgita_chapter_${c}_slok_${v}.json`;
  return (await (await fetch(url)).json()).slok;
}

const verses = {};
for (const ref of [...wanted].sort((a, b) => a.split(".")[0] - b.split(".")[0] || a.split(".")[1] - b.split(".")[1])) {
  if (existing[ref] && !process.argv.includes("--refresh")) {
    verses[ref] = existing[ref];
    continue;
  }
  let primary = "";
  let check = "";
  try {
    primary = await supersite(ref);
  } catch {}
  try {
    check = await dataset(ref);
  } catch {}
  // A vowel sign straight after a virama is not valid Devanagari (a typo in the source);
  // in that case prefer the second source.
  const invalid = (t) => /्[\u093E-\u094C]/.test(t);
  const source = primary && !(invalid(primary) && check) ? primary : check || primary;
  if (!source) {
    console.log(`${ref}: no source found`);
    continue;
  }
  const { speaker, lines } = splitVerse(source);
  const verified = Boolean(primary && check && comparable(primary) === comparable(check));
  verses[ref] = {
    speaker,
    devanagari: lines,
    iast: lines.map(toIAST),
    speakerIAST: speaker ? toIAST(speaker) : "",
    source: source === primary ? "IIT Kanpur Gita Supersite" : "vedicscriptures/bhagavad-gita-data",
    ...(verified ? {} : { needsVerification: true }),
  };
  console.log(`${ref}: ${verified ? "verified" : "NEEDS VERIFICATION"} (${lines.length} lines)`);
  await sleep(400);
}

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      note: "Sanskrit verse text (public domain). Devanagari from the IIT Kanpur Gita Supersite, cross-checked against the vedicscriptures dataset; IAST generated from the Devanagari.",
      verses,
    },
    null,
    1,
  ) + "\n",
);
console.log(`Wrote ${Object.keys(verses).length} verses.`);
