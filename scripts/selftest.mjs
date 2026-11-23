// Dev only: drive the Gita room in headless Chrome (puppeteer-core + installed Chrome).
// Loads the owner's PDF through the real file picker, then steps through Days 1-3, a
// Chapter 11 day, and a recall. Prints statuses only; screenshots go to the folder given
// in SHOTS (never into the repo, since they show book text).
// Usage: SHOTS=/some/tmp/dir node scripts/selftest.mjs   (starts scripts/serve.mjs on :8765)
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { pdfPath } from "./book-node.mjs";
import { serve } from "./serve.mjs";

const server = await serve(8765);
const BASE = "http://127.0.0.1:8765";
const SHOTS = process.env.SHOTS || "";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const errors = [];
const results = [];
const ok = (cond, label) => {
  results.push(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) process.exitCode = 1;
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 900000,
  args: ["--no-first-run"],
});
const page = await browser.newPage();
await page.setViewport({
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
page.on(
  "response",
  (r) => r.status() >= 400 && errors.push(`${r.status()} ${new URL(r.url()).pathname}`),
);
const shot = async (name) =>
  SHOTS && (await page.screenshot({ path: path.join(SHOTS, `${name}.png`) }));
const text = (sel) => page.$eval(sel, (el) => el.innerText).catch(() => "");
const count = (sel) => page.$$eval(sel, (els) => els.length);

// 1. First open: choose the PDF.
await page.goto(`${BASE}/gita/?dev=1`, { waitUntil: "networkidle0" });
ok((await text("main")).includes("Choose your copy"), "onboarding asks for the PDF");
const input = await page.$("#pdf");
await input.uploadFile(pdfPath());
const started = Date.now();
await page.waitForFunction(
  () =>
    /Ready\.|could not|does not look/.test(document.querySelector("#status")?.textContent || ""),
  { timeout: 600000 },
);
const status = await text("#status");
ok(
  /Ready\./.test(status),
  `PDF parsed on device in ${Math.round((Date.now() - started) / 1000)}s: ${status}`,
);
const match = status.match(/(\d+) of (\d+) passages/);
ok(match && match[1] === match[2], "every content pointer matches the browser's parse exactly");

// 2. Home and Day 1 (a real session that updates progress).
await page.goto(`${BASE}/gita/?dev=1#/`, { waitUntil: "networkidle0" });
ok((await text(".g-hero")).includes("Day 1 of 100"), "home shows Day 1 of 100");
await shot("01-home");

async function stepThrough(prefix, expectFirst) {
  const labels = [];
  for (let i = 0; i < 9; i++) {
    await page.waitForSelector("#step .step-label");
    const label = await text("#step .step-label");
    labels.push(label);
    const step = await page.$eval("#step", (el) => el.dataset.step);
    if (step === "thread") ok((await count("#step .thread p")) > 0, `${prefix}: thread has text`);
    if (step === "verse") {
      ok((await count("#step .sa-deva span")) >= 2, `${prefix}: Devanagari shown`);
      ok((await text("#step .translation")).length > 40, `${prefix}: his translation shown`);
      ok(
        await page.$eval("#step .chant", (b) => b.disabled),
        `${prefix}: chant button says coming soon`,
      );
    }
    if (step === "words") {
      ok((await count("#step .prose p")) > 0, `${prefix}: his commentary shown`);
      ok((await count("#step details.full .prose p")) > 0, `${prefix}: full commentary available`);
    }
    if (step === "life")
      ok(
        (await text("#step .thread.mine .by")).includes("not from the book") &&
          (await text("#step .thread.mine p")).length > 60,
        `${prefix}: daily-life note shown, marked not from the book`,
      );
    if (step === "intro")
      ok((await text("#step .prose")).length > 100, `${prefix}: chapter intro shown`);
    await shot(`${prefix}-${i}-${step}`);
    if (step === "close") break;
    await page.click("#next");
    await new Promise((r) => setTimeout(r, 250));
  }
  ok(labels[0] === expectFirst, `${prefix}: starts with ${expectFirst}`);
  return labels;
}

await page.goto(`${BASE}/gita/?dev=1#/session`, { waitUntil: "networkidle0" });
const day1 = await stepThrough("day1", "The chapter");
ok(day1.includes("The chapter"), "day 1 includes the chapter intro");
ok(day1.at(-2) === "In daily life", "the daily-life note comes just before the close");
const progress = await page.evaluate(() => JSON.parse(localStorage.getItem("gita:progress")));
ok(progress.completed[1] && progress.nextDay === 2, "day 1 recorded as studied; next is day 2");
ok(!/streak/i.test(await text("#step")), "no streak shown at the close");
ok((await count("#step .dot.kindle")) === 1 && (await text("#step .lit-note")).includes("lamp is lit"), "finishing a day lights its lamp on the map");
ok(
  (await page.$eval(".steps", (b) => b.getAttribute("aria-valuenow"))) === String(day1.length),
  "progress bar reports the current step",
);
ok(
  await page.evaluate(() => document.activeElement?.classList.contains("step-label")),
  "focus moves to each new step's title",
);
ok(/· Gita$/.test(await page.title()), "each view sets the page title");
await page.click("#star");
ok(
  (await page.evaluate(() => JSON.parse(localStorage.getItem("gita:progress")).starred)).includes(
    1,
  ),
  "star saved",
);
const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("gita:progress")));
ok(Boolean(saved.completed["1"]), "day 1 saved as completed");

// 3. Days 2 and 3 in preview (dev jump), plus a Chapter 11 day with the cosmic light.
for (const [day, prefix, first] of [
  [2, "day2", "The thread"],
  [3, "day3", "The chapter"],
  [60, "day60-ch11", "The thread"],
]) {
  await page.goto(`${BASE}/gita/?dev=1#/day/${day}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const labels = await stepThrough(prefix, first);
  if (day === 3) ok(labels.includes("The chapter"), "day 3 opens chapter 2 with its intro");
}
await page.goto(`${BASE}/gita/?dev=1#/day/60`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" }); // Same address as before: reload to start the day again.
await new Promise((r) => setTimeout(r, 600));
ok((await count("#step canvas.cosmic")) === 1, "chapter 11 scene draws the cosmic light");
ok(
  await page.$eval("#story-art .art-actions", (a) => getComputedStyle(a).display === "none"),
  "no Keep / Paint another without a painting of the day",
);
await shot("day60-scene");

// The painting is woven into the thread: a saved painting for day 2 sits above the story.
await page.evaluate(async () => {
  const c = Object.assign(document.createElement("canvas"), { width: 300, height: 200 });
  const g = c.getContext("2d");
  g.fillStyle = "#c98a3a";
  g.fillRect(0, 0, 300, 200);
  const blob = await new Promise((r) => c.toBlob(r, "image/png"));
  await new Promise((resolve, reject) => {
    const open = indexedDB.open("gita");
    open.onsuccess = () => {
      const tx = open.result.transaction("scenes", "readwrite");
      tx.objectStore("scenes").put({ blob, date: new Date().toISOString() }, 2);
      tx.oncomplete = () => (open.result.close(), resolve());
      tx.onerror = reject;
    };
    open.onerror = reject;
  });
});
await page.goto(`${BASE}/gita/?dev=1#/day/2`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 900));
ok(
  await page.$eval("#step", (s) => {
    const art = s.querySelector("#story-art");
    const label = s.querySelector(".step-label");
    return (
      s.dataset.step === "thread" &&
      art && !art.hidden &&
      Boolean(art.querySelector("img.scene-img.shown")) &&
      Boolean(art.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING)
    );
  }),
  "a painting sits at the top of the thread, above the story",
);
await shot("thread-painting");
await page.goto(`${BASE}/gita/?dev=1#/day/3`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 300));
await page.click("#next");
await new Promise((r) => setTimeout(r, 600));
ok(
  (await text("#step .step-label")) === "The thread" &&
    (await page.$eval("#story-art", (f) => f.hidden)),
  "with no painting, the thread has no empty picture space",
);
ok((await count("#step .scene-frame")) === 1 && (await count("[data-step='close'] .scene-frame")) === 0, "the painting lives only in the thread");

// 4. Next morning: day 1 is due for recall before day 2.
await page.evaluate(() => {
  const p = JSON.parse(localStorage.getItem("gita:progress"));
  const y = new Date(Date.now() - 864e5);
  const iso = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  p.completed[1] = iso;
  p.reviews[1].due = iso;
  localStorage.setItem("gita:progress", JSON.stringify(p));
});
await page.goto(`${BASE}/gita/?dev=1#/`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" }); // A new morning starts with a fresh page load.
ok((await text(".g-hero")).includes("Day 2 of 100"), "next morning: home offers day 2");
ok((await text(".g-meta")).includes("1 verse to recall"), "next morning: one verse to recall");
await page.goto(`${BASE}/gita/?dev=1#/session`, { waitUntil: "networkidle0" });
await page.waitForSelector("#flip");
ok((await text("#step .step-label")) === "Recall", "recall comes first when a verse is due");
ok(
  await page.$eval("#step", (s) => {
    const shown = (el) => el && getComputedStyle(el).display !== "none";
    return !shown(s.querySelector(".recall-back")) && !shown(s.querySelector(".grades"));
  }),
  "recall hides the answer and grades until the card is tapped",
);
await page.click("#flip");
await shot("recall-flipped");
await page.click('[data-grade="remembered"]');
const review = await page.evaluate(
  () => JSON.parse(localStorage.getItem("gita:progress")).reviews[1],
);
ok(review.step === 1, "Remembered moves day 1 up to the 3-day step");

// 5. It stands alone: no link out, and it can be installed to the Home Screen.
await page.goto(`${BASE}/gita/?dev=1#/`, { waitUntil: "networkidle0" });
ok(!(await text(".g-top")).includes("Briefing"), "home has no link to another app");
const installable = await page.evaluate(async () => {
  const m = await fetch(document.querySelector('link[rel="manifest"]').href).then((r) => r.json());
  const icons = await Promise.all(m.icons.map((i) => fetch(i.src).then((r) => r.ok)));
  const sw = await fetch("sw.js").then((r) => r.ok);
  return m.short_name === "Gita" && icons.every(Boolean) && sw;
});
ok(installable, "manifest, icons and offline worker are served");
await shot("home");

// 6. Other screens open without errors.
for (const view of ["verses", "memorize/1", "gallery", "settings", "recap"]) {
  await page.goto(`${BASE}/gita/?dev=1#/${view}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 300));
  ok((await text("main")).length > 20, `${view} screen renders`);
  await shot(`view-${view.replace("/", "-")}`);
}

// 7. The book is kept: Settings says so, and a cleared book shows the recovery screen.
await page.goto(`${BASE}/gita/?dev=1#/settings`, { waitUntil: "networkidle0" });
ok((await count(".g-top .g-icon")) === 0, "the Settings page has no link to itself");
ok((await text("#kept")).length > 10, "settings says whether the book is kept permanently");
ok(/7:45.*8 p\.m\./.test(await text("#reminder")), "settings offers the morning and evening reminders");
await page.evaluate(
  () =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open("gita");
      req.onsuccess = () => {
        const tx = req.result.transaction("kv", "readwrite");
        tx.objectStore("kv").delete("book");
        tx.oncomplete = () => (req.result.close(), resolve());
        tx.onerror = () => reject(tx.error);
      };
    }),
);
await page.goto(`${BASE}/gita/?dev=1#/`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" }); // A hash change alone doesn't reload.
ok(
  (await text("main")).includes("Your progress is safe"),
  "a cleared book asks for the PDF again and keeps progress",
);
await shot("recovery");

await browser.close();
server.close();
const real = errors.filter((e) => !/favicon|speechSynthesis|Failed to load resource/i.test(e));
ok(real.length === 0, `no page errors${real.length ? ": " + real.slice(0, 3).join(" | ") : ""}`);
console.log(results.join("\n"));
