# The Sushant Universe

An independent, fan-made cinematic tribute to Sushant Singh Rajput—built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in a browser.

## Media and licensing

All photography is freely licensed and fetched from Wikimedia Commons by
`scripts/fetch-images.mjs`:

```bash
pnpm images
```

The script downloads display-sized renditions into `public/images/`, inlines a
16px blur placeholder, and writes `data/credits.ts` with the author and licence
for every file. Render photographs through `components/Photo.tsx` so that
attribution travels with the image — it is a licence obligation, not decoration.

The hero's deep-space plate is the public-domain Hubble Ultra Deep Field.

**Do not add images from wallpaper or pin-board sites.** Those aggregators do
not hold rights to what they host and cannot license it on. Anything new must be
public domain, Creative Commons, or licensed directly from the rights holder.

## Notes

- No database, authentication, or private fan submissions are included yet.
- Film, music, memory, dreamer, and timeline content is kept in `data/`.
- Media is designed to use verified official sources only; no copyrighted media is bundled with the repository.
