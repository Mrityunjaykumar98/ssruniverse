/**
 * The site's public address, for the absolute URLs that link previews,
 * the sitemap and canonical tags need.
 *
 * NEXT_PUBLIC_SITE_URL wins when set. On Vercel the production domain is
 * provided automatically; the last fallback is the intended free domain.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://ssruniverse.vercel.app"),
);

export const siteName = "SSR Universe";
export const siteTitle = "SSR Universe — A Sushant Singh Rajput Tribute";
export const siteDescription =
  "An independent, fan-made tribute to Sushant Singh Rajput — his films, his music, and the curiosity he left behind.";
