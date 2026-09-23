/**
 * Reports whether each YouTube id will actually play inside an iframe.
 *
 * YouTube rejects embeds that arrive without a valid origin (Error 153), so
 * the frame has to be created from a real page — the local dev server. The
 * player then lives in its own out-of-process target, which CDP can attach to
 * and read even though it is cross-origin to the parent.
 *
 *   node check-embeds.mjs <id> [<id> ...]
 */
import { spawn } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Every id the site embeds, or just the ones named on the command line. */
async function siteIds() {
  const files = ["data/dreams.ts", "data/moments.ts", "data/songs.ts"];
  const ids = new Set();
  for (const f of files) {
    const src = await readFile(f, "utf8").catch(() => "");
    for (const m of src.matchAll(/"?youtubeId"?:\s*"([\w-]{11})"/g)) ids.add(m[1]);
  }
  return [...ids];
}

const IDS = process.argv.length > 2 ? process.argv.slice(2) : await siteIds();
if (!IDS.length) {
  console.error("no video ids found — run from the project root");
  process.exit(1);
}
console.log(`Checking ${IDS.length} embeds (dev server must be running)…`);

const PORT = 9981;
const profile = await mkdtemp(join(tmpdir(), "emb-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--no-sandbox", "--disable-gpu",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--window-size=900,600", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 80; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    if (r.ok) { wsUrl = (await r.json()).webSocketDebuggerUrl; break; }
  } catch {}
  await sleep(250);
}

const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
/** Sessions for every attached frame, parent and child alike. */
const sessions = new Set();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === "Target.attachedToTarget") sessions.add(m.params.sessionId);
  if (m.method === "Target.detachedFromTarget") sessions.delete(m.params.sessionId);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => {
    const msg = { id: ++id, method, params };
    if (sessionId) msg.sessionId = sessionId;
    pending.set(msg.id, resolve);
    ws.send(JSON.stringify(msg));
  });

const { result: created } = await send("Target.createTarget", { url: "about:blank" });
const { result: attached } = await send("Target.attachToTarget", {
  targetId: created.targetId, flatten: true,
});
const page = attached.sessionId;
await send("Page.enable", {}, page);
await send("Runtime.enable", {}, page);
// Attach to the player's own target as soon as the iframe creates it.
await send("Target.setAutoAttach",
  { autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, page);

// A real origin, so YouTube accepts the embed.
await send("Page.navigate", { url: "http://localhost:3000/" }, page);
await sleep(2500);

/** What YouTube shows instead of a playable film. */
const BLOCKERS = [
  [/discretion/i, "content warning"],
  [/confirm your age|age-restricted/i, "age restricted"],
  [/sign in to confirm/i, "sign-in required"],
  [/watch (this video )?on youtube/i, "embedding disabled"],
  [/playback on other websites/i, "embedding disabled"],
  [/video is unavailable|unavailable/i, "unavailable"],
  [/private video/i, "private"],
];

/** The real title, used to tell a rendered player from a refused one. */
async function realTitle(vid) {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent("https://www.youtube.com/watch?v=" + vid)}&format=json`);
    if (!r.ok) return null;
    return (await r.json()).title ?? null;
  } catch { return null; }
}

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const blocked = [];
for (const vid of IDS) {
  const title = await realTitle(vid);
  sessions.clear();
  await send("Runtime.evaluate", {
    expression: `(() => {
      document.querySelectorAll('#probe').forEach(n => n.remove());
      const f = document.createElement('iframe');
      f.id = 'probe';
      f.width = 640; f.height = 360;
      f.style.cssText = 'position:fixed;left:0;top:0;z-index:99999';
      f.src = 'https://www.youtube-nocookie.com/embed/${vid}?rel=0';
      document.body.appendChild(f);
    })()`,
  }, page);

  await sleep(3800);

  // Read whichever attached frame is the player.
  let text = "";
  for (const s of sessions) {
    const { result } = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(document.body && document.body.innerText || '').replace(/\\s+/g,' ').slice(0,400)`,
    }, s).catch(() => ({ result: {} }));
    const v = result?.result?.value;
    if (v && v.length > text.length) text = v;
  }

  const hit = BLOCKERS.find(([re]) => re.test(text));
  // A player that rendered shows its own title; one that refused does not.
  const showsTitle =
    title && norm(text).includes(norm(title).slice(0, 18));
  const reason = hit ? hit[1] : !showsTitle ? "player did not render" : null;

  if (reason) {
    blocked.push([vid, reason]);
    console.log(`  BLOCKED  ${vid}  ${reason.padEnd(22)} frame="${text.slice(0, 40)}"`);
  } else {
    console.log(`  ok       ${vid}  "${String(title).slice(0, 52)}"`);
  }
}

console.log(`\n${IDS.length - blocked.length}/${IDS.length} embeddable`);
if (blocked.length) {
  console.log("blocked:");
  for (const [v, why] of blocked) console.log(`  ${v}  ${why}`);
}

ws.close();
chrome.kill();
process.exit(0);
