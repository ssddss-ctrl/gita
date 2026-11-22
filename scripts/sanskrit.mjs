// Devanagari helpers shared by the Sanskrit fetch script and the content validator.
// Sanskrit verse text is public domain.

const CONSONANTS = {
  क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ṅ", च: "c", छ: "ch", ज: "j", झ: "jh", ञ: "ñ",
  ट: "ṭ", ठ: "ṭh", ड: "ḍ", ढ: "ḍh", ण: "ṇ", त: "t", थ: "th", द: "d", ध: "dh", न: "n",
  प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y", र: "r", ल: "l", व: "v", श: "ś",
  ष: "ṣ", स: "s", ह: "h", ळ: "ḷ",
};
const VOWELS = { अ: "a", आ: "ā", इ: "i", ई: "ī", उ: "u", ऊ: "ū", ऋ: "ṛ", ॠ: "ṝ", ऌ: "ḷ", ए: "e", ऐ: "ai", ओ: "o", औ: "au" };
const SIGNS = { "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ", "ॢ": "ḷ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au" };
const OTHER = { "ं": "ṃ", "ः": "ḥ", "ँ": "m̐", "ऽ": "'", "।": "|", "॥": "||" };
const VIRAMA = "्";

/** Standard IAST from Devanagari (deterministic letter mapping). */
export function toIAST(text) {
  let out = "";
  const chars = [...text.normalize("NFC")];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (CONSONANTS[ch]) {
      out += CONSONANTS[ch];
      const next = chars[i + 1];
      if (next === VIRAMA) i++;
      else if (SIGNS[next]) {
        out += SIGNS[next];
        i++;
      } else out += "a";
    } else if (VOWELS[ch]) out += VOWELS[ch];
    else if (OTHER[ch] !== undefined) out += OTHER[ch];
    else if (ch === "़") continue; // nukta
    else out += ch;
  }
  return out;
}

const SPEAKER = /(?:उ|ु)वाच\s*[।|]*\s*$/; // "उवाच", or joined as in "भगवानुवाच"

/** Split a verse into its speaker line (if any) and verse lines without numbers. */
export function splitVerse(text) {
  const lines = text
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((l) => l.replace(/[।॥|]*\s*[0-9०-९]+\s*[.-]\s*[0-9०-९]+\s*[।॥|]*/g, "").trim())
    .filter(Boolean);
  let speaker = "";
  if (lines.length && SPEAKER.test(lines[0])) speaker = lines.shift().replace(/[।|\s]+$/, "");
  // End each half-verse with a danda, the last with a double danda.
  const verse = lines.map((l, i) => l.replace(/[।॥|\s]+$/, "") + (i === lines.length - 1 ? " ॥" : " ।"));
  return { speaker, lines: verse };
}

/** Letters only, for comparing two sources of the same verse. */
// Accepted spelling variants are made equal: a nasal letter + virama before a consonant
// is written as anusvara (सम्मूढ = संमूढ, सङ्गः = संगः), and invisible joiners are removed.
export function comparable(text) {
  return splitVerse(text)
    .lines.join("")
    .normalize("NFC")
    .replace(/[‌‍\s]/g, "") // joiners and word spacing (sources split words differently)
    .replace(/[ङञणनम]्(?=[क-ह])/g, "ं")
    .replace(/[^ऀ-ॿ]/g, "")
    .replace(/[।॥ऽ०-९]/g, "");
}
