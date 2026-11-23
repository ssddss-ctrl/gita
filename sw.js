// Offline copy of the Gita app. Bump CACHE whenever the file list changes.
const CACHE = "gita-v7";
const STATIC = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./css/gita.css",
  "./css/fonts.css",
  "./js/app.mjs",
  "./js/book-store.mjs",
  "./js/book-parser.mjs",
  "./js/progress.mjs",
  "./js/speech.mjs",
  "./js/scene.mjs",
  "./js/reminder.mjs",
  "./content/days.json",
  "./content/sanskrit.json",
  "./content/daily-life.json",
  "./vendor/pdfjs/pdf.min.mjs",
  "./vendor/pdfjs/pdf.worker.min.mjs",
  "./fonts/EBGaramond-normal-latin.woff2",
  "./fonts/EBGaramond-italic-latin.woff2",
  "./fonts/EBGaramond-normal-latin-ext.woff2",
  "./fonts/EBGaramond-italic-latin-ext.woff2",
  "./fonts/NotoSerifDevanagari-normal-devanagari.woff2",
  "./fonts/NotoSerifDevanagari-normal-latin.woff2",
];
// GitHub Pages lets browsers reuse files for 10 minutes. Always revalidate instead,
// so a new version shows on the next open (unchanged files are a quick 304).
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(STATIC.map((url) => new Request(url, { cache: "reload" })))),
  );
});
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("gita-") && k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin || e.request.method !== "GET") return;
  if (!u.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then((response) => {
        if (response.ok) caches.open(CACHE).then((c) => c.put(e.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});

// The morning reminder, sent by .github/workflows/reminder.yml.
self.addEventListener("push", (e) => {
  let message = {};
  try {
    message = e.data ? e.data.json() : {};
  } catch {}
  e.waitUntil(
    self.registration.showNotification(message.title || "Hari Om", {
      body: message.body || "Today's verse is waiting.",
      icon: "icon-192.png",
      badge: "icon-192.png",
      tag: "gita-reminder",
      data: { url: self.registration.scope },
    }),
  );
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = self.registration.scope;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => c.url.startsWith(url));
      return open ? open.focus() : clients.openWindow(url);
    }),
  );
});
