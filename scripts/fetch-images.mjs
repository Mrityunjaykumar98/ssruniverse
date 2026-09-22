/**
 * Pulls the site's photography from Wikimedia Commons.
 *
 * Only freely-licensed files are listed in MANIFEST. For each one the script
 * downloads a display-sized rendition into public/images/ and a 16px rendition
 * that is inlined as a blur placeholder, then writes data/credits.ts with the
 * licence and author every one of these files requires us to display.
 *
 * Re-run with:  pnpm images
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const UA = "SSRUniverse/0.1 (fan memorial site; mrityunjay.kumar@appknit.io)";
const OUT_DIR = join(process.cwd(), "public", "images");

/** `width` is the largest size the image is ever displayed at. */
const MANIFEST = [
  { slug: "hero-portrait",   file: "Sushant at IIFA 2017 (cropped).jpg", width: 1400 },
  { slug: "dreamer",         file: "Sushant Singh Rajput, IFFI 2017, Goa, India.jpg", width: 2000 },
  { slug: "actor",           file: "Sushant Singh Rajput 2017.jpg", width: 2000 },
  { slug: "masterclass",     file: "The Director Shekhar Kapur and Actor Sushant Singh Rajput at the Master Class, during the 48th International Film Festival of India (IFFI-2017), in Panaji, Goa on November 26, 2017.jpg", width: 1500 },
  { slug: "dhoni-promo",     file: "Sushant Singh Rajput snapped at the promotions of 'M.S. Dhoni - The Untold Story'.jpg", width: 585 },
  { slug: "filmfare-2016",   file: "Sushant SR Filmfare Style Awards 2016.jpg", width: 383 },
  { slug: "kai-po-che",      file: "Sushant Singh Rajput at KAI PO CHE's premiere (cropped).jpg", width: 222 },
  { slug: "wift",            file: "Sushant Singh Rajput at WIFT's felicitation.jpg", width: 233 },
  { slug: "signature",       file: "Sushant Singh Rajput Signature.svg", width: 400, original: true },
  { slug: "kedarnath",       file: "SSR & Sara Ali Khan in Kedarnath.jpg", width: 620 },
  { slug: "kai-po-che-premiere", file: "Sushant Singh Rajput with Ankita Lokhande at KAI PO CHE's premiere.jpg", width: 411 },
  { slug: "raabta",          file: "Sushant Kriti Raabta.jpg", width: 465 },
  { slug: "kangna-bash",     file: "Sushant at Kangna's birthday bash.jpg", width: 387 },
  // Public-domain deep-space plate used as the hero's ground. Its scattered
  // gold galaxies sit naturally with the site's accent colour.
  { slug: "cosmos",          file: "Hubble ultra deep field high rez edit1.jpg", width: 1900 },
];

const stripTags = (s = "") =>
  s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", ...params })}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status} for ${params.titles}`);
  return res.json();
}

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Download ${res.status} — ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** One API round-trip yields the metadata, the display rendition and the blur seed. */
async function resolve({ slug, file, width, original }) {
  const title = `File:${file}`;
  const [full, tiny] = await Promise.all([
    api({ action: "query", prop: "imageinfo", titles: title,
          iiprop: "url|extmetadata|size|mime", iiurlwidth: String(width) }),
    api({ action: "query", prop: "imageinfo", titles: title,
          iiprop: "url", iiurlwidth: "16" }),
  ]);

  const page = Object.values(full.query.pages)[0];
  if (page.missing !== undefined) throw new Error(`Not on Commons: ${title}`);
  const info = page.imageinfo[0];
  const meta = info.extmetadata ?? {};

  // SVGs are kept vector; everything else takes the resized rendition.
  const sourceUrl = original ? info.url : (info.thumburl ?? info.url);
  // Commons appends tracking params to thumb URLs, so read the extension
  // from the path only.
  const ext = new URL(sourceUrl).pathname.split(".").pop().toLowerCase();
  const filename = `${slug}.${ext}`;
  const bytes = await download(sourceUrl);
  await writeFile(join(OUT_DIR, filename), bytes);

  // A 16px-wide JPEG is small enough to inline and is all the blur-up needs.
  let blurDataURL = null;
  if (!original) {
    const seedUrl = Object.values(tiny.query.pages)[0].imageinfo[0].thumburl;
    const seed = await download(seedUrl);
    blurDataURL = `data:image/jpeg;base64,${seed.toString("base64")}`;
  }

  const ratio = info.thumbwidth
    ? { width: info.thumbwidth, height: info.thumbheight }
    : { width: info.width, height: info.height };

  console.log(`  ✓ ${filename.padEnd(22)} ${ratio.width}×${ratio.height}  ${stripTags(meta.LicenseShortName?.value)}`);

  return {
    slug,
    src: `/images/${filename}`,
    ...ratio,
    blurDataURL,
    author: stripTags(meta.Artist?.value) || "Unknown",
    license: stripTags(meta.LicenseShortName?.value) || "See source",
    licenseUrl: meta.LicenseUrl?.value ?? null,
    sourceUrl: info.descriptionurl,
  };
}

const banner = `// GENERATED by scripts/fetch-images.mjs — do not edit by hand.
// Every entry is a freely-licensed file from Wikimedia Commons. The author and
// licence fields are display obligations, not decoration: keep them rendered.
`;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Fetching ${MANIFEST.length} files from Wikimedia Commons…`);

  const credits = [];
  for (const entry of MANIFEST) {
    credits.push(await resolve(entry));
  }

  const body = credits
    .map((c) => `  ${JSON.stringify(c.slug)}: ${JSON.stringify(c, null, 2).replace(/\n/g, "\n  ")},`)
    .join("\n");

  await writeFile(
    join(process.cwd(), "data", "credits.ts"),
    `${banner}
export type Credit = {
  slug: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string | null;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourceUrl: string;
};

export const credits = {
${body}
} satisfies Record<string, Credit>;

export type CreditSlug = keyof typeof credits;
`,
  );

  console.log(`\nWrote data/credits.ts (${credits.length} entries).`);
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
