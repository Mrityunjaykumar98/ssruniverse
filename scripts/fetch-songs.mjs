/**
 * Resolves every film soundtrack to official YouTube uploads.
 *
 * For each track it searches YouTube, reads the channel that owns each result,
 * keeps only channels on the label allowlist, then confirms the pick through
 * YouTube's oEmbed endpoint. Tracks with no official upload are dropped rather
 * than guessed at, so data/songs.ts only ever contains embeds we have verified.
 *
 * Re-run with:  pnpm songs
 */
import { readFile, writeFile } from "node:fs/promises";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

/** Channels that actually own this music. Matched case-insensitively. */
const LABELS = [
  "t-series", "sony music india", "sonymusicindiavevo", "yrf", "yash raj films",
  "zee music company", "saregama", "tips official", "tips films", "eros now",
  "times music", "universal music india", "junglee music", "shemaroo",
  "sony music south", "fox star", "netflix india", "speed records",
];

const FILM_YEARS = {
  "Kai Po Che!": "2013", "Shuddh Desi Romance": "2013", "PK": "2014",
  "Detective Byomkesh Bakshy!": "2015", "M.S. Dhoni: The Untold Story": "2016",
  "Raabta": "2017", "Kedarnath": "2018", "Sonchiriya": "2019",
  "Chhichhore": "2019", "Drive": "2019", "Dil Bechara": "2020",
};

/** The Dhoni soundtrack article also lists the Tamil, Telugu and Marathi dubs. */
const LIMITS = { "M.S. Dhoni: The Untold Story": 7 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchYouTube(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25_000) });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const html = await res.text();

  // Split on result boundaries and read each block, rather than trying to
  // span them with one regex.
  const results = [];
  for (const block of html.split('"videoRenderer":').slice(1)) {
    const head = block.slice(0, 4000);
    const id = head.match(/^\{"videoId":"([\w-]{11})"/);
    const channel = head.match(/"ownerText":\{"runs":\[\{"text":"([^"]+)"/)
      ?? head.match(/"longBylineText":\{"runs":\[\{"text":"([^"]+)"/);
    const title = head.match(/"title":\{"runs":\[\{"text":"([^"]+)"/);
    if (id && channel) {
      results.push({ id: id[1], channel: channel[1], title: title ? title[1] : "" });
    }
  }
  return results;
}

async function oembed(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15_000) });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

/**
 * Flattens transliteration differences so "Manjha" and "Manja", or
 * "Shubhaarambh" and "Shubarambh", compare equal: drop everything that is not
 * a letter, drop the aspirating h, then collapse doubled letters.
 */
const normalise = (s) =>
  s.toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/h/g, "")
    .replace(/(.)+/g, "$1");

const isLabel = (channel) => LABELS.some((l) => channel.toLowerCase().includes(l));

async function attempt(film, track, query) {
  let hits = [];
  for (let i = 1; i <= 3 && hits.length === 0; i++) {
    try {
      hits = await searchYouTube(query);
    } catch {
      await sleep(1500 * i);
    }
  }

  // YouTube reorders results between runs, so scan a wide window of official
  // hits rather than just the top few.
  const official = hits.filter((h) => isLabel(h.channel));
  for (const hit of official.slice(0, 8)) {
    const meta = await oembed(hit.id);
    // The video title must mention the song, or search drifted onto another
    // track. Compared through normalise() because Hindi transliteration
    // varies between sources: Wikipedia writes "Manjha", the label "Manja".
    if (meta && normalise(meta.title).includes(normalise(track.title))) {
      return {
        title: track.title,
        film,
        year: FILM_YEARS[film],
        youtubeId: hit.id,
        source: meta.author_name,
        singers: track.singers,
      };
    }
  }
  return null;
}

/** Two phrasings, because one wording alone misses a handful of tracks. */
async function resolve(film, track) {
  for (const query of [
    `${track.title} ${film} full song official`,
    `${track.title} ${film} song`,
  ]) {
    const hit = await attempt(film, track, query);
    if (hit) return hit;
    await sleep(300);
  }
  return null;
}

async function main() {
  const lists = JSON.parse(await readFile("tracklists.tmp.json", "utf8"));
  const found = [];
  const missing = [];

  for (const [film, tracks] of Object.entries(lists)) {
    const capped = LIMITS[film] ? tracks.slice(0, LIMITS[film]) : tracks;
    console.log(`\n${film}`);
    for (const track of capped) {
      const song = await resolve(film, track);
      if (song) {
        found.push(song);
        console.log(`  ✓ ${song.title.padEnd(28)} ${song.source}`);
      } else {
        missing.push(`${film} — ${track.title}`);
        console.log(`  · ${track.title.padEnd(28)} no official upload found`);
      }
      await sleep(400); // be polite
    }
  }

  const banner = `// GENERATED by scripts/fetch-songs.mjs — do not edit by hand.
// Every id was resolved from an official label channel and then confirmed
// through YouTube's oEmbed endpoint. Tracks without a verified official
// upload are omitted rather than guessed.
`;

  await writeFile(
    "data/songs.ts",
    `${banner}
export type Song = {
  title: string;
  film: string;
  year: string;
  youtubeId: string;
  /** The channel that owns the upload, shown beside the track. */
  source: string;
  singers: string;
};

export const songs: Song[] = ${JSON.stringify(found, null, 2)};

/** YouTube's own thumbnail for a video; hotlinked, never re-hosted. */
export const songArtwork = (id: string) => \`https://img.youtube.com/vi/\${id}/hqdefault.jpg\`;

/** Track lists grouped by film, in release order. */
export const songsByFilm = songs.reduce<Record<string, Song[]>>((acc, s) => {
  (acc[s.film] ??= []).push(s);
  return acc;
}, {});
`,
  );

  console.log(`\n${found.length} verified, ${missing.length} dropped`);
  if (missing.length) console.log(missing.map((m) => `  · ${m}`).join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
