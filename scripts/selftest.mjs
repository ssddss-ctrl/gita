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
const day1 = await stepThrough("day1", "Kurukshetra");
ok(day1.includes("The chapter"), "day 1 includes the chapter intro");
const progress = await page.evaluate(() => JSON.parse(localStorage.getItem("gita:progress")));
ok(progress.completed[1] && progress.nextDay === 2, "day 1 recorded as studied; next is day 2");
ok(progress.streak.count === 1, "streak is 1");
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
for (const [day, prefix] of [
  [2, "day2"],
  [3, "day3"],
  [60, "day60-ch11"],
]) {
  await page.goto(`${BASE}/gita/?dev=1#/day/${day}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const labels = await stepThrough(prefix, "Kurukshetra");
  if (day === 3) ok(labels.includes("The chapter"), "day 3 opens chapter 2 with its intro");
}
await page.goto(`${BASE}/gita/?dev=1#/day/60`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
ok((await count("#step canvas.cosmic")) === 1, "chapter 11 scene draws the cosmic light");
await shot("day60-scene");

// 4. Next morning: day 1 is due for recall before day 2.
await page.evaluate(() => {
  const p = JSON.parse(localStorage.getItem("gita:progress"));
  const y = new Date(Date.now() - 864e5);
  const iso = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  p.completed[1] = iso;
  p.streak.lastDate = iso;
  p.reviews[1].due = iso;
  localStorage.setItem("gita:progress", JSON.stringify(p));
});
await page.goto(`${BASE}/gita/?dev=1#/`, { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" }); // A new morning starts with a fresh page load.
ok((await text(".g-hero")).includes("Day 2 of 100"), "next morning: home offers day 2");
ok((await text(".g-meta")).includes("1 verse to recall"), "next morning: one verse to recall");
await page.goto(`${BASE}/gita/?dev=1#/session`, { waitUntil: "networkidle0" });
await page.click("#next");
await page.waitForSelector("#flip");
ok((await text("#step .step-label")) === "Recall", "recall comes right after the scene");
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
ok((await text("#kept")).length > 10, "settings says whether the book is kept permanently");
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
