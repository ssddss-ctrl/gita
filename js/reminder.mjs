/* Daily reminders (Settings → Reminders): about 7:45 a.m. and 8 p.m. New York time.
   The phone makes a push subscription: its private delivery address. Saved once as the
   PUSH_SUBSCRIPTIONS secret in GitHub, it lets .github/workflows/reminder.yml send one
   alerts each day. Nothing about your progress is sent; the alerts are the same each day. */

// Public half of the signing key pair; the private half is the VAPID_PRIVATE_KEY secret.
const VAPID_PUBLIC_KEY =
  "BKPE77snthZN0nfvvSbspBEU1y0CNEcaKQ5vfisTZx3FiKm4EELjTAO4povMK_SQX9te30ZDezD4FMMBcA4rZI8";
const SECRETS_URL = "https://github.com/ssddss-ctrl/gita/settings/secrets/actions/new";

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[x],
  );
const supported = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
const standalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
const iOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent);

function keyBytes(base64url) {
  const b64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function currentSubscription() {
  if (!supported()) return null;
  const reg = await navigator.serviceWorker.getRegistration();
  return reg ? reg.pushManager.getSubscription() : null;
}

/** Fill the Settings section and wire its buttons. */
export async function mount(el) {
  const intro = "<h2>Reminders</h2><p>Two gentle alerts a day: about 7:45 a.m. and 8 p.m.</p>";
  if (iOS() && !standalone()) {
    el.innerHTML = `${intro}<p>On iPhone, reminders only work in the Home Screen app. In Safari, tap Share → Add to Home Screen, then open Gita from there.</p>`;
    return;
  }
  if (!supported()) {
    el.innerHTML = `${intro}<p>This browser can't show reminders.</p>`;
    return;
  }
  const existing = await currentSubscription().catch(() => null);
  if (existing) return showCode(el, existing);
  el.innerHTML = `${intro}<button class="g-btn" id="rem-on">Turn on reminders</button>
    <p class="g-status" id="rem-status" role="status"></p>`;
  el.querySelector("#rem-on").onclick = async () => {
    const status = el.querySelector("#rem-status");
    // Must run straight from the tap on iPhone.
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      status.textContent =
        "Reminders weren't allowed. You can change this in the phone's Settings → Notifications → Gita.";
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes(VAPID_PUBLIC_KEY),
      });
      showCode(el, sub);
    } catch {
      status.textContent = "Reminders couldn't be set up on this phone. Try again in a moment.";
    }
  };
}

function showCode(el, sub) {
  const code = JSON.stringify(sub);
  el.innerHTML = `<h2>Reminders</h2>
    <p>Reminders are allowed on this phone. One last step, done once: the reminder job needs this setup code.</p>
    <p>Copy it and send it to Claude in Claude Code, or save it yourself in <a href="${SECRETS_URL}" target="_blank" rel="noopener noreferrer">GitHub → New secret ↗</a> named <b>PUSH_SUBSCRIPTIONS</b>.</p>
    <p>Keep the code private: anyone with it can send alerts to this phone.</p>
    <textarea class="rem-code" id="rem-code" readonly rows="3">${esc(code)}</textarea>
    <button class="g-btn" id="rem-copy">Copy setup code</button> <button class="g-btn" id="rem-off">Turn off reminders</button>
    <p class="g-status" id="rem-status" role="status"></p>`;
  const status = el.querySelector("#rem-status");
  el.querySelector("#rem-copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      status.textContent = "Copied.";
    } catch {
      el.querySelector("#rem-code").select();
      status.textContent = "Select the code above and copy it.";
    }
  };
  el.querySelector("#rem-off").onclick = async () => {
    await sub.unsubscribe().catch(() => {});
    el.innerHTML = "<h2>Reminders</h2><p>Reminders are off on this phone.</p>";
  };
}
