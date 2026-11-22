# Bhagavad Gita

A daily 5–10 minute Bhagavad Gita practice with Swami Chinmayananda's *Holy Geeta*.
You learn one verse a day for 100 days, across all 18 chapters in book order.

**Open it:** https://ssddss-ctrl.github.io/gita/. On iPhone, tap Share → Add to Home Screen.

## A day's session

1. **Scene:** a painting of the setting (Kurukshetra, the chariot, the armies).
2. **Recall:** up to 3 earlier verses, spaced 1, 3, 7, 14 and 30 days apart.
3. **Chapter intro:** on the first day of a chapter.
4. **The thread:** his linking lines, or short bridges marked "not from the book".
5. **The verse:** Devanagari, IAST and his translation.
6. **In his words:** selected commentary, with the full commentary one tap away.
7. **Close:** the verse again, a star, your streak and the chapter map.

## How it works

- **The book stays on your phone.** On first open, choose your PDF. It's read on the device
  and kept in the browser's storage. This repo only holds pointers (chapter, verse and
  paragraph numbers), the public-domain Sanskrit, and short bridges written for the app.
- **Use it inside the Home Screen app.** iPhone gives each Home Screen app its own storage,
  so load the PDF there, not in a Safari tab.
- **Moving progress** (e.g. from the old room in the Morning Briefing app): Settings →
  Export progress on the old one, then Settings → Import progress here.
- **Scenes** need a free Cloudflare account once: see `worker/gita-scenes/README.md`.
  Without it, the app shows a gradient or a kept painting.

## For development

```sh
npm install          # dev tools only (PDF reader for scripts, headless Chrome driver)
npm run serve        # http://127.0.0.1:8765/gita/
npm test             # progress tests + content structure check (what CI runs)
npm run validate     # full content + copyright check (needs the PDF in ~/Documents/Gita_App)
SHOTS=/tmp/shots npm run selftest   # drives the app in headless Chrome
```

- Content is planned in `scripts/plan.mjs` and built into `content/days.json` by
  `scripts/build-content.mjs`.
- Every push to `main` runs `npm test` and publishes the app files to GitHub Pages
  (`.github/workflows/pages.yml`). `scripts/` and `worker/` are never published.
- See `CLAUDE.md` for the copyright and depiction rules and every judgement call.
