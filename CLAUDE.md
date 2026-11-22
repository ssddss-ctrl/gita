# Bhagavad Gita app — project notes for Claude

The owner is not a software engineer: explain in plain language, keep code simple.
Use the `frontend-design` skill for any UI work.

## What it is

A 5–10 minute daily Gita practice, used mostly on the phone around 8:00 a.m., based
entirely on Swami Chinmayananda's *Holy Geeta*, taught from the perspective of Sanatana
Dharma. It does not connect verses to modern life. One new verse a day, ~100 key verses
across all 18 chapters in book order, always arriving with context (the thread). Reading
and listening only (optional memorize mode for starred verses). No reflection questions.

Daily flow: scene (~10 s) → recall (≤3 due verses, spaced 1/3/7/14/30 days) → chapter
intro (first day of a chapter) → thread (his linking lines / short "mine" bridges, marked)
→ verse (Devanagari, IAST, chant if licensed, his translation) → in his words (selected
commentary + full-commentary expander) → close (verse again, star, streak, chapter map).

### Firm rules

1. **Copyright.** Never copy the book's translation or commentary into any project file
   (JSON, JS, HTML, markdown, tests, commit messages), except anchor snippets of up to 8
   words used to locate a paragraph. Content files hold pointers only (chapter, verse,
   paragraph indices). The book is parsed on the owner's device from their own PDF and
   cached in IndexedDB; it never leaves the device and is never deployed. `*.pdf` is in
   `.gitignore`. Dev-script output that contains book text goes only in `.gita-dev/`
   (ignored) or the system scratch folder.
2. **Krishna is never shown face-on.** Only from behind, in silhouette, a hand on the
   reins, a peacock feather, or radiant light. Applies to every scene prompt.
3. **Scenes show the setting** (Kurukshetra, the chariot, the armies, Krishna's growing
   radiance), never an illustration of the verse's metaphor.
4. **Sanskrit audio** only from a freely licensed source with the license recorded; never
   AI text-to-speech for Sanskrit. Otherwise the chant button says "coming soon".
5. **"Mine" thread bridges** are written fresh from the Gita's narrative, never as
   paraphrases of his commentary, and are marked in the UI as not his.

### Hosting (since 2026-11-22)

A standalone static app in its own public repo (`ssddss-ctrl/gita`), published by
`.github/workflows/pages.yml` to https://ssddss-ctrl.github.io/gita/ with its own
manifest, icons and service worker (`sw.js`). It used to live inside the Morning Briefing
site (`morning-briefing/gita/`) and was split out with no link between the two apps.
The repo is public, so the copyright rule above matters doubly: the workflow runs the
structure check, and `npm run validate` (with the PDF) runs the full 12-word scan.

## Judgement calls log

- 2026-10-22: Briefing app path assumed to be `~/morning-briefing` (prompt placeholder unfilled).
- 2026-10-22: No earlier Gita code existed in `Documents/Gita_App`; only the PDF.
- 2026-10-22: Content lives in `content/`, not `data/`, because the site's
  service worker deliberately skips any path containing `/data/` (briefing data).
- 2026-10-22: Parser: verses are paragraphs in the book's bold verse font starting with a
  number (optionally after "X said:"/"says:"), accepted only in increasing order. Overlapping
  groups (1.20-21 then 1.21-22) and a few missing periods ("12 ...") are handled.
- 2026-10-22: Book numbering is kept everywhere. Chapter 13 has 35 verses in this edition
  (Arjuna's question is 13.1), so the must-include "13.27/13.28" is the book's 13.28.
  The Sanskrit sources use the same numbering.
- 2026-10-22: Chapters 3-18 verse picks (see scripts/plan.mjs `why` notes) follow the
  distribution table exactly. Pairs that share a day: 2.62-63, 3.1-2 (Arjuna's opening
  question + answer), 11.33-34 and 12.13-14 (the book comments on them together), 16.1-3
  (one list across three verses; a stretch of the "two verses" rule, chosen because the
  book's commentary treats it as one portrait of the divine nature).
- 2026-10-22: "In his words" for chapters 3-18 is chosen automatically: whole paragraphs of
  the day's commentary in book order, up to ~450 words (2-3 minutes). Chapter intros come
  from the opening of the chapter's first commentary (verse 1, or verse 2 when 1-2 are
  commented together); when that is the day's own verse, the intro takes one paragraph.
- 2026-10-22: Thread = my bridge over skipped verses (if any) + his ALL-CAPS linking line
  from the verse just before (if it exists). Days 4 and 12 also carry the commentary
  passages the owner specified (2.10 chariot allegory, 2.39 Sankhya-to-Yoga turn).
- 2026-10-22: Sanskrit: Devanagari from the IIT Kanpur Gita Supersite, checked against the
  vedicscriptures dataset after normalising accepted spelling variants (anusvara vs nasal
  letter, word spacing). Where the Supersite text has an invalid sequence (3.2, 14.26) the
  dataset text is used. IAST is generated from the Devanagari by a fixed mapping. Verses
  that still differ are marked needsVerification.
- 2026-10-22: Scene lines were checked against the "setting, not metaphor" rule; 16 of my
  first drafts (banyan tree, lamp, leaves and flowers, gate, three bands of light...) were
  rewritten as plain battlefield settings. The validator now blocks those metaphors.
- 2026-10-22: Chanting: no per-verse Sanskrit recitation with a clearly free license was
  found (the Supersite's audio is not openly licensed), so the chant button reads
  "Chanting · coming soon". The code plays `sanskrit.json` → `verses[ref].audio` if a
  licensed URL is ever added (record its source and license next to it).
- 2026-10-22: Memorize mode works without audio: words of the Devanagari disappear a few
  at a time; it loops the chant once one exists.
- 2026-10-22: Storage: progress and settings in localStorage (`gita:progress`,
  `gita:settings`); the parsed book, today's scene
  and the gallery in IndexedDB (`gita`). iPhone gives each Home Screen app separate
  storage. (Superseded 2026-11-22: the app now has its own manifest and Home Screen icon.)
- 2026-10-22: Scenes: the Worker builds the prompt server-side (fixed style prefix +
  day's setting + random time/angle/air + chapter radiance + the depiction rule). Image
  models follow negative instructions imperfectly, so every scene line also describes
  Krishna only from behind, as a silhouette, a hand, a feather or light.
- 2026-10-22: "Start generating during recall": generation starts when the session opens;
  the scene step shows a gradient until it arrives, and the close step shows the painting.
- 2026-10-22: Self-test (scripts/selftest.mjs): 52 checks pass, including all 200
  content pointers matching the browser's parse exactly. Copyright scan: 90 tracked text
  files vs 262,208 twelve-word runs from the book, 0 hits.
- 2026-11-22: Split out of Morning Briefing into this repo. App files moved to the repo
  root; dev scripts to `scripts/`; `scripts/serve.mjs` replaces the briefing's `serve.py`
  (serves the repo at `/gita/`, like Pages). The briefing card and `gita:summary` were
  removed. Progress moves to a new Home Screen app via Settings → Export / Import progress.
- 2026-11-22: Persistent storage requested (`navigator.storage.persist()`) at start and after
  each PDF import; a cleared book with saved progress shows a recovery screen.
- 2026-11-22: Morning reminder: own VAPID key pair (public key in `js/reminder.mjs`, private
  key in secret `VAPID_PRIVATE_KEY`); subscriptions in secret `PUSH_SUBSCRIPTIONS`;
  `reminder.yml` runs at 11:45 and 12:45 UTC and sends only when it's 7 a.m. in New York.
  The alert is the same every day because the workflow can't see progress on the phone.
