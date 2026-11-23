/* English read-aloud with the browser's free Web Speech voices.
   Sanskrit is never spoken by a synthetic voice (see CLAUDE.md).

   iPhone needs care:
   - the first speak() must happen right inside the tap, so nothing async comes before it;
   - speak() straight after cancel() can be dropped, so we only cancel when something is playing,
     and then wait a moment before starting;
   - an utterance can be garbage-collected mid-sentence, so the current one is kept in `current`;
   - long paragraphs can stall, so text is read in sentence-sized pieces;
   - web speech is muted by the silent switch; the app tells the reader to turn the ringer on. */

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
let queue = [];
let onEnd = null;
let current = null; // Keeps the playing utterance alive (see above).
let run = 0; // Each speak() call gets a number, so late events from an old one are ignored.

export const supported = () => Boolean(synth);

/** How natural a voice sounds: iPhone's downloadable Premium voices first, then Enhanced. */
// Apple's novelty and older robotic voices, listed last so they are never picked by default.
const ROBOTIC =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;

export function quality(v) {
  const id = `${v.name} ${v.voiceURI}`;
  if (/premium|neural|natural/i.test(id)) return 2;
  if (/enhanced|siri/i.test(id)) return 1;
  if (ROBOTIC.test(v.name)) return -1;
  return 0;
}

/** English voices, the most natural first. */
export function englishVoices() {
  if (!synth) return [];
  return synth
    .getVoices()
    .filter((v) => /^en(-|_|$)/i.test(v.lang))
    .sort((a, b) => quality(b) - quality(a) || Number(b.default) - Number(a.default));
}

/** The voice to use: the one chosen in Settings, or else the most natural one installed. */
export function pickVoice(voiceName = "") {
  const voices = englishVoices();
  return voices.find((v) => v.name === voiceName) || voices[0] || null;
}

function finish() {
  const done = onEnd;
  onEnd = null;
  current = null;
  if (done) done();
}

export function stop() {
  run++;
  queue = [];
  if (synth && (synth.speaking || synth.pending)) synth.cancel();
  finish();
}

/** Split paragraphs into pieces of about one or two sentences (at most ~220 characters). */
export function pieces(paragraphs) {
  const out = [];
  for (const p of paragraphs) {
    const text = String(p || "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    let chunk = "";
    for (const sentence of text.match(/[^.!?;:]+[.!?;:]*["')\]]*\s*/g) || [text]) {
      if (chunk && (chunk + sentence).length > 220) {
        out.push(chunk.trim());
        chunk = "";
      }
      chunk += sentence;
    }
    if (chunk.trim()) out.push(chunk.trim());
  }
  return out;
}

/** Read the paragraphs one after another. Calls `ended` when finished, stopped or failed. */
export function speak(paragraphs, { voiceName = "", rate = 1 } = {}, ended = () => {}) {
  const wasPlaying = synth && (synth.speaking || synth.pending);
  stop();
  if (!synth) return ended();
  // Ask for media playback. (On current iPhones the silent switch still mutes web speech.)
  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch {}
  const mine = run;
  queue = pieces(paragraphs);
  onEnd = ended;
  const voice = pickVoice(voiceName);
  const next = () => {
    if (mine !== run) return;
    const text = queue.shift();
    if (!text) return finish();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    u.rate = rate;
    u.onend = next;
    u.onerror = (e) => {
      if (mine !== run || e.error === "interrupted" || e.error === "canceled") return;
      // Not allowed or no voice: stop cleanly so the button doesn't stay "on".
      if (e.error === "not-allowed" || e.error === "synthesis-unavailable") {
        queue = [];
        return finish();
      }
      next();
    };
    current = u;
    synth.speak(u);
  };
  // Starting right after a cancel can be dropped on Safari; otherwise start inside the tap.
  if (wasPlaying) setTimeout(next, 120);
  else next();
}

export const speaking = () => Boolean(onEnd);
