# Gita scene painter (Cloudflare Worker)

Paints each day's Kurukshetra scene with FLUX.1 schnell on Cloudflare Workers AI's free
tier. The style prefix and the rule that Krishna's face is never shown are added here,
on the server. A passphrase protects your free quota.

## One-time setup (about 5 minutes)

1. Create a free account at https://dash.cloudflare.com/sign-up (no card needed).
2. In Terminal:
   ```sh
   cd ~/gita/worker/gita-scenes
   npx wrangler@3.114.17 login          # opens the browser; approve
   npx wrangler@3.114.17 secret put SCENE_PASSPHRASE   # type a passphrase you'll remember
   npx wrangler@3.114.17 deploy         # prints the address, e.g. https://gita-scenes.<you>.workers.dev
   ```
3. On your phone, in the Gita room: Settings → Scenes. Paste the address and the passphrase,
   then Save.

Free tier: Workers AI includes a daily allowance of free "neurons"; a painting uses a small
part of it. If the allowance runs out, the room shows a kept painting or a gradient instead.
