// Paints the day's Kurukshetra scene for the Gita room.
// The fixed style prefix and the rules are added here, on the server, so the page
// can't leave them out: Krishna's face is never shown. A passphrase (a Worker secret)
// keeps strangers from using up the free quota. No API token is needed: the AI binding
// is part of the Worker.
const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const STYLE =
  "Painterly digital art, ancient India, the Mahabharata, Kurukshetra battlefield, warm golds and deep blues, soft volumetric light, cinematic wide composition, epic and reverent mood, highly detailed";
const RULES =
  "Every person is a small dark backlit silhouette seen from behind, facing away toward the horizon; the charioteer is a silhouette from behind, his hand on the reins; no text, no letters, no watermark, no modern objects.";

const clean = (value, max = 300) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);

async function samePassphrase(given, expected) {
  // Compare digests so the check takes the same time whatever is typed.
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(given)), crypto.subtle.digest("SHA-256", enc.encode(expected))]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export function buildPrompt(body) {
  return `${STYLE}. ${clean(body.scene)}, ${clean(body.variation, 120)}, ${clean(body.radiance, 160)}. ${RULES}`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim());
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Passphrase",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    if (!allowed.includes(origin)) return new Response("Forbidden", { status: 403, headers: cors });
    const pass = request.headers.get("X-Passphrase") || "";
    if (!env.SCENE_PASSPHRASE || !(await samePassphrase(pass, env.SCENE_PASSPHRASE)))
      return new Response("Unauthorized", { status: 401, headers: cors });
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad request", { status: 400, headers: cors });
    }
    if (!clean(body.scene)) return new Response("Missing scene", { status: 400, headers: cors });
    try {
      const result = await env.AI.run(MODEL, { prompt: buildPrompt(body), steps: 6 });
      const bytes = Uint8Array.from(atob(result.image), (c) => c.charCodeAt(0));
      return new Response(bytes, { headers: { ...cors, "Content-Type": "image/jpeg", "Cache-Control": "no-store" } });
    } catch {
      return new Response("The painting could not be made right now.", { status: 502, headers: cors });
    }
  },
};
